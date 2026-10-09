import { collection, doc, getDocs, setDoc, updateDoc, deleteDoc, query, where, orderBy } from 'firebase/firestore';
import { getFirebaseServices } from './firebase';
import { sanitizeForFirestore } from './firestoreUtils';
import { Lead, DashboardMetrics } from '@/types/crm';

const COLLECTION_NAME = 'leads';

export const getLeads = async (userId: string, companyId?: string): Promise<Lead[]> => {
  const { db } = getFirebaseServices();
  if (!db) throw new Error('Firebase not configured');

  const q = query(
    collection(db, COLLECTION_NAME),
    where('userId', '==', userId)
  );

  const snapshot = await getDocs(q);
  const leads: Lead[] = [];
  const seenIds = new Set<string>();
  snapshot.forEach((docSnap) => {
    seenIds.add(docSnap.id);
    leads.push(docSnap.data() as Lead);
  });
  
  if (companyId && companyId !== userId) {
    try {
      const qCompany = query(
        collection(db, COLLECTION_NAME),
        where('companyId', '==', companyId)
      );
      const snapCompany = await getDocs(qCompany);
      snapCompany.forEach((docSnap) => {
        if (!seenIds.has(docSnap.id)) {
          seenIds.add(docSnap.id);
          leads.push(docSnap.data() as Lead);
        }
      });
    } catch (e) {
      console.warn('Company leads query error:', e);
    }
  }

  // Sort in memory by createdAt desc
  leads.sort((a, b) => new Date(b.createdAt || b.dateAdded || 0).getTime() - new Date(a.createdAt || a.dateAdded || 0).getTime());
  
  return leads;
};

export const addLead = async (lead: Omit<Lead, 'id' | 'createdAt' | 'updatedAt'>): Promise<Lead> => {
  const { db } = getFirebaseServices();
  if (!db) throw new Error('Firebase not configured');

  const newLeadRef = doc(collection(db, COLLECTION_NAME));
  const now = new Date().toISOString();
  const newLead: Lead = {
    ...lead,
    id: newLeadRef.id,
    createdAt: now,
    updatedAt: now,
  };

  await setDoc(newLeadRef, sanitizeForFirestore(newLead));
  return newLead;
};

export const updateLead = async (id: string, updates: Partial<Omit<Lead, 'id' | 'userId' | 'createdAt'>>): Promise<void> => {
  const { db } = getFirebaseServices();
  if (!db) throw new Error('Firebase not configured');

  const leadRef = doc(db, COLLECTION_NAME, id);
  await updateDoc(leadRef, sanitizeForFirestore({
    ...updates,
    updatedAt: new Date().toISOString(),
  }));
};

export const deleteLead = async (id: string): Promise<void> => {
  const { db } = getFirebaseServices();
  if (!db) throw new Error('Firebase not configured');

  const leadRef = doc(db, COLLECTION_NAME, id);
  await deleteDoc(leadRef);
};

// Helper for dashboard with custom month and year selection
export const getDashboardMetrics = (
  leads: Lead[],
  targetYear?: number,
  targetMonth?: number // 0-indexed: 0 = Jan, 11 = Dec
): DashboardMetrics => {
  const now = new Date();
  const year = targetYear !== undefined ? targetYear : now.getFullYear();
  const month = targetMonth !== undefined ? targetMonth : now.getMonth();

  const isCurrentMonth = year === now.getFullYear() && month === now.getMonth();

  // Date boundaries
  const todayStr = now.toISOString().split('T')[0];
  
  const startOfWeek = new Date(now);
  startOfWeek.setDate(now.getDate() - now.getDay());
  startOfWeek.setHours(0, 0, 0, 0);

  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(startOfWeek.getDate() + 7);

  const initMetric = () => ({ today: 0, thisWeek: 0, thisMonth: 0 });
  const metrics: DashboardMetrics = {
    newLeads: initMetric(),
    messages: initMetric(),
    calls: initMetric(),
    replies: initMetric(),
    qualified: initMetric(),
    demos: initMetric(),
    proposals: initMetric(),
    won: initMetric(),
    lost: initMetric(),
  };

  leads.forEach((lead) => {
    const rawDate = lead.dateAdded || lead.createdAt || '';
    const leadDate = new Date(rawDate);
    const validDate = !isNaN(leadDate.getTime());

    // Check if lead falls in the selected month & year
    const isInSelectedMonth = validDate
      ? leadDate.getFullYear() === year && leadDate.getMonth() === month
      : false;

    // Check if lead is today (only if currently viewing the current month)
    const isToday = isCurrentMonth && (rawDate.startsWith(todayStr) || (validDate && leadDate.toISOString().startsWith(todayStr)));

    // Check if lead is this week (only if currently viewing the current month)
    const isThisWeek = isCurrentMonth && validDate && leadDate >= startOfWeek && leadDate < endOfWeek;

    const increment = (metric: keyof DashboardMetrics) => {
      if (isToday) metrics[metric].today++;
      if (isThisWeek) metrics[metric].thisWeek++;
      if (isInSelectedMonth) metrics[metric].thisMonth++;
    };

    // New Leads
    increment('newLeads');

    // Messages/Calls logic based on 'leadSource', status, and 'firstContactDate'
    if (lead.firstContactDate || lead.leadStatus === 'CONTACTED') {
      if (lead.messenger) increment('messages');
      if (lead.phone) increment('calls');
    }

    if (lead.responseReceived || lead.leadStatus === 'REPLIED') increment('replies');
    if (['QUALIFIED', 'DEMO BOOKED', 'DEMO DONE', 'PROPOSAL', 'NEGOTIATION', 'WON', 'CONVERTED'].includes(lead.leadStatus)) increment('qualified');
    if (['DEMO BOOKED', 'DEMO DONE'].includes(lead.leadStatus) || lead.demoDate) increment('demos');
    if (['PROPOSAL', 'NEGOTIATION', 'WON', 'CONVERTED'].includes(lead.leadStatus) || lead.proposalSent) increment('proposals');
    if (lead.leadStatus === 'WON' || lead.leadStatus === 'CONVERTED' || lead.salesStatus === 'Won' || lead.isConverted) increment('won');
    if (lead.leadStatus === 'LOST' || lead.salesStatus === 'Lost') increment('lost');
  });

  return metrics;
};
