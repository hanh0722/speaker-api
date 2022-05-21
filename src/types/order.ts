import { Types } from "mongoose";
import { ProductProps } from "./product";

export interface OrderStandardProps {
  object_info_id: Types.ObjectId,
  payment_methods: string;
  delivery_methods: string
}

export interface CreateCheckoutRequest extends OrderStandardProps {
  success_url: string;
  cancel_url: string;
}

export interface OrderHandler extends OrderStandardProps {
  object_id: Types.ObjectId,
  creation_time: number;
  items: Array<ProductProps<Types.ObjectId>>;
  stripe_key?: string;
  is_paid?: boolean;
};

