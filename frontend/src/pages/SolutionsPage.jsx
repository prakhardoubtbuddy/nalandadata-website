import { useState } from "react";
import { motion } from "framer-motion";
import { Helmet } from "react-helmet-async";
import { 
  Layers,
  Settings,
  Target,
  BarChart3,
  ArrowRight,
  CheckCircle2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { LeadCaptureForm } from "@/components/LeadCaptureForm";

const solutions = [
  {
    id: "pretraining",
    icon: Layers,
    title: "Pretraining Data",
    description: "Large-scale academic corpora designed to enhance foundational model capabilities with structured knowledge.",
    features: [
      "2B+ structured academic samples",
      "Multi-domain coverage (STEM, Humanities, Languages)",
      "Clean, deduplicated, and quality-filtered",
      "Format-ready for major training frameworks",
      "Continuous updates with new content"
    ],
    useCases: [
      "Foundation model pretraining",
      "Domain adaptation",
      "Knowledge injection",
      "Curriculum learning"
    ]
  },
  {
    id: "sft",
    icon: Settings,
    title: "Supervised Fine-Tuning (SFT)",
    description: "Expert-annotated instruction-response pairs for aligning models to follow complex academic instructions.",
    features: [
      "500K+ instruction-response pairs",
      "Multi-turn conversation data",
      "Step-by-step reasoning chains",
      "Task-specific datasets available",
      "Quality scored by domain experts"
    ],
    useCases: [
      "Instruction following",
      "Task-specific fine-tuning",
      "Tutoring AI development",
      "Domain specialization"
    ]
  },
  {
    id: "rlhf",
    icon: Target,
    title: "RLHF / DPO Datasets",
    description: "Human preference data and ranked responses for training models to generate safer, more helpful outputs.",
    features: [
      "100K+ preference pairs",
      "Expert-ranked response comparisons",
      "Safety and helpfulness annotations",
      "Diverse academic scenarios",
      "Continuous human feedback collection"
    ],
    useCases: [
      "Preference optimization",
      "Response quality improvement",
      "Safety alignment",
      "Helpfulness training"
    ]
  },
  {
    id: "benchmarks",
    icon: BarChart3,
    title: "Evaluation Benchmarks",
    description: "Comprehensive evaluation datasets for measuring model performance across academic reasoning tasks.",
    features: [
      "50K+ evaluation questions",
      "Difficulty-stratified test sets",
      "Multi-subject coverage",
      "Human expert baseline scores",
      "Detailed performance metrics"
    ],
    useCases: [
      "Model evaluation",
      "Progress tracking",
      "Comparative analysis",
      "Research benchmarking"
    ]
  }
];

export default function SolutionsPage() {
  const [isFormOpen, setIsFormOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#0A0A0A] pt-24" data-testid="solutions-page">
      <Helmet>
        <title>Solutions — Nalandadata.ai</title>
        <meta name="description" content="AI training data solutions for every stage of the pipeline — pretraining corpora, supervised fine-tuning datasets, RLHF preference data, and evaluation benchmarks." />
      </Helmet>
      {/* Header */}
      <section className="py-16 relative">
        <div className="absolute inset-0 hero-gradient opacity-50" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">
              Built for every stage of the AI training pipeline.
            </h1>
            <p className="text-lg text-gray-400 max-w-2xl mx-auto">
              Whether you are pretraining a foundation model, fine-tuning for a specific domain, building evaluation benchmarks, or developing an AI tutor — Nalandadata has a dataset designed for your use case.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Solutions Grid */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-16">
            {solutions.map((solution, i) => (
              <motion.div
                key={solution.id}
                id={solution.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start"
              >
                {/* Left - Info */}
                <div className={i % 2 === 1 ? "lg:order-2" : ""}>
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-14 h-14 rounded-xl bg-blue-500/10 flex items-center justify-center">
                      <solution.icon className="w-7 h-7 text-blue-400" />
                    </div>
                    <h2 className="text-2xl font-bold text-white">{solution.title}</h2>
                  </div>
                  <p className="text-gray-400 mb-8 leading-relaxed">
                    {solution.description}
                  </p>

                  <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">
                    Key Features
                  </h3>
                  <ul className="space-y-3 mb-8">
                    {solution.features.map((feature, j) => (
                      <li key={j} className="flex items-start gap-3">
                        <CheckCircle2 className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-300">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <Button
                    onClick={() => setIsFormOpen(true)}
                    className="btn-primary"
                    data-testid={`solution-cta-${solution.id}`}
                  >
                    Request {solution.title} →
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>

                {/* Right - Use Cases */}
                <div className={`p-8 rounded-2xl bg-[#121212] border border-white/5 ${i % 2 === 1 ? "lg:order-1" : ""}`}>
                  <h3 className="text-lg font-semibold text-white mb-6">Use Cases</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {solution.useCases.map((useCase, j) => (
                      <div
                        key={j}
                        className="p-4 rounded-lg bg-white/[0.02] border border-white/5"
                      >
                        <span className="text-gray-300">{useCase}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 border-t border-white/5">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl font-bold text-white mb-4">
              Ready to bring structured knowledge to your AI?
            </h2>
            <p className="text-gray-400 mb-8">
              Talk to our team. We'll help you identify the right datasets for your training pipeline and get you a sample within 48 hours.
            </p>
            <Button
              onClick={() => setIsFormOpen(true)}
              className="btn-primary"
              data-testid="custom-solution-btn"
            >
              Contact Our Team
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </motion.div>
        </div>
      </section>

      <LeadCaptureForm open={isFormOpen} onOpenChange={setIsFormOpen} />
    </div>
  );
}
