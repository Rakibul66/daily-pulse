import React, { useState, useEffect } from 'react';
import { Settings, Globe, Palette, LayoutTemplate, DollarSign } from 'lucide-react';
import { useTheme } from 'next-themes';

interface Props {
  showToast: (msg: string, type: 'success'|'error') => void;
}

export const SettingsPage: React.FC<Props> = ({ showToast }) => {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const [currency, setCurrency] = useState('BDT');
  const [timezone, setTimezone] = useState('Asia/Dhaka');

  const handleSave = () => {
    showToast("Settings saved successfully", "success");
  };

  return (
    <div className="w-full mx-auto space-y-6 pb-20">
      <div className="bg-[#0f172a] p-4 sm:p-5 rounded-md border border-slate-800 shadow-md flex flex-wrap items-center justify-between gap-4 text-white">
        <div>
          <div className="flex flex-wrap items-center gap-2.5">
            <Settings className="w-5 h-5 text-primary-400" />
            <h2 className="text-lg font-bold text-white uppercase tracking-wider">Settings</h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">Configure workspace preferences and layout.</p>
        </div>
        <button 
          onClick={handleSave}
          className="px-6 py-2 bg-primary-600 hover:bg-primary-500 rounded-md text-xs font-bold text-white shadow-md uppercase tracking-wider transition-colors"
        >
          Save Changes
        </button>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {/* UI & Layout */}
        <div className="bg-slate-900 rounded-xl border border-slate-800 p-6 shadow-md">
          <div className="flex items-center gap-3 mb-6 border-b border-slate-800/60 pb-3">
            <Palette className="w-5 h-5 text-emerald-400" />
            <h3 className="text-base font-bold text-white">Appearance & Layout</h3>
          </div>
          
          <div className="space-y-6">

            <div>
              <label className="block text-xs font-bold text-slate-400 mb-2 uppercase tracking-wider flex items-center gap-2">
                <Palette className="w-4 h-4" /> Theme Preference
              </label>
              <select 
                value={mounted ? theme : 'system'}
                onChange={e => setTheme(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 text-white text-sm rounded-lg px-3 py-2.5 focus:outline-none focus:border-primary-500"
              >
                <option value="light">Light Mode</option>
                <option value="dark">Dark Mode</option>
                <option value="system">System Default</option>
              </select>
            </div>
          </div>
        </div>

        {/* Regional Settings */}
        <div className="bg-slate-900 rounded-xl border border-slate-800 p-6 shadow-md">
          <div className="flex items-center gap-3 mb-6 border-b border-slate-800/60 pb-3">
            <Globe className="w-5 h-5 text-indigo-400" />
            <h3 className="text-base font-bold text-white">Localization</h3>
          </div>
          
          <div className="space-y-6">
            <div>
              <label className="block text-xs font-bold text-slate-400 mb-2 uppercase tracking-wider flex items-center gap-2">
                <DollarSign className="w-4 h-4" /> Default Currency
              </label>
              <select 
                value={currency}
                onChange={e => setCurrency(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 text-white text-sm rounded-lg px-3 py-2.5 focus:outline-none focus:border-primary-500"
              >
                <option value="BDT">BDT (৳) - Bangladeshi Taka</option>
                <option value="USD">USD ($) - US Dollar</option>
                <option value="EUR">EUR (€) - Euro</option>
                <option value="GBP">GBP (£) - British Pound</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-400 mb-2 uppercase tracking-wider flex items-center gap-2">
                <Globe className="w-4 h-4" /> Timezone
              </label>
              <select 
                value={timezone}
                onChange={e => setTimezone(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 text-white text-sm rounded-lg px-3 py-2.5 focus:outline-none focus:border-primary-500"
              >
                <option value="Asia/Dhaka">Asia/Dhaka (GMT+6)</option>
                <option value="Asia/Kolkata">Asia/Kolkata (GMT+5:30)</option>
                <option value="America/New_York">America/New_York (GMT-5)</option>
                <option value="Europe/London">Europe/London (GMT+0)</option>
                <option value="UTC">UTC (GMT+0)</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
