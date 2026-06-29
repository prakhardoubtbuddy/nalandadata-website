import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import API from "@/lib/api";

const FALLBACK = [
  { model: "DrishtiTable-Qwen3-VL-8B",   org: "Nalandadata", method: "Fine-tuned (SFT, research)", category: "ours-research", teds: 84.9, steds: 90.4, n_samples: 135, verified: true },
  { model: "DrishtiTable-Qwen2.5-VL-7B", org: "Nalandadata", method: "SFT (QLoRA)",                category: "ours",          teds: 83.2, steds: 89.7, n_samples: 135, verified: true },
  { model: "Claude Sonnet 4.6",           org: "Anthropic",   method: "Zero-shot",                  category: "frontier",      teds: 77.3, steds: 89.2, n_samples: 135, verified: true },
  { model: "Claude Opus 4.8",             org: "Anthropic",   method: "Zero-shot",                  category: "frontier",      teds: 75.5, steds: 88.2, n_samples: 135, verified: true },
  { model: "GPT-4o",                      org: "OpenAI",      method: "Zero-shot",                  category: "frontier",      teds: 71.1, steds: 84.3, n_samples: 135, verified: true },
  { model: "GPT-5.1",                     org: "OpenAI",      method: "Zero-shot",                  category: "frontier",      teds: 69.9, steds: 83.3, n_samples: 135, verified: true },
  { model: "GPT-4.1",                     org: "OpenAI",      method: "Zero-shot",                  category: "frontier",      teds: 68.0, steds: 80.8, n_samples: 135, verified: true },
  { model: "Gemini 3.1 Pro",              org: "Google",      method: "Zero-shot",                  category: "frontier",      teds: 65.7, steds: 73.6, n_samples: 135, verified: true },
  { model: "GPT-5 mini",                  org: "OpenAI",      method: "Zero-shot",                  category: "frontier",      teds: 62.2, steds: 72.7, n_samples: 135, verified: true },
  { model: "o4-mini",                     org: "OpenAI",      method: "Zero-shot",                  category: "frontier",      teds: 61.4, steds: 70.0, n_samples: 135, verified: true },
  { model: "Qwen2.5-VL-7B",              org: "Alibaba",     method: "Zero-shot",                  category: "open",          teds: 58.8, steds: 74.0, n_samples: 135, verified: true },
];

const isOurs = (cat) => cat && (cat === "ours" || cat.startsWith("ours"));

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
      <svg viewBox="0 0 24 24" width="11" height="11" fill="white" fillRule="evenodd">
        <path d="M14.4 2L22 21.6h-4.16l-1.62-4.3H7.78L6.16 21.6H2L9.6 2h4.8zm-2.4 5.9L9.3 14.56h5.4l-2.7-6.66z"/>
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
    <div className="s-sp-icon" style={{ background: "#FF6A00" }}>
      <svg viewBox="0 0 24 24" width="11" height="11" fill="white">
        <text x="4" y="17" fontSize="13" fontWeight="800" fontFamily="Arial">A</text>
      </svg>
    </div>
  );
}

