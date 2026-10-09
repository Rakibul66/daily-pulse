"use client";

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Plus, CreditCard } from 'lucide-react';
import { CateringVendor, MealRecord, CateringPayment } from '@/types/catering';
import { 
  getCateringVendors, 
  addCateringVendor, 
  updateCateringVendor, 
  deleteCateringVendor, 
  getMealRecords, 
  addMealRecord, 
  deleteMealRecord, 
  getCateringPayments, 
  addCateringPayment, 
  deleteCateringPayment 
} from '@/lib/cateringStorage';
import { CateringMealsTab } from './hrm/catering/CateringMealsTab';
import { CateringVendorsTab } from './hrm/catering/CateringVendorsTab';
import { CateringBillingTab } from './hrm/catering/CateringBillingTab';
import { CateringVendorModal } from './hrm/catering/CateringVendorModal';
import { CateringPaymentModal } from './hrm/catering/CateringPaymentModal';

interface Props {
  showToast: (msg: string, type: 'success' | 'error') => void;
}

export const HRMCateringPage: React.FC<Props> = ({ showToast }) => {
  const { user, userProfile } = useAuth();
  const effectiveCompanyId = userProfile?.companyId || user?.uid;

  const [activeTab, setActiveTab] = useState<'Vendors' | 'Meals' | 'Billing'>('Meals');
  
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
  const [perMealRate, setPerMealRate] = useState('130');
  const [billingFreq, setBillingFreq] = useState<'Daily' | 'Weekly' | 'Monthly'>('Weekly');

  // Meal form
  const [mealDate, setMealDate] = useState(new Date().toISOString().split('T')[0]);
  const [mealCount, setMealCount] = useState('10');
  const [mealRate, setMealRate] = useState('130');
  const [mealMenu, setMealMenu] = useState('');
  const [isLoggingMeal, setIsLoggingMeal] = useState(false);

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
    if (effectiveCompanyId) {
      loadData();
    }
  }, [effectiveCompanyId]);

  const loadData = async () => {
    if (!effectiveCompanyId) return;
    setIsLoading(true);
    try {
      const v = await getCateringVendors(effectiveCompanyId);
      setVendors(v);
      const m = await getMealRecords(effectiveCompanyId);
      setMeals(m);
      const p = await getCateringPayments(effectiveCompanyId);
      setPayments(p);

      if (v.length > 0) {
        if (!selectedVendorForPay) setSelectedVendorForPay(v[0].id);
        const active = v.find(x => x.isActive) || v[0];
        if (active && (!mealRate || mealRate === '130')) {
          setMealRate(active.perMealRate?.toString() || '130');
        }
      }
    } catch (err) {
      console.error(err);
      showToast('Error loading catering records', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenAddVendor = () => {
    setEditingVendor(null);
    setVendorName('');
    setPerMealRate('130');
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
    if (!effectiveCompanyId) return;
    try {
      if (editingVendor) {
        await updateCateringVendor(editingVendor.id, {
          name: vendorName.trim(),
          perMealRate: parseFloat(perMealRate) || 130,
          billingFrequency: billingFreq,
        });
        showToast('Vendor updated successfully', 'success');
      } else {
        const isFirst = vendors.length === 0;
        await addCateringVendor({
          companyId: effectiveCompanyId,
          name: vendorName.trim(),
          perMealRate: parseFloat(perMealRate) || 130,
          billingFrequency: billingFreq,
          isActive: isFirst
        });
        showToast('Vendor added successfully', 'success');
      }
      setIsVendorModalOpen(false);
      loadData();
    } catch (err) {
      console.error(err);
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
      
      const v = vendors.find(x => x.id === id);
      if (v) {
        setMealRate(v.perMealRate?.toString() || '130');
      }
      loadData();
    } catch (err) {
      console.error(err);
      showToast('Failed to set active vendor', 'error');
    }
  };

  const handleDeleteVendor = async (id: string) => {
    if (!confirm('Are you sure you want to delete this vendor?')) return;
    try {
      await deleteCateringVendor(id);
      showToast('Vendor deleted successfully', 'success');
      loadData();
    } catch (err) {
      console.error(err);
      showToast('Failed to delete vendor', 'error');
    }
  };

  const handleAddMeal = async (e: React.FormEvent) => {
    e.preventDefault();
    const activeVendor = vendors.find(v => v.isActive) || vendors[0];
    if (!effectiveCompanyId || !activeVendor) {
      showToast('Please add and set an active vendor first', 'error');
      return;
    }

    const count = parseInt(mealCount) || 1;
    const rate = parseFloat(mealRate) || activeVendor.perMealRate || 130;
    const totalCost = count * rate;

    setIsLoggingMeal(true);
    try {
      const mealRecordData: Omit<MealRecord, 'id' | 'createdAt'> = {
        companyId: effectiveCompanyId,
        vendorId: activeVendor.id,
        date: mealDate,
        mealCount: count,
        perMealRate: rate,
        totalCost: totalCost,
      };

      if (mealMenu.trim()) {
        mealRecordData.menuItem = mealMenu.trim();
      }

      await addMealRecord(mealRecordData);
      showToast(`Logged ${count} meals @ ৳${rate} (Total: ৳${totalCost.toLocaleString()})`, 'success');
      setMealMenu('');
      loadData();
    } catch (err) {
      console.error(err);
      showToast('Failed to log meal', 'error');
    } finally {
      setIsLoggingMeal(false);
    }
  };

  const handleAddPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!effectiveCompanyId || !selectedVendorForPay) return;
    try {
      await addCateringPayment({
        companyId: effectiveCompanyId,
        vendorId: selectedVendorForPay,
        date: payDate,
        amount: parseFloat(payAmount) || 0
      });
      showToast('Payment recorded successfully', 'success');
      setPayAmount('');
      setIsPaymentModalOpen(false);
      loadData();
    } catch (err) {
      console.error(err);
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
    const totalCost = vMeals.reduce((sum, m) => sum + (m.totalCost ?? (m.mealCount * (m.perMealRate || v.perMealRate || 130))), 0);
    
    const vPayments = filteredPayments.filter(p => p.vendorId === vendorId);
    const totalPaid = vPayments.reduce((sum, p) => sum + p.amount, 0);
    
    return {
      totalMeals,
      totalCost,
      totalPaid,
      due: totalCost - totalPaid
    };
  };

  const activeVendor = vendors.find(v => v.isActive) || vendors[0];

  return (
    <div className="w-full space-y-6 pb-24 px-0">
      {/* 1. Header Command Bar */}
      <div className="bg-white border-4 border-black p-5 shadow-[6px_6px_0px_#000] flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-3 h-3 bg-amber-400 border border-black inline-block" />
            <h1 className="font-display font-black text-2xl uppercase tracking-tight text-black">
              FOOD & CATERING MANAGEMENT
            </h1>
          </div>
          <p className="text-xs font-bold text-slate-600 uppercase tracking-wider">
            Daily Meal Logs & Vendor Settlement
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button 
            onClick={handleOpenAddVendor}
            className="flex items-center gap-2 px-4 py-2 bg-white hover:bg-slate-100 text-black border-2 border-black shadow-[3px_3px_0px_#000] text-xs font-black uppercase tracking-wider transition-all active:translate-x-0.5 active:translate-y-0.5 cursor-pointer"
          >
            <Plus className="w-4 h-4" /> + VENDOR / DOKAN
          </button>
          <button 
            onClick={() => setIsPaymentModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-black border-2 border-black shadow-[3px_3px_0px_#000] text-xs font-black uppercase tracking-wider transition-all active:translate-x-0.5 active:translate-y-0.5 cursor-pointer"
          >
            <CreditCard className="w-4 h-4" /> RECORD PAYMENT
          </button>
        </div>
      </div>

      {/* 2. Navigation Tabs */}
      <div className="bg-white border-4 border-black shadow-[8px_8px_0px_#000] overflow-hidden">
        <div className="flex border-b-2 border-black bg-slate-50 justify-between items-center flex-wrap">
          <div className="flex">
            {(['Meals', 'Vendors', 'Billing'] as const).map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-3.5 text-xs font-black uppercase tracking-wider border-r-2 border-black transition-colors cursor-pointer ${
                  activeTab === tab 
                  ? 'bg-amber-300 text-black' 
                  : 'bg-white text-slate-700 hover:bg-slate-100'
                }`}
              >
                {tab === 'Meals' ? 'LOG & DAILY MEALS' : tab === 'Vendors' ? 'VENDORS & RATES' : 'BILLING & PAYMENTS'}
              </button>
            ))}
          </div>

          {(activeTab === 'Meals' || activeTab === 'Billing') && (
            <div className="flex items-center gap-2 p-2 pr-4">
              <span className="text-[10px] font-black uppercase text-black">FILTER:</span>
              <select 
                value={filterMonth} 
                onChange={e => { setFilterMonth(parseInt(e.target.value)); setMealPage(1); setPaymentPage(1); }} 
                className="bg-white border-2 border-black text-black text-xs font-bold px-2 py-1 shadow-[2px_2px_0px_#000]"
              >
                {Array.from({length: 12}).map((_, i) => (
                  <option key={i+1} value={i+1}>{new Date(0, i).toLocaleString('default', { month: 'short' })}</option>
                ))}
              </select>
              <select 
                value={filterYear} 
                onChange={e => { setFilterYear(parseInt(e.target.value)); setMealPage(1); setPaymentPage(1); }} 
                className="bg-white border-2 border-black text-black text-xs font-bold px-2 py-1 shadow-[2px_2px_0px_#000]"
              >
                {[2024, 2025, 2026, 2027].map(y => (
                  <option key={y} value={y}>{y}</option>
                ))}
              </select>
            </div>
          )}
        </div>

        <div className="p-6">
          {activeTab === 'Meals' ? (
            <CateringMealsTab
              vendors={vendors}
              activeVendor={activeVendor}
              mealDate={mealDate}
              setMealDate={setMealDate}
              mealCount={mealCount}
              setMealCount={setMealCount}
              mealRate={mealRate}
              setMealRate={setMealRate}
              mealMenu={mealMenu}
              setMealMenu={setMealMenu}
              isLoggingMeal={isLoggingMeal}
              onAddMeal={handleAddMeal}
              filteredMeals={filteredMeals}
              paginatedMeals={paginatedMeals}
              mealPage={mealPage}
              setMealPage={setMealPage}
              totalMealPages={totalMealPages}
              itemsPerPage={ITEMS_PER_PAGE}
              onDeleteMeal={async (id) => {
                await deleteMealRecord(id);
                showToast('Meal record deleted', 'success');
                loadData();
              }}
            />
          ) : activeTab === 'Vendors' ? (
            <CateringVendorsTab
              vendors={vendors}
              onOpenAddVendor={handleOpenAddVendor}
              onOpenEditVendor={handleOpenEditVendor}
              onSetActiveVendor={handleSetActiveVendor}
              onDeleteVendor={handleDeleteVendor}
            />
          ) : (
            <CateringBillingTab
              vendors={vendors}
              getBillingStats={getBillingStats}
              onOpenPaymentModal={() => setIsPaymentModalOpen(true)}
              paginatedPayments={paginatedPayments}
              filteredPayments={filteredPayments}
              paymentPage={paymentPage}
              setPaymentPage={setPaymentPage}
              totalPaymentPages={totalPaymentPages}
              itemsPerPage={ITEMS_PER_PAGE}
              onDeletePayment={async (id) => {
                await deleteCateringPayment(id);
                showToast('Payment record deleted', 'success');
                loadData();
              }}
            />
          )}
        </div>
      </div>

      {/* Modal: Add/Edit Vendor */}
      <CateringVendorModal
        isOpen={isVendorModalOpen}
        onClose={() => setIsVendorModalOpen(false)}
        editingVendor={editingVendor}
        vendorName={vendorName}
        setVendorName={setVendorName}
        perMealRate={perMealRate}
        setPerMealRate={setPerMealRate}
        billingFreq={billingFreq}
        setBillingFreq={setBillingFreq}
        onSave={handleSaveVendor}
      />

      {/* Modal: Record Payment */}
      <CateringPaymentModal
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        vendors={vendors}
        selectedVendorForPay={selectedVendorForPay}
        setSelectedVendorForPay={setSelectedVendorForPay}
        payDate={payDate}
        setPayDate={setPayDate}
        payAmount={payAmount}
        setPayAmount={setPayAmount}
        onSave={handleAddPayment}
      />
    </div>
  );
};
