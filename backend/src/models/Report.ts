import mongoose, { Schema, Document } from "mongoose";

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

const ReportSchema = new Schema<IReport>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    paperId: { type: Schema.Types.ObjectId, ref: "Paper" },
    topic: { type: String, required: true },
    abstract: { type: String, default: "" },
    introduction: { type: String, default: "" },
    literatureReview: { type: String, default: "" },
    methodology: { type: String, default: "" },
    results: { type: String, default: "" },
    discussion: { type: String, default: "" },
    conclusion: { type: String, default: "" },
    references: [{ type: String }],
    status: { type: String, enum: ["draft", "complete"], default: "draft" },
    exportFormat: { type: String, enum: ["pdf", "docx", "markdown"] },
  },
  { timestamps: true }
);

export default mongoose.model<IReport>("Report", ReportSchema);
