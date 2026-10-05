import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Employee, SalaryPayment } from '@/types/hrm';
import { getEmployees, getPayrollByMonth, addSalaryPayment, deleteSalaryPayment } from '@/lib/hrmStorage';
import { ChevronLeft, ChevronRight, Plus, Trash2, DollarSign } from 'lucide-react';

interface Props {
  showToast: (msg: string, type: 'success'|'error') => void;
}

export const HRMPayrollPage: React.FC<Props> = ({ showToast }) => {
  const { user, userProfile } = useAuth();
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [payments, setPayments] = useState<SalaryPayment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEmp, setSelectedEmp] = useState<Employee | null>(null);
  const [selectedEmpPayments, setSelectedEmpPayments] = useState<SalaryPayment[]>([]);

  const today = new Date();
  const [currentDate, setCurrentDate] = useState(new Date(today.getFullYear(), today.getMonth(), 1));
  const yearMonth = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}`;

  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    amount: 0,
    note: ''
  });

  useEffect(() => {
    if (user && userProfile?.companyId) {
      loadData(yearMonth);
    }
  }, [user, yearMonth]);

  const loadData = async (ym?: string) => {
    const uid = userProfile?.companyId;
    if (!uid) return;
    const yearMonth = ym || (currentDate.getFullYear() + '-' + String(currentDate.getMonth() + 1).padStart(2, '0'));
    if (!uid) return;
    setIsLoading(true);
    try {
      const [emps, pays] = await Promise.all([
        getEmployees(uid),
        getPayrollByMonth(userProfile?.companyId || '', yearMonth)
      ]);
      setEmployees(emps.filter(e => e.isActive));
      setPayments(pays);
    } catch (err) {
      console.error(err);
      showToast('Failed to load payroll data', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePrevMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  const handleNextMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));

  const openPaymentModal = (emp: Employee) => {
    setSelectedEmp(emp);
    setSelectedEmpPayments(payments.filter(p => p.employeeId === emp.id));
    
    // Auto-fill amount with remaining balance
    const paidSoFar = payments.filter(p => p.employeeId === emp.id).reduce((sum, p) => sum + p.amount, 0);
    const due = emp.baseSalary - paidSoFar;
    
    setFormData({
      date: new Date().toISOString().split('T')[0],
      amount: due > 0 ? due : 0,
      note: ''
    });
    setIsModalOpen(true);
  };

  const handleSavePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !selectedEmp) return;
    
    try {
      await addSalaryPayment({
        companyId: userProfile?.companyId || '',
        employeeId: selectedEmp.id,
        date: formData.date,
        month: yearMonth,
        amount: formData.amount,
        note: formData.note
      });
      showToast('Payment recorded', 'success');
      
      // reload
      const newPays = await getPayrollByMonth(userProfile?.companyId || '', yearMonth);
      setPayments(newPays);
      setSelectedEmpPayments(newPays.filter(p => p.employeeId === selectedEmp.id));
      setFormData(prev => ({ ...prev, amount: 0, note: '' }));
    } catch (err) {
      console.error(err);
      showToast('Error recording payment', 'error');
    }
  };

  const handleDeletePayment = async (id: string) => {
    if (!user || !selectedEmp) return;
    try {
      await deleteSalaryPayment(id);
      showToast('Payment deleted', 'success');
      const newPays = await getPayrollByMonth(userProfile?.companyId || '', yearMonth);
      setPayments(newPays);
      setSelectedEmpPayments(newPays.filter(p => p.employeeId === selectedEmp.id));
    } catch (err) {
      console.error(err);
      showToast('Error deleting payment', 'error');
    }
  };

  return (
    <div className="w-full mx-auto space-y-6">
      <div className="bg-slate-900 p-4 sm:p-5 rounded-md border border-slate-800 shadow-md flex flex-wrap items-center justify-between gap-4 text-white">
        <div>
          <div className="flex flex-wrap items-center gap-2.5">
            <span className="w-2.5 h-2.5 rounded-full bg-primary-500"></span>
            <h2 className="text-lg font-bold text-white">Payroll & Salary</h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">Manage monthly salary payouts and partial payments.</p>
        </div>
        
        <div className="flex items-center bg-slate-950 border border-slate-800 rounded-md overflow-hidden">
          <button onClick={handlePrevMonth} className="px-3 py-2 hover:bg-slate-800 text-slate-400 hover:text-white"><ChevronLeft className="w-4 h-4" /></button>
          <div className="px-4 py-2 text-sm font-bold text-white min-w-[120px] text-center">
            {currentDate.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
          </div>
          <button onClick={handleNextMonth} className="px-3 py-2 hover:bg-slate-800 text-slate-400 hover:text-white"><ChevronRight className="w-4 h-4" /></button>
        </div>
      </div>

      {isLoading ? (
        <div className="py-20 flex flex-col items-center gap-3">
          <div className="w-8 h-8 rounded-full border-4 border-primary-900 border-t-primary-500 animate-spin"></div>
        </div>
      ) : (
        <div className="bg-slate-900 rounded-md border border-slate-800 shadow-md overflow-hidden">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-slate-400 uppercase bg-slate-950/80 border-b border-slate-800">
              <tr>
                <th className="px-5 py-4 font-bold tracking-wider">Employee</th>
                <th className="px-5 py-4 font-bold tracking-wider text-right">Base Salary</th>
                <th className="px-5 py-4 font-bold tracking-wider text-right">Paid So Far</th>
                <th className="px-5 py-4 font-bold tracking-wider text-right">Due Balance</th>
                <th className="px-5 py-4 font-bold tracking-wider text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {employees.map(emp => {
                const paidSoFar = payments.filter(p => p.employeeId === emp.id).reduce((sum, p) => sum + p.amount, 0);
                const due = emp.baseSalary - paidSoFar;
                
                return (
                  <tr key={emp.id} className="hover:bg-slate-800/50 transition-colors">
                    <td className="px-5 py-4">
                      <div className="font-bold text-white">{emp.name}</div>
                      <div className="text-[10px] text-slate-400">{emp.department}</div>
                    </td>
                    <td className="px-5 py-4 text-right font-bold text-slate-300">৳{emp.baseSalary.toLocaleString()}</td>
                    <td className="px-5 py-4 text-right font-bold text-emerald-400">৳{paidSoFar.toLocaleString()}</td>
                    <td className={`px-5 py-4 text-right font-bold ${due > 0 ? 'text-rose-400' : 'text-slate-500 dark:text-slate-400'}`}>
                      ৳{due.toLocaleString()}
                    </td>
                    <td className="px-5 py-4 text-center">
                      <button onClick={() => openPaymentModal(emp)} className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-primary-600/20 text-primary-400 hover:bg-primary-600 hover:text-white rounded-lg text-xs font-bold transition-colors">
                        <DollarSign className="w-3.5 h-3.5" />
                        Pay / History
                      </button>
                    </td>
                  </tr>
                );
              })}
              {employees.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-5 py-10 text-center text-slate-500 dark:text-slate-400">No active employees found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Payment Modal */}
      {isModalOpen && selectedEmp && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-md w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col shadow-md">
            <div className="px-6 py-5 border-b border-slate-800 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-white">Payroll for {selectedEmp.name}</h2>
                <p className="text-xs text-slate-400">{yearMonth} - Base: ৳{selectedEmp.baseSalary.toLocaleString()}</p>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="p-2 text-slate-400 hover:text-white rounded-md hover:bg-slate-800"><ChevronRight className="w-5 h-5"/></button>
            </div>
            
            <div className="p-6 overflow-y-auto flex-1 grid grid-cols-1 md:grid-cols-2 gap-8">
              
              {/* Form Side */}
              <div>
                <h3 className="text-sm font-bold text-emerald-400 mb-4 border-b border-slate-800 pb-2">Record New Payment</h3>
                <form onSubmit={handleSavePayment} className="space-y-4">
                  <div>
                    <label className="text-xs font-semibold text-slate-300 block mb-1.5">Date</label>
                    <input required type="date" value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} className="w-full bg-slate-950 border border-slate-700 rounded-md px-3 py-2 text-white text-sm" />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-slate-300 block mb-1.5">Amount (৳)</label>
                    <input required type="number" min="1" value={formData.amount} onChange={e => setFormData({...formData, amount: Number(e.target.value)})} className="w-full bg-slate-950 border border-slate-700 rounded-md px-3 py-2 text-white text-sm" />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-slate-300 block mb-1.5">Note (optional)</label>
                    <input type="text" value={formData.note} onChange={e => setFormData({...formData, note: e.target.value})} className="w-full bg-slate-950 border border-slate-700 rounded-md px-3 py-2 text-white text-sm" placeholder="e.g. Partial advance" />
                  </div>
                  <button type="submit" className="w-full px-4 py-2 text-sm text-white font-bold bg-emerald-600 rounded-md hover:bg-emerald-500">
                    Add Payment
                  </button>
                </form>
              </div>

              {/* History Side */}
              <div>
                <h3 className="text-sm font-bold text-slate-200 mb-4 border-b border-slate-800 pb-2">Payment History ({yearMonth})</h3>
                <div className="space-y-3">
                  {selectedEmpPayments.map(pay => (
                    <div key={pay.id} className="flex justify-between items-center p-3 bg-slate-950 border border-slate-800 rounded-md">
                      <div>
                        <div className="text-sm font-bold text-emerald-400">৳{pay.amount.toLocaleString()}</div>
                        <div className="text-[10px] text-slate-500 dark:text-slate-400">{pay.date} {pay.note && `- ${pay.note}`}</div>
                      </div>
                      <button onClick={() => handleDeletePayment(pay.id)} className="p-1.5 text-slate-500 dark:text-slate-400 hover:text-rose-400">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                  {selectedEmpPayments.length === 0 && (
                    <div className="text-sm text-slate-500 dark:text-slate-400 text-center py-4">No payments recorded yet for this month.</div>
                  )}
                  
                  {/* Summary */}
                  {selectedEmpPayments.length > 0 && (
                    <div className="mt-4 pt-3 border-t border-slate-800 flex justify-between items-center text-sm">
                      <span className="font-bold text-slate-400">Total Paid:</span>
                      <span className="font-bold text-white">৳{selectedEmpPayments.reduce((s, p) => s + p.amount, 0).toLocaleString()}</span>
                    </div>
                  )}
                </div>
              </div>

            </div>
          </div>
        </div>
      )}
    </div>
  );
};
