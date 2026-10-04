import { getFirebaseServices } from './firebase';
import { collection, doc, setDoc, getDocs, query, where, deleteDoc, updateDoc } from 'firebase/firestore';
import { LostItem } from '@/types/lostAndFound';

const LOST_ITEMS_COLLECTION = 'lost_items';

export const getLostItems = async (userId: string): Promise<LostItem[]> => {
  const { db } = getFirebaseServices();
  if (!db) throw new Error('Firebase not configured');

  const q = query(collection(db, LOST_ITEMS_COLLECTION), where('userId', '==', userId));
  const snapshot = await getDocs(q);
  const items: LostItem[] = [];
  snapshot.forEach((docSnap) => items.push(docSnap.data() as LostItem));
  
  // Sort by newest first
  items.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  return items;
};

const generateRefNumber = () => {
  return 'LF-' + Math.random().toString(36).substring(2, 9).toUpperCase();
};

export const addLostItem = async (item: Omit<LostItem, 'id' | 'refNumber' | 'createdAt' | 'updatedAt' | 'status'>): Promise<string> => {
  const { db } = getFirebaseServices();
  if (!db) throw new Error('Firebase not configured');

  const docRef = doc(collection(db, LOST_ITEMS_COLLECTION));
  const newItem: LostItem = {
    ...item,
    id: docRef.id,
    refNumber: generateRefNumber(),
    status: 'In store',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  await setDoc(docRef, newItem);
  return docRef.id;
};

export const updateLostItem = async (id: string, updates: Partial<Omit<LostItem, 'id' | 'userId' | 'createdAt'>>): Promise<void> => {
  const { db } = getFirebaseServices();
  if (!db) throw new Error('Firebase not configured');
  
  const docRef = doc(db, LOST_ITEMS_COLLECTION, id);
  await updateDoc(docRef, { ...updates, updatedAt: new Date().toISOString() });
};

export const deleteLostItem = async (id: string): Promise<void> => {
  const { db } = getFirebaseServices();
  if (!db) throw new Error('Firebase not configured');
  
  await deleteDoc(doc(db, LOST_ITEMS_COLLECTION, id));
};

export const handoverLostItem = async (
  id: string, 
  claimantName: string, 
  claimantPhone: string
): Promise<void> => {
  await updateLostItem(id, {
    status: 'Returned',
    claimantName,
    claimantPhone,
    handoverDate: new Date().toISOString(),
  });
};
