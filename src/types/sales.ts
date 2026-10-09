export interface SalesClient {
  id: string;
  userId: string;
  area: string;
  territory: string;
  clientName: string;
  code: string;
  phone: string;
  address: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface DailySaleItem {
  id: string;
  productName: string;
  itemCode: string;
  quantity: number;
  unit: string;
  rate: number;
  amount: number;
}

export interface DailySale {
  id: string;
  userId: string;
  companyName: string;
  invoiceNo: string;
  date: string;
  clientId: string;
  clientName: string;
  clientCode: string;
  clientPhone: string;
  clientAddress: string;
  storeName: string;
  type: 'credit' | 'cash' | string;
  salesBy: string;
  
  items: DailySaleItem[];
  
  totalAmount: number;
  discountAmount: number;
  netInvoiceAmount: number;
  openingBalance: number;
  netPayable: number;
  
  createdAt: string;
  updatedAt: string;
}

export interface CollectionInvoiceItem {
  invoiceId: string;
  invoiceNo: string;
  saleAmount: number;
  previousCollection: number;
  currentCollection: number;
  dueAmount: number;
  selected?: boolean;
}

export interface SalesCollection {
  id: string;
  userId: string;
  companyId?: string;
  companyName: string;
  date: string;
  clientId: string;
  clientName: string;
  collectionType: string;
  paymentNo: string;
  paymentType: string;
  accountHead?: string;
  amount: number;
  balance?: number;
  remarks: string;
  staff: string;
  invoiceItems?: CollectionInvoiceItem[];
  createdAt: string;
  updatedAt?: string;
}

export interface SalesReturnItem {
  id: string;
  productId?: string;
  productName: string;
  code: string;
  invoiceNo?: string;
  invoiceId?: string;
  salesQty: number;
  returnedQty: number;
  currentReturn: number;
  rate: number;
  amount: number;
  selected?: boolean;
}

export interface SalesReturn {
  id: string;
  userId: string;
  companyId?: string;
  companyName: string;
  returnNo: string;
  productType?: string;
  clientId: string;
  clientName: string;
  customerPhone?: string;
  invoiceNo?: string;
  storeName: string;
  returnDate: string;
  returnReason?: string;
  items?: SalesReturnItem[];
  amount: number;
  staff: string;
  remarks: string;
  isApproved: boolean;
  status?: 'PENDING' | 'APPROVED' | 'REJECTED';
  createdAt: string;
  updatedAt?: string;
}

export interface POSSale {
  id: string;
  userId: string;
  barcode: string;
  clientPhone: string;
  clientName: string;
  cashHead: string;
  items: DailySaleItem[];
  totalAmount: number;
  discountAmount: number;
  netPayable: number;
  cashPaid: number;
  changeAmount: number;
  createdAt: string;
}
