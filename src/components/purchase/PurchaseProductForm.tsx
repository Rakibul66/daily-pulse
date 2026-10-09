"use client";

import React from 'react';
import { 
  ShoppingBag, 
  ArrowLeft, 
  Save, 
  Plus, 
  Trash2, 
  Tag 
} from 'lucide-react';
import { ProductLiftItem, PurchaseVendor } from '@/types/purchase';
import { Product } from '@/types/product';
import { 
  DEFAULT_LIFTING_TYPES, 
  DEFAULT_PAYMENT_TYPES, 
  DEFAULT_STORES 
} from '@/lib/purchaseStorage';

interface PurchaseProductFormProps {
  editingId: string | null;
  formData: {
    liftingType: string;
    paymentType: string;
    purchaseNo: string;
    purchaseDate: string;
    vendor: string;
    vendorId: string;
    voucherNo: string;
    store: string;
    items: ProductLiftItem[];
    discountType: "fixed" | "percentage";
    discountValue: number;
  };
  setFormData: React.Dispatch<React.SetStateAction<{
    liftingType: string;
    paymentType: string;
    purchaseNo: string;
    purchaseDate: string;
    vendor: string;
    vendorId: string;
    voucherNo: string;
    store: string;
    items: ProductLiftItem[];
    discountType: "fixed" | "percentage";
    discountValue: number;
  }>>;
  vendors: PurchaseVendor[];
  productsCatalog: Product[];
  selectedProductCode: string;
  setSelectedProductCode: (val: string) => void;
  productAddQty: number;
  setProductAddQty: (val: number) => void;
  onAddProductToItems: () => void;
  onItemFieldChange: (id: string, field: "rate" | "quantity", value: number) => void;
  onRemoveItem: (id: string) => void;
  calculatedSubtotal: number;
  calculatedDiscountAmount: number;
  calculatedNetPayable: number;
  isSaving: boolean;
  onSave: () => void;
  onCancel: () => void;
}

