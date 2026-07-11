import { Router } from "express";
import { searchResearch, summarizePaper, generateHypothesisHandler, savePaper, getLibrary, deletePaper, getHistory } from "../controllers/researchController";
import { authenticateToken } from "../middleware/auth";

const router = Router();

router.post("/research", authenticateToken, searchResearch);
router.post("/summarize", authenticateToken, summarizePaper);
router.post("/hypothesis", authenticateToken, generateHypothesisHandler);
router.post("/save", authenticateToken, savePaper);
router.get("/library", authenticateToken, getLibrary);
router.delete("/library/:id", authenticateToken, deletePaper);
router.get("/history", authenticateToken, getHistory);

export default router;
