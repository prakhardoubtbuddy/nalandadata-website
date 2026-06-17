import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { motion, useInView } from "framer-motion";
import { Download, Check, ArrowRight, Pencil, Search, Activity, Globe2 } from "lucide-react";
import HuggingFaceSection from "@/components/HuggingFaceSection";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LeadCaptureForm } from "@/components/LeadCaptureForm";
import { Helmet } from "react-helmet-async";
import axios from "axios";
import API from "@/lib/api";

function AnimatedCounter({ end, suffix = "", prefix = "", duration = 2 }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (isInView) {
      let start = 0;
      const increment = end / (duration * 60);
      const timer = setInterval(() => {
        start += increment;
        if (start >= end) {
          setCount(end);
          clearInterval(timer);
        } else {
          setCount(Math.floor(start));
        }
      }, 1000 / 60);
      return () => clearInterval(timer);
    }
  }, [isInView, end, duration]);

  return (
    <span ref={ref} className="stat-number">
      {prefix}{count.toLocaleString()}{suffix}
    </span>
  );
}

const heroCategoryTags = [
  "Frontier LLM Training",
  "RLHF & Preference Data",
  "Multimodal & Vision-Language",
  "Indic AI & Sovereign AI",
  "Enterprise Domain Fine-Tuning",
  "Evaluation Benchmarks",
  "Agentic & RAG Pipelines",
];

const comparisonRows = [
  { label: "Clean IP ownership" },
  { label: "Multi-step reasoning chains" },
  { label: "Difficulty stratification" },
  { label: "Coherent knowledge structure" },
  { label: "Authentic Indic linguistic diversity" },
  { label: "Verifiable ground truth" },
  { label: "Contamination-resistant" },
  { label: "Multimodal (diagrams, audio, OCR)", scraped: "Partial" },
  { label: "SFT / RLHF / CoT / HITL ready", scraped: "Partial" },
  { label: "Expert human baseline scores" },
];

const performanceMetrics = [
  {
    value: "+11.5%",
    label: "Reasoning accuracy on STEM benchmarks",
    sub: "Based on fine-tuning evaluations with frontier model partners · STEM reasoning benchmark suite",
  },
  {
    value: "+7.2%",
    label: "MMLU score improvement",
    sub: "Based on fine-tuning evaluations with frontier model partners · MMLU academic benchmark",
  },
  {
    value: "98%",
    label: "Data quality score on delivered datasets",
    sub: "Multi-stage expert review · Node-level validation · Inter-annotator agreement scoring",
  },
  {
    value: "500K+",
    label: "Chain of thought reasoning chains",
    sub: "Explicit step-by-step reasoning from foundational to advanced, structured for direct model integration",
  },
];

const testimonials = [
  {
    type: "FRONTIER MODEL TRAINING",
    quote: "Used to improve STEM reasoning capabilities across multiple frontier model training runs — improving multi-step physics and chemistry performance on internal evaluation benchmarks beyond what synthetic data alone could achieve.",
    source: "Frontier AI lab partner",
    dataset: "India-STEM Reasoning + JEE Advanced CoT",
  },
  {
    type: "MULTILINGUAL MODEL DEVELOPMENT",
    quote: "The Indic multilingual corpus provided curriculum-structured training signal across 8 scripts that web-scraped sources could not. Coverage depth and linguistic diversity were materially superior to any alternative we evaluated.",
    source: "Global technology company",
    dataset: "Indic Multilingual Education Corpus",
  },
  {
    type: "SFT & INSTRUCTION TUNING",
    quote: "Clean IP provenance and expert-verified difficulty gradients made the instruction dataset the strongest structured SFT corpus we have used. The annotation quality and domain expert coverage set a new bar for our evaluation pipeline.",
    source: "Enterprise AI team",
    dataset: "Academic Q&A Instruction Dataset",
  },
];

