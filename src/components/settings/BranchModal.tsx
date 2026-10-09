import React from "react";
import { Store, Loader2, Save } from "lucide-react";
import { Branch } from "@/types/company";

interface BranchModalProps {
  isOpen: boolean;
  onClose: () => void;
  editingBranchId: string | null;
  branchForm: Partial<Branch>;
  onChange: (updated: Partial<Branch>) => void;
  onSubmit: (e: React.FormEvent) => void;
  isSaving: boolean;
}

export const BranchModal: React.FC<BranchModalProps> = ({
  isOpen,
  onClose,
  editingBranchId,
  branchForm,
  onChange,
  onSubmit,
  isSaving,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white border-4 border-black shadow-[10px_10px_0px_#000] w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-150">
        <div className="px-6 py-4 border-b-2 border-black bg-amber-300 flex items-center justify-between">
          <h3 className="font-display font-black text-sm uppercase text-black flex items-center gap-2">
            <Store className="w-4 h-4" />
            {editingBranchId ? 'EDIT BRANCH LOCATION' : 'ADD NEW BRANCH OUTLET'}
          </h3>
          <button
            onClick={onClose}
            className="w-7 h-7 bg-white border-2 border-black flex items-center justify-center text-black font-black hover:bg-rose-400 cursor-pointer"
          >
            ✕
          </button>
        </div>

        <form onSubmit={onSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-black uppercase text-black mb-1">Branch / Store Name *</label>
            <input
              type="text"
              required
              value={branchForm.name || ''}
              onChange={e => onChange({ ...branchForm, name: e.target.value })}
              className="w-full text-xs font-bold text-black bg-white px-3 py-2 border-2 border-black shadow-[2px_2px_0px_#000]"
              placeholder="e.g. Banani Flagship Store"
            />
          </div>

          <div>
            <label className="block text-xs font-black uppercase text-black mb-1">Branch Manager / Contact Person</label>
            <input
              type="text"
              value={branchForm.contactPerson || ''}
              onChange={e => onChange({ ...branchForm, contactPerson: e.target.value })}
              className="w-full text-xs font-bold text-black bg-white px-3 py-2 border-2 border-black shadow-[2px_2px_0px_#000]"
              placeholder="e.g. Tanvir Ahmed"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-black uppercase text-black mb-1">Phone Number</label>
              <input
                type="text"
                value={branchForm.phone || ''}
                onChange={e => onChange({ ...branchForm, phone: e.target.value })}
                className="w-full text-xs font-bold text-black bg-white px-3 py-2 border-2 border-black shadow-[2px_2px_0px_#000]"
                placeholder="e.g. 01711223344"
              />
            </div>

            <div>
              <label className="block text-xs font-black uppercase text-black mb-1">Status</label>
              <select
                value={branchForm.status || 'Active'}
                onChange={e => onChange({ ...branchForm, status: e.target.value as any })}
                className="w-full text-xs font-bold text-black bg-white px-3 py-2 border-2 border-black shadow-[2px_2px_0px_#000]"
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-black uppercase text-black mb-1">Physical Address</label>
            <textarea
              rows={2}
              value={branchForm.address || ''}
              onChange={e => onChange({ ...branchForm, address: e.target.value })}
              className="w-full text-xs font-bold text-black bg-white px-3 py-2 border-2 border-black shadow-[2px_2px_0px_#000]"
              placeholder="e.g. Level 2, Rangs Square, Gulshan-2, Dhaka"
            />
          </div>

          <div className="pt-3 flex justify-end gap-3 border-t-2 border-black">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-black uppercase text-black bg-slate-100 hover:bg-slate-200 border-2 border-black shadow-[2px_2px_0px_#000] cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs uppercase border-2 border-black shadow-[3px_3px_0px_#000] flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
            >
              {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4 text-amber-300" />}
              Save Branch
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
