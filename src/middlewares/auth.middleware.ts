import { NextFunction, Request, Response } from 'express';
import CustomError from '../helpers/error.helper';
import jwt from 'jsonwebtoken';
import { JWT_SECRET_KEY } from '../helpers/constant.helper';

export const authenticateStudent = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const bearer = req.headers.authorization;

    if (!bearer) {
      throw new CustomError('Tidak ada token!', 401);
    }

    const token = bearer.split(' ')[1];

    // Verify token
    const { id, role } = jwt.verify(token, JWT_SECRET_KEY) as { id: number; role: string };

    req.user = {
      id,
      role,
    };

    return next();
  } catch (error) {
    next(error);
  }
};

export const authenticateAdmin = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const bearer = req.headers.authorization;

    if (!bearer) {
      throw new CustomError('Tidak ada token!', 401);
    }

    const token = bearer.split(' ')[1];

    // Verify token
    const { id, role } = jwt.verify(token, JWT_SECRET_KEY) as { id: number; role: string };

    if (role !== 'admin') {
      throw new CustomError('Unauthorized!', 403);
    }

    req.user = {
      id,
      role,
    };

    return next();
  } catch (error) {
    next(error);
  }
};
