import { NextFunction, Request, Response } from 'express';
import Group from '../models/group.model';
import CustomError from '../helpers/error.helper';
import Question from '../models/question.model';
import Option from '../models/option.model';

interface quiz {
  question: string;
  options: string[];
  answer: number;
}

export const getQuestionById = async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;

  try {
    const question = await Question.findByPk(id, {
      attributes: ['id', 'question'],
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

    const quizes = await group.getQuestions({
      attributes: ['id', 'question'],
      ...(limit && { limit: Number(limit) }),
      include: {
        model: Option,
        as: 'options',
        attributes: ['id', 'option'],
      },
    });

    res.status(200).json({
      status: 'success',
      message: `Berhasil mendapat kuis group dengan id ${id}`,
      data: {
        quizes: quizes,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const createQuestions = async (req: Request, res: Response, next: NextFunction) => {
  const { quizes, groupId }: { quizes: quiz[]; groupId: number } = req.body;

  try {
    const group = await Group.findByPk(groupId);

    if (!group) {
      throw new CustomError(`Gagal mendapat group dengan id ${groupId}`, 404);
    }

    const newQuizes = await Promise.all(
      quizes.map(async (quiz) => {
        const newQuestion = await group.createQuestion({
          question: quiz.question,
        });

        const newOptions = await Promise.all(
          quiz.options.map(async (option, index) => {
            const newOption = await newQuestion.createOption({
              option,
              isAnswer: quiz.answer === index,
            });

            return newOption;
          })
        );

        return {
          question: newQuestion,
          options: newOptions,
        };
      })
    );

    res.status(201).json({
      status: 'success',
      message: `Berhasil menambah pertanyaan baru untuk quiz group dengan id ${groupId}.`,
      data: {
        quizes: newQuizes,
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
