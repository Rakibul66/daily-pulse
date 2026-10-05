import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { AccountTransaction } from '@/types/accounts';
import { getTransactions, addTransaction } from '@/lib/accountsStorage';
import { Wallet, TrendingUp, TrendingDown, Loader2, Plus, ArrowUpRight, ArrowDownRight } from 'lucide-react';

interface Props {
  showToast: (msg: string, type: 'success'|'error') => void;
}

export const AccountsPage: React.FC<Props> = ({ showToast }) => {
  const { user } = useAuth();
  const [transactions, setTransactions] = useState<AccountTransaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Manual Tx Form
  const [showForm, setShowForm] = useState(false);
  const [type, setType] = useState<'INCOME'|'EXPENSE'>('EXPENSE');
  const [category, setCategory] = useState('Utilities');
  const [amount, setAmount] = useState('');
  const [desc, setDesc] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (user) loadData();
  }, [user]);

  const loadData = async () => {
    if (!user) return;
    setIsLoading(true);
    try {
      const data = await getTransactions(user.uid);
      setTransactions(data);
    } catch (err) {
      console.error(err);
      showToast('Failed to load transactions', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setIsSubmitting(true);
    try {
      await addTransaction({
        userId: user.uid,
        type,
        category: category as any,
        amount: Number(amount),
        description: desc,
        date
      });
      showToast('Transaction logged', 'success');
      setShowForm(false);
      setAmount(''); setDesc('');
      loadData();
    } catch (err) {
      console.error(err);
      showToast('Error logging transaction', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const totalIncome = transactions.filter(t => t.type === 'INCOME').reduce((acc, t) => acc + t.amount, 0);
  const totalExpense = transactions.filter(t => t.type === 'EXPENSE').reduce((acc, t) => acc + t.amount, 0);
  const balance = totalIncome - totalExpense;

  const categories = ['Sales Revenue', 'Inventory Purchase', 'Payroll', 'Utilities', 'Rent', 'Other'];

  return (
    <div className="w-full mx-auto space-y-6 pb-20">
      
      <div className="bg-slate-900 p-4 sm:p-5 rounded-md border border-slate-800 shadow-md flex flex-wrap items-center justify-between gap-4 text-white">
        <div>
          <div className="flex flex-wrap items-center gap-2.5">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-500"></span>
            <h2 className="text-lg font-bold text-white">Ledger & Accounts</h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">Track daily income, expenses, and overall balance.</p>
        </div>
        <button onClick={() => setShowForm(!showForm)} className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-500 transition-colors text-xs font-bold shadow-md shadow-primary-950">
          <Plus className="w-4 h-4" /> Log Transaction
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-slate-900 rounded-md border border-slate-800 p-5 shadow-md flex flex-col justify-center">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-2"><Wallet className="w-4 h-4 text-blue-400" /> Net Balance</p>
          <p className={`text-2xl font-black ${balance >= 0 ? 'text-white' : 'text-rose-400'}`}>৳ {balance.toLocaleString()}</p>
        </div>
        <div className="bg-slate-900 rounded-md border border-slate-800 p-5 shadow-md flex flex-col justify-center">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-2"><TrendingUp className="w-4 h-4 text-emerald-400" /> Total Income</p>
          <p className="text-2xl font-black text-emerald-400">৳ {totalIncome.toLocaleString()}</p>
        </div>
        <div className="bg-slate-900 rounded-md border border-slate-800 p-5 shadow-md flex flex-col justify-center">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-2"><TrendingDown className="w-4 h-4 text-rose-400" /> Total Expenses</p>
          <p className="text-2xl font-black text-rose-400">৳ {totalExpense.toLocaleString()}</p>
        </div>
      </div>

      {showForm && (
        <div className="bg-slate-900 border border-slate-800 rounded-md shadow-md p-5 animate-in slide-in-from-top-2">
          <h3 className="text-sm font-bold text-white mb-4">Log Manual Transaction</h3>
          <form onSubmit={handleSave} className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Type</label>
              <select value={type} onChange={e => setType(e.target.value as any)} className="w-full text-sm bg-slate-950 px-3 py-2 rounded-md border border-slate-700 text-white focus:border-primary-500">
                <option value="EXPENSE">Expense</option>
                <option value="INCOME">Income</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Category</label>
              <select value={category} onChange={e => setCategory(e.target.value)} className="w-full text-sm bg-slate-950 px-3 py-2 rounded-md border border-slate-700 text-white focus:border-primary-500">
                {categories.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Amount (৳)</label>
              <input type="number" value={amount} onChange={e => setAmount(e.target.value)} className="w-full text-sm bg-slate-950 px-3 py-2 rounded-md border border-slate-700 text-white focus:border-primary-500" required min="1" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Description</label>
              <input type="text" value={desc} onChange={e => setDesc(e.target.value)} className="w-full text-sm bg-slate-950 px-3 py-2 rounded-md border border-slate-700 text-white focus:border-primary-500" placeholder="e.g. Electric Bill October" required />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Date</label>
              <input type="date" value={date} onChange={e => setDate(e.target.value)} className="w-full text-sm bg-slate-950 px-3 py-2 rounded-md border border-slate-700 text-white focus:border-primary-500" required />
            </div>
            <div className="md:col-span-3 flex justify-end">
              <button type="submit" disabled={isSubmitting} className="px-5 py-2 bg-primary-600 hover:bg-primary-500 text-white text-sm font-bold rounded-md disabled:opacity-50">
                {isSubmitting ? 'Saving...' : 'Save Transaction'}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-slate-900 border border-slate-800 rounded-md shadow-md overflow-hidden">
        <div className="p-4 border-b border-slate-800 bg-slate-900/50">
          <h3 className="text-sm font-bold text-white">Transaction History</h3>
        </div>

        {isLoading ? (
          <div className="py-20 flex flex-col items-center gap-3"><Loader2 className="w-8 h-8 text-primary-500 animate-spin" /></div>
        ) : (
          <div className="divide-y divide-slate-800/50">
            {transactions.map(t => (
              <div key={t.id} className="p-4 flex items-center justify-between hover:bg-slate-800/30 transition-colors">
                <div className="flex items-center gap-4">
                  <div className={`p-2 rounded-full ${t.type === 'INCOME' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'}`}>
                    {t.type === 'INCOME' ? <ArrowUpRight className="w-5 h-5" /> : <ArrowDownRight className="w-5 h-5" />}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-white">{t.description}</p>
                    <p className="text-[10px] text-slate-400 font-mono mt-0.5">{new Date(t.date).toLocaleDateString()} • {t.category}</p>
                  </div>
                </div>
                <div className={`text-right font-bold ${t.type === 'INCOME' ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {t.type === 'INCOME' ? '+' : '-'} ৳ {t.amount.toLocaleString()}
                </div>
              </div>
            ))}
            {transactions.length === 0 && (
              <div className="p-10 text-center text-slate-500 dark:text-slate-400 text-sm">No transactions found.</div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
