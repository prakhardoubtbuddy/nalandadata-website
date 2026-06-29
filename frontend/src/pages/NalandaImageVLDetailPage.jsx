import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import API from "@/lib/api";

const FALLBACK = [
  { model: "Claude Sonnet 4.6",    org: "Anthropic",   method: "Zero-shot",          category: "frontier", accuracy: 72.2, vs_base: null, n_samples: 162, verified: true },
  { model: "Claude Opus 4.8",      org: "Anthropic",   method: "Zero-shot",          category: "frontier", accuracy: 68.5, vs_base: null, n_samples: 162, verified: true },
  { model: "Gemini 3.1 Pro",       org: "Google",      method: "Zero-shot",          category: "frontier", accuracy: 65.4, vs_base: null, n_samples: 162, verified: true },
  { model: "GPT-5.1",              org: "OpenAI",      method: "Zero-shot",          category: "frontier", accuracy: 64.2, vs_base: null, n_samples: 162, verified: true },
  { model: "Nalanda Image VL",     org: "Nalandadata", method: "Fine-tuned (QLoRA, vision+language)", category: "ours", accuracy: 50.0, vs_base: 12.3, n_samples: 162, verified: true },
  { model: "LLaMA-3.2-Vision-11B", org: "Meta",        method: "Zero-shot (base)",   category: "base",     accuracy: 37.7, vs_base: null, n_samples: 162, verified: true },
];

const isOurs = (cat) => cat && (cat === "ours" || cat.startsWith("ours") || cat === "fine-tuned");
const isBase = (cat) => cat && (cat === "base" || cat === "baseline");

// Always authoritative — not expected from the API
const PER_SUBJECT = {
  Maths:     { n: 34, base: 26.5, ours: 50.0 },
  Biology:   { n: 37, base: 32.4, ours: 45.9 },
  Physics:   { n: 52, base: 38.5, ours: 50.0 },
  Chemistry: { n: 39, base: 51.3, ours: 53.9 },
};

function BarRow({ label, width, value, isOurs: ours }) {
  return (
    <div className={`s-bar-row${ours ? " ours" : ""}`}>
      <span className="s-bar-label">{label}</span>
      <span className="s-bar-track"><span className="s-bar-fill" style={{ width }} /></span>
      <span className="s-bar-val">{value}</span>
    </div>
  );
}

