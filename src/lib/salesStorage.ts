import { getFirebaseServices } from './firebase';
import { collection, doc, setDoc, getDocs, query, where, updateDoc, deleteDoc } from 'firebase/firestore';
import { SalesClient, DailySale } from '@/types/sales';

const CLIENTS_COLLECTION = 'sales_clients';

export const getSalesClients = async (userId: string): Promise<SalesClient[]> => {
  const { db } = getFirebaseServices();
  if (!db) throw new Error('Firebase not configured');

  const q = query(collection(db, CLIENTS_COLLECTION), where('userId', '==', userId));
  const snapshot = await getDocs(q);
  const items: SalesClient[] = [];
  snapshot.forEach((docSnap) => items.push(docSnap.data() as SalesClient));
  
  items.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  return items;
};

export const addSalesClient = async (client: Omit<SalesClient, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> => {
  const { db } = getFirebaseServices();
  if (!db) throw new Error('Firebase not configured');

  const docRef = doc(collection(db, CLIENTS_COLLECTION));
  const newClient: SalesClient = {
    ...client,
    id: docRef.id,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  await setDoc(docRef, newClient);
  return docRef.id;
};

export const updateSalesClient = async (id: string, updates: Partial<Omit<SalesClient, 'id' | 'userId' | 'createdAt'>>): Promise<void> => {
  const { db } = getFirebaseServices();
  if (!db) throw new Error('Firebase not configured');
  
  const docRef = doc(db, CLIENTS_COLLECTION, id);
  await updateDoc(docRef, { ...updates, updatedAt: new Date().toISOString() });
};

export const deleteSalesClient = async (id: string): Promise<void> => {
  const { db } = getFirebaseServices();
  if (!db) throw new Error('Firebase not configured');
  
  await deleteDoc(doc(db, CLIENTS_COLLECTION, id));
};

// --- DAILY SALES / INVOICES ---
const INVOICES_COLLECTION = 'sales_invoices';

export const getSalesInvoices = async (userId: string): Promise<DailySale[]> => {
  const { db } = getFirebaseServices();
  if (!db) throw new Error('Firebase not configured');

  const q = query(collection(db, INVOICES_COLLECTION), where('userId', '==', userId));
  const snapshot = await getDocs(q);
  const items: DailySale[] = [];
  snapshot.forEach((docSnap) => items.push(docSnap.data() as DailySale));
  
  items.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  return items;
};

export const addSalesInvoice = async (invoice: Omit<DailySale, "id" | "createdAt" | "updatedAt">): Promise<string> => {
  const { db } = getFirebaseServices();
  if (!db) throw new Error('Firebase not configured');

  const docRef = doc(collection(db, INVOICES_COLLECTION));
  const newInvoice = {
    ...invoice,
    id: docRef.id,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  await setDoc(docRef, newInvoice);
  return docRef.id;
};

export const updateSalesInvoice = async (id: string, updates: Partial<Omit<DailySale, "id" | "userId" | "createdAt">>): Promise<void> => {
  const { db } = getFirebaseServices();
  if (!db) throw new Error('Firebase not configured');
  
  const docRef = doc(db, INVOICES_COLLECTION, id);
  await updateDoc(docRef, { ...updates, updatedAt: new Date().toISOString() });
};

export const deleteSalesInvoice = async (id: string): Promise<void> => {
  const { db } = getFirebaseServices();
  if (!db) throw new Error('Firebase not configured');
  
  await deleteDoc(doc(db, INVOICES_COLLECTION, id));
};
