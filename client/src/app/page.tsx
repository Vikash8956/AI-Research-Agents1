"use client";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { useRef, useState } from "react";
import Link from "next/link";
import {
  FiSearch, FiZap, FiFileText, FiBookOpen,
  FiStar, FiArrowRight, FiCheck, FiChevronDown, FiCpu, FiDatabase,
  FiMail
} from "react-icons/fi";
import ThemeToggle from "@/components/ThemeToggle";
import { useThemeStore } from "@/store/themeStore";

const stats = [
  { value: "10M+", label: "Research Papers" },
  { value: "500K+", label: "Active Researchers" },
  { value: "98%", label: "Accuracy Rate" },
  { value: "3s", label: "Avg Response Time" },
];

const features = [
  { icon: FiSearch, title: "Intelligent Search", desc: "Search across 10M+ papers with semantic AI understanding. Filter by year, journal, author, domain.", color: "#4F46E5" },
  { icon: FiZap, title: "Instant Summaries", desc: "IBM Granite AI generates concise, accurate summaries with key insights and research gaps in seconds.", color: "#00D4FF" },
  { icon: FiFileText, title: "Auto Report Generator", desc: "Generate full academic reports from Abstract to References — export as PDF, DOCX, or Markdown.", color: "#00F5A0" },
  { icon: FiBookOpen, title: "Citation Manager", desc: "Auto-generate APA, MLA, IEEE, Chicago, BibTeX, and RIS citations from any paper instantly.", color: "#F59E0B" },
  { icon: FiDatabase, title: "Research Library", desc: "Organize papers in folders, add tags, notes, bookmarks. Your personal research database.", color: "#EF4444" },
  { icon: FiCpu, title: "Hypothesis Generator", desc: "AI generates novel, testable research hypotheses based on existing literature and gaps.", color: "#8B5CF6" },
];

const steps = [
  { step: "01", title: "Search or Upload", desc: "Search across arXiv, PubMed, and more — or upload your own PDFs directly." },
  { step: "02", title: "AI Analysis", desc: "IBM Granite model analyzes the paper, extracts insights, identifies gaps, critiques methodology." },
  { step: "03", title: "Generate Outputs", desc: "Get summaries, full reports, citations, hypotheses — all exportable in multiple formats." },
];

const testimonials = [
  { name: "Dr. Sarah Chen", role: "Professor, MIT", text: "ResearchAI cut my literature review time by 70%. The summaries are incredibly accurate.", rating: 5 },
  { name: "James Rodriguez", role: "PhD Student, Stanford", text: "The citation manager alone saves me hours every week. IBM Granite's quality is remarkable.", rating: 5 },
  { name: "Dr. Priya Sharma", role: "Research Scientist, Google DeepMind", text: "The hypothesis generator sparked ideas I hadn't considered. Genuinely useful for cutting-edge research.", rating: 5 },
];

const faqs = [
  { q: "Is ResearchAI free to use?", a: "ResearchAI offers a generous free tier with 20 AI requests/day. Pro and Team plans unlock unlimited usage." },
  { q: "Which AI model powers ResearchAI?", a: "ResearchAI is powered by IBM Granite foundation models via watsonx.ai, one of the most advanced enterprise AI platforms available." },
  { q: "What paper sources do you support?", a: "We integrate with arXiv, PubMed, IEEE Xplore, Semantic Scholar, and allow direct PDF uploads." },
  { q: "Is my research data private?", a: "Absolutely. Your papers, notes, and research data are encrypted and never used to train AI models." },
  { q: "Can I export my reports?", a: "Yes — export any generated report as PDF, DOCX, or Markdown with one click." },
];

