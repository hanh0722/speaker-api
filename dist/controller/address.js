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
exports.getAddressController = exports.createAddressController = void 0;
const express_validator_1 = require("express-validator");
const string_1 = require("../constants/string");
const Address_1 = __importDefault(require("../models/Address"));
const User_1 = __importDefault(require("../models/User"));
const query_1 = require("../utils/query");
const createAddressController = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { address, city, country, full_name, is_default, phone_number, place, zip_code } = req.body;
    try {
        const validate = (0, express_validator_1.validationResult)(req);
        if (!validate.isEmpty()) {
            return res.status(422).json({
                message: validate.array()[0].msg,
                code: 422,
                errors: validate.array()
            });
        }
        ;
        if (!req.userId) {
            return res.status(401).json({
                message: 'unauthenticated',
                code: 401
            });
        }
        ;
        const newAddress = new Address_1.default({
            object_id: req.userId,
            info: {
                city,
                country,
                full_name,
                is_default,
                phone_number,
                place,
                zip_code,
                address
            }
        });
        if (is_default) {
            yield Address_1.default.updateMany({ 'info.is_default': true }, { $set: { "info.is_default": false } });
        }
        const user = yield User_1.default.findById(req.userId);
        console.log(user);
        user === null || user === void 0 ? void 0 : user.address.push(newAddress._id);
        yield (user === null || user === void 0 ? void 0 : user.save());
        yield newAddress.save();
        res.json({
            message: 'successfully',
            code: 200,
            data: newAddress
        });
    }
    catch (err) {
        next(err);
    }
});
exports.createAddressController = createAddressController;
const getAddressController = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { sort, key, page = string_1.PAGE_DEFAULT, page_size = string_1.PAGE_SIZE, query, value } = req.query;
    try {
        if (!req.userId) {
            return res.status(401).json({
                message: 'unauthenticated',
                code: 401
            });
        }
        ;
        const sortObject = (0, query_1.generateSortObject)(key, sort);
        const filterObject = (0, query_1.generateRegexFindObject)(query, value);
        const findAddress = yield Address_1.default.find(Object.assign(Object.assign({}, filterObject), { object_id: req.userId })).sort(Object.assign(Object.assign({}, sortObject), { 'info.is_default': -1 })).skip((+page - 1) * +page_size).limit(page_size);
        const totalDocuments = yield Address_1.default.find(Object.assign(Object.assign({}, filterObject), { object_id: req.userId })).countDocuments();
        res.json({
            message: 'successfully',
            code: 200,
            total_documents: totalDocuments,
            data: findAddress
        });
    }
    catch (err) {
        next(err);
    }
});
exports.getAddressController = getAddressController;
