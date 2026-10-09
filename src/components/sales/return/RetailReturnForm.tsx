"use client";

import React from 'react';
import { 
  RotateCcw,
  ArrowLeft,
  Save,
  Loader2, 
  Package, 
  PlusCircle 
} from 'lucide-react';
import { SalesReturnItem, DailySale } from '@/types/sales';

interface RetailReturnFormProps {
  editingId: string | null;
  formSelectedInvoice: string;
  allInvoices: DailySale[];
  onSelectInvoice: (invoiceNo: string) => void;
  formReturnDate: string;
  setFormReturnDate: (date: string) => void;
  formReturnNo: string;
  setFormReturnNo: (no: string) => void;
  formStore: string;
  setFormStore: (store: string) => void;
  storeOptions: string[];
  formReturnReason: string;
  setFormReturnReason: (reason: string) => void;
  formReturnAmount: number;
  formClient: { id: string; name: string; phone?: string };
  formStaff: string;
  setFormStaff: (staff: string) => void;
  formItems: SalesReturnItem[];
  onToggleAllItems: () => void;
  onToggleItemSelect: (id: string) => void;
  onUpdateItem: (id: string, field: keyof SalesReturnItem, value: any) => void;
  onAddProductRow: () => void;
  isSaving: boolean;
  onSave: () => void;
  onGoBack: () => void;
}

