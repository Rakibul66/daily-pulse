"use client";

import React from "react";
import { Menu } from "lucide-react";
import { AdminPageId } from "./Sidebar";

interface AdminTopBarProps {
  activePage: AdminPageId;
  onToggleMobileSidebar: () => void;
}

const PAGE_TITLES: Record<AdminPageId, { title: string; subtitle: string }> = {
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
    title: "Customer Directory",
    subtitle: "Manage customers and loyalty memberships",
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
  "settings": {
    title: "Settings & AI",
    subtitle: "Configure workspace preferences and AI integrations",
  },
  "system": {
    title: "System Status",
    subtitle: "Monitor workspace health and configurations",
  },
  "finance-partnership": {
    title: "Partnership & Investments",
    subtitle: "Manage investors, capital, and dividend distribution",
  },
  "lost-and-found": {
    title: "Lost & Found",
    subtitle: "Manage and return found guest property",
  },
};

export const AdminTopBar: React.FC<AdminTopBarProps> = ({
  activePage,
  onToggleMobileSidebar,
}) => {
  const current = PAGE_TITLES[activePage] || PAGE_TITLES["crm-dashboard"];

  return (
    <header className="no-print h-16 bg-slate-900 border-b border-slate-800 px-4 sm:px-6 flex items-center justify-between sticky top-0 z-30 text-white">
      {/* Left: Mobile Toggle & Page Title */}
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleMobileSidebar}
          className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 lg:hidden"
          title="Toggle Navigation Menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-400 hidden sm:inline">
              Admin /
            </span>
            <h2 className="text-sm sm:text-base font-bold text-white leading-tight">
              {current.title}
            </h2>
          </div>
          <p className="text-[11px] text-slate-400 hidden md:block leading-none mt-0.5">
            {current.subtitle}
          </p>
        </div>
      </div>
    </header>
  );
};
