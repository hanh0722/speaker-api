import { Document, Model, Types } from "mongoose";
import { ProductHandler } from "./product";
export interface UserRequest {
  username: string;
  password: string;
  phone: string;
  email: string;
  validate_info: string;
  name: string;
  role: "admin" | "user";
  otp: number;
  info: string;
}

interface CartProps {
  productId: Types.ObjectId,
  quantity: number
};

export interface CartPropsPopulate {
  productId: ProductHandler,
  quantity: number
}
export interface UserHandler extends Document {
  username: string;
  name: string;
  password: string;
  role: "admin" | "user";
  avatar_url?: string;
  is_validation: boolean;
  createdAt: string;
  updatedAt: string;
  compare_list?: Array<Types.ObjectId>;
  validate_info?: {
    otp?: number | string;
    token_email?: string;
    time_expiration: number;
  };
  info: string;
  cart: Array<CartProps>;
  address: Array<Types.ObjectId>;
  orders: Array<Types.ObjectId>;
  _doc: UserHandler;
};

export interface ProductRequestCompare extends Document {
  product_id: Types.ObjectId;
}

export interface UserDocument extends UserHandler, Document {
  addToCartUser: (productId: string, quantity?: number) => Promise<void>;
  deleteItemCartUser: (productId: string, quantity?: number) => Promise<void>;
  resetCartUser: () => Promise<void>;
};

export interface UserModelProps extends Model<UserDocument>, UserRequest {

}
