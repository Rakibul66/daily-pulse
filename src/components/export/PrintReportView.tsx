"use client";

import React from "react";
import { DailyRecord } from "@/types/report";
import { formatDateDisplay } from "@/lib/formatters";
import { Printer, X, Download } from "lucide-react";

interface PrintReportViewProps {
  record: DailyRecord;
  onClose: () => void;
}

export const PrintReportView: React.FC<PrintReportViewProps> = ({
  record,
  onClose,
}) => {
  const handlePrint = () => {
    window.print();
  };

  const goal = record.morningGoal;
  const eod = record.eodReport;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/75 backdrop-blur-xs flex justify-center p-4 md:p-8 animate-in fade-in duration-150">
      <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-4xl w-full shadow-2xl overflow-hidden flex flex-col my-auto border border-slate-200 dark:border-slate-700">
        {/* Modal Action Bar (Hidden when printing) */}
        <div className="no-print flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950">
          <div>
            <h3 className="text-base font-semibold text-slate-800 dark:text-slate-200">
              Print / Export to PDF Preview
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Use your browser&apos;s &quot;Save as PDF&quot; destination to download.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handlePrint}
              className="flex items-center gap-2 px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-xl text-sm font-medium shadow-xs transition-colors"
            >
              <Printer className="w-4 h-4" /> Print / Save as PDF
            </button>
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-600 dark:text-slate-400 rounded-xl hover:bg-slate-200 dark:bg-slate-700 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Document Body */}
        <div className="p-8 md:p-12 text-slate-900 dark:text-white bg-white dark:bg-slate-900" id="printable-report">
          {/* Header */}
          <div className="border-b-2 border-primary-600 pb-6 mb-8 flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-primary-600 inline-block"></span>
                <span className="text-xs uppercase tracking-widest font-bold text-primary-600">
                  Daily Work Report
                </span>
              </div>
              <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-slate-900 dark:text-white mt-1">
                Executive Work Summary
              </h1>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                Date: <strong className="text-slate-800 dark:text-slate-200">{formatDateDisplay(record.date)}</strong>
              </p>
            </div>
            <div className="text-right">
              <div className="text-xs font-semibold px-3 py-1 rounded-full bg-primary-50 text-primary-700 border border-primary-200 inline-block">
                {record.hasEODReport ? "Completed EOD" : "Goal Set"}
              </div>
              <p className="text-xs text-slate-400 mt-2">
                Generated {new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
              </p>
            </div>
          </div>

          {/* Key Metrics Quick Row */}
          {eod && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700">
                <p className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase">Leads Found</p>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="text-2xl font-bold text-slate-900 dark:text-white">{eod.leadGeneration.leadsFound}</span>
                  {goal && (
                    <span className="text-xs text-slate-400">/ target {goal.leadGeneration.targetLeadsToFind}</span>
                  )}
                </div>
              </div>
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700">
                <p className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase">Contacted</p>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="text-2xl font-bold text-slate-900 dark:text-white">{eod.leadGeneration.prospectsContacted}</span>
                  {goal && (
                    <span className="text-xs text-slate-400">/ target {goal.leadGeneration.targetProspectsToContact}</span>
                  )}
                </div>
              </div>
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700">
                <p className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase">Onboardings</p>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="text-2xl font-bold text-primary-600">{eod.leadGeneration.onboardingDiscussions}</span>
                  <span className="text-xs text-slate-400">discussions</span>
                </div>
              </div>
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700">
                <p className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase">Support Resolved</p>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="text-2xl font-bold text-slate-900 dark:text-white">
                    {eod.customerSupport.issuesResolved}/{eod.customerSupport.callsHandled}
                  </span>
                  <span className="text-xs text-slate-400">tickets</span>
                </div>
              </div>
            </div>
          )}

          {/* Section 1: Morning Goal vs Actuals */}
          <div className="mb-8">
            <h2 className="text-base font-bold text-slate-800 dark:text-slate-200 border-b border-slate-200 dark:border-slate-700 pb-2 mb-4 flex items-center gap-2">
              <span>🎯</span> 1. Lead Generation & Prospecting
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              {goal && (
                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-700">
                  <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">
                    Morning Target
                  </span>
                  <ul className="mt-2 space-y-1.5 text-sm text-slate-700 dark:text-slate-300">
                    <li>• Find <strong>{goal.leadGeneration.targetLeadsToFind}</strong> potential leads</li>
                    <li>• Contact at least <strong>{goal.leadGeneration.targetProspectsToContact}</strong> qualified prospects</li>
                    <li>• Follow up with <strong>{goal.leadGeneration.targetFollowUps}</strong> previous leads</li>
                    {goal.leadGeneration.notes && (
                      <li className="text-xs text-slate-500 dark:text-slate-400 italic mt-1">• {goal.leadGeneration.notes}</li>
                    )}
                  </ul>
                </div>
              )}

              {eod ? (
                <div className="p-4 rounded-xl bg-primary-50/40 border border-primary-100">
                  <span className="text-xs font-semibold text-primary-700 uppercase tracking-wide">
                    End-of-Day Results
                  </span>
                  <ul className="mt-2 space-y-1.5 text-sm text-slate-800 dark:text-slate-200">
                    <li>• Leads found: <strong>{eod.leadGeneration.leadsFound}</strong></li>
                    <li>• New prospects contacted: <strong>{eod.leadGeneration.prospectsContacted}</strong></li>
                    <li>• Leads followed up: <strong>{eod.leadGeneration.leadsFollowedUp}</strong></li>
                    <li>• Positive responses: <strong>{eod.leadGeneration.positiveResponses}</strong></li>
                    <li>• Serious prospects: <strong>{eod.leadGeneration.seriousProspects}</strong></li>
                    <li>• Onboarding discussions: <strong>{eod.leadGeneration.onboardingDiscussions}</strong></li>
                  </ul>
                </div>
              ) : (
                <div className="p-4 rounded-xl border border-dashed border-slate-300 dark:border-slate-600 text-slate-400 text-sm flex items-center justify-center">
                  End of day report pending
                </div>
              )}
            </div>
          </div>

          {/* Section 2: Customer Support */}
          <div className="mb-8">
            <h2 className="text-base font-bold text-slate-800 dark:text-slate-200 border-b border-slate-200 dark:border-slate-700 pb-2 mb-4 flex items-center gap-2">
              <span>📞</span> 2. Customer Support & Resolution
            </h2>
            {eod ? (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="p-3 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-700 text-center">
                  <span className="text-xs text-slate-500 dark:text-slate-400">Calls / Inquiries</span>
                  <p className="text-xl font-bold text-slate-800 dark:text-slate-200 mt-0.5">{eod.customerSupport.callsHandled}</p>
                </div>
                <div className="p-3 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-700 text-center">
                  <span className="text-xs text-slate-500 dark:text-slate-400">Issues Resolved</span>
                  <p className="text-xl font-bold text-emerald-600 mt-0.5">{eod.customerSupport.issuesResolved}</p>
                </div>
                <div className="p-3 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-700 text-center">
                  <span className="text-xs text-slate-500 dark:text-slate-400">Pending Issues</span>
                  <p className="text-xl font-bold text-amber-600 mt-0.5">{eod.customerSupport.pendingIssues}</p>
                </div>
                <div className="p-3 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-700 text-center">
                  <span className="text-xs text-slate-500 dark:text-slate-400">Follow-ups Needed</span>
                  <p className="text-xl font-bold text-primary-600 mt-0.5">{eod.customerSupport.followUpsRequired}</p>
                </div>
              </div>
            ) : (
              <p className="text-sm text-slate-500 dark:text-slate-400">Customer support metrics will be reported at end of day.</p>
            )}
          </div>

          {/* Section 3: Competitor Research */}
          {eod && (
            <div className="mb-8">
              <h2 className="text-base font-bold text-slate-800 dark:text-slate-200 border-b border-slate-200 dark:border-slate-700 pb-2 mb-4 flex items-center gap-2">
                <span>📊</span> 3. Competitor Research & Insights
              </h2>
              <div className="p-4 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-700 text-sm space-y-3">
                <p>
                  <strong>Platforms / Competitors Inspected:</strong> {eod.competitorResearch.competitorsChecked}
                </p>
                <div>
                  <strong className="block text-xs uppercase text-slate-500 dark:text-slate-400 tracking-wider mb-1.5">
                    Observed Content Activities:
                  </strong>
                  <div className="flex flex-wrap gap-2">
                    {eod.competitorResearch.observedActivities.map((act, i) => (
                      <span
                        key={i}
                        className="px-2.5 py-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-medium text-slate-700 dark:text-slate-300 shadow-2xs"
                      >
                        {act}
                      </span>
                    ))}
                  </div>
                </div>
                {eod.competitorResearch.potentialOrganicStrategy && (
                  <div>
                    <strong className="block text-xs uppercase text-primary-700 tracking-wider mb-1">
                      Potential Organic Strategy to Test:
                    </strong>
                    <p className="text-slate-800 dark:text-slate-200 bg-white dark:bg-slate-900 p-3 rounded-lg border border-primary-100 text-sm">
                      {eod.competitorResearch.potentialOrganicStrategy}
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Section 4: Tomorrow's Priorities */}
          {eod && (
            <div className="mb-4">
              <h2 className="text-base font-bold text-slate-800 dark:text-slate-200 border-b border-slate-200 dark:border-slate-700 pb-2 mb-4 flex items-center gap-2">
                <span>🎯</span> 4. Tomorrow&apos;s Focus & Priority
              </h2>
              <div className="p-4 bg-primary-50/50 rounded-xl border border-primary-200 text-sm text-slate-800 dark:text-slate-200 font-medium">
                {eod.summary.tomorrowsPriority || "Continue prospecting and follow-ups."}
              </div>
            </div>
          )}

          {/* Document Footer */}
          <div className="mt-12 pt-4 border-t border-slate-200 dark:border-slate-700 flex justify-between items-center text-xs text-slate-400">
            <span>Automated Daily Report System</span>
            <span>Confidential & Internal</span>
          </div>
        </div>
      </div>
    </div>
  );
};
