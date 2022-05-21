"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userMiddleware = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const key_1 = require("../constants/key");
const string_1 = require("../utils/string");
const userMiddleware = (req, res, next) => {
    try {
        const header = req.headers['authorization'];
        const token = (0, string_1.getToken)(header);
        if (!token) {
            return next();
        }
        ;
        const decodeToken = jsonwebtoken_1.default.verify(token, key_1.JWT_KEY);
        if (!decodeToken) {
            return next();
        }
        const { username, id } = decodeToken;
        req.userId = id;
        req.username = username;
        next();
    }
    catch (err) {
        next();
    }
};
exports.userMiddleware = userMiddleware;
