import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";

const sections = [
  {
    id: "table-recognition",
    label: "A — Document AI & Table Recognition",
    slug: "table-recognition",
    datasets: [
      {
        tag: "Benchmark / Vision-Language",
        title: "DrishtiTable — Table Structure Recognition",
        description: "1,421 expert-annotated tables from S. Chand academic textbooks for image-to-HTML Table Structure Recognition (TSR). A fine-tuned 7B vision-language model beats zero-shot GPT-4o by +12.1 TEDS points. Includes a held-out benchmark with TEDS scoring and full composition breakdowns.",
        size: "1,421 tables",
        format: "Image + HTML + metadata",
        language: "English",
      },
    ],
  },
  {
    id: "stem-reasoning",
    label: "B — STEM Reasoning & Problem Solving",
    slug: "stem-reasoning",
    datasets: [
      {
        tag: "Pretraining + CoT",
        title: "India-STEM Reasoning Corpus",
        description: "A large-scale corpus of mathematics and science content spanning Class 6 to Class 12, aligned to CBSE and ICSE curricula. Includes worked solutions with step-by-step reasoning chains ideal for chain-of-thought training.",
        size: "450M tokens",
        format: "Text + CoT pairs",
        language: "English, Hindi",
      },
      {
        tag: "Reasoning / SFT",
        title: "JEE Advanced Problem-Solution Dataset",
        description: "Curated problem-solution pairs from India's most rigorous engineering entrance examination. Includes multi-step mathematical reasoning, physics derivations, and organic chemistry mechanisms — among the hardest STEM reasoning tasks available in any dataset.",
        size: "85M tokens",
        format: "Q&A + step-by-step solution",
        language: "English",
      },
      {
        tag: "Reasoning / SFT",
        title: "NEET Medical Reasoning Corpus",
        description: "Problem-solution pairs from India's national medical entrance exam covering biology, organic chemistry, and physics. Particularly strong for biomedical AI applications and science reasoning benchmarks.",
        size: "60M tokens",
        format: "Q&A + annotated solutions",
        language: "English",
      },
      {
        tag: "Pretraining / SFT",
        title: "Primary Mathematics Foundation Dataset",
        description: "Numeracy and mathematical reasoning content for Class 1–5, structured to teach foundational arithmetic, pattern recognition, and logical thinking. Valuable for training models to reason at accessible grade levels.",
        size: "120M tokens",
        format: "Concept explanations + exercises",
        language: "English, Hindi, 6 regional languages",
      },
    ],
  },
  {
    id: "language-literacy",
    label: "B — Language, Literacy & Comprehension",
    slug: "language-literacy",
    datasets: [
      {
        tag: "Pretraining / SFT",
        title: "English Language Mastery Corpus",
        description: "Comprehensive English language content from Class 1 to Class 12 — grammar, comprehension, composition, and literature. Built for models that need to understand English as it is taught and used in formal academic settings across South Asia.",
        size: "380M tokens",
        format: "Structured text + exercises",
        language: "English",
      },
      {
        tag: "Pretraining / SFT",
        title: "Hindi Language & Literature Dataset",
        description: "Formal Hindi language content aligned to CBSE curriculum — grammar, prose, poetry, and essay composition. One of the largest and most structured Hindi language AI training datasets available, covering Modern Standard Hindi and literary registers.",
        size: "290M tokens",
        format: "Structured text + exercises",
        language: "Hindi",
      },
      {
        tag: "Pretraining",
        title: "Indic Multilingual Education Corpus",
        description: "Curriculum-aligned academic content across 8 Indic languages — Bengali, Tamil, Telugu, Marathi, Gujarati, Kannada, Malayalam, and Punjabi. The most comprehensive multilingual curriculum dataset available for Indic AI model development.",
        size: "520M tokens",
        format: "Raw text corpus",
        language: "8 Indic languages",
      },
      {
        tag: "SFT / Evaluation",
        title: "Reading Comprehension & Inference Dataset",
        description: "Passage-question-answer triplets derived from academic reading comprehension exercises across subjects. Tests literal comprehension, inferential reasoning, and vocabulary in context — ideal for reading benchmark development.",
        size: "95M tokens",
        format: "Passage + Q&A triplets",
        language: "English, Hindi",
      },
    ],
  },
  {
    id: "social-sciences",
    label: "C — Social Sciences, Civics & General Knowledge",
    slug: "social-sciences",
    datasets: [
      {
        tag: "Pretraining / SFT",
        title: "Indian History & Civics Corpus",
        description: "Structured coverage of Indian history from ancient to modern, constitutional studies, political science, and civics. Critical for grounding AI models in accurate Indian historical and governance knowledge.",
        size: "180M tokens",
        format: "Structured text + Q&A",
        language: "English, Hindi",
      },
      {
        tag: "Pretraining",
        title: "World History & Geography Dataset",
        description: "Academic content covering world history, physical and human geography, and global economics aligned to Indian senior secondary curriculum. Strong factual density and timeline-based reasoning content.",
        size: "160M tokens",
        format: "Structured text",
        language: "English",
      },
      {
        tag: "SFT / RLHF",
        title: "UPSC & Civil Services Preparation Corpus",
        description: "Comprehensive content spanning the UPSC examination syllabus — history, polity, economy, environment, science and technology, and current affairs frameworks. Among the broadest general knowledge corpora available in structured form.",
        size: "210M tokens",
        format: "Concept notes + Q&A",
        language: "English, Hindi",
      },
    ],
  },
  {
    id: "higher-education",
    label: "D — Higher Education & Professional Knowledge",
    slug: "higher-education",
    datasets: [
      {
        tag: "Pretraining / SFT",
        title: "Commerce & Economics University Corpus",
        description: "Undergraduate-level content in economics, accountancy, business studies, and commerce. Structured for models that need to reason about financial concepts, market dynamics, and business decision-making.",
        size: "240M tokens",
        format: "Structured text + problems",
        language: "English",
      },
      {
        tag: "Pretraining / SFT",
        title: "Legal & Constitutional Studies Dataset",
        description: "Indian constitutional law, legal reasoning frameworks, and civics content derived from academic textbooks. Valuable for building legally-aware AI models grounded in Indian jurisprudence.",
        size: "130M tokens",
        format: "Structured text + case analysis",
        language: "English",
      },
      {
        tag: "Pretraining / SFT",
        title: "Engineering Fundamentals Corpus",
        description: "Core engineering sciences — mechanics, thermodynamics, electrical circuits, and materials science — at diploma and undergraduate level. Built for technical AI assistants and engineering education applications.",
        size: "195M tokens",
        format: "Concept text + solved problems",
        language: "English",
      },
    ],
  },
];

