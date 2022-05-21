import { RequestHandler } from 'express';
import jwt from 'jsonwebtoken';
import { JWT_KEY } from '../constants/key';
import { JwtTokenResponse } from '../types/jwt';
import { getToken } from '../utils/string';

export const userMiddleware: RequestHandler = (req, res, next) => {
  try{
    const header = req.headers['authorization'];
    const token = getToken(header);
    if (!token) {
      return next();
    };
    const decodeToken = jwt.verify(token!, JWT_KEY) as JwtTokenResponse;
    if (!decodeToken) {
      return next();
    }
    const { username, id } = decodeToken;
    req.userId = id;
    req.username = username;
    next();
  }catch(err) {
    next();
  }
}