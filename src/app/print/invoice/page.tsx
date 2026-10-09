"use client";

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { DailySale } from '@/types/sales';
import { CompanyProfile, Branch } from '@/types/company';
import { getCompanyProfile, getBranches } from '@/lib/companyStorage';
import { getSalesInvoiceById } from '@/lib/salesStorage';
import { useAuth } from '@/context/AuthContext';
import { Printer, X, Loader2 } from 'lucide-react';

const formatInvoiceDate = (dateStr: string): string => {
  if (!dateStr) return '';
  try {
    if (/^\d{2}-\d{2}-\d{4}$/.test(dateStr)) return dateStr;
    const parts = dateStr.split('-');
    if (parts.length === 3 && parts[0].length === 4) {
      return `${parts[2]}-${parts[1]}-${parts[0]}`;
    }
    const d = new Date(dateStr);
    if (!isNaN(d.getTime())) {
      const day = String(d.getDate()).padStart(2, '0');
      const month = String(d.getMonth() + 1).padStart(2, '0');
      return `${day}-${month}-${d.getFullYear()}`;
    }
  } catch {}
  return dateStr;
};

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

function InvoicePrintContent() {
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
        console.error("Error loading invoice print data:", err);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [invoiceId, user, userProfile?.companyId]);

  useEffect(() => {
    if (invoice?.invoiceNo) {
      document.title = `Invoice - ${invoice.invoiceNo}`;
    }
  }, [invoice?.invoiceNo]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-100 flex flex-col items-center justify-center p-4">
        <Loader2 className="w-8 h-8 animate-spin text-black mb-2" />
        <p className="text-sm font-bold text-slate-700">Loading Invoice Document...</p>
      </div>
    );
  }

  if (!invoice) {
    return (
      <div className="min-h-screen bg-slate-100 flex flex-col items-center justify-center p-4">
        <div className="bg-white border-2 border-black p-6 shadow-md text-center max-w-md">
          <h2 className="text-lg font-black text-red-600 mb-2">Invoice Not Found</h2>
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
          Invoice Document Preview &bull; {invoice.invoiceNo}
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => window.print()}
            className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs uppercase rounded shadow flex items-center gap-1.5 cursor-pointer transition-colors"
          >
            <Printer className="w-4 h-4 stroke-[2.5]" />
            <span>Print Invoice</span>
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
          Invoice
        </div>

        {/* Invoice Details Grid:
            Row 1: Left: Invoice No, Right: Invoice Date
            Row 2: Left: Client Name, Right: Contact Number
            Row 3: Address (full width)
        */}
        <div className="w-full border border-black text-sm mb-4">
          <div className="grid grid-cols-2 border-b border-black">
            <div className="border-r border-black p-2 flex">
              <span className="font-bold w-32">Invoice No :</span>
              <span className="font-semibold font-mono">{invoice.invoiceNo}</span>
            </div>
            <div className="p-2 flex">
              <span className="font-bold w-32">Invoice Date :</span>
              <span className="font-semibold">{formatInvoiceDate(invoice.date)}</span>
            </div>
          </div>

          <div className="grid grid-cols-2 border-b border-black">
            <div className="border-r border-black p-2 flex">
              <span className="font-bold w-32">Client Name :</span>
              <span className="font-semibold">{invoice.clientName}</span>
            </div>
            <div className="p-2 flex">
              <span className="font-bold w-32">Contact Number :</span>
              <span className="font-semibold font-mono">{invoice.clientPhone || '—'}</span>
            </div>
          </div>

          <div className="p-2 flex">
            <span className="font-bold w-32">Address :</span>
            <span className="font-semibold">{invoice.clientAddress || ''}</span>
          </div>
        </div>

        {/* Products Table with dashed dividers and financial summary */}
        <div className="w-full border border-black text-sm mb-4 flex flex-col">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-black">
                <th className="border-r border-dashed border-slate-400 p-2 font-bold w-12 text-center">SL#</th>
                <th className="border-r border-dashed border-slate-400 p-2 font-bold text-left">Product Name</th>
                <th className="border-r border-dashed border-slate-400 p-2 font-bold text-center w-24">Quantity</th>
                <th className="border-r border-dashed border-slate-400 p-2 font-bold text-right w-24">Rate</th>
                <th className="p-2 font-bold text-right w-32">Amount</th>
              </tr>
            </thead>
            <tbody>
              {invoice.items.map((item, idx) => (
                <tr key={item.id} className="border-b border-dashed border-slate-400 last:border-b-0">
                  <td className="border-r border-dashed border-slate-400 p-2 text-center font-mono">{idx + 1}</td>
                  <td className="border-r border-dashed border-slate-400 p-2 font-semibold">{item.productName}</td>
                  <td className="border-r border-dashed border-slate-400 p-2 text-center font-mono">{item.quantity.toFixed(2)}</td>
                  <td className="border-r border-dashed border-slate-400 p-2 text-right font-mono">{item.rate.toFixed(2)}</td>
                  <td className="p-2 text-right font-mono font-bold">{item.amount.toFixed(2)}</td>
                </tr>
              ))}
              
              {/* Summary Rows */}
              <tr className="border-t border-black">
                <td colSpan={2} rowSpan={3} className="border-r border-dashed border-slate-400 p-2 align-top">
                  <span className="font-bold">In words :</span> {numberToWords(invoice.netInvoiceAmount)}
                </td>
                <td colSpan={2} className="border-r border-dashed border-slate-400 p-2 text-right font-bold">Total Amount :</td>
                <td className="p-2 text-right font-mono font-bold">{invoice.totalAmount.toFixed(2)}</td>
              </tr>
              <tr className="border-t border-dashed border-slate-400">
                <td colSpan={2} className="border-r border-dashed border-slate-400 p-2 text-right font-bold">Discount Amount :</td>
                <td className="p-2 text-right font-mono">{invoice.discountAmount.toFixed(2)}</td>
              </tr>
              <tr className="border-t border-dashed border-slate-400">
                <td colSpan={2} className="border-r border-dashed border-slate-400 p-2 text-right font-bold">Net Invoice Amount :</td>
                <td className="p-2 text-right font-mono font-bold">{invoice.netInvoiceAmount.toFixed(2)}</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Ledger Balance Summaries */}
        <div className="w-full border border-black text-sm mb-16">
          <table className="w-full">
            <tbody>
              <tr className="border-b border-dashed border-slate-400">
                <td className="p-2 text-right font-bold border-r border-dashed border-slate-400">Opening :</td>
                <td className="p-2 text-right w-32 font-mono">{invoice.openingBalance.toFixed(2)}</td>
              </tr>
              <tr>
                <td className="p-2 text-right font-bold border-r border-dashed border-slate-400">Net Payable :</td>
                <td className="p-2 text-right w-32 font-mono font-bold">{invoice.netPayable.toFixed(2)}</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Signatures */}
        <div className="flex justify-between items-end mt-16 text-sm font-bold text-center">
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
            <div className="border-t border-black pt-1">Authorized Signature</div>
          </div>
        </div>

      </div>
    </div>
  );
}

export default function InvoicePrintPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-slate-100 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-black" />
      </div>
    }>
      <InvoicePrintContent />
    </Suspense>
  );
}
