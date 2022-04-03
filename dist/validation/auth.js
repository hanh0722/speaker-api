"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.forgetPasswordValidation = exports.checkOTPValidation = exports.loginValidation = exports.otpValidation = exports.registerValidation = void 0;
const express_validator_1 = require("express-validator");
const string_1 = require("../constants/string");
const User_1 = __importDefault(require("../models/User"));
const string_2 = require("../utils/string");
exports.registerValidation = [
    (0, express_validator_1.body)("username")
        .isLength({ min: 1 })
        .withMessage("Username is not valid")
        .custom((username, { req }) => __awaiter(void 0, void 0, void 0, function* () {
        const user = yield User_1.default.findOne({ username: username });
        if (user) {
            return Promise.reject("User is existed with that username, please choose other username");
        }
    })),
    (0, express_validator_1.body)("info")
        .not()
        .isEmpty()
        .withMessage("Email or Mobile phone must be filled!")
        .custom((info, { req }) => {
        if (!(0, string_2.isEmail)(info) && !(0, string_2.isMobilePhone)(info)) {
            return Promise.reject("Email or Mobile phone is not valid");
        }
        return true;
    }),
    (0, express_validator_1.body)("name").isLength({ min: 1 }).withMessage("Name is not valid"),
    (0, express_validator_1.body)("password")
        .not()
        .isEmpty()
        .withMessage("Password is emptied")
        .custom((password, { req }) => {
        const passwordIsValid = string_1.REGEX_PASSWORD.test(password);
        if (!passwordIsValid) {
            return Promise.reject("Password must have at least 8 character with a number, a character and a special character");
        }
        return true;
    }),
];
exports.otpValidation = [
    (0, express_validator_1.body)("username")
        .not()
        .isEmpty()
        .withMessage("username is emptied")
        .custom((email, { req }) => __awaiter(void 0, void 0, void 0, function* () {
        const { validate_info, username } = req.body;
        if (!(0, string_2.isEmail)(validate_info) && !(0, string_2.isMobilePhone)(validate_info)) {
            return Promise.reject("Not validation");
        }
        const user = yield User_1.default.findOne({ username: username });
        if (!user || user.is_validation) {
            return Promise.reject("User is not existed or validated");
        }
        return true;
    })),
];
exports.loginValidation = [
    (0, express_validator_1.body)("username").not().isEmpty().withMessage("Username is blanked!"),
    (0, express_validator_1.body)("password").not().isEmpty().withMessage("Password must be filled!"),
];
exports.checkOTPValidation = [
    (0, express_validator_1.body)("otp")
        .not()
        .isEmpty()
        .withMessage("OTP is blanked!")
        .custom((otp, { req }) => {
        if (!otp) {
            return Promise.reject("OTP must require");
        }
        if (otp.toString().trim().length < 6) {
            return Promise.reject("OTP must have at least 6 number");
        }
        return true;
    }),
    (0, express_validator_1.body)("username")
        .not()
        .isEmpty()
        .withMessage("Username is not valid")
        .custom((username, { req }) => __awaiter(void 0, void 0, void 0, function* () {
        const user = yield User_1.default.findOne({ username: username });
        if (!user) {
            return Promise.reject("User is not existed");
        }
        return true;
    })),
];
exports.forgetPasswordValidation = [
    (0, express_validator_1.body)("username")
        .not()
        .isEmpty()
        .withMessage("Username is not valid")
        .custom((username, { req }) => __awaiter(void 0, void 0, void 0, function* () {
        const user = yield User_1.default.findOne({ username: username });
        if (!user) {
            return Promise.reject('User is not valid');
        }
        return true;
    })),
];
