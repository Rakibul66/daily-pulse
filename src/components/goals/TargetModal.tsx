"use client";

import React, { useState, useEffect } from "react";
import { DynamicItem, TargetCategory } from "@/types/report";
import {
  X,
  Target,
  Users,
  Headphones,
  Search,
  Plus,
  Minus,
  Sparkles,
  Save,
  Check,
} from "lucide-react";

interface TargetModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialCategory?: TargetCategory;
  initialItem?: DynamicItem | null;
  onSave: (item: DynamicItem) => void;
}

const CATEGORY_CONFIG: Record<
  TargetCategory,
  {
    label: string;
    icon: React.ElementType;
    color: string;
    bgColor: string;
    defaultUnit: string;
    presets: { label: string; value: number; unit: string; notes?: string }[];
  }
> = {
  leadGen: {
    label: "Lead Generation",
    icon: Target,
    color: "text-indigo-600",
    bgColor: "bg-indigo-50 border-indigo-200",
    defaultUnit: "leads",
    presets: [
      { label: "Potential Leads to Find", value: 20, unit: "leads", notes: "Target e-commerce & Shopify merchants" },
      { label: "Qualified Prospects to Contact", value: 5, unit: "prospects", notes: "Direct outreach via email / LinkedIn" },
      { label: "Previous Leads Follow-up", value: 15, unit: "leads", notes: "Re-engage warm prospects" },
      { label: "LinkedIn Connection Requests", value: 25, unit: "requests", notes: "Personalized connection notes" },
    ],
  },
  onboarding: {
    label: "Client Onboarding",
    icon: Users,
    color: "text-emerald-600",
    bgColor: "bg-emerald-50 border-emerald-200",
    defaultUnit: "discussions",
    presets: [
      { label: "Convert to Onboarding Discussion", value: 1, unit: "discussions", notes: "Live walkthrough / demo" },
      { label: "Existing Prospect Follow-ups", value: 5, unit: "prospects", notes: "Follow up with interested leads" },
      { label: "Trial Account Activations", value: 2, unit: "trials", notes: "Setup assistance" },
    ],
  },
  support: {
    label: "Customer Support",
    icon: Headphones,
    color: "text-indigo-600",
    bgColor: "bg-indigo-50 border-indigo-200",
    defaultUnit: "tickets",
    presets: [
      { label: "Customer Calls / Messages Handled", value: 5, unit: "calls", notes: "Prompt inquiry response" },
      { label: "Pending Issues to Resolve", value: 4, unit: "tickets", notes: "Bug fixes & sync checks" },
      { label: "Unresolved Customer Follow-ups", value: 2, unit: "follow-ups", notes: "VIP ticket escalation" },
    ],
  },
  competitor: {
    label: "Competitor Research",
    icon: Search,
    color: "text-indigo-600",
    bgColor: "bg-indigo-50 border-indigo-200",
    defaultUnit: "platforms",
    presets: [
      { label: "Competitors / Platforms Audited", value: 4, unit: "platforms", notes: "Facebook Ads, Instagram, TikTok" },
      { label: "Short-Form Video Hooks Tracked", value: 5, unit: "hooks", notes: "Identify trending reel formats" },
      { label: "Organic Growth Angles to Test", value: 1, unit: "strategies", notes: "Customer case studies" },
    ],
  },
};

