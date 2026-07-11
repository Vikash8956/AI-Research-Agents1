"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.searchArxiv = void 0;
const https_1 = __importDefault(require("https"));
const fetchXML = (url) => new Promise((resolve, reject) => {
    https_1.default.get(url, (res) => {
        let data = "";
        res.on("data", (chunk) => (data += chunk));
        res.on("end", () => resolve(data));
        res.on("error", reject);
    });
});
const parseArxivXML = (xml) => {
    const entries = xml.match(/<entry>([\s\S]*?)<\/entry>/g) || [];
    return entries.map((entry) => {
        const get = (tag) => entry.match(new RegExp(`<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`))?.[1]?.trim() || "";
        const getAll = (tag) => [...entry.matchAll(new RegExp(`<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`, "g"))].map((m) => m[1].trim());
        const id = get("id").split("/abs/")[1] || get("id");
        const published = get("published");
        const year = parseInt(published.split("-")[0]) || 0;
        const authorNodes = [...entry.matchAll(/<author>[\s\S]*?<name>([\s\S]*?)<\/name>[\s\S]*?<\/author>/g)].map((m) => m[1].trim());
        const categories = getAll("category").map((c) => c.replace(/.*term="([^"]+)".*/, "$1"));
        return {
            id,
            title: get("title").replace(/\s+/g, " "),
            authors: authorNodes,
            abstract: get("summary").replace(/\s+/g, " "),
            published,
            year,
            url: `https://arxiv.org/abs/${id}`,
            categories,
        };
    });
};
const searchArxiv = async (query, options = {}) => {
    const { author, page = 1, limit = 10 } = options;
    let searchQuery = `all:${encodeURIComponent(query)}`;
    if (author)
        searchQuery += `+AND+au:${encodeURIComponent(author)}`;
    const start = (page - 1) * limit;
    const url = `https://export.arxiv.org/api/query?search_query=${searchQuery}&start=${start}&max_results=${limit}&sortBy=relevance&sortOrder=descending`;
    const xml = await fetchXML(url);
    return parseArxivXML(xml);
};
exports.searchArxiv = searchArxiv;
//# sourceMappingURL=arxivService.js.map