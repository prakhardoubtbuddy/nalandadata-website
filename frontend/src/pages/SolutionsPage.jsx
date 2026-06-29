import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";

const solutions = [
  {
    id: "pretraining",
    label: "Pretraining Data",
    headline: "Foundation-scale academic corpora.",
    description: "Large-scale academic corpora designed to enhance foundational model capabilities with structured knowledge.",
    features: [
      "2B+ structured academic samples",
      "Multi-domain coverage (STEM, Humanities, Languages)",
      "Clean, deduplicated, and quality-filtered",
      "Format-ready for major training frameworks",
      "Continuous updates with new content",
    ],
    useCases: ["Foundation model pretraining", "Domain adaptation", "Knowledge injection", "Curriculum learning"],
  },
  {
    id: "sft",
    label: "Supervised Fine-Tuning (SFT)",
    headline: "Expert-annotated instruction pairs.",
    description: "Expert-annotated instruction-response pairs for aligning models to follow complex academic instructions.",
    features: [
      "500K+ instruction-response pairs",
      "Multi-turn conversation data",
      "Step-by-step reasoning chains",
      "Task-specific datasets available",
      "Quality scored by domain experts",
    ],
    useCases: ["Instruction following", "Task-specific fine-tuning", "Tutoring AI development", "Domain specialization"],
  },
  {
    id: "rlhf",
    label: "RLHF / DPO Datasets",
    headline: "Human preference data at scale.",
    description: "Human preference data and ranked responses for training models to generate safer, more helpful outputs.",
    features: [
      "100K+ preference pairs",
      "Expert-ranked response comparisons",
      "Safety and helpfulness annotations",
      "Diverse academic scenarios",
      "Continuous human feedback collection",
    ],
    useCases: ["Preference optimization", "Response quality improvement", "Safety alignment", "Helpfulness training"],
  },
  {
    id: "evaluation",
    label: "Evaluation Benchmarks",
    headline: "Rigorous academic evaluation sets.",
    description: "Comprehensive evaluation datasets for measuring model performance across academic reasoning tasks.",
    features: [
      "50K+ evaluation questions",
      "Difficulty-stratified test sets",
      "Multi-subject coverage",
      "Human expert baseline scores",
      "Detailed performance metrics",
    ],
    useCases: ["Model evaluation", "Progress tracking", "Comparative analysis", "Research benchmarking"],
  },
];

export default function SolutionsPage() {
  return (
    <div className="bg-[#0A0A0A]" style={{ paddingTop: "96px" }}>
      <Helmet>
        <title>Solutions — Nalandadata.ai</title>
        <meta name="description" content="AI training data solutions for every stage of the pipeline — pretraining corpora, supervised fine-tuning datasets, RLHF preference data, and evaluation benchmarks." />
      </Helmet>

      {/* Hero */}
      <section className="s-band" style={{ borderTop: "none" }}>
        <div className="s-wrap">
          <nav className="s-crumb" aria-label="Breadcrumb" style={{ marginBottom: "18px" }}>
            <Link to="/">Home</Link> / Solutions
          </nav>
          <p className="s-eyebrow">Solutions</p>
          <div className="s-sec-head">
            <h2>Built for every stage of the AI training pipeline.</h2>
            <p className="lead">
              Whether you are pretraining a foundation model, fine-tuning for a specific domain,
              building evaluation benchmarks, or developing an AI tutor — Nalandadata has a dataset
              designed for your use case.
            </p>
          </div>
        </div>
      </section>

      {/* Solution sections */}
      {solutions.map((sol, i) => (
        <section key={sol.id} id={sol.id} className={`s-band${i % 2 === 1 ? " alt" : ""}`}>
          <div className="s-wrap">
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 320px), 1fr))", gap: "48px", alignItems: "start" }}>
              {/* Left: description + features */}
              <div>
                <p className="s-eyebrow" style={{ marginBottom: "14px" }}>{sol.label}</p>
                <h3 style={{
                  fontFamily: "var(--sans)",
                  fontSize: "clamp(1.3rem, 2.5vw, 1.75rem)",
                  fontWeight: 700,
                  color: "var(--paper)",
                  marginBottom: "14px",
                  lineHeight: 1.2,
                }}>
                  {sol.headline}
                </h3>
                <p style={{ color: "var(--muted)", lineHeight: 1.7, marginBottom: "28px" }}>
                  {sol.description}
                </p>
                <p style={{
                  fontSize: "0.68rem",
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  color: "var(--muted)",
                  marginBottom: "14px",
                }}>
                  Key Features
                </p>
                <ul style={{ listStyle: "none", padding: 0, margin: "0 0 32px", display: "flex", flexDirection: "column", gap: "10px" }}>
                  {sol.features.map((f, j) => (
                    <li key={j} style={{ display: "flex", gap: "10px", color: "var(--paper)", fontSize: "0.92rem", lineHeight: 1.5 }}>
                      <span style={{ color: "var(--accent)", flexShrink: 0, marginTop: "2px" }}>✓</span>
                      {f}
                    </li>
                  ))}
                </ul>
                <Link className="s-btn primary" to="/contact">Request {sol.label} →</Link>
              </div>

              {/* Right: use cases */}
              <div style={{
                background: "var(--panel)",
                border: "1px solid var(--line)",
                borderRadius: "12px",
                padding: "32px",
              }}>
                <p style={{
                  fontSize: "0.68rem",
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  color: "var(--muted)",
                  marginBottom: "20px",
                }}>
                  Use Cases
                </p>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(130px, 1fr))", gap: "12px" }}>
                  {sol.useCases.map((uc, j) => (
                    <div key={j} style={{
                      background: "rgba(255,255,255,0.03)",
                      border: "1px solid var(--line)",
                      borderRadius: "8px",
                      padding: "14px 16px",
                      color: "var(--paper)",
                      fontSize: "0.9rem",
                      lineHeight: 1.4,
                    }}>
                      {uc}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>
      ))}

      {/* CTA */}
      <section className="s-band alt">
        <div className="s-wrap" style={{ textAlign: "center" }}>
          <p className="s-eyebrow" style={{ justifyContent: "center" }}>Get in touch</p>
          <h2>Ready to bring structured knowledge to your AI?</h2>
          <p className="lead" style={{ margin: "18px auto 28px", maxWidth: "52ch" }}>
            Talk to our team. We'll help you identify the right datasets for your training pipeline and get you a sample.
          </p>
          <div style={{ display: "flex", gap: "14px", justifyContent: "center", flexWrap: "wrap" }}>
            <Link className="s-btn primary" to="/contact">Contact our team →</Link>
          </div>
        </div>
      </section>
    </div>
  );
}
