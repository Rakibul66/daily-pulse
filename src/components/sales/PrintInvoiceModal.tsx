import React from 'react';
import { DailySale } from '@/types/sales';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  invoice: DailySale | null;
}

const numberToWords = (num: number): string => {
  // A simple dummy implementation for "In words" for the sake of the UI matching
  return num.toString() + " Taka Only";
};

export const PrintInvoiceModal: React.FC<Props> = ({ isOpen, onClose, invoice }) => {
  if (!isOpen || !invoice) return null;

  return (
    <div className="fixed inset-0 z-[100] bg-white dark:bg-slate-900 overflow-y-auto print:p-0 p-8">
      
      {/* Non-printable header controls */}
      <div className="max-w-4xl mx-auto flex justify-end gap-4 mb-8 print:hidden">
        <button onClick={onClose} className="px-4 py-2 bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold rounded">Close</button>
        <button onClick={() => window.print()} className="px-4 py-2 bg-purple-600 text-white font-bold rounded shadow">Print Invoice</button>
      </div>

      {/* Printable Area - Exactly matching the Invoice image layout */}
      <div className="max-w-4xl mx-auto bg-white dark:bg-slate-900 p-8 border border-slate-200 dark:border-slate-700 print:border-none print:p-0 text-black">
        
        {/* Header */}
        <div className="flex justify-between items-start mb-6">
          <div className="text-4xl font-black text-[#20B2AA] tracking-tighter">APPPRO<span className="text-2xl text-slate-500 dark:text-slate-400 font-normal">ERP</span></div>
          <div className="text-right">
            <h1 className="text-2xl font-black italic">{invoice.companyName}</h1>
            <p className="text-sm mt-1">House # 10/B Road No 6, Dhaka 1205</p>
            <p className="text-sm">01552344239, info@technoparkbd.com, Website: www.technoparkbd.com</p>
          </div>
        </div>

        {/* Title */}
        <div className="w-full bg-slate-200 dark:bg-slate-700 text-center py-1 font-bold text-lg border border-black mb-4">
          Invoice
        </div>

        {/* Grid Details */}
        <div className="w-full border border-black text-sm mb-4">
          <div className="grid grid-cols-2">
            <div className="border-r border-b border-black p-2 flex"><span className="font-bold w-32">Invoice No :</span> {invoice.invoiceNo}</div>
            <div className="border-b border-black p-2 flex"><span className="font-bold w-32">Invoice Date :</span> {new Date(invoice.date).toLocaleDateString('en-GB', {day: '2-digit', month: 'short', year: 'numeric'})}</div>
            
            <div className="border-r border-b border-black p-2 flex"><span className="font-bold w-32">Client Name :</span> {invoice.clientName}</div>
            <div className="border-b border-black p-2 flex"><span className="font-bold w-32">Contact Number :</span> {invoice.clientPhone}</div>
            
            <div className="border-r border-black p-2 flex col-span-2"><span className="font-bold w-32">Address :</span> {invoice.clientAddress || ''}</div>
          </div>
        </div>

        {/* Table & Summaries */}
        <div className="w-full border border-black text-sm mb-4 flex flex-col">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-black">
                <th className="border-r border-black p-2 font-bold w-12">SL#</th>
                <th className="border-r border-black p-2 font-bold text-left">Product Name</th>
                <th className="border-r border-black p-2 font-bold text-left w-24">Quantity</th>
                <th className="border-r border-black p-2 font-bold text-left w-24">Rate</th>
                <th className="p-2 font-bold text-right w-32">Amount</th>
              </tr>
            </thead>
            <tbody>
              {invoice.items.map((item, idx) => (
                <tr key={item.id} className="border-b border-dashed border-slate-400 last:border-b-0">
                  <td className="border-r border-dashed border-slate-400 p-2 text-center">{idx + 1}</td>
                  <td className="border-r border-dashed border-slate-400 p-2">{item.productName}</td>
                  <td className="border-r border-dashed border-slate-400 p-2">{item.quantity.toFixed(2)}</td>
                  <td className="border-r border-dashed border-slate-400 p-2">{item.rate.toFixed(2)}</td>
                  <td className="p-2 text-right">{item.amount.toFixed(2)}</td>
                </tr>
              ))}
              
              {/* Summary Rows */}
              <tr className="border-t border-black">
                <td colSpan={2} rowSpan={3} className="border-r border-dashed border-slate-400 p-2 align-top">
                  <span className="font-bold">In words :</span> {numberToWords(invoice.netInvoiceAmount)}
                </td>
                <td colSpan={2} className="border-r border-dashed border-slate-400 p-2 text-right font-bold">Total Amount :</td>
                <td className="p-2 text-right">{invoice.totalAmount.toFixed(2)}</td>
              </tr>
              <tr className="border-t border-dashed border-slate-400">
                <td colSpan={2} className="border-r border-dashed border-slate-400 p-2 text-right font-bold">Discount Amount :</td>
                <td className="p-2 text-right">{invoice.discountAmount.toFixed(2)}</td>
              </tr>
              <tr className="border-t border-dashed border-slate-400">
                <td colSpan={2} className="border-r border-dashed border-slate-400 p-2 text-right font-bold">Net Invoice Amount :</td>
                <td className="p-2 text-right">{invoice.netInvoiceAmount.toFixed(2)}</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Ledger Summaries */}
        <div className="w-full border border-black text-sm">
          <table className="w-full">
            <tbody>
              <tr className="border-b border-dashed border-slate-400">
                <td className="p-2 text-right font-bold border-r border-dashed border-slate-400">Opening :</td>
                <td className="p-2 text-right w-32">{invoice.openingBalance.toFixed(2)}</td>
              </tr>
              <tr>
                <td className="p-2 text-right font-bold border-r border-dashed border-slate-400">Net Payable :</td>
                <td className="p-2 text-right w-32">{invoice.netPayable.toFixed(2)}</td>
              </tr>
            </tbody>
          </table>
        </div>

      </div>
    </div>
  );
};
