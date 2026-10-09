import React from "react";
import { Check, X } from "lucide-react";
import { ComparisonFeature } from "./types";

interface PricingComparisonTableProps {
  comparisonFeatures: ComparisonFeature[];
}

export const PricingComparisonTable: React.FC<PricingComparisonTableProps> = ({
  comparisonFeatures,
}) => {
  return (
    <div className="bg-white border-4 border-black shadow-[10px_10px_0px_#000] p-6 sm:p-10 mb-20 overflow-hidden">
      <div className="border-b-4 border-black pb-4 mb-6">
        <span className="px-3 py-1 bg-amber-300 border-2 border-black text-[11px] font-black uppercase tracking-wider shadow-[2px_2px_0px_#000] inline-block mb-2">
          DETAILED COMPARISON MATRIX
        </span>
        <h2 className="font-display font-black text-2xl sm:text-3xl uppercase tracking-tight text-black">
          Compare Features By Plan
        </h2>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-left">
          <thead>
            <tr className="border-b-3 border-black bg-slate-100">
              <th className="p-4 font-display font-black text-xs uppercase tracking-wider text-black">Features & Capabilities</th>
              <th className="p-4 font-display font-black text-xs uppercase tracking-wider text-black text-center">Starter</th>
              <th className="p-4 font-display font-black text-xs uppercase tracking-wider text-indigo-700 text-center">Business Pro</th>
              <th className="p-4 font-display font-black text-xs uppercase tracking-wider text-black text-center">Enterprise</th>
            </tr>
          </thead>
          <tbody className="divide-y-2 divide-black/10 text-xs font-bold uppercase tracking-wider">
            {comparisonFeatures.map((row, idx) => (
              <tr key={idx} className="hover:bg-amber-50/50 transition-colors">
                <td className="p-4 text-black font-black">{row.feature}</td>
                <td className="p-4 text-center">
                  {typeof row.starter === 'boolean' ? (
                    row.starter ? (
                      <Check className="w-5 h-5 text-emerald-600 stroke-[3] mx-auto" />
                    ) : (
                      <X className="w-5 h-5 text-slate-300 stroke-[2] mx-auto" />
                    )
                  ) : (
                    <span className="text-[11px] text-slate-700">{row.starter}</span>
                  )}
                </td>
                <td className="p-4 text-center bg-indigo-50/30">
                  {typeof row.pro === 'boolean' ? (
                    row.pro ? (
                      <Check className="w-5 h-5 text-indigo-600 stroke-[3] mx-auto" />
                    ) : (
                      <X className="w-5 h-5 text-slate-300 stroke-[2] mx-auto" />
                    )
                  ) : (
                    <span className="text-[11px] text-indigo-900 font-black">{row.pro}</span>
                  )}
                </td>
                <td className="p-4 text-center">
                  {typeof row.enterprise === 'boolean' ? (
                    row.enterprise ? (
                      <Check className="w-5 h-5 text-emerald-600 stroke-[3] mx-auto" />
                    ) : (
                      <X className="w-5 h-5 text-slate-300 stroke-[2] mx-auto" />
                    )
                  ) : (
                    <span className="text-[11px] text-black font-black">{row.enterprise}</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
