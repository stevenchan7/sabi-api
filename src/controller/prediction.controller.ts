import { NextFunction, Request, Response } from 'express';
import { storeData } from '../helpers/firestore.helper';
import { gcsUpload } from '../helpers/gcs.helper';
import { bucket } from '../config/gcs.config';
import { Firestore } from '@google-cloud/firestore';

export const getPredictions = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const db = new Firestore();

    const snapshot = await db.collection('predictions').get();

    const histories = snapshot.docs.map((doc) => ({
      id: doc.id,
      history: {
        id: doc.id,
        result: doc.data().result,
        imageUrl: doc.data().imageUrl,
        createdAt: doc.data().createdAt,
      },
    }));

    res.status(200).json({
      status: 'success',
      data: histories,
    });
  } catch (error) {
    next(error);
  }
};

export const postPrediction = async (req: Request, res: Response, next: NextFunction) => {
  const file = req.file;
  const { result } = req.body;
  const folder = 'predictions';

  try {
    if (!file) {
      throw new Error('Gambar wajib diisi!');
    }

    await gcsUpload(folder, file);
    const imageUrl = `https://storage.googleapis.com/${bucket.name}/${folder}/${file.filename}`;

    const id = crypto.randomUUID();
    const createdAt = new Date().toISOString();

    const data = {
      id,
      imageUrl,
      result,
      createdAt,
    };

    await storeData(data);

    res.status(201).json({
      status: 'success',
      message: 'Berhasil menambah prediksi.',
      data,
    });
  } catch (error) {
    next(error);
  }
};
