# Project Handoff — Nalandadata Website + Benchmark Releases

> Continuity doc so work can resume in a fresh chat. Covers local paths, deploy
> flow, the HF live-sync architecture, and a step-by-step recipe to release the
> NEXT dataset/benchmark.

_Last updated: 2026-06-25. Website HEAD: see `git log` (was 90860d2 / ec72e6b on droplet)._

---

## 1. LOCAL FOLDERS (on this machine)

| What | Local path | Git remote |
|---|---|---|
| **Website repo** (frontend + backend + deploy) | `C:\Users\prakh\Downloads\nalandadata-website` | `github.com/prakhardoubtbuddy/nalandadata-website` |
| **TSR dataset repo** (DrishtiTable research project) | `C:\Users\prakh\Downloads\tsr_dataset-main\tsr_dataset-main` | `github.com/nishu12345678/tsr_dataset` |
| Mockups | `C:\Users\prakh\Downloads\drishtitable-mockup-v2.html` (+ v1) | — |

**Droplet (production):** repo at `/root/schand`, remote = `prakhardoubtbuddy/nalandadata-website` (SSH `git@github-website:`). Live files served from `/var/www/nalandadata/static-pages/` (static) and `/var/www/nalandadata/frontend/build/` (React + JS assets).

---

## 2. ARCHITECTURE (see ROUTING.md for full detail)

- **Public pages = static HTML** in `deploy/static-pages/` → nginx `location =` routes.
- **`/admin` = React app** (`frontend/`) → the one place React is right.
- **Backend = FastAPI + MongoDB** (`backend/server.py`), runs as systemd `nalanda-backend` on `127.0.0.1:8001`, proxied at `/api/`.
- **Strict CSP** on the site → all interactivity must be **external JS, no inline `onclick`/`style=`**.
- **Live HF sync:** backend endpoints fetch gated HF files using `HF_TOKEN` (in `backend/.env`), cached 10 min, stale-on-error.

### Live HF endpoints (backend/server.py)
| Endpoint | Pulls from HF |
|---|---|
| `/api/hf/leaderboard` | `Nalandadata/DrishtiTable` → `benchmark/leaderboard.jsonl` |
| `/api/hf/composition` | `Nalandadata/DrishtiTable` → `benchmark/composition.json` |
| `/api/hf/nalandabench-leaderboard` | `Nalandadata/NalandaJEENEETBench` → `benchmark/leaderboard.jsonl` |
| `/api/hf/model`, `/api/hf/dataset` | model/dataset stats |

---

## 3. KEY FILES (deploy/)

