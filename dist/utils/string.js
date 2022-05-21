"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateSlug = exports.isUrl = exports.getToken = exports.convertNormalPhoneToCountryCode = exports.randomNumberByRange = exports.isMobilePhone = exports.isEmail = exports.randomNumber = void 0;
const crypto_1 = __importDefault(require("crypto"));
const speakingurl_1 = __importDefault(require("speakingurl"));
const libphonenumber_js_1 = __importDefault(require("libphonenumber-js"));
const string_1 = require("../constants/string");
const uuid_1 = require("uuid");
const randomNumber = (cb) => {
    return crypto_1.default.randomBytes(16, (err, buffer) => {
        if (err) {
            console.log(err);
            cb(null);
        }
        cb(buffer.toString("hex"));
    });
};
exports.randomNumber = randomNumber;
const isEmail = (value) => value.trim().length > 0 && value.includes("@");
exports.isEmail = isEmail;
const isMobilePhone = (value) => value.trim().length > 0 && string_1.REGEX_PHONE.test(value);
exports.isMobilePhone = isMobilePhone;
const randomNumberByRange = (start, finish) => {
    return Math.floor(start + (finish - start) * Math.random());
};
exports.randomNumberByRange = randomNumberByRange;
const convertNormalPhoneToCountryCode = (phone, defaultCountry) => {
    const transform = (0, libphonenumber_js_1.default)(phone, defaultCountry || "VN");
    return transform === null || transform === void 0 ? void 0 : transform.number;
};
exports.convertNormalPhoneToCountryCode = convertNormalPhoneToCountryCode;
const getToken = (header) => {
    try {
        if (!header) {
            return null;
        }
        return header.split("Bearer ")[1];
    }
    catch (err) {
        return null;
    }
};
exports.getToken = getToken;
const isUrl = (url) => {
    try {
        const urlParsed = new URL(url);
        return !!urlParsed.pathname;
    }
    catch (err) {
        return false;
    }
};
exports.isUrl = isUrl;
const generateSlug = (url) => {
    const randomString = (0, uuid_1.v4)();
    return `${(0, speakingurl_1.default)(url)}-${randomString}`;
};
exports.generateSlug = generateSlug;
