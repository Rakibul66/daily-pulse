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
import { ProductCategory, MeasurementUnit, Product, ProductBrand, ProductTag } from '@/types/product';

const CATEGORIES_COLLECTION = 'product_categories';
const UNITS_COLLECTION = 'measurement_units';
const BRANDS_COLLECTION = 'product_brands';
const TAGS_COLLECTION = 'product_tags';
const PRODUCTS_COLLECTION = 'products';

// Default UOM Presets for new tenants
export const DEFAULT_MEASUREMENT_UNITS = [
  { name: 'Piece', code: 'Pcs' },
  { name: 'Kilogram', code: 'KG' },
  { name: 'Gram', code: 'Gm' },
  { name: 'Liter', code: 'Ltr' },
  { name: 'Box', code: 'Box' },
  { name: 'Pack', code: 'Pack' },
  { name: 'Dozen', code: 'Dzn' },
];

// Default Category Presets matching enterprise retail / FMCG / electronics catalog
export const DEFAULT_PRODUCT_CATEGORIES: { name: string; parentCategory: string }[] = [
  // Primary Root Categories
  { name: 'Baby Products', parentCategory: 'None' },
  { name: 'Dairy & Bakery', parentCategory: 'None' },
  { name: 'Electronic Machines', parentCategory: 'None' },
  { name: 'Electronic Accessories', parentCategory: 'None' },
  { name: 'Beverages & Drinks', parentCategory: 'None' },
  { name: 'Snacks & Confectionery', parentCategory: 'None' },
  { name: 'Personal Care & Hygiene', parentCategory: 'None' },
  { name: 'Household & Cleaning', parentCategory: 'None' },
  { name: 'Cooking & Spices', parentCategory: 'None' },
  { name: 'Meat & Fish', parentCategory: 'None' },
  { name: 'Fresh Fruits & Vegetables', parentCategory: 'None' },
  { name: 'Health & Pharmacy', parentCategory: 'None' },
  { name: 'Stationery & Office', parentCategory: 'None' },
  { name: 'Clothing & Apparel', parentCategory: 'None' },

  // Pre-configured Sub-Categories from User Screenshot
  { name: 'Baby Brush', parentCategory: 'Baby Products' },
  { name: 'Baby Cup & Bati & Chamus', parentCategory: 'Baby Products' },
  { name: 'Baby Milk', parentCategory: 'Baby Products' },
  { name: 'Baby Powder & Lotion& Oil & Cream', parentCategory: 'Baby Products' },
  { name: 'Baby Soap & Shampoo & Wipes', parentCategory: 'Baby Products' },
  { name: 'Butter & Sour Cream', parentCategory: 'Dairy & Bakery' },
  { name: 'Powder & Milk', parentCategory: 'Dairy & Bakery' },
  { name: 'Blender', parentCategory: 'Electronic Machines' },
  { name: 'Coffee Maker', parentCategory: 'Electronic Machines' },
  { name: 'Rice Cooker', parentCategory: 'Electronic Machines' },
];

// Default Brand Presets matching top retail / FMCG / electronics manufacturers
export const DEFAULT_PRODUCT_BRANDS: { name: string; code: string; description: string }[] = [
  { name: 'Unilever', code: 'UNI', description: 'Consumer Goods & Personal Care' },
  { name: 'Nestlé', code: 'NES', description: 'Food & Beverage' },
  { name: 'Samsung', code: 'SAM', description: 'Electronics & Appliances' },
  { name: 'Sony', code: 'SON', description: 'Consumer Electronics & Entertainment' },
  { name: 'Apple', code: 'AAPL', description: 'Technology & Devices' },
  { name: 'LG Electronics', code: 'LG', description: 'Home Appliances & Screens' },
  { name: 'PRAN', code: 'PRAN', description: 'Food, Beverage & Agrobusiness' },
  { name: 'Walton', code: 'WLT', description: 'Electronics & Home Appliances' },
  { name: 'Square Group', code: 'SQR', description: 'Toiletries & Healthcare' },
  { name: 'Radhuni', code: 'RDH', description: 'Spices & Cooking Essentials' },
  { name: 'Aarong Dairy', code: 'ARN', description: 'Dairy & Fresh Products' },
  { name: 'Generic / Local', code: 'GEN', description: 'Standard Non-Branded Items' },
];

