"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { 
  Check, 
  X, 
  Printer, 
  Loader2, 
  CheckCircle2, 
  XCircle,
  Clock,
  Eye,
  Package,
  RotateCcw
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { SalesReturn } from '@/types/sales';
import { getSalesReturns, updateSalesReturn } from '@/lib/salesStorage';

interface Props {
  showToast: (msg: string, type?: 'success' | 'error' | 'info') => void;
}

export const SalesReturnApprovalPage: React.FC<Props> = ({ showToast }) => {
  const { user, userProfile } = useAuth();

  const [returns, setReturns] = useState<SalesReturn[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [filterOption, setFilterOption] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [pageSize, setPageSize] = useState<number>(10);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [processingId, setProcessingId] = useState<string | null>(null);

  // Inspection modal
  const [viewingReturn, setViewingReturn] = useState<SalesReturn | null>(null);

  useEffect(() => {
    if (!user) return;
    loadReturns();
  }, [user, userProfile?.companyId]);

  const loadReturns = async () => {
    if (!user) return;
    setIsLoading(true);
    try {
      const data = await getSalesReturns(user.uid, userProfile?.companyId);
      setReturns(data);
    } catch (err) {
      console.error('Failed to load sales returns for approval:', err);
      showToast('Failed to load sales returns', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleApprove = async (item: SalesReturn) => {
    setProcessingId(item.id);
    try {
      await updateSalesReturn(item.id, {
        isApproved: true,
        status: 'APPROVED'
      });
      showToast(`Sales return ${item.returnNo || ''} approved`, 'success');
      await loadReturns();
      if (viewingReturn?.id === item.id) {
        setViewingReturn(prev => prev ? { ...prev, isApproved: true, status: 'APPROVED' } : null);
      }
    } catch (err) {
      console.error('Failed to approve sales return:', err);
      showToast('Failed to approve sales return', 'error');
    } finally {
      setProcessingId(null);
    }
  };

  const handleReject = async (item: SalesReturn) => {
    setProcessingId(item.id);
    try {
      await updateSalesReturn(item.id, {
        isApproved: false,
        status: 'REJECTED'
      });
      showToast(`Sales return ${item.returnNo || ''} rejected`, 'info');
      await loadReturns();
      if (viewingReturn?.id === item.id) {
        setViewingReturn(prev => prev ? { ...prev, isApproved: false, status: 'REJECTED' } : null);
      }
    } catch (err) {
      console.error('Failed to reject sales return:', err);
      showToast('Failed to reject sales return', 'error');
    } finally {
      setProcessingId(null);
    }
  };

  const handlePrint = (id: string) => {
    window.open(`/print/sales-return?id=${id}`, '_blank');
  };

  // Filter options
  const filterOptions = useMemo(() => {
    const stores = new Set<string>();
    returns.forEach(r => {
      if (r.storeName) stores.add(r.storeName);
    });
    return [
      'All',
      'Pending',
      'Approved',
      'Rejected',
      ...Array.from(stores)
    ];
  }, [returns]);

  // Filtered returns
  const filteredReturns = useMemo(() => {
    return returns.filter((r) => {
      // Dropdown filter
      if (filterOption === 'Pending') {
        const isPending = !r.isApproved && r.status !== 'APPROVED' && r.status !== 'REJECTED';
        if (!isPending) return false;
      } else if (filterOption === 'Approved') {
        const isApproved = r.isApproved || r.status === 'APPROVED';
        if (!isApproved) return false;
      } else if (filterOption === 'Rejected') {
        if (r.status !== 'REJECTED') return false;
      } else if (filterOption !== 'All') {
        // Store filter
        if (r.storeName !== filterOption) return false;
      }

      // Search filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesClient = r.clientName?.toLowerCase().includes(q);
        const matchesReturnNo = r.returnNo?.toLowerCase().includes(q);
        const matchesCompany = r.companyName?.toLowerCase().includes(q);
        const matchesStore = r.storeName?.toLowerCase().includes(q);
        const matchesStaff = r.staff?.toLowerCase().includes(q);
        const matchesRemarks = r.remarks?.toLowerCase().includes(q) || r.returnReason?.toLowerCase().includes(q);
        const matchesProductType = r.productType?.toLowerCase().includes(q);
        if (!matchesClient && !matchesReturnNo && !matchesCompany && !matchesStore && !matchesStaff && !matchesRemarks && !matchesProductType) {
          return false;
        }
      }

      return true;
    });
  }, [returns, filterOption, searchQuery]);

  const totalPages = Math.ceil(filteredReturns.length / pageSize) || 1;
  const paginatedReturns = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredReturns.slice(start, start + pageSize);
  }, [filteredReturns, currentPage, pageSize]);

  return (
    <div className="w-full pb-20 space-y-6">
      {/* Top Header Card matching Website Neo-Brutalist Pattern */}
      <div className="bg-white border-2 sm:border-4 border-black p-5 sm:p-6 shadow-[6px_6px_0px_#000] flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-amber-300 border-2 border-black shadow-[2px_2px_0px_#000]">
            <CheckCircle2 className="w-6 h-6 text-black stroke-[2.5]" />
          </div>
          <div>
            <h2 className="font-display font-black text-lg sm:text-xl uppercase tracking-wider text-black">
              SALES RETURN APPROVAL
            </h2>
            <p className="text-xs font-bold text-slate-600 uppercase tracking-wider">
              Verify customer return vouchers, approve refunds & update accounts
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          <span className="text-xs font-black uppercase text-black">Status / Store:</span>
          <select 
            value={filterOption}
            onChange={(e) => {
              setFilterOption(e.target.value);
              setCurrentPage(1);
            }}
            className="h-10 px-3 bg-white border-2 border-black font-bold text-xs text-black shadow-[2px_2px_0px_#000] focus:outline-hidden cursor-pointer"
            title="Filter by Status or Store"
          >
            {filterOptions.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Main Table Container Card */}
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
              Loading return approval records...
            </span>
          </div>
        ) : (
          <div className="border-2 sm:border-4 border-black overflow-x-auto shadow-[4px_4px_0px_#000]">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-900 text-white font-display font-black uppercase tracking-wider border-b-4 border-black">
                  <th className="p-3 border-r-2 border-slate-700">Company</th>
                  <th className="p-3 w-28 border-r-2 border-slate-700">Type</th>
                  <th className="p-3 border-r-2 border-slate-700">Client</th>
                  <th className="p-3 w-32 border-r-2 border-slate-700">Store</th>
                  <th className="p-3 w-28 border-r-2 border-slate-700">Return Date</th>
                  <th className="p-3 w-28 text-right border-r-2 border-slate-700">Amount</th>
                  <th className="p-3 w-24 border-r-2 border-slate-700">Staff</th>
                  <th className="p-3 border-r-2 border-slate-700">Remarks</th>
                  <th className="p-3 w-48 text-center">Status & Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y-2 divide-black/20 font-bold bg-white">
                {paginatedReturns.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="p-10 text-center text-xs font-black text-slate-500 uppercase tracking-widest">
                      No data available in table
                    </td>
                  </tr>
                ) : (
                  paginatedReturns.map((item) => {
                    const isApproved = item.isApproved || item.status === 'APPROVED';
                    const isRejected = item.status === 'REJECTED';
                    const isPending = !isApproved && !isRejected;

                    return (
                      <tr key={item.id} className="hover:bg-amber-50/80 transition-colors">
                        {/* Company */}
                        <td className="p-3 border-r-2 border-black/10 text-black">
                          {item.companyName || '—'}
                        </td>

                        {/* Product Type */}
                        <td className="p-3 border-r-2 border-black/10 text-black">
                          <span className="px-2 py-0.5 bg-slate-100 border border-black/30 text-[11px] font-black uppercase">
                            {item.productType || 'Standard'}
                          </span>
                        </td>

                        {/* Client */}
                        <td className="p-3 border-r-2 border-black/10 text-black">
                          <div>
                            <span>{item.clientName || 'Walk-in Customer'}</span>
                            {item.returnNo && (
                              <span className="block font-mono text-[11px] text-slate-600">
                                {item.returnNo}
                              </span>
                            )}
                          </div>
                        </td>

                        {/* Store */}
                        <td className="p-3 border-r-2 border-black/10 text-black">
                          {item.storeName || '—'}
                        </td>

                        {/* Return Date */}
                        <td className="p-3 border-r-2 border-black/10 font-mono text-slate-800 text-xs whitespace-nowrap">
                          {item.returnDate}
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
                          <div className="flex items-center justify-center gap-1.5 flex-wrap">
                            {/* Status Badge */}
                            {isApproved && (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-emerald-200 text-black border-2 border-black font-black text-[11px] uppercase shadow-[1px_1px_0px_#000]">
                                <CheckCircle2 className="w-3 h-3 text-emerald-800" />
                                Approved
                              </span>
                            )}
                            {isRejected && (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-rose-200 text-black border-2 border-black font-black text-[11px] uppercase shadow-[1px_1px_0px_#000]">
                                <XCircle className="w-3 h-3 text-rose-800" />
                                Rejected
                              </span>
                            )}
                            {isPending && (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-amber-200 text-black border-2 border-black font-black text-[11px] uppercase shadow-[1px_1px_0px_#000]">
                                <Clock className="w-3 h-3 text-amber-800" />
                                Pending
                              </span>
                            )}

                            {/* Approve / Reject buttons */}
                            {isPending ? (
                              <>
                                <button
                                  onClick={() => handleApprove(item)}
                                  disabled={processingId === item.id}
                                  className="px-2 py-1 bg-emerald-400 hover:bg-emerald-500 text-black border-2 border-black font-black text-xs uppercase shadow-[2px_2px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 transition-all flex items-center gap-0.5 cursor-pointer disabled:opacity-50"
                                  title="Approve Return"
                                >
                                  <Check className="w-3.5 h-3.5 stroke-[3]" />
                                  <span>Approve</span>
                                </button>
                                <button
                                  onClick={() => handleReject(item)}
                                  disabled={processingId === item.id}
                                  className="px-2 py-1 bg-rose-400 hover:bg-rose-500 text-white border-2 border-black font-black text-xs uppercase shadow-[2px_2px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 transition-all flex items-center gap-0.5 cursor-pointer disabled:opacity-50"
                                  title="Reject Return"
                                >
                                  <X className="w-3.5 h-3.5 stroke-[3]" />
                                  <span>Reject</span>
                                </button>
                              </>
                            ) : (
                              <button
                                onClick={() => isApproved ? handleReject(item) : handleApprove(item)}
                                disabled={processingId === item.id}
                                className="px-2 py-1 bg-white hover:bg-slate-100 text-black border-2 border-black font-black text-xs uppercase shadow-[2px_2px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 transition-all cursor-pointer disabled:opacity-50"
                                title={isApproved ? "Revoke / Reject" : "Re-approve"}
                              >
                                {isApproved ? 'Revoke' : 'Re-approve'}
                              </button>
                            )}

                            {/* View Items Modal Button */}
                            <button
                              onClick={() => setViewingReturn(item)}
                              className="p-1.5 bg-cyan-300 hover:bg-cyan-400 text-black border-2 border-black shadow-[2px_2px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 transition-all cursor-pointer"
                              title="Inspect Return Items"
                            >
                              <Eye className="w-3.5 h-3.5 stroke-[2.5]" />
                            </button>

                            {/* Print Memo Button */}
                            <button
                              onClick={() => handlePrint(item.id)}
                              className="p-1.5 bg-amber-300 hover:bg-amber-400 text-black border-2 border-black shadow-[2px_2px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 transition-all cursor-pointer"
                              title="Print Return Memo"
                            >
                              <Printer className="w-3.5 h-3.5 stroke-[2.5]" />
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

        {/* Pagination Footer */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2 text-xs font-black uppercase text-black">
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

      {/* Inspection Modal for Viewing Return Details & Line Items */}
      {viewingReturn && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white border-4 border-black shadow-[8px_8px_0px_#000] max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col text-black">
            {/* Modal Header */}
            <div className="p-4 border-b-4 border-black flex items-center justify-between bg-slate-900 text-white">
              <h3 className="text-base font-display font-black uppercase tracking-wider flex items-center gap-2">
                <Package className="w-5 h-5 text-amber-300" />
                <span>Return Memo Details</span>
                {viewingReturn.returnNo && (
                  <span className="font-mono text-xs px-2 py-0.5 bg-amber-300 text-black border border-black font-black">
                    {viewingReturn.returnNo}
                  </span>
                )}
              </h3>
              <button
                onClick={() => setViewingReturn(null)}
                className="p-1 bg-white hover:bg-amber-300 text-black border-2 border-black shadow-[2px_2px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 cursor-pointer transition-all"
              >
                <X className="w-4 h-4 stroke-[3]" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 overflow-y-auto space-y-5 text-xs">
              {/* Meta Grid */}
              <div className="grid grid-cols-2 gap-3 bg-amber-50 p-4 border-2 border-black shadow-[2px_2px_0px_#000] font-bold text-black">
                <div>
                  <span className="text-slate-600 block text-[11px] uppercase font-black">Client:</span>
                  <span className="font-black text-black text-sm">{viewingReturn.clientName || 'Walk-in Customer'}</span>
                </div>
                <div>
                  <span className="text-slate-600 block text-[11px] uppercase font-black">Store / Branch:</span>
                  <span className="font-black text-black">{viewingReturn.storeName || '—'}</span>
                </div>
                <div>
                  <span className="text-slate-600 block text-[11px] uppercase font-black">Return Date:</span>
                  <span className="font-mono text-black">{viewingReturn.returnDate}</span>
                </div>
                <div>
                  <span className="text-slate-600 block text-[11px] uppercase font-black">Product Type:</span>
                  <span className="text-black">{viewingReturn.productType || 'Standard'}</span>
                </div>
                {viewingReturn.returnReason && (
                  <div className="col-span-2">
                    <span className="text-slate-600 block text-[11px] uppercase font-black">Return Reason:</span>
                    <span className="text-black">{viewingReturn.returnReason}</span>
                  </div>
                )}
                {viewingReturn.remarks && (
                  <div className="col-span-2">
                    <span className="text-slate-600 block text-[11px] uppercase font-black">Remarks:</span>
                    <span className="text-black">{viewingReturn.remarks}</span>
                  </div>
                )}
              </div>

              {/* Items Table */}
              <div className="space-y-2">
                <h4 className="font-black uppercase tracking-wider text-black text-xs">
                  Returned Line Items
                </h4>
                <div className="border-2 sm:border-4 border-black overflow-x-auto shadow-[3px_3px_0px_#000]">
                  <table className="w-full text-center text-xs whitespace-nowrap">
                    <thead className="bg-slate-900 text-white font-display font-black uppercase tracking-wider border-b-2 border-black">
                      <tr>
                        <th className="p-2.5 text-left border-r-2 border-slate-700">Product Name</th>
                        <th className="p-2.5 border-r-2 border-slate-700">Code</th>
                        <th className="p-2.5 border-r-2 border-slate-700">Invoice</th>
                        <th className="p-2.5 border-r-2 border-slate-700">Return Qty</th>
                        <th className="p-2.5 text-right border-r-2 border-slate-700">Rate</th>
                        <th className="p-2.5 text-right">Amount</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y-2 divide-black/20 bg-white font-bold">
                      {(!viewingReturn.items || viewingReturn.items.length === 0) ? (
                        <tr>
                          <td colSpan={6} className="py-6 text-center text-slate-500 font-black uppercase">
                            No individual items recorded
                          </td>
                        </tr>
                      ) : (
                        viewingReturn.items.map((it, idx) => (
                          <tr key={it.id || idx} className="hover:bg-amber-50">
                            <td className="p-2.5 text-left font-black text-black border-r-2 border-black/10">{it.productName}</td>
                            <td className="p-2.5 font-mono text-slate-700 border-r-2 border-black/10">{it.code || '—'}</td>
                            <td className="p-2.5 font-mono text-slate-700 border-r-2 border-black/10">{it.invoiceNo || '—'}</td>
                            <td className="p-2.5 font-mono font-black text-emerald-700 border-r-2 border-black/10">{it.currentReturn}</td>
                            <td className="p-2.5 text-right font-mono text-black border-r-2 border-black/10">৳{Number(it.rate).toFixed(2)}</td>
                            <td className="p-2.5 text-right font-mono font-black text-black">৳{Number(it.amount).toFixed(2)}</td>
                          </tr>
                        ))
                      )}
                    </tbody>
                    <tfoot className="bg-amber-200 border-t-2 border-black font-black text-black">
                      <tr>
                        <td colSpan={5} className="p-2.5 text-right uppercase">Total Refund Amount:</td>
                        <td className="p-2.5 text-right font-mono font-black text-sm">
                          ৳{Number(viewingReturn.amount || 0).toFixed(2)}
                        </td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>
            </div>

            {/* Modal Actions Footer */}
            <div className="p-4 border-t-4 border-black bg-white flex flex-wrap items-center justify-between gap-3">
              <button
                onClick={() => handlePrint(viewingReturn.id)}
                className="px-4 py-2 bg-amber-300 hover:bg-amber-400 text-black border-2 border-black font-black text-xs uppercase shadow-[2px_2px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <Printer className="w-3.5 h-3.5 stroke-[2.5]" />
                <span>Print Memo</span>
              </button>

              <div className="flex items-center gap-2">
                {(!viewingReturn.isApproved && viewingReturn.status !== 'APPROVED') ? (
                  <button
                    onClick={() => handleApprove(viewingReturn)}
                    disabled={processingId === viewingReturn.id}
                    className="px-4 py-2 bg-emerald-400 hover:bg-emerald-500 text-black border-2 border-black font-black text-xs uppercase shadow-[2px_2px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                  >
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                    <span>Approve Return</span>
                  </button>
                ) : (
                  <button
                    onClick={() => handleReject(viewingReturn)}
                    disabled={processingId === viewingReturn.id}
                    className="px-4 py-2 bg-rose-500 hover:bg-rose-600 text-white border-2 border-black font-black text-xs uppercase shadow-[2px_2px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                  >
                    <X className="w-3.5 h-3.5 stroke-[3]" />
                    <span>Reject Return</span>
                  </button>
                )}
                <button
                  onClick={() => setViewingReturn(null)}
                  className="px-4 py-2 bg-white hover:bg-slate-100 text-black border-2 border-black font-black text-xs uppercase shadow-[2px_2px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 transition-all cursor-pointer"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
