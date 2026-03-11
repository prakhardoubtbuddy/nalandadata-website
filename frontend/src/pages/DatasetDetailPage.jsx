import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  Brain, 
  Database, 
  Globe2, 
  FileText, 
  Mic,
  ArrowRight,
  ArrowLeft,
  Download,
  CheckCircle2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { LeadCaptureForm } from "@/components/LeadCaptureForm";
import axios from "axios";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

// Dataset configurations
const datasetConfigs = {
  "academic-reasoning": {
    icon: Brain,
    title: "Academic Reasoning Dataset",
    subtitle: "JEE / Olympiad Level Reasoning",
    overview: "High-quality reasoning dataset built from advanced academic problems with step-by-step expert solutions. Designed for training LLMs to perform complex multi-step reasoning across physics, chemistry, and mathematics.",
    useCases: [
      "Fine-tuning reasoning LLMs",
      "Training tutoring AI agents",
      "Benchmark evaluation",
      "Chain-of-thought training",
      "Mathematical reasoning research"
    ],
    structure: [
      { field: "Question", description: "Problem statement with context" },
      { field: "Options", description: "Multiple choice options (where applicable)" },
      { field: "Correct Answer", description: "Verified correct answer" },
      { field: "Solution", description: "Step-by-step expert explanation" },
      { field: "Topic", description: "Main subject area (Physics/Chemistry/Math)" },
      { field: "Subtopic", description: "Specific topic classification" },
      { field: "Difficulty", description: "Easy / Medium / Hard / Advanced" },
      { field: "Source", description: "JEE / Olympiad / NEET classification" }
    ],
    stats: {
      questions: "500K+",
      solutions: "500K+",
      topics: "120+",
      difficultyLevels: "4",
      languages: "English + Hindi"
    },
    sampleData: [
      {
        question: "A particle moves in a circle of radius 20 cm with constant tangential acceleration. If the velocity of the particle is 80 cm/s at the end of the second revolution after motion has begun, find the tangential acceleration.",
        options: ["A) 2π cm/s²", "B) 4π cm/s²", "C) π cm/s²", "D) 8π cm/s²"],
        answer: "B) 4π cm/s²",
        topic: "Physics - Circular Motion",
        difficulty: "Medium"
      },
      {
        question: "Find the sum of the series: 1 + 1/2 + 1/4 + 1/8 + ... to infinity",
        options: ["A) 1", "B) 2", "C) 3", "D) 4"],
        answer: "B) 2",
        topic: "Mathematics - Series",
        difficulty: "Easy"
      },
      {
        question: "The IUPAC name of CH₃-CH(OH)-CH₂-CHO is:",
        options: ["A) 3-hydroxybutanal", "B) 3-hydroxybutanol", "C) 2-hydroxybutanal", "D) 4-hydroxybutanal"],
        answer: "A) 3-hydroxybutanal",
        topic: "Chemistry - Organic",
        difficulty: "Medium"
      }
    ]
  },
  "stem-datasets": {
    icon: Database,
    title: "STEM Training Dataset",
    subtitle: "Physics, Chemistry, Mathematics",
    overview: "Comprehensive STEM dataset featuring structured problems across physics, chemistry, and mathematics. Each entry includes verified expert solutions with detailed explanations suitable for scientific reasoning training.",
    useCases: [
      "Scientific reasoning model training",
      "STEM tutoring systems",
      "Automated problem solving",
      "Educational AI assistants",
      "Formula and concept extraction"
    ],
    structure: [
      { field: "Problem", description: "Structured problem statement" },
      { field: "Subject", description: "Physics / Chemistry / Mathematics" },
      { field: "Chapter", description: "Chapter or unit classification" },
      { field: "Concept", description: "Core concept being tested" },
      { field: "Solution", description: "Detailed step-by-step solution" },
      { field: "Formulas", description: "List of formulas used" },
      { field: "Diagrams", description: "Associated diagrams (where applicable)" },
      { field: "Grade Level", description: "Target academic level" }
    ],
    stats: {
      problems: "1.2M+",
      subjects: "3",
      chapters: "200+",
      formulas: "5000+",
      languages: "English + Hindi"
    },
    sampleData: [
      {
        question: "Calculate the work done by a force F = (3i + 4j) N in displacing a particle from point A(1,2) to B(4,6).",
        subject: "Physics",
        chapter: "Work and Energy",
        answer: "25 J",
        difficulty: "Medium"
      },
      {
        question: "Balance the equation: Fe₂O₃ + C → Fe + CO₂",
        subject: "Chemistry",
        chapter: "Redox Reactions",
        answer: "2Fe₂O₃ + 3C → 4Fe + 3CO₂",
        difficulty: "Easy"
      },
      {
        question: "Find the derivative of f(x) = x³sin(x)",
        subject: "Mathematics",
        chapter: "Calculus",
        answer: "3x²sin(x) + x³cos(x)",
        difficulty: "Medium"
      }
    ]
  },
  "multilingual-education": {
    icon: Globe2,
    title: "Multilingual Education Dataset",
    subtitle: "12+ Languages Including Indic",
    overview: "Educational content spanning English, Hindi, and 10+ major Indic languages. Includes parallel corpora for translation tasks and culturally contextualized content for building inclusive AI systems.",
    useCases: [
      "Multilingual model training",
      "Translation systems",
      "Indic language AI development",
      "Cross-lingual learning",
      "Regional education platforms"
    ],
    structure: [
      { field: "Content", description: "Educational text content" },
      { field: "Language", description: "Source language code" },
      { field: "Translation", description: "Parallel translations available" },
      { field: "Subject", description: "Academic subject area" },
      { field: "Grade", description: "Target grade level" },
      { field: "Region", description: "Regional context (if applicable)" },
      { field: "Script", description: "Writing script used" }
    ],
    stats: {
      samples: "800K+",
      languages: "12",
      subjects: "15+",
      parallelPairs: "2M+",
      scripts: "8"
    },
    sampleData: [
      {
        content: "The water cycle describes how water evaporates from the surface of the earth...",
        language: "English",
        subject: "Science",
        grade: "Grade 5"
      },
      {
        content: "जल चक्र बताता है कि पानी पृथ्वी की सतह से कैसे वाष्पित होता है...",
        language: "Hindi",
        subject: "Science",
        grade: "Grade 5"
      },
      {
        content: "நீர் சுழற்சி என்பது பூமியின் மேற்பரப்பிலிருந்து நீர் எவ்வாறு ஆவியாகிறது...",
        language: "Tamil",
        subject: "Science",
        grade: "Grade 5"
      }
    ]
  },
  "ocr-document-ai": {
    icon: FileText,
    title: "OCR & Document AI Dataset",
    subtitle: "Textbooks & Educational Documents",
    overview: "Structured educational documents including textbooks, question banks, and examination papers. Optimized for document understanding, OCR training, and information extraction from academic materials.",
    useCases: [
      "Document OCR training",
      "Equation recognition",
      "Table extraction",
      "Layout analysis",
      "Educational document digitization"
    ],
    structure: [
      { field: "Image", description: "Document image/scan" },
      { field: "Text", description: "Extracted text content" },
      { field: "Layout", description: "Bounding box coordinates" },
      { field: "Type", description: "Content type (text/equation/table/figure)" },
      { field: "LaTeX", description: "LaTeX representation (for equations)" },
      { field: "Table Data", description: "Structured table content" },
      { field: "Document Type", description: "Textbook/Question Paper/Notes" }
    ],
    stats: {
      documents: "300K+",
      pages: "2M+",
      equations: "500K+",
      tables: "100K+",
      formats: "PDF, PNG, JPEG"
    },
    sampleData: [
      {
        type: "Equation",
        latex: "E = mc^2",
        context: "Einstein's mass-energy equivalence",
        source: "Physics Textbook"
      },
      {
        type: "Table",
        content: "Periodic Table - First 20 Elements",
        columns: ["Element", "Symbol", "Atomic Number", "Mass"],
        source: "Chemistry Reference"
      },
      {
        type: "Diagram",
        description: "Human Digestive System",
        labels: ["Esophagus", "Stomach", "Small Intestine", "Large Intestine"],
        source: "Biology Textbook"
      }
    ]
  },
  "speech-audio-learning": {
    icon: Mic,
    title: "Speech & Audio Learning Dataset",
    subtitle: "Educational Audio Corpora",
    overview: "Comprehensive educational audio dataset featuring lecture recordings, pronunciation guides, and speech corpora. Designed for training audio AI models in educational contexts.",
    useCases: [
      "Speech recognition training",
      "Educational voice assistants",
      "Lecture transcription",
      "Pronunciation assessment",
      "Audio-based learning systems"
    ],
    structure: [
      { field: "Audio", description: "Audio file (WAV/MP3)" },
      { field: "Transcript", description: "Accurate transcription" },
      { field: "Speaker", description: "Speaker metadata" },
      { field: "Language", description: "Spoken language" },
      { field: "Accent", description: "Regional accent information" },
      { field: "Topic", description: "Subject matter" },
      { field: "Duration", description: "Audio length" },
      { field: "Quality", description: "Audio quality rating" }
    ],
    stats: {
      hours: "150K+",
      speakers: "5000+",
      languages: "8",
      accents: "20+",
      topics: "50+"
    },
    sampleData: [
      {
        type: "Lecture",
        topic: "Introduction to Quantum Mechanics",
        duration: "45 minutes",
        language: "English",
        speaker: "Professor"
      },
      {
        type: "Pronunciation",
        word: "Photosynthesis",
        language: "English",
        accent: "Indian English",
        duration: "3 seconds"
      },
      {
        type: "Educational Dialogue",
        topic: "Math Problem Solving",
        participants: "Tutor + Student",
        duration: "15 minutes",
        language: "Hindi"
      }
    ]
  }
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
        console.error("Error fetching files:", error);
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
                <div className="rounded-xl border border-white/10 overflow-hidden">
                  <table className="w-full table-dark">
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
                          <span className="text-gray-500 font-mono text-sm w-24 flex-shrink-0 capitalize">
                            {key}:
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
            <div className="space-y-8">
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
                      <span className="text-gray-400 capitalize">
                        {key.replace(/([A-Z])/g, ' $1').trim()}
                      </span>
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
                  variant="outline"
                  className="w-full btn-secondary"
                  data-testid="request-full-dataset-btn"
                >
                  Request Full Dataset
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
