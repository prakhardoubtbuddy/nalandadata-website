import { useState } from "react";
import { motion } from "framer-motion";
import { Helmet } from "react-helmet-async";
import { 
  Cpu,
  GraduationCap,
  Beaker,
  Building2,
  ArrowRight,
  CheckCircle2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { LeadCaptureForm } from "@/components/LeadCaptureForm";

const industries = [
  {
    id: "ai-labs",
    icon: Cpu,
    title: "Frontier AI Labs",
    description: "Training next generation LLMs with high-quality academic data that improves reasoning, factuality, and domain expertise.",
    benefits: [
      "Benchmark-validated datasets proven to improve model performance",
      "Large-scale pretraining corpora with 2B+ samples",
      "Chain-of-thought annotated reasoning data",
      "Multi-domain academic coverage",
      "Continuous data pipeline updates"
    ],
    metrics: [
      { label: "MMLU Improvement", value: "+7.2%" },
      { label: "Reasoning Accuracy", value: "+11.5%" },
      { label: "Data Quality Score", value: "98%" }
    ]
  },
  {
    id: "edtech",
    icon: GraduationCap,
    title: "EdTech Platforms",
    description: "Building intelligent AI tutors and learning systems with expertly curated educational content across subjects and languages.",
    benefits: [
      "Step-by-step solution explanations for tutoring",
      "Multilingual content in 12+ languages",
      "Grade-appropriate content classification",
      "Curriculum-aligned datasets",
      "Assessment and evaluation datasets"
    ],
    metrics: [
      { label: "Subject Coverage", value: "15+" },
      { label: "Languages", value: "12" },
      { label: "Expert Annotators", value: "2000+" }
    ]
  },
  {
    id: "research",
    icon: Beaker,
    title: "Research Institutions",
    description: "Developing reasoning models and advancing AI research with structured academic datasets and evaluation benchmarks.",
    benefits: [
      "Research-grade data with detailed metadata",
      "Evaluation benchmarks for academic reasoning",
      "Difficulty-stratified test sets",
      "Human baseline comparisons",
      "Reproducible dataset versions"
    ],
    metrics: [
      { label: "Benchmark Tasks", value: "50K+" },
      { label: "Difficulty Levels", value: "4" },
      { label: "Expert Baselines", value: "Yes" }
    ]
  },
  {
    id: "foundation",
    icon: Building2,
    title: "Foundation Model Companies",
    description: "Structured training corpora at scale for building foundation models with enhanced academic and reasoning capabilities.",
    benefits: [
      "Enterprise-grade data licensing",
      "Custom dataset development",
      "Dedicated data engineering support",
      "SLA-backed delivery",
      "Ongoing data partnership programs"
    ],
    metrics: [
      { label: "Data Volume", value: "2B+" },
      { label: "Custom Projects", value: "50+" },
      { label: "Enterprise Clients", value: "25+" }
    ]
  }
];

export default function IndustriesPage() {
  const [isFormOpen, setIsFormOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#0A0A0A] pt-24" data-testid="industries-page">
      <Helmet>
        <title>Industries — Nalandadata.ai</title>
        <meta name="description" content="AI training data for frontier AI labs, EdTech platforms, research institutions, and foundation model companies. Domain-specific academic datasets at scale." />
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
              Industries We Serve
            </h1>
            <p className="text-lg text-gray-400 max-w-2xl mx-auto">
              Powering AI innovation across sectors with domain-specific academic intelligence datasets.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Industries Grid */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-24">
            {industries.map((industry, i) => (
              <motion.div
                key={industry.id}
                id={industry.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="grid grid-cols-1 lg:grid-cols-5 gap-12"
              >
                {/* Info Section */}
                <div className={`lg:col-span-3 ${i % 2 === 1 ? "lg:order-2" : ""}`}>
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-16 h-16 rounded-xl bg-blue-500/10 flex items-center justify-center">
                      <industry.icon className="w-8 h-8 text-blue-400" />
                    </div>
                    <h2 className="text-3xl font-bold text-white">{industry.title}</h2>
                  </div>
                  <p className="text-lg text-gray-400 mb-8 leading-relaxed">
                    {industry.description}
                  </p>

                  <div className="space-y-3 mb-8">
                    {industry.benefits.map((benefit, j) => (
                      <div key={j} className="flex items-start gap-3">
                        <CheckCircle2 className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-300">{benefit}</span>
                      </div>
                    ))}
                  </div>

                  <Button
                    onClick={() => setIsFormOpen(true)}
                    className="btn-primary"
                    data-testid={`industry-cta-${industry.id}`}
                  >
                    Learn More
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>

                {/* Metrics Section */}
                <div className={`lg:col-span-2 ${i % 2 === 1 ? "lg:order-1" : ""}`}>
                  <div className="p-8 rounded-2xl bg-[#121212] border border-white/5 h-full">
                    <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-6">
                      Key Metrics
                    </h3>
                    <div className="space-y-6">
                      {industry.metrics.map((metric, j) => (
                        <div key={j} className="flex justify-between items-center pb-4 border-b border-white/5 last:border-0 last:pb-0">
                          <span className="text-gray-400">{metric.label}</span>
                          <span className="text-2xl font-bold text-white font-mono">{metric.value}</span>
                        </div>
                      ))}
                    </div>
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
              Different Industry?
            </h2>
            <p className="text-gray-400 mb-8">
              We work with organizations across industries. Tell us about your use case and we'll create a custom solution.
            </p>
            <Button
              onClick={() => setIsFormOpen(true)}
              className="btn-primary"
              data-testid="contact-industry-btn"
            >
              Contact Us
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </motion.div>
        </div>
      </section>

      <LeadCaptureForm open={isFormOpen} onOpenChange={setIsFormOpen} />
    </div>
  );
}
