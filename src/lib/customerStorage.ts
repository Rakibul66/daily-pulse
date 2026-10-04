import { getFirebaseServices } from './firebase';
import { collection, doc, setDoc, getDocs, query, where, deleteDoc, updateDoc, orderBy, runTransaction } from 'firebase/firestore';
import { Customer, LoyaltyTransaction, LoyaltyTier, Promotion, CustomerFeedback } from '@/types/customer';

const CUSTOMERS_COLLECTION = 'customers';
const LOYALTY_COLLECTION = 'loyalty_transactions';

export const calculateTier = (totalSpent: number): LoyaltyTier => {
  if (totalSpent >= 50000) return 'Platinum';
  if (totalSpent >= 20000) return 'Gold';
  if (totalSpent >= 5000) return 'Silver';
  return 'Member';
};

export const getCustomers = async (userId: string): Promise<Customer[]> => {
  const { db } = getFirebaseServices();
  if (!db) throw new Error('Firebase not configured');

  const q = query(
    collection(db, CUSTOMERS_COLLECTION),
    where('userId', '==', userId)
  );

  const snapshot = await getDocs(q);
  const items: Customer[] = [];
  snapshot.forEach((docSnap) => items.push(docSnap.data() as Customer));
  
  items.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  return items;
};

export const addCustomer = async (customer: Omit<Customer, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> => {
  const { db } = getFirebaseServices();
  if (!db) throw new Error('Firebase not configured');

  const docRef = doc(collection(db, CUSTOMERS_COLLECTION));
  const newCustomer: Customer = {
    ...customer,
    id: docRef.id,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  await setDoc(docRef, newCustomer);
  return docRef.id;
};

export const updateCustomer = async (id: string, updates: Partial<Omit<Customer, 'id' | 'userId' | 'createdAt'>>): Promise<void> => {
  const { db } = getFirebaseServices();
  if (!db) throw new Error('Firebase not configured');
  
  const docRef = doc(db, CUSTOMERS_COLLECTION, id);
  await updateDoc(docRef, { ...updates, updatedAt: new Date().toISOString() });
};

export const deleteCustomer = async (id: string): Promise<void> => {
  const { db } = getFirebaseServices();
  if (!db) throw new Error('Firebase not configured');
  
  await deleteDoc(doc(db, CUSTOMERS_COLLECTION, id));
};

export const addCustomersBulk = async (userId: string, customers: Omit<Customer, 'id' | 'userId' | 'createdAt' | 'updatedAt'>[]): Promise<number> => {
  const { db } = getFirebaseServices();
  if (!db) throw new Error('Firebase not configured');

  let count = 0;
  // A simple loop for bulk insert. For production with thousands of records, use batched writes.
  for (const cust of customers) {
    const docRef = doc(collection(db, CUSTOMERS_COLLECTION));
    const newCustomer: Customer = {
      ...cust,
      userId,
      id: docRef.id,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    await setDoc(docRef, newCustomer);
    count++;
  }
  return count;
};

// Loyalty logic
export const getLoyaltyTransactions = async (userId: string, customerId: string): Promise<LoyaltyTransaction[]> => {
  const { db } = getFirebaseServices();
  if (!db) throw new Error('Firebase not configured');

  const q = query(
    collection(db, LOYALTY_COLLECTION),
    where('userId', '==', userId),
    where('customerId', '==', customerId)
  );

  const snapshot = await getDocs(q);
  const items: LoyaltyTransaction[] = [];
  snapshot.forEach((docSnap) => items.push(docSnap.data() as LoyaltyTransaction));
  
  items.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  return items;
};

export const processLoyaltyTransaction = async (
  userId: string, 
  customerId: string, 
  type: 'EARN' | 'REDEEM', 
  points: number, 
  amount: number, 
  description: string
): Promise<void> => {
  const { db } = getFirebaseServices();
  if (!db) throw new Error('Firebase not configured');

  await runTransaction(db, async (transaction) => {
    const customerRef = doc(db, CUSTOMERS_COLLECTION, customerId);
    const customerDoc = await transaction.get(customerRef);
    if (!customerDoc.exists()) throw new Error("Customer not found");

    const custData = customerDoc.data() as Customer;
    let newPoints = custData.loyaltyPoints;
    let newTotalSpent = custData.totalSpent;

    if (type === 'EARN') {
      newPoints += points;
      newTotalSpent += amount;
    } else if (type === 'REDEEM') {
      if (newPoints < points) throw new Error("Insufficient points");
      newPoints -= points;
    }

    const newTier = calculateTier(newTotalSpent);

    transaction.update(customerRef, {
      loyaltyPoints: newPoints,
      totalSpent: newTotalSpent,
      loyaltyTier: newTier,
      updatedAt: new Date().toISOString()
    });

    const txRef = doc(collection(db, LOYALTY_COLLECTION));
    const newTx: LoyaltyTransaction = {
      id: txRef.id,
      userId,
      customerId,
      type,
      points,
      amount,
      description,
      date: new Date().toISOString()
    };
    transaction.set(txRef, newTx);
  });
};

// Promotions Logic
const PROMOTIONS_COLLECTION = 'promotions';

export const getPromotions = async (userId: string): Promise<Promotion[]> => {
  const { db } = getFirebaseServices();
  if (!db) throw new Error('Firebase not configured');

  const q = query(
    collection(db, PROMOTIONS_COLLECTION),
    where('userId', '==', userId)
  );

  const snapshot = await getDocs(q);
  const items: Promotion[] = [];
  snapshot.forEach((docSnap) => items.push(docSnap.data() as Promotion));
  
  items.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  return items;
};

export const addPromotion = async (promo: Omit<Promotion, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> => {
  const { db } = getFirebaseServices();
  if (!db) throw new Error('Firebase not configured');

  const docRef = doc(collection(db, PROMOTIONS_COLLECTION));
  const newPromo: Promotion = {
    ...promo,
    id: docRef.id,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  await setDoc(docRef, newPromo);
  return docRef.id;
};

export const updatePromotion = async (id: string, updates: Partial<Omit<Promotion, 'id' | 'userId' | 'createdAt'>>): Promise<void> => {
  const { db } = getFirebaseServices();
  if (!db) throw new Error('Firebase not configured');
  
  const docRef = doc(db, PROMOTIONS_COLLECTION, id);
  await updateDoc(docRef, { ...updates, updatedAt: new Date().toISOString() });
};

export const deletePromotion = async (id: string): Promise<void> => {
  const { db } = getFirebaseServices();
  if (!db) throw new Error('Firebase not configured');
  
  await deleteDoc(doc(db, PROMOTIONS_COLLECTION, id));
};

// =======================
// CUSTOMER FEEDBACK
// =======================
const FEEDBACK_COLLECTION = 'customer_feedback';

export const getCustomerFeedback = async (userId: string): Promise<CustomerFeedback[]> => {
  const { db } = getFirebaseServices();
  if (!db) throw new Error('Firebase not configured');

  const q = query(collection(db, FEEDBACK_COLLECTION), where('userId', '==', userId));
  const snapshot = await getDocs(q);
  const items: CustomerFeedback[] = [];
  snapshot.forEach((docSnap) => items.push(docSnap.data() as CustomerFeedback));
  
  items.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  return items;
};

export const addCustomerFeedback = async (feedback: Omit<CustomerFeedback, "id" | "createdAt">): Promise<string> => {
  const { db } = getFirebaseServices();
  if (!db) throw new Error('Firebase not configured');

  const docRef = doc(collection(db, FEEDBACK_COLLECTION));
  const newFeedback = {
    ...feedback,
    id: docRef.id,
    createdAt: new Date().toISOString(),
  };

  await setDoc(docRef, newFeedback);
  return docRef.id;
};

export const deleteCustomerFeedback = async (id: string): Promise<void> => {
  const { db } = getFirebaseServices();
  if (!db) throw new Error('Firebase not configured');
  
  await deleteDoc(doc(db, FEEDBACK_COLLECTION, id));
};
