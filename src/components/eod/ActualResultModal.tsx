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
  Save,
  CheckCircle2,
} from "lucide-react";

interface ActualResultModalProps {
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
      { label: "Leads Found", value: 18, unit: "leads", notes: "E-commerce Shopify stores" },
      { label: "Prospects Contacted", value: 12, unit: "prospects", notes: "Personalized cold emails" },
      { label: "Leads Followed Up", value: 8, unit: "leads", notes: "Previous interested inquiries" },
      { label: "Positive Responses", value: 3, unit: "replies", notes: "High purchase intent" },
      { label: "Serious Prospects", value: 2, unit: "prospects", notes: "Ready for live demo" },
    ],
  },
  onboarding: {
    label: "Client Onboarding",
    icon: Users,
    color: "text-emerald-600",
    bgColor: "bg-emerald-50 border-emerald-200",
    defaultUnit: "discussions",
    presets: [
      { label: "Onboarding Discussions Converted", value: 1, unit: "discussions", notes: "Demo completed successfully" },
      { label: "Existing Prospects Re-engaged", value: 4, unit: "prospects", notes: "Followed up on pricing" },
    ],
  },
  support: {
    label: "Customer Support",
    icon: Headphones,
    color: "text-indigo-600",
    bgColor: "bg-indigo-50 border-indigo-200",
    defaultUnit: "tickets",
    presets: [
      { label: "Customer Calls / Messages Handled", value: 5, unit: "calls", notes: "Avg response under 10m" },
      { label: "Customer Issues Resolved", value: 4, unit: "tickets", notes: "Shipping & billing solved" },
      { label: "Pending Issues Escalated", value: 1, unit: "tickets", notes: "Awaiting developer fix" },
    ],
  },
  competitor: {
    label: "Competitor Research",
    icon: Search,
    color: "text-indigo-600",
    bgColor: "bg-indigo-50 border-indigo-200",
    defaultUnit: "platforms",
    presets: [
      { label: "Competitors Checked", value: 4, unit: "platforms", notes: "Audited Facebook Ads & IG reels" },
      { label: "Content Angles Identified", value: 3, unit: "angles", notes: "Short-form video hooks" },
    ],
  },
};

export const ActualResultModal: React.FC<ActualResultModalProps> = ({
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
      id: initialItem ? initialItem.id : "result-" + Date.now(),
      label: label.trim(),
      value,
      unit: unit.trim() || currentConf.defaultUnit,
      category,
      notes: notes.trim(),
      completed: true,
    };

    onSave(item);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-3xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col relative animate-in zoom-in-95 duration-150">
        {/* Modal Header */}
        <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-emerald-50/40">
          <div className="flex items-center gap-2.5">
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center bg-emerald-100 text-emerald-700 border border-emerald-200`}>
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">
                {initialItem ? "Edit Actual Result" : "Log End-of-Day Result"}
              </h3>
              <p className="text-xs text-slate-400">
                Record actual achievements with the slider or stepper.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
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
                        ? "bg-emerald-50 border-emerald-300 text-emerald-700 shadow-xs ring-2 ring-emerald-500/20"
                        : "border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-slate-900"
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
            <span className="block text-xs font-medium text-slate-500 mb-1.5">
              Quick Presets:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {currentConf.presets.map((preset, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleApplyPreset(preset)}
                  className="px-2.5 py-1 rounded-lg text-xs bg-slate-100 hover:bg-emerald-50 hover:text-emerald-700 border border-slate-200 text-slate-700 transition-colors flex items-center gap-1"
                >
                  <span>{preset.label}</span>
                  <span className="font-bold text-slate-500 text-[10px]">
                    ({preset.value})
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Result Title / Label */}
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">
              Result Description / Metric Name <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Leads Found"
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-emerald-500 font-semibold text-slate-800"
            />
          </div>

          {/* Interactive Value Slider & Stepper Wheel */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Actual Value
              </label>
              <div className="flex items-baseline gap-1 bg-white px-3 py-1 rounded-xl border border-slate-200 shadow-2xs">
                <span className="text-xl font-extrabold text-emerald-600">{value}</span>
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
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-600"
              />
              <div className="flex justify-between text-[10px] text-slate-400 font-mono">
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
                  className="w-8 h-8 rounded-lg bg-white border border-slate-200 hover:bg-slate-100 flex items-center justify-center text-slate-700 active:scale-95 transition-all"
                  title="Decrease"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => setValue((prev) => prev + 1)}
                  className="w-8 h-8 rounded-lg bg-white border border-slate-200 hover:bg-slate-100 flex items-center justify-center text-slate-700 active:scale-95 transition-all"
                  title="Increase"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Unit Input */}
              <div className="flex items-center gap-1.5 text-xs">
                <span className="text-slate-500 font-medium">Unit:</span>
                <input
                  type="text"
                  placeholder="leads"
                  value={unit}
                  onChange={(e) => setUnit(e.target.value)}
                  className="w-24 px-2.5 py-1 text-xs rounded-lg border border-slate-200 bg-white font-medium"
                />
              </div>
            </div>
          </div>

          {/* Result Highlights & Notes */}
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">
              Result Highlights / Details (Optional)
            </label>
            <textarea
              rows={2}
              placeholder="e.g. 2 serious prospects booked for live demo tomorrow morning"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          {/* Submit Footer */}
          <div className="flex items-center justify-end gap-3 pt-2 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-xs transition-all active:scale-95 flex items-center gap-1.5"
            >
              <Save className="w-3.5 h-3.5" />
              {initialItem ? "Update Result" : "Save Result"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
