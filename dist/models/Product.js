"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const Schema = mongoose_1.default.Schema;
const ProductSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    images: [
        {
            type: String
        }
    ],
    price: {
        type: Number,
        required: true
    },
    stock_quantity: {
        type: Number,
        required: true,
        default: 100
    },
    creation_time: {
        type: Number,
        required: true,
        default: Date.now()
    },
    discount_price: {
        type: Number
    },
    collections: {
        type: Schema.Types.ObjectId,
        ref: 'collection',
    }
}, {
    timestamps: true
});
exports.default = mongoose_1.default.model('product', ProductSchema);
