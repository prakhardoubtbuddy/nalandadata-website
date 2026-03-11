import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  Brain, 
  Database, 
  Globe2, 
  FileText, 
  Mic,
  ArrowRight,
  Search
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { LeadCaptureForm } from "@/components/LeadCaptureForm";

const datasetCategories = [
  {
    icon: Brain,
    title: "Academic Reasoning",
    description: "JEE / Olympiad level reasoning datasets with step-by-step solutions and chain-of-thought annotations. Perfect for training advanced reasoning capabilities.",
    slug: "academic-reasoning",
    samples: "500K+",
    features: ["Chain-of-thought annotations", "Multi-step solutions", "Difficulty stratification"],
  },
  {
    icon: Database,
    title: "STEM Datasets",
    description: "Comprehensive Physics, Chemistry, and Mathematics structured problems with verified expert solutions for scientific reasoning.",
    slug: "stem-datasets",
    samples: "1.2M+",
    features: ["Expert-verified solutions", "Topic classification", "Formula extraction"],
  },
  {
    icon: Globe2,
    title: "Multilingual Education",
    description: "Educational content spanning English, Hindi, and 10+ major Indic languages for building inclusive AI systems.",
    slug: "multilingual-education",
    samples: "800K+",
    features: ["12+ languages", "Parallel corpora", "Cultural context"],
  },
  {
    icon: FileText,
    title: "OCR & Document AI",
    description: "Textbooks, question banks, and structured educational content optimized for document understanding and extraction.",
    slug: "ocr-document-ai",
    samples: "300K+",
    features: ["Equation recognition", "Table extraction", "Layout analysis"],
  },
  {
    icon: Mic,
    title: "Speech & Audio Learning",
    description: "Educational audio datasets including lectures, pronunciation guides, and speech corpora for audio AI models.",
    slug: "speech-audio-learning",
    samples: "150K+ hrs",
    features: ["Lecture transcripts", "Multi-accent data", "Educational speech"],
  },
];

export default function DatasetsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [filteredCategories, setFilteredCategories] = useState(datasetCategories);

  useEffect(() => {
    if (searchQuery) {
      const filtered = datasetCategories.filter(
        (cat) =>
          cat.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          cat.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredCategories(filtered);
    } else {
      setFilteredCategories(datasetCategories);
    }
  }, [searchQuery]);

  return (
    <div className="min-h-screen bg-[#0A0A0A] pt-24" data-testid="datasets-page">
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
              Dataset Catalog
            </h1>
            <p className="text-lg text-gray-400 max-w-2xl mx-auto mb-8">
              Explore our comprehensive collection of academic intelligence datasets 
              designed for training frontier AI models.
            </p>

            {/* Search */}
            <div className="max-w-md mx-auto relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
              <Input
                type="text"
                placeholder="Search datasets..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 bg-black/50 border-white/10 text-white placeholder:text-gray-600 h-12"
                data-testid="dataset-search-input"
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Dataset Grid */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {filteredCategories.map((category, i) => (
              <motion.div
                key={category.slug}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
              >
                <Link
                  to={`/datasets/${category.slug}`}
                  className="block h-full p-8 rounded-2xl bg-[#121212] border border-white/5 hover:border-blue-500/30 transition-all duration-300 group"
                  data-testid={`dataset-item-${category.slug}`}
                >
                  <div className="flex items-start gap-6">
                    <div className="w-16 h-16 rounded-xl bg-blue-500/10 flex items-center justify-center flex-shrink-0 group-hover:bg-blue-500/20 transition-colors">
                      <category.icon className="w-8 h-8 text-blue-400" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-xl font-semibold text-white group-hover:text-blue-400 transition-colors">
                          {category.title}
                        </h3>
                        <span className="text-xs font-mono text-gray-500 bg-white/5 px-3 py-1 rounded-full">
                          {category.samples}
                        </span>
                      </div>
                      <p className="text-gray-400 text-sm mb-4 leading-relaxed">
                        {category.description}
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {category.features.map((feature) => (
                          <span
                            key={feature}
                            className="text-xs text-gray-500 bg-white/5 px-2 py-1 rounded"
                          >
                            {feature}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-end mt-6 text-gray-500 group-hover:text-blue-400 transition-colors">
                    <span className="text-sm mr-2">View Details</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>

          {filteredCategories.length === 0 && (
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
