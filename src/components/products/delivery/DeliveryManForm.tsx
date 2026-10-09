"use client";

import React from "react";
import { Truck, ArrowLeft, Save, Loader2 } from "lucide-react";
import { DeliveryMan } from "@/types/product";
import { DEFAULT_STORES } from "@/lib/deliveryStorage";
import { DeliveryManFormData } from "./types";

interface DeliveryManFormProps {
  editingItem: DeliveryMan | null;
  formData: DeliveryManFormData;
  setFormData: React.Dispatch<React.SetStateAction<DeliveryManFormData>>;
  isSubmitting: boolean;
  onSubmit: (e?: React.FormEvent) => void;
  onCancel: () => void;
}

export const DeliveryManForm: React.FC<DeliveryManFormProps> = ({
  editingItem,
  formData,
  setFormData,
  isSubmitting,
  onSubmit,
  onCancel
}) => {
  return (
    <div className="p-4 sm:p-6 max-w-5xl mx-auto space-y-6">
      <div className="bg-white border-2 sm:border-4 border-black shadow-[6px_6px_0px_#000] overflow-hidden">
        {/* Header Bar */}
        <div className="px-5 py-4 border-b-2 sm:border-b-4 border-black bg-amber-300 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 bg-white border-2 border-black shadow-[2px_2px_0px_#000]">
              <Truck className="w-5 h-5 text-black stroke-[2.5]" />
            </div>
            <div>
              <h1 className="text-base sm:text-lg font-black uppercase tracking-wider text-black">
                {editingItem ? 'EDIT DELIVERY MAN' : 'ADD DELIVERY MAN'}
              </h1>
              <p className="text-[10px] font-bold text-slate-800 uppercase">
                Configure driver / dispatch agent details &amp; contact
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={onCancel}
              disabled={isSubmitting}
              className="flex items-center gap-1.5 px-4 py-2 bg-white hover:bg-slate-100 text-black border-2 border-black text-xs font-black uppercase shadow-[2px_2px_0px_#000] cursor-pointer active:translate-x-0.5 active:translate-y-0.5"
            >
              <ArrowLeft className="w-3.5 h-3.5 stroke-[2.5]" />
              <span>GO BACK</span>
            </button>
            <button
              type="button"
              onClick={() => onSubmit()}
              disabled={isSubmitting}
              className="flex items-center gap-1.5 px-5 py-2 bg-emerald-400 hover:bg-emerald-300 text-black border-2 border-black text-xs font-black uppercase shadow-[2px_2px_0px_#000] cursor-pointer active:translate-x-0.5 active:translate-y-0.5 disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>SAVING...</span>
                </>
              ) : (
                <>
                  <Save className="w-3.5 h-3.5 stroke-[2.5]" />
                  <span>SAVE</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Form Body */}
        <form onSubmit={onSubmit} className="p-5 sm:p-6 space-y-5">
          {/* Row 1: Store *, Code *, Name * */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
            <div>
              <label className="block text-xs font-black uppercase tracking-wider text-black mb-1.5">
                Store <span className="text-red-600">*</span>
              </label>
              <div className="relative">
                <select
                  value={formData.store}
                  onChange={e => setFormData(prev => ({ ...prev, store: e.target.value }))}
                  className="w-full px-3 py-2.5 bg-white border-2 border-black font-bold text-xs sm:text-sm text-black focus:outline-none focus:bg-amber-50 focus:shadow-[2px_2px_0px_#000] cursor-pointer"
                  required
                >
                  {DEFAULT_STORES.map(s => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-black uppercase tracking-wider text-black mb-1.5">
                Code <span className="text-red-600">*</span>
              </label>
              <input
                type="text"
                value={formData.code}
                onChange={e => setFormData(prev => ({ ...prev, code: e.target.value }))}
                placeholder="e.g. 6"
                className="w-full px-3 py-2.5 bg-white border-2 border-black font-bold text-xs sm:text-sm text-black focus:outline-none focus:bg-amber-50 focus:shadow-[2px_2px_0px_#000]"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-black uppercase tracking-wider text-black mb-1.5">
                Name <span className="text-red-600">*</span>
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={e => setFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Delivery Man Name"
                className="w-full px-3 py-2.5 bg-white border-2 border-black font-bold text-xs sm:text-sm text-black focus:outline-none focus:bg-amber-50 focus:shadow-[2px_2px_0px_#000]"
                required
              />
            </div>
          </div>

          {/* Row 2: Email, Phone No., National ID */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
            <div>
              <label className="block text-xs font-black uppercase tracking-wider text-black mb-1.5">
                Email
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={e => setFormData(prev => ({ ...prev, email: e.target.value }))}
                placeholder="Email"
                className="w-full px-3 py-2.5 bg-white border-2 border-black font-bold text-xs sm:text-sm text-black focus:outline-none focus:bg-amber-50 focus:shadow-[2px_2px_0px_#000]"
              />
            </div>

            <div>
              <label className="block text-xs font-black uppercase tracking-wider text-black mb-1.5">
                Phone No.
              </label>
              <input
                type="tel"
                value={formData.phone}
                onChange={e => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                placeholder="Phone"
                className="w-full px-3 py-2.5 bg-white border-2 border-black font-bold text-xs sm:text-sm text-black focus:outline-none focus:bg-amber-50 focus:shadow-[2px_2px_0px_#000]"
              />
            </div>

            <div>
              <label className="block text-xs font-black uppercase tracking-wider text-black mb-1.5">
                National ID
              </label>
              <input
                type="text"
                value={formData.nationalId}
                onChange={e => setFormData(prev => ({ ...prev, nationalId: e.target.value }))}
                placeholder="National ID"
                className="w-full px-3 py-2.5 bg-white border-2 border-black font-bold text-xs sm:text-sm text-black focus:outline-none focus:bg-amber-50 focus:shadow-[2px_2px_0px_#000]"
              />
            </div>
          </div>

          {/* Row 3: Address */}
          <div>
            <label className="block text-xs font-black uppercase tracking-wider text-black mb-1.5">
              Address
            </label>
            <input
              type="text"
              value={formData.address}
              onChange={e => setFormData(prev => ({ ...prev, address: e.target.value }))}
              placeholder="Address"
              className="w-full px-3 py-2.5 bg-white border-2 border-black font-bold text-xs sm:text-sm text-black focus:outline-none focus:bg-amber-50 focus:shadow-[2px_2px_0px_#000]"
            />
          </div>

          {/* Bottom Actions */}
          <div className="pt-4 border-t-2 border-black flex items-center justify-end">
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center gap-2 px-6 py-2.5 bg-emerald-400 hover:bg-emerald-300 text-black border-2 border-black text-xs font-black uppercase shadow-[2px_2px_0px_#000] cursor-pointer active:translate-x-0.5 active:translate-y-0.5 disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
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
        </form>
      </div>
    </div>
  );
};
