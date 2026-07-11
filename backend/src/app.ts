import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import connectDB from "./config/db";
import authRoutes from "./routes/auth";
import profileRoutes from "./routes/profile";
import researchRoutes from "./routes/research";
import reportRoutes from "./routes/report";
import citationRoutes from "./routes/citation";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Connect DB
connectDB();

// ── Body parsing FIRST (must be before rate limiters that inspect body) ────
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// ── Security headers ────────────────────────────────────────────────────────
app.use(helmet());

// ── CORS ────────────────────────────────────────────────────────────────────
app.use(cors({
  origin: [
    process.env.CLIENT_URL || "http://localhost:3000",
    "http://localhost:3000",
    "http://127.0.0.1:3000",
  ],
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));

// Preflight for all routes (use explicit wildcard for path-to-regexp v8+)
app.options("/{*splat}", cors());

// ── Rate limiting ────────────────────────────────────────────────────────────
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: "Too many requests, please slow down." },
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20, // more lenient for dev
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: "Too many auth attempts. Try again in 15 minutes." },
});

app.use("/api/", limiter);
app.use("/api/register", authLimiter);
app.use("/api/login", authLimiter);

// ── Routes ───────────────────────────────────────────────────────────────────
app.use("/api", authRoutes);
app.use("/api", profileRoutes);
app.use("/api", researchRoutes);
app.use("/api", reportRoutes);
app.use("/api", citationRoutes);

// ── Health check ─────────────────────────────────────────────────────────────
app.get("/health", (_req, res) => {
  res.json({ status: "ok", service: "ResearchAI Backend", version: "1.0.0" });
});

// ── 404 ──────────────────────────────────────────────────────────────────────
app.use((_req, res) => {
  res.status(404).json({ success: false, message: "Route not found" });
});

// ── Global error handler ─────────────────────────────────────────────────────
app.use((err: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error("Unhandled error:", err.message);
  res.status(500).json({ success: false, message: "Internal server error" });
});

app.listen(PORT, () => {
  console.log(`🚀 ResearchAI backend running on http://localhost:${PORT}`);
  console.log(`📧 Email mode: ${process.env.EMAIL_USER ? "SMTP" : "Console (dev)"}`);
  console.log(`🗄️  MongoDB: ${process.env.MONGO_URI || "NOT SET"}`);
});

export default app;
