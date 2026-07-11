interface CitationData {
    title: string;
    authors: string[];
    year?: number;
    journal?: string;
    doi?: string;
    url?: string;
    volume?: string;
    issue?: string;
    pages?: string;
    publisher?: string;
}
export declare const formatCitations: (data: CitationData) => {
    apa: string;
    mla: string;
    ieee: string;
    chicago: string;
    bibtex: string;
    ris: string;
};
export {};
//# sourceMappingURL=citationService.d.ts.map