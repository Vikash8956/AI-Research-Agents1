"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getReport = exports.getReports = exports.generateReport = void 0;
const Report_1 = __importDefault(require("../models/Report"));
const watsonxService_1 = require("../services/watsonxService");
// POST /report — generate full report
const generateReport = async (req, res) => {
    try {
        const { topic, context, paperId } = req.body;
        if (!topic) {
            res.status(400).json({ success: false, message: "Topic required" });
            return;
        }
        const sections = await (0, watsonxService_1.generateReportWithGranite)(topic, context);
        const report = await Report_1.default.create({
            userId: req.userId,
            paperId,
            topic,
            ...sections,
            status: "complete",
        });
        res.status(201).json({ success: true, report });
    }
    catch (err) {
        res.status(500).json({ success: false, message: "Report generation failed", error: err.message });
    }
};
exports.generateReport = generateReport;
// GET /reports
const getReports = async (req, res) => {
    try {
        const reports = await Report_1.default.find({ userId: req.userId }).sort({ createdAt: -1 });
        res.json({ success: true, reports });
    }
    catch {
        res.status(500).json({ success: false, message: "Server error" });
    }
};
exports.getReports = getReports;
// GET /reports/:id
const getReport = async (req, res) => {
    try {
        const report = await Report_1.default.findOne({ _id: req.params.id, userId: req.userId });
        if (!report) {
            res.status(404).json({ success: false, message: "Report not found" });
            return;
        }
        res.json({ success: true, report });
    }
    catch {
        res.status(500).json({ success: false, message: "Server error" });
    }
};
exports.getReport = getReport;
//# sourceMappingURL=reportController.js.map