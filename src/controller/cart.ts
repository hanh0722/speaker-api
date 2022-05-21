import { RequestHandler } from "express";
import { validationResult } from "express-validator";
import { PAGE_DEFAULT, PAGE_SIZE } from "../constants/string";
import User from "../models/User";
import { SortBaseRequest } from "../types/base";
import { CartRequest } from "../types/cart";

export const addCartController: RequestHandler = async (req, res, next) => {
  const { id, quantity } = req.body as CartRequest;
  const validation = validationResult(req);
  if (!validation.isEmpty()) {
    return res.status(422).json({
      message: validation.array()[0].msg,
      code: 422,
      errors: validation.array(),
    });
  }

  try {
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({
        message: "User is not valid",
        code: 404,
      });
    }
    const result = await user.addToCartUser(id!, quantity);
    res.json({
      message: "successfully",
      code: 200,
      data: result,
    });
  } catch (err) {
    next(err);
  }
};

export const getCartController: RequestHandler = async (req, res, next) => {
  const {
    key,
    page = PAGE_DEFAULT,
    page_size = PAGE_SIZE,
    sort,
  } = req.query as SortBaseRequest;
  try {
    const userId = req.userId;
    if (!userId) {
      return res.status(403).json({
        message: "unauthenticated",
        code: 403,
      });
    }
    let user;
    let sortObject;
    if (sort && key) {
      sortObject = {
        [key]: sort,
      };
    }
    const totalProducts = await User.findById(userId)
      .populate("cart.productId")
      .countDocuments();
    if (page_size === -1) {
      user = await User.findById(userId)
        .populate("cart.productId")
        .sort(sortObject);
    } else {
      user = await User.findById(userId)
        .populate("cart.productId")
        .skip((+page - 1) * page_size)
        .limit(page_size)
        .sort(sortObject);
    }
    if (!user) {
      return res.status(401).json({
        message: "user is not valid",
        code: 401,
      });
    }
    res.json({
      message: "successfully",
      code: 200,
      data: user.cart,
      total_products: totalProducts,
    });
  } catch (err) {
    next(err);
  }
};

export const deleteCartController: RequestHandler = async (req, res, next) => {
  const { quantity = 1, id } = req.query as CartRequest;
  try {
    const userId = req.userId;
    if (!userId) {
      return res.status(403).json({
        message: "unauthenticated",
        code: 403,
      });
    }
    if (!id) {
      return res.status(422).json({
        message: 'Product is not valid',
        code: 422
      })
    };
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        message: 'user is not valid',
        code: 404
      })
    };
    user.deleteItemCartUser(id, +quantity);
    res.json({
      message: 'successfully',
      code: 200
    });
  } catch (err) {
    next(err);
  }
};
