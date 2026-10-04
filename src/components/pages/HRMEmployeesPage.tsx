import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Employee } from '@/types/hrm';
import { getEmployees, addEmployee, updateEmployee, deleteEmployee } from '@/lib/hrmStorage';
import { Plus, Edit2, Trash2, Users } from 'lucide-react';

interface Props {
  showToast: (msg: string, type: 'success'|'error') => void;
}

export const HRMEmployeesPage: React.FC<Props> = ({ showToast }) => {
  const { user } = useAuth();
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    department: '',
    baseSalary: 0,
    isActive: true,
  });

  useEffect(() => {
    if (user) {
      loadData(user.uid);
    }
  }, [user]);

  const loadData = async (uid: string) => {
    setIsLoading(true);
    try {
      const data = await getEmployees(uid);
      setEmployees(data);
    } catch (err) {
      console.error(err);
      showToast('Failed to load employees', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const openNewModal = () => {
    setEditingEmployee(null);
    setFormData({ name: '', department: '', baseSalary: 0, isActive: true });
    setIsModalOpen(true);
  };

  const openEditModal = (emp: Employee) => {
    setEditingEmployee(emp);
    setFormData({
      name: emp.name,
      department: emp.department,
      baseSalary: emp.baseSalary,
      isActive: emp.isActive,
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    
    try {
      if (editingEmployee) {
        await updateEmployee(editingEmployee.id, formData);
        showToast('Employee updated', 'success');
      } else {
        await addEmployee({
          userId: user.uid,
          name: formData.name,
          department: formData.department,
          baseSalary: formData.baseSalary,
          joinedDate: new Date().toISOString().split('T')[0],
          isActive: formData.isActive,
        });
        showToast('Employee added', 'success');
      }
      setIsModalOpen(false);
      loadData(user.uid);
    } catch (err) {
      console.error(err);
      showToast('Error saving employee', 'error');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this employee?')) return;
    try {
      await deleteEmployee(id);
      showToast('Employee deleted', 'success');
      loadData(user!.uid);
    } catch (err) {
      console.error(err);
      showToast('Error deleting employee', 'error');
    }
  };

  return (
    <div className="w-full mx-auto space-y-6">
      <div className="bg-slate-900 p-4 sm:p-5 rounded-md border border-slate-800 shadow-md flex flex-wrap items-center justify-between gap-4 text-white">
        <div>
          <div className="flex flex-wrap items-center gap-2.5">
            <span className="w-2.5 h-2.5 rounded-full bg-indigo-500"></span>
            <h2 className="text-lg font-bold text-white">Employees</h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">Manage your team members and their basic details.</p>
        </div>
        <button
          onClick={openNewModal}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-500 transition-colors text-xs font-bold shadow-md shadow-indigo-950"
        >
          <Plus className="w-3.5 h-3.5" />
          Add Employee
        </button>
      </div>

      {isLoading ? (
        <div className="py-20 flex flex-col items-center gap-3">
          <div className="w-8 h-8 rounded-full border-4 border-indigo-900 border-t-indigo-500 animate-spin"></div>
        </div>
      ) : (
        <div className="bg-slate-900 rounded-md border border-slate-800 shadow-md overflow-hidden">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-slate-400 uppercase bg-slate-950/80 border-b border-slate-800">
              <tr>
                <th className="px-5 py-4 font-bold tracking-wider">Name</th>
                <th className="px-5 py-4 font-bold tracking-wider">Department</th>
                <th className="px-5 py-4 font-bold tracking-wider">Base Salary</th>
                <th className="px-5 py-4 font-bold tracking-wider">Joined</th>
                <th className="px-5 py-4 font-bold tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {employees.map(emp => (
                <tr key={emp.id} className={`hover:bg-slate-800/50 transition-colors ${!emp.isActive ? 'opacity-50' : ''}`}>
                  <td className="px-5 py-4 text-white font-bold">{emp.name} {!emp.isActive && '(Inactive)'}</td>
                  <td className="px-5 py-4 text-slate-300">{emp.department}</td>
                  <td className="px-5 py-4 text-emerald-400 font-bold">{emp.baseSalary.toLocaleString()}</td>
                  <td className="px-5 py-4 text-slate-400">{emp.joinedDate}</td>
                  <td className="px-5 py-4 text-right">
                    <button onClick={() => openEditModal(emp)} className="p-1.5 text-slate-400 hover:text-white mr-2"><Edit2 className="w-4 h-4" /></button>
                    <button onClick={() => handleDelete(emp.id)} className="p-1.5 text-slate-400 hover:text-rose-400"><Trash2 className="w-4 h-4" /></button>
                  </td>
                </tr>
              ))}
              {employees.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-5 py-10 text-center text-slate-500">No employees found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-md p-6 w-full max-w-md shadow-md">
            <h2 className="text-lg font-bold text-white mb-4">{editingEmployee ? 'Edit' : 'Add'} Employee</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1.5">Name</label>
                <input required type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full bg-slate-950 border border-slate-700 rounded-md px-3 py-2 text-white text-sm" />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1.5">Department</label>
                <input required type="text" value={formData.department} onChange={e => setFormData({...formData, department: e.target.value})} className="w-full bg-slate-950 border border-slate-700 rounded-md px-3 py-2 text-white text-sm" />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1.5">Base Salary (৳)</label>
                <input required type="number" value={formData.baseSalary} onChange={e => setFormData({...formData, baseSalary: Number(e.target.value)})} className="w-full bg-slate-950 border border-slate-700 rounded-md px-3 py-2 text-white text-sm" />
              </div>
              <div className="flex items-center gap-2 pt-2">
                <input type="checkbox" checked={formData.isActive} onChange={e => setFormData({...formData, isActive: e.target.checked})} className="rounded bg-slate-950 border-slate-700" />
                <label className="text-sm text-white">Active Employee</label>
              </div>
              
              <div className="flex justify-end gap-3 pt-4">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-sm text-slate-300 bg-slate-800 rounded-md hover:bg-slate-700">Cancel</button>
                <button type="submit" className="px-4 py-2 text-sm text-white bg-indigo-600 rounded-md hover:bg-indigo-500">Save</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