function ProviderIcon({ org }) {
  if (org === "Nalandadata") return (
    <div className="s-sp-icon" style={{ background: "#111", padding: "2px" }}>
      <svg viewBox="0 0 48 37" width="14" height="11" fill="none">
        <rect x="0" y="27" width="48" height="10" fill="#C8A96E"/>
        <rect x="14" y="13" width="34" height="9" fill="#C8A96E"/>
        <rect x="28" y="0" width="20" height="8" fill="#C8A96E"/>
      </svg>
    </div>
  );
  if (org === "Anthropic") return (
    <div className="s-sp-icon" style={{ background: "#CC785C" }}>
      <svg viewBox="0 0 24 24" width="11" height="11">
        <path d="M14.4 2L22 21.6h-4.16l-1.62-4.3H7.78L6.16 21.6H2L9.6 2h4.8zm-2.4 5.9L9.3 14.56h5.4l-2.7-6.66z" fill="white" fillRule="evenodd"/>
      </svg>
    </div>
  );
  if (org === "OpenAI") return (
    <div className="s-sp-icon" style={{ background: "#000" }}>
      <svg viewBox="0 0 24 24" width="11" height="11" fill="white">
        <path d="M22.282 9.821a5.985 5.985 0 0 0-.516-4.91 6.046 6.046 0 0 0-6.51-2.9A6.065 6.065 0 0 0 4.981 4.18a5.985 5.985 0 0 0-3.998 2.9 6.046 6.046 0 0 0 .743 7.097 5.98 5.98 0 0 0 .51 4.911 6.051 6.051 0 0 0 6.515 2.9A5.985 5.985 0 0 0 13.26 24a6.056 6.056 0 0 0 5.772-4.206 5.99 5.99 0 0 0 3.997-2.9 6.056 6.056 0 0 0-.747-7.073zm-9.022 12.608a4.476 4.476 0 0 1-2.876-1.04l.141-.081 4.779-2.758a.795.795 0 0 0 .392-.681v-6.737l2.02 1.168a.071.071 0 0 1 .038.052v5.583a4.504 4.504 0 0 1-4.494 4.494zm-9.6-4.125a4.47 4.47 0 0 1-.535-3.014l.142.085 4.783 2.759a.771.771 0 0 0 .78 0l5.843-3.369v2.332a.08.08 0 0 1-.033.062L9.74 19.95a4.5 4.5 0 0 1-6.14-1.646zm-1.263-10.58a4.485 4.485 0 0 1 2.366-1.973V11.6a.766.766 0 0 0 .388.676l5.815 3.355-2.02 1.168a.076.076 0 0 1-.071 0l-4.83-2.786A4.504 4.504 0 0 1 2.34 7.872zm16.597 3.855l-5.843-3.374 2.02-1.168a.076.076 0 0 1 .071 0l4.83 2.791a4.494 4.494 0 0 1-.678 8.105v-5.678a.79.79 0 0 0-.4-.676zm2.01-3.023l-.141-.085-4.774-2.782a.776.776 0 0 0-.785 0L9.409 9.23V6.897a.066.066 0 0 1 .028-.061l4.83-2.787a4.5 4.5 0 0 1 6.68 4.66zm-12.64 4.135l-2.02-1.164a.08.08 0 0 1-.038-.057V6.075a4.5 4.5 0 0 1 7.375-3.453l-.142.08-4.778 2.758a.795.795 0 0 0-.393.681zm1.097-2.365l2.602-1.5 2.607 1.5v2.999l-2.597 1.5-2.607-1.5z"/>
      </svg>
    </div>
  );
  if (org === "Google") return (
    <div className="s-sp-icon" style={{ background: "#fff" }}>
      <svg viewBox="0 0 24 24" width="11" height="11">
        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
      </svg>
    </div>
  );
  return (
    <div className="s-sp-icon" style={{ background: "#0082FB" }}>
      <svg viewBox="0 0 24 24" width="11" height="11" fill="white">
        <path d="M12 2.04c-5.5 0-10 4.49-10 10.02 0 5 3.66 9.15 8.44 9.9v-7H7.9v-2.9h2.54V9.85c0-2.51 1.49-3.89 3.78-3.89 1.09 0 2.23.19 2.23.19v2.47h-1.26c-1.24 0-1.63.77-1.63 1.56v1.88h2.78l-.45 2.9h-2.33v7a10 10 0 0 0 8.44-9.9c0-5.53-4.5-10.02-10-10.02z"/>
      </svg>
    </div>
  );
}

const SUBJECT_EXAMPLES = {
  Maths: { subj: "Mathematics · geometric construction", body: "A figure with labelled points, angles and lines, where the relationships in the drawing are the problem.", chain: "Read the construction precisely and reason from it. The base model often can't see these relationships at all." },
  Biology: { subj: "Biology · cell diagram", body: "Diagrams of cell organelles or biological structures where labels and spatial relationships carry the answer.", chain: "Correctly identify structures and their functions from a schematic diagram." },
  Physics: { subj: "Physics · circuit schematic", body: "A circuit drawn with standard symbols — resistors, a battery, a junction — where the answer depends on topology.", chain: "Recognise each symbol, read the topology, then apply the right law." },
  Chemistry: { subj: "Chemistry · molecular structure", body: "A structure where the bonds, rings and groups define the molecule; option images may be near-identical isomers.", chain: "Parse the structure exactly and tell near-identical molecules apart. A small misread changes the compound." },
};

