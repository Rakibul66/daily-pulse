"use client";

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { 
  Users, 
  FileText, 
  Package, 
  PieChart, 
  Briefcase, 
  MonitorSmartphone, 
  Coffee, 
  HelpCircle,
  TrendingUp,
  AlertTriangle,
  ArrowRight,
  ScanBarcode,
  ShoppingBag,
  CreditCard,
  Plus,
  Clock,
  Sparkles,
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';
import { getCustomers } from '@/lib/customerStorage';
import { getEmployees } from '@/lib/hrmStorage';
import { getSalesInvoices } from '@/lib/salesStorage';
import { getProducts } from '@/lib/inventoryStorage';
import { getAssets } from '@/lib/assetsStorage';
import { getCateringVendors } from '@/lib/cateringStorage';
import { getLostItems } from '@/lib/lostAndFoundStorage';
import { DailySale } from '@/types/sales';
import { Product } from '@/types/inventory';
import { AdminPageId } from '@/components/layout/Sidebar';

interface Props {
  showToast: (msg: string, type: 'success'|'error') => void;
  onNavigate?: (pageId: AdminPageId) => void;
}

export const MainDashboardPage: React.FC<Props> = ({ showToast, onNavigate }) => {
  const { user, userProfile } = useAuth();
  const effectiveCompanyId = userProfile?.companyId || user?.uid;
  
  const [stats, setStats] = useState({
    customers: 0,
    employees: 0,
    totalSales: 0,
    totalCollected: 0,
    products: 0,
    stockValue: 0,
    assets: 0,
    vendors: 0,
    lostItems: 0,
    todaySales: 0,
    todayInvoices: 0,
    drawerCash: 0,
    lowStockCount: 0
  });

  const [salesData, setSalesData] = useState<{ name: string; Sales: number; Collection: number }[]>([]);
  const [recentInvoices, setRecentInvoices] = useState<DailySale[]>([]);
  const [lowStockItems, setLowStockItems] = useState<Product[]>([]);

  useEffect(() => {
    if (user) {
      loadAllData();
    }
  }, [user, userProfile?.companyId]);

  const loadAllData = async () => {
    if (!user) return;
    try {
      const companyOrUid = effectiveCompanyId || user.uid;

      const [
        custRes, empRes, salesRes, prodRes, assetRes, vendRes, lostRes
      ] = await Promise.all([
        getCustomers(user.uid).catch(() => []),
        getEmployees(companyOrUid).catch(() => []),
        getSalesInvoices(user.uid).catch(() => []),
        getProducts(user.uid).catch(() => []),
        getAssets(companyOrUid).catch(() => []),
        getCateringVendors(companyOrUid).catch(() => []),
        getLostItems(user.uid).catch(() => []),
      ]);

      let totalSalesAmt = 0;
      let totalCollectedAmt = 0;
      let todaySalesAmt = 0;
      let todayInvCount = 0;
      let todayCashAmt = 0;

      const now = new Date();
      const todayIso = now.toISOString().slice(0, 10); // YYYY-MM-DD
      const todayGb = now.toLocaleDateString('en-GB'); // DD/MM/YYYY

      salesRes.forEach(s => {
        const anyS = s as any;
        const amt = Number(s.netInvoiceAmount ?? s.totalAmount ?? 0);
        totalSalesAmt += amt;

        // Paid amount calculation
        const isPaid = anyS.paymentStatus === 'Paid' || s.type === 'cash';
        const paid = Number(anyS.paidAmount ?? (isPaid ? amt : 0));
        totalCollectedAmt += paid;

        // Check if invoice belongs to today
        const sDate = String(s.date || s.createdAt || '');
        const isToday = sDate.includes(todayIso) || sDate.includes(todayGb) || sDate.startsWith(todayIso);

        if (isToday) {
          todaySalesAmt += amt;
          todayInvCount += 1;
          todayCashAmt += paid;
        }
      });

      let totalStockVal = 0;
      const lowStock: Product[] = [];
      prodRes.forEach(p => {
        const qty = Number(p.stock || 0);
        const cost = Number(p.cost || p.price || 0);
        totalStockVal += (qty * cost);
        if (qty <= Number(p.minStock ?? 5)) {
          lowStock.push(p);
        }
      });

      setStats({
        customers: custRes.length,
        employees: empRes.length,
        totalSales: totalSalesAmt,
        totalCollected: totalCollectedAmt,
        products: prodRes.length,
        stockValue: totalStockVal,
        assets: assetRes.length,
        vendors: vendRes.length,
        lostItems: lostRes.filter(l => l.status !== 'Returned').length,
        todaySales: todaySalesAmt,
        todayInvoices: todayInvCount,
        drawerCash: todayCashAmt,
        lowStockCount: lowStock.length
      });

      // Recent Invoices: Real data only
      setRecentInvoices(salesRes.slice(0, 5));

      // Low stock: Real data only
      setLowStockItems(lowStock.slice(0, 5));

      // Monthly sales chart: Real data only
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      const currentYear = new Date().getFullYear();
      const chartData = months.map(m => ({ name: `${m}-${String(currentYear).slice(2)}`, Sales: 0, Collection: 0 }));
      
      salesRes.forEach(s => {
        const anyS = s as any;
        const d = new Date(s.date || s.createdAt);
        if (!isNaN(d.getTime()) && d.getFullYear() === currentYear) {
          const monthIdx = d.getMonth();
          const amt = Number(s.netInvoiceAmount ?? s.totalAmount ?? 0);
          const isPaid = anyS.paymentStatus === 'Paid' || s.type === 'cash';
          const paid = Number(anyS.paidAmount ?? (isPaid ? amt : 0));
          chartData[monthIdx].Sales += amt;
          chartData[monthIdx].Collection += paid;
        }
      });

      setSalesData(chartData);

    } catch (e) {
      console.error(e);
      showToast('Error loading dashboard stats', 'error');
    }
  };

  const statCards = [
    { title: 'CUSTOMERS', value: stats.customers.toString(), icon: <Users className="w-5 h-5 text-black" />, prefix: '', bg: 'bg-indigo-100', target: 'customers-list' as AdminPageId },
    { title: 'EMPLOYEES', value: stats.employees.toString(), icon: <Briefcase className="w-5 h-5 text-black" />, prefix: '', bg: 'bg-emerald-100', target: 'hrm-employees' as AdminPageId },
    { title: 'TOTAL SALE', value: stats.totalSales.toLocaleString(), icon: <FileText className="w-5 h-5 text-black" />, prefix: '৳ ', bg: 'bg-amber-100', target: 'sales-invoices' as AdminPageId },
    { title: 'TOTAL PRODUCTS', value: stats.products.toString(), icon: <Package className="w-5 h-5 text-black" />, prefix: '', bg: 'bg-cyan-100', target: 'inventory' as AdminPageId },
    { title: 'STOCK VALUE', value: stats.stockValue.toLocaleString(), icon: <PieChart className="w-5 h-5 text-black" />, prefix: '৳ ', bg: 'bg-violet-100', target: 'inventory' as AdminPageId },
    { title: 'TOTAL ASSETS', value: stats.assets.toString(), icon: <MonitorSmartphone className="w-5 h-5 text-black" />, prefix: '', bg: 'bg-rose-100', target: 'assets-management' as AdminPageId },
    { title: 'CATERING VENDORS', value: stats.vendors.toString(), icon: <Coffee className="w-5 h-5 text-black" />, prefix: '', bg: 'bg-orange-100', target: 'hrm-catering' as AdminPageId },
    { title: 'ACTIVE LOST & FOUND', value: stats.lostItems.toString(), icon: <HelpCircle className="w-5 h-5 text-black" />, prefix: '', bg: 'bg-slate-100', target: 'lost-and-found' as AdminPageId },
  ];

  const maxVal = salesData.reduce((max, d) => Math.max(max, d.Sales, d.Collection), 0);
  const scale = maxVal > 0 ? maxVal : 100;

  const displayTotalSales = stats.totalSales;
  const displayTotalCollection = stats.totalCollected;
  const collectionRate = displayTotalSales > 0 ? (displayTotalCollection / displayTotalSales) * 100 : 0;
  const outstandingDue = Math.max(0, displayTotalSales - displayTotalCollection);
  const dueRate = displayTotalSales > 0 ? (outstandingDue / displayTotalSales) * 100 : 0;

  return (
    <div className="w-full pb-24 px-0 space-y-6">
      
      {/* 2. Today's Business Performance Pulse (4 Key Metrics Banner) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Today's Sales */}
        <div className="bg-amber-300 border-4 border-black p-5 shadow-[6px_6px_0px_#000] flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-black uppercase tracking-wider text-black">TODAY&apos;S GROSS SALES</span>
            <span className="px-2 py-0.5 bg-black text-white text-[10px] font-black uppercase">LIVE</span>
          </div>
          <div>
            <p className="text-3xl font-black font-display text-black">
              ৳ {stats.todaySales.toLocaleString()}
            </p>
            <p className="text-[11px] font-bold text-slate-800 uppercase mt-1 flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" /> Updated Real-Time
            </p>
          </div>
        </div>

        {/* Invoices Count */}
        <div className="bg-white border-4 border-black p-5 shadow-[6px_6px_0px_#000] flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-black uppercase tracking-wider text-black">TODAY&apos;S INVOICES</span>
            <div className="w-7 h-7 bg-indigo-100 border-2 border-black flex items-center justify-center font-black text-xs">
              #
            </div>
          </div>
          <div>
            <p className="text-3xl font-black font-display text-indigo-700">
              {stats.todayInvoices} <span className="text-base text-black font-bold">ORDERS</span>
            </p>
            <p className="text-[11px] font-bold text-slate-600 uppercase mt-1">
              Counter Transactions
            </p>
          </div>
        </div>

        {/* Counter Cash */}
        <div className="bg-white border-4 border-black p-5 shadow-[6px_6px_0px_#000] flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-black uppercase tracking-wider text-black">DRAWER CASH POSITION</span>
            <CreditCard className="w-5 h-5 text-emerald-600" />
          </div>
          <div>
            <p className="text-3xl font-black font-display text-emerald-800">
              ৳ {stats.drawerCash.toLocaleString()}
            </p>
            <p className="text-[11px] font-bold text-slate-600 uppercase mt-1">
              Active Counter Cash
            </p>
          </div>
        </div>

        {/* Low Stock Alert */}
        <div className="bg-rose-50 border-4 border-black p-5 shadow-[6px_6px_0px_#000] flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-black uppercase tracking-wider text-rose-900">LOW STOCK WARNING</span>
            <AlertTriangle className="w-5 h-5 text-rose-600 stroke-[2.5]" />
          </div>
          <div>
            <p className="text-3xl font-black font-display text-rose-600">
              {stats.lowStockCount} <span className="text-base font-bold text-black">ITEMS</span>
            </p>
            <p className="text-[11px] font-bold text-rose-900 uppercase mt-1 flex items-center gap-1">
              Needs Supplier Reorder
            </p>
          </div>
        </div>

      </div>

      {/* 3. 8 KPI Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 xl:grid-cols-4 gap-4">
        {statCards.map((card, idx) => (
          <div 
            key={idx} 
            onClick={() => onNavigate?.(card.target)}
            className="bg-white border-3 border-black p-5 flex items-center justify-between shadow-[4px_4px_0px_#000] hover:-translate-y-1 hover:shadow-[6px_6px_0px_#000] transition-all cursor-pointer group"
          >
            <div>
              <h3 className="text-xs font-black text-black uppercase tracking-wider mb-1">{card.title}</h3>
              <p className="text-2xl font-black font-display text-indigo-700 group-hover:text-black transition-colors">
                {card.prefix}{card.value}
              </p>
            </div>
            <div className={`w-11 h-11 ${card.bg} border-2 border-black shadow-[2px_2px_0px_#000] flex items-center justify-center text-black group-hover:bg-amber-300 transition-colors`}>
              {card.icon}
            </div>
          </div>
        ))}
      </div>

      {/* 4. Sales & Collection Analytics Engine Chart (Styled matching Partnership Summary Card) */}
      <div className="bg-white border-4 border-black p-6 sm:p-8 shadow-[8px_8px_0px_#000]">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-6 pb-4 border-b-2 border-black">
          <div>
            <h3 className="font-display font-black text-xl uppercase tracking-tight text-black flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-indigo-600" />
              SALES & COLLECTION RATIO BREAKDOWN
            </h3>
            <p className="text-xs font-bold text-slate-600 uppercase tracking-wider mt-0.5">
              12-Month Invoiced Sales vs Realized Cash Recovery Engine
            </p>
          </div>
          <span className="px-3 py-1 bg-amber-300 border-2 border-black shadow-[2px_2px_0px_#000] text-xs font-black uppercase text-black">
            TOTAL BILLED: ৳ {displayTotalSales.toLocaleString()}
          </span>
        </div>
        
        {/* 1. Single Segmented 100% Cash Recovery Ratio Bar */}
        <div className="mb-6">
          <div className="flex flex-wrap justify-between items-center text-xs font-black uppercase gap-2 mb-2">
            <span className="flex items-center gap-1.5 text-amber-900">
              <span className="w-3.5 h-3.5 bg-amber-400 border border-black inline-block shadow-[1px_1px_0px_#000]" />
              REALIZED CASH: ৳ {displayTotalCollection.toLocaleString()} ({collectionRate.toFixed(1)}%)
            </span>
            <span className="flex items-center gap-1.5 text-slate-800">
              PENDING RECEIVABLES (DUE): ৳ {outstandingDue.toLocaleString()} ({dueRate.toFixed(1)}%)
              <span className="w-3.5 h-3.5 bg-slate-300 border border-black inline-block shadow-[1px_1px_0px_#000]" />
            </span>
          </div>

          {/* Unified 100% Ratio Bar */}
          <div className="w-full h-8 bg-slate-100 border-3 border-black overflow-hidden shadow-[3px_3px_0px_#000] flex">
            {displayTotalSales > 0 ? (
              <>
                <div 
                  className="h-full bg-amber-400 flex items-center justify-center text-[11px] font-black text-black border-r-2 border-black transition-all duration-700" 
                  style={{ width: `${Math.max(collectionRate, 10)}%` }}
                  title={`Collected: ৳${displayTotalCollection.toLocaleString()} (${collectionRate.toFixed(1)}%)`}
                >
                  ৳ {displayTotalCollection.toLocaleString()} ({collectionRate.toFixed(0)}% COLLECTED)
                </div>
                <div 
                  className="h-full bg-slate-300 flex items-center justify-center text-[11px] font-black text-black transition-all duration-700" 
                  style={{ width: `${Math.max(dueRate, 5)}%` }}
                  title={`Pending Due: ৳${outstandingDue.toLocaleString()} (${dueRate.toFixed(1)}%)`}
                >
                  {dueRate >= 12 && `৳ ${outstandingDue.toLocaleString()} (${dueRate.toFixed(0)}% DUE)`}
                </div>
              </>
            ) : (
              <div className="w-full h-full flex items-center justify-center text-xs font-bold text-slate-500 uppercase tracking-wider bg-slate-100">
                No invoices recorded yet (৳ 0)
              </div>
            )}
          </div>
        </div>

        {/* 2. Side-by-Side Breakdown Cards with Clear Explanations */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          {/* Realized Cash Collection Card */}
          <div className="bg-amber-50/70 border-2 border-black p-4 shadow-[2px_2px_0px_#000] flex flex-col justify-between">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-black uppercase text-black flex items-center gap-1.5">
                <span className="w-3 h-3 bg-amber-400 border border-black inline-block" />
                Physical Cash In Bank & Drawer
              </span>
              <span className="px-2 py-0.5 bg-amber-200 border border-black text-[10px] font-black uppercase text-amber-900">
                {collectionRate.toFixed(1)}% recovery rate
              </span>
            </div>
            <div>
              <p className="text-2xl font-black font-display text-black">
                ৳ {displayTotalCollection.toLocaleString()}
              </p>
              <p className="text-[11px] font-bold text-slate-600 mt-1">
                Settled counter cash, bank deposits, and cleared digital payments.
              </p>
            </div>
          </div>

          {/* Pending Due / Outstanding Receivables Card */}
          <div className="bg-slate-50 border-2 border-black p-4 shadow-[2px_2px_0px_#000] flex flex-col justify-between">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-black uppercase text-black flex items-center gap-1.5">
                <span className="w-3 h-3 bg-slate-300 border border-black inline-block" />
                Outstanding Receivables (Credit)
              </span>
              <span className="px-2 py-0.5 bg-slate-200 border border-black text-[10px] font-black uppercase text-slate-800">
                {dueRate.toFixed(1)}% pending credit
              </span>
            </div>
            <div>
              <p className="text-2xl font-black font-display text-slate-800">
                ৳ {outstandingDue.toLocaleString()}
              </p>
              <p className="text-[11px] font-bold text-slate-600 mt-1">
                Uncollected customer balances on partial and credit invoices.
              </p>
            </div>
          </div>
        </div>

        {/* 12-Month Performance Bar Chart */}
        <div className="w-full h-[360px] flex flex-col relative">
          
          {/* Legend */}
          <div className="w-full flex justify-end gap-6 mb-3">
            <div className="flex items-center gap-2">
              <div className="w-4 h-3 bg-indigo-600 border border-black shadow-[1px_1px_0px_#000]" />
              <span className="text-[11px] font-black uppercase tracking-wider text-black">Sales (Gross)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-3 bg-amber-400 border border-black shadow-[1px_1px_0px_#000]" />
              <span className="text-[11px] font-black uppercase tracking-wider text-black">Collection (Realized)</span>
            </div>
          </div>

          {/* Grid Area */}
          <div className="flex-1 relative mt-2 border-l-2 border-b-2 border-black">
            {[1, 0.8, 0.6, 0.4, 0.2, 0].map((pct) => {
              const val = Math.round(scale * pct);
              return (
                <div key={pct} className="absolute w-full flex items-center" style={{ bottom: `${pct * 100}%` }}>
                  <span className="absolute -left-12 text-[10px] font-black text-black w-10 text-right transform translate-y-[50%]">
                    {val > 1000 ? (val / 1000).toFixed(1) + 'k' : val}
                  </span>
                  <div className="w-full border-b border-black/10" />
                </div>
              );
            })}

            {/* Bars container */}
            <div className="absolute inset-0 flex justify-between items-end px-2 sm:px-4">
              {salesData.map((d) => (
                <div key={d.name} className="flex flex-col items-center h-full justify-end group flex-1">
                  <div className="flex items-end gap-[2px] sm:gap-1.5 h-full pt-4 w-full justify-center">
                    {/* Sales Bar */}
                    <div 
                      className="w-2.5 sm:w-6 bg-indigo-600 border-t-2 border-x-2 border-black shadow-[2px_2px_0px_#000] transition-all hover:bg-indigo-700 cursor-pointer" 
                      style={{ height: `${scale > 0 ? (d.Sales / scale) * 100 : 0}%` }}
                      title={`Sales: ৳${d.Sales.toLocaleString()}`}
                    />
                    {/* Collection Bar */}
                    <div 
                      className="w-2.5 sm:w-6 bg-amber-400 border-t-2 border-x-2 border-black shadow-[2px_2px_0px_#000] transition-all hover:bg-amber-500 cursor-pointer" 
                      style={{ height: `${scale > 0 ? (d.Collection / scale) * 100 : 0}%` }}
                      title={`Collection: ৳${d.Collection.toLocaleString()}`}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* X Axis Labels */}
          <div className="flex justify-between px-2 sm:px-4 mt-2 border-black ml-[1px]">
            {salesData.map((d) => (
              <div key={d.name} className="text-[10px] sm:text-xs font-black text-black uppercase flex-1 text-center">
                {d.name.split('-')[0]}
              </div>
            ))}
          </div>

        </div>

        {/* Footer Strip */}
        <div className="mt-8 pt-4 border-t-2 border-black/20 flex flex-wrap items-center justify-between text-xs font-bold text-slate-700 gap-2">
          <span className="font-mono bg-slate-100 px-2 py-1 border border-black text-black text-[11px]">
            Formula: Realized Cash ({collectionRate.toFixed(0)}%) + Pending Due ({dueRate.toFixed(0)}%) = Gross Invoiced Sales (৳ {displayTotalSales.toLocaleString()})
          </span>
          <span className="text-[10px] font-mono font-black text-black uppercase bg-emerald-100 px-2 py-1 border border-black">
            COLLECTION EFFICIENCY: {collectionRate.toFixed(1)}% (HEALTHY)
          </span>
        </div>
      </div>

      {/* 5. Dual Operational Activity Tables (Recent POS Sales & Low Stock Alert) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left: Recent Invoices & Counter Orders Feed (7 Cols) */}
        <div className="lg:col-span-7 bg-white border-4 border-black p-6 shadow-[8px_8px_0px_#000] flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 mb-4 border-b-2 border-black">
              <h3 className="font-display font-black text-base uppercase tracking-tight text-black flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-indigo-600" /> RECENT COUNTER TRANSACTIONS
              </h3>
              <button
                onClick={() => onNavigate?.('sales-invoices')}
                className="text-xs font-black text-indigo-700 hover:underline uppercase flex items-center gap-1 cursor-pointer"
              >
                VIEW ALL <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="border-2 border-black shadow-[3px_3px_0px_#000] overflow-x-auto">
              <table className="w-full text-left text-xs font-bold text-black">
                <thead className="bg-black text-white font-black uppercase text-[11px]">
                  <tr>
                    <th className="px-3 py-2.5">INVOICE #</th>
                    <th className="px-3 py-2.5">CLIENT</th>
                    <th className="px-3 py-2.5">DATE</th>
                    <th className="px-3 py-2.5 text-right">AMOUNT (৳)</th>
                    <th className="px-3 py-2.5 text-center">STATUS</th>
                  </tr>
                </thead>
                <tbody className="divide-y-2 divide-slate-200">
                  {recentInvoices.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-4 py-8 text-center text-xs font-bold text-slate-500 uppercase tracking-wide">
                        No sales invoices recorded yet. Create an invoice in POS or Sales.
                      </td>
                    </tr>
                  ) : (
                    recentInvoices.map((inv) => (
                      <tr key={inv.id} className="hover:bg-amber-50/50">
                        <td className="px-3 py-2.5 font-mono font-black text-indigo-700">{inv.invoiceNo}</td>
                        <td className="px-3 py-2.5 font-bold truncate max-w-[120px]">{inv.clientName}</td>
                        <td className="px-3 py-2.5 text-slate-500">{inv.date}</td>
                        <td className="px-3 py-2.5 text-right font-black text-black">৳ {inv.netInvoiceAmount?.toLocaleString()}</td>
                        <td className="px-3 py-2.5 text-center">
                          <span className={`px-2 py-0.5 border border-black font-black text-[9px] uppercase ${inv.type === 'cash' || !inv.type ? 'bg-emerald-200 text-emerald-950' : 'bg-amber-200 text-amber-950'}`}>
                            {inv.type || 'PAID'}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t-2 border-slate-200 flex justify-between items-center text-xs font-bold text-slate-600">
            <span>Synchronized with POS billing terminal</span>
            <span className="font-mono font-black text-emerald-800 flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> 100% ONLINE
            </span>
          </div>
        </div>

        {/* Right: Low Stock Priority Warning Panel (5 Cols) */}
        <div className="lg:col-span-5 bg-white border-4 border-black p-6 shadow-[8px_8px_0px_#000] flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 mb-4 border-b-2 border-black">
              <h3 className="font-display font-black text-base uppercase tracking-tight text-black flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-rose-600" /> INVENTORY REORDER ALERT
              </h3>
              <button
                onClick={() => onNavigate?.('inventory')}
                className="text-xs font-black text-indigo-700 hover:underline uppercase flex items-center gap-1 cursor-pointer"
              >
                MANAGE STOCK <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-3">
              {lowStockItems.length === 0 ? (
                <div className="text-center py-8 border-2 border-dashed border-slate-300 p-4 bg-slate-50">
                  <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto mb-2" />
                  <p className="text-xs font-black text-black uppercase">ALL INVENTORY WELL-STOCKED</p>
                  <p className="text-[11px] font-bold text-slate-500 uppercase mt-0.5">No products below reorder threshold</p>
                </div>
              ) : (
                lowStockItems.map((item) => (
                  <div 
                    key={item.id}
                    className="bg-slate-50 border-2 border-black p-3 shadow-[2px_2px_0px_#000] flex items-center justify-between gap-3"
                  >
                    <div className="min-w-0">
                      <p className="font-black text-xs text-black truncate uppercase">{item.name}</p>
                      <div className="flex items-center gap-2 text-[10px] font-bold text-slate-600 uppercase mt-0.5">
                        <span>SKU: {item.sku}</span>
                        <span>•</span>
                        <span>MRP: ৳{item.price}</span>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <span className="px-2 py-1 bg-rose-200 text-rose-950 border border-black font-black text-xs block">
                        {item.stock} LEFT
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t-2 border-slate-200">
            <button
              onClick={() => onNavigate?.('purchase-product')}
              className="w-full py-2.5 bg-black hover:bg-slate-800 text-white font-display font-black text-xs uppercase tracking-wider border-2 border-black shadow-[2px_2px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 transition-all text-center flex items-center justify-center gap-1.5 cursor-pointer"
            >
              + CREATE PURCHASE LIFTING ORDER
            </button>
          </div>
        </div>

      </div>

    </div>
  );
};
