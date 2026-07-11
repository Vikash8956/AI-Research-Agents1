"use client";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

export default function PageLoader() {
  const pathname = usePathname();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Show loader on every route change
    setLoading(true);
    const t = setTimeout(() => setLoading(false), 600);
    return () => clearTimeout(t);
  }, [pathname]);

  return (
    <AnimatePresence>
      {loading && (
        <motion.div
          key="page-loader"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 9999,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "rgba(5,8,22,0.82)",
            backdropFilter: "blur(6px)",
            pointerEvents: "none",
          }}
        >
          {/* Outer ring */}
          <div style={{ position: "relative", width: 64, height: 64 }}>
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 0.9, ease: "linear" }}
              style={{
                position: "absolute",
                inset: 0,
                borderRadius: "50%",
                border: "3px solid transparent",
                borderTopColor: "#4F46E5",
                borderRightColor: "#00D4FF",
              }}
            />
            <motion.div
              animate={{ rotate: -360 }}
              transition={{ repeat: Infinity, duration: 1.4, ease: "linear" }}
              style={{
                position: "absolute",
                inset: 10,
                borderRadius: "50%",
                border: "2px solid transparent",
                borderTopColor: "#00F5A0",
              }}
            />
            {/* Center dot */}
            <div style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}>
              <div style={{
                width: 10,
                height: 10,
                borderRadius: "50%",
                background: "linear-gradient(135deg,#4F46E5,#00D4FF)",
              }} />
            </div>
          </div>

          {/* Top progress bar */}
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.55, ease: "easeInOut" }}
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              right: 0,
              height: 3,
              background: "linear-gradient(90deg,#4F46E5,#00D4FF,#00F5A0)",
              transformOrigin: "left",
              zIndex: 10000,
            }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
