import mongoose, { Document } from "mongoose";
export interface ICitation extends Document {
    userId: mongoose.Types.ObjectId;
    paperId?: mongoose.Types.ObjectId;
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
    apa: string;
    mla: string;
    ieee: string;
    chicago: string;
    bibtex: string;
    ris: string;
}
declare const _default: mongoose.Model<ICitation, {}, {}, {}, Document<unknown, {}, ICitation, {}, mongoose.DefaultSchemaOptions> & ICitation & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
} & {
    id: string;
}, any, ICitation>;
export default _default;
//# sourceMappingURL=Citation.d.ts.map