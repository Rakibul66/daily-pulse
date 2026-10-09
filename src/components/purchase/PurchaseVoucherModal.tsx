"use client";

import React from 'react';
import { FileText, X, Printer } from 'lucide-react';
import { ProductLift } from '@/types/purchase';
import { formatDateDDMMYYYY } from '@/lib/purchaseStorage';

interface PurchaseVoucherModalProps {
  printVoucher: ProductLift | null;
  onClose: () => void;
}

export const PurchaseVoucherModal: React.FC<PurchaseVoucherModalProps> = ({
  printVoucher,
  onClose,
}) => {
  if (!printVoucher) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/60 backdrop-blur-xs">
      <div className="bg-white border-4 border-black shadow-[8px_8px_0px_#000] max-w-2xl w-full max-h-[90vh] flex flex-col animate-in fade-in zoom-in-95">
        <div className="flex items-center justify-between p-4 border-b-4 border-black bg-cyan-400">
          <h3 className="font-display font-black text-sm uppercase tracking-wide flex items-center gap-2 text-black">
            <FileText className="w-4 h-4 stroke-[2.5]" /> PURCHASE VOUCHER: {printVoucher.purchaseNo}
          </h3>
          <button
            onClick={onClose}
            className="p-1 bg-white hover:bg-red-500 hover:text-white border-2 border-black shadow-[2px_2px_0px_#000] transition-colors cursor-pointer"
          >
            <X className="w-4 h-4 stroke-[3]" />
          </button>
        </div>

        <div id="printable-voucher" className="p-6 overflow-y-auto space-y-4">
          <div className="text-center pb-3 border-b-2 border-black">
            <h2 className="font-display font-black text-lg uppercase tracking-wider text-black">
              SHOMPORKO ERP
            </h2>
            <p className="text-xs font-bold text-slate-600">Product Lifting &amp; Inward Goods Voucher</p>
          </div>

          <div className="grid grid-cols-2 gap-4 text-xs font-bold bg-slate-50 p-3 border-2 border-black">
            <div>
              <p><span className="text-slate-500">Purchase No:</span> <span className="font-mono font-black">{printVoucher.purchaseNo}</span></p>
              <p><span className="text-slate-500">Date:</span> {formatDateDDMMYYYY(printVoucher.purchaseDate)}</p>
              <p><span className="text-slate-500">Type:</span> {printVoucher.liftingType} ({printVoucher.paymentType})</p>
            </div>
            <div className="text-right">
              <p><span className="text-slate-500">Vendor:</span> <span className="font-black">{printVoucher.vendor}</span></p>
              <p><span className="text-slate-500">Store:</span> {printVoucher.store}</p>
              <p><span className="text-slate-500">Voucher No:</span> {printVoucher.voucherNo || "N/A"}</p>
            </div>
          </div>

          {/* Items Table */}
          <div className="border-2 border-black">
            <table className="w-full text-left text-xs border-collapse">
              <thead className="bg-slate-200 border-b-2 border-black font-display font-black uppercase">
                <tr>
                  <th className="p-2 border-r border-black w-8 text-center">#</th>
                  <th className="p-2 border-r border-black">Product</th>
                  <th className="p-2 border-r border-black w-24">Code</th>
                  <th className="p-2 border-r border-black w-20 text-right">Rate</th>
                  <th className="p-2 border-r border-black w-16 text-center">Qty</th>
                  <th className="p-2 w-24 text-right">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y border-black">
                {printVoucher.items && printVoucher.items.length > 0 ? (
                  printVoucher.items.map((item, idx) => (
                    <tr key={item.id}>
                      <td className="p-2 border-r border-black text-center">{idx + 1}</td>
                      <td className="p-2 border-r border-black font-bold">{item.productName}</td>
                      <td className="p-2 border-r border-black font-mono text-[10px]">{item.code}</td>
                      <td className="p-2 border-r border-black text-right">{item.rate.toFixed(2)}</td>
                      <td className="p-2 border-r border-black text-center">{item.quantity}</td>
                      <td className="p-2 text-right font-black">{item.amount.toFixed(2)}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td className="p-2 border-r border-black text-center">1</td>
                    <td className="p-2 border-r border-black font-black">{printVoucher.vendor} Lifting Batch</td>
                    <td className="p-2 border-r border-black font-mono text-[10px]">{printVoucher.purchaseNo}</td>
                    <td className="p-2 border-r border-black text-right">{printVoucher.costAmount.toFixed(2)}</td>
                    <td className="p-2 border-r border-black text-center">1</td>
                    <td className="p-2 text-right font-black">{printVoucher.costAmount.toFixed(2)}</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Summary */}
          <div className="flex justify-end">
            <div className="w-60 border-2 border-black p-2.5 bg-slate-50 space-y-1 text-xs font-bold">
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span className="font-mono">৳ {(printVoucher.subtotal || printVoucher.costAmount).toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-amber-700">
                <span>Discount:</span>
                <span className="font-mono">৳ {(printVoucher.discountAmount || 0).toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-black text-sm border-t border-black pt-1">
                <span>Net Payable:</span>
                <span className="font-mono text-indigo-700">৳ {printVoucher.costAmount.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Signatures */}
          <div className="grid grid-cols-3 gap-4 pt-8 text-center text-[10px] font-black uppercase text-slate-700">
            <div className="border-t border-black pt-1">Received By ({printVoucher.purchasedBy || "Admin"})</div>
            <div className="border-t border-black pt-1">Store In-Charge</div>
            <div className="border-t border-black pt-1">Vendor Signature</div>
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
            <Printer className="w-4 h-4 stroke-[2.5]" /> Print Voucher
          </button>
        </div>
      </div>
    </div>
  );
};
