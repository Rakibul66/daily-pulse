import React from "react";
import { HelpCircle } from "lucide-react";
import { FaqItem } from "./types";

interface PricingFaqSectionProps {
  faqs: FaqItem[];
}

export const PricingFaqSection: React.FC<PricingFaqSectionProps> = ({ faqs }) => {
  return (
    <div className="mb-20">
      <div className="text-center max-w-2xl mx-auto mb-12">
        <h2 className="font-display font-black text-3xl sm:text-4xl uppercase tracking-tight text-black mb-3">
          Frequently Asked Questions
        </h2>
        <div className="w-20 h-1.5 bg-black mx-auto mb-4" />
        <p className="text-xs font-bold text-slate-600 uppercase tracking-wider">
          Common questions business owners ask before starting
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
        {faqs.map((faq, idx) => (
          <div key={idx} className="bg-white border-3 border-black shadow-[6px_6px_0px_#000] p-6 hover:-translate-y-0.5 transition-transform">
            <div className="flex items-start gap-3 mb-2">
              <HelpCircle className="w-5 h-5 text-indigo-600 stroke-[2.5] shrink-0 mt-0.5" />
              <h3 className="font-display font-black text-base uppercase text-black leading-snug">
                {faq.q}
              </h3>
            </div>
            <p className="text-xs font-semibold text-slate-700 leading-relaxed pl-8">
              {faq.a}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};
