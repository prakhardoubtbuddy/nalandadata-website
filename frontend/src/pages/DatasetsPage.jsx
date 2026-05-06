import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { LeadCaptureForm } from "@/components/LeadCaptureForm";
import { Helmet } from "react-helmet-async";

function getTagClass(tag) {
  const t = tag.toLowerCase();
  if (t.includes("rlhf") || t.includes("dpo")) return "tag-rlhf";
  if (t.includes("evaluation") || t.includes("eval")) return "tag-evaluation";
  if (t.includes("cot") || t.includes("chain")) return "tag-cot";
  if (t.includes("sft") || t.includes("fine-tun") || t.includes("reasoning")) return "tag-sft";
  return "tag-pretraining";
}

const sections = [
  {
    id: "stem-reasoning",
    label: "A — STEM REASONING & PROBLEM SOLVING",
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
    label: "B — LANGUAGE, LITERACY & COMPREHENSION",
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
    label: "C — SOCIAL SCIENCES, CIVICS & GENERAL KNOWLEDGE",
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
    label: "D — HIGHER EDUCATION & PROFESSIONAL KNOWLEDGE",
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

export default function DatasetsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [filteredSections, setFilteredSections] = useState(sections);

  useEffect(() => {
    if (searchQuery) {
      const filtered = sections
        .map(section => ({
          ...section,
          datasets: section.datasets.filter(
            ds =>
              ds.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
              ds.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
              ds.tag.toLowerCase().includes(searchQuery.toLowerCase())
          ),
        }))
        .filter(section => section.datasets.length > 0);
      setFilteredSections(filtered);
    } else {
      setFilteredSections(sections);
    }
  }, [searchQuery]);

  return (
    <div className="min-h-screen bg-[#0A0A0A] pt-24" data-testid="datasets-page">
      <Helmet>
        <title>Datasets — Nalandadata.ai</title>
        <meta name="description" content="Browse premium AI training datasets across STEM Reasoning, Language & Literacy, Social Sciences, and Higher Education. Research and enterprise licensing available." />
      </Helmet>
      {/* Header */}
      <section className="py-16 relative">
        <div className="absolute inset-0 hero-gradient opacity-50" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">
              Our Datasets
            </h1>
            <p className="text-lg text-gray-400 max-w-2xl mx-auto mb-8">
              Premium, curriculum-verified AI training datasets across five categories. Each dataset is available for research licensing and commercial enterprise agreements.
            </p>

            <div className="max-w-lg mx-auto relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
              <Input
                type="text"
                placeholder="Search datasets by name, subject, or use case..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 bg-black/50 border-white/10 text-white placeholder:text-gray-600 h-12"
                data-testid="dataset-search-input"
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Dataset Sections */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-20">
          {filteredSections.map((section, si) => (
            <motion.div
              key={section.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: si * 0.05 }}
            >
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-sm font-semibold tracking-widest text-blue-400 uppercase">
                  {section.label}
                </h2>
                <Link
                  to={`/datasets/${section.slug}`}
                  className="text-sm text-gray-500 hover:text-blue-400 transition-colors inline-flex items-center gap-1"
                >
                  View details <ArrowRight className="w-3 h-3" />
                </Link>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {section.datasets.map((ds, di) => (
                  <motion.div
                    key={ds.title}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: di * 0.05 }}
                  >
                    <Link
                      to={`/datasets/${section.slug}`}
                      className="block h-full p-6 rounded-2xl bg-[#121212] border border-white/5 hover:border-blue-500/30 transition-all duration-300 group"
                      data-testid={`dataset-item-${section.slug}-${di}`}
                    >
                      <div className="mb-3">
                        <span className={`text-xs font-mono font-medium px-2 py-1 rounded ${getTagClass(ds.tag)}`}>
                          [{ds.tag}]
                        </span>
                      </div>
                      <h3 className="text-lg font-semibold text-white group-hover:text-blue-400 transition-colors mb-3">
                        {ds.title}
                      </h3>
                      <p className="text-gray-400 text-sm mb-4 leading-relaxed">
                        {ds.description}
                      </p>
                      <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-500 font-mono border-t border-white/5 pt-4">
                        <span>Size: {ds.size}</span>
                        <span>Format: {ds.format}</span>
                        <span>Language: {ds.language}</span>
                      </div>
                      <div className="flex items-center justify-end mt-4 text-gray-600 group-hover:text-blue-400 transition-colors">
                        <span className="text-sm mr-2">View Details</span>
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          ))}

          {filteredSections.length === 0 && (
            <div className="text-center py-16">
              <p className="text-gray-500">No datasets found matching your search.</p>
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 border-t border-white/5">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">
            Need a Custom Dataset?
          </h2>
          <p className="text-gray-400 mb-8">
            We can build custom datasets tailored to your specific requirements.
          </p>
          <button
            onClick={() => setIsFormOpen(true)}
            className="btn-primary inline-flex items-center gap-2"
            data-testid="custom-dataset-btn"
          >
            Request Custom Dataset
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </section>

      <LeadCaptureForm open={isFormOpen} onOpenChange={setIsFormOpen} />
    </div>
  );
}
