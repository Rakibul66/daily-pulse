"use client";

import React, { RefObject } from 'react';
import { 
  ScanBarcode, 
  Search, 
  Camera, 
  CheckCircle, 
  User, 
  Phone, 
  CreditCard 
} from 'lucide-react';
import { Customer } from '@/types/customer';

interface POSControlBarProps {
  method: 'barcode' | 'manual';
  scannedCode: string;
  setScannedCode: (code: string) => void;
  barcodeInputRef: RefObject<HTMLInputElement | null>;
  manualSearchRef: RefObject<HTMLInputElement | null>;
  manualSearch: string;
  setManualSearch: (val: string) => void;
  onBarcodeKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  onBarcodeProcess: (code: string) => void;
  onOpenLiveScanner: () => void;
  lastScannedItem: { name: string; price: number; ms: number } | null;
  customers: Customer[];
  selectedCustomerId: string;
  onSelectCustomer: (customerId: string) => void;
  clientPhone: string;
  setClientPhone: (phone: string) => void;
  clientName: string;
  setClientName: (name: string) => void;
  cashHead: string;
  setCashHead: (head: string) => void;
}

export const POSControlBar: React.FC<POSControlBarProps> = ({
  method,
  scannedCode,
  setScannedCode,
  barcodeInputRef,
  manualSearchRef,
  manualSearch,
  setManualSearch,
  onBarcodeKeyDown,
  onBarcodeProcess,
  onOpenLiveScanner,
  lastScannedItem,
  customers,
  selectedCustomerId,
  onSelectCustomer,
  clientPhone,
  setClientPhone,
  clientName,
  setClientName,
  cashHead,
  setCashHead,
}) => {
  return (
    <div className="p-3 sm:p-5 border-b-2 sm:border-b-4 border-black bg-slate-50">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        
        {/* 1. Barcode Scanner Input */}
        <div className="sm:col-span-2 lg:col-span-1">
          <label className="text-xs font-black text-black block mb-1 uppercase tracking-wider flex items-center justify-between">
            <span className="flex items-center gap-1">
              <ScanBarcode className="w-3.5 h-3.5 text-indigo-600" />
              {method === 'barcode' ? 'SCAN BARCODE / SKU' : 'SEARCH CATALOG'}
            </span>
            <span className="text-[10px] text-slate-500 font-mono">F1</span>
          </label>
          <div className="relative flex gap-1">
            {method === 'barcode' ? (
              <>
                <input 
                  ref={barcodeInputRef}
                  type="text" 
                  value={scannedCode}
                  onChange={(e) => setScannedCode(e.target.value)}
                  onKeyDown={onBarcodeKeyDown}
                  placeholder="Scan / type code + Enter..."
                  className="w-full text-xs sm:text-sm font-black text-black bg-white px-2.5 sm:px-3 py-2 sm:py-2.5 border-2 sm:border-3 border-black shadow-[2px_2px_0px_#000] focus:bg-amber-50 outline-none uppercase tracking-wider"
                />
                <button
                  type="button"
                  onClick={() => onBarcodeProcess(scannedCode)}
                  className="px-3 bg-black text-white font-black text-xs uppercase hover:bg-slate-800 border-2 border-black cursor-pointer"
                >
                  SCAN
                </button>
                <button
                  type="button"
                  onClick={onOpenLiveScanner}
                  className="p-2 sm:p-2.5 bg-amber-400 hover:bg-amber-300 text-black border-2 border-black shadow-[2px_2px_0px_#000] cursor-pointer"
                  title="Open Live Camera Scanner"
                >
                  <Camera className="w-4 h-4" />
                </button>
              </>
            ) : (
              <div className="relative w-full">
                <input 
                  ref={manualSearchRef}
                  type="text" 
                  value={manualSearch}
                  onChange={(e) => setManualSearch(e.target.value)}
                  placeholder="Type product name or code..."
                  className="w-full text-xs sm:text-sm font-bold text-black bg-white pl-8 pr-3 py-2 sm:py-2.5 border-2 sm:border-3 border-black shadow-[2px_2px_0px_#000] outline-none"
                />
                <Search className="w-4 h-4 absolute left-2.5 top-2.5 sm:top-3 text-slate-500" />
              </div>
            )}
          </div>
          {lastScannedItem && (
            <div className="mt-1 flex items-center justify-between text-[11px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-300">
              <span className="flex items-center gap-1 truncate">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-600 shrink-0" /> 
                <span className="truncate">Added: {lastScannedItem.name} (৳{lastScannedItem.price})</span>
              </span>
              <span className="font-mono text-[10px] text-emerald-700 font-black shrink-0 ml-1">
                ⚡ {lastScannedItem.ms}ms
              </span>
            </div>
          )}
        </div>

        {/* 2. Customer Selector */}
        <div>
          <label className="text-xs font-black text-black block mb-1 uppercase tracking-wider flex items-center gap-1">
            <User className="w-3.5 h-3.5" />
            CUSTOMER SELECTION
          </label>
          <select
            value={selectedCustomerId}
            onChange={(e) => onSelectCustomer(e.target.value)}
            className="w-full text-xs sm:text-sm font-bold text-black bg-white px-2.5 sm:px-3 py-2 sm:py-2.5 border-2 sm:border-3 border-black shadow-[2px_2px_0px_#000] outline-none cursor-pointer"
          >
            <option value="">Walk-in Customer (Default)</option>
            {customers.map((c) => (
              <option key={c.id} value={c.id}>
                {c.businessName || c.ownerName} {c.phone ? `(${c.phone})` : ''}
              </option>
            ))}
          </select>
        </div>

        {/* 3. Customer Phone & Name */}
        <div>
          <label className="text-xs font-black text-black block mb-1 uppercase tracking-wider flex items-center gap-1">
            <Phone className="w-3.5 h-3.5" />
            CLIENT PHONE / NAME
          </label>
          <div className="grid grid-cols-2 gap-1.5">
            <input 
              type="text" 
              value={clientPhone}
              onChange={(e) => setClientPhone(e.target.value)}
              placeholder="017XXXXXXXX"
              className="w-full text-xs font-bold text-black bg-white px-2 py-2 sm:py-2.5 border-2 sm:border-3 border-black shadow-[2px_2px_0px_#000] outline-none"
            />
            <input 
              type="text" 
              value={clientName}
              onChange={(e) => setClientName(e.target.value)}
              placeholder="Customer Name"
              className="w-full text-xs font-bold text-black bg-white px-2 py-2 sm:py-2.5 border-2 sm:border-3 border-black shadow-[2px_2px_0px_#000] outline-none"
            />
          </div>
        </div>

        {/* 4. Payment Account / Cash Head */}
        <div>
          <label className="text-xs font-black text-black block mb-1 uppercase tracking-wider flex items-center gap-1">
            <CreditCard className="w-3.5 h-3.5 text-emerald-600" />
            ACCOUNT / CASH HEAD <span className="text-rose-600">*</span>
          </label>
          <select 
            value={cashHead}
            onChange={(e) => setCashHead(e.target.value)}
            className="w-full text-xs sm:text-sm font-bold text-black bg-white px-2.5 sm:px-3 py-2 sm:py-2.5 border-2 sm:border-3 border-black shadow-[2px_2px_0px_#000] outline-none cursor-pointer"
          >
            <option value="Cash at Hand - 1010201">Cash at Hand (Counter #1)</option>
            <option value="bKash Merchant - 1020301">bKash Merchant Pay</option>
            <option value="Nagad Business - 1020302">Nagad Business Pay</option>
            <option value="Bank POS Card Terminal">Bank POS Card Terminal</option>
          </select>
        </div>
      </div>
    </div>
  );
};
