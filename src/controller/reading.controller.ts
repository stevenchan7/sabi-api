import { NextFunction, Request, Response } from 'express';
import Reading from '../models/reading.model';
import { gcsUpload } from '../helpers/gcs.helper';
import { bucket } from '../config/gcs.config';

export const createReading = async (req: Request, res: Response, next: NextFunction) => {
  const { title, content } = req.body;
  const file = req.file;
  const folder = 'readings';

  try {
    if (!file) {
      throw new Error('Thumbnail tidak boleh kosong!');
    }

    await gcsUpload(folder, file);
    const thumbnailUrl = `https://storage.googleapis.com/${bucket.name}/${folder}/${file.filename}`;

    const newReading = await Reading.create({
      title,
      content,
      thumbnailUrl,
    });

    res.status(201).json({
      status: 'success',
      message: 'Berhasil menambah reading baru.',
      data: {
        reading: newReading,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getReadingById = async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;

  try {
    const reading = await Reading.findByPk(id, {
      attributes: ['id', 'title', 'content', 'thumbnailUrl'],
    });

    res.status(200).json({
      status: 'success',
      message: 'Berhasil mendapat reading',
      data: {
        reading,
      },
    });
  } catch (error) {
    next(error);
  }
};
