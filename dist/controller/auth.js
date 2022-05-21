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
exports.resetPasswordController = exports.validateOTPController = exports.loginByTokenController = exports.loginController = exports.SendOTPController = exports.RegisterController = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const uuid_1 = require("uuid");
const express_validator_1 = require("express-validator");
const bcrypt_1 = __importDefault(require("bcrypt"));
const User_1 = __importDefault(require("../models/User"));
const string_1 = require("../utils/string");
const mail_1 = require("../utils/mail");
const sms_1 = require("../utils/sms");
const key_1 = require("../constants/key");
const response_1 = require("../utils/response");
const RegisterController = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, password, name, info } = req.body;
    if (!username || !password || !name || !info) {
        return res.status(401).json({
            message: "Not validation",
            code: 401,
        });
    }
    const validate = (0, express_validator_1.validationResult)(req);
    if (!validate.isEmpty()) {
        return res.status(422).json({
            message: validate.array()[0].msg,
            code: 422,
            errors: validate.array(),
        });
    }
    const hash = yield bcrypt_1.default.hash(password, 10);
    try {
        const user = new User_1.default({
            username,
            password: hash,
            is_validation: false,
            name: name,
            info: info,
        });
        yield user.save();
        res.json({
            message: "succesfully",
            code: 200,
        });
    }
    catch (err) {
        next(err);
    }
});
exports.RegisterController = RegisterController;
const SendOTPController = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, validate_info } = req.body;
    if (!username || !validate_info) {
        return res.status(401).json({
            message: "Not valid information",
            code: 401,
        });
    }
    const validate = (0, express_validator_1.validationResult)(req);
    if (!validate.isEmpty()) {
        return res.json({
            message: validate.array()[0].msg,
            code: 422,
            errors: validate.array(),
        });
    }
    try {
        const user = yield User_1.default.findOne({ username: username });
        const otp = (0, string_1.randomNumberByRange)(100000, 999999);
        if (user) {
            if ((0, string_1.isEmail)(validate_info)) {
                const sendMailToUser = yield (0, mail_1.sendEmail)({
                    to: validate_info,
                    subject: "OTP for validate account",
                    text: "Thank you for register your account in our service",
                    html: `<p style="text-align: center">OTP for validate account: ${otp}</p>`,
                });
                console.log(sendMailToUser);
            }
            else {
                const sendSMSToUser = yield (0, sms_1.sendSMS)({
                    body: `OTP for validate account ${otp}`,
                    to: (0, string_1.convertNormalPhoneToCountryCode)(validate_info),
                });
                console.log(sendSMSToUser);
            }
            user.validate_info = {
                otp: otp,
                time_expiration: Date.now() + 5 * 60 * 1000,
                token_email: (0, string_1.isEmail)(validate_info) ? (0, uuid_1.v4)() : undefined,
            };
            user.is_validation = true;
            yield user.save();
            return res.json({
                message: `send otp successfully to ${username}, otp will expire after 5 minutes`,
                code: 200,
            });
        }
        res.status(403).json({
            message: "not validation",
            code: 403,
        });
    }
    catch (err) {
        next(err);
    }
});
exports.SendOTPController = SendOTPController;
const loginController = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, password } = req.body;
    const validation = (0, express_validator_1.validationResult)(req);
    if (!validation.isEmpty()) {
        return res.json({
            message: validation.array()[0].msg,
            code: 401,
            errors: validation.array(),
        });
    }
    try {
        const response = {
            message: "Username or password is not correct",
            code: 422,
        };
        const user = yield User_1.default.findOne({ username: username }).populate([
            'compare_list',
            'address'
        ]);
        if (!user) {
            return res.status(422).json(response);
        }
        const passwordIsMatch = yield bcrypt_1.default.compare(password, user.password);
        if (!passwordIsMatch) {
            return res.status(403).json(response);
        }
        if (user && !(user === null || user === void 0 ? void 0 : user.is_validation)) {
            return res.status(403).json({
                message: "Your account is not validate, please validate first",
                code: 403,
            });
        }
        const token = jsonwebtoken_1.default.sign({
            id: user._id,
            username: user.username,
        }, key_1.JWT_KEY, {
            expiresIn: "24h",
        });
        res.json({
            code: 200,
            message: "successfully",
            token: token,
            user: (0, response_1.getUserResponse)(user),
            exp_time: Date.now() + 24 * 60 * 60 * 1000,
        });
    }
    catch (err) {
        next(err);
    }
});
exports.loginController = loginController;
const loginByTokenController = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const header = req.headers["authorization"];
    try {
        const token = (0, string_1.getToken)(header);
        if (token) {
            const parsedToken = jsonwebtoken_1.default.decode(token);
            const user = yield User_1.default.findById(parsedToken.id).populate([
                'compare_list',
                'address'
            ]);
            if (user) {
                req.userId = user._id;
                req.username = user.username;
                return res.json({
                    message: "successfully",
                    code: 200,
                    user: (0, response_1.getUserResponse)(user),
                    token: token,
                    exp_time: parsedToken.exp * 1000,
                });
            }
        }
    }
    catch (err) {
        next();
    }
    next();
});
exports.loginByTokenController = loginByTokenController;
const validateOTPController = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const { username, otp } = req.body;
    try {
        const validation = (0, express_validator_1.validationResult)(req);
        if (!validation.isEmpty()) {
            return res.status(422).json({
                message: validation.array()[0].msg,
                code: 422,
                errors: validation.array(),
            });
        }
        const user = yield User_1.default.findOne({ username: username });
        if (!user) {
            return res.status(404).json({
                message: "User is not existed",
                code: 404,
            });
        }
        if (user === null || user === void 0 ? void 0 : user.validate_info) {
            const otpBefore = (_a = user === null || user === void 0 ? void 0 : user.validate_info) === null || _a === void 0 ? void 0 : _a.otp;
            const time_expiration = (_b = user === null || user === void 0 ? void 0 : user.validate_info) === null || _b === void 0 ? void 0 : _b.time_expiration;
            if (otpBefore !== otp) {
                return res.status(401).json({
                    message: "OTP is not matched!",
                    code: 401,
                });
            }
            if (Date.now() > time_expiration) {
                return res.status(400).json({
                    message: "OTP is expired! please send other otp",
                    code: 400,
                });
            }
            user.validate_info = undefined;
            yield user.save();
            return res.json({
                message: "successfully",
                code: 200,
            });
        }
        res.status(500).json({
            message: "Server Internal Error",
            code: 500,
        });
    }
    catch (err) {
        next(err);
    }
});
exports.validateOTPController = validateOTPController;
const resetPasswordController = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { username } = req.body;
    const validation = (0, express_validator_1.validationResult)(req);
    if (!validation.isEmpty()) {
        return res.status(422).json({
            message: validation.array()[0].msg,
            code: 422,
            errors: validation.array()
        });
    }
    ;
    try {
        const user = yield User_1.default.findOne({ username: username });
        if (!user) {
            return res.status(401).json({
                message: 'User is not valid',
                code: 401
            });
        }
        ;
        const otp = (0, string_1.randomNumberByRange)(100000, 999999);
        const infoUser = user.info;
        if ((0, string_1.isEmail)(infoUser)) {
            const mail = yield (0, mail_1.sendEmail)({
                to: infoUser,
                subject: "OTP for reset password",
                text: "Don't public this otp for anyone",
                html: `<p style="text-align: center">OTP for reset account: ${otp}</p>`,
            });
        }
        else if ((0, string_1.isMobilePhone)(infoUser)) {
            const sms = yield (0, sms_1.sendSMS)({
                body: `OTP for reset password: ${otp}`,
                to: (0, string_1.convertNormalPhoneToCountryCode)(infoUser),
            });
        }
        user.validate_info = {
            time_expiration: Date.now() + 5 * 60 * 60 * 1000,
            otp: otp
        };
        yield user.save();
        res.json({
            message: `successfully sent otp to ${infoUser}`,
            code: 200
        });
    }
    catch (err) {
        next(err);
    }
});
exports.resetPasswordController = resetPasswordController;