export default function DrishtiTableDetailPage() {
  const [rows, setRows] = useState(FALLBACK);
  const [activeIdx, setActiveIdx] = useState(0);
  const [compSet, setCompSet] = useState("full");

  useEffect(() => {
    axios.get(`${API}/hf/leaderboard`).then(r => { if (r.data?.rows?.length) setRows(r.data.rows); }).catch(() => {});
  }, []);

  const topTeds  = rows[0]?.teds ?? 84.9;
  const topSteds = Math.max(...rows.map(r => r.steds ?? 0));
  const oursRows = rows.filter(r => isOurs(r.category));
  const frontier = rows.filter(r => r.category === "frontier");
  const vsBest   = oursRows[0] && frontier[0] ? (oursRows[0].teds - frontier[0].teds).toFixed(1) : "7.5";
  const active   = rows[activeIdx] ?? rows[0];

  function badge(row) {
    if (row.category === "ours-research") return "ours · research";
    if (isOurs(row.category)) return "ours · released";
    return null;
  }

  return (
    <div className="bg-[#0A0A0A]" style={{ paddingTop: "96px" }}>

      {/* Breadcrumb */}
      <div className="s-crumb">
        <div className="s-wrap s-crumb-inner">
          <Link to="/">Home</Link>
          <span style={{ opacity: .4 }}>/</span>
          <Link to="/benchmarks">Benchmarks</Link>
          <span style={{ opacity: .4 }}>/</span>
          <span>DrishtiTable</span>
        </div>
      </div>

      {/* Page header */}
      <div className="s-detail-header">
        <div className="s-wrap">
          <p className="s-eyebrow">Table Structure Recognition · TEDS</p>
          <h1>DrishtiTable</h1>
          <p className="sub">Image → HTML table recognition on {rows[0]?.n_samples ?? 135} held-out Indian-textbook tables. A fine-tuned 8B model leads every frontier model — domain-specific training beats scale.</p>
        </div>
      </div>

      {/* ── Split panel ── */}
      <div className="s-split-panel">

        {/* LEFT: ranked list */}
        <div className="s-sp-left">
          <div className="s-sp-head">
            <span className="s-sp-head-label">Leaderboard · TEDS</span>
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
                  {badge(row) && <span className="s-sp-badge">{badge(row)}</span>}
                </div>
                <div className="s-sp-bar-track">
                  <div className="s-sp-bar-fill" style={{ width: `${((row.teds / topTeds) * 100).toFixed(1)}%` }} />
                </div>
              </div>
              <div className="s-sp-score-col">
                <div className="s-sp-score">{row.teds}%</div>
                <div className="s-sp-delta">{i === 0 ? "—" : `−${(topTeds - row.teds).toFixed(1)}`}</div>
              </div>
            </div>
          ))}
        </div>

        {/* RIGHT: detail */}
        <div className="s-sp-right">
          <div className="s-sp-detail-head">
            <ProviderIcon org={active?.org ?? "Nalandadata"} />
            <span className="s-sp-detail-name">{active?.model}</span>
            <span style={{ color: "var(--muted-2)", margin: "0 4px" }}>|</span>
            <span className="s-sp-detail-score">{active?.teds}% TEDS</span>
          </div>
          <div style={{ fontSize: "12.5px", color: "var(--muted-2)", marginBottom: "18px" }}>
            {active?.n_samples ?? 135} tables · {active?.method} · S-TEDS {active?.steds}%
          </div>

          <div className="s-sp-tabs">
            <button className="s-sp-tab active">Task</button>
            <button className="s-sp-tab">Environment</button>
            <button className="s-sp-tab">Trajectory</button>
          </div>
          <p style={{ fontSize: "11.5px", color: "var(--muted-2)", lineHeight: 1.6, marginBottom: "16px" }}>
            Sample task for illustration only. The held-out test set is not publicly released.
          </p>
          <div className="s-sp-task">
            <div className="s-sp-task-label">Input — table image</div>
            <div className="s-sp-task-body">A multi-header statistical table from a Business Statistics textbook showing quarterly sales data across 4 regions with subtotals and a grand total row.</div>
            <div style={{ width: "100%", height: "64px", background: "var(--ink)", border: "1px dashed var(--line)", borderRadius: "6px", display: "flex", alignItems: "center", justifyContent: "center", marginTop: "10px", fontFamily: "var(--mono)", fontSize: "10px", color: "var(--muted-2)" }}>
              [ table image — held-out test set ]
            </div>
          </div>
          <table className="s-sp-crit">
            <thead><tr><th>Criterion</th><th>Result</th></tr></thead>
            <tbody>
              <tr><td>Correct row count</td><td><span className="s-sp-pill-yes">Yes</span></td></tr>
              <tr><td>Merged cells preserved</td><td><span className="s-sp-pill-yes">Yes</span></td></tr>
              <tr><td>Header hierarchy correct</td><td><span className="s-sp-pill-yes">Yes</span></td></tr>
              <tr><td>Cell content exact match</td><td><span className="s-sp-pill-yes">Yes</span></td></tr>
            </tbody>
          </table>
          <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginTop: "16px" }}>
            <a href="https://huggingface.co/datasets/Nalandadata/DrishtiTable" target="_blank" rel="noopener noreferrer" className="s-bench-link">↗ HF Dataset</a>
            <a href="https://huggingface.co/Nalandadata" target="_blank" rel="noopener noreferrer" className="s-bench-link">↗ Model weights</a>
          </div>
        </div>
      </div>

      {/* ── Results ── */}
      <section className="s-band" id="results">
        <div className="s-wrap">
          <p className="s-eyebrow">Results</p>
          <h2 style={{ fontSize: "clamp(22px,3vw,32px)", fontWeight: 800, letterSpacing: "-.025em", marginBottom: "20px" }}>Full leaderboard</h2>

          <div className="s-key-stat">
            <span className="kd">{topTeds}% TEDS</span>
            <span className="kl"><b>top result — the fine-tuned 8B, +{vsBest} points over the best frontier model (Claude Sonnet 4.6)</b>The released 7B is right behind at {oursRows[1]?.teds ?? 83.2}%, itself ahead of every frontier model tested.</span>
          </div>

          <div className="s-methbox">
            <h4>Methodology</h4>
            <p>{rows[0]?.n_samples ?? 135} held-out Indian-textbook tables, never seen during training. Each table is provided as an image; models output the HTML table structure. Evaluated using TEDS against expert-verified ground-truth HTML. <a href="https://huggingface.co/datasets/Nalandadata/DrishtiTable" target="_blank" rel="noopener noreferrer">Full methodology &amp; dataset on Hugging Face →</a></p>
          </div>

          <div className="s-lb-meta">
            <span className="lm">DrishtiTable · {rows[0]?.n_samples ?? 135} held-out tables · {rows.length} models</span>
            <span className="ll">
              <a href="https://huggingface.co/datasets/Nalandadata/DrishtiTable" target="_blank" rel="noopener noreferrer">↗ HF dataset</a>
              <a href="https://huggingface.co/spaces/Nalandadata/DrishtiTable-Leaderboard" target="_blank" rel="noopener noreferrer">↗ Eval script</a>
            </span>
          </div>

          <div className="s-tablecard">
            <div className="s-tbl-scroll">
              <table style={{ minWidth: "540px" }}>
                <caption>DrishtiTable — {rows[0]?.n_samples ?? 135} held-out tables (image → HTML, TEDS)</caption>
                <thead>
                  <tr>
                    <th>Model</th>
                    <th>Method</th>
                    <th style={{ textAlign: "right" }}>TEDS</th>
                    <th style={{ textAlign: "right" }}>S-TEDS</th>
                    <th style={{ textAlign: "right" }}>Δ vs #1</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((row, i) => {
                    const b = badge(row);
                    return (
                      <tr key={row.model} className={isOurs(row.category) ? "best" : ""}>
                        <th>{row.model}{b && <span className="badge">{b}</span>}</th>
                        <td>{row.method}</td>
                        <td style={{ textAlign: "right" }}>{row.teds}%</td>
                        <td style={{ textAlign: "right" }}>{row.steds != null ? `${row.steds}%` : "—"}</td>
                        <td style={{ textAlign: "right" }}>{i === 0 ? "—" : <span className="s-dneg">−{(topTeds - row.teds).toFixed(1)}</span>}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            <div className="cond">Image → HTML recognition on {rows[0]?.n_samples ?? 135} held-out Indian-textbook tables, ranked by TEDS. The fine-tuned <b>8B tops the board at {topTeds}%</b>; the released 7B is right behind at <b>{oursRows[1]?.teds ?? 83.2}%</b> — both ahead of every frontier model tested.</div>
          </div>

          {/* TEDS bar chart */}
          <div className="s-chart-block" style={{ marginTop: "26px" }}>
            <p className="s-cb-eyebrow">Figure 1 · Results</p>
            <h4 className="s-cb-title">TEDS by model — {rows[0]?.n_samples ?? 135} held-out tables</h4>
            {rows.slice(0, 8).map(row => (
              <BarRow key={row.model} label={row.model.replace("DrishtiTable-", "DT-")} width={`${((row.teds / topTeds) * 100).toFixed(1)}%`} value={`${row.teds}%`} isOurs={isOurs(row.category)} />
            ))}
            <p className="s-cb-note">TEDS (Tree-Edit-Distance Similarity), 0–100%. Higher is better.</p>
          </div>

          {/* S-TEDS bar chart */}
          <div className="s-chart-block">
            <p className="s-cb-eyebrow">Figure 1b · Structure only</p>
            <h4 className="s-cb-title">S-TEDS by model — layout / grid accuracy</h4>
            {[...rows].filter(r => r.steds != null).sort((a, b) => b.steds - a.steds).slice(0, 8).map(row => (
              <BarRow key={row.model} label={row.model.replace("DrishtiTable-", "DT-")} width={`${((row.steds / topSteds) * 100).toFixed(1)}%`} value={`${row.steds}%`} isOurs={isOurs(row.category)} />
            ))}
            <p className="s-cb-note">S-TEDS scores layout/structure only. Fine-tuned models lead on getting the whole grid right.</p>
          </div>
        </div>
      </section>

      {/* ── Corpus ── */}
      <section className="s-band alt" id="corpus">
        <div className="s-wrap">
          <p className="s-eyebrow">Corpus</p>
          <h2 style={{ fontSize: "clamp(22px,3vw,32px)", fontWeight: 800, letterSpacing: "-.025em", marginBottom: "8px" }}>Dataset composition</h2>
          <p style={{ fontSize: "14px", color: "var(--muted)", marginBottom: "22px" }}>1,421 tables across 9 Indian academic textbooks.</p>

          <div className="s-toggle">
            <button className={compSet === "full" ? "active" : ""} onClick={() => setCompSet("full")}>Full corpus (1,421)</button>
            <button className={compSet === "test" ? "active" : ""} onClick={() => setCompSet("test")}>Test set (135)</button>
          </div>

          {compSet === "full" ? (
            <div className="s-dist-grid">
              <div className="s-chart-block">
                <p className="s-cb-eyebrow">Figure 2 · Composition</p>
                <h4 className="s-cb-title">By table type</h4>
                <BarRow label="Statistical" width="100%"  value="684" /><BarRow label="Financial" width="67.1%" value="459" />
                <BarRow label="Lookup"      width="31.7%" value="217" /><BarRow label="Comparison" width="7.2%" value="49" />
              </div>
              <div className="s-chart-block">
                <p className="s-cb-eyebrow">Figure 3 · Composition</p>
                <h4 className="s-cb-title">By subject</h4>
                <BarRow label="Business Statistics" width="100%"  value="535" /><BarRow label="Business & Finance" width="82.1%" value="439" />
                <BarRow label="Quant. / OR"         width="36.8%" value="197" /><BarRow label="Fin. Accounting"    width="32%"   value="171" />
              </div>
              <div className="s-chart-block">
                <p className="s-cb-eyebrow">Figure 4 · Composition</p>
                <h4 className="s-cb-title">By complexity</h4>
                <BarRow label="Simple" width="100%" value="1136" /><BarRow label="Complex" width="25.1%" value="285" />
              </div>
            </div>
          ) : (
            <div className="s-dist-grid">
              <div className="s-chart-block">
                <p className="s-cb-eyebrow">Figure 2 · Composition</p>
                <h4 className="s-cb-title">By table type</h4>
                <BarRow label="Statistical" width="100%"  value="72" /><BarRow label="Financial" width="61.1%" value="44" />
                <BarRow label="Lookup"      width="20.8%" value="15" /><BarRow label="Comparison" width="4.2%" value="3" />
              </div>
              <div className="s-chart-block">
                <p className="s-cb-eyebrow">Figure 3 · Composition</p>
                <h4 className="s-cb-title">By subject</h4>
                <BarRow label="Business Statistics" width="100%"  value="53" /><BarRow label="Business & Finance" width="81.1%" value="43" />
                <BarRow label="Quant. / OR"         width="37.7%" value="20" /><BarRow label="Fin. Accounting"    width="28.3%" value="15" />
              </div>
              <div className="s-chart-block">
                <p className="s-cb-eyebrow">Figure 4 · Composition</p>
                <h4 className="s-cb-title">By complexity</h4>
                <BarRow label="Simple" width="100%" value="110" /><BarRow label="Complex" width="22.7%" value="25" />
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ── Breakdown ── */}
      <section className="s-band" id="breakdown">
        <div className="s-wrap">
          <p className="s-cb-eyebrow">Figure 5 · Where models break</p>
          <h4 className="s-cb-title" style={{ fontSize: "clamp(18px,2.5vw,26px)", fontWeight: 800, marginBottom: "8px" }}>TEDS by table type</h4>
          <p style={{ fontSize: "14px", color: "var(--muted)", marginBottom: "20px" }}>Frontier models collapse hardest on Financial tables — where the fine-tuned model leads by <b style={{ color: "var(--accent)" }}>15–19 points</b>.</p>
          <div style={{ overflowX: "auto" }}>
            <table className="s-ptype-tbl">
              <thead><tr><th>Model</th><th>Statistical</th><th>Financial</th><th>Lookup</th><th>Comparison</th></tr></thead>
              <tbody>
                <tr className="best"><th>DrishtiTable 8B (research)</th><td>85.0</td><td>82.6</td><td>89.2</td><td>93.2</td></tr>
                <tr className="best"><th>DrishtiTable 7B (released)</th><td>82.8</td><td>82.0</td><td>85.7</td><td>95.9</td></tr>
                <tr><th>Claude Sonnet 4.6</th><td>81.8</td><td>66.9</td><td>85.3</td><td>94.6</td></tr>
                <tr><th>Claude Opus 4.8</th><td>81.2</td><td>63.4</td><td>80.0</td><td>94.7</td></tr>
                <tr><th>GPT-5.1</th><td>77.4</td><td>56.0</td><td>74.6</td><td>75.6</td></tr>
                <tr><th>Gemini 3.1 Pro</th><td>73.8</td><td>53.5</td><td>61.6</td><td>88.4</td></tr>
              </tbody>
            </table>
          </div>
          <p className="s-cb-note">Per-type TEDS (%) on the {rows[0]?.n_samples ?? 135}-table test set. Frontier models collapse hardest on <b style={{ color: "var(--accent)" }}>Financial</b> tables — where the fine-tuned model leads by <b style={{ color: "var(--accent)" }}>15–19 points</b> (82.0 vs 53–67).</p>
        </div>
      </section>

      {/* ── How it was built ── */}
      <section className="s-band alt" id="method">
        <div className="s-wrap">
          <p className="s-eyebrow">Method</p>
          <h2 style={{ fontSize: "clamp(22px,3vw,32px)", fontWeight: 800, letterSpacing: "-.025em", marginBottom: "24px" }}>How it was built — four reproducible steps</h2>
          <div className="s-dt-steps">
            <div className="s-dt-step"><div className="num">1</div><div><h5>Curate &amp; annotate</h5><p>1,421 tables sourced from 9 S. Chand textbooks, each manually annotated to ground-truth HTML with semantic structure (thead/tbody, colspan/rowspan, formatting) by subject-matter experts.</p></div></div>
            <div className="s-dt-step"><div className="num">2</div><div><h5>Split &amp; freeze</h5><p>Split 1,141 train / 145 val / 135 test. The test set is content-hashed and held private to prevent contamination. The public sample mirrors the structure and difficulty of the full set.</p></div></div>
            <div className="s-dt-step"><div className="num">3</div><div><h5>Fine-tune (QLoRA)</h5><p>Qwen2.5-VL-7B fine-tuned with 4-bit QLoRA via Unsloth on a single A100 — approximately 35 minutes of compute. The 8B research variant uses full SFT on the same data.</p></div></div>
            <div className="s-dt-step"><div className="num">4</div><div><h5>Evaluate (TEDS)</h5><p>Every model scored with the canonical TEDS scorer against expert ground truth. Top frontier failure modes: content divergence, row-count mismatch, flattened merged headers.</p></div></div>
          </div>
          <p style={{ fontSize: "12.5px", color: "var(--muted-2)", marginTop: "14px", lineHeight: 1.6 }}>
            To run your model on the public test set, use the <a href="https://huggingface.co/datasets/Nalandadata/DrishtiTable" target="_blank" rel="noopener noreferrer" style={{ color: "var(--muted)" }}>evaluation script on Hugging Face</a> — no form required. To submit to the held-out leaderboard, request access below.
          </p>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="s-band s-cs-cta">
        <div className="s-wrap">
          <p className="s-eyebrow" style={{ justifyContent: "center" }}>Get on the leaderboard</p>
          <h2 style={{ fontSize: "clamp(25px,3.6vw,40px)", fontWeight: 800, letterSpacing: "-0.025em", lineHeight: 1.08, margin: 0, textAlign: "center" }}>Two ways in.</h2>
          <p style={{ margin: "18px auto 0", maxWidth: "56ch", color: "var(--muted)", textAlign: "center" }}>Submit your model to the held-out leaderboard, or license the full dataset.</p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 280px), 1fr))", gap: "20px", maxWidth: "680px", margin: "28px auto 0", textAlign: "left" }}>
            <div style={{ background: "var(--ink)", border: "1px solid var(--line)", borderRadius: "10px", padding: "24px" }}>
              <h3 style={{ fontSize: "13px", fontFamily: "var(--mono)", letterSpacing: "0.05em", textTransform: "uppercase", margin: "0 0 8px", fontWeight: 800 }}>Submit a model</h3>
              <p style={{ fontSize: "13px", color: "var(--muted)", margin: "0 0 18px", lineHeight: 1.55 }}>Evaluate on the held-out test set and appear on the public leaderboard. Open to any model, any lab.</p>
              <Link className="s-btn primary" to="/contact" style={{ display: "block", textAlign: "center" }}>Submit a model →</Link>
            </div>
            <div style={{ background: "var(--ink)", border: "1px solid var(--line)", borderRadius: "10px", padding: "24px" }}>
              <h3 style={{ fontSize: "13px", fontFamily: "var(--mono)", letterSpacing: "0.05em", textTransform: "uppercase", margin: "0 0 8px", fontWeight: 800 }}>License the dataset</h3>
              <p style={{ fontSize: "13px", color: "var(--muted)", margin: "0 0 18px", lineHeight: 1.55 }}>Access the full benchmark dataset for training, evaluation, or your own pipeline.</p>
              <Link className="s-btn ghost" to="/contact" style={{ display: "block", textAlign: "center" }}>License the dataset →</Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