// Default Tag Presets for catalog merchandising
export const DEFAULT_PRODUCT_TAGS: { name: string; color: string; description: string }[] = [
  { name: 'Best Seller', color: '#f59e0b', description: 'High volume top-selling items' },
  { name: 'New Arrival', color: '#10b981', description: 'Recently added stock' },
  { name: 'Hot Deal', color: '#ef4444', description: 'Special pricing or promotional item' },
  { name: 'Featured', color: '#3b82f6', description: 'Highlighted catalog item' },
  { name: 'Trending', color: '#8b5cf6', description: 'Currently high customer interest' },
  { name: 'Organic', color: '#84cc16', description: '100% organic and natural' },
  { name: 'Discounted', color: '#ec4899', description: 'Marked down price item' },
  { name: 'Eco-Friendly', color: '#06b6d4', description: 'Sustainable packaging or materials' },
];

// ==========================================
// 1. PRODUCT CATEGORIES CRUD
// ==========================================

export const getProductCategories = async (userId: string, companyId?: string): Promise<ProductCategory[]> => {
  const { db } = getFirebaseServices();
  if (!db) throw new Error('Firebase not configured');

  const qUser = query(collection(db, CATEGORIES_COLLECTION), where('userId', '==', userId));
  const snapshotUser = await getDocs(qUser);
  const items: ProductCategory[] = [];
  const seenIds = new Set<string>();

  snapshotUser.forEach((docSnap) => {
    seenIds.add(docSnap.id);
    items.push(docSnap.data() as ProductCategory);
  });

  if (companyId && companyId !== userId) {
    try {
      const qCompany = query(collection(db, CATEGORIES_COLLECTION), where('companyId', '==', companyId));
      const snapCompany = await getDocs(qCompany);
      snapCompany.forEach((docSnap) => {
        if (!seenIds.has(docSnap.id)) {
          seenIds.add(docSnap.id);
          items.push(docSnap.data() as ProductCategory);
        }
      });
    } catch (e) {
      console.warn('Company categories query error:', e);
    }
  }

  // Seed default presets if tenant has zero categories
  if (items.length === 0) {
    const batch = writeBatch(db);
    const now = new Date().toISOString();
    for (const preset of DEFAULT_PRODUCT_CATEGORIES) {
      const docRef = doc(collection(db, CATEGORIES_COLLECTION));
      const newCat: ProductCategory = {
        id: docRef.id,
        userId,
        companyId: companyId || userId,
        name: preset.name,
        parentCategory: preset.parentCategory,
        status: 'ACTIVE',
        createdAt: now,
        updatedAt: now,
      };
      batch.set(docRef, sanitizeForFirestore(newCat));
      items.push(newCat);
    }
    try {
      await batch.commit();
    } catch (e) {
      console.warn('Error seeding default categories batch:', e);
    }
  }

  items.sort((a, b) => (a.name || '').localeCompare(b.name || ''));
  return items;
};

export const addProductCategory = async (
  category: Omit<ProductCategory, 'id' | 'createdAt' | 'updatedAt'>
): Promise<string> => {
  const { db } = getFirebaseServices();
  if (!db) throw new Error('Firebase not configured');

  const docRef = doc(collection(db, CATEGORIES_COLLECTION));
  const now = new Date().toISOString();
  const newCat: ProductCategory = {
    ...category,
    id: docRef.id,
    createdAt: now,
    updatedAt: now,
  };

  await setDoc(docRef, sanitizeForFirestore(newCat));
  return docRef.id;
};

export const updateProductCategory = async (
  id: string, 
  updates: Partial<Omit<ProductCategory, 'id' | 'userId' | 'createdAt'>>
): Promise<void> => {
  const { db } = getFirebaseServices();
  if (!db) throw new Error('Firebase not configured');

  const docRef = doc(db, CATEGORIES_COLLECTION, id);
  await updateDoc(docRef, sanitizeForFirestore({ ...updates, updatedAt: new Date().toISOString() }));
};

export const deleteProductCategory = async (id: string): Promise<void> => {
  const { db } = getFirebaseServices();
  if (!db) throw new Error('Firebase not configured');
  await deleteDoc(doc(db, CATEGORIES_COLLECTION, id));
};

