import { Router } from "express";
import { createCitation, getCitations } from "../controllers/citationController";
import { authenticateToken } from "../middleware/auth";

const router = Router();

router.post("/citation", authenticateToken, createCitation);
router.get("/citations", authenticateToken, getCitations);

export default router;
