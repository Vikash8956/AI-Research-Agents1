import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import User from "../models/User";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const signOpts = (exp: string): any => ({ expiresIn: exp });

const generateTokens = (userId: string, role: string) => {
  const accessToken = jwt.sign(
    { userId, role },
    process.env.JWT_SECRET as string,
    signOpts(process.env.JWT_EXPIRES_IN || "15m")
  );
  const refreshToken = jwt.sign(
    { userId, role },
    process.env.JWT_REFRESH_SECRET as string,
    signOpts(process.env.JWT_REFRESH_EXPIRES_IN || "7d")
  );
  return { accessToken, refreshToken };
};

// ─────────────────────────────────────────────────────────────────────────────
// POST /register  — create account, mark verified, return tokens immediately
// ─────────────────────────────────────────────────────────────────────────────
export const register = async (req: Request, res: Response): Promise<void> => {
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

    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) {
      res.status(409).json({ success: false, message: "Email already registered. Please sign in." });
      return;
    }

    // Create user — isVerified: true, no OTP needed
    const user = await User.create({
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
  } catch (err) {
    console.error("Register error:", err);
    res.status(500).json({
      success: false,
      message: "Registration failed",
      error: process.env.NODE_ENV === "development" ? (err as Error).message : undefined,
    });
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// POST /login
// ─────────────────────────────────────────────────────────────────────────────
export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      res.status(400).json({ success: false, message: "Email and password are required" });
      return;
    }

    const user = await User.findOne({ email: email.toLowerCase() });
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
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ success: false, message: "Login failed" });
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// POST /refresh
// ─────────────────────────────────────────────────────────────────────────────
export const refreshToken = async (req: Request, res: Response): Promise<void> => {
  try {
    const token = req.cookies?.refreshToken || req.body.refreshToken;
    if (!token) {
      res.status(401).json({ success: false, message: "No refresh token" });
      return;
    }
    const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET as string) as { userId: string; role: string };
    const user = await User.findById(decoded.userId);
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
  } catch {
    res.status(403).json({ success: false, message: "Invalid or expired refresh token" });
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// POST /logout
// ─────────────────────────────────────────────────────────────────────────────
export const logout = async (req: Request, res: Response): Promise<void> => {
  try {
    const token = req.cookies?.refreshToken;
    if (token) {
      const user = await User.findOne({ refreshToken: token });
      if (user) { user.refreshToken = undefined; await user.save(); }
    }
    res.clearCookie("refreshToken");
    res.json({ success: true, message: "Logged out" });
  } catch {
    res.status(500).json({ success: false, message: "Logout failed" });
  }
};

// keep route file happy — verify-otp no longer needed but export a stub
export const verifyOTP = async (_req: Request, res: Response): Promise<void> => {
  res.json({ success: true, message: "OTP verification is disabled" });
};
