"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  MorningGoal,
  EODReport,
  DynamicItem,
  TargetCategory,
  CompetitorFindingItem,
} from "@/types/report";
import {
  Save,
  Plus,
  Trash2,
  Edit3,
  Target,
  Headphones,
  Search,
  CheckCircle2,
  Check,
  TrendingUp,
  Loader2,
  Cloud,
  List,
  Copy,
  FileText,
  LayoutTemplate,
} from "lucide-react";
import {
  formatDateDisplay,
  formatBossComparisonReportText,
  calculateDailyWorkProgress,
  WORKED_THRESHOLD_PCT,
} from "@/lib/formatters";
import { saveGoalAndReport, getLocalRecords } from "@/lib/storage";
import { createDefaultMorningGoal, createDefaultEODReport } from "@/lib/defaultData";
import { useAuth } from "@/context/AuthContext";
import { HorizontalCalendar } from "@/components/calendar/HorizontalCalendar";
import { DailyRecord } from "@/types/report";
import { TargetModal } from "./TargetModal";
import { DeleteConfirmModal } from "@/components/ui/DeleteConfirmModal";
import { ReadyBossReportView } from "./ReadyBossReportView";

interface MorningGoalFormProps {
  goal: MorningGoal;
  report?: EODReport;
  selectedDate?: string;
  onSelectDate?: (date: string) => void;
  onGoalUpdated?: (updated: MorningGoal) => void;
  onReportUpdated?: (updated: EODReport) => void;
  onOpenCopyModal?: (title: string, text: string) => void;
  showToast: (msg: string, type?: "success" | "error" | "info") => void;
}

