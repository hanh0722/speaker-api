"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateUserByRole = void 0;
const roles_1 = require("../constants/roles");
const User_1 = __importDefault(require("../models/User"));
const validateUserByRole = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.userId) {
        return res.status(401).json({
            message: "unauthenticated",
            code: 401,
        });
    }
    try {
        const user = yield User_1.default.findById(req.userId);
        if (!user || !roles_1.ADMIN_ROLES.some((value) => value === user.role)) {
            return res.status(403).json({
                message: "You have not enough rules to continue",
                code: 403,
            });
        }
        next();
    }
    catch (err) {
        next(err);
    }
});
exports.validateUserByRole = validateUserByRole;
