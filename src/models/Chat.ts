import mongoose from "mongoose";
import { ChatModel } from "../types/chat";

const Schema = mongoose.Schema;

const ChatSchema = new Schema<ChatModel>({
  sender_id: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'user'
  },
  target_id: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'user'
  },
  chats: [
    {
      message: {
        type: String,
        required: true
      },
      creation_time: {
        type: Number,
        required: true,
        default: Date.now()
      }
    }
  ],
  creation_time: {
    type: Number,
    required: true,
    default: Date.now()
  }
}, {
  timestamps: true
});

export default mongoose.model('chat', ChatSchema);

