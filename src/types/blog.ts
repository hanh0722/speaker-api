import { Document, Types } from 'mongoose';

export interface BlogHandler extends Document {
  object_id: Types.ObjectId
  title: string;
  short_description: string;
  description: string;
  cover_url: string;
  is_publish: boolean;
  is_comments: boolean;
  meta_title?: string;
  tags?: Array<string>;
  creation_time: number
};
