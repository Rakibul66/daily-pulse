"use client";

import React from 'react';
import { 
  RotateCcw, 
  ArrowLeft, 
  Save, 
  ShoppingBag, 
  Plus, 
  Trash2, 
  DollarSign 
} from 'lucide-react';
import { PurchaseReturnItem, PurchaseVendor } from '@/types/purchase';
import { Product } from '@/types/product';
import { DEFAULT_STORES } from '@/lib/purchaseStorage';

interface PurchaseReturnFormProps {
  editingId: string | null;
  formData: {
    company: string;
    vendor: string;
    vendorId: string;
    store: string;
    returnDate: string;
    staff: string;
    remarks: string;
    amount: number;
    items: PurchaseReturnItem[];
  };
  setFormData: React.Dispatch<React.SetStateAction<{
    company: string;
    vendor: string;
    vendorId: string;
    store: string;
    returnDate: string;
    staff: string;
    remarks: string;
    amount: number;
    items: PurchaseReturnItem[];
  }>>;
  vendors: PurchaseVendor[];
  productsCatalog: Product[];
  selectedProductCode: string;
  setSelectedProductCode: (val: string) => void;
  returnQty: number;
  setReturnQty: (val: number) => void;
  onAddProductToItems: () => void;
  onItemFieldChange: (id: string, field: "rate" | "quantity", value: number) => void;
  onRemoveItem: (id: string) => void;
  isSaving: boolean;
  onSave: () => void;
  onCancel: () => void;
}

