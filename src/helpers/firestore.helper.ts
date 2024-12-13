import { Firestore } from '@google-cloud/firestore';
import { GCP_PROJECT_ID, GCS_KEY_FILENAME } from './constant.helper';

export const storeData = async (data: { id: string; result: string; createdAt: string }) => {
  const db = new Firestore({
    projectId: GCP_PROJECT_ID,
    keyFilename: GCS_KEY_FILENAME,
  });

  const predictCollection = db.collection('predictions');
  return predictCollection.doc(data.id).set(data);
};
