import React, { useState } from 'react';
import { Plus, Check, Clock, Calendar as CalendarIcon, Repeat, DollarSign, Edit, Trash2 } from 'lucide-react';

interface Props {
  showToast: (msg: string, type: 'success'|'error') => void;
}

interface Subscription {
  id: string;
  name: string;
  cycle: 'monthly' | 'yearly';
  amount: number;
  lastPaidDate: string;
}

export const SubscriptionPage: React.FC<Props> = ({ showToast }) => {
  const [subs, setSubs] = useState<Subscription[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  // form state
  const [name, setName] = useState('');
  const [cycle, setCycle] = useState<'monthly'|'yearly'>('monthly');
  const [amount, setAmount] = useState('');
  const [lastPaidDate, setLastPaidDate] = useState('');

  const calculateNextPayment = (dateStr: string, c: 'monthly'|'yearly') => {
    if (!dateStr) return null;
    const d = new Date(dateStr);
    if (c === 'monthly') d.setMonth(d.getMonth() + 1);
    else d.setFullYear(d.getFullYear() + 1);
    return d;
  };

  const getProgress = (lastPaid: string, cycle: 'monthly'|'yearly') => {
    const start = new Date(lastPaid).getTime();
    const end = calculateNextPayment(lastPaid, cycle)?.getTime() || start;
    const now = new Date().getTime();
    
    if (now >= end) return 100;
    if (now <= start) return 0;
    
    return ((now - start) / (end - start)) * 100;
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !amount || !lastPaidDate) return;
    
    if (editingId) {
      setSubs(subs.map(s => s.id === editingId ? { ...s, name, cycle, amount: parseFloat(amount), lastPaidDate } : s));
      showToast('Subscription updated successfully', 'success');
    } else {
      const newSub: Subscription = {
        id: Date.now().toString(),
        name,
        cycle,
        amount: parseFloat(amount),
        lastPaidDate
      };
      setSubs([...subs, newSub]);
      showToast('Subscription saved successfully', 'success');
    }
    setIsModalOpen(false);
    setName(''); setAmount(''); setLastPaidDate('');
    setEditingId(null);
  };
  
  const handleEdit = (sub: Subscription) => {
    setEditingId(sub.id);
    setName(sub.name);
    setCycle(sub.cycle);
    setAmount(sub.amount.toString());
    setLastPaidDate(sub.lastPaidDate);
    setIsModalOpen(true);
  };
  
  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this subscription?')) {
      setSubs(subs.filter(s => s.id !== id));
      showToast('Subscription deleted', 'success');
    }
  };

  return (
    <div className="w-full mx-auto space-y-6 pb-20 p-4">
      <div className="bg-slate-900 p-4 sm:p-5 rounded-md border border-slate-800 shadow-md flex flex-wrap items-center justify-between gap-4 text-white">
        <div>
          <div className="flex flex-wrap items-center gap-2.5">
            <span className="w-2.5 h-2.5 rounded-full bg-primary-500"></span>
            <h2 className="text-lg font-bold text-white">Subscriptions</h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">Manage recurring bills and monitor payment cycles.</p>
        </div>

        <button 
          onClick={() => { setEditingId(null); setName(""); setAmount(""); setLastPaidDate(""); setIsModalOpen(true); }}
          className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-500 transition-colors text-xs font-bold shadow-md shadow-primary-950"
        >
          <Plus className="w-4 h-4" /> Add Subscription
        </button>
      </div>

      {subs.length === 0 ? (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-10 flex flex-col items-center justify-center text-center">
          <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mb-4">
            <Repeat className="w-8 h-8 text-slate-500" />
          </div>
          <h3 className="text-lg font-bold text-white mb-2">No Subscriptions Found</h3>
          <p className="text-sm text-slate-400 max-w-md">You haven't added any software or utility subscriptions yet. Click the "Add Subscription" button above to track your recurring bills.</p>
        </div>
      ) : (
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {subs.map(sub => {
          const nextDate = calculateNextPayment(sub.lastPaidDate, sub.cycle);
          const progress = getProgress(sub.lastPaidDate, sub.cycle);
          const isOverdue = progress >= 100;

          return (
            <div key={sub.id} className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm flex flex-col gap-4 relative overflow-hidden group">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-base font-bold text-white">{sub.name}</h3>
                  <div className="flex items-center gap-1.5 mt-1 text-slate-400 text-xs">
                    <Repeat className="w-3 h-3" />
                    <span className="capitalize">{sub.cycle} Billing</span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-black text-primary-400">৳ {sub.amount.toLocaleString()}</div>
                </div>
              </div>

              <div className="mt-2">
                <div className="flex justify-between text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                  <span>Last Paid: {new Date(sub.lastPaidDate).toLocaleDateString()}</span>
                  <span className={isOverdue ? "text-rose-400" : "text-emerald-400"}>
                    Next: {nextDate ? nextDate.toLocaleDateString() : 'N/A'}
                  </span>
                </div>
                
                <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                  <div 
                    className={`h-full rounded-full transition-all duration-500 ${isOverdue ? 'bg-rose-500' : 'bg-primary-500'}`}
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>
              </div>
              
              {/* Edit/Delete overlay on hover */}
              <div className="absolute top-4 right-4 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={() => handleEdit(sub)} className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded"><Edit className="w-4 h-4" /></button>
                <button onClick={() => handleDelete(sub.id)} className="p-1.5 bg-slate-800 hover:bg-rose-950 text-slate-300 hover:text-rose-400 rounded"><Trash2 className="w-4 h-4" /></button>
              </div>
            </div>
          );
        })}
      </div>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-md shadow-md w-full max-w-md overflow-hidden flex flex-col">
            <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between">
              <h2 className="text-base font-bold text-white">Add Subscription</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white"><Plus className="w-5 h-5 rotate-45" /></button>
            </div>
            
            <form onSubmit={handleSave} className="p-6 space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1.5">Software/Service Name</label>
                <input type="text" value={name} onChange={e=>setName(e.target.value)} required className="w-full text-sm font-bold text-white bg-slate-950 px-3 py-2 rounded-md border border-slate-700 focus:border-primary-500" placeholder="e.g. Amr software" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1.5">Billing Cycle</label>
                  <select value={cycle} onChange={e=>setCycle(e.target.value as 'monthly'|'yearly')} className="w-full text-sm font-bold text-white bg-slate-950 px-3 py-2 rounded-md border border-slate-700 focus:border-primary-500">
                    <option value="monthly">Monthly</option>
                    <option value="yearly">Yearly</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1.5">Amount (৳)</label>
                  <input type="number" value={amount} onChange={e=>setAmount(e.target.value)} required min="0" className="w-full text-sm font-bold text-white bg-slate-950 px-3 py-2 rounded-md border border-slate-700 focus:border-primary-500" />
                </div>
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1.5">Last Paid Date</label>
                <input type="date" value={lastPaidDate} onChange={e=>setLastPaidDate(e.target.value)} required className="w-full text-sm font-bold text-white bg-slate-950 px-3 py-2 rounded-md border border-slate-700 focus:border-primary-500" />
              </div>

              <div className="pt-4 flex justify-end gap-3 border-t border-slate-800">
                <button type="button" onClick={()=>setIsModalOpen(false)} className="px-4 py-2 text-sm font-bold text-slate-300 hover:bg-slate-800 rounded">Cancel</button>
                <button type="submit" className="px-4 py-2 text-sm font-bold text-white bg-primary-600 hover:bg-primary-500 rounded">Save Subscription</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
