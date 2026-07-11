"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  FiSearch, FiBookOpen, FiFileText, FiBookmark, FiSettings,
  FiLogOut, FiMenu, FiX, FiHome, FiZap
} from "react-icons/fi";
import { useAuthStore } from "@/store/authStore";
import { useThemeStore } from "@/store/themeStore";
import AuthGuard from "@/components/AuthGuard";
import ThemeToggle from "@/components/ThemeToggle";
import toast from "react-hot-toast";

const navItems = [
  { href: "/dashboard", icon: FiHome, label: "Dashboard" },
  { href: "/dashboard/research", icon: FiSearch, label: "AI Research" },
  { href: "/dashboard/library", icon: FiBookOpen, label: "Library" },
  { href: "/dashboard/reports", icon: FiFileText, label: "Reports" },
  { href: "/dashboard/citations", icon: FiBookmark, label: "Citations" },
  { href: "/dashboard/settings", icon: FiSettings, label: "Settings" },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout, fetchProfile } = useAuthStore();
  const { isDark } = useThemeStore();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [loggingOut, setLoggingOut] = useState(false);

  useEffect(() => { fetchProfile(); }, [fetchProfile]);

  const handleLogout = async () => {
    setLoggingOut(true);
    await logout();
    toast.success("Logged out successfully");
    router.push("/");
  };

  const sidebarBg = isDark ? "rgba(5,8,22,0.95)" : "rgba(255,255,255,0.97)";
  const borderCol = isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.07)";
  const textCol = isDark ? "#fff" : "#0f0f1a";
  const mutedCol = isDark ? "rgba(255,255,255,0.5)" : "rgba(0,0,0,0.45)";
  const topbarBg = isDark ? "rgba(5,8,22,0.7)" : "rgba(240,242,255,0.85)";

  return (
    <AuthGuard>
      <div style={{ display: "flex", minHeight: "100vh", background: "var(--bg)" }}>

        {/* ── SIDEBAR ─────────────────────────────────── */}
        <div style={{
          width: sidebarOpen ? 240 : 64,
          minHeight: "100vh",
          background: sidebarBg,
          borderRight: `1px solid ${borderCol}`,
          display: "flex",
          flexDirection: "column",
          transition: "width 0.3s ease",
          position: "fixed",
          top: 0, left: 0,
          zIndex: 50,
          overflow: "hidden",
          backdropFilter: "blur(20px)",
        }}>

          {/* Logo row */}
          <div style={{ padding: "20px 16px", display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: `1px solid ${borderCol}`, minHeight: 64 }}>
            {sidebarOpen && (
              <Link href="/" style={{ display: "flex", alignItems: "center", gap: 8, textDecoration: "none" }}>
                <div style={{ width: 28, height: 28, background: "linear-gradient(135deg,#4F46E5,#00D4FF)", borderRadius: 7, flexShrink: 0 }} />
                <span style={{ fontFamily: "Poppins, sans-serif", fontWeight: 700, fontSize: 16, color: textCol, whiteSpace: "nowrap" }}>
                  Research<span style={{ color: "#4F46E5" }}>AI</span>
                </span>
              </Link>
            )}
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              style={{ background: "none", border: "none", cursor: "pointer", color: mutedCol, padding: 4, marginLeft: sidebarOpen ? 0 : "auto", marginRight: sidebarOpen ? 0 : "auto" }}>
              {sidebarOpen ? <FiX size={18} /> : <FiMenu size={18} />}
            </button>
          </div>

          {/* Nav links */}
          <nav style={{ flex: 1, padding: "12px 8px", display: "flex", flexDirection: "column", gap: 4 }}>
            {navItems.map((item) => {
              const active = pathname === item.href;
              return (
                <Link key={item.href} href={item.href}
                  style={{
                    display: "flex", alignItems: "center", gap: 12,
                    padding: "10px 12px", borderRadius: 10, textDecoration: "none",
                    background: active ? "rgba(79,70,229,0.18)" : "transparent",
                    border: `1px solid ${active ? "rgba(79,70,229,0.35)" : "transparent"}`,
                    color: active ? "#a5b4fc" : mutedCol,
                    transition: "all 0.2s", whiteSpace: "nowrap",
                  }}>
                  <item.icon size={18} style={{ flexShrink: 0, color: active ? "#4F46E5" : mutedCol }} />
                  {sidebarOpen && (
                    <span style={{ fontSize: 14, fontWeight: active ? 600 : 400, color: active ? "#a5b4fc" : textCol }}>
                      {item.label}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* User info + logout */}
          <div style={{ padding: "12px 8px", borderTop: `1px solid ${borderCol}` }}>
            {sidebarOpen && user && (
              <div style={{ padding: "10px 12px", marginBottom: 8, display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{ width: 32, height: 32, background: "linear-gradient(135deg,#4F46E5,#00D4FF)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 700, flexShrink: 0, color: "#fff" }}>
                  {user.name?.charAt(0).toUpperCase()}
                </div>
                <div style={{ overflow: "hidden" }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: textCol, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{user.name}</div>
                  <div style={{ fontSize: 11, color: mutedCol, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{user.email}</div>
                </div>
              </div>
            )}
            <button
              onClick={handleLogout}
              disabled={loggingOut}
              style={{ width: "100%", display: "flex", alignItems: "center", gap: 12, padding: "10px 12px", borderRadius: 10, background: loggingOut ? "rgba(239,68,68,0.08)" : "transparent", border: "1px solid transparent", cursor: loggingOut ? "not-allowed" : "pointer", color: loggingOut ? "#fca5a5" : mutedCol, transition: "all 0.2s" }}>
              <FiLogOut size={18} style={{ flexShrink: 0 }} />
              {sidebarOpen && <span style={{ fontSize: 14 }}>{loggingOut ? "Signing out..." : "Sign Out"}</span>}
            </button>
          </div>
        </div>

        {/* ── MAIN CONTENT ────────────────────────────── */}
        <div style={{ flex: 1, marginLeft: sidebarOpen ? 240 : 64, transition: "margin-left 0.3s ease", minHeight: "100vh", display: "flex", flexDirection: "column" }}>

          {/* Topbar */}
          <header style={{
            height: 64, padding: "0 24px",
            display: "flex", alignItems: "center", justifyContent: "space-between",
            borderBottom: `1px solid ${borderCol}`,
            background: topbarBg,
            backdropFilter: "blur(12px)",
            position: "sticky", top: 0, zIndex: 40,
          }}>
            <h1 style={{ fontFamily: "Poppins, sans-serif", fontSize: 18, fontWeight: 700, color: textCol }}>
              {navItems.find((n) => n.href === pathname)?.label || "Dashboard"}
            </h1>

            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              {/* IBM badge */}
              <div style={{ padding: "5px 12px", background: "rgba(79,70,229,0.15)", border: "1px solid rgba(79,70,229,0.3)", borderRadius: 8, fontSize: 12, color: "#a5b4fc", display: "flex", alignItems: "center", gap: 5 }}>
                <FiZap size={11} /> IBM Granite
              </div>

              {/* ← Theme toggle */}
              <ThemeToggle size="sm" />

              {/* Avatar */}
              {user && (
                <div style={{ width: 34, height: 34, background: "linear-gradient(135deg,#4F46E5,#00D4FF)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, fontWeight: 700, cursor: "pointer", color: "#fff", flexShrink: 0 }}>
                  {user.name?.charAt(0).toUpperCase()}
                </div>
              )}
            </div>
          </header>

          <main style={{ flex: 1, padding: 24, overflow: "auto" }}>
            {children}
          </main>
        </div>
      </div>
    </AuthGuard>
  );
}