export const RetailReturnForm: React.FC<RetailReturnFormProps> = ({
  editingId,
  formSelectedInvoice,
  allInvoices,
  onSelectInvoice,
  formReturnDate,
  setFormReturnDate,
  formReturnNo,
  setFormReturnNo,
  formStore,
  setFormStore,
  storeOptions,
  formReturnReason,
  setFormReturnReason,
  formReturnAmount,
  formClient,
  formStaff,
  setFormStaff,
  formItems,
  onToggleAllItems,
  onToggleItemSelect,
  onUpdateItem,
  onAddProductRow,
  isSaving,
  onSave,
  onGoBack,
}) => {
  return (
    <div className="w-full pb-20 space-y-6">
      {/* Top Header Card matching Website Pattern */}
      <div className="bg-white border-2 sm:border-4 border-black p-5 sm:p-6 shadow-[6px_6px_0px_#000] flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-amber-300 border-2 border-black shadow-[2px_2px_0px_#000]">
            <RotateCcw className="w-6 h-6 text-black stroke-[2.5]" />
          </div>
          <div>
            <h2 className="font-display font-black text-lg sm:text-xl uppercase tracking-wider text-black">
              {editingId ? 'EDIT RETAIL RETURN' : 'ADD NEW RETAIL RETURN'}
            </h2>
            <p className="text-xs font-bold text-slate-600 uppercase tracking-wider">
              {editingId ? 'Modify return quantities and refund amounts' : 'Create a customer return invoice and update branch inventory'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onGoBack}
            disabled={isSaving}
            className="px-5 py-2 bg-white hover:bg-slate-100 text-black border-2 border-black font-black uppercase text-xs shadow-[3px_3px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none flex items-center gap-1.5 cursor-pointer transition-all"
          >
            <ArrowLeft className="w-4 h-4 stroke-[3]" />
            <span>GO BACK</span>
          </button>
          <button
            type="button"
            onClick={onSave}
            disabled={isSaving}
            className="px-6 py-2 bg-cyan-400 hover:bg-cyan-300 text-black border-2 border-black font-black uppercase text-xs shadow-[3px_3px_0px_#000] hover:shadow-[1px_1px_0px_#000] hover:translate-x-[2px] hover:translate-y-[2px] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none flex items-center gap-1.5 cursor-pointer transition-all disabled:opacity-50"
          >
            {isSaving ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-black" />
                <span>SAVING...</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4 stroke-[2.5]" />
                <span>SAVE</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Form Fields Card */}
      <div className="bg-white border-2 sm:border-4 border-black p-5 sm:p-6 shadow-[6px_6px_0px_#000] space-y-6 text-black">
        {/* Row 1: Retail Invoice *, Date *, Return No *, Store * */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Retail Invoice * */}
          <div className="space-y-1">
            <label className="block text-xs font-black uppercase tracking-wider text-black">
              Retail Invoice <span className="text-red-600">*</span>
            </label>
            <select
              value={formSelectedInvoice}
              onChange={(e) => onSelectInvoice(e.target.value)}
              className="w-full h-10 px-3 bg-white border-2 border-black font-bold text-xs text-black shadow-[2px_2px_0px_#000] focus:outline-hidden focus:ring-2 focus:ring-black cursor-pointer"
            >
              <option value="">Select Invoice</option>
              {allInvoices.map((inv) => (
                <option key={inv.id} value={inv.invoiceNo}>
                  {inv.invoiceNo} {inv.clientName ? `- ${inv.clientName}` : ''} (৳{inv.netPayable || inv.netInvoiceAmount || 0})
                </option>
              ))}
            </select>
          </div>

          {/* Date * */}
          <div className="space-y-1">
            <label className="block text-xs font-black uppercase tracking-wider text-black">
              Date <span className="text-red-600">*</span>
            </label>
            <input
              type="text"
              value={formReturnDate}
              onChange={(e) => setFormReturnDate(e.target.value)}
              placeholder="09-10-2026"
              className="w-full h-10 px-3 bg-white border-2 border-black font-mono font-bold text-xs text-black shadow-[2px_2px_0px_#000] focus:outline-hidden focus:ring-2 focus:ring-black"
            />
          </div>

          {/* Return No * */}
          <div className="space-y-1">
            <label className="block text-xs font-black uppercase tracking-wider text-black">
              Return No <span className="text-red-600">*</span>
            </label>
            <input
              type="text"
              value={formReturnNo}
              onChange={(e) => setFormReturnNo(e.target.value)}
              placeholder="RR26100001"
              className="w-full h-10 px-3 bg-white border-2 border-black font-mono font-bold text-xs text-black shadow-[2px_2px_0px_#000] focus:outline-hidden focus:ring-2 focus:ring-black"
            />
          </div>

          {/* Store * */}
          <div className="space-y-1">
            <label className="block text-xs font-black uppercase tracking-wider text-black">
              Store <span className="text-red-600">*</span>
            </label>
            <div className="relative">
              <select
                value={formStore}
                onChange={(e) => setFormStore(e.target.value)}
                className="w-full h-10 px-3 bg-white border-2 border-black font-bold text-xs text-black shadow-[2px_2px_0px_#000] focus:outline-hidden focus:ring-2 focus:ring-black cursor-pointer pr-8"
              >
                {storeOptions.map((store) => (
                  <option key={store} value={store}>
                    {store}
                  </option>
                ))}
              </select>
              {formStore && (
                <button
                  type="button"
                  onClick={() => setFormStore(storeOptions[0] || '')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-black hover:text-red-600 font-black text-sm cursor-pointer"
                  title="Reset store"
                >
                  ×
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Row 2: Return Reason & Return Amount */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-2 space-y-1">
            <label className="block text-xs font-black uppercase tracking-wider text-black">
              Return Reason
            </label>
            <input
              type="text"
              value={formReturnReason}
              onChange={(e) => setFormReturnReason(e.target.value)}
              placeholder="e.g. Defective item, customer changed mind, wrong size"
              className="w-full h-10 px-3 bg-white border-2 border-black font-bold text-xs text-black shadow-[2px_2px_0px_#000] focus:outline-hidden focus:ring-2 focus:ring-black"
            />
          </div>

          <div className="space-y-1">
            <label className="block text-xs font-black uppercase tracking-wider text-black">
              Return Amount (৳)
            </label>
            <input
              type="text"
              readOnly
              value={formReturnAmount === 0 ? '0.00' : formReturnAmount.toFixed(2)}
              className="w-full h-10 px-3 bg-amber-100 border-2 border-black font-mono font-black text-xs text-black shadow-[2px_2px_0px_#000] focus:outline-hidden"
            />
          </div>
        </div>

        {/* Customer Info Pill if Available */}
        {formClient.name && (
          <div className="p-3 bg-amber-100 border-2 border-black shadow-[2px_2px_0px_#000] flex flex-wrap items-center justify-between text-xs text-black font-bold gap-3">
            <div className="flex items-center gap-2">
              <span className="font-black uppercase">Customer:</span>
              <span className="text-black font-black">{formClient.name}</span>
              {formClient.phone && <span className="font-mono text-slate-700">({formClient.phone})</span>}
            </div>
            <div className="flex items-center gap-2">
              <span className="font-black uppercase">Handled by:</span>
              <input
                type="text"
                value={formStaff}
                onChange={(e) => setFormStaff(e.target.value)}
                className="bg-white border-2 border-black text-black font-bold text-xs px-2.5 py-1 shadow-[1px_1px_0px_#000] w-32 text-center"
              />
            </div>
          </div>
        )}

        {/* Return Products Table */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="block text-xs font-black uppercase tracking-wider text-black">
              Return Items & Quantities
            </label>
            <button
              type="button"
              onClick={onAddProductRow}
              className="px-3 py-1 bg-amber-300 hover:bg-amber-400 text-black border-2 border-black font-black text-xs shadow-[2px_2px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <PlusCircle className="w-3.5 h-3.5" /> + Add Manual Item
            </button>
          </div>

          <div className="border-2 sm:border-4 border-black overflow-x-auto shadow-[4px_4px_0px_#000]">
            <table className="w-full text-center text-xs whitespace-nowrap">
              <thead className="bg-slate-900 text-white font-display font-black text-xs uppercase tracking-wider border-b-4 border-black">
                <tr>
                  <th className="p-3 text-left border-r-2 border-slate-700">Product Name</th>
                  <th className="p-3 border-r-2 border-slate-700">Invoice</th>
                  <th className="p-3 border-r-2 border-slate-700">Sales Qty</th>
                  <th className="p-3 border-r-2 border-slate-700">Returned Qty</th>
                  <th className="p-3 border-r-2 border-slate-700">Current Return</th>
                  <th className="p-3 border-r-2 border-slate-700">Rate</th>
                  <th className="p-3 border-r-2 border-slate-700 text-right">Amount</th>
                  <th className="p-3 w-12 text-center">
                    <input
                      type="checkbox"
                      checked={formItems.length > 0 && formItems.every(i => i.selected)}
                      onChange={onToggleAllItems}
                      className="w-4 h-4 accent-black cursor-pointer"
                      title="Toggle all items"
                    />
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y-2 divide-black/20 font-bold bg-white">
                {formItems.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="p-10 text-center text-slate-500">
                      <Package className="w-8 h-8 mx-auto mb-2 text-slate-400" />
                      <p className="font-black uppercase text-xs">No products in retail return</p>
                      <p className="text-xs text-slate-600 mt-1">
                        Select an invoice above from <strong>Retail Invoice</strong> or add a manual product row
                      </p>
                      <button
                        type="button"
                        onClick={onAddProductRow}
                        className="mt-3 inline-flex items-center gap-1.5 px-3 py-1.5 bg-amber-300 hover:bg-amber-400 text-black border-2 border-black font-black text-xs shadow-[2px_2px_0px_#000] cursor-pointer"
                      >
                        <PlusCircle className="w-3.5 h-3.5" /> + Add Manual Item
                      </button>
                    </td>
                  </tr>
                ) : (
                  formItems.map((item) => (
                    <tr key={item.id} className="hover:bg-amber-50/80 transition-colors">
                      {/* Product Name */}
                      <td className="p-2.5 text-left border-r-2 border-black/10">
                        <input
                          type="text"
                          value={item.productName}
                          onChange={(e) => onUpdateItem(item.id, 'productName', e.target.value)}
                          className="w-full min-w-[170px] bg-white border-2 border-black text-black font-bold text-xs px-2.5 py-1 shadow-[1px_1px_0px_#000] focus:outline-hidden"
                        />
                      </td>

                      {/* Invoice */}
                      <td className="p-2.5 border-r-2 border-black/10">
                        <input
                          type="text"
                          value={item.invoiceNo || ''}
                          onChange={(e) => onUpdateItem(item.id, 'invoiceNo', e.target.value)}
                          placeholder="INV-..."
                          className="w-28 bg-white border-2 border-black text-black font-mono font-bold text-xs px-2 py-1 text-center shadow-[1px_1px_0px_#000] focus:outline-hidden"
                        />
                      </td>

                      {/* Sales Qty */}
                      <td className="p-2.5 border-r-2 border-black/10 font-mono font-bold text-black">
                        <span className="px-2 py-1 bg-slate-100 border border-black/30">
                          {item.salesQty}
                        </span>
                      </td>

                      {/* Returned Qty */}
                      <td className="p-2.5 border-r-2 border-black/10 font-mono font-bold text-black">
                        <span className="px-2 py-1 bg-slate-100 border border-black/30">
                          {item.returnedQty || 0}
                        </span>
                      </td>

                      {/* Current Return */}
                      <td className="p-2.5 border-r-2 border-black/10">
                        <input
                          type="number"
                          min="0"
                          max={item.salesQty || 9999}
                          value={item.currentReturn}
                          onChange={(e) => onUpdateItem(item.id, 'currentReturn', Math.max(0, Number(e.target.value) || 0))}
                          className="w-20 bg-emerald-50 border-2 border-emerald-600 font-mono font-black text-emerald-900 text-xs px-2 py-1 text-center shadow-[1px_1px_0px_#000] focus:outline-hidden"
                        />
                      </td>

                      {/* Rate */}
                      <td className="p-2.5 border-r-2 border-black/10">
                        <input
                          type="number"
                          min="0"
                          step="any"
                          value={item.rate}
                          onChange={(e) => onUpdateItem(item.id, 'rate', Math.max(0, Number(e.target.value) || 0))}
                          className="w-24 bg-white border-2 border-black text-black font-mono font-bold text-xs px-2 py-1 text-right shadow-[1px_1px_0px_#000] focus:outline-hidden"
                        />
                      </td>

                      {/* Amount */}
                      <td className="p-2.5 text-right font-mono font-black text-black text-xs border-r-2 border-black/10">
                        ৳{Number(item.amount || 0).toFixed(2)}
                      </td>

                      {/* Checkbox */}
                      <td className="p-2.5 text-center">
                        <input
                          type="checkbox"
                          checked={item.selected !== false}
                          onChange={() => onToggleItemSelect(item.id)}
                          className="w-4 h-4 accent-black cursor-pointer"
                        />
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {formItems.length > 0 && (
            <div className="p-3 bg-amber-200 border-2 border-black shadow-[2px_2px_0px_#000] flex items-center justify-between text-xs font-black uppercase text-black">
              <div>
                Selected Items: {formItems.filter(i => i.selected !== false).length} of {formItems.length}
              </div>
              <div className="font-mono text-sm">
                Total Refund: ৳{formReturnAmount.toFixed(2)}
              </div>
            </div>
          )}
        </div>

        {/* Bottom Save Action */}
        <div className="pt-2 flex justify-end">
          <button
            type="button"
            onClick={onSave}
            disabled={isSaving}
            className="px-8 py-2.5 bg-cyan-400 hover:bg-cyan-300 text-black border-2 border-black font-black uppercase text-xs shadow-[3px_3px_0px_#000] hover:shadow-[1px_1px_0px_#000] hover:translate-x-[2px] hover:translate-y-[2px] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none flex items-center gap-1.5 cursor-pointer transition-all disabled:opacity-50"
          >
            {isSaving ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-black" />
                <span>SAVING...</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4 stroke-[2.5]" />
                <span>SAVE RETURN</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
