import React, { useState, useEffect } from 'react';
import { 
  Save, 
  Calendar, 
  Loader2, 
  Info, 
  Plus, 
  Trash2, 
  Edit2, 
  X, 
  Briefcase, 
  Sparkles, 
  Check, 
  CheckCircle2, 
  Sun, 
  BriefcaseBusiness 
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { getHRMSettings, updateHRMSettings } from '@/lib/hrmStorage';
import { RoleTemplate } from '@/types/hrm';

interface Props {
  showToast: (msg: string, type: 'success' | 'error') => void;
}

const DAYS_OF_WEEK = [
  { id: 'SUN', label: 'Sunday', short: 'SUN' },
  { id: 'MON', label: 'Monday', short: 'MON' },
  { id: 'TUE', label: 'Tuesday', short: 'TUE' },
  { id: 'WED', label: 'Wednesday', short: 'WED' },
  { id: 'THU', label: 'Thursday', short: 'THU' },
  { id: 'FRI', label: 'Friday', short: 'FRI' },
  { id: 'SAT', label: 'Saturday', short: 'SAT' },
];

export const HRMSettingsPage: React.FC<Props> = ({ showToast }) => {
  const { userProfile } = useAuth();
  const [weekendDays, setWeekendDays] = useState<string[]>(['FRI']);
  const [roles, setRoles] = useState<RoleTemplate[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // Role Form State
  const [isEditingRole, setIsEditingRole] = useState(false);
  const [currentRole, setCurrentRole] = useState<RoleTemplate>({ id: '', roleName: '', responsibilities: [] });
  const [newResponsibility, setNewResponsibility] = useState('');

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
      if (settings) {
        if (settings.weekendDays) setWeekendDays(settings.weekendDays);
        if (settings.roles) setRoles(settings.roles);
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
      await updateHRMSettings(userProfile.companyId, { weekendDays, roles });
      showToast('HRM Settings saved successfully!', 'success');
    } catch (err) {
      console.error(err);
      showToast('Failed to save settings', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  // Role Management
  const handleAddResponsibility = () => {
    if (!newResponsibility.trim()) return;
    setCurrentRole(prev => ({
      ...prev,
      responsibilities: [...prev.responsibilities, newResponsibility.trim()]
    }));
    setNewResponsibility('');
  };

  const handleRemoveResponsibility = (index: number) => {
    setCurrentRole(prev => ({
      ...prev,
      responsibilities: prev.responsibilities.filter((_, i) => i !== index)
    }));
  };

  const handleSaveRole = async () => {
    if (!userProfile?.companyId) return;
    if (!currentRole.roleName.trim()) {
      showToast('Role Name is required', 'error');
      return;
    }
    
    let newRoles: RoleTemplate[];
    if (currentRole.id) {
      newRoles = roles.map(r => r.id === currentRole.id ? currentRole : r);
    } else {
      newRoles = [...roles, { ...currentRole, id: Date.now().toString() }];
    }
    
    setRoles(newRoles);
    setCurrentRole({ id: '', roleName: '', responsibilities: [] });
    setIsEditingRole(false);
    
    try {
      await updateHRMSettings(userProfile.companyId, { weekendDays, roles: newRoles });
      showToast('Role Template saved to database!', 'success');
    } catch(err) {
      console.error(err);
    }
  };

  const handleEditRole = (role: RoleTemplate) => {
    setCurrentRole(role);
    setIsEditingRole(true);
  };

  const handleDeleteRole = async (id: string) => {
    if (!userProfile?.companyId) return;
    if (!confirm('Delete this role template?')) return;
    
    const newRoles = roles.filter(r => r.id !== id);
    setRoles(newRoles);
    
    try {
      await updateHRMSettings(userProfile.companyId, { weekendDays, roles: newRoles });
      showToast('Role Template deleted!', 'success');
    } catch(err) {
      console.error(err);
    }
  };

  return (
    <div className="w-full mx-auto space-y-6 pb-20 font-sans text-black">
      {/* 1. Header Hero Card (Marked Box 1) */}
      <div className="bg-white border-4 border-black shadow-[6px_6px_0px_#000] p-6 sm:p-7 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-amber-300 border-3 border-black shadow-[3px_3px_0px_#000] flex items-center justify-center text-black shrink-0">
            <Calendar className="w-8 h-8 stroke-[2.5]" />
          </div>
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-amber-300 border-2 border-black text-[10px] font-black uppercase tracking-wider shadow-[2px_2px_0px_#000] mb-1.5">
              <Sparkles className="w-3.5 h-3.5 fill-black" />
              HRM CONFIGURATION
            </div>
            <h1 className="font-display font-black text-2xl sm:text-3xl uppercase tracking-tight text-black leading-none">
              HRM & REPORT SETTINGS
            </h1>
            <p className="text-xs font-bold text-slate-700 uppercase tracking-wide mt-1">
              Configure company working days, official holidays & role work report templates
            </p>
          </div>
        </div>

        <button 
          onClick={handleSave} 
          disabled={isSaving || isLoading}
          className="px-6 py-3 bg-emerald-400 hover:bg-emerald-300 disabled:opacity-50 text-black font-display font-black text-xs uppercase tracking-wider border-3 border-black shadow-[4px_4px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all flex items-center gap-2 cursor-pointer shrink-0"
        >
          {isSaving ? <Loader2 className="w-4 h-4 animate-spin stroke-[3]" /> : <Save className="w-4 h-4 stroke-[3]" />}
          <span>{isSaving ? 'SAVING...' : 'SAVE CHANGES'}</span>
        </button>
      </div>

      {/* 2. Quick Overview Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Weekend Days Count */}
        <div className="bg-[#FFF1F2] border-3 border-black shadow-[4px_4px_0px_#000] p-4 sm:p-5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-display font-black uppercase tracking-wider text-rose-900">
              WEEKEND OFF-DAYS
            </span>
            <Sun className="w-4 h-4 text-rose-700 stroke-[2.5]" />
          </div>
          <div className="font-display font-black text-3xl sm:text-4xl text-rose-950">
            {weekendDays.length}
          </div>
          <p className="text-[10px] font-black uppercase tracking-wider text-rose-800 mt-1">
            {weekendDays.join(', ') || 'No off-days selected'}
          </p>
        </div>

        {/* Working Days Count */}
        <div className="bg-[#DCFCE7] border-3 border-black shadow-[4px_4px_0px_#000] p-4 sm:p-5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-display font-black uppercase tracking-wider text-emerald-900">
              WEEKLY WORKDAYS
            </span>
            <CheckCircle2 className="w-4 h-4 text-emerald-800 stroke-[2.5]" />
          </div>
          <div className="font-display font-black text-3xl sm:text-4xl text-emerald-950">
            {7 - weekendDays.length}
          </div>
          <p className="text-[10px] font-black uppercase tracking-wider text-emerald-800 mt-1">
            Active working schedule
          </p>
        </div>

        {/* Role Templates Count */}
        <div className="bg-[#FFFDF0] border-3 border-black shadow-[4px_4px_0px_#000] p-4 sm:p-5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-display font-black uppercase tracking-wider text-slate-800">
              ROLE TEMPLATES
            </span>
            <BriefcaseBusiness className="w-4 h-4 text-black stroke-[2.5]" />
          </div>
          <div className="font-display font-black text-3xl sm:text-4xl text-black">
            {roles.length}
          </div>
          <p className="text-[10px] font-black uppercase tracking-wider text-slate-600 mt-1">
            Standard job report templates
          </p>
        </div>
      </div>

      {isLoading ? (
        <div className="bg-white border-4 border-black shadow-[6px_6px_0px_#000] p-16 flex flex-col justify-center items-center gap-3">
          <Loader2 className="w-9 h-9 text-black animate-spin stroke-[2.5]" />
          <span className="font-display font-black text-xs uppercase tracking-wider text-black">
            LOADING SETTINGS...
          </span>
        </div>
      ) : (
        <div className="space-y-6">
          {/* 3. Configure Weekend Days Card (Marked Box 2) */}
          <div className="bg-white border-4 border-black shadow-[6px_6px_0px_#000] p-6 sm:p-8">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-rose-300 border-3 border-black shadow-[2px_2px_0px_#000] flex items-center justify-center text-black shrink-0">
                <Calendar className="w-5 h-5 stroke-[2.5]" />
              </div>
              <div>
                <div className="inline-block px-2 py-0.5 bg-black text-white font-display font-black text-[10px] uppercase tracking-wider mb-0.5">
                  WEEKLY SCHEDULE
                </div>
                <h2 className="text-lg sm:text-xl font-display font-black uppercase tracking-tight text-black leading-none">
                  CONFIGURE WEEKEND DAYS
                </h2>
              </div>
            </div>
            
            <p className="text-xs font-bold text-slate-600 uppercase tracking-wide mb-6">
              Select standard weekends / holidays. These will be automatically marked in Attendance and excluded from daily work reports.
            </p>

            {/* Neo-Brutalist Days Selector Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
              {DAYS_OF_WEEK.map(day => {
                const isSelected = weekendDays.includes(day.id);
                return (
                  <button
                    key={day.id}
                    type="button"
                    onClick={() => toggleDay(day.id)}
                    className={`relative p-3.5 border-3 border-black text-center cursor-pointer transition-all active:translate-x-0.5 active:translate-y-0.5 ${
                      isSelected 
                        ? "bg-rose-400 text-black shadow-[4px_4px_0px_#000] hover:bg-rose-500" 
                        : "bg-white text-black shadow-[2px_2px_0px_#000] hover:bg-amber-100"
                    }`}
                  >
                    <div className="text-[10px] font-black uppercase tracking-widest text-slate-700 mb-1">
                      {day.short}
                    </div>
                    <div className="font-display font-black text-sm uppercase tracking-tight mb-2">
                      {day.label}
                    </div>
                    <div>
                      {isSelected ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-black text-white text-[9px] font-black uppercase tracking-wider border border-black shadow-[1px_1px_0px_#000]">
                          <Check className="w-3 h-3 stroke-[3]" />
                          OFF-DAY
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2 py-0.5 bg-slate-100 text-slate-600 text-[9px] font-bold uppercase tracking-wider border border-slate-300">
                          WORKDAY
                        </span>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Informational Callout Box (Lower part of Marked Box 2) */}
            <div className="mt-6 flex items-start gap-3.5 p-4 sm:p-5 bg-[#FFFBEB] border-3 border-black shadow-[4px_4px_0px_#000]">
              <div className="w-9 h-9 bg-amber-400 border-2 border-black shadow-[2px_2px_0px_#000] flex items-center justify-center shrink-0">
                <Info className="w-5 h-5 text-black stroke-[3]" />
              </div>
              <div className="space-y-1">
                <div className="font-display font-black text-xs uppercase tracking-wider text-black">
                  ATTENDANCE & PRODUCTIVITY INTEGRATION
                </div>
                <p className="text-xs font-bold text-slate-800 leading-relaxed">
                  Employees will not be marked as <span className="bg-red-200 px-1.5 py-0.5 border border-black font-black text-black">Absent</span> on selected weekend days. Daily Work Reports will automatically calibrate expected productivity metrics to exclude these days.
                </p>
              </div>
            </div>
          </div>

          {/* 4. Role Report Templates Section */}
          <div className="bg-white border-4 border-black shadow-[6px_6px_0px_#000] p-6 sm:p-8">
            <div className="flex flex-wrap items-center justify-between gap-4 mb-6 pb-4 border-b-3 border-black">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-emerald-300 border-3 border-black shadow-[2px_2px_0px_#000] flex items-center justify-center text-black shrink-0">
                  <Briefcase className="w-5 h-5 stroke-[2.5]" />
                </div>
                <div>
                  <div className="inline-block px-2 py-0.5 bg-black text-white font-display font-black text-[10px] uppercase tracking-wider mb-0.5">
                    WORK REPORT BLUEPRINTS
                  </div>
                  <h2 className="text-lg sm:text-xl font-display font-black uppercase tracking-tight text-black leading-none">
                    ROLE REPORT TEMPLATES
                  </h2>
                </div>
              </div>

              {!isEditingRole && (
                <button
                  onClick={() => {
                    setCurrentRole({ id: '', roleName: '', responsibilities: [] });
                    setIsEditingRole(true);
                  }}
                  className="px-4 py-2.5 bg-emerald-400 hover:bg-emerald-300 text-black font-display font-black text-xs uppercase tracking-wider border-3 border-black shadow-[3px_3px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <Plus className="w-4 h-4 stroke-[3]" />
                  <span>ADD ROLE TEMPLATE</span>
                </button>
              )}
            </div>

            {isEditingRole ? (
              <div className="bg-[#FFFDF0] border-3 border-black shadow-[4px_4px_0px_#000] p-5 sm:p-6 space-y-5">
                <div className="flex items-center justify-between pb-3 border-b-2 border-black">
                  <span className="font-display font-black text-sm uppercase tracking-wider text-black">
                    {currentRole.id ? 'EDIT ROLE TEMPLATE' : 'NEW ROLE TEMPLATE'}
                  </span>
                  <button
                    onClick={() => {
                      setIsEditingRole(false);
                      setCurrentRole({ id: '', roleName: '', responsibilities: [] });
                      setNewResponsibility('');
                    }}
                    className="p-1 hover:bg-slate-200 border-2 border-black transition-colors"
                  >
                    <X className="w-4 h-4 stroke-[2.5]" />
                  </button>
                </div>

                <div>
                  <label className="block text-xs font-display font-black text-black mb-1.5 uppercase tracking-wider">
                    Role Name *
                  </label>
                  <input
                    type="text"
                    value={currentRole.roleName}
                    onChange={(e) => setCurrentRole({ ...currentRole, roleName: e.target.value })}
                    placeholder="e.g. Digital Marketing, Senior Full-Stack Developer, Sales Executive..."
                    className="w-full bg-white border-3 border-black shadow-[2px_2px_0px_#000] text-black font-bold text-sm px-3.5 py-2.5 focus:bg-[#FFFDE8] focus:outline-none"
                  />
                </div>
                
                <div>
                  <label className="block text-xs font-display font-black text-black mb-1.5 uppercase tracking-wider">
                    Add Predefined Tasks / Responsibilities
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newResponsibility}
                      onChange={(e) => setNewResponsibility(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddResponsibility())}
                      placeholder="e.g. Daily Social Media Post, Review PRs, Client Outreach..."
                      className="flex-1 bg-white border-3 border-black shadow-[2px_2px_0px_#000] text-black font-bold text-sm px-3.5 py-2.5 focus:bg-[#FFFDE8] focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={handleAddResponsibility}
                      className="px-5 py-2.5 bg-black hover:bg-slate-800 text-white font-display font-black text-xs uppercase tracking-wider border-2 border-black shadow-[2px_2px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 transition-all cursor-pointer"
                    >
                      ADD TASK
                    </button>
                  </div>
                </div>

                {currentRole.responsibilities.length > 0 && (
                  <div className="space-y-2 pt-2">
                    <label className="block text-xs font-display font-black text-slate-700 uppercase tracking-wider">
                      Tasks in this Template ({currentRole.responsibilities.length})
                    </label>
                    <div className="space-y-2">
                      {currentRole.responsibilities.map((resp, idx) => (
                        <div 
                          key={idx} 
                          className="flex items-center justify-between bg-white border-2 border-black shadow-[2px_2px_0px_#000] px-3.5 py-2 text-xs font-bold text-black"
                        >
                          <span className="flex items-center gap-2">
                            <span className="w-1.5 h-1.5 bg-black rounded-none inline-block"></span>
                            {resp}
                          </span>
                          <button 
                            type="button"
                            onClick={() => handleRemoveResponsibility(idx)} 
                            className="p-1 text-slate-500 hover:text-red-600 hover:bg-red-50 border border-transparent hover:border-black transition-all"
                          >
                            <X className="w-4 h-4 stroke-[2.5]" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex justify-end gap-3 pt-3 border-t-2 border-black">
                  <button
                    type="button"
                    onClick={() => {
                      setIsEditingRole(false);
                      setCurrentRole({ id: '', roleName: '', responsibilities: [] });
                      setNewResponsibility('');
                    }}
                    className="px-5 py-2.5 bg-white hover:bg-slate-100 text-black font-display font-black text-xs uppercase tracking-wider border-2 border-black shadow-[2px_2px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 transition-all cursor-pointer"
                  >
                    CANCEL
                  </button>
                  <button
                    type="button"
                    onClick={handleSaveRole}
                    className="px-5 py-2.5 bg-emerald-400 hover:bg-emerald-300 text-black font-display font-black text-xs uppercase tracking-wider border-2 border-black shadow-[2px_2px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 transition-all cursor-pointer"
                  >
                    SAVE ROLE TEMPLATE
                  </button>
                </div>
              </div>
            ) : (
              <div>
                {roles.length === 0 ? (
                  <div className="text-center py-12 border-3 border-dashed border-slate-300 bg-[#FFFDF0]">
                    <Briefcase className="w-10 h-10 mx-auto text-slate-400 mb-2 stroke-[1.5]" />
                    <p className="font-display font-black text-sm uppercase tracking-wide text-slate-600">
                      NO ROLE TEMPLATES ADDED YET
                    </p>
                    <p className="text-xs font-bold text-slate-500 mt-1 uppercase">
                      Add templates to standardize daily work reporting across teams.
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {roles.map(role => (
                      <div 
                        key={role.id} 
                        className="bg-[#FFFDF0] border-3 border-black shadow-[4px_4px_0px_#000] p-5 flex flex-col justify-between hover:translate-y-[-2px] transition-transform"
                      >
                        <div>
                          <div className="flex items-center justify-between gap-2 mb-3 pb-2 border-b-2 border-black">
                            <span className="font-display font-black text-sm uppercase tracking-wider text-black bg-amber-300 border-2 border-black px-2 py-0.5 shadow-[1.5px_1.5px_0px_#000]">
                              {role.roleName}
                            </span>
                            <div className="flex gap-1.5">
                              <button 
                                onClick={() => handleEditRole(role)} 
                                className="p-1.5 bg-white hover:bg-amber-100 text-black border-2 border-black shadow-[1.5px_1.5px_0px_#000] transition-colors cursor-pointer"
                                title="Edit Role"
                              >
                                <Edit2 className="w-3.5 h-3.5 stroke-[2.5]" />
                              </button>
                              <button 
                                onClick={() => handleDeleteRole(role.id)} 
                                className="p-1.5 bg-white hover:bg-rose-100 text-red-600 border-2 border-black shadow-[1.5px_1.5px_0px_#000] transition-colors cursor-pointer"
                                title="Delete Role"
                              >
                                <Trash2 className="w-3.5 h-3.5 stroke-[2.5]" />
                              </button>
                            </div>
                          </div>

                          <div className="space-y-1.5">
                            <span className="text-[10px] font-black uppercase tracking-wider text-slate-600">
                              TASKS ({role.responsibilities?.length || 0}):
                            </span>
                            {role.responsibilities && role.responsibilities.length > 0 ? (
                              <ul className="space-y-1">
                                {role.responsibilities.map((resp, idx) => (
                                  <li key={idx} className="flex items-start gap-2 text-xs font-bold text-slate-800">
                                    <span className="w-1.5 h-1.5 bg-black mt-1.5 shrink-0"></span>
                                    <span>{resp}</span>
                                  </li>
                                ))}
                              </ul>
                            ) : (
                              <p className="text-xs italic text-slate-400">No tasks defined</p>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

