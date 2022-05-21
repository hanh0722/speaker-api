"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validationCreateAddress = void 0;
const express_validator_1 = require("express-validator");
const string_1 = require("../constants/string");
const validationCreateAddress = [
    (0, express_validator_1.body)('address').not().isEmpty().withMessage('Address must be filled'),
    (0, express_validator_1.body)('city').not().isEmpty().withMessage('City must be filled'),
    (0, express_validator_1.body)('country').not().isEmpty().withMessage('Country must be filled'),
    (0, express_validator_1.body)('full_name').not().isEmpty().withMessage('Name is not valid'),
    (0, express_validator_1.body)('phone_number').custom((phoneNumber, { req }) => {
        const isValidPhone = string_1.REGEX_PHONE.test(phoneNumber);
        if (!isValidPhone) {
            return Promise.reject('Phone is not valid');
        }
        return true;
    }),
    (0, express_validator_1.body)('place').not().isEmpty().withMessage('Place must be filled'),
    (0, express_validator_1.body)('zip_code').not().isEmpty().withMessage('Zip code must be filled')
];
exports.validationCreateAddress = validationCreateAddress;
