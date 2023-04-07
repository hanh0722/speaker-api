"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.chatController = void 0;
const express_validator_1 = require("express-validator");
const socket_1 = require("../config/socket");
const Chat_1 = __importDefault(require("../models/Chat"));
const chatController = (req, res, next) => {
    const { message, room, receiver } = req.body;
    try {
        const validation = (0, express_validator_1.validationResult)(req);
        if (!validation.isEmpty()) {
            return res.status(422).json({
                message: validation.array()[0].msg,
                code: 422
            });
        }
        ;
        const io = (0, socket_1.getSocket)();
        const chatMessage = new Chat_1.default({
            sender_id: req.userId,
            target_id: receiver,
        });
        console.log(io);
        io.to(room).emit("get-message", {
            message: message,
            room: room,
        });
        res.json({
            message: 'succesfully'
        });
    }
    catch (err) {
        next(err);
    }
};
exports.chatController = chatController;
