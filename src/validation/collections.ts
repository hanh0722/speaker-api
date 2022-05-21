import { body } from "express-validator";
import { isUrl } from "../utils/string";
export const createCollectionValidate = [
  body("image_url").custom((url: Array<string>, { req }) => {  
    if (!url) {
      return true;
    }
    const isValidImage = url.every(value => isUrl(value));
    if (!isValidImage) {
      return Promise.reject('Image is not valid')
    };
    return true;
  }),
  body('title').not().isEmail().withMessage('Title is blanked!')
];
