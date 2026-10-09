export interface CateringVendor {
  id: string;
  companyId: string;
  name: string;
  perMealRate: number;
  billingFrequency: 'Daily' | 'Weekly' | 'Monthly';
  createdAt: string;
  isActive?: boolean;
}

export interface MealRecord {
  id: string;
  companyId: string;
  vendorId: string;
  date: string;
  mealCount: number;
  perMealRate?: number; // Custom rate for that day (e.g. 130 default, 150 for meat)
  totalCost?: number;   // Calculated mealCount * perMealRate
  menuItem?: string;    // e.g. "Beef / Meat Day", "Regular Chicken", "Special"
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
