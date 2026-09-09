import { MorningGoal, EODReport, DailyRecord } from "@/types/report";
import { getTodayDateString, getOffsetDateString } from "./formatters";

export const createDefaultMorningGoal = (dateStr: string): MorningGoal => ({
  date: dateStr,
  leadGeneration: {
    targetLeadsToFind: 2400,
    targetProspectsToContact: 0,
    targetFollowUps: 50,
    targetPositiveResponses: 20,
    targetSeriousProspects: 20,
    targetOnboardingDiscussions: 15,
    notes: "(bponi store sheets)",
    customItems: [],
  },
  clientOnboarding: {
    targetFollowUpExisting: "Follow up with previous prospects who showed interest",
    targetOnboardingConversions: 1,
    notes: "Offer free trial and demo setup",
    customItems: [],
  },
  customerSupport: {
    targetCallsAndMessages: 5,
    targetPendingIssuesToResolve: 3,
    targetFollowUpsUnresolved: 2,
    notes: "Prioritize client checkout and syncing issues",
    customItems: [],
  },
  competitorResearch: {
    targetCompetitorsToCheck: 4,
    contentTypesToTrack: [
      "Storex regular client feedback stories",
      "Zatic Easy feature videos",
      "Customer testimonials & case studies",
      "Promotional offers & free trials",
    ],
    organicLeadGenMethodsToIdentify: "Identify short video Hooks & e-commerce case study frameworks",
    notes: "Check Facebook Ads Library and Instagram profiles",
    customItems: [],
  },
  customSections: [],
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
});

export const createDefaultEODReport = (
  dateStr: string,
  morningGoal?: MorningGoal
): EODReport => ({
  date: dateStr,
  leadGeneration: {
    leadsFound: 280,
    prospectsContacted: 0,
    leadsFollowedUp: 5,
    positiveResponses: 2,
    seriousProspects: 2,
    onboardingDiscussions: 1,
    notes: "(no ads running, no organic client yet)",
    customItems: [],
  },
  customerSupport: {
    callsHandled: 3,
    issuesResolved: 3,
    pendingIssues: 2,
    followUpsRequired: 2,
    notes: "",
    callsHandledNote: "karokbd, eswaponi, fariwala24 (new lead contacted 10)",
    issuesResolvedNote: "live well fresh, eswapno, fariwala24",
    pendingIssuesNote: "munjia perfume, fariwala24 in docs",
    customItems: [],
  },
  competitorResearch: {
    competitorsChecked: 4,
    observedActivities: [
      "Storex do regular client feedback story",
      "Zatic Easy Regularly post feature video",
    ],
    potentialOrganicStrategy:
      "Manage Fariwala24 to receive feedback story video instead of free landing page",
    notes: "",
    customItems: [],
    findings: [
      {
        id: "comp-1",
        checked: true,
        topic: "feature video",
        content: "feature video of wholesaler in bponi store admin panel",
        competitorName: "Zatic Easy",
        observedActivity: "Zatic Easy Regularly post feature video",
        myAction: "feature video of wholesaler in bponi store admin panel",
        nextNeed: "Edit from azman and post it",
      },
      {
        id: "comp-2",
        checked: true,
        topic: "take customer reviews",
        content: "manage fariwal24 client for review",
        competitorName: "Storex",
        observedActivity: "Storex do regular client feedback story",
        myAction: "manage fariwal24 client for review",
        nextNeed: "",
      },
      {
        id: "comp-3",
        checked: true,
        topic: "educational video",
        content: "i make how to upload slider in admin panel",
        competitorName: "",
        observedActivity: "Educational how-to video",
        myAction: "i make how to upload slider in admin panel",
        nextNeed: "",
      },
    ],
  },
  summary: {
    totalLeadsFound: 280,
    totalContacted: 0,
    followUps: 5,
    positiveResponses: 2,
    newOnboardingProspects: 2,
    customerIssuesHandled: 3,
    competitorActivitiesFound: "Storex feedback stories, Zatic Easy feature videos",
    tomorrowsPriority: "Close 2 serious prospects, edit azman wholesaling video, follow up with munjia perfume docs",
  },
  customSections: [],
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
});

