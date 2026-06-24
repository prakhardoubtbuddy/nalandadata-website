"""
S Chand AI Infrastructure API — server.py
Performance & memory-leak fixes applied. See inline comments for each fix.
"""

# ── LOGGING SETUP (moved to top) ──────────────────────────────────────────────
# FIX-1: logging.basicConfig() was at the bottom of the file (line 301), AFTER all
# route-handler functions were defined. That meant the module-level `logger` variable
# was not available anywhere in the handlers — it was always NameError if ever used.
# Moving it here so every subsequent function can call logger.info/error/warning.
import logging

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
)
logger = logging.getLogger(__name__)

# ── STANDARD IMPORTS ───────────────────────────────────────────────────────────
import asyncio
import json
import os
import shutil
import time
import uuid
from contextlib import asynccontextmanager
from datetime import datetime, timezone
from pathlib import Path
from typing import Any, Dict, List, Optional

import httpx

from dotenv import load_dotenv
from fastapi import FastAPI, APIRouter, BackgroundTasks, HTTPException, UploadFile, File, Form
from fastapi.responses import FileResponse
from motor.motor_asyncio import AsyncIOMotorClient
from pydantic import BaseModel, Field, ConfigDict, EmailStr
from starlette.middleware.cors import CORSMiddleware

# ── CONFIGURATION ──────────────────────────────────────────────────────────────
ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / ".env")

MONGO_URL = os.environ["MONGO_URL"]
DB_NAME   = os.environ["DB_NAME"]

UPLOAD_DIR = ROOT_DIR / "uploads"
UPLOAD_DIR.mkdir(exist_ok=True)

# FIX-2a: Added configurable file-size cap (default 50 MB) to prevent a single
# upload from exhausting disk / RAM.  Set MAX_UPLOAD_SIZE_MB in .env to override.
MAX_UPLOAD_SIZE_MB = int(os.environ.get("MAX_UPLOAD_SIZE_MB", "50"))
MAX_UPLOAD_SIZE    = MAX_UPLOAD_SIZE_MB * 1024 * 1024

RESEND_API_KEY   = os.environ.get("RESEND_API_KEY", "")
LEAD_NOTIFY_FROM = os.environ.get("LEAD_NOTIFY_FROM", "community@doubtbuddy.in")
LEAD_NOTIFY_TO   = ["tech@nalandadata.ai", "gaurav@nalandadata.ai"]

# ── MONGODB CLIENT ─────────────────────────────────────────────────────────────
# FIX-3: The original client was created with zero tuning:
#   client = AsyncIOMotorClient(mongo_url)
#
# Problems that caused:
#   • No maxPoolSize   → pool could grow to 100 (motor default) under bursty load,
#     holding 100 open sockets and their associated kernel buffers.
#   • No maxIdleTimeMS → idle sockets are never reaped; stale TCP connections
#     accumulate and eventually the kernel's FIN_WAIT/CLOSE_WAIT buckets fill up.
#   • No serverSelectionTimeoutMS → if MongoDB is temporarily unreachable every
#     request hangs for 30 s (driver default), blocking the event loop and queuing
#     all subsequent requests in memory until they all pile up.
#   • No socketTimeoutMS → a single slow query holds its connection forever, so
#     under sustained load you can exhaust the pool with stuck queries.
#
# Fix: explicit, conservative pool settings suitable for a single-instance server.
# Increase maxPoolSize if you run multiple uvicorn workers or see pool-exhaustion
# warnings in the logs.
client = AsyncIOMotorClient(
    MONGO_URL,
    # Keep at most 10 live connections; each costs ~1 MB of kernel socket buffers.
    maxPoolSize=10,
    # Keep 1 warm connection so the first request after an idle period is fast.
    minPoolSize=1,
    # Return idle sockets to OS after 30 s.  Prevents leaked sockets from piling
    # up after traffic spikes.
    maxIdleTimeMS=30_000,
    # Fail fast (5 s) rather than blocking the event loop for 30 s when MongoDB
    # is temporarily unreachable.
    serverSelectionTimeoutMS=5_000,
    # Give up on a network connect after 5 s.
    connectTimeoutMS=5_000,
    # Give up on waiting for a server response after 10 s.  Combined with
    # maxPoolSize this bounds the worst-case memory held by in-flight queries.
    socketTimeoutMS=10_000,
    # Motor retries idempotent writes/reads once on network blips; avoids
    # unnecessary 500 errors on transient failures.
    retryWrites=True,
    retryReads=True,
)
db = client[DB_NAME]


