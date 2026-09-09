"use client";

import React from "react";
import {
  Target,
  FileCheck,
  Search,
  BarChart3,
  Share2,
  Settings,
  LogOut,
  Sparkles,
  X,
  ChevronRight,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export type AdminPageId =
  | "goals"
  | "eod"
  | "analytics";

interface SidebarProps {
  activePage: AdminPageId;
  setActivePage: (page: AdminPageId) => void;
  isOpenMobile: boolean;
  onCloseMobile: () => void;
  hasMorningGoal?: boolean;
  hasEODReport?: boolean;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activePage,
  setActivePage,
  isOpenMobile,
  onCloseMobile,
  hasMorningGoal,
  hasEODReport,
}) => {
  const { user, signOutUser } = useAuth();

  const navItems: {
    id: AdminPageId;
    label: string;
    icon: React.ElementType;
    badge?: string;
    indicator?: boolean;
  }[] = [
    {
      id: "goals",
      label: "Goals & Report",
      icon: Target,
      indicator: hasMorningGoal || hasEODReport,
    },
    {
      id: "analytics",
      label: "Analytics & Ranges",
      icon: BarChart3,
    },
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
        <div className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          <div className="px-3 pb-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">
            Workspace Menus
          </div>

          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activePage === item.id;

            return (
              <button
                key={item.id}
                onClick={() => handleSelect(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all group ${
                  isActive
                    ? "bg-indigo-600 text-white shadow-md shadow-indigo-900/40 font-bold"
                    : "text-slate-400 hover:text-white hover:bg-slate-800/80"
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon
                    className={`w-4 h-4 transition-colors ${
                      isActive
                        ? "text-white"
                        : "text-slate-400 group-hover:text-white"
                    }`}
                  />
                  <span>{item.label}</span>
                </div>

                <div className="flex items-center gap-1.5">
                  {item.indicator && (
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  )}
                  {isActive && <ChevronRight className="w-3.5 h-3.5 text-indigo-200" />}
                </div>
              </button>
            );
          })}
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
