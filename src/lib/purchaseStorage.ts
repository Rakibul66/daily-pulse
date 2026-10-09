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
  writeBatch,
  increment 
} from 'firebase/firestore';
import { sanitizeForFirestore } from './firestoreUtils';
import { ProductLift, ProductLiftItem, PurchaseVendor, PurchaseReturn, PurchaseReturnItem, VendorPayment } from '@/types/purchase';

const PURCHASE_PRODUCTS_COLLECTION = 'purchase_products';
const PURCHASE_VENDORS_COLLECTION = 'purchase_vendors';
const PURCHASE_RETURNS_COLLECTION = 'purchase_returns';
const PURCHASE_PAYMENTS_COLLECTION = 'purchase_payments';
const PRODUCTS_COLLECTION = 'products';

export const DEFAULT_STORES = [
  'Shankhari Bazar',
  'Main Store',
  'Dhanmondi Branch',
  'Gulshan Outlet',
  'Uttara Hub',
  'Mirpur Branch'
];

export const DEFAULT_LIFTING_TYPES = [
  'By Manual',
  'By Purchase Order',
  'Direct Lift',
  'Opening Balance',
  'Consignment'
];

export const DEFAULT_PAYMENT_TYPES = [
  'Credit',
  'Cash',
  'Bank Transfer',
  'Cheque',
  'Mobile Banking'
];

export const DEFAULT_PURCHASE_VENDORS: Omit<PurchaseVendor, 'id' | 'userId' | 'createdAt' | 'updatedAt'>[] = [
  {
    code: '300000000030',
    name: '3S Distributor',
    contactPerson: 'Md. Shahidul Islam',
    email: 'contact@3sdistributor.bd',
    phone: '01711223344',
    address: '3S Distributor, Mirpur 1, Dhaka',
    account: '3S Distributor Ltd.',
    status: 'ACTIVE'
  },
  {
    code: '300000000029',
    name: 'A.K TRADING CORPORATION',
    contactPerson: 'Al-Amin Khan',
    email: 'aktrading@corp.com.bd',
    phone: '01819556677',
    address: 'A.K TRADING CORPORATION, Tongi Industrial Area, Gazipur',
    account: 'A.K TRADING CORP.',
    status: 'ACTIVE'
  },
  {
    code: '300000000028',
    name: 'Aarong Dairy',
    contactPerson: 'Mustafizur Rahman',
    email: 'dairy.orders@aarong.com',
    phone: '01977889900',
    address: 'Aarong Dairy, BRAC Center, Tejgaon, Dhaka',
    account: 'Aarong Dairy Enterprise',
    status: 'ACTIVE'
  },
  {
    code: '300000000027',
    name: 'Abul Khair Consumer Point',
    contactPerson: 'Kamrul Hasan',
    email: 'supply@abulkhairgroup.com',
    phone: '01312345678',
    address: 'Abul Khair, Agrabad C/A, Chattogram',
    account: 'Abul Khair Consumer Products Ltd.',
    status: 'ACTIVE'
  }
];

