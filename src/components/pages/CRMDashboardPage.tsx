import React, { useState, useEffect, useMemo } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Lead } from '@/types/crm';
import { getLeads, getDashboardMetrics } from '@/lib/crmStorage';
import { CRMDashboard } from '../crm/CRMDashboard';

interface Props {
  showToast: (msg: string, type: 'success' | 'error') => void;
}

export const CRMDashboardPage: React.FC<Props> = ({ showToast }) => {
  const { user, userProfile } = useAuth();
  const [leads, setLeads] = useState<Lead[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const now = new Date();
  const [selectedMonth, setSelectedMonth] = useState<number>(now.getMonth());
  const [selectedYear, setSelectedYear] = useState<number>(now.getFullYear());

  useEffect(() => {
    if (user) {
      loadData(user.uid, userProfile?.companyId);
    }
  }, [user, userProfile]);

  const loadData = async (uid: string, companyId?: string) => {
    setIsLoading(true);
    try {
      const data = await getLeads(uid, companyId);
      setLeads(data);
    } catch (err) {
      console.error(err);
      showToast('Failed to load CRM data', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const metrics = useMemo(() => {
    return getDashboardMetrics(leads, selectedYear, selectedMonth);
  }, [leads, selectedYear, selectedMonth]);

  return (
    <div className="w-full mx-auto space-y-6">
      {isLoading ? (
        <div className="py-20 flex flex-col items-center justify-center gap-3 bg-white border-2 sm:border-4 border-black shadow-[6px_6px_0px_#000]">
          <div className="w-9 h-9 border-4 border-black border-t-amber-400 animate-spin"></div>
          <p className="text-xs text-black font-black uppercase tracking-wider">Loading Sales Dashboard...</p>
        </div>
      ) : (
        <div className="animate-in fade-in duration-300">
          <CRMDashboard
            metrics={metrics}
            selectedMonth={selectedMonth}
            selectedYear={selectedYear}
            onMonthChange={setSelectedMonth}
            onYearChange={setSelectedYear}
            totalLeadsCount={leads.length}
          />
        </div>
      )}
    </div>
  );
};