export const deleteProductCategoriesBulk = async (ids: string[]): Promise<void> => {
  const { db } = getFirebaseServices();
  if (!db) throw new Error('Firebase not configured');
  if (ids.length === 0) return;

  const CHUNK_SIZE = 400;
  for (let i = 0; i < ids.length; i += CHUNK_SIZE) {
    const chunk = ids.slice(i, i + CHUNK_SIZE);
    const batch = writeBatch(db);
    chunk.forEach((id) => {
      batch.delete(doc(db, CATEGORIES_COLLECTION, id));
    });
    await batch.commit();
  }
};

// ==========================================
// 2. MEASUREMENT UNITS (UOM) CRUD
// ==========================================

export const getMeasurementUnits = async (userId: string, companyId?: string): Promise<MeasurementUnit[]> => {
  const { db } = getFirebaseServices();
  if (!db) throw new Error('Firebase not configured');

  const qUser = query(collection(db, UNITS_COLLECTION), where('userId', '==', userId));
  const snapshotUser = await getDocs(qUser);
  const items: MeasurementUnit[] = [];
  const seenIds = new Set<string>();

  snapshotUser.forEach((docSnap) => {
    seenIds.add(docSnap.id);
    items.push(docSnap.data() as MeasurementUnit);
  });

  if (companyId && companyId !== userId) {
    try {
      const qCompany = query(collection(db, UNITS_COLLECTION), where('companyId', '==', companyId));
      const snapCompany = await getDocs(qCompany);
      snapCompany.forEach((docSnap) => {
        if (!seenIds.has(docSnap.id)) {
          seenIds.add(docSnap.id);
          items.push(docSnap.data() as MeasurementUnit);
        }
      });
    } catch (e) {
      console.warn('Company units query error:', e);
    }
  }

  // Seed default presets if tenant has zero units
  if (items.length === 0) {
    for (const preset of DEFAULT_MEASUREMENT_UNITS) {
      const docRef = doc(collection(db, UNITS_COLLECTION));
      const now = new Date().toISOString();
      const newUnit: MeasurementUnit = {
        id: docRef.id,
        userId,
        companyId: companyId || userId,
        name: preset.name,
        code: preset.code,
        status: 'ACTIVE',
        createdAt: now,
        updatedAt: now,
      };
      await setDoc(docRef, sanitizeForFirestore(newUnit));
      items.push(newUnit);
    }
  }

  items.sort((a, b) => (a.name || '').localeCompare(b.name || ''));
  return items;
};

export const addMeasurementUnit = async (
  unit: Omit<MeasurementUnit, 'id' | 'createdAt' | 'updatedAt'>
): Promise<string> => {
  const { db } = getFirebaseServices();
  if (!db) throw new Error('Firebase not configured');

  const docRef = doc(collection(db, UNITS_COLLECTION));
  const now = new Date().toISOString();
  const newUnit: MeasurementUnit = {
    ...unit,
    id: docRef.id,
    createdAt: now,
    updatedAt: now,
  };

  await setDoc(docRef, sanitizeForFirestore(newUnit));
  return docRef.id;
};

export const updateMeasurementUnit = async (
  id: string, 
  updates: Partial<Omit<MeasurementUnit, 'id' | 'userId' | 'createdAt'>>
): Promise<void> => {
  const { db } = getFirebaseServices();
  if (!db) throw new Error('Firebase not configured');

  const docRef = doc(db, UNITS_COLLECTION, id);
  await updateDoc(docRef, sanitizeForFirestore({ ...updates, updatedAt: new Date().toISOString() }));
};

export const deleteMeasurementUnit = async (id: string): Promise<void> => {
  const { db } = getFirebaseServices();
  if (!db) throw new Error('Firebase not configured');
  await deleteDoc(doc(db, UNITS_COLLECTION, id));
};

export const deleteMeasurementUnitsBulk = async (ids: string[]): Promise<void> => {
  const { db } = getFirebaseServices();
  if (!db) throw new Error('Firebase not configured');
  if (ids.length === 0) return;

  const CHUNK_SIZE = 400;
  for (let i = 0; i < ids.length; i += CHUNK_SIZE) {
    const chunk = ids.slice(i, i + CHUNK_SIZE);
    const batch = writeBatch(db);
    chunk.forEach((id) => {
      batch.delete(doc(db, UNITS_COLLECTION, id));
    });
    await batch.commit();
  }
};

// ==========================================
// 3. PRODUCTS CRUD
// ==========================================

