"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const Schema = mongoose_1.default.Schema;
const CollectionSchema = new Schema({
    image_url: [
        {
            type: String
        }
    ],
    title: {
        type: String,
        required: true
    },
    creation_time: {
        type: Number,
        required: true,
        default: Date.now()
    },
    seo_id: {
        type: String
    }
}, {
    timestamps: true
});
exports.default = mongoose_1.default.model('collection', CollectionSchema);
