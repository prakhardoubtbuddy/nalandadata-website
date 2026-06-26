import { useState } from "react";
import { Link } from "react-router-dom";
import { LeadCaptureForm } from "@/components/LeadCaptureForm";

const industries = [
  {
    id: "ai-labs",
    title: "Frontier AI Labs",
    description: "Training next generation LLMs with high-quality academic data that improves reasoning, factuality, and domain expertise.",
    benefits: [
      "Benchmark-validated datasets proven to improve model performance",
      "Large-scale pretraining corpora with 2B+ samples",
      "Chain-of-thought annotated reasoning data",
      "Multi-domain academic coverage",
      "Continuous data pipeline updates",
    ],
    metrics: [
      { label: "MMLU Improvement", value: "+7.2%" },
      { label: "Reasoning Accuracy", value: "+11.5%" },
      { label: "Data Quality Score", value: "98%" },
    ],
  },
  {
    id: "edtech",
    title: "EdTech Platforms",
    description: "Building intelligent AI tutors and learning systems with expertly curated educational content across subjects and languages.",
    benefits: [
      "Step-by-step solution explanations for tutoring",
      "Multilingual content in 12+ languages",
      "Grade-appropriate content classification",
      "Curriculum-aligned datasets",
      "Assessment and evaluation datasets",
    ],
    metrics: [
      { label: "Subject Coverage", value: "15+" },
      { label: "Languages", value: "12" },
      { label: "Expert Annotators", value: "2000+" },
    ],
  },
  {
    id: "research",
    title: "Research Institutions",
    description: "Developing reasoning models and advancing AI research with structured academic datasets and evaluation benchmarks.",
    benefits: [
      "Research-grade data with detailed metadata",
      "Evaluation benchmarks for academic reasoning",
      "Difficulty-stratified test sets",
      "Human baseline comparisons",
      "Reproducible dataset versions",
    ],
    metrics: [
      { label: "Benchmark Tasks", value: "50K+" },
      { label: "Difficulty Levels", value: "4" },
      { label: "Expert Baselines", value: "Yes" },
    ],
  },
  {
    id: "foundation",
    title: "Foundation Model Companies",
    description: "Structured training corpora at scale for building foundation models with enhanced academic and reasoning capabilities.",
    benefits: [
      "Enterprise-grade data licensing",
      "Custom dataset development",
      "Dedicated data engineering support",
      "SLA-backed delivery",
      "Ongoing data partnership programs",
    ],
    metrics: [
      { label: "Data Volume", value: "2B+" },
      { label: "Custom Projects", value: "50+" },
      { label: "Enterprise Clients", value: "25+" },
    ],
  },
];

export default function IndustriesPage() {
  const [isFormOpen, setIsFormOpen] = useState(false);

  return (
    <div className="bg-[#0A0A0A]" style={{ paddingTop: "96px" }}>

      {/* Hero */}
      <section className="s-band" style={{ borderTop: "none", paddingBottom: "40px" }}>
        <div className="s-wrap">
          <p className="s-eyebrow">Industries</p>
          <h1 style={{ fontSize: "clamp(32px,4vw,52px)", fontWeight: 800, letterSpacing: "-0.03em", lineHeight: 1.08, margin: "12px 0 16px", color: "var(--paper)" }}>
            Industries We Serve
          </h1>
          <p style={{ color: "var(--muted)", fontSize: "16px", lineHeight: 1.6, maxWidth: "52ch" }}>
            Powering AI innovation across sectors with domain-specific academic intelligence datasets.
          </p>
        </div>
      </section>

      {/* Industry sections */}
      {industries.map((industry, i) => (
        <section key={industry.id} id={industry.id} className={`s-band${i % 2 === 1 ? " alt" : ""}`}>
          <div className="s-wrap">
            <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "40px" }}>

              {/* Header */}
              <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
                <div style={{ width: "4px", height: "28px", background: "var(--accent)", borderRadius: "2px", flexShrink: 0 }} />
                <h2 style={{ fontSize: "clamp(22px,2.5vw,30px)", fontWeight: 800, color: "var(--paper)", margin: 0, letterSpacing: "-0.02em" }}>
                  {industry.title}
                </h2>
              </div>

              {/* Two-column: description+benefits | metrics */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))", gap: "40px" }}>
                <div>
                  <p style={{ color: "var(--muted)", fontSize: "15px", lineHeight: 1.7, margin: "0 0 24px" }}>
                    {industry.description}
                  </p>
                  <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "flex", flexDirection: "column", gap: "10px" }}>
                    {industry.benefits.map((benefit, j) => (
                      <li key={j} style={{ display: "flex", gap: "10px", alignItems: "flex-start" }}>
                        <span style={{ color: "var(--accent)", fontFamily: "var(--mono)", fontSize: "12px", flexShrink: 0, marginTop: "2px" }}>✓</span>
                        <span style={{ color: "var(--muted)", fontSize: "14px", lineHeight: 1.6 }}>{benefit}</span>
                      </li>
                    ))}
                  </ul>
                  <button
                    onClick={() => setIsFormOpen(true)}
                    className="s-btn primary"
                    style={{ marginTop: "28px" }}
                  >
                    Learn more →
                  </button>
                </div>

                {/* Metrics card */}
                <div style={{ background: "var(--ink)", border: "1px solid var(--line)", borderRadius: "12px", padding: "28px" }}>
                  <p style={{ fontFamily: "var(--mono)", fontSize: "10px", letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--muted)", margin: "0 0 24px" }}>
                    Key Metrics
                  </p>
                  <div style={{ display: "flex", flexDirection: "column", gap: "0" }}>
                    {industry.metrics.map((metric, j) => (
                      <div key={j} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px 0", borderBottom: j < industry.metrics.length - 1 ? "1px solid var(--line)" : "none" }}>
                        <span style={{ color: "var(--muted)", fontSize: "13.5px" }}>{metric.label}</span>
                        <span style={{ color: "var(--paper)", fontFamily: "var(--mono)", fontSize: "22px", fontWeight: 700, letterSpacing: "-0.02em" }}>{metric.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

            </div>
          </div>
        </section>
      ))}

      {/* CTA */}
      <section className="s-band" style={{ borderTop: "1px solid var(--line)" }}>
        <div className="s-wrap" style={{ maxWidth: "640px", textAlign: "center" }}>
          <p className="s-eyebrow">Custom Solutions</p>
          <h2 style={{ fontSize: "clamp(24px,3vw,38px)", fontWeight: 800, letterSpacing: "-0.03em", color: "var(--paper)", margin: "12px 0 14px" }}>
            Different Industry?
          </h2>
          <p style={{ color: "var(--muted)", fontSize: "15px", lineHeight: 1.6, margin: "0 0 32px" }}>
            We work with organizations across industries. Tell us about your use case and we'll create a custom solution.
          </p>
          <button onClick={() => setIsFormOpen(true)} className="s-btn primary">
            Contact us →
          </button>
        </div>
      </section>

      <LeadCaptureForm open={isFormOpen} onOpenChange={setIsFormOpen} />
    </div>
  );
}
