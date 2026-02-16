import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import { User } from '../models/User';
import { hashPassword, comparePassword } from '../utils/hash';
import { generateToken } from '../utils/jwt';

export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ success: false, errors: errors.array() });
      return;
    }
    const { email, password, name, role } = req.body;
    const existing = await User.findOne({ email });
    if (existing) {
      res.status(400).json({ success: false, message: 'Email already registered' });
      return;
    }
    const hashed = await hashPassword(password);
    const user = await User.create({ email, password: hashed, name, role: role || 'customer' });
    const token = generateToken(user);
    res.status(201).json({
      success: true,
      token,
      user: { id: user._id, email: user.email, name: user.name, role: user.role },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Registration failed' });
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ success: false, errors: errors.array() });
      return;
    }
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || !(await comparePassword(password, user.password))) {
      res.status(401).json({ success: false, message: 'Invalid email or password' });
      return;
    }
    const token = generateToken(user);
    res.json({
      success: true,
      token,
      user: { id: user._id, email: user.email, name: user.name, role: user.role },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Login failed' });
  }
};
