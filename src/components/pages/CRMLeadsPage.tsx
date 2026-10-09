import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Lead } from '@/types/crm';
import { getLeads, addLead, updateLead, deleteLead } from '@/lib/crmStorage';
import { addCustomer } from '@/lib/customerStorage';
import { LeadTable } from '../crm/LeadTable';
import { LeadFormModal } from '../crm/LeadFormModal';
import { LeadImportModal } from '../crm/LeadImportModal';
import { ConvertLeadModal } from '../crm/ConvertLeadModal';
import { DeleteConfirmModal } from '../ui/DeleteConfirmModal';
import { Plus, UploadCloud, Download } from 'lucide-react';

interface Props {
  showToast: (msg: string, type: 'success' | 'error') => void;
}

export function exportLeadsToCSV(leads: Lead[]) {
  const headers = [
    'Date Added',
    'Business Name',
    'WhatsApp',
    'Phone',
    'Owner Name',
    'Business Type',
    'Business Sub-Type',
    'Location Area',
    'Lead Source',
    'Lead Status',
    'Lead Priority',
    'Current POS',
    'Deal Value',
    'Notes'
  ];

  const escapeCSV = (str: string | number | undefined | null) => {
    if (str === undefined || str === null) return '""';
    const s = String(str).replace(/"/g, '""');
    return `"${s}"`;
  };

  const rows = leads.map(l => [
    escapeCSV(l.dateAdded ? l.dateAdded.split('T')[0] : ''),
    escapeCSV(l.businessName || (l as any).restaurantName || ''),
    escapeCSV(l.whatsapp || ''),
    escapeCSV(l.phone || ''),
    escapeCSV(l.ownerName || ''),
    escapeCSV(l.businessType || ''),
    escapeCSV(l.businessSubType || ''),
    escapeCSV(l.locationArea || ''),
    escapeCSV(l.leadSource || ''),
    escapeCSV(l.leadStatus || ''),
    escapeCSV(l.leadPriority || ''),
    escapeCSV(l.currentPos || ''),
    escapeCSV(l.dealValue || 0),
    escapeCSV(l.notes || l.nextAction || '')
  ]);

  const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
  const blob = new Blob(["\uFEFF" + csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  const dateStr = new Date().toISOString().split('T')[0];
  link.setAttribute('download', `all_leads_export_${dateStr}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export const CRMLeadsPage: React.FC<Props> = ({ showToast }) => {
  const { user, userProfile } = useAuth();
  const [leads, setLeads] = useState<Lead[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [editingLead, setEditingLead] = useState<Lead | null>(null);
  const [convertingLead, setConvertingLead] = useState<Lead | null>(null);
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

  const handleConfirmConvert = async (lead: Lead) => {
    if (!user) return;
    try {
      const customerId = await addCustomer({
        userId: user.uid,
        companyId: userProfile?.companyId || user.uid,
        businessName: lead.businessName,
        ownerName: lead.ownerName || '',
        phone: lead.whatsapp || lead.phone || '',
        email: '',
        address: lead.locationArea || '',
        businessType: lead.businessType || 'Other',
        customerSince: new Date().toISOString().split('T')[0],
        source: 'Converted Lead',
        leadId: lead.id,
        totalSpent: 0,
        loyaltyPoints: 0,
        loyaltyTier: 'Member'
      });
      await updateLead(lead.id, { 
        leadStatus: 'CONVERTED', 
        salesStatus: 'Won',
        isConverted: true,
        convertedCustomerId: customerId
      });
      await loadData(user.uid, userProfile?.companyId);
      showToast(`"${lead.businessName}" converted to Customer! Check in Customers directory.`, 'success');
    } catch (err) {
      console.error(err);
      showToast('Failed to convert to customer.', 'error');
      throw err;
    }
  };

  const handleExport = () => {
    if (leads.length === 0) {
      showToast('No leads available to export.', 'error');
      return;
    }
    exportLeadsToCSV(leads);
    showToast(`Exported all ${leads.length} leads to CSV`, 'success');
  };

  const handleBulkImport = async (importedLeads: Omit<Lead, 'id' | 'userId' | 'createdAt' | 'updatedAt'>[]) => {
    if (!user) return;
    const companyId = userProfile?.companyId || user.uid;
    try {
      for (const item of importedLeads) {
        await addLead({
          ...item,
          userId: user.uid,
          companyId,
        } as any);
      }
      showToast(`Successfully imported ${importedLeads.length} leads!`, 'success');
      await loadData(user.uid, userProfile?.companyId);
    } catch (err) {
      console.error(err);
      showToast('Failed to complete bulk import', 'error');
      throw err;
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
      {/* Top Banner Card */}
      <div className="bg-white p-4 sm:p-5 border-2 sm:border-4 border-black shadow-[6px_6px_0px_#000] flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-2.5">
            <span className="w-3 h-3 bg-emerald-500 border border-black inline-block"></span>
            <h2 className="text-lg font-black uppercase text-black tracking-wider">All Leads</h2>
            <span className="px-2 py-0.5 bg-amber-100 border border-black text-black text-xs font-black">
              {leads.length} LEADS
            </span>
          </div>
          <p className="text-xs font-bold text-slate-600 uppercase mt-1">
            Manage and update all your sales leads.
          </p>
        </div>

        {/* Action Buttons: Bulk Import & Export (left of New Lead) + New Lead */}
        <div className="flex items-center flex-wrap gap-2.5">
          {/* Bulk Import */}
          <button
            type="button"
            onClick={() => setIsImportModalOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-2.5 bg-white hover:bg-amber-100 text-black border-2 border-black text-xs font-black uppercase shadow-[2px_2px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 transition-all cursor-pointer"
            title="Import Leads from CSV"
          >
            <UploadCloud className="w-4 h-4 stroke-[2.5]" />
            <span>Bulk Import</span>
          </button>

          {/* Export */}
          <button
            type="button"
            onClick={handleExport}
            className="flex items-center gap-1.5 px-3.5 py-2.5 bg-white hover:bg-slate-100 text-black border-2 border-black text-xs font-black uppercase shadow-[2px_2px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 transition-all cursor-pointer"
            title="Export All Leads to CSV"
          >
            <Download className="w-4 h-4 stroke-[2.5]" />
            <span>Export</span>
          </button>

          {/* New Lead */}
          <button
            type="button"
            onClick={openNewModal}
            className="flex items-center gap-2 px-4 py-2.5 bg-emerald-400 hover:bg-emerald-300 text-black border-2 border-black text-xs font-black uppercase shadow-[2px_2px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>New Lead</span>
          </button>
        </div>
      </div>

      {isLoading ? (
        <div className="py-20 flex flex-col items-center justify-center gap-3 bg-white border-2 sm:border-4 border-black shadow-[6px_6px_0px_#000]">
          <div className="w-9 h-9 border-4 border-black border-t-amber-400 animate-spin"></div>
          <p className="text-xs text-black font-black uppercase tracking-wider">Loading leads data...</p>
        </div>
      ) : (
        <div className="animate-in fade-in duration-300">
          <LeadTable 
            leads={leads} 
            onEdit={openEditModal} 
            onDelete={(lead) => setDeletingLead(lead)} 
            onConvert={(lead) => setConvertingLead(lead)} 
          />
        </div>
      )}

      {/* Add / Edit Lead Modal */}
      <LeadFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveLead}
        initialData={editingLead}
      />

      {/* Bulk Import Modal */}
      <LeadImportModal
        isOpen={isImportModalOpen}
        onClose={() => setIsImportModalOpen(false)}
        onImport={handleBulkImport}
      />

      {/* Convert Lead to Customer Dialog */}
      <ConvertLeadModal
        isOpen={!!convertingLead}
        lead={convertingLead}
        onClose={() => setConvertingLead(null)}
        onConfirm={handleConfirmConvert}
      />

      {/* Delete Confirmation Dialog */}
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
