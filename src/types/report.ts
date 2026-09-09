export type TargetCategory = "leadGen" | "onboarding" | "support" | "competitor";

export interface DynamicItem {
  id: string;
  label: string;
  value: string | number;
  completed?: boolean;
  unit?: string;
  category?: TargetCategory;
  notes?: string;
  target?: number;
}

export interface MorningGoal {
  date: string; // YYYY-MM-DD
  leadGeneration: {
    targetLeadsToFind: number;
    targetProspectsToContact: number;
    targetFollowUps: number;
    targetPositiveResponses?: number;
    targetSeriousProspects?: number;
    targetOnboardingDiscussions?: number;
    notes?: string;
    customItems: DynamicItem[];
  };
  clientOnboarding: {
    targetFollowUpExisting: string;
    targetOnboardingConversions: number;
    notes?: string;
    customItems: DynamicItem[];
  };
  customerSupport: {
    targetCallsAndMessages: number;
    targetPendingIssuesToResolve: number;
    targetFollowUpsUnresolved: number;
    notes?: string;
    customItems: DynamicItem[];
  };
  competitorResearch: {
    targetCompetitorsToCheck: number;
    contentTypesToTrack: string[];
    organicLeadGenMethodsToIdentify: string;
    notes?: string;
    customItems: DynamicItem[];
  };
  customSections?: {
    id: string;
    title: string;
    items: DynamicItem[];
  }[];
  createdAt: string;
  updatedAt: string;
}

export interface CompetitorFindingItem {
  id: string;
  checked?: boolean;
  topic?: string;
  content?: string;
  competitorName?: string;
  observedActivity?: string;
  myAction?: string;
  nextNeed?: string;
}

export interface EODReport {
  date: string; // YYYY-MM-DD
  leadGeneration: {
    leadsFound: number;
    prospectsContacted: number;
    leadsFollowedUp: number;
    positiveResponses: number;
    seriousProspects: number;
    onboardingDiscussions: number;
    notes?: string;
    customItems: DynamicItem[];
  };
  customerSupport: {
    callsHandled: number;
    issuesResolved: number;
    pendingIssues: number;
    followUpsRequired: number;
    notes?: string;
    callsHandledNote?: string;
    issuesResolvedNote?: string;
    pendingIssuesNote?: string;
    customItems: DynamicItem[];
  };
  competitorResearch: {
    competitorsChecked: number;
    observedActivities: string[];
    potentialOrganicStrategy: string;
    notes?: string;
    customItems: DynamicItem[];
    findings?: CompetitorFindingItem[];
  };
  summary: {
    totalLeadsFound: number;
    totalContacted: number;
    followUps: number;
    positiveResponses: number;
    newOnboardingProspects: number;
    customerIssuesHandled: number;
    competitorActivitiesFound: string;
    tomorrowsPriority: string;
  };
  customSections?: {
    id: string;
    title: string;
    items: DynamicItem[];
  }[];
  createdAt: string;
  updatedAt: string;
}

export interface DailyRecord {
  id: string; // typically YYYY-MM-DD
  date: string; // YYYY-MM-DD
  morningGoal?: MorningGoal;
  eodReport?: EODReport;
  hasMorningGoal: boolean;
  hasEODReport: boolean;
  updatedAt: string;
}

export interface AggregatedMetrics {
  totalDays: number;
  totalLeadsFound: number;
  totalProspectsContacted: number;
  totalFollowUps: number;
  totalPositiveResponses: number;
  totalSeriousProspects: number;
  totalOnboardingDiscussions: number;
  totalCallsHandled: number;
  totalIssuesResolved: number;
  totalPendingIssues: number;
  totalCompetitorsChecked: number;
  responseRate: number; // percentage
  conversionRate: number; // percentage
  issueResolutionRate: number; // percentage
}

export interface FirebaseConfig {
  apiKey: string;
  authDomain: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
}