**static-pages/** — homepage, research, **benchmarks** (multi-benchmark tab page), about, solutions, contact, drishtitable (case study), nalandabench, nalanda-image-vl

**assets/** (copied to build dir on deploy; served at site root):
- `bench-tabs.js` — benchmark tab switching + recognition-viewer step tabs + Full/Test composition toggle
- `bench-sync.js` — live-sync leaderboard table + TEDS/S-TEDS bars + composition charts + NalandaBench table (DrishtiTable benchmark panel)
- `bench-leaderboard.js` — progressive enhancement: ranked/sortable/filterable leaderboard (#/Org cols, filter pills, search)
- `cs-sync.js` — live-sync for the `/research/drishtitable` case-study page
- `drishti-page.js` — (standalone research-page variant; not currently the live route)
- `menu.js` — mobile hamburger nav (all pages)
- `examples/drishti-ex-financial.png` — real table image used in the recognition viewer
- favicons, logo-mark.svg, site.webmanifest

**scripts:**
- `deploy.sh` — full deploy (regenerates fallback from HF, copies static-pages + assets, patches nginx, gates on `nginx -t`)
- `regen_fallback.py` — pulls live HF leaderboard → rewrites hardcoded fallback rows/bars in benchmarks.html (run at deploy; prevents drift)

**Docs:** `ROUTING.md` (architecture map), `QA_FINDINGS.md` (QA audit + resolved data issues), this `HANDOFF.md`.

---

## 4. DEPLOY FLOW (how every change reached production)

Because the droplet auth differs from the local machine, deploys went:
1. Edit files locally in `Downloads/nalandadata-website`, commit.
2. `git format-patch -1 HEAD --stdout > ~/x.patch` (add `--binary` for images).
3. `gh gist create ~/x.patch` → get raw URL.
4. **On droplet:** `cd /root/schand && curl -fsSL "<raw_url>" -o /tmp/x.patch && git am /tmp/x.patch && cp <files to /var/www/...> && sudo systemctl reload nginx && git push origin main`
5. Backend changes also need: `sudo systemctl restart nalanda-backend`.
6. Delete the temp gist after.

**Asset locations on droplet:**
- static page → `/var/www/nalandadata/static-pages/<page>.html`
- JS/image asset → `/var/www/nalandadata/frontend/build/<file>` (or `/examples/<file>`)

---

## 5. CURRENT STATE — DrishtiTable benchmark (DONE)

`/benchmarks` page, **DrishtiTable tab** = full mockup-v2 design, all real + live-synced:
- Leaderboard (11 models): **8B 84.89 (research) #1, 7B 83.2 (released) #2**, frontier below
- Feature cards (4), TEDS + S-TEDS bars, composition (Full/Test toggle)
- Per-type TEDS table (8B + 7B + frontier; our Financial win 82.0+ vs 53–67)
- Methodology (4 steps), **real recognition viewer** (TEDS 1.000 ledger example), data-access cards
- NalandaBench V1 tab preserved (live-synced too)

**HF source files (the single source of truth — edit these to update the site):**
- `Nalandadata/DrishtiTable` → `benchmark/leaderboard.jsonl` (11 rows), `benchmark/composition.json`
- `Nalandadata/NalandaJEENEETBench` → `benchmark/leaderboard.jsonl` (2 rows)

---

## 6. RECIPE — RELEASE THE NEXT DATASET/BENCHMARK

To add a new benchmark (e.g. a new dataset "FooBench") with the same live-synced, SWE-bench++-style treatment:

**A. Publish data to HF** (the source of truth):
1. Create/locate the HF dataset, e.g. `Nalandadata/FooBench`.
2. Upload `benchmark/leaderboard.jsonl` (rows: `{model, org, method, category, teds/accuracy, steds, n_samples, verified, per_type?}`) and optionally `benchmark/composition.json` (`{full:{...}, test:{...}}`).
   - Use the working pattern: `HfApi(token=os.environ['HF_TOKEN']).upload_file(...)`.
   - Real eval numbers often already exist on the Modal `tsr-data` volume → check `results/*.json` before spending GPU.

**B. Backend endpoint** (`backend/server.py`):
- Add `/api/hf/foobench-leaderboard` (copy the `get_hf_nalandabench_leaderboard` pattern; reuse `_fetch_hf_file`). Restart `nalanda-backend`.

**C. Frontend** — either:
- Add a **new tab** to `/benchmarks` (a `.bench-tab[data-bench="foobench"]` + `#bp-foobench` panel), reusing the DrishtiTable panel structure, OR a new dedicated page.
- Wire live-sync in `bench-sync.js` (add a `loadFoo()` fetch + render into the new panel ids). Keep CSP-safe (external JS, no inline onclick).
- Hardcoded fallback rows in the HTML (so it works if HF down).

**D. Deploy** via the patch→gist→droplet flow in §4.

**Design reference:** `drishtitable-mockup-v2.html` is the full SWE-bench++-style layout (hero, dual leaderboard, feature cards, distributions+toggle, per-type table, methodology steps, recognition viewer, data-access cards).

---

## 7. CREDENTIALS / SERVICES STATUS
- **HF_TOKEN** — in droplet `backend/.env` (gated-repo read access). Also available locally as env var for uploads.
- **Modal** — connected (token format `ak-...:as-...`). Volumes: `tsr-data` (images/annotations/splits/results), `tsr-models` (sft-best-lora = 7B, qwen3vl-9b-full1141-best-lora = 8B).
- **GitHub** — droplet pushes as `prakhardoubtbuddy` (SSH). Local `gh`/git = `nishu12345678` (can push to tsr_dataset, NOT to the website repo → that's why deploys go via droplet).

---

## 8. OPEN / OPTIONAL ITEMS
- Recognition viewer has 1 real example (Financial). Could add Statistical/Lookup examples (real images on Modal `tsr-data/images/`, predictions in `results/sft_results.json`).
- `QA_FINDINGS.md` items are resolved (case-study data fixed; 8B added).
- No known bugs. Everything live, CSP-safe, mobile-responsive, GitHub + HF synced.
