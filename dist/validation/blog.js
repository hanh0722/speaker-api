"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateCreateBlog = void 0;
const express_validator_1 = require("express-validator");
exports.validateCreateBlog = [
    (0, express_validator_1.body)('title').not().isEmpty().withMessage('Title is required'),
    (0, express_validator_1.body)('short_description').not().isEmpty().withMessage('Short Description is required'),
    (0, express_validator_1.body)('description').not().isEmpty().withMessage('Description is required'),
    (0, express_validator_1.body)('cover_url').isURL().withMessage('Image URL is not valid'),
];
