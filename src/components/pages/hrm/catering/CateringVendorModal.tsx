"use client";

import React from "react";
import { Store } from "lucide-react";
import { CateringVendor } from "@/types/catering";

interface CateringVendorModalProps {
  isOpen: boolean;
  onClose: () => void;
  editingVendor: CateringVendor | null;
  vendorName: string;
  setVendorName: (v: string) => void;
  perMealRate: string;
  setPerMealRate: (r: string) => void;
  billingFreq: 'Daily' | 'Weekly' | 'Monthly';
  setBillingFreq: (f: 'Daily' | 'Weekly' | 'Monthly') => void;
  onSave: (e: React.FormEvent) => void;
}

export const CateringVendorModal: React.FC<CateringVendorModalProps> = ({
  isOpen,
  onClose,
  editingVendor,
  vendorName,
  setVendorName,
  perMealRate,
  setPerMealRate,
  billingFreq,
  setBillingFreq,
  onSave
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
      <div className="bg-white border-4 border-black shadow-[10px_10px_0px_#000] w-full max-w-md overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b-2 border-black bg-amber-300">
          <h3 className="font-display font-black text-sm uppercase text-black flex items-center gap-2">
            <Store className="w-4 h-4" /> {editingVendor ? 'EDIT VENDOR' : 'ADD VENDOR / DOKAN'}
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
            <label className="block text-xs font-black uppercase text-black mb-1">Vendor Name</label>
            <input 
              required 
              type="text" 
              value={vendorName} 
              onChange={e => setVendorName(e.target.value)} 
              className="w-full px-3 py-2 text-xs font-bold border-2 border-black bg-white shadow-[2px_2px_0px_#000]" 
              placeholder="e.g. Rahim Dokan, Khans Catering" 
            />
          </div>
          <div>
            <label className="block text-xs font-black uppercase text-black mb-1">Default Meal Rate (৳)</label>
            <input 
              required 
              type="number" 
              step="any" 
              min="0" 
              value={perMealRate} 
              onChange={e => setPerMealRate(e.target.value)} 
              className="w-full px-3 py-2 text-xs font-bold border-2 border-black bg-white shadow-[2px_2px_0px_#000]" 
              placeholder="e.g. 130" 
            />
          </div>
          <div>
            <label className="block text-xs font-black uppercase text-black mb-1">Billing Frequency</label>
            <select 
              value={billingFreq} 
              onChange={e => setBillingFreq(e.target.value as 'Daily' | 'Weekly' | 'Monthly')} 
              className="w-full px-3 py-2 text-xs font-bold border-2 border-black bg-white shadow-[2px_2px_0px_#000]"
            >
              <option value="Daily">Daily</option>
              <option value="Weekly">Weekly</option>
              <option value="Monthly">Monthly</option>
            </select>
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
              className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs uppercase border-2 border-black shadow-[3px_3px_0px_#000] cursor-pointer"
            >
              Save Vendor
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
