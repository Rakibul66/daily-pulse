"use client";

import React, { useRef } from "react";
import { Printer, X } from "lucide-react";
import { PurchaseVendor, VendorStatementEntry } from "@/types/purchase";
import { formatDateDDMMYYYY } from "@/lib/purchaseStorage";

interface VendorStatementTotals {
  totalPurchase: number;
  totalPayment: number;
  totalReturns: number;
  closingBalance: number;
}

interface VendorStatementPrintModalProps {
  isOpen: boolean;
  onClose: () => void;
  companyName: string;
  searchedVendor: string;
  currentVendor?: PurchaseVendor;
  searchedFromDate: string;
  searchedToDate: string;
  todayStr: string;
  previousBalance: number;
  totals: VendorStatementTotals;
  statementEntries: VendorStatementEntry[];
}

export const VendorStatementPrintModal: React.FC<VendorStatementPrintModalProps> = ({
  isOpen,
  onClose,
  companyName,
  searchedVendor,
  currentVendor,
  searchedFromDate,
  searchedToDate,
  todayStr,
  previousBalance,
  totals,
  statementEntries
}) => {
  const printRef = useRef<HTMLDivElement>(null);

  if (!isOpen) return null;

  const handleExecutePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="bg-white border-4 border-black shadow-[10px_10px_0px_#000] w-full max-w-4xl max-h-[92vh] flex flex-col">
        {/* Modal Header */}
        <div className="px-6 py-4 bg-white border-b-4 border-black flex items-center justify-between print:hidden">
          <div className="flex items-center gap-2">
            <Printer className="w-5 h-5 text-black" />
            <h3 className="font-display font-black text-base uppercase tracking-tight text-black">
              Print Vendor Statement Report
            </h3>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handleExecutePrint}
              className="px-4 py-1.5 bg-[#00c5bb] hover:bg-[#00a89f] text-white border-2 border-black font-black text-xs uppercase shadow-[2px_2px_0px_#000] flex items-center gap-2 cursor-pointer"
            >
              <Printer className="w-4 h-4 stroke-[2.5]" />
              <span>Print Document</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 bg-white hover:bg-red-600 hover:text-white border-2 border-black text-black shadow-[2px_2px_0px_#000] cursor-pointer"
            >
              <X className="w-4 h-4 stroke-[3]" />
            </button>
          </div>
        </div>

        {/* Printable Content Area */}
        <div ref={printRef} className="p-8 overflow-y-auto print:p-0 print:overflow-visible">
          <div className="border-4 border-black p-6 bg-white space-y-6">
            {/* Company Header */}
            <div className="text-center border-b-4 border-black pb-4 space-y-1">
              <h1 className="font-display font-black text-2xl uppercase tracking-wider text-black">
                {companyName || "SHOMPORKO CRM & POS ERP"}
              </h1>
              <p className="text-xs font-bold text-slate-700">
                Dhaka, Bangladesh &bull; Official Accounts & Vendor Ledger Department
              </p>
              <div className="inline-block px-4 py-1 bg-black text-white font-black text-xs uppercase tracking-widest mt-2">
                VENDOR STATEMENT REPORT
              </div>
            </div>

            {/* Vendor & Period Details */}
            <div className="grid grid-cols-2 gap-4 text-xs border-2 border-black p-4 bg-slate-50 font-bold">
              <div className="space-y-1">
                <div>
                  Vendor Name: <span className="font-black uppercase">{searchedVendor}</span>
                </div>
                {currentVendor?.code && (
                  <div>
                    Vendor Code: <span className="font-mono">{currentVendor.code}</span>
                  </div>
                )}
                {currentVendor?.contactPerson && (
                  <div>
                    Contact Person: <span>{currentVendor.contactPerson}</span>
                  </div>
                )}
                {currentVendor?.phone && (
                  <div>
                    Phone: <span className="font-mono">{currentVendor.phone}</span>
                  </div>
                )}
                {currentVendor?.address && (
                  <div>
                    Address: <span>{currentVendor.address}</span>
                  </div>
                )}
              </div>

              <div className="space-y-1 text-right">
                <div>
                  Report Date: <span className="font-mono">{formatDateDDMMYYYY(todayStr)}</span>
                </div>
                <div>
                  Statement Period:{" "}
                  <span className="font-mono">
                    {formatDateDDMMYYYY(searchedFromDate)} to {formatDateDDMMYYYY(searchedToDate)}
                  </span>
                </div>
                <div>
                  Previous Balance:{" "}
                  <span className="font-mono font-black">
                    ৳{previousBalance.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </span>
                </div>
                <div>
                  Closing Balance:{" "}
                  <span className="font-mono font-black text-red-600">
                    ৳{totals.closingBalance.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </span>
                </div>
              </div>
            </div>

            {/* Summary Figures */}
            <div className="grid grid-cols-4 gap-3 text-center">
              <div className="border-2 border-black p-2 bg-slate-100">
                <div className="text-[10px] font-black uppercase text-slate-600">Previous Bal</div>
                <div className="font-mono font-black text-xs">
                  ৳{previousBalance.toFixed(2)}
                </div>
              </div>
              <div className="border-2 border-black p-2 bg-slate-100">
                <div className="text-[10px] font-black uppercase text-slate-600">Total Purchase</div>
                <div className="font-mono font-black text-xs">
                  ৳{totals.totalPurchase.toFixed(2)}
                </div>
              </div>
              <div className="border-2 border-black p-2 bg-slate-100">
                <div className="text-[10px] font-black uppercase text-slate-600">Total Payment</div>
                <div className="font-mono font-black text-xs text-emerald-700">
                  ৳{totals.totalPayment.toFixed(2)}
                </div>
              </div>
              <div className="border-2 border-black p-2 bg-amber-100">
                <div className="text-[10px] font-black uppercase text-slate-800">Net Due / Balance</div>
                <div className="font-mono font-black text-xs text-red-700">
                  ৳{totals.closingBalance.toFixed(2)}
                </div>
              </div>
            </div>

            {/* Printable Statement Table */}
            <table className="w-full text-left border-collapse text-[11px] border-2 border-black">
              <thead>
                <tr className="bg-black text-white font-black uppercase">
                  <th className="p-2 border border-black text-center w-10">Sl#</th>
                  <th className="p-2 border border-black w-24">Date</th>
                  <th className="p-2 border border-black">Particular</th>
                  <th className="p-2 border border-black text-right w-24">Purchase</th>
                  <th className="p-2 border border-black text-right w-24">Payment</th>
                  <th className="p-2 border border-black text-right w-24">Returns</th>
                  <th className="p-2 border border-black text-right w-28">Balance</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-black font-semibold">
                {statementEntries.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="p-4 text-center font-bold text-slate-500">
                      No transactions found within this date range
                    </td>
                  </tr>
                ) : (
                  statementEntries.map((e, i) => (
                    <tr key={e.id}>
                      <td className="p-2 border border-black text-center font-mono">{i + 1}</td>
                      <td className="p-2 border border-black font-mono">{e.date}</td>
                      <td className="p-2 border border-black">
                        {e.particular} <span className="text-[9px] text-slate-500 font-mono">({e.refNo})</span>
                      </td>
                      <td className="p-2 border border-black text-right font-mono">
                        {e.purchase > 0 ? e.purchase.toFixed(2) : "0.00"}
                      </td>
                      <td className="p-2 border border-black text-right font-mono text-emerald-700">
                        {e.payment > 0 ? e.payment.toFixed(2) : "0.00"}
                      </td>
                      <td className="p-2 border border-black text-right font-mono text-amber-700">
                        {e.returns > 0 ? e.returns.toFixed(2) : "0.00"}
                      </td>
                      <td className="p-2 border border-black text-right font-mono font-black">
                        {e.balance.toFixed(2)}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
              <tfoot>
                <tr className="bg-slate-200 font-black text-black border-t-2 border-black">
                  <td colSpan={3} className="p-2 border border-black text-center">
                    Total
                  </td>
                  <td className="p-2 border border-black text-right font-mono">
                    {totals.totalPurchase.toFixed(2)}
                  </td>
                  <td className="p-2 border border-black text-right font-mono text-emerald-700">
                    {totals.totalPayment.toFixed(2)}
                  </td>
                  <td className="p-2 border border-black text-right font-mono text-amber-700">
                    {totals.totalReturns.toFixed(2)}
                  </td>
                  <td className="p-2 border border-black text-right font-mono font-black text-red-700">
                    {totals.closingBalance.toFixed(2)}
                  </td>
                </tr>
              </tfoot>
            </table>

            {/* Signatures */}
            <div className="pt-16 grid grid-cols-3 gap-6 text-center text-xs font-black">
              <div className="border-t-2 border-black pt-1 uppercase">
                Prepared By
              </div>
              <div className="border-t-2 border-black pt-1 uppercase">
                Accountant / Verified By
              </div>
              <div className="border-t-2 border-black pt-1 uppercase">
                Authorized Signature
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
