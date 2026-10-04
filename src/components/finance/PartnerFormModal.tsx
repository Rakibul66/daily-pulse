import React, { useState, useEffect } from 'react';
import { Partner, PartnerRole } from '@/types/partnership';
import { X, User, Briefcase, Phone, Mail, Percent } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSave: (partner: Omit<Partner, 'id' | 'userId' | 'createdAt' | 'updatedAt' | 'totalInvested' | 'totalDividends'>) => Promise<void>;
  initialData?: Partner | null;
}

export const PartnerFormModal: React.FC<Props> = ({ isOpen, onClose, onSave, initialData }) => {
  const [formData, setFormData] = useState({
    name: '',
    role: 'Active Partner' as PartnerRole,
    phone: '',
    email: '',
    equityShare: 0,
    joinedDate: new Date().toISOString().split('T')[0],
    status: 'Active' as 'Active' | 'Inactive',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        setFormData({
          name: initialData.name || '',
          role: initialData.role || 'Active Partner',
          phone: initialData.phone || '',
          email: initialData.email || '',
          equityShare: initialData.equityShare || 0,
          joinedDate: initialData.joinedDate || new Date().toISOString().split('T')[0],
          status: initialData.status || 'Active',
        });
      } else {
        setFormData({
          name: '',
          role: 'Active Partner',
          phone: '',
          email: '',
          equityShare: 0,
          joinedDate: new Date().toISOString().split('T')[0],
          status: 'Active',
        });
      }
    }
  }, [isOpen, initialData]);

  if (!isOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: name === 'equityShare' ? Number(value) : value }));
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

  const inputClasses = "w-full text-sm font-bold text-white bg-slate-950 px-3 py-2 rounded-md border border-slate-700 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 placeholder-slate-600";
  const labelClasses = "text-xs font-semibold text-slate-300 block mb-1.5 flex items-center gap-1.5";

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-md shadow-md w-full max-w-lg overflow-hidden flex flex-col animate-in zoom-in-95 duration-200">
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Briefcase className="w-5 h-5 text-indigo-400" />
            <h2 className="text-base font-bold text-white">
              {initialData ? 'Edit Partner' : 'Add New Partner'}
            </h2>
          </div>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-white rounded-md transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto">
          <form id="partner-form" onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className={labelClasses}><User className="w-3.5 h-3.5" /> Full Name</label>
              <input type="text" name="name" value={formData.name} onChange={handleChange} className={inputClasses} placeholder="e.g. John Doe" required />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelClasses}>Role / Type</label>
                <select name="role" value={formData.role} onChange={handleChange} className={inputClasses}>
                  <option value="Active Partner">Active Partner</option>
                  <option value="Silent Investor">Silent Investor</option>
                </select>
              </div>
              <div>
                <label className={labelClasses}><Percent className="w-3.5 h-3.5" /> Equity Share (%)</label>
                <input type="number" name="equityShare" value={formData.equityShare} onChange={handleChange} className={inputClasses} min="0" max="100" step="0.01" required />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelClasses}><Phone className="w-3.5 h-3.5" /> Phone</label>
                <input type="tel" name="phone" value={formData.phone} onChange={handleChange} className={inputClasses} placeholder="Phone number" />
              </div>
              <div>
                <label className={labelClasses}><Mail className="w-3.5 h-3.5" /> Email</label>
                <input type="email" name="email" value={formData.email} onChange={handleChange} className={inputClasses} placeholder="Email address" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelClasses}>Date Joined</label>
                <input type="date" name="joinedDate" value={formData.joinedDate} onChange={handleChange} className={inputClasses} required />
              </div>
              <div>
                <label className={labelClasses}>Status</label>
                <select name="status" value={formData.status} onChange={handleChange} className={inputClasses}>
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>
            </div>

          </form>
        </div>

        <div className="px-6 py-4 border-t border-slate-800 bg-slate-900/80 flex justify-end gap-3">
          <button type="button" onClick={onClose} className="px-5 py-2.5 text-sm font-bold text-slate-300 bg-slate-800 border border-slate-700 rounded-md hover:bg-slate-700 transition-colors">
            Cancel
          </button>
          <button type="submit" form="partner-form" disabled={isSubmitting} className="px-5 py-2.5 text-sm font-bold text-white bg-indigo-600 rounded-md hover:bg-indigo-500 disabled:opacity-50 transition-colors shadow-md">
            {isSubmitting ? 'Saving...' : 'Save Partner'}
          </button>
        </div>
      </div>
    </div>
  );
};
