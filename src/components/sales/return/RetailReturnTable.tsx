"use client";

import React from 'react';
import { 
  RotateCcw,
  Plus, 
  Loader2, 
  Edit, 
  Printer, 
  Trash2 
} from 'lucide-react';
import { SalesReturn } from '@/types/sales';

interface RetailReturnTableProps {
  storeFilter: string;
  setStoreFilter: (store: string) => void;
  storeOptions: string[];
  onOpenAddForm: () => void;
  pageSize: number;
  setPageSize: (size: number) => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  currentPage: number;
  setCurrentPage: (updater: number | ((prev: number) => number)) => void;
  totalPages: number;
  filteredReturns: SalesReturn[];
  paginatedReturns: SalesReturn[];
  selectedIds: string[];
  onToggleSelectAll: () => void;
  onToggleSelectOne: (id: string) => void;
  onOpenEditForm: (item: SalesReturn) => void;
  onPrintReturn: (id: string) => void;
  onOpenDeleteModal: (id: string, name: string) => void;
  onOpenBulkDeleteModal: () => void;
  isLoading: boolean;
}

export const RetailReturnTable: React.FC<RetailReturnTableProps> = ({
  storeFilter,
  setStoreFilter,
  storeOptions,
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
  onToggleSelectAll,
  onToggleSelectOne,
  onOpenEditForm,
  onPrintReturn,
  onOpenDeleteModal,
  onOpenBulkDeleteModal,
  isLoading,
}) => {
  return (
    <div className="w-full pb-20 space-y-6">
      {/* Top Header Card matching Website Pattern */}
      <div className="bg-white border-2 sm:border-4 border-black p-5 sm:p-6 shadow-[6px_6px_0px_#000] flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-amber-300 border-2 border-black shadow-[2px_2px_0px_#000]">
            <RotateCcw className="w-6 h-6 text-black stroke-[2.5]" />
          </div>
          <div>
            <h2 className="font-display font-black text-lg sm:text-xl uppercase tracking-wider text-black">
              RETAIL SALES RETURN
            </h2>
            <p className="text-xs font-bold text-slate-600 uppercase tracking-wider">
              Manage retail returns, refund vouchers & store restocks
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          {/* Store / Outlet Filter Dropdown */}
          <select
            value={storeFilter}
            onChange={(e) => {
              setStoreFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="h-10 px-3 bg-white border-2 border-black font-bold text-xs text-black shadow-[2px_2px_0px_#000] focus:outline-hidden cursor-pointer"
            title="Filter by Store"
          >
            <option value="All">All Stores</option>
            {storeOptions.map((store) => (
              <option key={store} value={store}>
                {store}
              </option>
            ))}
          </select>

          {/* ADD NEW Button */}
          <button
            onClick={onOpenAddForm}
            className="h-10 px-5 bg-cyan-400 hover:bg-cyan-300 text-black border-2 border-black font-display font-black uppercase text-xs shadow-[3px_3px_0px_#000] hover:shadow-[1px_1px_0px_#000] hover:translate-x-[2px] hover:translate-y-[2px] transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>ADD NEW</span>
          </button>
        </div>
      </div>

      {/* Table Container Card */}
      <div className="bg-white border-2 sm:border-4 border-black p-5 sm:p-6 shadow-[6px_6px_0px_#000] space-y-4">
        {/* Table Controls Row: Show entries & Search */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
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

        {/* Table */}
        {isLoading ? (
          <div className="py-16 flex flex-col items-center justify-center gap-3">
            <Loader2 className="w-8 h-8 animate-spin text-black" />
            <span className="text-xs font-black uppercase tracking-wider text-black">
              Loading sales return records...
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
                      checked={
                        paginatedReturns.length > 0 &&
                        selectedIds.length === paginatedReturns.length
                      }
                      onChange={onToggleSelectAll}
                      className="w-4 h-4 accent-black cursor-pointer"
                    />
                  </th>
                  <th className="p-3 w-32 border-r-2 border-slate-700">Return No</th>
                  <th className="p-3 border-r-2 border-slate-700">Customer Name</th>
                  <th className="p-3 w-32 border-r-2 border-slate-700">Customer Phone</th>
                  <th className="p-3 w-28 border-r-2 border-slate-700">Date</th>
                  <th className="p-3 w-32 border-r-2 border-slate-700">Store</th>
                  <th className="p-3 w-28 text-right border-r-2 border-slate-700">Amount</th>
                  <th className="p-3 w-24 border-r-2 border-slate-700">Staff</th>
                  <th className="p-3 border-r-2 border-slate-700">Remarks</th>
                  <th className="p-3 w-32 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y-2 divide-black/20 font-bold bg-white">
                {paginatedReturns.length === 0 ? (
                  <tr>
                    <td colSpan={10} className="p-10 text-center text-xs font-black text-slate-500 uppercase tracking-widest">
                      No data available in table
                    </td>
                  </tr>
                ) : (
                  paginatedReturns.map((item) => {
                    const isChecked = selectedIds.includes(item.id);
                    return (
                      <tr
                        key={item.id}
                        className={`hover:bg-amber-50/80 transition-colors ${
                          isChecked ? 'bg-amber-100/50' : ''
                        }`}
                      >
                        {/* Checkbox */}
                        <td className="p-3 text-center border-r-2 border-black/10">
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => onToggleSelectOne(item.id)}
                            className="w-4 h-4 accent-black cursor-pointer"
                          />
                        </td>

                        {/* Return No */}
                        <td className="p-3 border-r-2 border-black/10 font-mono font-bold text-black whitespace-nowrap">
                          {item.returnNo || '—'}
                        </td>

                        {/* Customer Name */}
                        <td className="p-3 border-r-2 border-black/10 text-black">
                          {item.clientName || 'Walk-in Customer'}
                        </td>

                        {/* Customer Phone */}
                        <td className="p-3 border-r-2 border-black/10 font-mono text-slate-700 text-xs">
                          {item.customerPhone || '—'}
                        </td>

                        {/* Date */}
                        <td className="p-3 border-r-2 border-black/10 font-mono text-slate-800 text-xs whitespace-nowrap">
                          {item.returnDate}
                        </td>

                        {/* Store */}
                        <td className="p-3 border-r-2 border-black/10 text-black">
                          {item.storeName || '—'}
                        </td>

                        {/* Amount */}
                        <td className="p-3 border-r-2 border-black/10 font-mono font-black text-right text-black">
                          ৳{Number(item.amount || 0).toFixed(2)}
                        </td>

                        {/* Staff */}
                        <td className="p-3 border-r-2 border-black/10 text-black">
                          {item.staff || '—'}
                        </td>

                        {/* Remarks */}
                        <td className="p-3 border-r-2 border-black/10 text-slate-700 text-xs max-w-xs truncate">
                          {item.remarks || item.returnReason || '—'}
                        </td>

                        {/* Actions */}
                        <td className="p-3">
                          <div className="flex items-center justify-center gap-1.5">
                            {/* Yellow Edit button */}
                            <button
                              type="button"
                              onClick={() => onOpenEditForm(item)}
                              className="p-1.5 bg-amber-400 hover:bg-amber-500 border-2 border-black shadow-[2px_2px_0px_#000] text-black active:translate-x-0.5 active:translate-y-0.5 transition-all cursor-pointer"
                              title="Edit Record"
                            >
                              <Edit className="w-3.5 h-3.5 stroke-[2.5]" />
                            </button>

                            {/* Cyan Print button */}
                            <button
                              type="button"
                              onClick={() => onPrintReturn(item.id)}
                              className="p-1.5 bg-cyan-400 hover:bg-cyan-500 border-2 border-black shadow-[2px_2px_0px_#000] text-black active:translate-x-0.5 active:translate-y-0.5 transition-all cursor-pointer"
                              title="Print Sales Return Memo"
                            >
                              <Printer className="w-3.5 h-3.5 stroke-[2.5]" />
                            </button>

                            {/* Red Delete button */}
                            <button
                              type="button"
                              onClick={() => onOpenDeleteModal(item.id, `${item.returnNo || 'Return'} (${item.clientName})`)}
                              className="p-1.5 bg-rose-500 hover:bg-rose-600 border-2 border-black shadow-[2px_2px_0px_#000] text-white active:translate-x-0.5 active:translate-y-0.5 transition-all cursor-pointer"
                              title="Delete Record"
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
            </table>
          </div>
        )}

        {/* Bottom Actions Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2 text-xs font-black uppercase text-black">
          <div className="flex items-center gap-3">
            <button
              onClick={onOpenBulkDeleteModal}
              disabled={selectedIds.length === 0}
              className="px-4 py-2 bg-rose-500 hover:bg-rose-600 disabled:opacity-40 text-white text-xs font-black uppercase border-2 border-black shadow-[3px_3px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all cursor-pointer"
            >
              DELETE SELECTED ({selectedIds.length})
            </button>
          </div>

          <div className="flex items-center gap-4 flex-wrap">
            <span>
              Showing{' '}
              {filteredReturns.length === 0
                ? '0 to 0 of 0'
                : `${(currentPage - 1) * pageSize + 1} to ${Math.min(
                    currentPage * pageSize,
                    filteredReturns.length
                  )} of ${filteredReturns.length}`}{' '}
              entries
            </span>

            {/* Pagination Controls */}
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage <= 1}
                className="px-3 py-1.5 border-2 border-black bg-white hover:bg-slate-100 disabled:opacity-30 shadow-[2px_2px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 cursor-pointer font-black text-xs"
              >
                &lt;
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1).slice(0, 5).map(pageNum => (
                <button
                  key={pageNum}
                  onClick={() => setCurrentPage(pageNum)}
                  className={`px-3 py-1.5 text-xs font-black border-2 border-black shadow-[2px_2px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 cursor-pointer transition-all ${
                    currentPage === pageNum 
                      ? 'bg-amber-300 text-black' 
                      : 'bg-white hover:bg-slate-100 text-black'
                  }`}
                >
                  {pageNum}
                </button>
              ))}

              {totalPages > 5 && (
                <>
                  <span className="px-1 text-black font-black">...</span>
                  <button
                    onClick={() => setCurrentPage(totalPages)}
                    className={`px-3 py-1.5 text-xs font-black border-2 border-black shadow-[2px_2px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 cursor-pointer transition-all ${
                      currentPage === totalPages 
                        ? 'bg-amber-300 text-black' 
                        : 'bg-white hover:bg-slate-100 text-black'
                    }`}
                  >
                    {totalPages}
                  </button>
                </>
              )}

              <button
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage >= totalPages}
                className="px-3 py-1.5 border-2 border-black bg-white hover:bg-slate-100 disabled:opacity-30 shadow-[2px_2px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 cursor-pointer font-black text-xs"
              >
                &gt;
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
