"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const citationController_1 = require("../controllers/citationController");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
router.post("/citation", auth_1.authenticateToken, citationController_1.createCitation);
router.get("/citations", auth_1.authenticateToken, citationController_1.getCitations);
exports.default = router;
//# sourceMappingURL=citation.js.map