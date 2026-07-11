import mongoose, { Document } from "mongoose";
export interface IReport extends Document {
    userId: mongoose.Types.ObjectId;
    paperId?: mongoose.Types.ObjectId;
    topic: string;
    abstract: string;
    introduction: string;
    literatureReview: string;
    methodology: string;
    results: string;
    discussion: string;
    conclusion: string;
    references: string[];
    status: "draft" | "complete";
    exportFormat?: "pdf" | "docx" | "markdown";
    createdAt: Date;
}
declare const _default: mongoose.Model<IReport, {}, {}, {}, Document<unknown, {}, IReport, {}, mongoose.DefaultSchemaOptions> & IReport & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
} & {
    id: string;
}, any, IReport>;
export default _default;
//# sourceMappingURL=Report.d.ts.map