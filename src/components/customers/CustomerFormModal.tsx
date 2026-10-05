import React, { useState, useEffect } from 'react';
import { Customer } from '@/types/customer';
import { X } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSave: (customer: Omit<Customer, 'id' | 'userId' | 'createdAt' | 'updatedAt' | 'loyaltyPoints' | 'loyaltyTier' | 'totalSpent'>) => Promise<void>;
  initialData?: Customer | null;
}

export const CustomerFormModal: React.FC<Props> = ({ isOpen, onClose, onSave, initialData }) => {
  const [formData, setFormData] = useState({
    businessName: '',
    ownerName: '',
    phone: '',
    email: '',
    address: '',
    businessType: 'Restaurant',
    customerSince: new Date().toISOString().split('T')[0],
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        setFormData({
          businessName: initialData.businessName || '',
          ownerName: initialData.ownerName || '',
          phone: initialData.phone || '',
          email: initialData.email || '',
          address: initialData.address || '',
          businessType: initialData.businessType || 'Restaurant',
          customerSince: initialData.customerSince || new Date().toISOString().split('T')[0],
        });
      } else {
        setFormData({
          businessName: '',
          ownerName: '',
          phone: '',
          email: '',
          address: '',
          businessType: 'Restaurant',
          customerSince: new Date().toISOString().split('T')[0],
        });
      }
    }
  }, [isOpen, initialData]);

  if (!isOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
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
          <h2 className="text-base font-bold text-white">
            {initialData ? 'Edit Customer' : 'Add New Customer'}
          </h2>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-white rounded-md transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto">
          <form id="customer-form" onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className={labelClasses}>Business Name *</label>
              <input type="text" name="businessName" value={formData.businessName} onChange={handleChange} className={inputClasses} required />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelClasses}>Owner/Contact Name</label>
                <input type="text" name="ownerName" value={formData.ownerName} onChange={handleChange} className={inputClasses} />
              </div>
              <div>
                <label className={labelClasses}>Phone Number *</label>
                <input type="text" name="phone" value={formData.phone} onChange={handleChange} className={inputClasses} required />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelClasses}>Email</label>
                <input type="email" name="email" value={formData.email} onChange={handleChange} className={inputClasses} />
              </div>
              <div>
                <label className={labelClasses}>Business Type</label>
                <select name="businessType" value={formData.businessType} onChange={handleChange} className={inputClasses}>
                  <option value="Restaurant">Restaurant</option>
                  <option value="E-commerce">E-commerce</option>
                  <option value="Retail">Retail</option>
                  <option value="Service">Service</option>
                  <option value="Agency">Agency</option>
                  <option value="Education">Education</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>
            <div>
              <label className={labelClasses}>Address</label>
              <input type="text" name="address" value={formData.address} onChange={handleChange} className={inputClasses} />
            </div>
            <div>
              <label className={labelClasses}>Customer Since</label>
              <input type="date" name="customerSince" value={formData.customerSince} onChange={handleChange} className={inputClasses} required />
            </div>
          </form>
        </div>

        <div className="px-6 py-4 border-t border-slate-800 bg-slate-900/80 flex justify-end gap-3">
          <button type="button" onClick={onClose} className="px-5 py-2.5 text-sm font-bold text-slate-300 bg-slate-800 border border-slate-700 rounded-md hover:bg-slate-700 transition-colors">
            Cancel
          </button>
          <button type="submit" form="customer-form" disabled={isSubmitting} className="px-5 py-2.5 text-sm font-bold text-white bg-primary-600 rounded-md hover:bg-primary-500 disabled:opacity-50 transition-colors shadow-md">
            {isSubmitting ? 'Saving...' : 'Save Customer'}
          </button>
        </div>
      </div>
    </div>
  );
};
