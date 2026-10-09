"use client";

import React, { useState, useEffect } from 'react';
import { ProductCategory } from '@/types/product';
import { X, Layers, Image as ImageIcon, Loader2 } from 'lucide-react';
import { SearchableSelect } from '../ui/SearchableSelect';
import { DEFAULT_PRODUCT_CATEGORIES } from '@/lib/productStorage';

interface CategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: Omit<ProductCategory, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  initialData?: ProductCategory | null;
  existingCategories: ProductCategory[];
  companyNameDefault?: string;
}

const DEFAULT_VENDORS = [
  '3S Distributor',
  'A.K TRADING CORPORATION',
  'Aarong Dairy',
  'Abul Khair Consumer Point',
  'Pran Foods Limited',
  'Square Consumer Products',
  'Unilever Bangladesh',
  'ACI Limited'
];

export const CategoryModal: React.FC<CategoryModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialData,
  existingCategories,
  companyNameDefault = 'Main Company',
}) => {
  const [formData, setFormData] = useState({
    name: '',
    parentCategory: '',
    image: '',
    imageFileName: '',
    vendorNames: [] as string[],
    metaTitle: '',
    metaKeyword: '',
    metaDescription: '',
    status: 'ACTIVE' as 'ACTIVE' | 'INACTIVE',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        setFormData({
          name: initialData.name || '',
          parentCategory: initialData.parentCategory === 'None' ? '' : (initialData.parentCategory || ''),
          image: initialData.image || '',
          imageFileName: initialData.image ? 'Existing Image' : '',
          vendorNames: initialData.vendorNames || [],
          metaTitle: initialData.metaTitle || '',
          metaKeyword: initialData.metaKeyword || '',
          metaDescription: initialData.metaDescription || '',
          status: initialData.status || 'ACTIVE',
        });
      } else {
        setFormData({
          name: '',
          parentCategory: '',
          image: '',
          imageFileName: '',
          vendorNames: [],
          metaTitle: '',
          metaKeyword: '',
          metaDescription: '',
          status: 'ACTIVE',
        });
      }
    }
  }, [isOpen, initialData]);

  if (!isOpen) return null;

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData(prev => ({ ...prev, imageFileName: file.name }));
      const reader = new FileReader();
      reader.onload = (event) => {
        setFormData(prev => ({ ...prev, image: event.target?.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleToggleVendor = (vendorName: string) => {
    setFormData(prev => {
      const exists = prev.vendorNames.includes(vendorName);
      if (exists) {
        return { ...prev, vendorNames: prev.vendorNames.filter(v => v !== vendorName) };
      } else {
        return { ...prev, vendorNames: [...prev.vendorNames, vendorName] };
      }
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) return;
    setIsSubmitting(true);
    try {
      await onSave({
        userId: '',
        companyName: companyNameDefault,
        name: formData.name.trim(),
        parentCategory: formData.parentCategory || 'None',
        image: formData.image || undefined,
        vendorNames: formData.vendorNames,
        metaTitle: formData.metaTitle || undefined,
        metaKeyword: formData.metaKeyword || undefined,
        metaDescription: formData.metaDescription || undefined,
        status: formData.status,
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

  const parentCategoryOptions = React.useMemo(() => {
    const names = new Set<string>();
    existingCategories
      .filter(c => !initialData || c.id !== initialData.id)
      .forEach(c => names.add(c.name));
    DEFAULT_PRODUCT_CATEGORIES
      .filter(c => !initialData || c.name !== initialData.name)
      .forEach(c => names.add(c.name));
    return Array.from(names).sort().map(name => ({ value: name, label: name }));
  }, [existingCategories, initialData]);

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 pt-10 sm:pt-14 overflow-y-auto">
      <div className="bg-white border-2 sm:border-4 border-black shadow-[8px_8px_0px_#000] w-full max-w-2xl overflow-hidden flex flex-col my-auto animate-in zoom-in-95 duration-200">
        
        {/* Accent Strip */}
        <div className="h-2 bg-amber-400 border-b-2 border-black w-full" />

        {/* Modal Header */}
        <div className="px-5 py-3.5 border-b-2 border-black bg-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 bg-amber-300 border-2 border-black shadow-[2px_2px_0px_#000]">
              <Layers className="w-4 h-4 text-black stroke-[2.5]" />
            </div>
            <div>
              <h2 className="text-sm font-black uppercase tracking-wider text-black">
                {initialData ? 'EDIT CATEGORY' : 'ADD NEW CATEGORY'}
              </h2>
              <p className="text-[10px] font-bold text-slate-600 uppercase">
                Product taxonomy and SEO metadata setup
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
        <div className="p-5 max-h-[75vh] overflow-y-auto">
          <form id="category-form" onSubmit={handleSubmit} className="space-y-4">
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className={labelClasses}>Parent Category</label>
                <SearchableSelect
                  placeholder="Select Parent.."
                  value={formData.parentCategory}
                  onChange={val => setFormData(prev => ({ ...prev, parentCategory: val }))}
                  options={parentCategoryOptions}
                />
              </div>

              <div>
                <label className={labelClasses}>Category Name *</label>
                <input 
                  type="text" 
                  value={formData.name} 
                  onChange={e => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  className={inputClasses} 
                  placeholder="Category Name"
                  required 
                />
              </div>
            </div>

            {/* Image Preview & Upload */}
            <div>
              <label className={labelClasses}>
                Image <span className="text-red-600 font-bold">(500x500)</span>
              </label>
              <div className="flex items-center gap-3">
                <div className="w-14 h-14 border-2 border-black bg-slate-100 flex items-center justify-center overflow-hidden shrink-0">
                  {formData.image ? (
                    <img src={formData.image} alt="Preview" className="w-full h-full object-cover" />
                  ) : (
                    <ImageIcon className="w-6 h-6 text-slate-400 stroke-[1.5]" />
                  )}
                </div>
                <div className="flex-1 space-y-1">
                  <input 
                    type="file" 
                    accept="image/*" 
                    onChange={handleImageUpload}
                    className="text-xs file:mr-2 file:py-1 file:px-2 file:border-2 file:border-black file:text-xs file:font-black file:bg-amber-300 file:cursor-pointer"
                  />
                  {formData.image && (
                    <button 
                      type="button" 
                      onClick={() => setFormData(prev => ({ ...prev, image: '', imageFileName: '' }))}
                      className="text-[10px] text-red-600 font-black uppercase hover:underline"
                    >
                      Remove image
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Vendor Names */}
            <div>
              <label className={labelClasses}>Vendor Names</label>
              <select
                onChange={e => {
                  if (e.target.value) {
                    handleToggleVendor(e.target.value);
                    e.target.value = '';
                  }
                }}
                defaultValue=""
                className={inputClasses}
              >
                <option value="" disabled>Select Vendors..</option>
                {DEFAULT_VENDORS.map(v => (
                  <option key={v} value={v}>
                    {formData.vendorNames.includes(v) ? `✓ ${v}` : v}
                  </option>
                ))}
              </select>
              {formData.vendorNames.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-1.5">
                  {formData.vendorNames.map(v => (
                    <span key={v} className="inline-flex items-center gap-1 px-2 py-0.5 bg-amber-200 border border-black text-[10px] font-bold">
                      {v}
                      <button type="button" onClick={() => handleToggleVendor(v)} className="hover:text-red-600 cursor-pointer">×</button>
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Meta Title & Meta Keyword */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className={labelClasses}>Meta Title</label>
                <input 
                  type="text" 
                  value={formData.metaTitle} 
                  onChange={e => setFormData(prev => ({ ...prev, metaTitle: e.target.value }))}
                  className={inputClasses} 
                  placeholder="Meta Title" 
                />
              </div>

              <div>
                <label className={labelClasses}>Meta Keyword</label>
                <input 
                  type="text" 
                  value={formData.metaKeyword} 
                  onChange={e => setFormData(prev => ({ ...prev, metaKeyword: e.target.value }))}
                  className={inputClasses} 
                  placeholder="Meta Keyword" 
                />
              </div>
            </div>

            {/* Meta Description */}
            <div>
              <label className={labelClasses}>Meta Description</label>
              <textarea 
                rows={3}
                value={formData.metaDescription} 
                onChange={e => setFormData(prev => ({ ...prev, metaDescription: e.target.value }))}
                className={inputClasses} 
                placeholder="Meta Description" 
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
            form="category-form"
            disabled={isSubmitting} 
            className="flex items-center gap-1.5 px-5 py-2 text-xs font-black uppercase text-black bg-cyan-400 hover:bg-cyan-300 border-2 border-black transition-all cursor-pointer shadow-[2px_2px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 disabled:opacity-50"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Saving...</span>
              </>
            ) : (
              <span>SAVE</span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
