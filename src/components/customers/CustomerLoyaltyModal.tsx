import React, { useState, useEffect } from 'react';
import { Customer, LoyaltyTransaction } from '@/types/customer';
import { getLoyaltyTransactions, processLoyaltyTransaction } from '@/lib/customerStorage';
import { useAuth } from '@/context/AuthContext';
import { X, Award, Star, History, ArrowDown, ArrowUp } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  customer: Customer | null;
  onUpdate: () => void; // Trigger refresh
}

export const CustomerLoyaltyModal: React.FC<Props> = ({ isOpen, onClose, customer, onUpdate }) => {
  const { user } = useAuth();
  const [transactions, setTransactions] = useState<LoyaltyTransaction[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [mode, setMode] = useState<'VIEW' | 'EARN' | 'REDEEM'>('VIEW');
  
  const [amount, setAmount] = useState('');
  const [points, setPoints] = useState('');
  const [desc, setDesc] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    if (isOpen && customer && user) {
      loadHistory();
      setMode('VIEW');
      resetForm();
    }
  }, [isOpen, customer, user]);

  const loadHistory = async () => {
    if (!customer || !user) return;
    setIsLoading(true);
    try {
      const hist = await getLoyaltyTransactions(user.uid, customer.id);
      setTransactions(hist);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setAmount('');
    setPoints('');
    setDesc('');
  };

  const handleProcess = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customer || !user) return;
    if (mode === 'VIEW') return;

    setIsProcessing(true);
    try {
      let p = Number(points);
      let a = Number(amount) || 0;

      // Auto calculate points if earn and points not set manually (e.g. 1 point per 100 Taka)
      if (mode === 'EARN' && !p && a) {
        p = Math.floor(a / 100);
      }

      if (!p || p <= 0) throw new Error("Invalid points value");

      if (mode === 'REDEEM' && p > customer.loyaltyPoints) {
        throw new Error("Not enough points to redeem");
      }

      await processLoyaltyTransaction(
        user.uid,
        customer.id,
        mode,
        p,
        a,
        desc || (mode === 'EARN' ? 'Purchase Reward' : 'Points Redeemed')
      );
      
      onUpdate();
      await loadHistory();
      setMode('VIEW');
    } catch (err) {
      console.error(err);
      alert((err as Error).message);
    } finally {
      setIsProcessing(false);
    }
  };

  if (!isOpen || !customer) return null;

  const tierColors = {
    Member: 'bg-slate-700 text-slate-200',
    Silver: 'bg-slate-300 text-slate-800 dark:text-slate-200 shadow-md shadow-slate-200/50',
    Gold: 'bg-amber-400 text-amber-950 shadow-md shadow-amber-400/50',
    Platinum: 'bg-primary-300 text-primary-950 shadow-md shadow-primary-300/50',
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-md shadow-md w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col animate-in zoom-in-95">
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Award className="w-5 h-5 text-amber-400" />
            <h2 className="text-base font-bold text-white">Loyalty & Membership</h2>
          </div>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-white rounded-md transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto flex-1">
          {/* Customer Loyalty Banner */}
          <div className="bg-slate-950 border border-slate-800 p-5 rounded-md mb-6 flex flex-wrap items-center justify-between gap-4">
            <div>
              <h3 className="text-lg font-bold text-white">{customer.businessName}</h3>
              <p className="text-sm text-slate-400">{customer.ownerName} | {customer.phone}</p>
            </div>
            <div className="flex items-center gap-4 text-center">
              <div>
                <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mb-1">Tier</p>
                <span className={`px-3 py-1 rounded-full text-xs font-bold ${tierColors[customer.loyaltyTier]}`}>
                  {customer.loyaltyTier}
                </span>
              </div>
              <div>
                <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mb-1">Points</p>
                <div className="flex items-center gap-1 justify-center text-amber-400 font-bold text-xl">
                  <Star className="w-4 h-4 fill-amber-400" /> {customer.loyaltyPoints}
                </div>
              </div>
            </div>
          </div>

          {/* Action Tabs */}
          <div className="flex gap-2 mb-6 border-b border-slate-800 pb-2">
            <button 
              onClick={() => { setMode('VIEW'); resetForm(); }}
              className={`text-xs font-bold px-4 py-2 rounded-md transition-colors ${mode === 'VIEW' ? 'bg-primary-600 text-white' : 'text-slate-400 hover:bg-slate-800'}`}
            >
              History
            </button>
            <button 
              onClick={() => { setMode('EARN'); resetForm(); }}
              className={`text-xs font-bold px-4 py-2 rounded-md transition-colors ${mode === 'EARN' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:bg-slate-800'}`}
            >
              Add Points (Purchase)
            </button>
            <button 
              onClick={() => { setMode('REDEEM'); resetForm(); }}
              className={`text-xs font-bold px-4 py-2 rounded-md transition-colors ${mode === 'REDEEM' ? 'bg-rose-600 text-white' : 'text-slate-400 hover:bg-slate-800'}`}
            >
              Redeem Points
            </button>
          </div>

          {/* Content based on Mode */}
          {mode === 'VIEW' ? (
            <div>
              <h4 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
                <History className="w-4 h-4" /> Transaction History
              </h4>
              {isLoading ? (
                <p className="text-sm text-slate-400">Loading history...</p>
              ) : transactions.length === 0 ? (
                <p className="text-sm text-slate-500 dark:text-slate-400 py-4 text-center">No transactions found.</p>
              ) : (
                <div className="space-y-2">
                  {transactions.map(tx => (
                    <div key={tx.id} className="flex items-center justify-between p-3 bg-slate-950 border border-slate-800 rounded-md">
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${tx.type === 'EARN' ? 'bg-emerald-950 text-emerald-400' : 'bg-rose-950 text-rose-400'}`}>
                          {tx.type === 'EARN' ? <ArrowUp className="w-4 h-4" /> : <ArrowDown className="w-4 h-4" />}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-white">{tx.description}</p>
                          <p className="text-[10px] text-slate-500 dark:text-slate-400">{new Date(tx.date).toLocaleDateString()}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className={`text-sm font-bold ${tx.type === 'EARN' ? 'text-emerald-400' : 'text-rose-400'}`}>
                          {tx.type === 'EARN' ? '+' : '-'}{tx.points} pts
                        </p>
                        {tx.amount && <p className="text-[10px] text-slate-500 dark:text-slate-400">৳{tx.amount.toLocaleString()}</p>}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <form onSubmit={handleProcess} className="bg-slate-950 border border-slate-800 p-5 rounded-md space-y-4">
              <h4 className="text-sm font-bold text-white mb-4">
                {mode === 'EARN' ? 'Record Purchase & Add Points' : 'Redeem Points for Reward'}
              </h4>
              
              <div className="grid grid-cols-2 gap-4">
                {mode === 'EARN' && (
                  <div>
                    <label className="text-xs font-semibold text-slate-300 block mb-1.5">Purchase Amount (৳)</label>
                    <input type="number" value={amount} onChange={e => setAmount(e.target.value)} required className="w-full text-sm font-bold text-white bg-slate-900 px-3 py-2 rounded-md border border-slate-700" placeholder="e.g. 5000" />
                  </div>
                )}
                {mode === 'REDEEM' && (
                  <div>
                    <label className="text-xs font-semibold text-slate-300 block mb-1.5">Discount/Reward Value (৳)</label>
                    <input type="number" value={amount} onChange={e => setAmount(e.target.value)} className="w-full text-sm font-bold text-white bg-slate-900 px-3 py-2 rounded-md border border-slate-700" placeholder="Optional value" />
                  </div>
                )}
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1.5">Points to {mode === 'EARN' ? 'Add' : 'Deduct'} {mode==='EARN' && '(Auto: 1 per 100৳)'}</label>
                  <input type="number" value={points} onChange={e => setPoints(e.target.value)} required={mode === 'REDEEM'} className="w-full text-sm font-bold text-white bg-slate-900 px-3 py-2 rounded-md border border-slate-700" placeholder={mode === 'EARN' ? 'Auto-calculated' : 'Points'} />
                </div>
              </div>
              
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1.5">Description / Note</label>
                <input type="text" value={desc} onChange={e => setDesc(e.target.value)} required className="w-full text-sm font-bold text-white bg-slate-900 px-3 py-2 rounded-md border border-slate-700" placeholder="e.g. Monthly Bill Payment" />
              </div>

              <div className="pt-2 flex justify-end">
                <button type="submit" disabled={isProcessing} className={`px-5 py-2.5 text-sm font-bold text-white rounded-md shadow-md disabled:opacity-50 transition-colors ${mode === 'EARN' ? 'bg-emerald-600 hover:bg-emerald-500' : 'bg-rose-600 hover:bg-rose-500'}`}>
                  {isProcessing ? 'Processing...' : mode === 'EARN' ? 'Confirm & Add Points' : 'Confirm Redemption'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
