import React from 'react';
import { LeadStatus, LeadPriority } from '@/types/crm';
import { Check } from 'lucide-react';

export const LeadStatusBadge: React.FC<{ status: LeadStatus; isConverted?: boolean }> = ({ status, isConverted }) => {
  if (isConverted || status === 'CONVERTED') {
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-black uppercase tracking-wider border shadow-[1px_1px_0px_#000] bg-emerald-300 text-black border-black">
        <Check className="w-3 h-3 stroke-[3]" />
        CONVERTED
      </span>
    );
  }

  const getStyle = () => {
    switch (status) {
      case 'NEW': return 'bg-blue-100 text-blue-900 border-black';
      case 'CONTACTED': return 'bg-indigo-100 text-indigo-900 border-black';
      case 'REPLIED': return 'bg-purple-100 text-purple-900 border-black';
      case 'QUALIFIED': return 'bg-cyan-100 text-cyan-900 border-black';
      case 'DEMO BOOKED': return 'bg-yellow-200 text-yellow-950 border-black';
      case 'DEMO DONE': return 'bg-orange-100 text-orange-950 border-black';
      case 'PROPOSAL': return 'bg-pink-100 text-pink-950 border-black';
      case 'NEGOTIATION': return 'bg-rose-100 text-rose-950 border-black';
      case 'WON': return 'bg-emerald-200 text-emerald-950 border-black';
      case 'LOST': return 'bg-red-200 text-red-950 border-black';
      default: return 'bg-slate-100 text-slate-900 border-black';
    }
  };

  return (
    <span className={`inline-flex items-center px-2 py-0.5 text-[10px] font-black uppercase tracking-wider border shadow-[1px_1px_0px_#000] ${getStyle()}`}>
      {status}
    </span>
  );
};

export const LeadPriorityBadge: React.FC<{ priority: LeadPriority }> = ({ priority }) => {
  const getStyle = () => {
    switch (priority) {
      case 'HOT': return 'bg-red-100 text-red-900 border-black';
      case 'WARM': return 'bg-amber-100 text-amber-900 border-black';
      case 'COLD': return 'bg-blue-100 text-blue-900 border-black';
      case 'LOST': return 'bg-slate-200 text-slate-800 border-black';
      default: return 'bg-slate-100 text-slate-800 border-black';
    }
  };

  const getIcon = () => {
    switch (priority) {
      case 'HOT': return '🔴';
      case 'WARM': return '🟡';
      case 'COLD': return '🔵';
      case 'LOST': return '⚫';
      default: return '';
    }
  };

  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-black uppercase tracking-wider border shadow-[1px_1px_0px_#000] ${getStyle()}`}>
      <span>{getIcon()}</span>
      {priority}
    </span>
  );
};
