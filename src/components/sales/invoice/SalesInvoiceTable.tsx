"use client";

import React from "react";
import { 
  Plus, 
  Loader2, 
  Edit, 
  Printer, 
  FileText, 
  Trash2, 
  ChevronLeft, 
  ChevronRight 
} from "lucide-react";
import { DailySale } from "@/types/sales";

interface SalesInvoiceTableProps {
  invoices: DailySale[];
  isLoading: boolean;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  pageSize: number;
  setPageSize: (size: number) => void;
  currentPage: number;
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
  totalPages: number;
  totalFilteredCount: number;
  onOpenNewSale: () => void;
  onOpenEdit: (inv: DailySale) => void;
  onDeleteInvoice: (id: string, invoiceNo: string) => void;
}

export const SalesInvoiceTable: React.FC<SalesInvoiceTableProps> = ({
  invoices,
  isLoading,
  searchQuery,
  setSearchQuery,
  pageSize,
  setPageSize,
  currentPage,
  setCurrentPage,
  totalPages,
  totalFilteredCount,
  onOpenNewSale,
  onOpenEdit,
  onDeleteInvoice
}) => {
  return (
    <div className="space-y-6">
      {/* Header Card */}
      <div className="bg-white border-2 sm:border-4 border-black p-5 sm:p-6 shadow-[6px_6px_0px_#000] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] font-black tracking-widest uppercase bg-indigo-600 text-white px-2 py-0.5 border border-black shadow-[2px_2px_0px_#000]">
            SALES & POS
          </span>
          <h2 className="font-display font-black text-xl sm:text-2xl uppercase tracking-tight text-black mt-1">
            DAILY SALES INVOICES
          </h2>
        </div>

        <button
          onClick={onOpenNewSale}
          className="px-5 py-2.5 bg-amber-300 hover:bg-amber-400 text-black border-2 border-black font-black uppercase tracking-wider text-xs shadow-[4px_4px_0px_#000] hover:shadow-[1px_1px_0px_#000] hover:translate-x-[2px] hover:translate-y-[2px] transition-all flex items-center gap-2 cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>+ NEW SALE</span>
        </button>
      </div>

      {/* Table Container */}
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
            <div className="relative">
              <input
                type="text"
                placeholder="Invoice # or customer..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-48 sm:w-64 px-3 py-1.5 bg-white border-2 border-black font-bold text-xs text-black shadow-[2px_2px_0px_#000] focus:outline-hidden focus:ring-2 focus:ring-black"
              />
            </div>
          </div>
        </div>

        {/* Invoices Table */}
        {isLoading ? (
          <div className="py-16 flex flex-col items-center justify-center gap-3">
            <Loader2 className="w-8 h-8 animate-spin text-black" />
            <span className="text-xs font-black uppercase tracking-wider text-black">
              Loading sales invoices...
            </span>
          </div>
        ) : (
          <div className="border-2 sm:border-4 border-black overflow-x-auto shadow-[4px_4px_0px_#000]">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-900 text-white font-display font-black uppercase tracking-wider border-b-4 border-black">
                  <th className="p-3 w-12 text-center border-r-2 border-slate-700">Sl#</th>
                  <th className="p-3 w-32 border-r-2 border-slate-700">Invoice No</th>
                  <th className="p-3 w-28 border-r-2 border-slate-700">Date</th>
                  <th className="p-3 border-r-2 border-slate-700">Customer</th>
                  <th className="p-3 w-32 border-r-2 border-slate-700">Store</th>
                  <th className="p-3 w-24 border-r-2 border-slate-700">Type</th>
                  <th className="p-3 w-28 text-right border-r-2 border-slate-700">Amount (৳)</th>
                  <th className="p-3 w-36 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y-2 divide-black/20 font-bold bg-white">
                {invoices.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="p-10 text-center text-xs font-black text-slate-500 uppercase tracking-widest">
                      No sales invoices recorded yet. Click "+ NEW SALE" to create your first invoice.
                    </td>
                  </tr>
                ) : (
                  invoices.map((inv, idx) => {
                    const sl = (currentPage - 1) * pageSize + idx + 1;
                    return (
                      <tr key={inv.id} className="hover:bg-amber-50/80 transition-colors">
                        <td className="p-3 text-center border-r-2 border-black/10 font-mono text-black">
                          {sl}
                        </td>
                        <td className="p-3 border-r-2 border-black/10 font-mono font-black text-black">
                          {inv.invoiceNo}
                        </td>
                        <td className="p-3 border-r-2 border-black/10 font-mono text-black">
                          {inv.date}
                        </td>
                        <td className="p-3 border-r-2 border-black/10 text-black">
                          <div className="font-black">{inv.clientName}</div>
                          {inv.clientPhone && (
                            <div className="text-[10px] text-slate-500 font-mono">
                              {inv.clientPhone}
                            </div>
                          )}
                        </td>
                        <td className="p-3 border-r-2 border-black/10 text-black">
                          {inv.storeName || "—"}
                        </td>
                        <td className="p-3 border-r-2 border-black/10">
                          <span className="px-2 py-0.5 text-[10px] font-black uppercase border border-black bg-slate-100">
                            {inv.type || "Cash"}
                          </span>
                        </td>
                        <td className="p-3 text-right border-r-2 border-black/10 font-mono font-black text-black">
                          ৳{(inv.netInvoiceAmount ?? inv.totalAmount ?? 0).toLocaleString("en-US", {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2
                          })}
                        </td>
                        <td className="p-3 text-center">
                          <div className="flex items-center justify-center gap-1.5">
                            <button
                              onClick={() => onOpenEdit(inv)}
                              className="p-1.5 bg-amber-300 hover:bg-amber-400 text-black border border-black shadow-[1px_1px_0px_#000] cursor-pointer"
                              title="Edit Invoice"
                            >
                              <Edit className="w-3.5 h-3.5 stroke-[2.5]" />
                            </button>
                            <button
                              onClick={() => window.open(`/print/chalan?id=${inv.id}`, '_blank')}
                              className="p-1.5 bg-sky-300 hover:bg-sky-400 text-black border border-black shadow-[1px_1px_0px_#000] cursor-pointer"
                              title="Print Delivery Chalan (Opens in New Tab)"
                            >
                              <Printer className="w-3.5 h-3.5 stroke-[2.5]" />
                            </button>
                            <button
                              onClick={() => window.open(`/print/invoice?id=${inv.id}`, '_blank')}
                              className="p-1.5 bg-purple-300 hover:bg-purple-400 text-black border border-black shadow-[1px_1px_0px_#000] cursor-pointer"
                              title="Print Invoice Receipt (Opens in New Tab)"
                            >
                              <FileText className="w-3.5 h-3.5 stroke-[2.5]" />
                            </button>
                            <button
                              onClick={() => onDeleteInvoice(inv.id, inv.invoiceNo)}
                              className="p-1.5 bg-red-500 hover:bg-red-600 text-white border border-black shadow-[1px_1px_0px_#000] cursor-pointer"
                              title="Delete Invoice"
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

        {/* Pagination */}
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
