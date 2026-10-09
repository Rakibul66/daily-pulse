import { getFirebaseServices } from './firebase';
import { collection, doc, setDoc, getDoc, getDocs, query, where, updateDoc, deleteDoc, writeBatch } from 'firebase/firestore';
import { sanitizeForFirestore } from './firestoreUtils';
import { SalesClient, DailySale, SalesCollection, SalesReturn, SalesReturnItem } from '@/types/sales';

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

  await setDoc(docRef, sanitizeForFirestore(newClient));
  return docRef.id;
};

export const updateSalesClient = async (id: string, updates: Partial<Omit<SalesClient, 'id' | 'userId' | 'createdAt'>>): Promise<void> => {
  const { db } = getFirebaseServices();
  if (!db) throw new Error('Firebase not configured');
  
  const docRef = doc(db, CLIENTS_COLLECTION, id);
  await updateDoc(docRef, sanitizeForFirestore({ ...updates, updatedAt: new Date().toISOString() }));
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

  await setDoc(docRef, sanitizeForFirestore(newInvoice));
  return docRef.id;
};

export const updateSalesInvoice = async (id: string, updates: Partial<Omit<DailySale, "id" | "userId" | "createdAt">>): Promise<void> => {
  const { db } = getFirebaseServices();
  if (!db) throw new Error('Firebase not configured');
  
  const docRef = doc(db, INVOICES_COLLECTION, id);
  await updateDoc(docRef, sanitizeForFirestore({ ...updates, updatedAt: new Date().toISOString() }));
};

export const deleteSalesInvoice = async (id: string): Promise<void> => {
  const { db } = getFirebaseServices();
  if (!db) throw new Error('Firebase not configured');
  
  await deleteDoc(doc(db, INVOICES_COLLECTION, id));
};

export const getSalesInvoiceById = async (id: string): Promise<DailySale | null> => {
  const { db } = getFirebaseServices();
  if (!db) return null;
  const docRef = doc(db, INVOICES_COLLECTION, id);
  const snap = await getDoc(docRef);
  if (snap.exists()) {
    return { ...snap.data(), id: snap.id } as DailySale;
  }
  return null;
};

// --- SALES COLLECTIONS / PAYMENT RECEIPTS ---
const COLLECTIONS_COLLECTION = 'sales_collections';

export const DEFAULT_SALES_COLLECTIONS: Omit<SalesCollection, 'id' | 'userId' | 'createdAt' | 'updatedAt'>[] = [
  {
    companyName: 'M/S Buyzid Rubber',
    date: '09-10-2026',
    clientId: 'client-wali',
    clientName: 'Wali',
    collectionType: 'Advance',
    paymentNo: 'STC2610000001',
    paymentType: 'Cash',
    accountHead: 'Cash in Hand',
    amount: 2230.00,
    balance: 0,
    remarks: '',
    staff: 'Admin'
  }
];

export const seedDefaultSalesCollections = async (userId: string, companyId?: string): Promise<void> => {
  const { db } = getFirebaseServices();
  if (!db) return;

  const batch = writeBatch(db);
  const now = new Date().toISOString();

  DEFAULT_SALES_COLLECTIONS.forEach((col) => {
    const docRef = doc(collection(db, COLLECTIONS_COLLECTION));
    const fullRecord: SalesCollection = {
      ...col,
      id: docRef.id,
      userId,
      companyId: companyId || userId,
      createdAt: now,
      updatedAt: now,
    };
    batch.set(docRef, sanitizeForFirestore(fullRecord));
  });

  await batch.commit();
};

