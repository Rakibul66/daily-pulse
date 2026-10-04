import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Partner, PartnerTransaction } from '@/types/partnership';
import { getPartners, addPartner, updatePartner, deletePartner, processPartnerTransaction } from '@/lib/partnershipStorage';
import { PartnerFormModal } from '../finance/PartnerFormModal';
import { TransactionModal } from '../finance/TransactionModal';
import { Plus, Briefcase, TrendingUp, Users, ArrowRightLeft, Loader2, Edit, Trash2 } from 'lucide-react';

interface Props {
  showToast: (msg: string, type: 'success'|'error') => void;
}

export const PartnershipPage: React.FC<Props> = ({ showToast }) => {
  const { user } = useAuth();
  const [partners, setPartners] = useState<Partner[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Modals state
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingPartner, setEditingPartner] = useState<Partner | null>(null);
  
  const [isTxOpen, setIsTxOpen] = useState(false);
  const [txPartner, setTxPartner] = useState<Partner | null>(null);

  useEffect(() => {
    if (user) loadData();
  }, [user]);

  const loadData = async () => {
    if (!user) return;
    setIsLoading(true);
    try {
      const data = await getPartners(user.uid);
      setPartners(data);
    } catch (err) {
      console.error(err);
      showToast('Failed to load partnership data', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSavePartner = async (data: any) => {
    if (!user) return;
    try {
      if (editingPartner) {
        await updatePartner(editingPartner.id, data);
        showToast('Partner updated', 'success');
      } else {
        await addPartner({ ...data, userId: user.uid });
        showToast('Partner added', 'success');
      }
      loadData();
    } catch (err) {
      console.error(err);
      showToast('Error saving partner', 'error');
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

  return (
    <div className="w-full mx-auto space-y-6 pb-20">
      
      {/* Header Actions */}
      <div className="bg-slate-900 p-4 sm:p-5 rounded-md border border-slate-800 shadow-md flex flex-wrap items-center justify-between gap-4 text-white">
        <div>
          <div className="flex flex-wrap items-center gap-2.5">
            <span className="w-2.5 h-2.5 rounded-full bg-indigo-500"></span>
            <h2 className="text-lg font-bold text-white">Partnership & Investments</h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">Manage investors, capital pool, and dividend distributions.</p>
        </div>

        <button 
          onClick={() => { setEditingPartner(null); setIsFormOpen(true); }}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-500 transition-colors text-xs font-bold shadow-md shadow-indigo-950"
        >
          <Plus className="w-4 h-4" /> Add Partner
        </button>
      </div>

      {/* Analytics Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-slate-900 rounded-md border border-slate-800 p-5 shadow-md flex flex-col justify-center">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-400"><Briefcase className="w-5 h-5" /></div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Capital Pool</p>
          </div>
          <p className="text-2xl font-black text-white">৳ {totalCapital.toLocaleString()}</p>
        </div>

        <div className="bg-slate-900 rounded-md border border-slate-800 p-5 shadow-md flex flex-col justify-center">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-full bg-indigo-500/10 flex items-center justify-center text-indigo-400"><TrendingUp className="w-5 h-5" /></div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Dividends Paid</p>
          </div>
          <p className="text-2xl font-black text-white">৳ {totalDividends.toLocaleString()}</p>
        </div>

        <div className="bg-slate-900 rounded-md border border-slate-800 p-5 shadow-md flex flex-col justify-center">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-full bg-amber-500/10 flex items-center justify-center text-amber-400"><Users className="w-5 h-5" /></div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Active Partners</p>
          </div>
          <p className="text-2xl font-black text-white">{partners.length}</p>
        </div>
      </div>

      {/* Partners List */}
      <div className="bg-slate-900 border border-slate-800 rounded-md shadow-md overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-800 flex justify-between items-center bg-slate-900/50">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Users className="w-4 h-4 text-indigo-400" /> Stakeholders Directory
          </h3>
        </div>

        {isLoading ? (
          <div className="py-20 flex flex-col items-center gap-3">
            <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
            <p className="text-xs text-slate-500 font-medium">Loading partnership data...</p>
          </div>
        ) : partners.length === 0 ? (
          <div className="p-12 text-center flex flex-col items-center">
            <div className="w-16 h-16 bg-slate-800/50 rounded-full flex items-center justify-center mb-4">
              <Users className="w-8 h-8 text-slate-500" />
            </div>
            <p className="text-slate-400 text-sm font-medium">No partners or investors found.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-300">
              <thead className="text-xs text-slate-400 bg-slate-950/50 uppercase border-b border-slate-800">
                <tr>
                  <th className="px-6 py-4 font-semibold">Partner Details</th>
                  <th className="px-6 py-4 font-semibold">Equity Share</th>
                  <th className="px-6 py-4 font-semibold">Total Invested</th>
                  <th className="px-6 py-4 font-semibold">Dividends Paid</th>
                  <th className="px-6 py-4 font-semibold">Status</th>
                  <th className="px-6 py-4 text-right font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/50">
                {partners.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-800/30 transition-colors group">
                    <td className="px-6 py-4">
                      <p className="font-bold text-white">{p.name}</p>
                      <p className="text-[11px] text-slate-500">{p.role}</p>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-2 bg-slate-800 rounded-full overflow-hidden w-20">
                          <div className="h-full bg-indigo-500 rounded-full" style={{ width: `${p.equityShare}%` }}></div>
                        </div>
                        <span className="text-xs font-bold text-slate-300">{p.equityShare}%</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 font-bold text-emerald-400">
                      ৳ {p.totalInvested.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 font-bold text-indigo-400">
                      ৳ {p.totalDividends.toLocaleString()}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 text-[10px] font-bold uppercase tracking-wider rounded-md border ${p.status === 'Active' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-slate-800 text-slate-400 border-slate-700'}`}>
                        {p.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => { setTxPartner(p); setIsTxOpen(true); }} className="px-2 py-1.5 bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-400 border border-indigo-500/20 rounded text-xs font-bold transition-colors flex items-center gap-1.5">
                          <ArrowRightLeft className="w-3.5 h-3.5" /> Manage Funds
                        </button>
                        <button onClick={() => { setEditingPartner(p); setIsFormOpen(true); }} className="p-1.5 text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 rounded transition-colors"><Edit className="w-4 h-4" /></button>
                        <button onClick={() => handleDeletePartner(p.id)} className="p-1.5 text-slate-400 hover:text-rose-400 bg-slate-800 hover:bg-rose-950 rounded transition-colors"><Trash2 className="w-4 h-4" /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <PartnerFormModal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        initialData={editingPartner}
        onSave={handleSavePartner}
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
