"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const files_1 = require("../controller/files");
const router = (0, express_1.Router)();
router.post('/upload', files_1.uploadImage);
exports.default = router;
