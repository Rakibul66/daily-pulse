"use client";

import React from "react";
import { 
  Plus, 
  Loader2, 
  Edit, 
  Printer, 
  Trash2, 
  ChevronLeft, 
  ChevronRight 
} from "lucide-react";
import { SalesCollection } from "@/types/sales";
import { PAYMENT_TYPES } from "./types";

interface SalesCollectionTableProps {
  collections: SalesCollection[];
  isLoading: boolean;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  dateFilter: string;
  setDateFilter: (d: string) => void;
  typeFilter: string;
  setTypeFilter: (t: string) => void;
  pageSize: number;
  setPageSize: (size: number) => void;
  currentPage: number;
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
  totalPages: number;
  totalFilteredCount: number;
  selectedIds: string[];
  onToggleSelectAll: () => void;
  onToggleSelectRow: (id: string) => void;
  onOpenAdd: () => void;
  onOpenEdit: (col: SalesCollection) => void;
  onDeleteSingle: (id: string, paymentNo: string) => void;
  onDeleteBulk: () => void;
}

export const SalesCollectionTable: React.FC<SalesCollectionTableProps> = ({
  collections,
  isLoading,
  searchQuery,
  setSearchQuery,
  dateFilter,
  setDateFilter,
  typeFilter,
  setTypeFilter,
  pageSize,
  setPageSize,
  currentPage,
  setCurrentPage,
  totalPages,
  totalFilteredCount,
  selectedIds,
  onToggleSelectAll,
  onToggleSelectRow,
  onOpenAdd,
  onOpenEdit,
  onDeleteSingle,
  onDeleteBulk
}) => {
  return (
    <div className="space-y-6">
      {/* Header Card */}
      <div className="bg-white border-2 sm:border-4 border-black p-5 sm:p-6 shadow-[6px_6px_0px_#000] flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h2 className="font-display font-black text-lg sm:text-xl uppercase tracking-wider text-black">
          DAILY COLLECTIONS
        </h2>

        <div className="flex items-center gap-2 flex-wrap">
          {/* Date Filter */}
          <input
            type="date"
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            className="h-10 px-3 bg-white border-2 border-black font-bold text-xs text-black shadow-[2px_2px_0px_#000] focus:outline-hidden cursor-pointer"
            title="Filter by date"
          />

          {/* Type Filter */}
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="h-10 px-3 bg-white border-2 border-black font-bold text-xs text-black shadow-[2px_2px_0px_#000] focus:outline-hidden cursor-pointer"
          >
            <option value="All">All</option>
            {PAYMENT_TYPES.map((pt) => (
              <option key={pt} value={pt}>
                {pt}
              </option>
            ))}
          </select>

          {/* ADD NEW Button */}
          <button
            onClick={onOpenAdd}
            className="h-10 px-5 bg-[#00c5bb] hover:bg-[#00a89f] text-white border-2 border-black font-black uppercase text-xs shadow-[3px_3px_0px_#000] hover:shadow-[1px_1px_0px_#000] hover:translate-x-[2px] hover:translate-y-[2px] transition-all flex items-center gap-1.5 cursor-pointer ml-1"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>ADD NEW</span>
          </button>
        </div>
      </div>

      {/* Table Container Card */}
      <div className="bg-white border-2 sm:border-4 border-black p-5 sm:p-6 shadow-[6px_6px_0px_#000] space-y-4">
        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
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
            </select>
            <span>entries</span>
          </div>

          {/* Search */}
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
              className="w-48 sm:w-64 px-3 py-1.5 bg-white border-2 border-black font-bold text-xs text-black shadow-[2px_2px_0px_#000] focus:outline-hidden focus:ring-2 focus:ring-black"
            />
          </div>
        </div>

        {/* Collections Table */}
        {isLoading ? (
          <div className="py-16 flex flex-col items-center justify-center gap-3">
            <Loader2 className="w-8 h-8 animate-spin text-black" />
            <span className="text-xs font-black uppercase tracking-wider text-black">
              Loading daily collections...
            </span>
          </div>
        ) : (
          <div className="border-2 sm:border-4 border-black overflow-x-auto shadow-[4px_4px_0px_#000]">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-900 text-white font-display font-black uppercase tracking-wider border-b-4 border-black">
                  <th className="p-3 w-10 text-center border-r-2 border-slate-700">
                    <input
                      type="checkbox"
                      className="w-4 h-4 accent-black cursor-pointer"
                      checked={selectedIds.length === collections.length && collections.length > 0}
                      onChange={onToggleSelectAll}
                    />
                  </th>
                  <th className="p-3 border-r-2 border-slate-700">Company</th>
                  <th className="p-3 w-28 border-r-2 border-slate-700">Date</th>
                  <th className="p-3 w-32 border-r-2 border-slate-700">Client</th>
                  <th className="p-3 w-32 border-r-2 border-slate-700">Collection Type</th>
                  <th className="p-3 w-32 border-r-2 border-slate-700">Payment No</th>
                  <th className="p-3 w-28 border-r-2 border-slate-700">Payment Type</th>
                  <th className="p-3 w-28 text-right border-r-2 border-slate-700">Amount</th>
                  <th className="p-3 border-r-2 border-slate-700">Remarks</th>
                  <th className="p-3 w-24 border-r-2 border-slate-700">Staff</th>
                  <th className="p-3 w-32 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y-2 divide-black/20 font-bold bg-white">
                {collections.length === 0 ? (
                  <tr>
                    <td colSpan={11} className="p-10 text-center text-xs font-black text-slate-500 uppercase tracking-widest">
                      No data available in table
                    </td>
                  </tr>
                ) : (
                  collections.map((col) => {
                    const isSelected = selectedIds.includes(col.id);
                    return (
                      <tr key={col.id} className="hover:bg-amber-50/80 transition-colors">
                        <td className="p-3 text-center border-r-2 border-black/10">
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => onToggleSelectRow(col.id)}
                            className="w-4 h-4 accent-black cursor-pointer"
                          />
                        </td>
                        <td className="p-3 border-r-2 border-black/10 text-black">
                          {col.companyName}
                        </td>
                        <td className="p-3 border-r-2 border-black/10 font-mono text-black whitespace-nowrap">
                          {col.date}
                        </td>
                        <td className="p-3 border-r-2 border-black/10 text-black font-black">
                          {col.clientName}
                        </td>
                        <td className="p-3 border-r-2 border-black/10 text-black capitalize">
                          {col.collectionType}
                        </td>
                        <td className="p-3 border-r-2 border-black/10 font-mono font-bold text-black">
                          {col.paymentNo}
                        </td>
                        <td className="p-3 border-r-2 border-black/10 text-black">
                          {col.paymentType}
                        </td>
                        <td className="p-3 text-right border-r-2 border-black/10 font-mono font-black text-black">
                          {col.amount.toFixed(2)}
                        </td>
                        <td className="p-3 border-r-2 border-black/10 text-slate-600 text-xs">
                          {col.remarks || "—"}
                        </td>
                        <td className="p-3 border-r-2 border-black/10 text-black">
                          {col.staff}
                        </td>
                        <td className="p-3 text-center">
                          <div className="flex items-center justify-center gap-1.5">
                            {/* Yellow Edit */}
                            <button
                              onClick={() => onOpenEdit(col)}
                              className="p-1.5 bg-[#FFC107] hover:bg-[#E0A800] text-black border border-black shadow-[1px_1px_0px_#000] cursor-pointer"
                              title="Edit Collection"
                            >
                              <Edit className="w-3.5 h-3.5 stroke-[2.5]" />
                            </button>
                            {/* Cyan Print */}
                            <button
                              onClick={() => window.open(`/print/collection?id=${col.id}`, '_blank')}
                              className="p-1.5 bg-[#00c5bb] hover:bg-[#00a89f] text-white border border-black shadow-[1px_1px_0px_#000] cursor-pointer"
                              title="Print Money Receipt (Opens in New Tab)"
                            >
                              <Printer className="w-3.5 h-3.5 stroke-[2.5]" />
                            </button>
                            {/* Red Delete */}
                            <button
                              onClick={() => onDeleteSingle(col.id, col.paymentNo)}
                              className="p-1.5 bg-[#DC3545] hover:bg-[#C82333] text-white border border-black shadow-[1px_1px_0px_#000] cursor-pointer"
                              title="Delete Collection"
                            >
                              <Trash2 className="w-3.5 h-3.5 stroke-[2.5]" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
              {/* Bulk Delete Footer Row */}
              {selectedIds.length > 0 && (
                <tfoot>
                  <tr className="bg-slate-50 border-t-2 border-black">
                    <td className="p-3 text-center border-r-2 border-black/10">
                      <input
                        type="checkbox"
                        checked={true}
                        onChange={() => onToggleSelectAll()}
                        className="w-4 h-4 accent-black cursor-pointer"
                      />
                    </td>
                    <td colSpan={9} className="p-3 text-xs font-bold text-slate-700">
                      {selectedIds.length} item(s) selected
                    </td>
                    <td className="p-3 text-center">
                      <button
                        onClick={onDeleteBulk}
                        className="px-3 py-1 bg-[#DC3545] hover:bg-[#C82333] text-white text-xs font-bold rounded shadow-sm cursor-pointer"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                </tfoot>
              )}
            </table>
          </div>
        )}

        {/* Pagination Controls */}
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
            >
              <ChevronRight className="w-4 h-4 stroke-[3]" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
