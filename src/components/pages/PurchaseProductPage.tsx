"use client";

import React, { useState } from "react";
import { Edit, Trash2, Printer, ScanBarcode, Plus, PackageCheck } from "lucide-react";

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
  const [lifts, setLifts] = useState<ProductLift[]>([
    { id: "1", type: "credit", purchaseNo: "STL2609000007", date: "21-09-2026", voucherNo: "", vendor: "A.K TRADING CORPORATION", store: "Main Branch", purchasedBy: "Admin", costAmount: "71,200.00" },
    { id: "2", type: "credit", purchaseNo: "STL2609000006", date: "17-09-2026", voucherNo: "", vendor: "Aarong Dairy", store: "Main Branch", purchasedBy: "Admin", costAmount: "470.00" },
    { id: "3", type: "credit", purchaseNo: "STL2609000005", date: "14-09-2026", voucherNo: "", vendor: "3S Distributor", store: "Main Branch", purchasedBy: "purchase", costAmount: "2,063,360.00" },
    { id: "4", type: "cash", purchaseNo: "STL2609000004", date: "14-09-2026", voucherNo: "", vendor: "Abul Khair Consumer Point", store: "Main Branch", purchasedBy: "Admin", costAmount: "5,000.00" },
    { id: "5", type: "credit", purchaseNo: "STL2609000003", date: "14-09-2026", voucherNo: "68965899", vendor: "A.K TRADING CORPORATION", store: "Main Branch", purchasedBy: "Admin", costAmount: "3,300.00" },
  ]);

  const handleDelete = (id: string) => {
    if (window.confirm("Are you sure you want to delete this purchase entry?")) {
      setLifts(lifts.filter(l => l.id !== id));
      showToast("Record deleted", "success");
    }
  };

  return (
    <div className="w-full mx-auto pb-20 px-2 sm:px-4">
      <div className="bg-white border-4 border-black shadow-[8px_8px_0px_#000]">
        
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b-4 border-black bg-amber-300">
          <h2 className="text-black font-display font-black text-lg uppercase tracking-tight flex items-center gap-2">
            <PackageCheck className="w-5 h-5" /> PRODUCT PURCHASE & LIFTING
          </h2>
          <div className="flex items-center gap-3">
            <button 
              onClick={() => showToast("Add purchase form opened", "success")}
              className="px-4 py-2 bg-black hover:bg-slate-800 text-white text-xs font-black uppercase tracking-wider border-2 border-black shadow-[3px_3px_0px_#000] flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" /> ADD NEW PURCHASE
            </button>
          </div>
        </div>
        
        <div className="p-6">
          <div className="overflow-x-auto border-3 border-black shadow-[4px_4px_0px_#000]">
            <table className="w-full text-left text-sm text-black">
              <thead className="text-xs uppercase bg-black text-white font-black border-b-2 border-black">
                <tr>
                  <th className="px-4 py-3">Type</th>
                  <th className="px-4 py-3">Purchase No</th>
                  <th className="px-4 py-3">Date</th>
                  <th className="px-4 py-3">Vendor</th>
                  <th className="px-4 py-3">Branch</th>
                  <th className="px-4 py-3 text-right">Cost (৳)</th>
                  <th className="px-4 py-3 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y-2 divide-black bg-white">
                {lifts.map((l) => (
                  <tr key={l.id} className="hover:bg-amber-50 font-bold">
                    <td className="px-4 py-3">
                      <span className={`px-2 py-0.5 border border-black text-xs font-black uppercase ${l.type === 'cash' ? 'bg-emerald-200' : 'bg-amber-200'}`}>
                        {l.type}
                      </span>
                    </td>
                    <td className="px-4 py-3 font-mono text-xs">{l.purchaseNo}</td>
                    <td className="px-4 py-3 text-slate-700">{l.date}</td>
                    <td className="px-4 py-3 font-black">{l.vendor}</td>
                    <td className="px-4 py-3">{l.store}</td>
                    <td className="px-4 py-3 text-right font-black text-indigo-700">৳ {l.costAmount}</td>
                    <td className="px-4 py-3 text-center">
                      <div className="flex items-center justify-center gap-1">
                        <button onClick={() => showToast(`Voucher for ${l.purchaseNo}`, 'success')} className="p-1.5 border border-black bg-white hover:bg-slate-100"><Printer className="w-3.5 h-3.5" /></button>
                        <button onClick={() => handleDelete(l.id)} className="p-1.5 border border-black bg-white hover:bg-rose-100 text-rose-600"><Trash2 className="w-3.5 h-3.5" /></button>
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
