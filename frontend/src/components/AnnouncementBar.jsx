import { useState, useEffect } from "react";
import { X, ExternalLink, Sparkles } from "lucide-react";

const STORAGE_KEY = "nalanda_announcement_dismissed_v1";

export default function AnnouncementBar() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!localStorage.getItem(STORAGE_KEY)) {
      setVisible(true);
    }
  }, []);

  const dismiss = () => {
    localStorage.setItem(STORAGE_KEY, "1");
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div
      className="relative z-[60] w-full flex items-center justify-center gap-3 px-4 py-2.5"
      style={{
        background: "linear-gradient(90deg, #1A1500 0%, #2A1F00 40%, #1A1500 100%)",
        borderBottom: "1px solid rgba(200,169,110,0.25)",
      }}
      role="banner"
    >
      {/* Glow line at bottom */}
      <div
        className="absolute bottom-0 left-0 right-0 h-px"
        style={{
          background:
            "linear-gradient(90deg, transparent 0%, rgba(200,169,110,0.5) 30%, rgba(200,169,110,0.5) 70%, transparent 100%)",
        }}
      />

      <Sparkles className="w-3.5 h-3.5 shrink-0" style={{ color: "#C8A96E" }} />

      <a
        href="https://huggingface.co/Nalandadata"
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-2 group"
      >
        <span className="text-[13px] font-medium" style={{ color: "#D4C090" }}>
          <span className="font-semibold" style={{ color: "#C8A96E" }}>New —</span>
          {" "}Our fine-tuned model &amp; JEE/NEET benchmark are now live on Hugging Face
        </span>
        <span
          className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold font-mono tracking-wide transition-colors group-hover:bg-[#C8A96E]/20"
          style={{ color: "#C8A96E", border: "1px solid rgba(200,169,110,0.35)" }}
        >
          View on HF
          <ExternalLink className="w-2.5 h-2.5" />
        </span>
      </a>

      <button
        onClick={dismiss}
        aria-label="Dismiss announcement"
        className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded transition-colors hover:bg-white/10"
        style={{ color: "#888" }}
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}
