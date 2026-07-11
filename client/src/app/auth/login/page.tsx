"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { FiMail, FiLock, FiEye, FiEyeOff, FiArrowRight } from "react-icons/fi";
import { useAuthStore } from "@/store/authStore";
import { useThemeStore } from "@/store/themeStore";
import GuestGuard from "@/components/GuestGuard";
import ThemeToggle from "@/components/ThemeToggle";

interface LoginForm {
  email: string;
  password: string;
}

export default function LoginPage() {
  const router = useRouter();
  const { login, isLoading } = useAuthStore();
  const { isDark } = useThemeStore();
  const [showPass, setShowPass] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<LoginForm>();

  const onSubmit = async (data: LoginForm) => {
    try {
      await login(data.email, data.password);
      toast.success("Welcome back!");
      router.push("/dashboard");
    } catch (err: unknown) {
      toast.error((err as Error).message || "Login failed");
    }
  };

  const cardBg = isDark ? "rgba(255,255,255,0.04)" : "rgba(255,255,255,0.92)";
  const cardBorder = isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)";
  const inputBg = isDark ? "rgba(255,255,255,0.05)" : "rgba(255,255,255,0.95)";
  const inputBorder = (err: boolean) => err
    ? "#EF4444"
    : isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.12)";
  const textCol = isDark ? "#fff" : "#0f0f1a";
  const mutedCol = isDark ? "rgba(255,255,255,0.5)" : "rgba(0,0,0,0.45)";
  const iconCol = isDark ? "rgba(255,255,255,0.4)" : "rgba(0,0,0,0.35)";

  return (
    <GuestGuard>
      <div style={{ minHeight: "100vh", background: "var(--bg)", display: "flex", flexDirection: "column", position: "relative" }}>
        {/* BG orbs */}
        <div style={{ position: "fixed", top: "20%", left: "15%", width: 300, height: 300, background: "radial-gradient(circle,rgba(79,70,229,0.2) 0%,transparent 70%)", borderRadius: "50%", pointerEvents: "none" }} />
        <div style={{ position: "fixed", bottom: "20%", right: "15%", width: 250, height: 250, background: "radial-gradient(circle,rgba(0,212,255,0.15) 0%,transparent 70%)", borderRadius: "50%", pointerEvents: "none" }} />

        {/* Top nav bar with theme toggle */}
        <nav style={{ padding: "16px 28px", display: "flex", alignItems: "center", justifyContent: "space-between", position: "relative", zIndex: 10 }}>
          <Link href="/" style={{ display: "flex", alignItems: "center", gap: 8, textDecoration: "none" }}>
            <div style={{ width: 28, height: 28, background: "linear-gradient(135deg,#4F46E5,#00D4FF)", borderRadius: 7 }} />
            <span style={{ fontFamily: "Poppins, sans-serif", fontWeight: 700, fontSize: 16, color: textCol }}>
              Research<span style={{ color: "#4F46E5" }}>AI</span>
            </span>
          </Link>
          <ThemeToggle size="sm" />
        </nav>

        {/* Centered card */}
        <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.4 }}
            style={{ width: "100%", maxWidth: 420, padding: "40px 36px", background: cardBg, border: `1px solid ${cardBorder}`, borderRadius: 24, backdropFilter: "blur(20px)", position: "relative", zIndex: 1 }}
          >
            <h1 style={{ fontFamily: "Poppins, sans-serif", fontSize: 26, fontWeight: 700, color: textCol, marginBottom: 6 }}>
              Welcome back
            </h1>
            <p style={{ color: mutedCol, fontSize: 14, marginBottom: 32 }}>
              Sign in to your ResearchAI account
            </p>

            <form onSubmit={handleSubmit(onSubmit)}>
              {/* Email */}
              <div style={{ marginBottom: 18 }}>
                <label style={{ fontSize: 13, color: mutedCol, display: "block", marginBottom: 8, fontWeight: 500 }}>Email Address</label>
                <div style={{ position: "relative" }}>
                  <FiMail style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: iconCol }} size={16} />
                  <input
                    type="email"
                    placeholder="you@example.com"
                    {...register("email", { required: "Email required", pattern: { value: /^\S+@\S+\.\S+$/, message: "Invalid email" } })}
                    style={{ width: "100%", padding: "12px 12px 12px 42px", background: inputBg, border: `1px solid ${inputBorder(!!errors.email)}`, borderRadius: 12, color: textCol, fontSize: 14, outline: "none", boxSizing: "border-box", transition: "border-color 0.2s" }}
                  />
                </div>
                {errors.email && <p style={{ color: "#EF4444", fontSize: 12, marginTop: 4 }}>{errors.email.message}</p>}
              </div>

              {/* Password */}
              <div style={{ marginBottom: 24 }}>
                <label style={{ fontSize: 13, color: mutedCol, display: "block", marginBottom: 8, fontWeight: 500 }}>Password</label>
                <div style={{ position: "relative" }}>
                  <FiLock style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: iconCol }} size={16} />
                  <input
                    type={showPass ? "text" : "password"}
                    placeholder="••••••••"
                    {...register("password", { required: "Password required", minLength: { value: 6, message: "Min 6 characters" } })}
                    style={{ width: "100%", padding: "12px 42px 12px 42px", background: inputBg, border: `1px solid ${inputBorder(!!errors.password)}`, borderRadius: 12, color: textCol, fontSize: 14, outline: "none", boxSizing: "border-box", transition: "border-color 0.2s" }}
                  />
                  <button type="button" onClick={() => setShowPass(!showPass)}
                    style={{ position: "absolute", right: 14, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: iconCol, padding: 0 }}>
                    {showPass ? <FiEyeOff size={16} /> : <FiEye size={16} />}
                  </button>
                </div>
                {errors.password && <p style={{ color: "#EF4444", fontSize: 12, marginTop: 4 }}>{errors.password.message}</p>}
              </div>

              {/* Submit button with spinner */}
              <motion.button
                type="submit"
                disabled={isLoading}
                whileHover={{ scale: isLoading ? 1 : 1.02 }}
                whileTap={{ scale: isLoading ? 1 : 0.98 }}
                style={{ width: "100%", padding: "13px", background: isLoading ? "rgba(79,70,229,0.5)" : "linear-gradient(135deg,#4F46E5,#7C3AED)", color: "#fff", border: "none", borderRadius: 12, fontSize: 15, fontWeight: 600, cursor: isLoading ? "not-allowed" : "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}
              >
                {isLoading ? (
                  <>
                    {/* Spinner */}
                    <motion.span
                      animate={{ rotate: 360 }}
                      transition={{ repeat: Infinity, duration: 0.8, ease: "linear" }}
                      style={{ width: 16, height: 16, border: "2px solid rgba(255,255,255,0.3)", borderTopColor: "#fff", borderRadius: "50%", display: "inline-block" }}
                    />
                    Signing in...
                  </>
                ) : (
                  <><span>Sign In</span><FiArrowRight /></>
                )}
              </motion.button>
            </form>

            <p style={{ textAlign: "center", marginTop: 24, fontSize: 14, color: mutedCol }}>
              Don&apos;t have an account?{" "}
              <Link href="/auth/register" style={{ color: "#4F46E5", textDecoration: "none", fontWeight: 600 }}>
                Create one free
              </Link>
            </p>
          </motion.div>
        </div>
      </div>
    </GuestGuard>
  );
}
