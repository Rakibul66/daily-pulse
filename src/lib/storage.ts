import { doc, getDoc, setDoc, collection, getDocs, query, where } from "firebase/firestore";
import { getFirebaseServices } from "./firebase";
import { sanitizeForFirestore } from "./firestoreUtils";
import { DailyRecord, MorningGoal, EODReport, AggregatedMetrics } from "@/types/report";
import { createDefaultMorningGoal, createDefaultEODReport, getInitialDemoRecords } from "./defaultData";
import { getTodayDateString } from "./formatters";

const FIRESTORE_TIMEOUT_MS = 2500;

const withTimeout = <T>(promise: Promise<T>, timeoutMs: number): Promise<T> => {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => {
      reject(new Error("Firestore operation timed out"));
    }, timeoutMs);

    promise
      .then((res) => {
        clearTimeout(timer);
        resolve(res);
      })
      .catch((err) => {
        clearTimeout(timer);
        reject(err);
      });
  });
};

const getStorageKey = (userId?: string | null): string => {
  return userId ? `daily_pulse_records_${userId}` : "daily_pulse_records_guest";
};

export const getLocalRecords = (userId?: string | null): Record<string, DailyRecord> => {
  if (typeof window === "undefined") return {};
  const key = getStorageKey(userId);
  try {
    const raw = localStorage.getItem(key);
    if (!raw) {
      const initial = getInitialDemoRecords();
      localStorage.setItem(key, JSON.stringify(initial));
      return initial;
    }
    const parsed = JSON.parse(raw);
    const today = getTodayDateString();
    if (!userId && !parsed[today]) {
      const initial = getInitialDemoRecords();
      const merged = { ...parsed, ...initial };
      localStorage.setItem(key, JSON.stringify(merged));
      return merged;
    }
    return parsed;
  } catch (e) {
    console.error("Failed to parse local records:", e);
    return {};
  }
};

const saveLocalRecords = (records: Record<string, DailyRecord>, userId?: string | null): void => {
  if (typeof window === "undefined") return;
  const key = getStorageKey(userId);
  try {
    localStorage.setItem(key, JSON.stringify(records));
  } catch (e) {
    console.error("Failed to save local records:", e);
  }
};

export const getRecordForDate = async (
  dateStr: string,
  userId?: string | null
): Promise<DailyRecord> => {
  const local = getLocalRecords(userId);

  const { db } = getFirebaseServices();

  if (db && userId) {
    try {
      const docRef = doc(db, "users", userId, "daily_reports", dateStr);
      const snapshot = await withTimeout(getDoc(docRef), FIRESTORE_TIMEOUT_MS);
      if (snapshot.exists()) {
        const data = snapshot.data() as DailyRecord;
        local[dateStr] = data;
        saveLocalRecords(local, userId);
        return data;
      }
    } catch (err) {
      // Network unreachable or Firestore unavailable: fallback silently to local
      console.warn("Firestore unreachable, using local storage cache:", err);
    }
  }

  // Return cached local record
  if (local[dateStr]) {
    return local[dateStr];
  }

  // Create new blank record if not found
  const newGoal = createDefaultMorningGoal(dateStr);
  const newRecord: DailyRecord = {
    id: dateStr,
    date: dateStr,
    morningGoal: newGoal,
    hasMorningGoal: false,
    hasEODReport: false,
    updatedAt: new Date().toISOString(),
  };

  return newRecord;
};

export const saveMorningGoal = async (
  goal: MorningGoal,
  userId?: string | null
): Promise<DailyRecord> => {
  const dateStr = goal.date;
  const current = await getRecordForDate(dateStr, userId);

  const updated: DailyRecord = {
    ...current,
    morningGoal: goal,
    hasMorningGoal: true,
    updatedAt: new Date().toISOString(),
  };

  // 1. Save locally first for instant, guaranteed persistence
  const local = getLocalRecords(userId);
  local[dateStr] = updated;
  saveLocalRecords(local, userId);

  // 2. Sync to Firestore in the background
  const { db } = getFirebaseServices();
  if (db && userId) {
    try {
      await withTimeout(
        setDoc(doc(db, "users", userId, "daily_reports", dateStr), sanitizeForFirestore(updated), {
          merge: true,
        }),
        FIRESTORE_TIMEOUT_MS
      );
    } catch (err) {
      console.warn("Could not sync morning goal to Firestore backend (saved locally):", err);
    }
  }

  return updated;
};

export const saveEODReport = async (
  report: EODReport,
  userId?: string | null
): Promise<DailyRecord> => {
  const dateStr = report.date;
  const current = await getRecordForDate(dateStr, userId);

  const updated: DailyRecord = {
    ...current,
    eodReport: report,
    hasEODReport: true,
    updatedAt: new Date().toISOString(),
  };

  // 1. Save locally first for instant, guaranteed persistence
  const local = getLocalRecords(userId);
  local[dateStr] = updated;
  saveLocalRecords(local, userId);

  // 2. Sync to Firestore in the background
  const { db } = getFirebaseServices();
  if (db && userId) {
    try {
      await withTimeout(
        setDoc(doc(db, "users", userId, "daily_reports", dateStr), sanitizeForFirestore(updated), {
          merge: true,
        }),
        FIRESTORE_TIMEOUT_MS
      );
    } catch (err) {
      console.warn("Could not sync EOD report to Firestore backend (saved locally):", err);
    }
  }

  return updated;
};

