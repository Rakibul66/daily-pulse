import React, { useState } from 'react';
import { Partner, PartnerTransaction, TransactionType } from '@/types/partnership';
import { X, ArrowDownCircle, ArrowUpCircle, Gift } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  partner: Partner | null;
  onProcess: (tx: Omit<PartnerTransaction, 'id' | 'createdAt'>) => Promise<void>;
}

export const TransactionModal: React.FC<Props> = ({ isOpen, onClose, partner, onProcess }) => {
  const [type, setType] = useState<TransactionType>('INVESTMENT');
  const [amount, setAmount] = useState('');
  const [reference, setReference] = useState('');
  const [notes, setNotes] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen || !partner) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    const numAmount = Number(amount);
    if (!numAmount || numAmount <= 0) {
      setError('Please enter a valid amount greater than 0.');
      return;
    }

    if (type === 'WITHDRAWAL' && numAmount > partner.totalInvested) {
      setError(`Cannot withdraw more than total invested amount (৳${partner.totalInvested.toLocaleString()}).`);
      return;
    }

    setIsSubmitting(true);
    try {
      await onProcess({
        companyId: partner.companyId,
        partnerId: partner.id,
        type,
        amount: numAmount,
        date,
        reference,
        notes
      });
      setAmount('');
      setNotes('');
      setReference('');
      onClose();
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Failed to process transaction.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputClasses = "w-full text-sm font-bold text-white bg-slate-950 px-3 py-2 rounded-md border border-slate-700 focus:border-primary-500 focus:ring-1 focus:ring-primary-500 placeholder-slate-600";
  const labelClasses = "text-xs font-semibold text-slate-300 block mb-1.5";

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-md shadow-md w-full max-w-md overflow-hidden flex flex-col animate-in zoom-in-95 duration-200">
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/50">
          <div className="flex flex-col">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              Financial Transaction
            </h2>
            <p className="text-xs font-semibold text-primary-400 mt-0.5">{partner.name}</p>
          </div>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-white rounded-md transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto">
          <form id="tx-form" onSubmit={handleSubmit} className="space-y-4">
            
            <div className="grid grid-cols-3 gap-2 mb-2">
              <button
                type="button"
                onClick={() => setType('INVESTMENT')}
                className={`flex flex-col items-center justify-center gap-1.5 p-3 rounded-md border transition-all ${type === 'INVESTMENT' ? 'bg-emerald-500/10 border-emerald-500/50 text-emerald-400' : 'bg-slate-950 border-slate-800 text-slate-400 hover:bg-slate-900'}`}
              >
                <ArrowDownCircle className="w-5 h-5" />
                <span className="text-[10px] font-bold uppercase tracking-wider">Add Capital</span>
              </button>
              <button
                type="button"
                onClick={() => setType('WITHDRAWAL')}
                className={`flex flex-col items-center justify-center gap-1.5 p-3 rounded-md border transition-all ${type === 'WITHDRAWAL' ? 'bg-rose-500/10 border-rose-500/50 text-rose-400' : 'bg-slate-950 border-slate-800 text-slate-400 hover:bg-slate-900'}`}
              >
                <ArrowUpCircle className="w-5 h-5" />
                <span className="text-[10px] font-bold uppercase tracking-wider">Withdraw</span>
              </button>
              <button
                type="button"
                onClick={() => setType('DIVIDEND')}
                className={`flex flex-col items-center justify-center gap-1.5 p-3 rounded-md border transition-all ${type === 'DIVIDEND' ? 'bg-primary-500/10 border-primary-500/50 text-primary-400' : 'bg-slate-950 border-slate-800 text-slate-400 hover:bg-slate-900'}`}
              >
                <Gift className="w-5 h-5" />
                <span className="text-[10px] font-bold uppercase tracking-wider">Dividend</span>
              </button>
            </div>

            {error && (
              <div className="p-3 bg-rose-500/10 border border-rose-500/20 rounded-md text-xs font-semibold text-rose-400">
                {error}
              </div>
            )}

            <div>
              <label className={labelClasses}>Amount (৳)</label>
              <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} className={inputClasses} placeholder="0.00" required min="1" step="0.01" />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelClasses}>Date</label>
                <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className={inputClasses} required />
              </div>
              <div>
                <label className={labelClasses}>Reference (Optional)</label>
                <input type="text" value={reference} onChange={(e) => setReference(e.target.value)} className={inputClasses} placeholder="Txn ID, Bank..." />
              </div>
            </div>

            <div>
              <label className={labelClasses}>Notes</label>
              <input type="text" value={notes} onChange={(e) => setNotes(e.target.value)} className={inputClasses} placeholder="Description or period (e.g. Q3 2026 Profit)" />
            </div>

          </form>
        </div>

        <div className="px-6 py-4 border-t border-slate-800 bg-slate-900/80 flex justify-end gap-3">
          <button type="button" onClick={onClose} className="px-5 py-2.5 text-sm font-bold text-slate-300 bg-slate-800 border border-slate-700 rounded-md hover:bg-slate-700 transition-colors">
            Cancel
          </button>
          <button type="submit" form="tx-form" disabled={isSubmitting} className={`px-5 py-2.5 text-sm font-bold text-white rounded-md shadow-md disabled:opacity-50 transition-colors ${type === 'INVESTMENT' ? 'bg-emerald-600 hover:bg-emerald-500' : type === 'WITHDRAWAL' ? 'bg-rose-600 hover:bg-rose-500' : 'bg-primary-600 hover:bg-primary-500'}`}>
            {isSubmitting ? 'Processing...' : 'Confirm Transaction'}
          </button>
        </div>
      </div>
    </div>
  );
};
