"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const user_1 = require("../controller/user");
const user_2 = require("../middleware/user");
const user_3 = require("../validation/user");
const router = (0, express_1.Router)();
router.get('/search', user_2.userMiddleware, user_1.searchUserController);
router.put('/update', user_2.userMiddleware, user_3.validateUpdateInfo, user_1.updateInfoUserController);
exports.default = router;
