"use client";

import React, { useState, useEffect } from 'react';
import { DailySale } from '@/types/sales';
import { CompanyProfile, Branch } from '@/types/company';
import { getCompanyProfile, getBranches } from '@/lib/companyStorage';
import { useAuth } from '@/context/AuthContext';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  invoice: DailySale | null;
}

// Format date as text month for Chalan, e.g. 13-Jul-2026 or 09-Oct-2026
const formatChalanDate = (dateStr: string): string => {
  if (!dateStr) return '';
  try {
    // If format is DD-MM-YYYY
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
      const month = months[d.getMonth()];
      const year = d.getFullYear();
      return `${day}-${month}-${year}`;
    }
  } catch {
    // fallback
  }
  return dateStr;
};

export const PrintChalanModal: React.FC<Props> = ({ isOpen, onClose, invoice }) => {
  const { user, userProfile } = useAuth();
  const [companyProfile, setCompanyProfile] = useState<CompanyProfile | null>(null);
  const [branch, setBranch] = useState<Branch | null>(null);

  useEffect(() => {
    if (isOpen && invoice && user) {
      const companyId = userProfile?.companyId || user.uid;
      getCompanyProfile(companyId).then((prof) => {
        setCompanyProfile(prof);
      });
      getBranches(companyId).then((branches) => {
        if (invoice.storeName) {
          const matched = branches.find(
            (b) => b.name.toLowerCase().trim() === invoice.storeName.toLowerCase().trim()
          );
          setBranch(matched || null);
        } else {
          setBranch(null);
        }
      });
    }
  }, [isOpen, invoice, user, userProfile?.companyId]);

  if (!isOpen || !invoice) return null;

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
    <div className="fixed inset-0 z-[100] bg-white dark:bg-slate-900 overflow-y-auto print:p-0 p-8">
      
      {/* Non-printable header controls */}
      <div className="max-w-4xl mx-auto flex justify-end gap-4 mb-8 print:hidden">
        <button 
          onClick={onClose} 
          className="px-4 py-2 bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold rounded cursor-pointer"
        >
          Close
        </button>
        <button 
          onClick={() => window.print()} 
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded shadow cursor-pointer transition-colors"
        >
          Print Chalan
        </button>
      </div>

      {/* Printable Area - Exact Chalan Design */}
      <div className="max-w-4xl mx-auto bg-white p-8 border border-slate-300 print:border-none print:p-0 text-black">
        
        {/* Header: Left real logo (if any) | Right real company & branch info only */}
        <div className="flex justify-between items-start mb-6 gap-6">
          {/* Left Side: Real Logo if found, otherwise empty */}
          <div className="flex items-center min-h-[48px]">
            {companyProfile?.logoUrl ? (
              <img
                src={companyProfile.logoUrl}
                alt={companyName || "Logo"}
                className="max-h-20 max-w-[220px] object-contain"
              />
            ) : null}
          </div>

          {/* Right Side: Real Company & Branch details */}
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
          {/* Row 1: Outlet Name spanning entire top row */}
          <div className="border-b border-black p-2 flex">
            <span className="font-bold w-28">Outlet Name :</span>
            <span className="font-semibold">{invoice.clientName}</span>
          </div>

          {/* Row 2: Contact on left, Chalan No on right */}
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

          {/* Row 3: Address on left, Date on right */}
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

        {/* Chalan Goods Table: SL#, Description of Goods, Item Code, Quantity (No prices or financial totals!) */}
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
            {/* Filler rows if items are few */}
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

        {/* Chalan Signatures: Prepared By | Checked By | Receive By */}
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
};
