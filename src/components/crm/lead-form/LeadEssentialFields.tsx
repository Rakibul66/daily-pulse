import React from "react";
import { MessageSquare } from "lucide-react";
import { BUSINESS_CATEGORIES, inputClasses, labelClasses, LeadFormData } from "./types";

interface LeadEssentialFieldsProps {
  formData: LeadFormData;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
  onWhatsappChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const LeadEssentialFields: React.FC<LeadEssentialFieldsProps> = ({
  formData,
  onChange,
  onWhatsappChange,
}) => {
  const currentSubTypes = BUSINESS_CATEGORIES[formData.businessType] || BUSINESS_CATEGORIES['Other'];

  return (
    <div className="bg-amber-50/50 border-2 sm:border-3 border-black p-4 sm:p-5 shadow-[4px_4px_0px_#000]">
      <div className="flex items-center justify-between mb-4 pb-2 border-b-2 border-black">
        <span className="text-xs font-black uppercase tracking-wider text-black flex items-center gap-2">
          <span className="w-2.5 h-2.5 bg-amber-400 border border-black inline-block"></span>
          Essential Information
        </span>
        <span className="text-[10px] font-bold text-slate-600 uppercase">
          Fast Capture
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* 1. Business Name */}
        <div className="sm:col-span-2">
          <label className={labelClasses}>
            Business Name <span className="text-red-600">*</span>
          </label>
          <input
            type="text"
            name="businessName"
            value={formData.businessName}
            onChange={onChange}
            className={inputClasses}
            placeholder="e.g. Sultan's Dine, Cafe Delight, Tech Store"
            required
            autoFocus
          />
        </div>

        {/* 2. Whatsapp Number */}
        <div className="sm:col-span-2">
          <label className={labelClasses}>
            <span className="flex items-center gap-1.5">
              <MessageSquare className="w-3.5 h-3.5 text-emerald-600" />
              WhatsApp Number <span className="text-red-600">*</span>
            </span>
          </label>
          <input
            type="text"
            name="whatsapp"
            value={formData.whatsapp}
            onChange={onWhatsappChange}
            className={inputClasses}
            placeholder="e.g. 01712-345678 or +88017..."
            required
          />
        </div>

        {/* 3. Business Type */}
        <div>
          <label className={labelClasses}>Business Type</label>
          <select
            name="businessType"
            value={formData.businessType}
            onChange={onChange}
            className={inputClasses}
          >
            {Object.keys(BUSINESS_CATEGORIES).map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
        </div>

        {/* 4. Business Sub-Type */}
        <div>
          <label className={labelClasses}>Business Sub-Type</label>
          <select
            name="businessSubType"
            value={formData.businessSubType}
            onChange={onChange}
            className={inputClasses}
          >
            {currentSubTypes.map(subType => (
              <option key={subType} value={subType}>{subType}</option>
            ))}
          </select>
        </div>

        {/* 5. Lead Source */}
        <div>
          <label className={labelClasses}>Lead Source</label>
          <select
            name="leadSource"
            value={formData.leadSource}
            onChange={onChange}
            className={inputClasses}
          >
            <option value="Facebook">Facebook</option>
            <option value="WhatsApp">WhatsApp</option>
            <option value="Google">Google</option>
            <option value="Referral">Referral</option>
            <option value="Cold Call">Cold Call</option>
            <option value="Other">Other</option>
          </select>
        </div>

        {/* 6. Lead Status */}
        <div>
          <label className={labelClasses}>Lead Status</label>
          <select
            name="leadStatus"
            value={formData.leadStatus}
            onChange={onChange}
            className={inputClasses}
          >
            <option value="NEW">NEW</option>
            <option value="CONTACTED">CONTACTED</option>
            <option value="REPLIED">REPLIED</option>
            <option value="QUALIFIED">QUALIFIED</option>
            <option value="DEMO BOOKED">DEMO BOOKED</option>
            <option value="DEMO DONE">DEMO DONE</option>
            <option value="PROPOSAL">PROPOSAL</option>
            <option value="NEGOTIATION">NEGOTIATION</option>
            <option value="WON">WON</option>
            <option value="CONVERTED">CONVERTED</option>
            <option value="LOST">LOST</option>
          </select>
        </div>
      </div>
    </div>
  );
};
