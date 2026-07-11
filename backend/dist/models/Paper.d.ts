import mongoose, { Document } from "mongoose";
export interface IPaper extends Document {
    userId: mongoose.Types.ObjectId;
    title: string;
    authors: string[];
    abstract: string;
    doi?: string;
    journal?: string;
    year?: number;
    domain?: string;
    citationCount?: number;
    url?: string;
    fileUrl?: string;
    tags: string[];
    folder?: string;
    notes?: string;
    bookmarked: boolean;
    summary?: string;
    keyInsights?: string[];
    researchGaps?: string[];
    methodology?: string;
    createdAt: Date;
}
declare const _default: mongoose.Model<IPaper, {}, {}, {}, Document<unknown, {}, IPaper, {}, mongoose.DefaultSchemaOptions> & IPaper & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
} & {
    id: string;
}, any, IPaper>;
export default _default;
//# sourceMappingURL=Paper.d.ts.map