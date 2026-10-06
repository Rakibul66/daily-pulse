import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Coffee, Plus, Store, CheckCircle, Calculator, CreditCard, Trash2, X, Edit, Star } from 'lucide-react';
import { CateringVendor, MealRecord, CateringPayment } from '@/types/catering';
import { getCateringVendors, addCateringVendor, updateCateringVendor, deleteCateringVendor, getMealRecords, addMealRecord, deleteMealRecord, getCateringPayments, addCateringPayment, deleteCateringPayment } from '@/lib/cateringStorage';

interface Props {
  showToast: (msg: string, type: 'success' | 'error') => void;
}

export const HRMCateringPage: React.FC<Props> = ({ showToast }) => {
  const { user, userProfile } = useAuth();
  const [activeTab, setActiveTab] = useState<'Vendors' | 'Meals' | 'Billing'>('Vendors');
  
  const [vendors, setVendors] = useState<CateringVendor[]>([]);
  const [meals, setMeals] = useState<MealRecord[]>([]);
  const [payments, setPayments] = useState<CateringPayment[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Modals state
  const [isVendorModalOpen, setIsVendorModalOpen] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [editingVendor, setEditingVendor] = useState<CateringVendor | null>(null);

  // Vendor form
  const [vendorName, setVendorName] = useState('');
  const [perMealRate, setPerMealRate] = useState('');
  const [billingFreq, setBillingFreq] = useState<'Daily' | 'Weekly' | 'Monthly'>('Weekly');

  // Meal form
  const [mealDate, setMealDate] = useState(new Date().toISOString().split('T')[0]);
  const [mealCount, setMealCount] = useState('');

  // Payment form
  const [selectedVendorForPay, setSelectedVendorForPay] = useState('');
  const [payDate, setPayDate] = useState(new Date().toISOString().split('T')[0]);
  const [payAmount, setPayAmount] = useState('');

  // Filters & Pagination
  const [filterMonth, setFilterMonth] = useState(new Date().getMonth() + 1);
  const [filterYear, setFilterYear] = useState(new Date().getFullYear());
  
  const [mealPage, setMealPage] = useState(1);
  const [paymentPage, setPaymentPage] = useState(1);
  const ITEMS_PER_PAGE = 10;

  useEffect(() => {
    if (user && userProfile?.companyId) {
      loadData();
    }
  }, [user, userProfile?.companyId]);

  const loadData = async () => {
    if (!user || !userProfile?.companyId) return;
    setIsLoading(true);
    try {
      const v = await getCateringVendors(userProfile?.companyId);
      setVendors(v);
      const m = await getMealRecords(userProfile?.companyId);
      setMeals(m);
      const p = await getCateringPayments(userProfile?.companyId);
      setPayments(p);

      if (v.length > 0) {
        if (!selectedVendorForPay) setSelectedVendorForPay(v[0].id);
      }
    } catch (err) {
      console.error(err);
      showToast('Error loading data', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenAddVendor = () => {
    setEditingVendor(null);
    setVendorName('');
    setPerMealRate('');
    setBillingFreq('Weekly');
    setIsVendorModalOpen(true);
  };

  const handleOpenEditVendor = (v: CateringVendor) => {
    setEditingVendor(v);
    setVendorName(v.name);
    setPerMealRate(v.perMealRate.toString());
    setBillingFreq(v.billingFrequency);
    setIsVendorModalOpen(true);
  };

  const handleSaveVendor = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userProfile?.companyId) return;
    try {
      if (editingVendor) {
        await updateCateringVendor(editingVendor.id, {
          name: vendorName,
          perMealRate: parseFloat(perMealRate) || 0,
          billingFrequency: billingFreq,
        });
        showToast('Vendor updated', 'success');
      } else {
        const isFirst = vendors.length === 0;
        await addCateringVendor({
          companyId: userProfile.companyId,
          name: vendorName,
          perMealRate: parseFloat(perMealRate) || 0,
          billingFrequency: billingFreq,
          isActive: isFirst
        });
        showToast('Vendor added', 'success');
      }
      setIsVendorModalOpen(false);
      loadData();
    } catch (err) {
      showToast('Failed to save vendor', 'error');
    }
  };

  const handleSetActiveVendor = async (id: string) => {
    try {
      const currentActive = vendors.find(v => v.isActive);
      if (currentActive && currentActive.id !== id) {
        await updateCateringVendor(currentActive.id, { isActive: false });
      }
      await updateCateringVendor(id, { isActive: true });
      showToast('Active vendor updated', 'success');
      loadData();
    } catch (err) {
      showToast('Failed to set active vendor', 'error');
    }
  };

  const handleDeleteVendor = async (id: string) => {
    if (!confirm('Are you sure you want to delete this vendor?')) return;
    try {
      await deleteCateringVendor(id);
      showToast('Vendor deleted', 'success');
      loadData();
    } catch (err) {
      showToast('Failed to delete vendor', 'error');
    }
  };

  const handleAddMeal = async (e: React.FormEvent) => {
    e.preventDefault();
    const activeVendor = vendors.find(v => v.isActive);
    if (!userProfile?.companyId || !activeVendor) {
      showToast('Please set an active vendor first', 'error');
      return;
    }
    try {
      await addMealRecord({
        companyId: userProfile.companyId,
        vendorId: activeVendor.id,
        date: mealDate,
        mealCount: parseInt(mealCount) || 1
      });
      showToast('Meal logged', 'success');
      setMealCount('');
      loadData();
    } catch (err) {
      showToast('Failed to log meal', 'error');
    }
  };

  const handleAddPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userProfile?.companyId || !selectedVendorForPay) return;
    try {
      await addCateringPayment({
        companyId: userProfile.companyId,
        vendorId: selectedVendorForPay,
        date: payDate,
        amount: parseFloat(payAmount) || 0
      });
      showToast('Payment recorded', 'success');
      setPayAmount('');
      setIsPaymentModalOpen(false);
      loadData();
    } catch (err) {
      showToast('Failed to record payment', 'error');
    }
  };

  // Derived filtered data
  const filteredMeals = meals.filter(m => {
    const d = new Date(m.date);
    return d.getMonth() + 1 === filterMonth && d.getFullYear() === filterYear;
  });
  const filteredPayments = payments.filter(p => {
    const d = new Date(p.date);
    return d.getMonth() + 1 === filterMonth && d.getFullYear() === filterYear;
  });

  const paginatedMeals = filteredMeals.slice((mealPage - 1) * ITEMS_PER_PAGE, mealPage * ITEMS_PER_PAGE);
  const paginatedPayments = filteredPayments.slice((paymentPage - 1) * ITEMS_PER_PAGE, paymentPage * ITEMS_PER_PAGE);

  const totalMealPages = Math.ceil(filteredMeals.length / ITEMS_PER_PAGE) || 1;
  const totalPaymentPages = Math.ceil(filteredPayments.length / ITEMS_PER_PAGE) || 1;

  const getBillingStats = (vendorId: string) => {
    const v = vendors.find(x => x.id === vendorId);
    if (!v) return { totalMeals: 0, totalCost: 0, totalPaid: 0, due: 0 };
    
    const vMeals = filteredMeals.filter(m => m.vendorId === vendorId);
    const totalMeals = vMeals.reduce((sum, m) => sum + m.mealCount, 0);
    const totalCost = totalMeals * v.perMealRate;
    
    const vPayments = filteredPayments.filter(p => p.vendorId === vendorId);
    const totalPaid = vPayments.reduce((sum, p) => sum + p.amount, 0);
    
    return {
      totalMeals,
      totalCost,
      totalPaid,
      due: totalCost - totalPaid
    };
  };

  const activeVendor = vendors.find(v => v.isActive);

  return (
    <div className="w-full mx-auto space-y-6 pb-20">
      <div className="bg-[#0f172a] p-4 sm:p-5 rounded-md border border-slate-800 shadow-md flex flex-wrap items-center justify-between gap-4 text-white">
        <div>
          <div className="flex flex-wrap items-center gap-2.5">
            <Coffee className="w-5 h-5 text-primary-400" />
            <h2 className="text-lg font-bold text-white uppercase tracking-wider">Food & Catering</h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">Manage vendor bills, daily meal records, and payments.</p>
        </div>

        <div className="flex items-center gap-3">
          <button 
            onClick={handleOpenAddVendor}
            className="flex items-center gap-2 px-4 py-2 bg-slate-800 text-white rounded-md hover:bg-slate-700 transition-colors text-xs font-bold shadow-md shadow-slate-950"
          >
            <Plus className="w-4 h-4" /> Add Vendor / Dokan
          </button>
          <button 
            onClick={() => setIsPaymentModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-500 transition-colors text-xs font-bold shadow-md shadow-emerald-950"
          >
            <CreditCard className="w-4 h-4" /> Record Payment
          </button>
        </div>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-md shadow-md overflow-hidden min-h-[400px]">
        {/* Tabs */}
        <div className="flex border-b border-slate-800 bg-slate-900/50 justify-between items-center flex-wrap">
          <div className="flex">
            {(['Vendors', 'Meals', 'Billing'] as const).map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-4 text-sm font-bold uppercase tracking-wider transition-colors ${
                  activeTab === tab 
                  ? 'text-primary-400 border-b-2 border-primary-500 bg-primary-500/5' 
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                }`}
              >
                {tab === 'Meals' ? 'Meal History' : tab}
              </button>
            ))}
          </div>
          {(activeTab === 'Meals' || activeTab === 'Billing') && (
            <div className="flex items-center gap-3 pr-4">
              <select value={filterMonth} onChange={e => { setFilterMonth(parseInt(e.target.value)); setMealPage(1); setPaymentPage(1); }} className="bg-slate-950 border border-slate-800 text-slate-300 text-xs rounded px-2 py-1.5 focus:outline-none focus:border-primary-500">
                {Array.from({length: 12}).map((_, i) => (
                  <option key={i+1} value={i+1}>{new Date(0, i).toLocaleString('default', { month: 'short' })}</option>
                ))}
              </select>
              <select value={filterYear} onChange={e => { setFilterYear(parseInt(e.target.value)); setMealPage(1); setPaymentPage(1); }} className="bg-slate-950 border border-slate-800 text-slate-300 text-xs rounded px-2 py-1.5 focus:outline-none focus:border-primary-500">
                {[2023, 2024, 2025, 2026, 2027, 2028].map(y => (
                  <option key={y} value={y}>{y}</option>
                ))}
              </select>
            </div>
          )}
        </div>

        <div className="p-6">
          {activeTab === 'Vendors' ? (
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white mb-4">Manage Vendors</h3>
              <div className="overflow-x-auto border border-slate-800 rounded-md bg-slate-950">
                <table className="w-full text-left text-sm text-slate-300">
                  <thead className="bg-slate-900/50 border-b border-slate-800 text-xs uppercase text-slate-500">
                    <tr>
                      <th className="px-4 py-3 font-semibold">Vendor Name</th>
                      <th className="px-4 py-3 font-semibold">Rate (৳)</th>
                      <th className="px-4 py-3 font-semibold">Billing Freq.</th>
                      <th className="px-4 py-3 font-semibold text-center">Status</th>
                      <th className="px-4 py-3 text-right font-semibold">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/50">
                    {vendors.map(v => (
                      <tr key={v.id} className="hover:bg-slate-800/30 transition-colors">
                        <td className="px-4 py-3 font-bold text-white flex items-center gap-2">
                          {v.name}
                          {v.isActive && <span className="bg-primary-500/10 text-primary-400 text-[10px] px-2 py-0.5 rounded border border-primary-500/20 uppercase">Primary</span>}
                        </td>
                        <td className="px-4 py-3 text-slate-400">{v.perMealRate}</td>
                        <td className="px-4 py-3 text-slate-400">{v.billingFrequency}</td>
                        <td className="px-4 py-3 text-center">
                          {!v.isActive ? (
                            <button onClick={() => handleSetActiveVendor(v.id)} className="text-[10px] font-bold uppercase px-2 py-1 bg-slate-800 hover:bg-slate-700 text-slate-400 rounded-md transition-colors">
                              Set Active
                            </button>
                          ) : (
                            <span className="text-[10px] font-bold uppercase px-2 py-1 text-emerald-400 flex items-center justify-center gap-1">
                              <CheckCircle className="w-3 h-3" /> Active
                            </span>
                          )}
                        </td>
                        <td className="px-4 py-3 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button onClick={() => handleOpenEditVendor(v)} className="p-1 text-slate-400 hover:text-white transition-colors">
                              <Edit className="w-4 h-4" />
                            </button>
                            <button onClick={() => handleDeleteVendor(v.id)} className="p-1 text-slate-400 hover:text-rose-400 transition-colors">
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                    {vendors.length === 0 && <tr><td colSpan={5} className="px-4 py-8 text-center text-slate-500">No vendors found.</td></tr>}
                  </tbody>
                </table>
              </div>
            </div>
          ) : activeTab === 'Meals' ? (
            <div className="grid md:grid-cols-3 gap-8">
              <div className="md:col-span-1">
                <h3 className="text-base font-bold text-slate-900 dark:text-white mb-4">Log Daily Meals</h3>
                {vendors.length === 0 ? (
                  <div className="text-sm text-slate-500">Please add a vendor first.</div>
                ) : !activeVendor ? (
                  <div className="text-sm text-rose-400 bg-rose-500/10 p-3 rounded border border-rose-500/20">Please set a vendor as Active in the Vendors tab.</div>
                ) : (
                  <form onSubmit={handleAddMeal} className="space-y-4">
                    <div className="p-3 bg-slate-950 border border-slate-800 rounded-md mb-2">
                      <p className="text-xs text-slate-400 uppercase tracking-wider mb-1">Active Vendor</p>
                      <p className="text-sm font-bold text-white flex items-center gap-2">
                        <Store className="w-4 h-4 text-primary-400" /> {activeVendor.name}
                      </p>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">Date</label>
                      <input required type="date" value={mealDate} onChange={e => setMealDate(e.target.value)} className="w-full px-3 py-2 text-sm border border-slate-800 rounded-md bg-slate-950 text-white focus:ring-2 focus:ring-primary-500" />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">Total Meals Count</label>
                      <input required type="number" min="1" value={mealCount} onChange={e => setMealCount(e.target.value)} className="w-full px-3 py-2 text-sm border border-slate-800 rounded-md bg-slate-950 text-white focus:ring-2 focus:ring-primary-500" placeholder="e.g. 15" />
                    </div>
                    <button type="submit" className="px-4 py-2 bg-primary-600 text-white rounded-md text-sm font-bold hover:bg-primary-500 w-full flex justify-center items-center gap-2 shadow-md">
                      <CheckCircle className="w-4 h-4" /> Save Meal Record
                    </button>
                  </form>
                )}
              </div>
              
              <div className="md:col-span-2">
                <h3 className="text-base font-bold text-slate-900 dark:text-white mb-4">Recent Meal Records</h3>
                <div className="overflow-x-auto border border-slate-800 rounded-md bg-slate-950">
                  <table className="w-full text-left text-sm text-slate-300">
                    <thead className="bg-slate-900/50 border-b border-slate-800 text-xs uppercase text-slate-500">
                      <tr>
                        <th className="px-4 py-3 font-semibold">Date</th>
                        <th className="px-4 py-3 font-semibold">Vendor</th>
                        <th className="px-4 py-3 font-semibold">Meals</th>
                        <th className="px-4 py-3 text-right font-semibold">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/50">
                      {paginatedMeals.map(m => (
                        <tr key={m.id} className="hover:bg-slate-800/30 transition-colors">
                          <td className="px-4 py-3 text-white">{m.date}</td>
                          <td className="px-4 py-3 text-slate-400">{vendors.find(v => v.id === m.vendorId)?.name || 'Unknown'}</td>
                          <td className="px-4 py-3 font-bold text-primary-400">{m.mealCount}</td>
                          <td className="px-4 py-3 text-right">
                            <button onClick={async () => { await deleteMealRecord(m.id); loadData(); }} className="text-rose-500 hover:text-rose-400 p-1 transition-colors">
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                      {filteredMeals.length === 0 && <tr><td colSpan={4} className="px-4 py-8 text-center text-slate-500">No meals found for this period.</td></tr>}
                    </tbody>
                  </table>
                </div>
                <div className="flex items-center justify-between mt-4 px-1">
                  <span className="text-xs text-slate-400">Showing {filteredMeals.length === 0 ? 0 : (mealPage - 1) * ITEMS_PER_PAGE + 1} to {Math.min(mealPage * ITEMS_PER_PAGE, filteredMeals.length)} of {filteredMeals.length}</span>
                  <div className="flex items-center gap-1">
                    <button disabled={mealPage === 1} onClick={() => setMealPage(p => p - 1)} className="px-2 py-1 bg-slate-800 text-slate-300 rounded text-xs disabled:opacity-50">Prev</button>
                    <span className="text-xs text-slate-400 px-2">Page {mealPage} of {totalMealPages}</span>
                    <button disabled={mealPage === totalMealPages} onClick={() => setMealPage(p => p + 1)} className="px-2 py-1 bg-slate-800 text-slate-300 rounded text-xs disabled:opacity-50">Next</button>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-8">
              {/* Billing Summary Cards */}
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {vendors.map(v => {
                  const stats = getBillingStats(v.id);
                  return (
                    <div key={v.id} className="p-5 border border-slate-800 rounded-md bg-slate-950 shadow-md">
                      <div className="flex justify-between items-start mb-4 border-b border-slate-800/60 pb-3">
                        <div className="font-bold text-white text-base flex items-center gap-2">
                          {v.name}
                          {v.isActive && <span className="bg-primary-500/10 text-primary-400 text-[10px] px-2 py-0.5 rounded border border-primary-500/20 uppercase">Primary</span>}
                        </div>
                        <span className="text-[10px] font-bold uppercase px-2 py-1 bg-primary-500/10 text-primary-400 border border-primary-500/20 rounded-md">
                          {v.billingFrequency}
                        </span>
                      </div>
                      <div className="space-y-3 text-sm">
                        <div className="flex justify-between text-slate-400 font-medium">
                          <span>Rate</span> <span className="text-white">৳ {v.perMealRate}</span>
                        </div>
                        <div className="flex justify-between text-slate-400 font-medium">
                          <span>Period Meals</span> <span className="font-bold text-white">{stats.totalMeals}</span>
                        </div>
                        <div className="flex justify-between text-slate-400 font-medium">
                          <span>Period Cost</span> <span className="font-bold text-white">৳ {stats.totalCost}</span>
                        </div>
                        <div className="flex justify-between text-emerald-400 border-t border-slate-800/60 pt-3">
                          <span className="font-semibold">Period Paid</span> <span className="font-bold">৳ {stats.totalPaid}</span>
                        </div>
                        <div className="flex justify-between text-rose-400 font-bold bg-rose-500/10 p-2 rounded border border-rose-500/20">
                          <span>Period Due</span> <span>৳ {stats.due}</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="mt-8">
                <h3 className="text-base font-bold text-slate-900 dark:text-white mb-4">Payment History</h3>
                <div className="overflow-x-auto border border-slate-800 rounded-md bg-slate-950">
                  <table className="w-full text-left text-sm text-slate-300">
                    <thead className="bg-slate-900/50 border-b border-slate-800 text-xs uppercase text-slate-500">
                      <tr>
                        <th className="px-4 py-3 font-semibold">Date</th>
                        <th className="px-4 py-3 font-semibold">Vendor</th>
                        <th className="px-4 py-3 font-semibold">Amount</th>
                        <th className="px-4 py-3 text-right font-semibold">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/50">
                      {paginatedPayments.map(p => (
                        <tr key={p.id} className="hover:bg-slate-800/30 transition-colors">
                          <td className="px-4 py-3 text-white">{p.date}</td>
                          <td className="px-4 py-3 text-slate-400">{vendors.find(v => v.id === p.vendorId)?.name || 'Unknown'}</td>
                          <td className="px-4 py-3 font-bold text-emerald-400">৳ {p.amount}</td>
                          <td className="px-4 py-3 text-right">
                            <button onClick={async () => { await deleteCateringPayment(p.id); loadData(); }} className="text-rose-500 hover:text-rose-400 p-1 transition-colors">
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                      {filteredPayments.length === 0 && <tr><td colSpan={4} className="px-4 py-8 text-center text-slate-500">No payments found for this period.</td></tr>}
                    </tbody>
                  </table>
                </div>
                <div className="flex items-center justify-between mt-4 px-1">
                  <span className="text-xs text-slate-400">Showing {filteredPayments.length === 0 ? 0 : (paymentPage - 1) * ITEMS_PER_PAGE + 1} to {Math.min(paymentPage * ITEMS_PER_PAGE, filteredPayments.length)} of {filteredPayments.length}</span>
                  <div className="flex items-center gap-1">
                    <button disabled={paymentPage === 1} onClick={() => setPaymentPage(p => p - 1)} className="px-2 py-1 bg-slate-800 text-slate-300 rounded text-xs disabled:opacity-50">Prev</button>
                    <span className="text-xs text-slate-400 px-2">Page {paymentPage} of {totalPaymentPages}</span>
                    <button disabled={paymentPage === totalPaymentPages} onClick={() => setPaymentPage(p => p + 1)} className="px-2 py-1 bg-slate-800 text-slate-300 rounded text-xs disabled:opacity-50">Next</button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Add/Edit Vendor Modal */}
      {isVendorModalOpen && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 rounded-md border border-slate-800 shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between p-4 border-b border-slate-800 bg-slate-950">
              <h3 className="font-bold text-white flex items-center gap-2">
                <Store className="w-4 h-4 text-primary-400" /> {editingVendor ? 'Edit Vendor' : 'Add Vendor / Dokan'}
              </h3>
              <button onClick={() => setIsVendorModalOpen(false)} className="text-slate-400 hover:text-white transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSaveVendor} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">Vendor Name</label>
                <input required type="text" value={vendorName} onChange={e => setVendorName(e.target.value)} className="w-full px-3 py-2 text-sm border border-slate-800 rounded-md bg-slate-950 text-white focus:ring-2 focus:ring-primary-500" placeholder="e.g. Rahim Dokan" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">Per Meal Rate (৳)</label>
                <input required type="number" step="0.01" min="0" value={perMealRate} onChange={e => setPerMealRate(e.target.value)} className="w-full px-3 py-2 text-sm border border-slate-800 rounded-md bg-slate-950 text-white focus:ring-2 focus:ring-primary-500" placeholder="e.g. 50" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">Billing Frequency</label>
                <select value={billingFreq} onChange={e => setBillingFreq(e.target.value as any)} className="w-full px-3 py-2 text-sm border border-slate-800 rounded-md bg-slate-950 text-white focus:ring-2 focus:ring-primary-500">
                  <option value="Daily">Daily</option>
                  <option value="Weekly">Weekly</option>
                  <option value="Monthly">Monthly</option>
                </select>
              </div>
              <div className="pt-4 flex justify-end gap-3">
                <button type="button" onClick={() => setIsVendorModalOpen(false)} className="px-4 py-2 text-sm font-bold text-slate-400 hover:text-white transition-colors">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-primary-600 text-white rounded-md text-sm font-bold hover:bg-primary-500 shadow-md transition-colors">
                  Save Vendor
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Record Payment Modal */}
      {isPaymentModalOpen && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 rounded-md border border-slate-800 shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between p-4 border-b border-slate-800 bg-slate-950">
              <h3 className="font-bold text-white flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-emerald-400" /> Record Payment
              </h3>
              <button onClick={() => setIsPaymentModalOpen(false)} className="text-slate-400 hover:text-white transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleAddPayment} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">Vendor</label>
                <select required value={selectedVendorForPay} onChange={e => setSelectedVendorForPay(e.target.value)} className="w-full px-3 py-2 text-sm border border-slate-800 rounded-md bg-slate-950 text-white focus:ring-2 focus:ring-primary-500">
                  {vendors.map(v => <option key={v.id} value={v.id}>{v.name}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">Date</label>
                <input required type="date" value={payDate} onChange={e => setPayDate(e.target.value)} className="w-full px-3 py-2 text-sm border border-slate-800 rounded-md bg-slate-950 text-white focus:ring-2 focus:ring-primary-500" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">Amount Paid (৳)</label>
                <input required type="number" step="0.01" min="1" value={payAmount} onChange={e => setPayAmount(e.target.value)} className="w-full px-3 py-2 text-sm border border-slate-800 rounded-md bg-slate-950 text-white focus:ring-2 focus:ring-primary-500" placeholder="e.g. 500" />
              </div>
              <div className="pt-4 flex justify-end gap-3">
                <button type="button" onClick={() => setIsPaymentModalOpen(false)} className="px-4 py-2 text-sm font-bold text-slate-400 hover:text-white transition-colors">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-emerald-600 text-white rounded-md text-sm font-bold hover:bg-emerald-500 shadow-md transition-colors">
                  Record Payment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
