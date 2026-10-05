import React from 'react';
import { Lead } from '@/types/crm';
import { LeadStatusBadge, LeadPriorityBadge } from './LeadStatusBadge';
import { Edit2, Trash2 } from 'lucide-react';
import { Users } from 'lucide-react';

interface Props {
  leads: Lead[];
  onEdit: (lead: Lead) => void;
  onDelete: (id: string) => void;
  onConvert?: (lead: Lead) => void;
}

export const LeadTable: React.FC<Props> = ({ leads, onEdit, onDelete, onConvert }) => {
  if (leads.length === 0) {
    return (
      <div className="bg-slate-900 rounded-md border border-slate-800 p-12 flex flex-col items-center justify-center text-center shadow-md">
        <div className="w-16 h-16 rounded-full bg-slate-800/50 flex items-center justify-center mb-4 border border-slate-700">
          <span className="text-3xl">📭</span>
        </div>
        <h3 className="text-lg font-bold text-white mb-2">No leads found</h3>
        <p className="text-slate-400 text-sm max-w-sm">Create your first lead by clicking the "New Lead" button above to get started.</p>
      </div>
    );
  }

  return (
    <div className="bg-slate-900 rounded-md border border-slate-800 shadow-md overflow-hidden">
      <div className="overflow-x-auto custom-scrollbar">
        <table className="w-full text-sm text-left">
          <thead className="text-xs text-slate-400 uppercase bg-slate-950/80 border-b border-slate-800">
            <tr>
              <th className="px-5 py-4 font-bold tracking-wider">Date</th>
              <th className="px-5 py-4 font-bold tracking-wider">Business</th>
              <th className="px-5 py-4 font-bold tracking-wider">Contact</th>
              <th className="px-5 py-4 font-bold tracking-wider">Status</th>
              <th className="px-5 py-4 font-bold tracking-wider">Priority</th>
              <th className="px-5 py-4 font-bold tracking-wider">Next Action</th>
              <th className="px-5 py-4 font-bold tracking-wider text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60">
            {leads.map((lead) => (
              <tr key={lead.id} className="hover:bg-slate-800/50 transition-colors group">
                <td className="px-5 py-4 text-slate-300 font-medium whitespace-nowrap text-xs">
                  {lead.dateAdded.split('T')[0]}
                </td>
                <td className="px-5 py-4">
                  <div className="font-bold text-white mb-0.5 group-hover:text-primary-300 transition-colors">
                    {lead.businessName || (lead as any).restaurantName}
                  </div>
                  <div className="text-[11px] font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">{lead.businessType || 'No Type'} • {lead.locationArea || 'No Area'}</div>
                </td>
                <td className="px-5 py-4">
                  <div className="text-slate-300 font-medium text-xs mb-0.5">{lead.phone || lead.messenger || 'No contact'}</div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400">{lead.ownerName || 'Unknown Contact'}</div>
                </td>
                <td className="px-5 py-4">
                  <LeadStatusBadge status={lead.leadStatus} />
                </td>
                <td className="px-5 py-4">
                  <LeadPriorityBadge priority={lead.leadPriority} />
                </td>
                <td className="px-5 py-4 text-slate-300">
                  <div className="text-[11px] font-bold text-primary-400 mb-0.5 uppercase tracking-wide">
                    {lead.followUpDate ? `Follow up: ${lead.followUpDate}` : 'No Action'}
                  </div>
                  <div className="text-xs text-slate-400 line-clamp-1">{lead.nextAction}</div>
                </td>
                <td className="px-5 py-4 text-right">
                  <div className="flex justify-end gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                    {onConvert && (lead.leadStatus === 'WON' || lead.salesStatus === 'Won') && (
                      <button
                        onClick={() => onConvert(lead)}
                        className="p-1.5 text-emerald-400 hover:text-emerald-300 bg-emerald-500/10 hover:bg-emerald-500/20 rounded-lg border border-transparent hover:border-emerald-500/30 transition-all flex items-center gap-1"
                        title="Convert to Customer"
                      >
                        <Users className="w-4 h-4" />
                      </button>
                    )}
                    <button
                      onClick={() => onEdit(lead)}
                      className="p-1.5 text-slate-400 hover:text-white bg-slate-800/50 hover:bg-slate-700 rounded-lg border border-transparent hover:border-slate-600 transition-all"
                      title="Edit"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => {
                        if (confirm('Are you sure you want to delete this lead?')) {
                          onDelete(lead.id);
                        }
                      }}
                      className="p-1.5 text-slate-400 hover:text-rose-400 bg-slate-800/50 hover:bg-rose-950/50 rounded-lg border border-transparent hover:border-rose-900/50 transition-all"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
