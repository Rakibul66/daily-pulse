export type PartnerRole = 'Active Partner' | 'Silent Investor';
export type TransactionType = 'INVESTMENT' | 'WITHDRAWAL' | 'DIVIDEND';

export interface Partner {
  id: string;
  companyId: string;
  name: string;
  role: PartnerRole;
  phone: string;
  email: string;
  equityShare: number; // percentage (e.g., 25)
  totalInvested: number; // Sum of investments - withdrawals
  totalDividends: number; // Sum of dividends
  joinedDate: string;
  status: 'Active' | 'Inactive';
  createdAt: string;
  updatedAt: string;
}

export interface PartnerTransaction {
  id: string;
  companyId: string;
  partnerId: string;
  type: TransactionType;
  amount: number;
  date: string;
  reference: string;
  notes: string;
  createdAt: string;
}
