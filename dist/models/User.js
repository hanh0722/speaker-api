"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
const mongoose_1 = __importStar(require("mongoose"));
const Product_1 = __importDefault(require("./Product"));
const UserSchema = new mongoose_1.Schema({
    username: {
        type: String,
        required: true,
        index: {
            unique: true,
        },
    },
    info: {
        type: String,
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        required: true,
        default: "user",
    },
    is_validation: {
        type: Boolean,
    },
    validate_info: {
        otp: {
            type: Number,
        },
        token_email: {
            type: String,
        },
        time_expiration: {
            type: Number,
        },
    },
    compare_list: [
        {
            type: mongoose_1.Schema.Types.ObjectId,
            ref: 'product'
        }
    ],
    cart: [
        {
            productId: {
                type: mongoose_1.Schema.Types.ObjectId,
                required: true,
                ref: 'product',
            },
            quantity: {
                type: Number,
                required: true,
            },
        },
    ],
    address: [
        {
            type: mongoose_1.Schema.Types.ObjectId,
            ref: 'address'
        }
    ],
    orders: [
        {
            type: mongoose_1.Schema.Types.ObjectId,
            ref: 'order'
        }
    ],
    avatar_url: {
        type: String
    },
    info_details: {
        role: {
            type: String
        },
        zip_code: {
            type: String
        },
        country: {
            type: String
        },
        company: {
            type: String
        }
    }
}, { timestamps: true });
UserSchema.methods.addToCartUser = function (productId, quantity) {
    return __awaiter(this, void 0, void 0, function* () {
        const product = yield Product_1.default.findById(productId);
        if (!product) {
            const error = new Error('Product is not existed');
            error.code = 404;
            throw error;
        }
        let cartUser = this.cart;
        const indexProduct = cartUser.findIndex((item) => (item === null || item === void 0 ? void 0 : item.productId.toString()) === productId.toString());
        if (indexProduct === -1) {
            cartUser = [
                ...cartUser,
                {
                    productId: productId,
                    quantity: (quantity || 1),
                },
            ];
        }
        else {
            cartUser[indexProduct].quantity += (quantity || 1);
        }
        ;
        this.cart = cartUser;
        yield this.save();
        return product;
    });
};
UserSchema.methods.deleteItemCartUser = function (productId, quantity = 1) {
    if (!productId) {
        return Promise.reject('Product is not valid');
    }
    let cartUser = [...this.cart];
    const productIndex = cartUser.findIndex(item => item.productId.toString() === productId.toString());
    if (productIndex < 0) {
        return Promise.reject('Product is not valid');
    }
    ;
    const product = cartUser[productIndex];
    if ((product.quantity - quantity <= 0) || quantity === -1) {
        // remove
        cartUser = cartUser.filter(item => {
            return item.productId.toString() !== productId.toString();
        });
    }
    else {
        cartUser[productIndex].quantity -= quantity;
    }
    this.cart = cartUser;
    return this.save();
};
UserSchema.methods.resetCartUser = function () {
    this.cart = [];
    return this.save();
};
const UserModel = mongoose_1.default.model("user", UserSchema);
exports.default = UserModel;