export const PurchaseReturnForm: React.FC<PurchaseReturnFormProps> = ({
  editingId,
  formData,
  setFormData,
  vendors,
  productsCatalog,
  selectedProductCode,
  setSelectedProductCode,
  returnQty,
  setReturnQty,
  onAddProductToItems,
  onItemFieldChange,
  onRemoveItem,
  isSaving,
  onSave,
  onCancel,
}) => {
  return (
    <div className="w-full pb-20">
      <div className="bg-white border-2 sm:border-4 border-black shadow-[6px_6px_0px_#000]">
        {/* Header Action Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 p-4 sm:p-5 border-b-2 sm:border-b-4 border-black bg-slate-900 text-white">
          <h2 className="font-display font-black text-sm sm:text-base tracking-wide uppercase flex items-center gap-2">
            <RotateCcw className="w-5 h-5 text-amber-400" />
            {editingId ? "EDIT PURCHASE RETURN" : "ADD NEW PURCHASE RETURN"}
          </h2>
          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 bg-white hover:bg-slate-100 text-black font-display font-black text-xs uppercase border-2 border-black shadow-[2px_2px_0px_#fff] flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4 stroke-[2.5]" /> GO BACK
            </button>
            <button
              type="button"
              onClick={onSave}
              disabled={isSaving}
              className="px-5 py-2 bg-cyan-400 hover:bg-cyan-300 text-black font-display font-black text-xs uppercase border-2 border-black shadow-[3px_3px_0px_#000] flex items-center gap-1.5 transition-all cursor-pointer disabled:opacity-50"
            >
              <Save className="w-4 h-4 stroke-[2.5]" /> {isSaving ? "SAVING..." : "SAVE RETURN"}
            </button>
          </div>
        </div>

        {/* Form Content */}
        <div className="p-4 sm:p-6 bg-white space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
            <div>
              <label className="block text-xs font-display font-black uppercase text-black mb-1.5">
                Company Name <span className="text-red-600">*</span>
              </label>
              <input
                type="text"
                value={formData.company}
                onChange={(e) => setFormData(prev => ({ ...prev, company: e.target.value }))}
                placeholder="M/S Buyzid Rubber"
                required
                className="w-full bg-white border-2 border-black px-3 py-2.5 text-xs font-bold text-black shadow-[2px_2px_0px_#000] outline-none focus:bg-amber-50"
              />
            </div>

            <div>
              <label className="block text-xs font-display font-black uppercase text-black mb-1.5">
                Vendor <span className="text-red-600">*</span>
              </label>
              <select
                value={formData.vendor}
                onChange={(e) => {
                  const sel = vendors.find((v) => v.name === e.target.value);
                  setFormData(prev => ({
                    ...prev,
                    vendor: e.target.value,
                    vendorId: sel ? sel.id : "",
                  }));
                }}
                className="w-full bg-white border-2 border-black px-3 py-2.5 text-xs font-bold text-black shadow-[2px_2px_0px_#000] outline-none focus:bg-amber-50 cursor-pointer"
              >
                <option value="">Select Vendor</option>
                {vendors.map((v) => (
                  <option key={v.id} value={v.name}>{v.name}</option>
                ))}
                {vendors.length === 0 && (
                  <>
                    <option value="Square Food and Beverage">Square Food and Beverage</option>
                    <option value="Darkin Trade & Distribution">Darkin Trade & Distribution</option>
                    <option value="International Distribution">International Distribution</option>
                    <option value="M/S Muhammad Corporation">M/S Muhammad Corporation</option>
                    <option value="Prestige Bengal Ltd">Prestige Bengal Ltd</option>
                    <option value="SS Distribution">SS Distribution</option>
                    <option value="PRAN GROUP">PRAN GROUP</option>
                    <option value="Nestle">Nestle</option>
                  </>
                )}
              </select>
            </div>

            <div>
              <label className="block text-xs font-display font-black uppercase text-black mb-1.5">
                Return Date <span className="text-red-600">*</span>
              </label>
              <input
                type="date"
                value={formData.returnDate}
                onChange={(e) => setFormData(prev => ({ ...prev, returnDate: e.target.value }))}
                required
                className="w-full bg-white border-2 border-black px-3 py-2.5 text-xs font-bold text-black shadow-[2px_2px_0px_#000] outline-none focus:bg-amber-50"
              />
            </div>

            <div>
              <label className="block text-xs font-display font-black uppercase text-black mb-1.5">
                Store / Branch <span className="text-red-600">*</span>
              </label>
              <select
                value={formData.store}
                onChange={(e) => setFormData(prev => ({ ...prev, store: e.target.value }))}
                className="w-full bg-white border-2 border-black px-3 py-2.5 text-xs font-bold text-black shadow-[2px_2px_0px_#000] outline-none cursor-pointer"
              >
                {DEFAULT_STORES.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-display font-black uppercase text-black mb-1.5">
                Staff / Inspector
              </label>
              <input
                type="text"
                value={formData.staff}
                onChange={(e) => setFormData(prev => ({ ...prev, staff: e.target.value }))}
                placeholder="Arnob Sur"
                className="w-full bg-white border-2 border-black px-3 py-2.5 text-xs font-bold text-black shadow-[2px_2px_0px_#000] outline-none focus:bg-amber-50"
              />
            </div>

            <div>
              <label className="block text-xs font-display font-black uppercase text-black mb-1.5">
                Reason / Remarks <span className="text-red-600">*</span>
              </label>
              <select
                value={formData.remarks}
                onChange={(e) => setFormData(prev => ({ ...prev, remarks: e.target.value }))}
                className="w-full bg-white border-2 border-black px-3 py-2.5 text-xs font-bold text-black shadow-[2px_2px_0px_#000] outline-none cursor-pointer"
              >
                <option value="Date Over">Date Over</option>
                <option value="Damaged packaging">Damaged packaging</option>
                <option value="Expired batch">Expired batch</option>
                <option value="Wrong barcode">Wrong barcode</option>
                <option value="Defective item">Defective item</option>
                <option value="Quality rejection">Quality rejection</option>
                <option value="Over-supplied">Over-supplied</option>
              </select>
            </div>
          </div>

          {/* Optional Item Picker Section */}
          <div className="p-4 border-2 border-black bg-amber-50 shadow-[3px_3px_0px_#000] space-y-4">
            <div className="text-xs font-display font-black uppercase text-black tracking-wide flex items-center gap-1.5">
              <ShoppingBag className="w-4 h-4 text-indigo-700" /> ATTACH RETURN PRODUCTS (OPTIONAL ITEMIZATION)
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 sm:gap-4 items-end">
              <div className="sm:col-span-8">
                <label className="block text-xs font-display font-black uppercase text-black mb-1">
                  Select Product from Catalog
                </label>
                <select
                  value={selectedProductCode}
                  onChange={(e) => setSelectedProductCode(e.target.value)}
                  className="w-full bg-white border-2 border-black px-3 py-2 text-xs font-bold text-black shadow-[2px_2px_0px_#000] outline-none"
                >
                  <option value="">Select Product</option>
                  {productsCatalog.map((prod) => (
                    <option key={prod.id} value={prod.code || prod.barcode || prod.sku || prod.id}>
                      [{prod.code || prod.sku}] {prod.name} ({prod.parentCategory || prod.category}) - ৳{prod.purchasePrice || prod.cost || prod.retailPrice}
                    </option>
                  ))}
                  {productsCatalog.length === 0 && (
                    <>
                      <option value="89012351">[89012351] Radhuni Master Oil 1L - Cooking &amp; Spices (৳222.41)</option>
                      <option value="89012352">[89012352] Instant Noodles Pack (Box) - Snacks (৳160.00)</option>
                      <option value="89012353">[89012353] Tomato Ketchup 200g - Cooking &amp; Spices (৳63.00)</option>
                    </>
                  )}
                </select>
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-display font-black uppercase text-black mb-1">
                  Return Qty
                </label>
                <input
                  type="number"
                  min="1"
                  value={returnQty}
                  onChange={(e) => setReturnQty(Math.max(1, parseInt(e.target.value) || 1))}
                  className="w-full bg-white border-2 border-black px-2 py-2 text-xs font-bold text-black text-center shadow-[2px_2px_0px_#000] outline-none"
                />
              </div>

              <div className="sm:col-span-2">
                <button
                  type="button"
                  onClick={onAddProductToItems}
                  className="w-full py-2 bg-cyan-400 hover:bg-cyan-300 text-black font-display font-black text-xs uppercase border-2 border-black shadow-[2px_2px_0px_#000] flex items-center justify-center gap-1 cursor-pointer"
                >
                  <Plus className="w-4 h-4 stroke-[3]" /> Add Item
                </button>
              </div>
            </div>

            {/* Items Table if any */}
            {formData.items.length > 0 && (
              <div className="border-2 border-black shadow-[3px_3px_0px_#000] overflow-x-auto bg-white mt-3">
                <table className="w-full text-left text-xs border-collapse">
                  <thead className="bg-slate-900 text-white font-black uppercase">
                    <tr>
                      <th className="p-2 border-r border-slate-700">Product Name</th>
                      <th className="p-2 border-r border-slate-700">Code</th>
                      <th className="p-2 border-r border-slate-700 w-24 text-right">Rate (৳)</th>
                      <th className="p-2 border-r border-slate-700 w-20 text-center">Qty</th>
                      <th className="p-2 border-r border-slate-700 w-28 text-right">Amount (৳)</th>
                      <th className="p-2 text-center w-12">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-black font-bold">
                    {formData.items.map((item) => (
                      <tr key={item.id} className="hover:bg-amber-50">
                        <td className="p-2 border-r border-black">{item.productName}</td>
                        <td className="p-2 border-r border-black font-mono text-[11px]">{item.code}</td>
                        <td className="p-2 border-r border-black text-right">
                          <input
                            type="number"
                            min="0"
                            step="any"
                            value={item.rate}
                            onChange={(e) => onItemFieldChange(item.id, "rate", parseFloat(e.target.value) || 0)}
                            className="w-20 bg-white border border-black px-1.5 py-0.5 text-xs font-bold text-right outline-none"
                          />
                        </td>
                        <td className="p-2 border-r border-black text-center">
                          <input
                            type="number"
                            min="1"
                            value={item.quantity}
                            onChange={(e) => onItemFieldChange(item.id, "quantity", parseInt(e.target.value) || 0)}
                            className="w-14 bg-white border border-black px-1.5 py-0.5 text-xs font-bold text-center outline-none"
                          />
                        </td>
                        <td className="p-2 border-r border-black text-right font-black">
                          {item.amount.toFixed(2)}
                        </td>
                        <td className="p-2 text-center">
                          <button
                            type="button"
                            onClick={() => onRemoveItem(item.id)}
                            className="p-1 bg-rose-500 hover:bg-rose-600 text-white border border-black cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Total Return Amount Card */}
          <div className="flex flex-wrap items-center justify-between gap-4 p-4 border-2 sm:border-4 border-black bg-slate-900 text-white shadow-[4px_4px_0px_#000]">
            <div className="text-xs font-black uppercase text-amber-400 flex items-center gap-2">
              <DollarSign className="w-5 h-5" /> TOTAL RETURN / DEBIT ADJUSTMENT VALUE
            </div>
            <div className="flex items-center gap-3">
              <span className="text-xs font-bold text-slate-300 uppercase">Amount (৳):</span>
              <input
                type="number"
                min="0"
                step="any"
                value={formData.amount}
                onChange={(e) => setFormData(prev => ({ ...prev, amount: parseFloat(e.target.value) || 0 }))}
                className="w-48 bg-white border-2 border-black px-3 py-1.5 text-sm font-mono font-black text-black shadow-[2px_2px_0px_#fff] outline-none text-right"
                required
              />
            </div>
          </div>

          {/* Save Buttons */}
          <div className="flex justify-end gap-3 pt-4 border-t-2 border-black">
            <button
              type="button"
              onClick={onCancel}
              className="px-6 py-2.5 bg-white text-black font-display font-black text-xs uppercase border-2 border-black shadow-[2px_2px_0px_#000] cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={onSave}
              disabled={isSaving}
              className="px-8 py-2.5 bg-cyan-400 hover:bg-cyan-300 text-black font-display font-black text-xs uppercase tracking-wider border-2 border-black shadow-[4px_4px_0px_#000] flex items-center gap-2 transition-all cursor-pointer disabled:opacity-50"
            >
              <Save className="w-4 h-4 stroke-[2.5]" /> {isSaving ? "SAVING..." : "SAVE RETURN"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
