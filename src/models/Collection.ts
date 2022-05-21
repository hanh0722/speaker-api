import mongoose from "mongoose";
import { CollectionHandler } from "../types/collections";

const Schema = mongoose.Schema;

const CollectionSchema = new Schema<CollectionHandler>({
  image_url: [
    {
      type: String
    }
  ],
  title: {
    type: String,
    required: true
  },
  creation_time: {
    type: Number,
    required: true,
    default: Date.now()
  },
  seo_id: {
    type: String
  }
}, {
  timestamps: true
})

export default mongoose.model('collection', CollectionSchema);

