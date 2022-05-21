import { Schema, model } from "mongoose";
import { CASH, STANDARD } from "../constants/field";
import { OrderHandler } from "../types/order";

const OrderSchema = new Schema<OrderHandler>({
  delivery_methods: {
    type: String,
    required: true,
    default: STANDARD
  },
  object_id: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'user'
  },
  object_info_id: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'address'
  },
  payment_methods: {
    type: String,
    required: true,
    default: CASH
  },
  creation_time: {
    type: Number,
    required: true,
    default: Date.now()
  },
  items: [
    {
      product_id: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'product'
      },
      title: {
        type: String,
        required: true
      },
      price: {
        type: Number,
        required: true
      },
      images: [
        {
          type: String,
        }
      ],
      description: {
        type: String,
      },
      discount_price: {
        type: Number
      },
      quantity: {
        type: Number,
        required: true
      },
      collections: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'collection'
      }
    }
  ],
  stripe_key: {
    type: String
  },
  is_paid: {
    type: Boolean,
    default: false
  }

}, {timestamps: true});

export default model('order', OrderSchema);