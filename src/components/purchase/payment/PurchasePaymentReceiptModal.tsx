"use client";

import React from "react";
import { Printer, X } from "lucide-react";
import { VendorPayment } from "@/types/purchase";
import { formatDateDDMMYYYY } from "@/lib/purchaseStorage";

interface PurchasePaymentReceiptModalProps {
  payment: VendorPayment | null;
  onClose: () => void;
  companyName: string;
}

export const PurchasePaymentReceiptModal: React.FC<PurchasePaymentReceiptModalProps> = ({
  payment,
  onClose,
  companyName
}) => {
  if (!payment) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/60 backdrop-blur-xs">
      <div className="bg-white border-4 border-black shadow-[8px_8px_0px_#000] max-w-2xl w-full max-h-[90vh] flex flex-col animate-in fade-in zoom-in-95">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-4 border-b-4 border-black bg-emerald-400 text-black">
          <h3 className="font-display font-black text-sm uppercase tracking-wide flex items-center gap-2">
            <Printer className="w-4 h-4 stroke-[2.5]" /> VENDOR DISBURSEMENT RECEIPT &amp; VOUCHER
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
              {companyName || "SHOMPORKO CRM & POS"}
            </h1>
            <p className="text-xs font-bold text-slate-600">Accounts Department — Vendor Payment Money Voucher</p>
          </div>

          <div className="grid grid-cols-2 gap-4 text-xs font-bold border-2 border-black p-3 bg-slate-50">
            <div>
              <p><span className="text-slate-500 uppercase">Payment No:</span> <strong className="font-mono text-black">{payment.paymentNo}</strong></p>
              <p><span className="text-slate-500 uppercase">Date:</span> {payment.date || formatDateDDMMYYYY(payment.paymentDate)}</p>
              <p><span className="text-slate-500 uppercase">Payment Method:</span> <strong className="uppercase">{payment.paymentType}</strong></p>
            </div>
            <div>
              <p><span className="text-slate-500 uppercase">Beneficiary Vendor:</span> <strong className="text-black">{payment.vendor}</strong></p>
              <p><span className="text-slate-500 uppercase">Reference Bill / PO:</span> <strong className="font-mono text-indigo-700">{payment.voucherRef || "Direct Payment"}</strong></p>
              <p><span className="text-slate-500 uppercase">Disbursed By:</span> {payment.staff}</p>
            </div>
          </div>

          {/* Amount Breakdown */}
          <div className="border-2 border-black p-4 bg-emerald-50 text-center space-y-1">
            <div className="text-xs font-black uppercase text-emerald-800">Total Disbursed Sum</div>
            <div className="text-2xl font-mono font-black text-emerald-950">
              ৳ {Number(payment.amount).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
            {payment.bankName && (
              <div className="text-xs font-bold text-slate-700">
                Channel: {payment.bankName} {payment.chequeNo ? `(${payment.chequeNo})` : ""}
              </div>
            )}
            {payment.remarks && (
              <div className="text-xs font-medium text-slate-600 italic pt-1">
                &quot;{payment.remarks}&quot;
              </div>
            )}
          </div>

          {/* Signatures */}
          <div className="grid grid-cols-4 gap-2 pt-10 text-center text-[10px] font-black uppercase text-slate-700">
            <div className="border-t border-black pt-1">Prepared By</div>
            <div className="border-t border-black pt-1">Accounts Checked</div>
            <div className="border-t border-black pt-1">Authorized Signature</div>
            <div className="border-t border-black pt-1">Received By (Vendor)</div>
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
            <Printer className="w-4 h-4 stroke-[2.5]" /> Print Receipt
          </button>
        </div>
      </div>
    </div>
  );
};
