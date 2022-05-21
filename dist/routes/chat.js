"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const chat_1 = require("../controller/chat");
const router = (0, express_1.Router)();
router.post("/chat", chat_1.chatController);
exports.default = router;
