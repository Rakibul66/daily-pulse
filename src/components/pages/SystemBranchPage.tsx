import React, { useState, useEffect } from 'react';
import { Edit, Trash2, Plus, Building2, Loader2, MapPin, Save } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { getBranches, addBranch, updateBranch, deleteBranch } from '@/lib/companyStorage';
import { Branch } from '@/types/company';

import { AdminPageId } from '@/components/layout/Sidebar';

interface Props {
  showToast: (msg: string, type: 'success'|'error') => void;
  onNavigate?: (page: AdminPageId) => void;
}

export const SystemBranchPage: React.FC<Props> = ({ showToast, onNavigate }) => {
  const { userProfile } = useAuth();
  const [branches, setBranches] = useState<Branch[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [formData, setFormData] = useState<Partial<Branch>>({
    name: '',
    contactPerson: '',
    email: '',
    phone: '',
    address: '',
    status: 'Active',
  });

  useEffect(() => {
    if (userProfile?.companyId) {
      loadData(userProfile.companyId);
    }
  }, [userProfile?.companyId]);

  const loadData = async (companyId: string) => {
    setIsLoading(true);
    try {
      const data = await getBranches(companyId);
      setBranches(data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const openForm = (branch?: Branch) => {
    if (branch) {
      setEditingId(branch.id);
      setFormData(branch);
    } else {
      setEditingId(null);
      setFormData({ name: '', contactPerson: '', email: '', phone: '', address: '', status: 'Active' });
    }
    setIsAdding(true);
  };

  const handleSave = async () => {
    if (!userProfile?.companyId || !formData.name) {
      showToast('Branch name is required', 'error');
      return;
    }
    
    setIsSaving(true);
    try {
      if (editingId) {
        await updateBranch(editingId, formData);
        showToast('Branch updated', 'success');
      } else {
        await addBranch(userProfile.companyId, formData as Omit<Branch, 'id'|'companyId'|'createdAt'|'updatedAt'>);
        showToast('Branch added', 'success');
      if (!editingId && localStorage.getItem("dp_onboarding_step") === "branch") {
        localStorage.removeItem("dp_onboarding_step");
        if (onNavigate) {
          onNavigate("dashboard");
        }
      }

      }
      setIsAdding(false);
      loadData(userProfile.companyId);
    } catch (err) {
      console.error(err);
      showToast('Failed to save branch', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this branch?')) return;
    try {
      await deleteBranch(id);
      showToast('Branch deleted', 'success');
      if (userProfile?.companyId) loadData(userProfile.companyId);
    } catch (err) {
      console.error(err);
      showToast('Failed to delete branch', 'error');
    }
  };

  if (isAdding) {
    return (
      <div className="w-full max-w-2xl mx-auto pb-20 p-4 animate-in fade-in">
        <div className="bg-slate-900 border border-slate-800 shadow-xl rounded-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-950">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Building2 className="w-5 h-5 text-primary-400" /> 
              {editingId ? 'Edit Branch' : 'Add New Branch'}
            </h2>
          </div>
          
          <div className="p-6 space-y-5">
            <div className="grid grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-bold text-slate-400 mb-1.5">Branch Name *</label>
                <input type="text" name="name" value={formData.name || ''} onChange={handleChange} className="w-full bg-slate-950 border border-slate-800 text-white rounded px-3 py-2 text-sm focus:border-primary-500" required />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-400 mb-1.5">Contact Person</label>
                <input type="text" name="contactPerson" value={formData.contactPerson || ''} onChange={handleChange} className="w-full bg-slate-950 border border-slate-800 text-white rounded px-3 py-2 text-sm focus:border-primary-500" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-400 mb-1.5">Phone</label>
                <input type="text" name="phone" value={formData.phone || ''} onChange={handleChange} className="w-full bg-slate-950 border border-slate-800 text-white rounded px-3 py-2 text-sm focus:border-primary-500" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-400 mb-1.5">Email</label>
                <input type="email" name="email" value={formData.email || ''} onChange={handleChange} className="w-full bg-slate-950 border border-slate-800 text-white rounded px-3 py-2 text-sm focus:border-primary-500" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-400 mb-1.5">Address</label>
              <input type="text" name="address" value={formData.address || ''} onChange={handleChange} className="w-full bg-slate-950 border border-slate-800 text-white rounded px-3 py-2 text-sm focus:border-primary-500" />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-400 mb-1.5">Status</label>
              <select name="status" value={formData.status || 'Active'} onChange={handleChange} className="w-full bg-slate-950 border border-slate-800 text-white rounded px-3 py-2 text-sm focus:border-primary-500">
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>
          </div>

          <div className="px-6 py-4 border-t border-slate-800 flex justify-end gap-3 bg-slate-950">
            <button onClick={() => setIsAdding(false)} className="px-4 py-2 text-sm font-bold text-slate-300 hover:text-white transition-colors">Cancel</button>
            <button onClick={handleSave} disabled={isSaving} className="flex items-center gap-2 px-6 py-2 bg-primary-600 hover:bg-primary-500 disabled:opacity-50 text-white text-sm font-bold rounded shadow transition-colors">
              {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              {isSaving ? 'Saving...' : 'Save Branch'}
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
        <h2 className="text-lg font-bold text-white uppercase tracking-wider flex items-center gap-2">
          <MapPin className="w-5 h-5 text-primary-400" /> BRANCH SETUP
        </h2>
        
        <button 
          onClick={() => openForm()}
          className="flex items-center gap-1.5 px-4 py-1.5 bg-primary-600 text-white rounded text-sm font-bold shadow hover:bg-primary-500 transition-colors uppercase tracking-wider"
        >
          <Plus className="w-4 h-4" /> ADD BRANCH
        </button>
      </div>

      {/* Main Container */}
      <div className="bg-slate-900 border border-t-0 border-slate-800 rounded-b-lg shadow-sm overflow-hidden min-h-[300px]">
        {isLoading ? (
          <div className="flex justify-center items-center h-40">
            <Loader2 className="w-8 h-8 text-primary-500 animate-spin" />
          </div>
        ) : branches.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-12 text-slate-400">
            <Building2 className="w-12 h-12 mb-4 opacity-50" />
            <p className="font-medium">No branches configured yet.</p>
            <p className="text-xs mt-1">Click Add Branch to create your first location.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-300 whitespace-nowrap">
              <thead className="text-xs text-slate-400 font-bold border-b border-slate-800 bg-slate-950">
                <tr>
                  <th className="px-4 py-3">Branch Name</th>
                  <th className="px-4 py-3">Contact Person</th>
                  <th className="px-4 py-3">Phone</th>
                  <th className="px-4 py-3">Address</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/50">
                {branches.map(branch => (
                  <tr key={branch.id} className="hover:bg-slate-800/30 transition-colors">
                    <td className="px-4 py-3 font-bold text-white">{branch.name}</td>
                    <td className="px-4 py-3">{branch.contactPerson || '-'}</td>
                    <td className="px-4 py-3">{branch.phone || '-'}</td>
                    <td className="px-4 py-3 truncate max-w-[200px]">{branch.address || '-'}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-0.5 rounded text-xs font-bold ${branch.status === 'Active' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-slate-800 text-slate-400 border border-slate-700'}`}>
                        {branch.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right flex items-center justify-end gap-1.5">
                      <button onClick={() => openForm(branch)} className="p-1.5 bg-amber-500/10 text-amber-500 hover:bg-amber-500/20 rounded transition-colors">
                        <Edit className="w-3.5 h-3.5" />
                      </button>
                      <button onClick={() => handleDelete(branch.id)} className="p-1.5 bg-rose-500/10 text-rose-500 hover:bg-rose-500/20 rounded transition-colors">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
