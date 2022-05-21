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
exports.validateOrderPayment = exports.paymentRedirectCheckout = exports.getPaymentInitController = void 0;
const mongoose_1 = require("mongoose");
const express_validator_1 = require("express-validator");
const field_1 = require("../constants/field");
const Order_1 = __importDefault(require("../models/Order"));
const User_1 = __importDefault(require("../models/User"));
const stripe_1 = require("../utils/stripe");
const Product_1 = __importDefault(require("../models/Product"));
const getPaymentInitController = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const paymentInfo = yield (0, stripe_1.getStripeIndents)();
        res.json({
            message: 'successfully',
            client_secret: paymentInfo.client_secret,
            code: 200
        });
    }
    catch (err) {
        next(err);
    }
});
exports.getPaymentInitController = getPaymentInitController;
const paymentRedirectCheckout = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { cancel_url, success_url } = req.body;
    try {
        const validate = (0, express_validator_1.validationResult)(req);
        if (!validate.isEmpty()) {
            return res.status(422).json({
                message: validate.array()[0].msg,
                code: 422,
                errors: validate.array()
            });
        }
        ;
        if (!req.userId) {
            return res.status(401).json({
                message: 'Unauthenticated',
                code: 401
            });
        }
        ;
        const user = yield User_1.default.findById(req.userId).populate('cart.productId');
        if (!user) {
            return res.status(404).json({
                message: 'Not Found',
                code: 404
            });
        }
        ;
        const cartUser = user.cart;
        const getStripeInfo = yield (0, stripe_1.redirectPaymentStripe)({
            cancel_url: cancel_url,
            success_url: success_url,
            items: cartUser
        });
        res.json({
            message: 'successfully',
            code: 200,
        });
        console.log(getStripeInfo);
    }
    catch (err) {
        next(err);
    }
});
exports.paymentRedirectCheckout = paymentRedirectCheckout;
const validateOrderPayment = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params['id'];
    const type = req.query['type'];
    try {
        const validation = (0, express_validator_1.validationResult)(req);
        if (!validation.isEmpty()) {
            return res.status(401).json({
                message: validation.array()[0].msg,
                code: 401
            });
        }
        ;
        let objectFind;
        if (type === field_1.CASH) {
            objectFind = {
                _id: new mongoose_1.Types.ObjectId(id)
            };
        }
        else {
            objectFind = {
                stripe_key: id
            };
        }
        ;
        const findOrder = yield Order_1.default.findOne(objectFind).populate([
            'object_info_id',
            'items.product_id'
        ]);
        if (!findOrder) {
            return res.status(404).json({
                message: 'Order is not existed',
                code: 404
            });
        }
        ;
        const items = findOrder.items;
        const itemIsValid = items.some(value => value.product_id.stock_quantity - value.quantity > 0);
        if (!itemIsValid) {
            return res.status(400).json({
                message: 'Process is not valid',
                code: 400
            });
        }
        ;
        yield Product_1.default.bulkWrite(items.map((item) => {
            const { stock_quantity, _id } = item.product_id;
            const { quantity } = item;
            return {
                updateOne: {
                    filter: { _id: _id },
                    update: {
                        stock_quantity: stock_quantity - quantity
                    }
                }
            };
        }));
        const user = yield User_1.default.findById(req.userId);
        yield (user === null || user === void 0 ? void 0 : user.resetCartUser());
        findOrder.is_paid = true;
        if (findOrder.stripe_key) {
            findOrder.stripe_key = undefined;
        }
        yield findOrder.save();
        res.json({
            message: 'Successfully',
            code: 200,
            data: findOrder
        });
    }
    catch (err) {
        next(err);
    }
});
exports.validateOrderPayment = validateOrderPayment;
