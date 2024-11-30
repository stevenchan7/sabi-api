import { Storage } from '@google-cloud/storage';
import { GCP_PROJECT_ID, GCS_KEY_FILENAME } from '../helpers/constant.helper';

const storage = new Storage({
  projectId: GCP_PROJECT_ID,
  keyFilename: GCS_KEY_FILENAME,
});

export const bucket = storage.bucket('sastra-bali-bucket');
