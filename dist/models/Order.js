"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const field_1 = require("../constants/field");
const OrderSchema = new mongoose_1.Schema({
    delivery_methods: {
        type: String,
        required: true,
        default: field_1.STANDARD
    },
    object_id: {
        type: mongoose_1.Schema.Types.ObjectId,
        required: true,
        ref: 'user'
    },
    object_info_id: {
        type: mongoose_1.Schema.Types.ObjectId,
        required: true,
        ref: 'address'
    },
    payment_methods: {
        type: String,
        required: true,
        default: field_1.CASH
    },
    creation_time: {
        type: Number,
        required: true,
        default: Date.now()
    },
    items: [
        {
            product_id: {
                type: mongoose_1.Schema.Types.ObjectId,
                required: true,
                ref: 'product'
            },
            title: {
                type: String,
                required: true
            },
            price: {
                type: Number,
                required: true
            },
            images: [
                {
                    type: String,
                }
            ],
            description: {
                type: String,
            },
            discount_price: {
                type: Number
            },
            quantity: {
                type: Number,
                required: true
            },
            collections: {
                type: mongoose_1.Schema.Types.ObjectId,
                required: true,
                ref: 'collection'
            }
        }
    ],
    stripe_key: {
        type: String
    },
    is_paid: {
        type: Boolean,
        default: false
    }
}, { timestamps: true });
exports.default = (0, mongoose_1.model)('order', OrderSchema);
