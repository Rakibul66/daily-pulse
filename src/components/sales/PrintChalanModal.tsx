import React from 'react';
import { DailySale } from '@/types/sales';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  invoice: DailySale | null;
}

export const PrintChalanModal: React.FC<Props> = ({ isOpen, onClose, invoice }) => {
  if (!isOpen || !invoice) return null;

  return (
    <div className="fixed inset-0 z-[100] bg-white dark:bg-slate-900 overflow-y-auto print:p-0 p-8">
      
      {/* Non-printable header controls */}
      <div className="max-w-4xl mx-auto flex justify-end gap-4 mb-8 print:hidden">
        <button onClick={onClose} className="px-4 py-2 bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold rounded">Close</button>
        <button onClick={() => window.print()} className="px-4 py-2 bg-blue-600 text-white font-bold rounded shadow">Print Chalan</button>
      </div>

      {/* Printable Area - Exactly matching the Chalan image layout */}
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
          Chalan
        </div>

        {/* Grid Details */}
        <div className="w-full border border-black text-sm mb-4">
          <div className="grid grid-cols-2">
            <div className="border-r border-b border-black p-2 flex"><span className="font-bold w-32">Outlet Name :</span> {invoice.clientName}</div>
            <div className="border-b border-black p-2 flex"><span className="font-bold w-24">Chalan No :</span> {invoice.invoiceNo}</div>
            
            <div className="border-r border-b border-black p-2 flex"><span className="font-bold w-32">Contact :</span> {invoice.clientPhone}</div>
            <div className="border-b border-black p-2 flex"><span className="font-bold w-24">Date :</span> {new Date(invoice.date).toLocaleDateString('en-GB', {day: '2-digit', month: 'short', year: 'numeric'})}</div>
            
            <div className="border-r border-black p-2 flex col-span-2"><span className="font-bold w-32">Address :</span> {invoice.clientAddress || ''}</div>
          </div>
        </div>

        {/* Table */}
        <table className="w-full border-collapse border border-black text-sm mb-16">
          <thead>
            <tr className="border-b border-black">
              <th className="border-r border-black p-2 font-bold w-12">SL#</th>
              <th className="border-r border-black p-2 font-bold text-left">Description of Goods</th>
              <th className="border-r border-black p-2 font-bold text-left w-32">Item Code</th>
              <th className="p-2 font-bold text-left w-32">Quantity</th>
            </tr>
          </thead>
          <tbody>
            {invoice.items.map((item, idx) => (
              <tr key={item.id} className="border-b border-black last:border-b-0">
                <td className="border-r border-black p-2 text-center">{idx + 1}</td>
                <td className="border-r border-black p-2">{item.productName}</td>
                <td className="border-r border-black p-2">{item.itemCode}</td>
                <td className="p-2">{item.quantity.toFixed(2)} ({item.unit})</td>
              </tr>
            ))}
            {/* Fill empty rows to make it look like a standard form if needed */}
            {invoice.items.length < 3 && Array(3 - invoice.items.length).fill(0).map((_, i) => (
              <tr key={`empty-${i}`}>
                <td className="border-r border-black p-2 text-transparent">.</td>
                <td className="border-r border-black p-2"></td>
                <td className="border-r border-black p-2"></td>
                <td className="p-2"></td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Signatures */}
        <div className="flex justify-between items-end mt-24 text-sm font-bold text-center">
          <div className="w-48">
            <div className="italic mb-2">{invoice.salesBy}</div>
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
