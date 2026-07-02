import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import axios from "axios";
import API from "@/lib/api";

function formatDate(iso) {
  if (!iso) return "";
  return new Date(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default function BlogPostPage() {
  const { slug } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    setLoading(true);
    setNotFound(false);
    axios
      .get(`${API}/blog/${slug}`)
      .then((r) => setPost(r.data))
      .catch((err) => {
        if (err.response?.status === 404) setNotFound(true);
      })
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) {
    return (
      <div className="bg-[#0A0A0A]" style={{ paddingTop: "96px", minHeight: "100vh", paddingBottom: "80px" }}>
        <div style={{ maxWidth: "720px", margin: "0 auto", padding: "0 24px" }}>
          <div style={{ height: "10px", width: "64px", background: "var(--line)", borderRadius: "4px", marginBottom: "32px" }} />
          <div style={{ height: "28px", width: "75%", background: "var(--line)", borderRadius: "4px", marginBottom: "12px" }} />
          <div style={{ height: "28px", width: "50%", background: "var(--line)", borderRadius: "4px", marginBottom: "32px" }} />
          {[85, 90, 80, 88, 70].map((w, i) => (
            <div key={i} style={{ height: "14px", width: `${w}%`, background: "var(--line)", borderRadius: "4px", marginBottom: "12px" }} />
          ))}
        </div>
      </div>
    );
  }

  if (notFound || !post) {
    return (
      <div className="bg-[#0A0A0A]" style={{ paddingTop: "96px", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ textAlign: "center", maxWidth: "480px", padding: "0 24px" }}>
          <p style={{ color: "var(--accent)", fontFamily: "var(--mono)", fontSize: "11px", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "16px" }}>Coming soon</p>
          <h1 style={{ color: "var(--paper)", fontSize: "clamp(22px,3vw,32px)", fontWeight: 800, letterSpacing: "-0.03em", lineHeight: 1.15, marginBottom: "16px" }}>This post is being written.</h1>
          <p style={{ color: "var(--muted)", fontSize: "15px", lineHeight: 1.6, marginBottom: "32px" }}>We're putting the finishing touches on this one. Check back soon.</p>
          <Link to="/benchmarks" style={{ color: "var(--accent)", fontSize: "13px", fontFamily: "var(--mono)", fontWeight: 600 }}>
            ← Back to Benchmarks
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#0A0A0A]" style={{ paddingTop: "96px", paddingBottom: "80px", overflowX: "hidden" }}>
      <div style={{ maxWidth: "720px", margin: "0 auto", padding: "0 24px" }}>

        {/* Back link */}
        <div style={{ marginBottom: "40px" }}>
          <Link
            to="/blog"
            style={{ color: "var(--muted)", fontSize: "13px", fontFamily: "var(--mono)", textDecoration: "none" }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "var(--accent)")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "var(--muted)")}
          >
            ← Blog
          </Link>
        </div>

        {/* Header */}
        <div style={{ marginBottom: "40px" }}>
          <p style={{ color: "var(--accent)", fontFamily: "var(--mono)", fontSize: "11px", letterSpacing: "0.1em", textTransform: "uppercase", margin: "0 0 16px" }}>
            {post.category}
          </p>
          <h1 style={{ fontSize: "clamp(28px,3.5vw,44px)", fontWeight: 800, letterSpacing: "-0.03em", lineHeight: 1.1, color: "var(--paper)", margin: "0 0 16px" }}>
            {post.title}
          </h1>
          <p style={{ color: "var(--muted)", fontSize: "16px", lineHeight: 1.6, margin: "0 0 24px" }}>
            {post.excerpt}
          </p>

          <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: "16px", fontSize: "13px", fontFamily: "var(--mono)", color: "var(--muted)", paddingBottom: "24px", borderBottom: "1px solid var(--line)" }}>
            <span>{formatDate(post.published_at)}</span>
            <span>{post.author}</span>
            {post.tags && post.tags.length > 0 && (
              <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                {post.tags.map((tag) => (
                  <span key={tag} style={{ padding: "2px 8px", background: "var(--ink-2)", border: "1px solid var(--line)", borderRadius: "4px", color: "var(--muted)", fontSize: "11px", letterSpacing: "0.04em" }}>
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* HF reference card */}
        {post.hf_model_ref && (
          <div style={{ marginBottom: "32px", border: "1px solid rgba(200,169,110,0.25)", borderRadius: "8px", padding: "16px 20px", background: "rgba(200,169,110,0.05)", display: "flex", alignItems: "center", justifyContent: "space-between", gap: "16px" }}>
            <div>
              <p style={{ color: "var(--accent)", fontFamily: "var(--mono)", fontSize: "11px", letterSpacing: "0.1em", textTransform: "uppercase", margin: "0 0 4px" }}>
                Hugging Face
              </p>
              <p style={{ color: "var(--paper)", fontSize: "14px", margin: 0 }}>{post.hf_model_ref}</p>
            </div>
            <a
              href={post.hf_model_ref.startsWith("http") ? post.hf_model_ref : `https://huggingface.co/${post.hf_model_ref}`}
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: "var(--accent)", fontSize: "13px", fontFamily: "var(--mono)", fontWeight: 600, textDecoration: "none", whiteSpace: "nowrap" }}
            >
              View on HF ↗
            </a>
          </div>
        )}

        {/* Markdown content */}
        <article className="prose-blog">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
              table: ({ node, ...props }) => (
                <div style={{ overflowX: "auto", WebkitOverflowScrolling: "touch", margin: "1.5em 0" }}>
                  <table {...props} style={{ margin: 0, minWidth: "480px" }} />
                </div>
              ),
            }}
          >
            {post.content}
          </ReactMarkdown>
        </article>

        {/* Footer nav */}
        <div style={{ marginTop: "64px", paddingTop: "32px", borderTop: "1px solid var(--line)" }}>
          <Link
            to="/blog"
            style={{ color: "var(--accent)", fontSize: "13px", fontFamily: "var(--mono)", fontWeight: 600, textDecoration: "none" }}
          >
            ← All posts
          </Link>
        </div>

      </div>
    </div>
  );
}
