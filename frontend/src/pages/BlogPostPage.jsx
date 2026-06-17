import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Helmet } from "react-helmet-async";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Calendar, Tag, ArrowLeft, ExternalLink } from "lucide-react";
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
      <div className="min-h-screen bg-[#0A0A0A] pt-24 pb-20">
        <div className="max-w-3xl mx-auto px-6 animate-pulse">
          <div className="h-3 w-16 bg-[#2A2A2A] rounded mb-8" />
          <div className="h-8 w-3/4 bg-[#2A2A2A] rounded mb-4" />
          <div className="h-8 w-1/2 bg-[#2A2A2A] rounded mb-8" />
          <div className="space-y-3">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-4 bg-[#2A2A2A] rounded" style={{ width: `${85 + (i % 3) * 5}%` }} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (notFound || !post) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] pt-24 pb-20 flex items-center justify-center">
        <div className="text-center">
          <p className="text-[#555] text-base font-medium mb-4">Post not found.</p>
          <Link to="/blog" className="text-[#C8A96E] text-sm font-mono hover:underline">
            ← Back to Blog
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>{post.title} — Nalanda Data Blog</title>
        <meta name="description" content={post.excerpt} />
      </Helmet>

      <div className="min-h-screen bg-[#0A0A0A] pt-24 pb-20">
        <div className="max-w-3xl mx-auto px-6 lg:px-10">
          {/* Back link */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="mb-10"
          >
            <Link
              to="/blog"
              className="inline-flex items-center gap-1.5 text-[#666] hover:text-[#C8A96E] text-sm font-mono font-medium transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Blog
            </Link>
          </motion.div>

          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-10"
          >
            <p className="text-[#C8A96E] font-mono text-[11px] tracking-widest uppercase mb-4">
              {post.category}
            </p>
            <h1
              className="font-bold leading-tight tracking-tight mb-4"
              style={{ fontSize: "clamp(28px, 3.5vw, 44px)", color: "#F0EBE0" }}
            >
              {post.title}
            </h1>
            <p className="text-[#888] text-base font-medium mb-6">{post.excerpt}</p>

            <div className="flex flex-wrap items-center gap-4 text-[#555] text-[13px] font-mono pb-6 border-b border-[#1E1E1E]">
              <div className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5" />
                <span>{formatDate(post.published_at)}</span>
              </div>
              <span>{post.author}</span>
              {post.tags && post.tags.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                  {post.tags.map((tag) => (
                    <span
                      key={tag}
                      className="flex items-center gap-1 px-2 py-0.5 bg-[#1A1A1A] border border-[#2A2A2A] text-[#777] font-mono font-semibold text-[11px] tracking-wider rounded"
                    >
                      <Tag className="w-2.5 h-2.5" />
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </motion.div>

          {/* HF reference card */}
          {post.hf_model_ref && (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
              className="mb-8 border border-[#C8A96E]/20 rounded p-4 bg-[#C8A96E]/5 flex items-center justify-between gap-4"
            >
              <div>
                <p className="text-[#C8A96E] font-mono text-[11px] tracking-widest uppercase mb-1">
                  HUGGING FACE
                </p>
                <p className="text-[#F0EBE0] text-sm font-medium">{post.hf_model_ref}</p>
              </div>
              <a
                href={
                  post.hf_model_ref.startsWith("http")
                    ? post.hf_model_ref
                    : `https://huggingface.co/${post.hf_model_ref}`
                }
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-[#C8A96E] text-sm font-mono font-semibold hover:underline shrink-0"
              >
                View on HF
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </motion.div>
          )}

          {/* Markdown content */}
          <motion.article
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="prose-blog"
          >
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{post.content}</ReactMarkdown>
          </motion.article>

          {/* Footer nav */}
          <div className="mt-16 pt-8 border-t border-[#1E1E1E]">
            <Link
              to="/blog"
              className="inline-flex items-center gap-1.5 text-[#C8A96E] text-sm font-mono font-semibold hover:underline"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              All posts
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
