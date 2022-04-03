"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authMiddleware = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const key_1 = require("../constants/key");
const string_1 = require("../utils/string");
const authMiddleware = (req, res, next) => {
    try {
        const header = req.headers['authorization'];
        const token = (0, string_1.getToken)(header);
        const response = {
            message: 'unauthenticated',
            code: 403
        };
        if (!token) {
            return res.status(403).json(response);
        }
        const decodeToken = jsonwebtoken_1.default.verify(token, key_1.JWT_KEY);
        if (!decodeToken) {
            return res.status(403).json(response);
        }
        const { username, id } = decodeToken;
        req.userId = id;
        req.username = username;
        next();
    }
    catch (err) {
        next(err);
    }
};
exports.authMiddleware = authMiddleware;
