import mongoose, { Schema, Document } from "mongoose";

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

const CitationSchema = new Schema<ICitation>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    paperId: { type: Schema.Types.ObjectId, ref: "Paper" },
    title: { type: String, required: true },
    authors: [{ type: String }],
    year: { type: Number },
    journal: { type: String },
    doi: { type: String },
    url: { type: String },
    volume: { type: String },
    issue: { type: String },
    pages: { type: String },
    publisher: { type: String },
    apa: { type: String, default: "" },
    mla: { type: String, default: "" },
    ieee: { type: String, default: "" },
    chicago: { type: String, default: "" },
    bibtex: { type: String, default: "" },
    ris: { type: String, default: "" },
  },
  { timestamps: true }
);

export default mongoose.model<ICitation>("Citation", CitationSchema);
