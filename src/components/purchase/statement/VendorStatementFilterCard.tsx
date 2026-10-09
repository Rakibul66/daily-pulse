"use client";

import React from "react";
import { Search, Building2 } from "lucide-react";
import { PurchaseVendor } from "@/types/purchase";
import { formatDateDDMMYYYY } from "@/lib/purchaseStorage";

interface VendorStatementFilterCardProps {
  vendors: PurchaseVendor[];
  selectedVendorName: string;
  setSelectedVendorName: (name: string) => void;
  fromDate: string;
  setFromDate: (date: string) => void;
  toDate: string;
  setToDate: (date: string) => void;
  onSearch: () => void;
  isLoading: boolean;
  hasSearched: boolean;
  currentVendor?: PurchaseVendor;
  searchedVendor: string;
  searchedFromDate: string;
  searchedToDate: string;
}

export const VendorStatementFilterCard: React.FC<VendorStatementFilterCardProps> = ({
  vendors,
  selectedVendorName,
  setSelectedVendorName,
  fromDate,
  setFromDate,
  toDate,
  setToDate,
  onSearch,
  isLoading,
  hasSearched,
  currentVendor,
  searchedVendor,
  searchedFromDate,
  searchedToDate
}) => {
  return (
    <div className="bg-white border-2 sm:border-4 border-black p-5 sm:p-6 shadow-[6px_6px_0px_#000]">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-end">
        {/* Vendor Selector */}
        <div className="md:col-span-6 space-y-1.5">
          <label className="block text-xs font-black uppercase tracking-wider text-black">
            Vendor <span className="text-red-600 font-black">*</span>
          </label>
          <div className="relative">
            <select
              value={selectedVendorName}
              onChange={(e) => setSelectedVendorName(e.target.value)}
              className="w-full h-11 px-3 bg-white border-2 border-black font-bold text-xs text-black shadow-[2px_2px_0px_#000] focus:outline-hidden focus:ring-2 focus:ring-black appearance-none cursor-pointer pr-10"
            >
              <option value="">Select Vendor</option>
              {vendors.map((v) => (
                <option key={v.id} value={v.name}>
                  {v.name} ({v.code})
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-black">
              <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
              </svg>
            </div>
          </div>
        </div>

        {/* Date Range */}
        <div className="md:col-span-4 space-y-1.5">
          <label className="block text-xs font-black uppercase tracking-wider text-black">
            Date Range <span className="text-red-600 font-black">*</span>
          </label>
          <div className="grid grid-cols-2 gap-2">
            <div className="relative">
              <input
                type="date"
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
                className="w-full h-11 px-2.5 bg-white border-2 border-black font-bold text-xs text-black shadow-[2px_2px_0px_#000] focus:outline-hidden focus:ring-2 focus:ring-black cursor-pointer"
                title="From Date"
              />
            </div>
            <div className="relative">
              <input
                type="date"
                value={toDate}
                onChange={(e) => setToDate(e.target.value)}
                className="w-full h-11 px-2.5 bg-white border-2 border-black font-bold text-xs text-black shadow-[2px_2px_0px_#000] focus:outline-hidden focus:ring-2 focus:ring-black cursor-pointer"
                title="To Date"
              />
            </div>
          </div>
        </div>

        {/* Search Button */}
        <div className="md:col-span-2">
          <button
            onClick={onSearch}
            disabled={isLoading}
            className="w-full h-11 bg-[#00c5bb] hover:bg-[#00a89f] text-white border-2 border-black font-black uppercase tracking-wider text-xs shadow-[3px_3px_0px_#000] hover:shadow-[1px_1px_0px_#000] hover:translate-x-[2px] hover:translate-y-[2px] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            <Search className="w-4 h-4 stroke-[3]" />
            <span>SEARCH</span>
          </button>
        </div>
      </div>

      {/* Selected Vendor Quick Info */}
      {hasSearched && currentVendor && (
        <div className="mt-4 pt-4 border-t-2 border-dashed border-black/30 flex flex-wrap items-center justify-between gap-3 text-xs font-bold text-black bg-amber-50 p-3 border-2 border-black shadow-[2px_2px_0px_#000]">
          <div className="flex items-center gap-2">
            <Building2 className="w-4 h-4 text-black" />
            <span>
              Vendor: <strong className="text-black uppercase underline">{currentVendor.name}</strong> ({currentVendor.code})
            </span>
          </div>
          {currentVendor.phone && (
            <div>
              Phone: <span className="font-mono">{currentVendor.phone}</span>
            </div>
          )}
          {currentVendor.account && (
            <div>
              Account: <span className="font-mono">{currentVendor.account}</span>
            </div>
          )}
          <div>
            Period: <span className="font-mono bg-white px-2 py-0.5 border border-black">{formatDateDDMMYYYY(searchedFromDate)}</span> to{" "}
            <span className="font-mono bg-white px-2 py-0.5 border border-black">{formatDateDDMMYYYY(searchedToDate)}</span>
          </div>
        </div>
      )}
    </div>
  );
};
