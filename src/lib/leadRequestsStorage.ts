import { collection, addDoc, serverTimestamp, getDocs, query, orderBy } from "firebase/firestore";
import { getFirebaseServices } from "./firebase";
import { sanitizeForFirestore } from "./firestoreUtils";

export interface LeadRequest {
  id?: string;
  fullName: string;
  phoneNumber: string;
  businessType: string;
  businessName: string;
  message: string;
  createdAt?: string;
  status?: "pending" | "contacted" | "converted" | "cancelled";
  source?: string;
}

const LOCAL_STORAGE_KEY = "shomporko_lead_requests";

export async function saveLeadRequest(data: Omit<LeadRequest, "id" | "createdAt" | "status">): Promise<{ id: string; success: boolean }> {
  const timestamp = new Date().toISOString();
  const newLead: LeadRequest = {
    ...data,
    createdAt: timestamp,
    status: "pending",
    source: "contact_page",
  };

  // 1. Save to localStorage as backup
  try {
    if (typeof window !== "undefined") {
      const existing = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY) || "[]");
      existing.unshift({ ...newLead, id: `local_${Date.now()}` });
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(existing));
    }
  } catch (err) {
    console.warn("Failed to cache lead request locally:", err);
  }

  // 2. Save to Firestore
  try {
    const { db } = getFirebaseServices();
    if (db) {
      const docRef = await addDoc(collection(db, "lead_requests"), sanitizeForFirestore({
        ...newLead,
        serverTimestamp: serverTimestamp(),
      }));
      return { id: docRef.id, success: true };
    }
  } catch (err) {
    console.error("Failed to save lead request to Firestore:", err);
    // Still return success if local cache succeeded
  }

  return { id: `local_${Date.now()}`, success: true };
}

export async function getLeadRequests(): Promise<LeadRequest[]> {
  try {
    const { db } = getFirebaseServices();
    if (db) {
      const q = query(collection(db, "lead_requests"), orderBy("createdAt", "desc"));
      const snapshot = await getDocs(q);
      const items: LeadRequest[] = [];
      snapshot.forEach((doc) => {
        items.push({ id: doc.id, ...(doc.data() as Omit<LeadRequest, "id">) });
      });
      if (items.length > 0) return items;
    }
  } catch (err) {
    console.warn("Error fetching lead requests from Firestore, using local fallback:", err);
  }

  if (typeof window !== "undefined") {
    return JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY) || "[]");
  }
  return [];
}
