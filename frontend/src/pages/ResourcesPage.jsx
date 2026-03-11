import { useState } from "react";
import { motion } from "framer-motion";
import { 
  Database,
  FileText,
  BookOpen,
  Newspaper,
  ArrowRight,
  Download,
  ExternalLink
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { LeadCaptureForm } from "@/components/LeadCaptureForm";

const resourceCategories = [
  {
    id: "samples",
    icon: Database,
    title: "Sample Datasets",
    description: "Download sample datasets to evaluate data quality and structure before committing.",
    items: [
      { title: "Academic Reasoning Sample", format: "CSV", size: "2.5 MB" },
      { title: "STEM Problems Sample", format: "JSON", size: "1.8 MB" },
      { title: "Multilingual Education Sample", format: "CSV", size: "3.2 MB" },
    ]
  },
  {
    id: "reports",
    icon: FileText,
    title: "Benchmark Reports",
    description: "Detailed reports on how our datasets impact model performance across standard benchmarks.",
    items: [
      { title: "MMLU Performance Analysis", format: "PDF", size: "1.2 MB" },
      { title: "Academic Reasoning Benchmark", format: "PDF", size: "980 KB" },
      { title: "Multilingual Model Evaluation", format: "PDF", size: "1.5 MB" },
    ]
  },
  {
    id: "papers",
    icon: BookOpen,
    title: "Research Papers",
    description: "Academic publications and technical documentation on our data methodology.",
    items: [
      { title: "Academic Data for LLM Training", format: "PDF", size: "2.1 MB" },
      { title: "Chain-of-Thought Dataset Design", format: "PDF", size: "1.8 MB" },
      { title: "Multilingual Educational Corpora", format: "PDF", size: "2.4 MB" },
    ]
  },
  {
    id: "blog",
    icon: Newspaper,
    title: "Blog",
    description: "Insights, updates, and best practices for using academic datasets in AI development.",
    items: [
      { title: "Building Reasoning Capabilities with Academic Data", type: "Article" },
      { title: "The Future of Educational AI", type: "Article" },
      { title: "Data Quality in LLM Training", type: "Article" },
    ]
  }
];

export default function ResourcesPage() {
  const [isFormOpen, setIsFormOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#0A0A0A] pt-24" data-testid="resources-page">
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
              Resources
            </h1>
            <p className="text-lg text-gray-400 max-w-2xl mx-auto">
              Sample datasets, benchmark reports, research papers, and insights to help you evaluate and use our data.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Resources Grid */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {resourceCategories.map((category, i) => (
              <motion.div
                key={category.id}
                id={category.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="p-8 rounded-2xl bg-[#121212] border border-white/5"
              >
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center">
                    <category.icon className="w-6 h-6 text-blue-400" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-white">{category.title}</h2>
                    <p className="text-sm text-gray-500">{category.description}</p>
                  </div>
                </div>

                <div className="space-y-3">
                  {category.items.map((item, j) => (
                    <button
                      key={j}
                      onClick={() => setIsFormOpen(true)}
                      className="w-full flex items-center justify-between p-4 rounded-lg bg-white/[0.02] border border-white/5 hover:border-blue-500/30 transition-colors group"
                      data-testid={`resource-${category.id}-${j}`}
                    >
                      <div className="flex items-center gap-3">
                        {item.format ? (
                          <Download className="w-4 h-4 text-gray-500 group-hover:text-blue-400 transition-colors" />
                        ) : (
                          <ExternalLink className="w-4 h-4 text-gray-500 group-hover:text-blue-400 transition-colors" />
                        )}
                        <span className="text-gray-300 group-hover:text-white transition-colors">
                          {item.title}
                        </span>
                      </div>
                      {item.format && (
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-gray-600">{item.size}</span>
                          <span className="text-xs font-mono text-gray-500 bg-white/5 px-2 py-1 rounded">
                            {item.format}
                          </span>
                        </div>
                      )}
                      {item.type && (
                        <span className="text-xs text-gray-500">{item.type}</span>
                      )}
                    </button>
                  ))}
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
              Need More Information?
            </h2>
            <p className="text-gray-400 mb-8">
              Our team is ready to provide additional documentation and answer any questions.
            </p>
            <Button
              onClick={() => setIsFormOpen(true)}
              className="btn-primary"
              data-testid="resources-contact-btn"
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
