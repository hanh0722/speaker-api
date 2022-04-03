"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createProductValidation = void 0;
const express_validator_1 = require("express-validator");
exports.createProductValidation = [
    (0, express_validator_1.body)('title').not().isEmpty().withMessage('Title is blanked!'),
    (0, express_validator_1.body)('description').not().isEmpty().withMessage('Description is blanked'),
    (0, express_validator_1.body)('images').isArray({ min: 1, max: 10 }).withMessage('Product must have at least one image [1-10 images]'),
    (0, express_validator_1.body)('price').not().isEmpty().isNumeric().withMessage('Product must have price')
];