export const DEFAULT_PRODUCT_LIFTS: Omit<ProductLift, 'id' | 'userId' | 'createdAt' | 'updatedAt'>[] = [
  {
    type: 'credit',
    liftingType: 'By Manual',
    paymentType: 'Credit',
    purchaseNo: 'STL2609000007',
    purchaseDate: '2026-09-21',
    date: '21-09-2026',
    voucherNo: '',
    vendor: 'A.K TRADING CORPORATION',
    store: 'Shankhari Bazar',
    purchasedBy: 'Admin',
    items: [
      { id: 'item-1', category: 'Dairy & Bakery', productName: 'Pure Ghee 1kg Can', code: '89012301', rate: 1186.66, quantity: 60, amount: 71200.00 }
    ],
    discountType: 'fixed',
    discountValue: 0,
    subtotal: 71200.00,
    discountAmount: 0,
    costAmount: 71200.00,
    status: 'RECEIVED'
  },
  {
    type: 'credit',
    liftingType: 'By Manual',
    paymentType: 'Credit',
    purchaseNo: 'STL2609000006',
    purchaseDate: '2026-09-17',
    date: '17-09-2026',
    voucherNo: '',
    vendor: 'Aarong Dairy',
    store: 'Shankhari Bazar',
    purchasedBy: 'Admin',
    items: [
      { id: 'item-1', category: 'Dairy & Bakery', productName: 'Pasteurized Milk 1L Pack', code: '89012302', rate: 94.00, quantity: 5, amount: 470.00 }
    ],
    discountType: 'fixed',
    discountValue: 0,
    subtotal: 470.00,
    discountAmount: 0,
    costAmount: 470.00,
    status: 'RECEIVED'
  },
  {
    type: 'credit',
    liftingType: 'By Manual',
    paymentType: 'Credit',
    purchaseNo: 'STL2609000005',
    purchaseDate: '2026-09-14',
    date: '14-09-2026',
    voucherNo: '',
    vendor: '3S Distributor',
    store: 'Shankhari Bazar',
    purchasedBy: 'purchase',
    items: [
      { id: 'item-1', category: 'Electronic Machines', productName: 'Commercial Espresso Machine Dual Group', code: '89012303', rate: 515840.00, quantity: 4, amount: 2063360.00 }
    ],
    discountType: 'fixed',
    discountValue: 0,
    subtotal: 2063360.00,
    discountAmount: 0,
    costAmount: 2063360.00,
    status: 'RECEIVED'
  },
  {
    type: 'cash',
    liftingType: 'By Manual',
    paymentType: 'Cash',
    purchaseNo: 'STL2609000004',
    purchaseDate: '2026-09-14',
    date: '14-09-2026',
    voucherNo: '',
    vendor: 'Abul Khair Consumer Point',
    store: 'Shankhari Bazar',
    purchasedBy: 'Admin',
    items: [
      { id: 'item-1', category: 'Household & Cleaning', productName: 'Dish Wash Bar Family Pack 400g', code: '89012304', rate: 50.00, quantity: 100, amount: 5000.00 }
    ],
    discountType: 'fixed',
    discountValue: 0,
    subtotal: 5000.00,
    discountAmount: 0,
    costAmount: 5000.00,
    status: 'RECEIVED'
  },
  {
    type: 'credit',
    liftingType: 'By Manual',
    paymentType: 'Credit',
    purchaseNo: 'STL2609000003',
    purchaseDate: '2026-09-14',
    date: '14-09-2026',
    voucherNo: '68965899',
    vendor: 'A.K TRADING CORPORATION',
    store: 'Shankhari Bazar',
    purchasedBy: 'Admin',
    items: [
      { id: 'item-1', category: 'Baby Products', productName: 'Baby Powder Herbal 200g', code: '89012305', rate: 165.00, quantity: 20, amount: 3300.00 }
    ],
    discountType: 'fixed',
    discountValue: 0,
    subtotal: 3300.00,
    discountAmount: 0,
    costAmount: 3300.00,
    status: 'RECEIVED'
  },
  {
    type: 'credit',
    liftingType: 'By Manual',
    paymentType: 'Credit',
    purchaseNo: 'STL2609000002',
    purchaseDate: '2026-09-10',
    date: '10-09-2026',
    voucherNo: '',
    vendor: 'Aarong Dairy',
    store: 'Shankhari Bazar',
    purchasedBy: 'Admin',
    items: [
      { id: 'item-1', category: 'Dairy & Bakery', productName: 'Salted Butter 200g Block', code: '89012306', rate: 178.00, quantity: 20, amount: 3560.00 }
    ],
    discountType: 'fixed',
    discountValue: 0,
    subtotal: 3560.00,
    discountAmount: 0,
    costAmount: 3560.00,
    status: 'RECEIVED'
  },
  {
    type: 'credit',
    liftingType: 'By Manual',
    paymentType: 'Credit',
    purchaseNo: 'STL2609000001',
    purchaseDate: '2026-09-10',
    date: '10-09-2026',
    voucherNo: '',
    vendor: 'Aarong Dairy',
    store: 'Shankhari Bazar',
    purchasedBy: 'Admin',
    items: [
      { id: 'item-1', category: 'Dairy & Bakery', productName: 'Fresh Sour Cream 250ml', code: '89012307', rate: 201.00, quantity: 25, amount: 5025.00 }
    ],
    discountType: 'fixed',
    discountValue: 0,
    subtotal: 5025.00,
    discountAmount: 0,
    costAmount: 5025.00,
    status: 'RECEIVED'
  },
  {
    type: 'credit',
    liftingType: 'By Manual',
    paymentType: 'Credit',
    purchaseNo: 'STL2607000002',
    purchaseDate: '2026-07-27',
    date: '27-07-2026',
    voucherNo: '22',
    vendor: '3S Distributor',
    store: 'Shankhari Bazar',
    purchasedBy: 'Admin',
    items: [
      { id: 'item-1', category: 'Electronic Accessories', productName: 'Heavy Duty Power Strip 6-Socket', code: '89012308', rate: 1000.00, quantity: 5, amount: 5000.00 }
    ],
    discountType: 'fixed',
    discountValue: 0,
    subtotal: 5000.00,
    discountAmount: 0,
    costAmount: 5000.00,
    status: 'RECEIVED'
  },
  {
    type: 'credit',
    liftingType: 'By Manual',
    paymentType: 'Credit',
    purchaseNo: 'STL2607000001',
    purchaseDate: '2026-07-07',
    date: '07-07-2026',
    voucherNo: '',
    vendor: 'Aarong Dairy',
    store: 'Shankhari Bazar',
    purchasedBy: 'Admin',
    items: [
      { id: 'item-1', category: 'Dairy & Bakery', productName: 'Low Fat Yogurt Cup 150g', code: '89012309', rate: 33.00, quantity: 100, amount: 3300.00 }
    ],
    discountType: 'fixed',
    discountValue: 0,
    subtotal: 3300.00,
    discountAmount: 0,
    costAmount: 3300.00,
    status: 'RECEIVED'
  },
  {
    type: 'credit',
    liftingType: 'By Manual',
    paymentType: 'Credit',
    purchaseNo: 'STL2605000001',
    purchaseDate: '2026-05-07',
    date: '07-05-2026',
    voucherNo: '',
    vendor: '3S Distributor',
    store: 'Shankhari Bazar',
    purchasedBy: 'Admin',
    items: [
      { id: 'item-1', category: 'Stationery & Office', productName: 'Permanent Marker Dual Tip (Box of 10)', code: '89012310', rate: 165.00, quantity: 2, amount: 330.00 }
    ],
    discountType: 'fixed',
    discountValue: 0,
    subtotal: 330.00,
    discountAmount: 0,
    costAmount: 330.00,
    status: 'RECEIVED'
  }
];

