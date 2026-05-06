import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { motion, useInView } from "framer-motion";
import {
  ArrowRight,
  Database,
  Brain,
  Globe2,
  FileText,
  ChevronRight,
  CheckCircle2,
  Building2,
  GraduationCap,
  Beaker,
  Cpu,
  Users,
  Shield,
  Lightbulb,
  Layers,
  Star
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { LeadCaptureForm } from "@/components/LeadCaptureForm";
import RotatingGlobe from "@/components/RotatingGlobe";
import { Helmet } from "react-helmet-async";
import axios from "axios";
import API from "@/lib/api";

function AnimatedCounter({ end, suffix = "", duration = 2 }) {
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
      {count.toLocaleString()}{suffix}
    </span>
  );
}

function getTagClass(tag) {
  const t = tag.toLowerCase();
  if (t.includes("rlhf") || t.includes("dpo")) return "tag-rlhf";
  if (t.includes("evaluation") || t.includes("eval")) return "tag-evaluation";
  if (t.includes("cot") || t.includes("chain")) return "tag-cot";
  if (t.includes("sft") || t.includes("fine-tun") || t.includes("reasoning")) return "tag-sft";
  return "tag-pretraining";
}

const homeDatasets = [
  {
    icon: Brain,
    tag: "Pretraining + CoT",
    title: "India-STEM Reasoning Corpus",
    description: "A large-scale corpus of mathematics and science content spanning Class 6 to Class 12, aligned to CBSE and ICSE curricula. Includes worked solutions with step-by-step reasoning chains ideal for chain-of-thought training.",
    size: "450M tokens",
    format: "Text + CoT pairs",
    language: "English, Hindi",
    slug: "stem-reasoning",
  },
  {
    icon: Brain,
    tag: "Reasoning / SFT",
    title: "JEE Advanced Problem-Solution Dataset",
    description: "Curated problem-solution pairs from India's most rigorous engineering entrance examination. Includes multi-step mathematical reasoning, physics derivations, and organic chemistry mechanisms.",
    size: "85M tokens",
    format: "Q&A + step-by-step solution",
    language: "English",
    slug: "stem-reasoning",
  },
  {
    icon: Globe2,
    tag: "Pretraining",
    title: "Indic Multilingual Education Corpus",
    description: "Curriculum-aligned academic content across 8 Indic languages — Bengali, Tamil, Telugu, Marathi, Gujarati, Kannada, Malayalam, and Punjabi. The most comprehensive multilingual curriculum dataset available for Indic AI development.",
    size: "520M tokens",
    format: "Raw text corpus",
    language: "8 Indic languages",
    slug: "language-literacy",
  },
  {
    icon: FileText,
    tag: "SFT / RLHF",
    title: "UPSC & Civil Services Preparation Corpus",
    description: "Comprehensive content spanning the UPSC examination syllabus — history, polity, economy, environment, science and technology, and current affairs frameworks. Among the broadest general knowledge corpora available in structured form.",
    size: "210M tokens",
    format: "Concept notes + Q&A",
    language: "English, Hindi",
    slug: "social-sciences",
  },
  {
    icon: Database,
    tag: "Pretraining / SFT",
    title: "Commerce & Economics University Corpus",
    description: "Undergraduate-level content in economics, accountancy, business studies, and commerce. Structured for models that need to reason about financial concepts, market dynamics, and business decision-making.",
    size: "240M tokens",
    format: "Structured text + problems",
    language: "English",
    slug: "higher-education",
  },
  {
    icon: FileText,
    tag: "Pretraining / SFT",
    title: "Hindi Language & Literature Dataset",
    description: "Formal Hindi language content aligned to CBSE curriculum — grammar, prose, poetry, and essay composition. One of the largest and most structured Hindi language AI training datasets available, covering Modern Standard Hindi and literary registers.",
    size: "290M tokens",
    format: "Structured text + exercises",
    language: "Hindi",
    slug: "language-literacy",
  },
];

