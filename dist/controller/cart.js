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
exports.deleteCartController = exports.getCartController = exports.addCartController = void 0;
const express_validator_1 = require("express-validator");
const string_1 = require("../constants/string");
const User_1 = __importDefault(require("../models/User"));
const addCartController = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id, quantity } = req.body;
    const validation = (0, express_validator_1.validationResult)(req);
    if (!validation.isEmpty()) {
        return res.status(422).json({
            message: validation.array()[0].msg,
            code: 422,
            errors: validation.array(),
        });
    }
    try {
        const user = yield User_1.default.findById(req.userId);
        if (!user) {
            return res.status(404).json({
                message: "User is not valid",
                code: 404,
            });
        }
        const result = yield user.addToCartUser(id, quantity);
        res.json({
            message: "successfully",
            code: 200,
            data: result,
        });
    }
    catch (err) {
        next(err);
    }
});
exports.addCartController = addCartController;
const getCartController = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { key, page = string_1.PAGE_DEFAULT, page_size = string_1.PAGE_SIZE, sort, } = req.query;
    try {
        const userId = req.userId;
        if (!userId) {
            return res.status(403).json({
                message: "unauthenticated",
                code: 403,
            });
        }
        let user;
        let sortObject;
        if (sort && key) {
            sortObject = {
                [key]: sort,
            };
        }
        const totalProducts = yield User_1.default.findById(userId)
            .populate("cart.productId")
            .countDocuments();
        if (page_size === -1) {
            user = yield User_1.default.findById(userId)
                .populate("cart.productId")
                .sort(sortObject);
        }
        else {
            user = yield User_1.default.findById(userId)
                .populate("cart.productId")
                .skip((+page - 1) * page_size)
                .limit(page_size)
                .sort(sortObject);
        }
        if (!user) {
            return res.status(401).json({
                message: "user is not valid",
                code: 401,
            });
        }
        res.json({
            message: "successfully",
            code: 200,
            data: user.cart,
            total_products: totalProducts,
        });
    }
    catch (err) {
        next(err);
    }
});
exports.getCartController = getCartController;
const deleteCartController = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { quantity = 1, id } = req.query;
    try {
        const userId = req.userId;
        if (!userId) {
            return res.status(403).json({
                message: "unauthenticated",
                code: 403,
            });
        }
        if (!id) {
            return res.status(422).json({
                message: 'Product is not valid',
                code: 422
            });
        }
        ;
        const user = yield User_1.default.findById(userId);
        if (!user) {
            return res.status(404).json({
                message: 'user is not valid',
                code: 404
            });
        }
        ;
        user.deleteItemCartUser(id, +quantity);
        res.json({
            message: 'successfully',
            code: 200
        });
    }
    catch (err) {
        next(err);
    }
});
exports.deleteCartController = deleteCartController;
