import { NextFunction, Request, Response } from 'express';
import UserAnswerGroup from '../models/userAnswerGroup.model';
import Group from '../models/group.model';
import CustomError from '../helpers/error.helper';
import Option from '../models/option.model';
import sequelize from '../config/sequelize.config';
import UserAnswer from '../models/userAnswer.model';
import Question from '../models/question.model';

interface quizAnswer {
  userAnswerId: number;
  optionId: number;
}

export const getUserAnswerGroupById = async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;

  try {
    const userAnswerGroup = await UserAnswerGroup.findByPk(id, {
      attributes: ['id'],
      include: {
        model: UserAnswer,
        as: 'userAnswers',
        attributes: ['id'],
        include: [
          {
            model: Question,
            as: 'question',
            attributes: ['id', 'question'],
            include: [
              {
                model: Option,
                as: 'options',
                attributes: ['id', 'option'],
              },
            ],
          },
        ],
      },
    });

    res.status(200).json({
      status: 'success',
      message: `Berhasil mendapat grup soal user dengan id ${id}`,
      data: {
        userAnswerGroup,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const createUserAnswerGroup = async (req: Request, res: Response, next: NextFunction) => {
  const { groupId, limit } = req.body;
  const user = req.user;

  try {
    const userAnswerGroup = await UserAnswerGroup.create({
      userId: user.id,
    });

    const group = await Group.findByPk(groupId);

    if (!group) {
      throw new CustomError(`Gagal mendapat group dengan id ${groupId}`, 404);
    }

    // Mendapat soal quiz secara acak dari group soal
    const quizes = await group.getQuestions({
      attributes: ['id', 'question'],
      limit: Number(limit),
      order: sequelize.random(),
      include: {
        model: Option,
        as: 'options',
        attributes: ['id', 'option'],
      },
    });

    // Menambah soal quiz ke grup soal user
    for (const quiz of quizes) {
      await userAnswerGroup.createUserAnswer({
        questionId: quiz.id,
      });
    }

    res.status(201).json({
      status: 'success',
      message: `Berhasil membuat group soal baru untuk user dengan id ${user.id}`,
      data: {
        userAnswerGroup,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const submitQuiz = async (req: Request, res: Response, next: NextFunction) => {
  const { quizAnswers, userAnswerGroupId }: { quizAnswers: quizAnswer[]; userAnswerGroupId: number } = req.body;

  try {
    // Initialize an array to store the results
    const results: { userAnswerId: number; isCorrect: boolean }[] = [];
    const userAnswerGroup = await UserAnswerGroup.findByPk(userAnswerGroupId, {
      include: {
        model: UserAnswer,
        as: 'userAnswers',
        attributes: ['id', 'questionId', 'optionId', 'isCorrect'],
        include: [
          {
            model: Question,
            as: 'question',
            include: [
              {
                model: Option,
                as: 'options',
                where: {
                  isAnswer: true,
                },
              },
            ],
          },
        ],
      },
    });
    const userAnswers = userAnswerGroup.userAnswers;

    // Iterate through userAnswers and compare userAnswer's original question's answer with submitted quizAnswer answer
    // Iterate userAnswers
    for (const userAnswer of userAnswers) {
      // Find the correlated answer
      const quizAnswer = quizAnswers.find((answer) => {
        return answer.userAnswerId === userAnswer.id;
      });

      // Error if there is missing answer
      if (!quizAnswer) {
        throw new Error('Jawaban tidak lengkap!');
      }

      const isCorrect = quizAnswer.optionId === userAnswer.question.options[0].id;

      // Check answer
      await userAnswer.update({
        isCorrect,
      });

      results.push({
        userAnswerId: userAnswer.id,
        isCorrect,
      });
    }

    res.status(200).json({
      status: 'success',
      message: 'Berhasil menerima jawaban',
      data: {
        results,
      },
    });
  } catch (error) {
    next(error);
  }
};
