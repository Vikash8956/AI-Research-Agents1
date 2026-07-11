"use client";
import { useThemeStore } from "@/store/themeStore";
import { motion } from "framer-motion";
import { FiSun, FiMoon } from "react-icons/fi";

interface Props {
  size?: "sm" | "md";
}

export default function ThemeToggle({ size = "md" }: Props) {
  const { isDark, toggle } = useThemeStore();

  const w = size === "sm" ? 40 : 48;
  const h = size === "sm" ? 22 : 26;
  const knob = size === "sm" ? 16 : 20;
  const offset = size === "sm" ? 3 : 3;

  return (
    <motion.button
      onClick={toggle}
      aria-label="Toggle theme"
      title={isDark ? "Switch to light mode" : "Switch to dark mode"}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      style={{
        display: "flex",
        alignItems: "center",
        gap: 6,
        background: "none",
        border: "none",
        cursor: "pointer",
        padding: "4px 8px",
        borderRadius: 8,
      }}
    >
      {/* Icon */}
      <motion.span
        key={isDark ? "moon" : "sun"}
        initial={{ rotate: -30, opacity: 0 }}
        animate={{ rotate: 0, opacity: 1 }}
        transition={{ duration: 0.25 }}
        style={{ color: isDark ? "#a5b4fc" : "#f59e0b", display: "flex", alignItems: "center" }}
      >
        {isDark ? <FiMoon size={size === "sm" ? 14 : 16} /> : <FiSun size={size === "sm" ? 14 : 16} />}
      </motion.span>

      {/* Pill track */}
      <div
        style={{
          width: w,
          height: h,
          borderRadius: h,
          background: isDark
            ? "linear-gradient(135deg,#4F46E5,#7C3AED)"
            : "linear-gradient(135deg,#f59e0b,#f97316)",
          position: "relative",
          transition: "background 0.3s",
          border: "1px solid rgba(255,255,255,0.15)",
          flexShrink: 0,
        }}
      >
        <motion.div
          layout
          transition={{ type: "spring", stiffness: 500, damping: 30 }}
          style={{
            position: "absolute",
            width: knob,
            height: knob,
            background: "#fff",
            borderRadius: "50%",
            top: offset,
            left: isDark ? w - knob - offset : offset,
            boxShadow: "0 1px 4px rgba(0,0,0,0.3)",
          }}
        />
      </div>
    </motion.button>
  );
}