function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-white/10 py-5 cursor-pointer" onClick={() => setOpen(!open)}>
      <div className="flex justify-between items-center">
        <span className="font-medium text-white/90">{q}</span>
        <motion.div animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.2 }}>
          <FiChevronDown className="text-white/50" />
        </motion.div>
      </div>
      <AnimatePresence>
        {open && (
          <motion.p initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3 }}
            className="mt-3 text-white/60 text-sm leading-relaxed overflow-hidden">{a}</motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function LandingPage() {
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "40%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);
  const { isDark } = useThemeStore();

  const navBg = isDark ? "rgba(5,8,22,0.85)" : "rgba(240,242,255,0.92)";
  const navBorder = isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.07)";
  const navText = isDark ? "rgba(255,255,255,0.7)" : "rgba(0,0,0,0.6)";
  const pageBg = isDark ? "#050816" : "#f0f2ff";
  const textCol = isDark ? "#fff" : "#0f0f1a";

  return (
    <div style={{ background: pageBg, color: textCol, minHeight: "100vh", fontFamily: "Inter, sans-serif", transition: "background 0.3s, color 0.3s" }}>
      {/* NAVBAR */}
      <motion.nav initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.5 }}
        style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 100, padding: "16px 32px", display: "flex", alignItems: "center", justifyContent: "space-between", background: navBg, backdropFilter: "blur(20px)", borderBottom: `1px solid ${navBorder}` }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 32, height: 32, background: "linear-gradient(135deg,#4F46E5,#00D4FF)", borderRadius: 8 }} />
          <span style={{ fontFamily: "Poppins, sans-serif", fontWeight: 700, fontSize: 20, color: textCol }}>Research<span style={{ color: "#4F46E5" }}>AI</span></span>
        </div>
        <div style={{ display: "flex", gap: 24, alignItems: "center" }}>
          <a href="#features" style={{ color: navText, textDecoration: "none", fontSize: 14 }}>Features</a>
          <a href="#how-it-works" style={{ color: navText, textDecoration: "none", fontSize: 14 }}>How It Works</a>
          <a href="#pricing" style={{ color: navText, textDecoration: "none", fontSize: 14 }}>Pricing</a>
          <Link href="/auth/login" style={{ color: navText, textDecoration: "none", fontSize: 14 }}>Sign In</Link>
          {/* Theme toggle */}
          <ThemeToggle size="sm" />
          <Link href="/auth/register" style={{ padding: "8px 20px", background: "#4F46E5", color: "#fff", textDecoration: "none", borderRadius: 10, fontSize: 14, fontWeight: 600 }}>Get Started</Link>
        </div>
      </motion.nav>

      {/* HERO */}
      <section ref={heroRef} style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", position: "relative", overflow: "hidden", paddingTop: 80 }}>
        {/* Orbs */}
        <div style={{ position: "absolute", top: "15%", left: "10%", width: 400, height: 400, background: "radial-gradient(circle, rgba(79,70,229,0.25) 0%, transparent 70%)", borderRadius: "50%", pointerEvents: "none" }} />
        <div style={{ position: "absolute", bottom: "15%", right: "10%", width: 350, height: 350, background: "radial-gradient(circle, rgba(0,212,255,0.2) 0%, transparent 70%)", borderRadius: "50%", pointerEvents: "none" }} />
        <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", width: 600, height: 600, background: "radial-gradient(circle, rgba(0,245,160,0.06) 0%, transparent 70%)", borderRadius: "50%", pointerEvents: "none" }} />

        <motion.div style={{ y, opacity, textAlign: "center", maxWidth: 900, padding: "0 24px", position: "relative", zIndex: 1 }}>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "6px 16px", background: "rgba(79,70,229,0.15)", border: "1px solid rgba(79,70,229,0.4)", borderRadius: 100, fontSize: 13, color: "#a5b4fc", marginBottom: 28 }}>
            ✦ Powered by IBM Granite on watsonx.ai
          </motion.div>

          <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
            style={{ fontFamily: "Poppins, sans-serif", fontSize: "clamp(40px, 7vw, 80px)", fontWeight: 800, lineHeight: 1.1, marginBottom: 24 }}>
            Research Smarter<br />
            <span style={{ background: "linear-gradient(135deg,#4F46E5 0%,#00D4FF 50%,#00F5A0 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
              With AI Intelligence
            </span>
          </motion.h1>

          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
            style={{ fontSize: "clamp(16px, 2.5vw, 20px)", color: "rgba(255,255,255,0.65)", lineHeight: 1.7, marginBottom: 40, maxWidth: 600, margin: "0 auto 40px" }}>
            Search millions of research papers, get AI-powered summaries, generate full academic reports, and manage citations — all in one intelligent workspace.
          </motion.p>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
            style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}>
            <Link href="/auth/register" style={{ display: "flex", alignItems: "center", gap: 8, padding: "14px 32px", background: "linear-gradient(135deg,#4F46E5,#7C3AED)", color: "#fff", textDecoration: "none", borderRadius: 14, fontSize: 16, fontWeight: 600, boxShadow: "0 0 40px rgba(79,70,229,0.4)" }}>
              Start for Free <FiArrowRight />
            </Link>
            <a href="#how-it-works" style={{ display: "flex", alignItems: "center", gap: 8, padding: "14px 32px", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)", color: "#fff", textDecoration: "none", borderRadius: 14, fontSize: 16, fontWeight: 600 }}>
              Watch Demo
            </a>
          </motion.div>

          {/* Stats */}
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}
            style={{ display: "flex", gap: 40, justifyContent: "center", marginTop: 64, flexWrap: "wrap" }}>
            {stats.map((s) => (
              <div key={s.label} style={{ textAlign: "center" }}>
                <div style={{ fontSize: 32, fontWeight: 800, fontFamily: "Poppins, sans-serif", background: "linear-gradient(135deg,#4F46E5,#00D4FF)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>{s.value}</div>
                <div style={{ fontSize: 13, color: "rgba(255,255,255,0.5)", marginTop: 4 }}>{s.label}</div>
              </div>
            ))}
          </motion.div>
        </motion.div>
      </section>

      {/* FEATURES */}
      <section id="features" style={{ padding: "100px 32px", maxWidth: 1200, margin: "0 auto" }}>
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} style={{ textAlign: "center", marginBottom: 64 }}>
          <h2 style={{ fontFamily: "Poppins, sans-serif", fontSize: "clamp(28px, 4vw, 48px)", fontWeight: 700, marginBottom: 16 }}>
            Everything You Need for <span style={{ background: "linear-gradient(135deg,#4F46E5,#00D4FF)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>World-Class Research</span>
          </h2>
          <p style={{ color: "rgba(255,255,255,0.6)", maxWidth: 500, margin: "0 auto", lineHeight: 1.7 }}>From discovery to publication, AI-powered tools at every step of your research workflow.</p>
        </motion.div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: 24 }}>
          {features.map((f, i) => (
            <motion.div key={f.title} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} whileHover={{ y: -6, scale: 1.01 }}
              style={{ padding: 32, background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 20, backdropFilter: "blur(12px)", transition: "box-shadow 0.3s" }}>
              <div style={{ width: 52, height: 52, background: `${f.color}1a`, border: `1px solid ${f.color}40`, borderRadius: 14, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 20 }}>
                <f.icon size={22} color={f.color} />
              </div>
              <h3 style={{ fontFamily: "Poppins, sans-serif", fontSize: 18, fontWeight: 700, marginBottom: 10 }}>{f.title}</h3>
              <p style={{ color: "rgba(255,255,255,0.6)", lineHeight: 1.7, fontSize: 14 }}>{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how-it-works" style={{ padding: "80px 32px", background: "rgba(255,255,255,0.01)" }}>
        <div style={{ maxWidth: 1000, margin: "0 auto" }}>
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} style={{ textAlign: "center", marginBottom: 64 }}>
            <h2 style={{ fontFamily: "Poppins, sans-serif", fontSize: "clamp(28px, 4vw, 48px)", fontWeight: 700, marginBottom: 16 }}>How It Works</h2>
            <p style={{ color: "rgba(255,255,255,0.6)", maxWidth: 500, margin: "0 auto" }}>Three simple steps from paper to publishable insight</p>
          </motion.div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: 40 }}>
            {steps.map((s, i) => (
              <motion.div key={s.step} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.15 }} style={{ textAlign: "center" }}>
                <div style={{ width: 64, height: 64, background: "linear-gradient(135deg,#4F46E5,#00D4FF)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px", fontSize: 22, fontWeight: 800, fontFamily: "Poppins, sans-serif" }}>{s.step}</div>
                <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 10 }}>{s.title}</h3>
                <p style={{ color: "rgba(255,255,255,0.6)", lineHeight: 1.7, fontSize: 14 }}>{s.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section style={{ padding: "80px 32px", maxWidth: 1200, margin: "0 auto" }}>
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} style={{ textAlign: "center", marginBottom: 48 }}>
          <h2 style={{ fontFamily: "Poppins, sans-serif", fontSize: "clamp(28px, 4vw, 40px)", fontWeight: 700, marginBottom: 12 }}>Loved by Researchers Worldwide</h2>
        </motion.div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 24 }}>
          {testimonials.map((t, i) => (
            <motion.div key={t.name} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
              style={{ padding: 28, background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 20 }}>
              <div style={{ display: "flex", gap: 4, marginBottom: 16 }}>
                {Array.from({ length: t.rating }).map((_, j) => <FiStar key={j} size={14} style={{ fill: "#F59E0B", color: "#F59E0B" }} />)}
              </div>
              <p style={{ color: "rgba(255,255,255,0.8)", lineHeight: 1.7, marginBottom: 20, fontSize: 14 }}>&ldquo;{t.text}&rdquo;</p>
              <div>
                <div style={{ fontWeight: 600, fontSize: 14 }}>{t.name}</div>
                <div style={{ color: "rgba(255,255,255,0.5)", fontSize: 12 }}>{t.role}</div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section style={{ padding: "80px 32px", maxWidth: 720, margin: "0 auto" }}>
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} style={{ textAlign: "center", marginBottom: 48 }}>
          <h2 style={{ fontFamily: "Poppins, sans-serif", fontSize: "clamp(28px, 4vw, 40px)", fontWeight: 700, marginBottom: 12 }}>Frequently Asked Questions</h2>
        </motion.div>
        {faqs.map((f) => <FAQItem key={f.q} q={f.q} a={f.a} />)}
      </section>

      {/* CTA */}
      <section id="pricing" style={{ padding: "80px 32px", textAlign: "center" }}>
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          style={{ maxWidth: 700, margin: "0 auto", padding: "60px 40px", background: "linear-gradient(135deg, rgba(79,70,229,0.2), rgba(0,212,255,0.1))", border: "1px solid rgba(79,70,229,0.3)", borderRadius: 28 }}>
          <h2 style={{ fontFamily: "Poppins, sans-serif", fontSize: "clamp(28px, 4vw, 44px)", fontWeight: 800, marginBottom: 16 }}>
            Ready to Accelerate Your Research?
          </h2>
          <p style={{ color: "rgba(255,255,255,0.65)", marginBottom: 36, fontSize: 16, lineHeight: 1.7 }}>Join 500,000+ researchers using AI to discover, analyze, and publish faster.</p>
          <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap", marginBottom: 20 }}>
            {["Free forever plan", "No credit card", "Setup in 60 seconds"].map((b) => (
              <div key={b} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, color: "rgba(255,255,255,0.7)" }}>
                <FiCheck size={14} color="#00F5A0" /> {b}
              </div>
            ))}
          </div>
          <Link href="/auth/register" style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "14px 36px", background: "linear-gradient(135deg,#4F46E5,#7C3AED)", color: "#fff", textDecoration: "none", borderRadius: 14, fontSize: 16, fontWeight: 700, boxShadow: "0 0 40px rgba(79,70,229,0.5)" }}>
            Get Started Free <FiArrowRight />
          </Link>
        </motion.div>
      </section>

      {/* FOOTER */}
      <footer style={{ padding: "40px 32px", borderTop: "1px solid rgba(255,255,255,0.06)", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 16 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 28, height: 28, background: "linear-gradient(135deg,#4F46E5,#00D4FF)", borderRadius: 7 }} />
          <span style={{ fontFamily: "Poppins, sans-serif", fontWeight: 700, fontSize: 16 }}>Research<span style={{ color: "#4F46E5" }}>AI</span></span>
        </div>
        <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 13 }}>© 2024 ResearchAI. Powered by IBM Granite · watsonx.ai</p>
        <div style={{ display: "flex", gap: 24 }}>
          <a href="#" style={{ color: "rgba(255,255,255,0.5)", fontSize: 13, textDecoration: "none" }}>Privacy</a>
          <a href="#" style={{ color: "rgba(255,255,255,0.5)", fontSize: 13, textDecoration: "none" }}>Terms</a>
          <a href="#" style={{ color: "rgba(255,255,255,0.5)", fontSize: 13, textDecoration: "none", display: "flex", alignItems: "center", gap: 4 }}><FiMail size={14} /> Contact</a>
        </div>
      </footer>
    </div>
  );
}
