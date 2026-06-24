# QA Findings — HuggingFace ↔ Website Sync (2026-06-24)

Full QA audit of the HF↔website integration. Most checks passed; open items are
flagged below for review.

---

## ✅ PASSING

| Check | Result |
|---|---|
| HF source files exist & fetchable | All 3 (DrishtiTable leaderboard, composition, NalandaBench leaderboard) return 200 |
| Data integrity (`/benchmarks` = HF) | All 10 DrishtiTable rows match HF exactly (order + values) |
| Composition math | All distributions sum to 1,421 correctly |
| Error handling | Serves stale cache on HF failure; falls back to hardcoded HTML |
| Endpoints point at right repos | Correct |
| Security | No HF token in code; `.env` not in git |
| Table column alignment | Fixed (bench-sync + bench-leaderboard coordinate) |
| Composition chart overflow | Fixed (capped at 6 bars, long-tail grouped into Other) |

---

## 🔴 OPEN ITEM 1 — Case-study table has WRONG data (needs decision)

**Where:** `/research/drishtitable` results table (`deploy/static-pages/drishtitable.html`, ~line 358)

**Problem:** The case-study table conflicts with the authoritative source.

| Model | Source result file (TRUTH) | HF leaderboard | Case-study page |
|---|---|---|---|
| Claude Sonnet 4.6 | **77.35%** | 77.35% ✅ | **53.53%** ❌ WRONG |
| Claude Opus 4.8 | **75.49%** | 75.49% ✅ | (not listed) |

**Source of truth:** `tsr_dataset` repo → `results/openrouter_anthropic_claude-sonnet-4.6.json`
→ `avg_teds = 0.7735` (77.35%). The case-study's 53.53% matches **no** source file.

**Also:** the case-study table lists different frontier models (GPT-5.5, GPT-5.4,
Gemini 3 Pro Preview) than the leaderboard — these appear to be from an **older,
separate eval run** that is now outdated.

**Recommendation:** Replace the case-study table with the live HF leaderboard (so
it's correct + consistent). Held pending the 8B decision below, since syncing would
remove the 8B row.

---

## 🟡 OPEN ITEM 2 — The Qwen3-VL-8B (84.9%) story (needs decision)

**Where:** `/research/drishtitable` prose + table cite a Qwen3-VL-8B at **84.9% TEDS**
as the headline ("ahead of every frontier model").

**Facts:**
- The 8B is a **real internal research result** (documented in `tsr_dataset/PROJECT_LOG.md`:
  Qwen3-VL-8B = 84.77% at full data in the learning-curve study).
- The 8B model is **NOT published on HuggingFace** (only the 7B is).
- The 8B is **NOT in the HF leaderboard.jsonl**.
- The exact figure is inconsistent: case-study says **84.9%** / table says **84.89%** /
  project log says **84.77%**.

**Options to decide:**
1. Add the 8B to the HF leaderboard as a clearly-labeled "research / unreleased" row
   (with the verified 84.77%), so the website claim has a verifiable source.
2. Lead everywhere with the released 7B (83.2%, verifiable, downloadable) and
   soften/remove the unreleased-8B claims.
3. Keep the current framing (7B released + 8B research headline) but reconcile the
   84.9 / 84.89 / 84.77 figure to one value.

**Recommendation (best for users + company):** Make HF the single source of truth.
Either publish the 8B (option 1) or lead with the verifiable 7B (option 2). The
released 7B at 83.2% is the strongest *defensible* story — verifiable and downloadable.

---

## ✅ DONE / IN PROGRESS (safe items, no decision needed)

- `/benchmarks` leaderboard table + TEDS bars + composition charts + NalandaBench
  table → all live-synced from HF. ✅
- Deploy-time fallback regenerator → keeps hardcoded fallback rows matching HF
  (prevents drift, includes all models). [in progress]

---

*Generated during QA. Update when open items are resolved.*
