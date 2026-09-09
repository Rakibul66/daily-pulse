import { initializeApp, getApps, getApp, FirebaseApp } from "firebase/app";
import { getFirestore, initializeFirestore, Firestore } from "firebase/firestore";
import { getAuth, Auth, GoogleAuthProvider } from "firebase/auth";
import { FirebaseConfig } from "@/types/report";

const FIREBASE_CONFIG_KEY = "daily_pulse_firebase_config";

export const DEFAULT_FIREBASE_CONFIG: FirebaseConfig = {
  apiKey: "AIzaSyDoRU68CDzMjf0ETBdrJcGr9UNWhWiWRdo",
  authDomain: "crm-daily.firebaseapp.com",
  projectId: "crm-daily",
  storageBucket: "crm-daily.firebasestorage.app",
  messagingSenderId: "14026117925",
  appId: "1:14026117925:web:37e1a05a71d9ea378300cc",
};

export const getStoredFirebaseConfig = (): FirebaseConfig => {
  // 1. Check process.env (loaded directly from .env.local)
  if (
    process.env.NEXT_PUBLIC_FIREBASE_API_KEY &&
    process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID
  ) {
    return {
      apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
      authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || DEFAULT_FIREBASE_CONFIG.authDomain,
      projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
      storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || DEFAULT_FIREBASE_CONFIG.storageBucket,
      messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || DEFAULT_FIREBASE_CONFIG.messagingSenderId,
      appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || DEFAULT_FIREBASE_CONFIG.appId,
    };
  }

  // 2. Check localStorage as secondary fallback
  if (typeof window !== "undefined") {
    try {
      const saved = localStorage.getItem(FIREBASE_CONFIG_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.projectId && parsed.apiKey) {
          return parsed;
        }
      }
    } catch (e) {
      console.warn("Could not read Firebase config from localStorage", e);
    }
  }

  // 3. Fallback to default user config
  return DEFAULT_FIREBASE_CONFIG;
};

export const saveFirebaseConfig = (config: FirebaseConfig): void => {
  if (typeof window !== "undefined") {
    localStorage.setItem(FIREBASE_CONFIG_KEY, JSON.stringify(config));
  }
};

export const clearFirebaseConfig = (): void => {
  if (typeof window !== "undefined") {
    localStorage.removeItem(FIREBASE_CONFIG_KEY);
  }
};

export const getFirebaseServices = (): {
  app: FirebaseApp | null;
  db: Firestore | null;
  auth: Auth | null;
  googleProvider: GoogleAuthProvider | null;
} => {
  const config = getStoredFirebaseConfig();
  if (!config || !config.apiKey || !config.projectId) {
    return { app: null, db: null, auth: null, googleProvider: null };
  }

  try {
    const app = getApps().length > 0 ? getApp() : initializeApp(config);

    // Use initializeFirestore with auto-detect long-polling to prevent WebSocket connection failures
    let db: Firestore;
    try {
      db = initializeFirestore(app, {
        experimentalAutoDetectLongPolling: true,
      });
    } catch {
      // If already initialized, get existing instance
      db = getFirestore(app);
    }

    const auth = getAuth(app);
    const googleProvider = new GoogleAuthProvider();
    googleProvider.setCustomParameters({ prompt: "select_account" });
    return { app, db, auth, googleProvider };
  } catch (err) {
    console.error("Firebase init failed:", err);
    return { app: null, db: null, auth: null, googleProvider: null };
  }
};
