import React, { useState, useEffect } from 'react';
import { PartnerTransaction, TransactionType } from '@/types/partnership';
import { getGlobalTransactions, getPartners } from '@/lib/partnershipStorage';
import { useAuth } from '@/context/AuthContext';
import { ArrowDownCircle, ArrowUpCircle, Gift, Loader2 } from 'lucide-react';

interface Props {
  type: TransactionType;
}

export const GlobalTxHistory: React.FC<Props> = ({ type }) => {
  const { userProfile } = useAuth();
  const [transactions, setTransactions] = useState<PartnerTransaction[]>([]);
  const [partnersMap, setPartnersMap] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (userProfile?.companyId) {
      loadData();
    }
  }, [userProfile?.companyId, type]);

  const loadData = async () => {
    if (!userProfile?.companyId) return;
    setIsLoading(true);
    try {
      const [txData, partnersData] = await Promise.all([
        getGlobalTransactions(userProfile.companyId, type),
        getPartners(userProfile.companyId)
      ]);
      
      const pMap: Record<string, string> = {};
      partnersData.forEach(p => pMap[p.id] = p.name);
      
      setPartnersMap(pMap);
      setTransactions(txData);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const getTitle = () => {
    if (type === 'WITHDRAWAL') return 'Capital Withdrawals History';
    if (type === 'DIVIDEND') return 'Dividends & Profits History';
    return 'Transaction History';
  };

  if (isLoading) {
    return (
      <div className="bg-slate-900 border border-slate-800 rounded-md shadow-md p-10 flex flex-col items-center gap-3">
        <Loader2 className="w-8 h-8 text-primary-500 animate-spin" />
        <p className="text-xs text-slate-500 font-medium">Loading history...</p>
      </div>
    );
  }

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-md shadow-md overflow-hidden">
      <div className="px-6 py-4 border-b border-slate-800 flex justify-between items-center bg-slate-900/50">
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          {type === 'WITHDRAWAL' && <ArrowUpCircle className="w-4 h-4 text-rose-400" />}
          {type === 'DIVIDEND' && <Gift className="w-4 h-4 text-primary-400" />}
          {getTitle()}
        </h3>
      </div>

      {transactions.length === 0 ? (
        <div className="py-20 flex flex-col items-center text-center">
          <p className="text-sm font-semibold text-white">No records found</p>
          <p className="text-xs text-slate-400 mt-1">There are no {type.toLowerCase()}s recorded yet.</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-slate-800/50 text-xs text-slate-400">
              <tr>
                <th className="px-6 py-4 font-semibold">Date</th>
                <th className="px-6 py-4 font-semibold">Partner</th>
                <th className="px-6 py-4 font-semibold">Transaction ID</th>
                <th className="px-6 py-4 font-semibold">Amount</th>
                <th className="px-6 py-4 font-semibold">Reference</th>
                <th className="px-6 py-4 font-semibold">Notes</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50">
              {transactions.map((tx) => (
                <tr key={tx.id} className="hover:bg-slate-800/30 transition-colors">
                  <td className="px-6 py-4 font-semibold text-white">{new Date(tx.date).toLocaleDateString()}</td>
                  <td className="px-6 py-4 font-bold text-primary-300">{partnersMap[tx.partnerId] || 'Unknown Partner'}</td>
                  <td className="px-6 py-4 text-xs font-mono text-slate-500">{tx.id.substring(0, 8)}...</td>
                  <td className={`px-6 py-4 font-bold ${type === 'WITHDRAWAL' ? 'text-rose-400' : 'text-primary-400'}`}>
                    {type === 'WITHDRAWAL' ? '-' : '+'}৳ {tx.amount.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 text-slate-300">{tx.reference || '-'}</td>
                  <td className="px-6 py-4 text-slate-300">{tx.notes || '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