export const getProducts = async (userId: string, companyId?: string): Promise<Product[]> => {
  const { db } = getFirebaseServices();
  if (!db) throw new Error('Firebase not configured');

  const qUser = query(collection(db, PRODUCTS_COLLECTION), where('userId', '==', userId));
  const snapshotUser = await getDocs(qUser);
  const items: Product[] = [];
  const seenIds = new Set<string>();

  snapshotUser.forEach((docSnap) => {
    seenIds.add(docSnap.id);
    const data = docSnap.data() as Product;
    // Normalize aliases
    items.push({
      ...data,
      code: data.code || data.sku || '',
      barcode: data.barcode || data.code || data.sku || '',
      brand: data.brand || '',
      tags: data.tags || [],
      parentCategory: data.parentCategory || data.category || 'General',
      retailPrice: data.retailPrice ?? data.price ?? 0,
      price: data.retailPrice ?? data.price ?? 0,
      purchasePrice: data.purchasePrice ?? (data as any).cost ?? 0,
      cost: data.purchasePrice ?? (data as any).cost ?? 0,
      clientPrice: data.clientPrice ?? data.retailPrice ?? data.price ?? 0,
      uom: data.uom || 'Pcs',
      reorderLevel: data.reorderLevel ?? data.minStock ?? 5,
      status: data.status || 'ACTIVE',
      stock: data.stock ?? 0,
    });
  });

  if (companyId && companyId !== userId) {
    try {
      const qCompany = query(collection(db, PRODUCTS_COLLECTION), where('companyId', '==', companyId));
      const snapCompany = await getDocs(qCompany);
      snapCompany.forEach((docSnap) => {
        if (!seenIds.has(docSnap.id)) {
          seenIds.add(docSnap.id);
          const data = docSnap.data() as Product;
          items.push({
            ...data,
            code: data.code || data.sku || '',
            barcode: data.barcode || data.code || data.sku || '',
            brand: data.brand || '',
            tags: data.tags || [],
            parentCategory: data.parentCategory || data.category || 'General',
            retailPrice: data.retailPrice ?? data.price ?? 0,
            price: data.retailPrice ?? data.price ?? 0,
            purchasePrice: data.purchasePrice ?? (data as any).cost ?? 0,
            cost: data.purchasePrice ?? (data as any).cost ?? 0,
            clientPrice: data.clientPrice ?? data.retailPrice ?? data.price ?? 0,
            uom: data.uom || 'Pcs',
            reorderLevel: data.reorderLevel ?? data.minStock ?? 5,
            status: data.status || 'ACTIVE',
            stock: data.stock ?? 0,
          });
        }
      });
    } catch (e) {
      console.warn('Company products query error:', e);
    }
  }

  items.sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());
  return items;
};

export const addProduct = async (
  product: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>
): Promise<string> => {
  const { db } = getFirebaseServices();
  if (!db) throw new Error('Firebase not configured');

  const name = (product.name || '').trim();
  if (!name) throw new Error('Product name is required');

  const docRef = doc(collection(db, PRODUCTS_COLLECTION));
  const now = new Date().toISOString();
  
  const retailPrice = !isNaN(Number(product.retailPrice)) && Number(product.retailPrice) >= 0 
    ? Number(product.retailPrice) 
    : (!isNaN(Number(product.price)) && Number(product.price) >= 0 ? Number(product.price) : 0);

  const purchasePrice = !isNaN(Number(product.purchasePrice)) && Number(product.purchasePrice) >= 0 
    ? Number(product.purchasePrice) 
    : (!isNaN(Number(product.cost)) && Number(product.cost) >= 0 ? Number(product.cost) : 0);

  const clientPrice = !isNaN(Number(product.clientPrice)) && Number(product.clientPrice) >= 0 
    ? Number(product.clientPrice) 
    : retailPrice;

  const stock = !isNaN(Number(product.stock)) && Number(product.stock) >= 0 ? Number(product.stock) : 0;
  const reorderLevel = !isNaN(Number(product.reorderLevel)) && Number(product.reorderLevel) >= 0 
    ? Number(product.reorderLevel) 
    : (!isNaN(Number(product.minStock)) && Number(product.minStock) >= 0 ? Number(product.minStock) : 5);

  const code = (product.code || product.sku || String(Math.floor(100000 + Math.random() * 900000))).trim();
  const parentCategory = (product.parentCategory || product.category || 'General').trim();

  const newProd: Product = {
    ...product,
    id: docRef.id,
    userId: product.userId,
    companyId: product.companyId || product.userId,
    name,
    code,
    sku: code,
    barcode: (product.barcode || code).trim(),
    parentCategory,
    category: parentCategory,
    retailPrice,
    price: retailPrice,
    purchasePrice,
    cost: purchasePrice,
    clientPrice,
    uom: product.uom || 'Pcs',
    reorderLevel,
    minStock: reorderLevel,
    stock,
    status: product.status || 'ACTIVE',
    createdAt: now,
    updatedAt: now,
  };

  await setDoc(docRef, sanitizeForFirestore(newProd));
  return docRef.id;
};

