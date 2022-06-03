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
exports.useSocketMiddleWare = void 0;
const jsonwebtoken_1 = require("jsonwebtoken");
const socket_1 = require("../config/socket");
const key_1 = require("../constants/key");
const User_1 = __importDefault(require("../models/User"));
const useSocketMiddleWare = () => {
    return (0, socket_1.getSocket)().use((socket, next) => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        try {
            const token = (_a = socket.handshake.auth) === null || _a === void 0 ? void 0 : _a.token;
            if (!token) {
                throw new Error('Unauthenticated');
            }
            const decodeToken = (0, jsonwebtoken_1.verify)(token, key_1.JWT_KEY);
            const { id, username } = decodeToken;
            const user = yield User_1.default.findById(id);
            if (user) {
                socket.data.user = user;
            }
            socket.data.userId = id;
            socket.data.username = username;
            next();
        }
        catch (err) {
            next(new Error("Unauthenticated"));
        }
    }));
};
exports.useSocketMiddleWare = useSocketMiddleWare;
