import mongoose, { Schema, Types } from "mongoose";
import { UserDocument, UserModelProps } from "../types/user";
import Product from "./Product";

const UserSchema: Schema<UserDocument> = new Schema(
  {
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
        type: Schema.Types.ObjectId,
        ref: 'product'
      }
    ],
    cart: [
      {
        productId: {
          type: Schema.Types.ObjectId,
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
        type: Schema.Types.ObjectId,
        ref: 'address'
      }
    ],
    orders: [
      {
        type: Schema.Types.ObjectId,
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
  },
  { timestamps: true }
);

UserSchema.methods.addToCartUser = async function (
  this: UserDocument,
  productId: Types.ObjectId,
  quantity?: number
) {
  const product = await Product.findById(productId);
  if (!product) {
    const error: any = new Error('Product is not existed');
    error.code = 404;
    throw error;
  }
  let cartUser = this.cart;
  const indexProduct = cartUser.findIndex(
    (item) => item?.productId.toString() === productId.toString()
  );
  if (indexProduct === -1) {
    cartUser = [
      ...cartUser,
      {
        productId: productId,
        quantity: (quantity || 1),
      },
    ];
  } else {
    cartUser[indexProduct].quantity += (quantity || 1);
  };
  this.cart = cartUser;
  await this.save();
  return product;
};

UserSchema.methods.deleteItemCartUser = function(this: UserDocument, productId?: Types.ObjectId, quantity: number = 1) {
  if (!productId) {
    return Promise.reject('Product is not valid');
  }
  let cartUser = [...this.cart];
  const productIndex = cartUser.findIndex(item => item.productId.toString() === productId.toString());
  if (productIndex < 0) {
    return Promise.reject('Product is not valid');
  };
  const product = cartUser[productIndex];
  if ((product.quantity - quantity <= 0) || quantity === -1) {
    // remove
    cartUser = cartUser.filter(item => {
      return item.productId.toString() !== productId.toString()
    })
  } else {
    cartUser[productIndex].quantity -= quantity;
  }
  this.cart = cartUser;
  return this.save(); 
};

UserSchema.methods.resetCartUser = function(this: UserDocument) {
  this.cart = [];
  return this.save();
}

const UserModel = mongoose.model<UserDocument, UserModelProps>(
  "user",
  UserSchema
);

export default UserModel;