export default function NalandaImageVLDetailPage() {
  const [rows, setRows] = useState(FALLBACK);
  const [activeIdx, setActiveIdx] = useState(0);

  useEffect(() => {
    axios.get(`${API}/hf/imageqa-leaderboard`).then(r => { if (r.data?.rows?.length) setRows(r.data.rows); }).catch(() => {});
  }, []);

  const oursRow = rows.find(r => isOurs(r.category));
  const baseRow = rows.find(r => isBase(r.category));
  const vsBase  = oursRow?.vs_base ?? (oursRow && baseRow ? (oursRow.accuracy - baseRow.accuracy).toFixed(1) : "12.3");
  const topAcc  = Math.max(...rows.map(r => r.accuracy));
  const active  = rows[activeIdx] ?? rows[0];
  const activePerSubj = active && isOurs(active.category) ? PER_SUBJECT : null;

  return (
    <div className="bg-[#0A0A0A]" style={{ paddingTop: "96px" }}>

      {/* Breadcrumb */}
      <div className="s-breadbar">
        <div className="s-wrap s-breadbar-inner">
          <Link to="/">Home</Link>
          <span style={{ opacity: .4 }}>/</span>
          <Link to="/benchmarks">Benchmarks</Link>
          <span style={{ opacity: .4 }}>/</span>
          <span>Nalanda Image VL</span>
        </div>
      </div>

      {/* Page header */}
      <div className="s-detail-header">
        <div className="s-wrap">
          <p className="s-eyebrow">STEM Science QA · Accuracy</p>
          <h1>Teaching a vision model to read <span className="hl">science diagrams.</span></h1>
          <p className="sub">We built 22,679 science questions paired with diagrams and step-by-step answers, then fine-tuned LLaMA-3.2-Vision-11B — training the vision layers. Overall accuracy rose from 37.7% to 50.0% (+12.3 points); mathematics nearly doubled.</p>
        </div>
      </div>

      {/* Stat strip */}
      <div className="s-stat-strip">
        <div className="s-stat-item"><div className="s-stat-num">+{vsBase}<span className="s-stat-unit">pts</span></div><div className="s-stat-lbl">Overall accuracy on the held-out set, 37.7% → 50.0%, after fine-tuning.</div></div>
        <div className="s-stat-item"><div className="s-stat-num">+23.5<span className="s-stat-unit">pts</span></div><div className="s-stat-lbl">Mathematics — accuracy nearly doubled, from 26.5% to 50.0%.</div></div>
        <div className="s-stat-item"><div className="s-stat-num">22,679</div><div className="s-stat-lbl">Multimodal science QA pairs, each with a diagram and chain-of-thought answer.</div></div>
        <div className="s-stat-item"><div className="s-stat-num">162</div><div className="s-stat-lbl">Held-out evaluation questions across 4 STEM subjects.</div></div>
      </div>

      {/* ── Split panel: model leaderboard ── */}
      <div className="s-split-panel">

        {/* LEFT: ranked model list */}
        <div className="s-sp-left">
          <div className="s-sp-head">
            <span className="s-sp-head-label">Leaderboard · Accuracy</span>
            <span className="s-sp-head-label">{rows.length} models</span>
          </div>
          {rows.map((row, i) => (
            <div
              key={row.model}
              className={`s-sp-row${i === activeIdx ? " active" : ""}${isOurs(row.category) ? " ours" : ""}`}
              onClick={() => setActiveIdx(i)}
            >
              <span className="s-sp-rank">{i + 1}</span>
              <div className="s-sp-row-main">
                <div className="s-sp-row-top">
                  <ProviderIcon org={row.org} />
                  <span className="s-sp-model">{row.model}</span>
                  {isOurs(row.category) && <span className="s-sp-badge">ours · fine-tuned</span>}
                  {isBase(row.category) && <span className="s-sp-badge" style={{ color: "var(--muted-2)", background: "rgba(255,255,255,.06)" }}>base</span>}
                </div>
                <div className="s-sp-bar-track">
                  <div className="s-sp-bar-fill" style={{ width: `${((row.accuracy / topAcc) * 100).toFixed(1)}%` }} />
                </div>
              </div>
              <div className="s-sp-score-col">
                <div className="s-sp-score">{row.accuracy}%</div>
                <div className="s-sp-delta">{i === 0 ? "—" : `−${(topAcc - row.accuracy).toFixed(1)}`}</div>
              </div>
            </div>
          ))}
        </div>

        {/* RIGHT: model detail */}
        <div className="s-sp-right">
          <div className="s-sp-detail-head">
            <ProviderIcon org={active?.org ?? "Nalandadata"} />
            <span className="s-sp-detail-name">{active?.model}</span>
            <span style={{ color: "var(--muted-2)", margin: "0 4px" }}>|</span>
            <span className="s-sp-detail-score">{active?.accuracy}% acc</span>
          </div>
          <div style={{ fontSize: "12.5px", color: "var(--muted-2)", marginBottom: "18px" }}>
            {active?.n_samples ?? 162} MCQs · {active?.method}
            {active?.vs_base != null && <> · <span style={{ color: "#7fc794" }}>+{active.vs_base}pp vs base</span></>}
          </div>

          {/* Per-subject breakdown for our model */}
          {activePerSubj && Object.keys(activePerSubj).length > 0 ? (
            <>
              <div className="s-sp-tabs">
                <button className="s-sp-tab active">Per-subject</button>
                <button className="s-sp-tab">Method</button>
              </div>
              <table className="s-sp-crit" style={{ marginBottom: "14px" }}>
                <thead><tr><th>Subject</th><th style={{ textAlign: "right" }}>Base</th><th style={{ textAlign: "right" }}>Ours</th><th style={{ textAlign: "right" }}>Δ</th></tr></thead>
                <tbody>
                  {Object.entries(activePerSubj).sort(([, a], [, b]) => (b.ours - b.base) - (a.ours - a.base)).map(([subj, d]) => (
                    <tr key={subj}>
                      <td>{subj}</td>
                      <td style={{ textAlign: "right" }}>{d.base}%</td>
                      <td style={{ textAlign: "right", color: "var(--accent)", fontWeight: 600 }}>{d.ours}%</td>
                      <td style={{ textAlign: "right", color: "#7fc794" }}>+{(d.ours - d.base).toFixed(1)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                <a href="https://huggingface.co/Nalandadata/nalanda-image-vl" target="_blank" rel="noopener noreferrer" className="s-bench-link">↗ Model on HF</a>
                <a href="https://huggingface.co/datasets/Nalandadata/nalanda-image-qa" target="_blank" rel="noopener noreferrer" className="s-bench-link">↗ Dataset sample</a>
              </div>
            </>
          ) : (
            <>
              <div className="s-sp-tabs">
                <button className="s-sp-tab active">Task</button>
              </div>
              {(() => {
                const subjects = ["Maths", "Biology", "Physics", "Chemistry"];
                const ex = SUBJECT_EXAMPLES[subjects[activeIdx % subjects.length]] ?? SUBJECT_EXAMPLES.Maths;
                return (
                  <div className="s-sp-task">
                    <div className="s-sp-task-label">Sample question type · {ex.subj}</div>
                    <div className="s-sp-task-body">{ex.body}</div>
                    <div style={{ fontSize: "12.5px", color: "var(--muted-2)", marginTop: "10px", lineHeight: 1.6 }}>
                      <b style={{ color: "var(--muted)" }}>What it takes:</b> {ex.chain}
                    </div>
                  </div>
                );
              })()}
            </>
          )}
        </div>
      </div>

      {/* ── Reproducibility ── */}
      <section className="s-band">
        <div className="s-wrap">
          <p className="s-eyebrow">Reproducibility</p>
          <h2 style={{ fontSize: "clamp(22px,3vw,32px)", fontWeight: 800, letterSpacing: "-.025em", marginBottom: "12px" }}>Everything here is public.</h2>
          <p style={{ fontSize: "14.5px", color: "var(--muted)", marginBottom: "20px" }}>The fine-tuned model and a dataset sample are public, and the held-out questions are the same ones the baseline was scored on.</p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "12px" }}>
            <a className="s-btn ghost" href="https://huggingface.co/Nalandadata/nalanda-image-vl" target="_blank" rel="noopener noreferrer">Open the model on Hugging Face →</a>
            <a className="s-btn primary" href="https://huggingface.co/datasets/Nalandadata/nalanda-image-qa" target="_blank" rel="noopener noreferrer">Download a data sample →</a>
          </div>
        </div>
      </section>

      {/* ── Full leaderboard ── */}
      <section className="s-band alt" id="results">
        <div className="s-wrap">
          <p className="s-eyebrow">Results</p>
          <h2 style={{ fontSize: "clamp(22px,3vw,32px)", fontWeight: 800, letterSpacing: "-.025em", marginBottom: "20px" }}>Full leaderboard</h2>
          <div className="s-key-stat">
            <span className="kd">+{vsBase}pp</span>
            <span className="kl"><b>from QLoRA fine-tuning of LLaMA-3.2-Vision-11B</b>{baseRow?.accuracy ?? 37.7}% → {oursRow?.accuracy ?? 50.0}% over the zero-shot base, from a curated 22.7K-pair dataset — frontier models still lead on absolute accuracy.</span>
          </div>
          <div className="s-methbox">
            <h4>Methodology</h4>
            <p>{oursRow?.n_samples ?? 162} held-out scorable MCQs with expert ground-truth answers. Every model scored with identical exact-match scorer over its full response. Decoding is deterministic (greedy / temperature 0). <a href="https://huggingface.co/datasets/Nalandadata/nalanda-image-qa" target="_blank" rel="noopener noreferrer">Full methodology &amp; scoring on Hugging Face →</a></p>
          </div>
          <div className="s-lb-meta">
            <span className="lm">Nalanda Image VL · {oursRow?.n_samples ?? 162} held-out MCQs · {rows.length} models</span>
            <span className="ll">
              <a href="https://huggingface.co/datasets/Nalandadata/nalanda-image-qa" target="_blank" rel="noopener noreferrer">↗ HF dataset</a>
              <a href="https://huggingface.co/Nalandadata/nalanda-image-vl" target="_blank" rel="noopener noreferrer">↗ Model</a>
              <a href="https://huggingface.co/datasets/Nalandadata/nalanda-image-qa/tree/main/scripts" target="_blank" rel="noopener noreferrer">↗ Eval script</a>
            </span>
          </div>
          <div className="s-tablecard">
            <div className="s-tbl-scroll">
              <table style={{ minWidth: "420px" }}>
                <caption>Nalanda Image VL — {oursRow?.n_samples ?? 162} held-out STEM MCQs (accuracy, higher is better)</caption>
                <thead>
                  <tr>
                    <th>Model</th>
                    <th>Method</th>
                    <th style={{ textAlign: "right" }}>Accuracy</th>
                    <th style={{ textAlign: "right" }}>vs base</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map(row => (
                    <tr key={row.model} className={isOurs(row.category) ? "best" : ""}>
                      <th>
                        {row.model}
                        {isOurs(row.category) && <span className="badge">ours</span>}
                        {isBase(row.category) && <span style={{ color: "var(--accent)", fontFamily: "var(--mono)", fontSize: "11px", marginLeft: "8px" }}>baseline</span>}
                      </th>
                      <td>{row.method}</td>
                      <td style={{ textAlign: "right" }}>{row.accuracy}%</td>
                      <td style={{ textAlign: "right" }}>{row.vs_base != null ? <span className="s-dpos">+{row.vs_base}</span> : "—"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="cond">Honest ranking by real accuracy on the same {oursRow?.n_samples ?? 162} held-out questions. Fine-tuning lifts the open 11B model <b>+{vsBase} points</b> ({baseRow?.accuracy ?? 37.7}% → {oursRow?.accuracy ?? 50.0}%) — a large gain from a small curated dataset. Frontier models lead on absolute accuracy; the result here is the <b>fine-tuning gain</b>.</div>
          </div>

          {/* Per-subject table */}
          {Object.keys(PER_SUBJECT).length > 0 && (
            <>
              <h4 className="s-cb-title" style={{ marginTop: "30px" }}>Per-subject accuracy — fine-tuned vs base</h4>
              <div style={{ overflowX: "auto" }}>
                <table className="s-ptype-tbl">
                  <thead>
                    <tr>
                      <th>Subject</th>
                      <th style={{ textAlign: "right" }}>N</th>
                      <th style={{ textAlign: "right" }}>Base</th>
                      <th style={{ textAlign: "right" }}>Nalanda Image VL</th>
                      <th style={{ textAlign: "right" }}>Δ</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Object.entries(PER_SUBJECT).sort(([, a], [, b]) => (b.ours - b.base) - (a.ours - a.base)).map(([subj, d]) => (
                      <tr key={subj} className={subj === "Maths" ? "best" : ""}>
                        <th>{subj}</th>
                        <td style={{ textAlign: "right" }}>{d.n}</td>
                        <td style={{ textAlign: "right" }}>{d.base}</td>
                        <td style={{ textAlign: "right" }}>{d.ours}</td>
                        <td style={{ textAlign: "right" }} className="s-dpos">+{(d.ours - d.base).toFixed(1)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="s-cb-note">Per-subject accuracy (%) on the {oursRow?.n_samples ?? 162}-question held-out set. The largest gains land where the base model was weakest — Maths nearly doubled.</p>
            </>
          )}
        </div>
      </section>

      {/* ── 4 steps ── */}
      <section className="s-band" id="method">
        <div className="s-wrap">
          <p className="s-eyebrow">The approach</p>
          <h2 style={{ fontSize: "clamp(22px,3vw,32px)", fontWeight: 800, letterSpacing: "-.025em", marginBottom: "24px" }}>What we did, in four steps.</h2>
          <div className="s-dt-steps">
            <div className="s-dt-step"><div className="num">1</div><div><h5>Curate</h5><p><b>22,679 multimodal questions</b>, filtered from a pool of 180,505, spanning physics, mathematics, chemistry and biology — circuits, ray diagrams, geometric constructions, molecular structures and cell diagrams.</p></div></div>
            <div className="s-dt-step"><div className="num">2</div><div><h5>Reason-annotate</h5><p>Each answer carries a full <b>chain-of-thought explanation</b> that identifies the answer, names the underlying principle, and walks from the visual to the result. The model learns the path, not just the label.</p></div></div>
            <div className="s-dt-step"><div className="num">3</div><div><h5>Fine-tune</h5><p>QLoRA fine-tuning of <b>LLaMA-3.2-Vision-11B</b> in 4-bit, rank 32, on a single A100. The key choice: we train the <b>vision layers</b> as well as the language layers — science diagrams sit too far from natural images to freeze the encoder.</p></div></div>
            <div className="s-dt-step"><div className="num">4</div><div><h5>Evaluate</h5><p><b>162 held-out questions</b> the model never saw, each scored with its diagram, against the same model run zero-shot as the baseline. Broken down by subject, so it is clear where the gains land.</p></div></div>
          </div>
          <p style={{ fontSize: "12.5px", color: "var(--muted-2)", marginTop: "14px", lineHeight: 1.6 }}>
            To run your model on the public test set, use the <a href="https://huggingface.co/datasets/Nalandadata/nalanda-image-qa/tree/main/scripts" target="_blank" rel="noopener noreferrer" style={{ color: "var(--muted)" }}>evaluation script on Hugging Face</a> — no form required.
          </p>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="s-band alt s-cs-cta">
        <div className="s-wrap">
          <p className="s-eyebrow" style={{ justifyContent: "center" }}>Try it</p>
          <h2 style={{ fontSize: "clamp(25px,3.6vw,40px)", fontWeight: 800, letterSpacing: "-0.025em", lineHeight: 1.08, margin: 0, textAlign: "center" }}>Want a model that reads your diagrams?</h2>
          <div className="s-cta-row">
            <a className="s-btn primary" href="https://huggingface.co/datasets/Nalandadata/nalanda-image-qa" target="_blank" rel="noopener noreferrer">Download a sample</a>
            <Link className="s-btn ghost" to="/contact">Talk to a researcher</Link>
          </div>
        </div>
      </section>
    </div>
  );
}
