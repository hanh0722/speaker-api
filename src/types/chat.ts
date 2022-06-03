import { Types, Document } from 'mongoose';
export interface ChatProps {
  message: string;
  room: string;
  receiver: string;
};

export interface ChatElementProps extends Document {
  message: string;
  creation_time: number;
}

export interface ChatModel extends Document {
  sender_id: Types.ObjectId,
  target_id: Types.ObjectId
  chats: Array<ChatElementProps>;
  creation_time: number;
};