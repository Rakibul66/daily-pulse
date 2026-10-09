import React from "react";
import Link from "next/link";
import { Check, X, ArrowRight, MessageCircle } from "lucide-react";
import { Plan } from "./types";

interface PricingTierCardsProps {
  plans: Plan[];
  billingCycle: 'monthly' | 'yearly';
}

export const PricingTierCards: React.FC<PricingTierCardsProps> = ({
  plans,
  billingCycle,
}) => {
  return (
    <div className="grid lg:grid-cols-3 gap-8 items-stretch mb-20">
      {plans.map((plan) => {
        const price = billingCycle === 'monthly' ? plan.priceMonthly : plan.priceYearly;
        const period = billingCycle === 'monthly' ? '/ Month' : '/ Year';

        return (
          <div
            key={plan.id}
            className={`border-4 border-black p-8 flex flex-col justify-between transition-all relative ${
              plan.isPopular
                ? 'bg-[#FFFDF0] shadow-[12px_12px_0px_#000] lg:-translate-y-3'
                : 'bg-white shadow-[8px_8px_0px_#000] hover:-translate-y-1'
            }`}
          >
            {plan.isPopular && (
              <div className="absolute -top-4 right-6 px-4 py-1.5 bg-amber-300 border-2 border-black font-black text-[11px] uppercase tracking-wider shadow-[2px_2px_0px_#000]">
                MOST POPULAR
              </div>
            )}

            <div>
              <div className={`inline-block px-3 py-1 border-2 border-black text-[11px] font-black uppercase mb-4 shadow-[2px_2px_0px_#000] ${plan.badgeColor}`}>
                {plan.badge}
              </div>
              <h3 className="font-display font-black text-2xl uppercase tracking-tight text-black mb-2">
                {plan.name}
              </h3>
              <p className="text-xs font-bold text-slate-600 uppercase tracking-wide mb-6">
                {plan.desc}
              </p>

              <div className="flex items-baseline gap-2 mb-6 pb-6 border-b-2 border-black">
                <span className={`font-display font-black text-5xl ${plan.isPopular ? 'text-indigo-600' : 'text-black'}`}>
                  ৳ {price.toLocaleString()}
                </span>
                <span className="text-xs font-black uppercase text-slate-600">
                  {period}
                </span>
              </div>

              <div className="space-y-3 mb-8">
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 block mb-2">
                  Included Capabilities:
                </span>
                {plan.features.map((feat, idx) => (
                  <div key={idx} className="flex items-start gap-2.5 text-xs font-bold text-black uppercase tracking-wider">
                    <Check className="w-4 h-4 text-emerald-600 stroke-[3] shrink-0 mt-0.5" />
                    <span>{feat}</span>
                  </div>
                ))}

                {plan.notIncluded.length > 0 && (
                  <div className="pt-4 border-t border-black/10 space-y-2.5 opacity-60">
                    {plan.notIncluded.map((notFeat, idx) => (
                      <div key={idx} className="flex items-start gap-2.5 text-xs font-bold text-slate-500 uppercase tracking-wider line-through">
                        <X className="w-4 h-4 text-slate-400 stroke-[2] shrink-0 mt-0.5" />
                        <span>{notFeat}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-3 pt-4 border-t-2 border-black">
              <Link
                href={plan.ctaHref}
                className={`w-full py-4 text-center font-display font-black text-xs uppercase tracking-wider border-3 border-black shadow-[4px_4px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all flex items-center justify-center gap-2 ${
                  plan.isPopular
                    ? 'bg-indigo-600 hover:bg-indigo-700 text-white'
                    : 'bg-white hover:bg-slate-100 text-black'
                }`}
              >
                {plan.ctaText} <ArrowRight className="w-4 h-4 stroke-[3]" />
              </Link>

              <a
                href={`https://wa.me/8801315861003?text=${encodeURIComponent(`Hello Shomporko CRM, I would like to inquire about the ${plan.name} plan.`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-2.5 bg-white hover:bg-emerald-100 text-emerald-900 font-display font-black text-[11px] uppercase tracking-wider border-2 border-black shadow-[2px_2px_0px_#000] flex items-center justify-center gap-2 transition-all text-center"
              >
                <MessageCircle className="w-3.5 h-3.5 text-emerald-600 stroke-[2.5]" /> INQUIRE ON WHATSAPP
              </a>
            </div>
          </div>
        );
      })}
    </div>
  );
};
