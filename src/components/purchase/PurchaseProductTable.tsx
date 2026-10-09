"use client";

import React from 'react';
import { 
  ShoppingBag, 
  Plus, 
  Edit, 
  Printer, 
  Barcode as BarcodeIcon, 
  Trash2 
} from 'lucide-react';
import { ProductLift } from '@/types/purchase';
import { formatDateDDMMYYYY } from '@/lib/purchaseStorage';

interface PurchaseProductTableProps {
  typeFilter: string;
  setTypeFilter: (val: string) => void;
  searchQuery: string;
  setSearchQuery: (val: string) => void;
  pageSize: number;
  setPageSize: (val: number) => void;
  currentPage: number;
  setCurrentPage: (updater: number | ((prev: number) => number)) => void;
  selectedIds: string[];
  onSelectAll: (checked: boolean) => void;
  onSelectRow: (id: string, checked: boolean) => void;
  onOpenAddForm: () => void;
  onOpenEditForm: (lift: ProductLift) => void;
  onOpenDeleteModal: (id: string, name: string) => void;
  onOpenBulkDeleteModal: () => void;
  onOpenPrintVoucher: (lift: ProductLift) => void;
  onOpenBarcodeModal: (lift: ProductLift) => void;
  filteredLifts: ProductLift[];
  paginatedLifts: ProductLift[];
  totalPages: number;
  isLoading: boolean;
}

