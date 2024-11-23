import { Request } from 'express';
import { validationResult } from 'express-validator';
import CustomError from './error.helper';

export const validate = (req: Request, res, next) => {
  const result = validationResult(req);
  if (result.isEmpty()) {
    return next();
  }

  throw new CustomError('Validation error!', 422, { errors: result.array() });
};
