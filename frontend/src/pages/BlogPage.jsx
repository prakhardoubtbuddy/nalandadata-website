import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
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
    <div className="bg-[#0A0A0A]" style={{ paddingTop: "96px" }}>

      {/* Hero */}
      <section className="s-band" style={{ borderTop: "none", paddingBottom: "40px" }}>
        <div className="s-wrap">
          <p className="s-eyebrow">Blog</p>
          <h1 style={{ fontSize: "clamp(32px,4vw,52px)", fontWeight: 800, letterSpacing: "-0.03em", lineHeight: 1.08, margin: "12px 0 16px", color: "var(--paper)" }}>
            Research &amp; results.
          </h1>
          <p style={{ color: "var(--muted)", fontSize: "15px", lineHeight: 1.6, maxWidth: "52ch", margin: "0 0 32px" }}>
            Model fine-tuning experiments, benchmark results, and insights from building academic AI datasets.
          </p>
          <input
            type="text"
            placeholder="Search posts…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              maxWidth: "400px",
              width: "100%",
              padding: "9px 14px",
              background: "var(--ink)",
              border: "1px solid var(--line)",
              borderRadius: "6px",
              color: "var(--paper)",
              fontSize: "14px",
              outline: "none",
              fontFamily: "var(--sans)",
              boxSizing: "border-box",
            }}
          />
        </div>
      </section>

      {/* Posts grid */}
      <section className="s-band alt">
        <div className="s-wrap">
          {loading ? (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(300px,1fr))", gap: "20px" }}>
              {[1, 2, 3].map((i) => (
                <div key={i} style={{ background: "var(--ink)", border: "1px solid var(--line)", borderRadius: "10px", padding: "24px", opacity: 0.5 }}>
                  <div style={{ height: "10px", width: "80px", background: "var(--line)", borderRadius: "4px", marginBottom: "16px" }} />
                  <div style={{ height: "15px", width: "100%", background: "var(--line)", borderRadius: "4px", marginBottom: "8px" }} />
                  <div style={{ height: "15px", width: "75%", background: "var(--line)", borderRadius: "4px", marginBottom: "16px" }} />
                  <div style={{ height: "10px", width: "100%", background: "var(--line)", borderRadius: "4px", marginBottom: "6px" }} />
                  <div style={{ height: "10px", width: "65%", background: "var(--line)", borderRadius: "4px" }} />
                </div>
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div style={{ textAlign: "center", padding: "80px 0" }}>
              <p style={{ color: "var(--muted)", fontSize: "15px", marginBottom: "12px" }}>
                {search ? "No posts match your search." : "No posts published yet."}
              </p>
              {search && (
                <button
                  onClick={() => setSearch("")}
                  style={{ color: "var(--accent)", fontSize: "13px", fontFamily: "var(--mono)", background: "none", border: "none", cursor: "pointer" }}
                >
                  Clear search
                </button>
              )}
            </div>
          ) : (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(300px,1fr))", gap: "20px" }}>
              {filtered.map((post) => (
                <Link
                  key={post.id}
                  to={`/blog/${post.slug}`}
                  className="s-blog-card"
                  style={{ display: "flex", flexDirection: "column", background: "var(--ink)", border: "1px solid var(--line)", borderRadius: "10px", padding: "24px", textDecoration: "none" }}
                  onMouseEnter={(e) => (e.currentTarget.style.borderColor = "rgba(200,169,110,0.4)")}
                  onMouseLeave={(e) => (e.currentTarget.style.borderColor = "var(--line)")}
                >
                  <p style={{ color: "var(--accent)", fontFamily: "var(--mono)", fontSize: "11px", letterSpacing: "0.1em", textTransform: "uppercase", margin: "0 0 12px" }}>
                    {post.category}
                  </p>
                  <h2 style={{ color: "var(--paper)", fontWeight: 700, fontSize: "15px", lineHeight: 1.45, margin: "0 0 10px" }}>
                    {post.title}
                  </h2>
                  <p style={{ color: "var(--muted)", fontSize: "13.5px", lineHeight: 1.65, margin: "0 0 16px", display: "-webkit-box", WebkitLineClamp: 3, WebkitBoxOrient: "vertical", overflow: "hidden", flexGrow: 1 }}>
                    {post.excerpt}
                  </p>
                  {post.tags && post.tags.length > 0 && (
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", marginBottom: "16px" }}>
                      {post.tags.slice(0, 3).map((tag) => (
                        <span key={tag} style={{ padding: "2px 8px", background: "var(--ink-2)", border: "1px solid var(--line)", borderRadius: "4px", color: "var(--muted)", fontFamily: "var(--mono)", fontSize: "11px", letterSpacing: "0.04em" }}>
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", paddingTop: "14px", borderTop: "1px solid var(--line)", fontSize: "12px", fontFamily: "var(--mono)", color: "var(--muted)" }}>
                    <span>{formatDate(post.published_at)}</span>
                    <span style={{ color: "var(--accent)", fontWeight: 600 }}>Read →</span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

    </div>
  );
}
