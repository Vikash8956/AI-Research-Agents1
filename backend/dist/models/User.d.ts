import mongoose, { Document } from "mongoose";
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
    apiKeys: {
        service: string;
        key: string;
    }[];
    notificationsEnabled: boolean;
    theme: "dark" | "light";
    createdAt: Date;
    comparePassword(candidate: string): Promise<boolean>;
}
declare const _default: mongoose.Model<IUser, {}, {}, {}, Document<unknown, {}, IUser, {}, mongoose.DefaultSchemaOptions> & IUser & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
} & {
    id: string;
}, any, IUser>;
export default _default;
//# sourceMappingURL=User.d.ts.map