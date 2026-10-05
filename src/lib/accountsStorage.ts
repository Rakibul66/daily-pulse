import { getFirebaseServices } from './firebase';
import { collection, doc, setDoc, getDocs, query, where, runTransaction, updateDoc, deleteDoc } from 'firebase/firestore';
import { PurchaseOrder, AccountTransaction } from '@/types/accounts';
import { Product } from '@/types/inventory';

const PO_COLLECTION = 'purchase_orders';
const TX_COLLECTION = 'account_transactions';
const PRODUCTS_COLLECTION = 'products';

export const getTransactions = async (userId: string): Promise<AccountTransaction[]> => {
  const { db } = getFirebaseServices();
  if (!db) throw new Error('Firebase not configured');

  const q = query(collection(db, TX_COLLECTION), where('userId', '==', userId));
  const snapshot = await getDocs(q);
  const items: AccountTransaction[] = [];
  snapshot.forEach((docSnap) => items.push(docSnap.data() as AccountTransaction));
  
  items.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  return items;
};

export const addTransaction = async (tx: Omit<AccountTransaction, 'id' | 'createdAt'>): Promise<string> => {
  const { db } = getFirebaseServices();
  if (!db) throw new Error('Firebase not configured');

  const docRef = doc(collection(db, TX_COLLECTION));
  const newTx: AccountTransaction = {
    ...tx,
    id: docRef.id,
    createdAt: new Date().toISOString(),
  };

  await setDoc(docRef, newTx);
  return docRef.id;
};

export const deleteTransaction = async (id: string): Promise<void> => {
  const { db } = getFirebaseServices();
  if (!db) throw new Error('Firebase not configured');
  await deleteDoc(doc(db, TX_COLLECTION, id));
};

export const getPurchaseOrders = async (userId: string): Promise<PurchaseOrder[]> => {
  const { db } = getFirebaseServices();
  if (!db) throw new Error('Firebase not configured');

  const q = query(collection(db, PO_COLLECTION), where('userId', '==', userId));
  const snapshot = await getDocs(q);
  const items: PurchaseOrder[] = [];
  snapshot.forEach((docSnap) => items.push(docSnap.data() as PurchaseOrder));
  
  items.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  return items;
};

export const createPurchaseOrder = async (poData: Omit<PurchaseOrder, 'id' | 'createdAt' | 'updatedAt' | 'status'>): Promise<string> => {
  const { db } = getFirebaseServices();
  if (!db) throw new Error('Firebase not configured');

  const docRef = doc(collection(db, PO_COLLECTION));
  const newPO: PurchaseOrder = {
    ...poData,
    id: docRef.id,
    status: 'Pending',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  await setDoc(docRef, newPO);
  return docRef.id;
};

export const receivePurchaseOrder = async (poId: string, userId: string): Promise<void> => {
  const { db } = getFirebaseServices();
  if (!db) throw new Error('Firebase not configured');

  const poRef = doc(db, PO_COLLECTION, poId);
  const accountTxRef = doc(collection(db, TX_COLLECTION));

  await runTransaction(db, async (transaction) => {
    // 1. Read PO
    const poDoc = await transaction.get(poRef);
    if (!poDoc.exists()) throw new Error('Purchase Order not found');
    const po = poDoc.data() as PurchaseOrder;

    if (po.status === 'Received') throw new Error('Purchase Order already received');

    // 2. Read Products
    const productRefs = po.items.map(item => doc(db, PRODUCTS_COLLECTION, item.productId));
    const productDocs = await Promise.all(productRefs.map(ref => transaction.get(ref)));
    
    const updates: {ref: any, newStock: number, newCost: number}[] = [];

    productDocs.forEach((pDoc, index) => {
      if (!pDoc.exists()) throw new Error(`Product not found: ${po.items[index].name}`);
      const product = pDoc.data() as Product;
      const boughtQty = po.items[index].quantity;
      const boughtCost = po.items[index].price;
      
      updates.push({ 
        ref: pDoc.ref, 
        newStock: product.stock + boughtQty,
        newCost: boughtCost // Update latest cost
      });
    });

    // 3. Write Product Updates
    updates.forEach(update => {
      transaction.update(update.ref, { 
        stock: update.newStock, 
        cost: update.newCost,
        updatedAt: new Date().toISOString() 
      });
    });

    // 4. Mark PO as Received
    transaction.update(poRef, { 
      status: 'Received', 
      updatedAt: new Date().toISOString() 
    });

    // 5. Write Account Transaction (Expense)
    const newTx: AccountTransaction = {
      id: accountTxRef.id,
      userId: userId,
      type: 'EXPENSE',
      category: 'Inventory Purchase',
      amount: po.totalCost,
      referenceId: po.id,
      description: `Inventory Purchase (Supplier: ${po.supplierName})`,
      date: new Date().toISOString().split('T')[0],
      createdAt: new Date().toISOString()
    };
    transaction.set(accountTxRef, newTx);
  });
};
