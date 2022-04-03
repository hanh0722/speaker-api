"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const UserSchema = new mongoose_1.default.Schema({
    username: {
        type: String,
        required: true,
        index: {
            unique: true,
        },
    },
    info: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        required: true,
        default: 'user'
    },
    is_validation: {
        type: Boolean,
    },
    validate_info: {
        otp: {
            type: Number,
        },
        token_email: {
            type: String,
        },
        time_expiration: {
            type: Number,
        },
    },
}, { timestamps: true });
const UserModel = mongoose_1.default.model("user", UserSchema);
exports.default = UserModel;