export const MorningGoalForm: React.FC<MorningGoalFormProps> = ({
  goal,
  report,
  selectedDate,
  onSelectDate,
  onGoalUpdated,
  onReportUpdated,
  onOpenCopyModal,
  showToast,
}) => {
  const [goalData, setGoalData] = useState<MorningGoal>(goal);
  const [reportData, setReportData] = useState<EODReport>(
    report || createDefaultEODReport(goal.date, goal)
  );
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "saved">("saved");
  const { user } = useAuth();

  const lastSavedSnapshotRef = useRef<string>("");
  const isInitialLoadRef = useRef<boolean>(true);
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Main Page Tab State ('template' for input form, 'bossReport' for ready boss report)
  const [mainTab, setMainTab] = useState<"template" | "bossReport">("template");
  const [copiedBossReport, setCopiedBossReport] = useState(false);

  // Competitor Tab State ('list' for added items, 'add' for add field)
  const [competitorTab, setCompetitorTab] = useState<"list" | "add">("list");
  const [newCompTopic, setNewCompTopic] = useState("");
  const [newCompContent, setNewCompContent] = useState("");
  const [newCompChecked, setNewCompChecked] = useState<boolean>(true);
  const [newCompNeed, setNewCompNeed] = useState("");

  // Modal State for Adding/Editing Targets
  const [targetModalState, setTargetModalState] = useState<{
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

  const [allRecords, setAllRecords] = useState<Record<string, DailyRecord>>({});

  useEffect(() => {
    setGoalData(goal);
    const r = report || createDefaultEODReport(goal.date, goal);
    setReportData(r);
    lastSavedSnapshotRef.current = JSON.stringify({ goal, report: r });
    setSaveStatus("saved");
    isInitialLoadRef.current = false;
  }, [goal.date]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setAllRecords(getLocalRecords(user?.uid));
    }
  }, [user?.uid, goal.date]);

  // Real-time calculation of current day progress (evaluates on every keystroke)
  const activeDate = selectedDate || goalData.date;
  const dayProgress = React.useMemo(
    () => calculateDailyWorkProgress(goalData, reportData),
    [goalData, reportData]
  );

  // Debounced auto-save on any change to goalData or reportData
  useEffect(() => {
    if (isInitialLoadRef.current) return;

    const currentSnapshot = JSON.stringify({ goal: goalData, report: reportData });
    if (currentSnapshot === lastSavedSnapshotRef.current) {
      return;
    }

    setSaveStatus("saving");

    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    debounceTimerRef.current = setTimeout(async () => {
      try {
        const g = { ...goalData, updatedAt: new Date().toISOString() };
        const r = { ...reportData, updatedAt: new Date().toISOString() };
        await saveGoalAndReport(g, r, user?.uid);
        lastSavedSnapshotRef.current = JSON.stringify({ goal: g, report: r });
        setAllRecords((prev) => ({
          ...prev,
          [g.date]: {
            id: g.date,
            date: g.date,
            morningGoal: g,
            eodReport: r,
            hasMorningGoal: true,
            hasEODReport: true,
            updatedAt: new Date().toISOString(),
          },
        }));
        if (onGoalUpdated) onGoalUpdated(g);
        if (onReportUpdated) onReportUpdated(r);
        setSaveStatus("saved");
      } catch (e) {
        console.error("Auto-save failed", e);
        setSaveStatus("idle");
      }
    }, 600);

    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, [goalData, reportData, user?.uid, onGoalUpdated, onReportUpdated]);

  // Persist both Goal & Report immediately (e.g. from modals or explicit action)
  const persistBoth = async (
    updatedGoal: MorningGoal,
    updatedReport: EODReport,
    successMsg?: string
  ) => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
      debounceTimerRef.current = null;
    }
    setSaveStatus("saving");
    try {
      const g = { ...updatedGoal, updatedAt: new Date().toISOString() };
      const r = { ...updatedReport, updatedAt: new Date().toISOString() };
      await saveGoalAndReport(g, r, user?.uid);
      lastSavedSnapshotRef.current = JSON.stringify({ goal: g, report: r });
      setAllRecords((prev) => ({
        ...prev,
        [g.date]: {
          id: g.date,
          date: g.date,
          morningGoal: g,
          eodReport: r,
          hasMorningGoal: true,
          hasEODReport: true,
          updatedAt: new Date().toISOString(),
        },
      }));
      setGoalData(g);
      setReportData(r);
      if (onGoalUpdated) onGoalUpdated(g);
      if (onReportUpdated) onReportUpdated(r);
      setSaveStatus("saved");
      if (successMsg) {
        showToast(successMsg, "success");
      }
    } catch (e) {
      console.error(e);
      setSaveStatus("idle");
      showToast("Failed to save data", "error");
    }
  };

  // Helper for percentage badge
  const calculatePct = (actual: number, target: number): { pct: number; label: string; color: string } => {
    if (!target || target <= 0) {
      return { pct: 100, label: "N/A", color: "bg-slate-800 text-slate-400 border-slate-700" };
    }
    const pct = Math.round((actual / target) * 100);
    if (pct >= 100) {
      return { pct: Math.min(pct, 100), label: `${pct}%`, color: "bg-emerald-950/90 text-emerald-300 border-emerald-800/80" };
    }
    if (pct >= 50) {
      return { pct, label: `${pct}%`, color: "bg-indigo-950/90 text-indigo-300 border-indigo-800/80" };
    }
    return { pct, label: `${pct}%`, color: "bg-amber-950/90 text-amber-300 border-amber-800/80" };
  };

  // Overall Lead Gen calculation
  const overallLeadGenPct = React.useMemo(() => {
    const metrics = [
      { act: reportData.leadGeneration.leadsFollowedUp, target: goalData.leadGeneration.targetFollowUps || 50 },
      { act: reportData.leadGeneration.positiveResponses, target: goalData.leadGeneration.targetPositiveResponses || 20 },
      { act: reportData.leadGeneration.seriousProspects, target: goalData.leadGeneration.targetSeriousProspects || 20 },
      { act: reportData.leadGeneration.onboardingDiscussions, target: goalData.leadGeneration.targetOnboardingDiscussions || 15 },
    ];
    const sumPct = metrics.reduce((acc, m) => acc + (m.target > 0 ? (m.act / m.target) * 100 : 0), 0);
    return Math.round(sumPct / metrics.length);
  }, [goalData, reportData]);

  // Copy Boss Report to Clipboard
  const handleCopyBossReport = async () => {
    const text = formatBossComparisonReportText(goalData, reportData);
    try {
      await navigator.clipboard.writeText(text);
      setCopiedBossReport(true);
      showToast("Boss report copied to clipboard!", "success");
      setTimeout(() => setCopiedBossReport(false), 2500);
    } catch {
      if (onOpenCopyModal) {
        onOpenCopyModal(`Daily Report to Boss – ${formatDateDisplay(activeDate)}`, text);
      }
    }
  };

  // Add Competitor Finding Item
  const handleAddCompetitorFinding = () => {
    const topic = newCompTopic.trim();
    const content = newCompContent.trim();
    if (!topic && !content) {
      showToast("Please enter topic or content for the observation", "error");
      return;
    }

    const newItem: CompetitorFindingItem = {
      id: `comp-${Date.now()}`,
      checked: newCompChecked,
      topic: topic,
      content: content,
      observedActivity: topic,
      myAction: content,
      nextNeed: newCompNeed.trim(),
    };

    const currentFindings = reportData.competitorResearch.findings || [];
    const updatedFindings = [...currentFindings, newItem];

    const updatedReport = {
      ...reportData,
      competitorResearch: {
        ...reportData.competitorResearch,
        findings: updatedFindings,
        observedActivities: updatedFindings.map((f) => 
          f.topic ? `topic:${f.topic}` : `${f.observedActivity}`
        ),
      },
    };

    persistBoth(goalData, updatedReport, `Added "${newItem.topic}" observation & action!`);
    setNewCompTopic("");
    setNewCompContent("");
    setNewCompNeed("");
    setNewCompChecked(true);
    setCompetitorTab("list");
  };

  // Toggle Competitor Finding Checked Value
  const handleToggleCompetitorFinding = (id: string) => {
    const currentFindings = reportData.competitorResearch.findings || [];
    const updatedFindings = currentFindings.map((f) =>
      f.id === id ? { ...f, checked: f.checked === false ? true : false } : f
    );

    const updatedReport = {
      ...reportData,
      competitorResearch: {
        ...reportData.competitorResearch,
        findings: updatedFindings,
      },
    };

    persistBoth(goalData, updatedReport, "Updated check mark status");
  };

  // Remove Competitor Finding Item
  const handleRemoveCompetitorFinding = (id: string) => {
    const currentFindings = reportData.competitorResearch.findings || [];
    const updatedFindings = currentFindings.filter((f) => f.id !== id);

    const updatedReport = {
      ...reportData,
      competitorResearch: {
        ...reportData.competitorResearch,
        findings: updatedFindings,
        observedActivities: updatedFindings.map((f) => 
          f.topic ? `${f.competitorName ? `${f.competitorName} – ` : ""}topic:${f.topic}` : `${f.competitorName} do ${f.observedActivity}`
        ),
      },
    };

    persistBoth(goalData, updatedReport, "Removed competitor observation.");
  };

  // Target Modal Handlers
  const openAddTargetModal = (category: TargetCategory) => {
    setTargetModalState({
      isOpen: true,
      category,
      editingItem: null,
    });
  };

  const openEditTargetModal = (item: DynamicItem, category: TargetCategory) => {
    setTargetModalState({
      isOpen: true,
      category,
      editingItem: item,
    });
  };

  const handleSaveTargetItem = (item: DynamicItem) => {
    const cat = item.category || targetModalState.category;
    let updatedGoal = { ...goalData };

    const updateCategoryItems = (items: DynamicItem[]) => {
      const idx = items.findIndex((i) => i.id === item.id);
      if (idx >= 0) {
        const next = [...items];
        next[idx] = item;
        return next;
      }
      return [...items, item];
    };

    if (cat === "leadGen") {
      updatedGoal = {
        ...updatedGoal,
        leadGeneration: {
          ...updatedGoal.leadGeneration,
          customItems: updateCategoryItems(updatedGoal.leadGeneration.customItems),
        },
      };
    } else if (cat === "support") {
      updatedGoal = {
        ...updatedGoal,
        customerSupport: {
          ...updatedGoal.customerSupport,
          customItems: updateCategoryItems(updatedGoal.customerSupport.customItems),
        },
      };
    } else if (cat === "competitor") {
      updatedGoal = {
        ...updatedGoal,
        competitorResearch: {
          ...updatedGoal.competitorResearch,
          customItems: updateCategoryItems(updatedGoal.competitorResearch.customItems),
        },
      };
    }

    persistBoth(updatedGoal, reportData, `Saved target "${item.label}"!`);
  };

  const promptDeleteItem = (id: string, label: string, category: TargetCategory) => {
    setDeleteModalState({
      isOpen: true,
      itemId: id,
      itemLabel: label,
      category,
    });
  };

  const handleConfirmDelete = () => {
    const { itemId, category } = deleteModalState;
    let updatedGoal = { ...goalData };

    if (category === "leadGen") {
      updatedGoal = {
        ...updatedGoal,
        leadGeneration: {
          ...updatedGoal.leadGeneration,
          customItems: updatedGoal.leadGeneration.customItems.filter((i) => i.id !== itemId),
        },
      };
    } else if (category === "support") {
      updatedGoal = {
        ...updatedGoal,
        customerSupport: {
          ...updatedGoal.customerSupport,
          customItems: updatedGoal.customerSupport.customItems.filter((i) => i.id !== itemId),
        },
      };
    } else if (category === "competitor") {
      updatedGoal = {
        ...updatedGoal,
        competitorResearch: {
          ...updatedGoal.competitorResearch,
          customItems: updatedGoal.competitorResearch.customItems.filter((i) => i.id !== itemId),
        },
      };
    }

    persistBoth(updatedGoal, reportData, "Target deleted successfully!");
    setDeleteModalState((prev) => ({ ...prev, isOpen: false }));
  };

  return (
    <div className="space-y-6 w-full">
      {/* Top Banner */}
      <div className="bg-slate-900 p-4 sm:p-5 rounded-3xl border border-slate-800 shadow-xl flex flex-wrap items-center justify-between gap-4 text-white">
        <div>
          <div className="flex flex-wrap items-center gap-2.5">
            <span className="w-2.5 h-2.5 rounded-full bg-indigo-500"></span>
            <h2 className="text-lg font-bold text-white">
              Daily Goals &amp; Report
            </h2>
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-indigo-950 text-indigo-300 border border-indigo-800/80">
              {formatDateDisplay(activeDate)}
            </span>

            {/* Auto-save status indicator */}
            {saveStatus === "saving" && (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-950/80 text-amber-300 border border-amber-800/80">
                <Loader2 className="w-3 h-3 animate-spin text-amber-400" />
                <span>Saving changes...</span>
              </span>
            )}
            {saveStatus === "saved" && (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-950/80 text-emerald-300 border border-emerald-800/80 transition-all duration-300">
                <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                <span>Auto-saved</span>
              </span>
            )}
            {saveStatus === "idle" && (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-800 text-slate-400 border border-slate-700">
                <Cloud className="w-3 h-3 text-slate-400" />
                <span>Ready</span>
              </span>
            )}
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Goal on the left, Result on the right. All edits save automatically.
          </p>
        </div>

        {/* Two Tabs: Template & 📋 Ready Daily Report for Boss */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-950 border border-slate-800 rounded-2xl self-start md:self-auto">
          <button
            type="button"
            onClick={() => setMainTab("template")}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
              mainTab === "template"
                ? "bg-indigo-600 text-white shadow-md shadow-indigo-950"
                : "text-slate-400 hover:text-white hover:bg-slate-900"
            }`}
          >
            <LayoutTemplate className="w-3.5 h-3.5" />
            <span>Template</span>
          </button>

          <button
            type="button"
            onClick={() => setMainTab("bossReport")}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
              mainTab === "bossReport"
                ? "bg-emerald-600 text-white shadow-md shadow-emerald-950"
                : "text-slate-400 hover:text-white hover:bg-slate-900"
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>📋 Ready Daily Report for Boss</span>
          </button>
        </div>
      </div>

      {/* Horizontal 15-Day Calendar (Previous 7 Days, Today, Next 7 Days) */}
      <HorizontalCalendar
        selectedDate={activeDate}
        currentDateProgress={dayProgress}
        allRecords={allRecords}
        onSelectDate={async (dateStr) => {
          if (debounceTimerRef.current) {
            clearTimeout(debounceTimerRef.current);
            debounceTimerRef.current = null;
            try {
              const g = { ...goalData, updatedAt: new Date().toISOString() };
              const r = { ...reportData, updatedAt: new Date().toISOString() };
              await saveGoalAndReport(g, r, user?.uid);
              if (onGoalUpdated) onGoalUpdated(g);
              if (onReportUpdated) onReportUpdated(r);
            } catch (e) {
              console.error("Flush save failed", e);
            }
          }
          if (onSelectDate) onSelectDate(dateStr);
        }}
      />

      {/* Dynamic Work Progress Status Banner */}
      {dayProgress.isWorked ? (
        <div className="bg-emerald-950/40 border border-emerald-500/60 rounded-2xl p-4 sm:p-5 flex flex-wrap items-center justify-between gap-4 text-emerald-200 shadow-lg shadow-emerald-950/20">
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center font-black text-lg shadow-xs shadow-emerald-500/30">
              ✓
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-sm sm:text-base text-white">
                  Day Marked as Worked ({dayProgress.percentage}%)
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-emerald-500 text-slate-950">
                  ≥ 50% QUALIFIED
                </span>
              </div>
              <p className="text-xs text-emerald-300/80 mt-0.5">
                Work achievement reached 50%+! This date is highlighted green on the calendar and unlocked for the Boss Report.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setMainTab("bossReport")}
            className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all shadow-md shadow-emerald-950 flex items-center gap-1.5 cursor-pointer"
          >
            <FileText className="w-3.5 h-3.5" /> View Boss Report
          </button>
        </div>
      ) : (
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 sm:p-5 flex flex-wrap items-center justify-between gap-4 text-slate-300 shadow-md">
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-amber-950/70 text-amber-400 border border-amber-700/60 flex items-center justify-center font-extrabold text-xs">
              {dayProgress.percentage}%
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-sm sm:text-base text-white">
                  Daily Work In Progress
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-950 text-amber-300 border border-amber-800/80">
                  {WORKED_THRESHOLD_PCT - dayProgress.percentage}% more needed for 50%
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Touch or update your actual results below to reach 50%. Once reached, this day turns green on the calendar and appears on reports.
              </p>
            </div>
          </div>
          <div className="w-full sm:w-48 space-y-1">
            <div className="flex justify-between text-[11px] font-semibold text-slate-400">
              <span>{dayProgress.percentage}% logged</span>
              <span className="text-amber-400 font-bold">50% required</span>
            </div>
            <div className="w-full h-2.5 bg-slate-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-amber-500 rounded-full transition-all duration-300"
                style={{ width: `${Math.min(100, (dayProgress.percentage / WORKED_THRESHOLD_PCT) * 100)}%` }}
              />
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 1: TEMPLATE CARDS LIST */}
      {/* ========================================================================= */}
      {mainTab === "template" && (
        <div className="space-y-6 w-full">
        {/* ======================================================================= */}
        {/* CARD 1: LEAD GENERATION (GOAL ON LEFT, RESULT ON RIGHT) */}
        {/* ======================================================================= */}
        <div className="bg-slate-900 rounded-3xl border border-slate-800 p-6 sm:p-7 shadow-xl space-y-6 text-white">
          {/* Card Header */}
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-indigo-950/80 text-indigo-400 border border-indigo-800/80 flex items-center justify-center">
                <Target className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-white text-base">
                    🎯 Lead Generation
                  </h3>
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-extrabold bg-indigo-950 text-indigo-300 border border-indigo-800/80">
                    {overallLeadGenPct}% Achieved
                  </span>
                </div>
                <p className="text-xs text-slate-400">
                  Daily prospecting sprint, follow-ups, and qualified conversations
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => openAddTargetModal("leadGen")}
              className="px-3 py-1.5 text-xs text-indigo-300 hover:text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-xl font-semibold flex items-center gap-1 transition-colors"
            >
              <Plus className="w-3.5 h-3.5" /> Add Metric
            </button>
          </div>

          {/* Side-by-Side Comparison Container */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* LEFT SIDE: GOAL (MORNING TARGET) */}
            <div className="space-y-4 p-5 rounded-2xl bg-slate-950/80 border border-slate-800/80">
              <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                <span className="text-xs font-bold uppercase tracking-wider text-indigo-400 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-indigo-500"></span>
                  Morning Goal (Target)
                </span>
                <span className="text-[11px] text-slate-400">Planned Targets</span>
              </div>

              {/* 1. Leads Available */}
              <div>
                <label className="text-xs font-semibold text-slate-200 block mb-1">
                  1. Leads Available
                </label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    min="0"
                    value={goalData.leadGeneration.targetLeadsToFind}
                    onChange={(e) =>
                      setGoalData({
                        ...goalData,
                        leadGeneration: {
                          ...goalData.leadGeneration,
                          targetLeadsToFind: parseInt(e.target.value) || 0,
                        },
                      })
                    }
                    className="w-28 text-sm font-bold text-white bg-slate-900 px-3 py-1.5 rounded-xl border border-slate-700 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                  />
                  <input
                    type="text"
                    placeholder="e.g. (bponi store sheets)"
                    value={goalData.leadGeneration.notes || ""}
                    onChange={(e) =>
                      setGoalData({
                        ...goalData,
                        leadGeneration: {
                          ...goalData.leadGeneration,
                          notes: e.target.value,
                        },
                      })
                    }
                    className="flex-1 text-xs text-slate-200 placeholder-slate-500 bg-slate-900 px-3 py-1.5 rounded-xl border border-slate-700 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                  />
                </div>
              </div>

              {/* 2. New Prospects Contacted */}
              <div>
                <label className="text-xs font-semibold text-slate-200 block mb-1">
                  2. New Prospects Contacted
                </label>
                <input
                  type="number"
                  min="0"
                  value={goalData.leadGeneration.targetProspectsToContact}
                  onChange={(e) =>
                    setGoalData({
                      ...goalData,
                      leadGeneration: {
                        ...goalData.leadGeneration,
                        targetProspectsToContact: parseInt(e.target.value) || 0,
                      },
                    })
                  }
                  className="w-full text-sm font-bold text-white bg-slate-900 px-3 py-1.5 rounded-xl border border-slate-700 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              {/* 3. Previous Leads Followed Up */}
              <div>
                <label className="text-xs font-semibold text-slate-200 block mb-1">
                  3. Previous Leads Followed Up (Target: 50)
                </label>
                <input
                  type="number"
                  min="0"
                  value={goalData.leadGeneration.targetFollowUps}
                  onChange={(e) =>
                    setGoalData({
                      ...goalData,
                      leadGeneration: {
                        ...goalData.leadGeneration,
                        targetFollowUps: parseInt(e.target.value) || 0,
                      },
                    })
                  }
                  className="w-full text-sm font-bold text-white bg-slate-900 px-3 py-1.5 rounded-xl border border-slate-700 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              {/* 4. Positive Responses */}
              <div>
                <label className="text-xs font-semibold text-slate-200 block mb-1">
                  4. Positive Responses (Target: 20)
                </label>
                <input
                  type="number"
                  min="0"
                  value={goalData.leadGeneration.targetPositiveResponses || 20}
                  onChange={(e) =>
                    setGoalData({
                      ...goalData,
                      leadGeneration: {
                        ...goalData.leadGeneration,
                        targetPositiveResponses: parseInt(e.target.value) || 0,
                      },
                    })
                  }
                  className="w-full text-sm font-bold text-white bg-slate-900 px-3 py-1.5 rounded-xl border border-slate-700 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              {/* 5. Serious/Interested Prospects */}
              <div>
                <label className="text-xs font-semibold text-slate-200 block mb-1">
                  5. Serious / Interested Prospects (Target: 20)
                </label>
                <input
                  type="number"
                  min="0"
                  value={goalData.leadGeneration.targetSeriousProspects || 20}
                  onChange={(e) =>
                    setGoalData({
                      ...goalData,
                      leadGeneration: {
                        ...goalData.leadGeneration,
                        targetSeriousProspects: parseInt(e.target.value) || 0,
                      },
                    })
                  }
                  className="w-full text-sm font-bold text-white bg-slate-900 px-3 py-1.5 rounded-xl border border-slate-700 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              {/* 6. Onboarding Discussions */}
              <div>
                <label className="text-xs font-semibold text-slate-200 block mb-1">
                  6. Onboarding Discussions (Target: 15)
                </label>
                <input
                  type="number"
                  min="0"
                  value={goalData.leadGeneration.targetOnboardingDiscussions || 15}
                  onChange={(e) =>
                    setGoalData({
                      ...goalData,
                      leadGeneration: {
                        ...goalData.leadGeneration,
                        targetOnboardingDiscussions: parseInt(e.target.value) || 0,
                      },
                    })
                  }
                  className="w-full text-sm font-bold text-white bg-slate-900 px-3 py-1.5 rounded-xl border border-slate-700 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                />
              </div>
            </div>

            {/* RIGHT SIDE: REPORT / ACTUAL WITH LIVE COMPARISON */}
            <div className="space-y-4 p-5 rounded-2xl bg-slate-950/80 border border-slate-800/80">
              <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                  Report (Actual Result)
                </span>
                <span className="text-[11px] text-slate-400">Goal Achieved %</span>
              </div>

              {/* 1. Leads Available */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-semibold text-slate-200">
                    1. Leads Available
                  </label>
                  <span className="text-[11px] font-bold text-slate-400">
                    Goal: {goalData.leadGeneration.targetLeadsToFind}
                  </span>
                </div>
                <input
                  type="number"
                  min="0"
                  value={reportData.leadGeneration.leadsFound}
                  onChange={(e) =>
                    setReportData({
                      ...reportData,
                      leadGeneration: {
                        ...reportData.leadGeneration,
                        leadsFound: parseInt(e.target.value) || 0,
                      },
                    })
                  }
                  className="w-full text-sm font-bold text-white bg-slate-900 px-3 py-1.5 rounded-xl border border-slate-700 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              {/* 2. New Prospects Contacted */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-semibold text-slate-200">
                    2. Prospects Contacted
                  </label>
                  <span className="text-[11px] font-bold text-slate-400">
                    Goal: {goalData.leadGeneration.targetProspectsToContact}
                  </span>
                </div>
                <div className="flex gap-2">
                  <input
                    type="number"
                    min="0"
                    value={reportData.leadGeneration.prospectsContacted}
                    onChange={(e) =>
                      setReportData({
                        ...reportData,
                        leadGeneration: {
                          ...reportData.leadGeneration,
                          prospectsContacted: parseInt(e.target.value) || 0,
                        },
                      })
                    }
                    className="w-28 text-sm font-bold text-white bg-slate-900 px-3 py-1.5 rounded-xl border border-slate-700 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                  />
                  <input
                    type="text"
                    placeholder="e.g. (no ads running, no organic client yet)"
                    value={reportData.leadGeneration.notes || ""}
                    onChange={(e) =>
                      setReportData({
                        ...reportData,
                        leadGeneration: {
                          ...reportData.leadGeneration,
                          notes: e.target.value,
                        },
                      })
                    }
                    className="flex-1 text-xs text-slate-200 placeholder-slate-500 bg-slate-900 px-3 py-1.5 rounded-xl border border-slate-700 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                  />
                </div>
              </div>

              {/* 3. Previous Leads Followed Up */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-semibold text-slate-200">
                    3. Previous Leads Followed Up
                  </label>
                  {(() => {
                    const res = calculatePct(
                      reportData.leadGeneration.leadsFollowedUp,
                      goalData.leadGeneration.targetFollowUps || 50
                    );
                    return (
                      <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full border ${res.color}`}>
                        {reportData.leadGeneration.leadsFollowedUp} / {goalData.leadGeneration.targetFollowUps || 50} ({res.label})
                      </span>
                    );
                  })()}
                </div>
                <input
                  type="number"
                  min="0"
                  value={reportData.leadGeneration.leadsFollowedUp}
                  onChange={(e) =>
                    setReportData({
                      ...reportData,
                      leadGeneration: {
                        ...reportData.leadGeneration,
                        leadsFollowedUp: parseInt(e.target.value) || 0,
                      },
                    })
                  }
                  className="w-full text-sm font-bold text-white bg-slate-900 px-3 py-1.5 rounded-xl border border-slate-700 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              {/* 4. Positive Responses */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-semibold text-slate-200">
                    4. Positive Responses
                  </label>
                  {(() => {
                    const res = calculatePct(
                      reportData.leadGeneration.positiveResponses,
                      goalData.leadGeneration.targetPositiveResponses || 20
                    );
                    return (
                      <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full border ${res.color}`}>
                        {reportData.leadGeneration.positiveResponses} / {goalData.leadGeneration.targetPositiveResponses || 20} ({res.label})
                      </span>
                    );
                  })()}
                </div>
                <input
                  type="number"
                  min="0"
                  value={reportData.leadGeneration.positiveResponses}
                  onChange={(e) =>
                    setReportData({
                      ...reportData,
                      leadGeneration: {
                        ...reportData.leadGeneration,
                        positiveResponses: parseInt(e.target.value) || 0,
                      },
                    })
                  }
                  className="w-full text-sm font-bold text-emerald-400 bg-slate-900 px-3 py-1.5 rounded-xl border border-slate-700 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              {/* 5. Serious/Interested Prospects */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-semibold text-slate-200">
                    5. Serious / Interested Prospects
                  </label>
                  {(() => {
                    const res = calculatePct(
                      reportData.leadGeneration.seriousProspects,
                      goalData.leadGeneration.targetSeriousProspects || 20
                    );
                    return (
                      <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full border ${res.color}`}>
                        {reportData.leadGeneration.seriousProspects} / {goalData.leadGeneration.targetSeriousProspects || 20} ({res.label})
                      </span>
                    );
                  })()}
                </div>
                <input
                  type="number"
                  min="0"
                  value={reportData.leadGeneration.seriousProspects}
                  onChange={(e) =>
                    setReportData({
                      ...reportData,
                      leadGeneration: {
                        ...reportData.leadGeneration,
                        seriousProspects: parseInt(e.target.value) || 0,
                      },
                    })
                  }
                  className="w-full text-sm font-bold text-indigo-400 bg-slate-900 px-3 py-1.5 rounded-xl border border-slate-700 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              {/* 6. Onboarding Discussions */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-semibold text-slate-200">
                    6. Onboarding Discussions
                  </label>
                  {(() => {
                    const res = calculatePct(
                      reportData.leadGeneration.onboardingDiscussions,
                      goalData.leadGeneration.targetOnboardingDiscussions || 15
                    );
                    return (
                      <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full border ${res.color}`}>
                        {reportData.leadGeneration.onboardingDiscussions} / {goalData.leadGeneration.targetOnboardingDiscussions || 15} ({res.label})
                      </span>
                    );
                  })()}
                </div>
                <input
                  type="number"
                  min="0"
                  value={reportData.leadGeneration.onboardingDiscussions}
                  onChange={(e) =>
                    setReportData({
                      ...reportData,
                      leadGeneration: {
                        ...reportData.leadGeneration,
                        onboardingDiscussions: parseInt(e.target.value) || 0,
                      },
                    })
                  }
                  className="w-full text-sm font-bold text-indigo-400 bg-slate-900 px-3 py-1.5 rounded-xl border border-slate-700 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                />
              </div>
            </div>
          </div>

          {/* Custom Targets List if any */}
          {goalData.leadGeneration.customItems.length > 0 && (
            <div className="pt-2 border-t border-slate-800">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-2">
                Custom Targets ({goalData.leadGeneration.customItems.length})
              </span>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {goalData.leadGeneration.customItems.map((item) => (
                  <div
                    key={item.id}
                    className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between gap-2 text-white"
                  >
                    <div>
                      <span className="text-xs font-bold text-white">{item.label}</span>
                      <span className="ml-2 px-1.5 py-0.5 rounded-md text-[10px] font-extrabold bg-indigo-950 text-indigo-300 border border-indigo-800/80">
                        {item.value} {item.unit || ""}
                      </span>
                      {item.notes && <p className="text-[10px] text-slate-400 mt-0.5">{item.notes}</p>}
                    </div>
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => openEditTargetModal(item, "leadGen")}
                        className="p-1 text-slate-400 hover:text-white rounded-md transition-colors"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => promptDeleteItem(item.id, item.label, "leadGen")}
                        className="p-1 text-slate-400 hover:text-rose-400 rounded-md transition-colors"
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

        {/* ======================================================================= */}
        {/* CARD 2: CUSTOMER SUPPORT (GOAL ON LEFT, RESULT ON RIGHT) */}
        {/* ======================================================================= */}
        <div className="bg-slate-900 rounded-3xl border border-slate-800 p-6 sm:p-7 shadow-xl space-y-6 text-white">
          {/* Card Header */}
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-blue-950/80 text-blue-400 border border-blue-800/80 flex items-center justify-center">
                <Headphones className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-white text-base">
                    📞 Customer Support
                  </h3>
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-extrabold bg-blue-950 text-blue-300 border border-blue-800/80">
                    {reportData.customerSupport.issuesResolved} / {goalData.customerSupport.targetPendingIssuesToResolve || 3} Resolved
                  </span>
                </div>
                <p className="text-xs text-slate-400">
                  Customer calls, resolved tickets, and pending docs issues
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => openAddTargetModal("support")}
              className="px-3 py-1.5 text-xs text-blue-300 hover:text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-xl font-semibold flex items-center gap-1 transition-colors"
            >
              <Plus className="w-3.5 h-3.5" /> Add Metric
            </button>
          </div>

          {/* Side-by-Side Comparison Container */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* LEFT SIDE: GOAL */}
            <div className="space-y-4 p-5 rounded-2xl bg-slate-950/80 border border-slate-800/80">
              <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                <span className="text-xs font-bold uppercase tracking-wider text-blue-400 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                  Morning Goal (Target)
                </span>
                <span className="text-[11px] text-slate-400">Target Volume</span>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-200 block mb-1">
                  1. Calls / Messages Target
                </label>
                <input
                  type="number"
                  min="0"
                  value={goalData.customerSupport.targetCallsAndMessages}
                  onChange={(e) =>
                    setGoalData({
                      ...goalData,
                      customerSupport: {
                        ...goalData.customerSupport,
                        targetCallsAndMessages: parseInt(e.target.value) || 0,
                      },
                    })
                  }
                  className="w-full text-sm font-bold text-white bg-slate-900 px-3 py-1.5 rounded-xl border border-slate-700 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-200 block mb-1">
                  2. Pending Issues to Resolve Target
                </label>
                <input
                  type="number"
                  min="0"
                  value={goalData.customerSupport.targetPendingIssuesToResolve}
                  onChange={(e) =>
                    setGoalData({
                      ...goalData,
                      customerSupport: {
                        ...goalData.customerSupport,
                        targetPendingIssuesToResolve: parseInt(e.target.value) || 0,
                      },
                    })
                  }
                  className="w-full text-sm font-bold text-white bg-slate-900 px-3 py-1.5 rounded-xl border border-slate-700 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-200 block mb-1">
                  3. Follow-ups with Unresolved
                </label>
                <input
                  type="number"
                  min="0"
                  value={goalData.customerSupport.targetFollowUpsUnresolved}
                  onChange={(e) =>
                    setGoalData({
                      ...goalData,
                      customerSupport: {
                        ...goalData.customerSupport,
                        targetFollowUpsUnresolved: parseInt(e.target.value) || 0,
                      },
                    })
                  }
                  className="w-full text-sm font-bold text-white bg-slate-900 px-3 py-1.5 rounded-xl border border-slate-700 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                />
              </div>
            </div>

            {/* RIGHT SIDE: REPORT (ACTUAL WITH CLIENTS NOTE) */}
            <div className="space-y-4 p-5 rounded-2xl bg-slate-950/80 border border-slate-800/80">
              <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                  Report (Actual Results &amp; Clients)
                </span>
                <span className="text-[11px] text-slate-400">Handled / Resolved</span>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-semibold text-slate-200">
                    1. Customer Calls Handled (Clients &amp; Numbers)
                  </label>
                  <span className="text-[10px] font-bold bg-blue-950 text-blue-300 border border-blue-800/80 px-2 py-0.5 rounded-full">
                    {reportData.customerSupport.callsHandled} Handled
                  </span>
                </div>
                <div className="flex gap-2">
                  <input
                    type="number"
                    min="0"
                    value={reportData.customerSupport.callsHandled}
                    onChange={(e) =>
                      setReportData({
                        ...reportData,
                        customerSupport: {
                          ...reportData.customerSupport,
                          callsHandled: parseInt(e.target.value) || 0,
                        },
                      })
                    }
                    className="w-20 text-sm font-bold text-blue-400 bg-slate-900 px-3 py-1.5 rounded-xl border border-slate-700 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                  />
                  <input
                    type="text"
                    placeholder="e.g. karokbd, eswaponi, fariwala24 (new lead contacted 10)"
                    value={reportData.customerSupport.callsHandledNote || ""}
                    onChange={(e) =>
                      setReportData({
                        ...reportData,
                        customerSupport: {
                          ...reportData.customerSupport,
                          callsHandledNote: e.target.value,
                        },
                      })
                    }
                    className="flex-1 text-xs text-slate-200 placeholder-slate-500 bg-slate-900 px-3 py-1.5 rounded-xl border border-slate-700 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-semibold text-slate-200">
                    2. Customer Issues Resolved
                  </label>
                  <span className="text-[10px] font-bold bg-emerald-950 text-emerald-300 border border-emerald-800/80 px-2 py-0.5 rounded-full">
                    {reportData.customerSupport.issuesResolved} Resolved
                  </span>
                </div>
                <div className="flex gap-2">
                  <input
                    type="number"
                    min="0"
                    value={reportData.customerSupport.issuesResolved}
                    onChange={(e) =>
                      setReportData({
                        ...reportData,
                        customerSupport: {
                          ...reportData.customerSupport,
                          issuesResolved: parseInt(e.target.value) || 0,
                        },
                      })
                    }
                    className="w-20 text-sm font-bold text-emerald-400 bg-slate-900 px-3 py-1.5 rounded-xl border border-slate-700 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                  />
                  <input
                    type="text"
                    placeholder="e.g. live well fresh, eswapno, fariwala24"
                    value={reportData.customerSupport.issuesResolvedNote || ""}
                    onChange={(e) =>
                      setReportData({
                        ...reportData,
                        customerSupport: {
                          ...reportData.customerSupport,
                          issuesResolvedNote: e.target.value,
                        },
                      })
                    }
                    className="flex-1 text-xs text-slate-200 placeholder-slate-500 bg-slate-900 px-3 py-1.5 rounded-xl border border-slate-700 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-semibold text-slate-200">
                    3. Pending Issues (Docs &amp; Actions)
                  </label>
                  <span className="text-[10px] font-bold bg-amber-950 text-amber-300 border border-amber-800/80 px-2 py-0.5 rounded-full">
                    {reportData.customerSupport.pendingIssues} Pending
                  </span>
                </div>
                <div className="flex gap-2">
                  <input
                    type="number"
                    min="0"
                    value={reportData.customerSupport.pendingIssues}
                    onChange={(e) =>
                      setReportData({
                        ...reportData,
                        customerSupport: {
                          ...reportData.customerSupport,
                          pendingIssues: parseInt(e.target.value) || 0,
                        },
                      })
                    }
                    className="w-20 text-sm font-bold text-amber-400 bg-slate-900 px-3 py-1.5 rounded-xl border border-slate-700 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                  />
                  <input
                    type="text"
                    placeholder="e.g. munjia perfume, fariwala24 in docs"
                    value={reportData.customerSupport.pendingIssuesNote || ""}
                    onChange={(e) =>
                      setReportData({
                        ...reportData,
                        customerSupport: {
                          ...reportData.customerSupport,
                          pendingIssuesNote: e.target.value,
                        },
                      })
                    }
                    className="flex-1 text-xs text-slate-200 placeholder-slate-500 bg-slate-900 px-3 py-1.5 rounded-xl border border-slate-700 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ======================================================================= */}
        {/* CARD 3: COMPETITOR RESEARCH (ACTIONS & FINDINGS) */}
        {/* ======================================================================= */}
        <div className="bg-slate-900 rounded-3xl border border-slate-800 p-6 sm:p-7 shadow-xl space-y-6 text-white">
          {/* Card Header & Tabs */}
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-purple-950/80 text-purple-400 border border-purple-800/80 flex items-center justify-center">
                <Search className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-white text-base">
                    📊 Competitor Research
                  </h3>
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-extrabold bg-purple-950 text-purple-300 border border-purple-800/80">
                    {(reportData.competitorResearch.findings || []).length} Findings
                  </span>
                </div>
                <p className="text-xs text-slate-400">
                  Observed competitor campaigns, video hooks &amp; strategic actions
                </p>
              </div>
            </div>

            {/* Two Tabs: Added Item List & Add Field */}
            <div className="flex items-center gap-1.5 p-1 bg-slate-950 border border-slate-800 rounded-2xl">
              <button
                type="button"
                onClick={() => setCompetitorTab("list")}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                  competitorTab === "list"
                    ? "bg-purple-600 text-white shadow-sm"
                    : "text-slate-400 hover:text-white hover:bg-slate-900"
                }`}
              >
                <List className="w-3.5 h-3.5" />
                <span>Added Item List</span>
                <span
                  className={`px-1.5 py-0.5 rounded-full text-[10px] font-extrabold ${
                    competitorTab === "list"
                      ? "bg-purple-800 text-white"
                      : "bg-slate-800 text-slate-300"
                  }`}
                >
                  {(reportData.competitorResearch.findings || []).length}
                </span>
              </button>

              <button
                type="button"
                onClick={() => setCompetitorTab("add")}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                  competitorTab === "add"
                    ? "bg-purple-600 text-white shadow-sm"
                    : "text-slate-400 hover:text-white hover:bg-slate-900"
                }`}
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Field</span>
              </button>
            </div>
          </div>

          {/* TAB 1: Added Item List */}
          {competitorTab === "list" && (
            <div className="space-y-3">
              {(!reportData.competitorResearch.findings || reportData.competitorResearch.findings.length === 0) ? (
                <div className="p-8 rounded-2xl border border-dashed border-slate-800 text-center space-y-3">
                  <p className="text-xs text-slate-400">
                    No competitor findings logged yet. Click "Add Field" to add your first observation.
                  </p>
                  <button
                    type="button"
                    onClick={() => setCompetitorTab("add")}
                    className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-xl text-xs font-bold transition-all shadow-md inline-flex items-center gap-1.5 cursor-pointer"
                  >
                    <Plus className="w-4 h-4" /> Add Field
                  </button>
                </div>
              ) : (
                <>
                  {reportData.competitorResearch.findings.map((item, idx) => {
                    const isChecked = item.checked !== false;
                    const topicDisplay = item.topic || item.observedActivity || "Observation";
                    const contentDisplay = item.content || item.myAction || "";

                    return (
                      <div
                        key={item.id}
                        className={`p-4 rounded-2xl bg-slate-950 border transition-all flex flex-col sm:flex-row sm:items-start justify-between gap-3 text-white ${
                          isChecked ? "border-slate-800" : "border-slate-800/50 opacity-60"
                        }`}
                      >
                        <div className="flex items-start gap-3 flex-1">
                          {/* Check mark toggle */}
                          <button
                            type="button"
                            onClick={() => handleToggleCompetitorFinding(item.id)}
                            className={`mt-0.5 w-5 h-5 rounded-md border flex items-center justify-center transition-colors cursor-pointer shrink-0 ${
                              isChecked
                                ? "bg-purple-600 border-purple-500 text-white"
                                : "bg-slate-900 border-slate-700 text-transparent hover:border-slate-500"
                            }`}
                            title={isChecked ? "Marked as Checked (click to toggle)" : "Unchecked (click to mark checked)"}
                          >
                            <Check className="w-3.5 h-3.5" />
                          </button>

                          <div className="space-y-2 flex-1">
                            <div className="flex flex-wrap items-center gap-2">
                              <span className="text-[11px] font-bold text-slate-400">
                                #{idx + 1}
                              </span>
                              <span className="text-xs font-bold text-purple-300 bg-purple-950/90 px-2.5 py-0.5 rounded-lg border border-purple-800/80">
                                topic: {topicDisplay}
                              </span>
                              {item.competitorName && (
                                <span className="text-[10px] font-semibold text-slate-400 bg-slate-900 px-2 py-0.5 rounded-md border border-slate-800">
                                  {item.competitorName}
                                </span>
                              )}
                              {isChecked && (
                                <span className="text-[10px] font-semibold text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded-md border border-emerald-800/60 flex items-center gap-1">
                                  <Check className="w-2.5 h-2.5" /> Checked
                                </span>
                              )}
                            </div>

                            {contentDisplay && (
                              <div className="text-xs text-slate-200 pl-3 border-l-2 border-purple-500/80 bg-slate-900/40 p-2.5 rounded-r-xl space-y-1">
                                <span className="text-[11px] font-bold text-purple-400 block uppercase tracking-wider">
                                  content:
                                </span>
                                <p className="whitespace-pre-wrap font-medium">{contentDisplay}</p>
                              </div>
                            )}

                            {item.nextNeed && (
                              <p className="text-xs text-slate-400 pl-2 border-l-2 border-amber-500 font-medium">
                                <strong className="text-amber-400">Need:</strong> {item.nextNeed}
                              </p>
                            )}
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() => handleRemoveCompetitorFinding(item.id)}
                          className="p-1.5 text-slate-400 hover:text-rose-400 transition-colors self-start shrink-0"
                          title="Remove Finding"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    );
                  })}

                  <div className="pt-2 flex justify-end">
                    <button
                      type="button"
                      onClick={() => setCompetitorTab("add")}
                      className="px-4 py-2 bg-slate-950 hover:bg-slate-800 text-purple-300 border border-purple-800/60 rounded-xl text-xs font-semibold shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" /> + Add Field
                    </button>
                  </div>
                </>
              )}
            </div>
          )}

          {/* TAB 2: Add Field */}
          {competitorTab === "add" && (
            <div className="p-5 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800/80 pb-3">
                <span className="text-xs font-bold text-purple-400 flex items-center gap-1.5">
                  <Plus className="w-3.5 h-3.5" /> Add Field
                </span>

                {/* Quick Topic preset chips with check mark */}
                <div className="flex flex-wrap items-center gap-1.5">
                  <span className="text-[10px] text-slate-400 mr-1">Quick Topics:</span>
                  {[
                    "feature video",
                    "take customer reviews",
                    "educational video",
                    "client feedback story",
                    "promotional offer",
                  ].map((preset) => (
                    <button
                      key={preset}
                      type="button"
                      onClick={() => setNewCompTopic(preset)}
                      className={`text-[11px] px-2.5 py-1 rounded-lg border transition-all flex items-center gap-1 font-medium cursor-pointer ${
                        newCompTopic.toLowerCase() === preset.toLowerCase()
                          ? "bg-purple-950 text-purple-300 border-purple-600"
                          : "bg-slate-900 text-slate-300 border-slate-700 hover:border-slate-600"
                      }`}
                    >
                      <Check className="w-3 h-3 text-purple-400" />
                      {preset}
                    </button>
                  ))}
                </div>
              </div>

              {/* Input fields */}
              <div className="space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
                  {/* Check mark toggle */}
                  <div className="sm:col-span-4 flex items-center gap-2 bg-slate-900 px-3 py-2 rounded-xl border border-slate-700">
                    <input
                      type="checkbox"
                      id="newCompChecked"
                      checked={newCompChecked}
                      onChange={(e) => setNewCompChecked(e.target.checked)}
                      className="w-4 h-4 rounded-md border-slate-600 text-purple-600 bg-slate-800 focus:ring-purple-500 cursor-pointer"
                    />
                    <label htmlFor="newCompChecked" className="text-xs font-semibold text-slate-200 cursor-pointer select-none">
                      Check Mark [✓] Value
                    </label>
                  </div>

                  {/* Topic Input */}
                  <div className="sm:col-span-8">
                    <div className="flex items-center gap-1.5 mb-1">
                      <label className="text-[11px] font-semibold text-purple-300">
                        topic:
                      </label>
                      <span className="text-[10px] text-slate-400">
                        (e.g. feature video, take customer reviews, educational video)
                      </span>
                    </div>
                    <input
                      type="text"
                      placeholder="e.g. feature video or take customer reviews"
                      value={newCompTopic}
                      onChange={(e) => setNewCompTopic(e.target.value)}
                      className="w-full text-xs text-white placeholder-slate-500 bg-slate-900 px-3 py-2 rounded-xl border border-slate-700 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 font-medium"
                    />
                  </div>
                </div>

                {/* Content Input */}
                <div>
                  <div className="flex items-center gap-1.5 mb-1">
                    <label className="text-[11px] font-semibold text-purple-300">
                      content:
                    </label>
                    <span className="text-[10px] text-slate-400">
                      (e.g. feature video of wholesaler in bponi store admin panel)
                    </span>
                  </div>
                  <textarea
                    rows={2}
                    placeholder="e.g. feature video of wholesaler in bponi store admin panel / manage fariwal24 client for review"
                    value={newCompContent}
                    onChange={(e) => setNewCompContent(e.target.value)}
                    className="w-full text-xs text-white placeholder-slate-500 bg-slate-900 px-3 py-2 rounded-xl border border-slate-700 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 font-medium"
                  />
                </div>

                {/* Optional details: Next Need */}
                <div>
                  <label className="text-[11px] font-medium text-slate-400 block mb-1">
                    Next Need / Requirement (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Edit from azman and post it"
                    value={newCompNeed}
                    onChange={(e) => setNewCompNeed(e.target.value)}
                    className="w-full text-xs text-white placeholder-slate-500 bg-slate-900 px-3 py-1.5 rounded-xl border border-slate-700 focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between pt-1">
                <button
                  type="button"
                  onClick={() => setCompetitorTab("list")}
                  className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white bg-slate-900 hover:bg-slate-800 rounded-xl transition-all cursor-pointer border border-slate-800"
                >
                  Cancel
                </button>

                <button
                  type="button"
                  onClick={handleAddCompetitorFinding}
                  className="px-5 py-2 text-xs font-bold text-white bg-purple-600 hover:bg-purple-500 rounded-xl transition-all shadow-md flex items-center gap-1.5 active:scale-95 cursor-pointer"
                >
                  <Plus className="w-4 h-4" /> Add
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: 📋 READY DAILY REPORT FOR BOSS */}
      {/* ========================================================================= */}
      {mainTab === "bossReport" && (
        <ReadyBossReportView
          goal={goalData}
          report={reportData}
          activeDate={activeDate}
          onOpenCopyModal={onOpenCopyModal}
          showToast={showToast}
          onSwitchToTemplate={() => setMainTab("template")}
        />
      )}

      {/* Target Modal for Range Slider & Stepper */}
      <TargetModal
        isOpen={targetModalState.isOpen}
        initialCategory={targetModalState.category}
        initialItem={targetModalState.editingItem}
        onClose={() => setTargetModalState((prev) => ({ ...prev, isOpen: false }))}
        onSave={handleSaveTargetItem}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={deleteModalState.isOpen}
        title="Delete Target"
        itemName={deleteModalState.itemLabel}
        onCancel={() => setDeleteModalState((prev) => ({ ...prev, isOpen: false }))}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
};
