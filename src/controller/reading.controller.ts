import { NextFunction, Request, Response } from 'express';
import Reading from '../models/reading.model';
import { gcsDeleteFile, gcsUpload } from '../helpers/gcs.helper';
import { bucket } from '../config/gcs.config';
import CustomError from '../helpers/error.helper';

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

export const editReading = async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  const { title, content } = req.body;
  const file = req.file;
  const folder = 'readings';

  try {
    // Find reading
    const reading = await Reading.findByPk(id);

    if (!reading) {
      throw new CustomError(`Gagal mendapat reading dengan id ${id}!`, 404);
    }

    // Update reading field
    await reading.update({
      title,
      content,
    });

    // Update thumbnail if provided
    if (file) {
      // Delete previous thumbnail
      if (reading.thumbnailUrl) {
        await gcsDeleteFile(reading.thumbnailUrl);
      }

      // Upload new thumbnail
      await gcsUpload(folder, file);
      const thumbnailUrl = `https://storage.googleapis.com/${bucket.name}/${folder}/${file.filename}`;

      await reading.update({
        thumbnailUrl,
      });
    }

    res.status(201).json({
      status: 'success',
      message: `Berhasil memperbarui reading dengan id ${id}.`,
    });
  } catch (error) {
    next(error);
  }
};

export const getReadings = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const readings = await Reading.findAll({
      attributes: ['id', 'title', 'content', 'thumbnailUrl'],
    });

    res.status(200).json({
      status: 'success',
      message: 'Berhasil mendapat readings.',
      data: {
        readings,
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

    if (!reading) {
      throw new CustomError(`Gagal mendapat reading dengan id ${id}!`, 404);
    }

    res.status(200).json({
      status: 'success',
      message: `Berhasil mendapat reading dengan id ${id}.`,
      data: {
        reading,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const deleteReading = async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;

  try {
    const reading = await Reading.findByPk(id);

    if (!reading) {
      throw new CustomError(`Gagal mendapat reading dengan id ${id}!`, 404);
    }

    await reading.destroy();

    res.status(200).json({
      status: 'success',
      message: `Berhasil menghapus reading dengan id ${id}.`,
    });
  } catch (error) {
    next(error);
  }
};
