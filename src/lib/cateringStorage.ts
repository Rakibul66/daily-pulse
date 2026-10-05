import { getFirebaseServices } from './firebase';
import { collection, doc, setDoc, getDocs, query, where, deleteDoc } from 'firebase/firestore';
import { CateringVendor, MealRecord, CateringPayment } from '@/types/catering';

export const getCateringVendors = async (companyId: string): Promise<CateringVendor[]> => {
  const { db } = getFirebaseServices();
  if (!db) throw new Error('Firebase not configured');
  const q = query(collection(db, 'catering_vendors'), where('companyId', '==', companyId));
  const snap = await getDocs(q);
  const items: CateringVendor[] = [];
  snap.forEach(d => items.push(d.data() as CateringVendor));
  return items.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
};

export const addCateringVendor = async (data: Omit<CateringVendor, 'id' | 'createdAt'>): Promise<void> => {
  const { db } = getFirebaseServices();
  if (!db) throw new Error('Firebase not configured');
  const docRef = doc(collection(db, 'catering_vendors'));
  await setDoc(docRef, {
    ...data,
    id: docRef.id,
    createdAt: new Date().toISOString()
  });
};

export const getMealRecords = async (companyId: string, vendorId?: string): Promise<MealRecord[]> => {
  const { db } = getFirebaseServices();
  if (!db) throw new Error('Firebase not configured');
  let q = query(collection(db, 'catering_meals'), where('companyId', '==', companyId));
  if (vendorId) {
    q = query(collection(db, 'catering_meals'), where('companyId', '==', companyId), where('vendorId', '==', vendorId));
  }
  const snap = await getDocs(q);
  const items: MealRecord[] = [];
  snap.forEach(d => items.push(d.data() as MealRecord));
  return items.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
};

export const addMealRecord = async (data: Omit<MealRecord, 'id' | 'createdAt'>): Promise<void> => {
  const { db } = getFirebaseServices();
  if (!db) throw new Error('Firebase not configured');
  const docRef = doc(collection(db, 'catering_meals'));
  await setDoc(docRef, {
    ...data,
    id: docRef.id,
    createdAt: new Date().toISOString()
  });
};

export const deleteMealRecord = async (id: string): Promise<void> => {
  const { db } = getFirebaseServices();
  if (!db) return;
  await deleteDoc(doc(db, 'catering_meals', id));
};

export const getCateringPayments = async (companyId: string, vendorId?: string): Promise<CateringPayment[]> => {
  const { db } = getFirebaseServices();
  if (!db) throw new Error('Firebase not configured');
  let q = query(collection(db, 'catering_payments'), where('companyId', '==', companyId));
  if (vendorId) {
    q = query(collection(db, 'catering_payments'), where('companyId', '==', companyId), where('vendorId', '==', vendorId));
  }
  const snap = await getDocs(q);
  const items: CateringPayment[] = [];
  snap.forEach(d => items.push(d.data() as CateringPayment));
  return items.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
};

export const addCateringPayment = async (data: Omit<CateringPayment, 'id' | 'createdAt'>): Promise<void> => {
  const { db } = getFirebaseServices();
  if (!db) throw new Error('Firebase not configured');
  const docRef = doc(collection(db, 'catering_payments'));
  await setDoc(docRef, {
    ...data,
    id: docRef.id,
    createdAt: new Date().toISOString()
  });
};

export const deleteCateringPayment = async (id: string): Promise<void> => {
  const { db } = getFirebaseServices();
  if (!db) return;
  await deleteDoc(doc(db, 'catering_payments', id));
};
