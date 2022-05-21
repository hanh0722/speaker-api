import { RequestHandler } from "express";
import { validationResult } from "express-validator";
import { PAGE_DEFAULT, PAGE_SIZE } from "../constants/string";
import Product from "../models/Product";
import User from "../models/User";
import { SortBaseRequest } from "../types/base";
import { ProductHandler } from "../types/product";
import { ProductRequestCompare } from "../types/user";
import { generateRegexFindObject, generateSortObject } from "../utils/query";
import { getFieldOfUser } from "../utils/response";
import { isArray } from "../utils/type";

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
      discount_price,
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
    query,
    value,
  } = req.query as SortBaseRequest;
  try {
    const sortObject = generateSortObject(key, sort);
    const regexFindObject = generateRegexFindObject(query, value);
    let execCommand = await Product.find(regexFindObject)
      .populate("collections")
      .skip((+page - 1) * page_size)
      .limit(page_size)
      .sort(sortObject);
    const documents = await Product.find(regexFindObject).countDocuments();
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

export const getProductByIdController: RequestHandler = async (
  req,
  res,
  next
) => {
  const { id } = req.params;
  if (!id) {
    return res.status(422).json({
      message: "invalid",
      code: 422,
    });
  }
  try {
    const product = await Product.findById(id);
    const user = await getFieldOfUser(req.userId);
    const isCompared = !!user?.compare_list?.find(item => item?._id?.toString() === id?.toString());
    if (!product) {
      return res.status(404).json({
        message: "Product is not existed",
        code: 404,
      });
    }
    res.json({
      code: 200,
      message: "successfully",
      data: {
        ...product._doc,
        is_compared: isCompared
      },
    });
  } catch (err) {
    next(err);
  }
};

export const addCompareProductToUserController: RequestHandler = async (
  req,
  res,
  next
) => {
  const { product_id } = req.body as ProductRequestCompare;
  try {
    const validation = validationResult(req);
    if (!validation.isEmpty()) {
      return res.status(422).json({
        message: validation.array()[0].msg,
        code: 422,
        errors: validation.array(),
      });
    }
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(401).json({
        message: "Unauthenticated",
        code: 401,
      });
    }
    user.compare_list?.push(product_id);
    await user.save();
    res.json({
      message: 'successfully',
      code: 200
    })
  } catch (err) {
    next(err);
  }
};

export const suggestProductsController: RequestHandler = async (req, res, next) => {
  const { id } = req.params;
  const { page_size = PAGE_SIZE, sort, key } = req.query as SortBaseRequest
  if (!id) {
    return res.status(422).json({
      message: 'Not valid product',
      code: 422
    })
  };
  try{
    let sortObject = {'creation_time': -1};
    if (sort && key) {
      sortObject = {
        ...sortObject,
        [key]: sort
      }
    }
    const products = await Product.find({}).sort(sortObject).limit(page_size);
    const filterProducts = products.filter(item => item?._id?.toString() !== id);
    res.json({
      message: 'successfully',
      code: 200,
      data: filterProducts
    });
  }catch(err) {
    next(err);
  }
};

export const onDeleteCompareProduct: RequestHandler = async (req, res, next) => {
  const { id } = req.params;
  try{
    const validation = validationResult(req);
    if (!validation.isEmpty()) {
      return res.status(401).json({
        message: validation.array()[0].msg,
        code: 401,
        errors: validation.array()
      });
    }
    const user = await User.findById(req.userId)!;
    const listCompareAfterRemove = user?.compare_list?.filter(item => {
      return item.toString() !== id;
    });
    user!.compare_list = listCompareAfterRemove;
    await user?.save();
    res.json({
      message: 'successfully',
      code: 200
    })
  }catch(err){
    next(err);
  }
}

export const onHandleDeleteProduct: RequestHandler = async (req, res, next) => {
  const { id } = req.body ;
  try{
    const validation = validationResult(req);
    if (!validation.isEmpty()) {
      return res.status(400).json({
        message: validation.array()[0].msg,
        code: 400,
        errors: validation.array()
      })
    }
    await Product.deleteMany({_id: {$in: isArray(id) ? [...id] : [id]}});
    return res.json({
      message: 'successfully',
      code: 200,
      items: id
    })
  }catch(err) {
    console.log(err);
    next(err);
  }
}

export const onEditProduct: RequestHandler = async (req, res, next) => {
  try{
    const productId = req.params['id']!;
    const { title, description, images, price, stock_quantity, discount_price } = req.body as ProductHandler;
    const validation = validationResult(req);
    if (!validation.isEmpty()) {
      return res.status(422).json({
        message: validation.array()[0].msg,
        code: 422,
        errors: validation.array()
      });
    };
    const product = await Product.findById(productId)!;
    if (!product) {
      return res.status(404).json({
        message: 'Product is not existed',
        code: 404
      });
    };
    product.title = title;
    product.description = description;
    product.images = images;
    product.price = price;
    if (stock_quantity >= 0) {
      product.stock_quantity = stock_quantity;
    }
    if (discount_price) {
      product.discount_price = discount_price;
    }

    await product.save();
    res.json({
      message: 'Successfully',
      code: 200
    });
  }catch(err) {
    next(err);
  }
}