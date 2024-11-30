import { body } from 'express-validator';

export const createGroupValidationRules = [body('title').trim().notEmpty(), body('description').trim().notEmpty()];
export const editGroupValidationRules = createGroupValidationRules;
