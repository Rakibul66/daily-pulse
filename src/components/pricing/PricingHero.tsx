import React from "react";
import { Sparkles } from "lucide-react";

interface PricingHeroProps {
  billingCycle: 'monthly' | 'yearly';
  onBillingCycleChange: (cycle: 'monthly' | 'yearly') => void;
}

export const PricingHero: React.FC<PricingHeroProps> = ({
  billingCycle,
  onBillingCycleChange,
}) => {
  return (
    <div className="text-center max-w-3xl mx-auto mb-12">
      <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-300 border-2 border-black shadow-[2px_2px_0px_#000] font-black text-xs uppercase tracking-wider mb-4">
        <Sparkles className="w-4 h-4 fill-black" /> POS & ERP PRICING IN BANGLADESH
      </div>
      <h1 className="font-display font-black text-4xl sm:text-6xl uppercase tracking-tight text-black mb-4">
        AFFORDABLE PLANS FOR <br /><span className="text-indigo-600">EVERY BUSINESS</span>
      </h1>
      <div className="w-24 h-2 bg-indigo-600 mx-auto mb-6" />
      <p className="text-base sm:text-lg font-bold text-slate-700 leading-relaxed">
        Transparent pricing with no hidden charges. Choose the tier that matches your operations, from single checkout counters to nationwide enterprise chains.
      </p>

      {/* Monthly / Yearly Toggle */}
      <div className="mt-8 inline-flex items-center gap-3 p-1.5 bg-white border-3 border-black shadow-[4px_4px_0px_#000]">
        <button
          type="button"
          onClick={() => onBillingCycleChange('monthly')}
          className={`px-5 py-2 text-xs font-black uppercase tracking-wider transition-all cursor-pointer ${
            billingCycle === 'monthly'
              ? 'bg-indigo-600 text-white border-2 border-black shadow-[2px_2px_0px_#000]'
              : 'text-black hover:bg-slate-100'
          }`}
        >
          MONTHLY BILLING
        </button>
        <button
          type="button"
          onClick={() => onBillingCycleChange('yearly')}
          className={`px-5 py-2 text-xs font-black uppercase tracking-wider transition-all flex items-center gap-2 cursor-pointer ${
            billingCycle === 'yearly'
              ? 'bg-amber-300 text-black border-2 border-black shadow-[2px_2px_0px_#000]'
              : 'text-black hover:bg-slate-100'
          }`}
        >
          <span>ANNUAL BILLING</span>
          <span className="px-2 py-0.5 bg-emerald-500 text-white text-[10px] font-black rounded-none border border-black">
            SAVE 2 MONTHS
          </span>
        </button>
      </div>
    </div>
  );
};
