"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiSearch, FiFilter, FiZap, FiFileText, FiBookmark, FiExternalLink, FiX, FiLoader } from "react-icons/fi";
import api from "@/lib/api";
import toast from "react-hot-toast";

interface Paper {
  id: string;
  title: string;
  authors: string[];
  abstract: string;
  year: number;
  url: string;
  categories: string[];
}

interface Summary {
  summary: string;
  keyInsights: string[];
  researchGaps: string[];
  methodology: string;
}

export default function ResearchPage() {
  const [query, setQuery] = useState("");
  const [author, setAuthor] = useState("");
  const [results, setResults] = useState<Paper[]>([]);
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState<Paper | null>(null);
  const [summary, setSummary] = useState<Summary | null>(null);
  const [summarizing, setSummarizing] = useState(false);
  const [hypothesis, setHypothesis] = useState("");
  const [gettingHyp, setGettingHyp] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  const search = async () => {
    if (!query.trim()) { toast.error("Enter a search query"); return; }
    setLoading(true);
    try {
      const { data } = await api.post("/research", { query, author });
      setResults(data.results || []);
      if (!data.results?.length) toast("No papers found. Try different keywords.", { icon: "🔍" });
    } catch {
      toast.error("Search failed. Check your connection.");
    } finally { setLoading(false); }
  };

  const summarize = async (paper: Paper) => {
    setSelected(paper);
    setSummary(null);
    setSummarizing(true);
    try {
      const { data } = await api.post("/summarize", { text: paper.abstract, title: paper.title });
      setSummary(data);
    } catch { toast.error("Summary failed"); }
    finally { setSummarizing(false); }
  };

  const getHypothesis = async (paper: Paper) => {
    setSelected(paper);
    setHypothesis("");
    setGettingHyp(true);
    try {
      const { data } = await api.post("/hypothesis", { topic: paper.title, context: paper.abstract?.substring(0, 500) });
      setHypothesis(data.hypothesis);
    } catch { toast.error("Hypothesis generation failed"); }
    finally { setGettingHyp(false); }
  };

  const savePaper = async (paper: Paper) => {
    try {
      await api.post("/save", { title: paper.title, authors: paper.authors, abstract: paper.abstract, year: paper.year, url: paper.url, domain: paper.categories?.[0] });
      toast.success("Paper saved to library!");
    } catch { toast.error("Could not save paper"); }
  };

  return (
    <div style={{ maxWidth: 1100, margin: "0 auto" }}>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} style={{ marginBottom: 28 }}>
        <h2 style={{ fontFamily: "Poppins, sans-serif", fontSize: 24, fontWeight: 700, color: "#fff", marginBottom: 6 }}>AI Research</h2>
        <p style={{ color: "rgba(255,255,255,0.5)", fontSize: 14 }}>Search millions of papers · AI summarize · Generate hypotheses</p>
      </motion.div>

      {/* Search bar */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
        style={{ marginBottom: 20 }}>
        <div style={{ display: "flex", gap: 12, marginBottom: 12 }}>
          <div style={{ flex: 1, position: "relative" }}>
            <FiSearch style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: "rgba(255,255,255,0.4)" }} size={18} />
            <input value={query} onChange={(e) => setQuery(e.target.value)} onKeyDown={(e) => e.key === "Enter" && search()}
              placeholder="Search: transformer architectures, CRISPR, climate change..."
              style={{ width: "100%", padding: "14px 14px 14px 46px", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 14, color: "#fff", fontSize: 15, outline: "none", boxSizing: "border-box" }} />
          </div>
          <button onClick={() => setShowFilters(!showFilters)} style={{ padding: "14px 16px", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 14, color: "rgba(255,255,255,0.7)", cursor: "pointer", display: "flex", alignItems: "center", gap: 8, fontSize: 14 }}>
            <FiFilter size={16} /> Filters
          </button>
          <button onClick={search} disabled={loading}
            style={{ padding: "14px 28px", background: loading ? "rgba(79,70,229,0.5)" : "linear-gradient(135deg,#4F46E5,#7C3AED)", color: "#fff", border: "none", borderRadius: 14, fontSize: 15, fontWeight: 600, cursor: loading ? "not-allowed" : "pointer", display: "flex", alignItems: "center", gap: 8 }}>
            {loading ? <><FiLoader size={16} style={{ animation: "spin 1s linear infinite" }} /> Searching...</> : <><FiSearch size={16} /> Search</>}
          </button>
        </div>

        <AnimatePresence>
          {showFilters && (
            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }}
              style={{ overflow: "hidden", padding: "16px", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 14, marginBottom: 12 }}>
              <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                <div>
                  <label style={{ fontSize: 12, color: "rgba(255,255,255,0.5)", display: "block", marginBottom: 6 }}>Author</label>
                  <input value={author} onChange={(e) => setAuthor(e.target.value)} placeholder="e.g. LeCun"
                    style={{ padding: "8px 12px", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, color: "#fff", fontSize: 13, outline: "none" }} />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Results */}
      <div style={{ display: "grid", gridTemplateColumns: selected ? "1fr 400px" : "1fr", gap: 20 }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {results.length === 0 && !loading && (
            <div style={{ textAlign: "center", padding: "60px 0", color: "rgba(255,255,255,0.3)" }}>
              <FiSearch size={40} style={{ display: "block", margin: "0 auto 16px", opacity: 0.4 }} />
              <p style={{ fontSize: 16 }}>Search for research papers above</p>
              <p style={{ fontSize: 13, marginTop: 8 }}>Powered by arXiv database · 2M+ papers</p>
            </div>
          )}
          {results.map((paper, i) => (
            <motion.div key={paper.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
              style={{ padding: 20, background: selected?.id === paper.id ? "rgba(79,70,229,0.08)" : "rgba(255,255,255,0.03)", border: `1px solid ${selected?.id === paper.id ? "rgba(79,70,229,0.3)" : "rgba(255,255,255,0.07)"}`, borderRadius: 16, cursor: "pointer" }}
              onClick={() => setSelected(paper === selected ? null : paper)}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12 }}>
                <div style={{ flex: 1 }}>
                  <h3 style={{ fontSize: 15, fontWeight: 600, color: "#fff", marginBottom: 6, lineHeight: 1.4 }}>{paper.title}</h3>
                  <p style={{ fontSize: 12, color: "rgba(255,255,255,0.45)", marginBottom: 8 }}>
                    {paper.authors?.slice(0, 3).join(", ")}{paper.authors?.length > 3 ? " et al." : ""} · {paper.year || "N/A"}
                  </p>
                  <p style={{ fontSize: 13, color: "rgba(255,255,255,0.6)", lineHeight: 1.6, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                    {paper.abstract}
                  </p>
                  <div style={{ display: "flex", gap: 6, marginTop: 10, flexWrap: "wrap" }}>
                    {paper.categories?.slice(0, 2).map((c) => (
                      <span key={c} style={{ padding: "3px 8px", background: "rgba(79,70,229,0.15)", border: "1px solid rgba(79,70,229,0.25)", borderRadius: 6, fontSize: 11, color: "#a5b4fc" }}>{c}</span>
                    ))}
                  </div>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 6, flexShrink: 0 }}>
                  <button onClick={(e) => { e.stopPropagation(); summarize(paper); }}
                    style={{ padding: "7px 14px", background: "rgba(79,70,229,0.2)", border: "1px solid rgba(79,70,229,0.3)", borderRadius: 8, color: "#a5b4fc", fontSize: 12, cursor: "pointer", display: "flex", alignItems: "center", gap: 6, whiteSpace: "nowrap" }}>
                    <FiZap size={12} /> Summarize
                  </button>
                  <button onClick={(e) => { e.stopPropagation(); getHypothesis(paper); }}
                    style={{ padding: "7px 14px", background: "rgba(0,212,255,0.1)", border: "1px solid rgba(0,212,255,0.2)", borderRadius: 8, color: "#67e8f9", fontSize: 12, cursor: "pointer", display: "flex", alignItems: "center", gap: 6 }}>
                    <FiFileText size={12} /> Hypothesis
                  </button>
                  <button onClick={(e) => { e.stopPropagation(); savePaper(paper); }}
                    style={{ padding: "7px 14px", background: "rgba(0,245,160,0.1)", border: "1px solid rgba(0,245,160,0.2)", borderRadius: 8, color: "#6ee7b7", fontSize: 12, cursor: "pointer", display: "flex", alignItems: "center", gap: 6 }}>
                    <FiBookmark size={12} /> Save
                  </button>
                  <a href={paper.url} target="_blank" rel="noreferrer"
                    style={{ padding: "7px 14px", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, color: "rgba(255,255,255,0.6)", fontSize: 12, textDecoration: "none", display: "flex", alignItems: "center", gap: 6 }}
                    onClick={(e) => e.stopPropagation()}>
                    <FiExternalLink size={12} /> arXiv
                  </a>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* AI Panel */}
        <AnimatePresence>
          {selected && (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}
              style={{ padding: 24, background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 16, height: "fit-content", position: "sticky", top: 88 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 }}>
                <h3 style={{ fontFamily: "Poppins, sans-serif", fontSize: 15, fontWeight: 700, color: "#fff" }}>AI Analysis</h3>
                <button onClick={() => { setSelected(null); setSummary(null); setHypothesis(""); }} style={{ background: "none", border: "none", cursor: "pointer", color: "rgba(255,255,255,0.5)", padding: 4 }}><FiX size={16} /></button>
              </div>
              <h4 style={{ fontSize: 13, fontWeight: 600, color: "rgba(255,255,255,0.8)", marginBottom: 16, lineHeight: 1.4 }}>{selected.title}</h4>

              {summarizing && (
                <div style={{ textAlign: "center", padding: "32px 0", color: "rgba(255,255,255,0.4)", fontSize: 13 }}>
                  <div style={{ animation: "spin 1s linear infinite", display: "inline-block", marginBottom: 8 }}>⚙</div>
                  <p>IBM Granite analyzing paper...</p>
                </div>
              )}

              {summary && !summarizing && (
                <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                  <div>
                    <div style={{ fontSize: 12, fontWeight: 600, color: "#4F46E5", textTransform: "uppercase", letterSpacing: 1, marginBottom: 8 }}>Summary</div>
                    <p style={{ fontSize: 13, color: "rgba(255,255,255,0.75)", lineHeight: 1.7 }}>{summary.summary}</p>
                  </div>
                  {summary.keyInsights?.length > 0 && (
                    <div>
                      <div style={{ fontSize: 12, fontWeight: 600, color: "#00D4FF", textTransform: "uppercase", letterSpacing: 1, marginBottom: 8 }}>Key Insights</div>
                      {summary.keyInsights.map((ins, i) => (
                        <div key={i} style={{ fontSize: 13, color: "rgba(255,255,255,0.7)", lineHeight: 1.6, marginBottom: 4, paddingLeft: 12, borderLeft: "2px solid rgba(0,212,255,0.4)" }}>{ins}</div>
                      ))}
                    </div>
                  )}
                  {summary.researchGaps?.length > 0 && (
                    <div>
                      <div style={{ fontSize: 12, fontWeight: 600, color: "#00F5A0", textTransform: "uppercase", letterSpacing: 1, marginBottom: 8 }}>Research Gaps</div>
                      {summary.researchGaps.map((gap, i) => (
                        <div key={i} style={{ fontSize: 13, color: "rgba(255,255,255,0.7)", lineHeight: 1.6, marginBottom: 4, paddingLeft: 12, borderLeft: "2px solid rgba(0,245,160,0.4)" }}>{gap}</div>
                      ))}
                    </div>
                  )}
                  {summary.methodology && (
                    <div>
                      <div style={{ fontSize: 12, fontWeight: 600, color: "#F59E0B", textTransform: "uppercase", letterSpacing: 1, marginBottom: 8 }}>Methodology</div>
                      <p style={{ fontSize: 13, color: "rgba(255,255,255,0.7)", lineHeight: 1.7 }}>{summary.methodology}</p>
                    </div>
                  )}
                </div>
              )}

              {gettingHyp && (
                <div style={{ textAlign: "center", padding: "32px 0", color: "rgba(255,255,255,0.4)", fontSize: 13 }}>
                  <p>Generating hypotheses...</p>
                </div>
              )}
              {hypothesis && !gettingHyp && (
                <div>
                  <div style={{ fontSize: 12, fontWeight: 600, color: "#8B5CF6", textTransform: "uppercase", letterSpacing: 1, marginBottom: 8 }}>Generated Hypotheses</div>
                  <p style={{ fontSize: 13, color: "rgba(255,255,255,0.75)", lineHeight: 1.8, whiteSpace: "pre-line" }}>{hypothesis}</p>
                </div>
              )}

              {!summary && !hypothesis && !summarizing && !gettingHyp && (
                <p style={{ fontSize: 13, color: "rgba(255,255,255,0.4)", textAlign: "center", padding: "24px 0" }}>Click Summarize or Hypothesis to get AI analysis</p>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
