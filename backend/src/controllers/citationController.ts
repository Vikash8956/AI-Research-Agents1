import { Response } from "express";
import { AuthRequest } from "../middleware/auth";
import Citation from "../models/Citation";
import { formatCitations } from "../services/citationService";

// POST /citation — generate citation formats
export const createCitation = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { title, authors, year, journal, doi, url, volume, issue, pages, publisher, paperId } = req.body;
    const formatted = formatCitations({ title, authors, year, journal, doi, url, volume, issue, pages, publisher });
    const citation = await Citation.create({ userId: req.userId, paperId, title, authors, year, journal, doi, url, volume, issue, pages, publisher, ...formatted });
    res.status(201).json({ success: true, citation });
  } catch (err) {
    res.status(500).json({ success: false, message: "Citation failed", error: (err as Error).message });
  }
};

// GET /citations
export const getCitations = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const citations = await Citation.find({ userId: req.userId }).sort({ createdAt: -1 });
    res.json({ success: true, citations });
  } catch {
    res.status(500).json({ success: false, message: "Server error" });
  }
};
