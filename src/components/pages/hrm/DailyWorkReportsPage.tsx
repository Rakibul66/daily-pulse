import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Calendar, User, Search, FileText, Loader2, CheckCircle, Clock, AlertTriangle } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { getEmployees, getDailyWorkReports, addDailyWorkReport, deleteDailyWorkReport } from '@/lib/hrmStorage';
import { Employee, DailyWorkReport, ReportStatus } from '@/types/hrm';

interface Props {
  showToast: (msg: string, type: 'success' | 'error') => void;
}

export const DailyWorkReportsPage: React.FC<Props> = ({ showToast }) => {
  const { userProfile } = useAuth();
  const [reports, setReports] = useState<DailyWorkReport[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Filters
  const [filterDate, setFilterDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [filterEmp, setFilterEmp] = useState<string>('ALL');

  // Form
  const [formData, setFormData] = useState<Partial<DailyWorkReport>>({
    date: new Date().toISOString().split('T')[0],
    employeeId: '',
    tasksCompleted: '',
    leadCount: 0,
    issuesBlocked: '',
    status: 'Completed'
  });

  useEffect(() => {
    if (userProfile?.companyId) {
      loadData();
    }
  }, [userProfile?.companyId, filterDate]);

  const loadData = async () => {
    if (!userProfile?.companyId) return;
    setIsLoading(true);
    try {
      const [emps, reps] = await Promise.all([
        getEmployees(userProfile.companyId),
        getDailyWorkReports(userProfile.companyId, filterDate)
      ]);
      setEmployees(emps);
      setReports(reps);
    } catch (err) {
      console.error(err);
      showToast('Failed to load reports', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    if (!userProfile?.companyId) return;
    if (!formData.employeeId || !formData.tasksCompleted || !formData.status) {
      showToast('Please fill required fields (Employee, Tasks, Status)', 'error');
      return;
    }

    const emp = employees.find(e => e.id === formData.employeeId);
    if (!emp) return;

    setIsSaving(true);
    try {
      const payload = {
        companyId: userProfile.companyId,
        employeeId: emp.id,
        employeeName: emp.name,
        date: formData.date,
        tasksCompleted: formData.tasksCompleted,
        leadCount: formData.leadCount || 0,
        issuesBlocked: formData.issuesBlocked || '',
        status: formData.status
      };
      
      await addDailyWorkReport(payload);
      showToast('Daily report submitted!', 'success');
      setIsAdding(false);
      setFormData({
        ...formData,
        tasksCompleted: '',
        leadCount: 0,
        issuesBlocked: '',
      });
      loadData();
    } catch (err) {
      console.error(err);
      showToast('Failed to save report', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this report?')) return;
    try {
      await deleteDailyWorkReport(id);
      showToast('Report deleted', 'success');
      loadData();
    } catch (err) {
      console.error(err);
      showToast('Failed to delete report', 'error');
    }
  };

  const filteredReports = filterEmp === 'ALL' 
    ? reports 
    : reports.filter(r => r.employeeId === filterEmp);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Completed': return <span className="flex items-center gap-1 text-xs font-bold text-emerald-500 bg-emerald-500/10 px-2 py-1 rounded"><CheckCircle className="w-3 h-3"/> Completed</span>;
      case 'In Progress': return <span className="flex items-center gap-1 text-xs font-bold text-amber-500 bg-amber-500/10 px-2 py-1 rounded"><Clock className="w-3 h-3"/> In Progress</span>;
      case 'Blocked': return <span className="flex items-center gap-1 text-xs font-bold text-rose-500 bg-rose-500/10 px-2 py-1 rounded"><AlertTriangle className="w-3 h-3"/> Blocked</span>;
      default: return null;
    }
  };

  if (isAdding) {
    return (
      <div className="w-full max-w-3xl mx-auto pb-20 p-4 animate-in fade-in">
        <div className="bg-slate-900 border border-slate-800 shadow-xl rounded-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-950">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <FileText className="w-5 h-5 text-primary-400" /> 
              Submit Daily Work Report
            </h2>
          </div>
          
          <div className="p-6 space-y-6">
            <div className="grid grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-bold text-slate-400 mb-1.5 uppercase tracking-wider">Date *</label>
                <input type="date" value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} className="w-full bg-slate-950 border border-slate-800 text-white rounded px-3 py-2 text-sm focus:border-primary-500" required />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-400 mb-1.5 uppercase tracking-wider">Employee *</label>
                <select value={formData.employeeId} onChange={e => setFormData({...formData, employeeId: e.target.value})} className="w-full bg-slate-950 border border-slate-800 text-white rounded px-3 py-2 text-sm focus:border-primary-500" required>
                  <option value="">Select Employee...</option>
                  {employees.map(emp => (
                    <option key={emp.id} value={emp.id}>{emp.name} ({emp.department})</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-400 mb-1.5 uppercase tracking-wider">Tasks Completed Today * (Social Media, Website, Edits)</label>
              <textarea 
                rows={4} 
                value={formData.tasksCompleted} 
                onChange={e => setFormData({...formData, tasksCompleted: e.target.value})} 
                placeholder="- Designed 3 social media posts for FB\n- Updated prices on website\n- Edited 1 YouTube Short" 
                className="w-full bg-slate-950 border border-slate-800 text-white rounded px-3 py-2 text-sm focus:border-primary-500 font-mono" 
                required 
              />
            </div>

            <div className="grid grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-bold text-slate-400 mb-1.5 uppercase tracking-wider">Leads Collected</label>
                <input type="number" value={formData.leadCount} onChange={e => setFormData({...formData, leadCount: parseInt(e.target.value) || 0})} placeholder="e.g. 15" className="w-full bg-slate-950 border border-slate-800 text-white rounded px-3 py-2 text-sm focus:border-primary-500" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-400 mb-1.5 uppercase tracking-wider">Overall Status *</label>
                <select value={formData.status} onChange={e => setFormData({...formData, status: e.target.value as ReportStatus})} className="w-full bg-slate-950 border border-slate-800 text-white rounded px-3 py-2 text-sm focus:border-primary-500" required>
                  <option value="Completed">Completed</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Blocked">Blocked</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-400 mb-1.5 uppercase tracking-wider">Issues / Blockers (Optional)</label>
              <textarea 
                rows={2} 
                value={formData.issuesBlocked} 
                onChange={e => setFormData({...formData, issuesBlocked: e.target.value})} 
                placeholder="Any problems faced? Internet down? Waiting on assets?" 
                className="w-full bg-slate-950 border border-slate-800 text-white rounded px-3 py-2 text-sm focus:border-primary-500" 
              />
            </div>
          </div>

          <div className="px-6 py-4 border-t border-slate-800 flex justify-end gap-3 bg-slate-950">
            <button onClick={() => setIsAdding(false)} className="px-4 py-2 text-sm font-bold text-slate-300 hover:text-white transition-colors">Cancel</button>
            <button onClick={handleSave} disabled={isSaving} className="flex items-center gap-2 px-6 py-2 bg-primary-600 hover:bg-primary-500 disabled:opacity-50 text-white text-sm font-bold rounded shadow transition-colors">
              {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <FileText className="w-4 h-4" />}
              {isSaving ? 'Submitting...' : 'Submit Report'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full mx-auto pb-20 p-4">
      {/* Header */}
      <div className="bg-[#0f172a] p-4 border-b border-slate-800 shadow-sm flex flex-wrap items-center justify-between gap-4 rounded-t-lg">
        <div>
          <h2 className="text-lg font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <FileText className="w-5 h-5 text-primary-400" /> DAILY WORK REPORTS
          </h2>
          <p className="text-xs text-slate-400 mt-1">Track employee productivity, website updates, and daily tasks.</p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-slate-900 border border-slate-700 rounded px-2 py-1">
            <Calendar className="w-4 h-4 text-slate-400" />
            <input 
              type="date" 
              value={filterDate} 
              onChange={e => setFilterDate(e.target.value)}
              className="bg-transparent text-sm text-white outline-none border-none" 
            />
          </div>
          
          <div className="flex items-center gap-2 bg-slate-900 border border-slate-700 rounded px-2 py-1">
            <User className="w-4 h-4 text-slate-400" />
            <select 
              value={filterEmp} 
              onChange={e => setFilterEmp(e.target.value)}
              className="bg-transparent text-sm text-white outline-none border-none pr-4"
            >
              <option value="ALL">All Employees</option>
              {employees.map(e => <option key={e.id} value={e.id}>{e.name}</option>)}
            </select>
          </div>

          <button 
            onClick={() => setIsAdding(true)}
            className="flex items-center gap-1.5 px-4 py-2 bg-primary-600 text-white rounded text-sm font-bold shadow hover:bg-primary-500 transition-colors uppercase tracking-wider ml-2"
          >
            <Plus className="w-4 h-4" /> NEW REPORT
          </button>
        </div>
      </div>

      {/* Main Container */}
      <div className="bg-slate-900 border border-t-0 border-slate-800 rounded-b-lg shadow-sm p-6 min-h-[400px]">
        {isLoading ? (
          <div className="flex justify-center items-center h-40">
            <Loader2 className="w-8 h-8 text-primary-500 animate-spin" />
          </div>
        ) : filteredReports.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-slate-400 border-2 border-dashed border-slate-800 rounded-lg bg-slate-900/50">
            <FileText className="w-12 h-12 mb-4 opacity-50" />
            <p className="font-bold text-lg">No reports submitted</p>
            <p className="text-sm mt-1 text-slate-500">No work reports found for {filterDate}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredReports.map(report => (
              <div key={report.id} className="bg-slate-950 border border-slate-800 rounded-xl p-5 hover:border-slate-700 transition-colors flex flex-col h-full shadow-sm">
                
                <div className="flex justify-between items-start mb-4 border-b border-slate-800/60 pb-4">
                  <div>
                    <h3 className="font-bold text-white text-base flex items-center gap-2">
                      <User className="w-4 h-4 text-primary-400" />
                      {report.employeeName}
                    </h3>
                    <p className="text-xs text-slate-400 mt-1 flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5" /> {report.date}
                    </p>
                  </div>
                  {getStatusBadge(report.status)}
                </div>

                <div className="flex-grow space-y-4">
                  <div>
                    <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Tasks Completed</h4>
                    <div className="text-sm text-slate-300 font-mono whitespace-pre-wrap bg-slate-900/50 p-3 rounded border border-slate-800 leading-relaxed">
                      {report.tasksCompleted}
                    </div>
                  </div>

                  {(report.leadCount ?? 0) > 0 && (
                    <div>
                      <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Leads Generated</h4>
                      <div className="inline-flex items-center gap-2 text-sm font-bold text-emerald-400 bg-emerald-500/10 px-3 py-1.5 rounded-full border border-emerald-500/20">
                        <User className="w-4 h-4" /> {report.leadCount} New Leads
                      </div>
                    </div>
                  )}

                  {report.issuesBlocked && (
                    <div>
                      <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 text-rose-400/80">Issues / Blockers</h4>
                      <p className="text-sm text-rose-300/90 bg-rose-500/10 p-3 rounded border border-rose-500/20 leading-relaxed">
                        {report.issuesBlocked}
                      </p>
                    </div>
                  )}
                </div>

                <div className="mt-5 pt-4 border-t border-slate-800/60 flex justify-end">
                  <button onClick={() => handleDelete(report.id)} className="text-xs font-bold text-slate-500 hover:text-rose-400 transition-colors flex items-center gap-1">
                    <Trash2 className="w-3.5 h-3.5" /> Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
