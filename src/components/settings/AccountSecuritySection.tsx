"use client";

import React, { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { 
  ShieldCheck, 
  KeyRound, 
  Mail, 
  CheckCircle2, 
  AlertTriangle, 
  Lock, 
  Loader2, 
  Send 
} from "lucide-react";

interface Props {
  showToast: (msg: string, type: "success" | "error") => void;
}

export const AccountSecuritySection: React.FC<Props> = ({ showToast }) => {
  const { user, userProfile, changeUserPassword, sendVerificationEmail, reloadUser, resetPassword } = useAuth();

  // Change Password Form State
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [passwordError, setPasswordError] = useState<string | null>(null);

  // Email Verification State
  const [isSendingVerify, setIsSendingVerify] = useState(false);
  const [isCheckingVerify, setIsCheckingVerify] = useState(false);
  const [isSendingReset, setIsSendingReset] = useState(false);

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError(null);

    if (!currentPassword) {
      setPasswordError("Please enter your current password.");
      return;
    }

    if (newPassword.length < 6) {
      setPasswordError("New password must be at least 6 characters long.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordError("New passwords do not match.");
      return;
    }

    if (currentPassword === newPassword) {
      setPasswordError("New password must be different from your current password.");
      return;
    }

    setIsChangingPassword(true);
    try {
      await changeUserPassword(currentPassword, newPassword);
      showToast("Password updated successfully! Keep your new credentials safe.", "success");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to update password.";
      if (msg.includes("auth/wrong-password") || msg.includes("auth/invalid-credential")) {
        setPasswordError("Incorrect current password. Please check and try again.");
      } else if (msg.includes("auth/requires-recent-login")) {
        setPasswordError("For security, please log out and log back in before changing your password.");
      } else if (msg.includes("auth/weak-password")) {
        setPasswordError("Password is too weak. Please use a stronger combination.");
      } else {
        setPasswordError(msg);
      }
    } finally {
      setIsChangingPassword(false);
    }
  };

  const handleResendVerification = async () => {
    if (!user?.email) return;
    setIsSendingVerify(true);
    try {
      await sendVerificationEmail();
      showToast(`Verification link dispatched to ${user.email}!`, "success");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Could not send verification email.";
      showToast(msg, "error");
    } finally {
      setIsSendingVerify(false);
    }
  };

  const handleCheckVerification = async () => {
    setIsCheckingVerify(true);
    try {
      const verified = await reloadUser();
      if (verified) {
        showToast("Email address verified successfully!", "success");
      } else {
        showToast("Email is still unverified. Please check your inbox and click the link.", "error");
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Could not refresh status.";
      showToast(msg, "error");
    } finally {
      setIsCheckingVerify(false);
    }
  };

  const handleSendResetEmail = async () => {
    if (!user?.email) return;
    setIsSendingReset(true);
    try {
      await resetPassword(user.email);
      showToast(`Password reset link sent to ${user.email}! Check your inbox.`, "success");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Could not send reset link.";
      showToast(msg, "error");
    } finally {
      setIsSendingReset(false);
    }
  };

  return (
    <div className="bg-white border-3 border-black shadow-[6px_6px_0px_#000] p-4 sm:p-6 mb-6">
      {/* Header */}
      <div className="flex items-center gap-3 pb-4 border-b-2 border-black mb-6">
        <div className="p-2 bg-rose-400 border-2 border-black shadow-[2px_2px_0px_#000]">
          <ShieldCheck className="w-5 h-5 text-black stroke-[2.5]" />
        </div>
        <div>
          <h2 className="font-display font-black text-lg uppercase tracking-tight text-black">
            ACCOUNT SECURITY & CREDENTIALS
          </h2>
          <p className="text-xs font-bold text-slate-600 uppercase tracking-wide">
            Manage your email verification, change login password, and ensure tenant data protection
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column: Email Verification & Profile Status */}
        <div className="space-y-4">
          <div className="bg-slate-50 border-2 border-black p-4">
            <h3 className="font-display font-black text-xs uppercase tracking-wider text-black flex items-center gap-2 mb-3">
              <Mail className="w-4 h-4 stroke-[2.5] text-indigo-600" />
              REGISTERED ACCOUNT EMAIL
            </h3>

            <div className="p-3 bg-white border-2 border-black flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
              <div>
                <span className="text-xs font-black text-black block">
                  {user?.email || "No email detected"}
                </span>
                <span className="text-[10px] font-bold text-slate-500 uppercase">
                  Role: {userProfile?.role || "OWNER"} • UID: {user?.uid?.slice(0, 10)}...
                </span>
              </div>

              <div>
                {user?.emailVerified ? (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-emerald-300 border-2 border-black font-black text-[11px] uppercase tracking-wider text-emerald-950 shadow-[1px_1px_0px_#000]">
                    <CheckCircle2 className="w-3.5 h-3.5 stroke-[3]" />
                    VERIFIED
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-amber-300 border-2 border-black font-black text-[11px] uppercase tracking-wider text-amber-950 shadow-[1px_1px_0px_#000]">
                    <AlertTriangle className="w-3.5 h-3.5 stroke-[3]" />
                    UNVERIFIED
                  </span>
                )}
              </div>
            </div>

            {!user?.emailVerified && (
              <div className="p-3 bg-amber-100 border-2 border-black space-y-2.5">
                <p className="text-xs font-bold text-amber-950 leading-relaxed">
                  Your email address is not verified yet. Verifying your email protects your business store against unauthorized account takeovers.
                </p>
                <div className="flex items-center gap-2 flex-wrap">
                  <button
                    type="button"
                    onClick={handleResendVerification}
                    disabled={isSendingVerify}
                    className="px-3 py-1.5 bg-white hover:bg-amber-50 text-black border-2 border-black shadow-[2px_2px_0px_#000] font-display font-black text-[10px] uppercase tracking-wider active:translate-x-0.5 active:translate-y-0.5 active:shadow-none cursor-pointer disabled:opacity-50"
                  >
                    {isSendingVerify ? "SENDING..." : "RESEND VERIFICATION LINK"}
                  </button>
                  <button
                    type="button"
                    onClick={handleCheckVerification}
                    disabled={isCheckingVerify}
                    className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white border-2 border-black shadow-[2px_2px_0px_#000] font-display font-black text-[10px] uppercase tracking-wider active:translate-x-0.5 active:translate-y-0.5 active:shadow-none cursor-pointer disabled:opacity-50"
                  >
                    {isCheckingVerify ? "CHECKING..." : "CHECK STATUS NOW"}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Quick Password Reset Email */}
          <div className="bg-slate-50 border-2 border-black p-4">
            <h3 className="font-display font-black text-xs uppercase tracking-wider text-black flex items-center gap-2 mb-2">
              <Send className="w-4 h-4 stroke-[2.5] text-indigo-600" />
              FORGOT YOUR CURRENT PASSWORD?
            </h3>
            <p className="text-xs font-bold text-slate-600 mb-3">
              If you don&apos;t know your current password, you can send an official reset email directly to your registered inbox:
            </p>
            <button
              type="button"
              onClick={handleSendResetEmail}
              disabled={isSendingReset}
              className="px-4 py-2 bg-amber-300 hover:bg-amber-400 text-black border-2 border-black shadow-[2px_2px_0px_#000] font-display font-black text-xs uppercase tracking-wider active:translate-x-0.5 active:translate-y-0.5 active:shadow-none cursor-pointer disabled:opacity-50 flex items-center gap-2"
            >
              <Send className="w-3.5 h-3.5 stroke-[2.5]" />
              {isSendingReset ? "SENDING EMAIL..." : "SEND PASSWORD RESET EMAIL"}
            </button>
          </div>
        </div>

        {/* Right Column: Change Password Form */}
        <div className="bg-slate-50 border-2 border-black p-4">
          <h3 className="font-display font-black text-xs uppercase tracking-wider text-black flex items-center gap-2 mb-3">
            <KeyRound className="w-4 h-4 stroke-[2.5] text-indigo-600" />
            UPDATE LOGIN PASSWORD
          </h3>

          {passwordError && (
            <div className="p-3 bg-red-100 border-2 border-black shadow-[2px_2px_0px_#000] text-red-950 text-xs font-bold flex items-center gap-2 mb-3">
              <AlertTriangle className="w-4 h-4 shrink-0 text-red-700 stroke-[2.5]" />
              <span>{passwordError}</span>
            </div>
          )}

          <form onSubmit={handlePasswordChange} className="space-y-3">
            <div>
              <label className="block text-[11px] font-black uppercase tracking-wider text-black mb-1">
                Current Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-black absolute left-3 top-2.5" />
                <input
                  type="password"
                  required
                  placeholder="Enter current password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs font-bold text-black bg-white border-2 border-black shadow-[2px_2px_0px_#000] focus:bg-amber-50 focus:outline-none focus:border-indigo-600"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-black uppercase tracking-wider text-black mb-1">
                New Password (minimum 6 chars)
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-black absolute left-3 top-2.5" />
                <input
                  type="password"
                  required
                  placeholder="Enter new strong password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs font-bold text-black bg-white border-2 border-black shadow-[2px_2px_0px_#000] focus:bg-amber-50 focus:outline-none focus:border-indigo-600"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-black uppercase tracking-wider text-black mb-1">
                Confirm New Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-black absolute left-3 top-2.5" />
                <input
                  type="password"
                  required
                  placeholder="Re-type new password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs font-bold text-black bg-white border-2 border-black shadow-[2px_2px_0px_#000] focus:bg-amber-50 focus:outline-none focus:border-indigo-600"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isChangingPassword}
              className="w-full py-2.5 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-display font-black text-xs uppercase tracking-wider border-2 border-black shadow-[3px_3px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 active:shadow-[1px_1px_0px_#000] flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 mt-2"
            >
              {isChangingPassword ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin stroke-[3]" />
                  UPDATING PASSWORD...
                </>
              ) : (
                <>
                  <KeyRound className="w-4 h-4 stroke-[2.5]" />
                  CHANGE PASSWORD
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
