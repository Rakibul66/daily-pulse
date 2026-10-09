"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import {
  User,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  sendPasswordResetEmail,
  sendEmailVerification,
  updatePassword,
  reauthenticateWithCredential,
  EmailAuthProvider,
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
  sendVerificationEmail: () => Promise<void>;
  reloadUser: () => Promise<boolean>;
  changeUserPassword: (currentPassword: string, newPassword: string) => Promise<void>;
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

    const { auth } = getFirebaseServices();
    
    if (!auth) {
      setLoading(false);
      return;
    }

    // Safety timeout ensures we never show an infinite spinner if network hangs
    const safetyTimeout = setTimeout(() => {
      if (isMounted) {
        setLoading(false);
      }
    }, 2000);

    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (!isMounted) return;
      
      if (currentUser) {
        localStorage.setItem("dp_auth", "true");
        
        // Fetch or create SaaS UserProfile
        const { db } = getFirebaseServices();
        let profile: UserProfile | null = null;
        if (db) {
          try {
            const userRef = doc(db, 'users', currentUser.uid);
            const userSnap = await getDoc(userRef);
            if (userSnap.exists()) {
              profile = userSnap.data() as UserProfile;
            } else {
              // Create default OWNER profile with companyId = uid
              profile = {
                uid: currentUser.uid,
                email: currentUser.email || '',
                displayName: currentUser.displayName || 'User',
                role: 'OWNER',
                companyId: currentUser.uid
              };
              await setDoc(userRef, profile);
            }
          } catch (err) {
            console.error("Failed to load user profile:", err);
            // Fallback profile if offline/permission issue
            profile = {
              uid: currentUser.uid,
              email: currentUser.email || '',
              displayName: currentUser.displayName || 'User',
              role: 'OWNER',
              companyId: currentUser.uid
            };
          }
        }
        
        if (isMounted) {
          setUserProfile(profile);
          setUser(currentUser);
          setLoading(false);
          clearTimeout(safetyTimeout);
        }
      } else {
        localStorage.removeItem("dp_auth");
        if (isMounted) {
          setUser(null);
          setUserProfile(null);
          setLoading(false);
          clearTimeout(safetyTimeout);
        }
      }
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
    // Automatically send verification email on registration
    try {
      if (cred.user) {
        await sendEmailVerification(cred.user);
      }
    } catch (e) {
      console.warn("Could not dispatch initial email verification:", e);
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

  const sendVerificationEmail = async () => {
    const { auth } = getFirebaseServices();
    if (!auth || !auth.currentUser) throw new Error("No signed-in user found.");
    await sendEmailVerification(auth.currentUser);
  };

  const reloadUser = async (): Promise<boolean> => {
    const { auth } = getFirebaseServices();
    if (!auth || !auth.currentUser) return false;
    await auth.currentUser.reload();
    setUser(auth.currentUser);
    return auth.currentUser.emailVerified;
  };

  const changeUserPassword = async (currentPassword: string, newPassword: string) => {
    const { auth } = getFirebaseServices();
    if (!auth || !auth.currentUser) {
      throw new Error("No authenticated user found.");
    }
    const currentUser = auth.currentUser;
    const userEmail = currentUser.email;
    if (!userEmail) {
      throw new Error("User does not have an associated email address.");
    }
    // Re-authenticate before sensitive password change
    const credential = EmailAuthProvider.credential(userEmail, currentPassword);
    await reauthenticateWithCredential(currentUser, credential);
    await updatePassword(currentUser, newPassword);
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
        sendVerificationEmail,
        reloadUser,
        changeUserPassword,
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
