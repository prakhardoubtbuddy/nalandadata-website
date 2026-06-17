import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Download, Heart, ExternalLink, Brain, Database } from "lucide-react";
import axios from "axios";
import API from "@/lib/api";

function HFCard({ data, loading, error }) {
  if (loading) {
    return (
      <div className="border border-[#1E1E1E] rounded p-6 bg-[#111] animate-pulse">
        <div className="h-3 w-24 bg-[#2A2A2A] rounded mb-4" />
        <div className="h-5 w-48 bg-[#2A2A2A] rounded mb-3" />
        <div className="h-3 w-full bg-[#2A2A2A] rounded mb-2" />
        <div className="h-3 w-3/4 bg-[#2A2A2A] rounded mb-6" />
        <div className="flex gap-4">
          <div className="h-3 w-16 bg-[#2A2A2A] rounded" />
          <div className="h-3 w-16 bg-[#2A2A2A] rounded" />
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="border border-[#1E1E1E] rounded p-6 bg-[#111] flex items-center justify-center">
        <p className="text-[#555] text-sm font-mono">Could not load data from Hugging Face</p>
      </div>
    );
  }

  const isModel = data.type === "model";
  const Icon = isModel ? Brain : Database;
  const typeLabel = isModel ? "MODEL" : "DATASET";
  const shortName = data.name.split("/").pop();
  const relevantTags = (data.tags || [])
    .filter((t) => !t.startsWith("license:") && !t.startsWith("region:"))
    .slice(0, 5);

  return (
    <div className="border border-[#1E1E1E] rounded p-6 bg-[#111] flex flex-col gap-4">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-2">
          <Icon className="w-4 h-4 text-[#C8A96E]" />
          <span className="text-[#C8A96E] font-mono text-[11px] tracking-widest uppercase">
            {typeLabel}
          </span>
        </div>
        <a
          href={data.url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-[#555] hover:text-[#C8A96E] transition-colors"
          aria-label={`View ${shortName} on Hugging Face`}
        >
          <ExternalLink className="w-4 h-4" />
        </a>
      </div>

      <div>
        <h3 className="text-[#F0EBE0] font-bold text-base mb-1 leading-snug">{shortName}</h3>
        <p className="text-[#888] font-mono text-[12px]">{data.name}</p>
      </div>

      {data.description && (
        <p className="text-[#999] text-[14px] font-medium leading-relaxed line-clamp-3">
          {data.description}
        </p>
      )}

      {relevantTags.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {relevantTags.map((tag) => (
            <span
              key={tag}
              className="px-2 py-0.5 bg-[#1A1A1A] border border-[#2A2A2A] text-[#777] font-mono font-semibold text-[11px] tracking-wider rounded"
            >
              {tag}
            </span>
          ))}
        </div>
      )}

      <div className="flex items-center gap-5 mt-auto pt-2 border-t border-[#1E1E1E]">
        <div className="flex items-center gap-1.5 text-[#777]">
          <Download className="w-3.5 h-3.5" />
          <span className="text-[13px] font-mono font-medium">
            {data.downloads >= 1000
              ? `${(data.downloads / 1000).toFixed(1)}k`
              : data.downloads}{" "}
            downloads
          </span>
        </div>
        <div className="flex items-center gap-1.5 text-[#777]">
          <Heart className="w-3.5 h-3.5" />
          <span className="text-[13px] font-mono font-medium">{data.likes} likes</span>
        </div>
        <a
          href={data.url}
          target="_blank"
          rel="noopener noreferrer"
          className="ml-auto text-[13px] font-semibold text-[#C8A96E] hover:text-[#D4B896] transition-colors font-mono"
        >
          View on HF →
        </a>
      </div>
    </div>
  );
}

export default function HuggingFaceSection() {
  const [model, setModel] = useState(null);
  const [dataset, setDataset] = useState(null);
  const [loadingModel, setLoadingModel] = useState(true);
  const [loadingDataset, setLoadingDataset] = useState(true);
  const [errorModel, setErrorModel] = useState(false);
  const [errorDataset, setErrorDataset] = useState(false);

  useEffect(() => {
    axios
      .get(`${API}/hf/model`)
      .then((r) => setModel(r.data))
      .catch(() => setErrorModel(true))
      .finally(() => setLoadingModel(false));

    axios
      .get(`${API}/hf/dataset`)
      .then((r) => setDataset(r.data))
      .catch(() => setErrorDataset(true))
      .finally(() => setLoadingDataset(false));
  }, []);

  return (
    <section className="py-20 border-b border-[#252525]" data-testid="hf-section">
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <p className="text-[#666] font-mono font-semibold text-[12px] tracking-widest uppercase mb-4">
            OPEN RESEARCH
          </p>
          <h2
            className="font-bold leading-tight tracking-tight mb-3"
            style={{ fontSize: "clamp(28px, 3.5vw, 44px)", color: "#F0EBE0" }}
          >
            Models &amp; benchmarks
            <br />
            on Hugging Face.
          </h2>
          <p className="text-[#888] text-base font-medium mb-10 max-w-xl">
            Our fine-tuned models and evaluation benchmarks are published openly on
            Hugging Face for the research community.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.08 }}
          >
            <HFCard data={model} loading={loadingModel} error={errorModel} />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.16 }}
          >
            <HFCard data={dataset} loading={loadingDataset} error={errorDataset} />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
