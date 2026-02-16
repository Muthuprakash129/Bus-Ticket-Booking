import jwt from 'jsonwebtoken';
import { IUser } from '../models/User';

const secret = process.env.JWT_SECRET || 'default-secret-change-me';
const expiresIn = process.env.JWT_EXPIRES_IN || '7d';

export interface JwtPayload {
  userId: string;
  email: string;
  role: string;
}

export const generateToken = (user: IUser): string => {
  return jwt.sign(
    { userId: user._id.toString(), email: user.email, role: user.role } as JwtPayload,
    secret,
    { expiresIn }
  );
};

export const verifyToken = (token: string): JwtPayload => {
  return jwt.verify(token, secret) as JwtPayload;
};
