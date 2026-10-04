import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Lead } from '@/types/crm';
import { getLeads, getDashboardMetrics } from '@/lib/crmStorage';
import { CRMDashboard } from '../crm/CRMDashboard';

interface Props {
  showToast: (msg: string, type: 'success'|'error') => void;
}

export const CRMDashboardPage: React.FC<Props> = ({ showToast }) => {
  const { user } = useAuth();
  const [leads, setLeads] = useState<Lead[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    if (user) {
      loadData(user.uid);
    }
  }, [user]);

  const loadData = async (uid: string) => {
    setIsLoading(true);
    try {
      const data = await getLeads(uid);
      setLeads(data);
    } catch (err) {
      console.error(err);
      showToast('Failed to load CRM data', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const metrics = getDashboardMetrics(leads);

  return (
    <div className="w-full mx-auto space-y-6">
      <div className="bg-slate-900 p-4 sm:p-5 rounded-md border border-slate-800 shadow-md flex flex-wrap items-center justify-between gap-4 text-white">
        <div>
          <div className="flex flex-wrap items-center gap-2.5">
            <span className="w-2.5 h-2.5 rounded-full bg-indigo-500"></span>
            <h2 className="text-lg font-bold text-white">Sales Dashboard</h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">Overview of your recent sales performance.</p>
        </div>
      </div>

      {isLoading ? (
        <div className="py-20 flex flex-col items-center gap-3">
          <div className="w-8 h-8 rounded-full border-4 border-indigo-900 border-t-indigo-500 animate-spin"></div>
          <p className="text-xs text-slate-500 font-medium">Loading CRM data...</p>
        </div>
      ) : (
        <div className="animate-in fade-in slide-in-from-bottom-2 duration-500 space-y-6">
          <CRMDashboard metrics={metrics} />
        </div>
      )}
    </div>
  );
};