export const getSalesCollections = async (userId: string, companyId?: string, isRetry: boolean = false): Promise<SalesCollection[]> => {
  const { db } = getFirebaseServices();
  if (!db) throw new Error('Firebase not configured');

  const items: SalesCollection[] = [];
  const seenIds = new Set<string>();

  const qUser = query(collection(db, COLLECTIONS_COLLECTION), where('userId', '==', userId));
  const snapUser = await getDocs(qUser);
  snapUser.forEach((docSnap) => {
    seenIds.add(docSnap.id);
    items.push({ ...docSnap.data(), id: docSnap.id } as SalesCollection);
  });

  if (companyId && companyId !== userId) {
    try {
      const qCompany = query(collection(db, COLLECTIONS_COLLECTION), where('companyId', '==', companyId));
      const snapCompany = await getDocs(qCompany);
      snapCompany.forEach((docSnap) => {
        if (!seenIds.has(docSnap.id)) {
          seenIds.add(docSnap.id);
          items.push({ ...docSnap.data(), id: docSnap.id } as SalesCollection);
        }
      });
    } catch (e) {
      console.warn('Company sales collections query error:', e);
    }
  }

  // Auto seed defaults if empty (single retry guard to prevent infinite recursion)
  if (items.length === 0 && !isRetry) {
    try {
      await seedDefaultSalesCollections(userId, companyId);
      return await getSalesCollections(userId, companyId, true);
    } catch (err) {
      console.warn('Auto-seed sales collections error:', err);
    }
  }

  items.sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());
  return items;
};

export const addSalesCollection = async (
  item: Omit<SalesCollection, 'id' | 'createdAt' | 'updatedAt'>
): Promise<string> => {
  const { db } = getFirebaseServices();
  if (!db) throw new Error('Firebase not configured');

  const docRef = doc(collection(db, COLLECTIONS_COLLECTION));
  const now = new Date().toISOString();
  const newRecord: SalesCollection = {
    ...item,
    id: docRef.id,
    createdAt: now,
    updatedAt: now,
  };

  await setDoc(docRef, sanitizeForFirestore(newRecord));
  return docRef.id;
};

export const updateSalesCollection = async (
  id: string,
  updates: Partial<Omit<SalesCollection, 'id' | 'userId' | 'createdAt'>>
): Promise<void> => {
  const { db } = getFirebaseServices();
  if (!db) throw new Error('Firebase not configured');

  const docRef = doc(db, COLLECTIONS_COLLECTION, id);
  await updateDoc(docRef, sanitizeForFirestore({ ...updates, updatedAt: new Date().toISOString() }));
};

export const deleteSalesCollection = async (id: string): Promise<void> => {
  const { db } = getFirebaseServices();
  if (!db) throw new Error('Firebase not configured');
  await deleteDoc(doc(db, COLLECTIONS_COLLECTION, id));
};

export const deleteSalesCollectionsBulk = async (ids: string[]): Promise<void> => {
  const { db } = getFirebaseServices();
  if (!db) throw new Error('Firebase not configured');
  if (ids.length === 0) return;

  const CHUNK_SIZE = 400;
  for (let i = 0; i < ids.length; i += CHUNK_SIZE) {
    const chunk = ids.slice(i, i + CHUNK_SIZE);
    const batch = writeBatch(db);
    chunk.forEach((id) => {
      batch.delete(doc(db, COLLECTIONS_COLLECTION, id));
    });
    await batch.commit();
  }
};

export const getSalesCollectionById = async (id: string): Promise<SalesCollection | null> => {
  const { db } = getFirebaseServices();
  if (!db) return null;
  const docRef = doc(db, COLLECTIONS_COLLECTION, id);
  const snap = await getDoc(docRef);
  if (snap.exists()) {
    return { ...snap.data(), id: snap.id } as SalesCollection;
  }
  return null;
};

// ==========================================
// SALES RETURNS
// ==========================================
const RETURNS_COLLECTION = 'sales_returns';

export const DEFAULT_SALES_STORES = [
  'Shankhari Bazar',
  'Main Store',
  'Dhanmondi Branch',
  'Gulshan Outlet',
  'Uttara Hub',
  'Mirpur Branch'
];

