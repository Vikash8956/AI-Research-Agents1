import mongoose, { Schema, Document } from "mongoose";
import bcrypt from "bcryptjs";

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  avatar?: string;
  role: "user" | "admin";
  isVerified: boolean;
  otp?: string;
  otpExpiry?: Date;
  refreshToken?: string;
  researchInterests: string[];
  apiKeys: { service: string; key: string }[];
  notificationsEnabled: boolean;
  theme: "dark" | "light";
  createdAt: Date;
  comparePassword(candidate: string): Promise<boolean>;
}

const UserSchema = new Schema<IUser>(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true, minlength: 6 },
    avatar: { type: String },
    role: { type: String, enum: ["user", "admin"], default: "user" },
    isVerified: { type: Boolean, default: false },
    otp: { type: String },
    otpExpiry: { type: Date },
    refreshToken: { type: String },
    researchInterests: [{ type: String }],
    apiKeys: [{ service: String, key: String }],
    notificationsEnabled: { type: Boolean, default: true },
    theme: { type: String, enum: ["dark", "light"], default: "dark" },
  },
  { timestamps: true }
);

UserSchema.pre<typeof UserSchema & { password: string; isModified: (p: string) => boolean }>("save", async function () {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const doc = this as any;
  if (!doc.isModified("password")) return;
  const salt = await bcrypt.genSalt(12);
  doc.password = await bcrypt.hash(doc.password, salt);
});

UserSchema.methods.comparePassword = async function (candidate: string): Promise<boolean> {
  return bcrypt.compare(candidate, this.password);
};

export default mongoose.model<IUser>("User", UserSchema);
