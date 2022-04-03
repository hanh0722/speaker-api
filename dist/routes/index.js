"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.productRouter = exports.authRouter = exports.fileRouter = void 0;
const files_1 = __importDefault(require("./files"));
exports.fileRouter = files_1.default;
const auth_1 = __importDefault(require("./auth"));
exports.authRouter = auth_1.default;
const product_1 = __importDefault(require("./product"));
exports.productRouter = product_1.default;
