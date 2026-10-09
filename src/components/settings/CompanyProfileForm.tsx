import React from "react";
import { Loader2, Save } from "lucide-react";
import { CompanyProfile } from "@/types/company";

interface CompanyProfileFormProps {
  companyForm: Partial<CompanyProfile>;
  onChange: (updated: Partial<CompanyProfile>) => void;
  onSubmit: (e: React.FormEvent) => void;
  isSaving: boolean;
}

export const CompanyProfileForm: React.FC<CompanyProfileFormProps> = ({
  companyForm,
  onChange,
  onSubmit,
  isSaving,
}) => {
  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-black uppercase text-black mb-1">Company / Business Name *</label>
          <input
            type="text"
            required
            value={companyForm.name || ''}
            onChange={e => onChange({ ...companyForm, name: e.target.value })}
            className="w-full text-xs font-bold text-black bg-white px-3 py-2 border-2 border-black shadow-[2px_2px_0px_#000]"
            placeholder="e.g. Shomporko Retail & Distribution"
          />
        </div>

        <div>
          <label className="block text-xs font-black uppercase text-black mb-1">Official Email Address</label>
          <input
            type="email"
            value={companyForm.email || ''}
            onChange={e => onChange({ ...companyForm, email: e.target.value })}
            className="w-full text-xs font-bold text-black bg-white px-3 py-2 border-2 border-black shadow-[2px_2px_0px_#000]"
            placeholder="e.g. info@shomporko.com"
          />
        </div>

        <div>
          <label className="block text-xs font-black uppercase text-black mb-1">Primary Phone / WhatsApp</label>
          <input
            type="text"
            value={companyForm.phone || ''}
            onChange={e => onChange({ ...companyForm, phone: e.target.value })}
            className="w-full text-xs font-bold text-black bg-white px-3 py-2 border-2 border-black shadow-[2px_2px_0px_#000]"
            placeholder="e.g. +880 1315 861003"
          />
        </div>

        <div>
          <label className="block text-xs font-black uppercase text-black mb-1">Website URL</label>
          <input
            type="text"
            value={companyForm.website || ''}
            onChange={e => onChange({ ...companyForm, website: e.target.value })}
            className="w-full text-xs font-bold text-black bg-white px-3 py-2 border-2 border-black shadow-[2px_2px_0px_#000]"
            placeholder="e.g. https://shomporko.com"
          />
        </div>

        <div>
          <label className="block text-xs font-black uppercase text-black mb-1">Trade License Number</label>
          <input
            type="text"
            value={companyForm.tradeLicense || ''}
            onChange={e => onChange({ ...companyForm, tradeLicense: e.target.value })}
            className="w-full text-xs font-bold text-black bg-white px-3 py-2 border-2 border-black shadow-[2px_2px_0px_#000]"
            placeholder="e.g. TRAD/DNCC/102938/2026"
          />
        </div>

        <div>
          <label className="block text-xs font-black uppercase text-black mb-1">BIN / VAT Registration</label>
          <input
            type="text"
            value={companyForm.vat || ''}
            onChange={e => onChange({ ...companyForm, vat: e.target.value })}
            className="w-full text-xs font-bold text-black bg-white px-3 py-2 border-2 border-black shadow-[2px_2px_0px_#000]"
            placeholder="e.g. BIN-002938472-0101"
          />
        </div>
      </div>

      <div>
        <label className="block text-xs font-black uppercase text-black mb-1">Head Office Address</label>
        <textarea
          rows={2}
          value={companyForm.address || ''}
          onChange={e => onChange({ ...companyForm, address: e.target.value })}
          className="w-full text-xs font-bold text-black bg-white px-3 py-2 border-2 border-black shadow-[2px_2px_0px_#000]"
          placeholder="e.g. House 42, Road 11, Banani, Dhaka-1213, Bangladesh"
        />
      </div>

      <div className="pt-2 flex justify-end">
        <button
          type="submit"
          disabled={isSaving}
          className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-display font-black text-xs uppercase tracking-wider border-2 border-black shadow-[3px_3px_0px_#000] flex items-center gap-2 cursor-pointer disabled:opacity-50"
        >
          {isSaving ? <Loader2 className="w-4 h-4 animate-spin text-white" /> : <Save className="w-4 h-4 text-amber-300" />}
          SAVE COMPANY PROFILE
        </button>
      </div>
    </form>
  );
};
