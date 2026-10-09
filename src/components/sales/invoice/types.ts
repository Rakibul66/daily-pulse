import { DailySaleItem } from "@/types/sales";

export const DEFAULT_STORES = [
  "Shankhari Bazar",
  "Main Store",
  "Dhanmondi Branch",
  "Gulshan Outlet",
  "Uttara Hub",
  "Mirpur Branch"
];

export const PAYMENT_TYPES = [
  "Credit",
  "Cash",
  "Bank Transfer",
  "bKash / Nagad"
];

export interface SalesInvoiceFormData {
  invoiceNo: string;
  date: string;
  customerId: string;
  customerName: string;
  customerPhone: string;
  customerAddress: string;
  storeName: string;
  type: string;
  salesBy: string;
  items: DailySaleItem[];
  discountType: "fixed" | "percentage";
  discountValue: number;
  remarks: string;
}
