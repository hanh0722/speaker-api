import { verify } from "jsonwebtoken";
import { getSocket } from "../config/socket";
import { JWT_KEY } from "../constants/key";
import { JwtTokenResponse } from "../types/jwt";
import User from '../models/User';

export const useSocketMiddleWare = () => {
  return getSocket().use(async (socket, next) => {
    try {
      const token = socket.handshake.auth?.token;
      if (!token) {
        throw new Error('Unauthenticated');
      }
      const decodeToken = verify(token, JWT_KEY) as JwtTokenResponse;

      const { id, username } = decodeToken;
      const user = await User.findById(id);
      if (user) {
        socket.data.user = user;
      }
      socket.data.userId = id;
      socket.data.username = username;
      next();
    } catch (err) {
      next(new Error("Unauthenticated"));
    }
  });
};
