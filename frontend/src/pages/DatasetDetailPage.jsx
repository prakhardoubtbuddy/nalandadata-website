import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { BenchmarkCharts } from "@/components/BenchmarkCharts";
import { Helmet } from "react-helmet-async";
import axios from "axios";
import API from "@/lib/api";

const datasetConfigs = {
  "table-recognition": {
    title: "DrishtiTable — Table Structure Recognition",
    subtitle: "Image-to-HTML Benchmark for Indian Academic Tables",
    overview:
      "DrishtiTable is a benchmark for Table Structure Recognition (TSR): converting a table image into clean, machine-readable HTML — rows, columns, headers, and merged cells. It comprises 1,421 expert-annotated tables from S. Chand academic textbooks across statistics, finance, accounting, quantitative techniques and engineering. A 7B vision-language model fine-tuned on this data outperforms zero-shot GPT-4o by +12.1 TEDS points.",
    useCases: [
      "Document AI & intelligent document processing",
      "Table extraction from textbooks and reports",
      "Fine-tuning vision-language models for TSR",
      "Benchmark evaluation of multimodal models",
      "Financial statement and ledger digitization",
    ],
    structure: [
      { field: "table_id", description: "Unique identifier per table" },
      { field: "image_path", description: "Source table image" },
      { field: "html", description: "Ground-truth HTML (thead/tbody, colspan/rowspan)" },
      { field: "subject_domain", description: "Statistics / Finance / Accounting / OR / etc." },
      { field: "table_type", description: "Statistical / Financial / Lookup / Comparison" },
      { field: "is_complex", description: "Complexity flag (merged cells, multi-level headers)" },
      { field: "hierarchy_levels", description: "Flat vs. multi-level header hierarchy" },
    ],
    stats: {
      "Total Tables": "1,421",
      "Train / Val / Test": "1,141 / 145 / 135",
      "Best Model (TEDS)": "83.2%",
      "vs GPT-4o": "+12.1 pts",
      "Subjects": "6 families",
      "Source Books": "9 (S. Chand)",
    },
    benchmark: {
      metricLabel: "TEDS",
      oursLabel: "DrishtiTable (Ours)",
      headline:
        "Evaluated on a held-out test set with TEDS (Tree-Edit-Distance Similarity, 0–100%). A fine-tuned 7B open model beats every zero-shot frontier model. Distribution charts below reflect the full 1,421-table annotated corpus.",
      models: [
        { name: "DrishtiTable (Ours)", score: 83.2 },
        { name: "GPT-4o", score: 71.1 },
        { name: "GPT-4.1", score: 68.0 },
        { name: "o4-mini", score: 61.4 },
        { name: "Qwen2.5-VL-7B (base)", score: 58.8 },
      ],
      distributions: [
        {
          title: "Table-Type Distribution",
          caption: "Full corpus (1,421 tables) by table type.",
          colorful: true,
          data: [
            { name: "Statistical", value: 684 },
            { name: "Financial", value: 459 },
            { name: "Lookup", value: 217 },
            { name: "Comparison", value: 49 },
            { name: "Calculation", value: 6 },
          ],
        },
        {
          title: "Subject Distribution",
          caption: "Full corpus by subject family.",
          colorful: true,
          data: [
            { name: "Business Statistics", value: 535 },
            { name: "Business & Finance", value: 439 },
            { name: "Quant. Techniques / OR", value: 197 },
            { name: "Financial Accounting", value: 171 },
            { name: "Engineering / Science", value: 38 },
            { name: "Ethics / Humanities", value: 33 },
          ],
        },
        {
          title: "Complexity Distribution",
          caption: "Simple vs. complex tables across the full corpus.",
          data: [
            { name: "Simple", value: 1136 },
            { name: "Complex", value: 285 },
          ],
        },
        {
          title: "Structural Features",
          caption: "Tables exhibiting each structural feature (full corpus).",
          data: [
            { name: "Empty cells", value: 773 },
            { name: "Complex", value: 285 },
            { name: "Merged cells", value: 200 },
            { name: "No grid lines", value: 174 },
            { name: "Colored", value: 164 },
            { name: "Multi-page", value: 64 },
          ],
        },
      ],
      source:
        "Source: DrishtiTable corpus (1,421 expert-annotated tables). Metric: TEDS on the 135-table held-out test set.",
    },
    sampleData: [
      {
        "Table Type": "Financial — Trial Balance",
        "Subject": "Financial Accounting",
        "Structure": "Multi-level header, merged cells, 2 hierarchy levels",
        "HTML": "<table><thead><tr><th rowspan='2'>Particulars</th><th colspan='2'>Amount (Rs.)</th></tr><tr><th>Debit</th><th>Credit</th></tr></thead><tbody>…</tbody></table>",
      },
      {
        "Table Type": "Statistical — Frequency Distribution",
        "Subject": "Business Statistics",
        "Structure": "Flat header, empty cells, no merged cells",
        "HTML": "<table><thead><tr><th>Class Interval</th><th>Frequency</th><th>Cumulative</th></tr></thead><tbody>…</tbody></table>",
      },
    ],
  },
  "stem-reasoning": {
    title: "STEM Reasoning & Problem Solving",
    subtitle: "JEE / NEET / Olympiad Level Reasoning",
    overview: "A large-scale collection of mathematics and science content spanning Class 1 to Class 12, aligned to CBSE and ICSE curricula. Covers JEE Advanced, NEET, and Olympiad-level problems with multi-step worked solutions ideal for chain-of-thought and reasoning model training.",
    useCases: [
      "Chain-of-thought reasoning training",
      "Fine-tuning STEM reasoning LLMs",
      "Medical and engineering AI assistants",
      "Benchmark evaluation for science models",
      "Mathematical problem-solving research",
    ],
    structure: [
      { field: "Question", description: "Problem statement with full context" },
      { field: "Options", description: "Multiple choice options where applicable" },
      { field: "Correct Answer", description: "Verified correct answer" },
      { field: "Solution", description: "Multi-step expert explanation CoT" },
      { field: "Subject", description: "Maths / Physics / Chemistry / Biology" },
      { field: "Subtopic", description: "Specific topic classification" },
      { field: "Difficulty", description: "Easy / Medium / Hard / Advanced" },
      { field: "Source", description: "JEE / NEET / Olympiad / CBSE classification" },
    ],
    stats: {
      "Tokens": "715M+",
      "Questions": "1.5M+",
      "Subjects": "4",
      "Difficulty Levels": "4",
      "Languages": "English, Hindi",
    },
    sampleData: [
      {
        "Question": "Two blocks of masses 3 kg and 5 kg are connected by a light string passing over a frictionless pulley. Find the acceleration of the system and tension in the string. (g = 10 m/s²)",
        "Options": "A) a = 2.5 m/s², T = 37.5 N  B) a = 3.0 m/s², T = 40 N  C) a = 2.0 m/s², T = 35 N",
        "Answer": "A) a = 2.5 m/s², T = 37.5 N",
        "Solution": "Net force = (5−3)×10 = 20 N. Total mass = 8 kg. a = 20/8 = 2.5 m/s². T = 3×(10+2.5) = 37.5 N",
        "Subject": "Physics — Laws of Motion",
        "Difficulty": "Medium",
      },
      {
        "Question": "If the roots of the equation x² − px + q = 0 are in the ratio 2:3, prove that 6p² = 25q.",
        "Answer": "Let roots be 2α and 3α. Sum = 5α = p → α = p/5. Product = 6α² = q → 6(p/5)² = q → 6p² = 25q. ∎",
        "Subject": "Mathematics — Quadratic Equations",
        "Difficulty": "Medium",
      },
    ],
  },
  "language-literacy": {
    title: "Language, Literacy & Comprehension",
    subtitle: "English, Hindi & 8 Indic Languages",
    overview: "Curriculum-aligned language content from Class 1 to Class 12 covering English grammar, Hindi literature, reading comprehension, and academic content in 8 Indic languages. One of the largest structured multilingual education corpora available for Indic AI development.",
    useCases: [
      "Multilingual LLM pretraining",
      "Indic language model development",
      "Reading comprehension benchmarks",
      "Grammar and composition fine-tuning",
      "Cross-lingual transfer learning",
    ],
    structure: [
      { field: "Content", description: "Educational text: prose, grammar, comprehension" },
      { field: "Language", description: "Language code: en, hi, bn, ta, te, etc." },
      { field: "Subject", description: "English / Hindi / Regional Language" },
      { field: "Grade", description: "Target grade level 1–12" },
      { field: "Type", description: "Explanation / Exercise / Q&A / Passage" },
      { field: "Script", description: "Writing script used" },
      { field: "Translation", description: "Parallel translations where available" },
    ],
    stats: {
      "Tokens": "1.28B+",
      "Languages": "10",
      "Scripts": "8",
      "Parallel Pairs": "2M+",
      "Grades": "1–12",
    },
    sampleData: [
      {
        "Passage": "The ancient city of Mohenjo-daro was remarkable for its urban planning. Its streets were laid out in a grid pattern, and the city had an advanced drainage system with covered drains running alongside the roads.",
        "Question": "What does the passage suggest about the Indus Valley Civilisation?",
        "Answer": "It was a highly organised and technically advanced civilisation with sophisticated infrastructure including planned streets and underground drainage.",
        "Language": "English",
        "Subject": "Reading Comprehension",
        "Grade": "Grade 8",
      },
    ],
  },
  "social-sciences": {
    title: "Social Sciences, Civics & General Knowledge",
    subtitle: "History, Geography, Polity & UPSC",
    overview: "Structured academic content covering Indian and world history, geography, political science, economics, and civics — from Class 6 through to the UPSC examination syllabus. Critical for grounding AI models in accurate Indian historical, governance, and general knowledge.",
    useCases: [
      "General knowledge model pretraining",
      "UPSC and civil services AI assistants",
      "Factual question answering systems",
      "History and geography reasoning",
      "RLHF data for knowledge-grounded models",
    ],
    structure: [
      { field: "Content", description: "Structured academic text" },
      { field: "Subject", description: "History / Geography / Civics / Economics" },
      { field: "Grade / Level", description: "Class 6–12 or Graduate UPSC" },
      { field: "Q&A Pairs", description: "Derived question-answer pairs" },
      { field: "Timeline", description: "Chronological tags where applicable" },
      { field: "Region", description: "India / World classification" },
      { field: "Language", description: "English or Hindi" },
    ],
    stats: {
      "Tokens": "550M+",
      "Subjects": "5",
      "QA Pairs": "800K+",
      "UPSC Domains": "9",
      "Languages": "English, Hindi",
    },
    sampleData: [
      {
        "Question": "What were the main causes of the First War of Indian Independence (1857)?",
        "Answer": "Causes included: (1) Political — annexation policy (Doctrine of Lapse); (2) Economic — drain of wealth and ruin of Indian industries; (3) Social — interference in social customs; (4) Military — introduction of the Enfield rifle cartridge greased with animal fat.",
        "Subject": "Indian History — Modern India",
        "Level": "Class 10 / UPSC",
      },
    ],
  },
  "higher-education": {
    title: "Higher Education & Professional Knowledge",
    subtitle: "Commerce, Law & Engineering — Diploma to UG",
    overview: "Undergraduate and diploma-level content spanning commerce, economics, accountancy, constitutional law, and core engineering sciences. Built for AI assistants targeting professional and higher-education domains, grounded in Indian academic syllabi.",
    useCases: [
      "Finance and commerce AI assistants",
      "Legal reasoning model training",
      "Engineering education platforms",
      "Professional certification prep tools",
      "Domain-specific LLM fine-tuning",
    ],
    structure: [
      { field: "Content", description: "Structured academic text or problem" },
      { field: "Domain", description: "Commerce / Law / Engineering" },
      { field: "Level", description: "Diploma / Undergraduate" },
      { field: "Subject", description: "Specific subject e.g. Thermodynamics, Contract Law" },
      { field: "Solution", description: "Solved problems or case analysis" },
      { field: "Concepts", description: "Key concepts and definitions" },
      { field: "Language", description: "English" },
    ],
    stats: {
      "Tokens": "565M+",
      "Domains": "3",
      "Subjects": "12+",
      "Solved Problems": "400K+",
      "Level": "Diploma-UG",
    },
    sampleData: [
      {
        "Question": "Distinguish between 'void agreement' and 'voidable contract' under the Indian Contract Act, 1872.",
        "Answer": "A void agreement (Section 2(g)) is not enforceable by law from the very beginning — e.g., an agreement with a minor. A voidable contract (Section 2(i)) is enforceable at the option of one party — e.g., a contract made under coercion.",
        "Subject": "Business Law / Contract Law",
        "Domain": "Law",
        "Level": "B.Com / LLB",
      },
    ],
  },
};

