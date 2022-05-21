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
exports.onGetCountryController = void 0;
const config_1 = __importDefault(require("../utils/config"));
const type_1 = require("../utils/type");
const onGetCountryController = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const response = yield config_1.default.get('https://countriesnow.space/api/v0.1/countries/states');
        const data = (_a = response.data) === null || _a === void 0 ? void 0 : _a.data;
        if (!(0, type_1.isArray)(data) || (data === null || data === void 0 ? void 0 : data.length) === 0) {
            return res.status(404).json({
                message: 'Not existed country',
                code: 404
            });
        }
        ;
        res.json({
            message: 'Successfully',
            code: 200,
            data: data
        });
    }
    catch (err) {
        next(err);
    }
});
exports.onGetCountryController = onGetCountryController;
