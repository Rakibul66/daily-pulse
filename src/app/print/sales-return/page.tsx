"use client";

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { SalesReturn } from '@/types/sales';
import { CompanyProfile, Branch } from '@/types/company';
import { getCompanyProfile, getBranches } from '@/lib/companyStorage';
import { getSalesReturnById } from '@/lib/salesStorage';
import { useAuth } from '@/context/AuthContext';
import { Printer, X, Loader2 } from 'lucide-react';

const numberToWords = (num: number): string => {
  if (num === 0) return "Zero Taka Only";
  const a = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
  const b = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];

  const inWords = (n: number): string => {
    if (n < 20) return a[n];
    if (n < 100) return b[Math.floor(n / 10)] + (n % 10 !== 0 ? ' ' + a[n % 10] : '');
    if (n < 1000) return a[Math.floor(n / 100)] + ' Hundred' + (n % 100 !== 0 ? ' and ' + inWords(n % 100) : '');
    if (n < 100000) return inWords(Math.floor(n / 1000)) + ' Thousand' + (n % 1000 !== 0 ? ' ' + inWords(n % 1000) : '');
    if (n < 10000000) return inWords(Math.floor(n / 100000)) + ' Lakh' + (n % 100000 !== 0 ? ' ' + inWords(n % 100000) : '');
    return inWords(Math.floor(n / 10000000)) + ' Crore' + (n % 10000000 !== 0 ? ' ' + inWords(n % 10000000) : '');
  };

  const integerPart = Math.floor(Math.abs(num));
  const result = inWords(integerPart);
  return (result ? result.trim() : "Zero") + " Taka Only";
};

const formatDateFormatted = (dateStr: string): string => {
  if (!dateStr) return '';
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  let y = 0, m = 0, d = 0;
  if (dateStr.includes('-')) {
    const parts = dateStr.split('-');
    if (parts[0].length === 4) {
      y = parseInt(parts[0], 10);
      m = parseInt(parts[1], 10);
      d = parseInt(parts[2], 10);
    } else {
      d = parseInt(parts[0], 10);
      m = parseInt(parts[1], 10);
      y = parseInt(parts[2], 10);
    }
  } else {
    const parsed = new Date(dateStr);
    if (!isNaN(parsed.getTime())) {
      y = parsed.getFullYear();
      m = parsed.getMonth() + 1;
      d = parsed.getDate();
    }
  }
  if (y && m && d && m >= 1 && m <= 12) {
    const dayStr = String(d).padStart(2, '0');
    return `${dayStr}-${months[m - 1]}-${y}`;
  }
  return dateStr;
};

