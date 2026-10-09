import React from "react";
import { Globe, DollarSign, Languages } from "lucide-react";

interface LocalizationSettingsSectionProps {
  language: string;
  currency: string;
  timezone: string;
  onLanguageChange: (val: string) => void;
  onCurrencyChange: (val: string) => void;
  onTimezoneChange: (val: string) => void;
}

export const LocalizationSettingsSection: React.FC<LocalizationSettingsSectionProps> = ({
  language,
  currency,
  timezone,
  onLanguageChange,
  onCurrencyChange,
  onTimezoneChange,
}) => {
  return (
    <div className="p-6 sm:p-8 bg-white border-b-4 border-black">
      <div className="max-w-4xl space-y-6">
        <div className="border-b-2 border-black pb-3 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Globe className="w-5 h-5 text-indigo-600 stroke-[2.5]" />
            <h2 className="font-display font-black text-base uppercase text-black tracking-wider">
              LOCALIZATION & REGIONAL DEFAULTS
            </h2>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Language Selector */}
          <div className="bg-slate-50 border-3 border-black p-4 shadow-[4px_4px_0px_#000]">
            <label className="text-xs font-black text-black mb-1.5 uppercase tracking-wider flex items-center gap-1.5">
              <Languages className="w-4 h-4 text-indigo-600" />
              SYSTEM LANGUAGE
            </label>
            <select
              value={language}
              onChange={(e) => onLanguageChange(e.target.value)}
              className="w-full text-xs font-bold text-black bg-white px-3 py-2 border-2 border-black shadow-[2px_2px_0px_#000] outline-none cursor-pointer focus:bg-amber-50"
            >
              <option value="en">English (US / Global)</option>
              <option value="bn">বাংলা — Bengali (Bangladesh)</option>
            </select>
          </div>

          {/* Default Currency */}
          <div className="bg-slate-50 border-3 border-black p-4 shadow-[4px_4px_0px_#000]">
            <label className="text-xs font-black text-black mb-1.5 uppercase tracking-wider flex items-center gap-1.5">
              <DollarSign className="w-4 h-4 text-emerald-600" />
              BILLING CURRENCY
            </label>
            <select
              value={currency}
              onChange={(e) => onCurrencyChange(e.target.value)}
              className="w-full text-xs font-bold text-black bg-white px-3 py-2 border-2 border-black shadow-[2px_2px_0px_#000] outline-none cursor-pointer focus:bg-amber-50"
            >
              <option value="BDT">BDT (৳) — Bangladeshi Taka</option>
              <option value="USD">USD ($) — US Dollar</option>
              <option value="EUR">EUR (€) — Euro</option>
              <option value="GBP">GBP (£) — British Pound</option>
              <option value="SAR">SAR (﷼) — Saudi Riyal</option>
              <option value="AED">AED (د.إ) — UAE Dirham</option>
            </select>
          </div>

          {/* Timezone */}
          <div className="bg-slate-50 border-3 border-black p-4 shadow-[4px_4px_0px_#000]">
            <label className="text-xs font-black text-black mb-1.5 uppercase tracking-wider flex items-center gap-1.5">
              <Globe className="w-4 h-4 text-indigo-600" />
              REGIONAL TIMEZONE
            </label>
            <select
              value={timezone}
              onChange={(e) => onTimezoneChange(e.target.value)}
              className="w-full text-xs font-bold text-black bg-white px-3 py-2 border-2 border-black shadow-[2px_2px_0px_#000] outline-none cursor-pointer focus:bg-amber-50"
            >
              <option value="Asia/Dhaka">Asia/Dhaka (GMT+6) — Bangladesh</option>
              <option value="Asia/Kolkata">Asia/Kolkata (GMT+5:30) — India</option>
              <option value="Asia/Dubai">Asia/Dubai (GMT+4) — UAE</option>
              <option value="Asia/Riyadh">Asia/Riyadh (GMT+3) — Saudi Arabia</option>
              <option value="Europe/London">Europe/London (GMT+0 / BST)</option>
              <option value="America/New_York">America/New_York (EST / EDT)</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};
