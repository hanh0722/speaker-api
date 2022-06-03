import { RequestHandler } from "express";
import { validationResult } from "express-validator";
import { getSocket } from "../config/socket";
import Chat from "../models/Chat";
import { ChatProps } from "../types/chat";

export const chatController: RequestHandler = (req, res, next) => {
  const { message, room, receiver } = req.body as ChatProps;
  try {
    const validation = validationResult(req);
    if (!validation.isEmpty()) {
      return res.status(422).json({
        message: validation.array()[0].msg,
        code: 422
      })
    };
    const io = getSocket();
    const chatMessage = new Chat({
      sender_id: req.userId,
      target_id: receiver,

    })
    io.to(room).emit("get-message", {
      message: message,
      room: room,
    });

    res.json({
      message: 'succesfully'
    })
  } catch (err) {
    next(err);
  }
};


