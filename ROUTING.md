# nalandadata.ai — Architecture & Routing Map

> The single source of truth for how this site is structured: which URLs are
> static HTML vs React, where each lives, how the backend fits in, and how to
> deploy each part. Read this before changing anything.

---

## TL;DR

nalandadata.ai is a **hybrid**, and intentionally so:

| Layer | Technology | Why |
|---|---|---|
| **Public showcase** (all nav pages) | **Static HTML** | Best SEO, fastest load, simplest to edit. This is what visitors see. |
| **Admin portal** (`/admin`) | **React SPA** | Private app: login, file/lead/blog management, live data. SEO irrelevant. |
| **Backend API** (`/api/*`) | **FastAPI + MongoDB** | Serves leads, files, blog, stats, and HF data to the admin + forms. |

> **Rule of thumb:** public content = static HTML. Interactive private app = React.
> Do **not** rebuild the public pages in React — it would hurt SEO and speed for
> no benefit.

---

## 1. Static HTML pages (the public site)

Hand-written `.html` files. Each is explicitly routed by nginx (`location =`).
**Every link in the site nav points to one of these.**

| URL | File | Purpose |
|---|---|---|
| `/` | `static-pages/homepage.html` | Homepage |
| `/research` | `static-pages/research.html` | Research index |
| `/research/drishtitable` | `static-pages/drishtitable.html` | DrishtiTable case study |
| `/research/nalandabench` | `static-pages/nalandabench.html` | NalandaBench case study |
| `/research/nalanda-image-vl` | `static-pages/nalanda-image-vl.html` | Image-VL case study |
| `/benchmarks` | `static-pages/benchmarks.html` | Benchmarks + leaderboard + charts |
| `/about` | `static-pages/about.html` | About |
| `/solutions` | `static-pages/solutions.html` | Solutions |
| `/contact` | `static-pages/contact.html` | Contact |

- **Source in repo:** `deploy/static-pages/*.html`
- **Live location:** `/var/www/nalandadata/static-pages/` (on the droplet)
- **Design system:** dark `#0A0A0A` + gold `#C8A96E` accent, Space Grotesk + JetBrains Mono.
- **Interactivity:** small, CSP-safe vanilla JS (e.g. `deploy/lead-capture.js`, tab/toggle scripts). No framework.

### How to edit/deploy a static page
```bash
# 1. edit the file in deploy/static-pages/<page>.html
# 2. on the droplet:
cp /root/schand/deploy/static-pages/<page>.html /var/www/nalandadata/static-pages/<page>.html
sudo systemctl reload nginx
# (no build step needed)
```
Or run the full deploy script: `deploy/deploy.sh`.

---

## 2. React app (the admin portal)

A single-page React app (Create React App + CRACO + Tailwind + Shadcn UI).
nginx serves it as the **catch-all** — any URL not in the static list above
falls through to the React `index.html`.

### Routes (`frontend/src/App.js`)

| React route | Status | Notes |
|---|---|---|
| `/admin` | ✅ **ACTIVE — the reason React exists** | Login, file/lead/blog management, stats dashboard (`AdminPage.jsx`, ~930 lines) |
| `/datasets`, `/datasets/:slug` | ⚠️ Dormant | Built but **not linked** from the live site. `/datasets/table-recognition` is an orphan. |
| `/industries`, `/blog`, `/blog/:slug`, `/privacy` | ⚠️ Dormant | Not linked in nav. |
| `/`, `/about`, `/solutions`, `/contact` | ❌ Overridden | Defined in React but **never reached** — the static versions win (nginx exact-match beats catch-all). Dead code. |

- **Source in repo:** `frontend/src/`
- **Build output:** `frontend/build/`
- **Live location:** `/var/www/nalandadata/frontend/build/` (on the droplet)
- **Design system:** newer build matches the static gold/dark theme; older builds were Inter+blue.

