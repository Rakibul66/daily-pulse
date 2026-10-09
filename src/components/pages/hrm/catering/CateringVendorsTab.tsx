"use client";

import React from "react";
import { CheckCircle, Edit, Trash2 } from "lucide-react";
import { CateringVendor } from "@/types/catering";

interface CateringVendorsTabProps {
  vendors: CateringVendor[];
  onOpenAddVendor: () => void;
  onOpenEditVendor: (v: CateringVendor) => void;
  onSetActiveVendor: (id: string) => void;
  onDeleteVendor: (id: string) => void;
}

export const CateringVendorsTab: React.FC<CateringVendorsTabProps> = ({
  vendors,
  onOpenAddVendor,
  onOpenEditVendor,
  onSetActiveVendor,
  onDeleteVendor
}) => {
  return (
    <div>
      <div className="flex items-center justify-between pb-3 mb-4 border-b-2 border-black">
        <h3 className="font-display font-black text-base uppercase tracking-tight text-black">
          CATERING VENDORS & BASE RATES
        </h3>
        <button 
          onClick={onOpenAddVendor}
          className="px-3.5 py-1.5 bg-black text-white border-2 border-black shadow-[2px_2px_0px_#000] text-xs font-black uppercase cursor-pointer"
        >
          + ADD VENDOR
        </button>
      </div>

      <div className="overflow-x-auto border-3 border-black bg-white shadow-[4px_4px_0px_#000]">
        <table className="w-full text-left text-xs text-black">
          <thead className="bg-amber-300 border-b-2 border-black text-[10px] font-black uppercase tracking-wider">
            <tr>
              <th className="px-4 py-3">Vendor Name</th>
              <th className="px-4 py-3">Default Rate (৳)</th>
              <th className="px-4 py-3">Billing Freq.</th>
              <th className="px-4 py-3 text-center">Active Status</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y-2 divide-black/10 font-bold">
            {vendors.map(v => (
              <tr key={v.id} className="hover:bg-slate-50 transition-colors">
                <td className="px-4 py-3 font-black text-black flex items-center gap-2">
                  {v.name}
                  {v.isActive && (
                    <span className="bg-emerald-100 text-emerald-950 text-[10px] px-2 py-0.5 border border-black uppercase font-black">
                      PRIMARY
                    </span>
                  )}
                </td>
                <td className="px-4 py-3 font-display font-black text-indigo-700 text-sm">৳ {v.perMealRate}</td>
                <td className="px-4 py-3 uppercase text-slate-700">{v.billingFrequency}</td>
                <td className="px-4 py-3 text-center">
                  {!v.isActive ? (
                    <button 
                      onClick={() => onSetActiveVendor(v.id)} 
                      className="text-[10px] font-black uppercase px-2.5 py-1 bg-white hover:bg-amber-300 text-black border-2 border-black shadow-[1px_1px_0px_#000] cursor-pointer"
                    >
                      SET ACTIVE
                    </button>
                  ) : (
                    <span className="text-[10px] font-black uppercase px-2 py-1 bg-emerald-200 border border-black text-black inline-flex items-center gap-1">
                      <CheckCircle className="w-3 h-3" /> ACTIVE
                    </span>
                  )}
                </td>
                <td className="px-4 py-3 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button 
                      onClick={() => onOpenEditVendor(v)} 
                      className="p-1 bg-white hover:bg-slate-100 border border-black shadow-[1px_1px_0px_#000] cursor-pointer"
                      title="Edit Vendor"
                    >
                      <Edit className="w-3.5 h-3.5" />
                    </button>
                    <button 
                      onClick={() => onDeleteVendor(v.id)} 
                      className="p-1 bg-rose-100 hover:bg-rose-200 text-rose-900 border border-black shadow-[1px_1px_0px_#000] cursor-pointer"
                      title="Delete Vendor"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {vendors.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-slate-500 font-bold uppercase">
                  No vendors found. Add your first vendor above.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
