"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyOTP = exports.logout = exports.refreshToken = exports.login = exports.register = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const User_1 = __importDefault(require("../models/User"));
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const signOpts = (exp) => ({ expiresIn: exp });
const generateTokens = (userId, role) => {
    const accessToken = jsonwebtoken_1.default.sign({ userId, role }, process.env.JWT_SECRET, signOpts(process.env.JWT_EXPIRES_IN || "15m"));
    const refreshToken = jsonwebtoken_1.default.sign({ userId, role }, process.env.JWT_REFRESH_SECRET, signOpts(process.env.JWT_REFRESH_EXPIRES_IN || "7d"));
    return { accessToken, refreshToken };
};
// ─────────────────────────────────────────────────────────────────────────────
// POST /register  — create account, mark verified, return tokens immediately
// ─────────────────────────────────────────────────────────────────────────────
const register = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        if (!name || !email || !password) {
            res.status(400).json({ success: false, message: "Name, email and password are required" });
            return;
        }
        if (password.length < 6) {
            res.status(400).json({ success: false, message: "Password must be at least 6 characters" });
            return;
        }
        if (!/^\S+@\S+\.\S+$/.test(email)) {
            res.status(400).json({ success: false, message: "Invalid email address" });
            return;
        }
        const existing = await User_1.default.findOne({ email: email.toLowerCase() });
        if (existing) {
            res.status(409).json({ success: false, message: "Email already registered. Please sign in." });
            return;
        }
        // Create user — isVerified: true, no OTP needed
        const user = await User_1.default.create({
            name: name.trim(),
            email: email.toLowerCase().trim(),
            password,
            isVerified: true,
        });
        // Issue tokens immediately so user is logged in right after register
        const { accessToken, refreshToken } = generateTokens(String(user._id), user.role);
        user.refreshToken = refreshToken;
        await user.save();
        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });
        res.status(201).json({
            success: true,
            message: "Account created successfully!",
            accessToken,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                avatar: user.avatar,
                role: user.role,
            },
        });
    }
    catch (err) {
        console.error("Register error:", err);
        res.status(500).json({
            success: false,
            message: "Registration failed",
            error: process.env.NODE_ENV === "development" ? err.message : undefined,
        });
    }
};
exports.register = register;
// ─────────────────────────────────────────────────────────────────────────────
// POST /login
// ─────────────────────────────────────────────────────────────────────────────
const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            res.status(400).json({ success: false, message: "Email and password are required" });
            return;
        }
        const user = await User_1.default.findOne({ email: email.toLowerCase() });
        if (!user || !(await user.comparePassword(password))) {
            res.status(401).json({ success: false, message: "Invalid email or password" });
            return;
        }
        const { accessToken, refreshToken } = generateTokens(String(user._id), user.role);
        user.refreshToken = refreshToken;
        await user.save();
        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });
        res.json({
            success: true,
            accessToken,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                avatar: user.avatar,
                role: user.role,
            },
        });
    }
    catch (err) {
        console.error("Login error:", err);
        res.status(500).json({ success: false, message: "Login failed" });
    }
};
exports.login = login;
// ─────────────────────────────────────────────────────────────────────────────
// POST /refresh
// ─────────────────────────────────────────────────────────────────────────────
const refreshToken = async (req, res) => {
    try {
        const token = req.cookies?.refreshToken || req.body.refreshToken;
        if (!token) {
            res.status(401).json({ success: false, message: "No refresh token" });
            return;
        }
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_REFRESH_SECRET);
        const user = await User_1.default.findById(decoded.userId);
        if (!user || user.refreshToken !== token) {
            res.status(403).json({ success: false, message: "Invalid refresh token" });
            return;
        }
        const { accessToken, refreshToken: newRefresh } = generateTokens(String(user._id), user.role);
        user.refreshToken = newRefresh;
        await user.save();
        res.cookie("refreshToken", newRefresh, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });
        res.json({ success: true, accessToken });
    }
    catch {
        res.status(403).json({ success: false, message: "Invalid or expired refresh token" });
    }
};
exports.refreshToken = refreshToken;
// ─────────────────────────────────────────────────────────────────────────────
// POST /logout
// ─────────────────────────────────────────────────────────────────────────────
const logout = async (req, res) => {
    try {
        const token = req.cookies?.refreshToken;
        if (token) {
            const user = await User_1.default.findOne({ refreshToken: token });
            if (user) {
                user.refreshToken = undefined;
                await user.save();
            }
        }
        res.clearCookie("refreshToken");
        res.json({ success: true, message: "Logged out" });
    }
    catch {
        res.status(500).json({ success: false, message: "Logout failed" });
    }
};
exports.logout = logout;
// keep route file happy — verify-otp no longer needed but export a stub
const verifyOTP = async (_req, res) => {
    res.json({ success: true, message: "OTP verification is disabled" });
};
exports.verifyOTP = verifyOTP;
//# sourceMappingURL=authController.js.map