const sideCard = {
  background: "var(--panel)",
  border: "1px solid var(--line)",
  borderRadius: "12px",
  padding: "24px",
};

export default function DatasetDetailPage() {
  const { slug } = useParams();
  const [downloadFiles, setDownloadFiles] = useState([]);

  const dataset = datasetConfigs[slug];

  useEffect(() => {
    const fetchFiles = async () => {
      try {
        const response = await axios.get(`${API}/files/category/${slug}`);
        setDownloadFiles(response.data);
      } catch {
        // silently ignore
      }
    };
    if (slug) fetchFiles();
  }, [slug]);

  if (!dataset) {
    return (
      <div className="bg-[#0A0A0A]" style={{ paddingTop: "96px", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ textAlign: "center" }}>
          <h2 style={{ color: "var(--paper)", marginBottom: "16px" }}>Dataset not found</h2>
          <Link to="/datasets" className="s-btn ghost">← Back to Datasets</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#0A0A0A]" style={{ paddingTop: "96px" }} data-testid="dataset-detail-page">
      <Helmet>
        <title>{dataset.title} — Nalandadata.ai</title>
        <meta name="description" content={dataset.overview.slice(0, 155)} />
        <meta property="og:title" content={`${dataset.title} — Nalandadata.ai`} />
        <meta property="og:description" content={dataset.overview.slice(0, 155)} />
        <script type="application/ld+json">{JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Dataset",
          "name": dataset.title,
          "description": dataset.overview,
          "creator": { "@type": "Organization", "name": "Nalandadata.ai" },
          "publisher": { "@type": "Organization", "name": "S Chand Group" },
          "license": "https://nalandadata.ai/contact",
          "isAccessibleForFree": false,
        })}</script>
      </Helmet>

      {/* Hero */}
      <section className="s-band" style={{ borderTop: "none", paddingBottom: "48px" }}>
        <div className="s-wrap">
          <nav className="s-crumb" aria-label="Breadcrumb" style={{ marginBottom: "18px" }}>
            <Link to="/">Home</Link> / <Link to="/datasets">Datasets</Link> / {dataset.title}
          </nav>
          <p className="s-eyebrow">{dataset.subtitle}</p>
          <div className="s-sec-head" style={{ maxWidth: "72ch" }}>
            <h2>{dataset.title}</h2>
            <p className="lead">{dataset.overview}</p>
          </div>
        </div>
      </section>

      {/* Benchmark charts (DrishtiTable only) */}
      {dataset.benchmark && (
        <section className="s-band alt" style={{ paddingTop: "40px", paddingBottom: "40px" }}>
          <div className="s-wrap">
            <BenchmarkCharts benchmark={dataset.benchmark} />
          </div>
        </section>
      )}

      {/* Main content */}
      <section className="s-band alt">
        <div className="s-wrap">
          <div style={{ display: "grid", gridTemplateColumns: "1fr 320px", gap: "48px", alignItems: "start" }}>

            {/* Left: use cases + schema + samples */}
            <div style={{ display: "flex", flexDirection: "column", gap: "48px" }}>

              {/* Use cases */}
              <div>
                <p className="s-eyebrow" style={{ marginBottom: "20px" }}>Use Cases</p>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                  {dataset.useCases.map((uc, i) => (
                    <div key={i} style={{
                      background: "var(--ink)",
                      border: "1px solid var(--line)",
                      borderRadius: "8px",
                      padding: "14px 16px",
                      color: "var(--paper)",
                      fontSize: "0.9rem",
                      lineHeight: 1.4,
                      display: "flex",
                      gap: "10px",
                      alignItems: "flex-start",
                    }}>
                      <span style={{ color: "var(--accent)", flexShrink: 0, marginTop: "1px" }}>✓</span>
                      {uc}
                    </div>
                  ))}
                </div>
              </div>

              {/* Dataset structure */}
              <div>
                <p className="s-eyebrow" style={{ marginBottom: "20px" }}>Dataset Structure</p>
                <div className="s-tablecard">
                  <div className="s-tbl-scroll">
                    <table style={{ width: "100%", borderCollapse: "collapse", minWidth: "480px" }}>
                      <thead>
                        <tr>
                          <th style={{ fontFamily: "var(--mono)", fontSize: "10.5px", letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--muted)", textAlign: "left", padding: "14px 22px 10px", borderBottom: "1px solid var(--line)", fontWeight: 600 }}>Field</th>
                          <th style={{ fontFamily: "var(--mono)", fontSize: "10.5px", letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--muted)", textAlign: "left", padding: "14px 22px 10px", borderBottom: "1px solid var(--line)", fontWeight: 600 }}>Description</th>
                        </tr>
                      </thead>
                      <tbody>
                        {dataset.structure.map((item, i) => (
                          <tr key={i} style={{ borderBottom: i < dataset.structure.length - 1 ? "1px solid var(--line-soft)" : "none" }}>
                            <td style={{ fontFamily: "var(--mono)", fontSize: "13.5px", color: "var(--accent)", padding: "13px 22px", textAlign: "left" }}>{item.field}</td>
                            <td style={{ fontSize: "13.5px", color: "#CFC8BB", padding: "13px 22px", textAlign: "left" }}>{item.description}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              {/* Sample data */}
              <div>
                <p className="s-eyebrow" style={{ marginBottom: "20px" }}>Sample Data Preview</p>
                <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                  {dataset.sampleData.map((sample, i) => (
                    <div key={i} style={{ background: "var(--ink)", border: "1px solid var(--line)", borderRadius: "12px", padding: "24px" }}>
                      {Object.entries(sample).map(([key, value]) => (
                        <div key={key} style={{ display: "flex", gap: "16px", marginBottom: "10px" }}>
                          <span style={{ fontFamily: "var(--mono)", fontSize: "10.5px", letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--muted)", flexShrink: 0, width: "100px", paddingTop: "2px" }}>
                            {key}
                          </span>
                          <span style={{ fontSize: "13.5px", color: "#CFC8BB", lineHeight: 1.6 }}>{value}</span>
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right: stats + CTAs (sticky) */}
            <div style={{ position: "sticky", top: "96px", display: "flex", flexDirection: "column", gap: "16px" }}>

              {/* Stats */}
              <div style={sideCard}>
                <p style={{ fontFamily: "var(--mono)", fontSize: "10.5px", letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--muted)", marginBottom: "18px" }}>Dataset Size</p>
                <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                  {Object.entries(dataset.stats).map(([key, value]) => (
                    <div key={key} style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: "8px" }}>
                      <span style={{ color: "var(--muted)", fontSize: "13.5px" }}>{key}</span>
                      <span style={{ fontFamily: "var(--mono)", fontSize: "13.5px", fontWeight: 600, color: "var(--paper)" }}>{value}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Download sample */}
              <div style={{ ...sideCard, background: "var(--accent-tint)", borderColor: "var(--accent-deep)" }}>
                <p style={{ fontWeight: 700, color: "var(--paper)", marginBottom: "8px", fontSize: "0.95rem" }}>Download Sample Dataset</p>
                <p style={{ color: "var(--muted)", fontSize: "0.85rem", lineHeight: 1.6, marginBottom: "16px" }}>
                  Get access to sample data and explore the dataset structure.
                </p>
                <Link className="s-btn primary" to="/contact" style={{ width: "100%", textAlign: "center", justifyContent: "center", display: "block" }} data-testid="download-sample-btn">
                  Download Sample →
                </Link>
              </div>

              {/* Request full */}
              <div style={sideCard}>
                <p style={{ fontWeight: 700, color: "var(--paper)", marginBottom: "8px", fontSize: "0.95rem" }}>Need the Full Dataset?</p>
                <p style={{ color: "var(--muted)", fontSize: "0.85rem", lineHeight: 1.6, marginBottom: "16px" }}>
                  Contact our team to discuss licensing and custom requirements.
                </p>
                <Link className="s-btn ghost" to="/contact" style={{ width: "100%", textAlign: "center", justifyContent: "center", display: "block" }} data-testid="request-full-dataset-btn">
                  Request Full Dataset →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
