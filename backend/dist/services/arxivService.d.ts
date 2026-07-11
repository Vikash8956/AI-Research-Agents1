interface ArxivOptions {
    year?: number;
    author?: string;
    domain?: string;
    page?: number;
    limit?: number;
}
interface ArxivPaper {
    id: string;
    title: string;
    authors: string[];
    abstract: string;
    published: string;
    year: number;
    doi?: string;
    url: string;
    journal?: string;
    categories: string[];
}
export declare const searchArxiv: (query: string, options?: ArxivOptions) => Promise<ArxivPaper[]>;
export {};
//# sourceMappingURL=arxivService.d.ts.map