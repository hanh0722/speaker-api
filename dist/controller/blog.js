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
exports.getBlogByIdController = exports.getBlogController = exports.getTagController = exports.createBlogController = void 0;
const express_validator_1 = require("express-validator");
const string_1 = require("../constants/string");
const Blog_1 = __importDefault(require("../models/Blog"));
const query_1 = require("../utils/query");
const createBlogController = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { title, short_description, description, cover_url, is_comments, is_publish, meta_title, tags, } = req.body;
    try {
        const validation = (0, express_validator_1.validationResult)(req);
        if (!validation.isEmpty()) {
            return res.status(422).json({
                message: validation.array()[0].msg,
                code: 422,
                errors: validation.array()
            });
        }
        ;
        const blog = new Blog_1.default({
            title,
            short_description,
            description,
            cover_url,
            is_comments,
            is_publish,
            meta_title,
            tags,
            object_id: req.userId
        });
        yield blog.save();
        res.json({
            message: 'Successfully',
            code: 200
        });
    }
    catch (err) {
        next(err);
    }
});
exports.createBlogController = createBlogController;
const getTagController = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { q } = req.query;
    try {
        const blogsMatchQuery = yield Blog_1.default.find({ tags: { $regex: q, $options: 'i' } });
        const getTags = blogsMatchQuery.reduce((acc, item) => {
            var _a;
            const filterTags = (_a = item.tags) === null || _a === void 0 ? void 0 : _a.filter(value => {
                return value.toLowerCase().includes(q.toLowerCase());
            });
            return [...acc, ...(filterTags || [])];
        }, []);
        res.json({
            message: 'successfully',
            code: 200,
            data: getTags
        });
    }
    catch (err) {
        next(err);
    }
});
exports.getTagController = getTagController;
const getBlogController = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { key, page = string_1.PAGE_DEFAULT, page_size = string_1.PAGE_SIZE, query, sort, value } = req.query;
    try {
        const sortObject = (0, query_1.generateSortObject)(key, sort);
        const filterObject = (0, query_1.generateRegexFindObject)(query, value);
        const blog = yield Blog_1.default.find(filterObject).sort(sortObject).skip((+page - 1) * page_size).limit(page_size);
        const totalBlogs = yield Blog_1.default.find(filterObject).sort(sortObject).countDocuments();
        res.json({
            message: 'successfully',
            code: 200,
            data: blog,
            total: totalBlogs
        });
    }
    catch (err) {
        next(err);
    }
});
exports.getBlogController = getBlogController;
const getBlogByIdController = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    if (!id) {
        return res.status(404).json({
            message: 'Blog not found',
            code: 404
        });
    }
    ;
    try {
        const blog = yield Blog_1.default.findById(id);
        if (!blog) {
            return res.status(404).json({
                message: 'Blog is not existed',
                code: 404
            });
        }
        ;
        res.json({
            message: 'successfully',
            code: 200,
            data: blog
        });
    }
    catch (err) {
        next(err);
    }
});
exports.getBlogByIdController = getBlogByIdController;
