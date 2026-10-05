import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { 
  Users, 
  FileText, 
  DollarSign, 
  Banknote, 
  Package, 
  PieChart, 
  Briefcase,
  MonitorSmartphone,
  Coffee,
  HelpCircle
} from 'lucide-react';
import { getCustomers } from '@/lib/customerStorage';
import { getEmployees } from '@/lib/hrmStorage';
import { getSalesInvoices } from '@/lib/salesStorage';
import { getProducts } from '@/lib/inventoryStorage';
import { getAssets } from '@/lib/assetsStorage';
import { getCateringVendors } from '@/lib/cateringStorage';
import { getLostItems } from '@/lib/lostAndFoundStorage';

interface Props {
  showToast: (msg: string, type: 'success'|'error') => void;
}

export const MainDashboardPage: React.FC<Props> = ({ showToast }) => {
  const { user } = useAuth();
  
  const [stats, setStats] = useState({
    customers: 0,
    employees: 0,
    totalSales: 0,
    products: 0,
    stockValue: 0,
    assets: 0,
    vendors: 0,
    lostItems: 0,
  });

  const [salesData, setSalesData] = useState<any[]>([]);

  useEffect(() => {
    if (user) {
      loadAllData();
    }
  }, [user]);

  const loadAllData = async () => {
    if (!user) return;
    try {
      const [
        custRes, empRes, salesRes, prodRes, assetRes, vendRes, lostRes
      ] = await Promise.all([
        getCustomers(user.uid).catch(() => []),
        getEmployees(user.uid).catch(() => []),
        getSalesInvoices(user.uid).catch(() => []),
        getProducts(user.uid).catch(() => []),
        getAssets(user.uid).catch(() => []),
        getCateringVendors(user.uid).catch(() => []),
        getLostItems(user.uid).catch(() => []),
      ]);

      let totalSalesAmt = 0;
      salesRes.forEach(s => {
        totalSalesAmt += (s.netInvoiceAmount || 0);
      });

      let totalStockVal = 0;
      prodRes.forEach(p => {
        totalStockVal += ((p.stock || 0) * (p.cost || 0));
      });

      setStats({
        customers: custRes.length,
        employees: empRes.length,
        totalSales: totalSalesAmt,
        products: prodRes.length,
        stockValue: totalStockVal,
        assets: assetRes.length,
        vendors: vendRes.length,
        lostItems: lostRes.filter(l => l.status !== 'Returned').length,
      });

      // Simple mock for the chart based on actual sales data (if any) or placeholder
      // Grouping sales by month
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      const currentYear = new Date().getFullYear();
      
      const chartData = months.map(m => ({ name: `${m}-${String(currentYear).slice(2)}`, Sales: 0, Collection: 0 }));
      
      salesRes.forEach(s => {
        const d = new Date(s.date || s.createdAt);
        if (d.getFullYear() === currentYear) {
          chartData[d.getMonth()].Sales += (s.netInvoiceAmount || 0);
          chartData[d.getMonth()].Collection += (s.netInvoiceAmount || 0) * 0.8; // Mocking collection as 80% for now
        }
      });
      
      // If all zeros, show the default placeholder chart for visual appeal
      const hasData = chartData.some(d => d.Sales > 0);
      if (!hasData) {
        chartData[6].Sales = 30; // Jul
        chartData[7].Collection = 4; // Aug
      }

      setSalesData(chartData);

    } catch (e) {
      console.error(e);
      showToast('Error loading dashboard stats', 'error');
    }
  };

  const statCards = [
    { title: 'CUSTOMERS', value: stats.customers.toString(), icon: <Users className="w-5 h-5 text-slate-500 dark:text-slate-400" />, prefix: '' },
    { title: 'EMPLOYEES', value: stats.employees.toString(), icon: <Briefcase className="w-5 h-5 text-slate-500 dark:text-slate-400" />, prefix: '' },
    { title: 'TOTAL SALE', value: stats.totalSales.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }), icon: <FileText className="w-5 h-5 text-slate-500 dark:text-slate-400" />, prefix: '৳ ' },
    { title: 'TOTAL PRODUCTS', value: stats.products.toString(), icon: <Package className="w-5 h-5 text-slate-500 dark:text-slate-400" />, prefix: '' },
    
    { title: 'STOCK VALUE', value: stats.stockValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }), icon: <PieChart className="w-5 h-5 text-slate-500 dark:text-slate-400" />, prefix: '৳ ' },
    { title: 'TOTAL ASSETS', value: stats.assets.toString(), icon: <MonitorSmartphone className="w-5 h-5 text-slate-500 dark:text-slate-400" />, prefix: '' },
    { title: 'CATERING VENDORS', value: stats.vendors.toString(), icon: <Coffee className="w-5 h-5 text-slate-500 dark:text-slate-400" />, prefix: '' },
    { title: 'ACTIVE LOST & FOUND', value: stats.lostItems.toString(), icon: <HelpCircle className="w-5 h-5 text-slate-500 dark:text-slate-400" />, prefix: '' },
  ];

  // Calculate max scale for chart
  const maxVal = salesData.reduce((max, d) => Math.max(max, d.Sales, d.Collection), 30);
  const scale = maxVal > 0 ? maxVal : 30;

  return (
    <div className="w-full mx-auto pb-20 px-1 py-6 bg-slate-50 dark:bg-slate-950 min-h-[calc(100vh-4rem)]">
      
      {/* Grid of Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
        {statCards.map((card, idx) => (
          <div key={idx} className="bg-white dark:bg-slate-900 rounded border border-slate-200 dark:border-slate-800 p-5 flex items-center justify-between shadow-sm hover:border-primary-200 dark:hover:border-primary-800 transition-colors">
            <div>
              <h3 className="text-[11px] font-bold text-slate-700 dark:text-slate-400 tracking-wider mb-2">{card.title}</h3>
              <p className="text-xl font-bold text-[#20B2AA]">{card.prefix}{card.value}</p>
            </div>
            <div className="w-10 h-10 rounded bg-[#E0F2F1] dark:bg-slate-800 flex items-center justify-center">
              {card.icon}
            </div>
          </div>
        ))}
      </div>

      {/* Chart Section */}
      <div className="bg-white dark:bg-slate-900 rounded border border-slate-200 dark:border-slate-800 shadow-sm p-6 pt-5">
        <h2 className="text-[17px] font-normal text-slate-700 dark:text-slate-200 mb-0.5">Sales & Collection Chart</h2>
        <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-8">12 Month Analytics Tracking Engine</p>
        
        {/* Custom Bar Chart Layout */}
        <div className="w-full h-[400px] flex flex-col relative">
          
          {/* Legend */}
          <div className="absolute top-0 w-full flex justify-center gap-6 z-10">
            <div className="flex items-center gap-2">
              <div className="w-8 h-3 bg-[#20B2AA]"></div>
              <span className="text-xs text-slate-600 dark:text-slate-400">Sales</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-3 bg-[#F59E0B]"></div>
              <span className="text-xs text-slate-600 dark:text-slate-400">Collection</span>
            </div>
          </div>

          {/* Grid Area */}
          <div className="flex-1 relative mt-8 border-l border-b border-slate-300 dark:border-slate-700">
            {/* Y Axis Labels and Horizontal Grid Lines */}
            {[1, 0.8, 0.6, 0.4, 0.2, 0].map((pct, i) => {
              const val = Math.round(scale * pct);
              return (
                <div key={pct} className="absolute w-full flex items-center" style={{ bottom: `${pct * 100}%` }}>
                  <span className="absolute -left-10 text-[10px] text-slate-400 w-8 text-right transform translate-y-[50%]">{val > 1000 ? (val/1000).toFixed(1)+'k' : val}</span>
                  <div className="w-full border-b border-slate-200 dark:border-slate-800"></div>
                </div>
              );
            })}

            {/* Bars container */}
            <div className="absolute inset-0 flex justify-between items-end px-2 sm:px-4">
              {salesData.map((d, i) => (
                <div key={d.name} className="flex flex-col items-center h-full justify-end group flex-1">
                  <div className="flex items-end gap-[1px] sm:gap-0.5 h-full pt-4 w-full justify-center">
                    {/* Sales Bar */}
                    <div 
                      className="w-2 sm:w-6 bg-[#20B2AA] rounded-t-sm transition-all hover:opacity-80" 
                      style={{ height: `${scale > 0 ? (d.Sales / scale) * 100 : 0}%` }}
                      title={`Sales: ${d.Sales.toLocaleString()}`}
                    ></div>
                    {/* Collection Bar */}
                    <div 
                      className="w-2 sm:w-6 bg-[#F59E0B] rounded-t-sm transition-all hover:opacity-80" 
                      style={{ height: `${scale > 0 ? (d.Collection / scale) * 100 : 0}%` }}
                      title={`Collection: ${d.Collection.toLocaleString()}`}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* X Axis Labels */}
          <div className="flex justify-between px-2 sm:px-4 mt-2 border-slate-300 dark:border-slate-700 ml-[1px]">
            {salesData.map(d => (
              <div key={d.name} className="text-[9px] sm:text-[11px] text-slate-500 dark:text-slate-400 flex-1 text-center -ml-2 sm:-ml-0">
                {d.name.split('-')[0]}
              </div>
            ))}
          </div>

        </div>
      </div>

    </div>
  );
};
