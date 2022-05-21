"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const Schema = mongoose_1.default.Schema;
const AddressSchema = new Schema({
    object_id: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: "user",
    },
    info: {
        place: {
            type: String,
            required: true,
        },
        full_name: {
            type: String,
            required: true,
        },
        phone_number: {
            type: String,
            required: true,
        },
        address: {
            type: String,
            required: true,
        },
        city: {
            type: String,
            required: true,
        },
        zip_code: {
            type: String,
            required: true,
        },
        country: {
            type: String,
            required: true,
        },
        is_default: {
            type: Boolean,
            default: false,
        },
    },
});
exports.default = mongoose_1.default.model("address", AddressSchema);
