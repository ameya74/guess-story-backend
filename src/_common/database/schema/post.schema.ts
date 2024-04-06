import mongoose, { Schema, Document, Types, HydratedDocument } from 'mongoose';

export interface IPost extends Document {
  createdBy: Types.ObjectId;
  backstory: string;
  images: string[];
  endDate: Date;
}

export const modelName = 'Post';

export type PostDocument = HydratedDocument<IPost>;

export const PostSchema: Schema = new Schema<IPost>(
  {
    createdBy: { type: mongoose.Schema.ObjectId, ref: 'User', required: true },
    backstory: { type: String, required: true },
    images: { type: [String], required: true },
    endDate: { type: Date, required: true },
  },
  { timestamps: true },
);
