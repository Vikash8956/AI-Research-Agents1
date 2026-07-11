"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const dotenv_1 = __importDefault(require("dotenv"));
const db_1 = __importDefault(require("./config/db"));
const auth_1 = __importDefault(require("./routes/auth"));
const profile_1 = __importDefault(require("./routes/profile"));
const research_1 = __importDefault(require("./routes/research"));
const report_1 = __importDefault(require("./routes/report"));
const citation_1 = __importDefault(require("./routes/citation"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 5000;
// Connect DB
(0, db_1.default)();
// ── Body parsing FIRST (must be before rate limiters that inspect body) ────
app.use(express_1.default.json({ limit: "10mb" }));
app.use(express_1.default.urlencoded({ extended: true }));
app.use((0, cookie_parser_1.default)());
// ── Security headers ────────────────────────────────────────────────────────
app.use((0, helmet_1.default)());
// ── CORS ────────────────────────────────────────────────────────────────────
app.use((0, cors_1.default)({
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
app.options("/{*splat}", (0, cors_1.default)());
// ── Rate limiting ────────────────────────────────────────────────────────────
const limiter = (0, express_rate_limit_1.default)({
    windowMs: 15 * 60 * 1000,
    max: 200,
    standardHeaders: true,
    legacyHeaders: false,
    message: { success: false, message: "Too many requests, please slow down." },
});
const authLimiter = (0, express_rate_limit_1.default)({
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
app.use("/api", auth_1.default);
app.use("/api", profile_1.default);
app.use("/api", research_1.default);
app.use("/api", report_1.default);
app.use("/api", citation_1.default);
// ── Health check ─────────────────────────────────────────────────────────────
app.get("/health", (_req, res) => {
    res.json({ status: "ok", service: "ResearchAI Backend", version: "1.0.0" });
});
// ── 404 ──────────────────────────────────────────────────────────────────────
app.use((_req, res) => {
    res.status(404).json({ success: false, message: "Route not found" });
});
// ── Global error handler ─────────────────────────────────────────────────────
app.use((err, _req, res, _next) => {
    console.error("Unhandled error:", err.message);
    res.status(500).json({ success: false, message: "Internal server error" });
});
app.listen(PORT, () => {
    console.log(`🚀 ResearchAI backend running on http://localhost:${PORT}`);
    console.log(`📧 Email mode: ${process.env.EMAIL_USER ? "SMTP" : "Console (dev)"}`);
    console.log(`🗄️  MongoDB: ${process.env.MONGO_URI || "NOT SET"}`);
});
exports.default = app;
//# sourceMappingURL=app.js.map