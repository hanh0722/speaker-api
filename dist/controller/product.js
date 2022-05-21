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
exports.onEditProduct = exports.onHandleDeleteProduct = exports.onDeleteCompareProduct = exports.suggestProductsController = exports.addCompareProductToUserController = exports.getProductByIdController = exports.getProductController = exports.createProductController = void 0;
const express_validator_1 = require("express-validator");
const string_1 = require("../constants/string");
const Product_1 = __importDefault(require("../models/Product"));
const User_1 = __importDefault(require("../models/User"));
const query_1 = require("../utils/query");
const response_1 = require("../utils/response");
const type_1 = require("../utils/type");
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
            discount_price,
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
    const { page = string_1.PAGE_DEFAULT, page_size = string_1.PAGE_SIZE, sort, key, query, value, } = req.query;
    try {
        const sortObject = (0, query_1.generateSortObject)(key, sort);
        const regexFindObject = (0, query_1.generateRegexFindObject)(query, value);
        let execCommand = yield Product_1.default.find(regexFindObject)
            .populate("collections")
            .skip((+page - 1) * page_size)
            .limit(page_size)
            .sort(sortObject);
        const documents = yield Product_1.default.find(regexFindObject).countDocuments();
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
const getProductByIdController = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { id } = req.params;
    if (!id) {
        return res.status(422).json({
            message: "invalid",
            code: 422,
        });
    }
    try {
        const product = yield Product_1.default.findById(id);
        const user = yield (0, response_1.getFieldOfUser)(req.userId);
        const isCompared = !!((_a = user === null || user === void 0 ? void 0 : user.compare_list) === null || _a === void 0 ? void 0 : _a.find(item => { var _a; return ((_a = item === null || item === void 0 ? void 0 : item._id) === null || _a === void 0 ? void 0 : _a.toString()) === (id === null || id === void 0 ? void 0 : id.toString()); }));
        if (!product) {
            return res.status(404).json({
                message: "Product is not existed",
                code: 404,
            });
        }
        res.json({
            code: 200,
            message: "successfully",
            data: Object.assign(Object.assign({}, product._doc), { is_compared: isCompared }),
        });
    }
    catch (err) {
        next(err);
    }
});
exports.getProductByIdController = getProductByIdController;
const addCompareProductToUserController = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _b;
    const { product_id } = req.body;
    try {
        const validation = (0, express_validator_1.validationResult)(req);
        if (!validation.isEmpty()) {
            return res.status(422).json({
                message: validation.array()[0].msg,
                code: 422,
                errors: validation.array(),
            });
        }
        const user = yield User_1.default.findById(req.userId);
        if (!user) {
            return res.status(401).json({
                message: "Unauthenticated",
                code: 401,
            });
        }
        (_b = user.compare_list) === null || _b === void 0 ? void 0 : _b.push(product_id);
        yield user.save();
        res.json({
            message: 'successfully',
            code: 200
        });
    }
    catch (err) {
        next(err);
    }
});
exports.addCompareProductToUserController = addCompareProductToUserController;
const suggestProductsController = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { page_size = string_1.PAGE_SIZE, sort, key } = req.query;
    if (!id) {
        return res.status(422).json({
            message: 'Not valid product',
            code: 422
        });
    }
    ;
    try {
        let sortObject = { 'creation_time': -1 };
        if (sort && key) {
            sortObject = Object.assign(Object.assign({}, sortObject), { [key]: sort });
        }
        const products = yield Product_1.default.find({}).sort(sortObject).limit(page_size);
        const filterProducts = products.filter(item => { var _a; return ((_a = item === null || item === void 0 ? void 0 : item._id) === null || _a === void 0 ? void 0 : _a.toString()) !== id; });
        res.json({
            message: 'successfully',
            code: 200,
            data: filterProducts
        });
    }
    catch (err) {
        next(err);
    }
});
exports.suggestProductsController = suggestProductsController;
const onDeleteCompareProduct = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _c;
    const { id } = req.params;
    try {
        const validation = (0, express_validator_1.validationResult)(req);
        if (!validation.isEmpty()) {
            return res.status(401).json({
                message: validation.array()[0].msg,
                code: 401,
                errors: validation.array()
            });
        }
        const user = yield User_1.default.findById(req.userId);
        const listCompareAfterRemove = (_c = user === null || user === void 0 ? void 0 : user.compare_list) === null || _c === void 0 ? void 0 : _c.filter(item => {
            return item.toString() !== id;
        });
        user.compare_list = listCompareAfterRemove;
        yield (user === null || user === void 0 ? void 0 : user.save());
        res.json({
            message: 'successfully',
            code: 200
        });
    }
    catch (err) {
        next(err);
    }
});
exports.onDeleteCompareProduct = onDeleteCompareProduct;
const onHandleDeleteProduct = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.body;
    try {
        const validation = (0, express_validator_1.validationResult)(req);
        if (!validation.isEmpty()) {
            return res.status(400).json({
                message: validation.array()[0].msg,
                code: 400,
                errors: validation.array()
            });
        }
        yield Product_1.default.deleteMany({ _id: { $in: (0, type_1.isArray)(id) ? [...id] : [id] } });
        return res.json({
            message: 'successfully',
            code: 200,
            items: id
        });
    }
    catch (err) {
        console.log(err);
        next(err);
    }
});
exports.onHandleDeleteProduct = onHandleDeleteProduct;
const onEditProduct = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const productId = req.params['id'];
        const { title, description, images, price, stock_quantity, discount_price } = req.body;
        const validation = (0, express_validator_1.validationResult)(req);
        if (!validation.isEmpty()) {
            return res.status(422).json({
                message: validation.array()[0].msg,
                code: 422,
                errors: validation.array()
            });
        }
        ;
        const product = yield Product_1.default.findById(productId);
        if (!product) {
            return res.status(404).json({
                message: 'Product is not existed',
                code: 404
            });
        }
        ;
        product.title = title;
        product.description = description;
        product.images = images;
        product.price = price;
        if (stock_quantity >= 0) {
            product.stock_quantity = stock_quantity;
        }
        if (discount_price) {
            product.discount_price = discount_price;
        }
        yield product.save();
        res.json({
            message: 'Successfully',
            code: 200
        });
    }
    catch (err) {
        next(err);
    }
});
exports.onEditProduct = onEditProduct;
