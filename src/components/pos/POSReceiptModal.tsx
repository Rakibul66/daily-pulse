"use client";

import React from 'react';
import { Printer, X } from 'lucide-react';
import { POSCompletedInvoice } from './types';
import { CompanyProfile } from '@/types/company';

interface POSReceiptModalProps {
  isOpen: boolean;
  completedInvoice: POSCompletedInvoice | null;
  companyProfile: CompanyProfile | null;
  companyDisplayName: string;
  displayAddress: string;
  displayPhone: string;
  onClose: () => void;
  onDone: () => void;
}

export const POSReceiptModal: React.FC<POSReceiptModalProps> = ({
  isOpen,
  completedInvoice,
  companyProfile,
  companyDisplayName,
  displayAddress,
  displayPhone,
  onClose,
  onDone,
}) => {
  if (!isOpen || !completedInvoice) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white border-2 sm:border-4 border-black shadow-[6px_6px_0px_#000] sm:shadow-[12px_12px_0px_#000] max-w-sm sm:max-w-md w-full p-4 sm:p-6 relative max-h-[90vh] overflow-y-auto">
        
        {/* Modal Controls */}
        <div className="flex items-center justify-between pb-3 mb-3 border-b-2 border-black">
          <h3 className="font-display font-black text-xs sm:text-sm uppercase flex items-center gap-2">
            <Printer className="w-4 h-4 sm:w-5 sm:h-5 text-indigo-600" />
            THERMAL RECEIPT PREVIEW (80mm)
          </h3>
          <button 
            type="button"
            onClick={onClose}
            className="p-1 hover:bg-slate-100 border-2 border-black cursor-pointer"
          >
            <X className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        </div>

        {/* Printable Thermal Receipt Paper Container */}
        <div id="thermal-receipt" className="bg-white border-2 border-dashed border-black p-3 sm:p-4 font-mono text-xs text-black leading-tight">
          
          {/* Receipt Header - ONLY REAL COMPANY DATA, ZERO FAKE TEXT */}
          <div className="text-center pb-3 border-b border-dashed border-black">
            {companyProfile?.logoUrl && (
              <img 
                src={companyProfile.logoUrl} 
                alt={companyDisplayName} 
                className="max-h-12 mx-auto mb-1.5 object-contain"
              />
            )}
            <h2 className="text-sm sm:text-base font-black uppercase tracking-wider">{companyDisplayName}</h2>
            {displayAddress && <p className="text-[10px] text-slate-700">{displayAddress}</p>}
            {displayPhone && <p className="text-[10px] text-slate-700">Phone: {displayPhone}</p>}
            <p className="text-[10px] mt-1 font-bold">INVOICE: #{completedInvoice.invoiceNo}</p>
            <p className="text-[10px] text-slate-500">{completedInvoice.date}</p>
          </div>

          {/* Customer / Cashier info */}
          <div className="py-2 border-b border-dashed border-black text-[11px]">
            <p><span className="font-bold">Customer:</span> {completedInvoice.customerName}</p>
            {completedInvoice.customerPhone && completedInvoice.customerPhone !== 'N/A' && (
              <p><span className="font-bold">Phone:</span> {completedInvoice.customerPhone}</p>
            )}
            <p><span className="font-bold">Account:</span> {completedInvoice.cashHead}</p>
          </div>

          {/* Itemized Table */}
          <div className="py-2 border-b border-dashed border-black">
            <div className="flex justify-between font-black pb-1 text-[10px] uppercase">
              <span className="w-6">QTY</span>
              <span className="flex-1 text-left px-1">ITEM</span>
              <span className="w-12 text-right">RATE</span>
              <span className="w-14 text-right">TOTAL</span>
            </div>
            <div className="space-y-1">
              {completedInvoice.items.map((it) => (
                <div key={it.id} className="flex justify-between text-[11px]">
                  <span className="w-6">{it.qty}x</span>
                  <span className="flex-1 text-left px-1 truncate">{it.name}</span>
                  <span className="w-12 text-right">{it.rate}</span>
                  <span className="w-14 text-right font-bold">৳{(it.rate * it.qty - it.discount).toLocaleString()}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Totals */}
          <div className="py-2 space-y-1 text-right text-[11px] border-b border-dashed border-black">
            <div className="flex justify-between">
              <span>Subtotal:</span>
              <span>৳{completedInvoice.subtotal.toLocaleString()}</span>
            </div>
            {completedInvoice.discount > 0 && (
              <div className="flex justify-between font-bold">
                <span>Discount:</span>
                <span>- ৳{completedInvoice.discount.toLocaleString()}</span>
              </div>
            )}
            <div className="flex justify-between text-xs font-black pt-1 border-t border-black">
              <span>NET PAYABLE:</span>
              <span>৳{completedInvoice.netPayable.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span>Paid:</span>
              <span>৳{completedInvoice.cashPaid.toLocaleString()}</span>
            </div>
            <div className="flex justify-between font-bold">
              <span>Change:</span>
              <span>৳{completedInvoice.changeAmount.toLocaleString()}</span>
            </div>
          </div>

          {/* Barcode & Footer Notice */}
          <div className="text-center pt-3">
            <p className="font-mono text-sm tracking-widest font-black">|||||||||||||||||||||||||||||</p>
            <p className="text-[10px] font-bold mt-1 uppercase">THANK YOU FOR YOUR PURCHASE!</p>
          </div>

        </div>

        {/* Print & Action Buttons */}
        <div className="flex gap-2 sm:gap-3 mt-4">
          <button
            type="button"
            onClick={() => {
              window.print();
            }}
            className="flex-1 py-2.5 sm:py-3 bg-[#20B2AA] hover:bg-[#1A9C96] text-white font-black text-xs uppercase border-2 border-black shadow-[2px_2px_0px_#000] sm:shadow-[3px_3px_0px_#000] flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            PRINT NOW
          </button>
          <button
            type="button"
            onClick={onDone}
            className="px-4 sm:px-5 py-2.5 sm:py-3 bg-black hover:bg-slate-800 text-white font-black text-xs uppercase border-2 border-black shadow-[2px_2px_0px_#000] sm:shadow-[3px_3px_0px_#000] cursor-pointer"
          >
            DONE
          </button>
        </div>

      </div>
    </div>
  );
};
