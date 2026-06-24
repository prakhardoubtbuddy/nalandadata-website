import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Brain,
  Database,
  Globe2,
  FileText,
  Table2,
  ArrowRight,
  ArrowLeft,
  Download,
  CheckCircle2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { LeadCaptureForm } from "@/components/LeadCaptureForm";
import { BenchmarkCharts } from "@/components/BenchmarkCharts";
import { Helmet } from "react-helmet-async";
import axios from "axios";
import API from "@/lib/api";

const datasetConfigs = {
  "table-recognition": {
    icon: Table2,
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
    // Live SWE-bench++-style charts — all values from real annotated data
    // (results/split_composition.json, full corpus = 1,421 tables).
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
        tableType: "Financial — Trial Balance",
        subject: "Financial Accounting",
        structure: "Multi-level header, merged cells, 2 hierarchy levels",
        html: "<table><thead><tr><th rowspan='2'>Particulars</th><th colspan='2'>Amount (Rs.)</th></tr><tr><th>Debit</th><th>Credit</th></tr></thead><tbody>…</tbody></table>",
      },
      {
        tableType: "Statistical — Frequency Distribution",
        subject: "Business Statistics",
        structure: "Flat header, empty cells, no merged cells",
        html: "<table><thead><tr><th>Class Interval</th><th>Frequency</th><th>Cumulative</th></tr></thead><tbody>…</tbody></table>",
      },
      {
        tableType: "Lookup — Steam Table",
        subject: "Engineering / Science",
        structure: "Multi-column reference, numeric, no grid lines",
        html: "<table><thead><tr><th>Temp (°C)</th><th>Pressure</th><th>h<sub>f</sub></th><th>h<sub>g</sub></th></tr></thead><tbody>…</tbody></table>",
      },
    ],
  },
  "stem-reasoning": {
    icon: Brain,
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
        question: "Two blocks of masses 3 kg and 5 kg are connected by a light string passing over a frictionless pulley. Find the acceleration of the system and tension in the string. (g = 10 m/s²)",
        options: "A) a = 2.5 m/s², T = 37.5 N  B) a = 3.0 m/s², T = 40 N  C) a = 2.0 m/s², T = 35 N  D) a = 2.5 m/s², T = 40 N",
        answer: "A) a = 2.5 m/s², T = 37.5 N",
        solution: "Net force = (5−3)×10 = 20 N. Total mass = 8 kg. a = 20/8 = 2.5 m/s². T = 3×(10+2.5) = 37.5 N",
        subject: "Physics — Laws of Motion",
        source: "JEE Mains",
        difficulty: "Medium",
      },
      {
        question: "Benzene reacts with Cl₂ in the presence of FeCl₃ to give chlorobenzene. Identify the type of reaction and write the mechanism.",
        answer: "Electrophilic Aromatic Substitution (EAS). Step 1: FeCl₃ activates Cl₂ → Cl⁺ (electrophile). Step 2: Cl⁺ attacks π system forming arenium ion. Step 3: Loss of H⁺ restores aromaticity → C₆H₅Cl + HCl.",
        subject: "Chemistry — Organic Reactions",
        source: "JEE Advanced",
        difficulty: "Hard",
      },
      {
        question: "If the roots of the equation x² − px + q = 0 are in the ratio 2:3, prove that 6p² = 25q.",
        answer: "Let roots be 2α and 3α. Sum = 5α = p → α = p/5. Product = 6α² = q → 6(p/5)² = q → 6p²/25 = q → 6p² = 25q. ∎",
        subject: "Mathematics — Quadratic Equations",
        source: "CBSE Class 10 / Olympiad",
        difficulty: "Medium",
      },
      {
        question: "A solution contains 0.3 mol of NaCl and 0.2 mol of glucose in 1 kg of water. Calculate the boiling point elevation. (Kb for water = 0.512 K·kg/mol)",
        answer: "NaCl dissociates: i = 2, so effective molality = 2×0.3 + 0.2 = 0.8 mol/kg. ΔTb = Kb × m = 0.512 × 0.8 = 0.41 K. BP = 100.41°C",
        subject: "Chemistry — Solutions",
        source: "NEET",
        difficulty: "Medium",
      },
    ],
  },
  "language-literacy": {
    icon: Globe2,
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
        passage: "The ancient city of Mohenjo-daro, one of the largest settlements of the Indus Valley Civilisation, was remarkable for its urban planning. Its streets were laid out in a grid pattern, and the city had an advanced drainage system with covered drains running alongside the roads.",
        question: "What does the passage suggest about the Indus Valley Civilisation?",
        answer: "It was a highly organised and technically advanced civilisation with sophisticated infrastructure including planned streets and underground drainage.",
        language: "English",
        subject: "English Reading Comprehension",
        grade: "Grade 8",
        type: "Inferential Q&A",
      },
      {
        content: "मेरे देश की धरती — कविता\nमेरे देश की धरती सोना उगले, उगले हीरे मोती।\nमेरे देश की धरती सोना उगले।\n\nप्रश्न: कवि ने 'धरती' को किसका प्रतीक बताया है?\nउत्तर: कवि ने 'धरती' को समृद्धि और उर्वरता का प्रतीक बताया है। वे कहते हैं कि यह भूमि इतनी उपजाऊ है मानो सोना, हीरे और मोती उगाती हो।",
        language: "Hindi",
        subject: "Hindi Literature & Comprehension",
        grade: "Grade 9",
        type: "Poetry Analysis Q&A",
      },
      {
        content: "ভারতের জাতীয় পশু বাঘ। এটি শক্তি ও সাহসের প্রতীক। বাঘ ভারতের বনে বাস করে এবং এটি একটি বিপন্ন প্রজাতি।\n\nপ্রশ্ন: ভারতের জাতীয় পশু কী এবং এটি কীসের প্রতীক?\nউত্তর: ভারতের জাতীয় পশু হল বাঘ, যা শক্তি ও সাহসের প্রতীক।",
        language: "Bengali",
        subject: "Bengali Language & General Knowledge",
        grade: "Grade 6",
        type: "Factual Q&A",
      },
      {
        content: "Grammar Exercise — Voices\nActive: The teacher explained the concept clearly.\nPassive: The concept was explained clearly by the teacher.\n\nRule: In passive voice, the object of the active sentence becomes the subject. The verb changes to 'be + past participle'. The original subject becomes 'by + agent' (optional).",
        language: "English",
        subject: "English Grammar",
        grade: "Grade 10",
        type: "Grammar Exercise",
      },
    ],
  },
  "social-sciences": {
    icon: FileText,
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
        question: "What were the main causes of the First War of Indian Independence (1857)?",
        answer: "Causes included: (1) Political — annexation policy (Doctrine of Lapse) by Lord Dalhousie; (2) Economic — drain of wealth and ruin of Indian industries; (3) Social — interference in social customs and fear of Christianisation; (4) Military — discrimination in pay and the introduction of the Enfield rifle cartridge greased with animal fat.",
        subject: "Indian History — Modern India",
        source: "NCERT Class 8 / UPSC Prelims",
        level: "Class 10 / UPSC",
      },
      {
        question: "Explain the Directive Principles of State Policy (DPSP) and how they differ from Fundamental Rights.",
        answer: "DPSPs (Part IV, Articles 36–51) are guidelines for the state to frame policies for socio-economic justice. Unlike Fundamental Rights (justiciable — enforceable in court), DPSPs are non-justiciable — they cannot be enforced in a court of law. However, they are fundamental to governance and the state must apply them in making laws.",
        subject: "Indian Polity — Constitutional Framework",
        source: "UPSC Mains GS-II",
        level: "UPSC",
      },
      {
        question: "Describe the distribution of black soil in India and explain why it is ideal for cotton cultivation.",
        answer: "Black soil (Regur soil) is found in the Deccan Plateau — Maharashtra, Gujarat, Madhya Pradesh, and parts of Karnataka and Andhra Pradesh. It is ideal for cotton because: (1) it has high water-retention capacity, (2) it is rich in lime, iron, magnesia, and potash, (3) it swells when wet and cracks when dry, allowing self-ploughing, and (4) it remains moist for a long period.",
        subject: "Physical Geography — Soils of India",
        source: "NCERT Class 11 / UPSC Prelims",
        level: "Class 11 / UPSC",
      },
      {
        question: "What is the significance of the 73rd Constitutional Amendment Act, 1992?",
        answer: "The 73rd Amendment gave constitutional status to Panchayati Raj Institutions (PRIs). It added Part IX (Articles 243–243O) and the 11th Schedule. Key provisions: three-tier system (Gram Panchayat, Panchayat Samiti, Zila Parishad), reservation of seats for SCs, STs, and women (one-third), five-year term, and State Finance Commissions.",
        subject: "Indian Polity — Local Government",
        source: "UPSC Mains GS-II",
        level: "UPSC",
      },
    ],
  },
  "higher-education": {
    icon: Database,
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
        question: "A company forfeits 500 shares of ₹10 each (₹6 called up) held by Ramesh, who had paid ₹2 per share as application money. These shares are reissued at ₹4 per share as fully paid up. Pass journal entries for forfeiture and reissue.",
        subject: "Accountancy — Share Capital",
        domain: "Commerce",
        solution: "Forfeiture: Share Capital A/c Dr ₹3,000 | To Share Allotment A/c ₹2,000 | To Calls-in-Arrears A/c ₹1,000 (if any) | To Forfeited Shares A/c ₹1,000. Reissue: Bank A/c Dr ₹2,000 | Forfeited Shares A/c Dr ₹3,000 | To Share Capital A/c ₹5,000. Capital Reserve = Forfeited Shares balance after reissue.",
        level: "Class 12 / B.Com",
      },
      {
        question: "Distinguish between 'void agreement' and 'voidable contract' under the Indian Contract Act, 1872. Give one example of each.",
        subject: "Business Law / Contract Law",
        domain: "Law",
        solution: "A void agreement (Section 2(g)) is not enforceable by law from the very beginning — e.g., an agreement with a minor. A voidable contract (Section 2(i)) is enforceable at the option of one of the parties — it remains valid until the aggrieved party chooses to avoid it — e.g., a contract made under coercion. Key difference: void agreement has no legal effect at all; voidable contract has legal effect until rescinded.",
        level: "B.Com / LLB",
      },
      {
        question: "For a simply supported beam of span 6 m carrying a uniformly distributed load (UDL) of 20 kN/m, find the maximum bending moment and its location.",
        subject: "Strength of Materials / Structural Engineering",
        domain: "Engineering",
        solution: "Reactions: RA = RB = (20×6)/2 = 60 kN. Maximum BM occurs at mid-span (x = 3 m). M_max = (w × L²)/8 = (20 × 36)/8 = 90 kN·m. The bending moment diagram is parabolic with peak at centre.",
        level: "Diploma / B.Tech",
      },
      {
        question: "Explain the concept of 'price elasticity of demand'. If a 10% rise in price causes quantity demanded to fall by 25%, classify the elasticity and calculate its value.",
        subject: "Micro-Economics",
        domain: "Commerce",
        solution: "Price Elasticity of Demand (PED) = % change in Qd / % change in Price = −25/10 = −2.5 (absolute value: 2.5). Since |PED| > 1, demand is elastic — consumers are highly responsive to the price change. This is typical of goods with many substitutes or those considered non-essential.",
        level: "Class 12 / B.Com / B.A. Economics",
      },
    ],
  },
};

