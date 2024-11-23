import { body } from 'express-validator';

export const createQuestionValidationRules = [body('question').trim().isString()];
export const editQuestionValidationRules = createQuestionValidationRules;
