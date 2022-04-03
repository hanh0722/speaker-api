import { RequestHandler } from "express";
import { ADMIN_ROLES } from "../constants/roles";
import User from "../models/User";

export const validateUserByRole: RequestHandler = async (req, res, next) => {
  if (!req.userId) {
    return res.status(401).json({
      message: "unauthenticated",
      code: 401,
    });
  }
  try {
    const user = await User.findById(req.userId);
    if (!user || !ADMIN_ROLES.some((value) => value === user.role)) {
      return res.status(403).json({
        message: "You have not enough rules to continue",
        code: 403,
      });
    }
    next();
  } catch (err) {
    next(err);
  }
};
