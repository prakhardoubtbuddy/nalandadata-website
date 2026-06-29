import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import API from "@/lib/api";

function MiniIcon({ org }) {
  if (org === "Nalandadata") return (
    <div className="s-mini-icon" style={{ background: "#111", padding: "2px" }}>
      <svg viewBox="0 0 48 37" width="13" height="10" fill="none"><rect x="0" y="27" width="48" height="10" fill="#C8A96E"/><rect x="14" y="13" width="34" height="9" fill="#C8A96E"/><rect x="28" y="0" width="20" height="8" fill="#C8A96E"/></svg>
    </div>
  );
  if (org === "Anthropic") return (
    <div className="s-mini-icon" style={{ background: "#CC785C" }}>
      <svg viewBox="0 0 24 24" width="10" height="10" fill="white" fillRule="evenodd"><path d="M14.4 2L22 21.6h-4.16l-1.62-4.3H7.78L6.16 21.6H2L9.6 2h4.8zm-2.4 5.9L9.3 14.56h5.4l-2.7-6.66z"/></svg>
    </div>
  );
  if (org === "OpenAI") return (
    <div className="s-mini-icon" style={{ background: "#000" }}>
      <svg viewBox="0 0 24 24" width="10" height="10" fill="white"><path d="M22.282 9.821a5.985 5.985 0 0 0-.516-4.91 6.046 6.046 0 0 0-6.51-2.9A6.065 6.065 0 0 0 4.981 4.18a5.985 5.985 0 0 0-3.998 2.9 6.046 6.046 0 0 0 .743 7.097 5.98 5.98 0 0 0 .51 4.911 6.051 6.051 0 0 0 6.515 2.9A5.985 5.985 0 0 0 13.26 24a6.056 6.056 0 0 0 5.772-4.206 5.99 5.99 0 0 0 3.997-2.9 6.056 6.056 0 0 0-.747-7.073zm-9.022 12.608a4.476 4.476 0 0 1-2.876-1.04l.141-.081 4.779-2.758a.795.795 0 0 0 .392-.681v-6.737l2.02 1.168a.071.071 0 0 1 .038.052v5.583a4.504 4.504 0 0 1-4.494 4.494zm-9.6-4.125a4.47 4.47 0 0 1-.535-3.014l.142.085 4.783 2.759a.771.771 0 0 0 .78 0l5.843-3.369v2.332a.08.08 0 0 1-.033.062L9.74 19.95a4.5 4.5 0 0 1-6.14-1.646zm-1.263-10.58a4.485 4.485 0 0 1 2.366-1.973V11.6a.766.766 0 0 0 .388.676l5.815 3.355-2.02 1.168a.076.076 0 0 1-.071 0l-4.83-2.786A4.504 4.504 0 0 1 2.34 7.872zm16.597 3.855l-5.843-3.374 2.02-1.168a.076.076 0 0 1 .071 0l4.83 2.791a4.494 4.494 0 0 1-.678 8.105v-5.678a.79.79 0 0 0-.4-.676zm2.01-3.023l-.141-.085-4.774-2.782a.776.776 0 0 0-.785 0L9.409 9.23V6.897a.066.066 0 0 1 .028-.061l4.83-2.787a4.5 4.5 0 0 1 6.68 4.66zm-12.64 4.135l-2.02-1.164a.08.08 0 0 1-.038-.057V6.075a4.5 4.5 0 0 1 7.375-3.453l-.142.08-4.778 2.758a.795.795 0 0 0-.393.681zm1.097-2.365l2.602-1.5 2.607 1.5v2.999l-2.597 1.5-2.607-1.5z"/></svg>
    </div>
  );
  if (org === "Google") return (
    <div className="s-mini-icon" style={{ background: "#fff" }}>
      <svg viewBox="0 0 24 24" width="10" height="10"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
    </div>
  );
  return <div className="s-mini-icon" style={{ background: "#0082FB" }} />;
}

