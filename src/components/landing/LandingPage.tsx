"use client";

import React from "react";
import {
  Sparkles,
  ArrowRight,
  Target,
  Copy,
  Printer,
  BarChart3,
  CheckCircle2,
  Users,
  Search,
  Headphones,
  ShieldCheck,
  Zap,
} from "lucide-react";

interface LandingPageProps {
  onGetStarted: () => void;
  onSignIn: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onGetStarted,
  onSignIn,
}) => {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col selection:bg-indigo-100">
      {/* Navbar */}
      <nav className="border-b border-slate-200/80 bg-white/80 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl bg-indigo-600 flex items-center justify-center text-white shadow-md shadow-indigo-200">
              <Sparkles className="w-5 h-5" />
            </div>
            <span className="text-lg font-bold tracking-tight text-slate-900">
              DailyPulse
            </span>
          </div>

          <div className="hidden md:flex items-center gap-8 text-xs font-semibold text-slate-600">
            <a href="#features" className="hover:text-indigo-600 transition-colors">
              Features
            </a>
            <a href="#workflow" className="hover:text-indigo-600 transition-colors">
              Daily Workflow
            </a>
            <a href="#reporting" className="hover:text-indigo-600 transition-colors">
              Reporting & PDF
            </a>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onSignIn}
              className="px-4 py-2 text-xs font-semibold text-slate-700 hover:text-indigo-600 transition-colors"
            >
              Sign In
            </button>
            <button
              onClick={onGetStarted}
              className="px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-xs shadow-indigo-100 transition-all active:scale-95 flex items-center gap-1.5"
            >
              Get Started Free <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-16 pb-20 md:pt-24 md:pb-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-semibold mb-6 animate-in fade-in slide-in-from-bottom-3 duration-300">
            <Zap className="w-3.5 h-3.5" />
            Automated Daily Work OS for High-Performance Teams
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-slate-900 max-w-4xl mx-auto leading-tight md:leading-none">
            Set Morning Goals. Log Evening Wins.{" "}
            <span className="text-indigo-600">Export Instant Reports.</span>
          </h1>

          <p className="mt-6 text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Eliminate standup chaos. Track lead generation targets, client onboarding,
            customer support resolutions, and competitor intelligence with 1-click formatted
            text for WhatsApp/Slack and printable executive PDF reports.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <button
              onClick={onGetStarted}
              className="px-7 py-3.5 text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-2xl shadow-lg shadow-indigo-200 transition-all active:scale-95 flex items-center gap-2"
            >
              Get Started Free <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={onSignIn}
              className="px-7 py-3.5 text-sm font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 rounded-2xl shadow-xs transition-all active:scale-95"
            >
              Live Demo / Sign In
            </button>
          </div>

          <div className="mt-6 flex items-center justify-center gap-6 text-xs text-slate-500 font-medium">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Firebase Cloud Sync
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" /> 1-Click WhatsApp / Slack Copy
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Export Clean PDF
            </span>
          </div>
        </div>
      </section>

      {/* Visual Product Showcase */}
      <section id="workflow" className="py-12 bg-white border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-xs font-bold uppercase tracking-widest text-indigo-600 mb-2">
              End-to-End Daily Rhythm
            </h2>
            <h3 className="text-2xl sm:text-3xl font-bold text-slate-900">
              Designed for Daily Velocity & Accountability
            </h3>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {/* Step 1: Morning Goal */}
            <div className="p-6 rounded-3xl bg-slate-50 border border-slate-200 hover:border-indigo-200 transition-all">
              <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold text-sm mb-4 shadow-md shadow-indigo-100">
                01
              </div>
              <h4 className="text-base font-bold text-slate-900 mb-2">
                Morning Work Goal
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed mb-4">
                Define pre-set targets for 15–20 leads, 5 qualified contacts, 10–15 follow-ups,
                and support tickets. Save custom defaults for every new day in 1 click.
              </p>
              <div className="p-3 bg-white rounded-xl border border-slate-200 text-[11px] font-mono text-slate-700 space-y-1">
                <div>• Find 15–20 e-commerce leads</div>
                <div>• Contact 5 qualified prospects</div>
                <div>• Follow up with 10–15 previous leads</div>
              </div>
            </div>

            {/* Step 2: EOD Report */}
            <div className="p-6 rounded-3xl bg-slate-50 border border-slate-200 hover:border-emerald-200 transition-all">
              <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold text-sm mb-4 shadow-md shadow-emerald-100">
                02
              </div>
              <h4 className="text-base font-bold text-slate-900 mb-2">
                End-of-Day Results & Actuals
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed mb-4">
                Log actual leads found, positive responses, client onboarding discussions, support
                resolution counts, and tomorrow&apos;s primary focus.
              </p>
              <div className="p-3 bg-white rounded-xl border border-slate-200 text-[11px] font-mono text-slate-700 space-y-1">
                <div>🎯 Leads Found: 18 / 20</div>
                <div>🔥 Positive Responses: 3</div>
                <div>💼 Onboardings: 1 converted</div>
              </div>
            </div>

            {/* Step 3: 1-Click Copy & Export */}
            <div className="p-6 rounded-3xl bg-slate-50 border border-slate-200 hover:border-indigo-200 transition-all">
              <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold text-sm mb-4 shadow-md shadow-indigo-100">
                03
              </div>
              <h4 className="text-base font-bold text-slate-900 mb-2">
                1-Click Beautiful Export
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed mb-4">
                Generate formatted markdown text with clean emojis ready for WhatsApp/Slack, or
                print executive PDF reports for management.
              </p>
              <div className="p-3 bg-white rounded-xl border border-slate-200 text-[11px] font-mono text-indigo-700 space-y-1">
                <div>🎯 **Lead Generation**</div>
                <div>* Leads found: 18</div>
                <div>* Positive responses: 3</div>
                <div>Tomorrow&apos;s priority: Close 2 deals</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Grid */}
      <section id="features" className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-xs font-bold uppercase tracking-widest text-indigo-600 mb-2">
              Engineered for Results
            </h2>
            <h3 className="text-2xl sm:text-3xl font-bold text-slate-900">
              Everything Needed to Drive Daily Operations
            </h3>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                <Target className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-slate-900 text-sm">Target vs. Actuals</h4>
              <p className="text-xs text-slate-500 leading-relaxed">
                Compare morning intentions with evening reality side-by-side to maintain
                relentless daily momentum.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                <Search className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-slate-900 text-sm">Competitor Intelligence</h4>
              <p className="text-xs text-slate-500 leading-relaxed">
                Log competitor posting tactics, short-form reels, promotional discounts, and
                organic lead-gen ideas to test.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                <Copy className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-slate-900 text-sm">1-Click Chat Ready Copy</h4>
              <p className="text-xs text-slate-500 leading-relaxed">
                Formatted with clean markdown and emojis, instantly ready to paste into Slack
                channels, WhatsApp groups, or Notion logs.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                <Printer className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-slate-900 text-sm">Executive PDF Reports</h4>
              <p className="text-xs text-slate-500 leading-relaxed">
                Generate clean, print-ready PDF summaries formatted with executive KPI cards and
                clean borders.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                <BarChart3 className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-slate-900 text-sm">Weekly & Monthly Analytics</h4>
              <p className="text-xs text-slate-500 leading-relaxed">
                Aggregated conversion rates, total contacts, resolution percentages, and
                historical trends across any custom date range.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-slate-900 text-sm">Firebase Cloud Partitioning</h4>
              <p className="text-xs text-slate-500 leading-relaxed">
                Your data is securely isolated by user account in Firestore, backed by zero-setup
                offline local fallback.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Bottom CTA Banner */}
      <section className="py-16 bg-white border-t border-slate-200">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h3 className="text-3xl font-extrabold text-slate-900">
            Ready to Streamline Your Daily Work Rhythm?
          </h3>
          <p className="mt-3 text-sm text-slate-500">
            Join now to set your daily goals, log your progress, and automate reporting in seconds.
          </p>
          <div className="mt-8 flex justify-center gap-4">
            <button
              onClick={onGetStarted}
              className="px-8 py-3.5 text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-2xl shadow-lg shadow-indigo-200 transition-all active:scale-95 flex items-center gap-2"
            >
              Get Started Now <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200 py-6 text-center text-xs text-slate-400 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <span className="font-medium text-slate-600">DailyPulse © 2026</span>
          <span>Next.js • TypeScript • Tailwind CSS • Firebase Firestore</span>
        </div>
      </footer>
    </div>
  );
};
