"use client";

import React, { useState, useMemo } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Calendar as CalendarIcon,
  Sparkles,
} from "lucide-react";
import { getTodayDateString, calculateDailyWorkProgress, DailyWorkProgress } from "@/lib/formatters";
import { DailyRecord } from "@/types/report";

interface HorizontalCalendarProps {
  selectedDate: string; // Format: "YYYY-MM-DD"
  onSelectDate: (date: string) => void;
  className?: string;
  currentDateProgress?: DailyWorkProgress;
  allRecords?: Record<string, DailyRecord>;
}

const MONTH_NAMES = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const DAY_ABBRS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export const HorizontalCalendar: React.FC<HorizontalCalendarProps> = ({
  selectedDate,
  onSelectDate,
  className = "",
  currentDateProgress,
  allRecords,
}) => {
  // Center date for the 15-day window
  const [centerDateStr, setCenterDateStr] = useState<string>(selectedDate);

  // Keep centerDateStr in sync if selectedDate changes drastically
  React.useEffect(() => {
    setCenterDateStr(selectedDate);
  }, [selectedDate]);

  const TODAY_STR = getTodayDateString();

  // Parse center date
  const centerDate = useMemo(() => {
    const parts = centerDateStr.split("-").map(Number);
    if (parts.length === 3) {
      return new Date(parts[0], parts[1] - 1, parts[2]);
    }
    const todayParts = TODAY_STR.split("-").map(Number);
    return new Date(todayParts[0], todayParts[1] - 1, todayParts[2]);
  }, [centerDateStr, TODAY_STR]);

  // Generate 15 days: 7 days before center, center day, 7 days after center
  const days = useMemo(() => {
    const list: {
      dateStr: string;
      dayOfWeek: string;
      dayNum: string;
      monthName: string;
      isToday: boolean;
      isSelected: boolean;
    }[] = [];

    for (let offset = -7; offset <= 7; offset++) {
      const d = new Date(centerDate);
      d.setDate(d.getDate() + offset);

      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, "0");
      const day = String(d.getDate()).padStart(2, "0");
      const dateStr = `${year}-${month}-${day}`;

      list.push({
        dateStr,
        dayOfWeek: DAY_ABBRS[d.getDay()],
        dayNum: day,
        monthName: MONTH_NAMES[d.getMonth()],
        isToday: dateStr === TODAY_STR,
        isSelected: dateStr === selectedDate,
      });
    }

    return list;
  }, [centerDate, selectedDate, TODAY_STR]);

  // Current selected month & year for the top header
  const headerTitle = useMemo(() => {
    const parts = selectedDate.split("-").map(Number);
    if (parts.length === 3) {
      const d = new Date(parts[0], parts[1] - 1, parts[2]);
      return `${MONTH_NAMES[d.getMonth()]} ${d.getFullYear()}`;
    }
    const now = new Date();
    return `${MONTH_NAMES[now.getMonth()]} ${now.getFullYear()}`;
  }, [selectedDate]);

  // Navigation handlers
  const handleShift = (daysCount: number) => {
    const newCenter = new Date(centerDate);
    newCenter.setDate(newCenter.getDate() + daysCount);
    const y = newCenter.getFullYear();
    const m = String(newCenter.getMonth() + 1).padStart(2, "0");
    const d = String(newCenter.getDate()).padStart(2, "0");
    setCenterDateStr(`${y}-${m}-${d}`);
  };

  const handleJumpToToday = () => {
    setCenterDateStr(TODAY_STR);
    onSelectDate(TODAY_STR);
  };

  return (
    <div className={`bg-slate-900 rounded-3xl border border-slate-800 p-4 sm:p-5 shadow-xl text-white ${className}`}>
      {/* Top Header: Current Month, Year, Navigation & Today Jump */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4 pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-indigo-950/80 text-indigo-400 border border-indigo-800/80 flex items-center justify-center">
            <CalendarIcon className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-white tracking-tight">
                {headerTitle}
              </h3>
              <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-indigo-950 text-indigo-300 border border-indigo-800/80">
                15-Day View
              </span>
            </div>
            <p className="text-[11px] text-slate-400 flex flex-wrap items-center gap-1.5">
              <span>Previous 7 days • Today • Next 7 days</span>
              <span>•</span>
              <span className="text-emerald-400 font-bold inline-flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block animate-pulse"></span>
                Green = Worked (≥50%)
              </span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={handleJumpToToday}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all active:scale-95 flex items-center gap-1 ${
              selectedDate === TODAY_STR
                ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/30"
                : "bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700"
            }`}
          >
            <Sparkles className="w-3 h-3" /> Today
          </button>

          <div className="flex items-center bg-slate-950 p-0.5 rounded-xl border border-slate-800">
            <button
              type="button"
              onClick={() => handleShift(-7)}
              title="Previous 7 Days"
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="text-[11px] text-slate-400 font-medium px-1.5">Week</span>
            <button
              type="button"
              onClick={() => handleShift(7)}
              title="Next 7 Days"
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Horizontal Strip of Days */}
      <div className="overflow-x-auto pb-1.5 -mx-1 px-1 scrollbar-thin scrollbar-thumb-slate-800">
        <div className="flex items-center gap-2 min-w-max">
          {days.map((item) => {
            const isSelected = item.isSelected;
            const isToday = item.isToday;

            // Determine work progress
            let progress: DailyWorkProgress | null = null;
            if (item.dateStr === selectedDate && currentDateProgress) {
              progress = currentDateProgress;
            } else if (allRecords && allRecords[item.dateStr]) {
              const rec = allRecords[item.dateStr];
              progress = calculateDailyWorkProgress(rec.morningGoal, rec.eodReport);
            }

            const isWorked = Boolean(progress && progress.isWorked);
            const pct = progress ? progress.percentage : 0;

            return (
              <button
                key={item.dateStr}
                type="button"
                onClick={() => onSelectDate(item.dateStr)}
                title={`${item.dateStr}: ${isWorked ? `Worked (${pct}%)` : pct > 0 ? `${pct}% completed (Below 50%)` : "No work logged"}`}
                className={`flex flex-col items-center justify-center w-14 sm:w-16 py-2.5 px-1.5 rounded-2xl transition-all select-none relative active:scale-95 cursor-pointer ${
                  isWorked
                    ? isSelected
                      ? "bg-emerald-600 text-white shadow-lg shadow-emerald-950/80 ring-2 ring-emerald-400 ring-offset-2 ring-offset-slate-900 border border-emerald-400"
                      : isToday
                      ? "bg-emerald-950/90 border-2 border-emerald-500 text-emerald-100 hover:bg-emerald-900/90 shadow-md shadow-emerald-950/60"
                      : "bg-emerald-950/60 border border-emerald-500/70 text-emerald-200 hover:bg-emerald-900/70 shadow-xs shadow-emerald-950/40"
                    : isSelected
                    ? "bg-indigo-600 text-white shadow-lg shadow-indigo-900/60 ring-2 ring-indigo-400 ring-offset-2 ring-offset-slate-900"
                    : isToday
                    ? "bg-indigo-950/70 border border-indigo-700/80 text-indigo-200 hover:bg-indigo-900/60"
                    : "bg-slate-950/80 border border-slate-800 text-slate-200 hover:bg-slate-800 hover:border-slate-700"
                }`}
              >
                {/* Worked pip indicator */}
                {isWorked && (
                  <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-slate-900 shadow-xs shadow-emerald-400"></span>
                )}

                {/* Day of Week */}
                <span
                  className={`text-[10px] font-bold uppercase tracking-wider ${
                    isWorked
                      ? isSelected
                        ? "text-emerald-100"
                        : "text-emerald-400 font-black"
                      : isSelected
                      ? "text-indigo-100"
                      : isToday
                      ? "text-indigo-300"
                      : "text-slate-400"
                  }`}
                >
                  {item.dayOfWeek}
                </span>

                {/* Day Number */}
                <span
                  className={`text-lg sm:text-xl font-extrabold leading-tight mt-0.5 ${
                    isSelected ? "text-white" : isWorked ? "text-emerald-50 font-black" : "text-white"
                  }`}
                >
                  {item.dayNum}
                </span>

                {/* Bottom Badge: Worked (✓ 50%+), Today, Progress, or Month */}
                {isWorked ? (
                  <span
                    className={`mt-1 text-[8.5px] font-black uppercase px-1.5 py-0.5 rounded-full flex items-center gap-0.5 ${
                      isSelected
                        ? "bg-white/20 text-white"
                        : isToday
                        ? "bg-emerald-500 text-slate-950 font-extrabold"
                        : "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40"
                    }`}
                  >
                    ✓ {pct}%
                  </span>
                ) : isToday ? (
                  <span
                    className={`mt-1 text-[9px] font-black uppercase px-1.5 py-0.2 rounded-full ${
                      isSelected ? "bg-white/20 text-white" : "bg-indigo-600 text-white"
                    }`}
                  >
                    Today{pct > 0 ? ` ${pct}%` : ""}
                  </span>
                ) : pct > 0 ? (
                  <span
                    className={`mt-1 text-[8.5px] font-bold px-1.5 py-0.2 rounded-full ${
                      isSelected ? "text-indigo-200" : "text-amber-400/90"
                    }`}
                  >
                    {pct}%
                  </span>
                ) : (
                  <span
                    className={`mt-1 text-[9px] font-semibold truncate ${
                      isSelected ? "text-indigo-200" : "text-slate-500"
                    }`}
                  >
                    {item.monthName.slice(0, 3)}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
