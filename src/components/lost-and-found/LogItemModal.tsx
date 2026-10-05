import React, { useState } from 'react';
import { LostItem } from '@/types/lostAndFound';
import { X, UploadCloud, Info } from 'lucide-react';

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

  const inputClasses = "w-full text-sm font-medium text-white bg-slate-950 px-3 py-2.5 rounded-md border border-slate-700 focus:border-primary-500 focus:ring-1 focus:ring-primary-500 placeholder-slate-600";
  const labelClasses = "text-xs font-semibold text-slate-300 block mb-1.5";
  const helperClasses = "text-[10px] text-slate-500 dark:text-slate-400 mt-1";

  const categories = ['Phone', 'Jewellery', 'Wallet/Purse', 'Keys', 'Clothing', 'Bag/Luggage', 'Electronics', 'Other'];

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col animate-in zoom-in-95 duration-200">
        <div className="px-6 py-4 flex flex-col border-b border-slate-800 relative">
          <h2 className="text-lg font-bold text-white">Log a found item</h2>
          <p className="text-xs text-slate-400 mt-1">Photograph it, describe it broadly, and hold back the one detail only the owner would know.</p>
          <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors p-1">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto custom-scrollbar">
          <form id="log-item-form" onSubmit={handleSubmit} className="space-y-5">
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className={labelClasses}>What was found*</label>
                <input type="text" value={itemName} onChange={(e) => setItemName(e.target.value)} className={inputClasses} placeholder="Black leather wallet" required />
              </div>
              <div>
                <label className={labelClasses}>Kind</label>
                <select value={category} onChange={(e) => setCategory(e.target.value)} className={inputClasses}>
                  {categories.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <div>
                <label className={labelClasses}>Colour</label>
                <input type="text" value={color} onChange={(e) => setColor(e.target.value)} className={inputClasses} placeholder="Black" />
              </div>
              <div>
                <label className={labelClasses}>Date found*</label>
                <input type="date" value={dateFound} onChange={(e) => setDateFound(e.target.value)} className={inputClasses} required />
              </div>
              <div>
                <label className={labelClasses}>Time found</label>
                <input type="time" value={timeFound} onChange={(e) => setTimeFound(e.target.value)} className={inputClasses} />
              </div>
            </div>

            <div>
              <label className={labelClasses}>Where in the venue</label>
              <input type="text" value={locationFound} onChange={(e) => setLocationFound(e.target.value)} className={inputClasses} placeholder="Main hall" />
              <p className={helperClasses}>Shown publicly. Keep it broad: Main hall, Rooftop, Washroom.</p>
            </div>

            <div>
              <label className={labelClasses}>Public description</label>
              <textarea value={publicDescription} onChange={(e) => setPublicDescription(e.target.value)} rows={2} className={`${inputClasses} resize-none`} placeholder="Bifold wallet, worn corners. Found under a window table."></textarea>
              <p className={helperClasses}>Hold back the one detail only the owner would know. That detail is what proves a claim.</p>
            </div>

            <div>
              <label className={labelClasses}>Storage note</label>
              <input type="text" value={storageNote} onChange={(e) => setStorageNote(e.target.value)} className={inputClasses} placeholder="Manager Safe #2" />
              <p className={helperClasses}>Staff only. Never appears on the public page.</p>
            </div>

            <div>
              <label className={labelClasses}>Photo (Optional)</label>
              <div className="w-full border-2 border-dashed border-slate-700 rounded-lg p-6 flex flex-col items-center justify-center text-slate-400 hover:bg-slate-800/50 hover:border-slate-500 transition-colors cursor-pointer">
                <UploadCloud className="w-6 h-6 mb-2" />
                <p className="text-xs text-center px-4">One clear photo. It is what the owner will recognise on the public page, so shoot the whole object, not the serial number.</p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-4 bg-slate-950 border border-slate-800 rounded-lg">
              <input 
                type="checkbox" 
                id="showPublicly" 
                checked={showPublicly}
                onChange={(e) => setShowPublicly(e.target.checked)}
                className="mt-1 w-4 h-4 rounded border-slate-700 text-primary-600 focus:ring-primary-600 focus:ring-offset-slate-950 bg-slate-900"
              />
              <div>
                <label htmlFor="showPublicly" className="text-sm font-bold text-white cursor-pointer">Show on the public page</label>
                <p className="text-xs text-slate-400 mt-0.5">Turn off for anything sensitive - a passport, a bank card - and take those claims by phone instead.</p>
              </div>
            </div>

          </form>
        </div>

        <div className="px-6 py-5 border-t border-slate-800 bg-slate-900/50 flex justify-end gap-3 rounded-b-xl">
          <button type="button" onClick={onClose} className="px-5 py-2.5 text-sm font-semibold text-slate-300 bg-slate-800 border border-slate-700 rounded-md hover:bg-slate-700 transition-colors">
            Cancel
          </button>
          <button type="submit" form="log-item-form" disabled={isSubmitting} className="px-5 py-2.5 text-sm font-bold text-white bg-primary-600 rounded-md hover:bg-primary-500 disabled:opacity-50 transition-colors shadow-md">
            {isSubmitting ? 'Saving...' : 'Log item'}
          </button>
        </div>
      </div>
    </div>
  );
};
