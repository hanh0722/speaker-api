"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userRouter = exports.chatRouter = exports.blogRouter = exports.paymentRouter = exports.checkoutRouter = exports.addressRouter = exports.countryRouter = exports.cartRouter = exports.collectionRouter = exports.productRouter = exports.authRouter = exports.fileRouter = void 0;
const files_1 = __importDefault(require("./files"));
exports.fileRouter = files_1.default;
const auth_1 = __importDefault(require("./auth"));
exports.authRouter = auth_1.default;
const product_1 = __importDefault(require("./product"));
exports.productRouter = product_1.default;
const collections_1 = __importDefault(require("./collections"));
exports.collectionRouter = collections_1.default;
const cart_1 = __importDefault(require("./cart"));
exports.cartRouter = cart_1.default;
const countries_1 = __importDefault(require("./countries"));
exports.countryRouter = countries_1.default;
const address_1 = __importDefault(require("./address"));
exports.addressRouter = address_1.default;
const checkout_1 = __importDefault(require("./checkout"));
exports.checkoutRouter = checkout_1.default;
const payment_1 = __importDefault(require("./payment"));
exports.paymentRouter = payment_1.default;
const blog_1 = __importDefault(require("./blog"));
exports.blogRouter = blog_1.default;
const chat_1 = __importDefault(require("./chat"));
exports.chatRouter = chat_1.default;
const user_1 = __importDefault(require("./user"));
exports.userRouter = user_1.default;
