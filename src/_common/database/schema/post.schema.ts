import mongoose, { Schema, Document } from 'mongoose';

interface PostDoc extends Document {
  createdBy: string;
  backstory: string;
  images: string[];
}

const postSchema: Schema = new Schema({
  createdBy: { type: mongoose.Schema.ObjectId, ref: 'User', required: true },
  backstory: { type: String, required: true },
  images: { type: [String], required: true },
});

const Post = mongoose.model<PostDoc>('Post', postSchema);
export { Post };
