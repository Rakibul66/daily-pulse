"use client";

import React, { useState } from 'react';
import { LostItem } from '@/types/lostAndFound';
import { X, ShieldCheck } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  item: LostItem | null;
  onConfirm: (id: string, name: string, phone: string) => Promise<void>;
}

export const HandoverModal: React.FC<Props> = ({ isOpen, onClose, item, onConfirm }) => {
  const [claimantName, setClaimantName] = useState('');
  const [claimantPhone, setClaimantPhone] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen || !item) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await onConfirm(item.id, claimantName, claimantPhone);
      setClaimantName('');
      setClaimantPhone('');
      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputClasses = "w-full text-xs font-bold text-black bg-white px-3 py-2 border-2 border-black shadow-[2px_2px_0px_#000] focus:outline-hidden focus:ring-2 focus:ring-black placeholder:text-slate-400";
  const labelClasses = "text-xs font-black uppercase tracking-wider text-black block mb-1";

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
      <div className="bg-white border-4 border-black shadow-[8px_8px_0px_#000] w-full max-w-lg flex flex-col text-black">
        {/* Modal Header */}
        <div className="p-4 border-b-4 border-black flex items-center justify-between bg-slate-900 text-white">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-400 stroke-[2.5]" />
            <h2 className="text-base font-display font-black uppercase tracking-wider text-white">
              Confirm Guest Handover
            </h2>
          </div>
          <button 
            onClick={onClose} 
            className="p-1 bg-white hover:bg-amber-300 text-black border-2 border-black shadow-[2px_2px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 cursor-pointer transition-all"
          >
            <X className="w-4 h-4 stroke-[3]" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-5">
          <div className="p-4 bg-amber-50 border-2 border-black shadow-[2px_2px_0px_#000]">
            <h3 className="text-sm font-display font-black text-black mb-1">{item.itemName}</h3>
            <p className="text-xs font-bold text-slate-700">
              Found at {item.locationFound || 'Venue'} • Stored in {item.storageNote || 'Vault #1'}
            </p>
          </div>

          <form id="handover-form" onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className={labelClasses}>
                Claimant Name (Guest / Owner) <span className="text-red-600">*</span>
              </label>
              <input 
                type="text" 
                value={claimantName} 
                onChange={(e) => setClaimantName(e.target.value)} 
                className={inputClasses} 
                placeholder="e.g. Mr. Tanvir Ahmed" 
                required 
              />
            </div>

            <div>
              <label className={labelClasses}>
                Phone Number / NID Reference <span className="text-red-600">*</span>
              </label>
              <input 
                type="text" 
                value={claimantPhone} 
                onChange={(e) => setClaimantPhone(e.target.value)} 
                className={inputClasses} 
                placeholder="e.g. +8801711223344" 
                required 
              />
            </div>
          </form>
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t-4 border-black bg-white flex justify-end gap-3">
          <button 
            type="button" 
            onClick={onClose} 
            className="px-5 py-2 text-xs font-black uppercase text-black bg-white hover:bg-slate-100 border-2 border-black shadow-[2px_2px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 cursor-pointer transition-all"
          >
            Cancel
          </button>
          <button 
            type="submit" 
            form="handover-form" 
            disabled={isSubmitting} 
            className="px-6 py-2 text-xs font-black uppercase text-black bg-emerald-400 hover:bg-emerald-500 border-2 border-black shadow-[3px_3px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 cursor-pointer transition-all disabled:opacity-50"
          >
            {isSubmitting ? 'Processing...' : 'CONFIRM HANDOVER'}
          </button>
        </div>
      </div>
    </div>
  );
};
