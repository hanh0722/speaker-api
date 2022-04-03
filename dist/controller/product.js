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
exports.getProductController = exports.createProductController = void 0;
const express_validator_1 = require("express-validator");
const string_1 = require("../constants/string");
const Product_1 = __importDefault(require("../models/Product"));
const createProductController = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { description, images, price, stock_quantity, title, discount_price } = req.body;
    const validate = (0, express_validator_1.validationResult)(req);
    if (!validate.isEmpty()) {
        return res.status(422).json({
            message: validate.array()[0].msg,
            code: 422,
            errors: validate.array(),
        });
    }
    try {
        const product = new Product_1.default({
            description,
            images,
            price,
            stock_quantity,
            title,
            discount_price
        });
        yield product.save();
        res.json({
            message: "successfully",
            code: 200,
            data: product,
        });
    }
    catch (err) {
        next(err);
    }
});
exports.createProductController = createProductController;
const getProductController = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { page = string_1.PAGE_DEFAULT, page_size = string_1.PAGE_SIZE, sort, key, } = req.query;
    try {
        const sortObject = (sort && key) ? {
            [key]: sort
        } : {};
        let execCommand = yield Product_1.default.find({})
            .skip((page - 1) * page_size)
            .limit(page_size).sort(sortObject);
        const documents = yield Product_1.default.find({}).countDocuments();
        return res.json({
            message: "successfully",
            code: 200,
            data: execCommand,
            total_products: documents,
        });
    }
    catch (err) {
        next(err);
    }
});
exports.getProductController = getProductController;
