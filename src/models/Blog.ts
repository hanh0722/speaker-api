import mongoose from 'mongoose';
import { BlogHandler } from '../types/blog';

const Schema = mongoose.Schema;

const BlogSchema = new Schema<BlogHandler>({
  object_id: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'user'
  },
  title: {
    type: String,
    required: true,
  },
  short_description: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  cover_url: {
    type: String,
    required: true
  },
  is_publish: {
    type: Boolean,
    required: true,
    default: true
  },
  is_comments: {
    type: Boolean,
    required: true,
    default: true
  },
  meta_title: {
    type: String,
  },
  tags: [
    {
      type: String
    }
  ],
  creation_time: {
    type: Number,
    required: true,
    default: Date.now()
  }
}, {timestamps: true});

export default mongoose.model<BlogHandler>('blog', BlogSchema);
