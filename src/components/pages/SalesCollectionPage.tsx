import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface Props {
  showToast: (msg: string, type: 'success'|'error') => void;
}

export const SalesCollectionPage: React.FC<Props> = ({ showToast }) => {
  return (
    <div className="w-full mx-auto pb-20">
      
      {/* Header */}
      <div className="bg-slate-900 p-4 border-b border-slate-800 shadow-sm flex flex-wrap items-center justify-between gap-4 rounded-t-lg">
        <h2 className="text-lg font-bold text-white uppercase tracking-wider">DAILY COLLECTIONS</h2>
        
        <div className="flex items-center gap-2">
          <input type="date" className="border border-slate-700 rounded px-3 py-1.5 text-sm bg-slate-950 text-white focus:outline-none focus:border-[#20B2AA]" />
          <select className="border border-slate-700 rounded px-3 py-1.5 text-sm bg-slate-950 text-white focus:outline-none">
            <option>All</option>
          </select>
          <button className="px-4 py-1.5 bg-[#20B2AA] text-white rounded text-sm font-bold shadow hover:bg-[#1A9C96] transition-colors uppercase tracking-wider ml-2">
            ADD NEW
          </button>
        </div>
      </div>

      {/* Main Container */}
      <div className="bg-slate-900 border border-t-0 border-slate-800 rounded-b-lg shadow-sm overflow-hidden">
        
        <div className="p-4 flex flex-wrap justify-between items-center gap-4 border-b border-slate-800">
          <div className="flex items-center gap-2 text-sm text-slate-400">
            <span>Show</span>
            <select className="border border-slate-700 rounded px-2 py-1 bg-slate-950 text-white focus:outline-none">
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
            </select>
            <span>entries</span>
          </div>
          
          <div className="flex items-center gap-2">
            <span className="text-sm text-slate-400">Search:</span>
            <input type="text" className="w-48 bg-slate-950 border border-slate-700 text-white text-sm rounded px-3 py-1 focus:outline-none focus:border-[#20B2AA]" />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-center text-sm text-slate-300 whitespace-nowrap">
            <thead className="text-xs text-slate-200 bg-slate-800/80 font-bold border-b border-slate-700">
              <tr>
                <th className="px-4 py-3">Company</th>
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3">Client</th>
                <th className="px-4 py-3">Collection Type</th>
                <th className="px-4 py-3">Payment No</th>
                <th className="px-4 py-3">Payment Type</th>
                <th className="px-4 py-3">Amount</th>
                <th className="px-4 py-3">Remarks</th>
                <th className="px-4 py-3">Staff</th>
                <th className="px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50">
              <tr>
                <td colSpan={10} className="px-4 py-8 text-center text-slate-500 dark:text-slate-400 bg-slate-900/50">
                  No data available in table
                </td>
              </tr>
              <tr className="bg-slate-900/30">
                <td className="px-4 py-3 text-center border-t border-slate-800">
                  <input type="checkbox" className="rounded border-slate-300 dark:border-slate-600" />
                </td>
                <td colSpan={8} className="border-t border-slate-800"></td>
                <td className="px-4 py-3 text-center border-t border-slate-800 flex justify-center">
                  <button className="px-3 py-1 bg-[#DC3545] text-white text-xs font-bold rounded shadow-sm hover:bg-[#C82333]">
                    Delete
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="p-4 flex items-center justify-between text-sm text-slate-500 dark:text-slate-400">
          <span>Showing 0 to 0 of 0 entries</span>
          <div className="flex items-center gap-1">
            <button className="p-1.5 border border-slate-700 rounded bg-slate-800 hover:bg-slate-700 disabled:opacity-50" disabled><ChevronLeft className="w-4 h-4" /></button>
            <button className="p-1.5 border border-slate-700 rounded bg-slate-800 hover:bg-slate-700 disabled:opacity-50" disabled><ChevronRight className="w-4 h-4" /></button>
          </div>
        </div>

      </div>
    </div>
  );
};