export const TargetModal: React.FC<TargetModalProps> = ({
  isOpen,
  onClose,
  initialCategory = "leadGen",
  initialItem,
  onSave,
}) => {
  const [category, setCategory] = useState<TargetCategory>(initialCategory);
  const [label, setLabel] = useState("");
  const [value, setValue] = useState<number>(10);
  const [unit, setUnit] = useState("leads");
  const [notes, setNotes] = useState("");

  useEffect(() => {
    if (initialItem) {
      setLabel(initialItem.label);
      setValue(Number(initialItem.value) || 0);
      setUnit(initialItem.unit || CATEGORY_CONFIG[initialCategory].defaultUnit);
      setNotes(initialItem.notes || "");
      if (initialItem.category) {
        setCategory(initialItem.category);
      }
    } else {
      setCategory(initialCategory);
      const conf = CATEGORY_CONFIG[initialCategory];
      const firstPreset = conf.presets[0];
      setLabel(firstPreset.label);
      setValue(firstPreset.value);
      setUnit(firstPreset.unit);
      setNotes(firstPreset.notes || "");
    }
  }, [initialItem, initialCategory, isOpen]);

  if (!isOpen) return null;

  const currentConf = CATEGORY_CONFIG[category];

  const handleApplyPreset = (preset: {
    label: string;
    value: number;
    unit: string;
    notes?: string;
  }) => {
    setLabel(preset.label);
    setValue(preset.value);
    setUnit(preset.unit);
    if (preset.notes) setNotes(preset.notes);
  };

  const handleCategoryChange = (newCat: TargetCategory) => {
    setCategory(newCat);
    if (!initialItem) {
      const conf = CATEGORY_CONFIG[newCat];
      const preset = conf.presets[0];
      setLabel(preset.label);
      setValue(preset.value);
      setUnit(preset.unit);
      setNotes(preset.notes || "");
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!label.trim()) return;

    const item: DynamicItem = {
      id: initialItem ? initialItem.id : "target-" + Date.now(),
      label: label.trim(),
      value,
      unit: unit.trim() || currentConf.defaultUnit,
      category,
      notes: notes.trim(),
      completed: initialItem ? initialItem.completed : false,
    };

    onSave(item);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-slate-900 rounded-3xl max-w-lg w-full shadow-2xl border border-slate-800 overflow-hidden flex flex-col relative animate-in zoom-in-95 duration-150 text-white">
        {/* Modal Header */}
        <div className="p-6 border-b border-slate-800 flex items-center justify-between bg-slate-950/50">
          <div className="flex items-center gap-2.5">
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${currentConf.bgColor} ${currentConf.color}`}>
              <Target className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">
                {initialItem ? "Edit Target" : "Add New Daily Target"}
              </h3>
              <p className="text-xs text-slate-400">
                Choose a category, set the target value with the slider, and save.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5 overflow-y-auto max-h-[75vh]">
          {/* Category Tabs */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
              Select Category
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {(Object.keys(CATEGORY_CONFIG) as TargetCategory[]).map((cat) => {
                const conf = CATEGORY_CONFIG[cat];
                const isSelected = category === cat;
                const Icon = conf.icon;

                return (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => handleCategoryChange(cat)}
                    className={`p-2.5 rounded-xl border text-xs font-semibold flex flex-col items-center gap-1.5 transition-all ${
                      isSelected
                        ? "bg-indigo-950/80 border-indigo-500 text-indigo-300 shadow-xs ring-2 ring-indigo-500/20"
                        : "border-slate-800 text-slate-300 hover:bg-slate-800 hover:text-white"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="text-[11px] text-center">{conf.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Preset Quick Picks */}
          <div>
            <span className="block text-xs font-medium text-slate-400 mb-1.5">
              Quick Presets:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {currentConf.presets.map((preset, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleApplyPreset(preset)}
                  className="px-2.5 py-1 rounded-lg text-xs bg-slate-800 hover:bg-indigo-950 hover:text-indigo-300 border border-slate-700 text-slate-200 transition-colors flex items-center gap-1"
                >
                  <span>{preset.label}</span>
                  <span className="font-bold text-slate-400 text-[10px]">
                    ({preset.value})
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Target Title / Label */}
          <div>
            <label className="block text-xs font-medium text-slate-200 mb-1">
              Target Description / Label <span className="text-rose-400">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Qualified Prospects to Contact"
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-700 bg-slate-950 text-white placeholder-slate-500 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 font-semibold"
            />
          </div>

          {/* Interactive Value Slider & Stepper Wheel */}
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                Target Value
              </label>
              <div className="flex items-baseline gap-1 bg-slate-900 px-3 py-1 rounded-xl border border-slate-700 shadow-2xs">
                <span className="text-xl font-extrabold text-indigo-400">{value}</span>
                <span className="text-xs text-slate-400 font-medium">{unit}</span>
              </div>
            </div>

            {/* Slider Component */}
            <div className="space-y-1">
              <input
                type="range"
                min="0"
                max="100"
                step="1"
                value={value}
                onChange={(e) => setValue(parseInt(e.target.value) || 0)}
                className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
              />
              <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                <span>0</span>
                <span>25</span>
                <span>50</span>
                <span>75</span>
                <span>100+</span>
              </div>
            </div>

            {/* Stepper Wheel Buttons & Direct Entry */}
            <div className="flex items-center justify-between pt-1">
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => setValue((prev) => Math.max(0, prev - 1))}
                  className="w-8 h-8 rounded-lg bg-slate-900 border border-slate-700 hover:bg-slate-800 flex items-center justify-center text-slate-200 active:scale-95 transition-all"
                  title="Decrease"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => setValue((prev) => prev + 1)}
                  className="w-8 h-8 rounded-lg bg-slate-900 border border-slate-700 hover:bg-slate-800 flex items-center justify-center text-slate-200 active:scale-95 transition-all"
                  title="Increase"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Unit Input */}
              <div className="flex items-center gap-1.5 text-xs">
                <span className="text-slate-400 font-medium">Unit:</span>
                <input
                  type="text"
                  placeholder="leads"
                  value={unit}
                  onChange={(e) => setUnit(e.target.value)}
                  className="w-24 px-2.5 py-1 text-xs rounded-lg border border-slate-700 bg-slate-900 text-white font-medium placeholder-slate-500"
                />
              </div>
            </div>
          </div>

          {/* Strategy & Notes */}
          <div>
            <label className="block text-xs font-medium text-slate-200 mb-1">
              Strategy / Execution Notes (Optional)
            </label>
            <textarea
              rows={2}
              placeholder="e.g. Focus on direct LinkedIn messaging and personalized loom video teasers"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-700 bg-slate-950 text-white placeholder-slate-500 focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Submit Footer */}
          <div className="flex items-center justify-end gap-3 pt-2 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-800 rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-xl shadow-xs transition-all active:scale-95 flex items-center gap-1.5"
            >
              <Save className="w-3.5 h-3.5" />
              {initialItem ? "Update Target" : "Save Target to Today"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
