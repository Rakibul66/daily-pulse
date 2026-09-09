import { MorningGoal, EODReport, AggregatedMetrics, DailyRecord } from "@/types/report";

export const getTodayDateString = (): string => {
  try {
    return new Intl.DateTimeFormat("en-CA", {
      timeZone: "Asia/Dhaka",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }).format(new Date());
  } catch {
    const d = new Date();
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${y}-${m}-${day}`;
  }
};

export const getOffsetDateString = (baseDateStr: string, daysOffset: number): string => {
  try {
    const [y, m, d] = baseDateStr.split("-").map(Number);
    const date = new Date(Date.UTC(y, m - 1, d));
    date.setUTCDate(date.getUTCDate() + daysOffset);
    return date.toISOString().split("T")[0];
  } catch {
    return baseDateStr;
  }
};

export const WORKED_THRESHOLD_PCT = 50;

export interface DailyWorkProgress {
  percentage: number;
  isWorked: boolean;
  activeMetricsCount: number;
  completedMetricsCount: number;
  summaryText: string;
}

export const calculateDailyWorkProgress = (
  goal?: MorningGoal | null,
  report?: EODReport | null
): DailyWorkProgress => {
  if (!report) {
    return {
      percentage: 0,
      isWorked: false,
      activeMetricsCount: 0,
      completedMetricsCount: 0,
      summaryText: "No work logged",
    };
  }

  const g = goal;
  const pairs: { act: number; target: number; label: string }[] = [];

  // 1. Lead Generation Metrics
  if (g?.leadGeneration?.targetLeadsToFind && g.leadGeneration.targetLeadsToFind > 0) {
    pairs.push({
      act: Number(report.leadGeneration?.leadsFound) || 0,
      target: g.leadGeneration.targetLeadsToFind,
      label: "Leads Available",
    });
  }

  if (g?.leadGeneration?.targetProspectsToContact && g.leadGeneration.targetProspectsToContact > 0) {
    pairs.push({
      act: Number(report.leadGeneration?.prospectsContacted) || 0,
      target: g.leadGeneration.targetProspectsToContact,
      label: "Prospects Contacted",
    });
  }

  const fuTarget = g?.leadGeneration?.targetFollowUps || 50;
  if (fuTarget > 0) {
    pairs.push({
      act: Number(report.leadGeneration?.leadsFollowedUp) || 0,
      target: fuTarget,
      label: "Follow-ups",
    });
  }

  const posTarget = g?.leadGeneration?.targetPositiveResponses || 20;
  if (posTarget > 0) {
    pairs.push({
      act: Number(report.leadGeneration?.positiveResponses) || 0,
      target: posTarget,
      label: "Positive Responses",
    });
  }

  const serTarget = g?.leadGeneration?.targetSeriousProspects || 20;
  if (serTarget > 0) {
    pairs.push({
      act: Number(report.leadGeneration?.seriousProspects) || 0,
      target: serTarget,
      label: "Serious Prospects",
    });
  }

  const onbTarget = g?.leadGeneration?.targetOnboardingDiscussions || 15;
  if (onbTarget > 0) {
    pairs.push({
      act: Number(report.leadGeneration?.onboardingDiscussions) || 0,
      target: onbTarget,
      label: "Onboarding Discussions",
    });
  }

  // 2. Customer Support Metrics
  const callsTarget = g?.customerSupport?.targetCallsAndMessages || 5;
  if (callsTarget > 0) {
    pairs.push({
      act: Number(report.customerSupport?.callsHandled) || 0,
      target: callsTarget,
      label: "Calls Handled",
    });
  }

  const issuesTarget = g?.customerSupport?.targetPendingIssuesToResolve || 3;
  if (issuesTarget > 0) {
    pairs.push({
      act: Number(report.customerSupport?.issuesResolved) || 0,
      target: issuesTarget,
      label: "Issues Resolved",
    });
  }

  // 3. Competitor Research Metrics
  const compTarget = g?.competitorResearch?.targetCompetitorsToCheck || 4;
  if (compTarget > 0) {
    const compActual = Math.max(
      Number(report.competitorResearch?.competitorsChecked) || 0,
      report.competitorResearch?.findings?.length || 0
    );
    pairs.push({
      act: compActual,
      target: compTarget,
      label: "Competitors Checked",
    });
  }

  if (pairs.length === 0) {
    return {
      percentage: 0,
      isWorked: false,
      activeMetricsCount: 0,
      completedMetricsCount: 0,
      summaryText: "No targets set",
    };
  }

  let totalPct = 0;
  let completedCount = 0;

  pairs.forEach((p) => {
    const ratio = (p.act / p.target) * 100;
    const capped = Math.min(100, Math.max(0, ratio));
    totalPct += capped;
    if (capped >= 50) {
      completedCount++;
    }
  });

  const percentage = Math.round(totalPct / pairs.length);
  const isWorked = percentage >= WORKED_THRESHOLD_PCT;

  return {
    percentage,
    isWorked,
    activeMetricsCount: pairs.length,
    completedMetricsCount: completedCount,
    summaryText: isWorked
      ? `Worked (${percentage}%)`
      : `${percentage}% (Below ${WORKED_THRESHOLD_PCT}%)`,
  };
};

export const formatDateDisplay = (dateStr: string): string => {
  try {
    const [year, month, day] = dateStr.split("-").map(Number);
    const date = new Date(year, month - 1, day);
    return date.toLocaleDateString("en-US", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  } catch {
    return dateStr;
  }
};

export const formatMorningGoalText = (goal: MorningGoal): string => {
  const formattedDate = formatDateDisplay(goal.date);

  let text = `**Daily Work Goal – ${formattedDate}**\n\n`;

  text += `**1. Lead Generation**\n\n`;
  text += `* Find ${goal.leadGeneration.targetLeadsToFind} potential e-commerce/business leads.\n`;
  text += `* Contact at least ${goal.leadGeneration.targetProspectsToContact} qualified prospects.\n`;
  text += `* Follow up with previous interested leads ${goal.leadGeneration.targetFollowUps}.\n`;
  if (goal.leadGeneration.notes) {
    text += `* Note: ${goal.leadGeneration.notes}\n`;
  }
  goal.leadGeneration.customItems.forEach((item) => {
    text += `* ${item.label}: ${item.value}\n`;
  });

  text += `\n**2. Client Onboarding**\n\n`;
  text += `* ${goal.clientOnboarding.targetFollowUpExisting}\n`;
  text += `* Try to convert at least ${goal.clientOnboarding.targetOnboardingConversions} prospect into an onboarding/client discussion.\n`;
  if (goal.clientOnboarding.notes) {
    text += `* Note: ${goal.clientOnboarding.notes}\n`;
  }
  goal.clientOnboarding.customItems.forEach((item) => {
    text += `* ${item.label}: ${item.value}\n`;
  });

  text += `\n**3. Customer Support**\n\n`;
  text += `* Handle customer calls/messages (${goal.customerSupport.targetCallsAndMessages} planned).\n`;
  text += `* Resolve pending customer issues (${goal.customerSupport.targetPendingIssuesToResolve} planned).\n`;
  text += `* Follow up with customers who have unresolved problems (${goal.customerSupport.targetFollowUpsUnresolved} planned).\n`;
  if (goal.customerSupport.notes) {
    text += `* Note: ${goal.customerSupport.notes}\n`;
  }
  goal.customerSupport.customItems.forEach((item) => {
    text += `* ${item.label}: ${item.value}\n`;
  });

  text += `\n**4. Competitor Research**\n\n`;
  text += `* Check ${goal.competitorResearch.targetCompetitorsToCheck} competitors/platforms.\n`;
  text += `* Track what type of content they are posting:\n`;
  goal.competitorResearch.contentTypesToTrack.forEach((ct) => {
    text += `  * ${ct}\n`;
  });
  if (goal.competitorResearch.organicLeadGenMethodsToIdentify) {
    text += `* Identify their organic lead-generation methods: ${goal.competitorResearch.organicLeadGenMethodsToIdentify}\n`;
  }
  if (goal.competitorResearch.notes) {
    text += `* Note: ${goal.competitorResearch.notes}\n`;
  }
  goal.competitorResearch.customItems.forEach((item) => {
    text += `* ${item.label}: ${item.value}\n`;
  });

  if (goal.customSections && goal.customSections.length > 0) {
    goal.customSections.forEach((section, idx) => {
      text += `\n**${5 + idx}. ${section.title}**\n\n`;
      section.items.forEach((item) => {
        text += `* ${item.label}: ${item.value}\n`;
      });
    });
  }

  return text;
};

export const formatEODReportText = (eod: EODReport): string => {
  const formattedDate = formatDateDisplay(eod.date);

  let text = `**End-of-Day Work Update – ${formattedDate}**\n\n`;

  text += `🎯 **Lead Generation**\n\n`;
  text += `* Leads found: ${eod.leadGeneration.leadsFound}\n`;
  text += `* New prospects contacted: ${eod.leadGeneration.prospectsContacted}\n`;
  text += `* Previous leads followed up: ${eod.leadGeneration.leadsFollowedUp}\n`;
  text += `* Positive responses: ${eod.leadGeneration.positiveResponses}\n`;
  text += `* Serious/interested prospects: ${eod.leadGeneration.seriousProspects}\n`;
  text += `* Onboarding discussions: ${eod.leadGeneration.onboardingDiscussions}\n`;
  if (eod.leadGeneration.notes) {
    text += `* Note: ${eod.leadGeneration.notes}\n`;
  }
  eod.leadGeneration.customItems.forEach((item) => {
    text += `* ${item.label}: ${item.value}\n`;
  });

  text += `\n📞 **Customer Support**\n\n`;
  text += `* Customer calls handled: ${eod.customerSupport.callsHandled}${eod.customerSupport.callsHandledNote ? ` (${eod.customerSupport.callsHandledNote})` : ""}\n`;
  text += `* Customer issues resolved: ${eod.customerSupport.issuesResolved}${eod.customerSupport.issuesResolvedNote ? ` (${eod.customerSupport.issuesResolvedNote})` : ""}\n`;
  text += `* Pending issues: ${eod.customerSupport.pendingIssues}${eod.customerSupport.pendingIssuesNote ? ` (${eod.customerSupport.pendingIssuesNote})` : ""}\n`;
  text += `* Follow-ups required: ${eod.customerSupport.followUpsRequired}\n`;
  if (eod.customerSupport.notes) {
    text += `* Note: ${eod.customerSupport.notes}\n`;
  }
  eod.customerSupport.customItems.forEach((item) => {
    text += `* ${item.label}: ${item.value}\n`;
  });

  text += `\n📊 **Competitor Research**\n\n`;
  text += `* Competitors checked: ${eod.competitorResearch.competitorsChecked}\n`;
  text += `* Observed activities:\n`;
  eod.competitorResearch.observedActivities.forEach((act) => {
    text += `  * ${act}\n`;
  });
  if (eod.competitorResearch.potentialOrganicStrategy) {
    text += `* Potential organic strategy we can test: ${eod.competitorResearch.potentialOrganicStrategy}\n`;
  }
  if (eod.competitorResearch.notes) {
    text += `* Note: ${eod.competitorResearch.notes}\n`;
  }
  eod.competitorResearch.customItems.forEach((item) => {
    text += `* ${item.label}: ${item.value}\n`;
  });

  text += `\n📋 **End-of-Day Summary**\n\n`;
  text += `* Total leads found: ${eod.summary.totalLeadsFound}\n`;
  text += `* Total contacted: ${eod.summary.totalContacted}\n`;
  text += `* Follow-ups: ${eod.summary.followUps}\n`;
  text += `* Positive responses: ${eod.summary.positiveResponses}\n`;
  text += `* New onboarding prospects: ${eod.summary.newOnboardingProspects}\n`;
  text += `* Customer issues handled: ${eod.summary.customerIssuesHandled}\n`;
  if (eod.summary.competitorActivitiesFound) {
    text += `* Competitor activities found: ${eod.summary.competitorActivitiesFound}\n`;
  }
  text += `* Tomorrow's priority: ${eod.summary.tomorrowsPriority}\n`;

  if (eod.customSections && eod.customSections.length > 0) {
    eod.customSections.forEach((section) => {
      text += `\n📌 **${section.title}**\n\n`;
      section.items.forEach((item) => {
        text += `* ${item.label}: ${item.value}\n`;
      });
    });
  }

  return text;
};

export const formatRangeReportText = (
  rangeLabel: string,
  startDate: string,
  endDate: string,
  metrics: AggregatedMetrics,
  records: DailyRecord[]
): string => {
  let text = `📈 **Work Performance Report (${rangeLabel})**\n`;
  text += `📅 Period: ${formatDateDisplay(startDate)} - ${formatDateDisplay(endDate)}\n`;
  text += `🗓️ Active Days Tracked: ${metrics.totalDays}\n\n`;

  text += `🎯 **Lead Generation & Sales Highlights**\n`;
  text += `* Total Leads Found: ${metrics.totalLeadsFound}\n`;
  text += `* Total Prospects Contacted: ${metrics.totalProspectsContacted}\n`;
  text += `* Total Follow-ups Completed: ${metrics.totalFollowUps}\n`;
  text += `* Total Positive Responses: ${metrics.totalPositiveResponses} (${metrics.responseRate.toFixed(1)}% Response Rate)\n`;
  text += `* Serious / Interested Prospects: ${metrics.totalSeriousProspects}\n`;
  text += `* Total Onboarding Discussions: ${metrics.totalOnboardingDiscussions} (${metrics.conversionRate.toFixed(1)}% Conversion)\n\n`;

  text += `📞 **Customer Support Highlights**\n`;
  text += `* Total Customer Calls & Messages: ${metrics.totalCallsHandled}\n`;
  text += `* Total Issues Resolved: ${metrics.totalIssuesResolved} (${metrics.issueResolutionRate.toFixed(1)}% Resolution Rate)\n`;
  text += `* Total Pending Issues Remaining: ${metrics.totalPendingIssues}\n\n`;

  text += `📊 **Market & Competitor Insights**\n`;
  text += `* Total Competitor Audits: ${metrics.totalCompetitorsChecked}\n\n`;

  text += `🗓️ **Day-by-Day Breakdown:**\n`;
  records.forEach((r) => {
    const eod = r.eodReport;
    if (eod) {
      text += `• ${formatDateDisplay(r.date)}: ${eod.leadGeneration.leadsFound} leads found | ${eod.leadGeneration.prospectsContacted} contacted | ${eod.leadGeneration.onboardingDiscussions} onboardings | Priority: ${eod.summary.tomorrowsPriority.slice(0, 50)}...\n`;
    }
  });

  return text;
};

export const formatBossComparisonReportText = (
  goal: MorningGoal,
  eod: EODReport
): string => {
  const calcPct = (act: number, target: number) => {
    if (!target || target === 0) return "";
    const pct = ((act / target) * 100).toFixed(1);
    return ` (${pct}%)`;
  };

  const formattedDate = formatDateDisplay(eod.date);

  let text = `<u>DAILY WORK UPDATE</u>\n`;
  text += `<u>Date: ${formattedDate}</u>\n\n`;
  text += `────────────────────────────\n\n`;
  text += `🎯 *Lead Generation*\n\n`;

  const leadGoal = goal.leadGeneration.targetLeadsToFind || 0;
  const leadAct = eod.leadGeneration.leadsFound || 0;
  text += `* Leads available: ${leadAct}${leadGoal ? ` (Goal: ${leadGoal}${goal.leadGeneration.notes ? ` ${goal.leadGeneration.notes}` : ""})` : ""}\n`;

  const contactAct = eod.leadGeneration.prospectsContacted || 0;
  text += `* New prospects contacted: ${contactAct}${eod.leadGeneration.notes ? ` ${eod.leadGeneration.notes}` : ""}\n`;

  const fuGoal = goal.leadGeneration.targetFollowUps || 50;
  const fuAct = eod.leadGeneration.leadsFollowedUp || 0;
  text += `* Previous leads followed up: ${fuAct} / ${fuGoal}${calcPct(fuAct, fuGoal)}\n`;

  const posGoal = goal.leadGeneration.targetPositiveResponses || 20;
  const posAct = eod.leadGeneration.positiveResponses || 0;
  text += `* Positive responses: ${posAct} / ${posGoal}${calcPct(posAct, posGoal)}\n`;

  const serGoal = goal.leadGeneration.targetSeriousProspects || 20;
  const serAct = eod.leadGeneration.seriousProspects || 0;
  text += `* Serious/interested prospects: ${serAct} / ${serGoal}${calcPct(serAct, serGoal)}\n`;

  const onbGoal = goal.leadGeneration.targetOnboardingDiscussions || 15;
  const onbAct = eod.leadGeneration.onboardingDiscussions || 0;
  text += `* Onboarding discussions: ${onbAct} / ${onbGoal}${calcPct(onbAct, onbGoal)}\n`;

  text += `\n📞 *Customer Support*\n\n`;
  const callsCount = eod.customerSupport.callsHandled || 0;
  const callsNote = eod.customerSupport.callsHandledNote;
  let callsDisplay = "";
  if (callsCount > 0 && callsNote) {
    callsDisplay = `${callsCount} (${callsNote})`;
  } else if (callsNote) {
    callsDisplay = callsNote;
  } else {
    callsDisplay = `${callsCount} calls`;
  }
  text += `* Customer calls handled: ${callsDisplay}\n`;
  text += `* Customer issues resolved: ${eod.customerSupport.issuesResolved}${eod.customerSupport.issuesResolvedNote ? ` (${eod.customerSupport.issuesResolvedNote})` : ""}\n`;
  const pendingCount = eod.customerSupport.pendingIssues || 0;
  const pendingNote = eod.customerSupport.pendingIssuesNote;
  let pendingDisplay = "";
  if (pendingCount > 0 && pendingNote) {
    pendingDisplay = `${pendingCount} (${pendingNote})`;
  } else if (pendingNote) {
    pendingDisplay = pendingNote;
  } else {
    pendingDisplay = `${pendingCount} pending`;
  }
  text += `* Pending issues: ${pendingDisplay}\n`;

  text += `\n📊 *Competitor Research*\n\n`;
  if (eod.competitorResearch.findings && eod.competitorResearch.findings.length > 0) {
    eod.competitorResearch.findings.forEach((item, idx) => {
      const topicStr = item.topic || item.observedActivity || "";
      const contentStr = item.content || item.myAction || "";
      const compPrefix = item.competitorName ? `${item.competitorName} — ` : "";

      if (item.topic || item.content) {
        text += `${idx + 1}.${compPrefix}topic:${topicStr}\n`;
        if (contentStr) {
          text += `content:${contentStr}\n`;
        }
        if (item.nextNeed) {
          text += `Need:${item.nextNeed}\n`;
        }
        text += `\n`;
      } else {
        text += `${idx + 1}.${item.competitorName ? `${item.competitorName} do ` : ""}${item.observedActivity}\n`;
        if (item.myAction) text += `My Action: ${item.myAction}\n`;
        if (item.nextNeed) text += `Need: ${item.nextNeed}\n\n`;
      }
    });
  } else if (eod.competitorResearch.observedActivities.length > 0) {
    eod.competitorResearch.observedActivities.forEach((act, idx) => {
      text += `${idx + 1}.${act}\n`;
    });
    if (eod.competitorResearch.potentialOrganicStrategy) {
      text += `My Action: ${eod.competitorResearch.potentialOrganicStrategy}\n`;
    }
  } else {
    text += `* Competitors checked: ${eod.competitorResearch.competitorsChecked}\n`;
  }

  return text;
};

export const formatBossComparisonReportMarkdownTable = (
  goal: MorningGoal,
  eod: EODReport
): string => {
  const formattedDate = formatDateDisplay(eod.date);

  const calcPctVal = (act: number, target: number): string => {
    if (!target || target === 0) return "—";
    const pct = ((act / target) * 100).toFixed(1);
    return `${pct}%`;
  };

  let md = `<div align="center">\n\n`;
  md += `# <u>DAILY WORK UPDATE</u>\n`;
  md += `### <u>Date: ${formattedDate}</u>\n\n`;
  md += `</div>\n\n`;
  md += `────────────────────────────────────────────────────────────\n\n`;

  // 1. Lead Generation Table
  md += `### 🎯 Lead Generation\n\n`;
  md += `| Metric | Target | Actual | Achievement | Notes / Details |\n`;
  md += `| :--- | :---: | :---: | :---: | :--- |\n`;

  const leadGoal = goal.leadGeneration.targetLeadsToFind || 0;
  const leadAct = eod.leadGeneration.leadsFound || 0;
  const leadNote = goal.leadGeneration.notes || "";
  const leadPct = leadGoal > 0 ? calcPctVal(leadAct, leadGoal) : "—";
  md += `| **Leads Available** | ${leadGoal || "—"} | ${leadAct} | ${leadPct} | ${leadNote || "—"} |\n`;

  const contactAct = eod.leadGeneration.prospectsContacted || 0;
  const contactNote = eod.leadGeneration.notes || "";
  md += `| **New Prospects Contacted** | — | ${contactAct} | — | ${contactNote || "—"} |\n`;

  const fuGoal = goal.leadGeneration.targetFollowUps || 50;
  const fuAct = eod.leadGeneration.leadsFollowedUp || 0;
  md += `| **Previous Leads Followed Up** | ${fuGoal} | ${fuAct} | ${calcPctVal(fuAct, fuGoal)} | — |\n`;

  const posGoal = goal.leadGeneration.targetPositiveResponses || 20;
  const posAct = eod.leadGeneration.positiveResponses || 0;
  md += `| **Positive Responses** | ${posGoal} | ${posAct} | ${calcPctVal(posAct, posGoal)} | — |\n`;

  const serGoal = goal.leadGeneration.targetSeriousProspects || 20;
  const serAct = eod.leadGeneration.seriousProspects || 0;
  md += `| **Serious / Interested Prospects** | ${serGoal} | ${serAct} | ${calcPctVal(serAct, serGoal)} | — |\n`;

  const onbGoal = goal.leadGeneration.targetOnboardingDiscussions || 15;
  const onbAct = eod.leadGeneration.onboardingDiscussions || 0;
  md += `| **Onboarding Discussions** | ${onbGoal} | ${onbAct} | ${calcPctVal(onbAct, onbGoal)} | — |\n`;

  // 2. Customer Support Table
  md += `\n### 📞 Customer Support\n\n`;
  md += `| Activity / Task | Count | Client Names & Details |\n`;
  md += `| :--- | :---: | :--- |\n`;

  const callsCount = eod.customerSupport.callsHandled || 0;
  const callsNote = eod.customerSupport.callsHandledNote || "—";
  md += `| **Customer Calls Handled** | ${callsCount} | ${callsNote} |\n`;

  const issuesResolved = eod.customerSupport.issuesResolved || 0;
  const issuesNote = eod.customerSupport.issuesResolvedNote || "—";
  md += `| **Customer Issues Resolved** | ${issuesResolved} | ${issuesNote} |\n`;

  const pendingCount = eod.customerSupport.pendingIssues || 0;
  const pendingNote = eod.customerSupport.pendingIssuesNote || "—";
  md += `| **Pending Issues** | ${pendingCount} | ${pendingNote} |\n`;

  // 3. Competitor Research Table
  md += `\n### 📊 Competitor Research\n\n`;
  if (eod.competitorResearch.findings && eod.competitorResearch.findings.length > 0) {
    md += `| # | Competitor | Topic | Content / Observation | Need / Requirement |\n`;
    md += `| :-: | :--- | :--- | :--- | :--- |\n`;
    eod.competitorResearch.findings.forEach((item, idx) => {
      const compName = item.competitorName && item.competitorName.trim() ? item.competitorName.trim() : "—";
      const topicStr = (item.topic || item.observedActivity || "—").replace(/\|/g, "/");
      const contentStr = (item.content || item.myAction || "—").replace(/\|/g, "/").replace(/\n/g, " ");
      const needStr = (item.nextNeed || "—").replace(/\|/g, "/");
      md += `| ${idx + 1} | ${compName} | ${topicStr} | ${contentStr} | ${needStr} |\n`;
    });
  } else if (eod.competitorResearch.observedActivities && eod.competitorResearch.observedActivities.length > 0) {
    md += `| # | Activity / Observation | Action Taken |\n`;
    md += `| :-: | :--- | :--- |\n`;
    eod.competitorResearch.observedActivities.forEach((act, idx) => {
      md += `| ${idx + 1} | ${act.replace(/\|/g, "/")} | ${eod.competitorResearch.potentialOrganicStrategy ? eod.competitorResearch.potentialOrganicStrategy.replace(/\|/g, "/") : "—"} |\n`;
    });
  } else {
    md += `*No competitor research logged for this date.*\n`;
  }

  return md;
};
