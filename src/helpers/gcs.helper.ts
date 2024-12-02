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

export const gcsDeleteFile = async (thumbnailUrl: string) => {
  try {
    // Get file's path in sastra-bali bucket
    const filepath = thumbnailUrl.split(`${bucket.name}/`)[1];
    // Get file from bucket
    const file = bucket.file(filepath);
    // Delete file
    await file.delete();
  } catch (error) {
    throw new Error(error.message);
  }
};
