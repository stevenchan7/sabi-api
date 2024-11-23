import { NextFunction, Request, Response } from 'express';
import Group from '../models/group.model';
import CustomError from '../helpers/error.helper';
import sequelize from '../config/sequelize.config';
import Question from '../models/question.model';

export const getQuestionById = async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;

  try {
    const question = await Question.findByPk(id, {
      attributes: ['question'],
    });

    if (!question) {
      throw new CustomError(`Gagal mendapat pertanyaan dengan id ${id}`, 404);
    }

    res.status(200).json({
      status: 'success',
      message: `Berhasil mendapat pertanyaan dengan id ${id}`,
      data: {
        question,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getQuestionsByGroupId = async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  const { limit } = req.query;

  try {
    const group = await Group.findByPk(id);

    if (!group) {
      throw new CustomError(`Gagal mendapat group dengan id ${id}`, 404);
    }

    const questions = await group.getQuestions({
      attributes: ['question'],
      limit: Number(limit),
      order: sequelize.random(),
    });

    res.status(200).json({
      status: 'success',
      message: `Berhasil mendapat pertanyaan group dengan id ${id}`,
      data: questions,
    });
  } catch (error) {
    next(error);
  }
};

export const createQuestion = async (req: Request, res: Response, next: NextFunction) => {
  const { question, groupId } = req.body;

  try {
    const group = await Group.findByPk(groupId);

    if (!group) {
      throw new CustomError(`Gagal mendapat group dengan id ${groupId}`, 404);
    }

    const newQuestion = await group.createQuestion({
      question,
    });

    res.status(201).json({
      status: 'success',
      message: 'Berhasil menambah pertanyaan baru.',
      data: {
        question: newQuestion,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const editQuestion = async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  const { question } = req.body;

  try {
    const existingQuestion = await Question.findByPk(id);

    if (!existingQuestion) {
      throw new CustomError(`Gagal mendapat pertanyaan dengan id ${id}!`, 404);
    }

    await existingQuestion.update({
      question,
    });

    res.status(200).json({
      status: 'success',
      message: `Berhasil memperbarui question dengan id ${id}.`,
      data: {
        question: existingQuestion,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const deleteQuestion = async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;

  try {
    const question = await Question.findByPk(id);

    if (!question) {
      throw new CustomError(`Gagal mendapat pertanyaan dengan id ${id}!`, 404);
    }

    await question.destroy();

    res.status(201).json({
      status: 'success',
      message: `Berhasil menghapus question dengan id ${id}.`,
    });
  } catch (error) {
    next(error);
  }
};
