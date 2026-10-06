"use client";

import React from "react";
import {
  FileCheck,
  Search,
  Share2,
  Settings,
  LogOut,
  MonitorSmartphone,
  Briefcase,
  Archive,
  ShoppingCart,
  Truck,
  Wallet,
  TrendingUp,
  Layers,
  Package,
  Sparkles,
  Users,
  X,
  ChevronRight,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";

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
  | "hrm-loans"
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
  | "purchase-vendor-setup"
  | "purchase-product"
  | "purchase-return"
  | "purchase-payment"
  | "purchase-generate-barcode"
  | "inventory"
  | "sales"
  | "purchases"
  | "accounts"
  | "assets-management";

interface SidebarProps {
  activePage: AdminPageId;
  setActivePage: (page: AdminPageId) => void;
  isOpenMobile: boolean;
  onCloseMobile: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activePage,
  setActivePage,
  isOpenMobile,
  onCloseMobile,
}) => {
  const { user, signOutUser } = useAuth();
  const [isSystemSettingOpen, setIsSystemSettingOpen] = React.useState(false);
  const [isCustomersOpen, setIsCustomersOpen] = React.useState(false);
  const [isCrmOpen, setIsCrmOpen] = React.useState(false);
  const [isHrmOpen, setIsHrmOpen] = React.useState(false);
  const [isOpsOpen, setIsOpsOpen] = React.useState(false);
  const [isSalesOpen, setIsSalesOpen] = React.useState(false);
  const [isPurchaseOpen, setIsPurchaseOpen] = React.useState(false);
  const [isPurchaseTxOpen, setIsPurchaseTxOpen] = React.useState(false);
  const [isPartnershipsOpen, setIsPartnershipsOpen] = React.useState(false);
  const [isUtilitiesOpen, setIsUtilitiesOpen] = React.useState(false);

  const crmNavItems: {
    id: AdminPageId;
    label: string;
  }[] = [
    { id: "crm-dashboard", label: "Dashboard" },
    { id: "crm-leads", label: "All Leads" },
    { id: "crm-recent-leads", label: "Recent Leads" },
    { id: "crm-ai-lead", label: "AI Prospecting" },
  ];

  const hrmNavItems: {
    id: AdminPageId;
    label: string;
  }[] = [
    { id: "hrm-attendance", label: "Attendance" },
    { id: "hrm-employees", label: "Employees" },
    { id: "hrm-payroll", label: "Payroll" },
    { id: "hrm-daily-reports", label: "Daily Reports" },
    { id: "hrm-settings", label: "Weekend & Holidays" },
    { id: "assets-management", label: "Assets" },
  ];

  const customerNavItems: {
    id: AdminPageId;
    label: string;
  }[] = [
    { id: "customers-list", label: "Directory & Loyalty" },
    { id: "customers-promotions", label: "Offers & Promos" },
    { id: "customers-feedback", label: "Guest Feedback" },
  ];

  const handleSelect = (pageId: AdminPageId) => {
    setActivePage(pageId);
    onCloseMobile();
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpenMobile && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-40 lg:hidden"
        />
      )}

      {/* Sidebar Shell */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-64 bg-slate-900 border-r border-slate-800 flex flex-col transition-transform duration-300 ease-in-out lg:translate-x-0 text-white ${
          isOpenMobile ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Brand Header */}
        <div className="h-16 px-6 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-2xl bg-primary-600 flex items-center justify-center text-white shadow-md shadow-primary-950">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-base font-bold text-white leading-none">
                Apnar
              </h1>
              <span className="text-[10px] font-semibold text-primary-400 tracking-wider uppercase">
                Software v1
              </span>
            </div>
          </div>

          <button
            onClick={onCloseMobile}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white lg:hidden"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Menu */}
        <div className="flex-1 px-3 py-4 space-y-1 overflow-y-auto custom-scrollbar">
          <div className="px-3 pb-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">
            Workspace Menus
          </div>

          {/* Dashboard */}
          <div className="pt-2">
            <button
              onClick={() => handleSelect('dashboard')}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all group ${
                activePage === 'dashboard'
                  ? "bg-[#20B2AA] text-white shadow-md"
                  : "text-slate-400 hover:text-white hover:bg-slate-800/80"
              }`}
            >
              <div className="flex items-center gap-3">
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="3" width="7" height="7"></rect>
                  <rect x="14" y="3" width="7" height="7"></rect>
                  <rect x="14" y="14" width="7" height="7"></rect>
                  <rect x="3" y="14" width="7" height="7"></rect>
                </svg>
                <span>Dashboard</span>
              </div>
            </button>
          </div>

          {/* System Setting */}
          <div className="pt-2">
            <button
              onClick={() => setIsSystemSettingOpen(!isSystemSettingOpen)}
              className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold text-slate-400 hover:text-white hover:bg-slate-800/80 transition-all group"
            >
              <div className="flex items-center gap-3">
                <Settings className="w-4 h-4 transition-colors group-hover:text-white text-slate-400" />
                <span>System Setting</span>
              </div>
              <ChevronRight
                className={`w-3.5 h-3.5 transition-transform ${isSystemSettingOpen ? "rotate-90 text-white" : ""}`}
              />
            </button>
            {isSystemSettingOpen && (
              <div className="pl-9 pr-3 py-1 mt-1 space-y-1 relative before:content-[''] before:absolute before:left-[1.35rem] before:top-2 before:bottom-2 before:w-px before:bg-slate-800">
                {[
                  { id: 'system-company', label: 'Company Setup' },
                  { id: 'system-branch', label: 'Branch Setup' },
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => handleSelect(item.id as AdminPageId)}
                    className={`w-full text-left px-3 py-2 rounded-lg text-xs font-semibold transition-all ${
                      activePage === item.id
                        ? "bg-primary-500/10 text-primary-400"
                        : "text-slate-500 hover:text-slate-300 hover:bg-slate-800/50"
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            )}
          </div>


          {/* Sales CRM */}
          <div className="pt-2">
            <button
              onClick={() => setIsCrmOpen(!isCrmOpen)}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all group ${
                crmNavItems.some((item) => item.id === activePage)
                  ? "bg-primary-600 text-white shadow-md shadow-primary-900/40 font-bold"
                  : "text-slate-400 hover:text-white hover:bg-slate-800/80"
              }`}
            >
              <div className="flex items-center gap-3">
                <Search className={`w-4 h-4 transition-colors ${crmNavItems.some((item) => item.id === activePage) ? "text-white" : "group-hover:text-white text-slate-400"}`} />
                <span>Sales CRM</span>
              </div>
              <ChevronRight
                className={`w-3.5 h-3.5 transition-transform duration-200 ${
                  isCrmOpen ? "rotate-90" : ""
                }`}
              />
            </button>
            {isCrmOpen && (
              <div className="pl-9 pr-3 py-1 mt-1 space-y-1 relative before:content-[''] before:absolute before:left-[1.35rem] before:top-2 before:bottom-2 before:w-px before:bg-slate-800">
                {crmNavItems.map((item) => {
                  const isActive = activePage === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => handleSelect(item.id)}
                      className={`w-full text-left px-3 py-2 rounded-lg text-xs font-semibold transition-all ${
                        isActive
                          ? "bg-primary-500/10 text-primary-400"
                          : "text-slate-500 hover:text-slate-300 hover:bg-slate-800/50"
                      }`}
                    >
                      {item.label}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Customers */}
          <div className="pt-2">
            <button
              onClick={() => setIsCustomersOpen(!isCustomersOpen)}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all group ${
                customerNavItems.some((item) => item.id === activePage)
                  ? "bg-primary-600 text-white shadow-md shadow-primary-900/40 font-bold"
                  : "text-slate-400 hover:text-white hover:bg-slate-800/80"
              }`}
            >
              <div className="flex items-center gap-3">
                <Users className={`w-4 h-4 transition-colors ${customerNavItems.some((item) => item.id === activePage) ? "text-white" : "group-hover:text-white text-slate-400"}`} />
                <span>Customers</span>
              </div>
              <ChevronRight
                className={`w-3.5 h-3.5 transition-transform duration-200 ${
                  isCustomersOpen ? "rotate-90" : ""
                }`}
              />
            </button>
            {isCustomersOpen && (
              <div className="pl-9 pr-3 py-1 mt-1 space-y-1 relative before:content-[''] before:absolute before:left-[1.35rem] before:top-2 before:bottom-2 before:w-px before:bg-slate-800">
                {customerNavItems.map((item) => {
                  const isActive = activePage === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => handleSelect(item.id)}
                      className={`w-full text-left px-3 py-2 rounded-lg text-xs font-semibold transition-all ${
                        isActive
                          ? "bg-primary-500/10 text-primary-400"
                          : "text-slate-500 hover:text-slate-300 hover:bg-slate-800/50"
                      }`}
                    >
                      {item.label}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Purchase Management */}

          <div className="pt-2">
            <button
              onClick={() => setIsPurchaseOpen(!isPurchaseOpen)}
              className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold text-slate-400 hover:text-white hover:bg-slate-800/80 transition-all group"
            >
              <div className="flex items-center gap-3">
                <Truck className="w-4 h-4 transition-colors group-hover:text-white" />
                <span>Purchase Management</span>
              </div>
              <ChevronRight
                className={`w-3.5 h-3.5 transition-transform ${isPurchaseOpen ? "rotate-90 text-white" : ""}`}
              />
            </button>
            
            {isPurchaseOpen && (
              <div className="pl-9 pr-3 py-1 mt-1 space-y-1 relative before:content-[''] before:absolute before:left-[1.35rem] before:top-2 before:bottom-2 before:w-px before:bg-slate-800">
                <button
                  onClick={() => setIsPurchaseTxOpen(!isPurchaseTxOpen)}
                  className="w-full text-left px-3 py-2 rounded-lg text-xs font-semibold text-slate-400 hover:text-white flex items-center justify-between transition-all"
                >
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full border border-slate-700 flex items-center justify-center">
                      <div className={`w-1.5 h-1.5 rounded-full ${isPurchaseTxOpen ? 'bg-primary-500' : 'bg-transparent'}`} />
                    </div>
                    Transaction
                  </div>
                  <ChevronRight className={`w-3 h-3 transition-transform ${isPurchaseTxOpen ? "rotate-90 text-white" : ""}`} />
                </button>
                
                {isPurchaseTxOpen && (
                  <div className="pl-6 space-y-1 relative before:content-[''] before:absolute before:left-[0.8rem] before:top-2 before:bottom-2 before:w-px before:bg-slate-800/50">
                    {[
                      { id: 'purchase-vendor-setup', label: 'Vendor Setup' },
                      { id: 'purchase-product', label: 'Product Purchase' },
                      { id: 'purchase-return', label: 'Purchase Return' },
                      { id: 'purchase-payment', label: 'Vendor Payment' },
                      { id: 'purchase-generate-barcode', label: 'Generate Barcode' },
                    ].map((item) => {
                      const isActive = activePage === item.id;
                      return (
                        <button
                          key={item.id}
                          onClick={() => handleSelect(item.id as AdminPageId)}
                          className={`w-full text-left px-3 py-2 rounded-lg text-xs font-semibold transition-all ${
                            isActive
                              ? "bg-primary-500/10 text-primary-400"
                              : "text-slate-500 hover:text-slate-300 hover:bg-slate-800/50"
                          }`}
                        >
                          {item.label}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Sales Management */}
          <div className="pt-2">
            <button
              onClick={() => setIsSalesOpen(!isSalesOpen)}
              className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold text-slate-400 hover:text-white hover:bg-slate-800/80 transition-all group"
            >
              <div className="flex items-center gap-3">
                <TrendingUp className="w-4 h-4 transition-colors group-hover:text-white" />
                <span>Sales Management</span>
              </div>
              <ChevronRight
                className={`w-3.5 h-3.5 transition-transform ${isSalesOpen ? "rotate-90 text-white" : ""}`}
              />
            </button>
            
            {isSalesOpen && (
              <div className="pl-9 pr-3 py-1 mt-1 space-y-1 relative before:content-[''] before:absolute before:left-[1.35rem] before:top-2 before:bottom-2 before:w-px before:bg-slate-800">
                {[
                  { id: 'sales-clients', label: 'Client Setup' },
                  { id: 'sales-invoices', label: 'Invoice' },
                  { id: 'sales-collections', label: 'Collection' },
                  { id: 'sales-returns', label: 'Invoice Return' },
                  { id: 'sales-return-approvals', label: 'Return Approval' },
                  { id: 'sales-pos', label: 'POS Sales' },
                  { id: 'sales-retail-returns', label: 'Retail Return' },
                ].map((item) => {
                  const isActive = activePage === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => handleSelect(item.id as AdminPageId)}
                      className={`w-full text-left px-3 py-2 rounded-lg text-xs font-semibold transition-all ${
                        isActive
                          ? "bg-primary-500/10 text-primary-400"
                          : "text-slate-500 hover:text-slate-300 hover:bg-slate-800/50"
                      }`}
                    >
                      {item.label}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

                    {/* HRM & Payroll */}
          <div className="pt-2">
            <button
              onClick={() => setIsHrmOpen(!isHrmOpen)}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all group ${
                hrmNavItems.some((item) => item.id === activePage)
                  ? "bg-primary-600 text-white shadow-md shadow-primary-900/40 font-bold"
                  : "text-slate-400 hover:text-white hover:bg-slate-800/80"
              }`}
            >
              <div className="flex items-center gap-3">
                <Briefcase className={`w-4 h-4 transition-colors ${hrmNavItems.some((item) => item.id === activePage) ? "text-white" : "group-hover:text-white text-slate-400"}`} />
                <span>HRM & Payroll</span>
              </div>
              <ChevronRight
                className={`w-3.5 h-3.5 transition-transform duration-200 ${
                  isHrmOpen ? "rotate-90" : ""
                }`}
              />
            </button>
            {isHrmOpen && (
              <div className="pl-9 pr-3 py-1 mt-1 space-y-1 relative before:content-[''] before:absolute before:left-[1.35rem] before:top-2 before:bottom-2 before:w-px before:bg-slate-800">
                {hrmNavItems.map((item) => {
                  const isActive = activePage === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => handleSelect(item.id)}
                      className={`w-full text-left px-3 py-2 rounded-lg text-xs font-semibold transition-all ${
                        isActive
                          ? "bg-primary-500/10 text-primary-400"
                          : "text-slate-500 hover:text-slate-300 hover:bg-slate-800/50"
                      }`}
                    >
                      {item.label}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Utilities */}
          <div className="pt-2">
            <button
              onClick={() => setIsUtilitiesOpen(!isUtilitiesOpen)}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all group ${
                ["lost-and-found", "hrm-catering", "utilities-subscriptions"].includes(activePage)
                  ? "bg-primary-600 text-white shadow-md shadow-primary-900/40 font-bold"
                  : "text-slate-400 hover:text-white hover:bg-slate-800/80"
              }`}
            >
              <div className="flex items-center gap-3">
                <Layers className={`w-4 h-4 transition-colors ${["lost-and-found", "hrm-catering", "utilities-subscriptions"].includes(activePage) ? "text-white" : "group-hover:text-white text-slate-400"}`} />
                <span>Utilities</span>
              </div>
              <ChevronRight
                className={`w-3.5 h-3.5 transition-transform duration-200 ${
                  isUtilitiesOpen ? "rotate-90" : ""
                }`}
              />
            </button>
            {isUtilitiesOpen && (
              <div className="pl-9 pr-3 py-1 mt-1 space-y-1 relative before:content-[''] before:absolute before:left-[1.35rem] before:top-2 before:bottom-2 before:w-px before:bg-slate-800">
                {[
                  { id: 'lost-and-found', label: 'Lost & Found' },
                  { id: 'hrm-catering', label: 'Food & Catering' },
                  { id: 'utilities-subscriptions', label: 'Subscriptions' },
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => handleSelect(item.id as AdminPageId)}
                    className={`w-full text-left px-3 py-2 rounded-lg text-xs font-semibold transition-all ${
                      activePage === item.id
                        ? "bg-primary-500/10 text-primary-400"
                        : "text-slate-500 hover:text-slate-300 hover:bg-slate-800/50"
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            )}
          </div>



          {/* Finance & Accounts */}
          <div className="pt-2">
            <button
              onClick={() => setIsPartnershipsOpen(!isPartnershipsOpen)}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all group ${
                ["finance-partnership", "partnership-investors", "partnership-withdrawals", "partnership-dividends"].includes(activePage)
                  ? "bg-primary-600 text-white shadow-md shadow-primary-900/40 font-bold"
                  : "text-slate-400 hover:text-white hover:bg-slate-800/80"
              }`}
            >
              <div className="flex items-center gap-3">
                <Briefcase className={`w-4 h-4 transition-colors ${["finance-partnership", "partnership-investors", "partnership-withdrawals", "partnership-dividends"].includes(activePage) ? "text-white" : "group-hover:text-white text-slate-400"}`} />
                <span>Partnerships</span>
              </div>
              <ChevronRight
                className={`w-4 h-4 transition-transform duration-200 ${
                  isPartnershipsOpen ? "rotate-90" : ""
                }`}
              />
            </button>
            {isPartnershipsOpen && (
              <div className="pl-9 pr-3 py-1 mt-1 space-y-1 relative before:content-[''] before:absolute before:left-[1.35rem] before:top-2 before:bottom-2 before:w-px before:bg-slate-800">
                {[
                  { id: 'finance-partnership', label: 'Summary' },
                  { id: 'partnership-investors', label: 'Investors & Partners' },
                  { id: 'partnership-withdrawals', label: 'Capital Withdrawals' },
                  { id: 'partnership-dividends', label: 'Dividends & Profits' },
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => handleSelect(item.id as AdminPageId)}
                    className={`w-full text-left px-3 py-2 rounded-lg text-xs font-semibold transition-all ${
                      activePage === item.id
                        ? "bg-primary-500/10 text-primary-400"
                        : "text-slate-500 hover:text-slate-300 hover:bg-slate-800/50"
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Global Settings */}
          <div className="pt-4 mt-4 border-t border-slate-800/50">
            <button
              onClick={() => handleSelect("settings")}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all group ${
                activePage === "settings"
                  ? "bg-primary-600 text-white shadow-md shadow-primary-900/40 font-bold"
                  : "text-slate-400 hover:text-white hover:bg-slate-800/80"
              }`}
            >
              <Settings className={`w-4 h-4 transition-colors ${activePage === "settings" ? "text-white" : "group-hover:text-white text-slate-400"}`} />
              <span>Settings</span>
            </button>

          </div>
        </div>

        {/* User Card & Sign Out */}
        <div className="p-3 border-t border-slate-800 bg-slate-950/40">
          <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-950 border border-slate-800 shadow-2xs">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-xl bg-primary-950 text-primary-300 font-bold text-xs flex items-center justify-center border border-primary-800 shrink-0">
                {user?.displayName
                  ? user.displayName.charAt(0).toUpperCase()
                  : user?.email
                  ? user.email.charAt(0).toUpperCase()
                  : "U"}
              </div>
              <div className="min-w-0">
                <p className="text-xs font-semibold text-white truncate leading-tight">
                  {user?.displayName || user?.email?.split("@")[0] || "User"}
                </p>
                <p className="text-[10px] text-slate-400 truncate leading-tight">
                  {user?.email || "Signed In"}
                </p>
              </div>
            </div>

            <button
              onClick={signOutUser}
              className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-slate-800 rounded-lg transition-colors shrink-0 ml-1"
              title="Sign Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};