export const PurchaseProductForm: React.FC<PurchaseProductFormProps> = ({
  editingId,
  formData,
  setFormData,
  vendors,
  productsCatalog,
  selectedProductCode,
  setSelectedProductCode,
  productAddQty,
  setProductAddQty,
  onAddProductToItems,
  onItemFieldChange,
  onRemoveItem,
  calculatedSubtotal,
  calculatedDiscountAmount,
  calculatedNetPayable,
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
            <ShoppingBag className="w-5 h-5 text-amber-400" />
            {editingId ? `EDIT PRODUCT LIFTING: ${formData.purchaseNo}` : "ADD PRODUCT LIFTING"}
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
              <Save className="w-4 h-4 stroke-[2.5]" /> {isSaving ? "SAVING..." : "SAVE"}
            </button>
          </div>
        </div>

        {/* Form Content */}
        <div className="p-4 sm:p-6 bg-white space-y-6">
          
          {/* Row 1: Lifting Type, Payment Type, Purchase No. */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
            <div>
              <label className="block text-xs font-display font-black uppercase text-black mb-1.5">
                Lifting Type <span className="text-red-600">*</span>
              </label>
              <select
                value={formData.liftingType}
                onChange={(e) => setFormData(prev => ({ ...prev, liftingType: e.target.value }))}
                className="w-full bg-white border-2 border-black px-3 py-2.5 text-xs font-bold text-black shadow-[2px_2px_0px_#000] outline-none focus:bg-amber-50 cursor-pointer"
              >
                {DEFAULT_LIFTING_TYPES.map((lt) => (
                  <option key={lt} value={lt}>{lt}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-display font-black uppercase text-black mb-1.5">
                Payment Type <span className="text-red-600">*</span>
              </label>
              <select
                value={formData.paymentType}
                onChange={(e) => setFormData(prev => ({ ...prev, paymentType: e.target.value }))}
                className="w-full bg-white border-2 border-black px-3 py-2.5 text-xs font-bold text-black shadow-[2px_2px_0px_#000] outline-none focus:bg-amber-50 cursor-pointer"
              >
                {DEFAULT_PAYMENT_TYPES.map((pt) => (
                  <option key={pt} value={pt}>{pt}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-display font-black uppercase text-black mb-1.5">
                Purchase No. <span className="text-red-600">*</span>
              </label>
              <input
                type="text"
                value={formData.purchaseNo}
                onChange={(e) => setFormData(prev => ({ ...prev, purchaseNo: e.target.value }))}
                placeholder="STL2610000001"
                required
                className="w-full bg-white border-2 border-black px-3 py-2.5 text-xs font-mono font-bold text-black shadow-[2px_2px_0px_#000] outline-none focus:bg-amber-50"
              />
            </div>
          </div>

          {/* Row 2: Purchase Date, Vendor, Voucher No. */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
            <div>
              <label className="block text-xs font-display font-black uppercase text-black mb-1.5">
                Purchase Date <span className="text-red-600">*</span>
              </label>
              <input
                type="date"
                value={formData.purchaseDate}
                onChange={(e) => setFormData(prev => ({ ...prev, purchaseDate: e.target.value }))}
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
                  const selected = vendors.find((v) => v.name === e.target.value);
                  setFormData(prev => ({
                    ...prev,
                    vendor: e.target.value,
                    vendorId: selected ? selected.id : "",
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
                    <option value="A.K TRADING CORPORATION">A.K TRADING CORPORATION</option>
                    <option value="Aarong Dairy">Aarong Dairy</option>
                    <option value="3S Distributor">3S Distributor</option>
                    <option value="Abul Khair Consumer Point">Abul Khair Consumer Point</option>
                  </>
                )}
              </select>
            </div>

            <div>
              <label className="block text-xs font-display font-black uppercase text-black mb-1.5">
                Voucher No.
              </label>
              <input
                type="text"
                value={formData.voucherNo}
                onChange={(e) => setFormData(prev => ({ ...prev, voucherNo: e.target.value }))}
                placeholder="Voucher No."
                className="w-full bg-white border-2 border-black px-3 py-2.5 text-xs font-bold text-black shadow-[2px_2px_0px_#000] outline-none focus:bg-amber-50"
              />
            </div>
          </div>

          {/* Row 3: Receive Store, Products Picker, Quantity, Add Product Button */}
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 sm:gap-4 p-4 border-2 border-black bg-amber-50 shadow-[3px_3px_0px_#000]">
            <div className="sm:col-span-4">
              <label className="block text-xs font-display font-black uppercase text-black mb-1.5">
                Receive Store <span className="text-red-600">*</span>
              </label>
              <select
                value={formData.store}
                onChange={(e) => setFormData(prev => ({ ...prev, store: e.target.value }))}
                className="w-full bg-white border-2 border-black px-3 py-2 text-xs font-bold text-black shadow-[2px_2px_0px_#000] outline-none"
              >
                {DEFAULT_STORES.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>

            <div className="sm:col-span-5">
              <label className="block text-xs font-display font-black uppercase text-black mb-1.5">
                Products
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
                    <option value="89012301">[89012301] Pure Ghee 1kg Can - Dairy &amp; Bakery</option>
                    <option value="89012302">[89012302] Pasteurized Milk 1L - Dairy &amp; Bakery</option>
                    <option value="89012303">[89012303] Commercial Espresso Machine - Electronic</option>
                    <option value="89012304">[89012304] Dish Wash Bar Family Pack - Cleaning</option>
                  </>
                )}
              </select>
            </div>

            <div className="sm:col-span-1">
              <label className="block text-xs font-display font-black uppercase text-black mb-1.5">
                Quantity
              </label>
              <input
                type="number"
                min="1"
                value={productAddQty}
                onChange={(e) => setProductAddQty(Math.max(1, parseInt(e.target.value) || 1))}
                className="w-full bg-white border-2 border-black px-2 py-2 text-xs font-bold text-black text-center shadow-[2px_2px_0px_#000] outline-none"
              />
            </div>

            <div className="sm:col-span-2 flex items-end">
              <button
                type="button"
                onClick={onAddProductToItems}
                className="w-full py-2 bg-cyan-400 hover:bg-cyan-300 text-black font-display font-black text-xs uppercase border-2 border-black shadow-[2px_2px_0px_#000] transition-all cursor-pointer flex items-center justify-center gap-1"
              >
                <Plus className="w-4 h-4 stroke-[3]" /> Add Product
              </button>
            </div>
          </div>

          {/* Dynamic Items Table */}
          <div className="border-2 sm:border-4 border-black shadow-[4px_4px_0px_#000] overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead className="bg-cyan-500 text-black font-display font-black uppercase tracking-wider border-b-2 sm:border-b-4 border-black">
                  <tr>
                    <th className="px-3 sm:px-4 py-3 border-r-2 border-black">Category</th>
                    <th className="px-3 sm:px-4 py-3 border-r-2 border-black">Product Name</th>
                    <th className="px-3 sm:px-4 py-3 border-r-2 border-black">Code</th>
                    <th className="px-3 sm:px-4 py-3 border-r-2 border-black w-28 text-right">Rate (TK)</th>
                    <th className="px-3 sm:px-4 py-3 border-r-2 border-black w-24 text-center">Quantity</th>
                    <th className="px-3 sm:px-4 py-3 border-r-2 border-black w-32 text-right">Amount</th>
                    <th className="px-3 sm:px-4 py-3 text-center w-16">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y-2 divide-black bg-white">
                  {formData.items.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="px-4 py-8 text-center text-xs font-bold text-slate-500 bg-amber-50/50">
                        No products added yet. Select a product and click &quot;Add Product&quot; above.
                      </td>
                    </tr>
                  ) : (
                    formData.items.map((item) => (
                      <tr key={item.id} className="hover:bg-amber-50/70 transition-colors">
                        <td className="px-3 sm:px-4 py-2.5 font-bold border-r-2 border-black text-slate-700">
                          {item.category}
                        </td>
                        <td className="px-3 sm:px-4 py-2.5 font-black border-r-2 border-black text-black">
                          {item.productName}
                        </td>
                        <td className="px-3 sm:px-4 py-2.5 font-mono text-[11px] font-black border-r-2 border-black text-indigo-700">
                          {item.code}
                        </td>
                        <td className="px-3 sm:px-4 py-2.5 border-r-2 border-black text-right">
                          <input
                            type="number"
                            min="0"
                            step="any"
                            value={item.rate}
                            onChange={(e) => onItemFieldChange(item.id, "rate", parseFloat(e.target.value) || 0)}
                            className="w-24 bg-white border border-black px-2 py-1 text-xs font-bold text-right shadow-[1px_1px_0px_#000] outline-none"
                          />
                        </td>
                        <td className="px-3 sm:px-4 py-2.5 border-r-2 border-black text-center">
                          <input
                            type="number"
                            min="1"
                            value={item.quantity}
                            onChange={(e) => onItemFieldChange(item.id, "quantity", parseInt(e.target.value) || 0)}
                            className="w-16 bg-white border border-black px-2 py-1 text-xs font-bold text-center shadow-[1px_1px_0px_#000] outline-none"
                          />
                        </td>
                        <td className="px-3 sm:px-4 py-2.5 font-black text-black border-r-2 border-black text-right">
                          {item.amount.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </td>
                        <td className="px-3 sm:px-4 py-2.5 text-center">
                          <button
                            type="button"
                            onClick={() => onRemoveItem(item.id)}
                            className="p-1 bg-red-500 hover:bg-red-600 text-white border border-black shadow-[1px_1px_0px_#000] transition-transform hover:scale-105 cursor-pointer"
                            title="Delete Item"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Discount Controls & Summary Totals Card */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start pt-2">
            {/* Discount Options */}
            <div className="md:col-span-6 p-4 border-2 border-black bg-slate-50 shadow-[3px_3px_0px_#000] space-y-3">
              <div className="text-xs font-display font-black uppercase text-black tracking-wide flex items-center gap-1.5">
                <Tag className="w-4 h-4 text-indigo-600" /> DISCOUNT APPLICATION
              </div>
              <div className="flex items-center gap-6">
                <label className="flex items-center gap-2 text-xs font-black text-black cursor-pointer">
                  <input
                    type="radio"
                    name="discountType"
                    checked={formData.discountType === "fixed"}
                    onChange={() => setFormData(prev => ({ ...prev, discountType: "fixed" }))}
                    className="accent-black w-4 h-4"
                  />
                  Fix Discount
                </label>
                <label className="flex items-center gap-2 text-xs font-black text-black cursor-pointer">
                  <input
                    type="radio"
                    name="discountType"
                    checked={formData.discountType === "percentage"}
                    onChange={() => setFormData(prev => ({ ...prev, discountType: "percentage" }))}
                    className="accent-black w-4 h-4"
                  />
                  Discount (%)
                </label>
              </div>
              <div>
                <input
                  type="number"
                  min="0"
                  step="any"
                  value={formData.discountValue}
                  onChange={(e) => setFormData(prev => ({ ...prev, discountValue: Math.max(0, parseFloat(e.target.value) || 0) }))}
                  placeholder="Enter discount value"
                  className="w-48 bg-white border-2 border-black px-3 py-1.5 text-xs font-bold text-black shadow-[2px_2px_0px_#000] outline-none"
                />
              </div>
            </div>

            {/* Totals Summary Card */}
            <div className="md:col-span-6 md:col-start-7 p-4 border-2 sm:border-4 border-black bg-slate-900 text-white shadow-[4px_4px_0px_#000] space-y-2.5">
              <div className="flex justify-between items-center text-xs font-bold pb-1.5 border-b border-slate-700">
                <span className="text-slate-300 uppercase">Total:</span>
                <span className="font-mono font-black text-sm text-white">
                  {calculatedSubtotal.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} TK.
                </span>
              </div>
              <div className="flex justify-between items-center text-xs font-bold pb-1.5 border-b border-slate-700">
                <span className="text-slate-300 uppercase">Discount:</span>
                <span className="font-mono font-black text-sm text-amber-400">
                  {calculatedDiscountAmount.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} TK.
                </span>
              </div>
              <div className="flex justify-between items-center text-sm font-black pt-1 bg-black/40 px-3 py-2 border-2 border-cyan-400">
                <span className="text-cyan-400 uppercase tracking-wide">Net Payable:</span>
                <span className="font-mono font-black text-base text-cyan-300">
                  {calculatedNetPayable.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} TK.
                </span>
              </div>
            </div>
          </div>

          {/* Bottom Save Action */}
          <div className="flex justify-end pt-4 border-t-2 border-black">
            <button
              type="button"
              onClick={onSave}
              disabled={isSaving}
              className="px-8 py-3 bg-cyan-400 hover:bg-cyan-300 text-black font-display font-black text-xs uppercase tracking-wider border-2 border-black shadow-[4px_4px_0px_#000] flex items-center gap-2 transition-all cursor-pointer disabled:opacity-50"
            >
              <Save className="w-4 h-4 stroke-[2.5]" /> {isSaving ? "SAVING..." : "SAVE"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
