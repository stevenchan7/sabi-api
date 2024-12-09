import { body } from 'express-validator';

export const createReadingValidationRules = [body('title').trim().notEmpty(), body('content').trim().notEmpty()];
