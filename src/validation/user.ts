import { body } from "express-validator";
import { isEmail, isMobilePhone } from "../utils/string";

export const validateUpdateInfo = [
  body("full_name").not().isEmpty().withMessage("Name is emptied"),
  body("info")
    .not()
    .isEmpty()
    .withMessage("Info is emptied")
    .custom((info, { req }) => {
      const infoIsEmail = isEmail(info);
      const infoIsMobilePhone = isMobilePhone(info);
      if (!infoIsEmail || !infoIsMobilePhone) {
        return Promise.reject('Info is not valid')
      }
      return true
    }),
];
