export type LeadStatus =
  | 'NEW'
  | 'CONTACTED'
  | 'REPLIED'
  | 'QUALIFIED'
  | 'DEMO BOOKED'
  | 'DEMO DONE'
  | 'PROPOSAL'
  | 'NEGOTIATION'
  | 'WON'
  | 'CONVERTED'
  | 'LOST';

export type LeadPriority = 'HOT' | 'WARM' | 'COLD' | 'LOST';

export interface Lead {
  id: string; // Unique ID
  dateAdded: string; // Lead date (ISO string)
  businessName: string; // Name of the business
  ownerName: string; // Contact person
  phone: string; // Number
  whatsapp?: string; // WhatsApp Number
  messenger: string; // FB profile/page
  locationArea: string; // Area
  branchCount: string; // 1/2/Multiple
  businessType: string; // Restaurant/E-commerce/Agency/etc
  businessSubType: string; // Specific type based on businessType
  currentPos: string; // Existing software
  websiteUrl: string; // URL
  facebookUrl: string; // URL
  instagramUrl: string; // URL
  painPoint: string; // Main problem
  leadSource: string; // FB/Google/Referral
  firstContactDate: string; // Date
  responseReceived: boolean; // Yes/No
  leadStatus: LeadStatus;
  demoDate: string; // Date
  demoStatus: 'Done' | 'Pending' | '';
  proposalSent: boolean; // Yes/No
  followUpDate: string; // Next action
  followUpCount: number; // Number
  objection: string; // Price/Time/Existing POS
  expectedClosingDate: string; // Date
  dealValue: number; // ৳
  salesStatus: 'Won' | 'Lost' | 'Pending';
  lostReason: string; // Reason
  nextAction: string; // What to do
  notes: string; // Extra info
  leadPriority: LeadPriority;
  isConverted?: boolean; // Whether converted to Customer
  convertedCustomerId?: string; // Linked customer ID
  userId: string; // the user who owns this lead
  createdAt: string; // ISO
  updatedAt: string; // ISO
}

export interface DashboardMetrics {
  newLeads: { today: number; thisWeek: number; thisMonth: number };
  messages: { today: number; thisWeek: number; thisMonth: number };
  calls: { today: number; thisWeek: number; thisMonth: number };
  replies: { today: number; thisWeek: number; thisMonth: number };
  qualified: { today: number; thisWeek: number; thisMonth: number };
  demos: { today: number; thisWeek: number; thisMonth: number };
  proposals: { today: number; thisWeek: number; thisMonth: number };
  won: { today: number; thisWeek: number; thisMonth: number };
  lost: { today: number; thisWeek: number; thisMonth: number };
}
