import { getFirebaseServices } from './firebase';
import { 
  collection, 
  doc, 
  setDoc, 
  getDocs, 
  query, 
  where, 
  updateDoc, 
  deleteDoc, 
  writeBatch 
} from 'firebase/firestore';
import { sanitizeForFirestore } from './firestoreUtils';
import { DeliveryMan } from '@/types/product';

const DELIVERY_MEN_COLLECTION = 'delivery_men';

export const DEFAULT_STORES = [
  'Shankhari Bazar',
  'Main Store',
  'Dhanmondi Branch',
  'Gulshan Outlet',
  'Uttara Hub',
  'Mirpur Branch'
];

export const DEFAULT_DELIVERY_MEN: Omit<DeliveryMan, 'id' | 'userId' | 'createdAt' | 'updatedAt'>[] = [
  {
    name: 'Rampura Office Delivery',
    store: 'Shankhari Bazar',
    code: '1',
    phone: '01711000111',
    email: 'rampura.delivery@pulse.com',
    address: 'Rampura Bridge, Dhaka',
    status: 'ACTIVE',
  },
  {
    name: 'siddik',
    store: 'Shankhari Bazar',
    code: '2',
    phone: '01753444229',
    email: 'siddik.rider@pulse.com',
    address: 'Old Dhaka, Shankhari Bazar',
    status: 'ACTIVE',
  },
  {
    name: 'speedy express',
    store: 'Shankhari Bazar',
    code: '3',
    phone: '01912345678',
    email: 'speedy.express@pulse.com',
    address: 'Motijheel C/A, Dhaka',
    status: 'ACTIVE',
  },
  {
    name: 'showkot',
    store: 'Shankhari Bazar',
    code: '4',
    phone: '01812313265',
    email: 'showkot.rider@pulse.com',
    address: 'Lalbagh, Dhaka',
    status: 'ACTIVE',
  },
  {
    name: 'siam',
    store: 'Shankhari Bazar',
    code: '5',
    phone: '01614681945',
    email: 'siam.rider@pulse.com',
    address: 'Wari, Dhaka',
    status: 'ACTIVE',
  },
];

export const getDeliveryMen = async (userId: string, companyId?: string): Promise<DeliveryMan[]> => {
  const { db } = getFirebaseServices();
  if (!db) throw new Error('Firebase not configured');

  const qUser = query(collection(db, DELIVERY_MEN_COLLECTION), where('userId', '==', userId));
  const snapshotUser = await getDocs(qUser);
  const items: DeliveryMan[] = [];
  const seenIds = new Set<string>();

  snapshotUser.forEach((docSnap) => {
    seenIds.add(docSnap.id);
    items.push(docSnap.data() as DeliveryMan);
  });

  if (companyId && companyId !== userId) {
    try {
      const qCompany = query(collection(db, DELIVERY_MEN_COLLECTION), where('companyId', '==', companyId));
      const snapCompany = await getDocs(qCompany);
      snapCompany.forEach((docSnap) => {
        if (!seenIds.has(docSnap.id)) {
          seenIds.add(docSnap.id);
          items.push(docSnap.data() as DeliveryMan);
        }
      });
    } catch (e) {
      console.warn('Company delivery men query error:', e);
    }
  }

  // Seed defaults if empty
  if (items.length === 0) {
    const now = new Date().toISOString();
    for (const preset of DEFAULT_DELIVERY_MEN) {
      const docRef = doc(collection(db, DELIVERY_MEN_COLLECTION));
      const newRecord: DeliveryMan = {
        ...preset,
        id: docRef.id,
        userId,
        companyId: companyId || userId,
        createdAt: now,
        updatedAt: now,
      };
      await setDoc(docRef, sanitizeForFirestore(newRecord));
      items.push(newRecord);
    }
  }

  // Sort by code or createdAt
  items.sort((a, b) => {
    const codeA = Number(a.code) || 0;
    const codeB = Number(b.code) || 0;
    if (codeA && codeB) return codeA - codeB;
    return (a.name || '').localeCompare(b.name || '');
  });

  return items;
};

export const addDeliveryMan = async (
  deliveryMan: Omit<DeliveryMan, 'id' | 'createdAt' | 'updatedAt'>
): Promise<string> => {
  const { db } = getFirebaseServices();
  if (!db) throw new Error('Firebase not configured');

  const docRef = doc(collection(db, DELIVERY_MEN_COLLECTION));
  const now = new Date().toISOString();
  const newRecord: DeliveryMan = {
    ...deliveryMan,
    id: docRef.id,
    createdAt: now,
    updatedAt: now,
  };

  await setDoc(docRef, sanitizeForFirestore(newRecord));
  return docRef.id;
};

export const updateDeliveryMan = async (
  id: string,
  updates: Partial<Omit<DeliveryMan, 'id' | 'userId' | 'createdAt'>>
): Promise<void> => {
  const { db } = getFirebaseServices();
  if (!db) throw new Error('Firebase not configured');

  const docRef = doc(db, DELIVERY_MEN_COLLECTION, id);
  await updateDoc(docRef, sanitizeForFirestore({ ...updates, updatedAt: new Date().toISOString() }));
};

export const deleteDeliveryMan = async (id: string): Promise<void> => {
  const { db } = getFirebaseServices();
  if (!db) throw new Error('Firebase not configured');
  await deleteDoc(doc(db, DELIVERY_MEN_COLLECTION, id));
};

export const deleteDeliveryMenBulk = async (ids: string[]): Promise<void> => {
  const { db } = getFirebaseServices();
  if (!db) throw new Error('Firebase not configured');
  if (ids.length === 0) return;

  const CHUNK_SIZE = 400;
  for (let i = 0; i < ids.length; i += CHUNK_SIZE) {
    const chunk = ids.slice(i, i + CHUNK_SIZE);
    const batch = writeBatch(db);
    chunk.forEach((id) => {
      batch.delete(doc(db, DELIVERY_MEN_COLLECTION, id));
    });
    await batch.commit();
  }
};
