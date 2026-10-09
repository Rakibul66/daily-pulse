"use client";

import React from 'react';
import { Tag, DollarSign, Check, Loader2 } from 'lucide-react';
import { POSCartItem } from './types';

interface POSCheckoutSidebarProps {
  discountType: 'fix' | 'percent';
  setDiscountType: (type: 'fix' | 'percent') => void;
  globalDiscount: number;
  setGlobalDiscount: (disc: number) => void;
  onSetExactCash: () => void;
  onAddPresetCash: (amount: number) => void;
  cashPaid: string;
  setCashPaid: (val: string) => void;
  changeAmount: number;
  cart: POSCartItem[];
  subtotal: number;
  discountAmount: number;
  netPayable: number;
  isSavingSale: boolean;
  onSaveSale: () => void;
}

export const POSCheckoutSidebar: React.FC<POSCheckoutSidebarProps> = ({
  discountType,
  setDiscountType,
  globalDiscount,
  setGlobalDiscount,
  onSetExactCash,
  onAddPresetCash,
  cashPaid,
  setCashPaid,
  changeAmount,
  cart,
  subtotal,
  discountAmount,
  netPayable,
  isSavingSale,
  onSaveSale,
}) => {
  return (
    <div className="p-3 sm:p-6 bg-slate-100 border-t-2 sm:border-t-4 border-black">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        
        {/* 1. Discounts & Quick Cash Presets */}
        <div className="bg-white border-2 sm:border-4 border-black p-3.5 sm:p-4 shadow-[2px_2px_0px_#000] sm:shadow-[4px_4px_0px_#000] flex flex-col justify-between">
          <div>
            <h3 className="text-xs font-black uppercase tracking-wider text-black pb-2 border-b-2 border-black flex items-center gap-1.5">
              <Tag className="w-3.5 h-3.5" />
              CART DISCOUNT &amp; ADJUSTMENT
            </h3>
            
            <div className="mt-3 flex items-center gap-2">
              <div className="flex border-2 border-black bg-slate-100 shrink-0">
                <button 
                  type="button" 
                  onClick={() => setDiscountType('fix')}
                  className={`px-2.5 py-1 text-xs font-black uppercase cursor-pointer ${
                    discountType === 'fix' ? 'bg-black text-white' : 'text-black'
                  }`}
                >
                  FIXED (৳)
                </button>
                <button 
                  type="button" 
                  onClick={() => setDiscountType('percent')}
                  className={`px-2.5 py-1 text-xs font-black uppercase cursor-pointer ${
                    discountType === 'percent' ? 'bg-black text-white' : 'text-black'
                  }`}
                >
                  %
                </button>
              </div>
              
              <input 
                type="number" 
                min="0"
                value={globalDiscount}
                onChange={(e) => setGlobalDiscount(parseFloat(e.target.value) || 0)}
                placeholder="0"
                className="w-full text-sm font-black text-right border-2 border-black px-2 py-1 outline-none"
              />
            </div>
          </div>

          {/* Quick Cash Presets */}
          <div className="mt-4 pt-3 border-t-2 border-slate-200">
            <p className="text-[11px] font-black uppercase text-slate-700 mb-1.5">QUICK CASH PRESETS:</p>
            <div className="grid grid-cols-4 gap-1.5">
              <button
                type="button"
                onClick={onSetExactCash}
                className="py-1.5 px-1 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs uppercase border-2 border-black shadow-[2px_2px_0px_#000] active:translate-y-0.5 cursor-pointer text-center"
                title="Exact Amount (F2)"
              >
                EXACT (F2)
              </button>
              <button
                type="button"
                onClick={() => onAddPresetCash(500)}
                className="py-1.5 px-1 bg-white hover:bg-slate-100 text-black font-black text-xs border-2 border-black shadow-[2px_2px_0px_#000] active:translate-y-0.5 cursor-pointer text-center"
              >
                ৳500
              </button>
              <button
                type="button"
                onClick={() => onAddPresetCash(1000)}
                className="py-1.5 px-1 bg-white hover:bg-slate-100 text-black font-black text-xs border-2 border-black shadow-[2px_2px_0px_#000] active:translate-y-0.5 cursor-pointer text-center"
              >
                ৳1,000
              </button>
              <button
                type="button"
                onClick={() => onAddPresetCash(2000)}
                className="py-1.5 px-1 bg-white hover:bg-slate-100 text-black font-black text-xs border-2 border-black shadow-[2px_2px_0px_#000] active:translate-y-0.5 cursor-pointer text-center"
              >
                ৳2,000
              </button>
            </div>
          </div>
        </div>

        {/* 2. Paid & Change Calculation */}
        <div className="bg-white border-2 sm:border-4 border-black p-3.5 sm:p-4 shadow-[2px_2px_0px_#000] sm:shadow-[4px_4px_0px_#000] flex flex-col justify-between">
          <h3 className="text-xs font-black uppercase tracking-wider text-black pb-2 border-b-2 border-black flex items-center gap-1.5">
            <DollarSign className="w-3.5 h-3.5 text-emerald-600" />
            CASH TENDERED &amp; CHANGE
          </h3>

          <div className="space-y-3 mt-3">
            <div>
              <label className="text-xs font-black text-black uppercase block mb-1">
                CASH RECEIVED (৳):
              </label>
              <input 
                type="number" 
                min="0"
                step="any"
                value={cashPaid}
                onChange={(e) => setCashPaid(e.target.value)}
                className="w-full text-lg sm:text-xl font-black text-black bg-amber-50 px-3 py-1.5 sm:py-2 border-2 sm:border-3 border-black text-right outline-none"
              />
            </div>

            <div className="flex justify-between items-center bg-slate-50 p-2 sm:p-2.5 border-2 border-black">
              <span className="text-xs font-black uppercase text-slate-700">CHANGE TO RETURN:</span>
              <span className="text-lg sm:text-xl font-black text-emerald-700 font-mono">
                ৳{changeAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
            </div>
          </div>

          <div className="text-[11px] font-bold text-slate-500 pt-2 flex items-center justify-between border-t border-slate-200">
            <span>Total Items: {cart.reduce((sum, it) => sum + it.qty, 0)} pcs</span>
            <span>Lines: {cart.length}</span>
          </div>
        </div>

        {/* 3. Grand Total & Checkout Action */}
        <div className="bg-black text-white p-4 sm:p-5 border-2 sm:border-4 border-black shadow-[2px_2px_0px_#000] sm:shadow-[4px_4px_0px_#000] flex flex-col justify-between md:col-span-2 lg:col-span-1">
          <div>
            <div className="flex justify-between text-xs font-bold text-slate-400 pb-1">
              <span>SUBTOTAL:</span>
              <span>৳{subtotal.toFixed(2)}</span>
            </div>
            {discountAmount > 0 && (
              <div className="flex justify-between text-xs font-bold text-rose-400 pb-1">
                <span>DISCOUNT:</span>
                <span>- ৳{discountAmount.toFixed(2)}</span>
              </div>
            )}
            <div className="border-t-2 border-white/20 pt-2 mt-1">
              <span className="text-xs font-black uppercase tracking-wider text-amber-300 block">
                NET PAYABLE AMOUNT:
              </span>
              <div className="text-2xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight font-mono mt-1">
                ৳{netPayable.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </div>
            </div>
          </div>

          {/* Complete Sale Button */}
          <button
            type="button"
            onClick={onSaveSale}
            disabled={cart.length === 0 || isSavingSale}
            className="w-full mt-3 sm:mt-4 py-3 sm:py-3.5 bg-emerald-500 hover:bg-emerald-400 disabled:bg-slate-700 disabled:cursor-not-allowed text-black font-black text-xs sm:text-sm uppercase border-2 sm:border-3 border-white shadow-[2px_2px_0px_#fff] sm:shadow-[3px_3px_0px_#fff] active:translate-x-0.5 active:translate-y-0.5 flex items-center justify-center gap-2 cursor-pointer transition-all"
          >
            {isSavingSale ? (
              <>
                <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 animate-spin" />
                <span>PROCESSING SALE...</span>
              </>
            ) : (
              <>
                <Check className="w-4 h-4 sm:w-5 sm:h-5 stroke-[3]" />
                <span>COMPLETE SALE &amp; PRINT</span>
              </>
            )}
          </button>
        </div>

      </div>
    </div>
  );
};
