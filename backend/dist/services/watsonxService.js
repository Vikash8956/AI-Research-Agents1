"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateReportWithGranite = exports.generateHypothesis = exports.summarizeWithGranite = void 0;
const https_1 = __importDefault(require("https"));
const IBM_URL = process.env.IBM_WATSONX_URL || "https://us-south.ml.cloud.ibm.com";
const PROJECT_ID = process.env.IBM_WATSONX_PROJECT_ID || "";
const MODEL_ID = process.env.IBM_GRANITE_MODEL_ID || "ibm/granite-13b-instruct-v2";
let cachedToken = null;
let tokenExpiry = 0;
const getIBMToken = async () => {
    if (cachedToken && Date.now() < tokenExpiry)
        return cachedToken;
    const apiKey = process.env.IBM_WATSONX_API_KEY;
    if (!apiKey)
        throw new Error("IBM_WATSONX_API_KEY not configured");
    const body = `grant_type=urn:ibm:params:oauth:grant-type:apikey&apikey=${encodeURIComponent(apiKey)}`;
    const token = await new Promise((resolve, reject) => {
        const req = https_1.default.request({ hostname: "iam.cloud.ibm.com", path: "/identity/token", method: "POST", headers: { "Content-Type": "application/x-www-form-urlencoded", "Content-Length": Buffer.byteLength(body) } }, (res) => {
            let data = "";
            res.on("data", (c) => (data += c));
            res.on("end", () => { try {
                resolve(JSON.parse(data).access_token);
            }
            catch {
                reject(new Error("Token parse failed"));
            } });
        });
        req.on("error", reject);
        req.write(body);
        req.end();
    });
    cachedToken = token;
    tokenExpiry = Date.now() + 50 * 60 * 1000; // 50 min
    return token;
};
const callGranite = async (prompt, maxTokens = 800) => {
    const token = await getIBMToken();
    const url = new URL(`${IBM_URL}/ml/v1/text/generation?version=2023-05-29`);
    const body = JSON.stringify({
        model_id: MODEL_ID,
        input: prompt,
        parameters: { decoding_method: "greedy", max_new_tokens: maxTokens, stop_sequences: ["<END>"] },
        project_id: PROJECT_ID,
    });
    return new Promise((resolve, reject) => {
        const req = https_1.default.request({ hostname: url.hostname, path: url.pathname + url.search, method: "POST", headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}`, "Content-Length": Buffer.byteLength(body) } }, (res) => {
            let data = "";
            res.on("data", (c) => (data += c));
            res.on("end", () => {
                try {
                    const parsed = JSON.parse(data);
                    resolve(parsed.results?.[0]?.generated_text || "");
                }
                catch {
                    reject(new Error("Granite response parse failed"));
                }
            });
        });
        req.on("error", reject);
        req.write(body);
        req.end();
    });
};
// Summarize a research paper
const summarizeWithGranite = async (text, title = "") => {
    const truncated = text.substring(0, 3000);
    const prompt = `You are a research assistant. Analyze this paper${title ? ` titled "${title}"` : ""} and provide:
1. A concise 3-sentence summary
2. 3-5 key insights (bullet points)
3. 2-3 research gaps identified
4. Brief methodology description

Paper text: ${truncated}

Respond in this JSON format:
{"summary":"...","keyInsights":["..."],"researchGaps":["..."],"methodology":"..."}
<END>`;
    try {
        const raw = await callGranite(prompt, 600);
        const jsonMatch = raw.match(/\{[\s\S]*\}/);
        if (jsonMatch)
            return JSON.parse(jsonMatch[0]);
    }
    catch { /* fallback below */ }
    return {
        summary: `Analysis of: ${title || "the provided research paper"}. AI service temporarily unavailable — using offline mode.`,
        keyInsights: ["Key insights require IBM watsonx.ai configuration"],
        researchGaps: ["Research gaps analysis pending"],
        methodology: "Methodology extraction pending",
    };
};
exports.summarizeWithGranite = summarizeWithGranite;
// Generate research hypothesis
const generateHypothesis = async (topic, context = "") => {
    const prompt = `Generate 3 novel, testable research hypotheses for the topic: "${topic}".
${context ? `Context: ${context}` : ""}
Each hypothesis should be specific, measurable, and scientifically rigorous.
Format as numbered list.
<END>`;
    try {
        return await callGranite(prompt, 400);
    }
    catch {
        return `Hypothesis generation for "${topic}" requires IBM watsonx.ai configuration. Please add your API key to .env`;
    }
};
exports.generateHypothesis = generateHypothesis;
// Generate full research report
const generateReportWithGranite = async (topic, context = "") => {
    const sections = ["abstract", "introduction", "literatureReview", "methodology", "results", "discussion", "conclusion"];
    const results = {};
    for (const section of sections) {
        const prompt = `Write the ${section.replace(/([A-Z])/g, " $1").trim()} section for a research report on: "${topic}". ${context ? `Context: ${context}` : ""} Write 2-3 paragraphs. Be academic and rigorous.\n<END>`;
        try {
            results[section] = await callGranite(prompt, 500);
        }
        catch {
            results[section] = `${section} section for "${topic}" — IBM watsonx.ai configuration required.`;
        }
    }
    return results;
};
exports.generateReportWithGranite = generateReportWithGranite;
//# sourceMappingURL=watsonxService.js.map