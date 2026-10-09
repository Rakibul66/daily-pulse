"use client";

import React from 'react';
import { DollarSign } from 'lucide-react';

interface ProductPricingSectionProps {
  purchasePrice: number;
  clientPrice: number;
  retailPrice: number;
  discountPercentage: number;
  discountAmount: number;
  onChange: (fields: Partial<{
    purchasePrice: number;
    clientPrice: number;
    retailPrice: number;
    discountPercentage: number;
    discountAmount: number;
  }>) => void;
}

export const ProductPricingSection: React.FC<ProductPricingSectionProps> = ({
  purchasePrice,
  clientPrice,
  retailPrice,
  discountPercentage,
  discountAmount,
  onChange,
}) => {
  const inputClasses = "w-full text-xs font-bold text-black bg-white px-3 py-2 border-2 border-black focus:outline-none focus:bg-amber-50 placeholder-slate-400";

  return (
    <div className="border-2 sm:border-4 border-black p-4 bg-cyan-50 shadow-[4px_4px_0px_#000] space-y-3">
      <div className="flex items-center gap-2 pb-2 border-b-2 border-black">
        <DollarSign className="w-4 h-4 text-cyan-800 stroke-[2.5]" />
        <h3 className="text-xs font-black uppercase tracking-wider text-black">
          Pricing, Margins &amp; Discounts
        </h3>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        <div>
          <label className="text-[10px] font-black uppercase text-black block mb-1">
            Purchase Price (৳)
          </label>
          <input
            type="number"
            min="0"
            step="0.01"
            value={purchasePrice}
            onChange={e => onChange({ purchasePrice: Number(e.target.value) })}
            className={inputClasses}
            placeholder="0"
            required
          />
        </div>

        <div>
          <label className="text-[10px] font-black uppercase text-black block mb-1">
            Client Price (৳)
          </label>
          <input
            type="number"
            min="0"
            step="0.01"
            value={clientPrice}
            onChange={e => onChange({ clientPrice: Number(e.target.value) })}
            className={inputClasses}
            placeholder="0"
          />
        </div>

        <div>
          <label className="text-[10px] font-black uppercase text-black block mb-1">
            Retail Price (৳) *
          </label>
          <input
            type="number"
            min="0"
            step="0.01"
            value={retailPrice}
            onChange={e => {
              const price = Number(e.target.value);
              const amt = discountPercentage > 0 ? (price * discountPercentage) / 100 : discountAmount;
              onChange({ retailPrice: price, discountAmount: Math.round(amt * 100) / 100 });
            }}
            className={inputClasses}
            placeholder="0"
            required
          />
        </div>

        <div>
          <label className="text-[10px] font-black uppercase text-black block mb-1">
            Discount (%)
          </label>
          <input
            type="number"
            min="0"
            max="100"
            step="0.01"
            value={discountPercentage}
            onChange={e => {
              const pct = Number(e.target.value);
              const amt = (Number(retailPrice) * pct) / 100;
              onChange({ discountPercentage: pct, discountAmount: Math.round(amt * 100) / 100 });
            }}
            className={inputClasses}
            placeholder="0"
          />
        </div>

        <div>
          <label className="text-[10px] font-black uppercase text-black block mb-1">
            Discount Amount (৳)
          </label>
          <input
            type="number"
            min="0"
            step="0.01"
            value={discountAmount}
            onChange={e => {
              const amt = Number(e.target.value);
              const price = Number(retailPrice);
              const pct = price > 0 ? (amt / price) * 100 : 0;
              onChange({ discountAmount: amt, discountPercentage: Math.round(pct * 100) / 100 });
            }}
            className={inputClasses}
            placeholder="0"
          />
        </div>
      </div>
    </div>
  );
};
