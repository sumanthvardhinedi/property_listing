import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { User } from '../models/User';

export interface AuthRequest extends Request {
  user?: any;
}

export const auth = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
      res.status(401).json({ message: 'Please authenticate.' });
      return;
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'default-secret-key');
    const user = await User.findOne({ _id: (decoded as any)._id });

    if (!user) {
      res.status(401).json({ message: 'Please authenticate.' });
      return;
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Please authenticate.' });
  }
}; 