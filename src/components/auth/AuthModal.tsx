"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useAuth } from "@/context/AuthContext";
import {
  X,
  Mail,
  Lock,
  User as UserIcon,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  Loader2,
} from "lucide-react";

import { checkRateLimit, resetRateLimit, withActionLock, RATE_LIMIT_PRESETS } from "@/lib/rateLimit";
import { validateRegistrationEmail } from "@/lib/emailValidation";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: "login" | "register" | "forgot";
  onSuccess?: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  initialMode = "login",
  onSuccess,
}) => {
  const [mode, setMode] = useState<"login" | "register" | "forgot">(initialMode);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const { signInWithEmail, signUpWithEmail, signInWithGoogle, resetPassword } =
    useAuth();

  React.useEffect(() => {
    setMode(initialMode);
    setError(null);
    setSuccessMsg(null);
  }, [initialMode, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);

    // Validate email authenticity for registration and recovery
    if (mode === "register" || mode === "forgot") {
      const emailValidation = validateRegistrationEmail(email);
      if (!emailValidation.valid) {
        setError(emailValidation.error || "Please provide a valid genuine email address.");
        return;
      }
    }

    // Rate limiting checks
    if (mode === "login") {
      const rl = checkRateLimit(
        "auth_login",
        RATE_LIMIT_PRESETS.AUTH_LOGIN.max,
        RATE_LIMIT_PRESETS.AUTH_LOGIN.windowMs,
        RATE_LIMIT_PRESETS.AUTH_LOGIN.penaltyMs
      );
      if (!rl.allowed) {
        setError(rl.message || "Too many login attempts. Please wait.");
        return;
      }
    } else if (mode === "forgot") {
      const rl = checkRateLimit(
        "auth_forgot",
        RATE_LIMIT_PRESETS.AUTH_FORGOT_PASSWORD.max,
        RATE_LIMIT_PRESETS.AUTH_FORGOT_PASSWORD.windowMs,
        RATE_LIMIT_PRESETS.AUTH_FORGOT_PASSWORD.penaltyMs
      );
      if (!rl.allowed) {
        setError(rl.message || "Too many password reset requests. Please wait.");
        return;
      }
    }

    setLoading(true);

    try {
      if (mode === "login") {
        await signInWithEmail(email, password);
        resetRateLimit("auth_login");
        onSuccess?.();
        onClose();
      } else if (mode === "register") {
        if (password !== confirmPassword) {
          throw new Error("Passwords do not match.");
        }
        if (password.length < 6) {
          throw new Error("Password must be at least 6 characters long.");
        }
        await signUpWithEmail(email, password, name);
        localStorage.setItem("dp_onboarding_step", "company");
        onSuccess?.();
        onClose();
      } else if (mode === "forgot") {
        await resetPassword(email);
        setSuccessMsg(
          "Password reset link sent! Check your inbox to reset your password."
        );
      }
    } catch (err: unknown) {
      const msg =
        err instanceof Error
          ? err.message
          : "An unexpected authentication error occurred.";
      if (msg.includes("auth/user-not-found") || msg.includes("auth/invalid-credential")) {
        setError("Invalid email or password. Please try again.");
      } else if (msg.includes("auth/email-already-in-use")) {
        setError("An account with this email already exists. Try logging in.");
      } else if (msg.includes("auth/weak-password")) {
        setError("Password is too weak. Please use at least 6 characters.");
      } else {
        setError(msg);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setError(null);
    setLoading(true);
    try {
      await withActionLock("google_signin", 2000, async () => {
        await signInWithGoogle();
        onSuccess?.();
        onClose();
      });
    } catch (err: unknown) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to sign in with Google. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
      {/* Modal Dialog Card */}
      <div className="relative w-full max-w-md bg-white border-4 border-black shadow-[10px_10px_0px_#000] my-8 overflow-hidden text-black animate-in fade-in zoom-in-95 duration-200">
        
        {/* Top Accent Strip */}
        <div className="h-3 bg-gradient-to-r from-indigo-600 via-amber-400 to-red-600 border-b-2 border-black" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 p-1.5 bg-white hover:bg-red-600 hover:text-white border-2 border-black shadow-[2px_2px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all z-10 cursor-pointer"
          aria-label="Close"
        >
          <X className="w-5 h-5 stroke-[2.5]" />
        </button>

        {/* Modal Header */}
        <div className="p-7 pb-4 text-center">
          <div className="flex items-center justify-center gap-2 mb-3">
            <Image
              src="/somporko.webp"
              alt="Shomporko Logo"
              width={36}
              height={36}
              className="object-contain"
            />
            <span className="font-display font-black text-xl tracking-tight uppercase text-black">
              SHOMPORKO CRM
            </span>
          </div>

          <div className="inline-block px-3 py-1 bg-amber-300 border-2 border-black shadow-[2px_2px_0px_#000] font-black text-[11px] uppercase tracking-wider mb-3">
            {mode === "login" && "PORTAL LOGIN"}
            {mode === "register" && "NEW ACCOUNT"}
            {mode === "forgot" && "PASSWORD RECOVERY"}
          </div>

          <h3 className="font-display font-black text-2xl uppercase tracking-tight text-black">
            {mode === "login" && "WELCOME BACK"}
            {mode === "register" && "GET STARTED"}
            {mode === "forgot" && "RESET PASSWORD"}
          </h3>
          <p className="text-xs font-bold text-slate-600 mt-1 uppercase tracking-wide">
            {mode === "login" && "Access your POS & ERP business dashboard"}
            {mode === "register" && "Start operating efficiently with Shomporko CRM"}
            {mode === "forgot" && "Enter your email to receive recovery instructions"}
          </p>
        </div>

        {/* Form Body */}
        <div className="px-7 pb-7 space-y-4">
          {/* Alerts */}
          {error && (
            <div className="p-3 bg-red-100 border-2 border-black shadow-[3px_3px_0px_#000] text-red-950 text-xs font-bold flex items-center gap-2.5">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-700 stroke-[2.5]" />
              <span>{error}</span>
            </div>
          )}

          {successMsg && (
            <div className="p-3 bg-emerald-100 border-2 border-black shadow-[3px_3px_0px_#000] text-emerald-950 text-xs font-bold flex items-center gap-2.5">
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-700 stroke-[2.5]" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* Google Sign-in button */}
          {mode !== "forgot" && (
            <>
              <button
                type="button"
                onClick={handleGoogleSignIn}
                disabled={loading}
                className="w-full py-2.5 px-4 bg-white hover:bg-amber-100 border-2 border-black shadow-[3px_3px_0px_#000] text-black font-display font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2.5 transition-all active:translate-x-0.5 active:translate-y-0.5 active:shadow-[1px_1px_0px_#000] cursor-pointer disabled:opacity-50"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
                CONTINUE WITH GOOGLE
              </button>

              <div className="relative flex py-1 items-center">
                <div className="grow border-t-2 border-black"></div>
                <span className="shrink mx-3 text-[10px] text-black uppercase tracking-widest font-black bg-white px-1">
                  OR WITH EMAIL
                </span>
                <div className="grow border-t-2 border-black"></div>
              </div>
            </>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-3.5">
            {mode === "register" && (
              <div>
                <label className="block text-xs font-black uppercase tracking-wider text-black mb-1">
                  Full Name
                </label>
                <div className="relative">
                  <UserIcon className="w-4 h-4 text-black absolute left-3 top-3" />
                  <input
                    type="text"
                    required
                    placeholder="Enter your name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 text-xs font-bold text-black bg-white border-2 border-black shadow-[2px_2px_0px_#000] focus:bg-amber-50/50 focus:outline-none focus:border-indigo-600 transition-colors"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-black uppercase tracking-wider text-black mb-1">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-black absolute left-3 top-3" />
                <input
                  type="email"
                  required
                  placeholder="name@business.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 text-xs font-bold text-black bg-white border-2 border-black shadow-[2px_2px_0px_#000] focus:bg-amber-50/50 focus:outline-none focus:border-indigo-600 transition-colors"
                />
              </div>
            </div>

            {mode !== "forgot" && (
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-black uppercase tracking-wider text-black">
                    Password
                  </label>
                  {mode === "login" && (
                    <button
                      type="button"
                      onClick={() => {
                        setMode("forgot");
                        setError(null);
                      }}
                      className="text-[10px] font-black text-indigo-600 hover:text-black uppercase tracking-wider underline decoration-2 underline-offset-2 cursor-pointer"
                    >
                      Forgot?
                    </button>
                  )}
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-black absolute left-3 top-3" />
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 text-xs font-bold text-black bg-white border-2 border-black shadow-[2px_2px_0px_#000] focus:bg-amber-50/50 focus:outline-none focus:border-indigo-600 transition-colors"
                  />
                </div>
              </div>
            )}

            {mode === "register" && (
              <div>
                <label className="block text-xs font-black uppercase tracking-wider text-black mb-1">
                  Confirm Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-black absolute left-3 top-3" />
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 text-xs font-bold text-black bg-white border-2 border-black shadow-[2px_2px_0px_#000] focus:bg-amber-50/50 focus:outline-none focus:border-indigo-600 transition-colors"
                  />
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-display font-black text-xs uppercase tracking-wider border-3 border-black shadow-[4px_4px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 active:shadow-[1px_1px_0px_#000] flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50 mt-4"
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin stroke-[3]" />
              ) : (
                <>
                  {mode === "login" && "SIGN IN TO DASHBOARD"}
                  {mode === "register" && "CREATE ACCOUNT"}
                  {mode === "forgot" && "SEND RECOVERY LINK"}
                  <ArrowRight className="w-4 h-4 stroke-[3]" />
                </>
              )}
            </button>
          </form>

          {/* Footer mode toggle */}
          <div className="text-center pt-3 border-t-2 border-black/10">
            {mode === "login" && (
              <p className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Need an account?{" "}
                <button
                  onClick={() => {
                    setMode("register");
                    setError(null);
                  }}
                  className="font-black text-indigo-600 hover:text-black underline decoration-2 underline-offset-2 cursor-pointer ml-1"
                >
                  SIGN UP NOW
                </button>
              </p>
            )}

            {mode === "register" && (
              <p className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Already registered?{" "}
                <button
                  onClick={() => {
                    setMode("login");
                    setError(null);
                  }}
                  className="font-black text-indigo-600 hover:text-black underline decoration-2 underline-offset-2 cursor-pointer ml-1"
                >
                  SIGN IN HERE
                </button>
              </p>
            )}

            {mode === "forgot" && (
              <p className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Remember credentials?{" "}
                <button
                  onClick={() => {
                    setMode("login");
                    setError(null);
                  }}
                  className="font-black text-indigo-600 hover:text-black underline decoration-2 underline-offset-2 cursor-pointer ml-1"
                >
                  BACK TO LOGIN
                </button>
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
