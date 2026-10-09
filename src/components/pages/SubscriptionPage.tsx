"use client";

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Subscription } from '@/types/subscription';
import { 
  getSubscriptions, 
  addSubscription, 
  updateSubscription, 
  deleteSubscription 
} from '@/lib/subscriptionStorage';
import { 
  Plus, 
  Check, 
  Clock, 
  Repeat, 
  DollarSign, 
  Edit, 
  Trash2, 
  Loader2, 
  AlertTriangle,
  CreditCard,
  Layers,
  Calendar,
  CheckCircle2,
  X
} from 'lucide-react';

interface Props {
  showToast: (msg: string, type: 'success'|'error') => void;
}

export const SubscriptionPage: React.FC<Props> = ({ showToast }) => {
  const { user, userProfile } = useAuth();
  const effectiveCompanyId = userProfile?.companyId || user?.uid;

  const [subs, setSubs] = useState<Subscription[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSub, setEditingSub] = useState<Subscription | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Form state
  const [name, setName] = useState('');
  const [category, setCategory] = useState<Subscription['category']>('Software / SaaS');
  const [cycle, setCycle] = useState<'monthly'|'yearly'>('monthly');
  const [amount, setAmount] = useState('');
  const [lastPaidDate, setLastPaidDate] = useState(new Date().toISOString().split('T')[0]);
  const [paymentMethod, setPaymentMethod] = useState('bKash / MFS');
  const [status, setStatus] = useState<Subscription['status']>('Active');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    if (effectiveCompanyId) {
      loadData();
    }
  }, [effectiveCompanyId]);

  const loadData = async () => {
    if (!effectiveCompanyId) return;
    setIsLoading(true);
    try {
      const data = await getSubscriptions(effectiveCompanyId);
      setSubs(data);
    } catch (err) {
      console.error(err);
      showToast('Failed to load subscriptions', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const calculateNextPayment = (dateStr: string, c: 'monthly'|'yearly') => {
    if (!dateStr) return null;
    const d = new Date(dateStr);
    if (c === 'monthly') d.setMonth(d.getMonth() + 1);
    else d.setFullYear(d.getFullYear() + 1);
    return d;
  };

  const getProgress = (lastPaid: string, c: 'monthly'|'yearly') => {
    const start = new Date(lastPaid).getTime();
    const end = calculateNextPayment(lastPaid, c)?.getTime() || start;
    const now = new Date().getTime();
    
    if (now >= end) return 100;
    if (now <= start) return 0;
    
    return Math.min(100, Math.max(0, ((now - start) / (end - start)) * 100));
  };

  const handleOpenAdd = () => {
    setEditingSub(null);
    setName('');
    setCategory('Software / SaaS');
    setCycle('monthly');
    setAmount('');
    setLastPaidDate(new Date().toISOString().split('T')[0]);
    setPaymentMethod('bKash / MFS');
    setStatus('Active');
    setNotes('');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (sub: Subscription) => {
    setEditingSub(sub);
    setName(sub.name);
    setCategory(sub.category || 'Software / SaaS');
    setCycle(sub.cycle);
    setAmount(sub.amount.toString());
    setLastPaidDate(sub.lastPaidDate);
    setPaymentMethod(sub.paymentMethod || 'bKash / MFS');
    setStatus(sub.status || 'Active');
    setNotes(sub.notes || '');
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!effectiveCompanyId || !name.trim() || !amount) return;

    setIsSubmitting(true);
    try {
      if (editingSub) {
        await updateSubscription(editingSub.id, {
          name: name.trim(),
          category,
          cycle,
          amount: parseFloat(amount) || 0,
          lastPaidDate,
          paymentMethod,
          status,
          notes: notes.trim()
        });
        showToast('Subscription updated successfully', 'success');
      } else {
        await addSubscription({
          companyId: effectiveCompanyId,
          name: name.trim(),
          category,
          cycle,
          amount: parseFloat(amount) || 0,
          lastPaidDate,
          paymentMethod,
          status,
          notes: notes.trim()
        });
        showToast('Subscription saved successfully', 'success');
      }
      setIsModalOpen(false);
      await loadData();
    } catch (err) {
      console.error(err);
      showToast('Failed to save subscription', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this subscription?')) return;
    try {
      await deleteSubscription(id);
      showToast('Subscription deleted successfully', 'success');
      await loadData();
    } catch (err) {
      console.error(err);
      showToast('Failed to delete subscription', 'error');
    }
  };

  const handleMarkPaid = async (sub: Subscription) => {
    try {
      const today = new Date().toISOString().split('T')[0];
      await updateSubscription(sub.id, {
        lastPaidDate: today
      });
      showToast(`Renewed ${sub.name} payment for today`, 'success');
      await loadData();
    } catch (err) {
      console.error(err);
      showToast('Failed to update payment status', 'error');
    }
  };

  // KPI Calculations
  const monthlyBurn = subs.reduce((sum, s) => {
    if (s.status !== 'Active') return sum;
    return sum + (s.cycle === 'monthly' ? s.amount : Math.round(s.amount / 12));
  }, 0);

  const activeCount = subs.filter(s => s.status === 'Active').length;
  const overdueCount = subs.filter(s => {
    if (s.status !== 'Active') return false;
    return getProgress(s.lastPaidDate, s.cycle) >= 100;
  }).length;

  return (
    <div className="w-full space-y-6 pb-24 px-0">
      {/* 1. Header Command Bar */}
      <div className="bg-white border-4 border-black p-5 shadow-[6px_6px_0px_#000] flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-3 h-3 bg-indigo-600 border border-black inline-block" />
            <h1 className="font-display font-black text-2xl uppercase tracking-tight text-black">
              SUBSCRIPTIONS & UTILITIES MANAGER
            </h1>
          </div>
          <p className="text-xs font-bold text-slate-600 uppercase tracking-wider">
            Track Recurring Tools & Billing Cycles
          </p>
        </div>

        <button 
          onClick={handleOpenAdd}
          className="flex items-center gap-2 px-5 py-2.5 bg-black text-white hover:bg-slate-800 border-2 border-black shadow-[3px_3px_0px_#000] text-xs font-black uppercase tracking-wider transition-all active:translate-x-0.5 active:translate-y-0.5 cursor-pointer"
        >
          <Plus className="w-4 h-4 text-amber-300" /> + ADD SUBSCRIPTION
        </button>
      </div>

      {/* 2. Top Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white border-4 border-black p-5 shadow-[6px_6px_0px_#000] flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-black uppercase tracking-wider text-black">MONTHLY BURN RATE</span>
            <div className="w-8 h-8 bg-indigo-100 border-2 border-black flex items-center justify-center font-black">
              ৳
            </div>
          </div>
          <div>
            <p className="text-3xl font-black font-display text-indigo-700">
              ৳ {monthlyBurn.toLocaleString()}
            </p>
            <p className="text-[11px] font-bold text-slate-600 uppercase mt-1">
              Estimated Monthly Recurring Cost
            </p>
          </div>
        </div>

        <div className="bg-white border-4 border-black p-5 shadow-[6px_6px_0px_#000] flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-black uppercase tracking-wider text-black">ACTIVE SERVICES</span>
            <Layers className="w-5 h-5 text-emerald-600" />
          </div>
          <div>
            <p className="text-3xl font-black font-display text-emerald-800">
              {activeCount} <span className="text-base text-slate-500 font-bold">ACTIVE</span>
            </p>
            <p className="text-[11px] font-bold text-slate-600 uppercase mt-1">
              Live Software & Utility Contracts
            </p>
          </div>
        </div>

        <div className="bg-amber-300 border-4 border-black p-5 shadow-[6px_6px_0px_#000] flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-black uppercase tracking-wider text-black">OVERDUE / RENEWALS</span>
            <AlertTriangle className="w-5 h-5 text-black" />
          </div>
          <div>
            <p className="text-3xl font-black font-display text-black">
              {overdueCount} <span className="text-base font-bold">DUE NOW</span>
            </p>
            <p className="text-[11px] font-bold text-slate-800 uppercase mt-1">
              Billing Cycles Exceeded
            </p>
          </div>
        </div>
      </div>

      {/* 3. Subscriptions Feed / Grid */}
      {isLoading ? (
        <div className="bg-white border-4 border-black shadow-[8px_8px_0px_#000] p-16 flex flex-col items-center justify-center gap-3">
          <Loader2 className="w-8 h-8 text-black animate-spin" />
          <p className="text-xs font-black uppercase tracking-wider text-black">Loading subscriptions...</p>
        </div>
      ) : subs.length === 0 ? (
        <div className="bg-white border-4 border-black p-12 text-center flex flex-col items-center shadow-[8px_8px_0px_#000]">
          <div className="w-16 h-16 bg-amber-100 border-2 border-black flex items-center justify-center mb-4 shadow-[2px_2px_0px_#000]">
            <Repeat className="w-8 h-8 text-black" />
          </div>
          <h3 className="text-base font-black text-black uppercase tracking-wider mb-1">No Active Subscriptions Found</h3>
          <p className="text-xs font-bold text-slate-600 max-w-md uppercase tracking-wider mb-6">
            Track tools like Vercel, Shopify, Figma, Broadband Internet, or Cloud servers with automatic next-due reminders.
          </p>
          <button 
            onClick={handleOpenAdd}
            className="px-5 py-2.5 bg-black text-white hover:bg-slate-800 border-2 border-black shadow-[3px_3px_0px_#000] text-xs font-black uppercase tracking-wider"
          >
            + ADD YOUR FIRST SUBSCRIPTION
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {subs.map(sub => {
            const nextDate = calculateNextPayment(sub.lastPaidDate, sub.cycle);
            const progress = getProgress(sub.lastPaidDate, sub.cycle);
            const isOverdue = progress >= 100;

            return (
              <div 
                key={sub.id} 
                className="bg-white border-4 border-black p-5 shadow-[6px_6px_0px_#000] flex flex-col justify-between relative group hover:-translate-y-1 transition-all"
              >
                <div>
                  <div className="flex justify-between items-start gap-2 mb-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-display font-black text-lg uppercase tracking-tight text-black">{sub.name}</h3>
                        <span className={`px-2 py-0.5 border border-black text-[9px] font-black uppercase ${sub.status === 'Active' ? 'bg-emerald-100 text-emerald-950' : 'bg-slate-100 text-slate-700'}`}>
                          {sub.status}
                        </span>
                      </div>
                      <p className="text-[11px] font-bold text-slate-600 uppercase tracking-wider mt-0.5">
                        {sub.category} • <span className="capitalize">{sub.cycle}</span>
                      </p>
                    </div>

                    <div className="text-right">
                      <p className="text-xl font-black font-display text-indigo-700">
                        ৳ {sub.amount.toLocaleString()}
                      </p>
                      <p className="text-[9px] font-black text-slate-500 uppercase">
                        per {sub.cycle === 'monthly' ? 'month' : 'year'}
                      </p>
                    </div>
                  </div>

                  {/* Progress & Due Dates */}
                  <div className="bg-slate-50 border-2 border-black p-3 my-3 shadow-[2px_2px_0px_#000]">
                    <div className="flex justify-between items-center text-[10px] font-black uppercase mb-1.5">
                      <span className="text-slate-700">Last: {new Date(sub.lastPaidDate).toLocaleDateString()}</span>
                      <span className={isOverdue ? "text-rose-700 font-black bg-rose-100 px-1 border border-rose-400" : "text-emerald-700"}>
                        {isOverdue ? 'OVERDUE' : `Next: ${nextDate ? nextDate.toLocaleDateString() : 'N/A'}`}
                      </span>
                    </div>

                    <div className="w-full h-3 bg-white border-2 border-black overflow-hidden shadow-inner">
                      <div 
                        className={`h-full border-r-2 border-black transition-all duration-700 ${isOverdue ? 'bg-rose-500' : 'bg-emerald-500'}`}
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  </div>

                  {sub.notes && (
                    <p className="text-xs text-slate-600 font-medium italic mb-3">
                      &ldquo;{sub.notes}&rdquo;
                    </p>
                  )}
                </div>

                {/* Card Action Strip */}
                <div className="pt-3 border-t-2 border-black/10 flex items-center justify-between gap-2">
                  <button
                    onClick={() => handleMarkPaid(sub)}
                    className="flex-1 px-3 py-1.5 bg-emerald-100 hover:bg-emerald-200 text-black border-2 border-black shadow-[2px_2px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 text-[10px] font-black uppercase tracking-wider flex items-center justify-center gap-1 cursor-pointer"
                    title="Mark renewed today"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-800" /> PAID TODAY
                  </button>

                  <button 
                    onClick={() => handleOpenEdit(sub)}
                    className="p-1.5 bg-white hover:bg-slate-100 border-2 border-black shadow-[2px_2px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 text-black cursor-pointer"
                    title="Edit"
                  >
                    <Edit className="w-3.5 h-3.5" />
                  </button>

                  <button 
                    onClick={() => handleDelete(sub.id)}
                    className="p-1.5 bg-rose-100 hover:bg-rose-200 border-2 border-black shadow-[2px_2px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 text-rose-800 cursor-pointer"
                    title="Delete"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* 4. Add/Edit Subscription Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border-4 border-black shadow-[10px_10px_0px_#000] w-full max-w-lg overflow-hidden flex flex-col">
            <div className="px-6 py-4 border-b-2 border-black flex items-center justify-between bg-amber-300">
              <div className="flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-black" />
                <h2 className="font-display font-black text-base uppercase tracking-tight text-black">
                  {editingSub ? 'EDIT SUBSCRIPTION' : 'ADD NEW SUBSCRIPTION'}
                </h2>
              </div>
              <button 
                onClick={() => setIsModalOpen(false)} 
                className="w-7 h-7 bg-white border-2 border-black flex items-center justify-center text-black hover:bg-rose-400 cursor-pointer font-black"
              >
                ✕
              </button>
            </div>
            
            <form onSubmit={handleSave} className="p-6 space-y-4">
              <div>
                <label className="text-xs font-black uppercase text-black block mb-1">Service / Tool Name</label>
                <input 
                  type="text" 
                  value={name} 
                  onChange={e => setName(e.target.value)} 
                  required 
                  className="w-full text-xs font-bold text-black bg-white px-3 py-2 border-2 border-black shadow-[2px_2px_0px_#000] focus:bg-amber-50" 
                  placeholder="e.g. Vercel Pro, Broadband Internet, Shopify POS" 
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-black uppercase text-black block mb-1">Category</label>
                  <select 
                    value={category} 
                    onChange={e => setCategory(e.target.value as any)} 
                    className="w-full text-xs font-bold text-black bg-white px-3 py-2 border-2 border-black shadow-[2px_2px_0px_#000]"
                  >
                    <option value="Software / SaaS">Software / SaaS</option>
                    <option value="Utilities / Internet">Utilities / Internet</option>
                    <option value="Cloud & Hosting">Cloud & Hosting</option>
                    <option value="Office / Facility">Office / Facility</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-black uppercase text-black block mb-1">Billing Cycle</label>
                  <select 
                    value={cycle} 
                    onChange={e => setCycle(e.target.value as 'monthly'|'yearly')} 
                    className="w-full text-xs font-bold text-black bg-white px-3 py-2 border-2 border-black shadow-[2px_2px_0px_#000]"
                  >
                    <option value="monthly">Monthly Cycle</option>
                    <option value="yearly">Annual / Yearly Cycle</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-black uppercase text-black block mb-1">Amount (৳ BDT)</label>
                  <input 
                    type="number" 
                    value={amount} 
                    onChange={e => setAmount(e.target.value)} 
                    required 
                    min="0" 
                    step="any"
                    className="w-full text-xs font-bold text-black bg-white px-3 py-2 border-2 border-black shadow-[2px_2px_0px_#000]" 
                    placeholder="e.g. 2400"
                  />
                </div>

                <div>
                  <label className="text-xs font-black uppercase text-black block mb-1">Last Paid Date</label>
                  <input 
                    type="date" 
                    value={lastPaidDate} 
                    onChange={e => setLastPaidDate(e.target.value)} 
                    required 
                    className="w-full text-xs font-bold text-black bg-white px-3 py-2 border-2 border-black shadow-[2px_2px_0px_#000]" 
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-black uppercase text-black block mb-1">Payment Method</label>
                  <input 
                    type="text" 
                    value={paymentMethod} 
                    onChange={e => setPaymentMethod(e.target.value)} 
                    className="w-full text-xs font-bold text-black bg-white px-3 py-2 border-2 border-black shadow-[2px_2px_0px_#000]" 
                    placeholder="e.g. Visa Card, bKash, Bank"
                  />
                </div>

                <div>
                  <label className="text-xs font-black uppercase text-black block mb-1">Contract Status</label>
                  <select 
                    value={status} 
                    onChange={e => setStatus(e.target.value as any)} 
                    className="w-full text-xs font-bold text-black bg-white px-3 py-2 border-2 border-black shadow-[2px_2px_0px_#000]"
                  >
                    <option value="Active">Active</option>
                    <option value="Paused">Paused</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-black uppercase text-black block mb-1">Notes / Account Info</label>
                <textarea 
                  value={notes} 
                  onChange={e => setNotes(e.target.value)} 
                  rows={2}
                  className="w-full text-xs font-bold text-black bg-white px-3 py-2 border-2 border-black shadow-[2px_2px_0px_#000]" 
                  placeholder="e.g. Account email, renewal portal link, client reference"
                />
              </div>

              <div className="pt-4 flex justify-end gap-3 border-t-2 border-black">
                <button 
                  type="button" 
                  onClick={() => setIsModalOpen(false)} 
                  className="px-4 py-2 text-xs font-black uppercase text-black bg-slate-100 hover:bg-slate-200 border-2 border-black shadow-[2px_2px_0px_#000] cursor-pointer"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="px-5 py-2 text-xs font-black uppercase text-white bg-indigo-600 hover:bg-indigo-700 border-2 border-black shadow-[3px_3px_0px_#000] flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                >
                  {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4 text-amber-300" />}
                  {editingSub ? 'Update Subscription' : 'Save Subscription'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