### How to edit/deploy the React app
```bash
cd /root/schand/frontend
yarn install            # if deps changed
yarn build              # ~90s; needs RAM (watch for OOM on small droplets)
cp -r build/* /var/www/nalandadata/frontend/build/
sudo systemctl reload nginx
```
> ⚠️ Assets like `logo-mark.svg` / favicons must live in `frontend/public/` so
> the build includes them (a missing-logo bug happened when they weren't).

---

## 3. Backend API (FastAPI + MongoDB)

A FastAPI service the admin portal and public forms talk to.

- **Source:** `backend/server.py`
- **Runs as:** `uvicorn` on `127.0.0.1:8001` (proxied by nginx at `/api/`)
- **Storage:** MongoDB (`MONGO_URL`, `DB_NAME` env vars), file uploads in `backend/uploads/`

### Endpoints (prefix `/api`)
| Method | Path | Used by |
|---|---|---|
| POST | `/admin/login` | Admin login |
| GET/POST/DELETE | `/leads`, `/leads/{id}` | Lead capture (public form → admin views) |
| POST/GET/DELETE | `/files`, `/files/upload`, `/files/{id}/download`, `/files/category/{cat}` | File management (admin) + public sample downloads |
| GET/POST/DELETE | `/datasets`, `/datasets/{slug}` | Dataset metadata |
| GET | `/hf/model`, `/hf/dataset` | **Hugging Face live data** (downloads, stats) |
| GET/POST/PUT/DELETE | `/blog`, `/blog/all`, `/blog/{slug}`, `/blog/{id}` | Blog management |
| GET | `/stats`, `/health` | Dashboard stats / health check |

> Note: `/api/hf/*` already pulls live data from Hugging Face — useful if a
> public page should ever show live HF download counts.

---

## 4. nginx — who routes what

Config: `/etc/nginx/sites-available/nalandadata.ai`

```
location = /            -> static-pages/homepage.html
location = /research    -> static-pages/research.html
location = /benchmarks  -> static-pages/benchmarks.html
... (one explicit rule per static page) ...
location /api/          -> proxy to 127.0.0.1:8001   (FastAPI)
location /              -> try_files $uri /index.html (React catch-all)
```

**Priority:** exact-match (`location =`) beats the catch-all, which is why static
pages override their React equivalents.

- HTTP → HTTPS redirect; TLS via Let's Encrypt.
- Strict **Content-Security-Policy** is set here — this is why charts/scripts must
  be CSP-safe (no inline `style=""` blocked? inline `<style>` allowed; prefer
  external JS for scripts). Keep this in mind for any interactive additions.

---

## 5. Repositories & paths

| Thing | Repo path | Live path (droplet) |
|---|---|---|
| Static pages | `deploy/static-pages/` | `/var/www/nalandadata/static-pages/` |
| React app source | `frontend/src/` | — |
| React build | `frontend/build/` | `/var/www/nalandadata/frontend/build/` |
| Backend | `backend/` | runs via uvicorn :8001 |
| Deploy script | `deploy/deploy.sh` | — |
| GitHub remote | `prakhardoubtbuddy/nalandadata-website` | — |
| Droplet checkout | — | `/root/schand` |

---

## 6. Decision guide — where should new work go?

| You're adding... | Build it as... | Goes in |
|---|---|---|
| A public page (research, dataset, benchmark, marketing) | **Static HTML** | `deploy/static-pages/` + nginx `location =` |
| A chart/visual on a public page | **Static HTML + CSS** (CSP-safe, no JS libs) | the relevant `.html` |
| An interactive admin/private tool | **React** | `frontend/src/pages/` |
| A new API/data endpoint | **FastAPI** | `backend/server.py` |
| Live HF data on a public page | Static page that fetches `/api/hf/*` via small JS, **or** bake at deploy time | static page + backend |

**Default:** if it's public-facing content, it's static HTML. Only reach for React
when it's genuinely an interactive app (like `/admin`).

---

*Last updated: 2026-06-24. Keep this file current when routes/architecture change.*
