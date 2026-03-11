from fastapi import FastAPI, APIRouter, HTTPException, UploadFile, File, Form
from fastapi.responses import FileResponse
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict, EmailStr
from typing import List, Optional
import uuid
from datetime import datetime, timezone
import shutil

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# File storage directory
UPLOAD_DIR = ROOT_DIR / "uploads"
UPLOAD_DIR.mkdir(exist_ok=True)

app = FastAPI()
api_router = APIRouter(prefix="/api")

# ==================== MODELS ====================

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

# ==================== ADMIN AUTH ====================
ADMIN_USERNAME = os.environ.get('ADMIN_USERNAME', 'admin')
ADMIN_PASSWORD = os.environ.get('ADMIN_PASSWORD', 'schand2024')

class AdminLogin(BaseModel):
    username: str
    password: str

@api_router.post("/admin/login")
async def admin_login(credentials: AdminLogin):
    if credentials.username == ADMIN_USERNAME and credentials.password == ADMIN_PASSWORD:
        return {"success": True, "message": "Login successful"}
    raise HTTPException(status_code=401, detail="Invalid credentials")

# ==================== LEAD ROUTES ====================

@api_router.post("/leads", response_model=Lead)
async def create_lead(lead: LeadCreate):
    lead_obj = Lead(**lead.model_dump())
    doc = lead_obj.model_dump()
    doc['created_at'] = doc['created_at'].isoformat()
    await db.leads.insert_one(doc)
    return lead_obj

@api_router.get("/leads", response_model=List[Lead])
async def get_leads():
    leads = await db.leads.find({}, {"_id": 0}).sort("created_at", -1).to_list(1000)
    for lead in leads:
        if isinstance(lead['created_at'], str):
            lead['created_at'] = datetime.fromisoformat(lead['created_at'])
    return leads

@api_router.delete("/leads/{lead_id}")
async def delete_lead(lead_id: str):
    result = await db.leads.delete_one({"id": lead_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Lead not found")
    return {"success": True}

# ==================== FILE UPLOAD ROUTES ====================

@api_router.post("/files/upload")
async def upload_file(
    file: UploadFile = File(...),
    dataset_category: str = Form(...),
    description: str = Form(None),
    is_sample: bool = Form(True)
):
    file_id = str(uuid.uuid4())
    file_ext = Path(file.filename).suffix.lower()
    
    if file_ext not in ['.csv', '.pdf', '.json', '.xlsx']:
        raise HTTPException(status_code=400, detail="Only CSV, PDF, JSON, and XLSX files allowed")
    
    new_filename = f"{file_id}{file_ext}"
    file_path = UPLOAD_DIR / new_filename
    
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
    
    file_size = os.path.getsize(file_path)
    
    file_doc = DatasetFile(
        id=file_id,
        filename=new_filename,
        original_filename=file.filename,
        file_type=file_ext[1:],
        file_size=file_size,
        dataset_category=dataset_category,
        description=description,
        is_sample=is_sample
    )
    
    doc = file_doc.model_dump()
    doc['created_at'] = doc['created_at'].isoformat()
    await db.dataset_files.insert_one(doc)
    
    return file_doc

@api_router.get("/files", response_model=List[DatasetFile])
async def get_files():
    files = await db.dataset_files.find({}, {"_id": 0}).sort("created_at", -1).to_list(1000)
    for f in files:
        if isinstance(f['created_at'], str):
            f['created_at'] = datetime.fromisoformat(f['created_at'])
    return files

@api_router.get("/files/{file_id}/download")
async def download_file(file_id: str):
    file_doc = await db.dataset_files.find_one({"id": file_id}, {"_id": 0})
    if not file_doc:
        raise HTTPException(status_code=404, detail="File not found")
    
    file_path = UPLOAD_DIR / file_doc['filename']
    if not file_path.exists():
        raise HTTPException(status_code=404, detail="File not found on disk")
    
    await db.dataset_files.update_one(
        {"id": file_id},
        {"$inc": {"download_count": 1}}
    )
    
    return FileResponse(
        path=str(file_path),
        filename=file_doc['original_filename'],
        media_type='application/octet-stream'
    )

@api_router.delete("/files/{file_id}")
async def delete_file(file_id: str):
    file_doc = await db.dataset_files.find_one({"id": file_id}, {"_id": 0})
    if not file_doc:
        raise HTTPException(status_code=404, detail="File not found")
    
    file_path = UPLOAD_DIR / file_doc['filename']
    if file_path.exists():
        os.remove(file_path)
    
    await db.dataset_files.delete_one({"id": file_id})
    return {"success": True}

@api_router.get("/files/category/{category}", response_model=List[DatasetFile])
async def get_files_by_category(category: str):
    files = await db.dataset_files.find(
        {"dataset_category": category, "is_sample": True},
        {"_id": 0}
    ).to_list(100)
    for f in files:
        if isinstance(f['created_at'], str):
            f['created_at'] = datetime.fromisoformat(f['created_at'])
    return files

# ==================== DATASET ROUTES ====================

@api_router.post("/datasets", response_model=Dataset)
async def create_dataset(dataset: DatasetCreate):
    dataset_obj = Dataset(**dataset.model_dump())
    doc = dataset_obj.model_dump()
    doc['created_at'] = doc['created_at'].isoformat()
    await db.datasets.insert_one(doc)
    return dataset_obj

@api_router.get("/datasets", response_model=List[Dataset])
async def get_datasets():
    datasets = await db.datasets.find({}, {"_id": 0}).to_list(100)
    for d in datasets:
        if isinstance(d['created_at'], str):
            d['created_at'] = datetime.fromisoformat(d['created_at'])
    return datasets

@api_router.get("/datasets/{slug}")
async def get_dataset_by_slug(slug: str):
    dataset = await db.datasets.find_one({"slug": slug}, {"_id": 0})
    if not dataset:
        raise HTTPException(status_code=404, detail="Dataset not found")
    if isinstance(dataset['created_at'], str):
        dataset['created_at'] = datetime.fromisoformat(dataset['created_at'])
    return dataset

@api_router.delete("/datasets/{dataset_id}")
async def delete_dataset(dataset_id: str):
    result = await db.datasets.delete_one({"id": dataset_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Dataset not found")
    return {"success": True}

# ==================== STATS ROUTES ====================

@api_router.get("/stats")
async def get_stats():
    leads_count = await db.leads.count_documents({})
    files_count = await db.dataset_files.count_documents({})
    downloads = await db.dataset_files.aggregate([
        {"$group": {"_id": None, "total": {"$sum": "$download_count"}}}
    ]).to_list(1)
    total_downloads = downloads[0]['total'] if downloads else 0
    
    return {
        "leads_count": leads_count,
        "files_count": files_count,
        "total_downloads": total_downloads
    }

# ==================== ROOT ====================

@api_router.get("/")
async def root():
    return {"message": "S Chand AI Infrastructure API"}

@api_router.get("/health")
async def health():
    return {"status": "healthy"}

# Include router and middleware
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
