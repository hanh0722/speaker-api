"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const chat_1 = require("../controller/chat");
const auth_1 = require("../middleware/auth");
const chat_2 = require("../validation/chat");
const router = (0, express_1.Router)();
router.post("/create", auth_1.authMiddleware, chat_2.ChatValidation, chat_1.chatController);
exports.default = router;
