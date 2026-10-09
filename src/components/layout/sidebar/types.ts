export type AdminPageId =
  | "dashboard"
  | "system-company"
  | "system-branch"
  | "crm-dashboard"
  | "crm-leads"
  | "crm-recent-leads"
  | "crm-ai-lead"
  | "customers-list"
  | "customers-promotions"
  | "customers-feedback"
  | "hrm-attendance"
  | "hrm-employees"
  | "hrm-payroll"
  | "hrm-daily-reports"
  | "hrm-settings"
  | "hrm-loans"
  | "hrm-catering"
  | "hrm-overtime"
  | "sales-clients"
  | "sales-invoices"
  | "sales-collections"
  | "sales-returns"
  | "sales-return-approvals"
  | "sales-pos"
  | "sales-retail-returns"
  | "settings"
  | "finance-partnership"
  | "partnership-investors"
  | "partnership-withdrawals"
  | "partnership-dividends"
  | "lost-and-found"
  | "utilities-subscriptions"
  | "product-category"
  | "product-brand"
  | "product-tag"
  | "product-setup"
  | "product-list"
  | "product-uom"
  | "delivery-man"
  | "purchase-vendor-setup"
  | "purchase-product"
  | "purchase-return"
  | "purchase-payment"
  | "purchase-generate-barcode"
  | "purchase-vendor-statement"
  | "inventory"
  | "sales"
  | "purchases"
  | "accounts"
  | "assets-management";

export interface NavItem {
  id: AdminPageId;
  label: string;
}

export const CRM_NAV_ITEMS: NavItem[] = [
  { id: "crm-dashboard", label: "DASHBOARD" },
  { id: "crm-leads", label: "ALL LEADS" },
  { id: "customers-list", label: "CUSTOMERS" },
];

export const PRODUCT_NAV_ITEMS: NavItem[] = [
  { id: "product-category", label: "CATEGORY SETUP" },
  { id: "product-brand", label: "BRAND SETUP" },
  { id: "product-tag", label: "TAG SETUP" },
  { id: "product-setup", label: "PRODUCT SETUP" },
  { id: "product-list", label: "PRODUCT LIST" },
  { id: "product-uom", label: "MEASUREMENT UNIT" },
  { id: "delivery-man", label: "DELIVERY MAN SETUP" },
];

export const PURCHASE_TX_ITEMS: NavItem[] = [
  { id: "purchase-vendor-setup", label: "VENDOR SETUP" },
  { id: "purchase-product", label: "PRODUCT PURCHASE" },
  { id: "purchase-return", label: "PURCHASE RETURN" },
  { id: "purchase-payment", label: "VENDOR PAYMENT" },
  { id: "purchase-generate-barcode", label: "GENERATE BARCODE" },
];

export const PURCHASE_REPORT_ITEMS: NavItem[] = [
  { id: "purchase-vendor-statement", label: "VENDOR STATEMENT" },
];

export const SALES_NAV_ITEMS: NavItem[] = [
  { id: "sales-invoices", label: "INVOICES" },
  { id: "sales-collections", label: "COLLECTIONS" },
  { id: "sales-returns", label: "INVOICE RETURNS" },
  { id: "sales-return-approvals", label: "RETURN APPROVALS" },
  { id: "sales-pos", label: "POS TERMINAL" },
  { id: "sales-retail-returns", label: "RETAIL RETURNS" },
];

export const HRM_NAV_ITEMS: NavItem[] = [
  { id: "hrm-attendance", label: "ATTENDANCE" },
  { id: "hrm-employees", label: "EMPLOYEES" },
  { id: "hrm-payroll", label: "PAYROLL" },
  { id: "hrm-daily-reports", label: "DAILY REPORTS" },
  { id: "hrm-settings", label: "WEEKEND & HOLIDAYS" },
  { id: "assets-management", label: "ASSETS" },
];

export const UTILITIES_NAV_ITEMS: NavItem[] = [
  { id: "lost-and-found", label: "LOST & FOUND" },
  { id: "hrm-catering", label: "FOOD & CATERING" },
  { id: "customers-promotions", label: "OFFERS & PROMOS" },
  { id: "customers-feedback", label: "GUEST FEEDBACK" },
  { id: "utilities-subscriptions", label: "SUBSCRIPTIONS" },
];

export const PARTNERSHIP_NAV_ITEMS: NavItem[] = [
  { id: "finance-partnership", label: "SUMMARY" },
  { id: "partnership-investors", label: "INVESTORS & PARTNERS" },
  { id: "partnership-withdrawals", label: "CAPITAL WITHDRAWALS" },
  { id: "partnership-dividends", label: "DIVIDENDS & PROFITS" },
];
