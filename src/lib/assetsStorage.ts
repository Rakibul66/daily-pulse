import { getFirebaseServices } from './firebase';
import { collection, doc, setDoc, getDocs, query, where, deleteDoc, updateDoc } from 'firebase/firestore';
import { AssetItem } from '@/types/assets';

const ASSETS_COLLECTION = 'office_assets';

export const getAssets = async (companyId: string): Promise<AssetItem[]> => {
  const { db } = getFirebaseServices();
  if (!db) throw new Error('Firebase not configured');

  const q = query(collection(db, ASSETS_COLLECTION), where('companyId', '==', companyId));
  const snapshot = await getDocs(q);
  const items: AssetItem[] = [];
  snapshot.forEach((docSnap) => items.push(docSnap.data() as AssetItem));
  
  items.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  return items;
};

export const addAsset = async (item: Omit<AssetItem, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> => {
  const { db } = getFirebaseServices();
  if (!db) throw new Error('Firebase not configured');

  const docRef = doc(collection(db, ASSETS_COLLECTION));
  const newItem: AssetItem = {
    ...item,
    id: docRef.id,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  await setDoc(docRef, newItem);
  return docRef.id;
};

export const updateAsset = async (id: string, updates: Partial<Omit<AssetItem, 'id' | 'companyId' | 'createdAt'>>): Promise<void> => {
  const { db } = getFirebaseServices();
  if (!db) throw new Error('Firebase not configured');
  
  const docRef = doc(db, ASSETS_COLLECTION, id);
  await updateDoc(docRef, { ...updates, updatedAt: new Date().toISOString() });
};

export const deleteAsset = async (id: string): Promise<void> => {
  const { db } = getFirebaseServices();
  if (!db) throw new Error('Firebase not configured');
  
  await deleteDoc(doc(db, ASSETS_COLLECTION, id));
};
