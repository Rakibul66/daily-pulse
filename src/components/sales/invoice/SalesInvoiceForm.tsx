"use client";

import React from "react";
import { 
  ArrowLeft, 
  Save, 
  Loader2, 
  FileText, 
  ShoppingBag, 
  Plus, 
  Trash2 
} from "lucide-react";
import { Customer } from "@/types/customer";
import { Product } from "@/types/inventory";
import { SalesInvoiceFormData, DEFAULT_STORES, PAYMENT_TYPES } from "./types";

interface SalesInvoiceFormProps {
  editingInvoiceId: string | null;
  formData: SalesInvoiceFormData;
  setFormData: React.Dispatch<React.SetStateAction<SalesInvoiceFormData>>;
  customers: Customer[];
  products: Product[];
  selectedProductId: string;
  selectedQty: number;
  selectedRate: number;
  setSelectedQty: (qty: number) => void;
  setSelectedRate: (rate: number) => void;
  subtotal: number;
  discountAmount: number;
  netPayable: number;
  isSaving: boolean;
  onCustomerChange: (customerId: string) => void;
  onProductSelect: (productId: string) => void;
  onAddItem: () => void;
  onRemoveItem: (itemId: string) => void;
  onSaveInvoice: (e: React.FormEvent) => void;
  onCancel: () => void;
}