// Helper to format date as DD-MM-YYYY
export const formatDateDDMMYYYY = (dateStr: string): string => {
  if (!dateStr) return '';
  if (/^\d{2}-\d{2}-\d{4}$/.test(dateStr)) return dateStr;
  const parts = dateStr.split('-');
  if (parts.length === 3) {
    if (parts[0].length === 4) {
      // YYYY-MM-DD -> DD-MM-YYYY
      return `${parts[2]}-${parts[1]}-${parts[0]}`;
    }
  }
  return dateStr;
};

// Auto-seed Product Lifts
export const seedDefaultProductLifts = async (userId: string, companyId?: string): Promise<void> => {
  const { db } = getFirebaseServices();
  if (!db) return;

  const batch = writeBatch(db);
  const now = new Date().toISOString();

  DEFAULT_PRODUCT_LIFTS.forEach((lift) => {
    const docRef = doc(collection(db, PURCHASE_PRODUCTS_COLLECTION));
    const fullRecord: ProductLift = {
      ...lift,
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

// Auto-seed Purchase Vendors
export const seedDefaultPurchaseVendors = async (userId: string, companyId?: string): Promise<void> => {
  const { db } = getFirebaseServices();
  if (!db) return;

  const batch = writeBatch(db);
  const now = new Date().toISOString();

  DEFAULT_PURCHASE_VENDORS.forEach((vendor) => {
    const docRef = doc(collection(db, PURCHASE_VENDORS_COLLECTION));
    const fullRecord: PurchaseVendor = {
      ...vendor,
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

// Fetch Product Lifts
export const getProductLifts = async (userId: string, companyId?: string, isRetry: boolean = false): Promise<ProductLift[]> => {
  const { db } = getFirebaseServices();
  if (!db) throw new Error('Firebase not configured');

  const items: ProductLift[] = [];
  const seenIds = new Set<string>();

  const qUser = query(collection(db, PURCHASE_PRODUCTS_COLLECTION), where('userId', '==', userId));
  const snapUser = await getDocs(qUser);
  snapUser.forEach((docSnap) => {
    seenIds.add(docSnap.id);
    const data = docSnap.data() as ProductLift;
    items.push({
      ...data,
      id: docSnap.id,
      date: data.date || formatDateDDMMYYYY(data.purchaseDate)
    });
  });

  if (companyId && companyId !== userId) {
    try {
      const qCompany = query(collection(db, PURCHASE_PRODUCTS_COLLECTION), where('companyId', '==', companyId));
      const snapCompany = await getDocs(qCompany);
      snapCompany.forEach((docSnap) => {
        if (!seenIds.has(docSnap.id)) {
          seenIds.add(docSnap.id);
          const data = docSnap.data() as ProductLift;
          items.push({
            ...data,
            id: docSnap.id,
            date: data.date || formatDateDDMMYYYY(data.purchaseDate)
          });
        }
      });
    } catch (e) {
      console.warn('Company product lifts query error:', e);
    }
  }

  // Auto seed defaults if empty (single retry guard to prevent infinite recursion)
  if (items.length === 0 && !isRetry) {
    try {
      await seedDefaultProductLifts(userId, companyId);
      return await getProductLifts(userId, companyId, true);
    } catch (err) {
      console.warn('Auto-seed product lifts error:', err);
    }
  }

  items.sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());
  return items;
};

// Add Product Lift
export const addProductLift = async (
  lift: Omit<ProductLift, 'id' | 'createdAt' | 'updatedAt'>
): Promise<string> => {
  const { db } = getFirebaseServices();
  if (!db) throw new Error('Firebase not configured');

  const docRef = doc(collection(db, PURCHASE_PRODUCTS_COLLECTION));
  const now = new Date().toISOString();
  const newRecord: ProductLift = {
    ...lift,
    id: docRef.id,
    date: lift.date || formatDateDDMMYYYY(lift.purchaseDate),
    createdAt: now,
    updatedAt: now,
  };

  await setDoc(docRef, sanitizeForFirestore(newRecord));

  // Sync inventory stock for products in this purchase lifting
  if (lift.items && lift.items.length > 0) {
    for (const item of lift.items) {
      if (item.productId && item.quantity > 0) {
        try {
          const prodRef = doc(db, PRODUCTS_COLLECTION, item.productId);
          await updateDoc(prodRef, {
            stock: increment(item.quantity),
            purchasePrice: item.rate,
            cost: item.rate,
            updatedAt: now
          });
        } catch (e) {
          console.warn(`Could not increment stock for product ${item.productId}:`, e);
        }
      }
    }
  }

  return docRef.id;
};

// Update Product Lift
export const updateProductLift = async (
  id: string,
  updates: Partial<Omit<ProductLift, 'id' | 'userId' | 'createdAt'>>
): Promise<void> => {
  const { db } = getFirebaseServices();
  if (!db) throw new Error('Firebase not configured');

  const docRef = doc(db, PURCHASE_PRODUCTS_COLLECTION, id);
  const sanitizedUpdates: any = { 
    ...updates, 
    updatedAt: new Date().toISOString() 
  };
  if (updates.purchaseDate) {
    sanitizedUpdates.date = formatDateDDMMYYYY(updates.purchaseDate);
  }

  await updateDoc(docRef, sanitizeForFirestore(sanitizedUpdates));
};

// Delete Product Lift
export const deleteProductLift = async (id: string): Promise<void> => {
  const { db } = getFirebaseServices();
  if (!db) throw new Error('Firebase not configured');
  await deleteDoc(doc(db, PURCHASE_PRODUCTS_COLLECTION, id));
};

// Bulk Delete Product Lifts
export const deleteProductLiftsBulk = async (ids: string[]): Promise<void> => {
  const { db } = getFirebaseServices();
  if (!db) throw new Error('Firebase not configured');
  if (ids.length === 0) return;

  const CHUNK_SIZE = 400;
  for (let i = 0; i < ids.length; i += CHUNK_SIZE) {
    const chunk = ids.slice(i, i + CHUNK_SIZE);
    const batch = writeBatch(db);
    chunk.forEach((id) => {
      batch.delete(doc(db, PURCHASE_PRODUCTS_COLLECTION, id));
    });
    await batch.commit();
  }
};

// Fetch Vendors
export const getPurchaseVendors = async (userId: string, companyId?: string, isRetry: boolean = false): Promise<PurchaseVendor[]> => {
  const { db } = getFirebaseServices();
  if (!db) throw new Error('Firebase not configured');

  const items: PurchaseVendor[] = [];
  const seenIds = new Set<string>();

  const qUser = query(collection(db, PURCHASE_VENDORS_COLLECTION), where('userId', '==', userId));
  const snapUser = await getDocs(qUser);
  snapUser.forEach((docSnap) => {
    seenIds.add(docSnap.id);
    items.push(docSnap.data() as PurchaseVendor);
  });

  if (companyId && companyId !== userId) {
    try {
      const qCompany = query(collection(db, PURCHASE_VENDORS_COLLECTION), where('companyId', '==', companyId));
      const snapCompany = await getDocs(qCompany);
      snapCompany.forEach((docSnap) => {
        if (!seenIds.has(docSnap.id)) {
          seenIds.add(docSnap.id);
          items.push(docSnap.data() as PurchaseVendor);
        }
      });
    } catch (e) {
      console.warn('Company vendors query error:', e);
    }
  }

  // Auto seed default vendors if empty (single retry guard to prevent infinite recursion)
  if (items.length === 0 && !isRetry) {
    try {
      await seedDefaultPurchaseVendors(userId, companyId);
      return await getPurchaseVendors(userId, companyId, true);
    } catch (err) {
      console.warn('Auto-seed purchase vendors error:', err);
    }
  }

  items.sort((a, b) => a.name.localeCompare(b.name));
  return items;
};

// Add Vendor
export const addPurchaseVendor = async (
  vendor: Omit<PurchaseVendor, 'id' | 'createdAt' | 'updatedAt'>
): Promise<string> => {
  const { db } = getFirebaseServices();
  if (!db) throw new Error('Firebase not configured');

  const docRef = doc(collection(db, PURCHASE_VENDORS_COLLECTION));
  const now = new Date().toISOString();
  const newRecord: PurchaseVendor = {
    ...vendor,
    id: docRef.id,
    createdAt: now,
    updatedAt: now,
  };

  await setDoc(docRef, sanitizeForFirestore(newRecord));
  return docRef.id;
};

// Update Vendor
export const updatePurchaseVendor = async (
  id: string,
  updates: Partial<Omit<PurchaseVendor, 'id' | 'userId' | 'createdAt'>>
): Promise<void> => {
  const { db } = getFirebaseServices();
  if (!db) throw new Error('Firebase not configured');

  const docRef = doc(db, PURCHASE_VENDORS_COLLECTION, id);
  await updateDoc(docRef, sanitizeForFirestore({ ...updates, updatedAt: new Date().toISOString() }));
};

// Delete Vendor
export const deletePurchaseVendor = async (id: string): Promise<void> => {
  const { db } = getFirebaseServices();
  if (!db) throw new Error('Firebase not configured');
  await deleteDoc(doc(db, PURCHASE_VENDORS_COLLECTION, id));
};

// ==========================================
// PURCHASE RETURNS (PURCHASE RETURN SCREENSHOT)
// ==========================================

export const DEFAULT_PURCHASE_RETURNS: Omit<PurchaseReturn, 'id' | 'userId' | 'createdAt' | 'updatedAt'>[] = [
  {
    company: 'M/S Buyzid Rubber',
    vendor: 'Square Food and Beverage',
    store: 'Shankhari Bazar',
    returnDate: '2026-04-25',
    date: '25-04-2026',
    amount: 2224.13,
    staff: 'Arnob Sur',
    remarks: 'Date Over',
    items: [
      { id: 'ret-item-1', productName: 'Radhuni Master Oil 1L', category: 'Cooking & Spices', code: '89012351', rate: 222.41, quantity: 10, amount: 2224.13 }
    ]
  },
  {
    company: 'M/S Buyzid Rubber',
    vendor: 'Darkin Trade & Distribution',
    store: 'Shankhari Bazar',
    returnDate: '2026-04-20',
    date: '20-04-2026',
    amount: 320.00,
    staff: 'Arnob Sur',
    remarks: 'Date Over',
    items: [
      { id: 'ret-item-2', productName: 'Instant Noodles Pack (Box)', category: 'Snacks & Confectionery', code: '89012352', rate: 160.00, quantity: 2, amount: 320.00 }
    ]
  },
  {
    company: 'M/S Buyzid Rubber',
    vendor: 'Darkin Trade & Distribution',
    store: 'Shankhari Bazar',
    returnDate: '2026-04-20',
    date: '20-04-2026',
    amount: 126.00,
    staff: 'Arnob Sur',
    remarks: 'Date Over',
    items: [
      { id: 'ret-item-3', productName: 'Tomato Ketchup 200g', category: 'Cooking & Spices', code: '89012353', rate: 63.00, quantity: 2, amount: 126.00 }
    ]
  },
  {
    company: 'M/S Buyzid Rubber',
    vendor: 'International Distribution',
    store: 'Shankhari Bazar',
    returnDate: '2026-04-19',
    date: '19-04-2026',
    amount: 349.20,
    staff: 'Arnob Sur',
    remarks: 'Date Over',
    items: [
      { id: 'ret-item-4', productName: 'Chocolate Bar Premium 80g', category: 'Snacks & Confectionery', code: '89012354', rate: 116.40, quantity: 3, amount: 349.20 }
    ]
  },
  {
    company: 'M/S Buyzid Rubber',
    vendor: 'M/S Muhammad Corporation',
    store: 'Shankhari Bazar',
    returnDate: '2026-04-11',
    date: '11-04-2026',
    amount: 283.00,
    staff: 'Arnob Sur',
    remarks: 'Date Over',
    items: [
      { id: 'ret-item-5', productName: 'Hand Wash Refill 500ml', category: 'Personal Care & Hygiene', code: '89012355', rate: 141.50, quantity: 2, amount: 283.00 }
    ]
  },
  {
    company: 'M/S Buyzid Rubber',
    vendor: 'Prestige Bengal Ltd',
    store: 'Shankhari Bazar',
    returnDate: '2026-04-10',
    date: '10-04-2026',
    amount: 7304.00,
    staff: 'Arnob Sur',
    remarks: 'Date Over',
    items: [
      { id: 'ret-item-6', productName: 'Ghee Premium 900g Jar', category: 'Dairy & Bakery', code: '89012356', rate: 913.00, quantity: 8, amount: 7304.00 }
    ]
  },
  {
    company: 'M/S Buyzid Rubber',
    vendor: 'Square Food and Beverage',
    store: 'Shankhari Bazar',
    returnDate: '2026-04-09',
    date: '09-04-2026',
    amount: 1668.10,
    staff: 'Arnob Sur',
    remarks: 'Date Over',
    items: [
      { id: 'ret-item-7', productName: 'Chashi Aromatic Rice 5kg', category: 'Cooking & Spices', code: '89012357', rate: 834.05, quantity: 2, amount: 1668.10 }
    ]
  },
  {
    company: 'M/S Buyzid Rubber',
    vendor: 'SS Distribution',
    store: 'Shankhari Bazar',
    returnDate: '2026-04-06',
    date: '06-04-2026',
    amount: 603.00,
    staff: 'Arnob Sur',
    remarks: 'Date Over',
    items: [
      { id: 'ret-item-8', productName: 'Soft Drink 2L Pet Bottle', category: 'Beverages & Drinks', code: '89012358', rate: 100.50, quantity: 6, amount: 603.00 }
    ]
  },
  {
    company: 'M/S Buyzid Rubber',
    vendor: 'PRAN GROUP',
    store: 'Shankhari Bazar',
    returnDate: '2026-04-06',
    date: '06-04-2026',
    amount: 390.00,
    staff: 'Arnob Sur',
    remarks: 'Date Over',
    items: [
      { id: 'ret-item-9', productName: 'Mango Fruit Juice 1L Pack', category: 'Beverages & Drinks', code: '89012359', rate: 130.00, quantity: 3, amount: 390.00 }
    ]
  },
  {
    company: 'M/S Buyzid Rubber',
    vendor: 'Nestle',
    store: 'Shankhari Bazar',
    returnDate: '2026-04-05',
    date: '05-04-2026',
    amount: 500.50,
    staff: 'Arnob Sur',
    remarks: 'Date Over',
    items: [
      { id: 'ret-item-10', productName: 'Classic Instant Coffee 100g', category: 'Beverages & Drinks', code: '89012360', rate: 500.50, quantity: 1, amount: 500.50 }
    ]
  }
];

export const seedDefaultPurchaseReturns = async (userId: string, companyId?: string): Promise<void> => {
  const { db } = getFirebaseServices();
  if (!db) return;

  const batch = writeBatch(db);
  const now = new Date().toISOString();

  DEFAULT_PURCHASE_RETURNS.forEach((ret) => {
    const docRef = doc(collection(db, PURCHASE_RETURNS_COLLECTION));
    const fullRecord: PurchaseReturn = {
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

export const getPurchaseReturns = async (userId: string, companyId?: string, isRetry: boolean = false): Promise<PurchaseReturn[]> => {
  const { db } = getFirebaseServices();
  if (!db) throw new Error('Firebase not configured');

  const items: PurchaseReturn[] = [];
  const seenIds = new Set<string>();

  const qUser = query(collection(db, PURCHASE_RETURNS_COLLECTION), where('userId', '==', userId));
  const snapUser = await getDocs(qUser);
  snapUser.forEach((docSnap) => {
    seenIds.add(docSnap.id);
    const data = docSnap.data() as PurchaseReturn;
    items.push({
      ...data,
      id: docSnap.id,
      date: data.date || formatDateDDMMYYYY(data.returnDate)
    });
  });

  if (companyId && companyId !== userId) {
    try {
      const qCompany = query(collection(db, PURCHASE_RETURNS_COLLECTION), where('companyId', '==', companyId));
      const snapCompany = await getDocs(qCompany);
      snapCompany.forEach((docSnap) => {
        if (!seenIds.has(docSnap.id)) {
          seenIds.add(docSnap.id);
          const data = docSnap.data() as PurchaseReturn;
          items.push({
            ...data,
            id: docSnap.id,
            date: data.date || formatDateDDMMYYYY(data.returnDate)
          });
        }
      });
    } catch (e) {
      console.warn('Company purchase returns query error:', e);
    }
  }

  // Auto seed defaults if empty (single retry guard to prevent infinite recursion)
  if (items.length === 0 && !isRetry) {
    try {
      await seedDefaultPurchaseReturns(userId, companyId);
      return await getPurchaseReturns(userId, companyId, true);
    } catch (err) {
      console.warn('Auto-seed purchase returns error:', err);
    }
  }

  items.sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());
  return items;
};

export const addPurchaseReturn = async (
  ret: Omit<PurchaseReturn, 'id' | 'createdAt' | 'updatedAt'>
): Promise<string> => {
  const { db } = getFirebaseServices();
  if (!db) throw new Error('Firebase not configured');

  const docRef = doc(collection(db, PURCHASE_RETURNS_COLLECTION));
  const now = new Date().toISOString();
  const newRecord: PurchaseReturn = {
    ...ret,
    id: docRef.id,
    date: ret.date || formatDateDDMMYYYY(ret.returnDate),
    createdAt: now,
    updatedAt: now,
  };

  await setDoc(docRef, sanitizeForFirestore(newRecord));

  // If items provided, reduce stock in products catalog
  if (ret.items && ret.items.length > 0) {
    for (const item of ret.items) {
      if (item.productId && item.quantity > 0) {
        try {
          const prodRef = doc(db, PRODUCTS_COLLECTION, item.productId);
          await updateDoc(prodRef, {
            stock: increment(-item.quantity),
            updatedAt: now
          });
        } catch (e) {
          console.warn(`Could not decrement stock for product ${item.productId}:`, e);
        }
      }
    }
  }

  return docRef.id;
};

export const updatePurchaseReturn = async (
  id: string,
  updates: Partial<Omit<PurchaseReturn, 'id' | 'userId' | 'createdAt'>>
): Promise<void> => {
  const { db } = getFirebaseServices();
  if (!db) throw new Error('Firebase not configured');

  const docRef = doc(db, PURCHASE_RETURNS_COLLECTION, id);
  const sanitizedUpdates: any = { 
    ...updates, 
    updatedAt: new Date().toISOString() 
  };
  if (updates.returnDate) {
    sanitizedUpdates.date = formatDateDDMMYYYY(updates.returnDate);
  }

  await updateDoc(docRef, sanitizeForFirestore(sanitizedUpdates));
};

export const deletePurchaseReturn = async (id: string): Promise<void> => {
  const { db } = getFirebaseServices();
  if (!db) throw new Error('Firebase not configured');
  await deleteDoc(doc(db, PURCHASE_RETURNS_COLLECTION, id));
};

export const deletePurchaseReturnsBulk = async (ids: string[]): Promise<void> => {
  const { db } = getFirebaseServices();
  if (!db) throw new Error('Firebase not configured');
  if (ids.length === 0) return;

  const CHUNK_SIZE = 400;
  for (let i = 0; i < ids.length; i += CHUNK_SIZE) {
    const chunk = ids.slice(i, i + CHUNK_SIZE);
    const batch = writeBatch(db);
    chunk.forEach((id) => {
      batch.delete(doc(db, PURCHASE_RETURNS_COLLECTION, id));
    });
    await batch.commit();
  }
};

// ==========================================
// VENDOR PAYMENTS (VENDOR PAYMENT SCREEN)
// ==========================================

export const DEFAULT_VENDOR_PAYMENTS: Omit<VendorPayment, 'id' | 'userId' | 'createdAt' | 'updatedAt'>[] = [
  {
    paymentNo: 'STP2609000001',
    paymentDate: '2026-09-14',
    date: '14-09-2026',
    vendor: 'Abul Khair Consumer Point',
    paymentType: 'Cash at Hand',
    amount: 5000.00,
    voucherRef: 'STL2609000004',
    remarks: 'Advance Payment for Delivery',
    staff: 'Admin',
    status: 'COMPLETED'
  },
  {
    paymentNo: 'STP2609000002',
    paymentDate: '2026-09-18',
    date: '18-09-2026',
    vendor: 'A.K TRADING CORPORATION',
    paymentType: 'Bank Transfer',
    amount: 25000.00,
    voucherRef: 'STL2609000007',
    bankName: 'Islami Bank Bangladesh Ltd',
    remarks: 'Invoice STL2609000007 Clearing',
    staff: 'Admin',
    status: 'COMPLETED'
  },
  {
    paymentNo: 'STP2609000003',
    paymentDate: '2026-09-20',
    date: '20-09-2026',
    vendor: 'Aarong Dairy',
    paymentType: 'Cash at Hand',
    amount: 3560.00,
    voucherRef: 'STL2609000002',
    remarks: 'Settlement for Invoice STL2609000002',
    staff: 'Admin',
    status: 'COMPLETED'
  },
  {
    paymentNo: 'STP2609000004',
    paymentDate: '2026-09-22',
    date: '22-09-2026',
    vendor: '3S Distributor',
    paymentType: 'Bank Transfer',
    amount: 50000.00,
    voucherRef: 'STL2609000005',
    bankName: 'City Bank Ltd',
    remarks: 'Commercial Equipment Advance',
    staff: 'purchase',
    status: 'COMPLETED'
  },
  {
    paymentNo: 'STP2609000005',
    paymentDate: '2026-09-25',
    date: '25-09-2026',
    vendor: 'Square Food and Beverage',
    paymentType: 'Cheque',
    amount: 15000.00,
    chequeNo: 'CHQ-9812401',
    bankName: 'BRAC Bank',
    remarks: 'Monthly Supply Clearing',
    staff: 'Admin',
    status: 'COMPLETED'
  }
];

export const seedDefaultVendorPayments = async (userId: string, companyId?: string): Promise<void> => {
  const { db } = getFirebaseServices();
  if (!db) return;

  const batch = writeBatch(db);
  const now = new Date().toISOString();

  DEFAULT_VENDOR_PAYMENTS.forEach((pay) => {
    const docRef = doc(collection(db, PURCHASE_PAYMENTS_COLLECTION));
    const fullRecord: VendorPayment = {
      ...pay,
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

export const getVendorPayments = async (userId: string, companyId?: string, isRetry: boolean = false): Promise<VendorPayment[]> => {
  const { db } = getFirebaseServices();
  if (!db) throw new Error('Firebase not configured');

  const items: VendorPayment[] = [];
  const seenIds = new Set<string>();

  const qUser = query(collection(db, PURCHASE_PAYMENTS_COLLECTION), where('userId', '==', userId));
  const snapUser = await getDocs(qUser);
  snapUser.forEach((docSnap) => {
    seenIds.add(docSnap.id);
    const data = docSnap.data() as VendorPayment;
    items.push({
      ...data,
      id: docSnap.id,
      date: data.date || formatDateDDMMYYYY(data.paymentDate)
    });
  });

  if (companyId && companyId !== userId) {
    try {
      const qCompany = query(collection(db, PURCHASE_PAYMENTS_COLLECTION), where('companyId', '==', companyId));
      const snapCompany = await getDocs(qCompany);
      snapCompany.forEach((docSnap) => {
        if (!seenIds.has(docSnap.id)) {
          seenIds.add(docSnap.id);
          const data = docSnap.data() as VendorPayment;
          items.push({
            ...data,
            id: docSnap.id,
            date: data.date || formatDateDDMMYYYY(data.paymentDate)
          });
        }
      });
    } catch (e) {
      console.warn('Company vendor payments query error:', e);
    }
  }

  // Auto seed defaults if empty (single retry guard to prevent infinite recursion)
  if (items.length === 0 && !isRetry) {
    try {
      await seedDefaultVendorPayments(userId, companyId);
      return await getVendorPayments(userId, companyId, true);
    } catch (err) {
      console.warn('Auto-seed vendor payments error:', err);
    }
  }

  items.sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());
  return items;
};

export const addVendorPayment = async (
  pay: Omit<VendorPayment, 'id' | 'createdAt' | 'updatedAt'>
): Promise<string> => {
  const { db } = getFirebaseServices();
  if (!db) throw new Error('Firebase not configured');

  const docRef = doc(collection(db, PURCHASE_PAYMENTS_COLLECTION));
  const now = new Date().toISOString();
  const newRecord: VendorPayment = {
    ...pay,
    id: docRef.id,
    date: pay.date || formatDateDDMMYYYY(pay.paymentDate),
    createdAt: now,
    updatedAt: now,
  };

  await setDoc(docRef, sanitizeForFirestore(newRecord));
  return docRef.id;
};

export const updateVendorPayment = async (
  id: string,
  updates: Partial<Omit<VendorPayment, 'id' | 'userId' | 'createdAt'>>
): Promise<void> => {
  const { db } = getFirebaseServices();
  if (!db) throw new Error('Firebase not configured');

  const docRef = doc(db, PURCHASE_PAYMENTS_COLLECTION, id);
  const sanitizedUpdates: any = { 
    ...updates, 
    updatedAt: new Date().toISOString() 
  };
  if (updates.paymentDate) {
    sanitizedUpdates.date = formatDateDDMMYYYY(updates.paymentDate);
  }

  await updateDoc(docRef, sanitizeForFirestore(sanitizedUpdates));
};

export const deleteVendorPayment = async (id: string): Promise<void> => {
  const { db } = getFirebaseServices();
  if (!db) throw new Error('Firebase not configured');
  await deleteDoc(doc(db, PURCHASE_PAYMENTS_COLLECTION, id));
};

export const deleteVendorPaymentsBulk = async (ids: string[]): Promise<void> => {
  const { db } = getFirebaseServices();
  if (!db) throw new Error('Firebase not configured');
  if (ids.length === 0) return;

  const CHUNK_SIZE = 400;
  for (let i = 0; i < ids.length; i += CHUNK_SIZE) {
    const chunk = ids.slice(i, i + CHUNK_SIZE);
    const batch = writeBatch(db);
    chunk.forEach((id) => {
      batch.delete(doc(db, PURCHASE_PAYMENTS_COLLECTION, id));
    });
    await batch.commit();
  }
};


