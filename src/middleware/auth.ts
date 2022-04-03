import { RequestHandler } from "express";
import jwt from 'jsonwebtoken';
import { JWT_KEY } from "../constants/key";
import { JwtTokenResponse } from "../types/jwt";
import { getToken } from "../utils/string";

export const authMiddleware: RequestHandler = (req, res, next) => {
  try {
    const header = req.headers['authorization'];
    const token = getToken(header);
    const response = {
      message: 'unauthenticated',
      code: 403
    }
    if (!token) {
      return res.status(403).json(response);
    }
    const decodeToken = jwt.verify(token, JWT_KEY) as JwtTokenResponse;
    if (!decodeToken) {
      return res.status(403).json(response);
    }
    const { username, id } = decodeToken;
    req.userId = id;
    req.username = username;
    next();
  } catch (err) {
    next(err);
  }
};
