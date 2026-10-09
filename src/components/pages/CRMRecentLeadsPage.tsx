import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Lead } from '@/types/crm';
import { getLeads, addLead, updateLead, deleteLead } from '@/lib/crmStorage';
import { LeadTable } from '../crm/LeadTable';
import { LeadFormModal } from '../crm/LeadFormModal';
import { DeleteConfirmModal } from '../ui/DeleteConfirmModal';
import { Plus } from 'lucide-react';

interface Props {
  showToast: (msg: string, type: 'success' | 'error') => void;
}

export const CRMRecentLeadsPage: React.FC<Props> = ({ showToast }) => {
  const { user, userProfile } = useAuth();
  const [leads, setLeads] = useState<Lead[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingLead, setEditingLead] = useState<Lead | null>(null);
  const [deletingLead, setDeletingLead] = useState<Lead | null>(null);

  useEffect(() => {
    if (user) {
      loadData(user.uid, userProfile?.companyId);
    }
  }, [user, userProfile]);

  const loadData = async (uid: string, companyId?: string) => {
    setIsLoading(true);
    try {
      const data = await getLeads(uid, companyId);
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
        await addLead({ ...leadData, userId: user.uid, companyId: userProfile?.companyId || user.uid } as any);
        showToast('Lead added successfully', 'success');
      }
      await loadData(user.uid, userProfile?.companyId);
    } catch (err) {
      console.error(err);
      showToast('Failed to save lead', 'error');
      throw err;
    }
  };

  const handleConfirmDelete = async () => {
    if (!user || !deletingLead) return;
    try {
      await deleteLead(deletingLead.id);
      showToast('Lead deleted successfully', 'success');
      setDeletingLead(null);
      await loadData(user.uid, userProfile?.companyId);
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

  // Only show the 5 most recent leads
  const recentLeads = leads.slice(0, 5);

  return (
    <div className="w-full mx-auto space-y-6">
      <div className="bg-white p-4 sm:p-5 border-2 sm:border-4 border-black shadow-[6px_6px_0px_#000] flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-2.5">
            <span className="w-3 h-3 bg-emerald-500 border border-black inline-block"></span>
            <h2 className="text-lg font-black uppercase text-black tracking-wider">Recent Leads</h2>
            <span className="px-2 py-0.5 bg-amber-100 border border-black text-black text-xs font-black">
              LATEST 5
            </span>
          </div>
          <p className="text-xs font-bold text-slate-600 uppercase mt-1">Your 5 most recently added sales leads.</p>
        </div>
        <button
          onClick={openNewModal}
          className="flex items-center gap-2 px-4 py-2.5 bg-emerald-400 hover:bg-emerald-300 text-black border-2 border-black text-xs font-black uppercase shadow-[2px_2px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          New Lead
        </button>
      </div>

      {isLoading ? (
        <div className="py-20 flex flex-col items-center justify-center gap-3 bg-white border-2 sm:border-4 border-black shadow-[6px_6px_0px_#000]">
          <div className="w-9 h-9 border-4 border-black border-t-amber-400 animate-spin"></div>
          <p className="text-xs text-black font-black uppercase tracking-wider">Loading leads data...</p>
        </div>
      ) : (
        <div className="animate-in fade-in duration-300">
          <LeadTable 
            leads={recentLeads} 
            onEdit={openEditModal} 
            onDelete={(lead) => setDeletingLead(lead)} 
          />
        </div>
      )}

      <LeadFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveLead}
        initialData={editingLead}
      />

      <DeleteConfirmModal
        isOpen={!!deletingLead}
        title="Delete Sales Lead"
        itemName={deletingLead?.businessName || (deletingLead as any)?.restaurantName || 'this lead'}
        onCancel={() => setDeletingLead(null)}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
};