const differentiators = [
  {
    icon: Layers,
    title: "Curriculum-Structured",
    description: "Our content follows a deliberate pedagogical arc — from foundational concepts to advanced application. This structure teaches AI models not just facts, but the logical relationship between ideas. No other provider can replicate this without decades of curriculum design expertise.",
  },
  {
    icon: Users,
    title: "Expert-Annotated at Scale",
    description: "Every dataset is annotated by over 2,000 subject-matter experts — qualified teachers, professors, and domain specialists. This is human intelligence applied to AI training at a scale no lab can replicate internally.",
  },
  {
    icon: GraduationCap,
    title: "Multi-Grade Vertical Coherence",
    description: "Our datasets span Class 1 to postgraduate level within each subject. This allows AI models to learn concepts at the right level of complexity, mirroring how human understanding is built progressively over years of study.",
  },
  {
    icon: Globe2,
    title: "Indic Language Depth",
    description: "Training data in 12 languages including Hindi, Bengali, Tamil, Telugu, Marathi, Gujarati, Kannada, and Malayalam. For labs building multilingual or Indic AI models, this is among the most comprehensive curriculum-aligned datasets available anywhere.",
  },
  {
    icon: Shield,
    title: "Clean Intellectual Property",
    description: "All content originates from S Chand Group's owned publishing archive. No web scraping, no ambiguous copyright. Every dataset comes with a complete provenance record and is fully licensable for commercial AI training.",
  },
  {
    icon: Lightbulb,
    title: "Pedagogy-Tested in Real Classrooms",
    description: "This content has been used to teach millions of students across India — refined through decades of feedback from real learners and educators. You are not buying raw text. You are buying knowledge that has been proven to build understanding.",
  },
];

const homeSolutions = [
  {
    icon: Cpu,
    title: "Frontier LLM Labs",
    subtitle: "For teams pretraining and post-training foundation models at scale.",
    features: [
      "High-volume pretraining corpora in English and Indic languages",
      "Chain-of-thought reasoning datasets for STEM and science",
      "SFT and RLHF datasets with expert annotation",
      "Evaluation benchmarks aligned to Indian academic standards",
    ],
    keyDatasets: "India-STEM Reasoning Corpus, Academic Q&A Instruction Dataset, Chain-of-Thought Science Reasoning Dataset",
  },
  {
    icon: GraduationCap,
    title: "EdTech & AI Tutoring",
    subtitle: "For teams building AI-powered tutors, learning assistants, and adaptive education platforms.",
    features: [
      "Curriculum-mapped Q&A pairs by subject and grade",
      "Teacher explanation dataset for pedagogically sound AI responses",
      "Early childhood and foundational literacy content",
      "Multimodal science diagram dataset for visual learning",
    ],
    keyDatasets: "Teacher Explanation & Pedagogy Dataset, Early Childhood Learning Corpus, Academic Q&A Instruction Dataset",
  },
  {
    icon: Building2,
    title: "Indian AI Labs & Government",
    subtitle: "For teams building sovereign Indic AI models and Bharat-first AI infrastructure.",
    features: [
      "Indic multilingual corpus across 8 languages",
      "Hindi and regional language curriculum content",
      "Indian history, civics, and constitutional studies datasets",
      "UPSC corpus for broad general knowledge",
    ],
    keyDatasets: "Indic Multilingual Education Corpus, Hindi Language & Literature Dataset, Indian History & Civics Corpus",
  },
  {
    icon: Beaker,
    title: "Enterprise AI Builders",
    subtitle: "For teams building domain-specific AI in education, healthcare, legal, and professional services.",
    features: [
      "Commerce and economics content for financial AI",
      "Legal and constitutional studies for compliance AI",
      "Engineering fundamentals for technical AI assistants",
      "Medical and science reasoning for healthcare AI",
    ],
    keyDatasets: "Commerce & Economics University Corpus, Legal & Constitutional Studies Dataset, Engineering Fundamentals Corpus",
  },
];

