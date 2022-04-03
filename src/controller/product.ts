import { RequestHandler } from "express";
import { validationResult } from "express-validator";
import { PAGE_DEFAULT, PAGE_SIZE } from "../constants/string";
import Product from "../models/Product";
import { SortBaseRequest } from "../types/base";
import { ProductHandler } from "../types/product";

export const createProductController: RequestHandler = async (
  req,
  res,
  next
) => {
  const { description, images, price, stock_quantity, title, discount_price } =
    req.body as ProductHandler;
  const validate = validationResult(req);
  if (!validate.isEmpty()) {
    return res.status(422).json({
      message: validate.array()[0].msg,
      code: 422,
      errors: validate.array(),
    });
  }
  try {
    const product = new Product({
      description,
      images,
      price,
      stock_quantity,
      title,
      discount_price
    });
    await product.save();
    res.json({
      message: "successfully",
      code: 200,
      data: product,
    });
  } catch (err) {
    next(err);
  }
};

export const getProductController: RequestHandler = async (req, res, next) => {
  const {
    page = PAGE_DEFAULT,
    page_size = PAGE_SIZE,
    sort,
    key,
  } = req.query as SortBaseRequest;
  try {
    const sortObject = (sort && key) ? {
      [key]: sort
    } : {}
    let execCommand = await Product.find({})
      .skip((page - 1) * page_size)
      .limit(page_size).sort(sortObject);
    const documents = await Product.find({}).countDocuments();
    return res.json({
      message: "successfully",
      code: 200,
      data: execCommand,
      total_products: documents,
    });
  } catch (err) {
    next(err);
  }
};
