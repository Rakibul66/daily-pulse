import React, { useState, useEffect } from 'react';
import { Customer } from '@/types/customer';
import { X, UserPlus, Building, Phone, Mail, MapPin, Calendar, Tag } from 'lucide-react';

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
    source: 'Direct / Manual',
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
          source: initialData.source || 'Direct / Manual',
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
          source: 'Direct / Manual',
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

  const inputClasses = "w-full text-xs font-bold text-black bg-white px-3 py-2 border-2 border-black focus:outline-none focus:bg-amber-50 placeholder-slate-400";
  const labelClasses = "text-[11px] font-black uppercase text-black block mb-1 tracking-wider";

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 pt-10 sm:pt-14 overflow-y-auto">
      <div className="bg-white border-2 sm:border-4 border-black shadow-[8px_8px_0px_#000] w-full max-w-lg overflow-hidden flex flex-col my-auto animate-in zoom-in-95 duration-200">
        
        {/* Top Accent Strip */}
        <div className="h-2 bg-amber-400 border-b-2 border-black w-full" />

        {/* Modal Header */}
        <div className="px-5 py-3.5 border-b-2 border-black bg-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 bg-amber-300 border-2 border-black shadow-[2px_2px_0px_#000]">
              <UserPlus className="w-4 h-4 text-black stroke-[2.5]" />
            </div>
            <div>
              <h2 className="text-sm font-black uppercase tracking-wider text-black">
                {initialData ? 'Edit Customer' : 'Add New Customer'}
              </h2>
              <p className="text-[10px] font-bold text-slate-600 uppercase">
                {initialData ? 'Update client directory record' : 'Create a direct client profile'}
              </p>
            </div>
          </div>
          <button 
            type="button"
            onClick={onClose} 
            className="p-1 bg-white hover:bg-red-500 hover:text-white border-2 border-black transition-colors cursor-pointer"
          >
            <X className="w-4 h-4 stroke-[3]" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 max-h-[75vh] overflow-y-auto">
          <form id="customer-form" onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className={labelClasses}>
                <span className="flex items-center gap-1.5">
                  <Building className="w-3.5 h-3.5" /> Business / Client Name *
                </span>
              </label>
              <input 
                type="text" 
                name="businessName" 
                value={formData.businessName} 
                onChange={handleChange} 
                className={inputClasses} 
                placeholder="e.g. Sultan's Dine or TechCorp"
                required 
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label className={labelClasses}>Owner / Contact Person</label>
                <input 
                  type="text" 
                  name="ownerName" 
                  value={formData.ownerName} 
                  onChange={handleChange} 
                  className={inputClasses} 
                  placeholder="e.g. Mr. Rafiqul Islam"
                />
              </div>
              <div>
                <label className={labelClasses}>
                  <span className="flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5" /> Phone / WhatsApp *
                  </span>
                </label>
                <input 
                  type="text" 
                  name="phone" 
                  value={formData.phone} 
                  onChange={handleChange} 
                  className={inputClasses} 
                  placeholder="e.g. 01712345678"
                  required 
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label className={labelClasses}>
                  <span className="flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5" /> Email Address
                  </span>
                </label>
                <input 
                  type="email" 
                  name="email" 
                  value={formData.email} 
                  onChange={handleChange} 
                  className={inputClasses} 
                  placeholder="client@example.com"
                />
              </div>
              <div>
                <label className={labelClasses}>
                  <span className="flex items-center gap-1.5">
                    <Tag className="w-3.5 h-3.5" /> Business Type
                  </span>
                </label>
                <select 
                  name="businessType" 
                  value={formData.businessType} 
                  onChange={handleChange} 
                  className={inputClasses}
                >
                  <option value="Restaurant">Restaurant</option>
                  <option value="Cafe">Cafe</option>
                  <option value="Bakery">Bakery</option>
                  <option value="Retail">Retail</option>
                  <option value="E-commerce">E-commerce</option>
                  <option value="Super shop">Super shop</option>
                  <option value="Service">Service</option>
                  <option value="Agency">Agency</option>
                  <option value="Education">Education</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>

            <div>
              <label className={labelClasses}>
                <span className="flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5" /> Address / Location
                </span>
              </label>
              <input 
                type="text" 
                name="address" 
                value={formData.address} 
                onChange={handleChange} 
                className={inputClasses} 
                placeholder="e.g. Banani 11, Dhaka"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label className={labelClasses}>
                  <span className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5" /> Customer Since
                  </span>
                </label>
                <input 
                  type="date" 
                  name="customerSince" 
                  value={formData.customerSince} 
                  onChange={handleChange} 
                  className={inputClasses} 
                  required 
                />
              </div>
              <div>
                <label className={labelClasses}>Source Category</label>
                <select 
                  name="source" 
                  value={formData.source} 
                  onChange={handleChange} 
                  className={inputClasses}
                >
                  <option value="Direct / Manual">Direct / Manual</option>
                  <option value="Converted Lead">Converted Lead</option>
                  <option value="Referral">Referral</option>
                  <option value="Bulk CSV Import">Bulk CSV Import</option>
                </select>
              </div>
            </div>
          </form>
        </div>

        {/* Modal Footer */}
        <div className="px-5 py-3 border-t-2 border-black bg-slate-50 flex items-center justify-end gap-3">
          <button 
            type="button" 
            onClick={onClose} 
            className="px-4 py-2 text-xs font-black uppercase text-black bg-white hover:bg-slate-200 border-2 border-black transition-all cursor-pointer shadow-[2px_2px_0px_#000] active:translate-x-0.5 active:translate-y-0.5"
          >
            Cancel
          </button>
          <button 
            type="submit" 
            form="customer-form" 
            disabled={isSubmitting} 
            className="px-5 py-2 text-xs font-black uppercase text-black bg-emerald-400 hover:bg-emerald-300 border-2 border-black transition-all cursor-pointer shadow-[2px_2px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 disabled:opacity-50"
          >
            {isSubmitting ? 'Saving...' : initialData ? 'Update Customer' : 'Save Customer'}
          </button>
        </div>
      </div>
    </div>
  );
};
