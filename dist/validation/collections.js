"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createCollectionValidate = void 0;
const express_validator_1 = require("express-validator");
const string_1 = require("../utils/string");
exports.createCollectionValidate = [
    (0, express_validator_1.body)("image_url").custom((url, { req }) => {
        if (!url) {
            return true;
        }
        const isValidImage = url.every(value => (0, string_1.isUrl)(value));
        if (!isValidImage) {
            return Promise.reject('Image is not valid');
        }
        ;
        return true;
    }),
    (0, express_validator_1.body)('title').not().isEmail().withMessage('Title is blanked!')
];