const audiences = [
  {
    label: "FRONTIER AI LABS",
    title: "Pretraining & post-training at scale",
    description: "Teams building foundation models need high-quality reasoning corpora, SFT instruction pairs, and RLHF preference data that web-scraped sources cannot provide. Our structured, difficulty-graded datasets improve multi-step reasoning accuracy and reduce hallucination on complex domain tasks — at a quality level synthetic generation cannot reach.",
    tags: ["INDIA-STEM REASONING", "JEE ADVANCED COT", "ACADEMIC QA SFT", "CHAIN-OF-THOUGHT"],
  },
  {
    label: "ENTERPRISE AI TEAMS",
    title: "Domain fine-tuning for production AI",
    description: "Legal AI assistants, financial reasoning models, compliance tools, and medical AI applications need domain-specific training data grounded in verified expert knowledge — not web scrapes. Our domain corpora provide the conceptual depth, structured reasoning chains, and difficulty gradients enterprise models require for reliable production performance.",
    tags: ["LEGAL & CONSTITUTIONAL", "COMMERCE & ECONOMICS", "ENGINEERING FUNDAMENTALS", "UPSC & CIVICS"],
  },
  {
    label: "GOVERNMENT & SOVEREIGN AI",
    title: "Bharat-first AI infrastructure",
    description: "IndiaAI Mission ecosystem teams, BharatGPT, and sovereign AI programmes building for India's 1.4B population need curriculum-verified, Indic-script training data. Our multilingual corpora across 8 scripts are aligned to IndiaAI Mission requirements for national AI infrastructure.",
    tags: ["INDIC MULTILINGUAL CORPUS", "HINDIC LITERATURE", "INDIAN HISTORY & CIVICS", "INDIC BENCHMARKS"],
  },
];

const catalogueTabs = [
  {
    id: "pretraining",
    label: "Pretraining Corpora",
    datasets: [
      {
        tag: "PRETRAINING + COT",
        title: "India-STEM Reasoning Corpus",
        description: "Large-scale mathematics and science reasoning corpus spanning foundational to advanced difficulty. Worked solutions with explicit step-by-step reasoning chains — structured for chain-of-thought and multi-step reasoning model training.",
        tokens: "450M tokens",
        language: "English, Hindi",
        difficulty: "Easy → Advanced",
        slug: "stem-reasoning",
      },
      {
        tag: "PRETRAINING",
        title: "Indic Multilingual Education Corpus",
        description: "Structured knowledge corpora across 8 Indic languages — Bengali, Tamil, Telugu, Marathi, Gujarati, Kannada, Malayalam, Punjabi. The most comprehensive multilingual training corpus available for Indic AI and sovereign language model development.",
        tokens: "520M tokens",
        language: "8 Indic scripts",
        format: "Raw text corpus",
        slug: "language-literacy",
      },
      {
        tag: "PRETRAINING / SFT",
        title: "Hindi Language & Literature Dataset",
        description: "Formal Hindi language corpus — grammar, prose, poetry, essay composition. One of the largest structured Hindi AI training datasets available. Covers Modern Standard Hindi and literary registers across difficulty levels.",
        tokens: "290M tokens",
        language: "Hindi",
        format: "Structured text + exercises",
        slug: "language-literacy",
      },
    ],
  },
  {
    id: "reasoning",
    label: "Hard Reasoning & STEM",
    datasets: [
      {
        tag: "REASONING / SFT",
        title: "JEE Advanced Problem-Solution Dataset",
        description: "Curated problem-solution pairs from India's most rigorous engineering entrance examination. Includes multi-step mathematical reasoning, physics derivations, and organic chemistry mechanisms with fully worked solutions.",
        tokens: "85M tokens",
        language: "English",
        format: "Q&A + step-by-step solution",
        slug: "stem-reasoning",
      },
      {
        tag: "EVALUATION",
        title: "Academic Q&A Instruction Dataset",
        description: "High-quality Q&A instruction pairs across CBSE, ICSE, and competitive examination domains. Difficulty-graded with expert-verified answers for SFT and evaluation benchmark development.",
        tokens: "180M tokens",
        language: "English, Hindi",
        format: "Instruction pairs",
        slug: "stem-reasoning",
      },
    ],
  },
  {
    id: "multimodal",
    label: "Complex & Multimodal",
    datasets: [
      {
        tag: "MULTIMODAL",
        title: "Science Diagram & Visual Reasoning Corpus",
        description: "Annotated STEM diagrams, charts, and figures with structured textual descriptions and reasoning chains. Built for multimodal model training and visual question answering on technical academic content.",
        tokens: "120M tokens",
        language: "English",
        format: "Image + text pairs",
        slug: "stem-reasoning",
      },
    ],
  },
  {
    id: "sft",
    label: "SFT & Instruction Tuning",
    datasets: [
      {
        tag: "SFT / RLHF",
        title: "UPSC & Civil Services Preparation Corpus",
        description: "Comprehensive content spanning the UPSC examination syllabus — history, polity, economy, environment, science and technology, and current affairs frameworks. Among the broadest general knowledge corpora available in structured form.",
        tokens: "210M tokens",
        language: "English, Hindi",
        format: "Concept notes + Q&A",
        slug: "social-sciences",
      },
      {
        tag: "SFT",
        title: "Teacher Explanation & Pedagogy Dataset",
        description: "Structured teacher explanations and pedagogically-sound answers aligned to curriculum standards. Designed for building AI tutors that explain concepts in the way expert educators do — not just answer retrieval.",
        tokens: "95M tokens",
        language: "English",
        format: "Explanation pairs",
        slug: "higher-education",
      },
    ],
  },
  {
    id: "higher-ed",
    label: "Higher Education",
    datasets: [
      {
        tag: "PRETRAINING / SFT",
        title: "Commerce & Economics University Corpus",
        description: "Undergraduate-level content in economics, accountancy, business studies, and commerce. Structured for models that need to reason about financial concepts, market dynamics, and business decision-making.",
        tokens: "240M tokens",
        language: "English",
        format: "Structured text + problems",
        slug: "higher-education",
      },
      {
        tag: "SFT / RLHF",
        title: "Legal & Constitutional Studies Dataset",
        description: "Indian constitutional law, legal reasoning, case analysis, and legislative frameworks. Built for legal AI, compliance tools, and government AI applications requiring verified legal knowledge.",
        tokens: "160M tokens",
        language: "English",
        format: "Structured legal text",
        slug: "social-sciences",
      },
    ],
  },
];

