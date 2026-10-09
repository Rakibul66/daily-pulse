"use client";

import React from 'react';
import { Printer, X } from 'lucide-react';
import { PurchaseReturn } from '@/types/purchase';
import { formatDateDDMMYYYY } from '@/lib/purchaseStorage';

interface PurchaseReturnVoucherModalProps {
  printReturn: PurchaseReturn | null;
  onClose: () => void;
}

export const PurchaseReturnVoucherModal: React.FC<PurchaseReturnVoucherModalProps> = ({
  printReturn,
  onClose,
}) => {
  if (!printReturn) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/60 backdrop-blur-xs">
      <div className="bg-white border-4 border-black shadow-[8px_8px_0px_#000] max-w-2xl w-full max-h-[90vh] flex flex-col animate-in fade-in zoom-in-95">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-4 border-b-4 border-black bg-rose-400 text-black">
          <h3 className="font-display font-black text-sm uppercase tracking-wide flex items-center gap-2">
            <Printer className="w-4 h-4 stroke-[2.5]" /> PURCHASE RETURN CHALLAN &amp; DEBIT NOTE
          </h3>
          <button
            onClick={onClose}
            className="p-1 bg-white hover:bg-red-500 hover:text-white border-2 border-black shadow-[2px_2px_0px_#000] transition-colors cursor-pointer"
          >
            <X className="w-4 h-4 stroke-[3]" />
          </button>
        </div>

        {/* Printable Area */}
        <div className="p-6 overflow-y-auto space-y-4 print:p-0">
          <div className="border-b-2 border-black pb-3 text-center">
            <h1 className="font-display font-black text-xl text-black uppercase tracking-tight">
              {printReturn.company || "SHOMPORKO CRM & POS"}
            </h1>
            <p className="text-xs font-bold text-slate-600">Goods Return Note / Supplier Debit Adjustment Voucher</p>
          </div>

          <div className="grid grid-cols-2 gap-4 text-xs font-bold border-2 border-black p-3 bg-slate-50">
            <div>
              <p><span className="text-slate-500 uppercase">Vendor:</span> <strong className="text-black">{printReturn.vendor}</strong></p>
              <p><span className="text-slate-500 uppercase">Return Date:</span> {printReturn.date || formatDateDDMMYYYY(printReturn.returnDate)}</p>
              <p><span className="text-slate-500 uppercase">Return Reason:</span> <span className="text-rose-700 uppercase font-black">{printReturn.remarks}</span></p>
            </div>
            <div>
              <p><span className="text-slate-500 uppercase">Store / Branch:</span> {printReturn.store}</p>
              <p><span className="text-slate-500 uppercase">Inspected By:</span> {printReturn.staff}</p>
              <p><span className="text-slate-500 uppercase">Total Amount:</span> <strong className="font-mono text-indigo-700">৳ {Number(printReturn.amount).toFixed(2)}</strong></p>
            </div>
          </div>

          {/* Items Table */}
          <div className="border-2 border-black overflow-hidden">
            <table className="w-full text-left text-xs">
              <thead className="bg-black text-white font-black uppercase text-[11px]">
                <tr>
                  <th className="p-2 border-r border-slate-700">#</th>
                  <th className="p-2 border-r border-slate-700">Product / Item Description</th>
                  <th className="p-2 border-r border-slate-700">Code</th>
                  <th className="p-2 border-r border-slate-700 text-right">Rate (৳)</th>
                  <th className="p-2 border-r border-slate-700 text-center">Qty</th>
                  <th className="p-2 text-right">Amount (৳)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-black font-bold">
                {printReturn.items && printReturn.items.length > 0 ? (
                  printReturn.items.map((item, idx) => (
                    <tr key={item.id || idx}>
                      <td className="p-2 border-r border-black text-center">{idx + 1}</td>
                      <td className="p-2 border-r border-black font-black">{item.productName}</td>
                      <td className="p-2 border-r border-black font-mono text-[10px]">{item.code || "-"}</td>
                      <td className="p-2 border-r border-black text-right">{item.rate.toFixed(2)}</td>
                      <td className="p-2 border-r border-black text-center">{item.quantity}</td>
                      <td className="p-2 text-right font-black">{item.amount.toFixed(2)}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td className="p-2 border-r border-black text-center">1</td>
                    <td className="p-2 border-r border-black font-black">{printReturn.vendor} Returned Batch ({printReturn.remarks})</td>
                    <td className="p-2 border-r border-black font-mono text-[10px]">-</td>
                    <td className="p-2 border-r border-black text-right">{Number(printReturn.amount).toFixed(2)}</td>
                    <td className="p-2 border-r border-black text-center">1</td>
                    <td className="p-2 text-right font-black">{Number(printReturn.amount).toFixed(2)}</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Total Card */}
          <div className="flex justify-end">
            <div className="w-64 border-2 border-black p-3 bg-slate-50 space-y-1 text-xs font-black">
              <div className="flex justify-between text-sm">
                <span className="uppercase text-rose-700">Total Debit Claim:</span>
                <span className="font-mono text-indigo-700">৳ {Number(printReturn.amount).toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Signatures */}
          <div className="grid grid-cols-3 gap-4 pt-8 text-center text-[10px] font-black uppercase text-slate-700">
            <div className="border-t border-black pt-1">Returned By ({printReturn.staff})</div>
            <div className="border-t border-black pt-1">Store Supervisor</div>
            <div className="border-t border-black pt-1">Vendor Driver / Rep</div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t-4 border-black bg-slate-100 flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-white text-black font-display font-black text-xs uppercase border-2 border-black shadow-[2px_2px_0px_#000] cursor-pointer"
          >
            Close
          </button>
          <button
            type="button"
            onClick={() => window.print()}
            className="px-5 py-2 bg-cyan-400 hover:bg-cyan-300 text-black font-display font-black text-xs uppercase border-2 border-black shadow-[3px_3px_0px_#000] flex items-center gap-1.5 cursor-pointer"
          >
            <Printer className="w-4 h-4 stroke-[2.5]" /> Print Challan
          </button>
        </div>
      </div>
    </div>
  );
};