const procurementSteps = [
  {
    number: "01",
    title: "Request & Discovery",
    description: "Submit a dataset request describing your use case, scale, language requirements, and subject area. Our team will respond within 48 hours with a curated shortlist of datasets that match your training objectives.",
  },
  {
    number: "02",
    title: "Sample & Evaluate",
    description: "We provide a sample dataset and data card for each recommended dataset. Your technical team can evaluate format, quality, and coverage before any licensing commitment is made.",
  },
  {
    number: "03",
    title: "License & Deliver",
    description: "Flexible commercial licensing for research and enterprise use. Datasets are delivered in standard formats (JSONL, Parquet, CSV) via secure transfer. Full provenance documentation included with every license.",
  },
];

const faqs = [
  {
    question: "What licensing models do you offer?",
    answer: "We offer flexible licensing models including research licenses for academic institutions, commercial licenses for enterprise use, and custom enterprise agreements for large-scale data partnerships. All licenses include full provenance documentation and clear copyright terms.",
  },
  {
    question: "Can we request custom datasets not in your catalogue?",
    answer: "Yes. Our team can develop custom datasets tailored to your specific subject area, language requirements, grade level, and annotation style. Custom dataset projects typically involve a scoping call followed by a sample delivery within 2–4 weeks.",
  },
  {
    question: "What formats are datasets delivered in?",
    answer: "Standard delivery formats include JSONL, JSON, CSV, and Parquet. Audio datasets are delivered in WAV or MP3 with accompanying JSON transcription files. Multimodal datasets include both image files and structured annotation files. Custom formats available on request.",
  },
  {
    question: "Is the IP clean? Can we use this for commercial AI training?",
    answer: "Yes. All content originates from S Chand Group's owned publishing archive — built over 85 years of academic publishing. There is no web scraping, no third-party content aggregation, and no ambiguous copyright. Every dataset comes with a complete provenance record and is fully licensable for commercial AI training.",
  },
  {
    question: "Do you work with academic and research institutions?",
    answer: "Yes. We offer research licensing for academic institutions and universities. Research licenses include access to dataset samples and documentation. We also collaborate on benchmark development and evaluation research. Contact us to discuss research partnership arrangements.",
  },
];

