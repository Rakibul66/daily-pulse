import React, { useState, useEffect } from 'react';
import { Promotion, PromotionType } from '@/types/customer';
import { X, Tag, Percent, Clock, Check, Loader2 } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: Omit<Promotion, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  initialData?: Promotion | null;
}

export const PromotionModal: React.FC<Props> = ({ isOpen, onClose, onSave, initialData }) => {
  const [formData, setFormData] = useState<Omit<Promotion, 'id' | 'createdAt' | 'updatedAt'>>({
    userId: '',
    title: '',
    type: 'HAPPY_HOUR',
    discountType: 'PERCENTAGE',
    discountValue: 10,
    startDate: new Date().toISOString().split('T')[0],
    endDate: '',
    startTime: '16:00',
    endTime: '19:00',
    applicableDays: ['Everyday'],
    isActive: true,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (initialData) {
      setFormData({
        userId: initialData.userId,
        title: initialData.title,
        type: initialData.type,
        discountType: initialData.discountType,
        discountValue: initialData.discountValue,
        startDate: initialData.startDate,
        endDate: initialData.endDate || '',
        startTime: initialData.startTime || '16:00',
        endTime: initialData.endTime || '19:00',
        applicableDays: initialData.applicableDays,
        isActive: initialData.isActive,
      });
    } else {
      setFormData({
        userId: '',
        title: '',
        type: 'HAPPY_HOUR',
        discountType: 'PERCENTAGE',
        discountValue: 10,
        startDate: new Date().toISOString().split('T')[0],
        endDate: '',
        startTime: '16:00',
        endTime: '19:00',
        applicableDays: ['Everyday'],
        isActive: true,
      });
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else if (name === 'discountValue') {
      setFormData(prev => ({ ...prev, [name]: Number(value) }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleDaysChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    if (val === 'Everyday') {
      setFormData(prev => ({ ...prev, applicableDays: ['Everyday'] }));
    } else if (val === 'Weekends') {
      setFormData(prev => ({ ...prev, applicableDays: ['Friday', 'Saturday'] }));
    } else if (val === 'Weekdays') {
      setFormData(prev => ({ ...prev, applicableDays: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday'] }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await onSave(formData);
      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputClasses = "w-full text-xs sm:text-sm font-bold text-black bg-white px-3.5 py-2.5 border-2 border-black shadow-[2px_2px_0px_#000] focus:outline-none focus:bg-[#fffdf0] focus:border-indigo-600 rounded-none transition-all placeholder:text-slate-400";
  const labelClasses = "text-xs font-black uppercase tracking-wider text-black block mb-1.5";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 md:p-8 pt-8 sm:pt-14 pb-8 sm:pb-14 bg-black/70 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-lg max-h-[85vh] bg-white border-4 border-black shadow-[8px_8px_0px_#000] sm:shadow-[12px_12px_0px_#000] my-auto flex flex-col overflow-hidden text-black animate-in fade-in zoom-in-95 duration-200">
        
        {/* Top Accent Strip */}
        <div className="h-2.5 bg-gradient-to-r from-amber-400 via-indigo-600 to-emerald-500 border-b-2 border-black shrink-0" />

        {/* Modal Header */}
        <div className="px-5 sm:px-6 py-4 border-b-3 border-black bg-white flex items-center justify-between gap-4 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 bg-amber-300 border-2 sm:border-3 border-black shadow-[2px_2px_0px_#000] flex items-center justify-center text-black shrink-0">
              <Tag className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div>
              <h2 className="font-display font-black text-lg sm:text-xl uppercase tracking-tight text-black leading-tight">
                {initialData ? 'Edit Promotion' : 'Create New Offer'}
              </h2>
              <p className="text-[11px] font-bold text-slate-600 uppercase tracking-wide">
                Configure discount rules and timing
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            type="button"
            className="p-1.5 bg-white hover:bg-red-600 hover:text-white border-2 border-black shadow-[2px_2px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 transition-all cursor-pointer"
            aria-label="Close Modal"
          >
            <X className="w-5 h-5 stroke-[2.5]" />
          </button>
        </div>

        {/* Form Body */}
        <div className="p-5 sm:p-6 overflow-y-auto flex-1 custom-scrollbar">
          <form id="promo-form" onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className={labelClasses}>Offer Title <span className="text-red-600">*</span></label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className={inputClasses}
                placeholder="e.g. Weekend Happy Hour, 15% Off Lunch"
                required
              />
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className={labelClasses}>Promotion Type</label>
                <select name="type" value={formData.type} onChange={handleChange} className={inputClasses}>
                  <option value="HAPPY_HOUR">Happy Hour</option>
                  <option value="TIME_BASED">Time-based Discount</option>
                  <option value="FLAT_DISCOUNT">Flat Discount</option>
                  <option value="BOGO">Buy 1 Get 1 (BOGO)</option>
                </select>
              </div>
              <div>
                <label className={labelClasses}>Applicable Days</label>
                <select
                  name="applicableDays"
                  value={formData.applicableDays.includes('Everyday') ? 'Everyday' : formData.applicableDays.includes('Friday') && formData.applicableDays.length === 2 ? 'Weekends' : 'Weekdays'}
                  onChange={handleDaysChange}
                  className={inputClasses}
                >
                  <option value="Everyday">Everyday</option>
                  <option value="Weekends">Weekends Only</option>
                  <option value="Weekdays">Weekdays Only</option>
                </select>
              </div>
            </div>

            {/* Discount Value Box */}
            <div className="bg-amber-50/60 p-4 border-2 border-black shadow-[2px_2px_0px_#000]">
              <h4 className="text-xs font-black text-black uppercase tracking-wider mb-2.5 flex items-center gap-2">
                <Percent className="w-3.5 h-3.5" /> Discount Value
              </h4>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={labelClasses}>Amount <span className="text-red-600">*</span></label>
                  <input type="number" name="discountValue" value={formData.discountValue} onChange={handleChange} className={inputClasses} required />
                </div>
                <div>
                  <label className={labelClasses}>Type</label>
                  <select name="discountType" value={formData.discountType} onChange={handleChange} className={inputClasses}>
                    <option value="PERCENTAGE">% Percentage</option>
                    <option value="FIXED">৳ Fixed Amount</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Validity & Timing Box */}
            <div className="bg-slate-50 p-4 border-2 border-black shadow-[2px_2px_0px_#000]">
              <h4 className="text-xs font-black text-black uppercase tracking-wider mb-2.5 flex items-center gap-2">
                <Clock className="w-3.5 h-3.5" /> Validity &amp; Timing
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
                <div>
                  <label className={labelClasses}>Start Date</label>
                  <input type="date" name="startDate" value={formData.startDate} onChange={handleChange} className={inputClasses} required />
                </div>
                <div>
                  <label className={labelClasses}>End Date (Optional)</label>
                  <input type="date" name="endDate" value={formData.endDate} onChange={handleChange} className={inputClasses} />
                </div>
              </div>
              
              {(formData.type === 'HAPPY_HOUR' || formData.type === 'TIME_BASED') && (
                <div className="grid grid-cols-2 gap-3 pt-3 border-t-2 border-black">
                  <div>
                    <label className={labelClasses}>Start Time</label>
                    <input type="time" name="startTime" value={formData.startTime} onChange={handleChange} className={inputClasses} required />
                  </div>
                  <div>
                    <label className={labelClasses}>End Time</label>
                    <input type="time" name="endTime" value={formData.endTime} onChange={handleChange} className={inputClasses} required />
                  </div>
                </div>
              )}
            </div>

            {/* Active Toggle Checkbox */}
            <div className="flex items-center gap-2.5 pt-1">
              <input
                type="checkbox"
                id="isActive"
                name="isActive"
                checked={formData.isActive}
                onChange={handleChange}
                className="w-5 h-5 border-2 border-black rounded-none text-emerald-600 focus:ring-0 cursor-pointer shadow-[2px_2px_0px_#000]"
              />
              <label htmlFor="isActive" className="text-xs font-black uppercase tracking-wider text-black cursor-pointer select-none">
                Active Promotion (Enable for POS checkouts)
              </label>
            </div>

          </form>
        </div>

        {/* Modal Footer */}
        <div className="px-5 sm:px-6 py-4 border-t-3 border-black bg-white flex items-center justify-end gap-3 shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 bg-white hover:bg-slate-100 border-2 border-black font-black text-xs uppercase tracking-wider text-black shadow-[2px_2px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 transition-all cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="submit"
            form="promo-form"
            disabled={isSubmitting}
            className="px-6 py-2.5 bg-emerald-400 hover:bg-emerald-300 border-2 sm:border-3 border-black font-black text-xs sm:text-sm uppercase tracking-wider text-black shadow-[3px_3px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 transition-all flex items-center gap-2 disabled:opacity-50 cursor-pointer"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-black" />
                <span>Saving...</span>
              </>
            ) : (
              <>
                <Check className="w-4 h-4 stroke-[3]" />
                <span>Save Promotion</span>
              </>
            )}
          </button>
        </div>

      </div>
    </div>
  );
};
