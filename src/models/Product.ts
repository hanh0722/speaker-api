import mongoose from "mongoose";
import { ProductHandler } from "../types/product";

const Schema = mongoose.Schema;

const ProductSchema = new Schema<ProductHandler>({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  images: [
    {
      type: String
    }
  ],
  price: {
    type: Number,
    required: true
  },
  stock_quantity: {
    type: Number,
    required: true,
    default: 100
  },
  creation_time: {
    type: Number,
    required: true,
    default: Date.now()
  },
  discount_price: {
    type: Number
  }
}, {
  timestamps: true
});


export default mongoose.model<ProductHandler>('product', ProductSchema);