// ── Fallback data (shape matches API response) ──────────────────────────────

const DT_FALLBACK = [
  { model: "DrishtiTable-Qwen3-VL-8B",    org: "Nalandadata", method: "Fine-tuned (SFT, research)", category: "ours-research", teds: 84.9, steds: 90.4, n_samples: 135, verified: true },
  { model: "DrishtiTable-Qwen2.5-VL-7B",  org: "Nalandadata", method: "SFT (QLoRA)",                category: "ours",          teds: 83.2, steds: 89.7, n_samples: 135, verified: true },
  { model: "Claude Sonnet 4.6",            org: "Anthropic",   method: "Zero-shot",                  category: "frontier",      teds: 77.3, steds: 89.2, n_samples: 135, verified: true },
  { model: "Claude Opus 4.8",              org: "Anthropic",   method: "Zero-shot",                  category: "frontier",      teds: 75.5, steds: 88.2, n_samples: 135, verified: true },
  { model: "GPT-4o",                       org: "OpenAI",      method: "Zero-shot",                  category: "frontier",      teds: 71.1, steds: 84.3, n_samples: 135, verified: true },
  { model: "GPT-5.1",                      org: "OpenAI",      method: "Zero-shot",                  category: "frontier",      teds: 69.9, steds: 83.3, n_samples: 135, verified: true },
  { model: "GPT-4.1",                      org: "OpenAI",      method: "Zero-shot",                  category: "frontier",      teds: 68.0, steds: 80.8, n_samples: 135, verified: true },
  { model: "Gemini 3.1 Pro",               org: "Google",      method: "Zero-shot",                  category: "frontier",      teds: 65.7, steds: 73.6, n_samples: 135, verified: true },
  { model: "GPT-5 mini",                   org: "OpenAI",      method: "Zero-shot",                  category: "frontier",      teds: 62.2, steds: 72.7, n_samples: 135, verified: true },
  { model: "o4-mini",                      org: "OpenAI",      method: "Zero-shot",                  category: "frontier",      teds: 61.4, steds: 70.0, n_samples: 135, verified: true },
  { model: "Qwen2.5-VL-7B",               org: "Alibaba",     method: "Zero-shot",                  category: "open",          teds: 58.8, steds: 74.0, n_samples: 135, verified: true },
];

const IQA_FALLBACK = [
  { model: "Claude Sonnet 4.6",     org: "Anthropic",   method: "Zero-shot",         category: "frontier", accuracy: 72.2, vs_base: null, n_samples: 162, verified: true },
  { model: "Claude Opus 4.8",       org: "Anthropic",   method: "Zero-shot",         category: "frontier", accuracy: 68.5, vs_base: null, n_samples: 162, verified: true },
  { model: "Gemini 3.1 Pro",        org: "Google",      method: "Zero-shot",         category: "frontier", accuracy: 65.4, vs_base: null, n_samples: 162, verified: true },
  { model: "GPT-5.1",               org: "OpenAI",      method: "Zero-shot",         category: "frontier", accuracy: 64.2, vs_base: null, n_samples: 162, verified: true },
  { model: "Nalanda Image VL",      org: "Nalandadata", method: "Fine-tuned (QLoRA)", category: "ours",    accuracy: 50.0, vs_base: 12.3,
    per_subject: {
      Maths:     { n: 34, base: 26.5, ours: 50.0 },
      Biology:   { n: 37, base: 32.4, ours: 45.9 },
      Physics:   { n: 52, base: 38.5, ours: 50.0 },
      Chemistry: { n: 39, base: 51.3, ours: 53.8 },
    },
    n_samples: 162, verified: true },
  { model: "LLaMA-3.2-Vision-11B",  org: "Meta",        method: "Zero-shot (base)",  category: "base",    accuracy: 37.7, vs_base: null, n_samples: 162, verified: true },
];

