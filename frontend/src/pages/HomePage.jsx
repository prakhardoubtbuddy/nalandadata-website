import { useState } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";

export default function HomePage() {
  const [nlEmail, setNlEmail] = useState("");
  const [nlStatus, setNlStatus] = useState("");
  const [sampleEmail, setSampleEmail] = useState("");
  const [sampleUsecase, setSampleUsecase] = useState("");
  const [sampleStatus, setSampleStatus] = useState("");
  const [lfName, setLfName] = useState("");
  const [lfEmail, setLfEmail] = useState("");
  const [lfOrg, setLfOrg] = useState("");
  const [lfUsecase, setLfUsecase] = useState("Reasoning / RLVR");
  const [lfMessage, setLfMessage] = useState("");
  const [lfStatus, setLfStatus] = useState("");

  const postLead = async (payload) => {
    const r = await fetch("/api/leads", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
    if (!r.ok) throw new Error("Failed");
  };

  const handleNewsletter = async (e) => {
    e.preventDefault();
    try {
      await postLead({ work_email: nlEmail, use_case: "Newsletter" });
      setNlStatus("Subscribed!");
      setNlEmail("");
    } catch { setNlStatus("Something went wrong."); }
  };

  const handleSample = async (e) => {
    e.preventDefault();
    try {
      await postLead({ work_email: sampleEmail, use_case: sampleUsecase || "Sample download" });
      setSampleStatus("Sample on its way!");
      setSampleEmail("");
    } catch { setSampleStatus("Something went wrong."); }
  };

  const handleLead = async (e) => {
    e.preventDefault();
    try {
      await postLead({ full_name: lfName, work_email: lfEmail, company: lfOrg, use_case: lfUsecase, message: lfMessage });
      setLfStatus("Thanks! We'll be in touch.");
      setLfName(""); setLfEmail(""); setLfOrg(""); setLfMessage("");
    } catch { setLfStatus("Something went wrong."); }
  };

  return (
    <div data-testid="home-page">
      <Helmet>
        <title>Nalandadata — Verified reasoning data for frontier models</title>
        <meta name="description" content="Human-authored. Expert-verified. Reproducible. Difficulty-graded reasoning data with verified correct answers — the signal that makes a model measurably better." />
      </Helmet>

      {/* HERO */}
      <section className="s-hero">
        <div className="s-hero-grid" aria-hidden="true" />
        <div className="s-wrap">
          <h1>Verified reasoning data that frontier models <span className="hl">can't synthesize</span>.</h1>
          <p className="lede"><b>Human-authored. Expert-verified. Reproducible.</b> Difficulty-graded reasoning data with verified correct answers — the signal that makes a model measurably better, and that scraped or synthetic data can't provide. Built for frontier labs, foundation-model teams and sovereign AI programmes.</p>
          <div className="s-chips">
            <span className="s-chip">Reasoning &amp; CoT</span>
            <span className="s-chip">RLVR reward data</span>
            <span className="s-chip">Multimodal &amp; vision-language</span>
            <span className="s-chip">Indic &amp; sovereign AI</span>
            <Link className="s-chip link" to="/benchmarks">See the benchmarks →</Link>
          </div>
          <div className="s-hero-cta">
            <a className="s-btn primary" href="#connect">Download a sample</a>
            <a className="s-btn ghost" href="#connect">Talk to a researcher</a>
            <a className="s-cta-sub" href="https://huggingface.co/Nalandadata" target="_blank" rel="noopener noreferrer" style={{ borderBottom: "1px solid var(--line)" }}>Or browse our published models &amp; dataset samples on Hugging Face →</a>
          </div>

        </div>
      </section>

      {/* LATEST */}
      <section className="s-band" style={{ paddingTop: "26px", paddingBottom: "26px" }}>
        <div className="s-wrap">
          <div className="s-latest">
            <span className="lk">Latest</span>
            <Link className="lt" to="/benchmarks"><span className="when">New</span><b>DrishtiTable</b> — our 8B model tops every cloud model on table extraction</Link>
            <Link className="lt" to="/benchmarks"><span className="when">New</span><b>Nalanda Image VL</b> — a vision model that reads science diagrams</Link>
            <a className="lt" href="https://huggingface.co/Nalandadata" target="_blank" rel="noopener noreferrer"><span className="when">HF</span><b>Models &amp; dataset samples</b> on Hugging Face</a>
          </div>
        </div>
      </section>

      {/* VERIFY / REPRODUCIBILITY */}
      <section className="s-band alt" id="verify">
        <div className="s-wrap">
          <div className="s-sec-head">
            <p className="s-eyebrow">Reproducibility</p>
            <h2>Reproduce every result.</h2>
            <p className="lead">Our models, sample datasets and held-out numbers are public. <b>Download them, run them on your own inputs, and reproduce what we report.</b></p>
          </div>
          <div className="s-verify">
            <div className="s-vcard">
              <div className="vk">Published models</div>
              <h3>Fine-tuned weights, public</h3>
              <p>The fine-tuned models behind our results are released openly, so you can run them on your own inputs.</p>
              <a className="vl" href="https://huggingface.co/Nalandadata" target="_blank" rel="noopener noreferrer">View the fine-tuned models →</a>
            </div>
            <div className="s-vcard">
              <div className="vk">Sample datasets</div>
              <h3>Real data, before you commit</h3>
              <p>A representative sample of each dataset is available to download, mirroring the full structure and quality.</p>
              <a className="vl" href="#connect">Download a sample →</a>
            </div>
            <div className="s-vcard">
              <div className="vk">Held-out numbers</div>
              <h3>Methods and metrics, in full</h3>
              <p>Every case study shows the held-out test set, the metric, and the exact comparison conditions.</p>
              <Link className="vl" to="/benchmarks">See the benchmarks →</Link>
            </div>
          </div>
        </div>
      </section>

      {/* THE DIFFERENCE */}
      <section className="s-band" id="difference">
        <div className="s-wrap">
          <div className="s-sec-head">
            <p className="s-eyebrow">The fundamental difference</p>
            <h2>Data built to reason, not scraped to exist.</h2>
          </div>
          <div className="s-diff">
            <div>
              <p className="body">Synthetic data amplifies what a model already knows. Scraped web data is unverified and structurally incoherent. Neither gives a model the difficulty-graded, multi-step reasoning signal it needs, and neither carries the verified correct answers that make verifiable-reward training (RLVR) work.</p>
              <p className="body">Our human-authored worked solutions contain the expert reasoning explicitly: the thinking that produced the answer, not just the answer. The output is structured, pipeline-ready training data.</p>
              <div className="s-src">
                <b>Source:</b> S Chand Group archive · 11,000+ expert-authored titles · rights-cleared · zero scraping<br />
                <b>Provenance:</b> full copyright lineage with every dataset<br />
                <b>Quality:</b> difficulty graded by 2,000+ subject-matter experts<br />
                <b>Contamination:</b> deduplicated and checked against common benchmarks<br />
                <b>Stages:</b> SFT → RLVR → CoT → HITL → Multimodal
              </div>
            </div>
            <div className="s-cmp">
              <div className="row head"><span>Capability</span><span>Web</span><span>Us</span></div>
              <div className="row"><span>Clean IP, rights-cleared</span><span className="x">×</span><span className="c">✓</span></div>
              <div className="row"><span>Verified correct answers</span><span className="x">×</span><span className="c">✓</span></div>
              <div className="row"><span>Multi-step reasoning chains</span><span className="x">×</span><span className="c">✓</span></div>
              <div className="row"><span>Difficulty stratification</span><span className="x">×</span><span className="c">✓</span></div>
              <div className="row"><span>RLVR-ready reward signal</span><span className="x">×</span><span className="c">✓</span></div>
              <div className="row"><span>Authentic Indic diversity</span><span className="x">×</span><span className="c">✓</span></div>
              <div className="row"><span>Reproducible, public artifacts</span><span className="x">×</span><span className="c">✓</span></div>
            </div>
          </div>

          <p className="s-scaleband-head">The scale behind it</p>
          <div className="s-statband" style={{ marginTop: "16px" }}>
            <div><div className="sv">2B+</div><div className="sl">Tokens of human reasoning data</div></div>
            <div><div className="sv">12M+</div><div className="sl">Verified Q&amp;A instruction pairs</div></div>
            <div><div className="sv">28M+</div><div className="sl">Multimodal image-text pairs</div></div>
            <div><div className="sv">12</div><div className="sl">Languages · 8 Indic scripts</div></div>
          </div>
        </div>
      </section>


      {/* BENCHMARKS */}
      <section className="s-band" id="benchmarks">
        <div className="s-wrap">
          <div className="s-sec-head">
            <p className="s-eyebrow">Benchmarks</p>
            <h2>An independent benchmark for Indic reasoning.</h2>
            <p className="lead">NalandaBench scores models on verified, curriculum-grade Indic and STEM reasoning — expert-authored ground truth with clean IP, built to be reproduced and cited. Independent by design: no lab owns the scorekeeper.</p>
          </div>
          <div className="s-verify">
            <div className="s-vcard">
              <div className="vk">Verified ground truth</div>
              <h3>Expert-authored, not crowd-voted</h3>
              <p>Every item has a verified correct answer from subject-matter experts, ready for verifier-based scoring.</p>
            </div>
            <div className="s-vcard">
              <div className="vk">Independent</div>
              <h3>No lab owns the scorekeeper</h3>
              <p>A measurement only matters if it is neutral. NalandaBench is built to be the standard others report against.</p>
            </div>
            <div className="s-vcard">
              <div className="vk">Reproducible</div>
              <h3>Public methodology and leaderboard</h3>
              <p>Open scoring rules and a live leaderboard, so any result can be checked.</p>
              <Link className="vl" to="/benchmarks">See the leaderboard →</Link>
            </div>
          </div>
        </div>
      </section>

      {/* WHO WE BUILD FOR */}
      <section className="s-band">
        <div className="s-wrap">
          <div className="s-sec-head">
            <p className="s-eyebrow">Who we build for</p>
            <h2>Built for every team training the next model.</h2>
          </div>
          <div className="s-segs">
            <div className="s-seg">
              <div className="se">Frontier &amp; foundation-model labs</div>
              <h3>Post-training that web data can't support</h3>
              <p>Verified-answer reasoning corpora for RLVR, SFT instruction pairs, and multimodal data, at a quality synthetic generation cannot reach.</p>
              <div className="ch"><span>RLVR reasoning</span><span>JEE/NEET CoT</span><span>Academic QA SFT</span></div>
            </div>
            <div className="s-seg">
              <div className="se">Enterprise AI teams</div>
              <h3>Domain fine-tuning for production</h3>
              <p>Domain corpora with the conceptual depth and structured reasoning chains production models require, grounded in verified expert knowledge.</p>
              <div className="ch"><span>Commerce</span><span>Engineering</span><span>Economics</span></div>
            </div>
            <div className="s-seg">
              <div className="se">Government &amp; sovereign AI</div>
              <h3>Bharat-first AI infrastructure</h3>
              <p>Curriculum-verified, Indic-script data across 8 scripts, aligned to national AI infrastructure goals.</p>
              <div className="ch"><span>Indic multilingual</span><span>History &amp; civics</span><span>Indic benchmarks</span></div>
            </div>
          </div>
        </div>
      </section>

      {/* DATASET CATALOGUE */}
      <section className="s-band alt" id="catalogue">
        <div className="s-wrap">
          <div className="s-sec-head">
            <p className="s-eyebrow">Dataset catalogue</p>
            <h2>Every training stage, one source of truth.</h2>
          </div>
          <div className="s-cat">
            <div className="s-dsc">
              <div className="de">Reasoning + CoT</div>
              <h3>India-STEM Reasoning Corpus</h3>
              <p>Mathematics and science reasoning, foundational to advanced, with explicit step-by-step worked solutions and verified answers.</p>
              <div className="meta">Size: 450M tokens<br />Language: English, Hindi<br />Difficulty: Easy → Advanced</div>
              <a className="dl" href="#connect">Download sample →</a>
            </div>
            <div className="s-dsc">
              <div className="de">Pretraining</div>
              <h3>Indic Multilingual Education Corpus</h3>
              <p>Structured corpora across 8 Indic languages, curriculum-graded and expert-authored.</p>
              <div className="meta">Size: 520M tokens<br />Language: 8 Indic scripts<br />Format: Raw text corpus</div>
              <a className="dl" href="#connect">Download sample →</a>
            </div>
            <div className="s-dsc">
              <div className="de">Multimodal</div>
              <h3>Scientific Diagram QA</h3>
              <p>Labelled diagrams with grounded question-answer pairs for vision-language training and evaluation.</p>
              <div className="meta">Size: 28M+ pairs<br />Type: Image + text<br />Domains: STEM</div>
              <a className="dl" href="#connect">Download sample →</a>
            </div>
          </div>
        </div>
      </section>

      {/* NEWSLETTER */}
      <section className="s-band">
        <div className="s-wrap">
          <div className="s-news">
            <p className="s-eyebrow" style={{ justifyContent: "center" }}>Stay close to the work</p>
            <h2>New experiments and dataset releases, as they ship.</h2>
            <p>A low-volume research update for ML teams — new results, new datasets, and what we are learning. No marketing.</p>
            {nlStatus ? (
              <p style={{ color: "var(--accent)", fontFamily: "var(--mono)", fontSize: "14px" }}>{nlStatus}</p>
            ) : (
              <form className="row" onSubmit={handleNewsletter}>
                <input type="email" placeholder="you@lab.com" aria-label="Work email" value={nlEmail} onChange={e => setNlEmail(e.target.value)} required />
                <button className="s-btn primary" type="submit">Subscribe</button>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* CONNECT */}
      <section className="s-band alt" id="connect">
        <div className="s-wrap">
          <div className="s-contact">
            <div>
              <p className="s-eyebrow">Two ways in</p>
              <h2>Start with a sample. Or start a conversation.</h2>
              <p className="lead" style={{ marginBottom: "24px" }}>Most teams begin by trying a sample on their own inputs. When you are ready, you talk to the people who built the data, not a sales desk.</p>

              <div className="s-pathbox">
                <div className="pk">Fastest · self-serve</div>
                <h3>Download a sample</h3>
                <p>Tell us where to send it and what you are working on. The sample arrives by email.</p>
                {sampleStatus ? (
                  <p style={{ color: "var(--accent)", fontFamily: "var(--mono)", fontSize: "14px" }}>{sampleStatus}</p>
                ) : (
                  <form className="s-mini" onSubmit={handleSample}>
                    <input type="email" placeholder="Work email" value={sampleEmail} onChange={e => setSampleEmail(e.target.value)} required />
                    <select aria-label="Use case" value={sampleUsecase} onChange={e => setSampleUsecase(e.target.value)}>
                      <option value="">What are you building?</option>
                      <option>Reasoning / RLVR</option>
                      <option>SFT / fine-tuning</option>
                      <option>Multimodal</option>
                      <option>Indic / sovereign</option>
                      <option>Evaluation</option>
                    </select>
                    <button className="s-btn primary" type="submit" style={{ flex: "none" }}>Send the sample</button>
                  </form>
                )}
              </div>
            </div>

            <div>
              <div className="s-pathbox" style={{ background: "transparent", borderStyle: "dashed", marginBottom: "16px" }}>
                <div className="pk">Higher intent</div>
                <h3>Talk to a researcher</h3>
                <p>For scoping a licence or a custom dataset. A few more details so we can come prepared.</p>
              </div>
              {lfStatus ? (
                <p style={{ color: "var(--accent)", fontFamily: "var(--mono)", fontSize: "14px", padding: "20px 0" }}>{lfStatus}</p>
              ) : (
                <form className="s-form" onSubmit={handleLead}>
                  <div className="s-frow">
                    <div className="s-field"><label>Full name</label><input type="text" value={lfName} onChange={e => setLfName(e.target.value)} /></div>
                    <div className="s-field"><label>Work email</label><input type="email" value={lfEmail} onChange={e => setLfEmail(e.target.value)} required /></div>
                  </div>
                  <div className="s-frow">
                    <div className="s-field"><label>Organisation</label><input type="text" value={lfOrg} onChange={e => setLfOrg(e.target.value)} /></div>
                    <div className="s-field"><label>Use case</label>
                      <select value={lfUsecase} onChange={e => setLfUsecase(e.target.value)}>
                        <option>Reasoning / RLVR</option>
                        <option>SFT / fine-tuning</option>
                        <option>Multimodal</option>
                        <option>Indic / sovereign</option>
                        <option>Evaluation</option>
                      </select>
                    </div>
                  </div>
                  <div className="s-field full" style={{ marginBottom: "18px" }}><label>What are you trying to do?</label><textarea rows={3} value={lfMessage} onChange={e => setLfMessage(e.target.value)} /></div>
                  <button className="s-btn primary">Talk to a researcher →</button>
                  <div className="note">No sales desk. No obligation.</div>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
