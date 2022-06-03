"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const Schema = mongoose_1.default.Schema;
const ChatSchema = new Schema({
    sender_id: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'user'
    },
    target_id: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'user'
    },
    chats: [
        {
            message: {
                type: String,
                required: true
            },
            creation_time: {
                type: Number,
                required: true,
                default: Date.now()
            }
        }
    ],
    creation_time: {
        type: Number,
        required: true,
        default: Date.now()
    }
}, {
    timestamps: true
});
exports.default = mongoose_1.default.model('chat', ChatSchema);
