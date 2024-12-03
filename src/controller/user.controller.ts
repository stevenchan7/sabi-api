import { NextFunction, Request, Response } from 'express';
import User from '../models/user.model';
import CustomError from '../helpers/error.helper';
import { gcsUpload } from '../helpers/gcs.helper';
import { bucket } from '../config/gcs.config';

export const getUsers = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const users = await User.findAll({
      where: {
        role: 'student',
      },
      attributes: ['id', 'fullname', 'email', 'points', 'avatarUrl'],
    });

    res.status(200).json({
      status: 'success',
      message: 'Berhasil mendapat pengguna.',
      data: {
        users,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const editUserAvatar = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id: authUserId } = req.user;
    const { id } = req.params;
    const file = req.file;
    const folder = 'avatar';

    if (!file) {
      throw new Error('File kosong!');
    }

    const user = await User.findByPk(id);

    if (!user) {
      throw new CustomError(`Gagal mendapat user dengan id ${id}!`, 404);
    }

    // Check if authenticated user is authorized to update this resource
    if (Number(id) !== authUserId) {
      throw new CustomError('Unauthorized!', 403);
    }

    await gcsUpload(folder, file);
    const avatarUrl = `https://storage.googleapis.com/${bucket.name}/${folder}/${file.filename}`;

    await user.update({
      avatarUrl,
    });

    res.status(200).json({
      status: 'success',
      message: 'Berhasil memperbarui foto profil.',
    });
  } catch (error) {
    next(error);
  }
};
