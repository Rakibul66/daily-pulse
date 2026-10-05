import React, { useState, useEffect } from 'react';
import { Product } from '@/types/inventory';
import { X, Package } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSave: (product: Omit<Product, 'id' | 'userId' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  initialData?: Product | null;
}

export const ProductFormModal: React.FC<Props> = ({ isOpen, onClose, onSave, initialData }) => {
  const [formData, setFormData] = useState({
    name: '',
    sku: '',
    category: '',
    price: 0,
    cost: 0,
    stock: 0,
    minStock: 5,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        setFormData({
          name: initialData.name,
          sku: initialData.sku,
          category: initialData.category,
          price: initialData.price,
          cost: initialData.cost,
          stock: initialData.stock,
          minStock: initialData.minStock,
        });
      } else {
        setFormData({ name: '', sku: '', category: '', price: 0, cost: 0, stock: 0, minStock: 5 });
      }
    }
  }, [isOpen, initialData]);

  if (!isOpen) return null;

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

  const inputClasses = "w-full text-sm font-medium text-white bg-slate-950 px-3 py-2 rounded-md border border-slate-700 focus:border-primary-500 focus:ring-1 focus:ring-primary-500 placeholder-slate-600";
  const labelClasses = "text-xs font-semibold text-slate-300 block mb-1.5";

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-xl shadow-xl w-full max-w-lg flex flex-col animate-in zoom-in-95 duration-200">
        <div className="px-6 py-4 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <Package className="w-5 h-5 text-primary-400" />
            <h2 className="text-base font-bold text-white">{initialData ? 'Edit Product' : 'Add New Product'}</h2>
          </div>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-white rounded-md transition-colors"><X className="w-5 h-5" /></button>
        </div>

        <div className="p-6 overflow-y-auto">
          <form id="product-form" onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className={labelClasses}>Product Name*</label>
              <input type="text" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className={inputClasses} required />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelClasses}>SKU / Barcode*</label>
                <input type="text" value={formData.sku} onChange={(e) => setFormData({...formData, sku: e.target.value})} className={inputClasses} required />
              </div>
              <div>
                <label className={labelClasses}>Category</label>
                <input type="text" value={formData.category} onChange={(e) => setFormData({...formData, category: e.target.value})} className={inputClasses} placeholder="e.g. Electronics" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelClasses}>Selling Price (৳)*</label>
                <input type="number" value={formData.price} onChange={(e) => setFormData({...formData, price: Number(e.target.value)})} className={inputClasses} min="0" step="0.01" required />
              </div>
              <div>
                <label className={labelClasses}>Buying Cost (৳)*</label>
                <input type="number" value={formData.cost} onChange={(e) => setFormData({...formData, cost: Number(e.target.value)})} className={inputClasses} min="0" step="0.01" required />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelClasses}>Current Stock*</label>
                <input type="number" value={formData.stock} onChange={(e) => setFormData({...formData, stock: Number(e.target.value)})} className={inputClasses} required disabled={!!initialData} title={initialData ? "Stock must be adjusted via Purchase Orders or Sales" : ""} />
                {initialData && <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-1">Adjust via POs or Sales.</p>}
              </div>
              <div>
                <label className={labelClasses}>Min Stock Alert</label>
                <input type="number" value={formData.minStock} onChange={(e) => setFormData({...formData, minStock: Number(e.target.value)})} className={inputClasses} min="0" />
              </div>
            </div>
          </form>
        </div>

        <div className="px-6 py-4 border-t border-slate-800 bg-slate-900/50 flex justify-end gap-3">
          <button type="button" onClick={onClose} className="px-5 py-2.5 text-sm font-semibold text-slate-300 bg-slate-800 border border-slate-700 rounded-md hover:bg-slate-700 transition-colors">Cancel</button>
          <button type="submit" form="product-form" disabled={isSubmitting} className="px-5 py-2.5 text-sm font-bold text-white bg-primary-600 rounded-md hover:bg-primary-500 disabled:opacity-50 transition-colors shadow-md">{isSubmitting ? 'Saving...' : 'Save Product'}</button>
        </div>
      </div>
    </div>
  );
};
