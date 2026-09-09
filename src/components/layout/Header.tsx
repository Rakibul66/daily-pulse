"use client";

import React from "react";
import {
  Calendar as CalendarIcon,
  Database,
  Printer,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  Target,
  FileCheck,
  BarChart2,
  LogOut,
  User as UserIcon,
} from "lucide-react";
import { getStoredFirebaseConfig } from "@/lib/firebase";
import { useAuth } from "@/context/AuthContext";
import { getTodayDateString } from "@/lib/formatters";

interface HeaderProps {
  activeTab: "goal" | "eod" | "analytics";
  setActiveTab: (tab: "goal" | "eod" | "analytics") => void;
  selectedDate: string;
  setSelectedDate: (date: string) => void;
  onOpenFirebaseModal: () => void;
  onOpenPrintModal: () => void;
  hasEODReport: boolean;
  hasMorningGoal: boolean;
  onNavigateHome?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  selectedDate,
  setSelectedDate,
  onOpenFirebaseModal,
  onOpenPrintModal,
  hasEODReport,
  hasMorningGoal,
  onNavigateHome,
}) => {
  const isFirebaseConnected = Boolean(getStoredFirebaseConfig());
  const { user, signOutUser } = useAuth();

  // Date increment / decrement
  const handlePrevDay = () => {
    const [y, m, d] = selectedDate.split("-").map(Number);
    const date = new Date(y, m - 1, d);
    date.setDate(date.getDate() - 1);
    const newStr = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
    setSelectedDate(newStr);
  };

  const handleNextDay = () => {
    const [y, m, d] = selectedDate.split("-").map(Number);
    const date = new Date(y, m - 1, d);
    date.setDate(date.getDate() + 1);
    const newStr = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
    setSelectedDate(newStr);
  };

  const handleToday = () => {
    setSelectedDate(getTodayDateString());
  };

  return (
    <header className="no-print bg-white border-b border-slate-200 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Tier: Logo, Date Navigator, Cloud Sync, & User Profile */}
        <div className="flex flex-wrap items-center justify-between py-3.5 gap-3 border-b border-slate-100">
          <div
            onClick={onNavigateHome}
            className="flex items-center gap-3 cursor-pointer group"
            title="Go to Home"
          >
            <div className="w-10 h-10 rounded-2xl bg-indigo-600 flex items-center justify-center text-white shadow-md shadow-indigo-200 group-hover:bg-indigo-700 transition-colors">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-base font-bold text-slate-900 tracking-tight leading-none group-hover:text-indigo-600 transition-colors">
                DailyPulse
              </h1>
              <p className="text-[11px] font-medium text-slate-400 mt-1">
                Goal & EOD Automation Hub
              </p>
            </div>
          </div>

          {/* Date Selector */}
          <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-2xl">
            <button
              onClick={handlePrevDay}
              className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-white rounded-xl transition-colors"
              title="Previous Day"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-2 px-2">
              <CalendarIcon className="w-4 h-4 text-indigo-600" />
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="bg-transparent text-xs font-semibold text-slate-800 focus:outline-hidden cursor-pointer"
              />
            </div>

            <button
              onClick={handleNextDay}
              className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-white rounded-xl transition-colors"
              title="Next Day"
            >
              <ChevronRight className="w-4 h-4" />
            </button>

            <button
              onClick={handleToday}
              className="text-[11px] font-medium px-2 py-1 bg-white hover:bg-slate-200 text-slate-700 rounded-xl transition-colors shadow-2xs ml-1"
            >
              Today
            </button>
          </div>

          {/* Right Actions: Cloud Status, PDF, and User Avatar */}
          <div className="flex items-center gap-2.5">
            <button
              onClick={onOpenFirebaseModal}
              className={`hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium border transition-colors ${
                isFirebaseConnected
                  ? "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100"
                  : "bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100"
              }`}
              title="Click to configure Firebase Firestore"
            >
              <Database className="w-3.5 h-3.5" />
              <span>{isFirebaseConnected ? "Firestore Synced" : "Local DB"}</span>
            </button>

            <button
              onClick={onOpenPrintModal}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold shadow-xs transition-all active:scale-95"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>PDF</span>
            </button>

            {/* User Profile / Logout */}
            {user ? (
              <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
                <div
                  className="w-8 h-8 rounded-xl bg-indigo-100 text-indigo-700 font-bold text-xs flex items-center justify-center border border-indigo-200"
                  title={user.email || "Logged in"}
                >
                  {user.displayName
                    ? user.displayName.charAt(0).toUpperCase()
                    : user.email
                    ? user.email.charAt(0).toUpperCase()
                    : "U"}
                </div>
                <div className="hidden lg:block text-left">
                  <p className="text-xs font-semibold text-slate-800 leading-tight max-w-[120px] truncate">
                    {user.displayName || user.email?.split("@")[0]}
                  </p>
                  <p className="text-[10px] text-slate-400 leading-tight truncate max-w-[120px]">
                    {user.email}
                  </p>
                </div>
                <button
                  onClick={signOutUser}
                  className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors ml-1"
                  title="Sign Out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-1.5 pl-2 border-l border-slate-200">
                <div className="w-8 h-8 rounded-xl bg-slate-100 text-slate-500 flex items-center justify-center">
                  <UserIcon className="w-4 h-4" />
                </div>
                <span className="text-xs text-slate-500 font-medium">Guest</span>
              </div>
            )}
          </div>
        </div>

        {/* Bottom Tier: Mode Tabs */}
        <div className="flex items-center gap-2 py-2 overflow-x-auto">
          <button
            onClick={() => setActiveTab("goal")}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
              activeTab === "goal"
                ? "bg-indigo-50 text-indigo-600 shadow-2xs border border-indigo-200"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
            }`}
          >
            <Target className="w-4 h-4" />
            <span>Morning Goal</span>
            {hasMorningGoal && (
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-600"></span>
            )}
          </button>

          <button
            onClick={() => setActiveTab("eod")}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
              activeTab === "eod"
                ? "bg-emerald-50 text-emerald-700 shadow-2xs border border-emerald-200"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
            }`}
          >
            <FileCheck className="w-4 h-4" />
            <span>End-of-Day Report</span>
            {hasEODReport && (
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>
            )}
          </button>

          <button
            onClick={() => setActiveTab("analytics")}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
              activeTab === "analytics"
                ? "bg-indigo-50 text-indigo-600 shadow-2xs border border-indigo-200"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
            }`}
          >
            <BarChart2 className="w-4 h-4" />
            <span>Weekly & Monthly Reports</span>
          </button>
        </div>
      </div>
    </header>
  );
};