// ── Helpers ─────────────────────────────────────────────────────────────────

const isOursCategory = (cat) => cat && (cat === "ours" || cat.startsWith("ours"));

function dtBadge(row) {
  if (row.category === "ours-research") return "ours · research";
  if (isOursCategory(row.category)) return "ours · released";
  return null;
}

function pct(v) { return `${v}%`; }

export default function BenchmarksPage() {
  const [dtRows, setDtRows] = useState(DT_FALLBACK);
  const [iqaRows, setIqaRows] = useState(IQA_FALLBACK);

  useEffect(() => {
    axios.get(`${API}/hf/leaderboard`).then(r => { if (r.data?.rows?.length) setDtRows(r.data.rows); }).catch(() => {});
    axios.get(`${API}/hf/imageqa-leaderboard`).then(r => { if (r.data?.rows?.length) setIqaRows(r.data.rows); }).catch(() => {});
  }, []);

  const dtTop      = dtRows[0];
  const dtFrontier = dtRows.filter(r => r.category === "frontier");
  const dtOurs     = dtRows.filter(r => isOursCategory(r.category));
  const dtTopTeds  = dtTop?.teds ?? 84.9;
  const dtVsBest   = dtOurs[0] && dtFrontier[0] ? (dtOurs[0].teds - dtFrontier[0].teds).toFixed(1) : "7.5";

  const iqaOurs    = iqaRows.find(r => isOursCategory(r.category));
  const iqaBase    = iqaRows.find(r => r.category === "base");
  const iqaVsBase  = iqaOurs?.vs_base ?? (iqaOurs && iqaBase ? (iqaOurs.accuracy - iqaBase.accuracy).toFixed(1) : "12.3");

  return (
    <div className="bg-[#0A0A0A]" style={{ paddingTop: "96px" }}>
      {/* Hero */}
      <section className="s-hero">
        <div className="s-hero-grid" aria-hidden="true" />
        <div className="s-wrap">
          <p className="s-eyebrow">Benchmarks</p>
          <h1>The independent benchmark for <span className="hl">Indian domain AI.</span></h1>
          <p className="lede"><b>NalandaBench</b> scores models on verified, curriculum-grade reasoning — expert-authored ground truth with clean IP, built to be reproduced and cited. Independent by design: no lab owns the scorekeeper.</p>
          <p className="s-audience">NalandaBench is the standard evaluation for AI models trained or evaluated on Indian curriculum and domain content. Submit your model to appear on the leaderboard.</p>
          <div className="s-pull-quote">
            <p>A fine-tuned 8B model leads every frontier model on Indian table recognition — <span>+{dtVsBest} points over the best</span> (Claude Sonnet 4.6); the released 7B is right behind. Domain-specific training beats scale.</p>
          </div>
          <div className="s-hero-cta">
            <Link className="s-btn primary" to="/contact">License the dataset →</Link>
            <a className="s-btn ghost" href="https://huggingface.co/Nalandadata" target="_blank" rel="noopener noreferrer">Browse on Hugging Face →</a>
          </div>
        </div>
      </section>

      {/* Why different */}
      <section className="s-band alt">
        <div className="s-wrap">
          <p className="s-eyebrow">Why it's different</p>
          <h2 style={{ fontSize: "clamp(25px,3.6vw,40px)", fontWeight: 800, letterSpacing: "-0.025em", lineHeight: 1.08, margin: 0 }}>A measurement only matters if it's neutral.</h2>
          <div className="s-verify">
            <div className="s-vcard">
              <div className="vk">Verified ground truth</div>
              <h3>Expert-authored, not crowd-voted</h3>
              <p>Every item has a verified correct answer from subject-matter experts, ready for verifier-based scoring.</p>
            </div>
            <div className="s-vcard">
              <div className="vk">Independent</div>
              <h3>No lab owns the scorekeeper</h3>
              <p>NalandaBench is built to be the standard others report against — not a tool to validate our own models only.</p>
            </div>
            <div className="s-vcard">
              <div className="vk">Reproducible</div>
              <h3>Public methodology &amp; data</h3>
              <p>Open scoring rules and a public test set on Hugging Face, so any result can be independently checked.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Leaderboard section — Mercor-style benchmark cards */}
      <section className="s-band" id="leaderboard">
        <div className="s-wrap">
          <div className="s-sec-head">
            <p className="s-eyebrow">Leaderboard</p>
            <h2>Benchmark results.</h2>
            <p className="lead">Two held-out benchmarks live, with more in progress. Click <b>Read more</b> on any benchmark to explore the full leaderboard, figures, and methodology.</p>
          </div>

          <div className="s-bench-cards">

            {/* ── DrishtiTable card ── */}
            <div className="s-bench-card">
              <div className="s-bench-card-body">
                <div className="s-bench-meta">
                  <div className="s-bench-tag">Table Structure Recognition · TEDS</div>
                  <div className="s-bench-name">DrishtiTable</div>
                  <p className="s-bench-desc">Image → HTML table recognition on {dtTop?.n_samples ?? 135} held-out Indian-textbook tables, ranked by TEDS. A fine-tuned 8B model leads every frontier model by +{dtVsBest} points. Domain-specific training beats scale.</p>
                  <div className="s-bench-links">
                    <a className="s-bench-link" href="https://huggingface.co/datasets/Nalandadata/DrishtiTable" target="_blank" rel="noopener noreferrer">↗ Dataset</a>
                    <a className="s-bench-link" href="https://huggingface.co/spaces/Nalandadata/DrishtiTable-Leaderboard" target="_blank" rel="noopener noreferrer">↗ Eval script</a>
                    <a className="s-bench-link" href="https://huggingface.co/Nalandadata" target="_blank" rel="noopener noreferrer">↗ Models</a>
                  </div>
                  <Link className="s-bench-read-more" to="/benchmarks/drishtitable">Read more</Link>
                  <Link className="s-bench-cta" to="/benchmarks/drishtitable">View full leaderboard →</Link>
                </div>

                {/* Mini leaderboard */}
                <div className="s-mini-lb">
                  <div className="s-mini-lb-title">Top results · {dtTop?.n_samples ?? 135} held-out tables</div>
                  <div className="s-mini-rows">
                    {dtRows.slice(0, 5).map(row => (
                      <div key={row.model} className={`s-mini-row${isOursCategory(row.category) ? " ours" : ""}`}>
                        <div className="s-mini-row-top">
                          <MiniIcon org={row.org} />
                          <span className="s-mini-model">{row.model.replace("DrishtiTable-", "DT-")}</span>
                          <span className="s-mini-score">{row.teds}%</span>
                          {isOursCategory(row.category) && <span className="s-mini-badge">ours</span>}
                        </div>
                        <div className="s-mini-bar-track">
                          <div className="s-mini-bar-fill" style={{ width: `${((row.teds / dtTopTeds) * 100).toFixed(1)}%` }} />
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="s-mini-axis"><span>0%</span><span>50%</span><span>100%</span></div>
                </div>
              </div>
            </div>

            {/* ── Nalanda Image VL card ── */}
            <div className="s-bench-card">
              <div className="s-bench-card-body">
                <div className="s-bench-meta">
                  <div className="s-bench-tag">STEM Science QA · Accuracy</div>
                  <div className="s-bench-name">Nalanda Image VL</div>
                  <p className="s-bench-desc">Multiple-choice science reasoning on {iqaOurs?.n_samples ?? 162} held-out questions across Physics, Chemistry, Biology and Maths. Fine-tuning LLaMA-3.2-Vision-11B on 22K diagram-grounded pairs yields a +{iqaVsBase}pp gain over the zero-shot base.</p>
                  <div className="s-bench-links">
                    <a className="s-bench-link" href="https://huggingface.co/datasets/Nalandadata/nalanda-image-qa" target="_blank" rel="noopener noreferrer">↗ Dataset</a>
                    <a className="s-bench-link" href="https://huggingface.co/Nalandadata/nalanda-image-vl" target="_blank" rel="noopener noreferrer">↗ Model</a>
                    <a className="s-bench-link" href="https://huggingface.co/datasets/Nalandadata/nalanda-image-qa/tree/main/scripts" target="_blank" rel="noopener noreferrer">↗ Eval script</a>
                  </div>
                  <Link className="s-bench-read-more" to="/benchmarks/nalanda-image-vl">Read more</Link>
                  <Link className="s-bench-cta" to="/benchmarks/nalanda-image-vl">View full leaderboard →</Link>
                </div>

                {/* Mini leaderboard */}
                <div className="s-mini-lb">
                  <div className="s-mini-lb-title">Top results · {iqaOurs?.n_samples ?? 162} held-out MCQs</div>
                  <div className="s-mini-rows">
                    {iqaRows.map(row => (
                      <div key={row.model} className={`s-mini-row${isOursCategory(row.category) ? " ours" : ""}`}>
                        <div className="s-mini-row-top">
                          <MiniIcon org={row.org} />
                          <span className="s-mini-model">{row.model}</span>
                          <span className="s-mini-score">{row.accuracy}%</span>
                          {row.vs_base != null && <span className="s-mini-badge">+{row.vs_base}pp</span>}
                        </div>
                        <div className="s-mini-bar-track">
                          <div className="s-mini-bar-fill" style={{ width: `${((row.accuracy / 100) * 100).toFixed(1)}%` }} />
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="s-mini-axis"><span>0%</span><span>50%</span><span>100%</span></div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="s-band alt s-cs-cta">
        <div className="s-wrap">
          <p className="s-eyebrow" style={{ justifyContent: "center" }}>Get on the leaderboard</p>
          <h2 style={{ fontSize: "clamp(25px,3.6vw,40px)", fontWeight: 800, letterSpacing: "-0.025em", lineHeight: 1.08, margin: 0, textAlign: "center" }}>Two ways in.</h2>
          <p style={{ margin: "18px auto 0", maxWidth: "56ch", color: "var(--muted)", textAlign: "center" }}>Depending on whether you want to evaluate your model or license the underlying data.</p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 280px), 1fr))", gap: "20px", maxWidth: "680px", margin: "28px auto 0", textAlign: "left" }}>
            <div style={{ background: "var(--ink)", border: "1px solid var(--line)", borderRadius: "10px", padding: "24px" }}>
              <h3 style={{ fontSize: "13px", fontFamily: "var(--mono)", letterSpacing: "0.05em", textTransform: "uppercase", margin: "0 0 8px", fontWeight: 800 }}>Submit a model</h3>
              <p style={{ fontSize: "13px", color: "var(--muted)", margin: "0 0 18px", lineHeight: 1.55 }}>Evaluate your model on the held-out test set and appear on the public leaderboard. Open to any model, any lab.</p>
              <Link className="s-btn primary" to="/contact" style={{ width: "100%", textAlign: "center" }}>Submit a model →</Link>
            </div>
            <div style={{ background: "var(--ink)", border: "1px solid var(--line)", borderRadius: "10px", padding: "24px" }}>
              <h3 style={{ fontSize: "13px", fontFamily: "var(--mono)", letterSpacing: "0.05em", textTransform: "uppercase", margin: "0 0 8px", fontWeight: 800 }}>License the dataset</h3>
              <p style={{ fontSize: "13px", color: "var(--muted)", margin: "0 0 18px", lineHeight: 1.55 }}>Access the full benchmark dataset for training, evaluation, or integration into your own pipeline.</p>
              <Link className="s-btn ghost" to="/contact" style={{ width: "100%", textAlign: "center" }}>License the dataset →</Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
