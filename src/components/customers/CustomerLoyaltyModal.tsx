import React, { useState, useEffect } from 'react';
import { Customer, LoyaltyTransaction } from '@/types/customer';
import { getLoyaltyTransactions, processLoyaltyTransaction } from '@/lib/customerStorage';
import { useAuth } from '@/context/AuthContext';
import { X, Award, Star, History, ArrowDown, ArrowUp, Loader2 } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  customer: Customer | null;
  onUpdate: () => void;
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

      if (mode === 'EARN' && !p && a) {
        // Auto: 1 point per 100 spent
        p = Math.floor(a / 100);
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
      resetForm();
    } catch (err) {
      console.error(err);
      alert((err as Error).message || "Transaction failed");
    } finally {
      setIsProcessing(false);
    }
  };

  if (!isOpen || !customer) return null;

  const tierBadges = {
    Member: 'bg-slate-200 text-black border-black',
    Silver: 'bg-slate-300 text-black border-black',
    Gold: 'bg-amber-400 text-black border-black',
    Platinum: 'bg-violet-300 text-black border-black',
  };

  const inputClasses = "w-full text-xs font-bold text-black bg-white px-3 py-2 border-2 border-black focus:outline-none focus:bg-amber-50 placeholder-slate-400";
  const labelClasses = "text-[11px] font-black uppercase text-black block mb-1 tracking-wider";

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 pt-10 sm:pt-14 overflow-y-auto">
      <div className="bg-white border-2 sm:border-4 border-black shadow-[8px_8px_0px_#000] w-full max-w-lg overflow-hidden flex flex-col my-auto animate-in zoom-in-95 duration-200">
        
        {/* Accent Strip */}
        <div className="h-2 bg-amber-400 border-b-2 border-black w-full" />

        {/* Modal Header */}
        <div className="px-5 py-3.5 border-b-2 border-black bg-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 bg-amber-400 border-2 border-black shadow-[2px_2px_0px_#000]">
              <Award className="w-4 h-4 text-black stroke-[2.5]" />
            </div>
            <div>
              <h2 className="text-sm font-black uppercase tracking-wider text-black">Loyalty &amp; Rewards</h2>
              <p className="text-[10px] font-bold text-slate-600 uppercase">{customer.businessName}</p>
            </div>
          </div>
          <button 
            type="button"
            onClick={onClose} 
            className="p-1 bg-white hover:bg-red-500 hover:text-white border-2 border-black transition-colors cursor-pointer"
          >
            <X className="w-4 h-4 stroke-[3]" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 max-h-[75vh] overflow-y-auto">
          {/* Customer Overview Card */}
          <div className="p-4 bg-amber-50 border-2 border-black shadow-[3px_3px_0px_#000] mb-5 flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-sm font-black text-black">{customer.businessName}</p>
              <p className="text-xs font-bold text-slate-600">
                {customer.ownerName ? `${customer.ownerName} • ` : ''}{customer.phone}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <div className="text-center">
                <span className={`inline-block px-2.5 py-1 text-[10px] font-black uppercase border-2 ${tierBadges[customer.loyaltyTier] || 'bg-slate-200'}`}>
                  {customer.loyaltyTier}
                </span>
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-300 border-2 border-black shadow-[2px_2px_0px_#000]">
                <Star className="w-4 h-4 fill-black text-black" />
                <span className="text-xs font-black text-black">{customer.loyaltyPoints} PTS</span>
              </div>
            </div>
          </div>

          {/* Mode Switch Tabs */}
          <div className="grid grid-cols-3 gap-2 mb-5">
            <button 
              type="button"
              onClick={() => { setMode('VIEW'); resetForm(); }}
              className={`py-2 px-1 text-center text-[11px] font-black uppercase border-2 border-black transition-all cursor-pointer ${
                mode === 'VIEW'
                  ? 'bg-black text-white shadow-[2px_2px_0px_#000]'
                  : 'bg-white text-black hover:bg-slate-100'
              }`}
            >
              History
            </button>
            <button 
              type="button"
              onClick={() => { setMode('EARN'); resetForm(); }}
              className={`py-2 px-1 text-center text-[11px] font-black uppercase border-2 border-black transition-all cursor-pointer ${
                mode === 'EARN'
                  ? 'bg-emerald-400 text-black shadow-[2px_2px_0px_#000]'
                  : 'bg-white text-black hover:bg-slate-100'
              }`}
            >
              Add Points
            </button>
            <button 
              type="button"
              onClick={() => { setMode('REDEEM'); resetForm(); }}
              className={`py-2 px-1 text-center text-[11px] font-black uppercase border-2 border-black transition-all cursor-pointer ${
                mode === 'REDEEM'
                  ? 'bg-rose-400 text-black shadow-[2px_2px_0px_#000]'
                  : 'bg-white text-black hover:bg-slate-100'
              }`}
            >
              Redeem
            </button>
          </div>

          {/* Tab Views */}
          {mode === 'VIEW' ? (
            <div className="space-y-3">
              <div className="flex items-center justify-between pb-1 border-b-2 border-black">
                <h4 className="text-xs font-black uppercase tracking-wider text-black flex items-center gap-1.5">
                  <History className="w-3.5 h-3.5" /> Transaction History
                </h4>
                <span className="text-[10px] font-bold text-slate-600 uppercase">{transactions.length} Records</span>
              </div>

              {isLoading ? (
                <div className="py-8 flex flex-col items-center justify-center gap-2">
                  <Loader2 className="w-6 h-6 text-black animate-spin" />
                  <p className="text-xs font-black uppercase">Loading history...</p>
                </div>
              ) : transactions.length === 0 ? (
                <div className="p-6 bg-slate-50 border-2 border-dashed border-black text-center">
                  <p className="text-xs font-bold text-slate-500 uppercase">No loyalty transactions recorded yet.</p>
                </div>
              ) : (
                <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                  {transactions.map(tx => (
                    <div key={tx.id} className="p-3 bg-white border-2 border-black shadow-[2px_2px_0px_#000] flex items-center justify-between gap-3">
                      <div className="flex items-center gap-2.5">
                        <div className={`w-7 h-7 border-2 border-black flex items-center justify-center ${
                          tx.type === 'EARN' ? 'bg-emerald-300' : 'bg-rose-300'
                        }`}>
                          {tx.type === 'EARN' ? <ArrowUp className="w-4 h-4 stroke-[2.5]" /> : <ArrowDown className="w-4 h-4 stroke-[2.5]" />}
                        </div>
                        <div>
                          <p className="text-xs font-black text-black">{tx.description}</p>
                          <p className="text-[10px] font-bold text-slate-500">{new Date(tx.date).toLocaleDateString()}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className={`text-xs font-black ${tx.type === 'EARN' ? 'text-emerald-700' : 'text-rose-700'}`}>
                          {tx.type === 'EARN' ? '+' : '-'}{tx.points} PTS
                        </p>
                        {tx.amount ? (
                          <p className="text-[10px] font-bold text-slate-600">৳{tx.amount.toLocaleString()}</p>
                        ) : null}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <form onSubmit={handleProcess} className="p-4 bg-slate-50 border-2 border-black shadow-[3px_3px_0px_#000] space-y-4">
              <h4 className="text-xs font-black uppercase tracking-wider text-black">
                {mode === 'EARN' ? 'Record Purchase & Add Points' : 'Redeem Points for Customer Discount'}
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {mode === 'EARN' && (
                  <div>
                    <label className={labelClasses}>Purchase Amount (৳)</label>
                    <input 
                      type="number" 
                      value={amount} 
                      onChange={e => setAmount(e.target.value)} 
                      required 
                      className={inputClasses} 
                      placeholder="e.g. 5000" 
                    />
                  </div>
                )}
                {mode === 'REDEEM' && (
                  <div>
                    <label className={labelClasses}>Discount Value (৳)</label>
                    <input 
                      type="number" 
                      value={amount} 
                      onChange={e => setAmount(e.target.value)} 
                      className={inputClasses} 
                      placeholder="e.g. 500" 
                    />
                  </div>
                )}
                <div>
                  <label className={labelClasses}>
                    Points to {mode === 'EARN' ? 'Add' : 'Deduct'} {mode === 'EARN' && '(1 per 100৳)'}
                  </label>
                  <input 
                    type="number" 
                    value={points} 
                    onChange={e => setPoints(e.target.value)} 
                    required={mode === 'REDEEM'} 
                    className={inputClasses} 
                    placeholder={mode === 'EARN' ? 'Auto-calculated' : 'e.g. 50'} 
                  />
                </div>
              </div>

              <div>
                <label className={labelClasses}>Description / Note</label>
                <input 
                  type="text" 
                  value={desc} 
                  onChange={e => setDesc(e.target.value)} 
                  required 
                  className={inputClasses} 
                  placeholder={mode === 'EARN' ? 'e.g. POS Purchase Order' : 'e.g. 10% Discount Claimed'} 
                />
              </div>

              <div className="pt-2 flex justify-end">
                <button 
                  type="submit" 
                  disabled={isProcessing} 
                  className={`px-5 py-2 text-xs font-black uppercase text-black border-2 border-black shadow-[2px_2px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 transition-all cursor-pointer disabled:opacity-50 ${
                    mode === 'EARN' ? 'bg-emerald-400 hover:bg-emerald-300' : 'bg-rose-400 hover:bg-rose-300'
                  }`}
                >
                  {isProcessing ? 'Processing...' : mode === 'EARN' ? 'Confirm & Add Points' : 'Confirm Redemption'}
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-5 py-3 border-t-2 border-black bg-white flex justify-end">
          <button 
            type="button" 
            onClick={onClose} 
            className="px-4 py-2 text-xs font-black uppercase text-black bg-white hover:bg-slate-200 border-2 border-black transition-all cursor-pointer shadow-[2px_2px_0px_#000] active:translate-x-0.5 active:translate-y-0.5"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
