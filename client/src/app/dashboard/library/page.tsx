"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FiBookOpen, FiTrash2, FiBookmark, FiTag, FiSearch } from "react-icons/fi";
import api from "@/lib/api";
import toast from "react-hot-toast";

interface Paper {
  _id: string;
  title: string;
  authors: string[];
  abstract: string;
  year?: number;
  domain?: string;
  folder: string;
  tags: string[];
  bookmarked: boolean;
  notes?: string;
  createdAt: string;
}

export default function LibraryPage() {
  const [papers, setPapers] = useState<Paper[]>([]);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const params: Record<string, string> = {};
    if (filter === "bookmarked") params.bookmarked = "true";
    api.get("/library", { params }).then(({ data }) => setPapers(data.papers || [])).catch(() => {}).finally(() => setLoading(false));
  }, [filter]);

  const deletePaper = async (id: string) => {
    try {
      await api.delete(`/library/${id}`);
      setPapers((prev) => prev.filter((p) => p._id !== id));
      toast.success("Paper removed");
    } catch { toast.error("Delete failed"); }
  };

  const filtered = papers.filter((p) =>
    !search || p.title.toLowerCase().includes(search.toLowerCase()) || p.authors?.some((a) => a.toLowerCase().includes(search.toLowerCase()))
  );

  const folders = ["all", "bookmarked", ...Array.from(new Set(papers.map((p) => p.folder).filter(Boolean)))];

  return (
    <div style={{ maxWidth: 1000, margin: "0 auto" }}>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} style={{ marginBottom: 28 }}>
        <h2 style={{ fontFamily: "Poppins, sans-serif", fontSize: 24, fontWeight: 700, color: "#fff", marginBottom: 6 }}>Reference Library</h2>
        <p style={{ color: "rgba(255,255,255,0.5)", fontSize: 14 }}>Saved papers · Folders · Tags · Notes</p>
      </motion.div>

      {/* Search + Filters */}
      <div style={{ display: "flex", gap: 12, marginBottom: 20, flexWrap: "wrap" }}>
        <div style={{ flex: 1, minWidth: 200, position: "relative" }}>
          <FiSearch style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "rgba(255,255,255,0.4)" }} size={16} />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search library..."
            style={{ width: "100%", padding: "10px 10px 10px 38px", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 10, color: "#fff", fontSize: 14, outline: "none", boxSizing: "border-box" }} />
        </div>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {folders.map((f) => (
            <button key={f} onClick={() => setFilter(f)}
              style={{ padding: "8px 16px", background: filter === f ? "rgba(79,70,229,0.25)" : "rgba(255,255,255,0.04)", border: `1px solid ${filter === f ? "rgba(79,70,229,0.4)" : "rgba(255,255,255,0.08)"}`, borderRadius: 10, color: filter === f ? "#a5b4fc" : "rgba(255,255,255,0.5)", fontSize: 13, cursor: "pointer", textTransform: "capitalize" }}>
              {f === "all" ? `All (${papers.length})` : f === "bookmarked" ? `⭐ Bookmarked` : f}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div style={{ textAlign: "center", padding: "60px 0", color: "rgba(255,255,255,0.4)" }}>Loading library...</div>
      ) : filtered.length === 0 ? (
        <div style={{ textAlign: "center", padding: "60px 0", color: "rgba(255,255,255,0.3)" }}>
          <FiBookOpen size={40} style={{ display: "block", margin: "0 auto 16px", opacity: 0.4 }} />
          <p>No papers saved yet. Use AI Research to find and save papers!</p>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {filtered.map((paper, i) => (
            <motion.div key={paper._id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
              style={{ padding: 20, background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 14 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12 }}>
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                    {paper.bookmarked && <FiBookmark size={14} color="#F59E0B" style={{ fill: "#F59E0B" }} />}
                    <h3 style={{ fontSize: 15, fontWeight: 600, color: "#fff", lineHeight: 1.4 }}>{paper.title}</h3>
                  </div>
                  <p style={{ fontSize: 12, color: "rgba(255,255,255,0.45)", marginBottom: 8 }}>
                    {paper.authors?.slice(0, 3).join(", ")}{paper.authors?.length > 3 ? " et al." : ""} {paper.year ? `· ${paper.year}` : ""}
                  </p>
                  {paper.abstract && (
                    <p style={{ fontSize: 13, color: "rgba(255,255,255,0.6)", lineHeight: 1.6, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                      {paper.abstract}
                    </p>
                  )}
                  <div style={{ display: "flex", gap: 8, marginTop: 10, flexWrap: "wrap" }}>
                    {paper.domain && (
                      <span style={{ padding: "3px 8px", background: "rgba(79,70,229,0.15)", border: "1px solid rgba(79,70,229,0.25)", borderRadius: 6, fontSize: 11, color: "#a5b4fc" }}>{paper.domain}</span>
                    )}
                    {paper.tags?.map((t) => (
                      <span key={t} style={{ display: "flex", alignItems: "center", gap: 4, padding: "3px 8px", background: "rgba(0,212,255,0.1)", border: "1px solid rgba(0,212,255,0.2)", borderRadius: 6, fontSize: 11, color: "#67e8f9" }}>
                        <FiTag size={9} /> {t}
                      </span>
                    ))}
                    <span style={{ padding: "3px 8px", background: "rgba(255,255,255,0.05)", borderRadius: 6, fontSize: 11, color: "rgba(255,255,255,0.4)" }}>{paper.folder}</span>
                  </div>
                </div>
                <button onClick={() => deletePaper(paper._id)}
                  style={{ background: "none", border: "1px solid rgba(239,68,68,0.2)", borderRadius: 8, cursor: "pointer", color: "rgba(239,68,68,0.5)", padding: "8px", transition: "all 0.2s", flexShrink: 0 }}>
                  <FiTrash2 size={14} />
                </button>
              </div>
              {paper.notes && (
                <div style={{ marginTop: 12, padding: "10px 12px", background: "rgba(255,255,255,0.03)", borderRadius: 8, borderLeft: "3px solid rgba(79,70,229,0.4)" }}>
                  <p style={{ fontSize: 12, color: "rgba(255,255,255,0.6)", fontStyle: "italic" }}>{paper.notes}</p>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
