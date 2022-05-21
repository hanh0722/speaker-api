"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const Schema = mongoose_1.default.Schema;
const BlogSchema = new Schema({
    object_id: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'user'
    },
    title: {
        type: String,
        required: true,
    },
    short_description: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    cover_url: {
        type: String,
        required: true
    },
    is_publish: {
        type: Boolean,
        required: true,
        default: true
    },
    is_comments: {
        type: Boolean,
        required: true,
        default: true
    },
    meta_title: {
        type: String,
    },
    tags: [
        {
            type: String
        }
    ],
    creation_time: {
        type: Number,
        required: true,
        default: Date.now()
    }
}, { timestamps: true });
exports.default = mongoose_1.default.model('blog', BlogSchema);
