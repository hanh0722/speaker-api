import mongoose from "mongoose";
import { UserHandler } from "../types/user";

const UserSchema = new mongoose.Schema<UserHandler>(
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
      required: true
    },
    name: {
      type: String,
      required: true
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      required: true,
      default: 'user'
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
  },
  { timestamps: true }
);

const UserModel = mongoose.model<UserHandler>("user", UserSchema);
export default UserModel;
