export interface Subscription {
  id: string;
  companyId: string;
  name: string;
  category: 'Software / SaaS' | 'Utilities / Internet' | 'Cloud & Hosting' | 'Office / Facility' | 'Other';
  cycle: 'monthly' | 'yearly';
  amount: number;
  lastPaidDate: string;
  nextDueDate?: string;
  paymentMethod?: string;
  status: 'Active' | 'Paused' | 'Cancelled';
  notes?: string;
  createdAt: string;
  updatedAt: string;
}
