import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { EmployeeLoan, Employee } from '@/types/hrm';
import { getEmployees, getEmployeeLoans, addEmployeeLoan, updateEmployeeLoan } from '@/lib/hrmStorage';
import { LoanFormModal } from '../hrm/LoanFormModal';
import { Plus, Search, Loader2, Edit, FileSpreadsheet, ChevronLeft, ChevronRight, Gift } from 'lucide-react';

interface Props {
  showToast: (msg: string, type: 'success'|'error') => void;
}

export const HRMLoansPage: React.FC<Props> = ({ showToast }) => {
  const { user, userProfile } = useAuth();
  const [loans, setLoans] = useState<EmployeeLoan[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingLoan, setEditingLoan] = useState<EmployeeLoan | null>(null);

  useEffect(() => {
    if (user && userProfile?.companyId) loadData();
  }, [user, userProfile?.companyId]);

  const loadData = async () => {
    if (!user || !userProfile?.companyId) return;
    setIsLoading(true);
    try {
      const [lData, eData] = await Promise.all([
        getEmployeeLoans(userProfile?.companyId),
        getEmployees(userProfile?.companyId)
      ]);
      setLoans(lData);
      setEmployees(eData);
    } catch (err) {
      console.error(err);
      showToast('Failed to load loans', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveLoan = async (data: Omit<EmployeeLoan, 'id' | 'companyId' | 'createdAt' | 'updatedAt'>) => {
    if (!user || !userProfile?.companyId) return;
    try {
      if (editingLoan) {
        await updateEmployeeLoan(editingLoan.id, data);
        showToast('Loan updated', 'success');
      } else {
        await addEmployeeLoan({ ...data, companyId: userProfile?.companyId });
        showToast('Loan added successfully', 'success');
      }
      loadData();
    } catch (err) {
      console.error(err);
      showToast('Error saving loan', 'error');
    }
  };

  const filteredLoans = loans.filter(l => 
    l.employeeName.toLowerCase().includes(searchQuery.toLowerCase()) || 
    l.loanType.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="w-full mx-auto space-y-6 pb-20">
      
      {/* Header */}
      <div className="bg-slate-900 p-4 rounded-md border border-slate-800 shadow-md flex flex-wrap items-center justify-between gap-4 text-white">
        <div className="flex flex-wrap items-center gap-2.5">
          <Gift className="w-5 h-5 text-slate-400" />
          <h2 className="text-lg font-bold text-white">Employee Loan Management</h2>
        </div>
        <button 
          onClick={() => { setEditingLoan(null); setIsFormOpen(true); }} 
          className="flex items-center gap-2 px-4 py-2 bg-[#20B2AA] text-white rounded font-bold shadow hover:bg-[#1A9C96] transition-colors"
        >
          <Plus className="w-4 h-4" /> ADD LOAN
        </button>
      </div>

      {/* Main Container */}
      <div className="bg-slate-900 border border-slate-800 rounded-md shadow-md overflow-hidden">
        
        <div className="p-4 border-b border-slate-800 bg-slate-900/50 flex flex-wrap justify-between items-center gap-4">
          <button className="flex items-center gap-2 px-3 py-1.5 bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-300 rounded text-xs font-bold transition-colors">
            <FileSpreadsheet className="w-4 h-4" /> Excel
          </button>
          
          <div className="flex items-center gap-2">
            <span className="text-sm text-slate-400">Search:</span>
            <div className="relative w-full max-w-xs">
              <input 
                type="text" 
                value={searchQuery} 
                onChange={(e) => setSearchQuery(e.target.value)} 
                className="w-48 bg-slate-950 border border-slate-700 text-white text-sm rounded px-3 py-1.5 focus:border-primary-500 focus:ring-1 focus:ring-primary-500" 
              />
            </div>
          </div>
        </div>

        {isLoading ? (
          <div className="py-20 flex flex-col items-center gap-3">
            <Loader2 className="w-8 h-8 text-primary-500 animate-spin" />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-300 whitespace-nowrap">
              <thead className="text-xs text-slate-200 bg-slate-800/80 font-bold border-b border-slate-700">
                <tr>
                  <th className="px-4 py-3">SL</th>
                  <th className="px-4 py-3">Employee ID</th>
                  <th className="px-4 py-3">Employee Name</th>
                  <th className="px-4 py-3">Loan Type</th>
                  <th className="px-4 py-3">Payroll Month</th>
                  <th className="px-4 py-3">Year</th>
                  <th className="px-4 py-3 text-right">Loan Amount</th>
                  <th className="px-4 py-3 text-right">Installment Amount</th>
                  <th className="px-4 py-3 text-right">Total Installment</th>
                  <th className="px-4 py-3">Loan Date</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/50">
                {filteredLoans.map((l, idx) => (
                  <tr key={l.id} className="hover:bg-slate-800/30 transition-colors">
                    <td className="px-4 py-3">{idx + 1}</td>
                    <td className="px-4 py-3">{employees.find(e => e.id === l.employeeId)?.id?.substring(0,6) || l.employeeId.substring(0,6)}</td>
                    <td className="px-4 py-3">{l.employeeName}</td>
                    <td className="px-4 py-3">
                      <div className="whitespace-normal max-w-[100px] leading-tight text-slate-400">
                        {l.loanType}
                      </div>
                    </td>
                    <td className="px-4 py-3">{l.payrollMonth}</td>
                    <td className="px-4 py-3">{l.payrollYear}</td>
                    <td className="px-4 py-3 text-right">{l.loanAmount.toFixed(2)}</td>
                    <td className="px-4 py-3 text-right">{l.installmentAmount.toFixed(2)}</td>
                    <td className="px-4 py-3 text-right">{l.installmentTotal.toFixed(2)}</td>
                    <td className="px-4 py-3">
                      <div className="whitespace-normal max-w-[80px] leading-tight">
                        {new Date(l.loanDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 text-xs font-bold rounded ${l.status === 'Approved' ? 'bg-[#00BFFF] text-white' : l.status === 'Pending' ? 'bg-[#FFB90F] text-white' : 'bg-rose-500 text-white'}`}>
                        {l.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <button 
                        onClick={() => { setEditingLoan(l); setIsFormOpen(true); }} 
                        className="p-1.5 bg-[#FFB90F] text-white hover:bg-[#E5A70D] rounded transition-colors inline-flex"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
                {filteredLoans.length === 0 && (
                  <tr>
                    <td colSpan={12} className="px-4 py-8 text-center text-slate-500 dark:text-slate-400">
                      No loans found matching your criteria.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        <div className="p-4 border-t border-slate-800 flex items-center justify-between text-sm text-slate-400">
          <span>Showing 1 to {filteredLoans.length} of {filteredLoans.length} entries</span>
          <div className="flex items-center gap-1">
            <button className="p-1.5 border border-slate-700 rounded text-slate-500 dark:text-slate-400 hover:bg-slate-800 disabled:opacity-50" disabled><ChevronLeft className="w-4 h-4" /></button>
            <button className="px-3 py-1.5 bg-[#20B2AA] text-white rounded font-bold">1</button>
            <button className="p-1.5 border border-slate-700 rounded text-slate-500 dark:text-slate-400 hover:bg-slate-800 disabled:opacity-50" disabled><ChevronRight className="w-4 h-4" /></button>
          </div>
        </div>

      </div>

      <LoanFormModal 
        isOpen={isFormOpen} 
        onClose={() => setIsFormOpen(false)} 
        employees={employees}
        onSave={handleSaveLoan}
        initialData={editingLoan}
      />
    </div>
  );
};
