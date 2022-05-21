import { body } from "express-validator";
import { REGEX_PHONE } from "../constants/string";

const validationCreateAddress = [
  body('address').not().isEmpty().withMessage('Address must be filled'),
  body('city').not().isEmpty().withMessage('City must be filled'),
  body('country').not().isEmpty().withMessage('Country must be filled'),
  body('full_name').not().isEmpty().withMessage('Name is not valid'),
  body('phone_number').custom((phoneNumber, {req}) => {
    const isValidPhone = REGEX_PHONE.test(phoneNumber);
    if (!isValidPhone) {
      return Promise.reject('Phone is not valid');
    }
    return true;
  }),
  body('place').not().isEmpty().withMessage('Place must be filled'),
  body('zip_code').not().isEmpty().withMessage('Zip code must be filled')
];

export {
  validationCreateAddress
}