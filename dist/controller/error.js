"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleError = void 0;
const handleError = (err, req, res, next) => {
    const message = (err === null || err === void 0 ? void 0 : err.message) || "Server Internal Error";
    const code = (err === null || err === void 0 ? void 0 : err.code) || 500;
    res.json({
        message: message,
        code: code,
    });
};
exports.handleError = handleError;
