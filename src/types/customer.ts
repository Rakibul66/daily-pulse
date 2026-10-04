export type LoyaltyTier = 'Member' | 'Silver' | 'Gold' | 'Platinum';

export interface Customer {
  id: string;
  userId: string;
  businessName: string;
  ownerName: string;
  phone: string;
  email: string;
  address: string;
  businessType: string;
  customerSince: string;
  
  // Loyalty Program
  totalSpent: number;
  loyaltyPoints: number;
  loyaltyTier: LoyaltyTier;
  
  createdAt: string;
  updatedAt: string;
}

export interface LoyaltyTransaction {
  id: string;
  userId: string;
  customerId: string;
  type: 'EARN' | 'REDEEM';
  points: number;
  amount?: number; // purchase amount if EARN, discount value if REDEEM
  description: string;
  date: string;
}

export type PromotionType = 'HAPPY_HOUR' | 'TIME_BASED' | 'FLAT_DISCOUNT' | 'BOGO';
export type DiscountType = 'PERCENTAGE' | 'FIXED';

export interface Promotion {
  id: string;
  userId: string;
  title: string;
  type: PromotionType;
  discountValue: number;
  discountType: DiscountType;
  startDate: string;
  endDate: string;
  startTime: string; // e.g. "14:00"
  endTime: string; // e.g. "17:00"
  applicableDays: string[]; // e.g. ["Friday", "Saturday"]
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CustomerFeedback {
  id: string;
  userId: string;
  customerName: string;
  customerPhone?: string;
  ratings: {
    overall: number;
    food: number;
    service: number;
    ambience: number;
  };
  comment: string;
  createdAt: string;
}