export default function DatasetDetailPage() {
  const { slug } = useParams();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [downloadFiles, setDownloadFiles] = useState([]);

  const dataset = datasetConfigs[slug];

  useEffect(() => {
    const fetchFiles = async () => {
      try {
        const response = await axios.get(`${API}/files/category/${slug}`);
        setDownloadFiles(response.data);
      } catch (error) {
        if (process.env.NODE_ENV === "development") console.error("Error fetching files:", error);
      }
    };
    if (slug) fetchFiles();
  }, [slug]);

  if (!dataset) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] pt-24 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl text-white mb-4">Dataset not found</h1>
          <Link to="/datasets" className="text-blue-400 hover:underline">
            Back to datasets
          </Link>
        </div>
      </div>
    );
  }

  const IconComponent = dataset.icon;

  return (
    <div className="min-h-screen bg-[#0A0A0A] pt-24" data-testid="dataset-detail-page">
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
      {/* Header */}
      <section className="py-16 relative">
        <div className="absolute inset-0 hero-gradient opacity-50" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link
            to="/datasets"
            className="inline-flex items-center gap-2 text-gray-400 hover:text-white mb-8 transition-colors"
            data-testid="back-to-datasets"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Datasets
          </Link>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex items-start gap-6"
          >
            <div className="w-20 h-20 rounded-2xl bg-blue-500/10 flex items-center justify-center flex-shrink-0">
              <IconComponent className="w-10 h-10 text-blue-400" />
            </div>
            <div>
              <p className="text-blue-400 text-sm font-mono mb-2">{dataset.subtitle}</p>
              <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">
                {dataset.title}
              </h1>
              <p className="text-lg text-gray-400 max-w-3xl">
                {dataset.overview}
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Benchmark & Composition charts (SWE-bench++-style) — only when present */}
      {dataset.benchmark && (
        <section className="py-12 border-t border-white/5">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <BenchmarkCharts benchmark={dataset.benchmark} />
          </div>
        </section>
      )}

      {/* Main Content */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Left Column - Details */}
            <div className="lg:col-span-2 space-y-12">
              {/* Use Cases */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                <h2 className="text-2xl font-bold text-white mb-6">Use Cases</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {dataset.useCases.map((useCase, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-3 p-4 rounded-lg bg-white/[0.02] border border-white/5"
                    >
                      <CheckCircle2 className="w-5 h-5 text-blue-400 flex-shrink-0" />
                      <span className="text-gray-300">{useCase}</span>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* Dataset Structure */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <h2 className="text-2xl font-bold text-white mb-6">Dataset Structure</h2>
                <div className="overflow-x-auto rounded-xl border border-white/10">
                  <table className="w-full table-dark min-w-[480px]">
                    <thead>
                      <tr>
                        <th className="text-left p-4 w-1/3">Field</th>
                        <th className="text-left p-4">Description</th>
                      </tr>
                    </thead>
                    <tbody>
                      {dataset.structure.map((item, i) => (
                        <tr key={i}>
                          <td className="p-4 font-mono text-blue-400">{item.field}</td>
                          <td className="p-4 text-gray-400">{item.description}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </motion.div>

              {/* Sample Data Preview */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                <h2 className="text-2xl font-bold text-white mb-6">Sample Data Preview</h2>
                <div className="space-y-4">
                  {dataset.sampleData.map((sample, i) => (
                    <div
                      key={i}
                      className="p-6 rounded-xl bg-[#121212] border border-white/5"
                    >
                      {Object.entries(sample).map(([key, value]) => (
                        <div key={key} className="flex gap-4 mb-2 last:mb-0">
                          <span className="text-gray-500 font-mono text-sm w-28 flex-shrink-0 capitalize">
                            {key.replace(/([A-Z])/g, ' $1').trim()}:
                          </span>
                          <span className="text-gray-300 text-sm">
                            {Array.isArray(value) ? value.join(", ") : value}
                          </span>
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>

            {/* Right Column - Stats & CTA */}
            <div className="space-y-8 lg:sticky lg:top-28 lg:self-start">
              {/* Dataset Stats */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="p-6 rounded-xl bg-[#121212] border border-white/5"
              >
                <h3 className="text-lg font-semibold text-white mb-6">Dataset Size</h3>
                <div className="space-y-4">
                  {Object.entries(dataset.stats).map(([key, value]) => (
                    <div key={key} className="flex justify-between items-center">
                      <span className="text-gray-400">{key}</span>
                      <span className="text-white font-mono font-semibold">{value}</span>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* Download CTA */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="p-6 rounded-xl bg-gradient-to-br from-blue-500/10 to-indigo-500/10 border border-blue-500/20"
              >
                <h3 className="text-lg font-semibold text-white mb-3">
                  Download Sample Dataset
                </h3>
                <p className="text-gray-400 text-sm mb-6">
                  Get access to sample data and explore the dataset structure.
                </p>
                <Button
                  onClick={() => setIsFormOpen(true)}
                  className="w-full btn-primary"
                  data-testid="download-sample-btn"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download Sample
                </Button>
              </motion.div>

              {/* Request Full Dataset */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="p-6 rounded-xl bg-[#121212] border border-white/5"
              >
                <h3 className="text-lg font-semibold text-white mb-3">
                  Need the Full Dataset?
                </h3>
                <p className="text-gray-400 text-sm mb-6">
                  Contact our team to discuss licensing and custom requirements.
                </p>
                <Button
                  onClick={() => setIsFormOpen(true)}
                  className="w-full btn-secondary"
                  data-testid="request-full-dataset-btn"
                >
                  Request Full Dataset →
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      <LeadCaptureForm
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        preselectedDataset={slug}
        downloadFiles={downloadFiles}
      />
    </div>
  );
}
