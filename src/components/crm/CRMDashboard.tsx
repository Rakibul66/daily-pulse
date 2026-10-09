import React from 'react';
import { DashboardMetrics } from '@/types/crm';
import { Calendar, ChevronDown, RotateCcw } from 'lucide-react';

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

interface Props {
  metrics: DashboardMetrics;
  selectedMonth: number;
  selectedYear: number;
  onMonthChange: (month: number) => void;
  onYearChange: (year: number) => void;
  totalLeadsCount?: number;
}

export const CRMDashboard: React.FC<Props> = ({
  metrics,
  selectedMonth,
  selectedYear,
  onMonthChange,
  onYearChange,
  totalLeadsCount = 0,
}) => {
  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();
  const isCurrentMonth = selectedMonth === currentMonth && selectedYear === currentYear;

  const currentYearNumber = new Date().getFullYear();
  const years = [
    currentYearNumber - 2,
    currentYearNumber - 1,
    currentYearNumber,
    currentYearNumber + 1,
    currentYearNumber + 2
  ];

  const metricCards = [
    { label: 'New Leads', data: metrics.newLeads, dot: 'bg-blue-500' },
    { label: 'Messages', data: metrics.messages, dot: 'bg-indigo-500' },
    { label: 'Calls', data: metrics.calls, dot: 'bg-cyan-500' },
    { label: 'Replies', data: metrics.replies, dot: 'bg-purple-500' },
    { label: 'Qualified', data: metrics.qualified, dot: 'bg-emerald-500' },
    { label: 'Demos', data: metrics.demos, dot: 'bg-amber-500' },
    { label: 'Proposals', data: metrics.proposals, dot: 'bg-orange-500' },
    { label: 'Won', data: metrics.won, dot: 'bg-green-600' },
    { label: 'Lost', data: metrics.lost, dot: 'bg-red-500' },
  ];

  const totalThisMonth = metricCards.reduce((acc, curr) => acc + curr.data.thisMonth, 0);

  return (
    <div className="bg-white border-2 sm:border-4 border-black shadow-[6px_6px_0px_#000] overflow-hidden">
      {/* Header bar: Clean White Background, Neo-Brutalist Border, Month & Year Selectors */}
      <div className="px-5 sm:px-6 py-4 border-b-2 sm:border-b-4 border-black bg-white flex flex-wrap items-center justify-between gap-4">
        {/* Left Side: Title with green pulse dot */}
        <div className="flex items-center gap-3">
          <span className="w-3.5 h-3.5 rounded-full bg-emerald-500 border border-black shadow-[1px_1px_0px_#000] inline-block animate-pulse"></span>
          <div>
            <h2 className="text-base sm:text-lg font-black text-black uppercase tracking-wider">
              Daily Sales Dashboard
            </h2>
            <p className="text-[11px] font-bold text-slate-600 uppercase">
              {MONTH_NAMES[selectedMonth]} {selectedYear} • {isCurrentMonth ? 'Live Period' : 'Archived Month'}
            </p>
          </div>
        </div>

        {/* Right Side: Month and Year Selectors */}
        <div className="flex items-center flex-wrap gap-2.5">
          {/* Month Dropdown */}
          <div className="relative flex items-center bg-white border-2 border-black shadow-[2px_2px_0px_#000]">
            <Calendar className="w-4 h-4 text-black ml-2.5 pointer-events-none" />
            <select
              value={selectedMonth}
              onChange={(e) => onMonthChange(Number(e.target.value))}
              aria-label="Select Month"
              className="appearance-none bg-transparent font-black text-xs text-black uppercase pl-2 pr-7 py-2 focus:outline-none cursor-pointer"
            >
              {MONTH_NAMES.map((name, idx) => (
                <option key={idx} value={idx}>
                  {name}
                </option>
              ))}
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-black absolute right-2 pointer-events-none" />
          </div>

          {/* Year Dropdown */}
          <div className="relative flex items-center bg-white border-2 border-black shadow-[2px_2px_0px_#000]">
            <select
              value={selectedYear}
              onChange={(e) => onYearChange(Number(e.target.value))}
              aria-label="Select Year"
              className="appearance-none bg-transparent font-black text-xs text-black uppercase pl-3 pr-7 py-2 focus:outline-none cursor-pointer"
            >
              {years.map((y) => (
                <option key={y} value={y}>
                  {y}
                </option>
              ))}
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-black absolute right-2 pointer-events-none" />
          </div>

          {/* Jump to Current Month Button (shown when viewing a different month/year) */}
          {!isCurrentMonth && (
            <button
              onClick={() => {
                onMonthChange(currentMonth);
                onYearChange(currentYear);
              }}
              className="flex items-center gap-1 px-3 py-2 bg-amber-300 hover:bg-amber-400 border-2 border-black text-black text-xs font-black uppercase shadow-[2px_2px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 transition-all"
              title="Jump to Current Month"
            >
              <RotateCcw className="w-3 h-3 text-black" />
              <span>Current</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Table Content - Clean White Style */}
      <div className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs uppercase bg-amber-200 border-b-2 sm:border-b-4 border-black text-black">
              <tr>
                <th className="px-5 sm:px-6 py-3.5 font-black tracking-wider border-r-2 border-black">
                  Metric
                </th>
                <th className="px-5 sm:px-6 py-3.5 font-black tracking-wider border-r-2 border-black">
                  Today
                </th>
                <th className="px-5 sm:px-6 py-3.5 font-black tracking-wider border-r-2 border-black">
                  This Week
                </th>
                <th className="px-5 sm:px-6 py-3.5 font-black tracking-wider">
                  {MONTH_NAMES[selectedMonth].toUpperCase()} {selectedYear}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y-2 divide-black/10 bg-white">
              {metricCards.map((item, idx) => (
                <tr key={idx} className="hover:bg-amber-50/60 transition-colors">
                  <td className="px-5 sm:px-6 py-4 font-black text-black border-r-2 border-black/10">
                    <div className="flex items-center gap-2.5">
                      <span className={`w-2.5 h-2.5 rounded-full ${item.dot} border border-black`}></span>
                      <span className="uppercase tracking-wide">{item.label}</span>
                    </div>
                  </td>
                  <td className="px-5 sm:px-6 py-4 font-black text-base text-black border-r-2 border-black/10">
                    {item.data.today}
                  </td>
                  <td className="px-5 sm:px-6 py-4 font-bold text-slate-700 border-r-2 border-black/10">
                    {item.data.thisWeek}
                  </td>
                  <td className="px-5 sm:px-6 py-4 font-black text-black">
                    <span className="inline-block px-3 py-1 bg-white border-2 border-black font-black text-sm text-black shadow-[2px_2px_0px_#000]">
                      {item.data.thisMonth}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Footer Banner */}
      <div className="px-5 sm:px-6 py-3 bg-slate-50 border-t-2 sm:border-t-4 border-black flex flex-wrap items-center justify-between gap-3 text-xs font-bold text-slate-700">
        <div>
          Filtered by: <span className="font-black text-black">{MONTH_NAMES[selectedMonth]} {selectedYear}</span>
        </div>
        <div>
          Total Activities / Milestones: <span className="font-black text-black">{totalThisMonth}</span>
        </div>
      </div>
    </div>
  );
};
