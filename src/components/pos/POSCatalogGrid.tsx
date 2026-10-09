"use client";

import React from 'react';
import { ShoppingBag, Package } from 'lucide-react';
import { Product } from '@/types/product';

interface POSCatalogGridProps {
  categoriesList: string[];
  selectedCategory: string;
  setSelectedCategory: (cat: string) => void;
  filteredProducts: Product[];
  onAddProduct: (product: Product) => void;
}

export const POSCatalogGrid: React.FC<POSCatalogGridProps> = ({
  categoriesList,
  selectedCategory,
  setSelectedCategory,
  filteredProducts,
  onAddProduct,
}) => {
  return (
    <div className="p-3 sm:p-4 bg-amber-50/50 border-b-2 sm:border-b-4 border-black">
      <div className="flex flex-wrap items-center justify-between gap-2 pb-2 mb-3 border-b-2 border-slate-300">
        <span className="text-xs font-black uppercase text-black flex items-center gap-1">
          <ShoppingBag className="w-4 h-4 text-black" />
          TAP ITEM TO ADD:
        </span>
        <div className="flex flex-wrap gap-1 max-w-full overflow-x-auto">
          {categoriesList.map(cat => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              className={`px-2 py-0.5 text-xs font-bold rounded border border-black cursor-pointer whitespace-nowrap ${
                selectedCategory === cat ? 'bg-black text-white' : 'bg-white text-black hover:bg-slate-100'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {filteredProducts.length === 0 ? (
        <div className="p-6 text-center text-slate-500 bg-white border-2 border-dashed border-slate-300">
          <Package className="w-6 h-6 mx-auto mb-1 text-slate-400" />
          <p className="text-xs font-bold">No products found in this category</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2 sm:gap-3 max-h-64 overflow-y-auto p-1">
          {filteredProducts.map(p => {
            const price = Number(p.retailPrice ?? p.price ?? 0);
            return (
              <button
                key={p.id}
                type="button"
                onClick={() => onAddProduct(p)}
                className="p-2 sm:p-2.5 bg-white hover:bg-amber-100 border-2 border-black shadow-[2px_2px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 text-left flex flex-col justify-between cursor-pointer transition-all"
              >
                <div>
                  <p className="text-xs font-black text-black line-clamp-2 leading-snug">{p.name}</p>
                  <p className="text-[10px] font-mono text-slate-500 mt-0.5">{p.barcode || p.code || '—'}</p>
                </div>
                <div className="mt-2 flex items-center justify-between border-t border-slate-200 pt-1">
                  <span className="text-xs font-black text-emerald-700">৳{price}</span>
                  <span className="text-[10px] font-bold text-slate-500">Stk: {p.stock}</span>
                </div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};
