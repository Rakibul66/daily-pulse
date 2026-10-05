import React, { useState, useEffect } from 'react';
import { SalesClient } from '@/types/sales';
import { X } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSave: (client: Omit<SalesClient, 'id' | 'userId' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  initialData?: SalesClient | null;
}

export const ClientFormModal: React.FC<Props> = ({ isOpen, onClose, onSave, initialData }) => {
  const [formData, setFormData] = useState({
    area: '',
    territory: '',
    clientName: '',
    code: '',
    phone: '',
    address: '',
    isActive: true,
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        setFormData({
          area: initialData.area,
          territory: initialData.territory,
          clientName: initialData.clientName,
          code: initialData.code,
          phone: initialData.phone,
          address: initialData.address,
          isActive: initialData.isActive,
        });
      } else {
        setFormData({
          area: '',
          territory: '',
          clientName: '',
          code: '',
          phone: '',
          address: '',
          isActive: true,
        });
      }
    }
  }, [isOpen, initialData]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      await onSave({ ...formData });
      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputClasses = "w-full text-sm font-medium text-white bg-slate-950 px-3 py-2.5 rounded-md border border-slate-700 focus:border-[#20B2AA] focus:ring-1 focus:ring-[#20B2AA] placeholder-slate-600";
  const labelClasses = "text-xs font-semibold text-slate-300 block mb-1.5";

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-xl shadow-xl w-full max-w-2xl flex flex-col animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="px-6 py-4 flex items-center justify-between border-b border-slate-800 bg-slate-900/50">
          <h2 className="text-lg font-bold text-white uppercase tracking-wider">
            {initialData ? 'Edit Client' : 'Add New Client'}
          </h2>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-white rounded transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6">
          <form id="client-form" onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className={labelClasses}>Client Name <span className="text-rose-500">*</span></label>
                <input type="text" value={formData.clientName} onChange={(e) => setFormData({...formData, clientName: e.target.value})} className={inputClasses} required />
              </div>
              
              <div>
                <label className={labelClasses}>Code <span className="text-rose-500">*</span></label>
                <input type="text" value={formData.code} onChange={(e) => setFormData({...formData, code: e.target.value})} className={inputClasses} required />
              </div>

              <div>
                <label className={labelClasses}>Area <span className="text-rose-500">*</span></label>
                <input type="text" value={formData.area} onChange={(e) => setFormData({...formData, area: e.target.value})} className={inputClasses} required placeholder="e.g. Rampura - Aftab Nagor" />
              </div>

              <div>
                <label className={labelClasses}>Territory <span className="text-rose-500">*</span></label>
                <input type="text" value={formData.territory} onChange={(e) => setFormData({...formData, territory: e.target.value})} className={inputClasses} required placeholder="e.g. Jamtola" />
              </div>

              <div>
                <label className={labelClasses}>Phone <span className="text-rose-500">*</span></label>
                <input type="text" value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} className={inputClasses} required placeholder="e.g. 01921588521" />
              </div>

              <div>
                <label className={labelClasses}>Status</label>
                <div className="flex items-center gap-3 h-[42px]">
                  <button 
                    type="button" 
                    onClick={() => setFormData({...formData, isActive: !formData.isActive})}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${formData.isActive ? 'bg-[#20B2AA]' : 'bg-slate-700'}`}
                  >
                    <span className={`inline-block h-4 w-4 transform rounded-full bg-white dark:bg-slate-900 transition-transform ${formData.isActive ? 'translate-x-6' : 'translate-x-1'}`} />
                  </button>
                  <span className="text-sm font-semibold text-slate-300">{formData.isActive ? 'Active' : 'Inactive'}</span>
                </div>
              </div>
            </div>

            <div>
              <label className={labelClasses}>Address</label>
              <textarea 
                value={formData.address} 
                onChange={(e) => setFormData({...formData, address: e.target.value})} 
                className={`${inputClasses} resize-none min-h-[80px]`}
              ></textarea>
            </div>
            
          </form>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-800 bg-slate-900/50 flex justify-end gap-3">
          <button type="button" onClick={onClose} className="px-5 py-2 text-sm font-bold text-slate-300 bg-slate-800 border border-slate-700 rounded hover:bg-slate-700 transition-colors">
            CANCEL
          </button>
          <button type="submit" form="client-form" disabled={isSubmitting} className="px-5 py-2 text-sm font-bold text-white bg-[#20B2AA] rounded hover:bg-[#1A9C96] disabled:opacity-50 transition-colors shadow-md">
            {initialData ? 'SAVE CHANGES' : 'ADD CLIENT'}
          </button>
        </div>
      </div>
    </div>
  );
};
