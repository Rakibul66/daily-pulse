"use client";

import React from "react";
import { 
  ArrowLeft, 
  Save, 
  Loader2 
} from "lucide-react";
import { Customer } from "@/types/customer";
import { 
  SalesCollectionFormData, 
  PAYMENT_TYPES, 
  ACCOUNT_HEADS, 
  COLLECTION_TYPES 
} from "./types";

interface SalesCollectionFormProps {
  editingId: string | null;
  formData: SalesCollectionFormData;
  setFormData: React.Dispatch<React.SetStateAction<SalesCollectionFormData>>;
  customers: Customer[];
  isSaving: boolean;
  onClientChange: (clientId: string) => void;
  onToggleInvoice: (idx: number) => void;
  onInvoiceCollectionChange: (idx: number, val: number) => void;
  onSave: (e: React.FormEvent) => void;
  onCancel: () => void;
}

export const SalesCollectionForm: React.FC<SalesCollectionFormProps> = ({
  editingId,
  formData,
  setFormData,
  customers,
  isSaving,
  onClientChange,
  onToggleInvoice,
  onInvoiceCollectionChange,
  onSave,
  onCancel
}) => {
  return (
    <div className="space-y-6">
      {/* Header Card */}
      <div className="bg-white border-2 sm:border-4 border-black p-5 sm:p-6 shadow-[6px_6px_0px_#000] flex flex-wrap items-center justify-between gap-4">
        <h2 className="font-display font-black text-lg sm:text-xl uppercase tracking-wider text-black">
          {editingId ? "EDIT COLLECTION" : "ADD NEW COLLECTION"}
        </h2>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="px-5 py-2 bg-white hover:bg-slate-100 text-black border-2 border-black font-black uppercase text-xs shadow-[3px_3px_0px_#000] flex items-center gap-1.5 cursor-pointer transition-all"
          >
            <ArrowLeft className="w-4 h-4 stroke-[3]" />
            <span>GO BACK</span>
          </button>

          <button
            type="submit"
            form="collection-form"
            disabled={isSaving}
            className="px-6 py-2 bg-[#00c5bb] hover:bg-[#00a89f] text-white border-2 border-black font-black uppercase text-xs shadow-[3px_3px_0px_#000] hover:shadow-[1px_1px_0px_#000] hover:translate-x-[2px] hover:translate-y-[2px] flex items-center gap-1.5 cursor-pointer transition-all disabled:opacity-50"
          >
            {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4 stroke-[2.5]" />}
            <span>SAVE</span>
          </button>
        </div>
      </div>

      {/* Form Fields Card */}
      <form id="collection-form" onSubmit={onSave} className="space-y-6">
        <div className="bg-white border-2 sm:border-4 border-black p-5 sm:p-6 shadow-[6px_6px_0px_#000] space-y-4">
          {/* Row 1: Client * | Payment No * | Payment Date * */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-1">
              <label className="block text-xs font-black uppercase tracking-wider text-black">
                Client <span className="text-red-600 font-black">*</span>
              </label>
              <select
                value={formData.clientId}
                onChange={(e) => onClientChange(e.target.value)}
                className="w-full h-10 px-3 bg-white border-2 border-black font-bold text-xs text-black shadow-[2px_2px_0px_#000] focus:outline-hidden focus:ring-2 focus:ring-black cursor-pointer"
                required
              >
                <option value="">Select Client</option>
                {customers.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.businessName || c.ownerName} {c.phone ? `(${c.phone})` : ""}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-black uppercase tracking-wider text-black">
                Payment No <span className="text-red-600 font-black">*</span>
              </label>
              <input
                type="text"
                value={formData.paymentNo}
                onChange={(e) => setFormData({ ...formData, paymentNo: e.target.value })}
                className="w-full h-10 px-3 bg-slate-50 border-2 border-black font-mono font-bold text-xs text-black shadow-[2px_2px_0px_#000] focus:outline-hidden"
                required
              />
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-black uppercase tracking-wider text-black">
                Payment Date <span className="text-red-600 font-black">*</span>
              </label>
              <input
                type="text"
                placeholder="DD-MM-YYYY"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className="w-full h-10 px-3 bg-white border-2 border-black font-bold text-xs text-black shadow-[2px_2px_0px_#000] focus:outline-hidden focus:ring-2 focus:ring-black"
                required
              />
            </div>
          </div>

          {/* Row 2: Payment Type * | Account Heads * | Collection Type * | Balance */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="space-y-1">
              <label className="block text-xs font-black uppercase tracking-wider text-black">
                Payment Type <span className="text-red-600 font-black">*</span>
              </label>
              <select
                value={formData.paymentType}
                onChange={(e) => setFormData({ ...formData, paymentType: e.target.value })}
                className="w-full h-10 px-3 bg-white border-2 border-black font-bold text-xs text-black shadow-[2px_2px_0px_#000] focus:outline-hidden cursor-pointer"
              >
                {PAYMENT_TYPES.map((pt) => (
                  <option key={pt} value={pt}>
                    {pt}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-black uppercase tracking-wider text-black">
                Account Heads <span className="text-red-600 font-black">*</span>
              </label>
              <select
                value={formData.accountHead}
                onChange={(e) => setFormData({ ...formData, accountHead: e.target.value })}
                className="w-full h-10 px-3 bg-white border-2 border-black font-bold text-xs text-black shadow-[2px_2px_0px_#000] focus:outline-hidden cursor-pointer"
              >
                {ACCOUNT_HEADS.map((ah) => (
                  <option key={ah} value={ah}>
                    {ah}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-black uppercase tracking-wider text-black">
                Collection Type <span className="text-red-600 font-black">*</span>
              </label>
              <select
                value={formData.collectionType}
                onChange={(e) => setFormData({ ...formData, collectionType: e.target.value })}
                className="w-full h-10 px-3 bg-white border-2 border-black font-bold text-xs text-black shadow-[2px_2px_0px_#000] focus:outline-hidden cursor-pointer"
              >
                {COLLECTION_TYPES.map((ct) => (
                  <option key={ct} value={ct}>
                    {ct}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-black uppercase tracking-wider text-black">
                Balance
              </label>
              <input
                type="number"
                value={formData.balance}
                readOnly
                className="w-full h-10 px-3 bg-slate-100 border-2 border-black font-mono font-bold text-xs text-black shadow-[2px_2px_0px_#000]"
              />
            </div>
          </div>

          {/* Row 3: Staff * | Remarks | Total Collection */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-1">
              <label className="block text-xs font-black uppercase tracking-wider text-black">
                Staff <span className="text-red-600 font-black">*</span>
              </label>
              <select
                value={formData.staff}
                onChange={(e) => setFormData({ ...formData, staff: e.target.value })}
                className="w-full h-10 px-3 bg-white border-2 border-black font-bold text-xs text-black shadow-[2px_2px_0px_#000] focus:outline-hidden cursor-pointer"
              >
                <option value="Admin">Admin</option>
                <option value="Sales Rep">Sales Rep</option>
                <option value="Accounts Staff">Accounts Staff</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-black uppercase tracking-wider text-black">
                Remarks
              </label>
              <input
                type="text"
                placeholder="Remarks"
                value={formData.remarks}
                onChange={(e) => setFormData({ ...formData, remarks: e.target.value })}
                className="w-full h-10 px-3 bg-white border-2 border-black font-bold text-xs text-black shadow-[2px_2px_0px_#000] focus:outline-hidden"
              />
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-black uppercase tracking-wider text-black">
                Total Collection <span className="text-red-600 font-black">*</span>
              </label>
              <input
                type="number"
                step={0.01}
                value={formData.totalCollection}
                onChange={(e) => setFormData({ ...formData, totalCollection: Number(e.target.value) })}
                className="w-full h-10 px-3 bg-white border-2 border-black font-mono font-black text-sm text-black shadow-[2px_2px_0px_#000] focus:outline-hidden"
                required
              />
            </div>
          </div>

          {/* Invoices Breakdown Table with Cyan Header */}
          <div className="mt-6 border-2 border-black overflow-x-auto shadow-[4px_4px_0px_#000]">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-[#00c5bb] text-white font-display font-black uppercase tracking-wider border-b-2 border-black">
                  <th className="p-3 w-16 text-center border-r border-white/20">SL#</th>
                  <th className="p-3 border-r border-white/20">Invoice No</th>
                  <th className="p-3 border-r border-white/20 text-right">Sale Amount</th>
                  <th className="p-3 border-r border-white/20 text-right">Previous Collection</th>
                  <th className="p-3 border-r border-white/20 text-right">Current Collection</th>
                  <th className="p-3 border-r border-white/20 text-right">Due Amount</th>
                  <th className="p-3 w-14 text-center">
                    <input
                      type="checkbox"
                      className="w-4 h-4 accent-black cursor-pointer"
                      checked={formData.invoiceItems.length > 0 && formData.invoiceItems.every((i) => i.selected)}
                      onChange={() => {
                        const allSelected = formData.invoiceItems.every((i) => i.selected);
                        const updated = formData.invoiceItems.map((i) => ({
                          ...i,
                          selected: !allSelected,
                          currentCollection: !allSelected ? i.dueAmount : 0
                        }));
                        const sum = updated.filter((i) => i.selected).reduce((acc, i) => acc + i.currentCollection, 0);
                        setFormData((prev) => ({
                          ...prev,
                          invoiceItems: updated,
                          totalCollection: sum > 0 ? sum : prev.totalCollection
                        }));
                      }}
                    />
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-black/20 font-bold bg-white">
                {formData.invoiceItems.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="p-8 text-center text-xs font-bold text-slate-500 uppercase tracking-wider">
                      Select a client above to view pending invoices, or enter direct collection amount in Total Collection.
                    </td>
                  </tr>
                ) : (
                  formData.invoiceItems.map((item, idx) => (
                    <tr key={item.invoiceId || idx} className="hover:bg-slate-50">
                      <td className="p-3 text-center border-r border-black/10 font-mono">
                        {idx + 1}
                      </td>
                      <td className="p-3 border-r border-black/10 font-mono font-bold">
                        {item.invoiceNo}
                      </td>
                      <td className="p-3 border-r border-black/10 text-right font-mono">
                        ৳{item.saleAmount.toFixed(2)}
                      </td>
                      <td className="p-3 border-r border-black/10 text-right font-mono">
                        ৳{item.previousCollection.toFixed(2)}
                      </td>
                      <td className="p-3 border-r border-black/10 text-right">
                        <input
                          type="number"
                          min={0}
                          max={item.dueAmount}
                          value={item.currentCollection}
                          onChange={(e) => onInvoiceCollectionChange(idx, Number(e.target.value))}
                          className="w-28 px-2 py-1 text-right font-mono font-bold bg-white border border-black"
                        />
                      </td>
                      <td className="p-3 border-r border-black/10 text-right font-mono text-red-600">
                        ৳{item.dueAmount.toFixed(2)}
                      </td>
                      <td className="p-3 text-center">
                        <input
                          type="checkbox"
                          checked={!!item.selected}
                          onChange={() => onToggleInvoice(idx)}
                          className="w-4 h-4 accent-black cursor-pointer"
                        />
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Bottom Save Button */}
          <div className="flex justify-end pt-4">
            <button
              type="submit"
              disabled={isSaving}
              className="px-8 py-2.5 bg-[#00c5bb] hover:bg-[#00a89f] text-white border-2 border-black font-black uppercase text-xs shadow-[3px_3px_0px_#000] hover:shadow-[1px_1px_0px_#000] hover:translate-x-[2px] hover:translate-y-[2px] transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4 stroke-[2.5]" />}
              <span>SAVE</span>
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};
