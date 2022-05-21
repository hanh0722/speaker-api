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
exports.editProductValidation = exports.deleteProductsValidation = exports.deleteCompareProductValidation = exports.compareProductValidation = exports.createProductValidation = void 0;
const express_validator_1 = require("express-validator");
const Product_1 = __importDefault(require("../models/Product"));
const User_1 = __importDefault(require("../models/User"));
const type_1 = require("../utils/type");
exports.createProductValidation = [
    (0, express_validator_1.body)("title").not().isEmpty().withMessage("Title is blanked!"),
    (0, express_validator_1.body)("description").not().isEmpty().withMessage("Description is blanked"),
    (0, express_validator_1.body)("images")
        .isArray({ min: 1, max: 10 })
        .withMessage("Product must have at least one image [1-10 images]"),
    (0, express_validator_1.body)("price")
        .not()
        .isEmpty()
        .isNumeric()
        .withMessage("Product must have price"),
];
exports.compareProductValidation = [
    (0, express_validator_1.body)("product_id")
        .not()
        .isEmpty()
        .withMessage("Product is required")
        .custom((productId, { req }) => __awaiter(void 0, void 0, void 0, function* () {
        var _a, _b;
        try {
            const product = yield Product_1.default.findById(productId);
            if (!product) {
                return Promise.reject("Product is not existed");
            }
            const user = yield User_1.default.findById(req === null || req === void 0 ? void 0 : req.userId);
            if (!user) {
                return Promise.reject("unauthenticated");
            }
            const productIsExisted = (_a = user.compare_list) === null || _a === void 0 ? void 0 : _a.some((value) => value.toString() === productId);
            if (productIsExisted) {
                return Promise.reject("Product is existed in compare list");
            }
            if ((user === null || user === void 0 ? void 0 : user.compare_list) && ((_b = user === null || user === void 0 ? void 0 : user.compare_list) === null || _b === void 0 ? void 0 : _b.length) > 4) {
                return Promise.reject("Only allow compare 4 products! Please remove some product before continue");
            }
            return true;
        }
        catch (err) {
            return Promise.reject("Product is not valid");
        }
    })),
];
exports.deleteCompareProductValidation = [
    (0, express_validator_1.param)("id")
        .not()
        .isEmpty()
        .withMessage("Product is not valid!")
        .custom((id, { req }) => __awaiter(void 0, void 0, void 0, function* () {
        var _c;
        try {
            const userId = req === null || req === void 0 ? void 0 : req.userId;
            if (!userId) {
                return Promise.reject("unauthenticated");
            }
            const user = yield User_1.default.findById(userId);
            if (!user) {
                return Promise.reject("unauthenticated");
            }
            const productIsCompared = (_c = user.compare_list) === null || _c === void 0 ? void 0 : _c.some((value) => value.toString() === id);
            if (!productIsCompared) {
                return Promise.reject("You haven't compared this product");
            }
            return true;
        }
        catch (err) {
            return Promise.reject(err);
        }
    })),
];
exports.deleteProductsValidation = [
    (0, express_validator_1.body)("id").custom((id, { req }) => __awaiter(void 0, void 0, void 0, function* () {
        if ((0, type_1.isArray)(id)) {
            const isValidArray = id.length > 0;
            return isValidArray ? true : Promise.reject('Products is not valid');
        }
        ;
        const product = yield Product_1.default.findById(id);
        if (!product) {
            return Promise.reject('Product is not existed');
        }
        ;
        return true;
    })),
];
exports.editProductValidation = [
    ...exports.createProductValidation,
    (0, express_validator_1.param)('id').custom((id, { req }) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const product = yield Product_1.default.findById(id);
            if (!product) {
                return Promise.reject('Product is not existed');
            }
            ;
            return true;
        }
        catch (err) {
            return Promise.reject(err === null || err === void 0 ? void 0 : err.message);
        }
    }))
];
