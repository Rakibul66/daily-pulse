import { OrderItem } from './inventory';

export interface PurchaseOrder {
  id: string;
  userId: string;
  supplierName: string;
  items: OrderItem[];
  totalCost: number;
  status: 'Pending' | 'Received';
  date: string;
  createdAt: string;
  updatedAt: string;
}

export type TransactionCategory = 'Sales Revenue' | 'Inventory Purchase' | 'Payroll' | 'Utilities' | 'Rent' | 'Other';

export interface AccountTransaction {
  id: string;
  userId: string;
  type: 'INCOME' | 'EXPENSE';
  category: TransactionCategory;
  amount: number;
  referenceId?: string; // Links to Sale ID or PO ID
  description: string;
  date: string;
  createdAt: string;
}
