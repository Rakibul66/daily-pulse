"use client";

import React from "react";
import { CreditCard, ArrowLeft, Save } from "lucide-react";
import { PurchaseVendor } from "@/types/purchase";
import { VendorPaymentFormData, PAYMENT_METHODS, PaymentMethodType } from "./types";

interface PurchasePaymentFormProps {
  editingId: string | null;
  formData: VendorPaymentFormData;
  setFormData: React.Dispatch<React.SetStateAction<VendorPaymentFormData>>;
  vendors: PurchaseVendor[];
  isSaving: boolean;
  onSave: (e?: React.FormEvent) => void;
  onCancel: () => void;
}

export const PurchasePaymentForm: React.FC<PurchasePaymentFormProps> = ({
  editingId,
  formData,
  setFormData,
  vendors,
  isSaving,
  onSave,
  onCancel
}) => {
  return (
    <div className="w-full pb-20">
      <div className="bg-white border-2 sm:border-4 border-black shadow-[6px_6px_0px_#000]">
        {/* Header Action Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 p-4 sm:p-5 border-b-2 sm:border-b-4 border-black bg-slate-900 text-white">
          <h2 className="font-display font-black text-sm sm:text-base tracking-wide uppercase flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-amber-400" />
            {editingId ? `EDIT VENDOR PAYMENT: ${formData.paymentNo}` : "ADD VENDOR PAYMENT"}
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
              onClick={() => onSave()}
              disabled={isSaving}
              className="px-5 py-2 bg-cyan-400 hover:bg-cyan-300 text-black font-display font-black text-xs uppercase border-2 border-black shadow-[3px_3px_0px_#000] flex items-center gap-1.5 transition-all cursor-pointer disabled:opacity-50"
            >
              <Save className="w-4 h-4 stroke-[2.5]" /> {isSaving ? "SAVING..." : "SAVE PAYMENT"}
            </button>
          </div>
        </div>

        {/* Form Content */}
        <div className="p-4 sm:p-6 bg-white space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
            <div>
              <label className="block text-xs font-display font-black uppercase text-black mb-1.5">
                Payment No. <span className="text-red-600">*</span>
              </label>
              <input
                type="text"
                value={formData.paymentNo}
                onChange={(e) => setFormData({ ...formData, paymentNo: e.target.value })}
                placeholder="STP2610000001"
                required
                className="w-full bg-white border-2 border-black px-3 py-2.5 text-xs font-mono font-bold text-black shadow-[2px_2px_0px_#000] outline-none focus:bg-amber-50"
              />
            </div>

            <div>
              <label className="block text-xs font-display font-black uppercase text-black mb-1.5">
                Payment Date <span className="text-red-600">*</span>
              </label>
              <input
                type="date"
                value={formData.paymentDate}
                onChange={(e) => setFormData({ ...formData, paymentDate: e.target.value })}
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
                  setFormData({
                    ...formData,
                    vendor: e.target.value,
                    vendorId: sel ? sel.id : "",
                  });
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
                    <option value="Square Food and Beverage">Square Food and Beverage</option>
                  </>
                )}
              </select>
            </div>

            <div>
              <label className="block text-xs font-display font-black uppercase text-black mb-1.5">
                Payment Method <span className="text-red-600">*</span>
              </label>
              <select
                value={formData.paymentType}
                onChange={(e) => setFormData({ ...formData, paymentType: e.target.value as PaymentMethodType })}
                className="w-full bg-white border-2 border-black px-3 py-2.5 text-xs font-bold text-black shadow-[2px_2px_0px_#000] outline-none focus:bg-amber-50 cursor-pointer"
              >
                {PAYMENT_METHODS.map((pm) => (
                  <option key={pm} value={pm}>{pm}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-display font-black uppercase text-black mb-1.5">
                Payment Amount (৳) <span className="text-red-600">*</span>
              </label>
              <input
                type="number"
                min="0"
                step="any"
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: parseFloat(e.target.value) || 0 })}
                placeholder="0.00"
                required
                className="w-full bg-white border-2 border-black px-3 py-2.5 text-xs font-mono font-bold text-black shadow-[2px_2px_0px_#000] outline-none focus:bg-amber-50"
              />
            </div>

            <div>
              <label className="block text-xs font-display font-black uppercase text-black mb-1.5">
                Bill / Voucher Ref
              </label>
              <input
                type="text"
                value={formData.voucherRef}
                onChange={(e) => setFormData({ ...formData, voucherRef: e.target.value })}
                placeholder="e.g. STL2609000007"
                className="w-full bg-white border-2 border-black px-3 py-2.5 text-xs font-mono font-bold text-black shadow-[2px_2px_0px_#000] outline-none focus:bg-amber-50"
              />
            </div>

            <div>
              <label className="block text-xs font-display font-black uppercase text-black mb-1.5">
                Bank / Channel Name
              </label>
              <input
                type="text"
                value={formData.bankName}
                onChange={(e) => setFormData({ ...formData, bankName: e.target.value })}
                placeholder="e.g. Islami Bank / City Bank"
                className="w-full bg-white border-2 border-black px-3 py-2.5 text-xs font-bold text-black shadow-[2px_2px_0px_#000] outline-none focus:bg-amber-50"
              />
            </div>

            <div>
              <label className="block text-xs font-display font-black uppercase text-black mb-1.5">
                Cheque No. / Transaction ID
              </label>
              <input
                type="text"
                value={formData.chequeNo}
                onChange={(e) => setFormData({ ...formData, chequeNo: e.target.value })}
                placeholder="e.g. CHQ-9812401 or TRX-88219"
                className="w-full bg-white border-2 border-black px-3 py-2.5 text-xs font-mono font-bold text-black shadow-[2px_2px_0px_#000] outline-none focus:bg-amber-50"
              />
            </div>

            <div>
              <label className="block text-xs font-display font-black uppercase text-black mb-1.5">
                Handled By / Staff
              </label>
              <input
                type="text"
                value={formData.staff}
                onChange={(e) => setFormData({ ...formData, staff: e.target.value })}
                placeholder="Admin"
                className="w-full bg-white border-2 border-black px-3 py-2.5 text-xs font-bold text-black shadow-[2px_2px_0px_#000] outline-none focus:bg-amber-50"
              />
            </div>

            <div className="sm:col-span-2 md:col-span-3">
              <label className="block text-xs font-display font-black uppercase text-black mb-1.5">
                Remarks / Payment Description
              </label>
              <input
                type="text"
                value={formData.remarks}
                onChange={(e) => setFormData({ ...formData, remarks: e.target.value })}
                placeholder="e.g. Advance Payment for Delivery, Clearing Bill STL2609000007"
                className="w-full bg-white border-2 border-black px-3 py-2.5 text-xs font-bold text-black shadow-[2px_2px_0px_#000] outline-none focus:bg-amber-50"
              />
            </div>
          </div>

          {/* Payment Summary Box */}
          <div className="p-4 border-2 sm:border-4 border-black bg-slate-900 text-white shadow-[4px_4px_0px_#000] flex flex-wrap items-center justify-between gap-4">
            <div>
              <div className="text-[11px] font-bold text-slate-400 uppercase">Vendor Payable Target</div>
              <div className="text-sm font-black text-amber-400">{formData.vendor || "No vendor selected"}</div>
              <div className="text-[11px] text-slate-300">
                {formData.paymentType} • {formData.voucherRef ? `Ref: ${formData.voucherRef}` : "Direct Payment"}
              </div>
            </div>
            <div className="text-right">
              <div className="text-[11px] font-bold text-slate-400 uppercase">Disbursement Amount</div>
              <div className="text-xl sm:text-2xl font-mono font-black text-cyan-300">
                ৳ {Number(formData.amount || 0).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </div>
            </div>
          </div>

          {/* Bottom Actions */}
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
              onClick={() => onSave()}
              disabled={isSaving}
              className="px-8 py-2.5 bg-cyan-400 hover:bg-cyan-300 text-black font-display font-black text-xs uppercase tracking-wider border-2 border-black shadow-[4px_4px_0px_#000] flex items-center gap-2 transition-all cursor-pointer disabled:opacity-50"
            >
              <Save className="w-4 h-4 stroke-[2.5]" /> {isSaving ? "SAVING..." : "SAVE PAYMENT"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
