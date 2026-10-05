import React, { useState, useEffect } from 'react';
import { EmployeeLoan, Employee } from '@/types/hrm';
import { X, ArrowLeft } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  employees: Employee[];
  onSave: (loan: Omit<EmployeeLoan, 'id' | 'companyId' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  initialData?: EmployeeLoan | null;
}

const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

export const LoanFormModal: React.FC<Props> = ({ isOpen, onClose, employees, onSave, initialData }) => {
  const [formData, setFormData] = useState({
    employeeId: '',
    employeeName: '',
    loanType: 'Salary Advance',
    payrollMonth: MONTHS[new Date().getMonth()],
    payrollYear: new Date().getFullYear(),
    loanAmount: '',
    installmentAmount: '',
    installmentTotal: '',
    loanDate: new Date().toISOString().split('T')[0],
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
          loanType: initialData.loanType,
          payrollMonth: initialData.payrollMonth,
          payrollYear: initialData.payrollYear,
          loanAmount: String(initialData.loanAmount),
          installmentAmount: String(initialData.installmentAmount),
          installmentTotal: String(initialData.installmentTotal),
          loanDate: initialData.loanDate,
          status: initialData.status,
          remarks: initialData.remarks || '',
        });
      } else {
        setFormData({
          employeeId: '',
          employeeName: '',
          loanType: 'Salary Advance',
          payrollMonth: MONTHS[new Date().getMonth()],
          payrollYear: new Date().getFullYear(),
          loanAmount: '',
          installmentAmount: '',
          installmentTotal: '',
          loanDate: new Date().toISOString().split('T')[0],
          status: 'Pending',
          remarks: '',
        });
      }
    }
  }, [isOpen, initialData]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Find employee name if adding new
    let eName = formData.employeeName;
    if (!initialData) {
      const emp = employees.find(e => e.id === formData.employeeId);
      eName = emp ? emp.name : '';
    }

    try {
      await onSave({
        employeeId: formData.employeeId,
        employeeName: eName,
        loanType: formData.loanType,
        payrollMonth: formData.payrollMonth,
        payrollYear: Number(formData.payrollYear),
        loanAmount: Number(formData.loanAmount),
        installmentAmount: Number(formData.installmentAmount),
        installmentTotal: Number(formData.installmentTotal),
        loanDate: formData.loanDate,
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
            Add Employee loan
          </h2>
          <button onClick={onClose} className="px-3 py-1.5 bg-orange-600 hover:bg-orange-500 text-white text-xs font-bold rounded flex items-center gap-1.5 transition-colors">
            <ArrowLeft className="w-3.5 h-3.5" /> BACK
          </button>
        </div>

        <div className="p-6">
          <form id="loan-form" onSubmit={handleSubmit} className="space-y-6">
            
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

              {/* Loan Type */}
              <div>
                <label className={`${labelClasses} flex items-center gap-1`}>Loan Type <span className="text-rose-500">*</span></label>
                <select 
                  value={formData.loanType} 
                  onChange={(e) => setFormData({...formData, loanType: e.target.value})} 
                  className={inputClasses} 
                  required
                >
                  <option value="">Select Loan Type</option>
                  <option value="Salary Advance">Salary Advance</option>
                  <option value="Personal Loan">Personal Loan</option>
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
                <label className={`${labelClasses} flex items-center gap-1`}>Payroll Year</label>
                <input 
                  type="number" 
                  value={formData.payrollYear} 
                  onChange={(e) => setFormData({...formData, payrollYear: Number(e.target.value)})} 
                  className={inputClasses} 
                  required 
                />
              </div>

              {/* Installment Total */}
              <div>
                <label className={`${labelClasses} flex items-center gap-1`}>Installment Total <span className="text-rose-500">*</span></label>
                <input 
                  type="number" 
                  value={formData.installmentTotal} 
                  onChange={(e) => setFormData({...formData, installmentTotal: e.target.value})} 
                  className={inputClasses} 
                  min="0"
                  step="0.01"
                  required 
                />
              </div>

              {/* Loan Date */}
              <div>
                <label className={`${labelClasses} flex items-center gap-1`}>Loan Date <span className="text-rose-500">*</span></label>
                <input 
                  type="date" 
                  value={formData.loanDate} 
                  onChange={(e) => setFormData({...formData, loanDate: e.target.value})} 
                  className={inputClasses} 
                  required 
                />
              </div>
              
              {/* Loan Amount */}
              <div>
                <label className={`${labelClasses} flex items-center gap-1`}>Loan Amount <span className="text-rose-500">*</span></label>
                <input 
                  type="number" 
                  value={formData.loanAmount} 
                  onChange={(e) => setFormData({...formData, loanAmount: e.target.value})} 
                  className={inputClasses} 
                  min="0"
                  step="0.01"
                  required 
                />
              </div>

              {/* Installment Amount */}
              <div>
                <label className={`${labelClasses} flex items-center gap-1`}>Installment Amount <span className="text-rose-500">*</span></label>
                <input 
                  type="number" 
                  value={formData.installmentAmount} 
                  onChange={(e) => setFormData({...formData, installmentAmount: e.target.value})} 
                  className={inputClasses} 
                  min="0"
                  step="0.01"
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
            form="loan-form" 
            disabled={isSubmitting} 
            className="px-5 py-2.5 text-sm font-bold text-white bg-emerald-600 rounded flex items-center gap-2 hover:bg-emerald-500 disabled:opacity-50 transition-colors shadow-md"
          >
            SAVE LOAN
          </button>
        </div>
      </div>
    </div>
  );
};
