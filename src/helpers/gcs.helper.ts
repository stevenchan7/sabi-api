import { bucket } from '../config/gcs.config';

export const gcsUpload = async (folder: string, file: Express.Multer.File) => {
  try {
    console.log(file.filename);

    const results = await bucket.upload(file.path, {
      destination: `${folder}/${file.filename}`,
      metadata: {
        contentType: file.mimetype,
      },
    });

    return results;
  } catch (error) {
    throw new Error(error.message);
  }
};
