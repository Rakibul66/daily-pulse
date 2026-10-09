"use client";

import React from 'react';
import { 
  RotateCcw, 
  Plus, 
  Edit, 
  Printer, 
  Trash2 
} from 'lucide-react';
import { PurchaseReturn } from '@/types/purchase';
import { formatDateDDMMYYYY } from '@/lib/purchaseStorage';

interface PurchaseReturnTableProps {
  remarkFilter: string;
  setRemarkFilter: (remark: string) => void;
  onOpenAddForm: () => void;
  pageSize: number;
  setPageSize: (size: number) => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  currentPage: number;
  setCurrentPage: (updater: number | ((prev: number) => number)) => void;
  totalPages: number;
  filteredReturns: PurchaseReturn[];
  paginatedReturns: PurchaseReturn[];
  selectedIds: string[];
  onSelectAll: (checked: boolean) => void;
  onSelectRow: (id: string, checked: boolean) => void;
  onOpenEditForm: (item: PurchaseReturn) => void;
  onPrintReturn: (item: PurchaseReturn) => void;
  onOpenDeleteModal: (id: string, name: string) => void;
  onOpenBulkDeleteModal: () => void;
  isLoading: boolean;
}

export const PurchaseReturnTable: React.FC<PurchaseReturnTableProps> = ({
  remarkFilter,
  setRemarkFilter,
  onOpenAddForm,
  pageSize,
  setPageSize,
  searchQuery,
  setSearchQuery,
  currentPage,
  setCurrentPage,
  totalPages,
  filteredReturns,
  paginatedReturns,
  selectedIds,
  onSelectAll,
  onSelectRow,
  onOpenEditForm,
  onPrintReturn,
  onOpenDeleteModal,
  onOpenBulkDeleteModal,
  isLoading,
}) => {
  return (
    <div className="w-full pb-20">
      <div className="bg-white border-2 sm:border-4 border-black shadow-[6px_6px_0px_#000]">
        {/* Header Bar matching screenshot */}
        <div className="flex flex-wrap items-center justify-between gap-3 p-4 sm:p-5 border-b-2 sm:border-b-4 border-black bg-white">
          <div className="flex items-center gap-2.5">
            <RotateCcw className="w-6 h-6 text-black" />
            <h2 className="text-black font-display font-black text-base sm:text-lg uppercase tracking-tight">
              PURCHASE RETURN
            </h2>
          </div>
          <div className="flex items-center gap-3">
            {/* Remarks / Reason Filter */}
            <select
              value={remarkFilter}
              onChange={(e) => setRemarkFilter(e.target.value)}
              className="bg-white border-2 border-black px-3 py-2 text-xs font-display font-black uppercase text-black shadow-[2px_2px_0px_#000] outline-none cursor-pointer"
            >
              <option value="All">All</option>
              <option value="Date Over">Date Over</option>
              <option value="Damaged packaging">Damaged packaging</option>
              <option value="Expired batch">Expired batch</option>
              <option value="Wrong barcode">Wrong barcode</option>
              <option value="Defective item">Defective item</option>
            </select>

            {/* ADD NEW Button */}
            <button
              onClick={onOpenAddForm}
              className="px-4 sm:px-5 py-2 bg-cyan-400 hover:bg-cyan-300 text-black font-display font-black text-xs uppercase tracking-wider border-2 border-black shadow-[3px_3px_0px_#000] flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4 stroke-[3]" /> ADD NEW
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
                  placeholder="Search return..."
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
                          paginatedReturns.length > 0 &&
                          paginatedReturns.every((r) => selectedIds.includes(r.id))
                        }
                        onChange={(e) => onSelectAll(e.target.checked)}
                        className="w-4 h-4 accent-amber-400 cursor-pointer"
                      />
                    </th>
                    <th className="px-3 sm:px-4 py-3.5 border-r-2 border-black/40">Company</th>
                    <th className="px-3 sm:px-4 py-3.5 border-r-2 border-black/40">Vendor</th>
                    <th className="px-3 sm:px-4 py-3.5 border-r-2 border-black/40">Store</th>
                    <th className="px-3 sm:px-4 py-3.5 border-r-2 border-black/40">Return Date</th>
                    <th className="px-3 sm:px-4 py-3.5 border-r-2 border-black/40 text-right">Amount</th>
                    <th className="px-3 sm:px-4 py-3.5 border-r-2 border-black/40">Staff</th>
                    <th className="px-3 sm:px-4 py-3.5 border-r-2 border-black/40">Remarks</th>
                    <th className="px-3 sm:px-4 py-3.5 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y-2 divide-black bg-white">
                  {isLoading ? (
                    <tr>
                      <td colSpan={9} className="px-4 py-12 text-center text-xs font-black text-slate-500 uppercase">
                        Loading purchase returns...
                      </td>
                    </tr>
                  ) : paginatedReturns.length === 0 ? (
                    <tr>
                      <td colSpan={9} className="px-4 py-12 text-center text-xs font-black text-slate-500 uppercase bg-amber-50/50">
                        No purchase return entries found
                      </td>
                    </tr>
                  ) : (
                    paginatedReturns.map((r) => {
                      const isChecked = selectedIds.includes(r.id);
                      return (
                        <tr
                          key={r.id}
                          className={`hover:bg-amber-50/80 transition-colors ${
                            isChecked ? "bg-amber-100/50" : ""
                          }`}
                        >
                          {/* Checkbox */}
                          <td className="px-3 sm:px-4 py-3 text-center border-r-2 border-black">
                            <input
                              type="checkbox"
                              checked={isChecked}
                              onChange={(e) => onSelectRow(r.id, e.target.checked)}
                              className="w-4 h-4 accent-amber-400 cursor-pointer"
                            />
                          </td>

                          {/* Company */}
                          <td className="px-3 sm:px-4 py-3 font-black text-black border-r-2 border-black whitespace-nowrap">
                            {r.company}
                          </td>

                          {/* Vendor */}
                          <td className="px-3 sm:px-4 py-3 font-bold text-slate-900 border-r-2 border-black">
                            {r.vendor}
                          </td>

                          {/* Store */}
                          <td className="px-3 sm:px-4 py-3 font-bold text-slate-700 border-r-2 border-black whitespace-nowrap">
                            {r.store}
                          </td>

                          {/* Return Date */}
                          <td className="px-3 sm:px-4 py-3 font-bold text-slate-800 border-r-2 border-black whitespace-nowrap">
                            {r.date || formatDateDDMMYYYY(r.returnDate)}
                          </td>

                          {/* Amount */}
                          <td className="px-3 sm:px-4 py-3 font-mono font-black text-indigo-700 border-r-2 border-black text-right whitespace-nowrap">
                            {Number(r.amount || 0).toLocaleString("en-US", {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            })}
                          </td>

                          {/* Staff */}
                          <td className="px-3 sm:px-4 py-3 font-bold text-slate-800 border-r-2 border-black whitespace-nowrap">
                            {r.staff || "Arnob Sur"}
                          </td>

                          {/* Remarks */}
                          <td className="px-3 sm:px-4 py-3 border-r-2 border-black">
                            <span className="px-2 py-0.5 bg-rose-100 text-rose-800 border border-black text-[10px] font-black uppercase">
                              {r.remarks || "Date Over"}
                            </span>
                          </td>

                          {/* Actions: Edit, Print, Delete */}
                          <td className="px-3 sm:px-4 py-2.5 text-center whitespace-nowrap">
                            <div className="flex items-center justify-center gap-1.5">
                              {/* Edit Button (Yellow) */}
                              <button
                                onClick={() => onOpenEditForm(r)}
                                className="p-1.5 bg-amber-400 hover:bg-amber-300 text-black border border-black shadow-[1px_1px_0px_#000] transition-transform hover:scale-105 cursor-pointer"
                                title="Edit Return"
                              >
                                <Edit className="w-3.5 h-3.5" />
                              </button>

                              {/* Print Return Memo (Cyan) */}
                              <button
                                onClick={() => onPrintReturn(r)}
                                className="p-1.5 bg-cyan-400 hover:bg-cyan-300 text-black border border-black shadow-[1px_1px_0px_#000] transition-transform hover:scale-105 cursor-pointer"
                                title="Print Return Challan"
                              >
                                <Printer className="w-3.5 h-3.5" />
                              </button>

                              {/* Delete (Red) */}
                              <button
                                onClick={() => onOpenDeleteModal(r.id, `${r.vendor} return (৳${r.amount})`)}
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
            {/* Bulk Delete Button */}
            <div>
              {selectedIds.length > 0 && (
                <button
                  onClick={onOpenBulkDeleteModal}
                  className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white font-display font-black text-xs uppercase tracking-wider border-2 border-black shadow-[3px_3px_0px_#000] flex items-center gap-1.5 transition-all cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" /> Delete ({selectedIds.length})
                </button>
              )}
            </div>

            {/* Pagination Controls */}
            <div className="flex items-center gap-3 ml-auto">
              <span className="text-xs font-bold text-black">
                Showing {filteredReturns.length === 0 ? 0 : (currentPage - 1) * pageSize + 1} to{" "}
                {Math.min(currentPage * pageSize, filteredReturns.length)} of {filteredReturns.length} entries
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
