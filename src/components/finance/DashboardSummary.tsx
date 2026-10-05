import React from 'react';
import { Briefcase, TrendingUp, Users } from 'lucide-react';

interface Props {
  totalCapital: number;
  totalDividends: number;
  activePartnersCount: number;
}

export const DashboardSummary: React.FC<Props> = ({ totalCapital, totalDividends, activePartnersCount }) => {
  // We don't have total withdrawals easily accessible as a prop from PartnershipPage yet,
  // but we can fake a chart for now, or use totalCapital and totalDividends.
  // For a real cash flow chart, we'll just display a visual summary.
  const total = totalCapital + totalDividends;
  const capitalPct = total > 0 ? (totalCapital / total) * 100 : 0;
  const dividendPct = total > 0 ? (totalDividends / total) * 100 : 0;

  return (
    <div className="space-y-6">
      {/* Analytics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-slate-900 rounded-md border border-slate-800 p-5 shadow-md flex flex-col justify-center relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 rounded-full -mr-8 -mt-8"></div>
          <div className="flex items-center gap-3 mb-2 relative">
            <div className="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-400"><Briefcase className="w-5 h-5" /></div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Capital Pool</p>
          </div>
          <p className="text-2xl font-black text-white relative">৳ {totalCapital.toLocaleString()}</p>
        </div>

        <div className="bg-slate-900 rounded-md border border-slate-800 p-5 shadow-md flex flex-col justify-center relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-primary-500/5 rounded-full -mr-8 -mt-8"></div>
          <div className="flex items-center gap-3 mb-2 relative">
            <div className="w-10 h-10 rounded-full bg-primary-500/10 flex items-center justify-center text-primary-400"><TrendingUp className="w-5 h-5" /></div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Dividends Paid</p>
          </div>
          <p className="text-2xl font-black text-white relative">৳ {totalDividends.toLocaleString()}</p>
        </div>

        <div className="bg-slate-900 rounded-md border border-slate-800 p-5 shadow-md flex flex-col justify-center relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/5 rounded-full -mr-8 -mt-8"></div>
          <div className="flex items-center gap-3 mb-2 relative">
            <div className="w-10 h-10 rounded-full bg-amber-500/10 flex items-center justify-center text-amber-400"><Users className="w-5 h-5" /></div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Active Partners</p>
          </div>
          <p className="text-2xl font-black text-white relative">{activePartnersCount}</p>
        </div>
      </div>

      {/* Visual Chart */}
      <div className="bg-slate-900 border border-slate-800 rounded-md shadow-md p-6">
        <h3 className="text-sm font-bold text-white mb-6">Cash Flow Distribution Overview</h3>
        
        <div className="flex flex-col gap-6 max-w-3xl">
          {/* Capital Bar */}
          <div>
            <div className="flex justify-between text-xs font-bold mb-2">
              <span className="text-emerald-400">Total Retained Capital</span>
              <span className="text-white">৳ {totalCapital.toLocaleString()} ({capitalPct.toFixed(1)}%)</span>
            </div>
            <div className="w-full h-4 bg-slate-800 rounded-full overflow-hidden">
              <div className="h-full bg-emerald-500 rounded-full transition-all duration-1000" style={{ width: `${capitalPct}%` }}></div>
            </div>
          </div>

          {/* Dividends Bar */}
          <div>
            <div className="flex justify-between text-xs font-bold mb-2">
              <span className="text-primary-400">Total Dividends Distributed</span>
              <span className="text-white">৳ {totalDividends.toLocaleString()} ({dividendPct.toFixed(1)}%)</span>
            </div>
            <div className="w-full h-4 bg-slate-800 rounded-full overflow-hidden">
              <div className="h-full bg-primary-500 rounded-full transition-all duration-1000" style={{ width: `${dividendPct}%` }}></div>
            </div>
          </div>
        </div>
        
        <div className="mt-8 pt-4 border-t border-slate-800 text-xs text-slate-400">
          This chart represents the ratio of total retained capital versus total dividends paid out over the lifetime of the partnership.
        </div>
      </div>
    </div>
  );
};
