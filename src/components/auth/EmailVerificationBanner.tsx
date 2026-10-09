"use client";

import React, { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { AlertTriangle, MailCheck, RefreshCw, X, CheckCircle2 } from "lucide-react";

export const EmailVerificationBanner: React.FC = () => {
  const { user, sendVerificationEmail, reloadUser } = useAuth();
  const [isDismissed, setIsDismissed] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [isChecking, setIsChecking] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: "success" | "error" } | null>(null);

  // If no user or email is already verified or user dismissed for this view
  if (!user || user.emailVerified || isDismissed) {
    return null;
  }

  const handleResend = async () => {
    setIsSending(true);
    setMessage(null);
    try {
      await sendVerificationEmail();
      setMessage({
        text: `Verification link sent to ${user.email}! Please check your inbox or spam folder.`,
        type: "success",
      });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to send verification link.";
      setMessage({ text: msg, type: "error" });
    } finally {
      setIsSending(false);
    }
  };

  const handleCheckStatus = async () => {
    setIsChecking(true);
    setMessage(null);
    try {
      const isVerified = await reloadUser();
      if (isVerified) {
        setMessage({
          text: "Awesome! Your email has been verified successfully.",
          type: "success",
        });
      } else {
        setMessage({
          text: "Not verified yet. Please click the link in the verification email and click this button again.",
          type: "error",
        });
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Could not refresh verification status.";
      setMessage({ text: msg, type: "error" });
    } finally {
      setIsChecking(false);
    }
  };

  return (
    <div className="mx-2 sm:mx-3 mt-2 bg-amber-200 border-3 border-black shadow-[4px_4px_0px_#000] p-3 text-black relative z-20">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-start sm:items-center gap-2.5">
          <div className="p-1.5 bg-amber-400 border-2 border-black shadow-[2px_2px_0px_#000] shrink-0">
            <AlertTriangle className="w-5 h-5 text-black stroke-[2.5]" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-display font-black text-xs uppercase tracking-wider bg-black text-white px-2 py-0.5">
                VERIFY YOUR EMAIL
              </span>
              <span className="text-xs font-bold">
                A verification link was sent to <strong className="underline">{user.email}</strong>.
              </span>
            </div>
            <p className="text-[11px] font-bold text-slate-800 mt-0.5">
              Verify your genuine email to protect your store data and enable password recovery.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0 flex-wrap">
          <button
            type="button"
            onClick={handleResend}
            disabled={isSending || isChecking}
            className="px-3 py-1.5 bg-white hover:bg-amber-100 text-black font-display font-black text-[11px] uppercase tracking-wider border-2 border-black shadow-[2px_2px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
          >
            <MailCheck className="w-3.5 h-3.5 stroke-[2.5]" />
            {isSending ? "SENDING..." : "RESEND EMAIL"}
          </button>

          <button
            type="button"
            onClick={handleCheckStatus}
            disabled={isSending || isChecking}
            className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white font-display font-black text-[11px] uppercase tracking-wider border-2 border-black shadow-[2px_2px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 stroke-[2.5] ${isChecking ? "animate-spin" : ""}`} />
            {isChecking ? "CHECKING..." : "I'VE VERIFIED"}
          </button>

          <button
            type="button"
            onClick={() => setIsDismissed(true)}
            className="p-1 hover:bg-black/10 transition-colors cursor-pointer"
            title="Dismiss temporarily"
            aria-label="Dismiss banner"
          >
            <X className="w-4 h-4 stroke-[2.5]" />
          </button>
        </div>
      </div>

      {message && (
        <div
          className={`mt-2 p-2 border-2 border-black font-bold text-xs flex items-center gap-2 ${
            message.type === "success"
              ? "bg-emerald-200 text-emerald-950"
              : "bg-red-200 text-red-950"
          }`}
        >
          {message.type === "success" ? (
            <CheckCircle2 className="w-4 h-4 shrink-0 stroke-[2.5]" />
          ) : (
            <AlertTriangle className="w-4 h-4 shrink-0 stroke-[2.5]" />
          )}
          <span>{message.text}</span>
        </div>
      )}
    </div>
  );
};
