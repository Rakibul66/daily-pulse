import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Lead } from '@/types/crm';
import { getLeads, addLead, updateLead, deleteLead } from '@/lib/crmStorage';
import { LeadTable } from '../crm/LeadTable';
import { LeadFormModal } from '../crm/LeadFormModal';
import { Plus } from 'lucide-react';

interface Props {
  showToast: (msg: string, type: 'success'|'error') => void;
}

export const CRMLeadsPage: React.FC<Props> = ({ showToast }) => {
  const { user } = useAuth();
  const [leads, setLeads] = useState<Lead[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingLead, setEditingLead] = useState<Lead | null>(null);

  useEffect(() => {
    if (user) {
      loadData(user.uid);
    }
  }, [user]);

  const loadData = async (uid: string) => {
    setIsLoading(true);
    try {
      const data = await getLeads(uid);
      setLeads(data);
    } catch (err) {
      console.error(err);
      showToast('Failed to load CRM data', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveLead = async (leadData: Omit<Lead, 'id' | 'userId' | 'createdAt' | 'updatedAt'>) => {
    if (!user) return;
    try {
      if (editingLead) {
        await updateLead(editingLead.id, leadData);
        showToast('Lead updated successfully', 'success');
      } else {
        await addLead({ ...leadData, userId: user.uid });
        showToast('Lead added successfully', 'success');
      }
      await loadData(user.uid);
    } catch (err) {
      console.error(err);
      showToast('Failed to save lead', 'error');
      throw err;
    }
  };

  const handleDeleteLead = async (id: string) => {
    if (!user) return;
    try {
      await deleteLead(id);
      showToast('Lead deleted successfully', 'success');
      await loadData(user.uid);
    } catch (err) {
      console.error(err);
      showToast('Failed to delete lead', 'error');
    }
  };

  const openNewModal = () => {
    setEditingLead(null);
    setIsModalOpen(true);
  };

  const openEditModal = (lead: Lead) => {
    setEditingLead(lead);
    setIsModalOpen(true);
  };

  return (
    <div className="w-full mx-auto space-y-6">
      <div className="bg-slate-900 p-4 sm:p-5 rounded-md border border-slate-800 shadow-md flex flex-wrap items-center justify-between gap-4 text-white">
        <div>
          <div className="flex flex-wrap items-center gap-2.5">
            <span className="w-2.5 h-2.5 rounded-full bg-indigo-500"></span>
            <h2 className="text-lg font-bold text-white">All Leads</h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">Manage and update all your sales leads.</p>
        </div>
        <button
          onClick={openNewModal}
          className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-500 transition-colors text-xs font-bold shadow-md shadow-emerald-950"
        >
          <Plus className="w-3.5 h-3.5" />
          New Lead
        </button>
      </div>

      {isLoading ? (
        <div className="py-20 flex flex-col items-center gap-3">
          <div className="w-8 h-8 rounded-full border-4 border-indigo-900 border-t-indigo-500 animate-spin"></div>
          <p className="text-xs text-slate-500 font-medium">Loading leads data...</p>
        </div>
      ) : (
        <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
          <LeadTable leads={leads} onEdit={openEditModal} onDelete={handleDeleteLead} />
        </div>
      )}

      <LeadFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveLead}
        initialData={editingLead}
      />
    </div>
  );
};
