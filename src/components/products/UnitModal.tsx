"use client";

import React, { useState, useEffect } from 'react';
import { MeasurementUnit } from '@/types/product';
import { X, Scale, Loader2 } from 'lucide-react';

interface UnitModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: Omit<MeasurementUnit, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  initialData?: MeasurementUnit | null;
}

export const UnitModal: React.FC<UnitModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialData,
}) => {
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    status: 'ACTIVE' as 'ACTIVE' | 'INACTIVE',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        setFormData({
          name: initialData.name || '',
          code: initialData.code || '',
          status: initialData.status || 'ACTIVE',
        });
      } else {
        setFormData({
          name: '',
          code: '',
          status: 'ACTIVE',
        });
      }
    }
  }, [isOpen, initialData]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.code.trim()) return;
    setIsSubmitting(true);
    try {
      await onSave({
        ...formData,
        userId: '',
      });
      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputClasses = "w-full text-xs font-bold text-black bg-white px-3 py-2 border-2 border-black focus:outline-none focus:bg-amber-50 placeholder-slate-400";
  const labelClasses = "text-[11px] font-black uppercase text-black block mb-1 tracking-wider";

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 pt-10 sm:pt-14 overflow-y-auto">
      <div className="bg-white border-2 sm:border-4 border-black shadow-[8px_8px_0px_#000] w-full max-w-md overflow-hidden flex flex-col my-auto animate-in zoom-in-95 duration-200">
        
        {/* Accent Strip */}
        <div className="h-2 bg-amber-400 border-b-2 border-black w-full" />

        {/* Modal Header */}
        <div className="px-5 py-3.5 border-b-2 border-black bg-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 bg-amber-300 border-2 border-black shadow-[2px_2px_0px_#000]">
              <Scale className="w-4 h-4 text-black stroke-[2.5]" />
            </div>
            <div>
              <h2 className="text-sm font-black uppercase tracking-wider text-black">
                {initialData ? 'Edit Measurement Unit' : 'Add Measurement Unit'}
              </h2>
              <p className="text-[10px] font-bold text-slate-600 uppercase">
                Configure Unit of Measure (UOM)
              </p>
            </div>
          </div>
          <button 
            type="button"
            onClick={onClose} 
            disabled={isSubmitting}
            className="p-1 bg-white hover:bg-red-500 hover:text-white border-2 border-black transition-colors cursor-pointer"
          >
            <X className="w-4 h-4 stroke-[3]" />
          </button>
        </div>

        {/* Form Body */}
        <div className="p-5 overflow-y-auto">
          <form id="unit-form" onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className={labelClasses}>Unit Name *</label>
              <input 
                type="text" 
                value={formData.name} 
                onChange={e => setFormData(prev => ({ ...prev, name: e.target.value }))}
                className={inputClasses} 
                placeholder="e.g. Kilogram or Piece"
                required 
              />
            </div>

            <div>
              <label className={labelClasses}>Short Code / Symbol *</label>
              <input 
                type="text" 
                value={formData.code} 
                onChange={e => setFormData(prev => ({ ...prev, code: e.target.value }))}
                className={inputClasses} 
                placeholder="e.g. KG or Pcs"
                required 
              />
            </div>

            <div>
              <label className={labelClasses}>Status</label>
              <select 
                value={formData.status} 
                onChange={e => setFormData(prev => ({ ...prev, status: e.target.value as 'ACTIVE' | 'INACTIVE' }))}
                className={inputClasses}
              >
                <option value="ACTIVE">ACTIVE</option>
                <option value="INACTIVE">INACTIVE</option>
              </select>
            </div>
          </form>
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t-2 border-black bg-slate-50 flex items-center justify-end gap-3">
          <button 
            type="button" 
            onClick={onClose} 
            disabled={isSubmitting}
            className="px-4 py-2 text-xs font-black uppercase text-black bg-white hover:bg-slate-200 border-2 border-black transition-all cursor-pointer shadow-[2px_2px_0px_#000] active:translate-x-0.5 active:translate-y-0.5"
          >
            Cancel
          </button>
          <button 
            type="submit" 
            form="unit-form"
            disabled={isSubmitting} 
            className="flex items-center gap-1.5 px-5 py-2 text-xs font-black uppercase text-black bg-emerald-400 hover:bg-emerald-300 border-2 border-black transition-all cursor-pointer shadow-[2px_2px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 disabled:opacity-50"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Saving...</span>
              </>
            ) : (
              <span>{initialData ? 'Update Unit' : 'Save Unit'}</span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
