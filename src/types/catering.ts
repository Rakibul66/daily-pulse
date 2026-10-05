export interface CateringVendor {
  id: string;
  companyId: string;
  name: string;
  perMealRate: number;
  billingFrequency: 'Daily' | 'Weekly' | 'Monthly';
  createdAt: string;
}

export interface MealRecord {
  id: string;
  companyId: string;
  vendorId: string;
  date: string;
  mealCount: number;
  notes?: string;
  createdAt: string;
}

export interface CateringPayment {
  id: string;
  companyId: string;
  vendorId: string;
  date: string;
  amount: number;
  createdAt: string;
}
