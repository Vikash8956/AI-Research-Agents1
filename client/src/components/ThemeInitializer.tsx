"use client";
import { useEffect } from "react";
import { useThemeStore } from "@/store/themeStore";

/**
 * Applies the persisted theme to <html> on mount.
 * Rendered once inside RootLayout so all pages get it.
 */
export default function ThemeInitializer() {
  const { isDark } = useThemeStore();
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", isDark ? "dark" : "light");
    document.documentElement.style.setProperty("--bg", isDark ? "#050816" : "#f0f2ff");
    document.documentElement.style.setProperty("--text", isDark ? "#ffffff" : "#0f0f1a");
    document.documentElement.style.setProperty("--surface", isDark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.04)");
    document.documentElement.style.setProperty("--border", isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.10)");
    document.documentElement.style.setProperty("--muted", isDark ? "rgba(255,255,255,0.50)" : "rgba(0,0,0,0.50)");
    document.body.style.background = isDark ? "#050816" : "#f0f2ff";
    document.body.style.color = isDark ? "#ffffff" : "#0f0f1a";
  }, [isDark]);
  return null;
}
