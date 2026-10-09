import React from "react";
import { Layers, ShieldCheck, SlidersHorizontal } from "lucide-react";
import { AVAILABLE_FEATURES } from "@/lib/featureConfigStorage";

interface FeatureConfigSectionProps {
  activeFeatureCount: number;
  onOpenModal: () => void;
}

export const FeatureConfigSection: React.FC<FeatureConfigSectionProps> = ({
  activeFeatureCount,
  onOpenModal,
}) => {
  return (
    <div className="p-6 sm:p-8 bg-slate-50 border-b-4 border-black">
      <div className="max-w-4xl space-y-4">
        <div className="border-b-2 border-black pb-3 flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2.5">
            <Layers className="w-5 h-5 text-indigo-600 stroke-[2.5]" />
            <div>
              <h2 className="font-display font-black text-base uppercase text-black tracking-wider">
                CONFIG FEATURES & MODULE CONTROLLER
              </h2>
              <p className="text-[11px] font-bold text-slate-600 uppercase mt-0.5">
                Toggle active tools for this company & branch. Unselected modules will remain hidden in navigation.
              </p>
            </div>
          </div>
          <span className="px-3 py-1 bg-amber-300 border-2 border-black shadow-[2px_2px_0px_#000] text-xs font-black uppercase text-black">
            {activeFeatureCount} OF {AVAILABLE_FEATURES.length} ACTIVE
          </span>
        </div>

        {/* Feature Config Callout Banner with Trigger Button */}
        <div className="bg-white border-3 border-black p-6 shadow-[5px_5px_0px_#000] flex flex-wrap items-center justify-between gap-4">
          <div>
            <h3 className="font-display font-black text-sm uppercase text-black mb-1 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              WORKSPACE MODULE VISIBILITY ENGINE
            </h3>
            <p className="text-xs font-bold text-slate-700 max-w-xl">
              By default, your workspace displays core essentials: <strong>Dashboard, HRM & Payroll, Utilities & Settings</strong>. 
              Click below to enable or disable optional business modules: <strong>CRM, Product Management, Purchase Management, Sales Management, and Partnership</strong>.
            </p>
          </div>

          <button
            type="button"
            onClick={onOpenModal}
            className="px-5 py-2.5 bg-black hover:bg-slate-800 text-white font-display font-black text-xs uppercase tracking-wider border-2 border-black shadow-[3px_3px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 transition-all flex items-center gap-2 cursor-pointer"
          >
            <SlidersHorizontal className="w-4 h-4 text-amber-300" />
            CONFIG FEATURES
          </button>
        </div>
      </div>
    </div>
  );
};
