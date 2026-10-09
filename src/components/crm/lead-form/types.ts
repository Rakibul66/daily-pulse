import { Lead } from "@/types/crm";

export type LeadFormData = Omit<Lead, 'id' | 'userId' | 'createdAt' | 'updatedAt'>;

export const emptyLead = (): LeadFormData => ({
  dateAdded: new Date().toISOString().split('T')[0],
  businessName: '',
  ownerName: '',
  phone: '',
  whatsapp: '',
  messenger: '',
  locationArea: '',
  branchCount: '1',
  businessType: 'Restaurant',
  businessSubType: 'Cafe',
  currentPos: '',
  websiteUrl: '',
  facebookUrl: '',
  instagramUrl: '',
  painPoint: '',
  leadSource: 'Facebook',
  firstContactDate: '',
  responseReceived: false,
  leadStatus: 'NEW',
  demoDate: '',
  demoStatus: '',
  proposalSent: false,
  followUpDate: '',
  followUpCount: 0,
  objection: '',
  expectedClosingDate: '',
  dealValue: 0,
  salesStatus: 'Pending',
  lostReason: '',
  nextAction: '',
  notes: '',
  leadPriority: 'COLD',
});

export const BUSINESS_CATEGORIES: Record<string, string[]> = {
  'Restaurant': ['Cafe', 'Fine Dining', 'Fast Food', 'Food Cart', 'Bakery', 'Cloud Kitchen', 'Other'],
  'E-commerce': ['Fashion/Clothing', 'Food/Grocery', 'Electronics/Tech', 'Books/Stationery', 'Health/Beauty', 'Other'],
  'Retail': ['Super Shop', 'Pharmacy', 'Hardware', 'Other'],
  'Service': ['Saloon/Spa', 'Repair Shop', 'Consultancy', 'Other'],
  'Agency': ['Marketing', 'IT/Software', 'Travel', 'Other'],
  'Education': ['School', 'Coaching', 'Online Course', 'Other'],
  'Other': ['Other']
};

export const inputClasses = "w-full text-xs sm:text-sm font-bold text-black bg-white px-3.5 py-2.5 border-2 border-black shadow-[2px_2px_0px_#000] focus:outline-none focus:bg-[#fffdf0] focus:border-indigo-600 rounded-none transition-all placeholder:text-slate-400";
export const labelClasses = "text-xs font-black uppercase tracking-wider text-black block mb-1.5";
