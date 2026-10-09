"use client";

import React, { useState, useEffect } from 'react';
import { 
  X, 
  MonitorSmartphone, 
  ShieldCheck, 
  Tag, 
  Building2, 
  Calendar, 
  DollarSign, 
  User, 
  FileText, 
  Loader2, 
  Check, 
  Plus, 
  Sparkles 
} from 'lucide-react';
import { AssetItem } from '@/types/assets';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: Omit<AssetItem, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  companyId: string;
  initialData?: AssetItem;
}

const CATEGORY_OPTIONS = [
  'IT Equipment',
  'Office Furniture',
  'Vehicles',
  'Machinery & Tools',
  'Software License',
  'Electronics',
  'Other Assets',
];

export const AssetFormModal: React.FC<Props> = ({
  isOpen,
  onClose,
  onSave,
  companyId,
  initialData,
}) => {
  const [name, setName] = useState('');
  const [category, setCategory] = useState('IT Equipment');
  const [vendor, setVendor] = useState('');
  const [warrantyDate, setWarrantyDate] = useState('');
  const [serialNumber, setSerialNumber] = useState('');
  const [status, setStatus] = useState<'Active' | 'Under Repair' | 'Retired'>('Active');
  const [assignedTo, setAssignedTo] = useState('');
  const [purchaseDate, setPurchaseDate] = useState('');
  const [cost, setCost] = useState('');
  const [notes, setNotes] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      setErrorMessage(null);
      if (initialData) {
        setName(initialData.name);
        setCategory(initialData.category);
        setVendor(initialData.vendor);
        setWarrantyDate(initialData.warrantyDate);
        setSerialNumber(initialData.serialNumber);
        setStatus(initialData.status);
        setAssignedTo(initialData.assignedTo || '');
        setPurchaseDate(initialData.purchaseDate || '');
        setCost(initialData.cost?.toString() || '');
        setNotes(initialData.notes || '');
      } else {
        setName('');
        setCategory('IT Equipment');
        setVendor('');
        setWarrantyDate('');
        setSerialNumber('');
        setStatus('Active');
        setAssignedTo('');
        setPurchaseDate(new Date().toISOString().split('T')[0]);
        setCost('');
        setNotes('');
      }
    }
  }, [isOpen, initialData]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!name.trim()) {
      setErrorMessage('Asset name is required.');
      return;
    }
    if (!serialNumber.trim()) {
      setErrorMessage('Serial Number / Asset Tag is required.');
      return;
    }
    if (!warrantyDate) {
      setErrorMessage('Warranty expiration date is required.');
      return;
    }

    setIsSubmitting(true);
    try {
      const payload: Omit<AssetItem, 'id' | 'createdAt' | 'updatedAt'> = {
        companyId,
        name: name.trim(),
        category,
        vendor: vendor.trim() || 'Direct Purchase',
        warrantyDate,
        serialNumber: serialNumber.trim().toUpperCase(),
        status,
      };

      if (assignedTo.trim()) payload.assignedTo = assignedTo.trim();
      if (purchaseDate) payload.purchaseDate = purchaseDate;
      if (cost && !isNaN(parseFloat(cost))) payload.cost = parseFloat(cost);
      if (notes.trim()) payload.notes = notes.trim();

      await onSave(payload);
      onClose();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to save asset. Please try again.';
      setErrorMessage(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/70 backdrop-blur-xs overflow-y-auto">
      {/* Modal Card */}
      <div className="relative w-full max-w-2xl bg-white border-4 border-black shadow-[10px_10px_0px_#000] my-6 overflow-hidden text-black animate-in fade-in zoom-in-95 duration-200">
        
        {/* Top Accent Strip */}
        <div className="h-3 bg-gradient-to-r from-indigo-600 via-amber-400 to-red-600 border-b-2 border-black" />

        {/* Close Button */}
        <button
          onClick={onClose}
          type="button"
          className="absolute top-5 right-5 p-1.5 bg-white hover:bg-red-600 hover:text-white border-2 border-black shadow-[2px_2px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all z-10 cursor-pointer"
          aria-label="Close Modal"
        >
          <X className="w-5 h-5 stroke-[2.5]" />
        </button>

        {/* Modal Header */}
        <div className="p-6 sm:p-7 pb-4 border-b-3 border-black bg-white">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-amber-300 border-3 border-black shadow-[3px_3px_0px_#000] flex items-center justify-center text-black shrink-0">
              <MonitorSmartphone className="w-6 h-6 stroke-[2.5]" />
            </div>
            <div>
              <div className="inline-flex items-center gap-1.5 px-2 py-0.5 bg-indigo-100 border border-black text-[10px] font-black uppercase tracking-wider mb-1">
                <Sparkles className="w-3 h-3 text-indigo-600" />
                ASSET REGISTRY & TRACKER
              </div>
              <h2 className="font-display font-black text-2xl sm:text-3xl uppercase tracking-tight text-black leading-none">
                {initialData ? 'EDIT ASSET' : 'ADD NEW ASSET'}
              </h2>
              <p className="text-xs font-bold text-slate-600 uppercase tracking-wide mt-1">
                Register company equipment, serial tag, warranty & ownership
              </p>
            </div>
          </div>
        </div>

        {/* Form Body */}
        <div className="p-6 sm:p-7 max-h-[72vh] overflow-y-auto">
          {errorMessage && (
            <div className="mb-5 p-3.5 bg-red-100 border-3 border-black text-black shadow-[3px_3px_0px_#000] font-bold text-xs uppercase flex items-center gap-2">
              <span className="w-4 h-4 rounded-full bg-red-600 text-white flex items-center justify-center text-[10px] font-black">!</span>
              <span>{errorMessage}</span>
            </div>
          )}

          <form id="asset-form" onSubmit={handleSubmit} className="space-y-6">
            
            {/* Section 1: Identification */}
            <div>
              <div className="px-2 py-1 bg-black text-white font-display font-black text-xs uppercase tracking-wider inline-block mb-3">
                1. ASSET IDENTIFICATION
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Asset Name */}
                <div className="space-y-1.5 sm:col-span-2">
                  <label className="text-xs font-display font-black uppercase tracking-wider text-black flex items-center justify-between">
                    <span>Asset Name <span className="text-red-600">*</span></span>
                    <span className="text-[10px] font-bold text-slate-500">e.g., MacBook Pro M3, HP LaserJet, Office Chair</span>
                  </label>
                  <input
                    required
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter item brand and model name"
                    className="w-full px-3.5 py-2.5 text-xs font-bold text-black bg-white border-2 border-black shadow-[2px_2px_0px_#000] focus:outline-none focus:bg-[#fffdf0] focus:border-indigo-600 rounded-none transition-all placeholder:text-slate-400"
                  />
                </div>

                {/* Category */}
                <div className="space-y-1.5">
                  <label className="text-xs font-display font-black uppercase tracking-wider text-black">
                    Category <span className="text-red-600">*</span>
                  </label>
                  <select
                    required
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-xs font-black text-black bg-white border-2 border-black shadow-[2px_2px_0px_#000] focus:outline-none focus:bg-[#fffdf0] focus:border-indigo-600 rounded-none transition-all cursor-pointer"
                  >
                    {CATEGORY_OPTIONS.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Serial Number / Asset Tag */}
                <div className="space-y-1.5">
                  <label className="text-xs font-display font-black uppercase tracking-wider text-black flex items-center justify-between">
                    <span>Serial / Tag ID <span className="text-red-600">*</span></span>
                    <Tag className="w-3.5 h-3.5 text-slate-500" />
                  </label>
                  <input
                    required
                    type="text"
                    value={serialNumber}
                    onChange={(e) => setSerialNumber(e.target.value)}
                    placeholder="e.g. SN-APL-2026-09"
                    className="w-full px-3.5 py-2.5 text-xs font-bold font-mono text-black bg-white border-2 border-black shadow-[2px_2px_0px_#000] focus:outline-none focus:bg-[#fffdf0] focus:border-indigo-600 rounded-none transition-all placeholder:text-slate-400 uppercase"
                  />
                </div>
              </div>
            </div>

            {/* Section 2: Procurement & Warranty */}
            <div>
              <div className="px-2 py-1 bg-black text-white font-display font-black text-xs uppercase tracking-wider inline-block mb-3">
                2. PROCUREMENT & WARRANTY
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Vendor / Supplier */}
                <div className="space-y-1.5">
                  <label className="text-xs font-display font-black uppercase tracking-wider text-black flex items-center justify-between">
                    <span>Vendor / Store <span className="text-red-600">*</span></span>
                    <Building2 className="w-3.5 h-3.5 text-slate-500" />
                  </label>
                  <input
                    required
                    type="text"
                    value={vendor}
                    onChange={(e) => setVendor(e.target.value)}
                    placeholder="e.g. Star Tech, Apple Store, Ryans"
                    className="w-full px-3.5 py-2.5 text-xs font-bold text-black bg-white border-2 border-black shadow-[2px_2px_0px_#000] focus:outline-none focus:bg-[#fffdf0] focus:border-indigo-600 rounded-none transition-all placeholder:text-slate-400"
                  />
                </div>

                {/* Purchase Cost */}
                <div className="space-y-1.5">
                  <label className="text-xs font-display font-black uppercase tracking-wider text-black flex items-center justify-between">
                    <span>Purchase Cost (৳ BDT)</span>
                    <span className="text-[10px] font-bold text-slate-500">Optional</span>
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={cost}
                    onChange={(e) => setCost(e.target.value)}
                    placeholder="0.00"
                    className="w-full px-3.5 py-2.5 text-xs font-bold text-black bg-white border-2 border-black shadow-[2px_2px_0px_#000] focus:outline-none focus:bg-[#fffdf0] focus:border-indigo-600 rounded-none transition-all placeholder:text-slate-400 font-mono"
                  />
                </div>

                {/* Purchase Date */}
                <div className="space-y-1.5">
                  <label className="text-xs font-display font-black uppercase tracking-wider text-black flex items-center justify-between">
                    <span>Purchase Date</span>
                    <Calendar className="w-3.5 h-3.5 text-slate-500" />
                  </label>
                  <input
                    type="date"
                    value={purchaseDate}
                    onChange={(e) => setPurchaseDate(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-xs font-bold text-black bg-white border-2 border-black shadow-[2px_2px_0px_#000] focus:outline-none focus:bg-[#fffdf0] focus:border-indigo-600 rounded-none transition-all cursor-pointer font-mono"
                  />
                </div>

                {/* Warranty Expiry Date */}
                <div className="space-y-1.5">
                  <label className="text-xs font-display font-black uppercase tracking-wider text-black flex items-center justify-between">
                    <span>Warranty Expiry <span className="text-red-600">*</span></span>
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  </label>
                  <input
                    required
                    type="date"
                    value={warrantyDate}
                    onChange={(e) => setWarrantyDate(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-xs font-bold text-black bg-white border-2 border-black shadow-[2px_2px_0px_#000] focus:outline-none focus:bg-[#fffdf0] focus:border-indigo-600 rounded-none transition-all cursor-pointer font-mono"
                  />
                </div>
              </div>
            </div>

            {/* Section 3: Status & Ownership */}
            <div>
              <div className="px-2 py-1 bg-black text-white font-display font-black text-xs uppercase tracking-wider inline-block mb-3">
                3. STATUS & ASSIGNMENT
              </div>

              {/* Status Selector Pills */}
              <div className="mb-4">
                <label className="text-xs font-display font-black uppercase tracking-wider text-black block mb-2">
                  Operating Status <span className="text-red-600">*</span>
                </label>
                <div className="grid grid-cols-3 gap-2.5">
                  {(['Active', 'Under Repair', 'Retired'] as const).map((s) => {
                    const isSelected = status === s;
                    const bgColors = {
                      'Active': isSelected ? 'bg-emerald-400 text-black' : 'bg-white text-black hover:bg-emerald-50',
                      'Under Repair': isSelected ? 'bg-amber-300 text-black' : 'bg-white text-black hover:bg-amber-50',
                      'Retired': isSelected ? 'bg-slate-300 text-black' : 'bg-white text-black hover:bg-slate-100',
                    };
                    return (
                      <button
                        key={s}
                        type="button"
                        onClick={() => setStatus(s)}
                        className={`px-3 py-2 text-xs font-display font-black uppercase tracking-wider border-2 border-black shadow-[2px_2px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 transition-all text-center flex items-center justify-center gap-1.5 cursor-pointer ${bgColors[s]}`}
                      >
                        {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                        <span>{s}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Assigned To Employee / Dept */}
                <div className="space-y-1.5 sm:col-span-2">
                  <label className="text-xs font-display font-black uppercase tracking-wider text-black flex items-center justify-between">
                    <span>Assigned To Employee / Desk</span>
                    <User className="w-3.5 h-3.5 text-slate-500" />
                  </label>
                  <input
                    type="text"
                    value={assignedTo}
                    onChange={(e) => setAssignedTo(e.target.value)}
                    placeholder="e.g. Tanvir Ahmed (Design Lead) or Reception Counter 1"
                    className="w-full px-3.5 py-2.5 text-xs font-bold text-black bg-white border-2 border-black shadow-[2px_2px_0px_#000] focus:outline-none focus:bg-[#fffdf0] focus:border-indigo-600 rounded-none transition-all placeholder:text-slate-400"
                  />
                </div>

                {/* Notes */}
                <div className="space-y-1.5 sm:col-span-2">
                  <label className="text-xs font-display font-black uppercase tracking-wider text-black flex items-center justify-between">
                    <span>Asset Specs & Notes</span>
                    <FileText className="w-3.5 h-3.5 text-slate-500" />
                  </label>
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    rows={2}
                    placeholder="Enter configuration, invoice number, or location details..."
                    className="w-full px-3.5 py-2.5 text-xs font-bold text-black bg-white border-2 border-black shadow-[2px_2px_0px_#000] focus:outline-none focus:bg-[#fffdf0] focus:border-indigo-600 rounded-none transition-all placeholder:text-slate-400 resize-none"
                  />
                </div>
              </div>
            </div>

          </form>
        </div>

        {/* Modal Footer */}
        <div className="p-5 sm:p-6 border-t-3 border-black bg-[#FAF8F0] flex flex-wrap items-center justify-between gap-3">
          <div className="text-[11px] font-black text-slate-600 uppercase tracking-wider">
            All changes saved to cloud registry
          </div>

          <div className="flex items-center gap-3 ml-auto">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-5 py-2.5 bg-white hover:bg-slate-100 text-black font-display font-black text-xs uppercase tracking-wider border-2 border-black shadow-[3px_3px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all cursor-pointer"
            >
              CANCEL
            </button>
            <button
              type="submit"
              form="asset-form"
              disabled={isSubmitting}
              className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-display font-black text-xs uppercase tracking-wider border-2 border-black shadow-[4px_4px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin stroke-[3]" />
                  <span>SAVING ASSET...</span>
                </>
              ) : (
                <>
                  <Check className="w-4 h-4 stroke-[3]" />
                  <span>{initialData ? 'UPDATE ASSET' : 'SAVE ASSET'}</span>
                </>
              )}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
