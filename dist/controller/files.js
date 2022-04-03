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
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadImage = void 0;
const files_1 = require("../utils/files");
const uploadImage = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const files = req.files;
        const uploadFilePromise = files.map(item => {
            return (0, files_1.uploadMultipleFile)(item.path);
        });
        const response = yield Promise.all(uploadFilePromise);
        const getURLs = response.map((item) => {
            return item.secure_url;
        });
        res.json({
            message: 'successfully',
            code: 200,
            urls: getURLs
        });
    }
    catch (err) {
        console.log(err);
    }
});
exports.uploadImage = uploadImage;