# ── INDEX CREATION ─────────────────────────────────────────────────────────────
# FIX-4: No indexes were ever created.  Without them every lookup by `id` or
# `slug` is a full collection scan (O(n) CPU + cursor memory).  The sort on
# `created_at` also required an in-memory sort of the entire result set.
#
# These are background indexes so they do not block requests during creation and
# are idempotent — safe to call every time the server starts.
async def create_indexes() -> None:
    logger.info("Ensuring MongoDB indexes …")
    try:
        # leads — looked up by id (DELETE), listed sorted by created_at (GET)
        await db.leads.create_index("id", unique=True, background=True)
        await db.leads.create_index([("created_at", -1)], background=True)

        # dataset_files — looked up by id (GET/DELETE), filtered by category+is_sample,
        # listed sorted by created_at
        await db.dataset_files.create_index("id", unique=True, background=True)
        await db.dataset_files.create_index([("created_at", -1)], background=True)
        await db.dataset_files.create_index(
            [("dataset_category", 1), ("is_sample", 1)], background=True
        )

        # datasets — looked up by slug (GET detail) and by id (DELETE)
        await db.datasets.create_index("slug", unique=True, background=True)
        await db.datasets.create_index("id", unique=True, background=True)

        # blog_posts — looked up by slug (GET), by id (PUT/DELETE), filtered by published
        await db.blog_posts.create_index("slug", unique=True, background=True)
        await db.blog_posts.create_index("id", unique=True, background=True)
        await db.blog_posts.create_index(
            [("published", 1), ("published_at", -1)], background=True
        )

        logger.info("MongoDB indexes ready.")
    except Exception as exc:
        # Non-fatal: log and continue.  Indexes will be rebuilt on next start.
        logger.error("Index creation failed: %s", exc)


# ── LIFESPAN (replaces deprecated @app.on_event) ───────────────────────────────
# FIX-5: The original code used the deprecated @app.on_event("shutdown") hook and
# had *no* startup hook at all.  FastAPI 0.93+ deprecates on_event in favour of
# the lifespan context manager, which:
#   • Runs startup logic before the server accepts requests.
#   • Guarantees cleanup even on SIGTERM / unhandled exceptions.
#   • Is the recommended pattern going forward.
@asynccontextmanager
async def lifespan(app: FastAPI):
    # ── startup ────────────────────────────────────────────────────────────────
    logger.info("Server starting up …")
    await create_indexes()
    yield
    # ── shutdown ───────────────────────────────────────────────────────────────
    # Close the connection pool so the OS can reclaim socket file-descriptors
    # and the MongoDB server can clean up its side of each connection.
    logger.info("Closing MongoDB connection pool …")
    client.close()
    logger.info("Server shut down cleanly.")


# ── APPLICATION ────────────────────────────────────────────────────────────────
app        = FastAPI(lifespan=lifespan)
api_router = APIRouter(prefix="/api")


# ── MODELS ─────────────────────────────────────────────────────────────────────

