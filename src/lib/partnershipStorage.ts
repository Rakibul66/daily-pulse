import { getFirebaseServices } from './firebase';
import { collection, doc, setDoc, getDocs, query, where, deleteDoc, updateDoc, runTransaction } from 'firebase/firestore';
import { Partner, PartnerTransaction } from '@/types/partnership';

const PARTNERS_COLLECTION = 'partners';
const PARTNER_TX_COLLECTION = 'partner_transactions';

export const getPartners = async (userId: string): Promise<Partner[]> => {
  const { db } = getFirebaseServices();
  if (!db) throw new Error('Firebase not configured');

  const q = query(collection(db, PARTNERS_COLLECTION), where('userId', '==', userId));
  const snapshot = await getDocs(q);
  const items: Partner[] = [];
  snapshot.forEach((docSnap) => items.push(docSnap.data() as Partner));
  
  items.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  return items;
};

export const addPartner = async (partner: Omit<Partner, 'id' | 'createdAt' | 'updatedAt' | 'totalInvested' | 'totalDividends'>): Promise<string> => {
  const { db } = getFirebaseServices();
  if (!db) throw new Error('Firebase not configured');

  const docRef = doc(collection(db, PARTNERS_COLLECTION));
  const newPartner: Partner = {
    ...partner,
    id: docRef.id,
    totalInvested: 0,
    totalDividends: 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  await setDoc(docRef, newPartner);
  return docRef.id;
};

export const updatePartner = async (id: string, updates: Partial<Omit<Partner, 'id' | 'userId' | 'createdAt'>>): Promise<void> => {
  const { db } = getFirebaseServices();
  if (!db) throw new Error('Firebase not configured');
  
  const docRef = doc(db, PARTNERS_COLLECTION, id);
  await updateDoc(docRef, { ...updates, updatedAt: new Date().toISOString() });
};

export const deletePartner = async (id: string): Promise<void> => {
  const { db } = getFirebaseServices();
  if (!db) throw new Error('Firebase not configured');
  
  await deleteDoc(doc(db, PARTNERS_COLLECTION, id));
};

export const getPartnerTransactions = async (userId: string, partnerId: string): Promise<PartnerTransaction[]> => {
  const { db } = getFirebaseServices();
  if (!db) throw new Error('Firebase not configured');

  const q = query(
    collection(db, PARTNER_TX_COLLECTION),
    where('userId', '==', userId),
    where('partnerId', '==', partnerId)
  );
  const snapshot = await getDocs(q);
  const items: PartnerTransaction[] = [];
  snapshot.forEach((docSnap) => items.push(docSnap.data() as PartnerTransaction));
  
  items.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  return items;
};

export const processPartnerTransaction = async (
  txData: Omit<PartnerTransaction, 'id' | 'createdAt'>
): Promise<void> => {
  const { db } = getFirebaseServices();
  if (!db) throw new Error('Firebase not configured');

  const partnerRef = doc(db, PARTNERS_COLLECTION, txData.partnerId);
  const txRef = doc(collection(db, PARTNER_TX_COLLECTION));

  await runTransaction(db, async (transaction) => {
    const partnerDoc = await transaction.get(partnerRef);
    if (!partnerDoc.exists()) {
      throw new Error("Partner does not exist!");
    }

    const partner = partnerDoc.data() as Partner;
    let newInvested = partner.totalInvested;
    let newDividends = partner.totalDividends;

    if (txData.type === 'INVESTMENT') {
      newInvested += txData.amount;
    } else if (txData.type === 'WITHDRAWAL') {
      if (newInvested < txData.amount) {
        throw new Error("Withdrawal amount exceeds total invested amount.");
      }
      newInvested -= txData.amount;
    } else if (txData.type === 'DIVIDEND') {
      newDividends += txData.amount;
    }

    const newTx: PartnerTransaction = {
      ...txData,
      id: txRef.id,
      createdAt: new Date().toISOString()
    };

    transaction.set(txRef, newTx);
    transaction.update(partnerRef, {
      totalInvested: newInvested,
      totalDividends: newDividends,
      updatedAt: new Date().toISOString()
    });
  });
};
