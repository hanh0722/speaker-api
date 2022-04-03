import { body } from "express-validator";

export const createProductValidation = [
  body('title').not().isEmpty().withMessage('Title is blanked!'),
  body('description').not().isEmpty().withMessage('Description is blanked'),
  body('images').isArray({min: 1, max: 10}).withMessage('Product must have at least one image [1-10 images]'),
  body('price').not().isEmpty().isNumeric().withMessage('Product must have price')
];
