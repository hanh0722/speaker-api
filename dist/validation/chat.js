"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatValidation = void 0;
const express_validator_1 = require("express-validator");
exports.ChatValidation = [
    (0, express_validator_1.body)('message').not().isString().withMessage('Message is not valid')
        .custom((message, { req }) => {
        const trimMessage = message.trim();
        if (trimMessage.length === 0) {
            return Promise.reject();
        }
    }),
    (0, express_validator_1.body)('room').not().isString().withMessage('Room is not valid'),
    (0, express_validator_1.body)('receiver').not().isString().withMessage('Message without receiver')
        .custom((receiver, { req }) => {
    })
];
