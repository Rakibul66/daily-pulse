"use client";

import React, { useState } from "react";
import { Edit, Trash2, Printer, Plus, CreditCard } from "lucide-react";

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
  const [payments, setPayments] = useState<VendorPayment[]>([
    { id: "1", company: "Shomporko Retail", date: "14-09-2026", vendor: "Abul Khair Consumer Point", type: "payment", paymentNo: "STP2609000001", paymentType: "Cash at Hand", amount: "5,000.00", remarks: "Advance Payment for Delivery", staff: "Admin" },
    { id: "2", company: "Shomporko Retail", date: "18-09-2026", vendor: "A.K TRADING CORPORATION", type: "payment", paymentNo: "STP2609000002", paymentType: "Bank Transfer", amount: "25,000.00", remarks: "Invoice STL2609000007 Clearing", staff: "Admin" },
  ]);

  const handleDelete = (id: string) => {
    if (window.confirm("Are you sure you want to delete this payment record?")) {
      setPayments(payments.filter(p => p.id !== id));
      showToast("Payment record deleted", "success");
    }
  };

  return (
    <div className="w-full mx-auto pb-20 px-2 sm:px-4">
      <div className="bg-white border-4 border-black shadow-[8px_8px_0px_#000]">
        
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b-4 border-black bg-amber-300">
          <h2 className="text-black font-display font-black text-lg uppercase tracking-tight flex items-center gap-2">
            <CreditCard className="w-5 h-5" /> VENDOR PAYMENTS & DISBURSEMENTS
          </h2>
          <button 
            onClick={() => showToast("Add vendor payment", "success")} 
            className="px-4 py-2 bg-black hover:bg-slate-800 text-white text-xs font-black uppercase tracking-wider border-2 border-black shadow-[3px_3px_0px_#000] flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" /> ADD NEW PAYMENT
          </button>
        </div>
        
        <div className="p-6">
          <div className="overflow-x-auto border-3 border-black shadow-[4px_4px_0px_#000]">
            <table className="w-full text-left text-sm text-black">
              <thead className="text-xs uppercase bg-black text-white font-black border-b-2 border-black">
                <tr>
                  <th className="px-4 py-3">Payment No</th>
                  <th className="px-4 py-3">Date</th>
                  <th className="px-4 py-3">Vendor</th>
                  <th className="px-4 py-3">Method</th>
                  <th className="px-4 py-3 text-right">Amount (৳)</th>
                  <th className="px-4 py-3">Remarks</th>
                  <th className="px-4 py-3 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y-2 divide-black bg-white">
                {payments.map((p) => (
                  <tr key={p.id} className="hover:bg-amber-50 font-bold">
                    <td className="px-4 py-3 font-mono text-xs">{p.paymentNo}</td>
                    <td className="px-4 py-3 text-slate-700">{p.date}</td>
                    <td className="px-4 py-3 font-black">{p.vendor}</td>
                    <td className="px-4 py-3">
                      <span className="px-2 py-0.5 bg-slate-100 border border-black text-xs font-black">
                        {p.paymentType}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right font-black text-emerald-800">৳ {p.amount}</td>
                    <td className="px-4 py-3 text-slate-600">{p.remarks}</td>
                    <td className="px-4 py-3 text-center">
                      <div className="flex items-center justify-center gap-1">
                        <button onClick={() => showToast(`Voucher for #${p.paymentNo}`, 'success')} className="p-1.5 border border-black bg-white hover:bg-slate-100"><Printer className="w-3.5 h-3.5" /></button>
                        <button onClick={() => handleDelete(p.id)} className="p-1.5 border border-black bg-white hover:bg-rose-100 text-rose-600"><Trash2 className="w-3.5 h-3.5" /></button>
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
