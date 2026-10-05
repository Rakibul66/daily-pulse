import { getFirebaseServices } from './firebase';
import { collection, doc, setDoc, getDoc, getDocs, query, where, deleteDoc, updateDoc } from 'firebase/firestore';
import { CompanyProfile, Branch } from '@/types/company';

const COMPANIES_COLLECTION = 'companies';
const BRANCHES_COLLECTION = 'branches';

// --- COMPANY PROFILE ---
export const getCompanyProfile = async (companyId: string): Promise<CompanyProfile | null> => {
  const { db } = getFirebaseServices();
  if (!db) return null;
  const docRef = doc(db, COMPANIES_COLLECTION, companyId);
  const snap = await getDoc(docRef);
  if (snap.exists()) {
    return { ...snap.data(), id: snap.id } as CompanyProfile;
  }
  return null;
};

export const updateCompanyProfile = async (companyId: string, data: Partial<CompanyProfile>): Promise<void> => {
  const { db } = getFirebaseServices();
  if (!db) throw new Error('Firebase not configured');
  const docRef = doc(db, COMPANIES_COLLECTION, companyId);
  
  const snap = await getDoc(docRef);
  if (!snap.exists()) {
    // Create if doesn't exist
    await setDoc(docRef, {
      ...data,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });
  } else {
    // Update
    await updateDoc(docRef, {
      ...data,
      updatedAt: new Date().toISOString()
    });
  }
};

// --- BRANCHES ---
export const getBranches = async (companyId: string): Promise<Branch[]> => {
  const { db } = getFirebaseServices();
  if (!db) return [];
  const q = query(collection(db, BRANCHES_COLLECTION), where('companyId', '==', companyId));
  const snapshot = await getDocs(q);
  const items: Branch[] = [];
  snapshot.forEach(docSnap => items.push({ ...docSnap.data(), id: docSnap.id } as Branch));
  return items;
};

export const addBranch = async (companyId: string, data: Omit<Branch, 'id'|'companyId'|'createdAt'|'updatedAt'>): Promise<string> => {
  const { db } = getFirebaseServices();
  if (!db) throw new Error('Firebase not configured');
  const docRef = doc(collection(db, BRANCHES_COLLECTION));
  await setDoc(docRef, {
    ...data,
    companyId,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  });
  return docRef.id;
};

export const updateBranch = async (branchId: string, data: Partial<Branch>): Promise<void> => {
  const { db } = getFirebaseServices();
  if (!db) throw new Error('Firebase not configured');
  const docRef = doc(db, BRANCHES_COLLECTION, branchId);
  await updateDoc(docRef, {
    ...data,
    updatedAt: new Date().toISOString()
  });
};

export const deleteBranch = async (branchId: string): Promise<void> => {
  const { db } = getFirebaseServices();
  if (!db) throw new Error('Firebase not configured');
  await deleteDoc(doc(db, BRANCHES_COLLECTION, branchId));
};
