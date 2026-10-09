import { getFirebaseServices } from './firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';

export interface FeatureConfig {
  crm: boolean;               // CRM (Default: false)
  product: boolean;           // PRODUCT MANAGEMENT (Default: false)
  purchase: boolean;          // PURCHASE MANAGEMENT (Default: false)
  salesManagement: boolean;   // SALES MANAGEMENT (Default: false)
  partnerships: boolean;      // PARTNERSHIP (Default: false)
  // Legacy aliases for backwards compatibility
  salesCrm?: boolean;
  hrm?: boolean;
  utilities?: boolean;
  customers?: boolean;
}

export const DEFAULT_FEATURE_CONFIG: FeatureConfig = {
  crm: false,
  product: false,
  purchase: false,
  salesManagement: false,
  partnerships: false,
};

export interface FeatureItemMeta {
  key: keyof FeatureConfig;
  title: string;
  category: string;
  description: string;
  defaultEnabled: boolean;
  badge?: string;
}

export const AVAILABLE_FEATURES: FeatureItemMeta[] = [
  {
    key: 'crm',
    title: 'CRM',
    category: 'Customer Relationship',
    description: 'Track leads, conversion funnel, CRM dashboard, customer directory, and AI prospecting.',
    defaultEnabled: false,
    badge: 'OPTIONAL'
  },
  {
    key: 'product',
    title: 'PRODUCT MANAGEMENT',
    category: 'Inventory & Catalog',
    description: 'Product setup, category, brand, tag configuration, product list reports, barcodes & UOM units.',
    defaultEnabled: false,
    badge: 'OPTIONAL'
  },
  {
    key: 'purchase',
    title: 'PURCHASE MANAGEMENT',
    category: 'Procurement',
    description: 'Vendor supplier accounts, product lifting, purchase return claims, payments & vendor statements.',
    defaultEnabled: false,
    badge: 'OPTIONAL'
  },
  {
    key: 'salesManagement',
    title: 'SALES MANAGEMENT',
    category: 'Billing & POS',
    description: 'Counter checkout, sales invoices, collections, return approvals, retail returns & POS terminal.',
    defaultEnabled: false,
    badge: 'OPTIONAL'
  },
  {
    key: 'partnerships',
    title: 'PARTNERSHIP',
    category: 'Corporate Finance',
    description: 'Investor capital pool, shareholder ledger, dividend payouts, and equity share accounting.',
    defaultEnabled: false,
    badge: 'OPTIONAL'
  },
];

const CONFIG_STORAGE_KEY = 'dp_feature_config';

export const getStoredFeatureConfig = (): FeatureConfig => {
  if (typeof window === 'undefined') return DEFAULT_FEATURE_CONFIG;
  try {
    const raw = localStorage.getItem(CONFIG_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      return {
        crm: parsed.crm === true || parsed.salesCrm === true ? true : false,
        product: parsed.product === true ? true : false,
        purchase: parsed.purchase === true ? true : false,
        salesManagement: parsed.salesManagement === true ? true : false,
        partnerships: parsed.partnerships === true ? true : false,
      };
    }
  } catch (e) {
    console.error(e);
  }
  return DEFAULT_FEATURE_CONFIG;
};

export const fetchFeatureConfigFromDB = async (companyIdOrUid: string): Promise<FeatureConfig> => {
  const { db } = getFirebaseServices();
  if (!db || !companyIdOrUid) return getStoredFeatureConfig();

  try {
    const ref = doc(db, 'company_settings', companyIdOrUid);
    const snap = await getDoc(ref);
    if (snap.exists() && snap.data().featureConfig) {
      const raw = snap.data().featureConfig;
      const config: FeatureConfig = {
        crm: raw.crm === true || raw.salesCrm === true ? true : false,
        product: raw.product === true ? true : false,
        purchase: raw.purchase === true ? true : false,
        salesManagement: raw.salesManagement === true ? true : false,
        partnerships: raw.partnerships === true ? true : false,
      };
      if (typeof window !== 'undefined') {
        localStorage.setItem(CONFIG_STORAGE_KEY, JSON.stringify(config));
        window.dispatchEvent(new Event('dp_feature_config_updated'));
      }
      return config;
    }
  } catch (e) {
    console.warn('Could not fetch feature config from Firestore:', e);
  }
  return getStoredFeatureConfig();
};

export const saveFeatureConfigToDB = async (
  companyId: string, 
  uid: string, 
  config: FeatureConfig,
  branchId?: string
): Promise<void> => {
  const cleanConfig: FeatureConfig = {
    crm: config.crm === true,
    product: config.product === true,
    purchase: config.purchase === true,
    salesManagement: config.salesManagement === true,
    partnerships: config.partnerships === true,
  };

  // Update local storage first for zero-latency instant response
  if (typeof window !== 'undefined') {
    localStorage.setItem(CONFIG_STORAGE_KEY, JSON.stringify(cleanConfig));
    window.dispatchEvent(new Event('dp_feature_config_updated'));
  }

  const { db } = getFirebaseServices();
  if (!db) return;

  const targetId = companyId || uid;
  if (!targetId) return;

  try {
    const ref = doc(db, 'company_settings', targetId);
    await setDoc(ref, {
      companyId: targetId,
      uid: uid || targetId,
      branchId: branchId || 'main_branch',
      featureConfig: cleanConfig,
      updatedAt: new Date().toISOString()
    }, { merge: true });

    if (uid && uid !== targetId) {
      const userRef = doc(db, 'users', uid);
      await setDoc(userRef, { 
        featureConfig: cleanConfig, 
        updatedAt: new Date().toISOString() 
      }, { merge: true });
    }
  } catch (e) {
    console.error('Error saving feature config to Firestore:', e);
    throw e;
  }
};
