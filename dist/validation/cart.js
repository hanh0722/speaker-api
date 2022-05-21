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
exports.addToCartValidation = void 0;
const express_validator_1 = require("express-validator");
const Product_1 = __importDefault(require("../models/Product"));
exports.addToCartValidation = [
    (0, express_validator_1.body)('quantity').isNumeric().withMessage('Quantity must be above 1')
        .custom((quantity, { req }) => {
        if (quantity < 1) {
            return Promise.reject('Product quantity must have at least 1');
        }
        return true;
    }),
    (0, express_validator_1.body)('id').not().isEmpty().withMessage('Product must have id!')
        .custom((productId, { req }) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const product = yield Product_1.default.findById(productId);
            if (!product) {
                return Promise.reject('Product is not existed');
            }
            return true;
        }
        catch (err) {
            return Promise.reject('Product is not valid');
        }
    }))
];
