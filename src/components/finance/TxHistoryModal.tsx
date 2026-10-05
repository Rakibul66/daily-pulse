import React, { useState, useEffect } from 'react';
import { Partner, PartnerTransaction } from '@/types/partnership';
import { getPartnerTransactions } from '@/lib/partnershipStorage';
import { X, ArrowDownCircle, ArrowUpCircle, Gift, Loader2 } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  partner: Partner | null;
}

export const TxHistoryModal: React.FC<Props> = ({ isOpen, onClose, partner }) => {
  const { userProfile } = useAuth();
  const [transactions, setTransactions] = useState<PartnerTransaction[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isOpen && partner && userProfile?.companyId) {
      loadHistory();
    }
  }, [isOpen, partner, userProfile?.companyId]);

  const loadHistory = async () => {
    if (!userProfile?.companyId || !partner) return;
    setIsLoading(true);
    try {
      const data = await getPartnerTransactions(userProfile.companyId, partner.id);
      // Sort by date descending
      data.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      setTransactions(data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen || !partner) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-md shadow-md w-full max-w-2xl overflow-hidden flex flex-col animate-in zoom-in-95 duration-200 max-h-[80vh]">
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/50">
          <div className="flex flex-col">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              Transaction History
            </h2>
            <p className="text-xs font-semibold text-primary-400 mt-0.5">{partner.name}</p>
          </div>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-white rounded-md transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-0 overflow-y-auto flex-1">
          {isLoading ? (
            <div className="py-20 flex flex-col items-center gap-3">
              <Loader2 className="w-8 h-8 text-primary-500 animate-spin" />
              <p className="text-xs text-slate-500 font-medium">Loading history...</p>
            </div>
          ) : transactions.length === 0 ? (
            <div className="py-20 flex flex-col items-center text-center">
              <p className="text-sm font-semibold text-white">No transactions found</p>
              <p className="text-xs text-slate-400 mt-1">This partner has no financial history yet.</p>
            </div>
          ) : (
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="bg-slate-800/50 text-xs text-slate-400">
                <tr>
                  <th className="px-6 py-3 font-semibold">Date</th>
                  <th className="px-6 py-3 font-semibold">Type</th>
                  <th className="px-6 py-3 font-semibold">Amount</th>
                  <th className="px-6 py-3 font-semibold">Reference / Notes</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/50">
                {transactions.map((tx) => (
                  <tr key={tx.id} className="hover:bg-slate-800/30">
                    <td className="px-6 py-3 text-slate-300">{new Date(tx.date).toLocaleDateString()}</td>
                    <td className="px-6 py-3">
                      {tx.type === 'INVESTMENT' && <span className="inline-flex items-center gap-1.5 px-2 py-1 bg-emerald-500/10 text-emerald-400 text-[10px] font-bold uppercase rounded"><ArrowDownCircle className="w-3 h-3"/> Add Capital</span>}
                      {tx.type === 'WITHDRAWAL' && <span className="inline-flex items-center gap-1.5 px-2 py-1 bg-rose-500/10 text-rose-400 text-[10px] font-bold uppercase rounded"><ArrowUpCircle className="w-3 h-3"/> Withdraw</span>}
                      {tx.type === 'DIVIDEND' && <span className="inline-flex items-center gap-1.5 px-2 py-1 bg-primary-500/10 text-primary-400 text-[10px] font-bold uppercase rounded"><Gift className="w-3 h-3"/> Dividend</span>}
                    </td>
                    <td className={`px-6 py-3 font-bold ${tx.type === 'WITHDRAWAL' ? 'text-rose-400' : tx.type === 'DIVIDEND' ? 'text-primary-400' : 'text-emerald-400'}`}>
                      {tx.type === 'WITHDRAWAL' ? '-' : '+'}৳ {tx.amount.toLocaleString()}
                    </td>
                    <td className="px-6 py-3">
                      <div className="flex flex-col">
                        <span className="text-slate-300 text-xs">{tx.notes || '-'}</span>
                        {tx.reference && <span className="text-[10px] text-slate-500">Ref: {tx.reference}</span>}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};
