import mongoose from "mongoose";
import { AddressHandler } from "../types/address";

const Schema = mongoose.Schema;
const AddressSchema = new Schema<AddressHandler>({
  object_id: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "user",
  },
  info: {
    place: {
      type: String,
      required: true,
    },
    full_name: {
      type: String,
      required: true,
    },
    phone_number: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    city: {
      type: String,
      required: true,
    },
    zip_code: {
      type: String,
      required: true,
    },
    country: {
      type: String,
      required: true,
    },
    is_default: {
      type: Boolean,
      default: false,
    },
  },
});

export default mongoose.model<AddressHandler>("address", AddressSchema);
