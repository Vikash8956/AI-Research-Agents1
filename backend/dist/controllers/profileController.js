"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateProfile = exports.getProfile = void 0;
const User_1 = __importDefault(require("../models/User"));
const Paper_1 = __importDefault(require("../models/Paper"));
const Report_1 = __importDefault(require("../models/Report"));
// GET /profile
const getProfile = async (req, res) => {
    try {
        const user = await User_1.default.findById(req.userId).select("-password -otp -otpExpiry -refreshToken");
        if (!user) {
            res.status(404).json({ success: false, message: "User not found" });
            return;
        }
        const papersCount = await Paper_1.default.countDocuments({ userId: req.userId });
        const reportsCount = await Report_1.default.countDocuments({ userId: req.userId });
        res.json({ success: true, user, stats: { papers: papersCount, reports: reportsCount } });
    }
    catch {
        res.status(500).json({ success: false, message: "Server error" });
    }
};
exports.getProfile = getProfile;
// PUT /profile
const updateProfile = async (req, res) => {
    try {
        const { name, researchInterests, notificationsEnabled, theme } = req.body;
        const user = await User_1.default.findByIdAndUpdate(req.userId, { name, researchInterests, notificationsEnabled, theme }, { new: true }).select("-password -otp -otpExpiry -refreshToken");
        res.json({ success: true, user });
    }
    catch {
        res.status(500).json({ success: false, message: "Server error" });
    }
};
exports.updateProfile = updateProfile;
//# sourceMappingURL=profileController.js.map