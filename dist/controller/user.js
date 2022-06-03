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
exports.searchUserController = void 0;
const string_1 = require("../constants/string");
const User_1 = __importDefault(require("../models/User"));
const query_1 = require("../utils/query");
const response_1 = require("../utils/response");
const searchUserController = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { page = string_1.PAGE_DEFAULT, page_size = string_1.PAGE_SIZE, query, sort, value, key, s, } = req.query;
    try {
        const searchRegex = new RegExp(`.*${s || ""}.*`);
        const sortObject = (0, query_1.generateSortObject)(key, sort);
        const filterObject = (0, query_1.generateRegexFindObject)(query, value);
        const querySearchUser = Object.assign({ name: { $regex: searchRegex, $options: "i" }, _id: { $ne: req.userId } }, filterObject);
        const user = yield User_1.default.find(querySearchUser)
            .sort(sortObject)
            .skip((+page - 1) * +page_size)
            .limit(+page_size);
        const filterDataUser = user.map(u => (0, response_1.getUserResponse)(u));
        const totalUserMatching = yield User_1.default.find(querySearchUser).countDocuments();
        res.json({
            message: "successfully",
            code: 200,
            data: filterDataUser,
            total_users: totalUserMatching
        });
    }
    catch (err) {
        next(err);
    }
});
exports.searchUserController = searchUserController;
