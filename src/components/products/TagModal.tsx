"use client";

import React, { useState, useEffect } from 'react';
import { ProductTag } from '@/types/product';
import { X, Tag as TagIcon, Save, Loader2, Palette } from 'lucide-react';

interface TagModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (tag: Omit<ProductTag, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  initialData?: ProductTag | null;
}

const COLOR_PRESETS = [
  { name: 'Amber', hex: '#f59e0b', text: '#000000' },
  { name: 'Emerald', hex: '#10b981', text: '#000000' },
  { name: 'Rose', hex: '#ef4444', text: '#ffffff' },
  { name: 'Blue', hex: '#3b82f6', text: '#ffffff' },
  { name: 'Purple', hex: '#8b5cf6', text: '#ffffff' },
  { name: 'Pink', hex: '#ec4899', text: '#ffffff' },
  { name: 'Lime', hex: '#84cc16', text: '#000000' },
  { name: 'Cyan', hex: '#06b6d4', text: '#000000' },
  { name: 'Indigo', hex: '#4f46e5', text: '#ffffff' },
  { name: 'Dark', hex: '#18181b', text: '#ffffff' },
];

export const TagModal: React.FC<TagModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialData,
}) => {
  const [formData, setFormData] = useState({
    name: '',
    color: '#f59e0b',
    description: '',
    status: 'ACTIVE' as 'ACTIVE' | 'INACTIVE',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        setFormData({
          name: initialData.name || '',
          color: initialData.color || '#f59e0b',
          description: initialData.description || '',
          status: initialData.status || 'ACTIVE',
        });
      } else {
        setFormData({
          name: '',
          color: '#f59e0b',
          description: '',
          status: 'ACTIVE',
        });
      }
    }
  }, [isOpen, initialData]);

  if (!isOpen) return null;

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
      <div className="w-full max-w-md bg-white border-4 border-black shadow-[8px_8px_0px_#000] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-5 py-3.5 bg-amber-300 border-b-2 border-black flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <TagIcon className="w-5 h-5 text-black stroke-[2.5]" />
            <h2 className="font-black text-sm uppercase tracking-wider text-black">
              {initialData ? 'Edit Product Tag' : 'Add New Tag'}
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
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          {/* Tag Name */}
          <div>
            <label className={labelClasses}>Tag Label *</label>
            <input
              type="text"
              value={formData.name}
              onChange={e => setFormData(prev => ({ ...prev, name: e.target.value }))}
              className={inputClasses}
              placeholder="e.g. Best Seller, New Arrival, Hot Deal"
              required
            />
          </div>

          {/* Color Selection */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className={labelClasses}>Badge Color &amp; Style</label>
              <div className="flex items-center gap-1.5">
                <input
                  type="color"
                  value={formData.color}
                  onChange={e => setFormData(prev => ({ ...prev, color: e.target.value }))}
                  className="w-5 h-5 border border-black cursor-pointer p-0 bg-transparent"
                  title="Custom Color"
                />
                <span className="text-[10px] font-mono font-bold text-slate-600 uppercase">
                  {formData.color}
                </span>
              </div>
            </div>

            {/* Presets Grid */}
            <div className="grid grid-cols-5 gap-2 pt-1">
              {COLOR_PRESETS.map((preset) => {
                const isSelected = formData.color.toLowerCase() === preset.hex.toLowerCase();
                return (
                  <button
                    key={preset.hex}
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, color: preset.hex }))}
                    style={{ backgroundColor: preset.hex }}
                    className={`h-7 border-2 border-black flex items-center justify-center text-[10px] font-black cursor-pointer transition-transform ${
                      isSelected ? 'ring-2 ring-black scale-105 shadow-[2px_2px_0px_#000]' : 'hover:scale-102'
                    }`}
                    title={preset.name}
                  >
                    {isSelected && <span style={{ color: preset.text }}>✓</span>}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Live Preview Box */}
          <div className="p-3 bg-slate-100 border-2 border-black space-y-1">
            <span className="text-[10px] font-black uppercase tracking-wider text-slate-500 block">
              Live Badge Preview
            </span>
            <div className="pt-1 flex items-center gap-2">
              <span
                style={{ backgroundColor: formData.color }}
                className="px-2.5 py-1 text-xs font-black uppercase text-black border-2 border-black shadow-[2px_2px_0px_#000] inline-flex items-center gap-1"
              >
                <TagIcon className="w-3 h-3 stroke-[2.5]" />
                {formData.name.trim() || 'SAMPLE TAG'}
              </span>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className={labelClasses}>Description / Usage</label>
            <textarea
              value={formData.description}
              onChange={e => setFormData(prev => ({ ...prev, description: e.target.value }))}
              rows={2}
              className={`${inputClasses} resize-none`}
              placeholder="When or where to apply this tag"
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
              disabled={isSubmitting}
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
                  <span>{initialData ? 'Update Tag' : 'Save Tag'}</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
