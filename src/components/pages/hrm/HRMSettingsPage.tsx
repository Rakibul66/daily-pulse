import React, { useState, useEffect } from 'react';
import { Save, Calendar, Loader2, Info, Plus, Trash2, Edit2, X, Briefcase } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { getHRMSettings, updateHRMSettings } from '@/lib/hrmStorage';
import { RoleTemplate } from '@/types/hrm';

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
    
    let newRoles;
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
      showToast('Role Template saved to DB!', 'success');
    } catch(err) {}
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
    } catch(err) {}
  };

  return (
    <div className="w-full mx-auto space-y-6 pb-20">
      <div className="bg-[#0f172a] p-5 border border-slate-800 shadow-md flex flex-col md:flex-row md:items-center justify-between gap-4 rounded-md">
        <div>
          <h2 className="text-lg font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <Calendar className="w-5 h-5 text-primary-400" /> HRM & REPORT SETTINGS
          </h2>
          <p className="text-xs text-slate-400 mt-1">Configure company working days, leave policies, and report templates.</p>
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

      <div className="bg-slate-900 border border-slate-800 rounded-md shadow-sm p-6 min-h-[400px]">
        {isLoading ? (
          <div className="flex justify-center items-center h-40">
            <Loader2 className="w-8 h-8 text-primary-500 animate-spin" />
          </div>
        ) : (
          <div className="space-y-8">
            
            <div className="grid grid-cols-1 gap-8">
              {/* Left Column: Weekend Config */}
              <div className="bg-slate-950 border border-slate-800 rounded-md p-6 h-fit">
                <h3 className="text-base font-bold text-white mb-2 flex items-center gap-2">
                  Configure Weekend Days
                </h3>
                <p className="text-sm text-slate-400 mb-5">
                  Select standard weekends/holidays. These will be marked automatically in Attendance.
                </p>

                <div className="flex flex-wrap gap-2">
                  {DAYS_OF_WEEK.map(day => {
                    const isSelected = weekendDays.includes(day.id);
                    return (
                      <button
                        key={day.id}
                        onClick={() => toggleDay(day.id)}
                        className={`px-3 py-2 rounded-md text-xs font-bold transition-all border ${
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

                <div className="mt-6 flex items-start gap-3 p-4 bg-slate-900/80 rounded-md border border-slate-800">
                  <Info className="w-5 h-5 text-primary-400 shrink-0 mt-0.5" />
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Employees will not be marked as "Absent" on selected weekend days. Daily Work Reports will exclude these days from expected productivity metrics.
                  </p>
                </div>
              </div>

              {/* Right Column: Roles & Templates */}
              <div className="bg-slate-950 border border-slate-800 rounded-md p-6 h-fit">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-base font-bold text-white flex items-center gap-2">
                      <Briefcase className="w-5 h-5 text-emerald-400" /> Role Report Templates
                    </h3>
                    <p className="text-sm text-slate-400 mt-1">Pre-define work report items for specific roles.</p>
                  </div>
                  {!isEditingRole && (
                    <button
                      onClick={() => setIsEditingRole(true)}
                      className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded flex items-center gap-1 transition-colors"
                    >
                      <Plus className="w-4 h-4" /> Add Role
                    </button>
                  )}
                </div>

                {isEditingRole ? (
                  <div className="bg-slate-900 border border-slate-700 rounded-md p-4 space-y-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-400 mb-1 uppercase tracking-wider">Role Name</label>
                      <input
                        type="text"
                        value={currentRole.roleName}
                        onChange={(e) => setCurrentRole({ ...currentRole, roleName: e.target.value })}
                        placeholder="e.g. Digital Marketing, Developer..."
                        className="w-full bg-slate-950 border border-slate-700 text-white text-sm rounded px-3 py-2 focus:outline-none focus:border-primary-500"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-xs font-bold text-slate-400 mb-1 uppercase tracking-wider">Add Responsibility / Template Task</label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={newResponsibility}
                          onChange={(e) => setNewResponsibility(e.target.value)}
                          onKeyDown={(e) => e.key === 'Enter' && handleAddResponsibility()}
                          placeholder="e.g. Facebook Post, Code Review..."
                          className="flex-1 bg-slate-950 border border-slate-700 text-white text-sm rounded px-3 py-2 focus:outline-none focus:border-primary-500"
                        />
                        <button
                          onClick={handleAddResponsibility}
                          className="px-3 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded font-bold transition-colors"
                        >
                          Add
                        </button>
                      </div>
                    </div>

                    {currentRole.responsibilities.length > 0 && (
                      <div className="space-y-2 mt-4">
                        <label className="block text-xs font-bold text-slate-400 mb-1 uppercase tracking-wider">Predefined Tasks</label>
                        {currentRole.responsibilities.map((resp, idx) => (
                          <div key={idx} className="flex items-center justify-between bg-slate-950 border border-slate-800 px-3 py-2 rounded text-sm text-slate-300">
                            <span>{resp}</span>
                            <button onClick={() => handleRemoveResponsibility(idx)} className="text-slate-500 hover:text-rose-400 transition-colors">
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}

                    <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
                      <button
                        onClick={() => {
                          setIsEditingRole(false);
                          setCurrentRole({ id: '', roleName: '', responsibilities: [] });
                          setNewResponsibility('');
                        }}
                        className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold rounded transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleSaveRole}
                        className="px-4 py-2 bg-primary-600 hover:bg-primary-500 text-white text-xs font-bold rounded transition-colors"
                      >
                        Save Role
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {roles.length === 0 ? (
                      <p className="text-sm text-slate-500 text-center py-6 italic">No role templates added yet.</p>
                    ) : (
                      roles.map(role => (
                        <div key={role.id} className="bg-slate-900 border border-slate-800 rounded-md p-4 flex justify-between items-start">
                          <div>
                            <h4 className="text-sm font-bold text-emerald-400 mb-2">{role.roleName}</h4>
                            <ul className="list-disc list-inside text-xs text-slate-400 space-y-1">
                              {role.responsibilities.map((resp, idx) => (
                                <li key={idx}>{resp}</li>
                              ))}
                            </ul>
                          </div>
                          <div className="flex gap-2">
                            <button onClick={() => handleEditRole(role)} className="p-1.5 text-slate-500 hover:text-primary-400 transition-colors bg-slate-950 rounded">
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button onClick={() => handleDeleteRole(role.id)} className="p-1.5 text-slate-500 hover:text-rose-400 transition-colors bg-slate-950 rounded">
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                )}
              </div>
            </div>
            
          </div>
        )}
      </div>
    </div>
  );
};
