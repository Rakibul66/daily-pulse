"use client";

import React, { useState } from 'react';
import { Lead } from '@/types/crm';
import { X, Users, ArrowRight, Building, Phone, MapPin, Tag, Check, Loader2 } from 'lucide-react';

interface ConvertLeadModalProps {
  isOpen: boolean;
  lead: Lead | null;
  onClose: () => void;
  onConfirm: (lead: Lead) => Promise<void>;
}

export const ConvertLeadModal: React.FC<ConvertLeadModalProps> = ({
  isOpen,
  lead,
  onClose,
  onConfirm,
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen || !lead) return null;

  const handleConvert = async () => {
    setIsSubmitting(true);
    try {
      await onConfirm(lead);
      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 pt-10 sm:pt-14 overflow-y-auto animate-in fade-in duration-150">
      <div className="bg-white border-2 sm:border-4 border-black shadow-[8px_8px_0px_#000] w-full max-w-md overflow-hidden flex flex-col my-auto animate-in zoom-in-95 duration-200">
        
        {/* Accent Top Strip */}
        <div className="h-2 bg-emerald-400 border-b-2 border-black w-full" />

        {/* Header */}
        <div className="px-5 py-3.5 border-b-2 border-black bg-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 bg-emerald-300 border-2 border-black shadow-[2px_2px_0px_#000]">
              <Users className="w-4 h-4 text-black stroke-[2.5]" />
            </div>
            <div>
              <h2 className="text-sm font-black uppercase tracking-wider text-black">
                Convert to Customer
              </h2>
              <p className="text-[10px] font-bold text-slate-600 uppercase">
                Promote Sales Lead to Active Client
              </p>
            </div>
          </div>
          <button 
            type="button"
            onClick={onClose} 
            disabled={isSubmitting}
            className="p-1 bg-white hover:bg-red-500 hover:text-white border-2 border-black transition-colors cursor-pointer disabled:opacity-50"
          >
            <X className="w-4 h-4 stroke-[3]" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 space-y-4">
          <p className="text-xs font-black uppercase text-black">
            Are you sure you want to convert this lead into an active customer?
          </p>

          {/* Lead Summary Preview Card */}
          <div className="p-4 bg-amber-50 border-2 border-black shadow-[3px_3px_0px_#000] space-y-2.5">
            <div className="flex items-start justify-between gap-2 border-b-2 border-black/15 pb-2">
              <div>
                <p className="text-sm font-black text-black">
                  {lead.businessName || (lead as any).restaurantName || 'Unnamed Lead'}
                </p>
                {lead.ownerName && (
                  <p className="text-[11px] font-bold text-slate-600">
                    Contact: {lead.ownerName}
                  </p>
                )}
              </div>
              <span className="px-2 py-0.5 bg-amber-200 border border-black text-[10px] font-black uppercase text-black">
                {lead.businessType || 'Lead'}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] font-bold text-black">
              {(lead.whatsapp || lead.phone) && (
                <div className="flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-slate-600 stroke-[2.5]" />
                  <span>{lead.whatsapp || lead.phone}</span>
                </div>
              )}
              {lead.locationArea && (
                <div className="flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-slate-600 stroke-[2.5]" />
                  <span className="truncate">{lead.locationArea}</span>
                </div>
              )}
            </div>
          </div>

          {/* Explanation Box */}
          <div className="p-3 bg-slate-100 border-2 border-black text-[11px] font-bold text-slate-700 space-y-1">
            <div className="flex items-center gap-1.5 font-black uppercase text-black">
              <Check className="w-3.5 h-3.5 text-emerald-600 stroke-[3]" />
              <span>What happens next:</span>
            </div>
            <ul className="list-disc list-inside space-y-0.5 text-[10px] text-slate-700 font-semibold pl-1">
              <li>Profile registered in <strong>Customers Directory</strong></li>
              <li>Lead status updated to <strong>WON</strong></li>
              <li>Loyalty tier &amp; points tracking activated</li>
            </ul>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-5 py-3 border-t-2 border-black bg-slate-50 flex items-center justify-end gap-3">
          <button 
            type="button" 
            onClick={onClose} 
            disabled={isSubmitting}
            className="px-4 py-2 text-xs font-black uppercase text-black bg-white hover:bg-slate-200 border-2 border-black transition-all cursor-pointer shadow-[2px_2px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 disabled:opacity-50"
          >
            Cancel
          </button>
          <button 
            type="button" 
            onClick={handleConvert}
            disabled={isSubmitting} 
            className="flex items-center gap-2 px-5 py-2 text-xs font-black uppercase text-black bg-emerald-400 hover:bg-emerald-300 border-2 border-black transition-all cursor-pointer shadow-[2px_2px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 disabled:opacity-50"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Converting...</span>
              </>
            ) : (
              <>
                <Users className="w-3.5 h-3.5 stroke-[2.5]" />
                <span>Convert to Customer</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
