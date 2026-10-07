"use client";

import React, { useState } from "react";
import { Edit, Trash2, Printer, Plus, RotateCcw } from "lucide-react";

interface PurchaseReturn {
  id: string;
  company: string;
  vendor: string;
  store: string;
  returnDate: string;
  amount: string;
  staff: string;
  remarks: string;
}

export const PurchaseReturnPage: React.FC<{ showToast: (msg: string, type?: "success" | "error") => void }> = ({ showToast }) => {
  const [returns, setReturns] = useState<PurchaseReturn[]>([
    { id: "1", company: "Shomporko Retail", vendor: "Square Food and Beverage", store: "Main Branch", returnDate: "25-04-2026", amount: "2,224.13", staff: "Arnob Sur", remarks: "Damaged packaging" },
    { id: "2", company: "Shomporko Retail", vendor: "Darkin Trade & Distribution", store: "Main Branch", returnDate: "20-04-2026", amount: "320.00", staff: "Arnob Sur", remarks: "Expired batch" },
    { id: "3", company: "Shomporko Retail", vendor: "Darkin Trade & Distribution", store: "Main Branch", returnDate: "20-04-2026", amount: "126.00", staff: "Arnob Sur", remarks: "Wrong barcode" },
    { id: "4", company: "Shomporko Retail", vendor: "International Distribution", store: "Main Branch", returnDate: "19-04-2026", amount: "349.20", staff: "Arnob Sur", remarks: "Defective item" },
  ]);

  const handleDelete = (id: string) => {
    if (window.confirm("Are you sure you want to delete this return entry?")) {
      setReturns(returns.filter(r => r.id !== id));
      showToast("Return deleted", "success");
    }
  };

  return (
    <div className="w-full mx-auto pb-20 px-2 sm:px-4">
      <div className="bg-white border-4 border-black shadow-[8px_8px_0px_#000]">
        
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b-4 border-black bg-amber-300">
          <h2 className="text-black font-display font-black text-lg uppercase tracking-tight flex items-center gap-2">
            <RotateCcw className="w-5 h-5" /> PURCHASE RETURNS & ADJUSTMENTS
          </h2>
          <button 
            onClick={() => showToast("Add purchase return", "success")} 
            className="px-4 py-2 bg-black hover:bg-slate-800 text-white text-xs font-black uppercase tracking-wider border-2 border-black shadow-[3px_3px_0px_#000] flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" /> ADD NEW RETURN
          </button>
        </div>
        
        <div className="p-6">
          <div className="overflow-x-auto border-3 border-black shadow-[4px_4px_0px_#000]">
            <table className="w-full text-left text-sm text-black">
              <thead className="text-xs uppercase bg-black text-white font-black border-b-2 border-black">
                <tr>
                  <th className="px-4 py-3">Vendor</th>
                  <th className="px-4 py-3">Branch</th>
                  <th className="px-4 py-3">Return Date</th>
                  <th className="px-4 py-3 text-right">Amount (৳)</th>
                  <th className="px-4 py-3">Reason / Remarks</th>
                  <th className="px-4 py-3 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y-2 divide-black bg-white">
                {returns.map((r) => (
                  <tr key={r.id} className="hover:bg-amber-50 font-bold">
                    <td className="px-4 py-3 font-black">{r.vendor}</td>
                    <td className="px-4 py-3 text-slate-700">{r.store}</td>
                    <td className="px-4 py-3">{r.returnDate}</td>
                    <td className="px-4 py-3 text-right font-black text-rose-600">৳ {r.amount}</td>
                    <td className="px-4 py-3 text-slate-600">{r.remarks}</td>
                    <td className="px-4 py-3 text-center">
                      <div className="flex items-center justify-center gap-1">
                        <button onClick={() => showToast(`Print voucher #${r.id}`, 'success')} className="p-1.5 border border-black bg-white hover:bg-slate-100"><Printer className="w-3.5 h-3.5" /></button>
                        <button onClick={() => handleDelete(r.id)} className="p-1.5 border border-black bg-white hover:bg-rose-100 text-rose-600"><Trash2 className="w-3.5 h-3.5" /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