export const DEFAULT_SALES_RETURNS: Omit<SalesReturn, 'id' | 'userId' | 'companyId' | 'createdAt' | 'updatedAt'>[] = [
  {
    companyName: 'M/S Buyzid Rubber',
    returnNo: 'RR26050001',
    clientId: 'client-1',
    clientName: 'cffff',
    customerPhone: '01711223344',
    invoiceNo: 'INV-260501',
    storeName: 'Shankhari Bazar',
    returnDate: '13-05-2026',
    returnReason: 'Wrong size delivered',
    amount: 66.00,
    staff: 'Admin',
    remarks: '',
    isApproved: true,
    status: 'APPROVED',
    items: [
      { id: 'item-1', productName: 'Rubber Bushing 12mm', code: 'RB-12', invoiceNo: 'INV-260501', salesQty: 2, returnedQty: 0, currentReturn: 1, rate: 66.00, amount: 66.00, selected: true }
    ]
  },
  {
    companyName: 'M/S Buyzid Rubber',
    returnNo: 'RR26040006',
    clientId: 'client-2',
    clientName: 'Walk-in Customer',
    customerPhone: '01822334455',
    invoiceNo: 'INV-260412',
    storeName: 'Shankhari Bazar',
    returnDate: '18-04-2026',
    returnReason: 'Customer changed mind',
    amount: 185.00,
    staff: 'Arnob Sur',
    remarks: '',
    isApproved: true,
    status: 'APPROVED',
    items: [
      { id: 'item-2', productName: 'Automotive Oil Seal', code: 'OS-40', invoiceNo: 'INV-260412', salesQty: 1, returnedQty: 0, currentReturn: 1, rate: 185.00, amount: 185.00, selected: true }
    ]
  },
  {
    companyName: 'M/S Buyzid Rubber',
    returnNo: 'RR26040005',
    clientId: 'client-3',
    clientName: 'M/S Super Retail',
    customerPhone: '01933445566',
    invoiceNo: 'INV-260408',
    storeName: 'Shankhari Bazar',
    returnDate: '18-04-2026',
    returnReason: 'Excess order returned',
    amount: 234.00,
    staff: 'Arnob Sur',
    remarks: '',
    isApproved: true,
    status: 'APPROVED',
    items: [
      { id: 'item-3', productName: 'Gasket Sheet A-Grade', code: 'GS-100', invoiceNo: 'INV-260408', salesQty: 2, returnedQty: 0, currentReturn: 1, rate: 234.00, amount: 234.00, selected: true }
    ]
  },
  {
    companyName: 'M/S Buyzid Rubber',
    returnNo: 'RR26040004',
    clientId: 'client-4',
    clientName: 'Bengal Traders',
    customerPhone: '01644556677',
    invoiceNo: 'INV-260405',
    storeName: 'Shankhari Bazar',
    returnDate: '18-04-2026',
    returnReason: 'Packaging damaged',
    amount: 1470.00,
    staff: 'Arnob Sur',
    remarks: '',
    isApproved: true,
    status: 'APPROVED',
    items: [
      { id: 'item-4', productName: 'Hydraulic Hose Pipe', code: 'HP-50', invoiceNo: 'INV-260405', salesQty: 3, returnedQty: 0, currentReturn: 1, rate: 1470.00, amount: 1470.00, selected: true }
    ]
  },
  {
    companyName: 'M/S Buyzid Rubber',
    returnNo: 'RR26040003',
    clientId: 'client-5',
    clientName: 'City Mart',
    customerPhone: '01755667788',
    invoiceNo: 'INV-260402',
    storeName: 'Shankhari Bazar',
    returnDate: '18-04-2026',
    returnReason: 'Color/variant mismatch',
    amount: 70.00,
    staff: 'Shamol Sen',
    remarks: '',
    isApproved: true,
    status: 'APPROVED',
    items: [
      { id: 'item-5', productName: 'Rubber O-Ring Pack', code: 'OR-10', invoiceNo: 'INV-260402', salesQty: 1, returnedQty: 0, currentReturn: 1, rate: 70.00, amount: 70.00, selected: true }
    ]
  },
  {
    companyName: 'M/S Buyzid Rubber',
    returnNo: 'RR26040002',
    clientId: 'client-6',
    clientName: 'Apex Departmental',
    customerPhone: '01866778899',
    invoiceNo: 'INV-260399',
    storeName: 'Shankhari Bazar',
    returnDate: '09-04-2026',
    returnReason: 'Returned by customer',
    amount: 800.00,
    staff: 'Arnob Sur',
    remarks: '',
    isApproved: true,
    status: 'APPROVED',
    items: [
      { id: 'item-6', productName: 'Industrial Rubber Matting', code: 'RM-200', invoiceNo: 'INV-260399', salesQty: 1, returnedQty: 0, currentReturn: 1, rate: 800.00, amount: 800.00, selected: true }
    ]
  },
  {
    companyName: 'M/S Buyzid Rubber',
    returnNo: 'RR26040001',
    clientId: 'client-7',
    clientName: 'Rahman Store',
    customerPhone: '01977889900',
    invoiceNo: 'INV-260390',
    storeName: 'Shankhari Bazar',
    returnDate: '02-04-2026',
    returnReason: 'Minor defect',
    amount: 60.00,
    staff: 'Arnob Sur',
    remarks: '',
    isApproved: true,
    status: 'APPROVED',
    items: [
      { id: 'item-7', productName: 'PVC Bush 15mm', code: 'PB-15', invoiceNo: 'INV-260390', salesQty: 1, returnedQty: 0, currentReturn: 1, rate: 60.00, amount: 60.00, selected: true }
    ]
  },
  {
    companyName: 'M/S Buyzid Rubber',
    returnNo: 'RR26030009',
    clientId: 'client-8',
    clientName: 'Popular General Store',
    customerPhone: '01588990011',
    invoiceNo: 'INV-260380',
    storeName: 'Shankhari Bazar',
    returnDate: '30-03-2026',
    returnReason: 'Order cancelled by buyer',
    amount: 942.00,
    staff: 'Shamol Sen',
    remarks: '',
    isApproved: true,
    status: 'APPROVED',
    items: [
      { id: 'item-8', productName: 'Conveyor Belt Strip 1M', code: 'CB-100', invoiceNo: 'INV-260380', salesQty: 2, returnedQty: 0, currentReturn: 1, rate: 942.00, amount: 942.00, selected: true }
    ]
  },
  {
    companyName: 'M/S Buyzid Rubber',
    returnNo: 'RR26030008',
    clientId: 'client-9',
    clientName: 'Modina Enterprise',
    customerPhone: '01799001122',
    invoiceNo: 'INV-260370',
    storeName: 'Shankhari Bazar',
    returnDate: '25-03-2026',
    returnReason: 'Exchanged with another item',
    amount: 90.00,
    staff: 'Shamol Sen',
    remarks: '',
    isApproved: true,
    status: 'APPROVED',
    items: [
      { id: 'item-9', productName: 'Silicon Tube 1M', code: 'ST-01', invoiceNo: 'INV-260370', salesQty: 1, returnedQty: 0, currentReturn: 1, rate: 90.00, amount: 90.00, selected: true }
    ]
  },
  {
    companyName: 'M/S Buyzid Rubber',
    returnNo: 'RR26030007',
    clientId: 'client-10',
    clientName: 'Bismillah Traders',
    customerPhone: '01811223344',
    invoiceNo: 'INV-260360',
    storeName: 'Shankhari Bazar',
    returnDate: '21-03-2026',
    returnReason: 'Overstocked',
    amount: 600.00,
    staff: 'Arnob Sur',
    remarks: '',
    isApproved: true,
    status: 'APPROVED',
    items: [
      { id: 'item-10', productName: 'Flange Rubber Washer Set', code: 'FW-50', invoiceNo: 'INV-260360', salesQty: 2, returnedQty: 0, currentReturn: 1, rate: 600.00, amount: 600.00, selected: true }
    ]
  }
];

