import { body, param } from "express-validator";
import Product from "../models/Product";
import User from "../models/User";
import { isArray } from "../utils/type";

export const createProductValidation = [
  body("title").not().isEmpty().withMessage("Title is blanked!"),
  body("description").not().isEmpty().withMessage("Description is blanked"),
  body("images")
    .isArray({ min: 1, max: 10 })
    .withMessage("Product must have at least one image [1-10 images]"),
  body("price")
    .not()
    .isEmpty()
    .isNumeric()
    .withMessage("Product must have price"),
];

export const compareProductValidation = [
  body("product_id")
    .not()
    .isEmpty()
    .withMessage("Product is required")
    .custom(async (productId: string, { req }) => {
      try {
        const product = await Product.findById(productId);
        if (!product) {
          return Promise.reject("Product is not existed");
        }
        const user = await User.findById(req?.userId);
        if (!user) {
          return Promise.reject("unauthenticated");
        }
        const productIsExisted = user.compare_list?.some(
          (value) => value.toString() === productId
        );
        if (productIsExisted) {
          return Promise.reject("Product is existed in compare list");
        }
        if (user?.compare_list && user?.compare_list?.length > 4) {
          return Promise.reject(
            "Only allow compare 4 products! Please remove some product before continue"
          );
        }
        return true;
      } catch (err) {
        return Promise.reject("Product is not valid");
      }
    }),
];

export const deleteCompareProductValidation = [
  param("id")
    .not()
    .isEmpty()
    .withMessage("Product is not valid!")
    .custom(async (id, { req }) => {
      try {
        const userId = req?.userId;
        if (!userId) {
          return Promise.reject("unauthenticated");
        }
        const user = await User.findById(userId);
        if (!user) {
          return Promise.reject("unauthenticated");
        }
        const productIsCompared = user.compare_list?.some(
          (value) => value.toString() === id
        );
        if (!productIsCompared) {
          return Promise.reject("You haven't compared this product");
        }
        return true;
      } catch (err) {
        return Promise.reject(err);
      }
    }),
];

export const deleteProductsValidation = [
  body("id").custom(async (id, { req }) => {
    if (isArray<string>(id)) {
      const isValidArray = id.length > 0;

      return isValidArray ? true : Promise.reject('Products is not valid');
    };

    const product = await Product.findById(id);
    if (!product) {
      return Promise.reject('Product is not existed');
    };
    return true;
  }),
];

export const editProductValidation = [
  ...createProductValidation,
  param('id').custom(async (id, {req}) => {
    try{
      const product = await Product.findById(id);
      if (!product) {
        return Promise.reject('Product is not existed');
      };
      return true;
    }catch(err: any) {
      return Promise.reject(err?.message)
    }
  })
]