"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCitations = exports.createCitation = void 0;
const Citation_1 = __importDefault(require("../models/Citation"));
const citationService_1 = require("../services/citationService");
// POST /citation — generate citation formats
const createCitation = async (req, res) => {
    try {
        const { title, authors, year, journal, doi, url, volume, issue, pages, publisher, paperId } = req.body;
        const formatted = (0, citationService_1.formatCitations)({ title, authors, year, journal, doi, url, volume, issue, pages, publisher });
        const citation = await Citation_1.default.create({ userId: req.userId, paperId, title, authors, year, journal, doi, url, volume, issue, pages, publisher, ...formatted });
        res.status(201).json({ success: true, citation });
    }
    catch (err) {
        res.status(500).json({ success: false, message: "Citation failed", error: err.message });
    }
};
exports.createCitation = createCitation;
// GET /citations
const getCitations = async (req, res) => {
    try {
        const citations = await Citation_1.default.find({ userId: req.userId }).sort({ createdAt: -1 });
        res.json({ success: true, citations });
    }
    catch {
        res.status(500).json({ success: false, message: "Server error" });
    }
};
exports.getCitations = getCitations;
//# sourceMappingURL=citationController.js.map