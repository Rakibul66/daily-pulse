export interface Plan {
  id: string;
  name: string;
  badge: string;
  badgeColor: string;
  desc: string;
  priceMonthly: number;
  priceYearly: number;
  features: string[];
  notIncluded: string[];
  ctaText: string;
  ctaHref: string;
  isPopular: boolean;
}

export const PRICING_PLANS: Plan[] = [
  {
    id: 'starter',
    name: 'STARTER POS',
    badge: 'SINGLE STORE',
    badgeColor: 'bg-slate-100 text-black',
    desc: 'Ideal for small retail shops, pharmacies, grocery stores, and single counters.',
    priceMonthly: 650,
    priceYearly: 6500,
    features: [
      'Fast POS Barcode Billing Counter',
      '58mm & 80mm Thermal Receipt Printing',
      'Unlimited Products & Daily Invoices',
      'Real-time Inventory & Low Stock Alerts',
      'Daily Sales & Payment Collection Summary',
      'Customer Directory Setup',
      '1 Store / 1 Counter User',
      'Free Setup & Phone Support',
    ],
    notIncluded: [
      'Loyalty Points & Happy Hour Promos',
      'Supplier Purchase & Barcode Generator',
      'Accounts & Expense Cashbook',
      'Multi-Branch Central Sync',
      'HRM, Attendance & Payroll',
    ],
    ctaText: 'START WITH STARTER',
    ctaHref: '/contact',
    isPopular: false,
  },
  {
    id: 'pro',
    name: 'BUSINESS PRO',
    badge: 'MOST POPULAR',
    badgeColor: 'bg-amber-300 text-black',
    desc: 'Perfect for busy fashion outlets, departmental stores, restaurants & growing businesses.',
    priceMonthly: 1450,
    priceYearly: 14500,
    features: [
      'Everything in Starter POS +',
      'Customer Loyalty Points & VIP Cards',
      'Happy Hours & Promo Discount Rules',
      'Supplier Purchases & Product Lifting',
      'Barcode Label Generator & Printing',
      'Accounts Ledger & Expense Tracking',
      'Sales Return & Approval Workflow',
      'Up to 5 Counter Staff Roles',
      'Priority WhatsApp & Remote Training',
    ],
    notIncluded: [
      'Multi-Branch Central Sync',
      'HRM, Attendance & Payroll',
      'Sales CRM Pipeline & AI Lead Prospecting',
    ],
    ctaText: 'CHOOSE BUSINESS PRO',
    ctaHref: '/contact',
    isPopular: true,
  },
  {
    id: 'enterprise',
    name: 'ENTERPRISE ERP',
    badge: 'MULTI-BRANCH & CHAIN',
    badgeColor: 'bg-black text-white',
    desc: 'For multi-branch supermarket chains, wholesalers, and large business operations.',
    priceMonthly: 2850,
    priceYearly: 28500,
    features: [
      'Everything in Business Pro +',
      'Multi-Branch & Central Warehouse Sync',
      'Full HRM: Employee Attendance & Rosters',
      'Daily Work Reports & Monthly Payroll',
      'Employee Advances, Loans & Overtime',
      'Sales CRM Pipeline & AI Prospecting',
      'Asset & Food/Catering Management',
      'Unlimited Counters & Custom Role Access',
      'Dedicated 24/7 Account Manager',
    ],
    notIncluded: [],
    ctaText: 'CONTACT ENTERPRISE',
    ctaHref: '/contact',
    isPopular: false,
  },
];

export interface ComparisonFeature {
  feature: string;
  starter: boolean | string;
  pro: boolean | string;
  enterprise: boolean | string;
}

export const COMPARISON_FEATURES: ComparisonFeature[] = [
  { feature: 'POS Barcode Billing & Thermal Printing', starter: true, pro: true, enterprise: true },
  { feature: 'Product & Stock Alert Engine', starter: true, pro: true, enterprise: true },
  { feature: 'Daily Sales & Collection Summary', starter: true, pro: true, enterprise: true },
  { feature: 'Customer Loyalty Points & Member Tiers', starter: false, pro: true, enterprise: true },
  { feature: 'Time-based Promotions & Happy Hours', starter: false, pro: true, enterprise: true },
  { feature: 'Vendor Management & Purchase Orders', starter: false, pro: true, enterprise: true },
  { feature: 'Product Barcode Sticker Generator', starter: false, pro: true, enterprise: true },
  { feature: 'Accounts Cashbook & Expense Tracking', starter: false, pro: true, enterprise: true },
  { feature: 'Sales Return & Multi-level Approvals', starter: false, pro: true, enterprise: true },
  { feature: 'Multi-Branch & Warehouse Synchronization', starter: false, pro: false, enterprise: true },
  { feature: 'HRM Attendance, Daily Reports & Payroll', starter: false, pro: false, enterprise: true },
  { feature: 'Employee Loans, Advances & Overtime', starter: false, pro: false, enterprise: true },
  { feature: 'Sales CRM & AI Lead Prospecting', starter: false, pro: false, enterprise: true },
  { feature: 'Dedicated 24/7 Priority Support', starter: 'Standard', pro: 'Priority WhatsApp', enterprise: '24/7 Dedicated Manager' },
];

export interface FaqItem {
  q: string;
  a: string;
}

export const PRICING_FAQS: FaqItem[] = [
  {
    q: 'Does Shomporko POS work with existing barcode scanners and thermal receipt printers?',
    a: 'Yes, 100%! Our POS billing engine connects seamlessly with all standard USB, Bluetooth, and network thermal printers (58mm, 80mm) as well as 1D/2D barcode scanners.',
  },
  {
    q: 'Can I start with Starter and upgrade later as my business grows?',
    a: 'Absolutely. You can upgrade from Starter to Business Pro or Enterprise at any time without losing any product data, sales invoices, or customer history.',
  },
  {
    q: 'What is the setup and onboarding process?',
    a: 'Our technical team assists with complete remote setup, importing your product lists from Excel, and providing live staff walkthroughs over WhatsApp or phone call.',
  },
  {
    q: 'Is my business data safe and backed up in the cloud?',
    a: 'Yes. All transactions, daily sales reports, and inventory counts are securely synchronized in real-time with automated daily cloud backups.',
  },
];
