import React, { useState, useEffect } from 'react';
import { Save, Building, Loader2 } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { getCompanyProfile, updateCompanyProfile } from '@/lib/companyStorage';
import { CompanyProfile } from '@/types/company';

interface Props {
  showToast: (msg: string, type: 'success'|'error') => void;
}

export const SystemCompanyPage: React.FC<Props> = ({ showToast }) => {
  const { userProfile } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  
  const [formData, setFormData] = useState<Partial<CompanyProfile>>({
    name: '',
    email: '',
    phone: '',
    website: '',
    address: '',
    tradeLicense: '',
    vat: '',
    tin: '',
  });

  useEffect(() => {
    if (userProfile?.companyId) {
      loadData(userProfile.companyId);
    }
  }, [userProfile?.companyId]);

  const loadData = async (companyId: string) => {
    setIsLoading(true);
    try {
      const data = await getCompanyProfile(companyId);
      if (data) setFormData(data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSave = async () => {
    if (!userProfile?.companyId) return;
    setIsSaving(true);
    try {
      await updateCompanyProfile(userProfile.companyId, formData);
      showToast('Company profile updated successfully', 'success');
      if (localStorage.getItem("dp_onboarding_step") === "company") {
        localStorage.setItem("dp_onboarding_step", "branch");
        window.location.reload(); // trigger page effect
      }

    } catch (err) {
      console.error(err);
      showToast('Failed to update profile', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="p-10 flex justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary-500" />
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto pb-20 p-4">
      {/* Header */}
      <div className="bg-[#0f172a] p-5 border-b border-slate-800 shadow-sm flex items-center gap-3 rounded-t-lg">
        <div className="p-2 bg-primary-500/20 rounded text-primary-400">
          <Building className="w-6 h-6" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-white uppercase tracking-wider">Company Profile</h2>
          <p className="text-xs text-slate-400 mt-0.5">Manage your core business details and tax information.</p>
        </div>
      </div>

      {/* Main Form */}
      <div className="bg-slate-900 border border-t-0 border-slate-800 rounded-b-lg shadow-sm p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          <div>
            <label className="block text-xs font-bold text-slate-400 mb-1.5 uppercase tracking-wider">Company Name</label>
            <input type="text" name="name" value={formData.name || ''} onChange={handleChange} placeholder="M/S Business Name" className="w-full bg-slate-950 border border-slate-800 text-white rounded px-4 py-2.5 text-sm focus:border-primary-500 transition-colors" />
          </div>
          
          <div>
            <label className="block text-xs font-bold text-slate-400 mb-1.5 uppercase tracking-wider">Business Email</label>
            <input type="email" name="email" value={formData.email || ''} onChange={handleChange} placeholder="info@company.com" className="w-full bg-slate-950 border border-slate-800 text-white rounded px-4 py-2.5 text-sm focus:border-primary-500 transition-colors" />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-400 mb-1.5 uppercase tracking-wider">Contact Phone</label>
            <input type="text" name="phone" value={formData.phone || ''} onChange={handleChange} placeholder="+8801XXXXXXXXX" className="w-full bg-slate-950 border border-slate-800 text-white rounded px-4 py-2.5 text-sm focus:border-primary-500 transition-colors" />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-400 mb-1.5 uppercase tracking-wider">Website</label>
            <input type="url" name="website" value={formData.website || ''} onChange={handleChange} placeholder="https://www.company.com" className="w-full bg-slate-950 border border-slate-800 text-white rounded px-4 py-2.5 text-sm focus:border-primary-500 transition-colors" />
          </div>

          <div className="md:col-span-2">
            <label className="block text-xs font-bold text-slate-400 mb-1.5 uppercase tracking-wider">HQ Address</label>
            <input type="text" name="address" value={formData.address || ''} onChange={handleChange} placeholder="Full address" className="w-full bg-slate-950 border border-slate-800 text-white rounded px-4 py-2.5 text-sm focus:border-primary-500 transition-colors" />
          </div>

          <div className="col-span-1 md:col-span-2 pt-4 border-t border-slate-800 mt-2">
            <h3 className="text-sm font-bold text-white mb-4">Legal & Tax Information</h3>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-400 mb-1.5 uppercase tracking-wider">Trade License No</label>
            <input type="text" name="tradeLicense" value={formData.tradeLicense || ''} onChange={handleChange} placeholder="License number" className="w-full bg-slate-950 border border-slate-800 text-white rounded px-4 py-2.5 text-sm focus:border-primary-500 transition-colors" />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-400 mb-1.5 uppercase tracking-wider">VAT Registration</label>
            <input type="text" name="vat" value={formData.vat || ''} onChange={handleChange} placeholder="VAT number" className="w-full bg-slate-950 border border-slate-800 text-white rounded px-4 py-2.5 text-sm focus:border-primary-500 transition-colors" />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-400 mb-1.5 uppercase tracking-wider">TIN</label>
            <input type="text" name="tin" value={formData.tin || ''} onChange={handleChange} placeholder="Tax Identification Number" className="w-full bg-slate-950 border border-slate-800 text-white rounded px-4 py-2.5 text-sm focus:border-primary-500 transition-colors" />
          </div>
        </div>

        <div className="mt-8 flex justify-end">
          <button 
            onClick={handleSave}
            disabled={isSaving}
            className="flex items-center gap-2 px-6 py-3 bg-primary-600 hover:bg-primary-500 disabled:opacity-50 text-white text-sm font-bold rounded shadow-lg transition-colors"
          >
            {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            {isSaving ? 'SAVING...' : 'SAVE CHANGES'}
          </button>
        </div>
      </div>
    </div>
  );
};
