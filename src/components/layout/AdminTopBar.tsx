"use client";

import React from "react";
import { Menu } from "lucide-react";
import { AdminPageId } from "./Sidebar";

interface AdminTopBarProps {
  activePage: AdminPageId;
  setActivePage?: (page: AdminPageId) => void;
  onToggleMobileSidebar: () => void;
}

const PAGE_TITLES: Record<AdminPageId, { title: string; subtitle: string }> = {
  "dashboard": {
    title: "Dashboard",
    subtitle: "Overview",
  },
  "system-company": {
    title: "Company Setup",
    subtitle: "Manage SaaS company accounts",
  },
  "system-branch": {
    title: "Branch Setup",
    subtitle: "Manage branches for companies",
  },
  "crm-dashboard": {
    title: "Sales Dashboard",
    subtitle: "Overview of your recent sales performance",
  },
  "crm-leads": {
    title: "All Leads",
    subtitle: "Manage and filter all sales leads",
  },
  "crm-recent-leads": {
    title: "Recent Leads",
    subtitle: "View recently added leads",
  },
  "crm-ai-lead": {
    title: "AI Prospecting",
    subtitle: "Discover and generate new sales leads using AI",
  },
  "customers-list": {
    title: "Customers",
    subtitle: "Unified directory for converted leads & registered clients",
  },
  "customers-promotions": {
    title: "Offers & Promos",
    subtitle: "Manage Happy Hours, Time-based discounts, and special offers",
  },
  "customers-feedback": {
    title: "Guest Feedback",
    subtitle: "Monitor customer ratings and reviews",
  },
  "hrm-attendance": {
    title: "Attendance Register",
    subtitle: "Track employee attendance",
  },
  "hrm-employees": {
    title: "Employees",
    subtitle: "Manage staff information",
  },
  "hrm-payroll": {
    title: "Payroll & Salary",
    subtitle: "Manage monthly salary payouts",
  },
  "hrm-daily-reports": {
    title: "Daily Work Reports",
    subtitle: "Track employee daily tasks and productivity",
  },
  "hrm-settings": {
    title: "Weekend & Holidays",
    subtitle: "Configure company working days and leave policies",
  },
  "settings": {
    title: "Settings & AI",
    subtitle: "Configure workspace preferences and AI integrations",
  },
  "hrm-loans": {
    title: "Employee Loan Management",
    subtitle: "Track salary advances and personal loans",
  },
  "hrm-overtime": {
    title: "Employee Overtime Management",
    subtitle: "Track extra hours and overtime payouts",
  },
  "sales-clients": {
    title: "Client Setup",
    subtitle: "Manage B2B clients and sales territories",
  },
  "sales-invoices": {
    title: "Daily Sales",
    subtitle: "Manage invoices, POS billing, and chalans",
  },
  "sales-collections": {
    title: "Daily Collections",
    subtitle: "Manage daily payment collections",
  },
  "sales-returns": {
    title: "Sales Return",
    subtitle: "Process invoice returns",
  },
  "sales-return-approvals": {
    title: "Sales Return Approval",
    subtitle: "Approve pending sales returns",
  },
  "sales-pos": {
    title: "POS Sales",
    subtitle: "Point of sale processing",
  },
  "sales-retail-returns": {
    title: "Retail Return",
    subtitle: "Process retail returns",
  },
  "finance-partnership": {
    title: "Partnership & Investments",
    subtitle: "Manage investors, capital, and dividend distribution",
  },
  "partnership-investors": {
    title: "Investors & Partners",
    subtitle: "Manage profiles and equity shares of all partners",
  },
  "partnership-withdrawals": {
    title: "Capital Withdrawals",
    subtitle: "Track and approve capital withdrawal requests",
  },
  "partnership-dividends": {
    title: "Dividends & Profits",
    subtitle: "Distribute and manage profit payouts",
  },
  "utilities-subscriptions": {
    title: "Subscriptions",
    subtitle: "Manage software and utility recurring payments",
  },
  "lost-and-found": {
    title: "Lost & Found",
    subtitle: "Manage and return found guest property",
  },
  "inventory": {
    title: "Inventory Management",
    subtitle: "Track products and stock levels",
  },
  "sales": {
    title: "Sales & POS",
    subtitle: "Record transactions and manage daily sales",
  },
  "purchases": {
    title: "Purchase Management",
    subtitle: "Manage suppliers and restock inventory",
  },
  "accounts": {
    title: "Ledger & Accounts",
    subtitle: "Track daily expenses and revenue",
  },
  "product-category": { title: "Category Setup", subtitle: "Manage product categories and parent groups" },
  "product-brand": { title: "Brand Setup", subtitle: "Manage manufacturers, partner brands and product labels" },
  "product-tag": { title: "Tag Setup", subtitle: "Manage promotional tags, filters and catalog badges" },
  "product-setup": { title: "Product Setup", subtitle: "Configure products, pricing, barcodes and stock levels" },
  "product-list": { title: "Product List Report", subtitle: "Filter catalog, inspect pricing, export or print" },
  "product-uom": { title: "Measurement Unit Setup", subtitle: "Manage units of measurement (UOM) for products" },
  "delivery-man": { title: "Delivery Man Setup", subtitle: "Manage logistics staff, couriers & dispatchers" },
  "purchase-vendor-setup": { title: "Vendor Setup", subtitle: "Manage your vendors" },
  "purchase-product": { title: "Product Lifting", subtitle: "Purchase products from vendors" },
  "purchase-return": { title: "Purchase Return", subtitle: "Manage purchase returns" },
  "purchase-payment": { title: "Vendor Payment", subtitle: "Manage vendor payments" },
  "purchase-generate-barcode": { title: "Generate Barcode", subtitle: "Generate barcodes for products" },
  "purchase-vendor-statement": { title: "Vendor Statement", subtitle: "Ledger, transactions, purchases, payments & balance report" },
  "hrm-catering": {
    title: "Food & Catering",
    subtitle: "Manage vendors, meals, and billing",
  },
  "assets-management": {
    title: "Assets Management",
    subtitle: "Track office equipment and properties",
  },
};

