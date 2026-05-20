# S Chand AI Infrastructure Platform

A B2B data marketplace platform for S Chand, positioning academic AI datasets for frontier AI labs, EdTech platforms, research institutions, and foundation model companies.

---

## Overview

This platform showcases and distributes high-quality academic datasets (2B+ samples, 15+ subjects, 12 languages) designed to improve LLM performance on benchmarks like MMLU, AIME, GAIA, and Arena Hard.

## Tech Stack

**Frontend**
- React 19 + React Router DOM v7
- Tailwind CSS + Shadcn/UI (Radix UI primitives)
- Framer Motion (animations)
- Axios + React Hook Form + Zod

**Backend**
- FastAPI (Python) + Uvicorn
- MongoDB with Motor (async driver)
- Pydantic v2 for data validation
- Resend for email notifications

**Infrastructure**
- Nginx reverse proxy
- Docker-ready setup
- PostHog analytics

---

## Features

- **Dataset Catalog** — 5 dataset types: Academic Reasoning, STEM, Multilingual, OCR, Speech
- **Lead Capture** — Form-based access with MongoDB storage and email notifications
- **Admin Panel** — File upload/management, lead viewer, blog editor (login: `admin` / `schand2024`)
- **Blog System** — Full publish/draft blog management
- **Hugging Face Integration** — Proxied metadata with 10-min TTL caching

---

## Project Structure

```
schand/
├── backend/
│   ├── server.py          # FastAPI app (all API routes)
│   ├── requirements.txt
│   └── uploads/           # Uploaded dataset files
├── frontend/
│   ├── src/
│   │   ├── pages/         # 13 page components
│   │   ├── components/    # Navbar, Footer, LeadCaptureForm, etc.
│   │   └── lib/           # API client & utilities
│   ├── package.json
│   └── tailwind.config.js
├── nginx.conf
└── design_guidelines.json
```

---

## Getting Started

### Prerequisites
- Node.js 18+
- Python 3.10+
- MongoDB instance

### Backend

```bash
cd backend
pip install -r requirements.txt
cp .env.example .env   # Set MONGO_URL, RESEND_API_KEY
uvicorn server:app --reload --port 8001
```

### Frontend

```bash
cd frontend
yarn install
yarn start
```

The app runs at `http://localhost:3000` with the API at `http://localhost:8001`.

---

## Environment Variables

| Variable | Description |
|---|---|
| `MONGO_URL` | MongoDB connection string |
| `RESEND_API_KEY` | Resend API key for email notifications |
| `FRONTEND_URL` | Frontend origin for CORS |

---

## API Endpoints

| Method | Path | Description |
|---|---|---|
| POST | `/api/leads` | Submit a lead |
| GET | `/api/leads` | List all leads (admin) |
| GET/POST | `/api/datasets` | Dataset CRUD |
| GET/POST | `/api/blog` | Blog post management |
| POST | `/api/upload` | Upload dataset file |
| GET | `/api/stats` | Dashboard stats |
| GET | `/api/health` | Health check |

---

## License

© S Chand & Company. All rights reserved.