export const updateProduct = async (
  id: string, 
  updates: Partial<Omit<Product, 'id' | 'userId' | 'createdAt'>>
): Promise<void> => {
  const { db } = getFirebaseServices();
  if (!db) throw new Error('Firebase not configured');

  const docRef = doc(db, PRODUCTS_COLLECTION, id);
  // Strip immutable fields to prevent violating tenancyUnchanged() or createdAtUnchanged()
  const { id: _id, userId: _uid, createdAt: _ca, ...cleanUpdates } = updates as any;
  const sanitizedUpdates: any = { ...cleanUpdates, updatedAt: new Date().toISOString() };

  if (cleanUpdates.name !== undefined) sanitizedUpdates.name = cleanUpdates.name.trim();
  if (cleanUpdates.retailPrice !== undefined) {
    const val = Number(cleanUpdates.retailPrice);
    sanitizedUpdates.price = !isNaN(val) && val >= 0 ? val : 0;
    sanitizedUpdates.retailPrice = sanitizedUpdates.price;
  } else if (cleanUpdates.price !== undefined) {
    const val = Number(cleanUpdates.price);
    sanitizedUpdates.price = !isNaN(val) && val >= 0 ? val : 0;
    sanitizedUpdates.retailPrice = sanitizedUpdates.price;
  }

  if (cleanUpdates.purchasePrice !== undefined) {
    const val = Number(cleanUpdates.purchasePrice);
    sanitizedUpdates.cost = !isNaN(val) && val >= 0 ? val : 0;
    sanitizedUpdates.purchasePrice = sanitizedUpdates.cost;
  } else if (cleanUpdates.cost !== undefined) {
    const val = Number(cleanUpdates.cost);
    sanitizedUpdates.cost = !isNaN(val) && val >= 0 ? val : 0;
    sanitizedUpdates.purchasePrice = sanitizedUpdates.cost;
  }

  if (cleanUpdates.code !== undefined) {
    sanitizedUpdates.code = cleanUpdates.code.trim();
    sanitizedUpdates.sku = cleanUpdates.code.trim();
  }
  if (cleanUpdates.parentCategory !== undefined) {
    sanitizedUpdates.parentCategory = cleanUpdates.parentCategory.trim();
    sanitizedUpdates.category = cleanUpdates.parentCategory.trim();
  }
  if (cleanUpdates.stock !== undefined) {
    const val = Number(cleanUpdates.stock);
    sanitizedUpdates.stock = !isNaN(val) && val >= 0 ? val : 0;
  }
  if (cleanUpdates.reorderLevel !== undefined) {
    const val = Number(cleanUpdates.reorderLevel);
    sanitizedUpdates.reorderLevel = !isNaN(val) && val >= 0 ? val : 5;
    sanitizedUpdates.minStock = sanitizedUpdates.reorderLevel;
  }

  await updateDoc(docRef, sanitizeForFirestore(sanitizedUpdates));
};

export const deleteProduct = async (id: string): Promise<void> => {
  const { db } = getFirebaseServices();
  if (!db) throw new Error('Firebase not configured');
  await deleteDoc(doc(db, PRODUCTS_COLLECTION, id));
};

export const deleteProductsBulk = async (ids: string[]): Promise<void> => {
  const { db } = getFirebaseServices();
  if (!db) throw new Error('Firebase not configured');
  if (ids.length === 0) return;

  const CHUNK_SIZE = 400;
  for (let i = 0; i < ids.length; i += CHUNK_SIZE) {
    const chunk = ids.slice(i, i + CHUNK_SIZE);
    const batch = writeBatch(db);
    chunk.forEach((id) => {
      batch.delete(doc(db, PRODUCTS_COLLECTION, id));
    });
    await batch.commit();
  }
};