export const seedDefaultSalesReturns = async (userId: string, companyId?: string): Promise<void> => {
  const { db } = getFirebaseServices();
  if (!db) return;

  const batch = writeBatch(db);
  const now = new Date().toISOString();

  DEFAULT_SALES_RETURNS.forEach((ret) => {
    const docRef = doc(collection(db, RETURNS_COLLECTION));
    const fullRecord: SalesReturn = {
      ...ret,
      id: docRef.id,
      userId,
      companyId: companyId || userId,
      createdAt: now,
      updatedAt: now,
    };
    batch.set(docRef, sanitizeForFirestore(fullRecord));
  });

  await batch.commit();
};

export const getSalesReturns = async (userId: string, companyId?: string, isRetry: boolean = false): Promise<SalesReturn[]> => {
  const { db } = getFirebaseServices();
  if (!db) throw new Error('Firebase not configured');

  const items: SalesReturn[] = [];
  const seenIds = new Set<string>();

  const qUser = query(collection(db, RETURNS_COLLECTION), where('userId', '==', userId));
  const snapUser = await getDocs(qUser);
  snapUser.forEach((docSnap) => {
    seenIds.add(docSnap.id);
    items.push({ ...docSnap.data(), id: docSnap.id } as SalesReturn);
  });

  if (companyId && companyId !== userId) {
    try {
      const qCompany = query(collection(db, RETURNS_COLLECTION), where('companyId', '==', companyId));
      const snapCompany = await getDocs(qCompany);
      snapCompany.forEach((docSnap) => {
        if (!seenIds.has(docSnap.id)) {
          seenIds.add(docSnap.id);
          items.push({ ...docSnap.data(), id: docSnap.id } as SalesReturn);
        }
      });
    } catch (e) {
      console.warn('Company sales returns query error:', e);
    }
  }

  // Auto-seed defaults if empty (single retry guard)
  if (items.length === 0 && !isRetry) {
    try {
      await seedDefaultSalesReturns(userId, companyId);
      return await getSalesReturns(userId, companyId, true);
    } catch (err) {
      console.warn('Auto-seed sales returns error:', err);
    }
  }

  items.sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());
  return items;
};

