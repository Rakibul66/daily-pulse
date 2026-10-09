"use client";

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { SalesCollection } from '@/types/sales';
import { CompanyProfile } from '@/types/company';
import { getCompanyProfile } from '@/lib/companyStorage';
import { getSalesCollectionById } from '@/lib/salesStorage';
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

function CollectionPrintContent() {
  const searchParams = useSearchParams();
  const collectionId = searchParams.get('id');
  const { user, userProfile } = useAuth();

  const [collectionRecord, setCollectionRecord] = useState<SalesCollection | null>(null);
  const [companyProfile, setCompanyProfile] = useState<CompanyProfile | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    if (!collectionId) {
      setIsLoading(false);
      return;
    }

    const loadData = async () => {
      try {
        const col = await getSalesCollectionById(collectionId);
        setCollectionRecord(col);

        const companyId = userProfile?.companyId || col?.userId || user?.uid;
        if (companyId) {
          const prof = await getCompanyProfile(companyId);
          setCompanyProfile(prof);
        }
      } catch (err) {
        console.error("Error loading collection print data:", err);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [collectionId, user, userProfile?.companyId]);

  useEffect(() => {
    if (collectionRecord?.paymentNo) {
      document.title = `Money Receipt - ${collectionRecord.paymentNo}`;
    }
  }, [collectionRecord?.paymentNo]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-100 flex flex-col items-center justify-center p-4">
        <Loader2 className="w-8 h-8 animate-spin text-black mb-2" />
        <p className="text-sm font-bold text-slate-700">Loading Money Receipt...</p>
      </div>
    );
  }

  if (!collectionRecord) {
    return (
      <div className="min-h-screen bg-slate-100 flex flex-col items-center justify-center p-4">
        <div className="bg-white border-2 border-black p-6 shadow-md text-center max-w-md">
          <h2 className="text-lg font-black text-red-600 mb-2">Receipt Not Found</h2>
          <p className="text-xs text-slate-600 mb-4">The requested collection record does not exist or has been removed.</p>
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

  const companyName = companyProfile?.name || collectionRecord.companyName || userProfile?.displayName || "";
  const displayAddress = companyProfile?.address || "";
  const displayPhone = companyProfile?.phone || "";
  const displayEmail = companyProfile?.email || "";
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
          Money Receipt Preview &bull; {collectionRecord.paymentNo}
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => window.print()}
            className="px-4 py-2 bg-[#00c5bb] hover:bg-[#00a89f] text-white font-bold text-xs uppercase rounded shadow flex items-center gap-1.5 cursor-pointer transition-colors"
          >
            <Printer className="w-4 h-4 stroke-[2.5]" />
            <span>Print Receipt</span>
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
            {displayAddress && (
              <p className="text-xs text-slate-600">{displayAddress}</p>
            )}
            {contactItems.length > 0 && (
              <p className="text-xs text-slate-600">{contactItems.join(" | ")}</p>
            )}
          </div>
        </div>

        {/* Title Banner */}
        <div className="w-full bg-slate-200 text-center py-1 font-bold text-lg border border-black mb-4 uppercase">
          Money Receipt / Collection Voucher
        </div>

        {/* Grid Details */}
        <div className="w-full border border-black text-sm mb-6">
          <div className="grid grid-cols-2 border-b border-black">
            <div className="border-r border-black p-2 flex">
              <span className="font-bold w-36">Receipt / Payment No :</span>
              <span className="font-semibold font-mono">{collectionRecord.paymentNo}</span>
            </div>
            <div className="p-2 flex">
              <span className="font-bold w-32">Date :</span>
              <span className="font-semibold">{collectionRecord.date}</span>
            </div>
          </div>

          <div className="grid grid-cols-2 border-b border-black">
            <div className="border-r border-black p-2 flex">
              <span className="font-bold w-36">Received From :</span>
              <span className="font-semibold uppercase">{collectionRecord.clientName}</span>
            </div>
            <div className="p-2 flex">
              <span className="font-bold w-32">Payment Type :</span>
              <span className="font-semibold">{collectionRecord.paymentType}</span>
            </div>
          </div>

          <div className="grid grid-cols-2 border-b border-black">
            <div className="border-r border-black p-2 flex">
              <span className="font-bold w-36">Account Head :</span>
              <span className="font-semibold">{collectionRecord.accountHead || 'General Sales'}</span>
            </div>
            <div className="p-2 flex">
              <span className="font-bold w-32">Collection Type :</span>
              <span className="font-semibold">{collectionRecord.collectionType}</span>
            </div>
          </div>

          <div className="border-b border-black p-2 flex">
            <span className="font-bold w-36">Amount Received :</span>
            <span className="font-black font-mono text-base text-black">
              ৳ {collectionRecord.amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
          </div>

          <div className="border-b border-black p-2 flex">
            <span className="font-bold w-36">In Words :</span>
            <span className="font-semibold italic">{numberToWords(collectionRecord.amount)}</span>
          </div>

          {collectionRecord.remarks && (
            <div className="p-2 flex">
              <span className="font-bold w-36">Remarks :</span>
              <span className="font-semibold">{collectionRecord.remarks}</span>
            </div>
          )}
        </div>

        {/* Invoice Breakup (If applicable) */}
        {collectionRecord.invoiceItems && collectionRecord.invoiceItems.length > 0 && (
          <div className="mb-8">
            <div className="text-xs font-bold uppercase mb-2">Invoices Breakdown :</div>
            <table className="w-full border-collapse border border-black text-xs">
              <thead>
                <tr className="bg-slate-100 border-b border-black">
                  <th className="p-2 border-r border-black text-center w-12">SL#</th>
                  <th className="p-2 border-r border-black text-left">Invoice No</th>
                  <th className="p-2 border-r border-black text-right">Sale Amount</th>
                  <th className="p-2 border-r border-black text-right">Prev Collection</th>
                  <th className="p-2 border-r border-black text-right">Current Collection</th>
                  <th className="p-2 text-right">Due Amount</th>
                </tr>
              </thead>
              <tbody>
                {collectionRecord.invoiceItems.map((inv, idx) => (
                  <tr key={inv.invoiceId || idx} className="border-b border-black last:border-b-0">
                    <td className="p-2 border-r border-black text-center font-mono">{idx + 1}</td>
                    <td className="p-2 border-r border-black font-mono font-bold">{inv.invoiceNo}</td>
                    <td className="p-2 border-r border-black text-right font-mono">৳{inv.saleAmount.toFixed(2)}</td>
                    <td className="p-2 border-r border-black text-right font-mono">৳{inv.previousCollection.toFixed(2)}</td>
                    <td className="p-2 border-r border-black text-right font-mono font-bold">৳{inv.currentCollection.toFixed(2)}</td>
                    <td className="p-2 text-right font-mono">৳{inv.dueAmount.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Signatures */}
        <div className="flex justify-between items-end mt-24 text-sm font-bold text-center">
          <div className="w-48">
            <div className="italic mb-2">{collectionRecord.staff || "Staff"}</div>
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

export default function CollectionPrintPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-slate-100 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-black" />
      </div>
    }>
      <CollectionPrintContent />
    </Suspense>
  );
}
