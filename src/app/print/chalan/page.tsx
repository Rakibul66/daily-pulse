"use client";

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { DailySale } from '@/types/sales';
import { CompanyProfile, Branch } from '@/types/company';
import { getCompanyProfile, getBranches } from '@/lib/companyStorage';
import { getSalesInvoiceById } from '@/lib/salesStorage';
import { useAuth } from '@/context/AuthContext';
import { Printer, X, Loader2 } from 'lucide-react';

const formatChalanDate = (dateStr: string): string => {
  if (!dateStr) return '';
  try {
    if (/^\d{2}-\d{2}-\d{4}$/.test(dateStr)) {
      const [d, m, y] = dateStr.split('-');
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      const monthIdx = parseInt(m, 10) - 1;
      return `${d}-${months[monthIdx] || m}-${y}`;
    }
    const d = new Date(dateStr);
    if (!isNaN(d.getTime())) {
      const day = String(d.getDate()).padStart(2, '0');
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      return `${day}-${months[d.getMonth()]}-${d.getFullYear()}`;
    }
  } catch {}
  return dateStr;
};

function ChalanPrintContent() {
  const searchParams = useSearchParams();
  const invoiceId = searchParams.get('id');
  const { user, userProfile } = useAuth();

  const [invoice, setInvoice] = useState<DailySale | null>(null);
  const [companyProfile, setCompanyProfile] = useState<CompanyProfile | null>(null);
  const [branch, setBranch] = useState<Branch | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    if (!invoiceId) {
      setIsLoading(false);
      return;
    }

    const loadData = async () => {
      try {
        const inv = await getSalesInvoiceById(invoiceId);
        setInvoice(inv);

        const companyId = userProfile?.companyId || inv?.userId || user?.uid;
        if (companyId) {
          const [prof, branches] = await Promise.all([
            getCompanyProfile(companyId),
            getBranches(companyId)
          ]);
          setCompanyProfile(prof);

          if (inv?.storeName) {
            const matched = branches.find(
              (b) => b.name.toLowerCase().trim() === inv.storeName.toLowerCase().trim()
            );
            setBranch(matched || null);
          }
        }
      } catch (err) {
        console.error("Error loading chalan print data:", err);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [invoiceId, user, userProfile?.companyId]);

  useEffect(() => {
    if (invoice?.invoiceNo) {
      document.title = `Chalan - ${invoice.invoiceNo}`;
    }
  }, [invoice?.invoiceNo]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-100 flex flex-col items-center justify-center p-4">
        <Loader2 className="w-8 h-8 animate-spin text-black mb-2" />
        <p className="text-sm font-bold text-slate-700">Loading Chalan Document...</p>
      </div>
    );
  }

  if (!invoice) {
    return (
      <div className="min-h-screen bg-slate-100 flex flex-col items-center justify-center p-4">
        <div className="bg-white border-2 border-black p-6 shadow-md text-center max-w-md">
          <h2 className="text-lg font-black text-red-600 mb-2">Chalan Not Found</h2>
          <p className="text-xs text-slate-600 mb-4">The requested invoice ID does not exist or has been removed.</p>
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

  const companyName = companyProfile?.name || invoice.companyName || userProfile?.displayName || "";
  const storeOrBranch = invoice.storeName || branch?.name || "";
  const displayAddress = branch?.address || companyProfile?.address || "";
  const displayPhone = branch?.phone || companyProfile?.phone || "";
  const displayEmail = branch?.email || companyProfile?.email || "";
  const displayWebsite = companyProfile?.website || "";

  const contactItems: string[] = [];
  if (displayPhone) contactItems.push(`Phone: ${displayPhone}`);
  if (displayEmail) contactItems.push(`Email: ${displayEmail}`);
  if (displayWebsite) contactItems.push(`Website: ${displayWebsite}`);

  return (
    <div className="min-h-screen bg-slate-100 py-6 print:py-0 print:bg-white text-black font-sans">
      {/* Floating Action Bar (Hidden during Print) */}
      <div className="max-w-4xl mx-auto px-4 mb-4 flex items-center justify-between print:hidden">
        <div className="text-xs font-black uppercase text-slate-600">
          Chalan Document Preview &bull; {invoice.invoiceNo}
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => window.print()}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs uppercase rounded shadow flex items-center gap-1.5 cursor-pointer transition-colors"
          >
            <Printer className="w-4 h-4 stroke-[2.5]" />
            <span>Print Chalan</span>
          </button>
          <button
            onClick={() => window.close()}
            className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold text-xs uppercase rounded flex items-center gap-1.5 cursor-pointer transition-colors"
          >
            <X className="w-4 h-4 stroke-[2.5]" />
            <span>Close Tab</span>
          </button>
        </div>
      </div>

      {/* Printable Sheet */}
      <div className="max-w-4xl mx-auto bg-white p-10 border border-slate-300 shadow-lg print:border-none print:shadow-none print:p-0">
        
        {/* Header: Left real logo (if any) | Right real company & branch info only */}
        <div className="flex justify-between items-start mb-6 gap-6">
          <div className="flex items-center min-h-[48px]">
            {companyProfile?.logoUrl ? (
              <img
                src={companyProfile.logoUrl}
                alt={companyName || "Logo"}
                className="max-h-20 max-w-[220px] object-contain"
              />
            ) : null}
          </div>

          <div className="text-right space-y-0.5">
            {companyName && (
              <h1 className="text-2xl font-black uppercase tracking-tight text-black">{companyName}</h1>
            )}
            {storeOrBranch && (
              <p className="text-xs font-bold text-slate-700">Branch: {storeOrBranch}</p>
            )}
            {displayAddress && (
              <p className="text-xs text-slate-600">{displayAddress}</p>
            )}
            {contactItems.length > 0 && (
              <p className="text-xs text-slate-600">{contactItems.join(" | ")}</p>
            )}
          </div>
        </div>

        {/* Title Banner */}
        <div className="w-full bg-slate-200 text-center py-1 font-bold text-lg border border-black mb-4">
          Chalan
        </div>

        {/* Chalan Details Grid:
            Row 1: Outlet Name (full width)
            Row 2: Left: Contact, Right: Chalan No
            Row 3: Left: Address, Right: Date
        */}
        <div className="w-full border border-black text-sm mb-4">
          <div className="border-b border-black p-2 flex">
            <span className="font-bold w-28">Outlet Name :</span>
            <span className="font-semibold">{invoice.clientName}</span>
          </div>

          <div className="grid grid-cols-2 border-b border-black">
            <div className="border-r border-black p-2 flex">
              <span className="font-bold w-28">Contact :</span>
              <span className="font-semibold">{invoice.clientPhone || '—'}</span>
            </div>
            <div className="p-2 flex">
              <span className="font-bold w-28">Chalan No :</span>
              <span className="font-semibold font-mono">{invoice.invoiceNo}</span>
            </div>
          </div>

          <div className="grid grid-cols-2">
            <div className="border-r border-black p-2 flex">
              <span className="font-bold w-28">Address :</span>
              <span className="font-semibold">{invoice.clientAddress || ''}</span>
            </div>
            <div className="p-2 flex">
              <span className="font-bold w-28">Date :</span>
              <span className="font-semibold">{formatChalanDate(invoice.date)}</span>
            </div>
          </div>
        </div>

        {/* Chalan Goods Table: SL#, Description of Goods, Item Code, Quantity (No prices or financial totals) */}
        <table className="w-full border-collapse border border-black text-sm mb-20">
          <thead>
            <tr className="border-b border-black">
              <th className="border-r border-dashed border-slate-400 p-2 font-bold w-12 text-center">SL#</th>
              <th className="border-r border-dashed border-slate-400 p-2 font-bold text-left">Description of Goods</th>
              <th className="border-r border-dashed border-slate-400 p-2 font-bold text-left w-36">Item Code</th>
              <th className="p-2 font-bold text-left w-36">Quantity</th>
            </tr>
          </thead>
          <tbody>
            {invoice.items.map((item, idx) => (
              <tr key={item.id} className="border-b border-dashed border-slate-400 last:border-b-0">
                <td className="border-r border-dashed border-slate-400 p-2 text-center font-mono">{idx + 1}</td>
                <td className="border-r border-dashed border-slate-400 p-2 font-semibold">{item.productName}</td>
                <td className="border-r border-dashed border-slate-400 p-2 font-mono">{item.itemCode || '—'}</td>
                <td className="p-2 font-mono font-bold">{item.quantity.toFixed(2)} ({item.unit || "Pcs"})</td>
              </tr>
            ))}
            {invoice.items.length < 3 && Array(3 - invoice.items.length).fill(0).map((_, i) => (
              <tr key={`empty-${i}`} className="border-b border-dashed border-slate-400 last:border-b-0">
                <td className="border-r border-dashed border-slate-400 p-2 text-transparent">.</td>
                <td className="border-r border-dashed border-slate-400 p-2"></td>
                <td className="border-r border-dashed border-slate-400 p-2"></td>
                <td className="p-2"></td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Signatures */}
        <div className="flex justify-between items-end mt-24 text-sm font-bold text-center">
          <div className="w-48">
            <div className="italic mb-2">{invoice.salesBy || companyName || "Staff"}</div>
            <div className="border-t border-black pt-1">Prepared By</div>
          </div>
          <div className="w-48">
            <div className="italic mb-2">Admin</div>
            <div className="border-t border-black pt-1">Checked By</div>
          </div>
          <div className="w-48">
            <div className="italic mb-2">&nbsp;</div>
            <div className="border-t border-black pt-1">Receive By</div>
          </div>
        </div>

      </div>
    </div>
  );
}

export default function ChalanPrintPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-slate-100 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-black" />
      </div>
    }>
      <ChalanPrintContent />
    </Suspense>
  );
}
