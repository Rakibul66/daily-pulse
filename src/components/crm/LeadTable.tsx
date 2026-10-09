import React from 'react';
import { Lead } from '@/types/crm';
import { LeadStatusBadge, LeadPriorityBadge } from './LeadStatusBadge';
import { Edit2, Trash2, Users, MessageSquare, UserCheck } from 'lucide-react';

interface Props {
  leads: Lead[];
  onEdit: (lead: Lead) => void;
  onDelete: (lead: Lead) => void;
  onConvert?: (lead: Lead) => void;
}

export const LeadTable: React.FC<Props> = ({ leads, onEdit, onDelete, onConvert }) => {
  if (leads.length === 0) {
    return (
      <div className="bg-white border-2 sm:border-4 border-black p-12 flex flex-col items-center justify-center text-center shadow-[6px_6px_0px_#000]">
        <div className="w-16 h-16 bg-amber-300 border-2 border-black shadow-[3px_3px_0px_#000] flex items-center justify-center mb-4 text-3xl">
          📭
        </div>
        <h3 className="text-lg font-black uppercase text-black mb-1">No Leads Found</h3>
        <p className="text-slate-600 font-bold text-xs max-w-sm uppercase">
          Create your first sales lead by clicking the &quot;+ New Lead&quot; button above.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white border-2 sm:border-4 border-black shadow-[6px_6px_0px_#000] overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left border-collapse">
          <thead className="text-xs uppercase bg-amber-200 border-b-2 sm:border-b-4 border-black text-black">
            <tr>
              <th className="px-5 py-3.5 font-black tracking-wider border-r-2 border-black">Date</th>
              <th className="px-5 py-3.5 font-black tracking-wider border-r-2 border-black">Business</th>
              <th className="px-5 py-3.5 font-black tracking-wider border-r-2 border-black">Contact</th>
              <th className="px-5 py-3.5 font-black tracking-wider border-r-2 border-black">Status</th>
              <th className="px-5 py-3.5 font-black tracking-wider border-r-2 border-black">Priority</th>
              <th className="px-5 py-3.5 font-black tracking-wider border-r-2 border-black">Next Action</th>
              <th className="px-5 py-3.5 font-black tracking-wider text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y-2 divide-black/10 bg-white">
            {leads.map((lead) => (
              <tr key={lead.id} className="hover:bg-amber-50/60 transition-colors">
                {/* Date */}
                <td className="px-5 py-4 text-slate-800 font-black whitespace-nowrap text-xs border-r-2 border-black/10">
                  {lead.dateAdded ? lead.dateAdded.split('T')[0] : '—'}
                </td>

                {/* Business */}
                <td className="px-5 py-4 border-r-2 border-black/10">
                  <div className="font-black text-black text-sm uppercase tracking-tight mb-0.5">
                    {lead.businessName || (lead as any).restaurantName || 'Unnamed Business'}
                  </div>
                  <div className="text-[11px] font-bold text-slate-600 uppercase tracking-wide">
                    {lead.businessType || 'No Type'} • {lead.locationArea || lead.businessSubType || 'General'}
                  </div>
                </td>

                {/* Contact */}
                <td className="px-5 py-4 border-r-2 border-black/10">
                  <div className="font-black text-xs mb-0.5 text-black">
                    {lead.whatsapp ? (
                      <span className="inline-flex items-center gap-1.5 text-emerald-800 bg-emerald-100 px-2 py-0.5 border border-black font-black text-xs">
                        <MessageSquare className="w-3.5 h-3.5 text-emerald-700" />
                        {lead.whatsapp}
                      </span>
                    ) : lead.phone ? (
                      <span className="font-bold text-slate-900">{lead.phone}</span>
                    ) : lead.messenger ? (
                      <span className="font-bold text-indigo-700">{lead.messenger}</span>
                    ) : (
                      <span className="text-slate-400 font-bold">No contact</span>
                    )}
                  </div>
                  <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wide">
                    {lead.ownerName || 'Unknown Contact'}
                  </div>
                </td>

                {/* Status */}
                <td className="px-5 py-4 border-r-2 border-black/10">
                  <LeadStatusBadge 
                    status={lead.leadStatus} 
                    isConverted={lead.isConverted || lead.leadStatus === 'CONVERTED'} 
                  />
                </td>

                {/* Priority */}
                <td className="px-5 py-4 border-r-2 border-black/10">
                  <LeadPriorityBadge priority={lead.leadPriority} />
                </td>

                {/* Next Action / Notes */}
                <td className="px-5 py-4 border-r-2 border-black/10">
                  <div className="text-[11px] font-black text-black mb-0.5 uppercase tracking-wide">
                    {lead.followUpDate ? `Follow up: ${lead.followUpDate}` : 'Action / Note'}
                  </div>
                  <div className="text-xs font-bold text-slate-600 line-clamp-2">
                    {lead.notes || lead.nextAction || lead.objection || '—'}
                  </div>
                </td>

                {/* Actions - Always Visible Buttons */}
                <td className="px-5 py-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    {onConvert && (
                      (lead.isConverted || lead.leadStatus === 'CONVERTED') ? (
                        <span
                          className="px-2 py-1 bg-emerald-100 text-emerald-950 border-2 border-black font-black text-[10px] uppercase shadow-[2px_2px_0px_#000] flex items-center gap-1 cursor-default"
                          title="Customer already created"
                        >
                          <UserCheck className="w-3.5 h-3.5 stroke-[2.5]" />
                          <span className="hidden sm:inline">Converted</span>
                        </span>
                      ) : (
                        <button
                          onClick={() => onConvert(lead)}
                          className="px-2 py-1.5 bg-emerald-300 hover:bg-emerald-400 text-black border-2 border-black font-black text-xs uppercase shadow-[2px_2px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 transition-all flex items-center gap-1 cursor-pointer"
                          title="Convert to Customer"
                        >
                          <Users className="w-3.5 h-3.5 stroke-[2.5]" />
                          <span className="hidden sm:inline">Convert</span>
                        </button>
                      )
                    )}
                    <button
                      onClick={() => onEdit(lead)}
                      className="px-2.5 py-1.5 bg-white hover:bg-amber-300 text-black border-2 border-black font-black text-xs uppercase shadow-[2px_2px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 transition-all flex items-center gap-1 cursor-pointer"
                      title="Edit Lead"
                    >
                      <Edit2 className="w-3.5 h-3.5 stroke-[2.5]" />
                      <span className="hidden sm:inline">Edit</span>
                    </button>
                    <button
                      onClick={() => onDelete(lead)}
                      className="px-2.5 py-1.5 bg-white hover:bg-red-500 hover:text-white text-black border-2 border-black font-black text-xs uppercase shadow-[2px_2px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 transition-all flex items-center gap-1 cursor-pointer"
                      title="Delete Lead"
                    >
                      <Trash2 className="w-3.5 h-3.5 stroke-[2.5]" />
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
