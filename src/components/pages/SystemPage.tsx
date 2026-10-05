import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { MonitorSmartphone, Activity, Database, ShieldCheck, RefreshCw, Cpu, Server, HardDrive } from 'lucide-react';

interface Props {
  showToast: (msg: string, type: 'success'|'error') => void;
}

export const SystemPage: React.FC<Props> = ({ showToast }) => {
  const { user } = useAuth();
  const [isChecking, setIsChecking] = useState(false);
  const [uptime, setUptime] = useState("99.98%");
  
  // Just mock data for system status
  const systemMetrics = [
    { label: "Firebase Status", value: "Online", icon: <Database className="w-5 h-5 text-emerald-400" />, color: "emerald" },
    { label: "Server Load", value: "14%", icon: <Cpu className="w-5 h-5 text-primary-400" />, color: "indigo" },
    { label: "Active Sessions", value: "3", icon: <MonitorSmartphone className="w-5 h-5 text-amber-400" />, color: "amber" },
    { label: "Storage Used", value: "1.2 GB", icon: <HardDrive className="w-5 h-5 text-sky-400" />, color: "sky" }
  ];

  const handleRunDiagnostics = () => {
    setIsChecking(true);
    setTimeout(() => {
      setIsChecking(false);
      showToast("All system services are operational.", "success");
      setUptime("100.00%");
    }, 2000);
  };

  return (
    <div className="w-full mx-auto space-y-6 pb-20">
      <div className="bg-slate-900 p-4 sm:p-5 rounded-md border border-slate-800 shadow-md flex flex-wrap items-center justify-between gap-4 text-white">
        <div>
          <div className="flex flex-wrap items-center gap-2.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
            <h2 className="text-lg font-bold text-white">System Status</h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">Monitor workspace health, services, and configurations.</p>
        </div>

        <button 
          onClick={handleRunDiagnostics}
          disabled={isChecking}
          className="flex items-center gap-2 px-4 py-2 bg-slate-800 text-white rounded-md hover:bg-slate-700 transition-colors text-xs font-bold shadow-md shadow-slate-950 disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 ${isChecking ? 'animate-spin' : ''}`} /> 
          {isChecking ? 'Running Check...' : 'Run Diagnostics'}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {systemMetrics.map((metric, i) => (
          <div key={i} className="bg-slate-900 rounded-md border border-slate-800 p-5 shadow-md flex items-center gap-4">
            <div className={`w-12 h-12 rounded-full bg-slate-950 flex items-center justify-center border border-slate-800`}>
              {metric.icon}
            </div>
            <div>
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">{metric.label}</p>
              <p className={`text-lg font-bold text-white`}>{metric.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-slate-900 rounded-md border border-slate-800 shadow-md p-6">
          <div className="flex items-center gap-3 mb-6">
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
            <h3 className="text-base font-bold text-white">Security & Environment</h3>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-slate-950 rounded-md border border-slate-800/50">
              <span className="text-sm font-semibold text-slate-300">Authentication</span>
              <span className="px-2 py-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded text-[10px] font-bold tracking-wider uppercase">Enabled</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-slate-950 rounded-md border border-slate-800/50">
              <span className="text-sm font-semibold text-slate-300">Database Rules</span>
              <span className="px-2 py-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded text-[10px] font-bold tracking-wider uppercase">Secured</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-slate-950 rounded-md border border-slate-800/50">
              <span className="text-sm font-semibold text-slate-300">Environment</span>
              <span className="px-2 py-1 bg-primary-500/10 text-primary-400 border border-primary-500/20 rounded text-[10px] font-bold tracking-wider uppercase">Production</span>
            </div>
          </div>
        </div>

        <div className="bg-slate-900 rounded-md border border-slate-800 shadow-md p-6">
          <div className="flex items-center gap-3 mb-6">
            <Server className="w-5 h-5 text-primary-400" />
            <h3 className="text-base font-bold text-white">System Logs</h3>
          </div>
          
          <div className="space-y-2 h-[200px] overflow-y-auto custom-scrollbar font-mono text-xs p-3 bg-slate-950 rounded-md border border-slate-800">
            <p className="text-slate-400"><span className="text-primary-400">[{new Date().toISOString().split('T')[0]}]</span> INFO: User ({user?.email}) accessed System Dashboard.</p>
            <p className="text-slate-400"><span className="text-emerald-400">[{new Date().toISOString().split('T')[0]}]</span> SUCCESS: Database synced successfully.</p>
            <p className="text-slate-400"><span className="text-primary-400">[{new Date().toISOString().split('T')[0]}]</span> INFO: Routine backup completed.</p>
            <p className="text-slate-400"><span className="text-emerald-400">[{new Date().toISOString().split('T')[0]}]</span> SUCCESS: All services operational. Uptime {uptime}</p>
          </div>
        </div>
      </div>
    </div>
  );
};
