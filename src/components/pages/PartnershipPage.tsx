import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Partner, PartnerTransaction } from '@/types/partnership';
import { getPartners, addPartner, updatePartner, deletePartner, processPartnerTransaction } from '@/lib/partnershipStorage';
import { PartnerFormModal } from '../finance/PartnerFormModal';
import { TransactionModal } from '../finance/TransactionModal';
import { TxHistoryModal } from '../finance/TxHistoryModal';
import { GlobalTxHistory } from '../finance/GlobalTxHistory';
import { DashboardSummary } from '../finance/DashboardSummary';
import { Plus, Briefcase, TrendingUp, Users, ArrowRightLeft, Loader2, Edit, Trash2, History } from 'lucide-react';

interface Props {
  showToast: (msg: string, type: 'success'|'error') => void;
  view?: 'summary' | 'investors' | 'withdrawals' | 'dividends';
}

export const PartnershipPage: React.FC<Props> = ({ showToast, view = 'summary' }) => {
  const { user, userProfile } = useAuth();
  const effectiveCompanyId = userProfile?.companyId || user?.uid;
  const [partners, setPartners] = useState<Partner[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Modals state
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingPartner, setEditingPartner] = useState<Partner | null>(null);
  
  const [isTxOpen, setIsTxOpen] = useState(false);
  const [txPartner, setTxPartner] = useState<Partner | null>(null);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [historyPartner, setHistoryPartner] = useState<Partner | null>(null);

  useEffect(() => {
    if (effectiveCompanyId) loadData();
  }, [effectiveCompanyId]);

  const loadData = async () => {
    if (!effectiveCompanyId) return;
    setIsLoading(true);
    try {
      const data = await getPartners(effectiveCompanyId);
      setPartners(data);
    } catch (err) {
      console.error(err);
      showToast('Failed to load partnership data', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSavePartner = async (data: any) => {
    if (!effectiveCompanyId) return;
    try {
      if (editingPartner) {
        await updatePartner(editingPartner.id, data);
        showToast('Partner updated successfully', 'success');
      } else {
        await addPartner({ ...data, companyId: effectiveCompanyId });
        showToast('Partner added successfully', 'success');
      }
      loadData();
    } catch (err) {
      console.error(err);
      showToast('Failed to save partner', 'error');
    }
  };

  const handleDeletePartner = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this partner? Their financial history will be preserved but they will be removed from the list.")) return;
    try {
      await deletePartner(id);
      showToast('Partner deleted', 'success');
      loadData();
    } catch (err) {
      console.error(err);
      showToast('Error deleting partner', 'error');
    }
  };

  const handleProcessTx = async (tx: Omit<PartnerTransaction, 'id' | 'createdAt'>) => {
    try {
      await processPartnerTransaction(tx);
      showToast('Transaction processed successfully', 'success');
      loadData();
    } catch (err: any) {
      console.error(err);
      throw err;
    }
  };

  const totalCapital = partners.reduce((sum, p) => sum + p.totalInvested, 0);
  const totalDividends = partners.reduce((sum, p) => sum + p.totalDividends, 0);
  const totalEquity = partners.reduce((sum, p) => sum + p.equityShare, 0);

  return (
    <div className="w-full mx-auto space-y-6 pb-20">
      
      {/* Header Actions */}
      <div className="bg-white border-4 border-black p-5 shadow-[6px_6px_0px_#000] flex flex-wrap items-center justify-between gap-4 text-black">
        <div>
          <div className="flex flex-wrap items-center gap-2.5">
            <span className="w-3 h-3 bg-amber-400 border border-black inline-block"></span>
            <h2 className="text-xl font-display font-black text-black uppercase tracking-tight">PARTNERSHIP & CAPITAL POOL</h2>
          </div>
          <p className="text-xs font-bold text-slate-600 uppercase tracking-wider mt-1">Manage investors, capital fund, and dividend distributions.</p>
        </div>

        <button 
          onClick={() => { setEditingPartner(null); setIsFormOpen(true); }}
          className="flex items-center gap-2 px-5 py-2.5 bg-black text-white hover:bg-slate-800 border-2 border-black shadow-[3px_3px_0px_#000] text-xs font-black uppercase tracking-wider transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4 text-amber-300" /> + ADD PARTNER
        </button>
      </div>

      {/* Analytics Dashboard */}
      {view === "summary" && (
        <DashboardSummary 
          totalCapital={totalCapital}
          totalDividends={totalDividends}
          activePartnersCount={partners.length}
        />
      )}

      {/* Conditional Table Views */}
      {view === "investors" && (
      <div className="bg-white border-4 border-black shadow-[8px_8px_0px_#000] overflow-hidden">
        <div className="px-6 py-4 border-b-2 border-black flex justify-between items-center bg-slate-50">
          <h3 className="text-xs font-black text-black uppercase tracking-wider flex items-center gap-2">
            <Users className="w-4 h-4 text-indigo-600" /> STAKEHOLDERS DIRECTORY
          </h3>
        </div>

        {isLoading ? (
          <div className="py-20 flex flex-col items-center gap-3">
            <Loader2 className="w-8 h-8 text-black animate-spin" />
            <p className="text-xs text-slate-600 font-bold uppercase">Loading partnership data...</p>
          </div>
        ) : partners.length === 0 ? (
          <div className="p-12 text-center flex flex-col items-center">
            <div className="w-16 h-16 bg-amber-100 border-2 border-black flex items-center justify-center mb-4 shadow-[2px_2px_0px_#000]">
              <Users className="w-8 h-8 text-black" />
            </div>
            <p className="text-black text-xs font-black uppercase">No partners or investors found.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-black">
              <thead className="text-xs text-white bg-black uppercase border-b-2 border-black font-black">
                <tr>
                  <th className="px-6 py-3.5">Partner Details</th>
                  <th className="px-6 py-3.5">Equity Share</th>
                  <th className="px-6 py-3.5">Total Invested</th>
                  <th className="px-6 py-3.5">Dividends Paid</th>
                  <th className="px-6 py-3.5">Status</th>
                  <th className="px-6 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y-2 divide-black/10 bg-white">
                {partners.map((p) => (
                  <tr key={p.id} className="hover:bg-amber-50/50 transition-colors font-bold group">
                    <td className="px-6 py-4">
                      <p className="font-black text-black">{p.name}</p>
                      <p className="text-[11px] text-slate-500 uppercase">{p.role}</p>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-3 bg-slate-100 border border-black overflow-hidden w-20">
                          <div className="h-full bg-indigo-600" style={{ width: `${p.equityShare}%` }}></div>
                        </div>
                        <span className="text-xs font-black text-black">{p.equityShare}%</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 font-black text-emerald-800">
                      ৳ {p.totalInvested.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 font-black text-indigo-700">
                      ৳ {p.totalDividends.toLocaleString()}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-0.5 text-[10px] font-black uppercase tracking-wider border border-black ${p.status === 'Active' ? 'bg-emerald-200 text-emerald-950' : 'bg-slate-200 text-black'}`}>
                        {p.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <button onClick={() => { setTxPartner(p); setIsTxOpen(true); }} className="px-2.5 py-1 bg-white hover:bg-slate-100 text-black border border-black text-xs font-black uppercase flex items-center gap-1 shadow-[1px_1px_0px_#000]">
                          <ArrowRightLeft className="w-3.5 h-3.5" /> Funds
                        </button>
                        <button onClick={() => { setHistoryPartner(p); setIsHistoryOpen(true); }} className="px-2.5 py-1 bg-white hover:bg-slate-100 text-black border border-black text-xs font-black uppercase flex items-center gap-1 shadow-[1px_1px_0px_#000]"><History className="w-3.5 h-3.5" /> History</button>
                        <button onClick={() => { setEditingPartner(p); setIsFormOpen(true); }} className="p-1.5 text-black hover:bg-slate-100 border border-black"><Edit className="w-3.5 h-3.5" /></button>
                        <button onClick={() => handleDeletePartner(p.id)} className="p-1.5 text-rose-600 hover:bg-rose-100 border border-black"><Trash2 className="w-3.5 h-3.5" /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      )}

      {view === "withdrawals" && <GlobalTxHistory type="WITHDRAWAL" />}
      {view === "dividends" && <GlobalTxHistory type="DIVIDEND" />}


      <PartnerFormModal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        initialData={editingPartner}
        onSave={handleSavePartner}
        currentTotalEquity={totalEquity}
      />

      <TxHistoryModal
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        partner={historyPartner}
      />

      <TransactionModal
        isOpen={isTxOpen}
        onClose={() => setIsTxOpen(false)}
        partner={txPartner}
        onProcess={handleProcessTx}
      />
    </div>
  );
};
