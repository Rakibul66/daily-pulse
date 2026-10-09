import { getFirebaseServices } from './firebase';
import { collection, doc, setDoc, getDocs, query, where, deleteDoc, updateDoc } from 'firebase/firestore';
import { sanitizeForFirestore } from './firestoreUtils';
import { Subscription } from '@/types/subscription';

const SUBSCRIPTIONS_COLLECTION = 'subscriptions';

export const getSubscriptions = async (companyId: string): Promise<Subscription[]> => {
  const { db } = getFirebaseServices();
  if (!db) throw new Error('Firebase not configured');

  const q = query(
    collection(db, SUBSCRIPTIONS_COLLECTION),
    where('companyId', '==', companyId)
  );

  const snap = await getDocs(q);
  const items: Subscription[] = [];
  snap.forEach((docSnap) => items.push(docSnap.data() as Subscription));

  return items.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
};

export const addSubscription = async (
  sub: Omit<Subscription, 'id' | 'createdAt' | 'updatedAt'>
): Promise<string> => {
  const { db } = getFirebaseServices();
  if (!db) throw new Error('Firebase not configured');

  const docRef = doc(collection(db, SUBSCRIPTIONS_COLLECTION));
  const newSub: Subscription = {
    ...sub,
    id: docRef.id,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  await setDoc(docRef, sanitizeForFirestore(newSub));
  return docRef.id;
};

export const updateSubscription = async (
  id: string,
  updates: Partial<Omit<Subscription, 'id' | 'companyId' | 'createdAt'>>
): Promise<void> => {
  const { db } = getFirebaseServices();
  if (!db) throw new Error('Firebase not configured');

  const docRef = doc(db, SUBSCRIPTIONS_COLLECTION, id);
  await updateDoc(docRef, sanitizeForFirestore({
    ...updates,
    updatedAt: new Date().toISOString(),
  }));
};

export const deleteSubscription = async (id: string): Promise<void> => {
  const { db } = getFirebaseServices();
  if (!db) throw new Error('Firebase not configured');

  await deleteDoc(doc(db, SUBSCRIPTIONS_COLLECTION, id));
};
