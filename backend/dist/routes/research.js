"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const researchController_1 = require("../controllers/researchController");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
router.post("/research", auth_1.authenticateToken, researchController_1.searchResearch);
router.post("/summarize", auth_1.authenticateToken, researchController_1.summarizePaper);
router.post("/hypothesis", auth_1.authenticateToken, researchController_1.generateHypothesisHandler);
router.post("/save", auth_1.authenticateToken, researchController_1.savePaper);
router.get("/library", auth_1.authenticateToken, researchController_1.getLibrary);
router.delete("/library/:id", auth_1.authenticateToken, researchController_1.deletePaper);
router.get("/history", auth_1.authenticateToken, researchController_1.getHistory);
exports.default = router;
//# sourceMappingURL=research.js.map