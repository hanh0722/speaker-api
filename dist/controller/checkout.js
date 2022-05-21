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
exports.onDeleteOrderErrorController = exports.onCheckoutController = void 0;
const express_validator_1 = require("express-validator");
const field_1 = require("../constants/field");
const Address_1 = __importDefault(require("../models/Address"));
const Order_1 = __importDefault(require("../models/Order"));
const User_1 = __importDefault(require("../models/User"));
const response_1 = require("../utils/response");
const string_1 = require("../utils/string");
const stripe_1 = require("../utils/stripe");
const onCheckoutController = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { payment_methods, delivery_methods, object_info_id, cancel_url, success_url, } = req.body;
    try {
        const validate = (0, express_validator_1.validationResult)(req);
        if (!validate.isEmpty()) {
            return res.status(422).json({
                message: validate.array()[0].msg,
                code: 422,
                errors: validate.array(),
            });
        }
        if (!req.userId) {
            return res.status(401).json({
                message: "Unauthenticated",
                code: 401,
            });
        }
        const addressUser = yield Address_1.default.findById(object_info_id);
        const user = yield User_1.default.findById(req.userId).populate("cart.productId");
        if (!addressUser || !user) {
            return res.status(404).json({
                message: "Not valid information",
                code: 404,
            });
        }
        const cartUser = user.cart;
        if (cartUser.length === 0) {
            return res.status(422).json({
                message: 'Your cart is empty!',
                code: 422
            });
        }
        const orderItems = (0, response_1.mapProductOrder)(cartUser);
        (0, string_1.randomNumber)((id) => __awaiter(void 0, void 0, void 0, function* () {
            const order = new Order_1.default({
                object_id: req.userId,
                object_info_id: addressUser._id,
                delivery_methods: delivery_methods,
                payment_methods: payment_methods,
                items: orderItems,
                stripe_key: payment_methods === field_1.CASH ? undefined : id
            });
            user.orders.push(order._id);
            yield user.save();
            yield order.save();
            if (payment_methods === field_1.CASH) {
                return res.json({
                    message: 'successfully',
                    code: 200,
                    order_id: order._id
                });
            }
            ;
            const stripeRedirect = yield (0, stripe_1.redirectPaymentStripe)({
                success_url: `${success_url}?redirect_id=${id}`,
                cancel_url: `${cancel_url}?redirect_id=${id}`,
                items: cartUser,
            });
            return res.json({
                message: 'successfully',
                code: 200,
                data: {
                    redirect_url: stripeRedirect.url
                }
            });
        }));
    }
    catch (err) {
        next(err);
    }
});
exports.onCheckoutController = onCheckoutController;
const onDeleteOrderErrorController = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const redirectId = req.params['redirect_id'];
    if (!redirectId) {
        return res.status(422).json({
            message: 'Order is not valid',
            code: 422
        });
    }
    ;
    try {
        const validation = (0, express_validator_1.validationResult)(req);
        if (!validation.isEmpty()) {
            return res.status(422).json({
                message: validation.array()[0].msg,
                code: 422
            });
        }
        ;
        const result = yield Order_1.default.deleteOne({ stripe_key: redirectId });
        console.log(result);
        res.json({
            message: 'successfully',
            code: 200
        });
    }
    catch (err) {
        next(err);
    }
});
exports.onDeleteOrderErrorController = onDeleteOrderErrorController;
