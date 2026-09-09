"use client";

import React, { useState } from "react";
import {
  MorningGoal,
  EODReport,
} from "@/types/report";
import {
  formatDateDisplay,
  formatBossComparisonReportMarkdownTable,
  formatBossComparisonReportText,
  calculateDailyWorkProgress,
  WORKED_THRESHOLD_PCT,
} from "@/lib/formatters";
import {
  Copy,
  Check,
  Table,
  Code,
  MessageSquare,
  Edit3,
  Sparkles,
  AlertTriangle,
  Lock,
} from "lucide-react";

interface ReadyBossReportViewProps {
  goal: MorningGoal;
  report: EODReport;
  activeDate: string;
  onOpenCopyModal?: (title: string, text: string) => void;
  showToast: (msg: string, type?: "success" | "error" | "info") => void;
  onSwitchToTemplate: () => void;
}

export const ReadyBossReportView: React.FC<ReadyBossReportViewProps> = ({
  goal,
  report,
  activeDate,
  onOpenCopyModal,
  showToast,
  onSwitchToTemplate,
}) => {
  const [viewMode, setViewMode] = useState<"table" | "markdown" | "whatsapp">("table");
  const [copiedType, setCopiedType] = useState<"table" | "text" | null>(null);
  const [showDraftAnyway, setShowDraftAnyway] = useState(false);

  const progress = calculateDailyWorkProgress(goal, report);

  const formattedDate = formatDateDisplay(activeDate);
  const markdownTableText = formatBossComparisonReportMarkdownTable(goal, report);
  const whatsappText = formatBossComparisonReportText(goal, report);

  // If under 50% and draft not explicitly requested: Hide report
  if (!progress.isWorked && !showDraftAnyway) {
    return (
      <div className="bg-slate-900 rounded-3xl border border-slate-800 p-8 sm:p-12 text-center space-y-6 max-w-2xl mx-auto shadow-2xl text-white">
        <div className="w-16 h-16 rounded-3xl bg-amber-950/80 border border-amber-800/80 text-amber-400 flex items-center justify-center mx-auto shadow-lg shadow-amber-950/50">
          <AlertTriangle className="w-8 h-8" />
        </div>

        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-950/70 border border-amber-700/60 text-amber-300 text-xs font-bold">
            <span>Work Recorded: {progress.percentage}%</span>
            <span>•</span>
            <span>Minimum {WORKED_THRESHOLD_PCT}% Required</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
            Daily Report Hidden (Work Under 50%)
          </h2>
          <p className="text-sm text-slate-400 max-w-md mx-auto leading-relaxed">
            You currently have <strong>{progress.percentage}%</strong> work recorded for {formattedDate}.
            Touch or update your actual results to reach at least <strong>50%</strong> to mark this day as worked and unlock the report for boss.
          </p>
        </div>

        {/* Progress Bar */}
        <div className="w-full max-w-md mx-auto space-y-2 bg-slate-950/80 p-4 rounded-2xl border border-slate-800">
          <div className="flex justify-between items-center text-xs font-semibold">
            <span className="text-slate-300">Completion Status</span>
            <span className="text-amber-400 font-bold">
              {progress.percentage}% / 50% Target
            </span>
          </div>
          <div className="w-full h-3 rounded-full bg-slate-800 overflow-hidden">
            <div
              className="h-full bg-amber-500 rounded-full transition-all duration-500"
              style={{ width: `${Math.min(100, (progress.percentage / 50) * 100)}%` }}
            />
          </div>
          <div className="text-[11px] text-slate-500 text-left">
            {50 - progress.percentage}% more achievement needed across Lead Gen, Customer Support, or Competitor tasks.
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <button
            type="button"
            onClick={onSwitchToTemplate}
            className="w-full sm:w-auto px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-indigo-900/40 transition-all cursor-pointer"
          >
            <Edit3 className="w-4 h-4" /> Go to Template &amp; Update Work
          </button>
          <button
            type="button"
            onClick={() => setShowDraftAnyway(true)}
            className="text-xs text-slate-400 hover:text-slate-200 underline underline-offset-4 py-2 px-3 transition-colors cursor-pointer"
          >
            Preview draft anyway (under 50%)
          </button>
        </div>
      </div>
    );
  }

  // Copy handler
  const handleCopy = async (type: "table" | "text") => {
    const textToCopy = type === "table" ? markdownTableText : whatsappText;
    try {
      await navigator.clipboard.writeText(textToCopy);
      setCopiedType(type);
      showToast(
        type === "table"
          ? "Markdown Table copied to clipboard!"
          : "WhatsApp text copied to clipboard!",
        "success"
      );
      setTimeout(() => setCopiedType(null), 2500);
    } catch {
      if (onOpenCopyModal) {
        onOpenCopyModal(
          `Daily Report – ${formattedDate}`,
          textToCopy
        );
      }
    }
  };

  // Helper for percentage badge
  const calcPct = (act: number, target: number) => {
    if (!target || target <= 0) return { pct: "—", color: "bg-slate-800 text-slate-400 border-slate-700" };
    const pctVal = ((act / target) * 100).toFixed(1);
    const num = parseFloat(pctVal);
    if (num >= 100) return { pct: `${pctVal}%`, color: "bg-emerald-950/90 text-emerald-300 border-emerald-800/80" };
    if (num >= 50) return { pct: `${pctVal}%`, color: "bg-indigo-950/90 text-indigo-300 border-indigo-800/80" };
    return { pct: `${pctVal}%`, color: "bg-amber-950/90 text-amber-300 border-amber-800/80" };
  };

  const leadMetrics = [
    {
      metric: "Leads Available",
      target: goal.leadGeneration.targetLeadsToFind ? `${goal.leadGeneration.targetLeadsToFind}` : "—",
      actual: report.leadGeneration.leadsFound,
      pctObj: goal.leadGeneration.targetLeadsToFind
        ? calcPct(report.leadGeneration.leadsFound, goal.leadGeneration.targetLeadsToFind)
        : { pct: "—", color: "bg-slate-800 text-slate-400 border-slate-700" },
      notes: goal.leadGeneration.notes || "—",
    },
    {
      metric: "New Prospects Contacted",
      target: "—",
      actual: report.leadGeneration.prospectsContacted,
      pctObj: { pct: "—", color: "bg-slate-800 text-slate-400 border-slate-700" },
      notes: report.leadGeneration.notes || "—",
    },
    {
      metric: "Previous Leads Followed Up",
      target: `${goal.leadGeneration.targetFollowUps || 50}`,
      actual: report.leadGeneration.leadsFollowedUp,
      pctObj: calcPct(report.leadGeneration.leadsFollowedUp, goal.leadGeneration.targetFollowUps || 50),
      notes: "—",
    },
    {
      metric: "Positive Responses",
      target: `${goal.leadGeneration.targetPositiveResponses || 20}`,
      actual: report.leadGeneration.positiveResponses,
      pctObj: calcPct(report.leadGeneration.positiveResponses, goal.leadGeneration.targetPositiveResponses || 20),
      notes: "—",
    },
    {
      metric: "Serious / Interested Prospects",
      target: `${goal.leadGeneration.targetSeriousProspects || 20}`,
      actual: report.leadGeneration.seriousProspects,
      pctObj: calcPct(report.leadGeneration.seriousProspects, goal.leadGeneration.targetSeriousProspects || 20),
      notes: "—",
    },
    {
      metric: "Onboarding Discussions",
      target: `${goal.leadGeneration.targetOnboardingDiscussions || 15}`,
      actual: report.leadGeneration.onboardingDiscussions,
      pctObj: calcPct(report.leadGeneration.onboardingDiscussions, goal.leadGeneration.targetOnboardingDiscussions || 15),
      notes: "—",
    },
  ];

  const supportMetrics = [
    {
      task: "Customer Calls Handled",
      count: report.customerSupport.callsHandled,
      details: report.customerSupport.callsHandledNote || "—",
      badgeColor: "bg-blue-950 text-blue-300 border-blue-800/80",
    },
    {
      task: "Customer Issues Resolved",
      count: report.customerSupport.issuesResolved,
      details: report.customerSupport.issuesResolvedNote || "—",
      badgeColor: "bg-emerald-950 text-emerald-300 border-emerald-800/80",
    },
    {
      task: "Pending Issues (Docs & Actions)",
      count: report.customerSupport.pendingIssues,
      details: report.customerSupport.pendingIssuesNote || "—",
      badgeColor: "bg-amber-950 text-amber-300 border-amber-800/80",
    },
  ];

  const competitorFindings = report.competitorResearch.findings || [];

  return (
    <div className="bg-slate-900 rounded-3xl border border-slate-800 p-6 sm:p-8 shadow-xl space-y-6 text-white w-full">
      {/* Draft Warning or Worked Verification Banner */}
      {!progress.isWorked ? (
        <div className="bg-amber-950/60 border border-amber-800/80 text-amber-200 p-3.5 rounded-2xl flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
            <span><strong>Draft Preview:</strong> Today&apos;s recorded work is at {progress.percentage}% (below 50% threshold).</span>
          </div>
          <button
            type="button"
            onClick={() => setShowDraftAnyway(false)}
            className="text-[11px] font-bold text-amber-300 hover:underline shrink-0"
          >
            Hide Report
          </button>
        </div>
      ) : (
        <div className="bg-emerald-950/50 border border-emerald-500/60 text-emerald-200 p-3 rounded-2xl flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 font-medium">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>✅ <strong>Day Verified as Worked ({progress.percentage}%)</strong> — Ready and formatted for Boss</span>
          </div>
          <span className="text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full bg-emerald-500 text-slate-950 font-bold">≥ 50% QUALIFIED</span>
        </div>
      )}

      {/* Top Action Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4">
        {/* Mode Selector */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-950 border border-slate-800 rounded-2xl">
          <button
            type="button"
            onClick={() => setViewMode("table")}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              viewMode === "table"
                ? "bg-indigo-600 text-white shadow-sm"
                : "text-slate-400 hover:text-white hover:bg-slate-900"
            }`}
          >
            <Table className="w-3.5 h-3.5" />
            <span>Table Preview</span>
          </button>

          <button
            type="button"
            onClick={() => setViewMode("markdown")}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              viewMode === "markdown"
                ? "bg-indigo-600 text-white shadow-sm"
                : "text-slate-400 hover:text-white hover:bg-slate-900"
            }`}
          >
            <Code className="w-3.5 h-3.5" />
            <span>Markdown Code</span>
          </button>

          <button
            type="button"
            onClick={() => setViewMode("whatsapp")}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              viewMode === "whatsapp"
                ? "bg-indigo-600 text-white shadow-sm"
                : "text-slate-400 hover:text-white hover:bg-slate-900"
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>Text Format</span>
          </button>
        </div>

        {/* Copy Buttons */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => handleCopy("table")}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold shadow-md transition-all flex items-center gap-1.5 active:scale-95 cursor-pointer"
            title="Copy as formatted Markdown Table"
          >
            {copiedType === "table" ? (
              <>
                <Check className="w-3.5 h-3.5" /> Copied Table!
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" /> 1-Click Copy Table (Markdown)
              </>
            )}
          </button>

          <button
            type="button"
            onClick={() => handleCopy("text")}
            className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-semibold border border-slate-700 transition-all flex items-center gap-1.5 active:scale-95 cursor-pointer"
            title="Copy as plain WhatsApp text"
          >
            {copiedType === "text" ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" /> Copied!
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" /> Copy Text
              </>
            )}
          </button>
        </div>
      </div>

      {/* TOP CENTER: TODAY DATE AND WORK UPDATE TITLE (UNDERLINED) */}
      <div className="text-center py-4 border-b border-slate-800 space-y-2">
        <h2 className="text-2xl sm:text-3xl font-black text-white tracking-wider uppercase underline underline-offset-8 decoration-indigo-500 decoration-2">
          DAILY WORK UPDATE
        </h2>
        <p className="text-sm font-bold text-indigo-400 tracking-wide underline underline-offset-4 decoration-slate-700">
          📅 Date: {formattedDate}
        </p>
      </div>

      {/* VIEW 1: INTERACTIVE FORMATTED TABLE PREVIEW */}
      {viewMode === "table" && (
        <div className="space-y-7">
          {/* Section 1: Lead Generation Table */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="text-base font-bold text-indigo-400">🎯 1. Lead Generation</span>
            </div>
            <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-slate-950 shadow-inner">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-slate-800 bg-slate-900/90 text-slate-300 font-bold uppercase tracking-wider text-[11px]">
                    <th className="py-3 px-4">Metric</th>
                    <th className="py-3 px-4 text-center">Goal (Target)</th>
                    <th className="py-3 px-4 text-center">Actual Result</th>
                    <th className="py-3 px-4 text-center">Achievement</th>
                    <th className="py-3 px-4">Notes / Details</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/80 text-slate-200">
                  {leadMetrics.map((row, idx) => (
                    <tr key={idx} className="hover:bg-slate-900/50 transition-colors">
                      <td className="py-2.5 px-4 font-semibold text-white">{row.metric}</td>
                      <td className="py-2.5 px-4 text-center font-bold text-indigo-300">{row.target}</td>
                      <td className="py-2.5 px-4 text-center font-bold text-emerald-400">{row.actual}</td>
                      <td className="py-2.5 px-4 text-center">
                        <span className={`inline-block px-2.5 py-0.5 rounded-full text-[11px] font-extrabold border ${row.pctObj.color}`}>
                          {row.pctObj.pct}
                        </span>
                      </td>
                      <td className="py-2.5 px-4 text-slate-400 font-medium">{row.notes}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Section 2: Customer Support Table */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="text-base font-bold text-emerald-400">📞 2. Customer Support</span>
            </div>
            <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-slate-950 shadow-inner">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-slate-800 bg-slate-900/90 text-slate-300 font-bold uppercase tracking-wider text-[11px]">
                    <th className="py-3 px-4">Activity / Task</th>
                    <th className="py-3 px-4 text-center">Count</th>
                    <th className="py-3 px-4">Client Names &amp; Document Notes</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/80 text-slate-200">
                  {supportMetrics.map((row, idx) => (
                    <tr key={idx} className="hover:bg-slate-900/50 transition-colors">
                      <td className="py-2.5 px-4 font-semibold text-white">{row.task}</td>
                      <td className="py-2.5 px-4 text-center">
                        <span className={`inline-block px-3 py-0.5 rounded-full text-xs font-extrabold border ${row.badgeColor}`}>
                          {row.count}
                        </span>
                      </td>
                      <td className="py-2.5 px-4 text-slate-300 font-medium">{row.details}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Section 3: Competitor Research Table */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="text-base font-bold text-purple-400">📊 3. Competitor Research</span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-purple-950 text-purple-300 border border-purple-800/80 font-bold">
                {competitorFindings.length} Items
              </span>
            </div>
            <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-slate-950 shadow-inner">
              {competitorFindings.length === 0 ? (
                <div className="p-6 text-center text-xs text-slate-500 font-medium">
                  No competitor findings logged for this date.
                </div>
              ) : (
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="border-b border-slate-800 bg-slate-900/90 text-slate-300 font-bold uppercase tracking-wider text-[11px]">
                      <th className="py-3 px-3 text-center">#</th>
                      <th className="py-3 px-4">Competitor</th>
                      <th className="py-3 px-4">Topic</th>
                      <th className="py-3 px-4">Content / Observation</th>
                      <th className="py-3 px-4">Next Need / Requirement</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/80 text-slate-200">
                    {competitorFindings.map((item, idx) => (
                      <tr key={item.id || idx} className="hover:bg-slate-900/50 transition-colors">
                        <td className="py-2.5 px-3 text-center font-bold text-slate-400">{idx + 1}</td>
                        <td className="py-2.5 px-4 font-semibold text-purple-300">
                          {item.competitorName && item.competitorName.trim() ? item.competitorName : "—"}
                        </td>
                        <td className="py-2.5 px-4 font-medium text-white">
                          <span className="bg-purple-950/80 text-purple-300 px-2 py-0.5 rounded-md border border-purple-800/60 font-semibold">
                            {item.topic || item.observedActivity || "—"}
                          </span>
                        </td>
                        <td className="py-2.5 px-4 text-slate-200 whitespace-pre-wrap font-medium">
                          {item.content || item.myAction || "—"}
                        </td>
                        <td className="py-2.5 px-4 text-amber-300 font-medium">
                          {item.nextNeed ? `Need: ${item.nextNeed}` : "—"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>
      )}

      {/* VIEW 2: RAW MARKDOWN TABLE CODE */}
      {viewMode === "markdown" && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400">
              Formatted Markdown Tables ready for GitHub, Notion, Slack &amp; Docs:
            </span>
            <span className="text-[11px] text-indigo-400 font-mono">markdown</span>
          </div>
          <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 overflow-x-auto shadow-inner">
            <pre className="font-mono text-xs sm:text-sm text-slate-200 whitespace-pre-wrap leading-relaxed selection:bg-indigo-600">
              {markdownTableText}
            </pre>
          </div>
        </div>
      )}

      {/* VIEW 3: TEXT FORMAT */}
      {viewMode === "whatsapp" && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400">
              Compact bullet format with emojis for WhatsApp &amp; SMS:
            </span>
            <span className="text-[11px] text-emerald-400 font-mono">plain text</span>
          </div>
          <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 overflow-x-auto shadow-inner">
            <pre className="font-mono text-xs sm:text-sm text-slate-200 whitespace-pre-wrap leading-relaxed selection:bg-indigo-600">
              {whatsappText}
            </pre>
          </div>
        </div>
      )}

      {/* Footer Helper */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-3 text-xs text-slate-400 border-t border-slate-800/80">
        <span className="flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
          All changes in the Template tab automatically update this report in real time.
        </span>
        <button
          type="button"
          onClick={onSwitchToTemplate}
          className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl font-semibold transition-all flex items-center gap-1.5 cursor-pointer border border-slate-700"
        >
          <Edit3 className="w-3.5 h-3.5" /> Edit in Template
        </button>
      </div>
    </div>
  );
};
