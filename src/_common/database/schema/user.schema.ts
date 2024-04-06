import { Schema, Document, HydratedDocument } from 'mongoose';
import { Role } from 'src/_common/types.global';

export interface IUser extends Document {
  role: Role;
  walletAddress: string;
}

export const modelName = 'User';

export type UserDocument = HydratedDocument<IUser>;

export const UserSchema: Schema = new Schema<IUser>(
  {
    role: { type: String, required: true, default: Role.User },
    walletAddress: { type: String, required: true, unique: true },
  },
  { timestamps: true },
);
