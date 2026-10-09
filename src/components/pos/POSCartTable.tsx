"use client";

import React from 'react';
import { ScanBarcode, Minus, Plus, Trash2 } from 'lucide-react';
import { POSCartItem } from './types';

interface POSCartTableProps {
  cart: POSCartItem[];
  onUpdateRate: (id: string, rate: number) => void;
  onUpdateDiscount: (id: string, discount: number) => void;
  onUpdateQuantity: (id: string, delta: number) => void;
  onRemoveItem: (id: string) => void;
}

export const POSCartTable: React.FC<POSCartTableProps> = ({
  cart,
  onUpdateRate,
  onUpdateDiscount,
  onUpdateQuantity,
  onRemoveItem,
}) => {
  return (
    <div className="p-3 sm:p-6">
      <div className="border-2 sm:border-4 border-black shadow-[2px_2px_0px_#000] sm:shadow-[4px_4px_0px_#000] overflow-x-auto bg-white">
        <table className="w-full text-left text-xs sm:text-sm text-black min-w-[640px]">
          <thead className="bg-black text-white text-[11px] sm:text-xs font-black uppercase tracking-wider">
            <tr className="border-b-2 sm:border-b-4 border-black">
              <th className="px-3 py-2.5 w-12 text-center">SL#</th>
              <th className="px-3 py-2.5">ITEM DESCRIPTION &amp; BARCODE</th>
              <th className="px-3 py-2.5 text-right w-24">RATE (৳)</th>
              <th className="px-3 py-2.5 text-center w-20">DISC</th>
              <th className="px-3 py-2.5 text-center w-32">QUANTITY</th>
              <th className="px-3 py-2.5 text-center w-16">UOM</th>
              <th className="px-3 py-2.5 text-center w-18">STOCK</th>
              <th className="px-3 py-2.5 text-right w-28">AMOUNT (৳)</th>
              <th className="px-3 py-2.5 text-center w-12">DEL</th>
            </tr>
          </thead>
          <tbody className="divide-y-2 divide-black">
            {cart.length === 0 ? (
              <tr>
                <td colSpan={9} className="px-4 py-10 sm:py-14 text-center">
                  <div className="flex flex-col items-center justify-center gap-2">
                    <ScanBarcode className="w-8 h-8 sm:w-10 sm:h-10 text-slate-400 stroke-[1.5]" />
                    <p className="font-black text-sm uppercase text-slate-600">Cart is empty</p>
                    <p className="text-xs font-bold text-slate-400">
                      Scan barcode with laser scanner or switch to CATALOG mode above
                    </p>
                  </div>
                </td>
              </tr>
            ) : (
              cart.map((item, idx) => {
                const rowTotal = item.rate * item.qty - item.discount;
                return (
                  <tr key={item.id} className="hover:bg-amber-50/50 font-bold transition-colors">
                    <td className="px-3 py-2 text-center font-black">{idx + 1}</td>
                    <td className="px-3 py-2">
                      <p className="font-black text-black">{item.name}</p>
                      <p className="font-mono text-[11px] text-slate-500 font-bold">BARCODE: {item.sku}</p>
                    </td>
                    <td className="px-3 py-2 text-right">
                      <input 
                        type="number" 
                        min="0"
                        step="any"
                        value={item.rate} 
                        onChange={(e) => onUpdateRate(item.id, parseFloat(e.target.value) || 0)}
                        className="w-18 text-right font-black border-2 border-black px-1 py-0.5 text-xs" 
                      />
                    </td>
                    <td className="px-3 py-2 text-center">
                      <input 
                        type="number" 
                        min="0"
                        value={item.discount} 
                        onChange={(e) => onUpdateDiscount(item.id, parseFloat(e.target.value) || 0)}
                        className="w-14 text-center font-black border-2 border-black px-1 py-0.5 text-xs" 
                      />
                    </td>
                    <td className="px-3 py-2 text-center">
                      <div className="flex items-center justify-center gap-1">
                        <button
                          type="button"
                          onClick={() => onUpdateQuantity(item.id, -1)}
                          className="w-6 h-6 sm:w-7 sm:h-7 bg-slate-200 hover:bg-slate-300 border-2 border-black flex items-center justify-center font-black active:translate-y-0.5 cursor-pointer"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="w-8 sm:w-10 text-center font-black text-sm sm:text-base">{item.qty}</span>
                        <button
                          type="button"
                          onClick={() => onUpdateQuantity(item.id, 1)}
                          className="w-6 h-6 sm:w-7 sm:h-7 bg-amber-300 hover:bg-amber-400 border-2 border-black flex items-center justify-center font-black active:translate-y-0.5 cursor-pointer"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                    </td>
                    <td className="px-3 py-2 text-center font-black text-xs uppercase">{item.uom}</td>
                    <td className="px-3 py-2 text-center font-black text-xs">
                      <span className={item.stock < 10 ? 'text-rose-600' : 'text-emerald-700'}>
                        {item.stock}
                      </span>
                    </td>
                    <td className="px-3 py-2 text-right font-black text-sm sm:text-base">
                      ৳{rowTotal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </td>
                    <td className="px-3 py-2 text-center">
                      <button
                        type="button"
                        onClick={() => onRemoveItem(item.id)}
                        className="p-1 text-rose-600 hover:bg-rose-100 border-2 border-transparent hover:border-black rounded transition-all cursor-pointer"
                        title="Remove item"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
