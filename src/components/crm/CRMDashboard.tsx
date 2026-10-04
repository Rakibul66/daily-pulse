import React from 'react';
import { DashboardMetrics } from '@/types/crm';

interface Props {
  metrics: DashboardMetrics;
}

export const CRMDashboard: React.FC<Props> = ({ metrics }) => {
  const metricCards = [
    { label: 'New Leads', data: metrics.newLeads, color: 'text-blue-400' },
    { label: 'Messages', data: metrics.messages, color: 'text-indigo-400' },
    { label: 'Calls', data: metrics.calls, color: 'text-cyan-400' },
    { label: 'Replies', data: metrics.replies, color: 'text-purple-400' },
    { label: 'Qualified', data: metrics.qualified, color: 'text-emerald-400' },
    { label: 'Demos', data: metrics.demos, color: 'text-yellow-400' },
    { label: 'Proposals', data: metrics.proposals, color: 'text-orange-400' },
    { label: 'Won', data: metrics.won, color: 'text-green-400' },
    { label: 'Lost', data: metrics.lost, color: 'text-red-400' },
  ];

  return (
    <div className="bg-slate-900 rounded-md shadow-md border border-slate-800 overflow-hidden">
      <div className="px-6 py-5 border-b border-slate-800 bg-slate-900/50">
        <h2 className="text-lg font-bold text-white flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-indigo-500"></span>
          Daily Sales Dashboard
        </h2>
      </div>
      <div className="p-6">
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-slate-400 uppercase bg-slate-950/80 border-b border-slate-800">
              <tr>
                <th className="px-5 py-4 font-bold tracking-wider">Metric</th>
                <th className="px-5 py-4 font-bold tracking-wider">Today</th>
                <th className="px-5 py-4 font-bold tracking-wider">This Week</th>
                <th className="px-5 py-4 font-bold tracking-wider">This Month</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {metricCards.map((item, idx) => (
                <tr key={idx} className="hover:bg-slate-800/50 transition-colors">
                  <td className="px-5 py-4 font-bold text-white">{item.label}</td>
                  <td className={`px-5 py-4 font-extrabold ${item.color} text-base`}>{item.data.today}</td>
                  <td className="px-5 py-4 text-slate-300 font-semibold">{item.data.thisWeek}</td>
                  <td className="px-5 py-4 text-slate-400 font-medium">{item.data.thisMonth}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
