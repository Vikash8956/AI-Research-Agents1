import { Response } from "express";
import { AuthRequest } from "../middleware/auth";
import Report from "../models/Report";
import { generateReportWithGranite } from "../services/watsonxService";

// POST /report — generate full report
export const generateReport = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { topic, context, paperId } = req.body;
    if (!topic) { res.status(400).json({ success: false, message: "Topic required" }); return; }
    const sections = await generateReportWithGranite(topic, context);
    const report = await Report.create({
      userId: req.userId,
      paperId,
      topic,
      ...sections,
      status: "complete",
    });
    res.status(201).json({ success: true, report });
  } catch (err) {
    res.status(500).json({ success: false, message: "Report generation failed", error: (err as Error).message });
  }
};

// GET /reports
export const getReports = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const reports = await Report.find({ userId: req.userId }).sort({ createdAt: -1 });
    res.json({ success: true, reports });
  } catch {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// GET /reports/:id
export const getReport = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const report = await Report.findOne({ _id: req.params.id, userId: req.userId });
    if (!report) { res.status(404).json({ success: false, message: "Report not found" }); return; }
    res.json({ success: true, report });
  } catch {
    res.status(500).json({ success: false, message: "Server error" });
  }
};
