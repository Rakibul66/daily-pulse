"use client";

import React from "react";
import { ArrowLeft, Save, Loader2, X } from "lucide-react";
import { ProductCategory } from "@/types/product";
import { SearchableSelect } from "../../ui/SearchableSelect";
import { CategoryFormData, DEFAULT_VENDORS } from "./types";

interface CategoryFormProps {
  editingCategory: ProductCategory | null;
  formData: CategoryFormData;
  setFormData: React.Dispatch<React.SetStateAction<CategoryFormData>>;
  isSubmitting: boolean;
  parentCategoryOptions: { value: string; label: string }[];
  onImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onToggleVendor: (vendor: string) => void;
  onSubmit: (e?: React.FormEvent) => void;
  onCancel: () => void;
}

export const CategoryForm: React.FC<CategoryFormProps> = ({
  editingCategory,
  formData,
  setFormData,
  isSubmitting,
  parentCategoryOptions,
  onImageChange,
  onToggleVendor,
  onSubmit,
  onCancel
}) => {
  return (
    <div className="w-full max-w-6xl mx-auto space-y-6 pb-20 animate-in fade-in-50 duration-200">
      <div className="bg-white border-2 sm:border-4 border-black shadow-[6px_6px_0px_#000] p-4 sm:p-6">
        {/* Header Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b-2 sm:border-b-4 border-black gap-3">
          <div>
            <h1 className="text-xl sm:text-2xl font-display font-black uppercase text-black tracking-wider">
              {editingCategory ? 'EDIT CATEGORY' : 'ADD NEW CATEGORY'}
            </h1>
            <p className="text-xs font-bold text-neutral-600 uppercase mt-0.5">
              Configure taxonomy, vendor linkages, and search engine metadata.
            </p>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <button
              type="button"
              onClick={onCancel}
              disabled={isSubmitting}
              className="inline-flex items-center justify-center gap-1.5 px-4 py-2 bg-neutral-100 hover:bg-neutral-200 text-black border-2 border-black font-display font-black text-xs uppercase tracking-wider shadow-[2px_2px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 transition-all cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5 stroke-[3]" />
              GO BACK
            </button>

            <button
              type="button"
              onClick={() => onSubmit()}
              disabled={isSubmitting}
              className="inline-flex items-center justify-center gap-1.5 px-5 py-2 bg-cyan-400 hover:bg-cyan-300 text-black border-2 border-black font-display font-black text-xs uppercase tracking-wider shadow-[2px_2px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 transition-all cursor-pointer disabled:opacity-50"
            >
              {isSubmitting ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Save className="w-3.5 h-3.5 stroke-[2.5]" />
              )}
              SAVE
            </button>
          </div>
        </div>

        {/* Form Fields Grid */}
        <form onSubmit={onSubmit} className="mt-6 space-y-6">
          {/* ROW 1: Parent Category, Name * */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            <div>
              <label className="block text-xs font-display font-black uppercase tracking-wider text-black mb-1.5">
                Parent Category
              </label>
              <SearchableSelect
                placeholder="Select Parent.."
                value={formData.parentCategory}
                onChange={val => setFormData(prev => ({ ...prev, parentCategory: val }))}
                options={parentCategoryOptions}
              />
            </div>

            <div>
              <label className="block text-xs font-display font-black uppercase tracking-wider text-black mb-1.5">
                Name <span className="text-red-600">*</span>
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={e => setFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Category Name"
                className="w-full px-3 py-2.5 bg-white border-2 border-black font-bold text-xs sm:text-sm text-black focus:outline-none focus:ring-2 focus:ring-amber-300 placeholder:text-neutral-400"
                required
              />
            </div>
          </div>

          {/* ROW 2: Image (500x500), Vendor Names, Meta Title */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
            <div>
              <label className="block text-xs font-display font-black uppercase tracking-wider text-black mb-1.5">
                Image <span className="text-red-600 font-bold">(500x500)</span>
              </label>
              <div className="flex items-center gap-2 border-2 border-black bg-white p-1">
                <label className="px-3 py-1.5 bg-neutral-200 hover:bg-neutral-300 border-2 border-black text-xs font-display font-black uppercase cursor-pointer shrink-0">
                  Choose File
                  <input
                    type="file"
                    accept="image/*"
                    onChange={onImageChange}
                    className="hidden"
                  />
                </label>
                <span className="text-xs font-medium text-neutral-600 truncate flex-1 px-1">
                  {formData.imageFileName || 'No file chosen'}
                </span>
                {formData.image && (
                  <div className="relative group shrink-0">
                    <img
                      src={formData.image}
                      alt="Preview"
                      className="w-8 h-8 object-cover border border-black"
                    />
                    <button
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, image: '', imageFileName: '' }))}
                      className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full p-0.5 hover:bg-red-700 cursor-pointer"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                )}
              </div>
            </div>

            <div>
              <label className="block text-xs font-display font-black uppercase tracking-wider text-black mb-1.5">
                Vendor Names
              </label>
              <div className="relative">
                <select
                  onChange={e => {
                    if (e.target.value) {
                      onToggleVendor(e.target.value);
                      e.target.value = '';
                    }
                  }}
                  defaultValue=""
                  className="w-full px-3 py-2.5 bg-white border-2 border-black font-bold text-xs sm:text-sm text-black focus:outline-none focus:ring-2 focus:ring-amber-300 cursor-pointer"
                >
                  <option value="" disabled>Select Vendors..</option>
                  {DEFAULT_VENDORS.map(v => (
                    <option key={v} value={v}>
                      {formData.vendorNames.includes(v) ? `✓ ${v}` : v}
                    </option>
                  ))}
                </select>

                {formData.vendorNames.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {formData.vendorNames.map(v => (
                      <span
                        key={v}
                        className="inline-flex items-center gap-1 px-2 py-0.5 bg-amber-200 border border-black text-[11px] font-bold text-black"
                      >
                        {v}
                        <button
                          type="button"
                          onClick={() => onToggleVendor(v)}
                          className="hover:text-red-600 cursor-pointer font-black"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div>
              <label className="block text-xs font-display font-black uppercase tracking-wider text-black mb-1.5">
                Meta Title
              </label>
              <input
                type="text"
                value={formData.metaTitle}
                onChange={e => setFormData(prev => ({ ...prev, metaTitle: e.target.value }))}
                placeholder="Meta Title"
                className="w-full px-3 py-2.5 bg-white border-2 border-black font-bold text-xs sm:text-sm text-black focus:outline-none focus:ring-2 focus:ring-amber-300 placeholder:text-neutral-400"
              />
            </div>
          </div>

          {/* ROW 3: Meta Keyword */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
            <div>
              <label className="block text-xs font-display font-black uppercase tracking-wider text-black mb-1.5">
                Meta Keyword
              </label>
              <input
                type="text"
                value={formData.metaKeyword}
                onChange={e => setFormData(prev => ({ ...prev, metaKeyword: e.target.value }))}
                placeholder="Meta Keyword"
                className="w-full px-3 py-2.5 bg-white border-2 border-black font-bold text-xs sm:text-sm text-black focus:outline-none focus:ring-2 focus:ring-amber-300 placeholder:text-neutral-400"
              />
            </div>
          </div>

          {/* ROW 4: Meta Description */}
          <div>
            <label className="block text-xs font-display font-black uppercase tracking-wider text-black mb-1.5">
              Meta Description
            </label>
            <textarea
              rows={5}
              value={formData.metaDescription}
              onChange={e => setFormData(prev => ({ ...prev, metaDescription: e.target.value }))}
              placeholder="Meta Description"
              className="w-full px-3 py-2.5 bg-white border-2 border-black font-bold text-xs sm:text-sm text-black focus:outline-none focus:ring-2 focus:ring-amber-300 placeholder:text-neutral-400"
            />
          </div>

          {/* Bottom Actions */}
          <div className="flex justify-end pt-4 border-t-2 border-black">
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center justify-center gap-2 px-8 py-2.5 bg-cyan-400 hover:bg-cyan-300 text-black border-2 border-black font-display font-black text-xs sm:text-sm uppercase tracking-wider shadow-[3px_3px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 transition-all cursor-pointer disabled:opacity-50"
            >
              {isSubmitting ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Save className="w-4 h-4 stroke-[2.5]" />
              )}
              SAVE
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
