import { body } from "express-validator";

export const validateCreateBlog = [
  body('title').not().isEmpty().withMessage('Title is required'),
  body('short_description').not().isEmpty().withMessage('Short Description is required'),
  body('description').not().isEmpty().withMessage('Description is required'),
  body('cover_url').isURL().withMessage('Image URL is not valid'),
];

