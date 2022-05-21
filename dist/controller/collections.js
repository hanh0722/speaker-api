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
exports.createCollectionController = exports.getCollectionController = void 0;
const express_validator_1 = require("express-validator");
const string_1 = require("../constants/string");
const Collection_1 = __importDefault(require("../models/Collection"));
const string_2 = require("../utils/string");
const getCollectionController = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { key, page = string_1.PAGE_DEFAULT, page_size = string_1.PAGE_SIZE, sort, } = req.query;
    try {
        let objectSort = {};
        if (sort && key) {
            objectSort = {
                [key]: sort
            };
        }
        ;
        const collections = yield Collection_1.default.find({}).skip((+page - 1) * page_size).limit(page_size).sort(objectSort);
        const documents = yield Collection_1.default.find({}).countDocuments();
        res.json({
            message: 'successfully',
            code: 200,
            data: collections,
            total_collections: documents,
            total_page: Math.round(documents / page_size)
        });
    }
    catch (err) {
        next(err);
    }
});
exports.getCollectionController = getCollectionController;
const createCollectionController = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { image_url, title } = req.body;
    try {
        const validate = (0, express_validator_1.validationResult)(req);
        if (!validate.isEmpty()) {
            return res.status(422).json({
                message: validate.array()[0].msg,
                code: 422,
                errors: validate.array(),
            });
        }
        const collection = new Collection_1.default({
            image_url,
            title,
            seo_id: (0, string_2.generateSlug)(title),
        });
        const collectionAfterSave = yield collection.save();
        res.json({
            code: 200,
            message: "successfully",
            data: collectionAfterSave,
        });
    }
    catch (err) {
        next(err);
    }
});
exports.createCollectionController = createCollectionController;
