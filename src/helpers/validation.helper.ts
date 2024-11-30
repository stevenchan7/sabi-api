import { Request } from 'express';
import { validationResult } from 'express-validator';
import CustomError from './error.helper';
import fs from 'fs';

export const validate = (req: Request, res, next) => {
  const result = validationResult(req);
  if (result.isEmpty()) {
    return next();
  }

  // Handle single file
  const file = req.file;
  if (file) {
    try {
      fs.rmSync(file.path); // Remove the uploaded file
    } catch (error) {
      console.error(`Gagal menghapus file: ${file.path}`, error);
    }
  }

  // Handle multiple files
  const files = req.files;
  if (Array.isArray(files)) {
    files.forEach((file) => {
      try {
        fs.rmSync(file.path); // Remove each uploaded file
      } catch (error) {
        console.error(`Gagal menghapus file: ${file.path}`, error);
      }
    });
  }

  throw new CustomError('Validation error!', 422, { errors: result.array() });
};
