import React from 'react';
import { 
  User, 
  Calendar, 
  CheckCircle, 
  Clock, 
  AlertTriangle, 
  Sparkles, 
  Trash2, 
  FileText, 
  Plus, 
  Loader2 
} from 'lucide-react';
import { DailyWorkReport } from '@/types/hrm';

interface WorkReportCardGridProps {
  isLoading: boolean;
  reports: DailyWorkReport[];
  filterDate: string;
  formatDisplayDate: (dateStr: string) => string;
  onOpenAddModal: () => void;
  onSetToday: () => void;
  onDeleteReport: (id: string) => void;
}

export const WorkReportCardGrid: React.FC<WorkReportCardGridProps> = ({
  isLoading,
  reports,
  filterDate,
  formatDisplayDate,
  onOpenAddModal,
  onSetToday,
  onDeleteReport,
}) => {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Completed':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-emerald-300 text-black border-2 border-black shadow-[1.5px_1.5px_0px_#000] text-[10px] font-black uppercase tracking-wider">
            <CheckCircle className="w-3 h-3 stroke-[3]" />
            COMPLETED
          </span>
        );
      case 'In Progress':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-amber-300 text-black border-2 border-black shadow-[1.5px_1.5px_0px_#000] text-[10px] font-black uppercase tracking-wider">
            <Clock className="w-3 h-3 stroke-[3]" />
            IN PROGRESS
          </span>
        );
      case 'Blocked':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-rose-400 text-black border-2 border-black shadow-[1.5px_1.5px_0px_#000] text-[10px] font-black uppercase tracking-wider">
            <AlertTriangle className="w-3 h-3 stroke-[3]" />
            BLOCKED
          </span>
        );
      default:
        return null;
    }
  };

  if (isLoading) {
    return (
      <div className="bg-white border-4 border-black shadow-[6px_6px_0px_#000] p-16 flex flex-col justify-center items-center gap-3">
        <Loader2 className="w-9 h-9 text-black animate-spin stroke-[2.5]" />
        <span className="font-display font-black text-xs uppercase tracking-wider text-black">
          LOADING WORK REPORTS...
        </span>
      </div>
    );
  }

  if (reports.length === 0) {
    return (
      <div className="bg-white border-4 border-black shadow-[6px_6px_0px_#000] p-10 sm:p-16 text-center">
        <div className="w-16 h-16 bg-amber-300 border-3 border-black shadow-[4px_4px_0px_#000] flex items-center justify-center mx-auto mb-5 text-black">
          <FileText className="w-8 h-8 stroke-[2.5]" />
        </div>
        
        <div className="inline-block px-3 py-1 bg-black text-white font-display font-black text-[10px] uppercase tracking-wider mb-3">
          EMPTY LOG
        </div>
        
        <h2 className="font-display font-black text-xl sm:text-2xl uppercase tracking-tight text-black mb-2">
          NO REPORTS SUBMITTED FOR {formatDisplayDate(filterDate)}
        </h2>
        
        <p className="text-xs font-bold text-slate-600 max-w-md mx-auto uppercase tracking-wide mb-6">
          No work reports found for this selected date. Team members haven't logged their daily tasks yet, or you can record a report now.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-3">
          <button
            onClick={onOpenAddModal}
            className="px-6 py-3 bg-emerald-400 hover:bg-emerald-300 text-black font-display font-black text-xs uppercase tracking-wider border-3 border-black shadow-[4px_4px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all flex items-center gap-2 cursor-pointer"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>SUBMIT REPORT FOR THIS DATE</span>
          </button>

          {filterDate !== new Date().toISOString().split('T')[0] && (
            <button
              onClick={onSetToday}
              className="px-5 py-3 bg-white hover:bg-amber-100 text-black font-display font-black text-xs uppercase tracking-wider border-3 border-black shadow-[4px_4px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all flex items-center gap-2 cursor-pointer"
            >
              <Calendar className="w-4 h-4 stroke-[2.5]" />
              <span>JUMP TO TODAY</span>
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {reports.map(report => (
        <div 
          key={report.id} 
          className="bg-white border-4 border-black shadow-[6px_6px_0px_#000] p-5 sm:p-6 flex flex-col justify-between hover:translate-y-[-2px] transition-transform"
        >
          <div>
            {/* Card Header */}
            <div className="flex items-start justify-between gap-3 mb-4 pb-3 border-b-2 border-black">
              <div>
                <h3 className="font-display font-black text-base text-black flex items-center gap-1.5">
                  <User className="w-4 h-4 stroke-[2.5]" />
                  <span>{report.employeeName}</span>
                </h3>
                <p className="text-[11px] font-bold text-slate-600 mt-0.5 flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 stroke-[2]" />
                  <span>{report.date}</span>
                </p>
              </div>
              <div>
                {getStatusBadge(report.status)}
              </div>
            </div>

            {/* Card Content */}
            <div className="space-y-3.5">
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-slate-600 block mb-1">
                  TASKS COMPLETED:
                </span>
                <div className="bg-[#FFFDF0] border-2 border-black p-3 text-xs font-mono whitespace-pre-wrap leading-relaxed text-black shadow-[2px_2px_0px_#000]">
                  {report.tasksCompleted}
                </div>
              </div>

              {(report.leadCount ?? 0) > 0 && (
                <div>
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-amber-300 border-2 border-black shadow-[1.5px_1.5px_0px_#000] text-[11px] font-black text-black uppercase tracking-wider">
                    <Sparkles className="w-3.5 h-3.5 fill-black" />
                    {report.leadCount} LEADS GENERATED
                  </span>
                </div>
              )}

              {report.issuesBlocked && (
                <div className="bg-rose-50 border-2 border-black p-3 shadow-[2px_2px_0px_#000]">
                  <div className="flex items-center gap-1.5 text-rose-900 font-display font-black text-[10px] uppercase tracking-wider mb-1">
                    <AlertTriangle className="w-3.5 h-3.5 stroke-[2.5]" />
                    BLOCKERS / ISSUES FLAGGED
                  </div>
                  <p className="text-xs font-bold text-rose-950 leading-relaxed">
                    {report.issuesBlocked}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Card Footer */}
          <div className="mt-5 pt-3 border-t-2 border-black flex items-center justify-between">
            <span className="text-[10px] font-black text-slate-500 uppercase tracking-wider">
              DAILY LOG
            </span>
            <button
              onClick={() => onDeleteReport(report.id)}
              className="px-3 py-1.5 bg-white hover:bg-rose-100 text-rose-700 border-2 border-black shadow-[1.5px_1.5px_0px_#000] text-xs font-black uppercase tracking-wider flex items-center gap-1 cursor-pointer transition-colors active:translate-x-0.5 active:translate-y-0.5"
            >
              <Trash2 className="w-3.5 h-3.5 stroke-[2.5]" />
              <span>DELETE</span>
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};
