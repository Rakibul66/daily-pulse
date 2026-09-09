"use client";

import React, { useState, useEffect } from "react";
import { EODReport, MorningGoal, DynamicItem, TargetCategory } from "@/types/report";
import {
  Save,
  Copy,
  Printer,
  Plus,
  Trash2,
  Edit3,
  TrendingUp,
  Headphones,
  Search,
  CheckCircle2,
  Calendar,
  Sparkles,
} from "lucide-react";
import { formatEODReportText, formatDateDisplay } from "@/lib/formatters";
import { saveEODReport } from "@/lib/storage";
import { useAuth } from "@/context/AuthContext";
import { ActualResultModal } from "./ActualResultModal";
import { DeleteConfirmModal } from "@/components/ui/DeleteConfirmModal";

interface EODReportFormProps {
  report: EODReport;
  morningGoal?: MorningGoal;
  onReportUpdated: (updated: EODReport) => void;
  onOpenCopyModal: (title: string, text: string) => void;
  onOpenPrintModal: () => void;
  showToast: (msg: string, type?: "success" | "error" | "info") => void;
}

export const EODReportForm: React.FC<EODReportFormProps> = ({
  report,
  morningGoal,
  onReportUpdated,
  onOpenCopyModal,
  onOpenPrintModal,
  showToast,
}) => {
  const [formData, setFormData] = useState<EODReport>(report);
  const [isSaving, setIsSaving] = useState(false);
  const [newActivity, setNewActivity] = useState("");
  const { user } = useAuth();

  // Modal State for Adding/Editing Actual Results
  const [resultModalState, setResultModalState] = useState<{
    isOpen: boolean;
    category: TargetCategory;
    editingItem: DynamicItem | null;
  }>({
    isOpen: false,
    category: "leadGen",
    editingItem: null,
  });

  // Modal State for Delete Confirmation
  const [deleteModalState, setDeleteModalState] = useState<{
    isOpen: boolean;
    itemId: string;
    itemLabel: string;
    category: TargetCategory;
  }>({
    isOpen: false,
    itemId: "",
    itemLabel: "",
    category: "leadGen",
  });

  useEffect(() => {
    setFormData(report);
  }, [report]);

  const updateSummaryWithFields = (updated: EODReport) => {
    return {
      ...updated,
      summary: {
        ...updated.summary,
        totalLeadsFound: updated.leadGeneration.leadsFound,
        totalContacted: updated.leadGeneration.prospectsContacted,
        followUps: updated.leadGeneration.leadsFollowedUp,
        positiveResponses: updated.leadGeneration.positiveResponses,
        newOnboardingProspects: updated.leadGeneration.seriousProspects,
        customerIssuesHandled: updated.customerSupport.callsHandled,
        competitorActivitiesFound: updated.competitorResearch.observedActivities.join(", "),
      },
    };
  };

  const persistReport = async (data: EODReport) => {
    setIsSaving(true);
    try {
      const syncWithSummary = updateSummaryWithFields(data);
      const updated = {
        ...syncWithSummary,
        updatedAt: new Date().toISOString(),
      };
      await saveEODReport(updated, user?.uid);
      setFormData(updated);
      onReportUpdated(updated);
      showToast("End-of-day report saved to database!", "success");
    } catch (e) {
      console.error(e);
      showToast("Failed to save EOD report", "error");
    } finally {
      setIsSaving(false);
    }
  };

  const handleSave = () => {
    persistReport(formData);
  };

  const handleCopyText = () => {
    const syncWithSummary = updateSummaryWithFields(formData);
    const text = formatEODReportText(syncWithSummary);
    onOpenCopyModal(`End-of-Day Report – ${formatDateDisplay(formData.date)}`, text);
  };

  // Open Modal to Add Result
  const openAddResultModal = (category: TargetCategory) => {
    setResultModalState({
      isOpen: true,
      category,
      editingItem: null,
    });
  };

  // Open Modal to Edit Result
  const openEditResultModal = (item: DynamicItem, category: TargetCategory) => {
    setResultModalState({
      isOpen: true,
      category,
      editingItem: item,
    });
  };

  // Save Result from Modal
  const handleSaveResultItem = (item: DynamicItem) => {
    const cat = item.category || resultModalState.category;
    let updatedFormData = { ...formData };

    const updateCategoryItems = (items: DynamicItem[]) => {
      const existsIndex = items.findIndex((i) => i.id === item.id);
      if (existsIndex >= 0) {
        const next = [...items];
        next[existsIndex] = item;
        return next;
      }
      return [...items, item];
    };

    if (cat === "leadGen") {
      updatedFormData = {
        ...updatedFormData,
        leadGeneration: {
          ...updatedFormData.leadGeneration,
          customItems: updateCategoryItems(updatedFormData.leadGeneration.customItems),
        },
      };
    } else if (cat === "support") {
      updatedFormData = {
        ...updatedFormData,
        customerSupport: {
          ...updatedFormData.customerSupport,
          customItems: updateCategoryItems(updatedFormData.customerSupport.customItems),
        },
      };
    } else if (cat === "competitor") {
      updatedFormData = {
        ...updatedFormData,
        competitorResearch: {
          ...updatedFormData.competitorResearch,
          customItems: updateCategoryItems(updatedFormData.competitorResearch.customItems),
        },
      };
    }

    persistReport(updatedFormData);
  };

  // Prompt Delete
  const promptDeleteItem = (id: string, label: string, category: TargetCategory) => {
    setDeleteModalState({
      isOpen: true,
      itemId: id,
      itemLabel: label,
      category,
    });
  };

  // Confirm Delete
  const handleConfirmDelete = () => {
    const { itemId, category } = deleteModalState;
    let updatedFormData = { ...formData };

    const filterItems = (items: DynamicItem[]) => items.filter((i) => i.id !== itemId);

    if (category === "leadGen") {
      updatedFormData = {
        ...updatedFormData,
        leadGeneration: {
          ...updatedFormData.leadGeneration,
          customItems: filterItems(updatedFormData.leadGeneration.customItems),
        },
      };
    } else if (category === "support") {
      updatedFormData = {
        ...updatedFormData,
        customerSupport: {
          ...updatedFormData.customerSupport,
          customItems: filterItems(updatedFormData.customerSupport.customItems),
        },
      };
    } else if (category === "competitor") {
      updatedFormData = {
        ...updatedFormData,
        competitorResearch: {
          ...updatedFormData.competitorResearch,
          customItems: filterItems(updatedFormData.competitorResearch.customItems),
        },
      };
    }

    persistReport(updatedFormData);
    setDeleteModalState((prev) => ({ ...prev, isOpen: false }));
    showToast("Result metric deleted!", "info");
  };

  // Add Observed Activity Tag
  const handleAddActivity = () => {
    if (!newActivity.trim()) return;
    const updated = {
      ...formData,
      competitorResearch: {
        ...formData.competitorResearch,
        observedActivities: [
          ...formData.competitorResearch.observedActivities,
          newActivity.trim(),
        ],
      },
    };
    persistReport(updated);
    setNewActivity("");
  };

  const handleRemoveActivity = (idx: number) => {
    const updatedActivities = [...formData.competitorResearch.observedActivities];
    updatedActivities.splice(idx, 1);
    const updated = {
      ...formData,
      competitorResearch: {
        ...formData.competitorResearch,
        observedActivities: updatedActivities,
      },
    };
    persistReport(updated);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner Action Bar */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-600"></span>
            <h2 className="text-lg font-bold text-slate-900">
              End-of-Day Work Update
            </h2>
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
              {formatDateDisplay(formData.date)}
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Log actual achievements vs morning goals using interactive sliders. Click any metric to edit or delete.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => openAddResultModal("leadGen")}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-xs transition-all active:scale-95"
          >
            <Plus className="w-3.5 h-3.5" />
            Add Result
          </button>
          <button
            onClick={handleCopyText}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors active:scale-95"
            title="Copy formatted text with emojis"
          >
            <Copy className="w-3.5 h-3.5 text-indigo-600" />
            Copy Text
          </button>
          <button
            onClick={onOpenPrintModal}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors active:scale-95"
            title="Export as PDF"
          >
            <Printer className="w-3.5 h-3.5 text-indigo-600" />
            Export PDF
          </button>
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-xs transition-all active:scale-95 disabled:opacity-50"
          >
            <Save className="w-3.5 h-3.5" />
            {isSaving ? "Saving..." : "Save EOD"}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Section 1: Lead Generation Actuals */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-5">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2.5">
              <span className="text-lg">🎯</span>
              <div>
                <h3 className="font-bold text-slate-900 text-sm">
                  1. Lead Generation (Actuals vs Target)
                </h3>
                <span className="text-[11px] text-slate-400">
                  Outreach, responses & conversions
                </span>
              </div>
            </div>
            <button
              onClick={() => openAddResultModal("leadGen")}
              className="text-xs text-emerald-600 hover:text-emerald-800 font-semibold flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-50 hover:bg-emerald-100 transition-colors"
            >
              <Plus className="w-3.5 h-3.5" /> Add Metric
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-medium text-slate-700">Leads Found</label>
                {morningGoal && (
                  <span className="text-[11px] text-indigo-600 font-medium">
                    Goal: {morningGoal.leadGeneration.targetLeadsToFind}
                  </span>
                )}
              </div>
              <input
                type="number"
                min="0"
                value={formData.leadGeneration.leadsFound}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    leadGeneration: {
                      ...formData.leadGeneration,
                      leadsFound: parseInt(e.target.value) || 0,
                    },
                  })
                }
                className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 font-bold text-slate-900"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-medium text-slate-700">Prospects Contacted</label>
                {morningGoal && (
                  <span className="text-[11px] text-indigo-600 font-medium">
                    Goal: {morningGoal.leadGeneration.targetProspectsToContact}
                  </span>
                )}
              </div>
              <input
                type="number"
                min="0"
                value={formData.leadGeneration.prospectsContacted}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    leadGeneration: {
                      ...formData.leadGeneration,
                      prospectsContacted: parseInt(e.target.value) || 0,
                    },
                  })
                }
                className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 font-bold text-slate-900"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-medium text-slate-700">Leads Followed Up</label>
                {morningGoal && (
                  <span className="text-[11px] text-indigo-600 font-medium">
                    Goal: {morningGoal.leadGeneration.targetFollowUps}
                  </span>
                )}
              </div>
              <input
                type="number"
                min="0"
                value={formData.leadGeneration.leadsFollowedUp}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    leadGeneration: {
                      ...formData.leadGeneration,
                      leadsFollowedUp: parseInt(e.target.value) || 0,
                    },
                  })
                }
                className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 font-bold text-slate-900"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-medium text-slate-700">Positive Responses</label>
                <span className="text-[11px] text-emerald-600 font-medium">Qualified</span>
              </div>
              <input
                type="number"
                min="0"
                value={formData.leadGeneration.positiveResponses}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    leadGeneration: {
                      ...formData.leadGeneration,
                      positiveResponses: parseInt(e.target.value) || 0,
                    },
                  })
                }
                className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 font-bold text-emerald-600"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-medium text-slate-700">Serious Prospects</label>
                <span className="text-[11px] text-indigo-600 font-medium">Hot Leads</span>
              </div>
              <input
                type="number"
                min="0"
                value={formData.leadGeneration.seriousProspects}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    leadGeneration: {
                      ...formData.leadGeneration,
                      seriousProspects: parseInt(e.target.value) || 0,
                    },
                  })
                }
                className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 font-bold text-indigo-600"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-medium text-slate-700">Onboarding Discussions</label>
                <span className="text-[11px] text-indigo-600 font-medium">Converted</span>
              </div>
              <input
                type="number"
                min="0"
                value={formData.leadGeneration.onboardingDiscussions}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    leadGeneration: {
                      ...formData.leadGeneration,
                      onboardingDiscussions: parseInt(e.target.value) || 0,
                    },
                  })
                }
                className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 font-bold text-indigo-700"
              />
            </div>
          </div>

          {/* Dynamic Added Results for Lead Gen */}
          {formData.leadGeneration.customItems.length > 0 && (
            <div className="pt-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-2">
                Additional Logged Metrics ({formData.leadGeneration.customItems.length})
              </span>
              <div className="grid sm:grid-cols-2 gap-2.5">
                {formData.leadGeneration.customItems.map((item) => (
                <div
                  key={item.id}
                  className="p-3 rounded-2xl bg-emerald-50/40 border border-emerald-100 flex items-center justify-between gap-3 hover:border-emerald-300 transition-colors"
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-800">{item.label}</span>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-100 text-emerald-700">
                        {item.value} {item.unit || "leads"}
                      </span>
                    </div>
                    {item.notes && (
                      <p className="text-[11px] text-slate-500 truncate mt-0.5">
                        {item.notes}
                      </p>
                    )}
                  </div>

                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      type="button"
                      onClick={() => openEditResultModal(item, "leadGen")}
                      className="p-1.5 text-slate-400 hover:text-emerald-600 hover:bg-white rounded-lg transition-colors"
                      title="Edit Metric"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => promptDeleteItem(item.id, item.label, "leadGen")}
                      className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-white rounded-lg transition-colors"
                      title="Delete Metric"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
              </div>
            </div>
          )}
        </div>

        {/* Section 2: Customer Support Actuals */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-5">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2.5">
              <span className="text-lg">📞</span>
              <div>
                <h3 className="font-bold text-slate-900 text-sm">
                  2. Customer Support Metrics
                </h3>
                <span className="text-[11px] text-slate-400">
                  Tickets handled, resolved & follow-ups
                </span>
              </div>
            </div>
            <button
              onClick={() => openAddResultModal("support")}
              className="text-xs text-indigo-600 hover:text-indigo-800 font-semibold flex items-center gap-1 px-2.5 py-1 rounded-lg bg-indigo-50 hover:bg-indigo-100 transition-colors"
            >
              <Plus className="w-3.5 h-3.5" /> Add Metric
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Calls Handled
              </label>
              <input
                type="number"
                min="0"
                value={formData.customerSupport.callsHandled}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    customerSupport: {
                      ...formData.customerSupport,
                      callsHandled: parseInt(e.target.value) || 0,
                    },
                  })
                }
                className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 font-bold text-slate-900"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Issues Resolved
              </label>
              <input
                type="number"
                min="0"
                value={formData.customerSupport.issuesResolved}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    customerSupport: {
                      ...formData.customerSupport,
                      issuesResolved: parseInt(e.target.value) || 0,
                    },
                  })
                }
                className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 font-bold text-emerald-600"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Pending Issues
              </label>
              <input
                type="number"
                min="0"
                value={formData.customerSupport.pendingIssues}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    customerSupport: {
                      ...formData.customerSupport,
                      pendingIssues: parseInt(e.target.value) || 0,
                    },
                  })
                }
                className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 focus:ring-2 focus:ring-amber-500 font-bold text-amber-600"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Follow-ups Required
              </label>
              <input
                type="number"
                min="0"
                value={formData.customerSupport.followUpsRequired}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    customerSupport: {
                      ...formData.customerSupport,
                      followUpsRequired: parseInt(e.target.value) || 0,
                    },
                  })
                }
                className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 font-bold text-indigo-600"
              />
            </div>
          </div>

          {/* Dynamic Added Results for Support */}
          {formData.customerSupport.customItems.length > 0 && (
            <div className="pt-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-2">
                Additional Support Metrics ({formData.customerSupport.customItems.length})
              </span>
              <div className="grid sm:grid-cols-2 gap-2.5">
                {formData.customerSupport.customItems.map((item) => (
                  <div
                    key={item.id}
                    className="p-3 rounded-2xl bg-indigo-50/40 border border-indigo-100 flex items-center justify-between gap-3 hover:border-indigo-300 transition-colors"
                  >
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-slate-800">{item.label}</span>
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-indigo-100 text-indigo-700">
                          {item.value} {item.unit || "tickets"}
                        </span>
                      </div>
                      {item.notes && (
                        <p className="text-[11px] text-slate-500 truncate mt-0.5">
                          {item.notes}
                        </p>
                      )}
                    </div>

                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        type="button"
                        onClick={() => openEditResultModal(item, "support")}
                        className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-white rounded-lg transition-colors"
                        title="Edit Metric"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => promptDeleteItem(item.id, item.label, "support")}
                        className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-white rounded-lg transition-colors"
                        title="Delete Metric"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Section 3: Competitor Research Findings */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-5">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2.5">
              <span className="text-lg">📊</span>
              <div>
                <h3 className="font-bold text-slate-900 text-sm">
                  3. Competitor Research Findings
                </h3>
                <span className="text-[11px] text-slate-400">
                  Observed campaigns & organic test ideas
                </span>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Competitors / Profiles Checked
              </label>
              <input
                type="number"
                min="0"
                value={formData.competitorResearch.competitorsChecked}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    competitorResearch: {
                      ...formData.competitorResearch,
                      competitorsChecked: parseInt(e.target.value) || 0,
                    },
                  })
                }
                className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 font-bold"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1.5">
                Observed Marketing & Social Media Activities
              </label>
              <div className="space-y-1.5 mb-2.5">
                {formData.competitorResearch.observedActivities.map((act, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800"
                  >
                    <span>• {act}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveActivity(idx)}
                      className="text-slate-400 hover:text-rose-600 ml-2"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="e.g. Regular Facebook educational/promotional posts..."
                  value={newActivity}
                  onChange={(e) => setNewActivity(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleAddActivity();
                    }
                  }}
                  className="flex-1 px-3 py-1.5 text-xs rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500"
                />
                <button
                  type="button"
                  onClick={handleAddActivity}
                  className="px-3 py-1.5 text-xs bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-xl font-semibold transition-colors"
                >
                  Add Finding
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Potential Organic Strategy We Can Test
              </label>
              <textarea
                rows={2}
                placeholder="e.g. Customer case studies + educational content + short videos targeting e-commerce sellers."
                value={formData.competitorResearch.potentialOrganicStrategy}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    competitorResearch: {
                      ...formData.competitorResearch,
                      potentialOrganicStrategy: e.target.value,
                    },
                  })
                }
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>
        </div>

        {/* Section 4: Tomorrow's Focus & Summary */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-5">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2.5">
              <span className="text-lg">📋</span>
              <div>
                <h3 className="font-bold text-slate-900 text-sm">
                  4. Tomorrow&apos;s Focus & Priority
                </h3>
                <span className="text-[11px] text-emerald-600 font-semibold">
                  Executive Daily Closeout
                </span>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-indigo-700 mb-1 uppercase tracking-wider">
                Tomorrow&apos;s Top Priority <span className="text-rose-500">*</span>
              </label>
              <textarea
                rows={3}
                placeholder="What is the #1 focus tomorrow? e.g. Close the 2 serious prospects, initiate video case study test"
                value={formData.summary.tomorrowsPriority}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    summary: {
                      ...formData.summary,
                      tomorrowsPriority: e.target.value,
                    },
                  })
                }
                className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-indigo-200 bg-indigo-50/20 focus:ring-2 focus:ring-indigo-500 font-medium text-slate-800"
              />
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
              <span className="text-xs font-semibold text-slate-700 block">
                Calculated Summary Overview:
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs text-slate-600">
                <div>• Total leads found: <strong>{formData.leadGeneration.leadsFound}</strong></div>
                <div>• Contacted: <strong>{formData.leadGeneration.prospectsContacted}</strong></div>
                <div>• Follow-ups: <strong>{formData.leadGeneration.leadsFollowedUp}</strong></div>
                <div>• Positive responses: <strong>{formData.leadGeneration.positiveResponses}</strong></div>
                <div>• Onboardings: <strong>{formData.leadGeneration.onboardingDiscussions}</strong></div>
                <div>• Support handled: <strong>{formData.customerSupport.callsHandled}</strong></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Actual Result Modal with Slider & Stepper */}
      <ActualResultModal
        isOpen={resultModalState.isOpen}
        initialCategory={resultModalState.category}
        initialItem={resultModalState.editingItem}
        onClose={() => setResultModalState((prev) => ({ ...prev, isOpen: false }))}
        onSave={handleSaveResultItem}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={deleteModalState.isOpen}
        title="Delete Logged Result"
        itemName={deleteModalState.itemLabel}
        onCancel={() => setDeleteModalState((prev) => ({ ...prev, isOpen: false }))}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
};
