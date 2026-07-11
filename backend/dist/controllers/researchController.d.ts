import { Response } from "express";
import { AuthRequest } from "../middleware/auth";
export declare const searchResearch: (req: AuthRequest, res: Response) => Promise<void>;
export declare const summarizePaper: (req: AuthRequest, res: Response) => Promise<void>;
export declare const generateHypothesisHandler: (req: AuthRequest, res: Response) => Promise<void>;
export declare const savePaper: (req: AuthRequest, res: Response) => Promise<void>;
export declare const getLibrary: (req: AuthRequest, res: Response) => Promise<void>;
export declare const deletePaper: (req: AuthRequest, res: Response) => Promise<void>;
export declare const getHistory: (req: AuthRequest, res: Response) => Promise<void>;
//# sourceMappingURL=researchController.d.ts.map