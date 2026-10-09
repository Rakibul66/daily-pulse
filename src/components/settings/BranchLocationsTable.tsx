import React from "react";
import { Plus, Store, Edit, Trash2 } from "lucide-react";
import { Branch } from "@/types/company";

interface BranchLocationsTableProps {
  branches: Branch[];
  onOpenAddBranch: () => void;
  onOpenEditBranch: (b: Branch) => void;
  onDeleteBranch: (id: string) => void;
}

export const BranchLocationsTable: React.FC<BranchLocationsTableProps> = ({
  branches,
  onOpenAddBranch,
  onOpenEditBranch,
  onDeleteBranch,
}) => {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <p className="text-xs font-bold text-slate-700 uppercase">
          Configured Stores & Branch Outlets ({branches.length})
        </p>
        <button
          onClick={onOpenAddBranch}
          className="px-4 py-2 bg-black text-white hover:bg-slate-800 text-xs font-black uppercase tracking-wider border-2 border-black shadow-[2px_2px_0px_#000] flex items-center gap-1.5 cursor-pointer"
        >
          <Plus className="w-4 h-4 text-amber-300" /> + ADD BRANCH
        </button>
      </div>

      {/* Branches Table */}
      <div className="overflow-x-auto border-3 border-black bg-white shadow-[4px_4px_0px_#000]">
        <table className="w-full text-left text-xs text-black">
          <thead className="bg-amber-300 border-b-2 border-black text-[10px] font-black uppercase tracking-wider">
            <tr>
              <th className="px-4 py-3">Branch Name</th>
              <th className="px-4 py-3">Contact Person</th>
              <th className="px-4 py-3">Phone</th>
              <th className="px-4 py-3">Address</th>
              <th className="px-4 py-3 text-center">Status</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y-2 divide-black/10 font-bold">
            {branches.map(b => (
              <tr key={b.id} className="hover:bg-slate-50 transition-colors">
                <td className="px-4 py-3 font-black text-black flex items-center gap-1.5">
                  <Store className="w-4 h-4 text-indigo-600" />
                  {b.name}
                </td>
                <td className="px-4 py-3 text-slate-800">{b.contactPerson || '-'}</td>
                <td className="px-4 py-3 text-slate-800 font-mono">{b.phone || '-'}</td>
                <td className="px-4 py-3 text-slate-600 truncate max-w-[200px]">{b.address || '-'}</td>
                <td className="px-4 py-3 text-center">
                  <span className={`px-2 py-0.5 border border-black text-[10px] font-black uppercase ${
                    b.status === 'Active' ? 'bg-emerald-100 text-emerald-950' : 'bg-slate-100 text-slate-600'
                  }`}>
                    {b.status}
                  </span>
                </td>
                <td className="px-4 py-3 text-right">
                  <div className="flex items-center justify-end gap-1.5">
                    <button
                      onClick={() => onOpenEditBranch(b)}
                      className="p-1.5 bg-white hover:bg-slate-100 border border-black shadow-[1px_1px_0px_#000] cursor-pointer"
                      title="Edit Branch"
                    >
                      <Edit className="w-3.5 h-3.5 text-black" />
                    </button>
                    <button
                      onClick={() => onDeleteBranch(b.id)}
                      className="p-1.5 bg-rose-100 hover:bg-rose-200 text-rose-900 border border-black shadow-[1px_1px_0px_#000] cursor-pointer"
                      title="Delete Branch"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {branches.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-12 text-center text-slate-500 font-bold uppercase">
                  No branches added yet. Click &ldquo;+ ADD BRANCH&rdquo; above to register your primary store.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
