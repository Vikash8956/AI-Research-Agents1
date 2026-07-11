"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FiBookmark, FiPlus, FiCopy, FiCheck } from "react-icons/fi";
import api from "@/lib/api";
import toast from "react-hot-toast";

interface Citation {
  _id: string;
  title: string;
  authors: string[];
  year?: number;
  journal?: string;
  apa: string;
  mla: string;
  ieee: string;
  chicago: string;
  bibtex: string;
  ris: string;
  createdAt: string;
}

const formats = ["apa", "mla", "ieee", "chicago", "bibtex", "ris"] as const;
type Format = typeof formats[number];

export default function CitationsPage() {
  const [citations, setCitations] = useState<Citation[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [activeFormat, setActiveFormat] = useState<Format>("apa");
  const [copied, setCopied] = useState<string | null>(null);
  const [form, setForm] = useState({ title: "", authors: "", year: "", journal: "", doi: "", url: "", pages: "" });

  useEffect(() => {
    api.get("/citations").then(({ data }) => setCitations(data.citations || [])).catch(() => {});
  }, []);

  const create = async () => {
    if (!form.title) { toast.error("Title is required"); return; }
    try {
      const { data } = await api.post("/citation", { ...form, authors: form.authors.split(",").map((a) => a.trim()).filter(Boolean), year: form.year ? parseInt(form.year) : undefined });
      setCitations((prev) => [data.citation, ...prev]);
      setShowForm(false);
      setForm({ title: "", authors: "", year: "", journal: "", doi: "", url: "", pages: "" });
      toast.success("Citation created!");
    } catch { toast.error("Failed to create citation"); }
  };

  const copy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    toast.success("Copied!");
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div style={{ maxWidth: 900, margin: "0 auto" }}>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 28 }}>
        <div>
          <h2 style={{ fontFamily: "Poppins, sans-serif", fontSize: 24, fontWeight: 700, color: "#fff", marginBottom: 6 }}>Citation Manager</h2>
          <p style={{ color: "rgba(255,255,255,0.5)", fontSize: 14 }}>Auto-generate APA, MLA, IEEE, Chicago, BibTeX, RIS citations</p>
        </div>
        <button onClick={() => setShowForm(!showForm)} style={{ padding: "10px 20px", background: "linear-gradient(135deg,#4F46E5,#7C3AED)", color: "#fff", border: "none", borderRadius: 12, fontSize: 14, fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", gap: 8 }}>
          <FiPlus size={16} /> New Citation
        </button>
      </motion.div>

      {/* Format tabs */}
      <div style={{ display: "flex", gap: 8, marginBottom: 20, flexWrap: "wrap" }}>
        {formats.map((f) => (
          <button key={f} onClick={() => setActiveFormat(f)}
            style={{ padding: "8px 16px", background: activeFormat === f ? "rgba(79,70,229,0.3)" : "rgba(255,255,255,0.04)", border: `1px solid ${activeFormat === f ? "rgba(79,70,229,0.5)" : "rgba(255,255,255,0.08)"}`, borderRadius: 10, color: activeFormat === f ? "#a5b4fc" : "rgba(255,255,255,0.5)", fontSize: 13, cursor: "pointer", fontWeight: activeFormat === f ? 600 : 400, textTransform: "uppercase" }}>
            {f}
          </button>
        ))}
      </div>

      {/* New Citation Form */}
      {showForm && (
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} style={{ padding: 24, background: "rgba(79,70,229,0.08)", border: "1px solid rgba(79,70,229,0.2)", borderRadius: 16, marginBottom: 20 }}>
          <h3 style={{ fontFamily: "Poppins, sans-serif", fontSize: 15, fontWeight: 600, color: "#fff", marginBottom: 16 }}>Add New Citation</h3>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            {[
              { key: "title", label: "Title *", placeholder: "Paper title" },
              { key: "authors", label: "Authors", placeholder: "Author 1, Author 2" },
              { key: "year", label: "Year", placeholder: "2024" },
              { key: "journal", label: "Journal", placeholder: "Nature, IEEE Trans..." },
              { key: "doi", label: "DOI", placeholder: "10.xxxx/xxxxx" },
              { key: "url", label: "URL", placeholder: "https://..." },
            ].map(({ key, label, placeholder }) => (
              <div key={key}>
                <label style={{ fontSize: 12, color: "rgba(255,255,255,0.5)", display: "block", marginBottom: 6 }}>{label}</label>
                <input value={form[key as keyof typeof form]} onChange={(e) => setForm((p) => ({ ...p, [key]: e.target.value }))} placeholder={placeholder}
                  style={{ width: "100%", padding: "10px 12px", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, color: "#fff", fontSize: 13, outline: "none", boxSizing: "border-box" }} />
              </div>
            ))}
          </div>
          <div style={{ marginTop: 16, display: "flex", gap: 10 }}>
            <button onClick={create} style={{ padding: "10px 20px", background: "linear-gradient(135deg,#4F46E5,#7C3AED)", color: "#fff", border: "none", borderRadius: 10, fontSize: 13, fontWeight: 600, cursor: "pointer" }}>Generate Citations</button>
            <button onClick={() => setShowForm(false)} style={{ padding: "10px 20px", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 10, color: "rgba(255,255,255,0.6)", fontSize: 13, cursor: "pointer" }}>Cancel</button>
          </div>
        </motion.div>
      )}

      {/* Citations list */}
      {citations.length === 0 ? (
        <div style={{ textAlign: "center", padding: "60px 0", color: "rgba(255,255,255,0.3)" }}>
          <FiBookmark size={40} style={{ display: "block", margin: "0 auto 16px", opacity: 0.4 }} />
          <p>No citations yet. Add your first paper to get instant formatted citations.</p>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {citations.map((c, i) => (
            <motion.div key={c._id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
              style={{ padding: 20, background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 14 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
                <div>
                  <h4 style={{ fontSize: 14, fontWeight: 600, color: "#fff", marginBottom: 4 }}>{c.title}</h4>
                  <p style={{ fontSize: 12, color: "rgba(255,255,255,0.4)" }}>{c.authors?.join(", ")} {c.year ? `· ${c.year}` : ""} {c.journal ? `· ${c.journal}` : ""}</p>
                </div>
                <button onClick={() => copy(c[activeFormat], c._id)}
                  style={{ padding: "6px 12px", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, color: "rgba(255,255,255,0.6)", fontSize: 12, cursor: "pointer", display: "flex", alignItems: "center", gap: 6 }}>
                  {copied === c._id ? <FiCheck size={12} color="#00F5A0" /> : <FiCopy size={12} />} Copy {activeFormat.toUpperCase()}
                </button>
              </div>
              <div style={{ padding: "12px 14px", background: "rgba(0,0,0,0.3)", borderRadius: 8, fontFamily: "monospace", fontSize: 12, color: "rgba(255,255,255,0.7)", whiteSpace: "pre-wrap", lineHeight: 1.6, wordBreak: "break-word" }}>
                {c[activeFormat] || `${activeFormat.toUpperCase()} format not available`}
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
