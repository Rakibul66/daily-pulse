"use client";

import React, { useState, useEffect } from 'react';
import { ProductBrand } from '@/types/product';
import { X, Award, Image as ImageIcon, Save, Loader2, Globe, FileText, Hash } from 'lucide-react';
import { resizeImageFile } from '@/lib/imageUtils';

interface BrandModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (brand: Omit<ProductBrand, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  initialData?: ProductBrand | null;
}

export const BrandModal: React.FC<BrandModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialData,
}) => {
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    image: '',
    website: '',
    description: '',
    status: 'ACTIVE' as 'ACTIVE' | 'INACTIVE',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        setFormData({
          name: initialData.name || '',
          code: initialData.code || '',
          image: initialData.image || '',
          website: initialData.website || '',
          description: initialData.description || '',
          status: initialData.status || 'ACTIVE',
        });
      } else {
        setFormData({
          name: '',
          code: '',
          image: '',
          website: '',
          description: '',
          status: 'ACTIVE',
        });
      }
    }
  }, [isOpen, initialData]);

  if (!isOpen) return null;

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setIsUploading(true);
      try {
        const resized = await resizeImageFile(file, { maxWidth: 400, maxHeight: 400, quality: 0.85 });
        setFormData(prev => ({ ...prev, image: resized }));
      } catch (err) {
        console.error('Brand image compression error:', err);
      } finally {
        setIsUploading(false);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

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

  const inputClasses = "w-full px-3 py-2 bg-white border-2 border-black text-xs font-bold text-black focus:outline-none focus:bg-amber-50 focus:shadow-[2px_2px_0px_#000] transition-all placeholder:text-slate-400";
  const labelClasses = "block text-[11px] font-black uppercase text-black mb-1 tracking-wider";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="w-full max-w-lg bg-white border-4 border-black shadow-[8px_8px_0px_#000] overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-5 py-3.5 bg-amber-300 border-b-2 border-black flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-black stroke-[2.5]" />
            <h2 className="font-black text-sm uppercase tracking-wider text-black">
              {initialData ? 'Edit Brand' : 'Add New Brand'}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 hover:bg-black/10 border-2 border-black bg-white cursor-pointer active:translate-x-0.5 active:translate-y-0.5"
          >
            <X className="w-4 h-4 text-black stroke-[2.5]" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4 overflow-y-auto flex-1 custom-scrollbar">
          {/* Brand Name & Short Code */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-2">
              <label className={labelClasses}>Brand Name *</label>
              <input
                type="text"
                value={formData.name}
                onChange={e => setFormData(prev => ({ ...prev, name: e.target.value }))}
                className={inputClasses}
                placeholder="e.g. Unilever, Samsung, Nestlé"
                required
              />
            </div>
            <div>
              <label className={labelClasses}>Short Code</label>
              <div className="relative">
                <Hash className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type="text"
                  value={formData.code}
                  onChange={e => setFormData(prev => ({ ...prev, code: e.target.value.toUpperCase() }))}
                  className={`${inputClasses} pl-8`}
                  placeholder="e.g. UNI"
                  maxLength={10}
                />
              </div>
            </div>
          </div>

          {/* Website URL */}
          <div>
            <label className={labelClasses}>Website / Brand Link</label>
            <div className="relative">
              <Globe className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                type="url"
                value={formData.website}
                onChange={e => setFormData(prev => ({ ...prev, website: e.target.value }))}
                className={`${inputClasses} pl-8`}
                placeholder="https://example.com"
              />
            </div>
          </div>

          {/* Logo Upload */}
          <div>
            <label className={labelClasses}>Brand Logo (Max 400x400)</label>
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 border-2 border-black bg-slate-100 flex items-center justify-center overflow-hidden shrink-0 shadow-[2px_2px_0px_#000]">
                {formData.image ? (
                  <img src={formData.image} alt="Logo" className="w-full h-full object-contain" />
                ) : (
                  <ImageIcon className="w-6 h-6 text-slate-400 stroke-1" />
                )}
              </div>
              <div className="flex-1 space-y-1.5">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  disabled={isUploading}
                  className="w-full text-xs text-slate-700 file:mr-2 file:py-1.5 file:px-3 file:border-2 file:border-black file:text-xs file:font-black file:bg-amber-300 file:text-black file:cursor-pointer file:uppercase hover:file:bg-amber-400"
                />
                {formData.image && (
                  <button
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, image: '' }))}
                    className="text-[10px] font-bold text-rose-600 hover:underline uppercase"
                  >
                    Remove Logo
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className={labelClasses}>Description / Notes</label>
            <textarea
              value={formData.description}
              onChange={e => setFormData(prev => ({ ...prev, description: e.target.value }))}
              rows={2}
              className={`${inputClasses} resize-none`}
              placeholder="Brand category, manufacturer info, or vendor notes"
            />
          </div>

          {/* Status */}
          <div>
            <label className={labelClasses}>Status</label>
            <select
              value={formData.status}
              onChange={e => setFormData(prev => ({ ...prev, status: e.target.value as any }))}
              className={inputClasses}
            >
              <option value="ACTIVE">ACTIVE</option>
              <option value="INACTIVE">INACTIVE</option>
            </select>
          </div>

          {/* Footer Controls */}
          <div className="pt-3 border-t-2 border-black flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-4 py-2 bg-white hover:bg-slate-100 text-black border-2 border-black text-xs font-black uppercase shadow-[2px_2px_0px_#000] cursor-pointer active:translate-x-0.5 active:translate-y-0.5"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || isUploading}
              className="flex items-center gap-1.5 px-5 py-2 bg-emerald-400 hover:bg-emerald-300 text-black border-2 border-black text-xs font-black uppercase shadow-[2px_2px_0px_#000] cursor-pointer active:translate-x-0.5 active:translate-y-0.5 disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <Save className="w-3.5 h-3.5 stroke-[2.5]" />
                  <span>{initialData ? 'Update Brand' : 'Save Brand'}</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
