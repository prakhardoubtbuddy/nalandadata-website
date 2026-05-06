# Nalandadata.ai — Frontend

Marketing and data catalogue website for **Nalandadata.ai**, a curated AI training data platform powered by S Chand Group (India's #1 academic publisher).

## Stack

| Layer | Technology |
|---|---|
| Framework | React 19 (Create React App + CRACO) |
| Routing | React Router v7 |
| Styling | Tailwind CSS 3 + custom design tokens |
| Animations | Framer Motion 12 |
| UI primitives | Radix UI / shadcn components |
| SEO | react-helmet-async |
| Toasts | sonner |

## Getting started

```bash
# 1. Install dependencies
yarn install

# 2. Set up environment
cp .env.example .env
# Edit .env — set REACT_APP_BACKEND_URL to your backend server

# 3. Start dev server
yarn start
```

## Environment variables

| Variable | Description |
|---|---|
| `REACT_APP_BACKEND_URL` | Base URL of the backend API (no trailing slash) |
| `WDS_SOCKET_PORT` | Dev server websocket port (set to 443 behind HTTPS proxy) |
| `ENABLE_HEALTH_CHECK` | Enable background health-check polling (`true`/`false`) |

See `.env.example` for defaults. **Never commit `.env`.**

## Project structure

```
src/
├── components/       # Shared UI components (Navbar, Footer, Layout, ErrorBoundary…)
│   └── ui/           # shadcn/Radix primitives
├── lib/
│   └── api.js        # Single source of truth for the API base URL
├── pages/            # One file per route
└── App.js            # Router config + providers
```

## Pages / routes

| Route | Page |
|---|---|
| `/` | HomePage |
| `/datasets` | DatasetsPage |
| `/datasets/:slug` | DatasetDetailPage |
| `/solutions` | SolutionsPage |
| `/industries` | IndustriesPage |
| `/about` | AboutPage |
| `/contact` | ContactPage |
| `/privacy` | PrivacyPage |
| `/admin` | AdminPage (password-protected) |
| `*` | NotFoundPage |

## Build

```bash
yarn build
```

Output is in `build/`. Serve with any static file server or nginx.

## Backend

The backend exposes a REST API. Key endpoints used by the frontend:

- `GET /api/files` — list all dataset files
- `GET /api/files/category/:slug` — files for a specific dataset category
- `GET /api/files/:id/download` — download a file (blob)
- `POST /api/leads` — submit a lead / data request form
- `POST /api/admin/login` — admin authentication
