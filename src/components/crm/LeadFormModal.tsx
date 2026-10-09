import React, { useState, useEffect } from 'react';
import { Lead } from '@/types/crm';
import { X, Loader2, UserPlus, Check, Zap, ChevronDown, ChevronUp } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { getHRMSettings } from '@/lib/hrmStorage';
import { withActionLock } from '@/lib/rateLimit';
import { LeadFormData, emptyLead, BUSINESS_CATEGORIES } from './lead-form/types';
import { LeadAiPaste } from './lead-form/LeadAiPaste';
import { LeadEssentialFields } from './lead-form/LeadEssentialFields';
import { LeadAdvancedFields } from './lead-form/LeadAdvancedFields';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSave: (lead: LeadFormData) => Promise<void>;
  initialData?: Lead | null;
}

export const LeadFormModal: React.FC<Props> = ({ isOpen, onClose, onSave, initialData }) => {
  const [formData, setFormData] = useState<LeadFormData>(emptyLead());
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showAdvancedFields, setShowAdvancedFields] = useState(false);
  const { user } = useAuth();
  const [aiEnabled, setAiEnabled] = useState(false);
  const [apiKey, setApiKey] = useState('');

  const isEditMode = Boolean(initialData);

  useEffect(() => {
    if (isOpen) {
      if (user) {
        getHRMSettings(user.uid).then(settings => {
          if (settings) {
            setAiEnabled(settings.aiEnabled || false);
            setApiKey(settings.geminiApiKey || '');
          }
        }).catch(console.error);
      }

      if (initialData) {
        setFormData({
          ...initialData,
          whatsapp: initialData.whatsapp || initialData.phone || '',
          businessName: initialData.businessName || (initialData as any).restaurantName || '',
          businessType: initialData.businessType || (initialData as any).restaurantType || 'Restaurant',
          businessSubType: initialData.businessSubType || 'Other',
        });
        setShowAdvancedFields(true); // Always show all fields on edit
      } else {
        setFormData(emptyLead());
        setShowAdvancedFields(false); // Quick 6-field add mode
      }
    }
  }, [isOpen, initialData, user]);

  if (!isOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData((prev) => ({ ...prev, [name]: checked }));
    } else if (type === 'number') {
      setFormData((prev) => ({ ...prev, [name]: Number(value) }));
    } else {
      setFormData((prev) => {
        const newData = { ...prev, [name]: value };
        if (name === 'businessType') {
          newData.businessSubType = BUSINESS_CATEGORIES[value]?.[0] || 'Other';
        }
        return newData;
      });
    }
  };

  const handleWhatsappChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    handleChange(e);
    // sync with phone if phone was empty
    setFormData(prev => ({ ...prev, whatsapp: val, phone: prev.phone || val }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    setIsSubmitting(true);
    try {
      await withActionLock('lead_save', 1500, async () => {
        const dataToSave = {
          ...formData,
          phone: formData.phone || formData.whatsapp || '',
          whatsapp: formData.whatsapp || formData.phone || '',
        };
        await onSave(dataToSave);
        onClose();
      });
    } catch (err: unknown) {
      console.error(err);
      const msg = err instanceof Error ? err.message : 'Failed to save lead';
      alert(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 md:p-8 pt-8 sm:pt-14 pb-8 sm:pb-14 bg-black/70 backdrop-blur-xs overflow-y-auto">
      {/* Modal Card */}
      <div className="relative w-full max-w-3xl max-h-[85vh] bg-white border-4 border-black shadow-[8px_8px_0px_#000] sm:shadow-[12px_12px_0px_#000] my-auto flex flex-col overflow-hidden text-black animate-in fade-in zoom-in-95 duration-200">
        
        {/* Top Accent Strip */}
        <div className="h-2.5 bg-gradient-to-r from-amber-400 via-indigo-600 to-emerald-500 border-b-2 border-black shrink-0" />

        {/* Modal Header */}
        <div className="px-5 sm:px-6 py-4 border-b-3 border-black bg-white flex items-center justify-between gap-4 shrink-0">
          <div className="flex items-center gap-3">
            <div className={`w-11 h-11 ${isEditMode ? 'bg-indigo-200' : 'bg-amber-300'} border-2 sm:border-3 border-black shadow-[2px_2px_0px_#000] flex items-center justify-center text-black shrink-0 font-black text-sm`}>
              {isEditMode ? <UserPlus className="w-5 h-5 stroke-[2.5]" /> : <Zap className="w-5 h-5 stroke-[2.5]" />}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-display font-black text-lg sm:text-xl uppercase tracking-tight text-black leading-tight">
                  {isEditMode ? 'EDIT LEAD PROFILE' : 'FAST LEAD ENTRY'}
                </h2>
                {!isEditMode && (
                  <span className="px-2 py-0.5 bg-emerald-300 border border-black font-black text-[10px] uppercase shadow-[1px_1px_0px_#000]">
                    6 QUICK FIELDS
                  </span>
                )}
              </div>
              <p className="text-[11px] font-bold text-slate-600 uppercase tracking-wide">
                {isEditMode
                  ? 'Update complete profile, pipeline & deal closure details'
                  : 'Quick register • All detailed fields can be updated anytime in edit'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            type="button"
            className="p-1.5 bg-white hover:bg-red-600 hover:text-white border-2 border-black shadow-[2px_2px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 transition-all cursor-pointer"
            aria-label="Close Modal"
          >
            <X className="w-5 h-5 stroke-[2.5]" />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <div className="p-5 sm:p-7 overflow-y-auto flex-1 custom-scrollbar">
          <form id="lead-form" onSubmit={handleSubmit} className="space-y-4">
            
            {/* AI Smart Paste */}
            {aiEnabled && !isEditMode && (
              <LeadAiPaste
                apiKey={apiKey}
                onApplyParsedData={setFormData}
              />
            )}

            {/* 6 ESSENTIAL QUICK FIELDS */}
            <LeadEssentialFields
              formData={formData}
              onChange={handleChange}
              onWhatsappChange={handleWhatsappChange}
            />

            {/* Quick Add Mode Toggle for Advanced Fields */}
            {!isEditMode && (
              <div className="pt-1">
                <button
                  type="button"
                  onClick={() => setShowAdvancedFields(!showAdvancedFields)}
                  className="w-full py-2.5 px-4 bg-slate-100 hover:bg-slate-200 border-2 border-black font-black text-xs uppercase tracking-wider text-black flex items-center justify-between transition-colors cursor-pointer"
                >
                  <span className="flex items-center gap-2">
                    <span>{showAdvancedFields ? '– Hide' : '+ Optional: Show More Fields Now'}</span>
                    <span className="text-[10px] text-slate-500 font-bold lowercase">(or leave blank & edit anytime later)</span>
                  </span>
                  {showAdvancedFields ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>
              </div>
            )}

            {/* FULL / ADVANCED FIELDS */}
            {(showAdvancedFields || isEditMode) && (
              <LeadAdvancedFields
                formData={formData}
                onChange={handleChange}
              />
            )}

          </form>
        </div>

        {/* Modal Footer */}
        <div className="px-5 sm:px-6 py-4 border-t-3 border-black bg-white flex items-center justify-between gap-3 shrink-0">
          <div className="text-[11px] font-bold text-slate-500 uppercase hidden sm:block">
            {isEditMode ? 'Full Edit Mode' : 'Quick 6-Field Mode'}
          </div>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 bg-white hover:bg-slate-100 border-2 border-black font-black text-xs uppercase tracking-wider text-black shadow-[2px_2px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 transition-all cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              form="lead-form"
              disabled={isSubmitting}
              className="px-6 py-2.5 bg-emerald-400 hover:bg-emerald-300 border-2 sm:border-3 border-black font-black text-xs sm:text-sm uppercase tracking-wider text-black shadow-[3px_3px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 transition-all flex items-center gap-2 disabled:opacity-50 cursor-pointer"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-black" />
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <Check className="w-4 h-4 stroke-[3]" />
                  <span>{isEditMode ? 'Update Lead' : 'Save Lead Fast'}</span>
                </>
              )}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
