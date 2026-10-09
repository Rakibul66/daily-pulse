export interface POSCartItem {
  id: string;
  sku: string;
  name: string;
  rate: number;
  qty: number;
  discount: number;
  stock: number;
  uom: string;
}

export interface POSCompletedInvoice {
  invoiceNo: string;
  date: string;
  items: POSCartItem[];
  subtotal: number;
  discount: number;
  netPayable: number;
  cashPaid: number;
  changeAmount: number;
  customerName: string;
  customerPhone: string;
  cashHead: string;
}
