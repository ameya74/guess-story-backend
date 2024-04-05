import mongoose, { Schema, Document } from 'mongoose';
import bcrypt from 'bcrypt';

interface UserDoc extends Document {
  username: string;
  password: string;
  walletAddress?: string;
  validPassword(password: string): boolean;
}

const userSchema: Schema = new Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  walletAddress: { type: String, required: false, unique: true },
});

userSchema.methods.validPassword = function (password: string): boolean {
  return bcrypt.compareSync(password, this.password);
};

const User = mongoose.model<UserDoc>('User', userSchema);
export { User };
