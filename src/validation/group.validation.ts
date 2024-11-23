import { body } from 'express-validator';

export const createGroupValidationRules = [body('title').trim().isString()];
export const editGroupValidationRules = createGroupValidationRules;
