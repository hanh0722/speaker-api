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
exports.mapProductOrder = exports.getFieldOfUser = exports.getUserResponse = void 0;
const mongoose_1 = require("mongoose");
const field_1 = require("../constants/field");
const User_1 = __importDefault(require("../models/User"));
const getUserResponse = (user) => {
    try {
        const parsedUser = Object.entries(user === null || user === void 0 ? void 0 : user._doc);
        const mapData = parsedUser.reduce((acc, [key, value]) => {
            const dataIsNotValid = field_1.FIELD_FILTER.some((field) => field === key);
            if (!dataIsNotValid) {
                return Object.assign(Object.assign({}, acc), { [key]: value });
            }
            return acc;
        }, {});
        return mapData;
    }
    catch (err) {
        return user;
    }
};
exports.getUserResponse = getUserResponse;
const getFieldOfUser = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    if (!userId) {
        return null;
    }
    try {
        const user = yield User_1.default.findById(userId).populate(["compare_list"]);
        if (!user) {
            return null;
        }
        return user;
    }
    catch (err) {
        throw new Error(err === null || err === void 0 ? void 0 : err.message);
    }
});
exports.getFieldOfUser = getFieldOfUser;
const mapProductOrder = (items) => {
    // @ts-ignore
    return items.map(item => {
        const { title, collections, description, images, price, discount_price = undefined, _id } = item.productId;
        const collectionObjectId = new mongoose_1.Types.ObjectId(collections._id);
        return {
            title: title,
            collections: collectionObjectId,
            description: description,
            images: images,
            price: price,
            discount_price: discount_price,
            quantity: item.quantity,
            product_id: _id
        };
    });
};
exports.mapProductOrder = mapProductOrder;
