export interface ProductCategory {
  id: string;
  userId: string;
  companyId?: string;
  companyName?: string;
  name: string;
  parentCategory: string; // 'None' or category name
  image?: string; // thumbnail data URL or link (500x500)
  vendorNames?: string[]; // Associated vendor names
  metaTitle?: string;
  metaKeyword?: string;
  metaDescription?: string;
  status: 'ACTIVE' | 'INACTIVE';
  createdAt: string;
  updatedAt: string;
}

export interface MeasurementUnit {
  id: string;
  userId: string;
  companyId?: string;
  name: string; // e.g. "Piece", "Kilogram", "Gram", "Liter"
  code: string; // e.g. "Pcs", "KG", "Gm", "Ltr", "Box"
  status: 'ACTIVE' | 'INACTIVE';
  createdAt: string;
  updatedAt: string;
}

export interface ProductBrand {
  id: string;
  userId: string;
  companyId?: string;
  name: string;
  code?: string; // Short code / identifier (e.g., "UNI", "SAM")
  image?: string; // Brand logo URL or compressed base64
  website?: string;
  description?: string;
  status: 'ACTIVE' | 'INACTIVE';
  createdAt: string;
  updatedAt: string;
}

export interface ProductTag {
  id: string;
  userId: string;
  companyId?: string;
  name: string; // e.g. "Best Seller", "New Arrival", "Trending"
  color?: string; // Hex color for the neo-brutalist tag pill
  description?: string;
  status: 'ACTIVE' | 'INACTIVE';
  createdAt: string;
  updatedAt: string;
}

export interface Product {
  id: string;
  userId: string;
  companyId?: string;
  name: string;
  code: string; // Barcode or SKU
  barcode?: string; // Explicit Barcode field alias
  sku?: string; // Backward compatibility alias for code
  parentCategory: string;
  category?: string; // Backward compatibility alias for parentCategory
  childCategory?: string;
  brand?: string; // Brand name or ID
  tags?: string[]; // Array of tag names
  uom: string; // Measurement Unit
  reorderLevel: number; // Low stock alert threshold
  purchasePrice: number; // Cost Price
  clientPrice: number; // Wholesale / Client Price
  retailPrice: number; // Selling / Retail Price
  price: number; // Synced to retailPrice for POS & Sale compatibility
  cost?: number; // Synced to purchasePrice
  stock: number;
  minStock?: number;
  discountPercentage?: number;
  discountAmount?: number;
  image?: string; // Thumbnail URL or base64
  otherImages?: string[];
  shortDescription?: string;
  longDescription?: string;
  seoTitle?: string;
  seoKeywords?: string;
  seoDescription?: string;
  status: 'ACTIVE' | 'INACTIVE';
  createdAt: string;
  updatedAt: string;
}

export interface DeliveryMan {
  id: string;
  userId: string;
  companyId?: string;
  store: string; // Store / Branch name (e.g. "Shankhari Bazar")
  code: string; // Sequential identifier / Code (e.g. "1", "2", "6")
  name: string; // Delivery Man Name
  email?: string;
  phone?: string; // Phone / Contact
  nationalId?: string; // NID / National ID
  address?: string;
  status: 'ACTIVE' | 'INACTIVE';
  createdAt: string;
  updatedAt: string;
}
