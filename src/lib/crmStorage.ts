import { collection, doc, getDocs, setDoc, updateDoc, deleteDoc, query, where, orderBy } from 'firebase/firestore';
import { getFirebaseServices } from './firebase';
import { Lead, DashboardMetrics } from '@/types/crm';

const COLLECTION_NAME = 'leads';

export const getLeads = async (userId: string): Promise<Lead[]> => {
  const { db } = getFirebaseServices();
  if (!db) throw new Error('Firebase not configured');

  const q = query(
    collection(db, COLLECTION_NAME),
    where('userId', '==', userId)
  );

  const snapshot = await getDocs(q);
  const leads: Lead[] = [];
  snapshot.forEach((docSnap) => {
    leads.push(docSnap.data() as Lead);
  });
  
  // Sort in memory by createdAt desc
  leads.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  
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

  await setDoc(newLeadRef, newLead);
  return newLead;
};

export const updateLead = async (id: string, updates: Partial<Omit<Lead, 'id' | 'userId' | 'createdAt'>>): Promise<void> => {
  const { db } = getFirebaseServices();
  if (!db) throw new Error('Firebase not configured');

  const leadRef = doc(db, COLLECTION_NAME, id);
  await updateDoc(leadRef, {
    ...updates,
    updatedAt: new Date().toISOString(),
  });
};

export const deleteLead = async (id: string): Promise<void> => {
  const { db } = getFirebaseServices();
  if (!db) throw new Error('Firebase not configured');

  const leadRef = doc(db, COLLECTION_NAME, id);
  await deleteDoc(leadRef);
};

// Helper for dashboard
export const getDashboardMetrics = (leads: Lead[]): DashboardMetrics => {
  const now = new Date();
  
  // Date boundaries
  const todayStr = now.toISOString().split('T')[0];
  
  const startOfWeek = new Date(now);
  startOfWeek.setDate(now.getDate() - now.getDay());
  
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

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
    const leadDate = new Date(lead.dateAdded);
    const isToday = lead.dateAdded.startsWith(todayStr);
    const isThisWeek = leadDate >= startOfWeek;
    const isThisMonth = leadDate >= startOfMonth;

    const increment = (metric: keyof DashboardMetrics) => {
      if (isToday) metrics[metric].today++;
      if (isThisWeek) metrics[metric].thisWeek++;
      if (isThisMonth) metrics[metric].thisMonth++;
    };

    // New Leads
    increment('newLeads');

    // Messages/Calls logic based on 'leadSource' and 'firstContactDate' for simplicity
    // In a real app we'd track activities, but here we estimate from fields:
    if (lead.firstContactDate) {
       // if we have contact date and messenger/phone
       if (lead.messenger) increment('messages');
       if (lead.phone) increment('calls');
    }

    if (lead.responseReceived || lead.leadStatus === 'REPLIED') increment('replies');
    if (['QUALIFIED', 'DEMO BOOKED', 'DEMO DONE', 'PROPOSAL', 'NEGOTIATION', 'WON'].includes(lead.leadStatus)) increment('qualified');
    if (['DEMO BOOKED', 'DEMO DONE'].includes(lead.leadStatus) || lead.demoDate) increment('demos');
    if (['PROPOSAL', 'NEGOTIATION', 'WON'].includes(lead.leadStatus) || lead.proposalSent) increment('proposals');
    if (lead.leadStatus === 'WON' || lead.salesStatus === 'Won') increment('won');
    if (lead.leadStatus === 'LOST' || lead.salesStatus === 'Lost') increment('lost');
  });

  return metrics;
};
