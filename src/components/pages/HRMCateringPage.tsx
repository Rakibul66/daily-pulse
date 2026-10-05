import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Coffee, Plus, Store, CheckCircle, Calculator, CreditCard, Trash2 } from 'lucide-react';
import { CateringVendor, MealRecord, CateringPayment } from '@/types/catering';
import { getCateringVendors, addCateringVendor, getMealRecords, addMealRecord, deleteMealRecord, getCateringPayments, addCateringPayment, deleteCateringPayment } from '@/lib/cateringStorage';

interface Props {
  showToast: (msg: string, type: 'success' | 'error') => void;
}

export const HRMCateringPage: React.FC<Props> = ({ showToast }) => {
  const { user, userProfile } = useAuth();
  const [activeTab, setActiveTab] = useState<'Vendors' | 'Meals' | 'Billing'>('Meals');
  
  const [vendors, setVendors] = useState<CateringVendor[]>([]);
  const [meals, setMeals] = useState<MealRecord[]>([]);
  const [payments, setPayments] = useState<CateringPayment[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Vendor form
  const [vendorName, setVendorName] = useState('');
  const [perMealRate, setPerMealRate] = useState('');
  const [billingFreq, setBillingFreq] = useState<'Daily' | 'Weekly' | 'Monthly'>('Weekly');

  // Meal form
  const [selectedVendorForMeal, setSelectedVendorForMeal] = useState('');
  const [mealDate, setMealDate] = useState(new Date().toISOString().split('T')[0]);
  const [mealCount, setMealCount] = useState('');

  // Payment form
  const [selectedVendorForPay, setSelectedVendorForPay] = useState('');
  const [payDate, setPayDate] = useState(new Date().toISOString().split('T')[0]);
  const [payAmount, setPayAmount] = useState('');

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
        if (!selectedVendorForMeal) setSelectedVendorForMeal(v[0].id);
        if (!selectedVendorForPay) setSelectedVendorForPay(v[0].id);
      }
    } catch (err) {
      console.error(err);
      showToast('Error loading data', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddVendor = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !userProfile?.companyId) return;
    try {
      await addCateringVendor({
        companyId: userProfile?.companyId || '',
        name: vendorName,
        perMealRate: parseFloat(perMealRate),
        billingFrequency: billingFreq
      });
      showToast('Vendor added', 'success');
      setVendorName('');
      setPerMealRate('');
      loadData();
    } catch (e) {
      showToast('Error adding vendor', 'error');
    }
  };

  const handleAddMeal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !selectedVendorForMeal) return;
    try {
      await addMealRecord({
        companyId: userProfile?.companyId || '',
        vendorId: selectedVendorForMeal,
        date: mealDate,
        mealCount: parseInt(mealCount, 10)
      });
      showToast('Meal logged', 'success');
      setMealCount('');
      loadData();
    } catch (e) {
      showToast('Error logging meal', 'error');
    }
  };

  const handleAddPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !selectedVendorForPay) return;
    try {
      await addCateringPayment({
        companyId: userProfile?.companyId || '',
        vendorId: selectedVendorForPay,
        date: payDate,
        amount: parseFloat(payAmount)
      });
      showToast('Payment recorded', 'success');
      setPayAmount('');
      loadData();
    } catch (e) {
      showToast('Error recording payment', 'error');
    }
  };

  // Billing Calculation
  const getBillingStats = (vid: string) => {
    const vendor = vendors.find(v => v.id === vid);
    if (!vendor) return { totalMeals: 0, totalCost: 0, totalPaid: 0, due: 0 };
    
    const vMeals = meals.filter(m => m.vendorId === vid);
    const vPays = payments.filter(p => p.vendorId === vid);
    
    const totalMeals = vMeals.reduce((sum, m) => sum + m.mealCount, 0);
    const totalCost = totalMeals * vendor.perMealRate;
    const totalPaid = vPays.reduce((sum, p) => sum + p.amount, 0);
    
    return {
      totalMeals,
      totalCost,
      totalPaid,
      due: totalCost - totalPaid
    };
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
            <Coffee className="w-6 h-6 text-primary-600" />
            Office Catering & Meals
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Manage daily meals, vendor setups, and weekly/monthly billing.</p>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xs border border-slate-200 dark:border-slate-800 overflow-hidden">
        <div className="flex overflow-x-auto border-b border-slate-200 dark:border-slate-800">
          {(['Vendors', 'Meals', 'Billing'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-4 text-sm font-bold whitespace-nowrap transition-colors ${
                activeTab === tab 
                  ? 'text-primary-600 border-b-2 border-primary-600' 
                  : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="p-6">
          {isLoading ? (
            <div className="py-10 text-center text-slate-500">Loading data...</div>
          ) : activeTab === 'Vendors' ? (
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white mb-4">Add Vendor / Dokan</h3>
                <form onSubmit={handleAddVendor} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Vendor Name</label>
                    <input required type="text" value={vendorName} onChange={e => setVendorName(e.target.value)} className="w-full px-3 py-2 text-sm border border-slate-200 dark:border-slate-700 rounded-lg dark:bg-slate-800 dark:text-white focus:ring-2 focus:ring-primary-500" placeholder="e.g. Rahim Dokan" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Per Meal Rate ($ / Tk)</label>
                    <input required type="number" step="0.01" value={perMealRate} onChange={e => setPerMealRate(e.target.value)} className="w-full px-3 py-2 text-sm border border-slate-200 dark:border-slate-700 rounded-lg dark:bg-slate-800 dark:text-white focus:ring-2 focus:ring-primary-500" placeholder="e.g. 50" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Billing Frequency</label>
                    <select value={billingFreq} onChange={e => setBillingFreq(e.target.value as any)} className="w-full px-3 py-2 text-sm border border-slate-200 dark:border-slate-700 rounded-lg dark:bg-slate-800 dark:text-white focus:ring-2 focus:ring-primary-500">
                      <option value="Daily">Daily</option>
                      <option value="Weekly">Weekly</option>
                      <option value="Monthly">Monthly</option>
                    </select>
                  </div>
                  <button type="submit" className="px-4 py-2 bg-primary-600 text-white rounded-lg text-sm font-bold hover:bg-primary-700 w-full">Save Vendor</button>
                </form>
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white mb-4">Saved Vendors</h3>
                <div className="space-y-3">
                  {vendors.map(v => (
                    <div key={v.id} className="p-4 border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-950/50 flex items-center justify-between">
                      <div>
                        <div className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                          <Store className="w-4 h-4 text-primary-500" /> {v.name}
                        </div>
                        <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                          Rate: {v.perMealRate} • Bills {v.billingFrequency}
                        </div>
                      </div>
                    </div>
                  ))}
                  {vendors.length === 0 && (
                    <div className="text-sm text-slate-500 dark:text-slate-400 text-center py-4">No vendors setup yet.</div>
                  )}
                </div>
              </div>
            </div>
          ) : activeTab === 'Meals' ? (
            <div className="grid md:grid-cols-3 gap-8">
              <div className="md:col-span-1">
                <h3 className="text-base font-bold text-slate-900 dark:text-white mb-4">Log Today's Meals</h3>
                {vendors.length === 0 ? (
                  <div className="text-sm text-rose-500 bg-rose-50 dark:bg-rose-900/20 p-3 rounded-lg">Please add a vendor first.</div>
                ) : (
                  <form onSubmit={handleAddMeal} className="space-y-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Vendor</label>
                      <select required value={selectedVendorForMeal} onChange={e => setSelectedVendorForMeal(e.target.value)} className="w-full px-3 py-2 text-sm border border-slate-200 dark:border-slate-700 rounded-lg dark:bg-slate-800 dark:text-white focus:ring-2 focus:ring-primary-500">
                        {vendors.map(v => <option key={v.id} value={v.id}>{v.name}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Date</label>
                      <input required type="date" value={mealDate} onChange={e => setMealDate(e.target.value)} className="w-full px-3 py-2 text-sm border border-slate-200 dark:border-slate-700 rounded-lg dark:bg-slate-800 dark:text-white focus:ring-2 focus:ring-primary-500" />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Number of Meals (Persons)</label>
                      <input required type="number" min="1" value={mealCount} onChange={e => setMealCount(e.target.value)} className="w-full px-3 py-2 text-sm border border-slate-200 dark:border-slate-700 rounded-lg dark:bg-slate-800 dark:text-white focus:ring-2 focus:ring-primary-500" placeholder="e.g. 3" />
                    </div>
                    <button type="submit" className="px-4 py-2 bg-primary-600 text-white rounded-lg text-sm font-bold hover:bg-primary-700 w-full">Log Meals</button>
                  </form>
                )}
              </div>
              <div className="md:col-span-2">
                <h3 className="text-base font-bold text-slate-900 dark:text-white mb-4">Meal Log History</h3>
                <div className="overflow-x-auto border border-slate-200 dark:border-slate-700 rounded-xl">
                  <table className="w-full text-left text-sm">
                    <thead className="bg-slate-50 dark:bg-slate-950 border-b border-slate-200 dark:border-slate-700 text-xs uppercase text-slate-500">
                      <tr>
                        <th className="px-4 py-3">Date</th>
                        <th className="px-4 py-3">Vendor</th>
                        <th className="px-4 py-3">Meals</th>
                        <th className="px-4 py-3 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800/50">
                      {meals.map(m => (
                        <tr key={m.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                          <td className="px-4 py-3 text-slate-900 dark:text-white">{m.date}</td>
                          <td className="px-4 py-3 text-slate-600 dark:text-slate-400">{vendors.find(v => v.id === m.vendorId)?.name || 'Unknown'}</td>
                          <td className="px-4 py-3 font-bold text-primary-600">{m.mealCount}</td>
                          <td className="px-4 py-3 text-right">
                            <button onClick={async () => { await deleteMealRecord(m.id); loadData(); }} className="text-rose-500 hover:text-rose-700 p-1">
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                      {meals.length === 0 && <tr><td colSpan={4} className="px-4 py-8 text-center text-slate-500">No meals logged yet.</td></tr>}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-8">
              {/* Billing Summary Cards */}
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {vendors.map(v => {
                  const stats = getBillingStats(v.id);
                  return (
                    <div key={v.id} className="p-5 border border-slate-200 dark:border-slate-700 rounded-2xl bg-slate-50 dark:bg-slate-950/50">
                      <div className="flex justify-between items-start mb-4">
                        <div className="font-bold text-slate-900 dark:text-white text-base">{v.name}</div>
                        <span className="text-[10px] font-bold uppercase px-2 py-1 bg-primary-100 dark:bg-primary-900/40 text-primary-700 dark:text-primary-400 rounded-md">
                          {v.billingFrequency}
                        </span>
                      </div>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between text-slate-600 dark:text-slate-400">
                          <span>Rate</span> <span>{v.perMealRate}</span>
                        </div>
                        <div className="flex justify-between text-slate-600 dark:text-slate-400">
                          <span>Total Meals</span> <span className="font-semibold text-slate-900 dark:text-white">{stats.totalMeals}</span>
                        </div>
                        <div className="flex justify-between text-slate-600 dark:text-slate-400">
                          <span>Total Cost</span> <span className="font-semibold text-slate-900 dark:text-white">{stats.totalCost}</span>
                        </div>
                        <div className="flex justify-between text-emerald-600 dark:text-emerald-400 border-t border-slate-200 dark:border-slate-700 pt-2">
                          <span>Paid</span> <span className="font-bold">{stats.totalPaid}</span>
                        </div>
                        <div className="flex justify-between text-rose-600 dark:text-rose-400 font-bold">
                          <span>Due</span> <span>{stats.due}</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="grid md:grid-cols-3 gap-8">
                <div className="md:col-span-1">
                  <h3 className="text-base font-bold text-slate-900 dark:text-white mb-4">Record Payment</h3>
                  {vendors.length === 0 ? (
                    <div className="text-sm text-slate-500">No vendors.</div>
                  ) : (
                    <form onSubmit={handleAddPayment} className="space-y-4">
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Vendor</label>
                        <select required value={selectedVendorForPay} onChange={e => setSelectedVendorForPay(e.target.value)} className="w-full px-3 py-2 text-sm border border-slate-200 dark:border-slate-700 rounded-lg dark:bg-slate-800 dark:text-white focus:ring-2 focus:ring-primary-500">
                          {vendors.map(v => <option key={v.id} value={v.id}>{v.name}</option>)}
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Date</label>
                        <input required type="date" value={payDate} onChange={e => setPayDate(e.target.value)} className="w-full px-3 py-2 text-sm border border-slate-200 dark:border-slate-700 rounded-lg dark:bg-slate-800 dark:text-white focus:ring-2 focus:ring-primary-500" />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Amount Paid</label>
                        <input required type="number" step="0.01" min="1" value={payAmount} onChange={e => setPayAmount(e.target.value)} className="w-full px-3 py-2 text-sm border border-slate-200 dark:border-slate-700 rounded-lg dark:bg-slate-800 dark:text-white focus:ring-2 focus:ring-primary-500" placeholder="e.g. 500" />
                      </div>
                      <button type="submit" className="px-4 py-2 bg-emerald-600 text-white rounded-lg text-sm font-bold hover:bg-emerald-700 w-full flex justify-center items-center gap-2">
                        <CreditCard className="w-4 h-4" /> Pay Bill
                      </button>
                    </form>
                  )}
                </div>
                
                <div className="md:col-span-2">
                  <h3 className="text-base font-bold text-slate-900 dark:text-white mb-4">Payment History</h3>
                  <div className="overflow-x-auto border border-slate-200 dark:border-slate-700 rounded-xl">
                    <table className="w-full text-left text-sm">
                      <thead className="bg-slate-50 dark:bg-slate-950 border-b border-slate-200 dark:border-slate-700 text-xs uppercase text-slate-500">
                        <tr>
                          <th className="px-4 py-3">Date</th>
                          <th className="px-4 py-3">Vendor</th>
                          <th className="px-4 py-3">Amount</th>
                          <th className="px-4 py-3 text-right">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 dark:divide-slate-800/50">
                        {payments.map(p => (
                          <tr key={p.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                            <td className="px-4 py-3 text-slate-900 dark:text-white">{p.date}</td>
                            <td className="px-4 py-3 text-slate-600 dark:text-slate-400">{vendors.find(v => v.id === p.vendorId)?.name || 'Unknown'}</td>
                            <td className="px-4 py-3 font-bold text-emerald-600">{p.amount}</td>
                            <td className="px-4 py-3 text-right">
                              <button onClick={async () => { await deleteCateringPayment(p.id); loadData(); }} className="text-rose-500 hover:text-rose-700 p-1">
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </td>
                          </tr>
                        ))}
                        {payments.length === 0 && <tr><td colSpan={4} className="px-4 py-8 text-center text-slate-500">No payments recorded.</td></tr>}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
