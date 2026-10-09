import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Employee, SalaryPayment } from '@/types/hrm';
import { getEmployees, getPayrollByMonth, addSalaryPayment, deleteSalaryPayment } from '@/lib/hrmStorage';
import { 
  ChevronLeft, 
  ChevronRight, 
  Plus, 
  Trash2, 
  DollarSign, 
  Coins, 
  Sparkles, 
  User, 
  Calendar, 
  CheckCircle2, 
  AlertCircle, 
  X,
  CreditCard,
  History
} from 'lucide-react';

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
    const targetYM = ym || yearMonth;
    setIsLoading(true);
    try {
      const [emps, pays] = await Promise.all([
        getEmployees(uid),
        getPayrollByMonth(uid, targetYM)
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
  const handleSetCurrentMonth = () => setCurrentDate(new Date(today.getFullYear(), today.getMonth(), 1));

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
      showToast('Payment recorded successfully', 'success');
      
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
    if (!confirm('Delete this payment record?')) return;
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

  // KPI Calculations
  const totalBaseSalary = employees.reduce((sum, e) => sum + (e.baseSalary || 0), 0);
  const totalPaid = payments.reduce((sum, p) => sum + (p.amount || 0), 0);
  const totalDue = Math.max(0, totalBaseSalary - totalPaid);

  return (
    <div className="w-full mx-auto space-y-6 pb-20 font-sans text-black">
      {/* 1. Top Header Card with High-Contrast Month Navigator */}
      <div className="bg-white border-4 border-black shadow-[6px_6px_0px_#000] p-6 sm:p-7 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-amber-300 border-3 border-black shadow-[3px_3px_0px_#000] flex items-center justify-center text-black shrink-0">
            <Coins className="w-8 h-8 stroke-[2.5]" />
          </div>
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-amber-300 border-2 border-black text-[10px] font-black uppercase tracking-wider shadow-[2px_2px_0px_#000] mb-1.5">
              <Sparkles className="w-3.5 h-3.5 fill-black" />
              FINANCIAL DISBURSEMENT
            </div>
            <h1 className="font-display font-black text-2xl sm:text-3xl uppercase tracking-tight text-black leading-none">
              PAYROLL & SALARY
            </h1>
            <p className="text-xs font-bold text-slate-700 uppercase tracking-wide mt-1">
              Manage monthly salary payouts, partial advance payments & employee ledgers
            </p>
          </div>
        </div>

        {/* Month Selector: High-Contrast & 100% Readable */}
        <div className="flex items-center gap-2">
          <div className="flex items-center bg-white border-3 border-black shadow-[3px_3px_0px_#000] overflow-hidden">
            <button 
              onClick={handlePrevMonth} 
              className="p-2.5 hover:bg-amber-100 text-black border-r-2 border-black transition-colors cursor-pointer active:translate-x-0.5"
              title="Previous Month"
            >
              <ChevronLeft className="w-5 h-5 stroke-[3]" />
            </button>
            <div className="px-5 py-2 font-display font-black text-sm uppercase text-black bg-[#FFFDF0] min-w-[140px] text-center tracking-wider select-none">
              {currentDate.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
            </div>
            <button 
              onClick={handleNextMonth} 
              className="p-2.5 hover:bg-amber-100 text-black border-l-2 border-black transition-colors cursor-pointer active:translate-x-0.5"
              title="Next Month"
            >
              <ChevronRight className="w-5 h-5 stroke-[3]" />
            </button>
          </div>

          <button
            onClick={handleSetCurrentMonth}
            className="px-3.5 py-2.5 bg-white hover:bg-amber-100 text-black font-display font-black text-xs uppercase tracking-wider border-3 border-black shadow-[3px_3px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 cursor-pointer transition-all"
            title="Jump to Current Month"
          >
            CURRENT
          </button>
        </div>
      </div>

      {/* 2. Top Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Active Staff */}
        <div className="bg-[#FFFDF0] border-3 border-black shadow-[4px_4px_0px_#000] p-4 sm:p-5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-display font-black uppercase tracking-wider text-slate-800">
              ACTIVE EMPLOYEES
            </span>
            <User className="w-4 h-4 text-black stroke-[2.5]" />
          </div>
          <div className="font-display font-black text-3xl sm:text-4xl text-black">
            {employees.length}
          </div>
          <p className="text-[10px] font-black uppercase tracking-wider text-slate-600 mt-1">
            Eligible for salary
          </p>
        </div>

        {/* Total Monthly Payroll Budget */}
        <div className="bg-[#E0E7FF] border-3 border-black shadow-[4px_4px_0px_#000] p-4 sm:p-5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-display font-black uppercase tracking-wider text-indigo-950">
              TOTAL SALARY BUDGET
            </span>
            <CreditCard className="w-4 h-4 text-indigo-900 stroke-[2.5]" />
          </div>
          <div className="font-display font-black text-2xl sm:text-3xl text-indigo-950 truncate">
            ৳{totalBaseSalary.toLocaleString()}
          </div>
          <p className="text-[10px] font-black uppercase tracking-wider text-indigo-800 mt-1">
            Total base commitments
          </p>
        </div>

        {/* Disbursed So Far */}
        <div className="bg-[#DCFCE7] border-3 border-black shadow-[4px_4px_0px_#000] p-4 sm:p-5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-display font-black uppercase tracking-wider text-emerald-950">
              PAID THIS MONTH
            </span>
            <CheckCircle2 className="w-4 h-4 text-emerald-800 stroke-[2.5]" />
          </div>
          <div className="font-display font-black text-2xl sm:text-3xl text-emerald-950 truncate">
            ৳{totalPaid.toLocaleString()}
          </div>
          <p className="text-[10px] font-black uppercase tracking-wider text-emerald-800 mt-1">
            Disbursed in {currentDate.toLocaleDateString('en-US', { month: 'short' })}
          </p>
        </div>

        {/* Remaining Due */}
        <div className="bg-[#FFE4E6] border-3 border-black shadow-[4px_4px_0px_#000] p-4 sm:p-5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-display font-black uppercase tracking-wider text-rose-950">
              PENDING BALANCE
            </span>
            <AlertCircle className="w-4 h-4 text-rose-800 stroke-[2.5]" />
          </div>
          <div className="font-display font-black text-2xl sm:text-3xl text-rose-950 truncate">
            ৳{totalDue.toLocaleString()}
          </div>
          <p className="text-[10px] font-black uppercase tracking-wider text-rose-800 mt-1">
            Awaiting payout
          </p>
        </div>
      </div>

      {/* 3. Table / Content Section */}
      {isLoading ? (
        <div className="bg-white border-4 border-black shadow-[6px_6px_0px_#000] p-16 flex flex-col items-center justify-center gap-3">
          <div className="w-9 h-9 border-4 border-black border-t-amber-400 rounded-full animate-spin"></div>
          <span className="font-display font-black text-xs uppercase tracking-wider text-black">
            LOADING PAYROLL DATA...
          </span>
        </div>
      ) : (
        <div className="bg-white border-4 border-black shadow-[6px_6px_0px_#000] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left border-collapse">
              <thead>
                <tr className="bg-[#FFFDF0] border-b-3 border-black">
                  <th className="px-6 py-4 font-display font-black text-xs uppercase tracking-wider text-black border-r-2 border-black">
                    EMPLOYEE
                  </th>
                  <th className="px-6 py-4 font-display font-black text-xs uppercase tracking-wider text-black text-right border-r-2 border-black">
                    BASE SALARY
                  </th>
                  <th className="px-6 py-4 font-display font-black text-xs uppercase tracking-wider text-black text-right border-r-2 border-black">
                    PAID SO FAR
                  </th>
                  <th className="px-6 py-4 font-display font-black text-xs uppercase tracking-wider text-black text-right border-r-2 border-black">
                    DUE BALANCE
                  </th>
                  <th className="px-6 py-4 font-display font-black text-xs uppercase tracking-wider text-black text-center">
                    ACTION
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y-2 divide-black">
                {employees.map(emp => {
                  const paidSoFar = payments.filter(p => p.employeeId === emp.id).reduce((sum, p) => sum + p.amount, 0);
                  const due = emp.baseSalary - paidSoFar;
                  
                  return (
                    <tr key={emp.id} className="hover:bg-[#FFFDF0] transition-colors">
                      <td className="px-6 py-4 border-r-2 border-black">
                        <div className="font-display font-black text-sm text-black">{emp.name}</div>
                        <div className="inline-block px-1.5 py-0.5 bg-black text-white text-[9px] font-black uppercase tracking-wider mt-1">
                          {emp.department || 'GENERAL'}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right font-display font-bold text-sm text-black border-r-2 border-black">
                        ৳{emp.baseSalary.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 text-right font-display font-black text-sm text-emerald-700 border-r-2 border-black">
                        ৳{paidSoFar.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 text-right border-r-2 border-black">
                        {due > 0 ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-rose-200 text-rose-950 border-2 border-black shadow-[1.5px_1.5px_0px_#000] text-xs font-black">
                            ৳{due.toLocaleString()}
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-emerald-200 text-emerald-950 border-2 border-black shadow-[1.5px_1.5px_0px_#000] text-xs font-black">
                            CLEARED
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <button 
                          onClick={() => openPaymentModal(emp)} 
                          className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-400 hover:bg-emerald-300 text-black border-2 border-black shadow-[2px_2px_0px_#000] text-xs font-display font-black uppercase tracking-wider active:translate-x-0.5 active:translate-y-0.5 transition-all cursor-pointer"
                        >
                          <DollarSign className="w-3.5 h-3.5 stroke-[3]" />
                          PAY / HISTORY
                        </button>
                      </td>
                    </tr>
                  );
                })}
                {employees.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center">
                      <div className="max-w-md mx-auto space-y-2">
                        <p className="font-display font-black text-base uppercase text-black">
                          NO ACTIVE EMPLOYEES FOUND
                        </p>
                        <p className="text-xs font-bold text-slate-600 uppercase tracking-wide">
                          Add active employees in the HRM Employees section to manage monthly payroll.
                        </p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 4. Payment Modal */}
      {isModalOpen && selectedEmp && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white border-4 border-black shadow-[8px_8px_0px_#000] w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col my-8 animate-in fade-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="px-6 py-4 bg-amber-300 border-b-4 border-black flex items-center justify-between">
              <div>
                <h2 className="font-display font-black text-base sm:text-lg uppercase tracking-tight text-black flex items-center gap-2">
                  <Coins className="w-5 h-5 stroke-[2.5]" />
                  PAYROLL FOR {selectedEmp.name}
                </h2>
                <p className="text-xs font-black text-black uppercase tracking-wider mt-0.5">
                  MONTH: {yearMonth} • BASE SALARY: ৳{selectedEmp.baseSalary.toLocaleString()}
                </p>
              </div>
              <button 
                onClick={() => setIsModalOpen(false)} 
                className="p-1.5 bg-white hover:bg-rose-100 text-black border-2 border-black shadow-[1.5px_1.5px_0px_#000] transition-colors cursor-pointer"
              >
                <X className="w-5 h-5 stroke-[2.5]" />
              </button>
            </div>
            
            {/* Modal Body */}
            <div className="p-6 overflow-y-auto flex-1 grid grid-cols-1 md:grid-cols-2 gap-6 bg-[#FAF8F0]">
              
              {/* Form Side */}
              <div className="bg-white border-3 border-black shadow-[3px_3px_0px_#000] p-5">
                <div className="inline-block px-2.5 py-0.5 bg-black text-white font-display font-black text-[10px] uppercase tracking-wider mb-3">
                  RECORD PAYMENT
                </div>
                <h3 className="font-display font-black text-sm uppercase text-black mb-4">
                  NEW DISBURSEMENT
                </h3>
                
                <form onSubmit={handleSavePayment} className="space-y-4">
                  <div>
                    <label className="text-xs font-display font-black text-black block mb-1.5 uppercase tracking-wider">
                      Payment Date *
                    </label>
                    <input 
                      required 
                      type="date" 
                      value={formData.date} 
                      onChange={e => setFormData({ ...formData, date: e.target.value })} 
                      className="w-full bg-white border-3 border-black shadow-[2px_2px_0px_#000] px-3 py-2 text-black text-sm font-bold focus:bg-[#FFFDF0] focus:outline-none" 
                    />
                  </div>
                  <div>
                    <label className="text-xs font-display font-black text-black block mb-1.5 uppercase tracking-wider">
                      Amount (৳) *
                    </label>
                    <input 
                      required 
                      type="number" 
                      min="1" 
                      value={formData.amount} 
                      onChange={e => setFormData({ ...formData, amount: Number(e.target.value) })} 
                      className="w-full bg-white border-3 border-black shadow-[2px_2px_0px_#000] px-3 py-2 text-black text-sm font-black focus:bg-[#FFFDF0] focus:outline-none" 
                    />
                  </div>
                  <div>
                    <label className="text-xs font-display font-black text-black block mb-1.5 uppercase tracking-wider">
                      Note / Description
                    </label>
                    <input 
                      type="text" 
                      value={formData.note} 
                      onChange={e => setFormData({ ...formData, note: e.target.value })} 
                      className="w-full bg-white border-3 border-black shadow-[2px_2px_0px_#000] px-3 py-2 text-black text-sm font-bold focus:bg-[#FFFDF0] focus:outline-none" 
                      placeholder="e.g. Full month salary, Partial advance..." 
                    />
                  </div>
                  <button 
                    type="submit" 
                    className="w-full px-4 py-2.5 text-xs font-display font-black uppercase tracking-wider text-black bg-emerald-400 hover:bg-emerald-300 border-3 border-black shadow-[3px_3px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 transition-all cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <Plus className="w-4 h-4 stroke-[3]" />
                    <span>SAVE PAYMENT RECORD</span>
                  </button>
                </form>
              </div>

              {/* History Side */}
              <div className="bg-white border-3 border-black shadow-[3px_3px_0px_#000] p-5 flex flex-col justify-between">
                <div>
                  <div className="inline-block px-2.5 py-0.5 bg-black text-white font-display font-black text-[10px] uppercase tracking-wider mb-3">
                    AUDIT LEDGER
                  </div>
                  <h3 className="font-display font-black text-sm uppercase text-black mb-4 flex items-center gap-1.5">
                    <History className="w-4 h-4 stroke-[2.5]" />
                    HISTORY ({yearMonth})
                  </h3>

                  <div className="space-y-2.5 max-h-[220px] overflow-y-auto pr-1">
                    {selectedEmpPayments.map(pay => (
                      <div key={pay.id} className="flex justify-between items-center p-3 bg-[#FFFDF0] border-2 border-black shadow-[1.5px_1.5px_0px_#000]">
                        <div>
                          <div className="text-sm font-display font-black text-emerald-800">
                            ৳{pay.amount.toLocaleString()}
                          </div>
                          <div className="text-[10px] font-bold text-slate-700 uppercase mt-0.5">
                            {pay.date} {pay.note && `• ${pay.note}`}
                          </div>
                        </div>
                        <button 
                          onClick={() => handleDeletePayment(pay.id)} 
                          className="p-1.5 bg-white hover:bg-rose-100 text-rose-700 border border-black transition-colors cursor-pointer"
                          title="Delete Payment"
                        >
                          <Trash2 className="w-3.5 h-3.5 stroke-[2.5]" />
                        </button>
                      </div>
                    ))}
                    {selectedEmpPayments.length === 0 && (
                      <div className="text-xs font-bold uppercase text-slate-500 text-center py-6 italic border-2 border-dashed border-slate-300">
                        No payments recorded yet for this month.
                      </div>
                    )}
                  </div>
                </div>
                
                {/* Total Paid Summary */}
                {selectedEmpPayments.length > 0 && (
                  <div className="mt-4 pt-3 border-t-2 border-black flex justify-between items-center">
                    <span className="font-display font-black text-xs uppercase text-slate-800">
                      TOTAL PAID:
                    </span>
                    <span className="font-display font-black text-base text-emerald-800 bg-emerald-100 border-2 border-black px-2 py-0.5">
                      ৳{selectedEmpPayments.reduce((s, p) => s + p.amount, 0).toLocaleString()}
                    </span>
                  </div>
                )}
              </div>

            </div>
          </div>
        </div>
      )}
    </div>
  );
};

