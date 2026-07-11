import { Response } from "express";
import { AuthRequest } from "../middleware/auth";
import User from "../models/User";
import Paper from "../models/Paper";
import Report from "../models/Report";

// GET /profile
export const getProfile = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const user = await User.findById(req.userId).select("-password -otp -otpExpiry -refreshToken");
    if (!user) { res.status(404).json({ success: false, message: "User not found" }); return; }
    const papersCount = await Paper.countDocuments({ userId: req.userId });
    const reportsCount = await Report.countDocuments({ userId: req.userId });
    res.json({ success: true, user, stats: { papers: papersCount, reports: reportsCount } });
  } catch {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// PUT /profile
export const updateProfile = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { name, researchInterests, notificationsEnabled, theme } = req.body;
    const user = await User.findByIdAndUpdate(req.userId, { name, researchInterests, notificationsEnabled, theme }, { new: true }).select("-password -otp -otpExpiry -refreshToken");
    res.json({ success: true, user });
  } catch {
    res.status(500).json({ success: false, message: "Server error" });
  }
};
