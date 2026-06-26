import { useState } from "react";
import { Link } from "react-router-dom";

function BarRow({ label, width, value, isOurs }) {
  return (
    <div className={`s-bar-row${isOurs ? " ours" : ""}`}>
      <span className="s-bar-label">{label}</span>
      <span className="s-bar-track"><span className="s-bar-fill" style={{ width }} /></span>
      <span className="s-bar-val">{value}</span>
    </div>
  );
}

export default function BenchmarksPage() {
  const [activeTab, setActiveTab] = useState("drishtitable");
  const [compSet, setCompSet] = useState("full");

  const tabs = [
    { id: "drishtitable", name: "DrishtiTable", sub: "84.9% TEDS · +7.5pp vs best frontier" },
    { id: "nalandabench", name: "NalandaBench V1", sub: "66.8% accuracy · +6.3pp via GRPO" },
    { id: "imageqa", name: "Nalanda Image VL", sub: "+12.3pp vs base · STEM-VL" },
  ];

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
            <p>A fine-tuned 8B model leads every frontier model on Indian table recognition — <span>+7.5 points over the best</span> (Claude Sonnet 4.6); the released 7B is right behind. Domain-specific training beats scale.</p>
          </div>
          <div className="s-hero-cta">
            <Link className="s-btn primary" to="/contact">License the dataset →</Link>
            <a className="s-btn ghost" href="https://huggingface.co/Nalandadata" target="_blank" rel="noopener noreferrer">Browse on Hugging Face →</a>
          </div>
        </div>
      </section>

      {/* Statband */}
      <section className="s-band" style={{ paddingTop: "clamp(30px,4vw,48px)" }}>
        <div className="s-wrap">
          <div className="s-statband" style={{ marginTop: 0 }}>
            <div><div className="sv">116,831</div><div className="sl">Expert solutions (JEE/NEET)</div></div>
            <div><div className="sv">800</div><div className="sl">Held-out eval questions</div></div>
            <div><div className="sv">100%</div><div className="sl">Verified correct answers</div></div>
            <div><div className="sv">Public</div><div className="sl">Model, data &amp; test set</div></div>
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

      {/* Leaderboard section */}
      <section className="s-band" id="leaderboard">
        <div className="s-wrap">
          <div className="s-sec-head">
            <p className="s-eyebrow">Leaderboard</p>
            <h2>Benchmark results.</h2>
            <p className="lead">Two held-out benchmarks live, with domain-specific variants in progress. Select a benchmark to view its leaderboard.</p>
          </div>

          {/* Tab nav */}
          <div className="s-bench-nav">
            <div className="s-bench-tabs">
              {tabs.map((t) => (
                <button
                  key={t.id}
                  className={`s-bench-tab${activeTab === t.id ? " active" : ""}`}
                  onClick={() => setActiveTab(t.id)}
                >
                  <span className="tn">{t.name}</span>
                  <span className="ts">{t.sub}</span>
                </button>
              ))}
            </div>
          </div>

          {/* DrishtiTable panel */}
          <div className={`s-bench-panel${activeTab === "drishtitable" ? " active" : ""}`}>
            <div className="s-bench-h">
              <h3>DrishtiTable — Table Structure Recognition</h3>
              <p>Image → HTML table recognition on 135 held-out Indian-textbook tables, ranked by TEDS (Tree-Edit-Distance-based Similarity). Tests a model's ability to parse the structure of tables as Indian students and researchers actually encounter them.</p>
            </div>
            <div className="s-key-stat">
              <span className="kd">84.9% TEDS</span>
              <span className="kl"><b>top result — the fine-tuned 8B, +7.5 points over the best frontier model (Claude Sonnet 4.6)</b>The released 7B is right behind at 83.2%, itself ahead of every frontier model tested</span>
            </div>
            <div className="s-methbox">
              <h4>Methodology</h4>
              <p>135 held-out Indian-textbook tables, never seen during training. Each table is provided as an image; models output the HTML table structure. Evaluated using TEDS against expert-verified ground-truth HTML. The fine-tuned model was trained on the DrishtiTable dataset — a domain-specific corpus of Indian educational tables. <a href="https://huggingface.co/datasets/Nalandadata/DrishtiTable" target="_blank" rel="noopener noreferrer">Full methodology &amp; dataset on Hugging Face →</a></p>
            </div>

            {/* Feature cards */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))", gap: "16px", margin: "26px 0" }}>
              {[
                { n: "01", h: "Expert Annotation", p: "1,421 tables hand-annotated to ground-truth HTML — headers, merged cells, hierarchy — by domain experts." },
                { n: "02", h: "Domain Diversity", p: "9 source books, 6 subject families, 5 table types — from simple grids to complex financial statements." },
                { n: "03", h: "Held-out Benchmark", p: "135-table frozen test set, never seen in training, scored with the standard TEDS metric." },
                { n: "04", h: "Open & Reproducible", p: "Public sample + eval script on Hugging Face (Apache-2.0). Run any model on the test set — no form required." },
              ].map((f) => (
                <div key={f.n} style={{ border: "1px solid var(--line)", borderRadius: "14px", background: "var(--panel)", padding: "22px" }}>
                  <div style={{ fontFamily: "var(--mono)", color: "var(--accent)", fontSize: "12px", letterSpacing: ".1em", marginBottom: "12px" }}>{f.n}</div>
                  <h4 style={{ fontSize: "15px", margin: "0 0 9px", color: "var(--paper)", fontWeight: 600 }}>{f.h}</h4>
                  <p style={{ fontSize: "13.5px", color: "var(--muted)", margin: 0, lineHeight: 1.55 }}>{f.p}</p>
                </div>
              ))}
            </div>

            <div className="s-lb-meta">
              <span className="lm">DrishtiTable · 135 held-out tables · 11 models</span>
              <span className="ll">
                <a href="https://huggingface.co/datasets/Nalandadata/DrishtiTable" target="_blank" rel="noopener noreferrer">↗ HF dataset</a>
                <a href="https://huggingface.co/spaces/nalanda-data/DrishtiTable-Leaderboard" target="_blank" rel="noopener noreferrer">↗ Eval script</a>
              </span>
            </div>

            <div className="s-tablecard">
              <div className="s-tbl-scroll">
                <table>
                  <caption>DrishtiTable — 135 held-out tables (image → HTML, TEDS)</caption>
                  <thead><tr><th>Model</th><th>Method</th><th style={{ textAlign: "right" }}>TEDS</th><th style={{ textAlign: "right" }}>S-TEDS</th><th style={{ textAlign: "right" }}>Δ vs #1</th></tr></thead>
                  <tbody>
                    <tr className="best"><th>DrishtiTable-Qwen3-VL-8B <span className="badge">ours · research</span></th><td>Fine-tuned (SFT, research)</td><td style={{ textAlign: "right" }}>84.9%</td><td style={{ textAlign: "right" }}>90.4%</td><td style={{ textAlign: "right" }}>—</td></tr>
                    <tr className="best"><th>DrishtiTable-Qwen2.5-VL-7B <span className="badge">ours · released</span></th><td>SFT (QLoRA)</td><td style={{ textAlign: "right" }}>83.2%</td><td style={{ textAlign: "right" }}>89.7%</td><td style={{ textAlign: "right" }}><span className="s-dneg">−1.7</span></td></tr>
                    <tr><th>Claude Sonnet 4.6</th><td>Zero-shot</td><td style={{ textAlign: "right" }}>77.3%</td><td style={{ textAlign: "right" }}>89.2%</td><td style={{ textAlign: "right" }}><span className="s-dneg">−7.6</span></td></tr>
                    <tr><th>Claude Opus 4.8</th><td>Zero-shot</td><td style={{ textAlign: "right" }}>75.5%</td><td style={{ textAlign: "right" }}>88.2%</td><td style={{ textAlign: "right" }}><span className="s-dneg">−9.4</span></td></tr>
                    <tr><th>GPT-4o</th><td>Zero-shot</td><td style={{ textAlign: "right" }}>71.1%</td><td style={{ textAlign: "right" }}>84.3%</td><td style={{ textAlign: "right" }}><span className="s-dneg">−13.8</span></td></tr>
                    <tr><th>GPT-5.1</th><td>Zero-shot</td><td style={{ textAlign: "right" }}>69.9%</td><td style={{ textAlign: "right" }}>83.3%</td><td style={{ textAlign: "right" }}><span className="s-dneg">−15.0</span></td></tr>
                    <tr><th>GPT-4.1</th><td>Zero-shot</td><td style={{ textAlign: "right" }}>68.0%</td><td style={{ textAlign: "right" }}>80.8%</td><td style={{ textAlign: "right" }}><span className="s-dneg">−16.9</span></td></tr>
                    <tr><th>Gemini 3.1 Pro</th><td>Zero-shot</td><td style={{ textAlign: "right" }}>65.7%</td><td style={{ textAlign: "right" }}>73.6%</td><td style={{ textAlign: "right" }}><span className="s-dneg">−19.2</span></td></tr>
                    <tr><th>GPT-5 mini</th><td>Zero-shot</td><td style={{ textAlign: "right" }}>62.2%</td><td style={{ textAlign: "right" }}>72.7%</td><td style={{ textAlign: "right" }}><span className="s-dneg">−22.7</span></td></tr>
                    <tr><th>o4-mini</th><td>Zero-shot</td><td style={{ textAlign: "right" }}>61.4%</td><td style={{ textAlign: "right" }}>70.0%</td><td style={{ textAlign: "right" }}><span className="s-dneg">−23.5</span></td></tr>
                    <tr><th>Qwen2.5-VL-7B</th><td>Zero-shot</td><td style={{ textAlign: "right" }}>58.8%</td><td style={{ textAlign: "right" }}>74.0%</td><td style={{ textAlign: "right" }}><span className="s-dneg">−26.1</span></td></tr>
                  </tbody>
                </table>
              </div>
              <div className="cond">Image → HTML recognition on 135 held-out Indian-textbook tables, ranked by TEDS. The fine-tuned <b>8B research variant tops the board at 84.9%</b>; the publicly released 7B is right behind at <b>83.2%</b> — both ahead of every frontier model tested.</div>
            </div>

            {/* TEDS bar chart */}
            <div className="s-chart-block" style={{ marginTop: "26px" }}>
              <p className="s-cb-eyebrow">Figure 1 · Results</p>
              <h4 className="s-cb-title">TEDS by model — 135 held-out tables</h4>
              <BarRow label="DrishtiTable (ours)" width="100%" value="83.2%" isOurs />
              <BarRow label="Claude Sonnet 4.6" width="93%" value="77.3%" />
              <BarRow label="Claude Opus 4.8" width="90.7%" value="75.5%" />
              <BarRow label="GPT-4o" width="85.5%" value="71.1%" />
              <BarRow label="GPT-5.1" width="84%" value="69.9%" />
              <BarRow label="GPT-4.1" width="81.7%" value="68.0%" />
              <p className="s-cb-note">TEDS (Tree-Edit-Distance Similarity), 0–100%. Higher is better.</p>
            </div>

            {/* S-TEDS bar chart */}
            <div className="s-chart-block">
              <p className="s-cb-eyebrow">Figure 1b · Structure only</p>
              <h4 className="s-cb-title">S-TEDS by model — layout / grid accuracy</h4>
              <BarRow label="DrishtiTable (ours)" width="100%" value="89.7%" isOurs />
              <BarRow label="Claude Sonnet 4.6" width="99.5%" value="89.2%" />
              <BarRow label="Claude Opus 4.8" width="98.3%" value="88.2%" />
              <BarRow label="GPT-4o" width="94%" value="84.3%" />
              <BarRow label="GPT-5.1" width="92.9%" value="83.3%" />
              <BarRow label="GPT-4.1" width="90.1%" value="80.8%" />
              <p className="s-cb-note">S-TEDS scores layout/structure only. The fine-tuned model leads on getting the whole grid right.</p>
            </div>

            {/* Composition toggle */}
            <div className="s-toggle">
              <button className={compSet === "full" ? "active" : ""} onClick={() => setCompSet("full")}>Full corpus (1,421)</button>
              <button className={compSet === "test" ? "active" : ""} onClick={() => setCompSet("test")}>Test set (135)</button>
            </div>

            {compSet === "full" ? (
              <div className="s-dist-grid">
                <div className="s-chart-block">
                  <p className="s-cb-eyebrow">Figure 2 · Composition</p>
                  <h4 className="s-cb-title">By table type</h4>
                  <BarRow label="Statistical" width="100%" value="684" />
                  <BarRow label="Financial" width="67.1%" value="459" />
                  <BarRow label="Lookup" width="31.7%" value="217" />
                  <BarRow label="Comparison" width="7.2%" value="49" />
                </div>
                <div className="s-chart-block">
                  <p className="s-cb-eyebrow">Figure 3 · Composition</p>
                  <h4 className="s-cb-title">By subject</h4>
                  <BarRow label="Business Statistics" width="100%" value="535" />
                  <BarRow label="Business & Finance" width="82.1%" value="439" />
                  <BarRow label="Quant. / OR" width="36.8%" value="197" />
                  <BarRow label="Fin. Accounting" width="32%" value="171" />
                </div>
                <div className="s-chart-block">
                  <p className="s-cb-eyebrow">Figure 4 · Composition</p>
                  <h4 className="s-cb-title">By complexity</h4>
                  <BarRow label="Simple" width="100%" value="1136" />
                  <BarRow label="Complex" width="25.1%" value="285" />
                </div>
              </div>
            ) : (
              <div className="s-dist-grid">
                <div className="s-chart-block">
                  <p className="s-cb-eyebrow">Figure 2 · Composition</p>
                  <h4 className="s-cb-title">By table type</h4>
                  <BarRow label="Statistical" width="100%" value="72" />
                  <BarRow label="Financial" width="61.1%" value="44" />
                  <BarRow label="Lookup" width="20.8%" value="15" />
                  <BarRow label="Comparison" width="4.2%" value="3" />
                </div>
                <div className="s-chart-block">
                  <p className="s-cb-eyebrow">Figure 3 · Composition</p>
                  <h4 className="s-cb-title">By subject</h4>
                  <BarRow label="Business Statistics" width="100%" value="53" />
                  <BarRow label="Business & Finance" width="81.1%" value="43" />
                  <BarRow label="Quant. / OR" width="37.7%" value="20" />
                  <BarRow label="Fin. Accounting" width="28.3%" value="15" />
                </div>
                <div className="s-chart-block">
                  <p className="s-cb-eyebrow">Figure 4 · Composition</p>
                  <h4 className="s-cb-title">By complexity</h4>
                  <BarRow label="Simple" width="100%" value="110" />
                  <BarRow label="Complex" width="22.7%" value="25" />
                </div>
              </div>
            )}

            {/* Per-type breakdown */}
            <div className="s-chart-block" style={{ marginTop: "18px" }}>
              <p className="s-cb-eyebrow">Figure 5 · Where models break</p>
              <h4 className="s-cb-title">TEDS by table type</h4>
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
              <p className="s-cb-note">Per-type TEDS (%) on the 135-table test set. Frontier models collapse hardest on <b style={{ color: "var(--accent)" }}>Financial</b> tables — where the fine-tuned model leads by <b style={{ color: "var(--accent)" }}>15–19 points</b> (82.0 vs 53–67).</p>
            </div>

            {/* Steps */}
            <div className="s-dt-steps">
              <p className="sh">How it was built — four reproducible steps</p>
              <div className="s-dt-step"><div className="num">1</div><div><h5>Curate &amp; annotate</h5><p>1,421 tables sourced from 9 S. Chand textbooks, each manually annotated to ground-truth HTML with semantic structure (thead/tbody, colspan/rowspan, formatting).</p></div></div>
              <div className="s-dt-step"><div className="num">2</div><div><h5>Split &amp; freeze</h5><p>Split 1,141 train / 145 val / 135 test. The test set is content-hashed and held private to prevent contamination.</p></div></div>
              <div className="s-dt-step"><div className="num">3</div><div><h5>Fine-tune (QLoRA)</h5><p>Qwen2.5-VL-7B fine-tuned with 4-bit QLoRA via Unsloth on a single A100 — about 35 minutes of compute.</p></div></div>
              <div className="s-dt-step"><div className="num">4</div><div><h5>Evaluate (TEDS)</h5><p>Every model scored with the canonical TEDS scorer against expert ground truth. Top frontier failure modes: content divergence, row-count mismatch, flattened merged headers.</p></div></div>
            </div>

            <p style={{ fontSize: "12.5px", color: "var(--muted-2)", marginTop: "14px", lineHeight: 1.6 }}>
              To run your model on the public test set, use the <a href="https://huggingface.co/datasets/Nalandadata/DrishtiTable" target="_blank" rel="noopener noreferrer" style={{ color: "var(--muted)" }}>evaluation script on Hugging Face</a> — no form required. To submit to the held-out leaderboard, request access below.
            </p>
          </div>

          {/* NalandaBench panel */}
          <div className={`s-bench-panel${activeTab === "nalandabench" ? " active" : ""}`}>
            <div className="s-bench-h">
              <h3>NalandaBench V1 — JEE / NEET Reasoning</h3>
              <p>MCQ accuracy on held-out JEE and NEET questions in Science and Mathematics. Tests a model's ability to reason through curriculum-grade STEM problems with verified correct answers — not pattern-matching on common training data.</p>
            </div>
            <div className="s-key-stat">
              <span className="kd">+6.3pp</span>
              <span className="kl"><b>via verified-reward RL (GRPO)</b>Same base model, same data — method made the difference</span>
            </div>
            <div className="s-methbox">
              <h4>Methodology</h4>
              <p>800 held-out MCQs drawn from JEE and NEET exam papers, verified by subject-matter experts with at least two independent answer checks per item. Plain SFT on the same data regressed accuracy by <b>−16.4 points</b> (60.5 → 44.1); verified-reward RL (GRPO) using expert-verified answers as the reward produced <b>+6.3pp</b>. <Link to="/research/nalandabench" style={{ color: "var(--accent)" }}>Full method in the case study →</Link></p>
            </div>
            <div className="s-lb-meta">
              <span className="lm">NalandaBench V1 · 800 held-out MCQs</span>
              <span className="ll">
                <a href="https://huggingface.co/datasets/Nalandadata/NalandaJEENEETBench" target="_blank" rel="noopener noreferrer">↗ HF dataset</a>
                <a href="https://huggingface.co/Nalandadata/nalanda-qwen-7b-grpo" target="_blank" rel="noopener noreferrer">↗ Model</a>
              </span>
            </div>
            <div className="s-tablecard">
              <div className="s-tbl-scroll">
                <table>
                  <caption>NalandaBench v1 — 800 held-out MCQs (JEE/NEET, science &amp; maths)</caption>
                  <thead><tr><th>Model</th><th>Method</th><th style={{ textAlign: "right" }}>Accuracy</th><th style={{ textAlign: "right" }}>vs base</th></tr></thead>
                  <tbody>
                    <tr className="best"><th>Nalanda Qwen 7B GRPO <span className="badge">ours</span></th><td>Verified-reward RL</td><td style={{ textAlign: "right" }}>66.8%</td><td style={{ textAlign: "right" }} className="s-dpos">+6.3</td></tr>
                    <tr><th>Qwen 2.5 7B Instruct <span style={{ color: "var(--accent)", fontFamily: "var(--mono)", fontSize: "11px", marginLeft: "8px" }}>baseline</span></th><td>Base model</td><td style={{ textAlign: "right" }}>60.5%</td><td style={{ textAlign: "right" }}>—</td></tr>
                  </tbody>
                </table>
              </div>
              <div className="cond">Same base model, same held-out set. Verified-reward RL (GRPO) lifted accuracy <b>+6.3 points</b> (60.5% → 66.8%) — by reasoning, not memorising. Full method in the <Link to="/research/nalandabench" style={{ color: "var(--accent)" }}>case study →</Link></div>
            </div>
            <p style={{ fontSize: "12.5px", color: "var(--muted-2)", marginTop: "14px", lineHeight: 1.6 }}>
              To run your model on the public test set, use the <a href="https://huggingface.co/datasets/Nalandadata/NalandaJEENEETBench" target="_blank" rel="noopener noreferrer" style={{ color: "var(--muted)" }}>evaluation script on Hugging Face</a> — no form required.
            </p>
          </div>

          {/* Nalanda Image VL panel */}
          <div className={`s-bench-panel${activeTab === "imageqa" ? " active" : ""}`}>
            <div className="s-bench-h">
              <h3>Nalanda Image VL — STEM Science QA</h3>
              <p>Multiple-choice science reasoning (Physics, Chemistry, Biology, Maths) on a held-out set. Tests whether domain-specific fine-tuning of an open vision-language model can close the gap on curriculum-grade STEM questions.</p>
            </div>
            <div className="s-key-stat">
              <span className="kd">+12.3pp</span>
              <span className="kl"><b>from QLoRA fine-tuning of LLaMA-3.2-Vision-11B</b>37.7% → 50.0% over the zero-shot base, from a curated 22.7K-pair dataset — frontier models still lead on absolute accuracy</span>
            </div>
            <div className="s-methbox">
              <h4>Methodology</h4>
              <p>162 held-out scorable MCQs with expert ground-truth answers. Every model is scored with the <b>identical</b> exact-match scorer over its full response. Decoding is deterministic (greedy / temperature 0). <a href="https://huggingface.co/datasets/Nalandadata/nalanda-image-qa" target="_blank" rel="noopener noreferrer">Full methodology &amp; scoring on Hugging Face →</a></p>
            </div>
            <div className="s-lb-meta">
              <span className="lm">Nalanda Image VL · 162 held-out MCQs · 6 models</span>
              <span className="ll">
                <a href="https://huggingface.co/datasets/Nalandadata/nalanda-image-qa" target="_blank" rel="noopener noreferrer">↗ HF dataset</a>
                <a href="https://huggingface.co/Nalandadata/nalanda-image-vl" target="_blank" rel="noopener noreferrer">↗ Model</a>
                <a href="https://huggingface.co/datasets/Nalandadata/nalanda-image-qa/tree/main/scripts" target="_blank" rel="noopener noreferrer">↗ Eval script</a>
              </span>
            </div>
            <div className="s-tablecard">
              <div className="s-tbl-scroll">
                <table>
                  <caption>Nalanda Image VL — 162 held-out STEM MCQs (accuracy, higher is better)</caption>
                  <thead><tr><th>Model</th><th>Method</th><th style={{ textAlign: "right" }}>Accuracy</th><th style={{ textAlign: "right" }}>vs base</th></tr></thead>
                  <tbody>
                    <tr><th>Claude Sonnet 4.6</th><td>Zero-shot</td><td style={{ textAlign: "right" }}>72.2%</td><td style={{ textAlign: "right" }}>—</td></tr>
                    <tr><th>Claude Opus 4.8</th><td>Zero-shot</td><td style={{ textAlign: "right" }}>68.5%</td><td style={{ textAlign: "right" }}>—</td></tr>
                    <tr><th>Gemini 3.1 Pro</th><td>Zero-shot</td><td style={{ textAlign: "right" }}>65.4%</td><td style={{ textAlign: "right" }}>—</td></tr>
                    <tr><th>GPT-5.1</th><td>Zero-shot</td><td style={{ textAlign: "right" }}>64.2%</td><td style={{ textAlign: "right" }}>—</td></tr>
                    <tr className="best"><th>Nalanda Image VL <span className="badge">ours</span></th><td>Fine-tuned (QLoRA)</td><td style={{ textAlign: "right" }}>50.0%</td><td style={{ textAlign: "right" }} className="s-dpos">+12.3</td></tr>
                    <tr><th>LLaMA-3.2-Vision-11B <span style={{ color: "var(--accent)", fontFamily: "var(--mono)", fontSize: "11px", marginLeft: "8px" }}>baseline</span></th><td>Zero-shot (base)</td><td style={{ textAlign: "right" }}>37.7%</td><td style={{ textAlign: "right" }}>—</td></tr>
                  </tbody>
                </table>
              </div>
              <div className="cond">Honest ranking by real accuracy on the same 162 held-out questions. Fine-tuning lifts the open 11B model <b>+12.3 points</b> (37.7% → 50.0%) over its zero-shot base — a large gain from a small curated dataset. Frontier models lead on absolute accuracy; the result here is the <b>fine-tuning gain</b>, not a frontier win.</div>
            </div>

            {/* Per-subject breakdown */}
            <h4 className="s-cb-title" style={{ marginTop: "30px" }}>Per-subject accuracy — fine-tuned vs base</h4>
            <div style={{ overflowX: "auto" }}>
              <table className="s-ptype-tbl">
                <thead><tr><th>Subject</th><th style={{ textAlign: "right" }}>N</th><th style={{ textAlign: "right" }}>Base</th><th style={{ textAlign: "right" }}>Nalanda Image VL</th><th style={{ textAlign: "right" }}>Δ</th></tr></thead>
                <tbody>
                  <tr className="best"><th>Maths</th><td style={{ textAlign: "right" }}>34</td><td style={{ textAlign: "right" }}>26.5</td><td style={{ textAlign: "right" }}>50.0</td><td style={{ textAlign: "right" }} className="s-dpos">+23.5</td></tr>
                  <tr><th>Biology</th><td style={{ textAlign: "right" }}>37</td><td style={{ textAlign: "right" }}>32.4</td><td style={{ textAlign: "right" }}>45.9</td><td style={{ textAlign: "right" }} className="s-dpos">+13.5</td></tr>
                  <tr><th>Physics</th><td style={{ textAlign: "right" }}>52</td><td style={{ textAlign: "right" }}>38.5</td><td style={{ textAlign: "right" }}>50.0</td><td style={{ textAlign: "right" }} className="s-dpos">+11.5</td></tr>
                  <tr><th>Chemistry</th><td style={{ textAlign: "right" }}>39</td><td style={{ textAlign: "right" }}>51.3</td><td style={{ textAlign: "right" }}>53.8</td><td style={{ textAlign: "right" }} className="s-dpos">+2.6</td></tr>
                </tbody>
              </table>
            </div>
            <p className="s-cb-note">Per-subject accuracy (%) on the 162-question held-out set. The largest gains land where the base model was weakest — Maths nearly doubled.</p>

            <p style={{ fontSize: "12.5px", color: "var(--muted-2)", marginTop: "14px", lineHeight: 1.6 }}>
              To run your model on the public test set, use the <a href="https://huggingface.co/datasets/Nalandadata/nalanda-image-qa/tree/main/scripts" target="_blank" rel="noopener noreferrer" style={{ color: "var(--muted)" }}>evaluation script on Hugging Face</a> — no form required.
            </p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="s-band alt s-cs-cta">
        <div className="s-wrap">
          <p className="s-eyebrow" style={{ justifyContent: "center" }}>Get on the leaderboard</p>
          <h2 style={{ fontSize: "clamp(25px,3.6vw,40px)", fontWeight: 800, letterSpacing: "-0.025em", lineHeight: 1.08, margin: 0, textAlign: "center" }}>Two ways in.</h2>
          <p style={{ margin: "18px auto 0", maxWidth: "56ch", color: "var(--muted)", textAlign: "center" }}>Depending on whether you want to evaluate your model or license the underlying data.</p>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", maxWidth: "680px", margin: "28px auto 0", textAlign: "left" }}>
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
