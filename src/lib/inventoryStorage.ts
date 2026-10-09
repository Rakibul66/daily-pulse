import { getFirebaseServices } from './firebase';
import { collection, doc, setDoc, getDocs, query, where, runTransaction, updateDoc, deleteDoc } from 'firebase/firestore';
import { sanitizeForFirestore } from './firestoreUtils';
import { Product, Sale } from '@/types/inventory';
import { AccountTransaction } from '@/types/accounts';

const PRODUCTS_COLLECTION = 'products';
const SALES_COLLECTION = 'sales';
const TX_COLLECTION = 'account_transactions';

export const getProducts = async (userId: string): Promise<Product[]> => {
  const { db } = getFirebaseServices();
  if (!db) throw new Error('Firebase not configured');

  const q = query(collection(db, PRODUCTS_COLLECTION), where('userId', '==', userId));
  const snapshot = await getDocs(q);
  const items: Product[] = [];
  snapshot.forEach((docSnap) => items.push(docSnap.data() as Product));
  
  items.sort((a, b) => a.name.localeCompare(b.name));
  return items;
};

export const addProduct = async (product: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> => {
  const { db } = getFirebaseServices();
  if (!db) throw new Error('Firebase not configured');

  const docRef = doc(collection(db, PRODUCTS_COLLECTION));
  const newProduct: any = {
    ...product,
    id: docRef.id,
    userId: product.userId,
    companyId: (product as any).companyId || product.userId,
    name: (product.name || '').trim(),
    price: !isNaN(Number(product.price)) && Number(product.price) >= 0 ? Number(product.price) : 0,
    cost: !isNaN(Number(product.cost)) && Number(product.cost) >= 0 ? Number(product.cost) : 0,
    stock: !isNaN(Number(product.stock)) && Number(product.stock) >= 0 ? Number(product.stock) : 0,
    minStock: !isNaN(Number(product.minStock)) && Number(product.minStock) >= 0 ? Number(product.minStock) : 5,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  await setDoc(docRef, sanitizeForFirestore(newProduct));
  return docRef.id;
};

export const updateProduct = async (id: string, updates: Partial<Omit<Product, 'id' | 'userId' | 'createdAt'>>): Promise<void> => {
  const { db } = getFirebaseServices();
  if (!db) throw new Error('Firebase not configured');
  
  const docRef = doc(db, PRODUCTS_COLLECTION, id);
  const { id: _id, userId: _uid, createdAt: _ca, ...cleanUpdates } = updates as any;
  await updateDoc(docRef, sanitizeForFirestore({ ...cleanUpdates, updatedAt: new Date().toISOString() }));
};

export const deleteProduct = async (id: string): Promise<void> => {
  const { db } = getFirebaseServices();
  if (!db) throw new Error('Firebase not configured');
  await deleteDoc(doc(db, PRODUCTS_COLLECTION, id));
};

export const getSales = async (userId: string): Promise<Sale[]> => {
  const { db } = getFirebaseServices();
  if (!db) throw new Error('Firebase not configured');

  const q = query(collection(db, SALES_COLLECTION), where('userId', '==', userId));
  const snapshot = await getDocs(q);
  const items: Sale[] = [];
  snapshot.forEach((docSnap) => items.push(docSnap.data() as Sale));
  
  items.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  return items;
};

export const processSale = async (
  saleData: Omit<Sale, 'id' | 'createdAt'>
): Promise<void> => {
  const { db } = getFirebaseServices();
  if (!db) throw new Error('Firebase not configured');

  const saleRef = doc(collection(db, SALES_COLLECTION));
  const accountTxRef = doc(collection(db, TX_COLLECTION));

  await runTransaction(db, async (transaction) => {
    // 1. Read all products to check stock
    const productRefs = saleData.items.map(item => doc(db, PRODUCTS_COLLECTION, item.productId));
    const productDocs = await Promise.all(productRefs.map(ref => transaction.get(ref)));
    
    const updates: {ref: any, newStock: number}[] = [];

    productDocs.forEach((pDoc, index) => {
      if (!pDoc.exists()) throw new Error(`Product not found: ${saleData.items[index].name}`);
      const product = pDoc.data() as Product;
      const saleQty = saleData.items[index].quantity;
      if (product.stock < saleQty) {
        throw new Error(`Insufficient stock for ${product.name}. Available: ${product.stock}`);
      }
      updates.push({ ref: pDoc.ref, newStock: product.stock - saleQty });
    });

    // 2. Write updates
    updates.forEach(update => {
      transaction.update(update.ref, { stock: update.newStock, updatedAt: new Date().toISOString() });
    });

    // 3. Write Sale Record
    const newSale: Sale = {
      ...saleData,
      id: saleRef.id,
      createdAt: new Date().toISOString()
    };
    transaction.set(saleRef, sanitizeForFirestore(newSale));

    // 4. Write Account Transaction (Income)
    const newTx: AccountTransaction = {
      id: accountTxRef.id,
      userId: saleData.userId,
      type: 'INCOME',
      category: 'Sales Revenue',
      amount: saleData.total,
      referenceId: saleRef.id,
      description: `Sales Revenue (Ref: ${saleRef.id})`,
      date: saleData.date,
      createdAt: new Date().toISOString()
    };
    transaction.set(accountTxRef, sanitizeForFirestore(newTx));
  });
};
