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
exports.validationDeleteOrder = exports.validationOrder = void 0;
const express_validator_1 = require("express-validator");
const Address_1 = __importDefault(require("../models/Address"));
const Order_1 = __importDefault(require("../models/Order"));
exports.validationOrder = [
    (0, express_validator_1.body)("payment_methods")
        .not()
        .isEmpty()
        .withMessage("Payment method is not valid, please choose payment method"),
    (0, express_validator_1.body)("delivery_methods")
        .not()
        .isEmpty()
        .withMessage("Delivery method is not valid, please choose delivery method"),
    (0, express_validator_1.body)("object_info_id")
        .not()
        .isEmpty()
        .withMessage("Information is not valid, please fill information form before checking out")
        .custom((addressId, { req }) => __awaiter(void 0, void 0, void 0, function* () {
        const address = yield Address_1.default.findById(addressId);
        if (!address) {
            return Promise.reject("Address is not valid");
        }
        return true;
    })),
    (0, express_validator_1.body)("success_url").not().isURL().withMessage("Success URL is required"),
    (0, express_validator_1.body)("cancel_url").not().isURL().withMessage("Cancel URL is required"),
];
exports.validationDeleteOrder = [
    (0, express_validator_1.param)("redirect_id")
        .not()
        .isEmpty()
        .withMessage("Stripe ID must be allowed")
        .custom((id, { req }) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const order = yield Order_1.default.findOne({ stripe_key: id });
            if (!order) {
                return Promise.reject("Order is not valid");
            }
            return true;
        }
        catch (err) {
            return Promise.reject("Unauthenticated");
        }
    })),
];
