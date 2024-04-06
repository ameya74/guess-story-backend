import mongoose, { Schema, Document, HydratedDocument, Types } from 'mongoose';

export interface IComment extends Document {
  userId: Types.ObjectId;
  postId: Types.ObjectId;
  guessedBackstory: string;
  rating: number;
}

export const modelName = 'Comment';

export type CommentDocument = HydratedDocument<IComment>;

export const CommentSchema: Schema = new Schema<IComment>(
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
