export declare const summarizeWithGranite: (text: string, title?: string) => Promise<{
    summary: string;
    keyInsights: string[];
    researchGaps: string[];
    methodology: string;
}>;
export declare const generateHypothesis: (topic: string, context?: string) => Promise<string>;
export declare const generateReportWithGranite: (topic: string, context?: string) => Promise<Record<string, string>>;
//# sourceMappingURL=watsonxService.d.ts.map