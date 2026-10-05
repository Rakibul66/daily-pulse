import React from 'react';
import { LeadStatus, LeadPriority } from '@/types/crm';

export const LeadStatusBadge: React.FC<{ status: LeadStatus }> = ({ status }) => {
  const getStyle = () => {
    switch (status) {
      case 'NEW': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'CONTACTED': return 'bg-primary-100 text-primary-800 border-primary-200';
      case 'REPLIED': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'QUALIFIED': return 'bg-cyan-100 text-cyan-800 border-cyan-200';
      case 'DEMO BOOKED': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'DEMO DONE': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'PROPOSAL': return 'bg-pink-100 text-pink-800 border-pink-200';
      case 'NEGOTIATION': return 'bg-rose-100 text-rose-800 border-rose-200';
      case 'WON': return 'bg-green-100 text-green-800 border-green-200';
      case 'LOST': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border ${getStyle()}`}>
      {status}
    </span>
  );
};

export const LeadPriorityBadge: React.FC<{ priority: LeadPriority }> = ({ priority }) => {
  const getStyle = () => {
    switch (priority) {
      case 'HOT': return 'bg-red-100 text-red-800 border-red-200';
      case 'WARM': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'COLD': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'LOST': return 'bg-gray-100 text-gray-800 border-gray-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
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
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium border ${getStyle()}`}>
      <span>{getIcon()}</span>
      {priority}
    </span>
  );
};
