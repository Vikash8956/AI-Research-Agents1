import { Response } from "express";
import { AuthRequest } from "../middleware/auth";
import Paper from "../models/Paper";
import { searchArxiv } from "../services/arxivService";
import { summarizeWithGranite, generateHypothesis } from "../services/watsonxService";

// POST /research — search papers
export const searchResearch = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { query, year, journal, author, domain, page = 1, limit = 10 } = req.body;
    const arxivResults = await searchArxiv(query, { year, author, domain, page, limit });
    res.json({ success: true, results: arxivResults, page, limit });
  } catch (err) {
    res.status(500).json({ success: false, message: "Search failed", error: (err as Error).message });
  }
};

// POST /summarize
export const summarizePaper = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { text, title } = req.body;
    if (!text) { res.status(400).json({ success: false, message: "Text required" }); return; }
    const result = await summarizeWithGranite(text, title);
    res.json({ success: true, ...result });
  } catch (err) {
    res.status(500).json({ success: false, message: "AI error", error: (err as Error).message });
  }
};

// POST /hypothesis
export const generateHypothesisHandler = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { topic, context } = req.body;
    const hypothesis = await generateHypothesis(topic, context);
    res.json({ success: true, hypothesis });
  } catch (err) {
    res.status(500).json({ success: false, message: "AI error", error: (err as Error).message });
  }
};

// POST /save — save paper to library
export const savePaper = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const paper = await Paper.create({ ...req.body, userId: req.userId });
    res.status(201).json({ success: true, paper });
  } catch (err) {
    res.status(500).json({ success: false, message: "Save failed" });
  }
};

// GET /library
export const getLibrary = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { folder, tag, bookmarked } = req.query;
    const filter: Record<string, unknown> = { userId: req.userId };
    if (folder) filter.folder = folder;
    if (tag) filter.tags = { $in: [tag] };
    if (bookmarked === "true") filter.bookmarked = true;
    const papers = await Paper.find(filter).sort({ createdAt: -1 });
    res.json({ success: true, papers });
  } catch {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// DELETE /library/:id
export const deletePaper = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    await Paper.findOneAndDelete({ _id: req.params.id, userId: req.userId });
    res.json({ success: true, message: "Paper deleted" });
  } catch {
    res.status(500).json({ success: false, message: "Delete failed" });
  }
};

// GET /history
export const getHistory = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const papers = await Paper.find({ userId: req.userId }).select("title createdAt").sort({ createdAt: -1 }).limit(20);
    res.json({ success: true, papers });
  } catch {
    res.status(500).json({ success: false, message: "Server error" });
  }
};