const services = [
  {
    icon: Pencil,
    title: "Custom Dataset Development",
    description: "Your training objective, built on our archive. Scoped, annotated, and delivered to your exact requirements — subject, language, difficulty, and format.",
    meta: "Typical delivery: 2–4 weeks · All formats: JSON, Parquet, CSV · Secure encrypted transfer",
  },
  {
    icon: Search,
    title: "AI Factuality Audit",
    description: "We evaluate your model's outputs against verified academic ground truth — mapping hallucinations on Indian knowledge and generating targeted remediation datasets.",
    meta: "Structured error analysis by subject · Remediation dataset construction · Pre/post benchmark tracking",
  },
  {
    icon: Activity,
    title: "Data Pipeline Engineering",
    description: "Hub-to-JSON pipelines, deduplication, quality filtering, annotation tooling, and CI/CD for continuous dataset delivery in JSONL, Parquet, or CSV.",
    meta: "Integrates with LangChain · Label Studio · Argilla workflows · Versioned dataset releases · JSONL schema documented",
  },
  {
    icon: Globe2,
    title: "India Language Solutions",
    description: "Specialist Indic dataset development for teams building for India's 1.4B population. Datasets are aligned to IndiaAI Mission requirements for curriculum-verified, multilingual, Indic-script training data.",
    meta: "8 Indic scripts · Parallel corpora · Multilingual benchmarks · Sovereign AI ready",
  },
];

