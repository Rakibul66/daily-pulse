import React from "react";
import { SlidersHorizontal } from "lucide-react";
import { FeatureConfig, AVAILABLE_FEATURES } from "@/lib/featureConfigStorage";

interface FeatureConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
  featureConfig: FeatureConfig;
  onToggleFeature: (key: keyof FeatureConfig) => void;
  onResetFeatures: () => void;
}

export const FeatureConfigModal: React.FC<FeatureConfigModalProps> = ({
  isOpen,
  onClose,
  featureConfig,
  onToggleFeature,
  onResetFeatures,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5">
      <div className="bg-white border-4 border-black shadow-[10px_10px_0px_#000] w-full max-w-2xl max-h-[85vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-150">
        
        {/* Modal Header */}
        <div className="px-6 py-4 border-b-2 border-black bg-amber-300 flex items-center justify-between">
          <div>
            <h3 className="font-display font-black text-base uppercase text-black flex items-center gap-2">
              <SlidersHorizontal className="w-5 h-5 text-black" />
              WORKSPACE FEATURE MODULES
            </h3>
            <p className="text-[11px] font-bold text-black uppercase tracking-wider mt-0.5">
              Enable or disable business engines. Changes apply instantly across your workspace.
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 bg-white border-2 border-black flex items-center justify-center text-black font-black hover:bg-rose-400 cursor-pointer text-sm"
          >
            ✕
          </button>
        </div>

        {/* Scrollable Feature List */}
        <div className="p-6 overflow-y-auto space-y-3.5 divide-y divide-black/10">
          {AVAILABLE_FEATURES.map((item) => {
            const isEnabled = featureConfig[item.key] === true;

            return (
              <div 
                key={item.key} 
                className="pt-3.5 first:pt-0 flex items-center justify-between gap-4 group"
              >
                <div className="flex-1 pr-2">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-display font-black text-sm uppercase text-black">
                      {item.title}
                    </span>
                    <span className="px-1.5 py-0.2 bg-slate-100 border border-black text-[9px] font-black uppercase text-slate-800">
                      {item.category}
                    </span>
                    <span className="px-1.5 py-0.2 bg-amber-100 border border-amber-800 text-[9px] font-black uppercase text-amber-950">
                      DEFAULT OFF
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 font-medium leading-relaxed">
                    {item.description}
                  </p>
                </div>

                {/* Enable / Disable Toggle Switch */}
                <div className="shrink-0 flex items-center gap-2">
                  <span className={`text-[10px] font-black uppercase ${isEnabled ? 'text-emerald-800 font-mono' : 'text-slate-400'}`}>
                    {isEnabled ? 'ENABLED' : 'DISABLED'}
                  </span>
                  <button
                    type="button"
                    onClick={() => onToggleFeature(item.key)}
                    className={`w-14 h-7 border-2 border-black shadow-[2px_2px_0px_#000] p-0.5 transition-colors cursor-pointer flex items-center ${
                      isEnabled ? 'bg-emerald-500 justify-end' : 'bg-slate-200 justify-start'
                    }`}
                    title={isEnabled ? 'Click to Disable' : 'Click to Enable'}
                  >
                    <div className="w-5 h-5 bg-white border border-black flex items-center justify-center font-black text-[10px] text-black">
                      {isEnabled ? '✓' : '—'}
                    </div>
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 border-t-2 border-black bg-slate-50 flex items-center justify-between">
          <button
            type="button"
            onClick={onResetFeatures}
            className="text-xs font-black uppercase text-slate-600 hover:text-black hover:underline cursor-pointer"
          >
            Reset to Defaults (All Disabled)
          </button>

          <button
            type="button"
            onClick={onClose}
            className="px-6 py-2 bg-black hover:bg-slate-800 text-white font-display font-black text-xs uppercase tracking-wider border-2 border-black shadow-[2px_2px_0px_#000] cursor-pointer"
          >
            APPLY & CLOSE
          </button>
        </div>

      </div>
    </div>
  );
};
