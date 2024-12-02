import { NextFunction, Request, Response } from 'express';
import Group from '../models/group.model';
import CustomError from '../helpers/error.helper';
import { gcsDeleteFile, gcsUpload } from '../helpers/gcs.helper';
import path from 'path';
import { bucket } from '../config/gcs.config';
import Question from '../models/question.model';

export const getGroups = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const groups = await Group.findAll({
      attributes: ['id', 'title', 'description', 'thumbnailUrl', 'totalQuestion'],
    });

    res.status(200).json({
      status: 'success',
      message: 'Berhasil mendapat groups.',
      data: {
        groups,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getGroupById = async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;

  try {
    const group = await Group.findByPk(id, {
      attributes: ['title'],
    });

    if (!group) {
      throw new CustomError(`Gagal mendapat group dengan id ${id}!`, 404);
    }

    res.status(200).json({
      status: 'success',
      message: `Berhasil mendapat group dengan id ${id}.`,
      data: {
        group,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const createGroup = async (req: Request, res: Response, next: NextFunction) => {
  const { title, description } = req.body;
  const file = req.file;
  const folder = 'thumbnail';

  try {
    await gcsUpload(folder, file);
    const thumbnailUrl = `https://storage.googleapis.com/${bucket.name}/${folder}/${file.filename}`;

    const newGroup = await Group.create({
      title,
      description,
      thumbnailUrl,
    });

    res.status(201).json({
      status: 'success',
      message: 'Berhasil menambah group baru.',
      data: {
        group: newGroup,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const editGroup = async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  const { title, description } = req.body;
  const file = req.file;
  const folder = 'thumbnail';

  try {
    const group = await Group.findByPk(id, {
      attributes: ['id', 'title', 'description', 'thumbnailUrl', 'updatedAt'],
    });

    if (!group) {
      throw new CustomError(`Gagal mendapat group dengan id ${id}!`, 404);
    }

    // Delete previous thumbnail
    await gcsDeleteFile(group.thumbnailUrl);

    // Upload new thumbnail
    await gcsUpload(folder, file);
    const thumbnailUrl = `https://storage.googleapis.com/${bucket.name}/${folder}/${file.filename}`;

    await group.update({
      title,
      description,
      thumbnailUrl,
    });

    res.status(200).json({
      status: 'success',
      message: `Berhasil memperbarui group dengan id ${id}.`,
      data: {
        group,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const deleteGroup = async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;

  try {
    const group = await Group.findByPk(id);

    if (!group) {
      throw new CustomError(`Gagal mendapat group dengan id ${id}!`, 404);
    }

    await group.destroy();

    res.status(201).json({
      status: 'success',
      message: `Berhasil menghapus group dengan id ${id}.`,
    });
  } catch (error) {
    next(error);
  }
};
