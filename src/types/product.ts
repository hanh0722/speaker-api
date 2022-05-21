import { CollectionHandler } from "./collections";
import { Document, Types } from "mongoose";

export interface ProductProps<T> {
  title: string;
  price: number;
  images: Array<string>;
  description: string;
  discount_price?: number;
  collections: T;
  quantity?: number;
  product_id?: Types.ObjectId;
  _id: Types.ObjectId
};

export interface ProductCheckoutProps<T> extends Document {
  title: string;
  price: number;
  images: Array<string>;
  quantity: number,
  collections: Types.ObjectId;
  product_id?: T
}
export interface ProductHandler extends ProductProps<CollectionHandler> {
  stock_quantity: number;
  creation_time: number;
  _doc?: any
}

export interface ProductPopulateID {
  product_id: ProductHandler;
  quantity: number
}