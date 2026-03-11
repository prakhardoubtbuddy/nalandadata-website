import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { motion, useInView } from "framer-motion";
import { 
  ArrowRight, 
  Database, 
  Brain, 
  Globe2, 
  FileText, 
  Mic,
  ChevronRight,
  CheckCircle2,
  Building2,
  GraduationCap,
  Beaker,
  Cpu
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { LeadCaptureForm } from "@/components/LeadCaptureForm";
import RotatingGlobe from "@/components/RotatingGlobe";
import axios from "axios";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

// Animated counter component
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

// Dataset categories
const datasetCategories = [
  {
    icon: Brain,
    title: "Academic Reasoning",
    description: "JEE / Olympiad level reasoning datasets with step-by-step solutions and chain-of-thought annotations",
    slug: "academic-reasoning",
    samples: "500K+",
  },
  {
    icon: Database,
    title: "STEM Training Data",
    description: "Physics, Chemistry, Math structured problems with verified expert solutions",
    slug: "stem-datasets",
    samples: "1.2M+",
  },
  {
    icon: Globe2,
    title: "Multilingual Education",
    description: "Educational content in English, Hindi, and major Indic languages",
    slug: "multilingual-education",
    samples: "800K+",
  },
  {
    icon: FileText,
    title: "Document & OCR Datasets",
    description: "Textbooks, question banks, structured educational content for document AI",
    slug: "ocr-document-ai",
    samples: "300K+",
  },
  {
    icon: Mic,
    title: "Speech & Audio Learning",
    description: "Lecture datasets, pronunciation data, educational speech corpora",
    slug: "speech-audio-learning",
    samples: "150K+ hrs",
  },
];

// Pipeline steps
const pipelineSteps = [
  { step: "01", title: "Content Acquisition", description: "Sourcing from verified academic materials" },
  { step: "02", title: "Expert Annotation", description: "Domain experts validate and annotate" },
  { step: "03", title: "Knowledge Structuring", description: "Organizing into machine-readable formats" },
  { step: "04", title: "Quality Validation", description: "Multi-stage review process" },
  { step: "05", title: "Benchmark Testing", description: "Validated against industry standards" },
  { step: "06", title: "Model Training Ready", description: "Optimized for AI pipelines" },
];

// Who this is for
const targetAudiences = [
  { icon: Cpu, title: "Frontier AI Labs", description: "Training next generation LLMs with high-quality academic data" },
  { icon: GraduationCap, title: "EdTech Platforms", description: "Building intelligent AI tutors and learning systems" },
  { icon: Beaker, title: "Research Institutions", description: "Developing reasoning models and benchmarks" },
  { icon: Building2, title: "Foundation Model Companies", description: "Structured training corpora at scale" },
];

// Benchmark data
const benchmarks = [
  { name: "MMLU", impact: "+7.2%" },
  { name: "AIME", impact: "+11.5%" },
  { name: "GAIA", impact: "+6.3%" },
  { name: "Arena Hard", impact: "+5.1%" },
];

// Why us points
const whyUsPoints = [
  "Proven to improve benchmark performance including MMLU, AIME, GAIA, Arena Hard",
  "Built for Pretraining, SFT, RLHF and DPO pipelines",
  "Expert curated academic knowledge graphs",
  "Trusted by AI labs, research institutions and frontier startups",
  "2B+ structured samples across text, audio and documents",
  "Multilingual datasets in English, Hindi and major Indic languages",
];

export default function HomePage() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [downloadFiles, setDownloadFiles] = useState([]);

  useEffect(() => {
    // Fetch sample files for download
    const fetchFiles = async () => {
      try {
        const response = await axios.get(`${API}/files`);
        setDownloadFiles(response.data.filter(f => f.is_sample).slice(0, 3));
      } catch (error) {
        console.error("Error fetching files:", error);
      }
    };
    fetchFiles();
  }, []);

  return (
    <div className="min-h-screen bg-[#0A0A0A]" data-testid="home-page">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center pt-20 overflow-hidden" data-testid="hero-section">
        {/* Rotating Globe Background - Hidden on small screens */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none hidden md:block">
          <div className="w-[900px] h-[900px] lg:w-[1100px] lg:h-[1100px] opacity-50 lg:opacity-60">
            <RotatingGlobe />
          </div>
        </div>
        
        {/* Background effects */}
        <div className="absolute inset-0 hero-gradient" />
        
        {/* Dark overlay for better text readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#0A0A0A]/60 via-transparent to-[#0A0A0A]/60" />
        <div className="absolute inset-0 bg-[#0A0A0A]/30" />
        
        {/* Animated orbs - smaller on mobile */}
        <div className="absolute top-1/4 left-1/4 w-48 md:w-96 h-48 md:h-96 bg-blue-500/10 rounded-full blur-[80px] md:blur-[128px] animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-48 md:w-96 h-48 md:h-96 bg-indigo-500/10 rounded-full blur-[80px] md:blur-[128px] animate-pulse" style={{ animationDelay: "1s" }} />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-2 rounded-full bg-black/50 backdrop-blur-sm border border-white/10 mb-6 sm:mb-8">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <span className="text-xs sm:text-sm text-gray-300">Trusted by leading AI labs worldwide</span>
            </div>

            {/* Headline with text shadow for better readability */}
            <h1 className="text-3xl sm:text-5xl lg:text-7xl font-bold text-white leading-tight mb-4 sm:mb-6" style={{ textShadow: '0 2px 20px rgba(0,0,0,0.8)' }}>
              Academic Intelligence Datasets
              <br />
              <span className="gradient-text">for Training Frontier AI Models</span>
            </h1>

            {/* Subtext with background for mobile */}
            <p className="text-base sm:text-lg lg:text-xl text-gray-300 max-w-3xl mx-auto mb-8 sm:mb-10 leading-relaxed px-2" style={{ textShadow: '0 1px 10px rgba(0,0,0,0.8)' }}>
              High-integrity knowledge datasets designed for pretraining, reasoning, 
              and post-training of advanced AI systems.
            </p>

            {/* CTA Buttons - Stack on mobile */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
              <Button
                onClick={() => setIsFormOpen(true)}
                className="btn-primary text-base sm:text-lg px-6 sm:px-8 py-5 sm:py-6 w-full sm:w-auto"
                data-testid="hero-request-dataset-btn"
              >
                Request Dataset
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
              <Button
                onClick={() => setIsFormOpen(true)}
                variant="outline"
                className="btn-secondary text-base sm:text-lg px-6 sm:px-8 py-5 sm:py-6 w-full sm:w-auto"
                data-testid="hero-download-sample-btn"
              >
                Download Sample Data
              </Button>
            </div>

            {/* Quick stats - with backdrop for readability */}
            <div className="mt-12 sm:mt-16 grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-8 max-w-4xl mx-auto">
              {[
                { value: 2, suffix: "B+", label: "Data Samples" },
                { value: 15, suffix: "+", label: "Subjects" },
                { value: 12, suffix: "", label: "Languages" },
                { value: 2000, suffix: "+", label: "Expert Annotators" },
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

        {/* Scroll indicator - hidden on mobile */}
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

      {/* Why Us Section */}
      <section className="py-24 relative" data-testid="why-us-section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Why Leading AI Teams Use Our Data
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Infrastructure-grade datasets built for the most demanding AI applications
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {whyUsPoints.map((point, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="flex items-start gap-4 p-6 rounded-xl bg-white/[0.02] border border-white/5 hover:border-blue-500/30 transition-colors"
              >
                <CheckCircle2 className="w-6 h-6 text-blue-500 flex-shrink-0 mt-0.5" />
                <p className="text-gray-300">{point}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Dataset Categories Section */}
      <section className="py-24 bg-[#0C0C0C]" data-testid="dataset-categories-section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Dataset Categories
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Comprehensive academic datasets across multiple domains and modalities
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {datasetCategories.map((category, i) => (
              <motion.div
                key={category.slug}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
              >
                <Link
                  to={`/datasets/${category.slug}`}
                  className="block h-full p-8 rounded-2xl bg-[#121212] border border-white/5 hover:border-blue-500/30 transition-all duration-300 group dataset-card"
                  data-testid={`dataset-card-${category.slug}`}
                >
                  <div className="w-14 h-14 rounded-xl bg-blue-500/10 flex items-center justify-center mb-6 group-hover:bg-blue-500/20 transition-colors">
                    <category.icon className="w-7 h-7 text-blue-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-3">{category.title}</h3>
                  <p className="text-gray-400 text-sm mb-4 leading-relaxed">{category.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono text-gray-500">{category.samples} samples</span>
                    <ChevronRight className="w-5 h-5 text-gray-600 group-hover:text-blue-400 group-hover:translate-x-1 transition-all" />
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link to="/datasets" className="btn-secondary inline-flex items-center gap-2" data-testid="view-all-datasets-btn">
              View All Datasets
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Pipeline Section */}
      <section className="py-24 relative overflow-hidden" data-testid="pipeline-section">
        <div className="absolute inset-0 grid-bg opacity-20" />
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Dataset Pipeline
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Our rigorous data engineering process ensures the highest quality datasets
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {pipelineSteps.map((step, i) => (
              <motion.div
                key={step.step}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="relative p-6 rounded-xl bg-white/[0.02] border border-white/5 group hover:border-blue-500/30 transition-colors"
              >
                <span className="text-5xl font-bold text-white/5 absolute top-4 right-4 group-hover:text-blue-500/10 transition-colors">
                  {step.step}
                </span>
                <div className="relative">
                  <h3 className="text-lg font-semibold text-white mb-2">{step.title}</h3>
                  <p className="text-gray-500 text-sm">{step.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Who This Is For Section */}
      <section className="py-24 bg-[#0C0C0C]" data-testid="target-audience-section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Who This Is For
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Powering AI innovation across industries
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {targetAudiences.map((audience, i) => (
              <motion.div
                key={audience.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="p-6 rounded-xl bg-[#121212] border border-white/5 text-center group hover:border-blue-500/30 transition-colors"
              >
                <div className="w-16 h-16 rounded-full bg-blue-500/10 flex items-center justify-center mx-auto mb-4 group-hover:bg-blue-500/20 transition-colors">
                  <audience.icon className="w-8 h-8 text-blue-400" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">{audience.title}</h3>
                <p className="text-gray-500 text-sm">{audience.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Benchmark Impact Section */}
      <section className="py-24" data-testid="benchmark-section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Benchmark Impact
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Measurable improvements in model performance
            </p>
          </motion.div>

          <div className="max-w-2xl mx-auto">
            <div className="rounded-2xl border border-white/10 overflow-hidden">
              <table className="w-full table-dark">
                <thead>
                  <tr>
                    <th className="text-left p-4">Benchmark</th>
                    <th className="text-right p-4">Dataset Impact</th>
                  </tr>
                </thead>
                <tbody>
                  {benchmarks.map((benchmark, i) => (
                    <motion.tr
                      key={benchmark.name}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.3, delay: i * 0.1 }}
                    >
                      <td className="p-4 text-white font-medium">{benchmark.name}</td>
                      <td className="p-4 text-right">
                        <span className="text-green-400 font-mono font-semibold">{benchmark.impact}</span>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-24 bg-[#0C0C0C]" data-testid="stats-section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { value: 2, suffix: "B+", label: "Data Samples", sublabel: "Across text, audio and documents" },
              { value: 15, suffix: "+", label: "Subjects", sublabel: "Comprehensive academic coverage" },
              { value: 12, suffix: "", label: "Languages", sublabel: "Including major Indic languages" },
              { value: 2000, suffix: "+", label: "Expert Annotators", sublabel: "Domain specialists" },
            ].map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="text-center p-6 rounded-xl bg-white/[0.02] border border-white/5"
              >
                <div className="text-4xl sm:text-5xl font-bold text-white mb-2">
                  <AnimatedCounter end={stat.value} suffix={stat.suffix} />
                </div>
                <div className="text-lg text-white mb-1">{stat.label}</div>
                <div className="text-sm text-gray-500">{stat.sublabel}</div>
              </motion.div>
            ))}
          </div>
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
              Access Sample Dataset
            </h2>
            <p className="text-lg text-gray-400 mb-10 max-w-2xl mx-auto">
              Get started with our sample datasets and experience the quality that powers 
              frontier AI models.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button
                onClick={() => setIsFormOpen(true)}
                className="btn-primary text-lg px-8 py-6"
                data-testid="cta-download-sample-btn"
              >
                Download Sample
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
              <Button
                onClick={() => setIsFormOpen(true)}
                variant="outline"
                className="btn-secondary text-lg px-8 py-6"
                data-testid="cta-request-full-btn"
              >
                Request Full Dataset
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Lead Capture Form */}
      <LeadCaptureForm 
        open={isFormOpen} 
        onOpenChange={setIsFormOpen}
        downloadFiles={downloadFiles}
      />
    </div>
  );
}