function TagPill({ label, className = "" }) {
  return (
    <span className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border border-white/10 text-[13px] font-mono text-[#777] ${className}`}>
      <span className="w-1 h-1 rounded-full bg-[#C8A96E]" />
      {label}
    </span>
  );
}

export default function HomePage() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [downloadFiles, setDownloadFiles] = useState([]);
  const [preselectedDataset, setPreselectedDataset] = useState("");

  useEffect(() => {
    const fetchFiles = async () => {
      try {
        const response = await axios.get(`${API}/files`);
        setDownloadFiles(response.data.filter((f) => f.is_sample).slice(0, 3));
      } catch (error) {
        if (process.env.NODE_ENV === "development") console.error("Error fetching files:", error);
      }
    };
    fetchFiles();
  }, []);

  const openFormWithDataset = (slug) => {
    setPreselectedDataset(slug);
    setIsFormOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#0D0D0D]" data-testid="home-page">
      <Helmet>
        <title>nalandadata.ai — The training data frontier models can't synthesize</title>
        <meta name="description" content="Human-authored. Expert-verified. Multimodal. Impossible to replicate. The reasoning signal LLMs cannot generate for themselves. For frontier labs, enterprise AI teams, and government AI programmes." />
      </Helmet>

      {/* ── HERO ────────────────────────────────────────────────────── */}
      <section className="relative pt-28 pb-0 overflow-hidden" data-testid="hero-section">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="max-w-3xl"
          >
            <h1
              className="font-bold leading-[1.0] tracking-tight mb-6"
              style={{ fontSize: "clamp(52px, 7vw, 96px)", color: "#F0EBE0" }}
            >
              The training data
              <br />frontier models
              <br /><span style={{ color: "#C8A96E" }}>can't synthesize.</span>
            </h1>

            <p className="text-[#F0EBE0] text-lg mb-3 font-medium">
              Human-authored. Expert-verified. Multimodal. Impossible to replicate.
            </p>

            <p className="text-[#AAA] text-[15px] font-medium leading-relaxed max-w-xl mb-6">
              Difficulty-graded. Structured. Human-verified.{" "}
              <strong className="text-[#C8A96E] font-semibold">
                The reasoning signal LLMs cannot generate for themselves.
              </strong>{" "}
              For frontier labs, enterprise AI teams, and government AI programmes.
            </p>

            <div className="flex flex-wrap gap-2 mb-10">
              {heroCategoryTags.map((tag) => (
                <TagPill key={tag} label={tag} />
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── CTA + STATS + TRUSTED BY ─────────────────────────────────── */}
      <section className="py-10 border-b border-[#252525]" data-testid="stats-section">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <div className="flex flex-wrap items-center gap-4 mb-2">
            <button
              onClick={() => setIsFormOpen(true)}
              className="bg-[#C8A96E] hover:bg-[#D4B896] text-[#0D0D0D] font-semibold text-sm px-5 py-2.5 rounded transition-colors"
              data-testid="hero-request-dataset-btn"
            >
              Request Dataset Access
            </button>
            <button
              onClick={() => setIsFormOpen(true)}
              className="border border-white/20 text-[#F0EBE0] hover:bg-white/5 text-sm px-5 py-2.5 rounded transition-colors"
              data-testid="hero-why-human-btn"
            >
              Why human-authored? →
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 mb-8">
            {[
              { value: 2, suffix: "B+", label: "TOKENS OF HUMAN TRAINING DATA" },
              { value: 12, suffix: "M+", label: "Q&A INSTRUCTION PAIRS" },
              { value: 28, suffix: "M+", label: "MULTIMODAL (IMAGE-TEXT) PAIRS" },
              { value: 12, suffix: "", label: "LANGUAGES INCL. 8 INDIC" },
            ].map((stat) => (
              <div key={stat.label}>
                <div
                  className="font-bold leading-none mb-1"
                  style={{ fontSize: "clamp(28px, 3.5vw, 42px)", color: "#F0EBE0" }}
                >
                  <AnimatedCounter end={stat.value} suffix={stat.suffix} />
                </div>
                <div className="text-[#777] font-mono font-semibold text-[12px] tracking-widest uppercase">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>

          {/* Trusted By */}
          <div className="border border-[#1E1E1E] rounded px-6 py-4 flex items-center gap-6 flex-wrap">
            <span className="text-[#666] font-mono font-semibold text-[12px] tracking-widest uppercase">TRUSTED BY</span>
            {["Google", "Microsoft", "Meta"].map((name) => (
              <span key={name} className="text-[#666] font-semibold text-sm">{name}</span>
            ))}
          </div>
        </div>
      </section>

      {/* ── THE FUNDAMENTAL DIFFERENCE ──────────────────────────────── */}
      <section className="py-20 border-b border-[#252525]" data-testid="difference-section">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
            {/* Left */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <p className="text-[#666] font-mono font-semibold text-[12px] tracking-widest uppercase mb-5">
                THE FUNDAMENTAL DIFFERENCE
              </p>
              <h2
                className="font-bold leading-tight tracking-tight mb-6"
                style={{ fontSize: "clamp(36px, 4vw, 54px)", color: "#F0EBE0" }}
              >
                Data built to{" "}
                <span style={{ color: "#C8A96E" }}>reason.</span>
                <br />
                Not scraped
                <br />
                to exist.
              </h2>

              <p className="text-[#999] text-[15px] font-medium leading-relaxed mb-4">
                Synthetic data amplifies what models already know. Scraped web data is unverified, inconsistent,
                and structurally incoherent. Neither produces the difficulty-graded, multi-step reasoning signal
                frontier models need to stop failing on complex tasks. A model trained only on synthetic physics
                problems cannot acquire the expert reasoning moves that produced the solution — our human-authored
                worked solutions contain that thinking explicitly.
              </p>
              <p className="text-[#999] text-[15px] font-medium leading-relaxed mb-6">
                Nalandadata's source is a vast archive of knowledge created by domain specialists to build genuine,
                verifiable understanding. The output is structured, pipeline-ready training data for{" "}
                <span className="text-[#C8A96E]">any LLM</span>,{" "}
                <span className="text-[#C8A96E]">any use case</span>,{" "}
                <span className="text-[#C8A96E]">any stage of post-training</span>.
              </p>

              <div className="border border-[#252525] rounded p-4 text-[#888] text-xs font-mono font-medium leading-6 space-y-1">
                <p><span className="text-[#AAA]">Source:</span> S Chand Group archive · 11,000+ expert-authored titles · 100% owned IP · Zero scraping</p>
                <p><span className="text-[#AAA]">Provenance:</span> Each dataset ships with a full copyright lineage document — publisher, title, edition, annotation log, and commercial rights</p>
                <p><span className="text-[#AAA]">Quality:</span> Difficulty levels (Easy / Medium / Hard / Advanced) assigned by 2,000+ subject-matter experts — not algorithmic scoring</p>
                <p><span className="text-[#AAA]">Contamination:</span> All datasets deduplicated and checked for benchmark contamination against major public evaluation sets including MMLU, HellaSwag, and ARC</p>
                <p><span className="text-[#AAA]">Pipeline ready:</span> SFT → RLHF → CoT → HITL → Multimodal · Secure delivery via encrypted transfer or cloud hand-off</p>
              </div>
            </motion.div>

            {/* Right — comparison table */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="overflow-x-auto"
            >
              <table className="w-full text-sm">
                <thead>
                  <tr>
                    <th className="text-left pb-4 text-[#333] font-mono text-[12px] tracking-widest uppercase w-1/2" />
                    <th className="pb-4 text-center text-[#C45C45] font-mono text-[12px] tracking-widest uppercase">
                      SCRAPED / SYNTHETIC
                    </th>
                    <th className="pb-4 text-center text-[#C8A96E] font-mono text-[12px] tracking-widest uppercase">
                      NALANDADATA
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {comparisonRows.map((row, i) => (
                    <tr key={i} className="border-t border-[#1E1E1E]">
                      <td className="py-3.5 pr-4 text-[#AAA] text-[13px] font-medium">{row.label}</td>
                      <td className="py-3.5 text-center">
                        {row.scraped === "Partial" ? (
                          <span className="text-[#E0854A] text-[13px] font-mono">Partial</span>
                        ) : (
                          <span className="text-[#C45C45] font-bold text-base">✕</span>
                        )}
                      </td>
                      <td className="py-3.5 text-center text-[#C8A96E] font-bold text-base">✓</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── PERFORMANCE METRICS ──────────────────────────────────────── */}
      <section className="py-16 border-b border-[#252525]" data-testid="metrics-section">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {performanceMetrics.map((m, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
              >
                <div
                  className="font-bold leading-none mb-2"
                  style={{ fontSize: "clamp(32px, 4vw, 52px)", color: "#C8A96E" }}
                >
                  {m.value}
                </div>
                <p className="text-[#F0EBE0] text-sm font-semibold mb-1">{m.label}</p>
                <p className="text-[#777] text-[13px] font-medium leading-relaxed font-mono">{m.sub}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ─────────────────────────────────────────────── */}
      <section className="py-20 border-b border-[#252525]" data-testid="testimonials-section">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="border border-[#1E1E1E] rounded p-6 bg-[#111]"
              >
                <p className="text-[#C8A96E] font-mono text-[11px] tracking-widest uppercase mb-4">
                  {t.type}
                </p>
                <p className="text-[#AAAAAA] text-[15px] leading-relaxed mb-6 italic">
                  "{t.quote}"
                </p>
                <div className="border-t border-[#1E1E1E] pt-4">
                  <p className="text-[#888] text-[13px] font-medium font-mono">
                    <span className="text-[#AAA]">Source:</span> {t.source}
                  </p>
                  <p className="text-[#888] text-[13px] font-medium font-mono mt-1">
                    <span className="text-[#AAA]">Dataset:</span>{" "}
                    <span className="text-[#C8A96E]">{t.dataset}</span>
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── WHO GETS NALANDADATA ─────────────────────────────────────── */}
      <section className="py-20 border-b border-[#252525]" data-testid="audiences-section">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <p className="text-[#666] font-mono font-semibold text-[12px] tracking-widest uppercase mb-4">
            WHO GETS NALANDADATA
          </p>
          <h2
            className="font-bold leading-tight tracking-tight mb-12"
            style={{ fontSize: "clamp(32px, 4vw, 52px)", color: "#F0EBE0" }}
          >
            Built for every team
            <br />
            training the next model.
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {audiences.map((a, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="border border-[#1E1E1E] rounded p-6 bg-[#111]"
              >
                <p className="text-[#C8A96E] font-mono text-[11px] tracking-widest uppercase mb-3">
                  {a.label}
                </p>
                <h3 className="text-[#F0EBE0] font-bold text-lg mb-3 leading-snug">
                  {a.title}
                </h3>
                <p className="text-[#999] text-[15px] font-medium leading-relaxed mb-5">{a.description}</p>
                <div className="flex flex-wrap gap-2">
                  {a.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-1 bg-[#1A1A1A] border border-[#2A2A2A] text-[#777] font-mono font-semibold text-[11px] tracking-wider rounded"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── DATASET CATALOGUE ────────────────────────────────────────── */}
      <section className="py-20 border-b border-[#252525]" data-testid="catalogue-section">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <p className="text-[#666] font-mono font-semibold text-[12px] tracking-widest uppercase mb-4">
            DATASET CATALOGUE
          </p>
          <div className="flex items-end justify-between mb-8 flex-wrap gap-4">
            <h2
              className="font-bold leading-tight tracking-tight"
              style={{ fontSize: "clamp(28px, 3.5vw, 46px)", color: "#F0EBE0" }}
            >
              Five categories.
              <br />
              Every training stage.
            </h2>
            <button
              onClick={() => setIsFormOpen(true)}
              className="text-[#C8A96E] text-sm border border-[#C8A96E]/30 px-4 py-2 rounded hover:bg-[#C8A96E]/10 transition-colors"
            >
              Download full catalogue →
            </button>
          </div>

          <Tabs defaultValue="pretraining">
            <TabsList className="bg-transparent border-b border-[#252525] rounded-none h-auto p-0 mb-8 flex gap-6 flex-wrap">
              {catalogueTabs.map((tab) => (
                <TabsTrigger
                  key={tab.id}
                  value={tab.id}
                  className="bg-transparent text-[#555] text-sm font-medium px-0 pb-3 rounded-none border-b-2 border-transparent data-[state=active]:border-[#C8A96E] data-[state=active]:text-[#F0EBE0] data-[state=active]:bg-transparent transition-colors"
                >
                  {tab.label}
                </TabsTrigger>
              ))}
            </TabsList>

            {catalogueTabs.map((tab) => (
              <TabsContent key={tab.id} value={tab.id}>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {tab.datasets.map((ds, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: i * 0.07 }}
                      className="border border-[#1E1E1E] rounded p-5 bg-[#111] flex flex-col"
                    >
                      <span className="inline-block text-[#C8A96E] font-mono text-[11px] tracking-widest uppercase bg-[#C8A96E]/10 border border-[#C8A96E]/20 px-2.5 py-1 rounded mb-3 self-start">
                        {ds.tag}
                      </span>
                      <h3 className="text-[#F0EBE0] font-bold text-base mb-2 leading-snug">
                        {ds.title}
                      </h3>
                      <p className="text-[#888] text-[13px] font-medium leading-relaxed mb-4 flex-1">
                        {ds.description}
                      </p>
                      <div className="text-[#777] font-mono font-medium text-[12px] space-y-0.5 mb-4">
                        <p>Size: <span className="text-[#999]">{ds.tokens}</span></p>
                        <p>Language: <span className="text-[#999]">{ds.language}</span></p>
                        {ds.format && <p>Format: <span className="text-[#999]">{ds.format}</span></p>}
                        {ds.difficulty && <p>Difficulty: <span className="text-[#999]">{ds.difficulty}</span></p>}
                      </div>
                      <button
                        onClick={() => openFormWithDataset(ds.slug)}
                        className="flex items-center gap-2 text-[#F0EBE0] text-xs font-medium border border-[#2A2A2A] rounded px-3 py-2 hover:bg-white/5 transition-colors self-start"
                      >
                        <Download className="w-3 h-3" />
                        Download Sample
                      </button>
                    </motion.div>
                  ))}
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </div>
      </section>

      {/* ── SERVICES ─────────────────────────────────────────────────── */}
      <section className="py-20 border-b border-[#252525]" data-testid="services-section">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <p className="text-[#666] font-mono font-semibold text-[12px] tracking-widest uppercase mb-4">
            SERVICES
          </p>
          <h2
            className="font-bold leading-tight tracking-tight mb-12"
            style={{ fontSize: "clamp(28px, 3.5vw, 46px)", color: "#F0EBE0" }}
          >
            Beyond the catalogue.
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {services.map((svc, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                className="border border-[#1E1E1E] rounded p-5 bg-[#111]"
              >
                <svc.icon className="w-5 h-5 text-[#C8A96E] mb-4" />
                <h3 className="text-[#F0EBE0] font-bold text-sm mb-2">{svc.title}</h3>
                <p className="text-[#999] text-[13px] font-medium leading-relaxed mb-4">{svc.description}</p>
                <p className="text-[#777] font-mono font-medium text-[12px] leading-relaxed">{svc.meta}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <HuggingFaceSection />

      {/* ── CONTACT / INLINE FORM ────────────────────────────────────── */}
      <section id="contact" className="py-20 border-b border-[#252525]" data-testid="contact-section">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
            {/* Left */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <p className="text-[#666] font-mono font-semibold text-[12px] tracking-widest uppercase mb-5">
                GET IN TOUCH
              </p>
              <h2
                className="font-bold leading-tight tracking-tight mb-4"
                style={{ fontSize: "clamp(26px, 3.5vw, 42px)", color: "#F0EBE0" }}
              >
                Ready to bring{" "}
                <span style={{ color: "#C8A96E" }}>structured knowledge</span>
                <br />
                to your AI?
              </h2>
              <p className="text-[#999] text-[15px] font-medium leading-relaxed mb-6">
                Tell us about your training objective and we'll identify the right datasets, deliver a sample, and scope a licence — with no obligation.
              </p>

              <ul className="space-y-3 mb-8">
                {[
                  "Direct sample delivery upon request",
                  "Direct relationship — no brokers or intermediaries",
                  "Full provenance documentation with every licence",
                  "Secure delivery via encrypted transfer or cloud hand-off",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <Check className="w-4 h-4 text-[#C8A96E] flex-shrink-0 mt-0.5" />
                    <span className="text-[#AAA] text-[15px] font-medium">{item}</span>
                  </li>
                ))}
              </ul>

              <div className="border border-[#252525] rounded p-4 flex items-start justify-between gap-4">
                <p className="text-[#888] text-[13px] font-medium leading-relaxed">
                  Researching for a future procurement cycle? Download our{" "}
                  <span className="text-[#C8A96E]">full dataset catalogue PDF</span> — 3 pages, shareable with your team.
                </p>
                <button
                  onClick={() => setIsFormOpen(true)}
                  className="flex-shrink-0 flex items-center gap-2 text-[#F0EBE0] text-xs font-medium border border-[#2A2A2A] rounded px-3 py-2 hover:bg-white/5 transition-colors"
                >
                  <Download className="w-3 h-3" />
                  Download Catalogue
                </button>
              </div>
            </motion.div>

            {/* Right — inline form */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <LeadCaptureForm
                inline
                preselectedDataset={preselectedDataset}
                downloadFiles={downloadFiles}
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Modal form (for dataset sample downloads) */}
      <LeadCaptureForm
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        preselectedDataset={preselectedDataset}
        downloadFiles={downloadFiles}
      />
    </div>
  );
}
