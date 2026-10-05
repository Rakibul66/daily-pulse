import React, { useState, useEffect } from 'react';
import { EmployeeOvertime, Employee } from '@/types/hrm';
import { ArrowLeft } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  employees: Employee[];
  onSave: (overtime: Omit<EmployeeOvertime, 'id' | 'companyId' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  initialData?: EmployeeOvertime | null;
}

const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

export const OvertimeFormModal: React.FC<Props> = ({ isOpen, onClose, employees, onSave, initialData }) => {
  const [formData, setFormData] = useState({
    employeeId: '',
    employeeName: '',
    overtimeType: 'Regular Overtime',
    payrollMonth: MONTHS[new Date().getMonth()],
    payrollYear: new Date().getFullYear(),
    overtimeHour: '',
    overtimeRate: '',
    overtimeAmount: '',
    overtimeDate: new Date().toISOString().split('T')[0],
    status: 'Pending',
    remarks: '',
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        setFormData({
          employeeId: initialData.employeeId,
          employeeName: initialData.employeeName,
          overtimeType: initialData.overtimeType,
          payrollMonth: initialData.payrollMonth,
          payrollYear: initialData.payrollYear,
          overtimeHour: String(initialData.overtimeHour),
          overtimeRate: String(initialData.overtimeRate),
          overtimeAmount: String(initialData.overtimeAmount),
          overtimeDate: initialData.overtimeDate,
          status: initialData.status,
          remarks: initialData.remarks || '',
        });
      } else {
        setFormData({
          employeeId: '',
          employeeName: '',
          overtimeType: 'Regular Overtime',
          payrollMonth: MONTHS[new Date().getMonth()],
          payrollYear: new Date().getFullYear(),
          overtimeHour: '',
          overtimeRate: '',
          overtimeAmount: '',
          overtimeDate: new Date().toISOString().split('T')[0],
          status: 'Pending',
          remarks: '',
        });
      }
    }
  }, [isOpen, initialData]);

  // Auto calculate total amount
  useEffect(() => {
    const hours = Number(formData.overtimeHour);
    const rate = Number(formData.overtimeRate);
    if (!isNaN(hours) && !isNaN(rate) && formData.overtimeHour !== '' && formData.overtimeRate !== '') {
      setFormData(prev => ({ ...prev, overtimeAmount: (hours * rate).toFixed(2) }));
    }
  }, [formData.overtimeHour, formData.overtimeRate]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    let eName = formData.employeeName;
    if (!initialData) {
      const emp = employees.find(e => e.id === formData.employeeId);
      eName = emp ? emp.name : '';
    }

    try {
      await onSave({
        employeeId: formData.employeeId,
        employeeName: eName,
        overtimeType: formData.overtimeType,
        payrollMonth: formData.payrollMonth,
        payrollYear: Number(formData.payrollYear),
        overtimeHour: Number(formData.overtimeHour),
        overtimeRate: Number(formData.overtimeRate),
        overtimeAmount: Number(formData.overtimeAmount),
        overtimeDate: formData.overtimeDate,
        status: formData.status as any,
        remarks: formData.remarks,
      });
      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputClasses = "w-full text-sm font-medium text-white bg-slate-950 px-3 py-2.5 rounded-md border border-slate-700 focus:border-primary-500 focus:ring-1 focus:ring-primary-500 placeholder-slate-600";
  const labelClasses = "text-xs font-semibold text-slate-300 block mb-1.5";

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-xl shadow-xl w-full max-w-4xl flex flex-col animate-in zoom-in-95 duration-200 my-8">
        
        {/* Header */}
        <div className="px-6 py-4 flex items-center justify-between border-b border-slate-800 bg-slate-900/50">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            Add Employee overtime
          </h2>
          <button onClick={onClose} className="px-3 py-1.5 bg-orange-600 hover:bg-orange-500 text-white text-xs font-bold rounded flex items-center gap-1.5 transition-colors">
            <ArrowLeft className="w-3.5 h-3.5" /> BACK
          </button>
        </div>

        <div className="p-6">
          <form id="overtime-form" onSubmit={handleSubmit} className="space-y-6">
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Employee */}
              <div>
                <label className={`${labelClasses} flex items-center gap-1`}>Employee <span className="text-rose-500">*</span></label>
                <select 
                  value={formData.employeeId} 
                  onChange={(e) => setFormData({...formData, employeeId: e.target.value})} 
                  className={inputClasses} 
                  required
                  disabled={!!initialData}
                >
                  <option value="">Select Employee</option>
                  {employees.map(emp => (
                    <option key={emp.id} value={emp.id}>{emp.name}</option>
                  ))}
                </select>
              </div>

              {/* Overtime Type */}
              <div>
                <label className={`${labelClasses} flex items-center gap-1`}>Overtime Type <span className="text-rose-500">*</span></label>
                <select 
                  value={formData.overtimeType} 
                  onChange={(e) => setFormData({...formData, overtimeType: e.target.value})} 
                  className={inputClasses} 
                  required
                >
                  <option value="">Select Overtime Type</option>
                  <option value="Regular Overtime">Regular Overtime</option>
                  <option value="Holiday Overtime">Holiday Overtime</option>
                  <option value="Weekend Overtime">Weekend Overtime</option>
                </select>
              </div>

              {/* Payroll Month */}
              <div>
                <label className={`${labelClasses} flex items-center gap-1`}>Payroll Month <span className="text-rose-500">*</span></label>
                <select 
                  value={formData.payrollMonth} 
                  onChange={(e) => setFormData({...formData, payrollMonth: e.target.value})} 
                  className={inputClasses} 
                  required
                >
                  {MONTHS.map(m => (
                    <option key={m} value={m}>{m}</option>
                  ))}
                </select>
              </div>

              {/* Payroll Year */}
              <div>
                <label className={`${labelClasses} flex items-center gap-1`}>Payroll Year <span className="text-rose-500">*</span></label>
                <input 
                  type="number" 
                  value={formData.payrollYear} 
                  onChange={(e) => setFormData({...formData, payrollYear: Number(e.target.value)})} 
                  className={inputClasses} 
                  required 
                />
              </div>

              {/* Overtime Hour */}
              <div>
                <label className={`${labelClasses} flex items-center gap-1`}>Overtime Hour <span className="text-rose-500">*</span></label>
                <input 
                  type="number" 
                  value={formData.overtimeHour} 
                  onChange={(e) => setFormData({...formData, overtimeHour: e.target.value})} 
                  className={inputClasses} 
                  min="0"
                  step="0.1"
                  required 
                />
              </div>

              {/* Rate Per Hour */}
              <div>
                <label className={`${labelClasses} flex items-center gap-1`}>Rate Per Hour <span className="text-rose-500">*</span></label>
                <input 
                  type="number" 
                  value={formData.overtimeRate} 
                  onChange={(e) => setFormData({...formData, overtimeRate: e.target.value})} 
                  className={inputClasses} 
                  min="0"
                  step="0.01"
                  required 
                />
              </div>

              {/* Overtime Amount */}
              <div>
                <label className={`${labelClasses} flex items-center gap-1`}>Overtime Amount <span className="text-rose-500">*</span></label>
                <input 
                  type="number" 
                  value={formData.overtimeAmount} 
                  onChange={(e) => setFormData({...formData, overtimeAmount: e.target.value})} 
                  className={inputClasses} 
                  min="0"
                  step="0.01"
                  required 
                />
              </div>

              {/* Overtime Date */}
              <div>
                <label className={`${labelClasses} flex items-center gap-1`}>Overtime Date <span className="text-rose-500">*</span></label>
                <input 
                  type="date" 
                  value={formData.overtimeDate} 
                  onChange={(e) => setFormData({...formData, overtimeDate: e.target.value})} 
                  className={inputClasses} 
                  required 
                />
              </div>
              
              {/* Status */}
              <div>
                <label className={labelClasses}>Status</label>
                <select 
                  value={formData.status} 
                  onChange={(e) => setFormData({...formData, status: e.target.value})} 
                  className={inputClasses}
                >
                  <option value="Pending">Pending</option>
                  <option value="Approved">Approved</option>
                  <option value="Rejected">Rejected</option>
                </select>
              </div>
            </div>

            {/* Remarks */}
            <div>
              <label className={labelClasses}>Remarks</label>
              <textarea 
                value={formData.remarks} 
                onChange={(e) => setFormData({...formData, remarks: e.target.value})} 
                className={`${inputClasses} resize-none min-h-[80px]`}
              ></textarea>
            </div>
            
          </form>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-800 bg-slate-900/50 flex justify-end">
          <button 
            type="submit" 
            form="overtime-form" 
            disabled={isSubmitting} 
            className="px-5 py-2.5 text-sm font-bold text-white bg-[#20B2AA] rounded flex items-center gap-2 hover:bg-[#1A9C96] disabled:opacity-50 transition-colors shadow-md"
          >
            SAVE OVERTIME
          </button>
        </div>
      </div>
    </div>
  );
};
