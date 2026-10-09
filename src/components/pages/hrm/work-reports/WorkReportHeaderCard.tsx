import React from 'react';
import { 
  FileText, 
  Sparkles, 
  Plus, 
  ChevronLeft, 
  ChevronRight, 
  Calendar, 
  User 
} from 'lucide-react';
import { Employee } from '@/types/hrm';

interface WorkReportHeaderCardProps {
  filterDate: string;
  onFilterDateChange: (date: string) => void;
  onPrevDay: () => void;
  onNextDay: () => void;
  onSetToday: () => void;
  formatDisplayDate: (dateStr: string) => string;
  filterEmp: string;
  onFilterEmpChange: (empId: string) => void;
  employees: Employee[];
  onOpenAddModal: () => void;
}

export const WorkReportHeaderCard: React.FC<WorkReportHeaderCardProps> = ({
  filterDate,
  onFilterDateChange,
  onPrevDay,
  onNextDay,
  onSetToday,
  formatDisplayDate,
  filterEmp,
  onFilterEmpChange,
  employees,
  onOpenAddModal,
}) => {
  return (
    <div className="bg-white border-4 border-black shadow-[6px_6px_0px_#000] p-6 sm:p-7 space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-amber-300 border-3 border-black shadow-[3px_3px_0px_#000] flex items-center justify-center text-black shrink-0">
            <FileText className="w-8 h-8 stroke-[2.5]" />
          </div>
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-amber-300 border-2 border-black text-[10px] font-black uppercase tracking-wider shadow-[2px_2px_0px_#000] mb-1.5">
              <Sparkles className="w-3.5 h-3.5 fill-black" />
              EMPLOYEE PRODUCTIVITY & TASKS
            </div>
            <h1 className="font-display font-black text-2xl sm:text-3xl uppercase tracking-tight text-black leading-none">
              DAILY WORK REPORTS
            </h1>
            <p className="text-xs font-bold text-slate-700 uppercase tracking-wide mt-1">
              Track employee daily tasks, website updates, leads generated & blockers
            </p>
          </div>
        </div>

        <button
          onClick={onOpenAddModal}
          className="px-6 py-3 bg-emerald-400 hover:bg-emerald-300 text-black font-display font-black text-xs uppercase tracking-wider border-3 border-black shadow-[4px_4px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all flex items-center gap-2 cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>+ NEW REPORT</span>
        </button>
      </div>

      {/* Interactive Date & Filter Bar */}
      <div className="pt-4 border-t-3 border-black flex flex-wrap items-center justify-between gap-3 bg-[#FFFDF0] p-3 sm:p-4 border-3 border-black shadow-[3px_3px_0px_#000]">
        {/* Date Controls */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={onPrevDay}
            className="p-2 bg-white hover:bg-slate-100 text-black border-2 border-black shadow-[2px_2px_0px_#000] text-xs font-black cursor-pointer active:translate-x-0.5 active:translate-y-0.5 transition-transform"
            title="Previous Day"
          >
            <ChevronLeft className="w-4 h-4 stroke-[3]" />
          </button>

          <div className="flex items-center gap-2 bg-white border-2 border-black shadow-[2px_2px_0px_#000] px-3 py-1.5">
            <Calendar className="w-4 h-4 text-black stroke-[2.5]" />
            <input
              type="date"
              value={filterDate}
              onChange={e => onFilterDateChange(e.target.value)}
              className="bg-transparent font-bold text-xs uppercase text-black outline-none border-none cursor-pointer"
            />
          </div>

          <button
            onClick={onNextDay}
            className="p-2 bg-white hover:bg-slate-100 text-black border-2 border-black shadow-[2px_2px_0px_#000] text-xs font-black cursor-pointer active:translate-x-0.5 active:translate-y-0.5 transition-transform"
            title="Next Day"
          >
            <ChevronRight className="w-4 h-4 stroke-[3]" />
          </button>

          <button
            onClick={onSetToday}
            className={`px-3 py-1.5 border-2 border-black shadow-[2px_2px_0px_#000] text-xs font-black uppercase tracking-wider cursor-pointer active:translate-x-0.5 active:translate-y-0.5 transition-all ${
              filterDate === new Date().toISOString().split('T')[0]
                ? 'bg-amber-300 text-black'
                : 'bg-white hover:bg-amber-100 text-black'
            }`}
          >
            TODAY
          </button>

          <span className="hidden md:inline-block text-xs font-black text-slate-800 uppercase ml-2 bg-white border-2 border-black px-2.5 py-1 shadow-[1.5px_1.5px_0px_#000]">
            📅 {formatDisplayDate(filterDate)}
          </span>
        </div>

        {/* Employee Filter */}
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-black uppercase text-slate-700 hidden sm:inline">
            EMPLOYEE:
          </span>
          <div className="flex items-center gap-2 bg-white border-2 border-black shadow-[2px_2px_0px_#000] px-3 py-1.5">
            <User className="w-4 h-4 text-black stroke-[2.5]" />
            <select
              value={filterEmp}
              onChange={e => onFilterEmpChange(e.target.value)}
              className="bg-transparent font-bold text-xs uppercase text-black outline-none border-none cursor-pointer pr-2"
            >
              <option value="ALL">ALL EMPLOYEES ({employees.length})</option>
              {employees.map(e => (
                <option key={e.id} value={e.id}>
                  {e.name} {e.department ? `(${e.department})` : ''}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};
