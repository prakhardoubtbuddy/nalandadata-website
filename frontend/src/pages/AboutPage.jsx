import { motion } from "framer-motion";
import { BookOpen, Globe2, GraduationCap, Brain, Users, Award } from "lucide-react";

const stats = [
  { label: "Subjects", value: "15+", icon: BookOpen },
  { label: "Languages", value: "12", icon: Globe2 },
  { label: "Grades Covered", value: "Pre-primary to Masters", icon: GraduationCap },
  { label: "Years of Publishing", value: "85+", icon: Award },
];

const segments = [
  {
    icon: BookOpen,
    title: "Early Learning",
    description: "Foundational content that builds core literacy and numeracy skills for young learners.",
  },
  {
    icon: GraduationCap,
    title: "K-12",
    description: "Deep curriculum coverage across CBSE, ICSE, and state boards — from textbooks to digital classrooms.",
  },
  {
    icon: Brain,
    title: "Higher Education",
    description: "Test preparation, competitive exam content, and assessment solutions for the online era.",
  },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white">
      {/* Hero */}
      <div className="relative py-24 px-4 overflow-hidden border-b border-white/5">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-950/30 via-transparent to-indigo-950/20 pointer-events-none" />
        <div className="max-w-5xl mx-auto relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 mb-6">
              <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
              <span className="text-blue-400 text-xs font-medium tracking-wide">India's #1 Academic Publisher</span>
            </div>
            <h1 className="text-4xl sm:text-6xl font-bold mb-4 leading-tight">
              About{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">
                Nalandadata.ai
              </span>
            </h1>
            <p className="text-gray-400 text-lg sm:text-xl max-w-2xl leading-relaxed">
              Structured knowledge. Infinite intelligence.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Stats */}
      <div className="border-b border-white/5 py-12 px-4">
        <div className="max-w-5xl mx-auto grid grid-cols-2 sm:grid-cols-4 gap-6">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="flex flex-col items-center text-center p-4 rounded-xl bg-white/3 border border-white/5"
            >
              <stat.icon className="w-5 h-5 text-blue-400 mb-2" />
              <span className="text-2xl sm:text-3xl font-bold text-white">{stat.value}</span>
              <span className="text-gray-500 text-sm mt-1">{stat.label}</span>
            </motion.div>
          ))}
        </div>
      </div>

      {/* About Content */}
      <div className="py-20 px-4">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="space-y-8 text-gray-300 text-lg leading-relaxed mb-20"
          >
            <p>
              <span className="text-white font-semibold">Nalandadata.ai</span> is the digital initiative of S Chand, which is a leading Indian education content company delivering content, solutions, and
              services across the education lifecycle through three business segments —
              Early Learning, K-12, and Higher Education. We have a strong foothold in CBSE/ICSE
              affiliated schools, with increasing presence in state board affiliated schools across India.
            </p>
            <p>
              We develop and nurture relationships with customers by creating quality content and
              educational innovations. In recent years, we have increased our focus on investing and
              improving our digital offerings across every business segment.
            </p>
            <p>
              Over the last decade, we have coupled our print content with digital and interactive
              methods of learning, providing flexibility in the delivery of content to students.
              Our aim is to lead the transition to digital in the knowledge industry. In the K-12 segment,
              we operate through Destination Success (classroom learning), Mystudygear, Intellitab and
              Ignitor (device-based learning), and Testcoach Prime.
            </p>
            <p>
              In the higher education segment, our digital efforts are focused on test preparation — an
              area seeing rapid growth as examinations shift to online formats, driving demand for
              online content and assessment solutions.
            </p>
          </motion.div>

          {/* Business Segments */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">Our Business Segments</h2>
            <div className="w-12 h-0.5 bg-blue-500 mb-10" />
            <div className="grid sm:grid-cols-3 gap-6">
              {segments.map((seg, i) => (
                <div
                  key={seg.title}
                  className="p-6 rounded-2xl bg-white/3 border border-white/5 hover:border-blue-500/30 transition-colors"
                >
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center mb-4">
                    <seg.icon className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-white font-semibold text-lg mb-2">{seg.title}</h3>
                  <p className="text-gray-400 text-sm leading-relaxed">{seg.description}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
