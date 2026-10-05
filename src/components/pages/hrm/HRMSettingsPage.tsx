import React, { useState, useEffect } from 'react';
import { Save, Calendar, Loader2, Info } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { getHRMSettings, updateHRMSettings } from '@/lib/hrmStorage';

interface Props {
  showToast: (msg: string, type: 'success' | 'error') => void;
}

const DAYS_OF_WEEK = [
  { id: 'SUN', label: 'Sunday' },
  { id: 'MON', label: 'Monday' },
  { id: 'TUE', label: 'Tuesday' },
  { id: 'WED', label: 'Wednesday' },
  { id: 'THU', label: 'Thursday' },
  { id: 'FRI', label: 'Friday' },
  { id: 'SAT', label: 'Saturday' },
];

export const HRMSettingsPage: React.FC<Props> = ({ showToast }) => {
  const { userProfile } = useAuth();
  const [weekendDays, setWeekendDays] = useState<string[]>(['FRI']);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (userProfile?.companyId) {
      loadSettings();
    }
  }, [userProfile?.companyId]);

  const loadSettings = async () => {
    if (!userProfile?.companyId) return;
    setIsLoading(true);
    try {
      const settings = await getHRMSettings(userProfile.companyId);
      if (settings && settings.weekendDays) {
        setWeekendDays(settings.weekendDays);
      }
    } catch (err) {
      console.error(err);
      showToast('Failed to load settings', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const toggleDay = (dayId: string) => {
    setWeekendDays(prev => 
      prev.includes(dayId) 
        ? prev.filter(d => d !== dayId) 
        : [...prev, dayId]
    );
  };

  const handleSave = async () => {
    if (!userProfile?.companyId) return;
    setIsSaving(true);
    try {
      await updateHRMSettings(userProfile.companyId, { weekendDays });
      showToast('HRM Settings saved successfully!', 'success');
    } catch (err) {
      console.error(err);
      showToast('Failed to save settings', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto pb-20 p-4">
      <div className="bg-[#0f172a] p-5 border-b border-slate-800 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4 rounded-t-lg">
        <div>
          <h2 className="text-lg font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <Calendar className="w-5 h-5 text-primary-400" /> WEEKEND & HOLIDAY SETTINGS
          </h2>
          <p className="text-xs text-slate-400 mt-1">Configure company working days and leave policies.</p>
        </div>
        <button 
          onClick={handleSave} 
          disabled={isSaving || isLoading}
          className="flex justify-center items-center gap-2 px-6 py-2.5 bg-primary-600 hover:bg-primary-500 disabled:opacity-50 text-white text-sm font-bold rounded shadow transition-colors uppercase tracking-wider"
        >
          {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          {isSaving ? 'SAVING...' : 'SAVE CHANGES'}
        </button>
      </div>

      <div className="bg-slate-900 border border-t-0 border-slate-800 rounded-b-lg shadow-sm p-6 min-h-[400px]">
        {isLoading ? (
          <div className="flex justify-center items-center h-40">
            <Loader2 className="w-8 h-8 text-primary-500 animate-spin" />
          </div>
        ) : (
          <div className="space-y-8 max-w-2xl">
            {/* Weekends Config */}
            <div className="bg-slate-950 border border-slate-800 rounded-xl p-6">
              <h3 className="text-base font-bold text-white mb-2 flex items-center gap-2">
                Configure Weekend Days
              </h3>
              <p className="text-sm text-slate-400 mb-5">
                Select which days of the week are considered standard weekends/holidays for your company. These will be marked automatically in the Attendance sheets.
              </p>

              <div className="flex flex-wrap gap-3">
                {DAYS_OF_WEEK.map(day => {
                  const isSelected = weekendDays.includes(day.id);
                  return (
                    <button
                      key={day.id}
                      onClick={() => toggleDay(day.id)}
                      className={`px-4 py-2.5 rounded-lg text-sm font-bold transition-all border ${
                        isSelected 
                          ? "bg-rose-500/20 text-rose-400 border-rose-500/50 shadow-[0_0_15px_rgba(244,63,94,0.15)]" 
                          : "bg-slate-900 text-slate-400 border-slate-700 hover:bg-slate-800 hover:text-white"
                      }`}
                    >
                      {day.label}
                    </button>
                  );
                })}
              </div>

              <div className="mt-6 flex items-start gap-3 p-4 bg-slate-900/80 rounded-lg border border-slate-800">
                <Info className="w-5 h-5 text-primary-400 shrink-0 mt-0.5" />
                <p className="text-sm text-slate-300 leading-relaxed">
                  Employees will not be marked as "Absent" on selected weekend days. Daily Work Reports will also exclude these days from expected productivity metrics.
                </p>
              </div>
            </div>
            
            {/* Future Settings Placeholders */}
            <div className="bg-slate-950/50 border border-slate-800 border-dashed rounded-xl p-6 opacity-60">
              <h3 className="text-base font-bold text-white mb-2">Leave Policy (Coming Soon)</h3>
              <p className="text-sm text-slate-400">Configure annual leave, sick leave, and casual leave quotas.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
