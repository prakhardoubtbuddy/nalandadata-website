import { useState } from "react";
import { Link } from "react-router-dom";
import { LeadCaptureForm } from "@/components/LeadCaptureForm";

const resourceCategories = [
  {
    id: "samples",
    label: "Sample Datasets",
    description: "Download sample datasets to evaluate data quality and structure before committing.",
    items: [
      { title: "Academic Reasoning Sample", meta: "CSV · 2.5 MB", download: true },
      { title: "STEM Problems Sample", meta: "JSON · 1.8 MB", download: true },
      { title: "Multilingual Education Sample", meta: "CSV · 3.2 MB", download: true },
    ],
  },
  {
    id: "reports",
    label: "Benchmark Reports",
    description: "Detailed reports on how our datasets impact model performance across standard benchmarks.",
    items: [
      { title: "MMLU Performance Analysis", meta: "PDF · 1.2 MB", download: true },
      { title: "Academic Reasoning Benchmark", meta: "PDF · 980 KB", download: true },
      { title: "Multilingual Model Evaluation", meta: "PDF · 1.5 MB", download: true },
    ],
  },
  {
    id: "papers",
    label: "Research Papers",
    description: "Academic publications and technical documentation on our data methodology.",
    items: [
      { title: "Academic Data for LLM Training", meta: "PDF · 2.1 MB", download: true },
      { title: "Chain-of-Thought Dataset Design", meta: "PDF · 1.8 MB", download: true },
      { title: "Multilingual Educational Corpora", meta: "PDF · 2.4 MB", download: true },
    ],
  },
  {
    id: "blog",
    label: "Blog",
    description: "Insights, updates, and best practices for using academic datasets in AI development.",
    items: [
      { title: "Building Reasoning Capabilities with Academic Data", meta: "Article", link: "/blog" },
      { title: "The Future of Educational AI", meta: "Article", link: "/blog" },
      { title: "Data Quality in LLM Training", meta: "Article", link: "/blog" },
    ],
  },
];

export default function ResourcesPage() {
  const [isFormOpen, setIsFormOpen] = useState(false);

  return (
    <div className="bg-[#0A0A0A]" style={{ paddingTop: "96px" }}>

      {/* Hero */}
      <section className="s-band" style={{ borderTop: "none", paddingBottom: "40px" }}>
        <div className="s-wrap">
          <p className="s-eyebrow">Resources</p>
          <h1 style={{ fontSize: "clamp(32px,4vw,52px)", fontWeight: 800, letterSpacing: "-0.03em", lineHeight: 1.08, margin: "12px 0 16px", color: "var(--paper)" }}>
            Resources
          </h1>
          <p style={{ color: "var(--muted)", fontSize: "16px", lineHeight: 1.6, maxWidth: "52ch" }}>
            Sample datasets, benchmark reports, research papers, and insights to help you evaluate and use our data.
          </p>
        </div>
      </section>

      {/* Resource cards */}
      <section className="s-band alt">
        <div className="s-wrap">
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(320px,1fr))", gap: "20px" }}>
            {resourceCategories.map((category) => (
              <div key={category.id} style={{ background: "var(--ink)", border: "1px solid var(--line)", borderRadius: "12px", padding: "28px" }}>
                <p style={{ color: "var(--accent)", fontFamily: "var(--mono)", fontSize: "11px", letterSpacing: "0.1em", textTransform: "uppercase", margin: "0 0 8px" }}>
                  {category.label}
                </p>
                <p style={{ color: "var(--muted)", fontSize: "13.5px", lineHeight: 1.6, margin: "0 0 20px" }}>
                  {category.description}
                </p>
                <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                  {category.items.map((item, j) =>
                    item.link ? (
                      <Link
                        key={j}
                        to={item.link}
                        style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 14px", background: "var(--ink-2)", border: "1px solid var(--line)", borderRadius: "7px", textDecoration: "none", transition: "border-color 0.15s" }}
                        onMouseEnter={(e) => (e.currentTarget.style.borderColor = "rgba(200,169,110,0.4)")}
                        onMouseLeave={(e) => (e.currentTarget.style.borderColor = "var(--line)")}
                      >
                        <span style={{ color: "var(--paper)", fontSize: "13.5px" }}>{item.title}</span>
                        <span style={{ color: "var(--muted)", fontFamily: "var(--mono)", fontSize: "11px", flexShrink: 0, marginLeft: "12px" }}>{item.meta} ↗</span>
                      </Link>
                    ) : (
                      <button
                        key={j}
                        onClick={() => setIsFormOpen(true)}
                        style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 14px", background: "var(--ink-2)", border: "1px solid var(--line)", borderRadius: "7px", cursor: "pointer", width: "100%", textAlign: "left", transition: "border-color 0.15s" }}
                        onMouseEnter={(e) => (e.currentTarget.style.borderColor = "rgba(200,169,110,0.4)")}
                        onMouseLeave={(e) => (e.currentTarget.style.borderColor = "var(--line)")}
                      >
                        <span style={{ color: "var(--paper)", fontSize: "13.5px" }}>{item.title}</span>
                        <span style={{ color: "var(--muted)", fontFamily: "var(--mono)", fontSize: "11px", flexShrink: 0, marginLeft: "12px" }}>{item.meta} ↓</span>
                      </button>
                    )
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="s-band" style={{ borderTop: "1px solid var(--line)" }}>
        <div className="s-wrap" style={{ maxWidth: "600px", textAlign: "center" }}>
          <p className="s-eyebrow">Get in touch</p>
          <h2 style={{ fontSize: "clamp(24px,3vw,38px)", fontWeight: 800, letterSpacing: "-0.03em", color: "var(--paper)", margin: "12px 0 14px" }}>
            Need More Information?
          </h2>
          <p style={{ color: "var(--muted)", fontSize: "15px", lineHeight: 1.6, margin: "0 0 32px" }}>
            Our team is ready to provide additional documentation and answer any questions.
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
