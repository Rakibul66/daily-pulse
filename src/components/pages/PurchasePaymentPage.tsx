"use client";

import React, { useState } from "react";
import { Edit, Trash2, Printer } from "lucide-react";

interface VendorPayment {
  id: string;
  company: string;
  date: string;
  vendor: string;
  type: string;
  paymentNo: string;
  paymentType: string;
  amount: string;
  remarks: string;
  staff: string;
}

export const PurchasePaymentPage: React.FC<{ showToast: (msg: string, type?: "success" | "error") => void }> = ({ showToast }) => {
  const [payments] = useState<VendorPayment[]>([
    { id: "1", company: "M/S Buyzid Rubber", date: "14-09-2026", vendor: "Abul Khair Consumer Point", type: "payment", paymentNo: "STP2609000001", paymentType: "cash", amount: "5000.00", remarks: "Cash Purchase", staff: "Admin" },
  ]);

  return (
    <div className="w-full mx-auto pb-10">
      <div className="bg-[#1a2332] rounded-md border border-slate-800 shadow-md">
        <div className="flex justify-between items-center p-4 border-b border-slate-800">
          <h2 className="text-white font-semibold uppercase">Vendor Payment</h2>
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
                  <th className="px-4 py-3 font-semibold">Company</th>
                  <th className="px-4 py-3 font-semibold">Date</th>
                  <th className="px-4 py-3 font-semibold">Vendor</th>
                  <th className="px-4 py-3 font-semibold">Type</th>
                  <th className="px-4 py-3 font-semibold">Payment No</th>
                  <th className="px-4 py-3 font-semibold">Payment Type</th>
                  <th className="px-4 py-3 font-semibold text-right">Amount</th>
                  <th className="px-4 py-3 font-semibold">Remarks</th>
                  <th className="px-4 py-3 font-semibold">Staff</th>
                  <th className="px-4 py-3 font-semibold text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/50">
                {payments.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-800/30">
                    <td className="px-4 py-3"><input type="checkbox" className="rounded border-slate-700 bg-slate-800" /></td>
                    <td className="px-4 py-3">{p.company}</td>
                    <td className="px-4 py-3">{p.date}</td>
                    <td className="px-4 py-3 text-white">{p.vendor}</td>
                    <td className="px-4 py-3">{p.type}</td>
                    <td className="px-4 py-3">{p.paymentNo}</td>
                    <td className="px-4 py-3">{p.paymentType}</td>
                    <td className="px-4 py-3 text-right">{p.amount}</td>
                    <td className="px-4 py-3">{p.remarks}</td>
                    <td className="px-4 py-3">{p.staff}</td>
                    <td className="px-4 py-3 text-center">
                      <div className="flex items-center justify-center gap-1">
                        <button className="p-1.5 bg-amber-500 text-white rounded hover:bg-amber-600"><Edit className="w-3.5 h-3.5" /></button>
                        <button className="p-1.5 bg-cyan-500 text-white rounded hover:bg-cyan-600"><Printer className="w-3.5 h-3.5" /></button>
                        <button className="p-1.5 bg-rose-500 text-white rounded hover:bg-rose-600"><Trash2 className="w-3.5 h-3.5" /></button>
                      </div>
                    </td>
                  </tr>
                ))}
                <tr>
                  <td className="px-4 py-3"><input type="checkbox" className="rounded border-slate-700 bg-slate-800" /></td>
                  <td colSpan={9}></td>
                  <td className="px-4 py-3 text-center">
                    <button className="px-3 py-1 bg-rose-500 text-white text-xs font-bold rounded hover:bg-rose-600">Delete</button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          
          <div className="flex justify-between items-center mt-4 text-xs text-slate-400">
            <div>Showing 1 to {payments.length} of {payments.length} entries</div>
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
