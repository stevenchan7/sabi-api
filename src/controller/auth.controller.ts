import { NextFunction, Request, Response } from 'express';
import User from '../models/user.model';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { isUserExist } from '../helpers/auth.helper';
import CustomError from '../helpers/error.helper';
import { JWT_SECRET_KEY } from '../helpers/constant.helper';

export const register = async (req: Request, res: Response, next: NextFunction) => {
  const { fullname, email, password } = req.body;

  try {
    // Check if user exist
    if (await isUserExist(email)) {
      throw new Error('User dengan email ini sudah ada!');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    await User.create({
      fullname,
      email,
      password: hashedPassword,
    });

    res.status(201).json({
      status: 'success',
      message: 'Berhasil menambah user.',
      data: {
        user: {
          fullname,
          email,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

export const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({
      where: {
        email,
      },
    });

    if (!user) {
      throw new CustomError('Kredensial tidak valid!', 401);
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      throw new CustomError('Kredensial tidak valid!', 401);
    }

    // Generate access token
    const token = jwt.sign(
      {
        id: user.id,
        role: user.role,
      },
      JWT_SECRET_KEY,
      { expiresIn: '1d' }
    );

    // Save access token in cookie
    req.session.token = token;

    res.status(200).json({
      status: 'success',
      message: 'Berhasil login.',
      data: {
        user: {
          name: user.fullname,
        },
        token: token,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const logout = async (req: Request, res: Response, next: NextFunction) => {
  try {
    req.session = null;
    res.status(200).json({ status: 'success', message: 'Berhasil logout.' });
  } catch (error) {
    next(error);
  }
};
