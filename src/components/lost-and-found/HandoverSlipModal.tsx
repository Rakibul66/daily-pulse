"use client";

import React from 'react';
import { LostItem } from '@/types/lostAndFound';
import { X, Printer, ShieldCheck } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  item: LostItem | null;
}

export const HandoverSlipModal: React.FC<Props> = ({ isOpen, onClose, item }) => {
  if (!isOpen || !item) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 print:bg-white print:p-0 animate-in fade-in">
      <div className="bg-white border-4 border-black shadow-[8px_8px_0px_#000] w-full max-w-lg flex flex-col text-black print:border-none print:shadow-none print:w-full print:max-w-none">
        
        {/* Header - hide on print */}
        <div className="p-4 border-b-4 border-black flex items-center justify-between bg-slate-900 text-white print:hidden">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-amber-300 stroke-[2.5]" />
            <div>
              <h2 className="text-base font-display font-black uppercase tracking-wider text-white">
                Verified Handover Slip
              </h2>
              <p className="text-[11px] font-mono font-bold text-amber-300 mt-0.5">REF #{item.refNumber}</p>
            </div>
          </div>
          <button 
            onClick={onClose} 
            className="p-1 bg-white hover:bg-amber-300 text-black border-2 border-black shadow-[2px_2px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 cursor-pointer transition-all"
          >
            <X className="w-4 h-4 stroke-[3]" />
          </button>
        </div>

        {/* Printable Slip Area */}
        <div className="p-6 sm:p-8 space-y-6">
          <div className="hidden print:block mb-8 text-center border-b-2 border-black pb-4">
            <h1 className="text-2xl font-display font-black uppercase text-black">Verified Handover Slip</h1>
            <p className="text-sm font-mono font-bold text-slate-700 mt-1">REF #{item.refNumber}</p>
          </div>

          <div className="border-2 sm:border-4 border-black bg-amber-50 p-6 space-y-4 shadow-[4px_4px_0px_#000] print:shadow-none">
            <div className="flex justify-between items-start border-b border-black/10 pb-2">
              <span className="text-xs font-black uppercase tracking-wider text-slate-700">Property Description:</span>
              <span className="text-sm font-black text-black text-right">{item.itemName}</span>
            </div>
            <div className="flex justify-between items-start border-b border-black/10 pb-2">
              <span className="text-xs font-black uppercase tracking-wider text-slate-700">Category:</span>
              <span className="text-xs font-black text-black text-right uppercase tracking-wider">{item.category}</span>
            </div>
            <div className="flex justify-between items-start border-b border-black/10 pb-2">
              <span className="text-xs font-black uppercase tracking-wider text-slate-700">Found Date:</span>
              <span className="text-xs font-mono font-bold text-black text-right">{new Date(item.dateFound).toLocaleDateString()}</span>
            </div>
            <div className="flex justify-between items-start border-b border-black/10 pb-2">
              <span className="text-xs font-black uppercase tracking-wider text-slate-700">Claimant Verified:</span>
              <span className="text-sm font-black text-emerald-800 text-right bg-emerald-100 px-2 py-0.5 border border-black">{item.claimantName} ({item.claimantPhone})</span>
            </div>
            <div className="flex justify-between items-start">
              <span className="text-xs font-black uppercase tracking-wider text-slate-700">Released From:</span>
              <span className="text-xs font-mono font-bold text-black text-right">{item.storageNote || 'Main Storage Vault'}</span>
            </div>
          </div>

          <div className="pt-8 flex justify-between items-end border-t-2 border-dashed border-black mt-6">
            <div className="w-40 border-t-2 border-black text-center pt-2">
              <span className="text-xs font-black uppercase text-slate-700">Guest Signature</span>
            </div>
            <div className="w-40 border-t-2 border-black text-center pt-2">
              <span className="text-xs font-black uppercase text-slate-700">Duty Manager</span>
            </div>
          </div>
        </div>

        {/* Footer - hide on print */}
        <div className="p-4 border-t-4 border-black bg-white flex justify-end gap-3 print:hidden">
          <button 
            type="button" 
            onClick={onClose} 
            className="px-5 py-2 text-xs font-black uppercase text-black bg-white hover:bg-slate-100 border-2 border-black shadow-[2px_2px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 cursor-pointer transition-all"
          >
            Close
          </button>
          <button 
            type="button" 
            onClick={handlePrint} 
            className="px-5 py-2 text-xs font-black uppercase text-black bg-amber-300 hover:bg-amber-400 border-2 border-black shadow-[3px_3px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Printer className="w-4 h-4 stroke-[2.5]" /> Print Slip
          </button>
        </div>
      </div>
    </div>
  );
};
