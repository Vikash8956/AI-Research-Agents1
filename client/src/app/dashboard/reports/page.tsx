"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiFileText, FiPlus, FiLoader, FiChevronDown, FiChevronUp } from "react-icons/fi";
import api from "@/lib/api";
import toast from "react-hot-toast";

interface Report {
  _id: string;
  topic: string;
  abstract: string;
  introduction: string;
  literatureReview: string;
  methodology: string;
  results: string;
  discussion: string;
  conclusion: string;
  references: string[];
  status: string;
  createdAt: string;
}

const sectionLabels: Record<string, string> = {
  abstract: "Abstract", introduction: "Introduction", literatureReview: "Literature Review",
  methodology: "Methodology", results: "Results", discussion: "Discussion", conclusion: "Conclusion",
};

export default function ReportsPage() {
  const [reports, setReports] = useState<Report[]>([]);
  const [topic, setTopic] = useState("");
  const [context, setContext] = useState("");
  const [generating, setGenerating] = useState(false);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [showNew, setShowNew] = useState(false);

  useEffect(() => {
    api.get("/reports").then(({ data }) => setReports(data.reports || [])).catch(() => {});
  }, []);

  const generate = async () => {
    if (!topic.trim()) { toast.error("Enter a research topic"); return; }
    setGenerating(true);
    try {
      const { data } = await api.post("/report", { topic, context });
      setReports((prev) => [data.report, ...prev]);
      toast.success("Report generated!");
      setShowNew(false);
      setTopic("");
      setContext("");
    } catch { toast.error("Report generation failed"); }
    finally { setGenerating(false); }
  };

  const copyToClipboard = (report: Report) => {
    const text = Object.entries(sectionLabels).map(([k, l]) => `## ${l}\n\n${report[k as keyof Report] || ""}`).join("\n\n");
    navigator.clipboard.writeText(text);
    toast.success("Report copied as Markdown!");
  };

  return (
    <div style={{ maxWidth: 900, margin: "0 auto" }}>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 28 }}>
        <div>
          <h2 style={{ fontFamily: "Poppins, sans-serif", fontSize: 24, fontWeight: 700, color: "#fff", marginBottom: 6 }}>Report Generator</h2>
          <p style={{ color: "rgba(255,255,255,0.5)", fontSize: 14 }}>AI-drafted full academic reports from Abstract to References</p>
        </div>
        <button onClick={() => setShowNew(!showNew)}
          style={{ padding: "10px 20px", background: "linear-gradient(135deg,#4F46E5,#7C3AED)", color: "#fff", border: "none", borderRadius: 12, fontSize: 14, fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", gap: 8 }}>
          <FiPlus size={16} /> New Report
        </button>
      </motion.div>

      {/* New Report Form */}
      <AnimatePresence>
        {showNew && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }}
            style={{ overflow: "hidden", marginBottom: 24 }}>
            <div style={{ padding: 24, background: "rgba(79,70,229,0.08)", border: "1px solid rgba(79,70,229,0.2)", borderRadius: 16 }}>
              <h3 style={{ fontFamily: "Poppins, sans-serif", fontSize: 16, fontWeight: 600, color: "#fff", marginBottom: 16 }}>Generate New Report</h3>
              <div style={{ marginBottom: 14 }}>
                <label style={{ fontSize: 13, color: "rgba(255,255,255,0.6)", display: "block", marginBottom: 8 }}>Research Topic *</label>
                <input value={topic} onChange={(e) => setTopic(e.target.value)} placeholder="e.g. Deep Learning in Medical Image Segmentation"
                  style={{ width: "100%", padding: "12px", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 10, color: "#fff", fontSize: 14, outline: "none", boxSizing: "border-box" }} />
              </div>
              <div style={{ marginBottom: 16 }}>
                <label style={{ fontSize: 13, color: "rgba(255,255,255,0.6)", display: "block", marginBottom: 8 }}>Additional Context (optional)</label>
                <textarea value={context} onChange={(e) => setContext(e.target.value)} rows={3} placeholder="Add any relevant context, specific focus areas, or requirements..."
                  style={{ width: "100%", padding: "12px", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 10, color: "#fff", fontSize: 14, outline: "none", resize: "vertical", boxSizing: "border-box" }} />
              </div>
              <button onClick={generate} disabled={generating}
                style={{ padding: "11px 24px", background: generating ? "rgba(79,70,229,0.5)" : "linear-gradient(135deg,#4F46E5,#7C3AED)", color: "#fff", border: "none", borderRadius: 10, fontSize: 14, fontWeight: 600, cursor: generating ? "not-allowed" : "pointer", display: "flex", alignItems: "center", gap: 8 }}>
                {generating ? <><FiLoader size={14} style={{ animation: "spin 1s linear infinite" }} /> Generating (this may take ~30s)...</> : "Generate Full Report"}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Reports List */}
      {reports.length === 0 && !generating ? (
        <div style={{ textAlign: "center", padding: "60px 0", color: "rgba(255,255,255,0.3)" }}>
          <FiFileText size={40} style={{ display: "block", margin: "0 auto 16px", opacity: 0.4 }} />
          <p>No reports yet. Generate your first AI report!</p>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {reports.map((report, i) => (
            <motion.div key={report._id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
              style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 16, overflow: "hidden" }}>
              <div style={{ padding: "20px 24px", display: "flex", justifyContent: "space-between", alignItems: "center", cursor: "pointer" }}
                onClick={() => setExpanded(expanded === report._id ? null : report._id)}>
                <div>
                  <h3 style={{ fontSize: 16, fontWeight: 600, color: "#fff", marginBottom: 4 }}>{report.topic}</h3>
                  <p style={{ fontSize: 12, color: "rgba(255,255,255,0.4)" }}>{new Date(report.createdAt).toLocaleDateString()} · {Object.keys(sectionLabels).length} sections</p>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <button onClick={(e) => { e.stopPropagation(); copyToClipboard(report); }}
                    style={{ padding: "6px 14px", background: "rgba(0,245,160,0.1)", border: "1px solid rgba(0,245,160,0.2)", borderRadius: 8, color: "#6ee7b7", fontSize: 12, cursor: "pointer" }}>
                    Copy MD
                  </button>
                  {expanded === report._id ? <FiChevronUp size={18} color="rgba(255,255,255,0.5)" /> : <FiChevronDown size={18} color="rgba(255,255,255,0.5)" />}
                </div>
              </div>
              <AnimatePresence>
                {expanded === report._id && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                    style={{ overflow: "hidden" }}>
                    <div style={{ padding: "0 24px 24px", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
                      {Object.entries(sectionLabels).map(([k, l]) => (
                        <div key={k} style={{ marginTop: 20 }}>
                          <h4 style={{ fontSize: 13, fontWeight: 700, color: "#4F46E5", textTransform: "uppercase", letterSpacing: 1, marginBottom: 8 }}>{l}</h4>
                          <p style={{ fontSize: 14, color: "rgba(255,255,255,0.75)", lineHeight: 1.8 }}>{report[k as keyof Report] as string || "—"}</p>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      )}
      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