export const addSalesReturn = async (
  item: Omit<SalesReturn, 'id' | 'createdAt' | 'updatedAt'>
): Promise<string> => {
  const { db } = getFirebaseServices();
  if (!db) throw new Error('Firebase not configured');

  const docRef = doc(collection(db, RETURNS_COLLECTION));
  const now = new Date().toISOString();
  const newRecord: SalesReturn = {
    ...item,
    id: docRef.id,
    createdAt: now,
    updatedAt: now,
  };

  await setDoc(docRef, sanitizeForFirestore(newRecord));
  return docRef.id;
};

export const updateSalesReturn = async (
  id: string,
  updates: Partial<Omit<SalesReturn, 'id' | 'userId' | 'createdAt'>>
): Promise<void> => {
  const { db } = getFirebaseServices();
  if (!db) throw new Error('Firebase not configured');

  const docRef = doc(db, RETURNS_COLLECTION, id);
  await updateDoc(docRef, sanitizeForFirestore({ ...updates, updatedAt: new Date().toISOString() }));
};

export const deleteSalesReturn = async (id: string): Promise<void> => {
  const { db } = getFirebaseServices();
  if (!db) throw new Error('Firebase not configured');
  await deleteDoc(doc(db, RETURNS_COLLECTION, id));
};

export const deleteSalesReturnsBulk = async (ids: string[]): Promise<void> => {
  const { db } = getFirebaseServices();
  if (!db) throw new Error('Firebase not configured');
  if (ids.length === 0) return;

  const CHUNK_SIZE = 400;
  for (let i = 0; i < ids.length; i += CHUNK_SIZE) {
    const chunk = ids.slice(i, i + CHUNK_SIZE);
    const batch = writeBatch(db);
    chunk.forEach((id) => {
      batch.delete(doc(db, RETURNS_COLLECTION, id));
    });
    await batch.commit();
  }
};

export const getSalesReturnById = async (id: string): Promise<SalesReturn | null> => {
  const { db } = getFirebaseServices();
  if (!db) return null;
  const docRef = doc(db, RETURNS_COLLECTION, id);
  const snap = await getDoc(docRef);
  if (snap.exists()) {
    return { ...snap.data(), id: snap.id } as SalesReturn;
  }
  return null;
};

export const generateSalesReturnNo = async (userId: string, companyId?: string): Promise<string> => {
  const now = new Date();
  const yy = String(now.getFullYear()).slice(-2);
  const mm = String(now.getMonth() + 1).padStart(2, '0');
  const prefix = `RR${yy}${mm}`;

  try {
    const returns = await getSalesReturns(userId, companyId);
    const matching = returns
      .map(r => r.returnNo || '')
      .filter(no => no.startsWith(prefix));

    if (matching.length === 0) {
      return `${prefix}0001`;
    }

    let maxNum = 0;
    matching.forEach(no => {
      const suffix = no.slice(prefix.length);
      const parsed = parseInt(suffix, 10);
      if (!isNaN(parsed) && parsed > maxNum) {
        maxNum = parsed;
      }
    });

    return `${prefix}${String(maxNum + 1).padStart(4, '0')}`;
  } catch (e) {
    return `${prefix}0001`;
  }
};

