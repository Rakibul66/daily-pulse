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
  Sparkles,
  Users,
  X,
  ChevronRight,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export type AdminPageId =
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
  | "settings"
  | "system"
  | "finance-partnership"
  | "lost-and-found";

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
  const [isCustomersOpen, setIsCustomersOpen] = React.useState(true);
  const [isCrmOpen, setIsCrmOpen] = React.useState(true);
  const [isHrmOpen, setIsHrmOpen] = React.useState(true);

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
            <div className="w-9 h-9 rounded-2xl bg-indigo-600 flex items-center justify-center text-white shadow-md shadow-indigo-950">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-base font-bold text-white leading-none">
                DailyPulse
              </h1>
              <span className="text-[10px] font-semibold text-indigo-400 tracking-wider uppercase">
                Admin Panel
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

          <div className="pt-2">
            <button
              onClick={() => setIsCrmOpen(!isCrmOpen)}
              className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold text-slate-400 hover:text-white hover:bg-slate-800/80 transition-all group"
            >
              <div className="flex items-center gap-3">
                <Search className="w-4 h-4 transition-colors group-hover:text-white" />
                <span>Sales CRM</span>
              </div>
              <ChevronRight
                className={`w-3.5 h-3.5 transition-transform ${isCrmOpen ? "rotate-90 text-white" : ""}`}
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
                          ? "bg-indigo-500/10 text-indigo-400"
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

          {/* Customers Directory */}
          <div className="pt-2">
            <button
              onClick={() => setIsCustomersOpen(!isCustomersOpen)}
              className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold text-slate-400 hover:text-white hover:bg-slate-800/80 transition-all group"
            >
              <div className="flex items-center gap-3">
                <Users className="w-4 h-4 transition-colors group-hover:text-white" />
                <span>Customers</span>
              </div>
              <ChevronRight
                className={`w-3.5 h-3.5 transition-transform ${isCustomersOpen ? "rotate-90 text-white" : ""}`}
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
                          ? "bg-indigo-500/10 text-indigo-400"
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

          <div className="pt-2">
            <button
              onClick={() => setIsHrmOpen(!isHrmOpen)}
              className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold text-slate-400 hover:text-white hover:bg-slate-800/80 transition-all group"
            >
              <div className="flex items-center gap-3">
                <FileCheck className="w-4 h-4 transition-colors group-hover:text-white" />
                <span>HR & Payroll</span>
              </div>
              <ChevronRight
                className={`w-3.5 h-3.5 transition-transform ${isHrmOpen ? "rotate-90 text-white" : ""}`}
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
                          ? "bg-indigo-500/10 text-indigo-400"
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

          {/* Lost & Found */}
          <div className="pt-2">
            <button
              onClick={() => handleSelect("lost-and-found")}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all group ${
                activePage === "lost-and-found"
                  ? "bg-indigo-600 text-white shadow-md shadow-indigo-900/40 font-bold"
                  : "text-slate-400 hover:text-white hover:bg-slate-800/80"
              }`}
            >
              <Archive className={`w-4 h-4 transition-colors ${activePage === "lost-and-found" ? "text-white" : "group-hover:text-white text-slate-400"}`} />
              <span>Lost & Found</span>
            </button>
          </div>

          {/* Finance & Accounts */}
          <div className="pt-2">
            <button
              onClick={() => handleSelect("finance-partnership")}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all group ${
                activePage === "finance-partnership"
                  ? "bg-indigo-600 text-white shadow-md shadow-indigo-900/40 font-bold"
                  : "text-slate-400 hover:text-white hover:bg-slate-800/80"
              }`}
            >
              <Briefcase className={`w-4 h-4 transition-colors ${activePage === "finance-partnership" ? "text-white" : "group-hover:text-white text-slate-400"}`} />
              <span>Partnerships</span>
            </button>
          </div>

          {/* Global Settings */}
          <div className="pt-4 mt-4 border-t border-slate-800/50">
            <button
              onClick={() => handleSelect("settings")}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all group ${
                activePage === "settings"
                  ? "bg-indigo-600 text-white shadow-md shadow-indigo-900/40 font-bold"
                  : "text-slate-400 hover:text-white hover:bg-slate-800/80"
              }`}
            >
              <Settings className={`w-4 h-4 transition-colors ${activePage === "settings" ? "text-white" : "group-hover:text-white text-slate-400"}`} />
              <span>Settings & AI</span>
            </button>

            <button
              onClick={() => handleSelect("system")}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all group mt-1 ${
                activePage === "system"
                  ? "bg-indigo-600 text-white shadow-md shadow-indigo-900/40 font-bold"
                  : "text-slate-400 hover:text-white hover:bg-slate-800/80"
              }`}
            >
              <MonitorSmartphone className={`w-4 h-4 transition-colors ${activePage === "system" ? "text-white" : "group-hover:text-white text-slate-400"}`} />
              <span>System Status</span>
            </button>
          </div>
        </div>

        {/* User Card & Sign Out */}
        <div className="p-3 border-t border-slate-800 bg-slate-950/40">
          <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-950 border border-slate-800 shadow-2xs">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-xl bg-indigo-950 text-indigo-300 font-bold text-xs flex items-center justify-center border border-indigo-800 shrink-0">
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
