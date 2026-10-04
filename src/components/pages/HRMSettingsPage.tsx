import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { getHRMSettings, updateHRMSettings } from '@/lib/hrmStorage';
import { Settings, Save, Sparkles, Key } from 'lucide-react';

interface Props {
  showToast: (msg: string, type: 'success'|'error') => void;
}

export const HRMSettingsPage: React.FC<Props> = ({ showToast }) => {
  const { user } = useAuth();
  const [weekendDays, setWeekendDays] = useState<string[]>([]);
  const [aiEnabled, setAiEnabled] = useState(false);
  const [geminiApiKey, setGeminiApiKey] = useState('');
  
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const daysOfWeek = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];

  useEffect(() => {
    if (user) {
      loadData(user.uid);
    }
  }, [user]);

  const loadData = async (uid: string) => {
    setIsLoading(true);
    try {
      const settings = await getHRMSettings(uid);
      if (settings) {
        setWeekendDays(settings.weekendDays || []);
        setAiEnabled(settings.aiEnabled || false);
        setGeminiApiKey(settings.geminiApiKey || '');
      }
    } catch (err) {
      console.error(err);
      showToast('Failed to load settings', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleDay = (day: string) => {
    setWeekendDays(prev => 
      prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day]
    );
  };

  const handleSave = async () => {
    if (!user) return;
    setIsSaving(true);
    try {
      await updateHRMSettings(user.uid, { weekendDays, aiEnabled, geminiApiKey });
      showToast('Settings saved successfully', 'success');
    } catch (err) {
      console.error(err);
      showToast('Error saving settings', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="w-full mx-auto space-y-6">
      <div className="bg-slate-900 p-4 sm:p-5 rounded-md border border-slate-800 shadow-md flex flex-wrap items-center justify-between gap-4 text-white">
        <div>
          <div className="flex flex-wrap items-center gap-2.5">
            <span className="w-2.5 h-2.5 rounded-full bg-indigo-500"></span>
            <h2 className="text-lg font-bold text-white">Settings</h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">Configure automated behaviors and AI features.</p>
        </div>
      </div>

      {isLoading ? (
        <div className="py-20 flex flex-col items-center gap-3">
          <div className="w-8 h-8 rounded-full border-4 border-indigo-900 border-t-indigo-500 animate-spin"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
          
          {/* Holidays */}
          <div className="bg-slate-900 rounded-md border border-slate-800 shadow-md p-6">
            <div className="flex items-center gap-3 mb-6 border-b border-slate-800 pb-4">
              <Settings className="w-5 h-5 text-indigo-400" />
              <h3 className="text-base font-bold text-white">Weekend & Holidays</h3>
            </div>
            
            <div className="space-y-4">
              <p className="text-sm text-slate-400 font-medium">Select your weekend days. These days will automatically be marked with a red 'H' (Holiday) on the Attendance Register unless overridden by a manual entry.</p>
              
              <div className="flex flex-wrap gap-3 pt-2">
                {daysOfWeek.map(day => {
                  const isSelected = weekendDays.includes(day);
                  return (
                    <button
                      key={day}
                      onClick={() => handleToggleDay(day)}
                      className={`px-4 py-2 rounded-md text-sm font-bold transition-all border ${
                        isSelected 
                          ? 'bg-rose-500/20 text-rose-400 border-rose-500/50 shadow-md shadow-rose-950/20' 
                          : 'bg-slate-950 text-slate-400 border-slate-800 hover:border-slate-700 hover:text-slate-300'
                      }`}
                    >
                      {day}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* AI Features */}
          <div className="bg-slate-900 rounded-md border border-slate-800 shadow-md p-6">
            <div className="flex items-center gap-3 mb-6 border-b border-slate-800 pb-4">
              <Sparkles className="w-5 h-5 text-emerald-400" />
              <h3 className="text-base font-bold text-white">AI Assistant (Gemini)</h3>
            </div>
            
            <div className="space-y-6">
              <label className="flex items-center gap-3 cursor-pointer">
                <div className="relative">
                  <input type="checkbox" className="sr-only peer" checked={aiEnabled} onChange={(e) => setAiEnabled(e.target.checked)} />
                  <div className="w-11 h-6 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
                </div>
                <span className="text-sm font-bold text-white">Enable AI Features</span>
              </label>

              {aiEnabled && (
                <div className="animate-in fade-in slide-in-from-top-2 space-y-3">
                  <p className="text-xs text-slate-400 font-medium">Enter your Gemini API Key to enable AI Smart Paste for Leads and other features.</p>
                  <div>
                    <label className="text-xs font-semibold text-slate-300 block mb-1.5 flex items-center gap-2">
                      <Key className="w-3.5 h-3.5" /> API Key
                    </label>
                    <input 
                      type="password" 
                      value={geminiApiKey} 
                      onChange={(e) => setGeminiApiKey(e.target.value)} 
                      className="w-full text-sm font-medium text-white bg-slate-950 px-3 py-2 rounded-md border border-slate-700 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 placeholder-slate-600"
                      placeholder="AIzaSy..." 
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="lg:col-span-2 flex justify-end">
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="flex items-center gap-2 px-6 py-2.5 bg-indigo-600 text-white rounded-md hover:bg-indigo-500 transition-colors text-sm font-bold shadow-md shadow-indigo-950 disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              {isSaving ? 'Saving...' : 'Save Settings'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
