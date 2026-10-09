"use client";

import React from "react";
import { UtensilsCrossed, Store, CheckCircle2, Loader2, Trash2 } from "lucide-react";
import { CateringVendor, MealRecord } from "@/types/catering";

interface CateringMealsTabProps {
  vendors: CateringVendor[];
  activeVendor?: CateringVendor;
  mealDate: string;
  setMealDate: (d: string) => void;
  mealCount: string;
  setMealCount: (c: string) => void;
  mealRate: string;
  setMealRate: (r: string) => void;
  mealMenu: string;
  setMealMenu: (m: string) => void;
  isLoggingMeal: boolean;
  onAddMeal: (e: React.FormEvent) => void;
  filteredMeals: MealRecord[];
  paginatedMeals: MealRecord[];
  mealPage: number;
  setMealPage: React.Dispatch<React.SetStateAction<number>>;
  totalMealPages: number;
  itemsPerPage: number;
  onDeleteMeal: (id: string) => void;
}

export const CateringMealsTab: React.FC<CateringMealsTabProps> = ({
  vendors,
  activeVendor,
  mealDate,
  setMealDate,
  mealCount,
  setMealCount,
  mealRate,
  setMealRate,
  mealMenu,
  setMealMenu,
  isLoggingMeal,
  onAddMeal,
  filteredMeals,
  paginatedMeals,
  mealPage,
  setMealPage,
  totalMealPages,
  itemsPerPage,
  onDeleteMeal
}) => {
  const currentCount = parseInt(mealCount) || 0;
  const currentRate = parseFloat(mealRate) || 130;
  const calculatedDayTotal = currentCount * currentRate;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
      {/* Left Column: Log Daily Meals Form */}
      <div className="lg:col-span-4 bg-slate-50 border-3 border-black p-5 shadow-[4px_4px_0px_#000]">
        <div className="flex items-center justify-between pb-3 mb-4 border-b-2 border-black">
          <h3 className="font-display font-black text-base uppercase tracking-tight text-black flex items-center gap-2">
            <UtensilsCrossed className="w-5 h-5 text-indigo-600" />
            LOG DAILY MEALS
          </h3>
          <span className="px-2 py-0.5 bg-amber-300 border border-black text-[9px] font-black uppercase text-black">
            AUTO-CALCULATED
          </span>
        </div>

        {vendors.length === 0 ? (
          <div className="p-4 bg-amber-100 border-2 border-black text-xs font-bold text-black mb-4">
            Please add a vendor first using the &ldquo;+ VENDOR / DOKAN&rdquo; button above.
          </div>
        ) : (
          <form onSubmit={onAddMeal} className="space-y-4">
            <div className="p-3 bg-white border-2 border-black shadow-[2px_2px_0px_#000]">
              <p className="text-[10px] font-black uppercase tracking-wider text-slate-500 mb-0.5">Selected Catering Vendor</p>
              <p className="text-sm font-black text-black flex items-center gap-2">
                <Store className="w-4 h-4 text-indigo-600" /> {activeVendor?.name || 'Default Vendor'}
              </p>
            </div>

            <div>
              <label className="block text-xs font-black uppercase text-black mb-1">Meal Date</label>
              <input 
                required 
                type="date" 
                value={mealDate} 
                onChange={e => setMealDate(e.target.value)} 
                className="w-full px-3 py-2 text-xs font-bold border-2 border-black bg-white shadow-[2px_2px_0px_#000]" 
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-black uppercase text-black mb-1">Total Meals</label>
                <input 
                  required 
                  type="number" 
                  min="1" 
                  value={mealCount} 
                  onChange={e => setMealCount(e.target.value)} 
                  className="w-full px-3 py-2 text-xs font-bold border-2 border-black bg-white shadow-[2px_2px_0px_#000]" 
                  placeholder="e.g. 12" 
                />
              </div>

              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="text-xs font-black uppercase text-black">Rate / Meal (৳)</label>
                  <span className="text-[9px] font-black text-indigo-700 bg-indigo-50 px-1 border border-indigo-200">
                    EDITABLE
                  </span>
                </div>
                <input 
                  required 
                  type="number" 
                  min="0"
                  step="any" 
                  value={mealRate} 
                  onChange={e => setMealRate(e.target.value)} 
                  className="w-full px-3 py-2 text-xs font-black text-indigo-900 border-2 border-black bg-white shadow-[2px_2px_0px_#000]" 
                  placeholder="Default 130" 
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-black uppercase text-black mb-1">Menu Item / Tag (Optional)</label>
              <input 
                type="text" 
                value={mealMenu} 
                onChange={e => setMealMenu(e.target.value)} 
                className="w-full px-3 py-2 text-xs font-bold border-2 border-black bg-white shadow-[2px_2px_0px_#000]" 
                placeholder="e.g. Meat / Beef (৳150), Regular Chicken (৳130), Fish" 
              />
              <div className="flex gap-1.5 mt-1.5 flex-wrap">
                <button
                  type="button"
                  onClick={() => { setMealRate('130'); setMealMenu('Regular Meal (৳130)'); }}
                  className="text-[10px] font-black px-2 py-0.5 bg-white border border-black hover:bg-amber-200 cursor-pointer"
                >
                  Regular: ৳130
                </button>
                <button
                  type="button"
                  onClick={() => { setMealRate('150'); setMealMenu('Meat / Beef Day (৳150)'); }}
                  className="text-[10px] font-black px-2 py-0.5 bg-rose-100 border border-black hover:bg-rose-200 text-rose-900 cursor-pointer"
                >
                  Meat: ৳150
                </button>
                <button
                  type="button"
                  onClick={() => { setMealRate('180'); setMealMenu('Special Feast (৳180)'); }}
                  className="text-[10px] font-black px-2 py-0.5 bg-amber-100 border border-black hover:bg-amber-200 text-amber-900 cursor-pointer"
                >
                  Special: ৳180
                </button>
              </div>
            </div>

            <div className="bg-white border-2 border-black p-3 shadow-[2px_2px_0px_#000] flex justify-between items-center">
              <div>
                <span className="text-[10px] font-black uppercase text-slate-500 block">TOTAL DAY CALCULATION</span>
                <span className="text-xs font-bold text-slate-800">
                  {currentCount} meals × ৳{currentRate}
                </span>
              </div>
              <p className="text-xl font-black font-display text-emerald-800">
                ৳ {calculatedDayTotal.toLocaleString()}
              </p>
            </div>

            <button 
              type="submit" 
              disabled={isLoggingMeal}
              className="w-full py-2.5 bg-black hover:bg-slate-800 text-white font-display font-black text-xs uppercase tracking-wider border-2 border-black shadow-[3px_3px_0px_#000] flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {isLoggingMeal ? <Loader2 className="w-4 h-4 animate-spin text-white" /> : <CheckCircle2 className="w-4 h-4 text-amber-300" />}
              SAVE MEAL RECORD
            </button>
          </form>
        )}
      </div>
      
      {/* Right Column: Recent Meal Records Table */}
      <div className="lg:col-span-8">
        <div className="flex items-center justify-between pb-3 mb-4 border-b-2 border-black">
          <h3 className="font-display font-black text-base uppercase tracking-tight text-black">
            RECENT MEAL RECORDS
          </h3>
          <span className="text-xs font-black text-slate-600 uppercase">
            {filteredMeals.length} Total Logs
          </span>
        </div>

        <div className="overflow-x-auto border-3 border-black bg-white shadow-[4px_4px_0px_#000]">
          <table className="w-full text-left text-xs text-black">
            <thead className="bg-amber-300 border-b-2 border-black text-[10px] font-black uppercase tracking-wider">
              <tr>
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3">Vendor</th>
                <th className="px-4 py-3 text-center">Meals</th>
                <th className="px-4 py-3 text-right">Rate / Meal</th>
                <th className="px-4 py-3 text-right">Total Cost</th>
                <th className="px-4 py-3">Menu / Note</th>
                <th className="px-4 py-3 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y-2 divide-black/10 font-bold">
              {paginatedMeals.map(m => {
                const vendor = vendors.find(v => v.id === m.vendorId);
                const rate = m.perMealRate || vendor?.perMealRate || 130;
                const cost = m.totalCost || (m.mealCount * rate);

                return (
                  <tr key={m.id} className="hover:bg-amber-50/50 transition-colors">
                    <td className="px-4 py-3 font-mono font-bold text-black">{m.date}</td>
                    <td className="px-4 py-3 font-black text-black">{vendor?.name || 'Unknown'}</td>
                    <td className="px-4 py-3 text-center font-display font-black text-indigo-700 text-sm">
                      {m.mealCount}
                    </td>
                    <td className="px-4 py-3 text-right font-mono font-bold text-slate-800">
                      ৳ {rate}
                    </td>
                    <td className="px-4 py-3 text-right font-display font-black text-emerald-800 text-sm">
                      ৳ {cost.toLocaleString()}
                    </td>
                    <td className="px-4 py-3">
                      {m.menuItem ? (
                        <span className="px-2 py-0.5 bg-indigo-100 border border-black text-[10px] font-black uppercase text-indigo-900">
                          {m.menuItem}
                        </span>
                      ) : (
                        <span className="text-[10px] text-slate-400 uppercase font-mono">Regular</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <button 
                        onClick={() => onDeleteMeal(m.id)} 
                        className="p-1 text-rose-700 hover:text-black hover:bg-rose-200 border border-transparent hover:border-black transition-all cursor-pointer"
                        title="Delete meal record"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                );
              })}
              {filteredMeals.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-4 py-12 text-center text-slate-500 font-bold uppercase tracking-wider">
                    No meal records found for this period. Use the form on the left to log daily meals.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {filteredMeals.length > 0 && (
          <div className="flex items-center justify-between mt-4 px-1">
            <span className="text-xs font-bold text-slate-600">
              Showing {Math.min(mealPage * itemsPerPage, filteredMeals.length)} of {filteredMeals.length} logs
            </span>
            <div className="flex items-center gap-1.5">
              <button 
                disabled={mealPage === 1} 
                onClick={() => setMealPage(p => p - 1)} 
                className="px-2.5 py-1 bg-white border-2 border-black text-black font-black text-xs disabled:opacity-40 shadow-[1px_1px_0px_#000] cursor-pointer"
              >
                PREV
              </button>
              <span className="text-xs font-black text-black px-2">Page {mealPage} of {totalMealPages}</span>
              <button 
                disabled={mealPage === totalMealPages} 
                onClick={() => setMealPage(p => p + 1)} 
                className="px-2.5 py-1 bg-white border-2 border-black text-black font-black text-xs disabled:opacity-40 shadow-[1px_1px_0px_#000] cursor-pointer"
              >
                NEXT
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