class Lead(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    full_name: str
    work_email: EmailStr
    company: str
    role: str
    company_type: str
    use_case: str
    dataset_interest: str
    message: Optional[str] = None
    mobile_country_code: str
    mobile_number: str
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class LeadCreate(BaseModel):
    full_name: str
    work_email: EmailStr
    company: str
    role: str
    company_type: str
    use_case: str
    dataset_interest: str
    message: Optional[str] = None
    mobile_country_code: str
    mobile_number: str

class DatasetFile(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    filename: str
    original_filename: str
    file_type: str
    file_size: int
    dataset_category: str
    description: Optional[str] = None
    is_sample: bool = True
    download_count: int = 0
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class Dataset(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    slug: str
    category: str
    description: str
    overview: str
    use_cases: List[str]
    structure: List[dict]
    stats: dict
    sample_data: List[dict]
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class DatasetCreate(BaseModel):
    name: str
    slug: str
    category: str
    description: str
    overview: str
    use_cases: List[str]
    structure: List[dict]
    stats: dict
    sample_data: List[dict]


class BlogPost(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    title: str
    slug: str
    excerpt: str
    content: str
    tags: List[str] = []
    category: str = "Research"
    author: str = "Nalanda Data Team"
    published: bool = False
    published_at: Optional[datetime] = None
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    cover_image: Optional[str] = None
    hf_model_ref: Optional[str] = None

class BlogPostCreate(BaseModel):
    title: str
    slug: str
    excerpt: str
    content: str
    tags: List[str] = []
    category: str = "Research"
    author: str = "Nalanda Data Team"
    published: bool = False
    cover_image: Optional[str] = None
    hf_model_ref: Optional[str] = None

class BlogPostUpdate(BaseModel):
    title: Optional[str] = None
    slug: Optional[str] = None
    excerpt: Optional[str] = None
    content: Optional[str] = None
    tags: Optional[List[str]] = None
    category: Optional[str] = None
    author: Optional[str] = None
    published: Optional[bool] = None
    cover_image: Optional[str] = None
    hf_model_ref: Optional[str] = None


# ── HELPERS ────────────────────────────────────────────────────────────────────

def _coerce_datetime(doc: dict, field: str = "created_at") -> dict:
    """
    FIX-6: The original code stored created_at as an ISO-8601 *string* by calling
    .isoformat() before every insert, then on every read it checked
    isinstance(..., str) and called datetime.fromisoformat() to convert back.

    Motor stores Python `datetime` objects natively as BSON Date — no conversion
    is needed.  The old approach wasted CPU on string ↔ datetime round-trips on
    every single read and write path.

    Going forward, new documents are stored as datetime objects (see inserts below).
    This helper keeps backward-compat for *legacy* documents already in the
    collection that have a string created_at, so existing data is not broken.
    """
    if isinstance(doc.get(field), str):
        doc[field] = datetime.fromisoformat(doc[field])
    return doc


def _coerce_blog_datetimes(doc: dict) -> dict:
    for field in ("created_at", "updated_at", "published_at"):
        if doc.get(field) is not None:
            _coerce_datetime(doc, field)
    return doc


def _safe_file_path(filename: str) -> Path:
    """
    FIX-7: Path-traversal guard.  Although we generate filenames ourselves
    (uuid + extension), an attacker who can influence the stored filename (e.g.
    via a compromised DB record) could supply '../../../etc/passwd'.  Resolving
    the full path and confirming it stays inside UPLOAD_DIR defends against this.
    """
    path = (UPLOAD_DIR / filename).resolve()
    if not str(path).startswith(str(UPLOAD_DIR.resolve())):
        logger.warning("Path traversal attempt blocked: %s", filename)
        raise HTTPException(status_code=400, detail="Invalid file path")
    return path


async def _write_upload_to_disk(upload: UploadFile, dest: Path) -> None:
    """
    FIX-8: The original handler used synchronous open() + shutil.copyfileobj()
    inside an async function.  Synchronous file I/O blocks the entire uvicorn
    event loop for the duration of the write; during that time *no other request*
    can be processed, causing response-time degradation and request queue growth
    that directly translates to memory growth.

    asyncio.to_thread() offloads the blocking I/O to a thread-pool worker, freeing
    the event loop to handle other requests concurrently.  No new dependency is
    needed — asyncio.to_thread is part of the Python 3.9+ stdlib.

    shutil.copyfileobj uses a 16 KB internal buffer so memory usage during the
    copy is bounded regardless of file size.
    """
    def _sync_write() -> None:
        with open(dest, "wb") as buf:
            shutil.copyfileobj(upload.file, buf)

    await asyncio.to_thread(_sync_write)


# ── ADMIN AUTH ─────────────────────────────────────────────────────────────────
ADMIN_USERNAME = os.environ.get("ADMIN_USERNAME", "admin")
ADMIN_PASSWORD = os.environ.get("ADMIN_PASSWORD", "schand2024")

class AdminLogin(BaseModel):
    username: str
    password: str

@api_router.post("/admin/login")
async def admin_login(credentials: AdminLogin):
    if credentials.username == ADMIN_USERNAME and credentials.password == ADMIN_PASSWORD:
        return {"success": True, "message": "Login successful"}
    raise HTTPException(status_code=401, detail="Invalid credentials")


# ── LEAD ROUTES ────────────────────────────────────────────────────────────────

def _send_lead_email_sync(lead: "Lead") -> None:
    if not RESEND_API_KEY:
        logger.warning("RESEND_API_KEY not configured — skipping lead notification email")
        return

    subject = f"New Lead: {lead.full_name} from {lead.company}"
    body = f"""New lead submitted on Nalanda Data:

Name:           {lead.full_name}
Email:          {lead.work_email}
Company:        {lead.company}
Role:           {lead.role}
Company Type:   {lead.company_type}
Use Case:       {lead.use_case}
Dataset:        {lead.dataset_interest}
Mobile:         {lead.mobile_country_code} {lead.mobile_number}
Message:        {lead.message or '—'}
Submitted at:   {lead.created_at.strftime('%Y-%m-%d %H:%M UTC')}
"""
    payload = {
        "from": LEAD_NOTIFY_FROM,
        "to": LEAD_NOTIFY_TO,
        "subject": subject,
        "text": body,
    }
    try:
        response = httpx.post(
            "https://api.resend.com/emails",
            headers={"Authorization": f"Bearer {RESEND_API_KEY}", "Content-Type": "application/json"},
            json=payload,
            timeout=15,
        )
        if response.status_code == 200:
            logger.info("Lead notification email sent for %s", lead.work_email)
        else:
            logger.error("Resend error %s: %s", response.status_code, response.text)
    except Exception as exc:
        logger.error("Failed to send lead notification email: %s", exc)


@api_router.post("/leads", response_model=Lead)
async def create_lead(lead: LeadCreate, background_tasks: BackgroundTasks):
    lead_obj = Lead(**lead.model_dump())
    doc = lead_obj.model_dump()
    # FIX-6 (write side): store created_at as a native datetime, not a string.
    # Motor serialises Python datetime → BSON Date automatically.
    # (No .isoformat() call here — removed.)
    try:
        await db.leads.insert_one(doc)
    except Exception as exc:
        logger.error("Failed to insert lead: %s", exc)
        raise HTTPException(status_code=500, detail="Failed to save lead")
    logger.info("New lead created: id=%s email=%s", lead_obj.id, lead_obj.work_email)
    background_tasks.add_task(_send_lead_email_sync, lead_obj)
    return lead_obj

@api_router.get("/leads", response_model=List[Lead])
async def get_leads():
    try:
        leads = await db.leads.find({}, {"_id": 0}).sort("created_at", -1).to_list(1000)
    except Exception as exc:
        logger.error("Failed to fetch leads: %s", exc)
        raise HTTPException(status_code=500, detail="Failed to fetch leads")
    # FIX-6 (read side): keep backward-compat for legacy string-stored dates.
    return [_coerce_datetime(lead) for lead in leads]

@api_router.delete("/leads/{lead_id}")
async def delete_lead(lead_id: str):
    try:
        result = await db.leads.delete_one({"id": lead_id})
    except Exception as exc:
        logger.error("Failed to delete lead %s: %s", lead_id, exc)
        raise HTTPException(status_code=500, detail="Failed to delete lead")
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Lead not found")
    logger.info("Lead deleted: id=%s", lead_id)
    return {"success": True}


# ── FILE UPLOAD ROUTES ─────────────────────────────────────────────────────────

@api_router.post("/files/upload")
async def upload_file(
    file: UploadFile = File(...),
    dataset_category: str = Form(...),
    description: str = Form(None),
    is_sample: bool = Form(True),
):
    file_id  = str(uuid.uuid4())
    file_ext = Path(file.filename).suffix.lower()

    if file_ext not in {".csv", ".pdf", ".json", ".xlsx"}:
        raise HTTPException(
            status_code=400,
            detail="Only CSV, PDF, JSON, and XLSX files are allowed",
        )

    new_filename = f"{file_id}{file_ext}"
    # FIX-7: validate the generated path is within UPLOAD_DIR.
    file_path = _safe_file_path(new_filename)

    try:
        # FIX-8: non-blocking async write (see _write_upload_to_disk docstring).
        await _write_upload_to_disk(file, file_path)

        file_size = os.path.getsize(file_path)

        # FIX-2b: enforce the size cap *after* writing so we have the exact byte
        # count.  If over the limit, delete the file and return 413.
        if file_size > MAX_UPLOAD_SIZE:
            raise HTTPException(
                status_code=413,
                detail=f"File exceeds the {MAX_UPLOAD_SIZE_MB} MB upload limit",
            )

        file_doc = DatasetFile(
            id=file_id,
            filename=new_filename,
            original_filename=file.filename,
            file_type=file_ext[1:],
            file_size=file_size,
            dataset_category=dataset_category,
            description=description,
            is_sample=is_sample,
        )

        doc = file_doc.model_dump()
        # FIX-6 (write side): store as native datetime, not a string.
        await db.dataset_files.insert_one(doc)

    except HTTPException:
        # FIX-9: clean up the orphaned file on *any* error path — whether it's
        # our own 413 rejection or an unexpected DB failure.  Without this, every
        # failed upload leaves a stray file on disk that accumulates indefinitely.
        file_path.unlink(missing_ok=True)
        raise
    except Exception as exc:
        file_path.unlink(missing_ok=True)
        logger.error("File upload failed (id=%s): %s", file_id, exc)
        raise HTTPException(status_code=500, detail="Upload failed")

    logger.info("File uploaded: id=%s name=%s size=%d", file_id, file.filename, file_size)
    return file_doc


@api_router.get("/files", response_model=List[DatasetFile])
async def get_files():
    try:
        files = (
            await db.dataset_files.find({}, {"_id": 0})
            .sort("created_at", -1)
            .to_list(1000)
        )
    except Exception as exc:
        logger.error("Failed to fetch files: %s", exc)
        raise HTTPException(status_code=500, detail="Failed to fetch files")
    return [_coerce_datetime(f) for f in files]  # FIX-6


@api_router.get("/files/{file_id}/download")
async def download_file(file_id: str):
    try:
        file_doc = await db.dataset_files.find_one({"id": file_id}, {"_id": 0})
    except Exception as exc:
        logger.error("DB error fetching file %s: %s", file_id, exc)
        raise HTTPException(status_code=500, detail="Database error")

    if not file_doc:
        raise HTTPException(status_code=404, detail="File not found")

    # FIX-7: validate path before serving.
    file_path = _safe_file_path(file_doc["filename"])
    if not file_path.exists():
        raise HTTPException(status_code=404, detail="File not found on disk")

    try:
        await db.dataset_files.update_one(
            {"id": file_id}, {"$inc": {"download_count": 1}}
        )
    except Exception as exc:
        # Non-fatal: the download still proceeds even if the counter update fails.
        logger.warning("Could not increment download_count for %s: %s", file_id, exc)

    logger.info("File downloaded: id=%s", file_id)
    return FileResponse(
        path=str(file_path),
        filename=file_doc["original_filename"],
        media_type="application/octet-stream",
    )


@api_router.delete("/files/{file_id}")
async def delete_file(file_id: str):
    try:
        file_doc = await db.dataset_files.find_one({"id": file_id}, {"_id": 0})
    except Exception as exc:
        logger.error("DB error fetching file %s: %s", file_id, exc)
        raise HTTPException(status_code=500, detail="Database error")

    if not file_doc:
        raise HTTPException(status_code=404, detail="File not found")

    # FIX-9b: delete the DB record first; if that succeeds, delete the file.
    # The original order was reversed — if the DB delete succeeded but the file
    # delete crashed, the file record was gone but the file remained (and
    # vice-versa).  Deleting from DB first means that in the worst case we leave
    # an orphaned file on disk (which can be cleaned up) rather than a DB record
    # pointing at a missing file (which causes 404s on every subsequent lookup).
    try:
        await db.dataset_files.delete_one({"id": file_id})
    except Exception as exc:
        logger.error("Failed to delete file record %s: %s", file_id, exc)
        raise HTTPException(status_code=500, detail="Failed to delete file record")

    file_path = _safe_file_path(file_doc["filename"])  # FIX-7
    if file_path.exists():
        try:
            os.remove(file_path)
        except OSError as exc:
            # Non-fatal: the DB record is already gone.  Log and continue.
            logger.warning("Could not remove file from disk (id=%s): %s", file_id, exc)

    logger.info("File deleted: id=%s", file_id)
    return {"success": True}


@api_router.get("/files/category/{category}", response_model=List[DatasetFile])
async def get_files_by_category(category: str):
    try:
        files = await db.dataset_files.find(
            {"dataset_category": category, "is_sample": True}, {"_id": 0}
        ).to_list(100)
    except Exception as exc:
        logger.error("Failed to fetch files for category %s: %s", category, exc)
        raise HTTPException(status_code=500, detail="Failed to fetch files")
    return [_coerce_datetime(f) for f in files]  # FIX-6


# ── DATASET ROUTES ─────────────────────────────────────────────────────────────

@api_router.post("/datasets", response_model=Dataset)
async def create_dataset(dataset: DatasetCreate):
    dataset_obj = Dataset(**dataset.model_dump())
    doc = dataset_obj.model_dump()
    # FIX-6: store as native datetime.
    try:
        await db.datasets.insert_one(doc)
    except Exception as exc:
        logger.error("Failed to insert dataset: %s", exc)
        raise HTTPException(status_code=500, detail="Failed to save dataset")
    logger.info("Dataset created: slug=%s", dataset_obj.slug)
    return dataset_obj

@api_router.get("/datasets", response_model=List[Dataset])
async def get_datasets():
    try:
        datasets = await db.datasets.find({}, {"_id": 0}).to_list(100)
    except Exception as exc:
        logger.error("Failed to fetch datasets: %s", exc)
        raise HTTPException(status_code=500, detail="Failed to fetch datasets")
    return [_coerce_datetime(d) for d in datasets]  # FIX-6

@api_router.get("/datasets/{slug}")
async def get_dataset_by_slug(slug: str):
    try:
        dataset = await db.datasets.find_one({"slug": slug}, {"_id": 0})
    except Exception as exc:
        logger.error("Failed to fetch dataset %s: %s", slug, exc)
        raise HTTPException(status_code=500, detail="Database error")
    if not dataset:
        raise HTTPException(status_code=404, detail="Dataset not found")
    return _coerce_datetime(dataset)  # FIX-6

@api_router.delete("/datasets/{dataset_id}")
async def delete_dataset(dataset_id: str):
    try:
        result = await db.datasets.delete_one({"id": dataset_id})
    except Exception as exc:
        logger.error("Failed to delete dataset %s: %s", dataset_id, exc)
        raise HTTPException(status_code=500, detail="Failed to delete dataset")
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Dataset not found")
    logger.info("Dataset deleted: id=%s", dataset_id)
    return {"success": True}


# ── HUGGING FACE PROXY ────────────────────────────────────────────────────────

HF_MODEL_ID   = "Nalandadata/nalanda-qwen-7b-grpo"
HF_DATASET_ID = "Nalandadata/NalandaJEENEETBench"
DRISHTI_DATASET_ID = "Nalandadata/DrishtiTable"  # holds benchmark/leaderboard.jsonl
HF_TOKEN = os.environ.get("HF_TOKEN", "")  # needed for gated repos (e.g. DrishtiTable)
_hf_cache: Dict[str, Any] = {}
HF_CACHE_TTL = 600  # 10 minutes


async def _fetch_hf(url: str, cache_key: str) -> dict:
    now = time.monotonic()
    if cache_key in _hf_cache:
        data, ts = _hf_cache[cache_key]
        if now - ts < HF_CACHE_TTL:
            return data
    try:
        async with httpx.AsyncClient(timeout=10.0) as client:
            r = await client.get(url, headers={"User-Agent": "nalandadata-website/1.0"})
            r.raise_for_status()
            data = r.json()
    except Exception as exc:
        logger.warning("HF API fetch failed (%s): %s", url, exc)
        if cache_key in _hf_cache:
            return _hf_cache[cache_key][0]  # serve stale on error
        raise HTTPException(status_code=502, detail="Failed to reach Hugging Face API")
    _hf_cache[cache_key] = (data, now)
    return data


@api_router.get("/hf/model")
async def get_hf_model():
    raw = await _fetch_hf(
        f"https://huggingface.co/api/models/{HF_MODEL_ID}", "hf_model"
    )
    card = raw.get("cardData") or {}
    return {
        "type": "model",
        "name": raw.get("modelId", HF_MODEL_ID),
        "description": card.get("model_description") or "",
        "downloads": raw.get("downloads", 0),
        "likes": raw.get("likes", 0),
        "tags": raw.get("tags", []),
        "last_modified": raw.get("lastModified", ""),
        "url": f"https://huggingface.co/{HF_MODEL_ID}",
    }


@api_router.get("/hf/dataset")
async def get_hf_dataset():
    raw = await _fetch_hf(
        f"https://huggingface.co/api/datasets/{HF_DATASET_ID}", "hf_dataset"
    )
    card = raw.get("cardData") or {}
    return {
        "type": "dataset",
        "name": raw.get("id", HF_DATASET_ID),
        "description": card.get("pretty_name") or card.get("dataset_summary") or "",
        "downloads": raw.get("downloads", 0),
        "likes": raw.get("likes", 0),
        "tags": raw.get("tags", []),
        "last_modified": raw.get("lastModified", ""),
        "url": f"https://huggingface.co/datasets/{HF_DATASET_ID}",
    }


@api_router.get("/hf/leaderboard")
async def get_hf_leaderboard():
    """Live DrishtiTable leaderboard, fetched from leaderboard.jsonl on the HF dataset.
    Cached 10 min; serves stale on error. Used by the public /benchmarks page to
    keep the leaderboard auto-synced with Hugging Face."""
    now = time.monotonic()
    cache_key = "hf_leaderboard"
    if cache_key in _hf_cache:
        data, ts = _hf_cache[cache_key]
        if now - ts < HF_CACHE_TTL:
            return data
    url = f"https://huggingface.co/datasets/{DRISHTI_DATASET_ID}/resolve/main/benchmark/leaderboard.jsonl"
    headers = {"User-Agent": "nalandadata-website/1.0"}
    if HF_TOKEN:
        headers["Authorization"] = f"Bearer {HF_TOKEN}"
    try:
        async with httpx.AsyncClient(timeout=10.0, follow_redirects=True) as client:
            r = await client.get(url, headers=headers)
            r.raise_for_status()
            rows = []
            for line in r.text.splitlines():
                line = line.strip()
                if not line:
                    continue
                try:
                    rows.append(json.loads(line))
                except json.JSONDecodeError:
                    continue
    except Exception as exc:
        logger.warning("HF leaderboard fetch failed: %s", exc)
        if cache_key in _hf_cache:
            return _hf_cache[cache_key][0]  # serve stale
        raise HTTPException(status_code=502, detail="Failed to reach Hugging Face")

    # Keep only the fields the frontend needs; sort by TEDS desc
    clean = [
        {
            "model": x.get("model"),
            "org": x.get("org"),
            "method": x.get("method"),
            "category": x.get("category"),
            "teds": x.get("teds"),
            "steds": x.get("steds"),
            "n_samples": x.get("n_samples"),
            "verified": x.get("verified", False),
        }
        for x in rows if x.get("teds") is not None
    ]
    clean.sort(key=lambda r: r["teds"], reverse=True)
    result = {
        "source": f"https://huggingface.co/datasets/{DRISHTI_DATASET_ID}",
        "count": len(clean),
        "rows": clean,
    }
    _hf_cache[cache_key] = (result, now)
    return result


# ── BLOG ROUTES ────────────────────────────────────────────────────────────────

@api_router.get("/blog/all", response_model=List[BlogPost])
async def get_all_blog_posts():
    """Admin: all posts including drafts, sorted newest first."""
    try:
        posts = await db.blog_posts.find({}, {"_id": 0}).sort("created_at", -1).to_list(200)
    except Exception as exc:
        logger.error("Failed to fetch blog posts: %s", exc)
        raise HTTPException(status_code=500, detail="Failed to fetch blog posts")
    return [_coerce_blog_datetimes(p) for p in posts]


@api_router.get("/blog", response_model=List[BlogPost])
async def get_blog_posts():
    """Public: published posts only, sorted newest first."""
    try:
        posts = await db.blog_posts.find(
            {"published": True}, {"_id": 0}
        ).sort("published_at", -1).to_list(100)
    except Exception as exc:
        logger.error("Failed to fetch blog posts: %s", exc)
        raise HTTPException(status_code=500, detail="Failed to fetch blog posts")
    return [_coerce_blog_datetimes(p) for p in posts]


@api_router.get("/blog/{slug}", response_model=BlogPost)
async def get_blog_post(slug: str):
    try:
        post = await db.blog_posts.find_one({"slug": slug, "published": True}, {"_id": 0})
    except Exception as exc:
        logger.error("Failed to fetch blog post %s: %s", slug, exc)
        raise HTTPException(status_code=500, detail="Database error")
    if not post:
        raise HTTPException(status_code=404, detail="Post not found")
    return _coerce_blog_datetimes(post)


@api_router.post("/blog", response_model=BlogPost)
async def create_blog_post(post: BlogPostCreate):
    post_obj = BlogPost(**post.model_dump())
    if post_obj.published:
        post_obj.published_at = datetime.now(timezone.utc)
    doc = post_obj.model_dump()
    try:
        await db.blog_posts.insert_one(doc)
    except Exception as exc:
        logger.error("Failed to create blog post: %s", exc)
        raise HTTPException(status_code=500, detail="Failed to save blog post")
    logger.info("Blog post created: slug=%s", post_obj.slug)
    return post_obj


@api_router.put("/blog/{post_id}", response_model=BlogPost)
async def update_blog_post(post_id: str, update: BlogPostUpdate):
    try:
        existing = await db.blog_posts.find_one({"id": post_id}, {"_id": 0})
    except Exception as exc:
        logger.error("DB error fetching blog post %s: %s", post_id, exc)
        raise HTTPException(status_code=500, detail="Database error")
    if not existing:
        raise HTTPException(status_code=404, detail="Post not found")

    updates = update.model_dump(exclude_none=True)
    updates["updated_at"] = datetime.now(timezone.utc)
    if updates.get("published") and not existing.get("published_at"):
        updates["published_at"] = datetime.now(timezone.utc)

    try:
        await db.blog_posts.update_one({"id": post_id}, {"$set": updates})
        post = await db.blog_posts.find_one({"id": post_id}, {"_id": 0})
    except Exception as exc:
        logger.error("Failed to update blog post %s: %s", post_id, exc)
        raise HTTPException(status_code=500, detail="Failed to update blog post")
    return _coerce_blog_datetimes(post)


@api_router.delete("/blog/{post_id}")
async def delete_blog_post(post_id: str):
    try:
        result = await db.blog_posts.delete_one({"id": post_id})
    except Exception as exc:
        logger.error("Failed to delete blog post %s: %s", post_id, exc)
        raise HTTPException(status_code=500, detail="Failed to delete blog post")
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Post not found")
    logger.info("Blog post deleted: id=%s", post_id)
    return {"success": True}


# ── STATS ROUTE ────────────────────────────────────────────────────────────────

@api_router.get("/stats")
async def get_stats():
    """
    FIX-10: The original implementation ran three MongoDB operations sequentially:
        leads_count  = await ...
        files_count  = await ...
        downloads    = await ...

    Each await yields to the event loop only after the previous query finishes, so
    total latency = t_leads + t_files + t_downloads.  Under sustained traffic this
    endpoint is called frequently (admin dashboard) and the extra latency keeps DB
    connections checked out for longer, consuming pool slots.

    asyncio.gather() dispatches all three coroutines simultaneously and waits for
    the slowest one.  Total latency ≈ max(t_leads, t_files, t_downloads).
    """
    try:
        leads_count, files_count, downloads = await asyncio.gather(
            db.leads.count_documents({}),
            db.dataset_files.count_documents({}),
            db.dataset_files.aggregate(
                [{"$group": {"_id": None, "total": {"$sum": "$download_count"}}}]
            ).to_list(1),
        )
    except Exception as exc:
        logger.error("Failed to fetch stats: %s", exc)
        raise HTTPException(status_code=500, detail="Failed to fetch stats")

    total_downloads = downloads[0]["total"] if downloads else 0
    return {
        "leads_count": leads_count,
        "files_count": files_count,
        "total_downloads": total_downloads,
    }


# ── ROOT / HEALTH ──────────────────────────────────────────────────────────────

@api_router.get("/")
async def root():
    return {"message": "S Chand AI Infrastructure API"}

@api_router.get("/health")
async def health():
    return {"status": "healthy"}


# ── ROUTER + MIDDLEWARE ────────────────────────────────────────────────────────
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get("CORS_ORIGINS", "*").split(","),
    allow_methods=["*"],
    allow_headers=["*"],
)
