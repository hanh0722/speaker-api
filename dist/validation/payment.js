"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateResultPayment = exports.validatePayment = void 0;
const express_validator_1 = require("express-validator");
exports.validatePayment = [
    (0, express_validator_1.body)('success_url').not().isEmpty().withMessage('Success URL is must specify'),
    (0, express_validator_1.body)('cancel_url').not().isEmpty().withMessage('Cancel URL is must specify')
];
exports.validateResultPayment = [
    (0, express_validator_1.param)('id').not().isEmpty().withMessage('Order is not valid')
];
