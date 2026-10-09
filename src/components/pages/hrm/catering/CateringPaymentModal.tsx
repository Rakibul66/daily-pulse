"use client";

import React from "react";
import { CreditCard } from "lucide-react";
import { CateringVendor } from "@/types/catering";

interface CateringPaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  vendors: CateringVendor[];
  selectedVendorForPay: string;
  setSelectedVendorForPay: (v: string) => void;
  payDate: string;
  setPayDate: (d: string) => void;
  payAmount: string;
  setPayAmount: (a: string) => void;
  onSave: (e: React.FormEvent) => void;
}

export const CateringPaymentModal: React.FC<CateringPaymentModalProps> = ({
  isOpen,
  onClose,
  vendors,
  selectedVendorForPay,
  setSelectedVendorForPay,
  payDate,
  setPayDate,
  payAmount,
  setPayAmount,
  onSave
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
      <div className="bg-white border-4 border-black shadow-[10px_10px_0px_#000] w-full max-w-md overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b-2 border-black bg-amber-300">
          <h3 className="font-display font-black text-sm uppercase text-black flex items-center gap-2">
            <CreditCard className="w-4 h-4" /> RECORD VENDOR SETTLEMENT
          </h3>
          <button 
            onClick={onClose} 
            className="w-7 h-7 bg-white border-2 border-black flex items-center justify-center text-black font-black hover:bg-rose-400 cursor-pointer"
          >
            ✕
          </button>
        </div>
        <form onSubmit={onSave} className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-black uppercase text-black mb-1">Select Vendor</label>
            <select 
              required 
              value={selectedVendorForPay} 
              onChange={e => setSelectedVendorForPay(e.target.value)} 
              className="w-full px-3 py-2 text-xs font-bold border-2 border-black bg-white shadow-[2px_2px_0px_#000]"
            >
              {vendors.map(v => <option key={v.id} value={v.id}>{v.name}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-black uppercase text-black mb-1">Payment Date</label>
            <input 
              required 
              type="date" 
              value={payDate} 
              onChange={e => setPayDate(e.target.value)} 
              className="w-full px-3 py-2 text-xs font-bold border-2 border-black bg-white shadow-[2px_2px_0px_#000]" 
            />
          </div>
          <div>
            <label className="block text-xs font-black uppercase text-black mb-1">Amount Paid (৳ BDT)</label>
            <input 
              required 
              type="number" 
              step="any" 
              min="1" 
              value={payAmount} 
              onChange={e => setPayAmount(e.target.value)} 
              className="w-full px-3 py-2 text-xs font-bold border-2 border-black bg-white shadow-[2px_2px_0px_#000]" 
              placeholder="e.g. 1500" 
            />
          </div>
          <div className="pt-4 flex justify-end gap-3 border-t-2 border-black">
            <button 
              type="button" 
              onClick={onClose} 
              className="px-4 py-2 text-xs font-black uppercase text-black bg-slate-100 hover:bg-slate-200 border-2 border-black shadow-[2px_2px_0px_#000] cursor-pointer"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="px-5 py-2 bg-emerald-500 hover:bg-emerald-600 text-black font-black text-xs uppercase border-2 border-black shadow-[3px_3px_0px_#000] cursor-pointer"
            >
              Record Payment
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
