"use client";

import React from "react";
import { Download, Printer, ChevronLeft, ChevronRight } from "lucide-react";
import { VendorStatementEntry } from "@/types/purchase";

interface VendorStatementTotals {
  totalPurchase: number;
  totalPayment: number;
  totalReturns: number;
  closingBalance: number;
}

interface VendorStatementTableProps {
  entries: VendorStatementEntry[];
  paginatedEntries: VendorStatementEntry[];
  hasSearched: boolean;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  pageSize: number;
  setPageSize: (size: number) => void;
  currentPage: number;
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
  totalPages: number;
  totalFilteredCount: number;
  previousBalance: number;
  totals: VendorStatementTotals;
  onExportCSV: () => void;
  onPrint: () => void;
}

export const VendorStatementTable: React.FC<VendorStatementTableProps> = ({
  paginatedEntries,
  hasSearched,
  searchQuery,
  setSearchQuery,
  pageSize,
  setPageSize,
  currentPage,
  setCurrentPage,
  totalPages,
  totalFilteredCount,
  previousBalance,
  totals,
  onExportCSV,
  onPrint
}) => {
  return (
    <div className="bg-white border-2 sm:border-4 border-black p-5 sm:p-6 shadow-[6px_6px_0px_#000] space-y-4">
      {/* Table Title */}
      <div className="border-b-4 border-black pb-3">
        <h2 className="font-display font-black text-lg sm:text-xl uppercase tracking-wider text-black">
          VENDOR STATEMENT
        </h2>
      </div>

      {/* Table Top Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-1">
        {/* Show Entries */}
        <div className="flex items-center gap-2 text-xs font-black uppercase text-black">
          <span>Show</span>
          <select
            value={pageSize}
            onChange={(e) => {
              setPageSize(Number(e.target.value));
              setCurrentPage(1);
            }}
            className="px-2 py-1.5 bg-white border-2 border-black font-bold text-xs text-black shadow-[2px_2px_0px_#000] focus:outline-hidden cursor-pointer"
          >
            <option value={10}>10</option>
            <option value={25}>25</option>
            <option value={50}>50</option>
            <option value={100}>100</option>
          </select>
          <span>entries</span>
        </div>

        {/* Search & Actions */}
        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex items-center gap-2">
            <span className="text-xs font-black uppercase text-black">Search:</span>
            <input
              type="text"
              placeholder=""
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              className="w-36 sm:w-48 px-2.5 py-1.5 bg-white border-2 border-black font-bold text-xs text-black shadow-[2px_2px_0px_#000] focus:outline-hidden focus:ring-2 focus:ring-black"
            />
          </div>

          <button
            onClick={onExportCSV}
            className="px-3 py-1.5 bg-white hover:bg-emerald-300 text-black border-2 border-black font-black uppercase tracking-wider text-xs shadow-[2px_2px_0px_#000] hover:shadow-[1px_1px_0px_#000] hover:translate-x-[1px] hover:translate-y-[1px] transition-all flex items-center gap-1.5 cursor-pointer"
            title="Export to Excel / CSV"
          >
            <Download className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>Excel</span>
          </button>

          <button
            onClick={onPrint}
            className="px-3 py-1.5 bg-white hover:bg-amber-300 text-black border-2 border-black font-black uppercase tracking-wider text-xs shadow-[2px_2px_0px_#000] hover:shadow-[1px_1px_0px_#000] hover:translate-x-[1px] hover:translate-y-[1px] transition-all flex items-center gap-1.5 cursor-pointer"
            title="Print formal statement voucher"
          >
            <Printer className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>Print</span>
          </button>
        </div>
      </div>

      {/* Previous Balance Indicator Box */}
      <div className="flex justify-end">
        <div className="inline-flex items-center gap-3 px-4 py-2 bg-slate-100 border-2 border-black shadow-[3px_3px_0px_#000]">
          <span className="font-display font-black text-xs uppercase tracking-wider text-black">
            Previous Balance:
          </span>
          <span
            className={`font-mono font-black text-sm ${
              previousBalance > 0
                ? "text-red-700"
                : previousBalance < 0
                ? "text-emerald-700"
                : "text-black"
            }`}
          >
            ৳{previousBalance.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </span>
        </div>
      </div>

      {/* Ledger Statement Table */}
      <div className="border-2 sm:border-4 border-black overflow-x-auto shadow-[4px_4px_0px_#000]">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-slate-900 text-white font-display font-black uppercase tracking-wider border-b-4 border-black">
              <th className="p-3 w-12 text-center border-r-2 border-slate-700">Sl#</th>
              <th className="p-3 w-28 border-r-2 border-slate-700">Date</th>
              <th className="p-3 border-r-2 border-slate-700">Particular</th>
              <th className="p-3 w-32 text-right border-r-2 border-slate-700">Purchase</th>
              <th className="p-3 w-32 text-right border-r-2 border-slate-700">Payment</th>
              <th className="p-3 w-32 text-right border-r-2 border-slate-700">Returns</th>
              <th className="p-3 w-36 text-right">Balance</th>
            </tr>
          </thead>
          <tbody className="divide-y-2 divide-black/20 font-bold bg-white">
            {!hasSearched ? (
              <tr>
                <td colSpan={7} className="p-10 text-center text-sm font-black text-slate-500 uppercase tracking-widest">
                  Please select a vendor and click Search to generate statement
                </td>
              </tr>
            ) : paginatedEntries.length === 0 ? (
              <tr>
                <td colSpan={7} className="p-8 text-center text-xs font-black text-slate-500 uppercase">
                  No data available in table
                </td>
              </tr>
            ) : (
              paginatedEntries.map((row, idx) => {
                const sl = (currentPage - 1) * pageSize + idx + 1;
                return (
                  <tr
                    key={row.id}
                    className="hover:bg-amber-50/80 transition-colors border-b border-black/10"
                  >
                    <td className="p-3 text-center border-r-2 border-black/10 font-mono text-black">
                      {sl}
                    </td>
                    <td className="p-3 border-r-2 border-black/10 whitespace-nowrap font-mono text-black">
                      {row.date}
                    </td>
                    <td className="p-3 border-r-2 border-black/10 text-black">
                      <div className="font-black">{row.particular}</div>
                      <div className="text-[10px] text-slate-500 font-mono uppercase">
                        Ref: {row.refNo} &bull; Type: {row.type}
                      </div>
                    </td>
                    <td className="p-3 text-right border-r-2 border-black/10 font-mono text-black">
                      {row.purchase > 0 ? (
                        <span className="font-black text-black">
                          {row.purchase.toLocaleString("en-US", {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2
                          })}
                        </span>
                      ) : (
                        <span className="text-slate-400">0.00</span>
                      )}
                    </td>
                    <td className="p-3 text-right border-r-2 border-black/10 font-mono text-black">
                      {row.payment > 0 ? (
                        <span className="font-black text-emerald-700">
                          {row.payment.toLocaleString("en-US", {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2
                          })}
                        </span>
                      ) : (
                        <span className="text-slate-400">0.00</span>
                      )}
                    </td>
                    <td className="p-3 text-right border-r-2 border-black/10 font-mono text-black">
                      {row.returns > 0 ? (
                        <span className="font-black text-amber-700">
                          {row.returns.toLocaleString("en-US", {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2
                          })}
                        </span>
                      ) : (
                        <span className="text-slate-400">0.00</span>
                      )}
                    </td>
                    <td
                      className={`p-3 text-right font-mono font-black ${
                        row.balance > 0
                          ? "text-red-700"
                          : row.balance < 0
                          ? "text-emerald-700"
                          : "text-black"
                      }`}
                    >
                      {row.balance.toLocaleString("en-US", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2
                      })}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
          {/* Totals Summary Row */}
          <tfoot>
            <tr className="bg-[#107c41] text-white font-display font-black text-xs uppercase tracking-wider border-t-4 border-black">
              <td colSpan={3} className="p-3 text-center border-r-2 border-emerald-800">
                Total
              </td>
              <td className="p-3 text-right font-mono border-r-2 border-emerald-800">
                {totals.totalPurchase.toLocaleString("en-US", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2
                })}
              </td>
              <td className="p-3 text-right font-mono border-r-2 border-emerald-800">
                {totals.totalPayment.toLocaleString("en-US", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2
                })}
              </td>
              <td className="p-3 text-right font-mono border-r-2 border-emerald-800">
                {totals.totalReturns.toLocaleString("en-US", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2
                })}
              </td>
              <td className="p-3 text-right font-mono font-black text-amber-300">
                {totals.closingBalance.toLocaleString("en-US", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2
                })}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>

      {/* Table Bottom Navigation */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
        <div className="text-xs font-bold text-slate-700">
          Showing {totalFilteredCount === 0 ? 0 : (currentPage - 1) * pageSize + 1} to{" "}
          {Math.min(currentPage * pageSize, totalFilteredCount)} of {totalFilteredCount} entries
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
            disabled={currentPage === 1}
            className="p-1.5 bg-white border-2 border-black font-black shadow-[2px_2px_0px_#000] hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
            title="Previous Page"
          >
            <ChevronLeft className="w-4 h-4 stroke-[3]" />
          </button>
          <div className="px-3 py-1 font-mono font-black text-xs border-2 border-black bg-amber-300 shadow-[2px_2px_0px_#000]">
            Page {currentPage} of {totalPages}
          </div>
          <button
            onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
            disabled={currentPage === totalPages || totalPages === 0}
            className="p-1.5 bg-white border-2 border-black font-black shadow-[2px_2px_0px_#000] hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
            title="Next Page"
          >
            <ChevronRight className="w-4 h-4 stroke-[3]" />
          </button>
        </div>
      </div>
    </div>
  );
};
