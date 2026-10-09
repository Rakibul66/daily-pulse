"use client";

import React, { useState } from 'react';
import { LostItem } from '@/types/lostAndFound';
import { X, UploadCloud, Package, Plus } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSave: (item: Omit<LostItem, 'id' | 'refNumber' | 'createdAt' | 'updatedAt' | 'status'>) => Promise<void>;
  userId: string;
}

export const LogItemModal: React.FC<Props> = ({ isOpen, onClose, onSave, userId }) => {
  const [itemName, setItemName] = useState('');
  const [category, setCategory] = useState('Phone');
  const [color, setColor] = useState('');
  const [dateFound, setDateFound] = useState(new Date().toISOString().split('T')[0]);
  const [timeFound, setTimeFound] = useState('');
  const [locationFound, setLocationFound] = useState('');
  const [publicDescription, setPublicDescription] = useState('');
  const [storageNote, setStorageNote] = useState('');
  const [showPublicly, setShowPublicly] = useState(true);
  
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await onSave({
        userId,
        itemName,
        category,
        color,
        dateFound,
        timeFound,
        locationFound,
        publicDescription,
        storageNote,
        showPublicly
      });
      // reset
      setItemName(''); setCategory('Phone'); setColor(''); setTimeFound(''); setLocationFound(''); setPublicDescription(''); setStorageNote(''); setShowPublicly(true);
      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputClasses = "w-full text-xs font-bold text-black bg-white px-3 py-2 border-2 border-black shadow-[2px_2px_0px_#000] focus:outline-hidden focus:ring-2 focus:ring-black placeholder:text-slate-400";
  const labelClasses = "text-xs font-black uppercase tracking-wider text-black block mb-1";
  const helperClasses = "text-[11px] font-bold text-slate-600 mt-1";

  const categories = ['Phone', 'Jewellery', 'Wallet/Purse', 'Keys', 'Clothing', 'Bag/Luggage', 'Electronics', 'Other'];

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
      <div className="bg-white border-4 border-black shadow-[8px_8px_0px_#000] w-full max-w-2xl max-h-[90vh] flex flex-col text-black">
        {/* Modal Header */}
        <div className="p-4 border-b-4 border-black flex items-center justify-between bg-slate-900 text-white">
          <div className="flex items-center gap-2">
            <Package className="w-5 h-5 text-amber-300 stroke-[2.5]" />
            <h2 className="text-base font-display font-black uppercase tracking-wider text-white">
              Log a Found Item
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
        <div className="p-6 overflow-y-auto space-y-5">
          <form id="log-item-form" onSubmit={handleSubmit} className="space-y-4">
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className={labelClasses}>What was found <span className="text-red-600">*</span></label>
                <input 
                  type="text" 
                  value={itemName} 
                  onChange={(e) => setItemName(e.target.value)} 
                  className={inputClasses} 
                  placeholder="e.g. Black leather wallet, iPhone 14" 
                  required 
                />
              </div>
              <div>
                <label className={labelClasses}>Category / Kind</label>
                <select 
                  value={category} 
                  onChange={(e) => setCategory(e.target.value)} 
                  className={inputClasses}
                >
                  {categories.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className={labelClasses}>Colour</label>
                <input 
                  type="text" 
                  value={color} 
                  onChange={(e) => setColor(e.target.value)} 
                  className={inputClasses} 
                  placeholder="e.g. Black / Gold" 
                />
              </div>
              <div>
                <label className={labelClasses}>Date found <span className="text-red-600">*</span></label>
                <input 
                  type="date" 
                  value={dateFound} 
                  onChange={(e) => setDateFound(e.target.value)} 
                  className={inputClasses} 
                  required 
                />
              </div>
              <div>
                <label className={labelClasses}>Time found</label>
                <input 
                  type="time" 
                  value={timeFound} 
                  onChange={(e) => setTimeFound(e.target.value)} 
                  className={inputClasses} 
                />
              </div>
            </div>

            <div>
              <label className={labelClasses}>Location found in venue</label>
              <input 
                type="text" 
                value={locationFound} 
                onChange={(e) => setLocationFound(e.target.value)} 
                className={inputClasses} 
                placeholder="e.g. Main Lobby, Counter 3, Washroom" 
              />
              <p className={helperClasses}>Keep it broad: Counter area, Rooftop table, Dressing room.</p>
            </div>

            <div>
              <label className={labelClasses}>Public description</label>
              <textarea 
                value={publicDescription} 
                onChange={(e) => setPublicDescription(e.target.value)} 
                rows={2} 
                className={`${inputClasses} resize-none`} 
                placeholder="Bifold leather wallet, slightly worn. Found under front cashier desk."
              ></textarea>
              <p className={helperClasses}>Hold back private details that only the genuine owner would know to prove ownership.</p>
            </div>

            <div>
              <label className={labelClasses}>Secure storage note (Staff Only)</label>
              <input 
                type="text" 
                value={storageNote} 
                onChange={(e) => setStorageNote(e.target.value)} 
                className={inputClasses} 
                placeholder="e.g. Vault Safe Box #3, Duty Manager Desk" 
              />
              <p className={helperClasses}>Staff only reference. Never appears on public guest directories.</p>
            </div>

            <div className="flex items-start gap-3 p-3.5 bg-amber-50 border-2 border-black shadow-[2px_2px_0px_#000]">
              <input 
                type="checkbox" 
                id="showPublicly" 
                checked={showPublicly}
                onChange={(e) => setShowPublicly(e.target.checked)}
                className="mt-0.5 w-4 h-4 accent-black cursor-pointer"
              />
              <div>
                <label htmlFor="showPublicly" className="text-xs font-black uppercase text-black cursor-pointer">
                  Display in public directory
                </label>
                <p className="text-[11px] font-bold text-slate-600 mt-0.5">
                  Disable for sensitive documents (passport, bank cards, keys) and handle claims via direct customer care.
                </p>
              </div>
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
            form="log-item-form" 
            disabled={isSubmitting} 
            className="px-6 py-2 text-xs font-black uppercase text-black bg-cyan-400 hover:bg-cyan-300 border-2 border-black shadow-[3px_3px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 cursor-pointer transition-all disabled:opacity-50"
          >
            {isSubmitting ? 'Logging...' : 'LOG ITEM TO VAULT'}
          </button>
        </div>
      </div>
    </div>
  );
};