export const AdminTopBar: React.FC<AdminTopBarProps> = ({
  activePage,
  setActivePage,
  onToggleMobileSidebar,
}) => {
  const current = PAGE_TITLES[activePage] || PAGE_TITLES["crm-dashboard"];

  return (
    <header className="no-print h-16 bg-white border-b-4 border-black shadow-[0_4px_0px_#000] px-2 sm:px-3 flex items-center justify-between sticky top-0 z-30 text-black">
      {/* Left: Mobile Toggle & Page Title */}
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleMobileSidebar}
          className="p-1.5 bg-white hover:bg-amber-300 border-2 border-black shadow-[2px_2px_0px_#000] text-black active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all lg:hidden cursor-pointer"
          title="Toggle Navigation Menu"
        >
          <Menu className="w-5 h-5 stroke-[2.5]" />
        </button>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1 bg-amber-300 border-2 border-black shadow-[2px_2px_0px_#000] font-display font-black text-xs uppercase tracking-wider text-black">
            {current.title}
          </span>
          <span className="hidden sm:inline-block text-[11px] font-bold text-slate-600 uppercase tracking-wider">
            {current.subtitle}
          </span>
        </div>
      </div>

      {/* Right side: Quick actions & profile */}
      <div className="hidden lg:flex items-center gap-2 overflow-x-auto whitespace-nowrap">
        <button 
          onClick={() => setActivePage?.('sales-pos')}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-amber-200 border-2 border-black shadow-[2px_2px_0px_#000] text-xs font-black uppercase text-black active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all cursor-pointer"
        >
          <span className="font-black text-indigo-600">+</span> POS
        </button>
        <button 
          onClick={() => setActivePage?.('hrm-daily-reports')}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-amber-200 border-2 border-black shadow-[2px_2px_0px_#000] text-xs font-black uppercase text-black active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all cursor-pointer"
        >
          <span className="font-black text-indigo-600">+</span> DAILY REPORT
        </button>
        <button 
          onClick={() => setActivePage?.('hrm-attendance')}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-amber-200 border-2 border-black shadow-[2px_2px_0px_#000] text-xs font-black uppercase text-black active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all cursor-pointer"
        >
          <span className="font-black text-indigo-600">+</span> ATTENDANCE
        </button>
      </div>

    </header>
  );
};
