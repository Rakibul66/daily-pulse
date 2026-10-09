import React from 'react';
import { FileText, X, Loader2 } from 'lucide-react';
import { Employee, RoleTemplate, DailyWorkReport, ReportStatus } from '@/types/hrm';

interface WorkReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  formData: Partial<DailyWorkReport>;
  onChange: (data: Partial<DailyWorkReport>) => void;
  employees: Employee[];
  roles: RoleTemplate[];
  onSave: () => void;
  isSaving: boolean;
}

export const WorkReportModal: React.FC<WorkReportModalProps> = ({
  isOpen,
  onClose,
  formData,
  onChange,
  employees,
  roles,
  onSave,
  isSaving,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white border-4 border-black shadow-[8px_8px_0px_#000] max-w-2xl w-full my-8 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Modal Header */}
        <div className="bg-amber-300 border-b-4 border-black px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileText className="w-6 h-6 stroke-[2.5] text-black" />
            <h2 className="font-display font-black text-base sm:text-lg uppercase tracking-tight text-black">
              SUBMIT DAILY WORK REPORT
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-amber-400 border-2 border-black transition-colors cursor-pointer"
          >
            <X className="w-5 h-5 stroke-[2.5] text-black" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-5 max-h-[75vh] overflow-y-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-display font-black text-black mb-1.5 uppercase tracking-wider">
                Date *
              </label>
              <input
                type="date"
                value={formData.date || ''}
                onChange={e => onChange({ ...formData, date: e.target.value })}
                className="w-full bg-white border-3 border-black shadow-[2px_2px_0px_#000] text-black font-bold text-sm px-3.5 py-2.5 focus:bg-[#FFFDF0] focus:outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-display font-black text-black mb-1.5 uppercase tracking-wider">
                Employee *
              </label>
              <select
                value={formData.employeeId || ''}
                onChange={e => onChange({ ...formData, employeeId: e.target.value })}
                className="w-full bg-white border-3 border-black shadow-[2px_2px_0px_#000] text-black font-bold text-sm px-3.5 py-2.5 focus:bg-[#FFFDF0] focus:outline-none"
                required
              >
                <option value="">Select Employee...</option>
                {employees.map(emp => (
                  <option key={emp.id} value={emp.id}>
                    {emp.name} {emp.department ? `(${emp.department})` : ''}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Template Pre-filler */}
          <div>
            <label className="block text-xs font-display font-black text-black mb-1.5 uppercase tracking-wider">
              Load Role Template (Optional)
            </label>
            <select
              onChange={e => {
                const role = roles.find(r => r.id === e.target.value);
                if (role && role.responsibilities) {
                  const templateText = role.responsibilities.map(r => `• ${r}: `).join('\n');
                  onChange({
                    ...formData,
                    tasksCompleted: formData.tasksCompleted ? `${formData.tasksCompleted}\n${templateText}` : templateText
                  });
                }
              }}
              className="w-full bg-[#FFFDF0] border-3 border-black shadow-[2px_2px_0px_#000] text-black font-bold text-xs uppercase px-3.5 py-2.5 focus:outline-none"
            >
              <option value="">Select a template to auto-populate tasks...</option>
              {roles.map(role => (
                <option key={role.id} value={role.id}>
                  {role.roleName} ({role.responsibilities?.length || 0} tasks)
                </option>
              ))}
            </select>
          </div>

          {/* Tasks Completed */}
          <div>
            <label className="block text-xs font-display font-black text-black mb-1.5 uppercase tracking-wider">
              Tasks Completed Today *
            </label>
            <textarea
              rows={4}
              value={formData.tasksCompleted || ''}
              onChange={e => onChange({ ...formData, tasksCompleted: e.target.value })}
              placeholder="• Designed 3 social media posts for FB&#10;• Updated pricing and SEO meta tags&#10;• Followed up with 10 pending client inquiries"
              className="w-full bg-white border-3 border-black shadow-[2px_2px_0px_#000] text-black font-mono text-xs p-3 focus:bg-[#FFFDF0] focus:outline-none leading-relaxed"
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-display font-black text-black mb-1.5 uppercase tracking-wider">
                Leads Collected (If applicable)
              </label>
              <input
                type="number"
                value={formData.leadCount || 0}
                onChange={e => onChange({ ...formData, leadCount: parseInt(e.target.value) || 0 })}
                placeholder="e.g. 15"
                className="w-full bg-white border-3 border-black shadow-[2px_2px_0px_#000] text-black font-bold text-sm px-3.5 py-2.5 focus:bg-[#FFFDF0] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-display font-black text-black mb-1.5 uppercase tracking-wider">
                Overall Status *
              </label>
              <select
                value={formData.status || 'Completed'}
                onChange={e => onChange({ ...formData, status: e.target.value as ReportStatus })}
                className="w-full bg-white border-3 border-black shadow-[2px_2px_0px_#000] text-black font-bold text-sm px-3.5 py-2.5 focus:bg-[#FFFDF0] focus:outline-none"
                required
              >
                <option value="Completed">Completed</option>
                <option value="In Progress">In Progress</option>
                <option value="Blocked">Blocked</option>
              </select>
            </div>
          </div>

          {/* Issues / Blockers */}
          <div>
            <label className="block text-xs font-display font-black text-black mb-1.5 uppercase tracking-wider">
              Issues / Blockers (Optional)
            </label>
            <textarea
              rows={2}
              value={formData.issuesBlocked || ''}
              onChange={e => onChange({ ...formData, issuesBlocked: e.target.value })}
              placeholder="Any blockers faced? (e.g. Internet connectivity issue, awaiting client approval...)"
              className="w-full bg-white border-3 border-black shadow-[2px_2px_0px_#000] text-black font-bold text-xs p-3 focus:bg-[#FFFDF0] focus:outline-none"
            />
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 border-t-3 border-black bg-[#FFFDF0] flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 bg-white hover:bg-slate-100 text-black font-display font-black text-xs uppercase tracking-wider border-2 border-black shadow-[2px_2px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 transition-all cursor-pointer"
          >
            CANCEL
          </button>
          <button
            type="button"
            onClick={onSave}
            disabled={isSaving}
            className="px-6 py-2.5 bg-emerald-400 hover:bg-emerald-300 disabled:opacity-50 text-black font-display font-black text-xs uppercase tracking-wider border-2 border-black shadow-[3px_3px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 transition-all flex items-center gap-2 cursor-pointer"
          >
            {isSaving ? <Loader2 className="w-4 h-4 animate-spin stroke-[3]" /> : <FileText className="w-4 h-4 stroke-[2.5]" />}
            <span>{isSaving ? 'SUBMITTING...' : 'SUBMIT REPORT'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
