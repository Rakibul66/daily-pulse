"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import {
  User,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  sendPasswordResetEmail,
  signOut,
  updateProfile,
} from "firebase/auth";
import { getFirebaseServices } from "@/lib/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  role: 'OWNER' | 'EMPLOYEE';
  companyId: string;
}

interface AuthContextType {
  user: User | null;
  userProfile: UserProfile | null;
  loading: boolean;
  signInWithEmail: (email: string, pass: string) => Promise<void>;
  signUpWithEmail: (email: string, pass: string, name?: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  signOutUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    
    // Quick escape for first-time visitors to avoid long loading screen
    if (typeof window !== "undefined" && localStorage.getItem("dp_auth") !== "true") {
      setTimeout(() => {
        if (isMounted) setLoading(false);
      }, 0);
    }

    const { auth } = getFirebaseServices();
    
    if (!auth) {
      setLoading(false);
      return;
    }

    // Sometimes Firebase auth hangs on initial Next.js dev compile.
    // This safety timeout ensures we never show an infinite spinner.
    const safetyTimeout = setTimeout(() => {
      if (isMounted) {
        setLoading(false);
      }
    }, 2000);

    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (!isMounted) return;
      
      if (currentUser) {
        localStorage.setItem("dp_auth", "true");
        setUser(currentUser);
        
        // Fetch or create SaaS UserProfile
        const { db } = getFirebaseServices();
        if (db) {
          try {
            const userRef = doc(db, 'users', currentUser.uid);
            const userSnap = await getDoc(userRef);
            if (userSnap.exists()) {
              setUserProfile(userSnap.data() as UserProfile);
            } else {
              // Create default OWNER profile with companyId = uid (for backward compatibility)
              const newProfile: UserProfile = {
                uid: currentUser.uid,
                email: currentUser.email || '',
                displayName: currentUser.displayName || 'User',
                role: 'OWNER',
                companyId: currentUser.uid // Default to user ID as company ID initially
              };
              await setDoc(userRef, newProfile);
              setUserProfile(newProfile);
            }
          } catch (err) {
            console.error("Failed to load user profile:", err);
          }
        }
      } else {
        localStorage.removeItem("dp_auth");
        setUser(null);
        setUserProfile(null);
      }
      
      setLoading(false);
      clearTimeout(safetyTimeout);
    });

    return () => {
      isMounted = false;
      clearTimeout(safetyTimeout);
      unsubscribe();
    };
  }, []);

  const signInWithEmail = async (email: string, pass: string) => {
    const { auth } = getFirebaseServices();
    if (!auth) throw new Error("Firebase Auth is not initialized.");
    await signInWithEmailAndPassword(auth, email, pass);
    localStorage.setItem("dp_auth", "true");
  };

  const signUpWithEmail = async (email: string, pass: string, name?: string) => {
    const { auth } = getFirebaseServices();
    if (!auth) throw new Error("Firebase Auth is not initialized.");
    const cred = await createUserWithEmailAndPassword(auth, email, pass);
    localStorage.setItem("dp_auth", "true");
    if (name && cred.user) {
      await updateProfile(cred.user, { displayName: name });
      setUser({ ...cred.user, displayName: name });
    }
  };

  const signInWithGoogle = async () => {
    const { auth, googleProvider } = getFirebaseServices();
    if (!auth || !googleProvider)
      throw new Error("Firebase Google Auth is not initialized.");
    await signInWithPopup(auth, googleProvider);
    localStorage.setItem("dp_auth", "true");
  };

  const resetPassword = async (email: string) => {
    const { auth } = getFirebaseServices();
    if (!auth) throw new Error("Firebase Auth is not initialized.");
    await sendPasswordResetEmail(auth, email);
  };

  const signOutUser = async () => {
    const { auth } = getFirebaseServices();
    if (auth) {
      await signOut(auth);
    }
    localStorage.removeItem("dp_auth");
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        userProfile,
        loading,
        signInWithEmail,
        signUpWithEmail,
        signInWithGoogle,
        resetPassword,
        signOutUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
