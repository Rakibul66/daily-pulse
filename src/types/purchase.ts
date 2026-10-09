export interface ProductLiftItem {
  id: string;
  productId?: string;
  category: string;
  productName: string;
  code: string;
  rate: number;
  quantity: number;
  amount: number;
}

export interface ProductLift {
  id: string;
  userId: string;
  companyId?: string;
  type: 'credit' | 'cash' | 'bank' | 'cheque';
  liftingType: string; // 'By Manual', 'By PO', etc.
  paymentType: string; // 'Credit', 'Cash', 'Bank Transfer', 'Cheque'
  purchaseNo: string; // e.g. STL2609000007
  purchaseDate: string; // YYYY-MM-DD or DD-MM-YYYY
  date?: string; // Display alias
  voucherNo?: string;
  vendor: string;
  vendorId?: string;
  store: string;
  purchasedBy: string;
  items: ProductLiftItem[];
  discountType: 'fixed' | 'percentage';
  discountValue: number;
  subtotal: number;
  discountAmount: number;
  costAmount: number; // Net Payable total in TK
  status?: 'RECEIVED' | 'PENDING' | 'CANCELLED';
  remarks?: string;
  createdAt: string;
  updatedAt: string;
}

export interface PurchaseVendor {
  id: string;
  userId: string;
  companyId?: string;
  code: string;
  name: string;
  contactPerson?: string;
  email?: string;
  phone?: string;
  address?: string;
  account?: string;
  status: boolean | 'ACTIVE' | 'INACTIVE';
  createdAt: string;
  updatedAt: string;
}

export interface PurchaseReturnItem {
  id: string;
  productId?: string;
  productName: string;
  category?: string;
  code?: string;
  rate: number;
  quantity: number;
  amount: number;
}

export interface PurchaseReturn {
  id: string;
  userId: string;
  companyId?: string;
  company: string;
  vendor: string;
  vendorId?: string;
  store: string;
  returnDate: string; // YYYY-MM-DD
  date?: string; // DD-MM-YYYY display alias
  amount: number;
  staff: string;
  remarks: string;
  items?: PurchaseReturnItem[];
  createdAt: string;
  updatedAt: string;
}

export interface VendorPayment {
  id: string;
  userId: string;
  companyId?: string;
  company?: string;
  paymentNo: string; // e.g. STP2609000001
  paymentDate: string; // YYYY-MM-DD
  date?: string; // DD-MM-YYYY display alias
  vendor: string;
  vendorId?: string;
  paymentType: 'Cash at Hand' | 'Bank Transfer' | 'Cheque' | 'bKash / Nagad' | 'Online Banking';
  amount: number;
  voucherRef?: string;
  bankName?: string;
  chequeNo?: string;
  remarks?: string;
  staff: string;
  status: 'COMPLETED' | 'PENDING' | 'CANCELLED';
  createdAt: string;
  updatedAt: string;
}

export interface VendorStatementEntry {
  id: string;
  date: string;
  rawDate: string;
  particular: string;
  type: 'PURCHASE' | 'PAYMENT' | 'RETURN';
  refNo: string;
  purchase: number;
  payment: number;
  returns: number;
  balance: number;
}