export const getInitialDemoRecords = (): Record<string, DailyRecord> => {
  const today = getTodayDateString();
  const yesterday = getOffsetDateString(today, -1);
  const prevDay = getOffsetDateString(today, -2);

  const goalToday = createDefaultMorningGoal(today);
  const eodToday = createDefaultEODReport(today, goalToday);

  const goalYesterday = createDefaultMorningGoal(yesterday);
  goalYesterday.leadGeneration.targetLeadsToFind = 15;
  const eodYesterday: EODReport = {
    date: yesterday,
    leadGeneration: {
      leadsFound: 16,
      prospectsContacted: 10,
      leadsFollowedUp: 9,
      positiveResponses: 2,
      seriousProspects: 1,
      onboardingDiscussions: 1,
      notes: "Direct outreach to Shopify sellers",
      customItems: [],
    },
    customerSupport: {
      callsHandled: 4,
      issuesResolved: 4,
      pendingIssues: 0,
      followUpsRequired: 1,
      notes: "All customer inquiries resolved within SLA",
      customItems: [],
    },
    competitorResearch: {
      competitorsChecked: 3,
      observedActivities: [
        "Product launch discount posts",
        "How-to carousel posts on LinkedIn",
      ],
      potentialOrganicStrategy:
        "Infographics breaking down common seller pitfalls",
      notes: "",
      customItems: [],
    },
    summary: {
      totalLeadsFound: 16,
      totalContacted: 10,
      followUps: 9,
      positiveResponses: 2,
      newOnboardingProspects: 1,
      customerIssuesHandled: 4,
      competitorActivitiesFound: "Carousel infographics and promo codes",
      tomorrowsPriority: "Scale up lead generation to 18-20 leads",
    },
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    updatedAt: new Date(Date.now() - 86400000).toISOString(),
  };

  const goalPrevDay = createDefaultMorningGoal(prevDay);
  const eodPrevDay: EODReport = {
    date: prevDay,
    leadGeneration: {
      leadsFound: 14,
      prospectsContacted: 8,
      leadsFollowedUp: 7,
      positiveResponses: 2,
      seriousProspects: 2,
      onboardingDiscussions: 0,
      notes: "Initial outreach sprint",
      customItems: [],
    },
    customerSupport: {
      callsHandled: 6,
      issuesResolved: 5,
      pendingIssues: 1,
      followUpsRequired: 2,
      notes: "High volume of questions regarding shipping integration",
      customItems: [],
    },
    competitorResearch: {
      competitorsChecked: 3,
      observedActivities: [
        "Video walkthroughs of onboarding process",
      ],
      potentialOrganicStrategy:
        "Create 60-second onboarding teaser clips",
      notes: "",
      customItems: [],
    },
    summary: {
      totalLeadsFound: 14,
      totalContacted: 8,
      followUps: 7,
      positiveResponses: 2,
      newOnboardingProspects: 2,
      customerIssuesHandled: 6,
      competitorActivitiesFound: "Short product walkthroughs",
      tomorrowsPriority: "Improve onboarding conversion rate",
    },
    createdAt: new Date(Date.now() - 172800000).toISOString(),
    updatedAt: new Date(Date.now() - 172800000).toISOString(),
  };

  return {
    [today]: {
      id: today,
      date: today,
      morningGoal: goalToday,
      eodReport: eodToday,
      hasMorningGoal: true,
      hasEODReport: true,
      updatedAt: new Date().toISOString(),
    },
    [yesterday]: {
      id: yesterday,
      date: yesterday,
      morningGoal: goalYesterday,
      eodReport: eodYesterday,
      hasMorningGoal: true,
      hasEODReport: true,
      updatedAt: new Date(Date.now() - 86400000).toISOString(),
    },
    [prevDay]: {
      id: prevDay,
      date: prevDay,
      morningGoal: goalPrevDay,
      eodReport: eodPrevDay,
      hasMorningGoal: true,
      hasEODReport: true,
      updatedAt: new Date(Date.now() - 172800000).toISOString(),
    },
  };
};
