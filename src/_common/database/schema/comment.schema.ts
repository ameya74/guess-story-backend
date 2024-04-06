import mongoose, { Schema, Document } from 'mongoose';

export interface CommentDoc extends Document {
  userId: string;
  postId: string;
  guessedBackstory: string;
  rating: number;
}

const commentSchema: Schema = new Schema(
  {
    userId: { type: mongoose.Schema.ObjectId, ref: 'User', required: true },
    postId: { type: mongoose.Schema.ObjectId, ref: 'Post', required: true },
    guessedBackstory: { type: String, required: true },
    rating: { type: Number, default: 0 }, // to be given by AI after context comparision
  },
  {
    timestamps: true,
  },
);

const Comment = mongoose.model<CommentDoc>('Comment', commentSchema);
export { Comment };