export const SalesInvoiceForm: React.FC<SalesInvoiceFormProps> = ({
  editingInvoiceId,
  formData,
  setFormData,
  customers,
  products,
  selectedProductId,
  selectedQty,
  selectedRate,
  setSelectedQty,
  setSelectedRate,
  subtotal,
  discountAmount,
  netPayable,
  isSaving,
  onCustomerChange,
  onProductSelect,
  onAddItem,
  onRemoveItem,
  onSaveInvoice,
  onCancel
}) => {
  return (
    <div className="space-y-6">
      {/* Form Header */}
      <div className="bg-white border-2 sm:border-4 border-black p-5 sm:p-6 shadow-[6px_6px_0px_#000] flex flex-wrap items-center justify-between gap-4">
        <div>
          <span className="text-[10px] font-black tracking-widest uppercase bg-indigo-600 text-white px-2 py-0.5 border border-black shadow-[2px_2px_0px_#000]">
            SALES TRANSACTION
          </span>
          <h2 className="font-display font-black text-xl sm:text-2xl uppercase tracking-tight text-black mt-1">
            {editingInvoiceId ? "EDIT SALES INVOICE" : "NEW SALES INVOICE"}
          </h2>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 bg-white hover:bg-slate-100 text-black border-2 border-black font-black uppercase text-xs shadow-[3px_3px_0px_#000] flex items-center gap-2 cursor-pointer transition-all"
          >
            <ArrowLeft className="w-4 h-4 stroke-[3]" />
            <span>GO BACK</span>
          </button>

          <button
            type="submit"
            form="sales-invoice-form"
            disabled={isSaving}
            className="px-6 py-2 bg-[#00c5bb] hover:bg-[#00a89f] text-white border-2 border-black font-black uppercase text-xs shadow-[3px_3px_0px_#000] hover:shadow-[1px_1px_0px_#000] hover:translate-x-[2px] hover:translate-y-[2px] flex items-center gap-2 cursor-pointer transition-all disabled:opacity-50"
          >
            {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4 stroke-[2.5]" />}
            <span>{editingInvoiceId ? "UPDATE INVOICE" : "SAVE INVOICE"}</span>
          </button>
        </div>
      </div>

      <form id="sales-invoice-form" onSubmit={onSaveInvoice} className="space-y-6">
        {/* 1. Header Information (Minimal 4-Column Grid) */}
        <div className="bg-white border-2 sm:border-4 border-black p-5 sm:p-6 shadow-[6px_6px_0px_#000] space-y-4">
          <h3 className="font-display font-black text-sm uppercase tracking-wider text-black border-b-2 border-black pb-2 flex items-center gap-2">
            <FileText className="w-4 h-4 text-black" />
            <span>1. INVOICE DETAILS</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Customer Selector */}
            <div className="space-y-1">
              <label className="block text-xs font-black uppercase tracking-wider text-black">
                Customer <span className="text-red-600 font-black">*</span>
              </label>
              <select
                value={formData.customerId}
                onChange={(e) => onCustomerChange(e.target.value)}
                className="w-full h-10 px-3 bg-white border-2 border-black font-bold text-xs text-black shadow-[2px_2px_0px_#000] focus:outline-hidden focus:ring-2 focus:ring-black cursor-pointer"
                required
              >
                <option value="">-- Select Customer --</option>
                {customers.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.businessName || c.ownerName} {c.phone ? `(${c.phone})` : ""}
                  </option>
                ))}
              </select>
            </div>

            {/* Invoice No. */}
            <div className="space-y-1">
              <label className="block text-xs font-black uppercase tracking-wider text-black">
                Invoice No. <span className="text-red-600 font-black">*</span>
              </label>
              <input
                type="text"
                value={formData.invoiceNo}
                onChange={(e) => setFormData({ ...formData, invoiceNo: e.target.value })}
                className="w-full h-10 px-3 bg-slate-50 border-2 border-black font-mono font-bold text-xs text-black shadow-[2px_2px_0px_#000] focus:outline-hidden focus:ring-2 focus:ring-black"
                required
              />
            </div>

            {/* Invoice Date */}
            <div className="space-y-1">
              <label className="block text-xs font-black uppercase tracking-wider text-black">
                Date <span className="text-red-600 font-black">*</span>
              </label>
              <input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className="w-full h-10 px-3 bg-white border-2 border-black font-bold text-xs text-black shadow-[2px_2px_0px_#000] focus:outline-hidden focus:ring-2 focus:ring-black cursor-pointer"
                required
              />
            </div>

            {/* Sales Type */}
            <div className="space-y-1">
              <label className="block text-xs font-black uppercase tracking-wider text-black">
                Sales Type <span className="text-red-600 font-black">*</span>
              </label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                className="w-full h-10 px-3 bg-white border-2 border-black font-bold text-xs text-black shadow-[2px_2px_0px_#000] focus:outline-hidden focus:ring-2 focus:ring-black cursor-pointer"
              >
                {PAYMENT_TYPES.map((pt) => (
                  <option key={pt} value={pt}>
                    {pt}
                  </option>
                ))}
              </select>
            </div>

            {/* Store */}
            <div className="space-y-1">
              <label className="block text-xs font-black uppercase tracking-wider text-black">
                Store / Branch <span className="text-red-600 font-black">*</span>
              </label>
              <select
                value={formData.storeName}
                onChange={(e) => setFormData({ ...formData, storeName: e.target.value })}
                className="w-full h-10 px-3 bg-white border-2 border-black font-bold text-xs text-black shadow-[2px_2px_0px_#000] focus:outline-hidden focus:ring-2 focus:ring-black cursor-pointer"
              >
                {DEFAULT_STORES.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>

            {/* Customer Phone (Auto-filled / Optional) */}
            <div className="space-y-1">
              <label className="block text-xs font-black uppercase tracking-wider text-black">
                Phone Number
              </label>
              <input
                type="text"
                placeholder="Customer phone"
                value={formData.customerPhone}
                onChange={(e) => setFormData({ ...formData, customerPhone: e.target.value })}
                className="w-full h-10 px-3 bg-white border-2 border-black font-mono font-bold text-xs text-black shadow-[2px_2px_0px_#000] focus:outline-hidden"
              />
            </div>

            {/* Customer Address */}
            <div className="space-y-1 lg:col-span-2">
              <label className="block text-xs font-black uppercase tracking-wider text-black">
                Billing Address
              </label>
              <input
                type="text"
                placeholder="Delivery/billing address"
                value={formData.customerAddress}
                onChange={(e) => setFormData({ ...formData, customerAddress: e.target.value })}
                className="w-full h-10 px-3 bg-white border-2 border-black font-bold text-xs text-black shadow-[2px_2px_0px_#000] focus:outline-hidden"
              />
            </div>
          </div>
        </div>

        {/* 2. Product Line Items (Minimal & Fast) */}
        <div className="bg-white border-2 sm:border-4 border-black p-5 sm:p-6 shadow-[6px_6px_0px_#000] space-y-4">
          <h3 className="font-display font-black text-sm uppercase tracking-wider text-black border-b-2 border-black pb-2 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-4 h-4 text-black" />
              <span>2. PRODUCT ITEMS</span>
            </div>
            <span className="text-xs font-bold text-slate-500">
              {formData.items.length} {formData.items.length === 1 ? "item" : "items"} added
            </span>
          </h3>

          {/* Minimal 4-field inline adder */}
          <div className="bg-amber-50 p-4 border-2 border-black shadow-[3px_3px_0px_#000]">
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-end">
              {/* Product Picker */}
              <div className="sm:col-span-6 space-y-1">
                <label className="block text-[11px] font-black uppercase tracking-wider text-black">
                  Select Product
                </label>
                <select
                  value={selectedProductId}
                  onChange={(e) => onProductSelect(e.target.value)}
                  className="w-full h-10 px-3 bg-white border-2 border-black font-bold text-xs text-black shadow-[2px_2px_0px_#000] focus:outline-hidden cursor-pointer"
                >
                  <option value="">-- Choose Product from Catalog --</option>
                  {products.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} {p.sku ? `(${p.sku})` : ""} — Stock: {p.stock}
                    </option>
                  ))}
                </select>
              </div>

              {/* Quantity */}
              <div className="sm:col-span-2 space-y-1">
                <label className="block text-[11px] font-black uppercase tracking-wider text-black">
                  Quantity
                </label>
                <input
                  type="number"
                  min={1}
                  value={selectedQty}
                  onChange={(e) => setSelectedQty(Math.max(1, Number(e.target.value)))}
                  className="w-full h-10 px-2.5 bg-white border-2 border-black font-mono font-bold text-xs text-black shadow-[2px_2px_0px_#000] focus:outline-hidden text-center"
                />
              </div>

              {/* Rate */}
              <div className="sm:col-span-2 space-y-1">
                <label className="block text-[11px] font-black uppercase tracking-wider text-black">
                  Rate (৳)
                </label>
                <input
                  type="number"
                  min={0}
                  step={0.01}
                  value={selectedRate}
                  onChange={(e) => setSelectedRate(Number(e.target.value))}
                  className="w-full h-10 px-2.5 bg-white border-2 border-black font-mono font-bold text-xs text-black shadow-[2px_2px_0px_#000] focus:outline-hidden text-right"
                />
              </div>

              {/* Add Button */}
              <div className="sm:col-span-2">
                <button
                  type="button"
                  onClick={onAddItem}
                  className="w-full h-10 bg-amber-300 hover:bg-amber-400 text-black border-2 border-black font-black uppercase text-xs shadow-[2px_2px_0px_#000] hover:shadow-[1px_1px_0px_#000] hover:translate-x-[1px] hover:translate-y-[1px] transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Plus className="w-4 h-4 stroke-[3]" />
                  <span>ADD ITEM</span>
                </button>
              </div>
            </div>
          </div>

          {/* Items Table */}
          <div className="border-2 border-black overflow-x-auto shadow-[3px_3px_0px_#000]">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-900 text-white font-display font-black uppercase tracking-wider border-b-2 border-black">
                  <th className="p-2.5 w-12 text-center border-r border-slate-700">Sl#</th>
                  <th className="p-2.5 w-28 border-r border-slate-700">Code</th>
                  <th className="p-2.5 border-r border-slate-700">Product Name</th>
                  <th className="p-2.5 w-24 text-right border-r border-slate-700">Rate</th>
                  <th className="p-2.5 w-20 text-center border-r border-slate-700">Qty</th>
                  <th className="p-2.5 w-28 text-right border-r border-slate-700">Amount</th>
                  <th className="p-2.5 w-16 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-black/20 font-bold bg-white">
                {formData.items.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="p-8 text-center text-slate-500 font-bold uppercase tracking-widest text-xs">
                      No products added yet. Select a product above and click Add Item.
                    </td>
                  </tr>
                ) : (
                  formData.items.map((item, idx) => (
                    <tr key={item.id} className="hover:bg-slate-50">
                      <td className="p-2.5 text-center border-r border-black/10 font-mono">
                        {idx + 1}
                      </td>
                      <td className="p-2.5 border-r border-black/10 font-mono">
                        {item.itemCode || "—"}
                      </td>
                      <td className="p-2.5 border-r border-black/10">
                        {item.productName}
                      </td>
                      <td className="p-2.5 text-right border-r border-black/10 font-mono">
                        ৳{item.rate.toFixed(2)}
                      </td>
                      <td className="p-2.5 text-center border-r border-black/10 font-mono">
                        {item.quantity}
                      </td>
                      <td className="p-2.5 text-right border-r border-black/10 font-mono font-black">
                        ৳{item.amount.toFixed(2)}
                      </td>
                      <td className="p-2.5 text-center">
                        <button
                          type="button"
                          onClick={() => onRemoveItem(item.id)}
                          className="p-1 text-red-600 hover:text-red-800 hover:bg-red-50 rounded cursor-pointer"
                          title="Remove item"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* 3. Totals & Billing Summary */}
        <div className="bg-white border-2 sm:border-4 border-black p-5 sm:p-6 shadow-[6px_6px_0px_#000]">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-end">
            {/* Notes */}
            <div className="md:col-span-6 space-y-1.5">
              <label className="block text-xs font-black uppercase tracking-wider text-black">
                Remarks / Delivery Notes
              </label>
              <textarea
                rows={3}
                placeholder="Enter any additional instructions or notes..."
                value={formData.remarks}
                onChange={(e) => setFormData({ ...formData, remarks: e.target.value })}
                className="w-full p-2.5 bg-white border-2 border-black font-bold text-xs text-black shadow-[2px_2px_0px_#000] focus:outline-hidden"
              />
            </div>

            {/* Calculation Summary Box */}
            <div className="md:col-span-6 space-y-3 bg-slate-50 p-4 border-2 border-black shadow-[3px_3px_0px_#000]">
              {/* Subtotal */}
              <div className="flex justify-between items-center text-xs font-bold text-black border-b border-black/20 pb-2">
                <span className="uppercase">Total Amount:</span>
                <span className="font-mono font-black text-sm">৳{subtotal.toFixed(2)}</span>
              </div>

              {/* Discount */}
              <div className="flex justify-between items-center gap-3 text-xs font-bold text-black border-b border-black/20 pb-2">
                <div className="flex items-center gap-2">
                  <span className="uppercase">Discount:</span>
                  <select
                    value={formData.discountType}
                    onChange={(e) => setFormData({ ...formData, discountType: e.target.value as "fixed" | "percentage" })}
                    className="px-2 py-1 bg-white border border-black text-[11px] font-bold cursor-pointer"
                  >
                    <option value="fixed">Fixed (৳)</option>
                    <option value="percentage">%</option>
                  </select>
                </div>
                <div className="w-28">
                  <input
                    type="number"
                    min={0}
                    value={formData.discountValue}
                    onChange={(e) => setFormData({ ...formData, discountValue: Number(e.target.value) })}
                    className="w-full px-2 py-1 bg-white border border-black font-mono font-bold text-xs text-right"
                  />
                </div>
              </div>

              {/* Net Payable Banner */}
              <div className="flex justify-between items-center p-3 bg-[#00c5bb] text-white border-2 border-black shadow-[2px_2px_0px_#000]">
                <span className="font-display font-black text-sm uppercase tracking-wider">
                  Net Payable:
                </span>
                <span className="font-mono font-black text-lg">
                  ৳{netPayable.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Actions */}
        <div className="flex justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={onCancel}
            className="px-5 py-2.5 bg-white hover:bg-slate-100 text-black border-2 border-black font-black uppercase text-xs shadow-[3px_3px_0px_#000] cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSaving}
            className="px-8 py-2.5 bg-[#00c5bb] hover:bg-[#00a89f] text-white border-2 border-black font-black uppercase text-xs shadow-[4px_4px_0px_#000] hover:shadow-[1px_1px_0px_#000] hover:translate-x-[2px] hover:translate-y-[2px] transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4 stroke-[2.5]" />}
            <span>{editingInvoiceId ? "Save Changes" : "Create Invoice"}</span>
          </button>
        </div>
      </form>
    </div>
  );
};
