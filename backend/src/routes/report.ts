import { Router } from "express";
import { generateReport, getReports, getReport } from "../controllers/reportController";
import { authenticateToken } from "../middleware/auth";

const router = Router();

router.post("/report", authenticateToken, generateReport);
router.get("/reports", authenticateToken, getReports);
router.get("/reports/:id", authenticateToken, getReport);

export default router;
