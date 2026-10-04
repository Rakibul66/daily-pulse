import React, { useState } from 'react';
import { LostItem } from '@/types/lostAndFound';
import { X } from 'lucide-react';

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

  const inputClasses = "w-full text-sm font-medium text-white bg-slate-950 px-3 py-2.5 rounded-md border border-slate-700 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 placeholder-slate-600";
  const labelClasses = "text-xs font-semibold text-slate-300 block mb-1.5";

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-xl shadow-xl w-full max-w-lg flex flex-col animate-in zoom-in-95 duration-200">
        <div className="px-6 py-4 flex flex-col border-b border-slate-800 relative">
          <h2 className="text-lg font-bold text-white">Confirm Guest Handover</h2>
          <p className="text-xs text-slate-400 mt-1">Verify guest identity before releasing item from safe.</p>
          <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors p-1">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div className="p-4 bg-slate-950 border border-slate-800 rounded-lg">
            <h3 className="text-base font-bold text-white mb-1">{item.itemName}</h3>
            <p className="text-xs text-slate-400">Found at {item.locationFound || 'Unknown'} · Currently in {item.storageNote || 'Storage'}</p>
          </div>

          <form id="handover-form" onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className={labelClasses}>Claimant Name (Guest / Owner)*</label>
              <input type="text" value={claimantName} onChange={(e) => setClaimantName(e.target.value)} className={inputClasses} placeholder="e.g. Mr. Tanvir Ahmed" required />
            </div>

            <div>
              <label className={labelClasses}>Phone Number / NID Reference</label>
              <input type="text" value={claimantPhone} onChange={(e) => setClaimantPhone(e.target.value)} className={inputClasses} placeholder="e.g. +8801711223344" required />
            </div>
          </form>
        </div>

        <div className="px-6 py-5 border-t border-slate-800 bg-slate-900/50 flex justify-end gap-3 rounded-b-xl">
          <button type="button" onClick={onClose} className="px-5 py-2.5 text-sm font-semibold text-slate-300 bg-slate-800 border border-slate-700 rounded-md hover:bg-slate-700 transition-colors">
            Cancel
          </button>
          <button type="submit" form="handover-form" disabled={isSubmitting} className="px-5 py-2.5 text-sm font-bold text-white bg-emerald-600 rounded-md hover:bg-emerald-500 disabled:opacity-50 transition-colors shadow-md">
            {isSubmitting ? 'Processing...' : 'Confirm Handover'}
          </button>
        </div>
      </div>
    </div>
  );
};
