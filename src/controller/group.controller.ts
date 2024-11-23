import { NextFunction, Request, Response } from 'express';
import Group from '../models/group.model';
import CustomError from '../helpers/error.helper';

export const getGroups = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const groups = await Group.findAll({
      attributes: ['title'],
    });

    res.status(200).json({
      status: 'success',
      message: 'Berhasil mendapat group.',
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
  const { title } = req.body;
  try {
    const newGroup = await Group.create({
      title,
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
  const { title } = req.body;

  try {
    const group = await Group.findByPk(id, {
      attributes: ['id', 'title', 'updatedAt'],
    });

    if (!group) {
      throw new CustomError(`Gagal mendapat group dengan id ${id}!`, 404);
    }

    await group.update({
      title,
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
