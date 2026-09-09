"use client";

import React, { useState, useEffect } from "react";
import { DailyRecord, AggregatedMetrics } from "@/types/report";
import {
  getRecordsInRange,
  calculateAggregatedMetrics,
} from "@/lib/storage";
import {
  formatRangeReportText,
  formatEODReportText,
  formatDateDisplay,
  getTodayDateString,
  getOffsetDateString,
  calculateDailyWorkProgress,
  WORKED_THRESHOLD_PCT,
} from "@/lib/formatters";
import {
  Calendar,
  Copy,
  Printer,
  TrendingUp,
  Target,
  Users,
  Headphones,
  Eye,
  CheckCircle2,
  BarChart3,
  CalendarRange,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";

interface RangeReportViewProps {
  onSelectDate: (dateStr: string, tab: "goal" | "eod") => void;
  onOpenCopyModal: (title: string, text: string) => void;
  showToast: (msg: string, type?: "success" | "error" | "info") => void;
}

export const RangeReportView: React.FC<RangeReportViewProps> = ({
  onSelectDate,
  onOpenCopyModal,
  showToast,
}) => {
  const todayStr = getTodayDateString();
  const [rangePreset, setRangePreset] = useState<string>("7d");
  const [startDate, setStartDate] = useState<string>(() => getOffsetDateString(todayStr, -6));
  const [endDate, setEndDate] = useState<string>(todayStr);
  const [records, setRecords] = useState<DailyRecord[]>([]);
  const [metrics, setMetrics] = useState<AggregatedMetrics | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [onlyWorkedDays, setOnlyWorkedDays] = useState<boolean>(true);

  // Filter worked days (≥50% completion)
  const workedRecords = React.useMemo(() => {
    return records.filter(
      (r) => calculateDailyWorkProgress(r.morningGoal, r.eodReport).isWorked
    );
  }, [records]);

  const displayedRecords = onlyWorkedDays ? workedRecords : records;

  // Re-calculate metrics whenever displayedRecords change
  useEffect(() => {
    const agg = calculateAggregatedMetrics(displayedRecords);
    setMetrics(agg);
  }, [displayedRecords]);

  // Calculate presets
  const handlePresetSelect = (preset: string) => {
    setRangePreset(preset);
    const [curY, curM, curD] = todayStr.split("-").map(Number);
    const now = new Date(curY, curM - 1, curD);

    const toDateStr = (d: Date) => {
      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, "0");
      const day = String(d.getDate()).padStart(2, "0");
      return `${year}-${month}-${day}`;
    };

    if (preset === "today") {
      setStartDate(todayStr);
      setEndDate(todayStr);
    } else if (preset === "yesterday") {
      const yStr = getOffsetDateString(todayStr, -1);
      setStartDate(yStr);
      setEndDate(yStr);
    } else if (preset === "7d") {
      setStartDate(getOffsetDateString(todayStr, -6));
      setEndDate(todayStr);
    } else if (preset === "week") {
      // Monday of current week
      const start = new Date(now);
      const dayOfWeek = start.getDay(); // 0 is Sunday, 1 is Monday
      const diff = start.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1);
      start.setDate(diff);
      setStartDate(toDateStr(start));
      setEndDate(todayStr);
    } else if (preset === "month") {
      const firstDay = `${curY}-${String(curM).padStart(2, "0")}-01`;
      setStartDate(firstDay);
      setEndDate(todayStr);
    } else if (preset === "30d") {
      setStartDate(getOffsetDateString(todayStr, -29));
      setEndDate(todayStr);
    }
  };

  const { user } = useAuth();

  useEffect(() => {
    loadData();
  }, [startDate, endDate, user]);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const list = await getRecordsInRange(startDate, endDate, user?.uid);
      setRecords(list);
    } catch (e) {
      console.error(e);
      showToast("Error loading range report data", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const getRangeTitle = () => {
    if (rangePreset === "today") return "Today";
    if (rangePreset === "yesterday") return "Yesterday";
    if (rangePreset === "week") return "This Week";
    if (rangePreset === "7d") return "Last 7 Days";
    if (rangePreset === "month") return "This Month";
    if (rangePreset === "30d") return "Last 30 Days";
    return "Custom Date Range";
  };

  const handleCopyRangeText = () => {
    if (!metrics) return;
    const text = formatRangeReportText(
      `${getRangeTitle()}${onlyWorkedDays ? " (Worked Days ≥50%)" : ""}`,
      startDate,
      endDate,
      metrics,
      displayedRecords
    );
    onOpenCopyModal(`Range Summary (${getRangeTitle()})`, text);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6 text-white">
      {/* Range Controls Header */}
      <div className="bg-slate-900 p-6 rounded-3xl border border-slate-800 shadow-xl space-y-5 text-white">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-indigo-500"></span>
              <h2 className="text-lg font-bold text-white">
                Weekly &amp; Monthly Performance Analytics
              </h2>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Aggregated results, conversion rates, and day-by-day logs across any date window.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => setOnlyWorkedDays((prev) => !prev)}
              className={`flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold rounded-xl border transition-all cursor-pointer ${
                onlyWorkedDays
                  ? "bg-emerald-950/80 text-emerald-300 border-emerald-600 shadow-sm"
                  : "bg-slate-800 text-slate-400 border-slate-700 hover:text-white"
              }`}
              title="Show only days with ≥50% work achievement"
            >
              <span className={`w-2 h-2 rounded-full ${onlyWorkedDays ? "bg-emerald-400 animate-pulse" : "bg-slate-500"}`}></span>
              <span>{onlyWorkedDays ? "Worked Days Only (≥50%)" : "Show All Days"}</span>
            </button>

            <button
              onClick={handleCopyRangeText}
              className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-slate-200 hover:text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-xl transition-colors active:scale-95 cursor-pointer"
            >
              <Copy className="w-3.5 h-3.5 text-indigo-400" />
              Copy Range Report
            </button>
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-slate-200 hover:text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-xl transition-colors active:scale-95 cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5 text-indigo-400" />
              Print / PDF
            </button>
          </div>
        </div>

        {/* Preset Range Tabs */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-1.5 p-1.5 bg-slate-950 border border-slate-800/80 rounded-2xl">
            {[
              { id: "today", label: "Today" },
              { id: "yesterday", label: "Yesterday" },
              { id: "week", label: "This Week" },
              { id: "7d", label: "Last 7 Days" },
              { id: "month", label: "This Month" },
              { id: "30d", label: "Last 30 Days" },
              { id: "custom", label: "Custom Range" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => handlePresetSelect(tab.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  rangePreset === tab.id
                    ? "bg-indigo-600 text-white shadow-md font-bold"
                    : "text-slate-400 hover:text-white hover:bg-slate-900"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Custom Date Pickers */}
          <div className="flex items-center gap-2 text-xs">
            <span className="text-slate-400 font-semibold">From:</span>
            <input
              type="date"
              value={startDate}
              onChange={(e) => {
                setStartDate(e.target.value);
                setRangePreset("custom");
              }}
              className="px-3 py-1.5 rounded-xl border border-slate-700 bg-slate-950 text-xs font-bold text-white [color-scheme:dark] focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 cursor-pointer"
            />
            <span className="text-slate-400 font-semibold">To:</span>
            <input
              type="date"
              value={endDate}
              onChange={(e) => {
                setEndDate(e.target.value);
                setRangePreset("custom");
              }}
              className="px-3 py-1.5 rounded-xl border border-slate-700 bg-slate-950 text-xs font-bold text-white [color-scheme:dark] focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 cursor-pointer"
            />
          </div>
        </div>
      </div>

      {/* Aggregated KPI Cards */}
      {metrics && (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800 shadow-xl space-y-1">
            <div className="flex items-center justify-between text-slate-400 mb-1">
              <span className="text-xs font-semibold text-slate-300">Leads Found</span>
              <Target className="w-4 h-4 text-indigo-400" />
            </div>
            <p className="text-2xl sm:text-3xl font-extrabold text-white">{metrics.totalLeadsFound}</p>
            <span className="text-[11px] text-slate-400">across {metrics.totalDays} day(s)</span>
          </div>

          <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800 shadow-xl space-y-1">
            <div className="flex items-center justify-between text-slate-400 mb-1">
              <span className="text-xs font-semibold text-slate-300">Contacted</span>
              <Users className="w-4 h-4 text-indigo-400" />
            </div>
            <p className="text-2xl sm:text-3xl font-extrabold text-white">{metrics.totalProspectsContacted}</p>
            <span className="text-[11px] text-slate-400">prospects reached</span>
          </div>

          <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800 shadow-xl space-y-1">
            <div className="flex items-center justify-between text-slate-400 mb-1">
              <span className="text-xs font-semibold text-slate-300">Response Rate</span>
              <TrendingUp className="w-4 h-4 text-emerald-400" />
            </div>
            <p className="text-2xl sm:text-3xl font-extrabold text-emerald-400">
              {metrics.responseRate.toFixed(1)}%
            </p>
            <span className="text-[11px] text-slate-400">
              {metrics.totalPositiveResponses} positive replies
            </span>
          </div>

          <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800 shadow-xl space-y-1">
            <div className="flex items-center justify-between text-slate-400 mb-1">
              <span className="text-xs font-semibold text-slate-300">Onboardings</span>
              <CheckCircle2 className="w-4 h-4 text-indigo-400" />
            </div>
            <p className="text-2xl sm:text-3xl font-extrabold text-indigo-400">
              {metrics.totalOnboardingDiscussions}
            </p>
            <span className="text-[11px] text-slate-400">
              {metrics.conversionRate.toFixed(1)}% conversion
            </span>
          </div>

          <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800 shadow-xl space-y-1">
            <div className="flex items-center justify-between text-slate-400 mb-1">
              <span className="text-xs font-semibold text-slate-300">Support Handled</span>
              <Headphones className="w-4 h-4 text-blue-400" />
            </div>
            <p className="text-2xl sm:text-3xl font-extrabold text-white">
              {metrics.totalCallsHandled}
            </p>
            <span className="text-[11px] text-emerald-400 font-semibold">
              {metrics.issueResolutionRate.toFixed(0)}% resolved
            </span>
          </div>

          <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800 shadow-xl space-y-1">
            <div className="flex items-center justify-between text-slate-400 mb-1">
              <span className="text-xs font-semibold text-slate-300">Competitors</span>
              <BarChart3 className="w-4 h-4 text-purple-400" />
            </div>
            <p className="text-2xl sm:text-3xl font-extrabold text-white">
              {metrics.totalCompetitorsChecked}
            </p>
            <span className="text-[11px] text-slate-400">audits logged</span>
          </div>
        </div>
      )}

      {/* Day by Day Log Card */}
      <div className="bg-slate-900 rounded-3xl border border-slate-800 shadow-xl overflow-hidden text-white">
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-indigo-400" />
            <h3 className="font-bold text-white text-sm">
              Daily Breakdown in Range ({displayedRecords.length} {onlyWorkedDays ? "worked days" : "records"})
            </h3>
          </div>
          <span className="text-xs text-slate-400 font-medium">
            {formatDateDisplay(startDate)} – {formatDateDisplay(endDate)}
          </span>
        </div>

        {displayedRecords.length === 0 ? (
          <div className="p-8 text-center text-slate-500 text-sm">
            {onlyWorkedDays
              ? "No days with ≥50% work logged in this range. Update your actual results to reach 50%!"
              : "No report records found in this date range. You can create one for any date!"}
          </div>
        ) : (
          <div className="divide-y divide-slate-800/80">
            {displayedRecords.map((rec) => {
              const eod = rec.eodReport;
              const goal = rec.morningGoal;
              const prog = calculateDailyWorkProgress(goal, eod);

              return (
                <div
                  key={rec.id}
                  className="p-5 hover:bg-slate-800/40 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-4"
                >
                  <div className="space-y-1.5 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-bold text-white text-sm">
                        {formatDateDisplay(rec.date)}
                      </span>
                      {prog.isWorked ? (
                        <span className="text-[10px] font-black px-2.5 py-0.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-800/80 flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                          ✓ Worked ({prog.percentage}%)
                        </span>
                      ) : (
                        <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-amber-950 text-amber-300 border border-amber-800/80">
                          {prog.percentage}% (Below 50%)
                        </span>
                      )}
                      {rec.hasEODReport && (
                        <span className="text-[10px] font-medium text-slate-400">
                          • EOD Logged
                        </span>
                      )}
                    </div>

                    {eod ? (
                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-300">
                        <span>
                          🎯 <strong className="text-white">{eod.leadGeneration.leadsFound}</strong> leads found
                        </span>
                        <span>
                          📞 <strong className="text-white">{eod.leadGeneration.prospectsContacted}</strong> contacted
                        </span>
                        <span>
                          🔥 <strong className="text-white">{eod.leadGeneration.seriousProspects}</strong> serious
                        </span>
                        <span>
                          💼 <strong className="text-white">{eod.leadGeneration.onboardingDiscussions}</strong> onboardings
                        </span>
                        <span>
                          🛠️ <strong className="text-white">{eod.customerSupport.issuesResolved}</strong>/
                          {eod.customerSupport.callsHandled} issues
                        </span>
                      </div>
                    ) : (
                      <p className="text-xs text-slate-500 italic">
                        Morning target set: {goal?.leadGeneration.targetLeadsToFind || 0} leads
                      </p>
                    )}

                    {eod?.summary?.tomorrowsPriority && (
                      <p className="text-xs text-slate-400 line-clamp-1">
                        <strong className="text-indigo-400">Next Priority:</strong>{" "}
                        {eod.summary.tomorrowsPriority}
                      </p>
                    )}
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    {eod && (
                      <button
                        onClick={() => {
                          const text = formatEODReportText(eod);
                          onOpenCopyModal(
                            `End-of-Day Report – ${formatDateDisplay(rec.date)}`,
                            text
                          );
                        }}
                        className="px-3 py-1.5 text-xs text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-xl font-semibold transition-colors flex items-center gap-1 cursor-pointer"
                        title="Copy this day's formatted text"
                      >
                        <Copy className="w-3.5 h-3.5 text-indigo-400" />
                        Copy
                      </button>
                    )}
                    <button
                      onClick={() => onSelectDate(rec.date, "eod")}
                      className="px-3.5 py-1.5 text-xs text-indigo-300 hover:text-white bg-indigo-950 hover:bg-indigo-900 border border-indigo-800/80 rounded-xl font-bold transition-colors flex items-center gap-1 cursor-pointer"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      View / Edit
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