export const saveGoalAndReport = async (
  goal: MorningGoal,
  report: EODReport,
  userId?: string | null
): Promise<DailyRecord> => {
  const dateStr = goal.date;
  const current = await getRecordForDate(dateStr, userId);

  const updated: DailyRecord = {
    ...current,
    morningGoal: goal,
    eodReport: report,
    hasMorningGoal: true,
    hasEODReport: true,
    updatedAt: new Date().toISOString(),
  };

  // 1. Save locally first for instant, guaranteed persistence
  const local = getLocalRecords(userId);
  local[dateStr] = updated;
  saveLocalRecords(local, userId);

  // 2. Sync to Firestore in the background
  const { db } = getFirebaseServices();
  if (db && userId) {
    try {
      await withTimeout(
        setDoc(doc(db, "users", userId, "daily_reports", dateStr), sanitizeForFirestore(updated), {
          merge: true,
        }),
        FIRESTORE_TIMEOUT_MS
      );
    } catch (err) {
      console.warn("Could not sync goal and report to Firestore backend (saved locally):", err);
    }
  }

  return updated;
};

export const getRecordsInRange = async (
  startDate: string,
  endDate: string,
  userId?: string | null
): Promise<DailyRecord[]> => {
  const { db } = getFirebaseServices();

  if (db && userId) {
    try {
      const colRef = collection(db, "users", userId, "daily_reports");
      const q = query(
        colRef,
        where("date", ">=", startDate),
        where("date", "<=", endDate)
      );
      const snapshot = await withTimeout(getDocs(q), FIRESTORE_TIMEOUT_MS);
      const list: DailyRecord[] = [];
      snapshot.forEach((d) => list.push(d.data() as DailyRecord));

      if (list.length > 0) {
        list.sort((a, b) => b.date.localeCompare(a.date));
        return list;
      }
    } catch (err) {
      console.warn("Firestore range query unavailable, using local storage:", err);
    }
  }

  // Fallback to local storage
  const local = getLocalRecords(userId);
  const list = Object.values(local).filter(
    (item) => item.date >= startDate && item.date <= endDate
  );
  list.sort((a, b) => b.date.localeCompare(a.date));
  return list;
};

export const calculateAggregatedMetrics = (records: DailyRecord[]): AggregatedMetrics => {
  let totalLeadsFound = 0;
  let totalProspectsContacted = 0;
  let totalFollowUps = 0;
  let totalPositiveResponses = 0;
  let totalSeriousProspects = 0;
  let totalOnboardingDiscussions = 0;
  let totalCallsHandled = 0;
  let totalIssuesResolved = 0;
  let totalPendingIssues = 0;
  let totalCompetitorsChecked = 0;

  let activeReportDays = 0;

  records.forEach((r) => {
    const eod = r.eodReport;
    if (eod && r.hasEODReport) {
      activeReportDays++;
      totalLeadsFound += Number(eod.leadGeneration.leadsFound) || 0;
      totalProspectsContacted += Number(eod.leadGeneration.prospectsContacted) || 0;
      totalFollowUps += Number(eod.leadGeneration.leadsFollowedUp) || 0;
      totalPositiveResponses += Number(eod.leadGeneration.positiveResponses) || 0;
      totalSeriousProspects += Number(eod.leadGeneration.seriousProspects) || 0;
      totalOnboardingDiscussions += Number(eod.leadGeneration.onboardingDiscussions) || 0;

      totalCallsHandled += Number(eod.customerSupport.callsHandled) || 0;
      totalIssuesResolved += Number(eod.customerSupport.issuesResolved) || 0;
      totalPendingIssues += Number(eod.customerSupport.pendingIssues) || 0;

      totalCompetitorsChecked += Number(eod.competitorResearch.competitorsChecked) || 0;
    }
  });

  const responseRate =
    totalProspectsContacted > 0
      ? (totalPositiveResponses / totalProspectsContacted) * 100
      : 0;

  const conversionRate =
    totalProspectsContacted > 0
      ? (totalOnboardingDiscussions / totalProspectsContacted) * 100
      : 0;

  const issueResolutionRate =
    totalCallsHandled > 0
      ? (totalIssuesResolved / totalCallsHandled) * 100
      : 0;

  return {
    totalDays: activeReportDays || records.length,
    totalLeadsFound,
    totalProspectsContacted,
    totalFollowUps,
    totalPositiveResponses,
    totalSeriousProspects,
    totalOnboardingDiscussions,
    totalCallsHandled,
    totalIssuesResolved,
    totalPendingIssues,
    totalCompetitorsChecked,
    responseRate,
    conversionRate,
    issueResolutionRate,
  };
};

export const saveCustomMorningTemplate = (
  goal: MorningGoal,
  userId?: string | null
): void => {
  if (typeof window !== "undefined") {
    const key = userId
      ? `daily_pulse_template_${userId}`
      : "daily_pulse_morning_template_v1";
    localStorage.setItem(key, JSON.stringify(goal));
  }
};

export const getCustomMorningTemplate = (userId?: string | null): MorningGoal | null => {
  if (typeof window === "undefined") return null;
  const key = userId
    ? `daily_pulse_template_${userId}`
    : "daily_pulse_morning_template_v1";
  try {
    const saved = localStorage.getItem(key);
    return saved ? JSON.parse(saved) : null;
  } catch {
    return null;
  }
};
