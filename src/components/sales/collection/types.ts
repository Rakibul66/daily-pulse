import { CollectionInvoiceItem } from "@/types/sales";

export const PAYMENT_TYPES = [
  'Cash',
  'Bank Transfer',
  'Cheque',
  'bKash / Nagad'
];

export const ACCOUNT_HEADS = [
  'Cash in Hand',
  'Main Bank Account',
  'Customer Advance',
  'General Sales Revenue',
  'Petty Cash'
];

export const COLLECTION_TYPES = [
  'Advance',
  'Invoice Due',
  'General Collection'
];

export const formatDateDDMMYYYY = (dateStr: string): string => {
  if (!dateStr) return '';
  if (/^\d{2}-\d{2}-\d{4}$/.test(dateStr)) return dateStr;
  const parts = dateStr.split('-');
  if (parts.length === 3 && parts[0].length === 4) {
    return `${parts[2]}-${parts[1]}-${parts[0]}`;
  }
  return dateStr;
};

export interface SalesCollectionFormData {
  clientId: string;
  clientName: string;
  paymentNo: string;
  date: string;
  paymentType: string;
  accountHead: string;
  collectionType: string;
  balance: number;
  staff: string;
  remarks: string;
  totalCollection: number;
  invoiceItems: CollectionInvoiceItem[];
}
