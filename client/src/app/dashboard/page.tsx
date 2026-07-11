"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FiFileText, FiBookOpen, FiZap, FiTrendingUp, FiSearch, FiBookmark, FiClock } from "react-icons/fi";
import Link from "next/link";
import { useAuthStore } from "@/store/authStore";
import api from "@/lib/api";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

const mockChartData = [
  { day: "Mon", searches: 4, summaries: 2 },
  { day: "Tue", searches: 7, summaries: 5 },
  { day: "Wed", searches: 3, summaries: 1 },
  { day: "Thu", searches: 9, summaries: 6 },
  { day: "Fri", searches: 12, summaries: 8 },
  { day: "Sat", searches: 5, summaries: 3 },
  { day: "Sun", searches: 8, summaries: 4 },
];

export default function DashboardPage() {
  const { user } = useAuthStore();
  const [stats, setStats] = useState({ papers: 0, reports: 0 });
  const [recentPapers, setRecentPapers] = useState<{ _id: string; title: string; createdAt: string }[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [profileRes, historyRes] = await Promise.all([api.get("/profile"), api.get("/history")]);
        setStats(profileRes.data.stats || { papers: 0, reports: 0 });
        setRecentPapers(historyRes.data.papers?.slice(0, 5) || []);
      } catch { /* use defaults */ }
    };
    fetchData();
  }, []);

  const widgets = [
    { label: "Saved Papers", value: stats.papers, icon: FiBookOpen, color: "#4F46E5", bg: "rgba(79,70,229,0.12)" },
    { label: "Reports Generated", value: stats.reports, icon: FiFileText, color: "#00D4FF", bg: "rgba(0,212,255,0.12)" },
    { label: "AI Requests Today", value: 12, icon: FiZap, color: "#00F5A0", bg: "rgba(0,245,160,0.12)" },
    { label: "Research Sessions", value: 34, icon: FiTrendingUp, color: "#F59E0B", bg: "rgba(245,158,11,0.12)" },
  ];

  const quickActions = [
    { href: "/dashboard/research", icon: FiSearch, label: "Search Papers", desc: "Find and analyze papers", color: "#4F46E5" },
    { href: "/dashboard/reports", icon: FiFileText, label: "Generate Report", desc: "AI-powered full reports", color: "#00D4FF" },
    { href: "/dashboard/citations", icon: FiBookmark, label: "Cite a Paper", desc: "APA, MLA, IEEE + more", color: "#00F5A0" },
    { href: "/dashboard/library", icon: FiBookOpen, label: "My Library", desc: "Organized research archive", color: "#F59E0B" },
  ];

  return (
    <div style={{ maxWidth: 1200, margin: "0 auto" }}>
      {/* Welcome */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} style={{ marginBottom: 32 }}>
        <h2 style={{ fontFamily: "Poppins, sans-serif", fontSize: 26, fontWeight: 700, color: "#fff", marginBottom: 6 }}>
          Good morning, {user?.name?.split(" ")[0] || "Researcher"} 👋
        </h2>
        <p style={{ color: "rgba(255,255,255,0.5)", fontSize: 15 }}>Here&apos;s your research overview for today</p>
      </motion.div>

      {/* Stat Widgets */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 16, marginBottom: 28 }}>
        {widgets.map((w, i) => (
          <motion.div key={w.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
            style={{ padding: 24, background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 16 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
              <div style={{ width: 40, height: 40, background: w.bg, borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <w.icon size={18} color={w.color} />
              </div>
            </div>
            <div style={{ fontSize: 32, fontWeight: 800, fontFamily: "Poppins, sans-serif", color: "#fff", marginBottom: 4 }}>{w.value}</div>
            <div style={{ fontSize: 13, color: "rgba(255,255,255,0.5)" }}>{w.label}</div>
          </motion.div>
        ))}
      </div>

      {/* Chart + Quick Actions */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 340px", gap: 20, marginBottom: 28 }}>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          style={{ padding: 24, background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 16 }}>
          <h3 style={{ fontFamily: "Poppins, sans-serif", fontSize: 16, fontWeight: 600, marginBottom: 20, color: "#fff" }}>Weekly AI Activity</h3>
          <ResponsiveContainer width="100%" height={180}>
            <AreaChart data={mockChartData}>
              <defs>
                <linearGradient id="grad1" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#4F46E5" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#4F46E5" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="grad2" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#00D4FF" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#00D4FF" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="day" tick={{ fill: "rgba(255,255,255,0.4)", fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis hide />
              <Tooltip contentStyle={{ background: "#0d0d1a", border: "1px solid rgba(79,70,229,0.3)", borderRadius: 10, color: "#fff", fontSize: 12 }} />
              <Area type="monotone" dataKey="searches" stroke="#4F46E5" strokeWidth={2} fill="url(#grad1)" name="Searches" />
              <Area type="monotone" dataKey="summaries" stroke="#00D4FF" strokeWidth={2} fill="url(#grad2)" name="Summaries" />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Quick Actions */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}
          style={{ padding: 24, background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 16 }}>
          <h3 style={{ fontFamily: "Poppins, sans-serif", fontSize: 16, fontWeight: 600, marginBottom: 16, color: "#fff" }}>Quick Actions</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {quickActions.map((q) => (
              <Link key={q.href} href={q.href} style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 14px", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 12, textDecoration: "none", transition: "all 0.2s" }}>
                <div style={{ width: 34, height: 34, background: `${q.color}1a`, borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <q.icon size={16} color={q.color} />
                </div>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: "#fff" }}>{q.label}</div>
                  <div style={{ fontSize: 11, color: "rgba(255,255,255,0.4)" }}>{q.desc}</div>
                </div>
              </Link>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Recent Papers */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
        style={{ padding: 24, background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 16 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <h3 style={{ fontFamily: "Poppins, sans-serif", fontSize: 16, fontWeight: 600, color: "#fff" }}>Recent Activity</h3>
          <Link href="/dashboard/library" style={{ fontSize: 13, color: "#4F46E5", textDecoration: "none" }}>View all →</Link>
        </div>
        {recentPapers.length === 0 ? (
          <div style={{ textAlign: "center", padding: "32px 0", color: "rgba(255,255,255,0.4)", fontSize: 14 }}>
            <FiClock size={24} style={{ margin: "0 auto 12px", display: "block" }} />
            No recent activity. <Link href="/dashboard/research" style={{ color: "#4F46E5", textDecoration: "none" }}>Search papers to get started!</Link>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {recentPapers.map((p) => (
              <div key={p._id} style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 0", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                <FiFileText size={16} color="rgba(255,255,255,0.4)" />
                <span style={{ flex: 1, fontSize: 13, color: "rgba(255,255,255,0.8)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{p.title}</span>
                <span style={{ fontSize: 11, color: "rgba(255,255,255,0.3)", flexShrink: 0 }}>{new Date(p.createdAt).toLocaleDateString()}</span>
              </div>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
}
