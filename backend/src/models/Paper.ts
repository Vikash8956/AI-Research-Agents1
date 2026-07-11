import mongoose, { Schema, Document } from "mongoose";

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

const PaperSchema = new Schema<IPaper>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    title: { type: String, required: true },
    authors: [{ type: String }],
    abstract: { type: String },
    doi: { type: String },
    journal: { type: String },
    year: { type: Number },
    domain: { type: String },
    citationCount: { type: Number, default: 0 },
    url: { type: String },
    fileUrl: { type: String },
    tags: [{ type: String }],
    folder: { type: String, default: "General" },
    notes: { type: String },
    bookmarked: { type: Boolean, default: false },
    summary: { type: String },
    keyInsights: [{ type: String }],
    researchGaps: [{ type: String }],
    methodology: { type: String },
  },
  { timestamps: true }
);

PaperSchema.index({ userId: 1, title: "text", abstract: "text" });

export default mongoose.model<IPaper>("Paper", PaperSchema);
