import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface Props {
  showToast: (msg: string, type: 'success'|'error') => void;
}

const DUMMY_DATA = [
  { id: 1, code: 'test', name: 'Test', cat: 'Frozen & Canned Foods', uom: 'KG', price: '33.00' },
  { id: 2, code: 'mng', name: 'Mango', cat: 'Health & Wellness', uom: 'KG', price: '66.00' },
  { id: 3, code: 'barcode123', name: 'Hair Oil 100ml', cat: 'Canned Foods', uom: 'Gm', price: '90.00' },
  { id: 4, code: '333', name: 'sdfd', cat: 'Canned Foods', uom: 'Gm', price: '33.00' },
  { id: 5, code: '9417', name: 'polo', cat: 'Powder & Milk', uom: 'Pcs', price: '0.00' },
  { id: 6, code: '11075', name: 'belt', cat: 'Butter & Sour Cream', uom: 'Pcs', price: '0.00' },
  { id: 7, code: '2233', name: 'Hot water bag', cat: 'Cleaning Supplies', uom: 'Pcs', price: '8680.00' },
];

export const ProdListPage: React.FC<Props> = ({ showToast }) => {
  return (
    <div className="w-full mx-auto pb-20 p-4 bg-[#111827] min-h-screen text-slate-300">
      
      {/* Top Filter Area */}
      <div className="bg-[#1F2937] rounded-lg shadow-sm border border-slate-700/50 p-5 mb-6 flex items-center justify-between">
        <div className="flex-1 max-w-2xl flex items-center gap-4">
          <div className="flex-1">
            <label className="text-xs font-bold text-white block mb-1">Product Category</label>
            <select className="w-full bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-sm px-3 py-2 border-none rounded focus:outline-none focus:ring-2 focus:ring-[#20B2AA]">
              <option>Select Category</option>
            </select>
          </div>
          <div className="pt-5">
            <button className="px-6 py-2 bg-[#20B2AA] text-white text-xs font-bold rounded hover:bg-[#1A9C96]">
              SEARCH
            </button>
          </div>
        </div>
      </div>

      {/* Main Table Container */}
      <div className="bg-[#1F2937] rounded-lg shadow-sm border border-slate-700/50 overflow-hidden flex flex-col">
        <div className="px-5 py-4 border-b border-slate-700/50 border-l-[3px] border-l-rose-500">
          <h2 className="text-[15px] font-bold text-white uppercase tracking-wider">PRODUCT LIST REPORT</h2>
        </div>

        <div className="p-4 flex flex-wrap justify-between items-center gap-4 border-b border-slate-700/50 bg-[#1F2937]">
          <div className="flex items-center gap-2">
            <button className="px-3 py-1.5 text-xs font-semibold text-slate-400 bg-[#111827] border border-slate-600 rounded hover:text-white transition-colors">Reload</button>
            <button className="px-3 py-1.5 text-xs font-semibold text-slate-400 bg-[#111827] border border-slate-600 rounded hover:text-white transition-colors">Exel</button>
            <button className="px-3 py-1.5 text-xs font-semibold text-slate-400 bg-[#111827] border border-slate-600 rounded hover:text-white transition-colors">Print</button>
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
                <th className="px-5 py-3 font-semibold">SL#</th>
                <th className="px-5 py-3 font-semibold">Product Code</th>
                <th className="px-5 py-3 font-semibold">Product Name</th>
                <th className="px-5 py-3 font-semibold">Product Category</th>
                <th className="px-5 py-3 font-semibold">UOM</th>
                <th className="px-5 py-3 font-semibold">Product Price</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700/30">
              {DUMMY_DATA.map((item) => (
                <tr key={item.id} className="hover:bg-slate-700/20">
                  <td className="px-5 py-3">{item.id}</td>
                  <td className="px-5 py-3">{item.code}</td>
                  <td className="px-5 py-3">{item.name}</td>
                  <td className="px-5 py-3">{item.cat}</td>
                  <td className="px-5 py-3">{item.uom}</td>
                  <td className="px-5 py-3">{item.price}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="p-4 border-t border-slate-700/50 flex items-center justify-between text-sm text-slate-400">
          <span>Showing 1 to 7 of 7 entries</span>
          <div className="flex items-center gap-1">
            <button className="p-1.5 rounded hover:bg-slate-700 disabled:opacity-50" disabled><ChevronLeft className="w-4 h-4" /></button>
            <button className="px-3 py-1.5 bg-[#20B2AA] text-white rounded font-bold">1</button>
            <button className="p-1.5 rounded hover:bg-slate-700 disabled:opacity-50" disabled><ChevronRight className="w-4 h-4" /></button>
          </div>
        </div>
      </div>
    </div>
  );
};
