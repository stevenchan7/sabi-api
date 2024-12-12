import { NextFunction, Request, Response } from 'express';
import Group from '../models/group.model';
import CustomError from '../helpers/error.helper';
import Question from '../models/question.model';
import Option from '../models/option.model';
import { gcsDeleteFile, gcsUpload } from '../helpers/gcs.helper';
import { bucket } from '../config/gcs.config';

export const getQuestions = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await Question.findAll();
  } catch (error) {
    next(error);
  }
};

export const getQuestionById = async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;

  try {
    const question = await Question.findByPk(id, {
      attributes: ['id', 'question'],
    });

    if (!question) {
      throw new CustomError(`Gagal mendapat pertanyaan dengan id ${id}!`, 404);
    }

    res.status(200).json({
      status: 'success',
      message: `Berhasil mendapat pertanyaan dengan id ${id}.`,
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
      throw new CustomError(`Gagal mendapat group dengan id ${id}!`, 404);
    }

    const quizes = await group.getQuestions({
      attributes: ['id', 'question'],
      ...(limit && { limit: Number(limit) }),
      order: [['createdAt', 'DESC']],
      include: {
        model: Option,
        as: 'options',
        attributes: ['id', 'option', 'isAnswer'],
      },
    });

    res.status(200).json({
      status: 'success',
      message: `Berhasil mendapat kuis group dengan id ${id}.`,
      data: {
        quizes: quizes,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const createQuestion = async (req: Request, res: Response, next: NextFunction) => {
  const { options, answer, groupId }: { options: string[]; answer: string; groupId: number } = req.body;
  const file = req.file;
  const folder = 'quiz-questions';

  try {
    const group = await Group.findByPk(groupId);

    if (!group) {
      throw new CustomError(`Gagal mendapat group dengan id ${groupId}!`, 404);
    }

    // Upload question image to bucket
    await gcsUpload(folder, file);

    // Get URL
    const question = `https://storage.googleapis.com/${bucket.name}/${folder}/${file.filename}`;

    // This should be wrap inside a transaction
    // Add question
    const newQuestion = await group.createQuestion({
      question,
    });

    // Add question's options
    const newOptions = await Promise.all(
      options.map(async (option, index) => {
        const newOption = await newQuestion.createOption({
          option,
          isAnswer: Number(answer) === index,
        });

        return newOption;
      })
    );

    // Increment group question_total col
    await group.increment('totalQuestion');

    res.status(201).json({
      status: 'success',
      message: `Berhasil menambah pertanyaan baru untuk quiz group dengan id ${groupId}.`,
      data: {
        quiz: {
          question: newQuestion,
          options: newOptions,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

export const editQuestion = async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  const { options, answer }: { options: string[]; answer: string } = req.body;
  const file = req.file;
  const folder = 'quiz-questions';

  try {
    const existingQuestion = await Question.findByPk(id, {
      include: {
        model: Option,
        as: 'options',
      },
    });

    if (!existingQuestion) {
      throw new CustomError(`Gagal mendapat pertanyaan dengan id ${id}!`, 404);
    }

    // Update question if provided
    if (file) {
      // Delete previous question in bucket
      if (existingQuestion.question) {
        await gcsDeleteFile(existingQuestion.question);
      }

      // Upload new question
      await gcsUpload(folder, file);
      const question = `https://storage.googleapis.com/${bucket.name}/${folder}/${file.filename}`;

      await existingQuestion.update({
        question,
      });
    }

    options.forEach(async (option, index) => {
      if (!existingQuestion.options[index]) {
        throw new CustomError(`Opsi tidak lengkap!`, 404);
      }

      await existingQuestion.options[index].update({
        option,
        isAnswer: Number(answer) === index,
      });
    });

    res.status(200).json({
      status: 'success',
      message: `Berhasil memperbarui question dengan id ${id}.`,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteQuestion = async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;

  try {
    const question = await Question.findByPk(id, {
      include: {
        model: Group,
        as: 'group',
      },
    });

    if (!question) {
      throw new CustomError(`Gagal mendapat pertanyaan dengan id ${id}!`, 404);
    }

    await question.destroy();
    await question.group.decrement({ totalQuestion: 1 });

    res.status(201).json({
      status: 'success',
      message: `Berhasil menghapus question dengan id ${id}.`,
    });
  } catch (error) {
    next(error);
  }
};
