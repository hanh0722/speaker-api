import { body } from "express-validator";
import { REGEX_PASSWORD } from "../constants/string";
import User from "../models/User";
import { UserHandler, UserRequest } from "../types/user";
import { isEmail, isMobilePhone } from "../utils/string";
export const registerValidation = [
  body("username")
    .isLength({ min: 1 })
    .withMessage("Username is not valid")
    .custom(async (username, { req }) => {
      const user = await User.findOne({ username: username });
      if (user) {
        return Promise.reject(
          "User is existed with that username, please choose other username"
        );
      }
    }),
  body("info")
    .not()
    .isEmpty()
    .withMessage("Email or Mobile phone must be filled!")
    .custom((info, { req }) => {
      if (!isEmail(info) && !isMobilePhone(info)) {
        return Promise.reject("Email or Mobile phone is not valid");
      }
      return true;
    }),
  body("name").isLength({ min: 1 }).withMessage("Name is not valid"),
  body("password")
    .not()
    .isEmpty()
    .withMessage("Password is emptied")
    .custom((password, { req }) => {
      const passwordIsValid = REGEX_PASSWORD.test(password);
      if (!passwordIsValid) {
        return Promise.reject(
          "Password must have at least 8 character with a number, a character and a special character"
        );
      }
      return true;
    }),
];

export const otpValidation = [
  body("username")
    .not()
    .isEmpty()
    .withMessage("username is emptied")
    .custom(async (email, { req }) => {
      const { validate_info, username } = <UserRequest>req.body;
      if (!isEmail(validate_info) && !isMobilePhone(validate_info)) {
        return Promise.reject("Not validation");
      }
      const user = await User.findOne({ username: username });
      if (!user || user.is_validation) {
        return Promise.reject("User is not existed or validated");
      }
      return true;
    }),
];

export const loginValidation = [
  body("username").not().isEmpty().withMessage("Username is blanked!"),
  body("password").not().isEmpty().withMessage("Password must be filled!"),
];

export const checkOTPValidation = [
  body("otp")
    .not()
    .isEmpty()
    .withMessage("OTP is blanked!")
    .custom((otp: number, { req }) => {
      if (!otp) {
        return Promise.reject("OTP must require");
      }
      if (otp.toString().trim().length < 6) {
        return Promise.reject("OTP must have at least 6 number");
      }
      return true;
    }),
  body("username")
    .not()
    .isEmpty()
    .withMessage("Username is not valid")
    .custom(async (username: string, { req }) => {
      const user = await User.findOne({ username: username });
      if (!user) {
        return Promise.reject("User is not existed");
      }
      return true;
    }),
];

export const forgetPasswordValidation = [
  body("username")
    .not()
    .isEmpty()
    .withMessage("Username is not valid")
    .custom(async (username, { req }) => {
      const user = await User.findOne({username: username});
      if (!user) {
        return Promise.reject('User is not valid');
      }
      return true;
    }),
];
