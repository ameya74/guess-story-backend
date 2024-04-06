import mongoose, { Schema, Document } from 'mongoose';
import { Role } from 'src/_common/types.global';

export interface UserDoc extends Document {
  role: Role;
  walletAddress: string;
}

const userSchema: Schema = new Schema(
  {
    role: { type: String, required: true, default: Role.User },
    walletAddress: { type: String, required: true, unique: true },
  },
  { timestamps: true },
);

const User = mongoose.model<UserDoc>('User', userSchema);
export { User };
