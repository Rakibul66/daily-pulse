import React from 'react';
import { FileText, CheckCircle, Sparkles, AlertTriangle } from 'lucide-react';

interface WorkReportStatsRowProps {
  totalReports: number;
  completedCount: number;
  inProgressCount: number;
  totalLeads: number;
  blockedCount: number;
}

export const WorkReportStatsRow: React.FC<WorkReportStatsRowProps> = ({
  totalReports,
  completedCount,
  inProgressCount,
  totalLeads,
  blockedCount,
}) => {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Total Reports */}
      <div className="bg-[#FFFDF0] border-3 border-black shadow-[4px_4px_0px_#000] p-4 sm:p-5">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[11px] font-display font-black uppercase tracking-wider text-slate-800">
            REPORTS FILED
          </span>
          <FileText className="w-4 h-4 text-black stroke-[2.5]" />
        </div>
        <div className="font-display font-black text-3xl sm:text-4xl text-black">
          {totalReports}
        </div>
        <p className="text-[10px] font-black uppercase tracking-wider text-slate-600 mt-1">
          Submitted for date
        </p>
      </div>

      {/* Completed */}
      <div className="bg-[#DCFCE7] border-3 border-black shadow-[4px_4px_0px_#000] p-4 sm:p-5">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[11px] font-display font-black uppercase tracking-wider text-emerald-900">
            COMPLETED
          </span>
          <CheckCircle className="w-4 h-4 text-emerald-800 stroke-[2.5]" />
        </div>
        <div className="font-display font-black text-3xl sm:text-4xl text-emerald-950">
          {completedCount}
        </div>
        <p className="text-[10px] font-black uppercase tracking-wider text-emerald-800 mt-1">
          {inProgressCount} in progress
        </p>
      </div>

      {/* Leads Collected */}
      <div className="bg-[#FEF08A] border-3 border-black shadow-[4px_4px_0px_#000] p-4 sm:p-5">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[11px] font-display font-black uppercase tracking-wider text-amber-950">
            LEADS COLLECTED
          </span>
          <Sparkles className="w-4 h-4 text-amber-900 stroke-[2.5]" />
        </div>
        <div className="font-display font-black text-3xl sm:text-4xl text-amber-950">
          {totalLeads}
        </div>
        <p className="text-[10px] font-black uppercase tracking-wider text-amber-900 mt-1">
          New sales/marketing leads
        </p>
      </div>

      {/* Blockers */}
      <div className="bg-[#FFE4E6] border-3 border-black shadow-[4px_4px_0px_#000] p-4 sm:p-5">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[11px] font-display font-black uppercase tracking-wider text-rose-900">
            BLOCKERS / ISSUES
          </span>
          <AlertTriangle className="w-4 h-4 text-rose-800 stroke-[2.5]" />
        </div>
        <div className="font-display font-black text-3xl sm:text-4xl text-rose-950">
          {blockedCount}
        </div>
        <p className="text-[10px] font-black uppercase tracking-wider text-rose-800 mt-1">
          Flagged for review
        </p>
      </div>
    </div>
  );
};