export const PurchaseProductTable: React.FC<PurchaseProductTableProps> = ({
  typeFilter,
  setTypeFilter,
  searchQuery,
  setSearchQuery,
  pageSize,
  setPageSize,
  currentPage,
  setCurrentPage,
  selectedIds,
  onSelectAll,
  onSelectRow,
  onOpenAddForm,
  onOpenEditForm,
  onOpenDeleteModal,
  onOpenBulkDeleteModal,
  onOpenPrintVoucher,
  onOpenBarcodeModal,
  filteredLifts,
  paginatedLifts,
  totalPages,
  isLoading,
}) => {
  return (
    <div className="w-full pb-20">
      <div className="bg-white border-2 sm:border-4 border-black shadow-[6px_6px_0px_#000]">
        
        {/* Header Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 p-4 sm:p-5 border-b-2 sm:border-b-4 border-black bg-white">
          <div className="flex items-center gap-2.5">
            <ShoppingBag className="w-6 h-6 text-black" />
            <h2 className="text-black font-display font-black text-base sm:lg uppercase tracking-tight">
              PRODUCT LIFTING
            </h2>
          </div>
          <div className="flex items-center gap-3">
            {/* Status / Type Filter */}
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="bg-white border-2 border-black px-3 py-2 text-xs font-display font-black uppercase text-black shadow-[2px_2px_0px_#000] outline-none cursor-pointer"
            >
              <option value="All">All</option>
              <option value="credit">Credit</option>
              <option value="cash">Cash</option>
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

        {/* Table Controls (Show entries & Search) */}
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
                  placeholder="Search lifting..."
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
                          paginatedLifts.length > 0 &&
                          paginatedLifts.every((l) => selectedIds.includes(l.id))
                        }
                        onChange={(e) => onSelectAll(e.target.checked)}
                        className="w-4 h-4 accent-amber-400 cursor-pointer"
                      />
                    </th>
                    <th className="px-3 sm:px-4 py-3.5 border-r-2 border-black/40">Type</th>
                    <th className="px-3 sm:px-4 py-3.5 border-r-2 border-black/40">Purchase No</th>
                    <th className="px-3 sm:px-4 py-3.5 border-r-2 border-black/40">Purchase Date</th>
                    <th className="px-3 sm:px-4 py-3.5 border-r-2 border-black/40">Voucher No</th>
                    <th className="px-3 sm:px-4 py-3.5 border-r-2 border-black/40">Vendor</th>
                    <th className="px-3 sm:px-4 py-3.5 border-r-2 border-black/40">Store</th>
                    <th className="px-3 sm:px-4 py-3.5 border-r-2 border-black/40">Purchased By</th>
                    <th className="px-3 sm:px-4 py-3.5 border-r-2 border-black/40 text-right">Cost Amount</th>
                    <th className="px-3 sm:px-4 py-3.5 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y-2 divide-black bg-white">
                  {isLoading ? (
                    <tr>
                      <td colSpan={10} className="px-4 py-12 text-center text-xs font-black text-slate-500 uppercase">
                        Loading product liftings...
                      </td>
                    </tr>
                  ) : paginatedLifts.length === 0 ? (
                    <tr>
                      <td colSpan={10} className="px-4 py-12 text-center text-xs font-black text-slate-500 uppercase bg-amber-50/50">
                        No product lifting entries found
                      </td>
                    </tr>
                  ) : (
                    paginatedLifts.map((l) => {
                      const isChecked = selectedIds.includes(l.id);
                      return (
                        <tr
                          key={l.id}
                          className={`hover:bg-amber-50/80 transition-colors ${
                            isChecked ? "bg-amber-100/50" : ""
                          }`}
                        >
                          {/* Checkbox */}
                          <td className="px-3 sm:px-4 py-3 text-center border-r-2 border-black">
                            <input
                              type="checkbox"
                              checked={isChecked}
                              onChange={(e) => onSelectRow(l.id, e.target.checked)}
                              className="w-4 h-4 accent-amber-400 cursor-pointer"
                            />
                          </td>

                          {/* Type */}
                          <td className="px-3 sm:px-4 py-3 border-r-2 border-black">
                            <span
                              className={`px-2 py-0.5 text-[10px] font-black uppercase border border-black shadow-[1px_1px_0px_#000] ${
                                l.type === "cash"
                                  ? "bg-emerald-300 text-black"
                                  : "bg-amber-300 text-black"
                              }`}
                            >
                              {l.type || "credit"}
                            </span>
                          </td>

                          {/* Purchase No */}
                          <td className="px-3 sm:px-4 py-3 font-mono font-black text-black border-r-2 border-black whitespace-nowrap">
                            {l.purchaseNo}
                          </td>

                          {/* Purchase Date */}
                          <td className="px-3 sm:px-4 py-3 font-bold text-slate-700 border-r-2 border-black whitespace-nowrap">
                            {l.date || formatDateDDMMYYYY(l.purchaseDate)}
                          </td>

                          {/* Voucher No */}
                          <td className="px-3 sm:px-4 py-3 font-mono font-bold text-slate-800 border-r-2 border-black whitespace-nowrap">
                            {l.voucherNo || ""}
                          </td>

                          {/* Vendor */}
                          <td className="px-3 sm:px-4 py-3 font-black text-black border-r-2 border-black">
                            {l.vendor}
                          </td>

                          {/* Store */}
                          <td className="px-3 sm:px-4 py-3 font-bold text-slate-700 border-r-2 border-black whitespace-nowrap">
                            {l.store}
                          </td>

                          {/* Purchased By */}
                          <td className="px-3 sm:px-4 py-3 font-bold text-slate-800 border-r-2 border-black whitespace-nowrap">
                            {l.purchasedBy || "Admin"}
                          </td>

                          {/* Cost Amount */}
                          <td className="px-3 sm:px-4 py-3 font-mono font-black text-indigo-700 border-r-2 border-black text-right whitespace-nowrap">
                            {Number(l.costAmount || 0).toLocaleString("en-US", {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            })}
                          </td>

                          {/* Actions: Edit, Print, Barcode, Delete */}
                          <td className="px-3 sm:px-4 py-2.5 text-center whitespace-nowrap">
                            <div className="flex items-center justify-center gap-1.5">
                              {/* Edit Button (Yellow) */}
                              <button
                                onClick={() => onOpenEditForm(l)}
                                className="p-1.5 bg-amber-400 hover:bg-amber-300 text-black border border-black shadow-[1px_1px_0px_#000] transition-transform hover:scale-105 cursor-pointer"
                                title="Edit Product Lifting"
                              >
                                <Edit className="w-3.5 h-3.5" />
                              </button>

                              {/* Print Challan / Voucher (Cyan) */}
                              <button
                                onClick={() => onOpenPrintVoucher(l)}
                                className="p-1.5 bg-cyan-400 hover:bg-cyan-300 text-black border border-black shadow-[1px_1px_0px_#000] transition-transform hover:scale-105 cursor-pointer"
                                title="Print Purchase Voucher / Challan"
                              >
                                <Printer className="w-3.5 h-3.5" />
                              </button>

                              {/* Barcode Labels (Blue) */}
                              <button
                                onClick={() => onOpenBarcodeModal(l)}
                                className="p-1.5 bg-sky-400 hover:bg-sky-300 text-black border border-black shadow-[1px_1px_0px_#000] transition-transform hover:scale-105 cursor-pointer"
                                title="Barcode Labels for this Lifting"
                              >
                                <BarcodeIcon className="w-3.5 h-3.5" />
                              </button>

                              {/* Delete (Red) */}
                              <button
                                onClick={() => onOpenDeleteModal(l.id, l.purchaseNo)}
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
                Showing {filteredLifts.length === 0 ? 0 : (currentPage - 1) * pageSize + 1} to{" "}
                {Math.min(currentPage * pageSize, filteredLifts.length)} of {filteredLifts.length} entries
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
