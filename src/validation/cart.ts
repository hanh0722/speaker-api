import { body } from "express-validator"
import Product from "../models/Product";

export const addToCartValidation = [
  body('quantity').isNumeric().withMessage('Quantity must be above 1')
  .custom((quantity, {req}) => {
    if (quantity < 1) {
      return Promise.reject('Product quantity must have at least 1')
    }
    return true;
  }),
  body('id').not().isEmpty().withMessage('Product must have id!')
  .custom(async (productId, {req}) => {
    try{
      const product = await Product.findById(productId);
      if (!product) {
        return Promise.reject('Product is not existed');
      }
      return true;
    }catch(err: any) {
      return Promise.reject('Product is not valid');
    }
  })
]