export const exportProductsToCSV = (products: Product[]) => {
  const headers = [
    'SL#',
    'Product Code',
    'Product Name',
    'Category',
    'Child Category',
    'UOM',
    'Purchase Price',
    'Client Price',
    'Retail Price',
    'Stock',
    'Reorder Level',
    'Status'
  ];

  const escapeCSV = (str: string | number | undefined | null) => {
    if (str === undefined || str === null) return '""';
    const s = String(str).replace(/"/g, '""');
    return `"${s}"`;
  };

  const rows = products.map((p, idx) => [
    idx + 1,
    escapeCSV(p.code || p.sku || ''),
    escapeCSV(p.name),
    escapeCSV(p.parentCategory || p.category || ''),
    escapeCSV(p.childCategory || ''),
    escapeCSV(p.uom || 'Pcs'),
    escapeCSV(p.purchasePrice || p.cost || 0),
    escapeCSV(p.clientPrice || 0),
    escapeCSV(p.retailPrice || p.price || 0),
    escapeCSV(p.stock || 0),
    escapeCSV(p.reorderLevel || p.minStock || 0),
    escapeCSV(p.status || 'ACTIVE'),
  ]);

  const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
  const blob = new Blob(["\uFEFF" + csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `products_list_${new Date().toISOString().split('T')[0]}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

// ==========================================
// 4. PRODUCT BRANDS CRUD
// ==========================================

export const getProductBrands = async (userId: string, companyId?: string): Promise<ProductBrand[]> => {
  const { db } = getFirebaseServices();
  if (!db) throw new Error('Firebase not configured');

  const qUser = query(collection(db, BRANDS_COLLECTION), where('userId', '==', userId));
  const snapshotUser = await getDocs(qUser);
  const items: ProductBrand[] = [];
  const seenIds = new Set<string>();

  snapshotUser.forEach((docSnap) => {
    seenIds.add(docSnap.id);
    items.push(docSnap.data() as ProductBrand);
  });

  if (companyId && companyId !== userId) {
    try {
      const qCompany = query(collection(db, BRANDS_COLLECTION), where('companyId', '==', companyId));
      const snapCompany = await getDocs(qCompany);
      snapCompany.forEach((docSnap) => {
        if (!seenIds.has(docSnap.id)) {
          seenIds.add(docSnap.id);
          items.push(docSnap.data() as ProductBrand);
        }
      });
    } catch (e) {
      console.warn('Company brands query error:', e);
    }
  }

  // Seed default presets if tenant has zero brands
  if (items.length === 0) {
    for (const preset of DEFAULT_PRODUCT_BRANDS) {
      const docRef = doc(collection(db, BRANDS_COLLECTION));
      const now = new Date().toISOString();
      const newBrand: ProductBrand = {
        id: docRef.id,
        userId,
        companyId: companyId || userId,
        name: preset.name,
        code: preset.code,
        description: preset.description,
        status: 'ACTIVE',
        createdAt: now,
        updatedAt: now,
      };
      await setDoc(docRef, sanitizeForFirestore(newBrand));
      items.push(newBrand);
    }
  }

  items.sort((a, b) => (a.name || '').localeCompare(b.name || ''));
  return items;
};

export const addProductBrand = async (
  brand: Omit<ProductBrand, 'id' | 'createdAt' | 'updatedAt'>
): Promise<string> => {
  const { db } = getFirebaseServices();
  if (!db) throw new Error('Firebase not configured');

  const docRef = doc(collection(db, BRANDS_COLLECTION));
  const now = new Date().toISOString();
  const newBrand: ProductBrand = {
    ...brand,
    id: docRef.id,
    createdAt: now,
    updatedAt: now,
  };

  await setDoc(docRef, sanitizeForFirestore(newBrand));
  return docRef.id;
};

export const updateProductBrand = async (
  id: string,
  updates: Partial<Omit<ProductBrand, 'id' | 'userId' | 'createdAt'>>
): Promise<void> => {
  const { db } = getFirebaseServices();
  if (!db) throw new Error('Firebase not configured');

  const docRef = doc(db, BRANDS_COLLECTION, id);
  await updateDoc(docRef, sanitizeForFirestore({ ...updates, updatedAt: new Date().toISOString() }));
};

export const deleteProductBrand = async (id: string): Promise<void> => {
  const { db } = getFirebaseServices();
  if (!db) throw new Error('Firebase not configured');
  await deleteDoc(doc(db, BRANDS_COLLECTION, id));
};

export const deleteProductBrandsBulk = async (ids: string[]): Promise<void> => {
  const { db } = getFirebaseServices();
  if (!db) throw new Error('Firebase not configured');
  if (ids.length === 0) return;

  const CHUNK_SIZE = 400;
  for (let i = 0; i < ids.length; i += CHUNK_SIZE) {
    const chunk = ids.slice(i, i + CHUNK_SIZE);
    const batch = writeBatch(db);
    chunk.forEach((id) => {
      batch.delete(doc(db, BRANDS_COLLECTION, id));
    });
    await batch.commit();
  }
};

// ==========================================
// 5. PRODUCT TAGS CRUD
// ==========================================

export const getProductTags = async (userId: string, companyId?: string): Promise<ProductTag[]> => {
  const { db } = getFirebaseServices();
  if (!db) throw new Error('Firebase not configured');

  const qUser = query(collection(db, TAGS_COLLECTION), where('userId', '==', userId));
  const snapshotUser = await getDocs(qUser);
  const items: ProductTag[] = [];
  const seenIds = new Set<string>();

  snapshotUser.forEach((docSnap) => {
    seenIds.add(docSnap.id);
    items.push(docSnap.data() as ProductTag);
  });

  if (companyId && companyId !== userId) {
    try {
      const qCompany = query(collection(db, TAGS_COLLECTION), where('companyId', '==', companyId));
      const snapCompany = await getDocs(qCompany);
      snapCompany.forEach((docSnap) => {
        if (!seenIds.has(docSnap.id)) {
          seenIds.add(docSnap.id);
          items.push(docSnap.data() as ProductTag);
        }
      });
    } catch (e) {
      console.warn('Company tags query error:', e);
    }
  }

  // Seed default presets if tenant has zero tags
  if (items.length === 0) {
    for (const preset of DEFAULT_PRODUCT_TAGS) {
      const docRef = doc(collection(db, TAGS_COLLECTION));
      const now = new Date().toISOString();
      const newTag: ProductTag = {
        id: docRef.id,
        userId,
        companyId: companyId || userId,
        name: preset.name,
        color: preset.color,
        description: preset.description,
        status: 'ACTIVE',
        createdAt: now,
        updatedAt: now,
      };
      await setDoc(docRef, sanitizeForFirestore(newTag));
      items.push(newTag);
    }
  }

  items.sort((a, b) => (a.name || '').localeCompare(b.name || ''));
  return items;
};

export const addProductTag = async (
  tag: Omit<ProductTag, 'id' | 'createdAt' | 'updatedAt'>
): Promise<string> => {
  const { db } = getFirebaseServices();
  if (!db) throw new Error('Firebase not configured');

  const docRef = doc(collection(db, TAGS_COLLECTION));
  const now = new Date().toISOString();
  const newTag: ProductTag = {
    ...tag,
    id: docRef.id,
    createdAt: now,
    updatedAt: now,
  };

  await setDoc(docRef, sanitizeForFirestore(newTag));
  return docRef.id;
};

export const updateProductTag = async (
  id: string,
  updates: Partial<Omit<ProductTag, 'id' | 'userId' | 'createdAt'>>
): Promise<void> => {
  const { db } = getFirebaseServices();
  if (!db) throw new Error('Firebase not configured');

  const docRef = doc(db, TAGS_COLLECTION, id);
  await updateDoc(docRef, sanitizeForFirestore({ ...updates, updatedAt: new Date().toISOString() }));
};

export const deleteProductTag = async (id: string): Promise<void> => {
  const { db } = getFirebaseServices();
  if (!db) throw new Error('Firebase not configured');
  await deleteDoc(doc(db, TAGS_COLLECTION, id));
};

export const deleteProductTagsBulk = async (ids: string[]): Promise<void> => {
  const { db } = getFirebaseServices();
  if (!db) throw new Error('Firebase not configured');
  if (ids.length === 0) return;

  const CHUNK_SIZE = 400;
  for (let i = 0; i < ids.length; i += CHUNK_SIZE) {
    const chunk = ids.slice(i, i + CHUNK_SIZE);
    const batch = writeBatch(db);
    chunk.forEach((id) => {
      batch.delete(doc(db, TAGS_COLLECTION, id));
    });
    await batch.commit();
  }
};
