"use client";

import React, { useState } from "react";
import { Edit, Trash2, Printer, ScanBarcode } from "lucide-react";

interface ProductLift {
  id: string;
  type: string;
  purchaseNo: string;
  date: string;
  voucherNo: string;
  vendor: string;
  store: string;
  purchasedBy: string;
  costAmount: string;
}

export const PurchaseProductPage: React.FC<{ showToast: (msg: string, type?: "success" | "error") => void }> = ({ showToast }) => {
  const [lifts] = useState<ProductLift[]>([
    { id: "1", type: "credit", purchaseNo: "STL2609000007", date: "21-09-2026", voucherNo: "", vendor: "A.K TRADING CORPORATION", store: "Shankhari Bazar", purchasedBy: "Admin", costAmount: "71200.00" },
    { id: "2", type: "credit", purchaseNo: "STL2609000006", date: "17-09-2026", voucherNo: "", vendor: "Aarong Dairy", store: "Shankhari Bazar", purchasedBy: "Admin", costAmount: "470.00" },
    { id: "3", type: "credit", purchaseNo: "STL2609000005", date: "14-09-2026", voucherNo: "", vendor: "3S Distributor", store: "Shankhari Bazar", purchasedBy: "purchase", costAmount: "2063360.00" },
    { id: "4", type: "cash", purchaseNo: "STL2609000004", date: "14-09-2026", voucherNo: "", vendor: "Abul Khair Consumer Point", store: "Shankhari Bazar", purchasedBy: "Admin", costAmount: "5000.00" },
    { id: "5", type: "credit", purchaseNo: "STL2609000003", date: "14-09-2026", voucherNo: "68965899", vendor: "A.K TRADING CORPORATION", store: "Shankhari Bazar", purchasedBy: "Admin", costAmount: "3300.00" },
  ]);

  return (
    <div className="w-full mx-auto pb-10">
      <div className="bg-[#1a2332] rounded-md border border-slate-800 shadow-md">
        <div className="flex justify-between items-center p-4 border-b border-slate-800">
          <h2 className="text-white font-semibold uppercase">Product Lifting</h2>
          <div className="flex items-center gap-3">
            <select className="bg-[#111827] text-white text-xs border border-slate-700 rounded px-2 py-1.5 focus:outline-none">
              <option>All</option>
            </select>
            <button className="px-4 py-1.5 bg-[#20b2aa] text-white text-xs font-bold rounded hover:bg-[#1a9a94]">ADD NEW</button>
          </div>
        </div>
        
        <div className="p-4">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center text-xs text-slate-300">
              Show 
              <select className="mx-2 bg-[#111827] border border-slate-700 rounded px-1 py-1">
                <option>10</option>
              </select>
              entries
            </div>
            <div className="flex items-center text-xs text-slate-300">
              Search:
              <input type="text" className="ml-2 bg-[#111827] border border-slate-700 rounded px-2 py-1 text-white focus:outline-none" />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-300">
              <thead className="text-xs uppercase bg-[#111827] border-b border-slate-800 text-slate-400">
                <tr>
                  <th className="px-4 py-3 w-10"><input type="checkbox" className="rounded border-slate-700 bg-slate-800" /></th>
                  <th className="px-4 py-3 font-semibold">Type</th>
                  <th className="px-4 py-3 font-semibold">Purchase No</th>
                  <th className="px-4 py-3 font-semibold">Purchase Date</th>
                  <th className="px-4 py-3 font-semibold">Voucher No</th>
                  <th className="px-4 py-3 font-semibold">Vendor</th>
                  <th className="px-4 py-3 font-semibold">Store</th>
                  <th className="px-4 py-3 font-semibold">Purchased By</th>
                  <th className="px-4 py-3 font-semibold text-right">Cost Amount</th>
                  <th className="px-4 py-3 font-semibold text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/50">
                {lifts.map((l) => (
                  <tr key={l.id} className="hover:bg-slate-800/30">
                    <td className="px-4 py-3"><input type="checkbox" className="rounded border-slate-700 bg-slate-800" /></td>
                    <td className="px-4 py-3">{l.type}</td>
                    <td className="px-4 py-3">{l.purchaseNo}</td>
                    <td className="px-4 py-3">{l.date}</td>
                    <td className="px-4 py-3">{l.voucherNo}</td>
                    <td className="px-4 py-3 text-white max-w-[150px] truncate">{l.vendor}</td>
                    <td className="px-4 py-3">{l.store}</td>
                    <td className="px-4 py-3">{l.purchasedBy}</td>
                    <td className="px-4 py-3 text-right">{l.costAmount}</td>
                    <td className="px-4 py-3 text-center">
                      <div className="flex items-center justify-center gap-1">
                        <button className="p-1.5 bg-amber-500 text-white rounded hover:bg-amber-600"><Edit className="w-3.5 h-3.5" /></button>
                        <button className="p-1.5 bg-cyan-500 text-white rounded hover:bg-cyan-600"><Printer className="w-3.5 h-3.5" /></button>
                        <button className="p-1.5 bg-primary-500 text-white rounded hover:bg-primary-600"><ScanBarcode className="w-3.5 h-3.5" /></button>
                        <button className="p-1.5 bg-rose-500 text-white rounded hover:bg-rose-600"><Trash2 className="w-3.5 h-3.5" /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          <div className="flex justify-between items-center mt-4 text-xs text-slate-400">
            <div>Showing 1 to 10 of 10 entries</div>
            <div className="flex gap-1">
              <button className="px-2 py-1 bg-[#111827] border border-slate-700 rounded">&lt;</button>
              <button className="px-2 py-1 bg-[#20b2aa] text-white rounded">1</button>
              <button className="px-2 py-1 bg-[#111827] border border-slate-700 rounded">&gt;</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
