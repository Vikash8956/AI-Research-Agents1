"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const reportController_1 = require("../controllers/reportController");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
router.post("/report", auth_1.authenticateToken, reportController_1.generateReport);
router.get("/reports", auth_1.authenticateToken, reportController_1.getReports);
router.get("/reports/:id", auth_1.authenticateToken, reportController_1.getReport);
exports.default = router;
//# sourceMappingURL=report.js.map