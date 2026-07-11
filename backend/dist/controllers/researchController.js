"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getHistory = exports.deletePaper = exports.getLibrary = exports.savePaper = exports.generateHypothesisHandler = exports.summarizePaper = exports.searchResearch = void 0;
const Paper_1 = __importDefault(require("../models/Paper"));
const arxivService_1 = require("../services/arxivService");
const watsonxService_1 = require("../services/watsonxService");
// POST /research — search papers
const searchResearch = async (req, res) => {
    try {
        const { query, year, journal, author, domain, page = 1, limit = 10 } = req.body;
        const arxivResults = await (0, arxivService_1.searchArxiv)(query, { year, author, domain, page, limit });
        res.json({ success: true, results: arxivResults, page, limit });
    }
    catch (err) {
        res.status(500).json({ success: false, message: "Search failed", error: err.message });
    }
};
exports.searchResearch = searchResearch;
// POST /summarize
const summarizePaper = async (req, res) => {
    try {
        const { text, title } = req.body;
        if (!text) {
            res.status(400).json({ success: false, message: "Text required" });
            return;
        }
        const result = await (0, watsonxService_1.summarizeWithGranite)(text, title);
        res.json({ success: true, ...result });
    }
    catch (err) {
        res.status(500).json({ success: false, message: "AI error", error: err.message });
    }
};
exports.summarizePaper = summarizePaper;
// POST /hypothesis
const generateHypothesisHandler = async (req, res) => {
    try {
        const { topic, context } = req.body;
        const hypothesis = await (0, watsonxService_1.generateHypothesis)(topic, context);
        res.json({ success: true, hypothesis });
    }
    catch (err) {
        res.status(500).json({ success: false, message: "AI error", error: err.message });
    }
};
exports.generateHypothesisHandler = generateHypothesisHandler;
// POST /save — save paper to library
const savePaper = async (req, res) => {
    try {
        const paper = await Paper_1.default.create({ ...req.body, userId: req.userId });
        res.status(201).json({ success: true, paper });
    }
    catch (err) {
        res.status(500).json({ success: false, message: "Save failed" });
    }
};
exports.savePaper = savePaper;
// GET /library
const getLibrary = async (req, res) => {
    try {
        const { folder, tag, bookmarked } = req.query;
        const filter = { userId: req.userId };
        if (folder)
            filter.folder = folder;
        if (tag)
            filter.tags = { $in: [tag] };
        if (bookmarked === "true")
            filter.bookmarked = true;
        const papers = await Paper_1.default.find(filter).sort({ createdAt: -1 });
        res.json({ success: true, papers });
    }
    catch {
        res.status(500).json({ success: false, message: "Server error" });
    }
};
exports.getLibrary = getLibrary;
// DELETE /library/:id
const deletePaper = async (req, res) => {
    try {
        await Paper_1.default.findOneAndDelete({ _id: req.params.id, userId: req.userId });
        res.json({ success: true, message: "Paper deleted" });
    }
    catch {
        res.status(500).json({ success: false, message: "Delete failed" });
    }
};
exports.deletePaper = deletePaper;
// GET /history
const getHistory = async (req, res) => {
    try {
        const papers = await Paper_1.default.find({ userId: req.userId }).select("title createdAt").sort({ createdAt: -1 }).limit(20);
        res.json({ success: true, papers });
    }
    catch {
        res.status(500).json({ success: false, message: "Server error" });
    }
};
exports.getHistory = getHistory;
//# sourceMappingURL=researchController.js.map