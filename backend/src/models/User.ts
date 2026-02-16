import mongoose, { Document, Schema } from 'mongoose';

export type UserRole = 'admin' | 'operator' | 'customer';

export interface IUser extends Document {
  email: string;
  password: string;
  name: string;
  role: UserRole;
  createdAt: Date;
}

const userSchema = new Schema<IUser>(
  {
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    name: { type: String, required: true },
    role: { type: String, enum: ['admin', 'operator', 'customer'], default: 'customer' },
  },
  { timestamps: true }
);

export const User = mongoose.model<IUser>('User', userSchema);
