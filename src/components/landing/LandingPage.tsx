import React, { useState } from 'react';
import Image from "next/image";
import Link from "next/link";
import { 
  ArrowRight, 
  Play, 
  Star, 
  Zap, 
  Code, 
  Clock, 
  Check, 
  ShieldCheck, 
  Sparkles, 
  Terminal, 
  Database, 
  ChevronDown,
  BookOpen,
  FileText
} from 'lucide-react';

interface Props {
  onGetStarted: () => void;
  onSignIn?: () => void;
}

export const LandingPage: React.FC<Props> = ({ onGetStarted, onSignIn }) => {
  const [selectedShortCategory, setSelectedShortCategory] = useState<string>('ALL CATEGORIES');

  // Official LWHH 2x2 Square Logo Component
  const LWHHLogo = () => (
    <Link href="/" className="flex items-center gap-3 cursor-pointer">
      <Image src="/somporko.webp" alt="Shomporko CRM Logo" width={40} height={40} className="object-contain" />
      <span className="font-display font-black text-2xl tracking-tighter text-black">
        SHOMPORKO
      </span>
    </Link>
  );

  return (
    <div className="min-h-screen bg-white font-sans text-black selection:bg-red-600 selection:text-white">
      
      {/* 1. Header Navbar */}
      <header className="sticky top-0 z-50 bg-white border-b-4 border-black shadow-[0_4px_0px_#000]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            
            <LWHHLogo />

            {/* Navigation Links */}
            <nav className="hidden md:flex items-center gap-8 font-display font-black text-sm tracking-wider uppercase">
              <Link href="/about" className="hover:text-indigo-600 hover:underline decoration-4 underline-offset-4 transition-all">ABOUT</Link>
              <Link href="/pricing" className="hover:text-indigo-600 hover:underline decoration-4 underline-offset-4 transition-all">PRICING</Link>
              <Link href="/contact" className="hover:text-indigo-600 hover:underline decoration-4 underline-offset-4 transition-all">CONTACT</Link>
            </nav>

            {/* Auth Action Buttons */}
            <div className="flex items-center gap-3">
              <button 
                onClick={onSignIn || onGetStarted}
                className="hidden sm:block px-4 py-2 text-sm font-black uppercase tracking-wider bg-white hover:bg-slate-100 text-black border-2 border-black shadow-[2px_2px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all"
              >
                LOG IN / SIGN UP
              </button>
              <button 
                onClick={onGetStarted}
                className="px-5 py-2.5 text-sm font-black uppercase tracking-wider bg-red-600 hover:bg-red-700 text-white border-3 border-black shadow-[4px_4px_0px_#000] active:translate-x-1 active:translate-y-1 active:shadow-none transition-all flex items-center gap-1.5"
              >
                GET STARTED
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* 2. Hero Section */}
      <section className="relative overflow-hidden border-b-4 border-black">
        <div className="grid lg:grid-cols-12 min-h-[580px]">
          
          {/* Left Column: Headline & Social Proof */}
          <div className="lg:col-span-7 bg-gradient-to-tr from-slate-900 to-indigo-900 text-white p-6 sm:p-12 lg:p-16 flex flex-col justify-center border-b-4 lg:border-b-0 lg:border-r-4 border-black relative">
            
            {/* Background Grid Pattern */}
            <div className="absolute inset-0 opacity-15 bg-[linear-gradient(to_right,#000_1px,transparent_1px),linear-gradient(to_bottom,#000_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />

            <div className="relative z-10 max-w-2xl">

              <h1 className="font-display font-black text-5xl sm:text-6xl lg:text-7xl tracking-tight leading-[0.9] text-white mb-6 uppercase">
                THE ULTIMATE POS & ERP SOFTWARE <br/><span className="text-indigo-400">FOR YOUR BUSINESS.</span>
              </h1>

              <p className="font-medium text-lg sm:text-xl text-indigo-100 leading-relaxed mb-8 max-w-xl">
                Fast, reliable, and user-friendly tools that empower businesses to operate efficiently, manage inventory flawlessly, and maximize profits in real-time.
              </p>

              {/* Main Call to Action Button */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 mb-10">
                <button 
                  onClick={onGetStarted}
                  className="px-8 py-4 bg-indigo-500 hover:bg-indigo-600 text-white font-display font-black text-base uppercase tracking-wider border-3 border-black shadow-[6px_6px_0px_#000] active:translate-x-1 active:translate-y-1 active:shadow-[2px_2px_0px_#000] transition-all flex items-center justify-center gap-3 group"
                >
                  GET STARTED <ArrowRight className="w-5 h-5 stroke-[3] group-hover:translate-x-1 transition-transform" />
                </button>

                <button 
                  onClick={() => {
                    const el = document.getElementById('pricing');
                    el?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="px-6 py-4 bg-white hover:bg-slate-100 text-black font-display font-black text-base uppercase tracking-wider border-3 border-black shadow-[6px_6px_0px_#000] active:translate-x-1 active:translate-y-1 active:shadow-[2px_2px_0px_#000] transition-all text-center"
                >
                  VIEW PRICING
                </button>
              </div>

              {/* Social Proof Row */}
              <div className="pt-6 border-t-2 border-black/20 flex flex-wrap items-center gap-4 sm:gap-6">
                <div className="flex items-center -space-x-3">
                  {['👨‍💻', '👩‍💻', '🧑‍🏫', '👨‍🔬'].map((emoji, idx) => (
                    <div key={idx} className="w-10 h-10 rounded-full bg-amber-100 border-2 border-black flex items-center justify-center text-lg shadow-[2px_2px_0px_#000]">
                      {emoji}
                    </div>
                  ))}
                  <div className="w-10 h-10 rounded-full bg-red-600 border-2 border-black flex items-center justify-center font-black text-xs text-white shadow-[2px_2px_0px_#000]">
                    +10K
                  </div>
                </div>

                <div className="flex flex-col">
                  <span className="text-xs font-extrabold text-white uppercase tracking-wider">
                    Join 10,000+ businesses growing their profits
                  </span>
                  <div className="flex items-center gap-1 text-amber-500 text-xs font-bold mt-0.5">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-amber-400 stroke-black stroke-[1.5]" />
                    ))}
                    <span className="text-white font-black ml-1">5</span>
                    <span className="text-indigo-200 font-medium">(countless reviews)</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Premium & Free Courses Hero Card */}
          <div className="lg:col-span-5 bg-indigo-500 p-8 sm:p-12 lg:p-14 flex items-center justify-center relative overflow-hidden">
            
            {/* Neo-brutalist Floating White Card */}
            <div className="w-full max-w-md bg-[#FFFDF0] border-4 border-black shadow-[10px_10px_0px_#000] p-6 sm:p-8 relative transform sm:rotate-1 hover:rotate-0 transition-transform">
              
              {/* Star Badge Top Left */}
              <div className="absolute -top-5 -left-5 w-12 h-12 bg-indigo-600 border-3 border-black rounded-full flex items-center justify-center shadow-[3px_3px_0px_#000]">
                <Sparkles className="w-6 h-6 text-white stroke-[2.5]" />
              </div>

              <h2 className="font-display font-black text-3xl sm:text-4xl text-black uppercase tracking-tight leading-tight mt-2 mb-4">
                ULTIMATE <br />
                <span className="text-indigo-600">POS & ERP</span>
              </h2>

              <div className="w-full h-1 bg-black mb-6" />

              {/* 2 Stat Cards */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white border-3 border-black p-4 text-center shadow-[4px_4px_0px_#000]">
                  <div className="font-display font-black text-3xl sm:text-4xl text-black">100%</div>
                  <div className="text-[11px] font-black tracking-widest text-indigo-600 uppercase mt-1">RELIABLE</div>
                </div>

                <div className="bg-white border-3 border-black p-4 text-center shadow-[4px_4px_0px_#000]">
                  <div className="font-display font-black text-3xl sm:text-4xl text-black">24/7</div>
                  <div className="text-[11px] font-black tracking-widest text-indigo-600 uppercase mt-1">SUPPORT</div>
                </div>
              </div>

              <button 
                onClick={onGetStarted}
                className="w-full mt-6 py-3 bg-black hover:bg-slate-900 text-white font-display font-black text-xs uppercase tracking-widest border-2 border-black shadow-[3px_3px_0px_#4F46E5] transition-all flex items-center justify-center gap-2"
              >
                VIEW FEATURES <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Built for Modern Businesses */}
      <section className="py-20 sm:py-28 bg-indigo-600 border-b-4 border-black text-white relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Main Section Title */}
          <div className="text-center max-w-4xl mx-auto mb-6">
            <h2 className="font-display font-black text-4xl sm:text-6xl lg:text-7xl uppercase tracking-tight text-white drop-shadow-[5px_5px_0px_#000]">
              BUILT FOR MODERN BUSINESSES
            </h2>
          </div>

          {/* Subtitle Banner Box */}
          <div className="max-w-2xl mx-auto mb-16">
            <div className="bg-white text-black font-display font-black text-base sm:text-lg border-4 border-black shadow-[6px_6px_0px_#000] px-6 sm:px-8 py-4 text-center transform -rotate-1">
              Everything you need to run, scale, and automate your shop with zero hassle.
            </div>
          </div>

          {/* 3 Column Feature Cards */}
          <div className="grid md:grid-cols-3 gap-8 sm:gap-10">
            
            {/* Feature 1: POS Billing */}
            <div className="bg-[#FFFBEB] text-black border-4 border-black shadow-[8px_8px_0px_#000] p-8 relative flex flex-col justify-between">
              <div className="absolute -top-4 -right-4 w-10 h-10 bg-black text-white font-display font-black text-lg border-2 border-white flex items-center justify-center shadow-[3px_3px_0px_#000]">
                1
              </div>
              <div>
                <div className="w-14 h-14 bg-white border-3 border-black shadow-[3px_3px_0px_#000] flex items-center justify-center mb-6">
                  <span className="text-2xl font-black">⚡</span>
                </div>
                <h3 className="font-display font-black text-2xl text-black uppercase tracking-tight mb-3">
                  FAST POS BILLING
                </h3>
                <div className="w-full h-1 bg-black mb-4" />
                <p className="text-slate-800 font-bold text-sm sm:text-base leading-relaxed">
                  Barcode scanning, instant calculation, and multi-format thermal receipt printing (58mm/80mm) in seconds.
                </p>
              </div>
            </div>

            {/* Feature 2: Smart Inventory */}
            <div className="bg-[#E0F2FE] text-black border-4 border-black shadow-[8px_8px_0px_#000] p-8 relative flex flex-col justify-between">
              <div className="absolute -top-4 -right-4 w-10 h-10 bg-black text-white font-display font-black text-lg border-2 border-white flex items-center justify-center shadow-[3px_3px_0px_#000]">
                2
              </div>
              <div>
                <div className="w-14 h-14 bg-white border-3 border-black shadow-[3px_3px_0px_#000] flex items-center justify-center mb-6">
                  <span className="text-2xl font-black">📦</span>
                </div>
                <h3 className="font-display font-black text-2xl text-black uppercase tracking-tight mb-3">
                  SMART INVENTORY
                </h3>
                <div className="w-full h-1 bg-black mb-4" />
                <p className="text-slate-800 font-bold text-sm sm:text-base leading-relaxed">
                  Track stock levels across all branches, get low-stock notifications, generate barcodes, and automate supplier orders.
                </p>
              </div>
            </div>

            {/* Feature 3: Accounts & HRM */}
            <div className="bg-[#DCFCE7] text-black border-4 border-black shadow-[8px_8px_0px_#000] p-8 relative flex flex-col justify-between">
              <div className="absolute -top-4 -right-4 w-10 h-10 bg-black text-white font-display font-black text-lg border-2 border-white flex items-center justify-center shadow-[3px_3px_0px_#000]">
                3
              </div>
              <div>
                <div className="w-14 h-14 bg-white border-3 border-black shadow-[3px_3px_0px_#000] flex items-center justify-center mb-6">
                  <span className="text-2xl font-black">💼</span>
                </div>
                <h3 className="font-display font-black text-2xl text-black uppercase tracking-tight mb-3">
                  ACCOUNTS & HRM
                </h3>
                <div className="w-full h-1 bg-black mb-4" />
                <p className="text-slate-800 font-bold text-sm sm:text-base leading-relaxed">
                  Manage daily cashbook ledger, track expenses, handle staff attendance, monthly payroll, and CRM sales pipelines.
                </p>
              </div>
            </div>

            {/* Hardware Compatibility Strip */}
            <div className="mt-12 md:col-span-3 bg-black text-white p-6 border-4 border-black shadow-[8px_8px_0px_#000] flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-amber-300 text-black border-2 border-black flex items-center justify-center font-black text-xl shrink-0">
                  ⚙️
                </div>
                <div>
                  <h4 className="font-display font-black text-base sm:text-lg uppercase tracking-tight text-white">
                    PLUG-AND-PLAY POS HARDWARE INTEGRATION
                  </h4>
                  <p className="text-xs sm:text-sm font-medium text-slate-300">
                    Works seamlessly with USB Wired/Wireless Barcode Scanners, 80mm/58mm Thermal Receipt Printers, Electric Cash Drawers & Sticker Printers.
                  </p>
                </div>
              </div>
              <a
                href="/pricing"
                className="px-5 py-2.5 bg-amber-300 hover:bg-amber-400 text-black font-display font-black text-xs uppercase tracking-wider border-2 border-black shadow-[3px_3px_0px_#000] shrink-0"
              >
                VIEW HARDWARE PRICING →
              </a>
            </div>

          </div>
        </div>
      </section>

      {/* 4. Pricing Plans Overview Section */}
      <section id="pricing" className="py-20 sm:py-28 bg-[#FAF8F0] border-b-4 border-black relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.035] bg-[linear-gradient(to_right,#000_1px,transparent_1px),linear-gradient(to_bottom,#000_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-300 border-2 border-black shadow-[2px_2px_0px_#000] font-black text-xs uppercase tracking-wider mb-4">
              <Sparkles className="w-4 h-4 fill-black" /> TRANSPARENT & AFFORDABLE PRICING
            </div>
            <h2 className="font-display font-black text-4xl sm:text-6xl uppercase tracking-tight text-black mb-4">
              SIMPLE PRICING FOR <span className="text-indigo-600">EVERY BUSINESS</span>
            </h2>
            <div className="w-24 h-2 bg-indigo-600 mx-auto mb-6" />
            <p className="text-base sm:text-lg font-bold text-slate-700 leading-relaxed">
              No hidden fees. Powerful POS and ERP tools crafted to fit retailers, supermarkets, fashion shops, and enterprise chains in Bangladesh.
            </p>
          </div>

          {/* Pricing Cards Grid */}
          <div className="grid lg:grid-cols-3 gap-8 items-stretch mb-14">
            
            {/* Plan 1: Starter */}
            <div className="bg-white border-4 border-black shadow-[8px_8px_0px_#000] p-8 flex flex-col justify-between hover:-translate-y-1 transition-all">
              <div>
                <div className="inline-block px-3 py-1 bg-slate-100 border-2 border-black text-[11px] font-black uppercase mb-4 shadow-[2px_2px_0px_#000]">
                  SINGLE STORE
                </div>
                <h3 className="font-display font-black text-2xl uppercase tracking-tight text-black mb-2">
                  STARTER POS
                </h3>
                <p className="text-xs font-bold text-slate-600 uppercase tracking-wide mb-6">
                  Best for small retail shops, pharmacies, and grocery stores.
                </p>

                <div className="flex items-baseline gap-2 mb-6 pb-6 border-b-2 border-black">
                  <span className="font-display font-black text-5xl text-black">৳ 650</span>
                  <span className="text-xs font-black uppercase text-slate-600">/ Month</span>
                </div>

                <ul className="space-y-3 mb-8 text-xs font-bold text-black uppercase tracking-wider">
                  <li className="flex items-center gap-2.5">
                    <Check className="w-4 h-4 text-emerald-600 stroke-[3]" /> Fast POS Barcode Billing
                  </li>
                  <li className="flex items-center gap-2.5">
                    <Check className="w-4 h-4 text-emerald-600 stroke-[3]" /> 58mm / 80mm Thermal Receipt Print
                  </li>
                  <li className="flex items-center gap-2.5">
                    <Check className="w-4 h-4 text-emerald-600 stroke-[3]" /> Unlimited Products & Sales Invoices
                  </li>
                  <li className="flex items-center gap-2.5">
                    <Check className="w-4 h-4 text-emerald-600 stroke-[3]" /> Basic Inventory & Low Stock Alerts
                  </li>
                  <li className="flex items-center gap-2.5">
                    <Check className="w-4 h-4 text-emerald-600 stroke-[3]" /> Daily Sales & Collection Summary
                  </li>
                  <li className="flex items-center gap-2.5">
                    <Check className="w-4 h-4 text-emerald-600 stroke-[3]" /> 1 Store / 1 Counter User
                  </li>
                </ul>
              </div>

              <a
                href="/contact"
                className="w-full py-3.5 bg-white hover:bg-slate-100 text-black font-display font-black text-xs uppercase tracking-wider border-3 border-black shadow-[4px_4px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all flex items-center justify-center gap-2 text-center"
              >
                CHOOSE STARTER <ArrowRight className="w-4 h-4 stroke-[3]" />
              </a>
            </div>

            {/* Plan 2: Business Pro (Popular) */}
            <div className="bg-[#FFFDF0] border-4 border-black shadow-[10px_10px_0px_#000] p-8 flex flex-col justify-between relative transform lg:-translate-y-2">
              <div className="absolute -top-4 right-6 px-4 py-1.5 bg-amber-300 border-2 border-black font-black text-[11px] uppercase tracking-wider shadow-[2px_2px_0px_#000]">
                MOST POPULAR
              </div>

              <div>
                <div className="inline-block px-3 py-1 bg-indigo-600 text-white border-2 border-black text-[11px] font-black uppercase mb-4 shadow-[2px_2px_0px_#000]">
                  GROWING OUTLET
                </div>
                <h3 className="font-display font-black text-2xl uppercase tracking-tight text-black mb-2">
                  BUSINESS PRO
                </h3>
                <p className="text-xs font-bold text-slate-600 uppercase tracking-wide mb-6">
                  Perfect for fashion boutiques, departmental stores & restaurants.
                </p>

                <div className="flex items-baseline gap-2 mb-6 pb-6 border-b-2 border-black">
                  <span className="font-display font-black text-5xl text-indigo-600">৳ 1,450</span>
                  <span className="text-xs font-black uppercase text-slate-600">/ Month</span>
                </div>

                <ul className="space-y-3 mb-8 text-xs font-bold text-black uppercase tracking-wider">
                  <li className="flex items-center gap-2.5">
                    <Check className="w-4 h-4 text-indigo-600 stroke-[3]" /> Everything in Starter +
                  </li>
                  <li className="flex items-center gap-2.5">
                    <Check className="w-4 h-4 text-indigo-600 stroke-[3]" /> Customer Loyalty Points & Directory
                  </li>
                  <li className="flex items-center gap-2.5">
                    <Check className="w-4 h-4 text-indigo-600 stroke-[3]" /> Happy Hours & Promo Discounts
                  </li>
                  <li className="flex items-center gap-2.5">
                    <Check className="w-4 h-4 text-indigo-600 stroke-[3]" /> Supplier Purchases & Barcode Generator
                  </li>
                  <li className="flex items-center gap-2.5">
                    <Check className="w-4 h-4 text-indigo-600 stroke-[3]" /> Accounts & Expense Cashbook
                  </li>
                  <li className="flex items-center gap-2.5">
                    <Check className="w-4 h-4 text-indigo-600 stroke-[3]" /> Sales Returns & Approval Workflow
                  </li>
                  <li className="flex items-center gap-2.5">
                    <Check className="w-4 h-4 text-indigo-600 stroke-[3]" /> Up to 5 Counter Staff Roles
                  </li>
                </ul>
              </div>

              <a
                href="/contact"
                className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-display font-black text-xs uppercase tracking-wider border-3 border-black shadow-[4px_4px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all flex items-center justify-center gap-2 text-center"
              >
                START BUSINESS PRO <ArrowRight className="w-4 h-4 stroke-[3]" />
              </a>
            </div>

            {/* Plan 3: Enterprise */}
            <div className="bg-white border-4 border-black shadow-[8px_8px_0px_#000] p-8 flex flex-col justify-between hover:-translate-y-1 transition-all">
              <div>
                <div className="inline-block px-3 py-1 bg-black text-white border-2 border-black text-[11px] font-black uppercase mb-4 shadow-[2px_2px_0px_#EF4444]">
                  MULTI-BRANCH CHAIN
                </div>
                <h3 className="font-display font-black text-2xl uppercase tracking-tight text-black mb-2">
                  ENTERPRISE ERP
                </h3>
                <p className="text-xs font-bold text-slate-600 uppercase tracking-wide mb-6">
                  For multi-branch chains, wholesalers & large enterprises.
                </p>

                <div className="flex items-baseline gap-2 mb-6 pb-6 border-b-2 border-black">
                  <span className="font-display font-black text-5xl text-black">৳ 2,850</span>
                  <span className="text-xs font-black uppercase text-slate-600">/ Month</span>
                </div>

                <ul className="space-y-3 mb-8 text-xs font-bold text-black uppercase tracking-wider">
                  <li className="flex items-center gap-2.5">
                    <Check className="w-4 h-4 text-emerald-600 stroke-[3]" /> Everything in Business Pro +
                  </li>
                  <li className="flex items-center gap-2.5">
                    <Check className="w-4 h-4 text-emerald-600 stroke-[3]" /> Multi-Branch & Central Warehouse Sync
                  </li>
                  <li className="flex items-center gap-2.5">
                    <Check className="w-4 h-4 text-emerald-600 stroke-[3]" /> Full HRM, Attendance & Payroll
                  </li>
                  <li className="flex items-center gap-2.5">
                    <Check className="w-4 h-4 text-emerald-600 stroke-[3]" /> Employee Loans & Overtime Management
                  </li>
                  <li className="flex items-center gap-2.5">
                    <Check className="w-4 h-4 text-emerald-600 stroke-[3]" /> Sales CRM & AI Prospecting Engine
                  </li>
                  <li className="flex items-center gap-2.5">
                    <Check className="w-4 h-4 text-emerald-600 stroke-[3]" /> Unlimited Counters & Custom Roles
                  </li>
                  <li className="flex items-center gap-2.5">
                    <Check className="w-4 h-4 text-emerald-600 stroke-[3]" /> 24/7 Dedicated Account Manager
                  </li>
                </ul>
              </div>

              <a
                href="/contact"
                className="w-full py-3.5 bg-black hover:bg-slate-900 text-white font-display font-black text-xs uppercase tracking-wider border-3 border-black shadow-[4px_4px_0px_#4F46E5] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all flex items-center justify-center gap-2 text-center"
              >
                CONTACT ENTERPRISE <ArrowRight className="w-4 h-4 stroke-[3]" />
              </a>
            </div>

          </div>

          <div className="text-center">
            <a
              href="/pricing"
              className="inline-flex items-center gap-2 px-8 py-4 bg-white text-black font-display font-black text-sm uppercase tracking-wider border-3 border-black shadow-[4px_4px_0px_#000] hover:bg-amber-200 active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all"
            >
              VIEW FULL PRICING MATRIX & FAQ <ArrowRight className="w-4 h-4 stroke-[3]" />
            </a>
          </div>

        </div>
      </section>

      {/* 6. Footer Section */}
      <footer className="bg-[#FAF8F0] text-black pt-16 pb-10 border-t-4 border-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="grid md:grid-cols-12 gap-10 mb-16">
            
            <div className="md:col-span-5">
              <div className="mb-6">
                <LWHHLogo />
              </div>

              <div className="border-l-4 border-red-600 pl-4 py-1">
                <p className="font-display font-black text-sm text-black leading-relaxed max-w-md">
                  Empowering retail, fashion, supermarket, and wholesale businesses across Bangladesh with cutting-edge POS and ERP software automation.
                </p>
              </div>
            </div>

            <div className="md:col-span-3">
              <h4 className="font-display font-black text-xs uppercase tracking-widest text-black underline decoration-black decoration-2 underline-offset-4 mb-6">
                PLATFORM
              </h4>
              <ul className="space-y-3 font-display font-black text-xs uppercase tracking-wider">
                <li><Link href="/about" className="hover:text-indigo-600 transition-colors">ABOUT</Link></li>
                <li><Link href="/pricing" className="hover:text-indigo-600 transition-colors">PRICING</Link></li>
                <li><Link href="/contact" className="hover:text-indigo-600 transition-colors">CONTACT</Link></li>
              </ul>
            </div>

            <div className="md:col-span-4">
              <h4 className="font-display font-black text-xs uppercase tracking-widest text-black underline decoration-black decoration-2 underline-offset-4 mb-6">
                LEGAL
              </h4>
              <ul className="space-y-3 font-display font-black text-xs uppercase tracking-wider">
                <li><a href="#" className="hover:text-red-600 transition-colors">PRIVACY POLICY</a></li>
                <li><a href="#" className="hover:text-red-600 transition-colors">TERMS OF SERVICE</a></li>
                <li><a href="#" className="hover:text-red-600 transition-colors">REFUND POLICY</a></li>
              </ul>
            </div>

          </div>

          <div className="w-full h-1 bg-black mb-8" />

          <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
            <div className="font-display font-black text-xs uppercase tracking-wider text-black">
              © 2026 SHOMPORKO CRM. ALL RIGHTS RESERVED.
            </div>

            <div className="flex items-center gap-2 flex-wrap justify-center">
              <span className="text-[10px] font-black text-slate-500 uppercase mr-1">Pay With</span>
              {['VISA', 'MasterCard', 'AMEX', 'bKash', 'Nagad', 'Rocket', 'Upay'].map((pay, i) => (
                <span key={i} className="px-2 py-0.5 bg-white border border-black text-[9px] font-black uppercase shadow-[1px_1px_0px_#000]">
                  {pay}
                </span>
              ))}
            </div>

            <div className="px-4 py-2 bg-red-600 text-white font-display font-black text-xs uppercase tracking-wider border-2 border-black shadow-[3px_3px_0px_#000]">
              BUILT FOR MODERN BUSINESSES
            </div>
          </div>

        </div>
      </footer>

    </div>
  );
};