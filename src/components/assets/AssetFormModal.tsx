import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { AssetItem } from '@/types/assets';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: Omit<AssetItem, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  companyId: string;
  initialData?: AssetItem;
}

export const AssetFormModal: React.FC<Props> = ({ isOpen, onClose, onSave, companyId, initialData }) => {
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

  useEffect(() => {
    if (isOpen) {
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
        setPurchaseDate('');
        setCost('');
        setNotes('');
      }
    }
  }, [isOpen, initialData]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const payload: any = {
        companyId,
        name,
        category,
        vendor,
        warrantyDate,
        serialNumber,
        status,
      };
      if (assignedTo) payload.assignedTo = assignedTo;
      if (purchaseDate) payload.purchaseDate = purchaseDate;
      if (cost) payload.cost = parseFloat(cost);
      if (notes) payload.notes = notes;
      
      await onSave(payload);
      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl w-full max-w-xl max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800/50">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">
            {initialData ? 'Edit Asset' : 'Add New Asset'}
          </h2>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 dark:text-slate-400 rounded-lg hover:bg-slate-100 dark:bg-slate-800 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          <form id="asset-form" onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5 col-span-2 sm:col-span-1">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Asset Name *</label>
                <input
                  required
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
                  placeholder="e.g. MacBook Pro M3"
                />
              </div>

              <div className="space-y-1.5 col-span-2 sm:col-span-1">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Category *</label>
                <select
                  required
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
                >
                  <option value="IT Equipment">IT Equipment</option>
                  <option value="Furniture">Furniture</option>
                  <option value="Vehicles">Vehicles</option>
                  <option value="Machinery">Machinery</option>
                  <option value="Software">Software</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div className="space-y-1.5 col-span-2 sm:col-span-1">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Vendor *</label>
                <input
                  required
                  type="text"
                  value={vendor}
                  onChange={(e) => setVendor(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
                  placeholder="e.g. Apple Store"
                />
              </div>

              <div className="space-y-1.5 col-span-2 sm:col-span-1">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Serial Number / Asset Tag *</label>
                <input
                  required
                  type="text"
                  value={serialNumber}
                  onChange={(e) => setSerialNumber(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
                  placeholder="e.g. SN-12345"
                />
              </div>

              <div className="space-y-1.5 col-span-2 sm:col-span-1">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Purchase Date</label>
                <input
                  type="date"
                  value={purchaseDate}
                  onChange={(e) => setPurchaseDate(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
                />
              </div>

              <div className="space-y-1.5 col-span-2 sm:col-span-1">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Warranty Expiry Date *</label>
                <input
                  required
                  type="date"
                  value={warrantyDate}
                  onChange={(e) => setWarrantyDate(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
                />
              </div>

              <div className="space-y-1.5 col-span-2 sm:col-span-1">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Status *</label>
                <select
                  required
                  value={status}
                  onChange={(e) => setStatus(e.target.value as AssetItem['status'])}
                  className="w-full px-3 py-2 text-sm border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
                >
                  <option value="Active">Active</option>
                  <option value="Under Repair">Under Repair</option>
                  <option value="Retired">Retired</option>
                </select>
              </div>
              
              <div className="space-y-1.5 col-span-2 sm:col-span-1">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Assigned To (Optional)</label>
                <input
                  type="text"
                  value={assignedTo}
                  onChange={(e) => setAssignedTo(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
                  placeholder="e.g. John Doe"
                />
              </div>

              <div className="space-y-1.5 col-span-2">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Notes</label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 text-sm border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 resize-none"
                  placeholder="Any additional information..."
                />
              </div>
            </div>
          </form>
        </div>

        <div className="p-4 border-t border-slate-100 dark:border-slate-800/50 bg-slate-50 dark:bg-slate-950 rounded-b-2xl flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:text-white bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:bg-slate-950 rounded-xl transition-all"
          >
            Cancel
          </button>
          <button
            type="submit"
            form="asset-form"
            disabled={isSubmitting}
            className="px-4 py-2 text-sm font-bold text-white bg-primary-600 hover:bg-primary-700 rounded-xl shadow-xs transition-all disabled:opacity-50"
          >
            {isSubmitting ? 'Saving...' : initialData ? 'Update Asset' : 'Save Asset'}
          </button>
        </div>
      </div>
    </div>
  );
};
