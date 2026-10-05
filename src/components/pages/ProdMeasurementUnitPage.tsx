import React from 'react';
import { ChevronLeft, ChevronRight, Edit, Trash2 } from 'lucide-react';

interface Props {
  showToast: (msg: string, type: 'success'|'error') => void;
}

export const ProdMeasurementUnitPage: React.FC<Props> = ({ showToast }) => {
  return (
    <div className="w-full mx-auto pb-20 p-4 bg-[#111827] min-h-screen text-slate-300">
      
      <div className="flex flex-col lg:flex-row gap-6">
        
        {/* Left Side: Table */}
        <div className="flex-1 bg-[#1F2937] rounded-lg shadow-sm border border-slate-700/50 overflow-hidden flex flex-col">
          <div className="px-5 py-4 border-b border-slate-700/50 flex items-center justify-between">
            <h2 className="text-[15px] font-bold text-white uppercase tracking-wider">ATTRIBUTE SETUP</h2>
            <div className="flex items-center gap-2">
              <select className="bg-[#111827] border border-slate-600 rounded px-3 py-1.5 text-sm text-white focus:outline-none focus:border-[#20B2AA]">
                <option>All</option>
              </select>
            </div>
          </div>

          <div className="p-4 flex flex-wrap justify-between items-center gap-4">
            <div className="flex items-center gap-2 text-sm text-slate-400">
              <span>Show</span>
              <select className="bg-[#111827] border border-slate-600 rounded px-2 py-1 text-white focus:outline-none">
                <option value={10}>10</option>
              </select>
              <span>entries</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-slate-400">Search:</span>
              <input type="text" className="w-48 bg-[#111827] border border-slate-600 text-white text-sm rounded px-3 py-1 focus:outline-none focus:border-[#20B2AA]" />
            </div>
          </div>

          <div className="overflow-x-auto flex-1">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="text-xs font-bold border-b border-slate-700/50 bg-[#1F2937] text-white">
                <tr>
                  <th className="px-5 py-3 font-semibold">Company</th>
                  <th className="px-5 py-3 font-semibold">Name</th>
                  <th className="px-5 py-3 font-semibold">Status</th>
                  <th className="px-5 py-3 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700/30">
                {['Pcs', 'KG', 'Gm'].map((unit) => (
                  <tr key={unit} className="hover:bg-slate-700/20">
                    <td className="px-5 py-3 flex items-center gap-3">
                      <input type="checkbox" className="rounded border-slate-600 bg-slate-800" disabled />
                      M/S Buyzid Rubber
                    </td>
                    <td className="px-5 py-3">{unit}</td>
                    <td className="px-5 py-3">
                      {/* Toggle */}
                      <div className="relative inline-block w-10 h-5 cursor-pointer">
                        <input type="checkbox" className="sr-only peer" defaultChecked />
                        <div className="w-10 h-5 bg-slate-600 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white dark:bg-slate-900 after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#20B2AA]"></div>
                      </div>
                    </td>
                    <td className="px-5 py-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button className="p-1.5 bg-[#FFC107] text-white hover:bg-[#E0A800] rounded">
                          <Edit className="w-3.5 h-3.5" />
                        </button>
                        <button className="p-1.5 bg-[#DC3545] text-white hover:bg-[#C82333] rounded">
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                <tr>
                  <td className="px-5 py-3 border-t border-slate-700/50 flex items-center gap-3">
                    <input type="checkbox" className="rounded border-slate-600 bg-slate-800" disabled />
                  </td>
                  <td colSpan={2} className="border-t border-slate-700/50"></td>
                  <td className="px-5 py-3 text-right border-t border-slate-700/50">
                    <button className="px-4 py-1.5 bg-[#DC3545] text-white text-xs font-bold rounded hover:bg-[#C82333]">
                      Delete
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="p-4 border-t border-slate-700/50 flex items-center justify-between text-sm text-slate-400">
            <span>Showing 1 to 3 of 3 entries</span>
            <div className="flex items-center gap-1">
              <button className="p-1.5 rounded hover:bg-slate-700 disabled:opacity-50" disabled><ChevronLeft className="w-4 h-4" /></button>
              <button className="px-3 py-1.5 bg-[#20B2AA] text-white rounded font-bold">1</button>
              <button className="p-1.5 rounded hover:bg-slate-700 disabled:opacity-50" disabled><ChevronRight className="w-4 h-4" /></button>
            </div>
          </div>
        </div>

        {/* Right Side: Form */}
        <div className="w-full lg:w-80 bg-[#1F2937] rounded-lg shadow-sm border border-slate-700/50 h-fit">
          <div className="px-5 py-4 border-b border-slate-700/50">
            <h2 className="text-[15px] font-bold text-white uppercase tracking-wider">ADD NEW ATTRIBUTE</h2>
          </div>
          <div className="p-5 space-y-4">
            <div>
              <label className="text-xs font-bold text-white block mb-1">Company Name <span className="text-rose-500">*</span></label>
              <select className="w-full bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-sm px-3 py-2 border-none rounded focus:outline-none focus:ring-2 focus:ring-[#20B2AA]">
                <option>M/S Buyzid Rubber</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-bold text-white block mb-1">Name <span className="text-rose-500">*</span></label>
              <input type="text" placeholder="Attribute Name" className="w-full bg-[#111827] text-white text-sm px-3 py-2 border border-slate-600 rounded focus:outline-none focus:border-[#20B2AA]" />
            </div>
            <div>
              <label className="text-xs font-bold text-white block mb-1">Status <span className="text-rose-500">*</span></label>
              <select className="w-full bg-[#111827] text-white text-sm px-3 py-2 border border-slate-600 rounded focus:outline-none focus:border-[#20B2AA]">
                <option>Active</option>
                <option>Inactive</option>
              </select>
            </div>
            <div className="pt-2 flex justify-end">
              <button className="px-6 py-2 bg-[#20B2AA] text-white text-xs font-bold rounded hover:bg-[#1A9C96]">
                ADD NEW
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
