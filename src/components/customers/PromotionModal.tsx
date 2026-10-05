import React, { useState, useEffect } from 'react';
import { Promotion, PromotionType, DiscountType } from '@/types/customer';
import { X, Clock, Tag, Percent } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSave: (promo: Omit<Promotion, 'id' | 'userId' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  initialData?: Promotion | null;
}

export const PromotionModal: React.FC<Props> = ({ isOpen, onClose, onSave, initialData }) => {
  const [formData, setFormData] = useState({
    title: '',
    type: 'HAPPY_HOUR' as PromotionType,
    discountValue: 0,
    discountType: 'PERCENTAGE' as DiscountType,
    startDate: new Date().toISOString().split('T')[0],
    endDate: '',
    startTime: '',
    endTime: '',
    applicableDays: ['Everyday'],
    isActive: true,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        setFormData({
          title: initialData.title || '',
          type: initialData.type || 'HAPPY_HOUR',
          discountValue: initialData.discountValue || 0,
          discountType: initialData.discountType || 'PERCENTAGE',
          startDate: initialData.startDate || new Date().toISOString().split('T')[0],
          endDate: initialData.endDate || '',
          startTime: initialData.startTime || '',
          endTime: initialData.endTime || '',
          applicableDays: initialData.applicableDays?.length ? initialData.applicableDays : ['Everyday'],
          isActive: initialData.isActive !== false,
        });
      } else {
        setFormData({
          title: '',
          type: 'HAPPY_HOUR',
          discountValue: 10,
          discountType: 'PERCENTAGE',
          startDate: new Date().toISOString().split('T')[0],
          endDate: '',
          startTime: '14:00',
          endTime: '17:00',
          applicableDays: ['Everyday'],
          isActive: true,
        });
      }
    }
  }, [isOpen, initialData]);

  if (!isOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else if (type === 'number') {
      setFormData(prev => ({ ...prev, [name]: Number(value) }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleDaysChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    if (value === 'Everyday') {
      setFormData(prev => ({ ...prev, applicableDays: ['Everyday'] }));
    } else if (value === 'Weekends') {
      setFormData(prev => ({ ...prev, applicableDays: ['Friday', 'Saturday'] }));
    } else if (value === 'Weekdays') {
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

  const inputClasses = "w-full text-sm font-bold text-white bg-slate-950 px-3 py-2 rounded-md border border-slate-700 focus:border-primary-500 focus:ring-1 focus:ring-primary-500 placeholder-slate-600";
  const labelClasses = "text-xs font-semibold text-slate-300 block mb-1.5";

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-md shadow-md w-full max-w-lg overflow-hidden flex flex-col animate-in zoom-in-95 duration-200">
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Tag className="w-5 h-5 text-primary-400" />
            <h2 className="text-base font-bold text-white">
              {initialData ? 'Edit Promotion' : 'Create New Promotion'}
            </h2>
          </div>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-white rounded-md transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto">
          <form id="promo-form" onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className={labelClasses}>Offer Title</label>
              <input type="text" name="title" value={formData.title} onChange={handleChange} className={inputClasses} placeholder="e.g. Weekend Happy Hour" required />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
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
                <select name="applicableDays" value={formData.applicableDays.includes('Everyday') ? 'Everyday' : formData.applicableDays.includes('Friday') && formData.applicableDays.length === 2 ? 'Weekends' : 'Weekdays'} onChange={handleDaysChange} className={inputClasses}>
                  <option value="Everyday">Everyday</option>
                  <option value="Weekends">Weekends Only</option>
                  <option value="Weekdays">Weekdays Only</option>
                </select>
              </div>
            </div>

            <div className="bg-slate-950/50 p-4 rounded-md border border-slate-800">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                <Percent className="w-3 h-3" /> Discount Value
              </h4>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelClasses}>Amount</label>
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

            <div className="bg-slate-950/50 p-4 rounded-md border border-slate-800">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                <Clock className="w-3 h-3" /> Validity & Timing
              </h4>
              <div className="grid grid-cols-2 gap-4 mb-3">
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
                <div className="grid grid-cols-2 gap-4 pt-3 border-t border-slate-800">
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

            <label className="flex items-center cursor-pointer gap-2">
              <div className="relative flex items-center">
                <input type="checkbox" name="isActive" checked={formData.isActive} onChange={handleChange} className="peer sr-only" />
                <div className="w-10 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white dark:bg-slate-900 after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
              </div>
              <span className="text-sm font-semibold text-slate-300">Active Promotion</span>
            </label>

          </form>
        </div>

        <div className="px-6 py-4 border-t border-slate-800 bg-slate-900/80 flex justify-end gap-3">
          <button type="button" onClick={onClose} className="px-5 py-2.5 text-sm font-bold text-slate-300 bg-slate-800 border border-slate-700 rounded-md hover:bg-slate-700 transition-colors">
            Cancel
          </button>
          <button type="submit" form="promo-form" disabled={isSubmitting} className="px-5 py-2.5 text-sm font-bold text-white bg-primary-600 rounded-md hover:bg-primary-500 disabled:opacity-50 transition-colors shadow-md">
            {isSubmitting ? 'Saving...' : 'Save Promotion'}
          </button>
        </div>
      </div>
    </div>
  );
};
