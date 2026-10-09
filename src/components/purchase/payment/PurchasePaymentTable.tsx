"use client";

import React from "react";
import { CreditCard, Plus, Edit, Printer, Trash2 } from "lucide-react";
import { VendorPayment } from "@/types/purchase";
import { formatDateDDMMYYYY } from "@/lib/purchaseStorage";

interface PurchasePaymentTableProps {
  payments: VendorPayment[];
  isLoading: boolean;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  methodFilter: string;
  setMethodFilter: (m: string) => void;
  pageSize: number;
  setPageSize: (s: number) => void;
  currentPage: number;
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
  totalPages: number;
  totalFilteredCount: number;
  selectedIds: string[];
  onSelectAll: (checked: boolean) => void;
  onSelectRow: (id: string, checked: boolean) => void;
  onOpenAdd: () => void;
  onOpenEdit: (p: VendorPayment) => void;
  onPrint: (p: VendorPayment) => void;
  onDeleteSingle: (p: VendorPayment) => void;
  onDeleteBulk: () => void;
}

export const PurchasePaymentTable: React.FC<PurchasePaymentTableProps> = ({
  payments,
  isLoading,
  searchQuery,
  setSearchQuery,
  methodFilter,
  setMethodFilter,
  pageSize,
  setPageSize,
  currentPage,
  setCurrentPage,
  totalPages,
  totalFilteredCount,
  selectedIds,
  onSelectAll,
  onSelectRow,
  onOpenAdd,
  onOpenEdit,
  onPrint,
  onDeleteSingle,
  onDeleteBulk
}) => {
  return (
    <div className="w-full pb-20">
      <div className="bg-white border-2 sm:border-4 border-black shadow-[6px_6px_0px_#000]">
        {/* Header Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 p-4 sm:p-5 border-b-2 sm:border-b-4 border-black bg-white">
          <div className="flex items-center gap-2.5">
            <CreditCard className="w-6 h-6 text-black" />
            <h2 className="text-black font-display font-black text-base sm:text-lg uppercase tracking-tight">
              VENDOR PAYMENTS &amp; DISBURSEMENTS
            </h2>
          </div>
          <div className="flex items-center gap-3">
            {/* Method Filter */}
            <select
              value={methodFilter}
              onChange={(e) => setMethodFilter(e.target.value)}
              className="bg-white border-2 border-black px-3 py-2 text-xs font-display font-black uppercase text-black shadow-[2px_2px_0px_#000] outline-none cursor-pointer"
            >
              <option value="All">All Methods</option>
              <option value="Cash at Hand">Cash at Hand</option>
              <option value="Bank Transfer">Bank Transfer</option>
              <option value="Cheque">Cheque</option>
              <option value="bKash / Nagad">bKash / Nagad</option>
            </select>

            {/* ADD NEW Button */}
            <button
              onClick={onOpenAdd}
              className="px-4 sm:px-5 py-2 bg-cyan-400 hover:bg-cyan-300 text-black font-display font-black text-xs uppercase tracking-wider border-2 border-black shadow-[3px_3px_0px_#000] flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4 stroke-[3]" /> ADD NEW PAYMENT
            </button>
          </div>
        </div>

        {/* Controls: Show entries & Search */}
        <div className="p-4 sm:p-6 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-xs font-display font-bold text-black">
              <span>Show</span>
              <select
                value={pageSize}
                onChange={(e) => {
                  setPageSize(Number(e.target.value));
                  setCurrentPage(1);
                }}
                className="bg-white border-2 border-black px-2.5 py-1 text-xs font-black shadow-[2px_2px_0px_#000] outline-none cursor-pointer"
              >
                <option value={10}>10</option>
                <option value={25}>25</option>
                <option value={50}>50</option>
                <option value={100}>100</option>
              </select>
              <span>entries</span>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs font-display font-bold text-black">Search:</span>
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setCurrentPage(1);
                  }}
                  placeholder="Search payment..."
                  className="bg-white border-2 border-black px-3 py-1.5 text-xs font-bold text-black shadow-[2px_2px_0px_#000] outline-none w-48 sm:w-64"
                />
              </div>
            </div>
          </div>

          {/* Table Container */}
          <div className="border-2 sm:border-4 border-black shadow-[4px_4px_0px_#000] overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead className="bg-slate-900 text-white font-display font-black uppercase tracking-wider border-b-2 sm:border-b-4 border-black">
                  <tr>
                    <th className="px-3 sm:px-4 py-3.5 w-10 text-center border-r-2 border-black/40">
                      <input
                        type="checkbox"
                        checked={
                          payments.length > 0 &&
                          payments.every((p) => selectedIds.includes(p.id))
                        }
                        onChange={(e) => onSelectAll(e.target.checked)}
                        className="w-4 h-4 accent-amber-400 cursor-pointer"
                      />
                    </th>
                    <th className="px-3 sm:px-4 py-3.5 border-r-2 border-black/40">Payment No</th>
                    <th className="px-3 sm:px-4 py-3.5 border-r-2 border-black/40">Date</th>
                    <th className="px-3 sm:px-4 py-3.5 border-r-2 border-black/40">Vendor</th>
                    <th className="px-3 sm:px-4 py-3.5 border-r-2 border-black/40">Method</th>
                    <th className="px-3 sm:px-4 py-3.5 border-r-2 border-black/40 text-right">Amount (৳)</th>
                    <th className="px-3 sm:px-4 py-3.5 border-r-2 border-black/40">Ref / Bill</th>
                    <th className="px-3 sm:px-4 py-3.5 border-r-2 border-black/40">Staff</th>
                    <th className="px-3 sm:px-4 py-3.5 border-r-2 border-black/40">Remarks</th>
                    <th className="px-3 sm:px-4 py-3.5 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y-2 divide-black bg-white">
                  {isLoading ? (
                    <tr>
                      <td colSpan={10} className="px-4 py-12 text-center text-xs font-black text-slate-500 uppercase">
                        Loading vendor payments...
                      </td>
                    </tr>
                  ) : payments.length === 0 ? (
                    <tr>
                      <td colSpan={10} className="px-4 py-12 text-center text-xs font-black text-slate-500 uppercase bg-amber-50/50">
                        No vendor payment records found
                      </td>
                    </tr>
                  ) : (
                    payments.map((p) => {
                      const isChecked = selectedIds.includes(p.id);
                      return (
                        <tr
                          key={p.id}
                          className={`hover:bg-amber-50/80 transition-colors ${
                            isChecked ? "bg-amber-100/50" : ""
                          }`}
                        >
                          <td className="px-3 sm:px-4 py-3 text-center border-r-2 border-black">
                            <input
                              type="checkbox"
                              checked={isChecked}
                              onChange={(e) => onSelectRow(p.id, e.target.checked)}
                              className="w-4 h-4 accent-amber-400 cursor-pointer"
                            />
                          </td>
                          <td className="px-3 sm:px-4 py-3 font-mono font-black text-black border-r-2 border-black whitespace-nowrap">
                            {p.paymentNo}
                          </td>
                          <td className="px-3 sm:px-4 py-3 font-bold text-slate-700 border-r-2 border-black whitespace-nowrap">
                            {p.date || formatDateDDMMYYYY(p.paymentDate)}
                          </td>
                          <td className="px-3 sm:px-4 py-3 font-black text-black border-r-2 border-black">
                            {p.vendor}
                          </td>
                          <td className="px-3 sm:px-4 py-3 border-r-2 border-black whitespace-nowrap">
                            <span className="px-2 py-0.5 bg-slate-100 text-slate-900 border border-black text-[10px] font-black uppercase">
                              {p.paymentType}
                            </span>
                          </td>
                          <td className="px-3 sm:px-4 py-3 font-mono font-black text-emerald-800 border-r-2 border-black text-right whitespace-nowrap">
                            ৳ {Number(p.amount || 0).toLocaleString("en-US", {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            })}
                          </td>
                          <td className="px-3 sm:px-4 py-3 font-mono text-xs font-bold text-indigo-700 border-r-2 border-black whitespace-nowrap">
                            {p.voucherRef || "-"}
                          </td>
                          <td className="px-3 sm:px-4 py-3 font-bold text-slate-800 border-r-2 border-black whitespace-nowrap">
                            {p.staff || "Admin"}
                          </td>
                          <td className="px-3 sm:px-4 py-3 text-slate-700 font-bold border-r-2 border-black">
                            {p.remarks || "-"}
                          </td>
                          <td className="px-3 sm:px-4 py-2.5 text-center whitespace-nowrap">
                            <div className="flex items-center justify-center gap-1.5">
                              {/* Edit Button (Yellow) */}
                              <button
                                onClick={() => onOpenEdit(p)}
                                className="p-1.5 bg-amber-400 hover:bg-amber-300 text-black border border-black shadow-[1px_1px_0px_#000] transition-transform hover:scale-105 cursor-pointer"
                                title="Edit Payment"
                              >
                                <Edit className="w-3.5 h-3.5" />
                              </button>

                              {/* Print Money Receipt (Cyan) */}
                              <button
                                onClick={() => onPrint(p)}
                                className="p-1.5 bg-cyan-400 hover:bg-cyan-300 text-black border border-black shadow-[1px_1px_0px_#000] transition-transform hover:scale-105 cursor-pointer"
                                title="Print Payment Receipt"
                              >
                                <Printer className="w-3.5 h-3.5" />
                              </button>

                              {/* Delete (Red) */}
                              <button
                                onClick={() => onDeleteSingle(p)}
                                className="p-1.5 bg-rose-500 hover:bg-rose-600 text-white border border-black shadow-[1px_1px_0px_#000] transition-transform hover:scale-105 cursor-pointer"
                                title="Delete"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Bottom Actions & Pagination */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
            <div>
              {selectedIds.length > 0 && (
                <button
                  onClick={onDeleteBulk}
                  className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white font-display font-black text-xs uppercase tracking-wider border-2 border-black shadow-[3px_3px_0px_#000] flex items-center gap-1.5 transition-all cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" /> Delete ({selectedIds.length})
                </button>
              )}
            </div>

            {/* Pagination Controls */}
            <div className="flex items-center gap-3 ml-auto">
              <span className="text-xs font-bold text-black">
                Showing {totalFilteredCount === 0 ? 0 : (currentPage - 1) * pageSize + 1} to{" "}
                {Math.min(currentPage * pageSize, totalFilteredCount)} of {totalFilteredCount} entries
              </span>
              <div className="flex items-center gap-1">
                <button
                  disabled={currentPage <= 1}
                  onClick={() => setCurrentPage((p) => p - 1)}
                  className="px-2.5 py-1 bg-white border-2 border-black text-xs font-black shadow-[2px_2px_0px_#000] disabled:opacity-40 disabled:cursor-not-allowed hover:bg-amber-100 cursor-pointer"
                >
                  &lt;
                </button>
                <span className="px-3 py-1 bg-cyan-400 border-2 border-black text-xs font-black shadow-[2px_2px_0px_#000]">
                  {currentPage}
                </span>
                <button
                  disabled={currentPage >= totalPages}
                  onClick={() => setCurrentPage((p) => p + 1)}
                  className="px-2.5 py-1 bg-white border-2 border-black text-xs font-black shadow-[2px_2px_0px_#000] disabled:opacity-40 disabled:cursor-not-allowed hover:bg-amber-100 cursor-pointer"
                >
                  &gt;
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