function SalesReturnPrintContent() {
  const searchParams = useSearchParams();
  const returnId = searchParams.get('id');
  const { user, userProfile } = useAuth();

  const [returnData, setReturnData] = useState<SalesReturn | null>(null);
  const [companyProfile, setCompanyProfile] = useState<CompanyProfile | null>(null);
  const [branches, setBranches] = useState<Branch[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    if (!returnId) {
      setIsLoading(false);
      return;
    }

    const loadData = async () => {
      try {
        const item = await getSalesReturnById(returnId);
        setReturnData(item);

        const companyId = userProfile?.companyId || item?.companyId || item?.userId || user?.uid;
        if (companyId) {
          const [prof, branchList] = await Promise.all([
            getCompanyProfile(companyId),
            getBranches(companyId)
          ]);
          setCompanyProfile(prof);
          setBranches(branchList);
        }
      } catch (err) {
        console.error("Error loading sales return print data:", err);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [returnId, user, userProfile?.companyId]);

  useEffect(() => {
    if (returnData?.returnNo) {
      document.title = `Sales Return - ${returnData.returnNo}`;
    }
  }, [returnData?.returnNo]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-100 flex flex-col items-center justify-center p-4">
        <Loader2 className="w-8 h-8 animate-spin text-black mb-2" />
        <p className="text-sm font-bold text-slate-700">Loading Return Memo...</p>
      </div>
    );
  }

  if (!returnData) {
    return (
      <div className="min-h-screen bg-slate-100 flex flex-col items-center justify-center p-4">
        <div className="bg-white border-2 border-black p-6 shadow-md text-center max-w-md">
          <h2 className="text-lg font-black text-red-600 mb-2">Record Not Found</h2>
          <p className="text-xs text-slate-600 mb-4">The requested sales return record does not exist or has been removed.</p>
          <button
            onClick={() => window.close()}
            className="px-4 py-1.5 bg-black text-white text-xs font-bold uppercase rounded cursor-pointer"
          >
            Close Tab
          </button>
        </div>
      </div>
    );
  }

  const companyName = companyProfile?.name || returnData.companyName || userProfile?.displayName || "";
  const matchedBranch = branches.find(b => b.name.toLowerCase() === (returnData.storeName || '').toLowerCase());
  const displayAddress = matchedBranch?.address || companyProfile?.address || "";
  const displayPhone = matchedBranch?.phone || companyProfile?.phone || "";
  const displayEmail = companyProfile?.email || "";
  const displayWebsite = companyProfile?.website || "";

  const items = returnData.items || [];
  const totalQty = items.reduce((sum, item) => sum + (Number(item.currentReturn) || 0), 0);
  const totalAmount = returnData.amount || items.reduce((sum, item) => sum + (Number(item.amount) || 0), 0);

  return (
    <div className="min-h-screen bg-white text-black py-6 px-4 sm:px-8 font-sans">
      {/* Floating Action Bar */}
      <div className="fixed top-4 right-4 z-50 flex items-center gap-2 print:hidden bg-white/95 backdrop-blur p-2 rounded-lg border-2 border-black shadow-[4px_4px_0px_#000]">
        <button
          onClick={() => window.print()}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-[#20B2AA] text-white hover:bg-[#1A9C96] text-xs font-black uppercase rounded border border-black shadow-[2px_2px_0px_#000] cursor-pointer"
        >
          <Printer className="w-3.5 h-3.5" />
          <span>Print Memo</span>
        </button>
        <button
          onClick={() => window.close()}
          className="flex items-center gap-1 px-3 py-1.5 bg-slate-200 hover:bg-slate-300 text-black text-xs font-black uppercase rounded border border-black cursor-pointer"
        >
          <X className="w-3.5 h-3.5" />
          <span>Close</span>
        </button>
      </div>

      <div className="max-w-4xl mx-auto border-2 border-black p-6 sm:p-8 bg-white shadow-sm">
        {/* Header */}
        <div className="border-b-2 border-black pb-4 mb-4">
          <div className="flex items-start justify-between gap-4">
            <div className="w-24 shrink-0">
              {companyProfile?.logoUrl ? (
                <img
                  src={companyProfile.logoUrl}
                  alt={companyName}
                  className="max-h-20 max-w-full object-contain"
                />
              ) : null}
            </div>

            <div className="flex-1 text-center">
              {companyName && (
                <h1 className="text-2xl sm:text-3xl font-black uppercase tracking-wide text-black">
                  {companyName}
                </h1>
              )}
              {displayAddress && (
                <p className="text-xs font-medium text-slate-800 mt-1">
                  {displayAddress}
                </p>
              )}
              <div className="flex flex-wrap justify-center items-center gap-x-4 gap-y-1 text-xs text-slate-800 mt-1">
                {displayPhone && <span>Mobile: {displayPhone}</span>}
                {displayEmail && <span>Email: {displayEmail}</span>}
                {displayWebsite && <span>Web: {displayWebsite}</span>}
              </div>
            </div>

            <div className="w-24 shrink-0 text-right">
              <span className={`inline-block px-2 py-0.5 text-[10px] font-black uppercase rounded border border-black ${
                returnData.isApproved || returnData.status === 'APPROVED' 
                  ? 'bg-emerald-100 text-emerald-800' 
                  : 'bg-amber-100 text-amber-800'
              }`}>
                {returnData.isApproved || returnData.status === 'APPROVED' ? 'Approved' : 'Pending'}
              </span>
            </div>
          </div>
        </div>

        {/* Memo Title */}
        <div className="text-center my-4">
          <span className="inline-block px-6 py-1 bg-black text-white text-sm font-black uppercase tracking-widest rounded">
            SALES RETURN MEMO
          </span>
        </div>

        {/* Info Grid */}
        <div className="grid grid-cols-2 gap-4 border border-black p-4 mb-6 text-xs bg-slate-50/50">
          <div className="space-y-1.5">
            <div className="flex">
              <span className="w-28 font-bold text-slate-700">Client Name:</span>
              <span className="font-bold text-black uppercase">{returnData.clientName || '—'}</span>
            </div>
            {returnData.returnReason && (
              <div className="flex">
                <span className="w-28 font-bold text-slate-700">Return Reason:</span>
                <span className="text-slate-900">{returnData.returnReason}</span>
              </div>
            )}
            {returnData.remarks && (
              <div className="flex">
                <span className="w-28 font-bold text-slate-700">Remarks:</span>
                <span className="text-slate-900">{returnData.remarks}</span>
              </div>
            )}
          </div>

          <div className="space-y-1.5">
            <div className="flex">
              <span className="w-28 font-bold text-slate-700">Return No:</span>
              <span className="font-mono font-bold text-black">{returnData.returnNo}</span>
            </div>
            <div className="flex">
              <span className="w-28 font-bold text-slate-700">Return Date:</span>
              <span className="font-bold text-black">{formatDateFormatted(returnData.returnDate)}</span>
            </div>
            <div className="flex">
              <span className="w-28 font-bold text-slate-700">Store / Outlet:</span>
              <span className="font-bold text-black">{returnData.storeName || '—'}</span>
            </div>
            {returnData.staff && (
              <div className="flex">
                <span className="w-28 font-bold text-slate-700">Handled By:</span>
                <span className="text-slate-900">{returnData.staff}</span>
              </div>
            )}
          </div>
        </div>

        {/* Items Table */}
        <div className="overflow-x-auto mb-6">
          <table className="w-full text-xs border border-black">
            <thead>
              <tr className="bg-slate-200 text-black font-black uppercase border-b border-black text-center">
                <th className="border-r border-black p-2 w-10">SL</th>
                <th className="border-r border-black p-2 text-left">Product Name</th>
                <th className="border-r border-black p-2 w-24">Code</th>
                <th className="border-r border-black p-2 w-28">Invoice</th>
                <th className="border-r border-black p-2 w-20">Qty</th>
                <th className="border-r border-black p-2 w-24 text-right">Rate (৳)</th>
                <th className="p-2 w-28 text-right">Amount (৳)</th>
              </tr>
            </thead>
            <tbody>
              {items.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-6 text-slate-500 font-bold border-b border-black">
                    No items listed in return memo
                  </td>
                </tr>
              ) : (
                items.map((item, idx) => (
                  <tr key={item.id || idx} className="border-b border-black/30 hover:bg-slate-50">
                    <td className="border-r border-black p-2 text-center font-bold">{idx + 1}</td>
                    <td className="border-r border-black p-2 text-left font-bold">{item.productName}</td>
                    <td className="border-r border-black p-2 text-center font-mono">{item.code || '—'}</td>
                    <td className="border-r border-black p-2 text-center font-mono">{item.invoiceNo || '—'}</td>
                    <td className="border-r border-black p-2 text-center font-bold">{item.currentReturn}</td>
                    <td className="border-r border-black p-2 text-right font-mono">{Number(item.rate).toFixed(2)}</td>
                    <td className="p-2 text-right font-bold font-mono">{Number(item.amount).toFixed(2)}</td>
                  </tr>
                ))
              )}
            </tbody>
            <tfoot>
              <tr className="bg-slate-100 font-bold border-t-2 border-black">
                <td colSpan={4} className="border-r border-black p-2 text-right uppercase">
                  Total
                </td>
                <td className="border-r border-black p-2 text-center font-black">
                  {totalQty}
                </td>
                <td className="border-r border-black p-2"></td>
                <td className="p-2 text-right font-black font-mono text-sm">
                  ৳{Number(totalAmount).toFixed(2)}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>

        {/* In Words */}
        <div className="border border-black p-3 mb-8 bg-slate-50 text-xs">
          <span className="font-bold text-slate-700">In Words: </span>
          <span className="font-bold text-black uppercase">{numberToWords(totalAmount)}</span>
        </div>

        {/* Signature Section */}
        <div className="grid grid-cols-4 gap-4 pt-16 text-center text-xs">
          <div className="border-t border-black pt-1">
            <p className="font-bold text-slate-800">Customer Signature</p>
          </div>
          <div className="border-t border-black pt-1">
            <p className="font-bold text-slate-800">Prepared By</p>
          </div>
          <div className="border-t border-black pt-1">
            <p className="font-bold text-slate-800">Store In-Charge</p>
          </div>
          <div className="border-t border-black pt-1">
            <p className="font-bold text-slate-800">Authorized Signature</p>
          </div>
        </div>

        {/* Footer Note */}
        <div className="mt-8 pt-3 border-t border-slate-300 text-center text-[10px] text-slate-500">
          This is a computer-generated sales return memo.
        </div>
      </div>
    </div>
  );
}

export default function SalesReturnPrintPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4">
          <div className="text-center font-bold text-sm text-slate-600">
            Loading return document...
          </div>
        </div>
      }
    >
      <SalesReturnPrintContent />
    </Suspense>
  );
}
