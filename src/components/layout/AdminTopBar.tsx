"use client";

import React from "react";
import {
  Menu,
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Sparkles,
} from "lucide-react";
import { AdminPageId } from "./Sidebar";
import { getTodayDateString } from "@/lib/formatters";

interface AdminTopBarProps {
  activePage: AdminPageId;
  selectedDate: string;
  setSelectedDate: (date: string) => void;
  onToggleMobileSidebar: () => void;
}

const PAGE_TITLES: Record<AdminPageId, { title: string; subtitle: string }> = {
  goals: {
    title: "Daily Goals & Report",
    subtitle: "Side-by-side targets vs actual results & goal achieved percentage",
  },
  eod: {
    title: "Daily Goals & Report",
    subtitle: "Side-by-side targets vs actual results & goal achieved percentage",
  },
  analytics: {
    title: "Performance Analytics & Ranges",
    subtitle: "Weekly, monthly, and custom date range performance aggregations",
  },
};

export const AdminTopBar: React.FC<AdminTopBarProps> = ({
  activePage,
  selectedDate,
  setSelectedDate,
  onToggleMobileSidebar,
}) => {
  const current = PAGE_TITLES[activePage] || PAGE_TITLES.goals;

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

      {/* Right: Date Navigator */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Date Selector */}
        <div className="flex items-center gap-1 bg-slate-950 border border-slate-800 p-1 rounded-xl">
          <button
            onClick={handlePrevDay}
            className="p-1 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
            title="Previous Day"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-1.5 px-1.5">
            <CalendarIcon className="w-3.5 h-3.5 text-indigo-400" />
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="bg-transparent text-xs font-bold text-white focus:outline-hidden cursor-pointer w-28 sm:w-auto [color-scheme:dark]"
            />
          </div>

          <button
            onClick={handleNextDay}
            className="p-1 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
            title="Next Day"
          >
            <ChevronRight className="w-4 h-4" />
          </button>

          <button
            onClick={handleToday}
            className="hidden sm:inline-block text-[10px] font-bold uppercase tracking-wider px-2 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg shadow-2xs ml-0.5 border border-slate-700"
          >
            Today
          </button>
        </div>
      </div>
    </header>
  );
};
