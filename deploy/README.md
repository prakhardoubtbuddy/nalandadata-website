# nalandadata.ai — static redesign overlay

Self-contained static HTML pages (dark/gold "Verified reasoning data" design) that
overlay the React SPA at clean URLs via nginx exact-match `location =` blocks. The
React build still serves everything else (e.g. /admin).

## Routes -> files (served from /var/www/nalandadata/static-pages/)

| URL | file |
|-----|------|
| /                          | static-pages/homepage.html |
| /research                  | static-pages/research.html |
| /research/nalandabench     | static-pages/nalandabench.html |
| /research/nalanda-image-vl | static-pages/nalanda-image-vl.html |
| /research/drishtitable     | static-pages/drishtitable.html |
| /benchmarks                | static-pages/benchmarks.html |
| /about                     | static-pages/about.html |
| /solutions                 | static-pages/solutions.html |
| /contact                   | static-pages/contact.html |

Global nav (every page): Research · Benchmarks · Solutions · About · "Request access" (→ /contact).

`lead-capture.js` is served from the React build dir
(/var/www/nalandadata/frontend/build/lead-capture.js). It's CSP-safe (no inline JS)
and wires the homepage forms (newsletter / sample / talk-to-a-researcher) and the
/contact full form to `POST /api/leads` (FastAPI → Mongo + Resend email notification).

## Deploy / test

    sudo bash deploy.sh      # backs up nginx conf, refreshes the marker block, gates on
                             # `nginx -t`, auto-rolls-back on failure. Location blocks carry
                             # no add_header, so server-level CSP/HSTS headers inherit.
    bash smoketest.sh        # 21-point regression: page serving, security headers,
                             # lead-capture asset, lead API end-to-end, Mongo auth, health.
    bash linkcheck.sh        # crawls every internal href across the pages and checks it resolves.

## Ops

`ops/enable-mongo-auth.sh` — one-time hardening that created the Mongo app + admin users,
wrote the authenticated MONGO_URL into backend/.env, and enabled `authorization: enabled`,
with auto-rollback. Mongo is bound to 127.0.0.1.

## Notes

- `backend/.env` is gitignored (RESEND_API_KEY + authenticated MONGO_URL) — never commit it.
- NalandaBench leaderboard (/benchmarks) is v1: 800 held-out JEE/NEET MCQs, one published
  result (Qwen 2.5 7B GRPO, 60.5% → 66.8%). Public multi-model submissions are forthcoming.
