import { Firestore } from '@google-cloud/firestore';

export const storeData = async (data: { id: string; result: string; createdAt: string }) => {
  const db = new Firestore();

  const predictCollection = db.collection('predictions');
  return predictCollection.doc(data.id).set(data);
};
