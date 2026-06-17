import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Helmet } from "react-helmet-async";
import { Search, Calendar, Tag } from "lucide-react";
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

export default function BlogPage() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    axios
      .get(`${API}/blog`)
      .then((r) => setPosts(r.data))
      .catch(() => setPosts([]))
      .finally(() => setLoading(false));
  }, []);

  const filtered = posts.filter((p) => {
    const q = search.toLowerCase();
    return (
      !q ||
      p.title.toLowerCase().includes(q) ||
      p.excerpt.toLowerCase().includes(q) ||
      (p.tags || []).some((t) => t.toLowerCase().includes(q))
    );
  });

  return (
    <>
      <Helmet>
        <title>Blog — Nalanda Data</title>
        <meta
          name="description"
          content="Research insights, model results, and dataset updates from the Nalanda Data team."
        />
      </Helmet>

      <div className="min-h-screen bg-[#0A0A0A] pt-24 pb-20">
        {/* Header */}
        <div className="max-w-7xl mx-auto px-6 lg:px-10 mb-14">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <p className="text-[#666] font-mono font-semibold text-[12px] tracking-widest uppercase mb-4">
              BLOG
            </p>
            <h1
              className="font-bold leading-tight tracking-tight mb-4"
              style={{ fontSize: "clamp(32px, 4vw, 52px)", color: "#F0EBE0" }}
            >
              Research &amp; results.
            </h1>
            <p className="text-[#888] text-base font-medium max-w-xl">
              Model fine-tuning experiments, benchmark results, and insights from building
              academic AI datasets.
            </p>
          </motion.div>
        </div>

        {/* Search */}
        <div className="max-w-7xl mx-auto px-6 lg:px-10 mb-10">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#555]" />
            <input
              type="text"
              placeholder="Search posts…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-[#111] border border-[#2A2A2A] rounded text-[#F0EBE0] placeholder:text-[#555] text-sm font-medium focus:outline-none focus:border-[#C8A96E]/50 transition-colors"
            />
          </div>
        </div>

        {/* Posts grid */}
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="border border-[#1E1E1E] rounded p-6 bg-[#111] animate-pulse"
                >
                  <div className="h-3 w-20 bg-[#2A2A2A] rounded mb-4" />
                  <div className="h-5 w-full bg-[#2A2A2A] rounded mb-2" />
                  <div className="h-5 w-3/4 bg-[#2A2A2A] rounded mb-4" />
                  <div className="h-3 w-full bg-[#2A2A2A] rounded mb-2" />
                  <div className="h-3 w-2/3 bg-[#2A2A2A] rounded" />
                </div>
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-24">
              <p className="text-[#555] text-base font-medium mb-2">
                {search ? "No posts match your search." : "No posts published yet."}
              </p>
              {search && (
                <button
                  onClick={() => setSearch("")}
                  className="text-[#C8A96E] text-sm font-mono hover:underline"
                >
                  Clear search
                </button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map((post, i) => (
                <motion.div
                  key={post.id}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: i * 0.06 }}
                >
                  <Link
                    to={`/blog/${post.slug}`}
                    className="group block border border-[#1E1E1E] rounded p-6 bg-[#111] hover:border-[#C8A96E]/30 transition-colors h-full"
                  >
                    <div className="flex items-center gap-2 mb-4">
                      <span className="text-[#C8A96E] font-mono text-[11px] tracking-widest uppercase">
                        {post.category}
                      </span>
                    </div>

                    <h2 className="text-[#F0EBE0] font-bold text-base leading-snug mb-3 group-hover:text-[#C8A96E] transition-colors">
                      {post.title}
                    </h2>

                    <p className="text-[#888] text-[14px] font-medium leading-relaxed mb-5 line-clamp-3">
                      {post.excerpt}
                    </p>

                    {post.tags && post.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mb-4">
                        {post.tags.slice(0, 3).map((tag) => (
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

                    <div className="flex items-center gap-1.5 text-[#555] text-[12px] font-mono mt-auto pt-3 border-t border-[#1E1E1E]">
                      <Calendar className="w-3 h-3" />
                      <span>{formatDate(post.published_at)}</span>
                      <span className="ml-auto text-[#C8A96E] text-[12px] font-semibold">
                        Read →
                      </span>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
