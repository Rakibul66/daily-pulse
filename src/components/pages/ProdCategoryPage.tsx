import React from 'react';
import { ChevronLeft, ChevronRight, Edit, Trash2 } from 'lucide-react';

interface Props {
  showToast: (msg: string, type: 'success'|'error') => void;
}

export const ProdCategoryPage: React.FC<Props> = ({ showToast }) => {
  return (
    <div className="w-full mx-auto pb-20 p-4 bg-[#111827] min-h-screen text-slate-300">
      <div className="flex flex-col lg:flex-row gap-6">
        
        {/* Left Side: Table */}
        <div className="flex-1 bg-[#1F2937] rounded-lg shadow-sm border border-slate-700/50 overflow-hidden flex flex-col">
          <div className="px-5 py-4 border-b border-slate-700/50 flex items-center justify-between">
            <h2 className="text-[15px] font-bold text-white uppercase tracking-wider">CATEGORY SETUP</h2>
          </div>
          <div className="overflow-x-auto flex-1 p-4">
            <p className="text-sm text-slate-400">Category management interface coming soon.</p>
          </div>
        </div>

        {/* Right Side: Form */}
        <div className="w-full lg:w-80 bg-[#1F2937] rounded-lg shadow-sm border border-slate-700/50 h-fit">
          <div className="px-5 py-4 border-b border-slate-700/50">
            <h2 className="text-[15px] font-bold text-white uppercase tracking-wider">ADD NEW CATEGORY</h2>
          </div>
          <div className="p-5 space-y-4">
            <div>
              <label className="text-xs font-bold text-white block mb-1">Name <span className="text-rose-500">*</span></label>
              <input type="text" placeholder="Category Name" className="w-full bg-[#111827] text-white text-sm px-3 py-2 border border-slate-600 rounded focus:outline-none focus:border-[#20B2AA]" />
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