export default function HomePage() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [downloadFiles, setDownloadFiles] = useState([]);

  useEffect(() => {
    const fetchFiles = async () => {
      try {
        const response = await axios.get(`${API}/files`);
        setDownloadFiles(response.data.filter(f => f.is_sample).slice(0, 3));
      } catch (error) {
        if (process.env.NODE_ENV === "development") console.error("Error fetching files:", error);
      }
    };
    fetchFiles();
  }, []);

  return (
    <div className="min-h-screen bg-[#0A0A0A]" data-testid="home-page">
      <Helmet>
        <title>Nalandadata.ai — Premium AI Training Datasets from India's #1 Academic Publisher</title>
        <meta name="description" content="Premium curriculum-verified AI training datasets built on S Chand Group's 85-year academic archive. 2B+ tokens, 15+ subjects, 12 languages. Trusted by frontier AI labs." />
        <meta property="og:title" content="Nalandadata.ai — Premium AI Training Datasets" />
        <meta property="og:description" content="Premium curriculum-verified AI training datasets built on S Chand Group's 85-year academic archive. 2B+ tokens, 15+ subjects, 12 languages." />
        <meta property="og:type" content="website" />
      </Helmet>
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center pt-20 overflow-hidden" data-testid="hero-section">
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none hidden md:block">
          <div className="w-[900px] h-[900px] lg:w-[1100px] lg:h-[1100px] opacity-50 lg:opacity-60">
            <RotatingGlobe />
          </div>
        </div>
        <div className="absolute inset-0 hero-gradient" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0A0A0A]/60 via-transparent to-[#0A0A0A]/60" />
        <div className="absolute inset-0 bg-[#0A0A0A]/30" />
        <div className="absolute top-1/4 left-1/4 w-48 md:w-96 h-48 md:h-96 bg-blue-500/10 rounded-full blur-[80px] md:blur-[128px] animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-48 md:w-96 h-48 md:h-96 bg-indigo-500/10 rounded-full blur-[80px] md:blur-[128px] animate-pulse" style={{ animationDelay: "1s" }} />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-2 rounded-full bg-black/50 backdrop-blur-sm border border-white/10 mb-6 sm:mb-8">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <span className="text-xs sm:text-sm text-gray-300">Powered by India's #1 Academic Publisher</span>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-7xl font-bold text-white leading-tight mb-4 sm:mb-6" style={{ textShadow: '0 2px 20px rgba(0,0,0,0.8)' }}>
              The knowledge that taught a generation.
              <br />
              <span className="gradient-text">Now training the next intelligence.</span>
            </h1>

            <p className="text-base sm:text-lg lg:text-xl text-gray-300 max-w-2xl mx-auto mb-8 sm:mb-10 leading-relaxed px-2" style={{ textShadow: '0 1px 10px rgba(0,0,0,0.8)' }}>
              Nalandadata is built on India's most authoritative academic publishing archive — curriculum-structured, expert-annotated, and engineered for the AI era. 15+ subjects. 12 languages. Every grade from Class 1 to postgraduate.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
              <Button
                onClick={() => setIsFormOpen(true)}
                className="btn-primary text-base sm:text-lg px-6 sm:px-8 py-5 sm:py-6 w-full sm:w-auto"
                data-testid="hero-request-dataset-btn"
              >
                Request a Dataset →
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
              <Link
                to="/datasets"
                className="btn-secondary text-base sm:text-lg px-6 sm:px-8 py-5 sm:py-6 w-full sm:w-auto inline-flex items-center justify-center"
                data-testid="hero-view-catalogue-btn"
              >
                View Dataset Catalogue
              </Link>
            </div>

            <div className="mt-12 sm:mt-16 grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-8 max-w-4xl mx-auto">
              {[
                { value: 2, suffix: "B+", label: "Tokens of premium training data" },
                { value: 15, suffix: "+", label: "Academic subjects covered" },
                { value: 12, suffix: "", label: "Languages including 8 Indic" },
                { value: 2000, suffix: "+", label: "Subject-matter expert annotators" },
              ].map((stat, i) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 + i * 0.1 }}
                  className="text-center p-3 sm:p-4 rounded-xl bg-black/30 backdrop-blur-sm border border-white/5"
                >
                  <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-1">
                    <AnimatedCounter end={stat.value} suffix={stat.suffix} />
                  </div>
                  <div className="text-xs sm:text-sm text-gray-400">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 hidden sm:block"
        >
          <div className="w-6 h-10 rounded-full border-2 border-white/20 flex items-start justify-center p-2">
            <motion.div
              animate={{ y: [0, 12, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="w-1.5 h-1.5 rounded-full bg-white"
            />
          </div>
        </motion.div>
      </section>

      {/* Built for demanding AI teams */}
      <section className="py-24 relative" data-testid="trust-section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Built for the world's most demanding AI teams
            </h2>
            <p className="text-gray-400 max-w-3xl mx-auto leading-relaxed">
              Nalandadata datasets are actively licensed to multiple frontier AI laboratories among the world's five largest technology companies. Our procurement relationships are direct, long-term, and built on the quality of our content — not intermediaries.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                icon: Users,
                title: "Direct Lab Relationships",
                description: "No brokers. No intermediaries. We work directly with AI lab procurement teams.",
              },
              {
                icon: Shield,
                title: "Clean IP. Full Provenance.",
                description: "100% owned content. No scraping. Fully licensable with a clear copyright chain.",
              },
              {
                icon: Star,
                title: "India's #1 Academic Publisher",
                description: "Built on S Chand Group's archive — the most authoritative academic publishing house in India.",
              },
            ].map((card, i) => (
              <motion.div
                key={card.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="p-8 rounded-2xl bg-[#121212] border border-white/5 hover:border-blue-500/30 transition-colors"
              >
                <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center mb-6">
                  <card.icon className="w-6 h-6 text-blue-400" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-3">{card.title}</h3>
                <p className="text-gray-400 leading-relaxed">{card.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* What's Inside the Catalogue */}
      <section className="py-24 bg-[#0C0C0C]" data-testid="dataset-categories-section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <p className="text-xs font-semibold tracking-widest text-blue-400 uppercase mb-4">OUR DATASETS</p>
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              What's Inside the Catalogue
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Premium, curriculum-verified AI training datasets across four categories. Each dataset is available for research licensing and commercial enterprise agreements.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {homeDatasets.map((ds, i) => (
              <motion.div
                key={ds.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
              >
                <Link
                  to={`/datasets/${ds.slug}`}
                  className="block h-full p-8 rounded-2xl bg-[#121212] border border-white/5 hover:border-blue-500/30 transition-all duration-300 group dataset-card"
                  data-testid={`home-dataset-card-${i}`}
                >
                  <div className="flex items-start gap-4 mb-4">
                    <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center flex-shrink-0 group-hover:bg-blue-500/20 transition-colors">
                      <ds.icon className="w-6 h-6 text-blue-400" />
                    </div>
                    <div>
                      <span className={`text-xs font-mono font-medium ${getTagClass(ds.tag)}`}>[{ds.tag}]</span>
                      <h3 className="text-lg font-semibold text-white group-hover:text-blue-400 transition-colors">{ds.title}</h3>
                    </div>
                  </div>
                  <p className="text-gray-400 text-sm mb-4 leading-relaxed">{ds.description}</p>
                  <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-500 font-mono">
                    <span>Size: {ds.size}</span>
                    <span>Format: {ds.format}</span>
                    <span>Language: {ds.language}</span>
                  </div>
                  <div className="flex justify-end mt-4">
                    <ChevronRight className="w-5 h-5 text-gray-600 group-hover:text-blue-400 group-hover:translate-x-1 transition-all" />
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link to="/datasets" className="btn-primary inline-flex items-center gap-2" data-testid="view-full-catalogue-btn">
              View Full Catalogue →
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* The Difference Section */}
      <section className="py-24 relative overflow-hidden" data-testid="difference-section">
        <div className="absolute inset-0 grid-bg opacity-20" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="max-w-4xl mx-auto text-center mb-16"
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
              "The difference between data that was written to teach, and data that was scraped to exist."
            </h2>
            <p className="text-gray-400 leading-relaxed">
              Most AI training data comes from the open internet — unstructured, unverified, and pedagogically incoherent. Nalandadata is different. Every dataset originates from content written by educators, reviewed by domain experts, tested in classrooms, and aligned to a formal curriculum. This is not content that happens to be educational. It is content designed, from the first word, to build understanding.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {differentiators.map((item, i) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="p-6 rounded-xl bg-white/[0.02] border border-white/5 hover:border-blue-500/30 transition-colors"
              >
                <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center mb-4">
                  <item.icon className="w-5 h-5 text-blue-400" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-3">{item.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Solutions Section */}
      <section className="py-24 bg-[#0C0C0C]" data-testid="solutions-section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Built for every stage of the AI training pipeline.
            </h2>
            <p className="text-gray-400 max-w-3xl mx-auto">
              Whether you are pretraining a foundation model, fine-tuning for a specific domain, building evaluation benchmarks, or developing an AI tutor — Nalandadata has a dataset designed for your use case.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {homeSolutions.map((sol, i) => (
              <motion.div
                key={sol.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="p-6 rounded-xl bg-[#121212] border border-white/5 hover:border-blue-500/30 transition-colors group"
              >
                <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center mb-4 group-hover:bg-blue-500/20 transition-colors">
                  <sol.icon className="w-6 h-6 text-blue-400" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">{sol.title}</h3>
                <p className="text-gray-500 text-sm mb-4 leading-relaxed">{sol.subtitle}</p>
                <ul className="space-y-2 mb-4">
                  {sol.features.map((f, j) => (
                    <li key={j} className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-blue-400 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-400 text-xs">{f}</span>
                    </li>
                  ))}
                </ul>
                <p className="text-xs text-gray-500 mt-4 border-t border-white/5 pt-4">
                  <span className="text-gray-400 font-medium">Key datasets: </span>{sol.keyDatasets}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Leadership Section */}
      <section className="py-24" data-testid="leadership-section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              The knowledge behind the knowledge.
            </h2>
            <p className="text-gray-400 max-w-3xl mx-auto">
              Nalandadata is built on India's most authoritative academic publishing archive. We are not a data broker or a technology startup. We are a company rooted in decades of curriculum expertise, now engineering that knowledge for the AI era.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="p-8 rounded-2xl bg-[#121212] border border-white/5"
            >
              <div className="flex items-start gap-6">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center flex-shrink-0 text-white font-bold text-xl">
                  GG
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white mb-1">Gaurav Kumar Jhunjhnuwala</h3>
                  <p className="text-blue-400 text-sm mb-4">Founder, Nalandadata · Director, S Chand Group</p>
                  <p className="text-gray-400 leading-relaxed text-sm">
                    Gaurav leads S Chand Group's AI data and technology initiatives, building on the company's position as India's most authoritative academic publisher. Under his leadership, S Chand has established active dataset licensing relationships with multiple frontier AI laboratories. He is also a member of the Governing Body of Shyam Lal College, Delhi. Gaurav founded Nalandadata to engineer S Chand's deep knowledge archive into a world-class AI training data business — bringing India's intellectual depth to the frontier of artificial intelligence.
                  </p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="grid grid-cols-1 gap-6"
            >
              {[
                { value: "1939", label: "S Chand Group established", sub: "Over 85 years of academic publishing" },
                { value: "100M+", label: "Students taught with our content", sub: "Across India and South Asia" },
                { value: "11,000", label: "Titles in our publishing archive", sub: "The foundation of every dataset" },
              ].map((stat, i) => (
                <div key={i} className="p-6 rounded-xl bg-white/[0.02] border border-white/5">
                  <div className="text-3xl font-bold text-white mb-1">{stat.value}</div>
                  <div className="text-white font-medium mb-1">{stat.label}</div>
                  <div className="text-gray-500 text-sm">{stat.sub}</div>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Procurement Section */}
      <section className="py-24 bg-[#0C0C0C]" data-testid="procurement-section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Designed for enterprise AI procurement.
            </h2>
            <p className="text-gray-400 max-w-3xl mx-auto">
              We work directly with AI lab procurement teams, legal teams, and data scientists. Our licensing process is straightforward, our IP is clean, and our team responds within 48 hours.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {procurementSteps.map((step, i) => (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="relative p-8 rounded-2xl bg-[#121212] border border-white/5"
              >
                <span className="text-6xl font-bold text-white/5 absolute top-4 right-6">{step.number}</span>
                <div className="relative">
                  <p className="text-blue-400 font-mono text-sm mb-3">Step {parseInt(step.number)}</p>
                  <h3 className="text-xl font-semibold text-white mb-4">{step.title}</h3>
                  <p className="text-gray-400 leading-relaxed text-sm">{step.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-24" data-testid="faq-section">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Frequently Asked Questions
            </h2>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <Accordion type="single" collapsible className="space-y-3">
              {faqs.map((faq, i) => (
                <AccordionItem
                  key={i}
                  value={`faq-${i}`}
                  className="px-6 rounded-xl bg-[#121212] border border-white/5 data-[state=open]:border-blue-500/30"
                >
                  <AccordionTrigger className="text-white hover:text-blue-400 hover:no-underline text-left py-5">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-gray-400 pb-5 leading-relaxed">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 relative overflow-hidden" data-testid="cta-section">
        <div className="absolute inset-0 bg-gradient-to-b from-blue-500/5 to-transparent" />
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
              Ready to bring structured knowledge to your AI?
            </h2>
            <p className="text-lg text-gray-400 mb-10 max-w-2xl mx-auto">
              Talk to our team. We'll help you identify the right datasets for your training pipeline and get you a sample within 48 hours.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button
                onClick={() => setIsFormOpen(true)}
                className="btn-primary text-lg px-8 py-6"
                data-testid="cta-request-dataset-btn"
              >
                Request a Dataset →
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
              <Button
                onClick={() => setIsFormOpen(true)}
                variant="outline"
                className="btn-secondary text-lg px-8 py-6"
                data-testid="cta-download-catalogue-btn"
              >
                Download Dataset Catalogue →
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      <LeadCaptureForm
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        downloadFiles={downloadFiles}
      />
    </div>
  );
}