const searchStyle = {
  width: "100%",
  maxWidth: "520px",
  background: "rgba(0,0,0,0.4)",
  border: "1px solid var(--line)",
  borderRadius: "8px",
  padding: "12px 16px 12px 44px",
  color: "var(--paper)",
  fontFamily: "var(--sans)",
  fontSize: "0.95rem",
  outline: "none",
  display: "block",
};

export default function DatasetsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredSections, setFilteredSections] = useState(sections);

  useEffect(() => {
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const filtered = sections
        .map(s => ({
          ...s,
          datasets: s.datasets.filter(
            d =>
              d.title.toLowerCase().includes(q) ||
              d.description.toLowerCase().includes(q) ||
              d.tag.toLowerCase().includes(q)
          ),
        }))
        .filter(s => s.datasets.length > 0);
      setFilteredSections(filtered);
    } else {
      setFilteredSections(sections);
    }
  }, [searchQuery]);

  return (
    <div className="bg-[#0A0A0A]" style={{ paddingTop: "96px" }} data-testid="datasets-page">
      <Helmet>
        <title>Datasets — Nalandadata.ai</title>
        <meta name="description" content="Browse premium AI training datasets across STEM Reasoning, Language & Literacy, Social Sciences, and Higher Education. Research and enterprise licensing available." />
      </Helmet>

      {/* Hero */}
      <section className="s-band" style={{ borderTop: "none", paddingBottom: "48px" }}>
        <div className="s-wrap">
          <nav className="s-crumb" aria-label="Breadcrumb" style={{ marginBottom: "18px" }}>
            <Link to="/">Home</Link> / Datasets
          </nav>
          <p className="s-eyebrow">Datasets</p>
          <div className="s-sec-head" style={{ maxWidth: "56ch" }}>
            <h2>Premium curriculum-verified AI training data.</h2>
            <p className="lead">
              Expert-authored datasets across STEM, language, social sciences, and higher education.
              Available for research licensing and commercial enterprise agreements.
            </p>
          </div>

          {/* Search */}
          <div style={{ marginTop: "32px", position: "relative", display: "inline-block", width: "100%", maxWidth: "520px" }}>
            <span style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", color: "var(--muted)", fontSize: "1rem", pointerEvents: "none" }}>⌕</span>
            <input
              type="text"
              placeholder="Search by name, subject, or use case..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              style={searchStyle}
              data-testid="dataset-search-input"
            />
          </div>
        </div>
      </section>

      {/* Dataset sections */}
      <section className="s-band alt" style={{ paddingTop: "48px" }}>
        <div className="s-wrap">
          {filteredSections.length === 0 ? (
            <p style={{ color: "var(--muted)", textAlign: "center", padding: "48px 0" }}>No datasets found matching your search.</p>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "64px" }}>
              {filteredSections.map(section => (
                <div key={section.id} id={section.id}>
                  {/* Section header */}
                  <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: "24px", gap: "16px", flexWrap: "wrap" }}>
                    <p style={{
                      fontFamily: "var(--mono)",
                      fontSize: "11px",
                      letterSpacing: "0.14em",
                      textTransform: "uppercase",
                      color: "var(--accent)",
                      margin: 0,
                    }}>
                      {section.label}
                    </p>
                    <Link
                      to={`/datasets/${section.slug}`}
                      style={{ fontFamily: "var(--mono)", fontSize: "12px", color: "var(--muted)", textDecoration: "none" }}
                    >
                      View details →
                    </Link>
                  </div>

                  {/* Dataset cards */}
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(min(100%, 280px), 1fr))", gap: "16px" }}>
                    {section.datasets.map((ds, di) => (
                      <Link
                        key={ds.title}
                        to={`/datasets/${section.slug}`}
                        className="s-dsc"
                        style={{ textDecoration: "none", color: "inherit", transition: "border-color .15s" }}
                        data-testid={`dataset-item-${section.slug}-${di}`}
                        onMouseEnter={e => e.currentTarget.style.borderColor = "var(--accent)"}
                        onMouseLeave={e => e.currentTarget.style.borderColor = "var(--line)"}
                      >
                        <div className="de">[{ds.tag}]</div>
                        <h3>{ds.title}</h3>
                        <p>{ds.description}</p>
                        <div className="meta">
                          Size: {ds.size}<br />
                          Format: {ds.format}<br />
                          Language: {ds.language}
                        </div>
                        <span className="dl">View Details →</span>
                      </Link>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="s-band">
        <div className="s-wrap" style={{ textAlign: "center" }}>
          <p className="s-eyebrow" style={{ justifyContent: "center" }}>Custom data</p>
          <h2>Need a dataset we don't have?</h2>
          <p className="lead" style={{ margin: "18px auto 28px", maxWidth: "48ch" }}>
            We can build custom datasets tailored to your specific domain, format, and scale requirements.
          </p>
          <Link className="s-btn primary" to="/contact" data-testid="custom-dataset-btn">
            Request Custom Dataset →
          </Link>
        </div>
      </section>
    </div>
  );
}
