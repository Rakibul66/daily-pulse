import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { EmployeeOvertime, Employee } from '@/types/hrm';
import { getEmployees, getEmployeeOvertimes, addEmployeeOvertime, updateEmployeeOvertime } from '@/lib/hrmStorage';
import { OvertimeFormModal } from '../hrm/OvertimeFormModal';
import { Plus, Loader2, Edit, FileSpreadsheet, ChevronLeft, ChevronRight, Clock } from 'lucide-react';

interface Props {
  showToast: (msg: string, type: 'success'|'error') => void;
}

export const HRMOvertimePage: React.FC<Props> = ({ showToast }) => {
  const { user, userProfile } = useAuth();
  const [overtimes, setOvertimes] = useState<EmployeeOvertime[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingOvertime, setEditingOvertime] = useState<EmployeeOvertime | null>(null);

  useEffect(() => {
    if (user && userProfile?.companyId) loadData();
  }, [user, userProfile?.companyId]);

  const loadData = async () => {
    if (!user || !userProfile?.companyId) return;
    setIsLoading(true);
    try {
      const [oData, eData] = await Promise.all([
        getEmployeeOvertimes(userProfile?.companyId),
        getEmployees(userProfile?.companyId)
      ]);
      setOvertimes(oData);
      setEmployees(eData);
    } catch (err) {
      console.error(err);
      showToast('Failed to load overtimes', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveOvertime = async (data: Omit<EmployeeOvertime, 'id' | 'companyId' | 'createdAt' | 'updatedAt'>) => {
    if (!user || !userProfile?.companyId) return;
    try {
      if (editingOvertime) {
        await updateEmployeeOvertime(editingOvertime.id, data);
        showToast('Overtime updated', 'success');
      } else {
        await addEmployeeOvertime({ ...data, companyId: userProfile?.companyId });
        showToast('Overtime added successfully', 'success');
      }
      loadData();
    } catch (err) {
      console.error(err);
      showToast('Error saving overtime', 'error');
    }
  };

  const filteredOvertimes = overtimes.filter(o => 
    o.employeeName.toLowerCase().includes(searchQuery.toLowerCase()) || 
    o.overtimeType.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="w-full mx-auto space-y-6 pb-20">
      
      {/* Header */}
      <div className="bg-slate-900 p-4 rounded-md border border-slate-800 shadow-md flex flex-wrap items-center justify-between gap-4 text-white">
        <div className="flex flex-wrap items-center gap-2.5">
          <Clock className="w-5 h-5 text-slate-400" />
          <h2 className="text-lg font-bold text-white">Employee Overtime Management</h2>
        </div>
        <button 
          onClick={() => { setEditingOvertime(null); setIsFormOpen(true); }} 
          className="flex items-center gap-2 px-4 py-2 bg-[#20B2AA] text-white rounded font-bold shadow hover:bg-[#1A9C96] transition-colors"
        >
          <Plus className="w-4 h-4" /> ADD OVERTIME
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
                  <th className="px-4 py-3">Overtime Type</th>
                  <th className="px-4 py-3">Payroll Month</th>
                  <th className="px-4 py-3">Year</th>
                  <th className="px-4 py-3 text-right">Overtime Hour</th>
                  <th className="px-4 py-3 text-right">Overtime Rate</th>
                  <th className="px-4 py-3 text-right">Overtime Amount</th>
                  <th className="px-4 py-3">Overtime Date</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/50">
                {filteredOvertimes.map((o, idx) => (
                  <tr key={o.id} className="hover:bg-slate-800/30 transition-colors">
                    <td className="px-4 py-3">{idx + 1}</td>
                    <td className="px-4 py-3">{employees.find(e => e.id === o.employeeId)?.id?.substring(0,6) || o.employeeId.substring(0,6)}</td>
                    <td className="px-4 py-3">{o.employeeName}</td>
                    <td className="px-4 py-3">
                      <div className="whitespace-normal max-w-[100px] leading-tight text-slate-400">
                        {o.overtimeType}
                      </div>
                    </td>
                    <td className="px-4 py-3">{o.payrollMonth}</td>
                    <td className="px-4 py-3">{o.payrollYear}</td>
                    <td className="px-4 py-3 text-right">{o.overtimeHour.toFixed(2)}</td>
                    <td className="px-4 py-3 text-right">{o.overtimeRate.toFixed(2)}</td>
                    <td className="px-4 py-3 text-right">{o.overtimeAmount.toFixed(2)}</td>
                    <td className="px-4 py-3">
                      <div className="whitespace-normal max-w-[80px] leading-tight">
                        {new Date(o.overtimeDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 text-xs font-bold rounded ${o.status === 'Approved' ? 'bg-[#00BFFF] text-white' : o.status === 'Pending' ? 'bg-[#FFB90F] text-white' : 'bg-rose-500 text-white'}`}>
                        {o.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <button 
                        onClick={() => { setEditingOvertime(o); setIsFormOpen(true); }} 
                        className="p-1.5 bg-[#FFB90F] text-white hover:bg-[#E5A70D] rounded transition-colors inline-flex"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
                {filteredOvertimes.length === 0 && (
                  <tr>
                    <td colSpan={12} className="px-4 py-8 text-center text-slate-500 dark:text-slate-400">
                      No overtime records found matching your criteria.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        <div className="p-4 border-t border-slate-800 flex items-center justify-between text-sm text-slate-400">
          <span>Showing 1 to {filteredOvertimes.length} of {filteredOvertimes.length} entries</span>
          <div className="flex items-center gap-1">
            <button className="p-1.5 border border-slate-700 rounded text-slate-500 dark:text-slate-400 hover:bg-slate-800 disabled:opacity-50" disabled><ChevronLeft className="w-4 h-4" /></button>
            <button className="px-3 py-1.5 bg-[#20B2AA] text-white rounded font-bold">1</button>
            <button className="p-1.5 border border-slate-700 rounded text-slate-500 dark:text-slate-400 hover:bg-slate-800 disabled:opacity-50" disabled><ChevronRight className="w-4 h-4" /></button>
          </div>
        </div>

      </div>

      <OvertimeFormModal 
        isOpen={isFormOpen} 
        onClose={() => setIsFormOpen(false)} 
        employees={employees}
        onSave={handleSaveOvertime}
        initialData={editingOvertime}
      />
    </div>
  );
};
