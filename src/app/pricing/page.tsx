"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import Image from "next/image";
import { 
  Check, 
  X, 
  Sparkles, 
  ArrowRight, 
  MessageCircle, 
  Phone, 
  HelpCircle, 
  ShieldCheck, 
  Zap, 
  ChevronDown 
} from 'lucide-react';

const Logo = () => (
  <Link href="/" className="flex items-center gap-3 cursor-pointer">
    <Image src="/somporko.webp" alt="Shomporko CRM Logo" width={40} height={40} className="object-contain" />
    <span className="font-display font-black text-2xl tracking-tighter text-black">
      SHOMPORKO
    </span>
  </Link>
);

export default function PricingPage() {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');

  const plans = [
    {
      id: 'starter',
      name: 'STARTER POS',
      badge: 'SINGLE STORE',
      badgeColor: 'bg-slate-100 text-black',
      desc: 'Ideal for small retail shops, pharmacies, grocery stores, and single counters.',
      priceMonthly: 650,
      priceYearly: 6500,
      features: [
        'Fast POS Barcode Billing Counter',
        '58mm & 80mm Thermal Receipt Printing',
        'Unlimited Products & Daily Invoices',
        'Real-time Inventory & Low Stock Alerts',
        'Daily Sales & Payment Collection Summary',
        'Customer Directory Setup',
        '1 Store / 1 Counter User',
        'Free Setup & Phone Support',
      ],
      notIncluded: [
        'Loyalty Points & Happy Hour Promos',
        'Supplier Purchase & Barcode Generator',
        'Accounts & Expense Cashbook',
        'Multi-Branch Central Sync',
        'HRM, Attendance & Payroll',
      ],
      ctaText: 'START WITH STARTER',
      ctaHref: '/contact',
      isPopular: false,
    },
    {
      id: 'pro',
      name: 'BUSINESS PRO',
      badge: 'MOST POPULAR',
      badgeColor: 'bg-amber-300 text-black',
      desc: 'Perfect for busy fashion outlets, departmental stores, restaurants & growing businesses.',
      priceMonthly: 1450,
      priceYearly: 14500,
      features: [
        'Everything in Starter POS +',
        'Customer Loyalty Points & VIP Cards',
        'Happy Hours & Promo Discount Rules',
        'Supplier Purchases & Product Lifting',
        'Barcode Label Generator & Printing',
        'Accounts Ledger & Expense Tracking',
        'Sales Return & Approval Workflow',
        'Up to 5 Counter Staff Roles',
        'Priority WhatsApp & Remote Training',
      ],
      notIncluded: [
        'Multi-Branch Central Sync',
        'HRM, Attendance & Payroll',
        'Sales CRM Pipeline & AI Lead Prospecting',
      ],
      ctaText: 'CHOOSE BUSINESS PRO',
      ctaHref: '/contact',
      isPopular: true,
    },
    {
      id: 'enterprise',
      name: 'ENTERPRISE ERP',
      badge: 'MULTI-BRANCH & CHAIN',
      badgeColor: 'bg-black text-white',
      desc: 'For multi-branch supermarket chains, wholesalers, and large business operations.',
      priceMonthly: 2850,
      priceYearly: 28500,
      features: [
        'Everything in Business Pro +',
        'Multi-Branch & Central Warehouse Sync',
        'Full HRM: Employee Attendance & Rosters',
        'Daily Work Reports & Monthly Payroll',
        'Employee Advances, Loans & Overtime',
        'Sales CRM Pipeline & AI Prospecting',
        'Asset & Food/Catering Management',
        'Unlimited Counters & Custom Role Access',
        'Dedicated 24/7 Account Manager',
      ],
      notIncluded: [],
      ctaText: 'CONTACT ENTERPRISE',
      ctaHref: '/contact',
      isPopular: false,
    },
  ];

  const comparisonFeatures = [
    { feature: 'POS Barcode Billing & Thermal Printing', starter: true, pro: true, enterprise: true },
    { feature: 'Product & Stock Alert Engine', starter: true, pro: true, enterprise: true },
    { feature: 'Daily Sales & Collection Summary', starter: true, pro: true, enterprise: true },
    { feature: 'Customer Loyalty Points & Member Tiers', starter: false, pro: true, enterprise: true },
    { feature: 'Time-based Promotions & Happy Hours', starter: false, pro: true, enterprise: true },
    { feature: 'Vendor Management & Purchase Orders', starter: false, pro: true, enterprise: true },
    { feature: 'Product Barcode Sticker Generator', starter: false, pro: true, enterprise: true },
    { feature: 'Accounts Cashbook & Expense Tracking', starter: false, pro: true, enterprise: true },
    { feature: 'Sales Return & Multi-level Approvals', starter: false, pro: true, enterprise: true },
    { feature: 'Multi-Branch & Warehouse Synchronization', starter: false, false: true, pro: false, enterprise: true },
    { feature: 'HRM Attendance, Daily Reports & Payroll', starter: false, pro: false, enterprise: true },
    { feature: 'Employee Loans, Advances & Overtime', starter: false, pro: false, enterprise: true },
    { feature: 'Sales CRM & AI Lead Prospecting', starter: false, pro: false, enterprise: true },
    { feature: 'Dedicated 24/7 Priority Support', starter: 'Standard', pro: 'Priority WhatsApp', enterprise: '24/7 Dedicated Manager' },
  ];

  const faqs = [
    {
      q: 'Does Shomporko POS work with existing barcode scanners and thermal receipt printers?',
      a: 'Yes, 100%! Our POS billing engine connects seamlessly with all standard USB, Bluetooth, and network thermal printers (58mm, 80mm) as well as 1D/2D barcode scanners.',
    },
    {
      q: 'Can I start with Starter and upgrade later as my business grows?',
      a: 'Absolutely. You can upgrade from Starter to Business Pro or Enterprise at any time without losing any product data, sales invoices, or customer history.',
    },
    {
      q: 'What is the setup and onboarding process?',
      a: 'Our technical team assists with complete remote setup, importing your product lists from Excel, and providing live staff walkthroughs over WhatsApp or phone call.',
    },
    {
      q: 'Is my business data safe and backed up in the cloud?',
      a: 'Yes. All transactions, daily sales reports, and inventory counts are securely synchronized in real-time with automated daily cloud backups.',
    },
  ];

  return (
    <div className="min-h-screen bg-white font-sans text-black selection:bg-indigo-600 selection:text-white">
      {/* 1. Header Navbar */}
      <header className="sticky top-0 z-50 bg-white border-b-4 border-black shadow-[0_4px_0px_#000]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <Logo />
            <nav className="hidden md:flex items-center gap-8 font-display font-black text-sm tracking-wider uppercase">
              <Link href="/about" className="hover:text-indigo-600 hover:underline decoration-4 underline-offset-4 transition-all">
                ABOUT
              </Link>
              <Link href="/pricing" className="hover:text-indigo-600 underline decoration-4 underline-offset-4 decoration-indigo-600 text-indigo-600 transition-all">
                PRICING
              </Link>
              <Link href="/contact" className="hover:text-indigo-600 hover:underline decoration-4 underline-offset-4 transition-all">
                CONTACT
              </Link>
            </nav>
            <div className="flex items-center gap-3">
              <Link href="/?auth=login" className="hidden sm:block px-4 py-2 text-sm font-black uppercase tracking-wider bg-white hover:bg-slate-100 text-black border-2 border-black shadow-[2px_2px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all">
                LOG IN / SIGN UP
              </Link>
              <Link href="/?auth=register" className="px-5 py-2.5 text-sm font-black uppercase tracking-wider bg-indigo-600 hover:bg-indigo-700 text-white border-3 border-black shadow-[4px_4px_0px_#000] active:translate-x-1 active:translate-y-1 active:shadow-none transition-all flex items-center gap-1.5">
                GET STARTED
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Main Pricing Hero */}
      <main className="py-16 sm:py-24 relative overflow-hidden">
        {/* Background Grid Pattern */}
        <div className="absolute inset-0 opacity-[0.035] bg-[linear-gradient(to_right,#000_1px,transparent_1px),linear-gradient(to_bottom,#000_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          
          {/* Header Title */}
          <div className="text-center max-w-3xl mx-auto mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-300 border-2 border-black shadow-[2px_2px_0px_#000] font-black text-xs uppercase tracking-wider mb-4">
              <Sparkles className="w-4 h-4 fill-black" /> POS & ERP PRICING IN BANGLADESH
            </div>
            <h1 className="font-display font-black text-4xl sm:text-6xl uppercase tracking-tight text-black mb-4">
              AFFORDABLE PLANS FOR <br /><span className="text-indigo-600">EVERY BUSINESS</span>
            </h1>
            <div className="w-24 h-2 bg-indigo-600 mx-auto mb-6" />
            <p className="text-base sm:text-lg font-bold text-slate-700 leading-relaxed">
              Transparent pricing with no hidden charges. Choose the tier that matches your operations, from single checkout counters to nationwide enterprise chains.
            </p>

            {/* Monthly / Yearly Toggle */}
            <div className="mt-8 inline-flex items-center gap-3 p-1.5 bg-white border-3 border-black shadow-[4px_4px_0px_#000]">
              <button
                type="button"
                onClick={() => setBillingCycle('monthly')}
                className={`px-5 py-2 text-xs font-black uppercase tracking-wider transition-all cursor-pointer ${
                  billingCycle === 'monthly'
                    ? 'bg-indigo-600 text-white border-2 border-black shadow-[2px_2px_0px_#000]'
                    : 'text-black hover:bg-slate-100'
                }`}
              >
                MONTHLY BILLING
              </button>
              <button
                type="button"
                onClick={() => setBillingCycle('yearly')}
                className={`px-5 py-2 text-xs font-black uppercase tracking-wider transition-all flex items-center gap-2 cursor-pointer ${
                  billingCycle === 'yearly'
                    ? 'bg-amber-300 text-black border-2 border-black shadow-[2px_2px_0px_#000]'
                    : 'text-black hover:bg-slate-100'
                }`}
              >
                <span>ANNUAL BILLING</span>
                <span className="px-2 py-0.5 bg-emerald-500 text-white text-[10px] font-black rounded-none border border-black">
                  SAVE 2 MONTHS
                </span>
              </button>
            </div>
          </div>

          {/* Pricing Cards Grid */}
          <div className="grid lg:grid-cols-3 gap-8 items-stretch mb-20">
            {plans.map((plan) => {
              const price = billingCycle === 'monthly' ? plan.priceMonthly : plan.priceYearly;
              const period = billingCycle === 'monthly' ? '/ Month' : '/ Year';

              return (
                <div
                  key={plan.id}
                  className={`border-4 border-black p-8 flex flex-col justify-between transition-all relative ${
                    plan.isPopular
                      ? 'bg-[#FFFDF0] shadow-[12px_12px_0px_#000] lg:-translate-y-3'
                      : 'bg-white shadow-[8px_8px_0px_#000] hover:-translate-y-1'
                  }`}
                >
                  {plan.isPopular && (
                    <div className="absolute -top-4 right-6 px-4 py-1.5 bg-amber-300 border-2 border-black font-black text-[11px] uppercase tracking-wider shadow-[2px_2px_0px_#000]">
                      MOST POPULAR
                    </div>
                  )}

                  <div>
                    <div className={`inline-block px-3 py-1 border-2 border-black text-[11px] font-black uppercase mb-4 shadow-[2px_2px_0px_#000] ${plan.badgeColor}`}>
                      {plan.badge}
                    </div>
                    <h3 className="font-display font-black text-2xl uppercase tracking-tight text-black mb-2">
                      {plan.name}
                    </h3>
                    <p className="text-xs font-bold text-slate-600 uppercase tracking-wide mb-6">
                      {plan.desc}
                    </p>

                    <div className="flex items-baseline gap-2 mb-6 pb-6 border-b-2 border-black">
                      <span className={`font-display font-black text-5xl ${plan.isPopular ? 'text-indigo-600' : 'text-black'}`}>
                        ৳ {price.toLocaleString()}
                      </span>
                      <span className="text-xs font-black uppercase text-slate-600">
                        {period}
                      </span>
                    </div>

                    <div className="space-y-3 mb-8">
                      <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 block mb-2">
                        Included Capabilities:
                      </span>
                      {plan.features.map((feat, idx) => (
                        <div key={idx} className="flex items-start gap-2.5 text-xs font-bold text-black uppercase tracking-wider">
                          <Check className="w-4 h-4 text-emerald-600 stroke-[3] shrink-0 mt-0.5" />
                          <span>{feat}</span>
                        </div>
                      ))}

                      {plan.notIncluded.length > 0 && (
                        <div className="pt-4 border-t border-black/10 space-y-2.5 opacity-60">
                          {plan.notIncluded.map((notFeat, idx) => (
                            <div key={idx} className="flex items-start gap-2.5 text-xs font-bold text-slate-500 uppercase tracking-wider line-through">
                              <X className="w-4 h-4 text-slate-400 stroke-[2] shrink-0 mt-0.5" />
                              <span>{notFeat}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="space-y-3 pt-4 border-t-2 border-black">
                    <Link
                      href={plan.ctaHref}
                      className={`w-full py-4 text-center font-display font-black text-xs uppercase tracking-wider border-3 border-black shadow-[4px_4px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all flex items-center justify-center gap-2 ${
                        plan.isPopular
                          ? 'bg-indigo-600 hover:bg-indigo-700 text-white'
                          : 'bg-white hover:bg-slate-100 text-black'
                      }`}
                    >
                      {plan.ctaText} <ArrowRight className="w-4 h-4 stroke-[3]" />
                    </Link>

                    <a
                      href={`https://wa.me/8801315861003?text=${encodeURIComponent(`Hello Shomporko CRM, I would like to inquire about the ${plan.name} plan.`)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full py-2.5 bg-white hover:bg-emerald-100 text-emerald-900 font-display font-black text-[11px] uppercase tracking-wider border-2 border-black shadow-[2px_2px_0px_#000] flex items-center justify-center gap-2 transition-all text-center"
                    >
                      <MessageCircle className="w-3.5 h-3.5 text-emerald-600 stroke-[2.5]" /> INQUIRE ON WHATSAPP
                    </a>
                  </div>
                </div>
              );
            })}
          </div>

          {/* POS Hardware & Machine Integration Showcase (Matching image & specs) */}
          <div className="mb-20">
            <div className="border-4 border-black bg-amber-300 p-6 sm:p-8 shadow-[8px_8px_0px_#000] mb-8">
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div>
                  <span className="px-3 py-1 bg-black text-amber-300 font-display font-black text-xs uppercase tracking-widest border border-black inline-block mb-2">
                    HARDWARE INTEGRATION
                  </span>
                  <h2 className="font-display font-black text-2xl sm:text-3xl uppercase tracking-tight text-black">
                    COMPATIBLE POS HARDWARE & MACHINES
                  </h2>
                  <p className="text-xs sm:text-sm font-bold text-black uppercase tracking-wider mt-1">
                    Pre-tested, plug-and-play barcode scanners, thermal receipt printers & label makers with 1-Year Warranty
                  </p>
                </div>
                <a
                  href="https://wa.me/8801315861003?text=Hello%20Shomporko%20CRM,%20I%20am%20interested%20in%20ordering%20POS%20Hardware."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-6 py-3 bg-black hover:bg-slate-900 text-white font-display font-black text-xs uppercase tracking-wider border-2 border-black shadow-[3px_3px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 transition-all shrink-0 flex items-center gap-2"
                >
                  <MessageCircle className="w-4 h-4 text-emerald-400" /> ORDER VIA WHATSAPP (01315861003)
                </a>
              </div>
            </div>

            {/* Hardware Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              
              {/* 1. Barcode Scanner (with wire) */}
              <div className="bg-white border-4 border-black p-6 shadow-[6px_6px_0px_#000] flex flex-col justify-between relative hover:-translate-y-1 transition-all">
                <div className="absolute top-4 right-4 px-3 py-1 bg-red-600 text-white font-black text-xs uppercase tracking-wider border-2 border-black shadow-[2px_2px_0px_#000]">
                  40% OFF
                </div>

                <div>
                  <div className="h-44 w-full bg-slate-50 border-2 border-black mb-4 flex items-center justify-center p-4 relative overflow-hidden">
                    {/* Visual Vector Icon / Representation */}
                    <div className="flex flex-col items-center">
                      <div className="w-16 h-28 bg-slate-800 rounded-t-xl rounded-b-md border-2 border-black flex flex-col items-center justify-between p-2 shadow-inner">
                        <div className="w-12 h-3 bg-red-500 rounded-sm animate-pulse" />
                        <div className="w-6 h-8 bg-slate-700 rounded-md" />
                      </div>
                      <div className="w-2 h-10 bg-black" />
                      <span className="text-[10px] font-mono font-black text-slate-500 mt-1">[USB WIRED]</span>
                    </div>
                  </div>

                  <h3 className="font-display font-black text-lg uppercase text-black mb-1">
                    Barcode Scanner (with wire)
                  </h3>
                  <p className="text-xs font-bold text-slate-600 uppercase mb-4">
                    High-speed 1D laser scanning, USB Plug & Play with drop-resistant ergonomic handle.
                  </p>

                  <div className="flex items-baseline gap-2 mb-4 pb-3 border-b-2 border-black">
                    <span className="font-display font-black text-2xl text-black">
                      ৳ 1,650
                    </span>
                    <span className="text-xs font-bold text-slate-400 line-through">
                      ৳ 2,800
                    </span>
                  </div>

                  <ul className="text-xs font-bold text-slate-700 space-y-1.5 mb-6 uppercase">
                    <li className="flex items-center gap-1.5">
                      <Check className="w-3.5 h-3.5 text-emerald-600 stroke-[3]" /> Fast 300 scans/sec laser sensor
                    </li>
                    <li className="flex items-center gap-1.5">
                      <Check className="w-3.5 h-3.5 text-emerald-600 stroke-[3]" /> Zero driver installation needed
                    </li>
                    <li className="flex items-center gap-1.5">
                      <Check className="w-3.5 h-3.5 text-emerald-600 stroke-[3]" /> 1-Year replacement warranty
                    </li>
                  </ul>
                </div>

                <a
                  href="https://wa.me/8801315861003?text=Hello%20Shomporko%20CRM,%20I%20want%20to%20order%20the%20Wired%20Barcode%20Scanner%20(40%25%20Off)."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3 bg-white hover:bg-slate-100 text-black font-display font-black text-xs uppercase tracking-wider border-2 border-black shadow-[3px_3px_0px_#000] text-center transition-all flex items-center justify-center gap-2"
                >
                  <Phone className="w-3.5 h-3.5" /> CALL US: 01315861003
                </a>
              </div>

              {/* 2. Barcode Scanner (wireless) */}
              <div className="bg-white border-4 border-black p-6 shadow-[6px_6px_0px_#000] flex flex-col justify-between relative hover:-translate-y-1 transition-all">
                <div className="absolute top-4 right-4 px-3 py-1 bg-red-600 text-white font-black text-xs uppercase tracking-wider border-2 border-black shadow-[2px_2px_0px_#000]">
                  15% OFF
                </div>

                <div>
                  <div className="h-44 w-full bg-slate-50 border-2 border-black mb-4 flex items-center justify-center p-4 relative overflow-hidden">
                    <div className="flex flex-col items-center">
                      <div className="w-16 h-28 bg-slate-900 rounded-t-xl rounded-b-md border-2 border-black flex flex-col items-center justify-between p-2 shadow-inner">
                        <div className="w-12 h-3 bg-cyan-400 rounded-sm animate-pulse" />
                        <div className="w-6 h-8 bg-indigo-500 rounded-md" />
                      </div>
                      <span className="text-[10px] font-mono font-black text-indigo-600 mt-2">[2.4G WIRELESS + BT]</span>
                    </div>
                  </div>

                  <h3 className="font-display font-black text-lg uppercase text-black mb-1">
                    Barcode Scanner (wireless)
                  </h3>
                  <p className="text-xs font-bold text-slate-600 uppercase mb-4">
                    Long-range 2.4GHz wireless + Bluetooth dongle with 2000mAh rechargeable lithium battery.
                  </p>

                  <div className="flex items-baseline gap-2 mb-4 pb-3 border-b-2 border-black">
                    <span className="font-display font-black text-2xl text-black">
                      ৳ 2,850
                    </span>
                    <span className="text-xs font-bold text-slate-400 line-through">
                      ৳ 3,400
                    </span>
                  </div>

                  <ul className="text-xs font-bold text-slate-700 space-y-1.5 mb-6 uppercase">
                    <li className="flex items-center gap-1.5">
                      <Check className="w-3.5 h-3.5 text-emerald-600 stroke-[3]" /> Up to 100m barrier-free range
                    </li>
                    <li className="flex items-center gap-1.5">
                      <Check className="w-3.5 h-3.5 text-emerald-600 stroke-[3]" /> Up to 30,000 scans per single charge
                    </li>
                    <li className="flex items-center gap-1.5">
                      <Check className="w-3.5 h-3.5 text-emerald-600 stroke-[3]" /> 1-Year replacement warranty
                    </li>
                  </ul>
                </div>

                <a
                  href="https://wa.me/8801315861003?text=Hello%20Shomporko%20CRM,%20I%20want%20to%20order%20the%20Wireless%20Barcode%20Scanner%20(15%25%20Off)."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3 bg-white hover:bg-slate-100 text-black font-display font-black text-xs uppercase tracking-wider border-2 border-black shadow-[3px_3px_0px_#000] text-center transition-all flex items-center justify-center gap-2"
                >
                  <Phone className="w-3.5 h-3.5" /> CALL US: 01315861003
                </a>
              </div>

              {/* 3. Thermal Receipt Printer (80mm) */}
              <div className="bg-white border-4 border-black p-6 shadow-[6px_6px_0px_#000] flex flex-col justify-between relative hover:-translate-y-1 transition-all">
                <div className="absolute top-4 right-4 px-3 py-1 bg-amber-300 text-black font-black text-xs uppercase tracking-wider border-2 border-black shadow-[2px_2px_0px_#000]">
                  TOP SELLER
                </div>

                <div>
                  <div className="h-44 w-full bg-slate-50 border-2 border-black mb-4 flex items-center justify-center p-4 relative overflow-hidden">
                    <div className="flex flex-col items-center">
                      <div className="w-28 h-24 bg-slate-900 border-3 border-black rounded-md p-2 flex flex-col justify-between shadow-md">
                        <div className="w-full h-3 bg-white border border-black flex items-center px-1">
                          <div className="w-8 h-1 bg-slate-300" />
                        </div>
                        <div className="flex justify-between items-center px-1">
                          <span className="w-2 h-2 rounded-full bg-emerald-400" />
                          <span className="text-[9px] font-mono text-white font-bold">80mm ESC/POS</span>
                        </div>
                      </div>
                      <span className="text-[10px] font-mono font-black text-slate-600 mt-2">[AUTO CUTTER]</span>
                    </div>
                  </div>

                  <h3 className="font-display font-black text-lg uppercase text-black mb-1">
                    Thermal POS Receipt Printer (80mm)
                  </h3>
                  <p className="text-xs font-bold text-slate-600 uppercase mb-4">
                    Ultra-fast 260mm/s speed, automatic paper cutter, ESC/POS, USB & LAN network interface.
                  </p>

                  <div className="flex items-baseline gap-2 mb-4 pb-3 border-b-2 border-black">
                    <span className="font-display font-black text-2xl text-black">
                      ৳ 5,400
                    </span>
                    <span className="text-xs font-bold text-slate-400 line-through">
                      ৳ 6,500
                    </span>
                  </div>

                  <ul className="text-xs font-bold text-slate-700 space-y-1.5 mb-6 uppercase">
                    <li className="flex items-center gap-1.5">
                      <Check className="w-3.5 h-3.5 text-emerald-600 stroke-[3]" /> Auto cash drawer kickout port
                    </li>
                    <li className="flex items-center gap-1.5">
                      <Check className="w-3.5 h-3.5 text-emerald-600 stroke-[3]" /> No ribbon or ink cartridges needed
                    </li>
                    <li className="flex items-center gap-1.5">
                      <Check className="w-3.5 h-3.5 text-emerald-600 stroke-[3]" /> 1-Year service warranty
                    </li>
                  </ul>
                </div>

                <a
                  href="https://wa.me/8801315861003?text=Hello%20Shomporko%20CRM,%20I%20want%20to%20order%20the%2080mm%20Thermal%20Receipt%20Printer."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3 bg-white hover:bg-slate-100 text-black font-display font-black text-xs uppercase tracking-wider border-2 border-black shadow-[3px_3px_0px_#000] text-center transition-all flex items-center justify-center gap-2"
                >
                  <Phone className="w-3.5 h-3.5" /> CALL US: 01315861003
                </a>
              </div>

              {/* 4. Thermal Barcode Sticker & Label Printer */}
              <div className="bg-white border-4 border-black p-6 shadow-[6px_6px_0px_#000] flex flex-col justify-between relative hover:-translate-y-1 transition-all">
                <div className="absolute top-4 right-4 px-3 py-1 bg-indigo-600 text-white font-black text-xs uppercase tracking-wider border-2 border-black shadow-[2px_2px_0px_#000]">
                  LABEL MAKER
                </div>

                <div>
                  <div className="h-44 w-full bg-slate-50 border-2 border-black mb-4 flex items-center justify-center p-4 relative overflow-hidden">
                    <div className="flex flex-col items-center">
                      <div className="w-28 h-24 bg-indigo-950 border-3 border-black rounded-md p-2 flex flex-col justify-between shadow-md">
                        <div className="w-full h-4 bg-white border border-black flex items-center justify-center">
                          <span className="text-[8px] font-mono font-black text-black">||||| 50x30mm |||||</span>
                        </div>
                        <div className="flex justify-between items-center px-1">
                          <span className="w-2 h-2 rounded-full bg-amber-400" />
                          <span className="text-[9px] font-mono text-white font-bold">STICKER ROLL</span>
                        </div>
                      </div>
                      <span className="text-[10px] font-mono font-black text-slate-600 mt-2">[DIRECT THERMAL]</span>
                    </div>
                  </div>

                  <h3 className="font-display font-black text-lg uppercase text-black mb-1">
                    Thermal Barcode Label Printer
                  </h3>
                  <p className="text-xs font-bold text-slate-600 uppercase mb-4">
                    High resolution barcode label printer for clothing tags, retail stickers, and shelf pricing.
                  </p>

                  <div className="flex items-baseline gap-2 mb-4 pb-3 border-b-2 border-black">
                    <span className="font-display font-black text-2xl text-black">
                      ৳ 6,900
                    </span>
                    <span className="text-xs font-bold text-slate-400 line-through">
                      ৳ 8,500
                    </span>
                  </div>

                  <ul className="text-xs font-bold text-slate-700 space-y-1.5 mb-6 uppercase">
                    <li className="flex items-center gap-1.5">
                      <Check className="w-3.5 h-3.5 text-emerald-600 stroke-[3]" /> Compatible with 50x30mm & 40x25mm rolls
                    </li>
                    <li className="flex items-center gap-1.5">
                      <Check className="w-3.5 h-3.5 text-emerald-600 stroke-[3]" /> High density 203 DPI print head
                    </li>
                    <li className="flex items-center gap-1.5">
                      <Check className="w-3.5 h-3.5 text-emerald-600 stroke-[3]" /> 1-Year service warranty
                    </li>
                  </ul>
                </div>

                <a
                  href="https://wa.me/8801315861003?text=Hello%20Shomporko%20CRM,%20I%20want%20to%20order%20the%20Barcode%20Label%20Printer."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3 bg-white hover:bg-slate-100 text-black font-display font-black text-xs uppercase tracking-wider border-2 border-black shadow-[3px_3px_0px_#000] text-center transition-all flex items-center justify-center gap-2"
                >
                  <Phone className="w-3.5 h-3.5" /> CALL US: 01315861003
                </a>
              </div>

              {/* 5. Electric Cash Drawer */}
              <div className="bg-white border-4 border-black p-6 shadow-[6px_6px_0px_#000] flex flex-col justify-between relative hover:-translate-y-1 transition-all">
                <div className="absolute top-4 right-4 px-3 py-1 bg-emerald-500 text-white font-black text-xs uppercase tracking-wider border-2 border-black shadow-[2px_2px_0px_#000]">
                  HEAVY DUTY
                </div>

                <div>
                  <div className="h-44 w-full bg-slate-50 border-2 border-black mb-4 flex items-center justify-center p-4 relative overflow-hidden">
                    <div className="flex flex-col items-center">
                      <div className="w-36 h-20 bg-slate-800 border-3 border-black rounded-sm p-1.5 flex flex-col justify-between shadow-md">
                        <div className="grid grid-cols-4 gap-1 h-8 bg-slate-900 border border-black p-1">
                          <div className="bg-slate-700 h-full rounded-[1px]" />
                          <div className="bg-slate-700 h-full rounded-[1px]" />
                          <div className="bg-slate-700 h-full rounded-[1px]" />
                          <div className="bg-slate-700 h-full rounded-[1px]" />
                        </div>
                        <div className="flex justify-between items-center px-1">
                          <span className="w-2 h-2 rounded-full bg-emerald-400" />
                          <span className="text-[9px] font-mono text-white font-bold">5 BILLS / 8 COINS</span>
                        </div>
                      </div>
                      <span className="text-[10px] font-mono font-black text-slate-600 mt-2">[RJ11 KICKOUT]</span>
                    </div>
                  </div>

                  <h3 className="font-display font-black text-lg uppercase text-black mb-1">
                    Electronic Metal Cash Drawer
                  </h3>
                  <p className="text-xs font-bold text-slate-600 uppercase mb-4">
                    Heavy-duty cold rolled steel construction with key lock & automatic receipt printer trigger.
                  </p>

                  <div className="flex items-baseline gap-2 mb-4 pb-3 border-b-2 border-black">
                    <span className="font-display font-black text-2xl text-black">
                      ৳ 3,800
                    </span>
                    <span className="text-xs font-bold text-slate-400 line-through">
                      ৳ 4,500
                    </span>
                  </div>

                  <ul className="text-xs font-bold text-slate-700 space-y-1.5 mb-6 uppercase">
                    <li className="flex items-center gap-1.5">
                      <Check className="w-3.5 h-3.5 text-emerald-600 stroke-[3]" /> Connects to POS printer via RJ11
                    </li>
                    <li className="flex items-center gap-1.5">
                      <Check className="w-3.5 h-3.5 text-emerald-600 stroke-[3]" /> 3-Position secure lock (Lock/Manual/Auto)
                    </li>
                    <li className="flex items-center gap-1.5">
                      <Check className="w-3.5 h-3.5 text-emerald-600 stroke-[3]" /> 1-Year replacement warranty
                    </li>
                  </ul>
                </div>

                <a
                  href="https://wa.me/8801315861003?text=Hello%20Shomporko%20CRM,%20I%20want%20to%20order%20the%20Electric%20Metal%20Cash%20Drawer."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3 bg-white hover:bg-slate-100 text-black font-display font-black text-xs uppercase tracking-wider border-2 border-black shadow-[3px_3px_0px_#000] text-center transition-all flex items-center justify-center gap-2"
                >
                  <Phone className="w-3.5 h-3.5" /> CALL US: 01315861003
                </a>
              </div>

              {/* 6. Complete Retail Counter Hardware Combo Package */}
              <div className="bg-[#FFFDF0] border-4 border-black p-6 shadow-[8px_8px_0px_#000] flex flex-col justify-between relative hover:-translate-y-1 transition-all border-amber-500">
                <div className="absolute top-4 right-4 px-3 py-1 bg-amber-400 text-black font-black text-xs uppercase tracking-wider border-2 border-black shadow-[2px_2px_0px_#000]">
                  SAVE ৳3,000
                </div>

                <div>
                  <div className="h-44 w-full bg-amber-100 border-2 border-black mb-4 flex items-center justify-center p-4 relative overflow-hidden">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-20 bg-slate-900 border-2 border-black rounded-md flex flex-col justify-between p-1">
                        <div className="w-full h-2 bg-red-500" />
                        <span className="text-[7px] text-white font-mono">SCANNER</span>
                      </div>
                      <span className="font-black text-lg">+</span>
                      <div className="w-16 h-16 bg-slate-900 border-2 border-black rounded-md flex flex-col justify-between p-1">
                        <div className="w-full h-2 bg-white" />
                        <span className="text-[7px] text-white font-mono">PRINTER</span>
                      </div>
                      <span className="font-black text-lg">+</span>
                      <div className="w-16 h-12 bg-slate-800 border-2 border-black rounded-sm flex items-center justify-center">
                        <span className="text-[7px] text-white font-mono">DRAWER</span>
                      </div>
                    </div>
                  </div>

                  <h3 className="font-display font-black text-lg uppercase text-black mb-1">
                    Complete Retail Counter Bundle
                  </h3>
                  <p className="text-xs font-bold text-slate-600 uppercase mb-4">
                    Scanner (Wired/Wireless) + 80mm Thermal Printer + Cash Drawer + 10 Paper Rolls.
                  </p>

                  <div className="flex items-baseline gap-2 mb-4 pb-3 border-b-2 border-black">
                    <span className="font-display font-black text-3xl text-indigo-700">
                      ৳ 10,500
                    </span>
                    <span className="text-xs font-bold text-slate-400 line-through">
                      ৳ 13,800
                    </span>
                  </div>

                  <ul className="text-xs font-bold text-slate-700 space-y-1.5 mb-6 uppercase">
                    <li className="flex items-center gap-1.5">
                      <Check className="w-3.5 h-3.5 text-emerald-600 stroke-[3]" /> Complete hardware suite for 1 Counter
                    </li>
                    <li className="flex items-center gap-1.5">
                      <Check className="w-3.5 h-3.5 text-emerald-600 stroke-[3]" /> Free doorstep delivery & driver setup
                    </li>
                    <li className="flex items-center gap-1.5">
                      <Check className="w-3.5 h-3.5 text-emerald-600 stroke-[3]" /> 1-Year comprehensive warranty
                    </li>
                  </ul>
                </div>

                <a
                  href="https://wa.me/8801315861003?text=Hello%20Shomporko%20CRM,%20I%20want%20to%20order%20the%20Complete%20Retail%20Counter%20Bundle%20(৳10,500)."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-display font-black text-xs uppercase tracking-wider border-2 border-black shadow-[3px_3px_0px_#000] text-center transition-all flex items-center justify-center gap-2"
                >
                  <MessageCircle className="w-4 h-4 text-emerald-300" /> ORDER BUNDLE COMBO
                </a>
              </div>

            </div>
          </div>
          <div className="bg-white border-4 border-black shadow-[10px_10px_0px_#000] p-6 sm:p-10 mb-20 overflow-hidden">
            <div className="border-b-4 border-black pb-4 mb-6">
              <span className="px-3 py-1 bg-amber-300 border-2 border-black text-[11px] font-black uppercase tracking-wider shadow-[2px_2px_0px_#000] inline-block mb-2">
                DETAILED COMPARISON MATRIX
              </span>
              <h2 className="font-display font-black text-2xl sm:text-3xl uppercase tracking-tight text-black">
                Compare Features By Plan
              </h2>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-left">
                <thead>
                  <tr className="border-b-3 border-black bg-slate-100">
                    <th className="p-4 font-display font-black text-xs uppercase tracking-wider text-black">Features & Capabilities</th>
                    <th className="p-4 font-display font-black text-xs uppercase tracking-wider text-black text-center">Starter</th>
                    <th className="p-4 font-display font-black text-xs uppercase tracking-wider text-indigo-700 text-center">Business Pro</th>
                    <th className="p-4 font-display font-black text-xs uppercase tracking-wider text-black text-center">Enterprise</th>
                  </tr>
                </thead>
                <tbody className="divide-y-2 divide-black/10 text-xs font-bold uppercase tracking-wider">
                  {comparisonFeatures.map((row, idx) => (
                    <tr key={idx} className="hover:bg-amber-50/50 transition-colors">
                      <td className="p-4 text-black font-black">{row.feature}</td>
                      <td className="p-4 text-center">
                        {typeof row.starter === 'boolean' ? (
                          row.starter ? (
                            <Check className="w-5 h-5 text-emerald-600 stroke-[3] mx-auto" />
                          ) : (
                            <X className="w-4 h-4 text-slate-300 stroke-[2] mx-auto" />
                          )
                        ) : (
                          <span className="text-[11px] text-slate-700">{row.starter}</span>
                        )}
                      </td>
                      <td className="p-4 text-center bg-indigo-50/30">
                        {typeof row.pro === 'boolean' ? (
                          row.pro ? (
                            <Check className="w-5 h-5 text-indigo-600 stroke-[3] mx-auto" />
                          ) : (
                            <X className="w-4 h-4 text-slate-300 stroke-[2] mx-auto" />
                          )
                        ) : (
                          <span className="text-[11px] text-indigo-900 font-black">{row.pro}</span>
                        )}
                      </td>
                      <td className="p-4 text-center">
                        {typeof row.enterprise === 'boolean' ? (
                          row.enterprise ? (
                            <Check className="w-5 h-5 text-emerald-600 stroke-[3] mx-auto" />
                          ) : (
                            <X className="w-4 h-4 text-slate-300 stroke-[2] mx-auto" />
                          )
                        ) : (
                          <span className="text-[11px] text-black font-black">{row.enterprise}</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Frequently Asked Questions */}
          <div className="mb-20">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <h2 className="font-display font-black text-3xl sm:text-4xl uppercase tracking-tight text-black mb-3">
                Frequently Asked Questions
              </h2>
              <div className="w-20 h-1.5 bg-black mx-auto mb-4" />
              <p className="text-xs font-bold text-slate-600 uppercase tracking-wider">
                Common questions business owners ask before starting
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
              {faqs.map((faq, idx) => (
                <div key={idx} className="bg-white border-3 border-black shadow-[6px_6px_0px_#000] p-6 hover:-translate-y-0.5 transition-transform">
                  <div className="flex items-start gap-3 mb-2">
                    <HelpCircle className="w-5 h-5 text-indigo-600 stroke-[2.5] shrink-0 mt-0.5" />
                    <h3 className="font-display font-black text-base uppercase text-black leading-snug">
                      {faq.q}
                    </h3>
                  </div>
                  <p className="text-xs font-semibold text-slate-700 leading-relaxed pl-8">
                    {faq.a}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom WhatsApp Help Banner */}
          <div className="bg-gradient-to-r from-slate-900 to-indigo-900 text-white border-4 border-black p-8 sm:p-12 shadow-[10px_10px_0px_#000] text-center">
            <h3 className="font-display font-black text-3xl sm:text-4xl uppercase mb-3 text-white">
              Need a Custom Setup or Multi-Store Consultation?
            </h3>
            <p className="text-indigo-100 text-base sm:text-lg mb-8 max-w-2xl mx-auto font-medium">
              Call our support helpline directly or chat on WhatsApp. We can prepare a customized quote tailored to your hardware and branch requirements.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <a
                href="https://wa.me/8801315861003?text=Hello%20Shomporko%20CRM,%20I%20would%20like%20a%20pricing%20consultation%20for%20my%20business."
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-8 py-4 bg-emerald-500 hover:bg-emerald-600 text-white font-display font-black text-base uppercase tracking-wider border-3 border-black shadow-[4px_4px_0px_#000] active:translate-x-1 active:translate-y-1 active:shadow-none transition-all"
              >
                <MessageCircle className="w-5 h-5 stroke-[2.5]" /> WHATSAPP HELPLINE: 01315861003
              </a>
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 px-8 py-4 bg-white text-black font-display font-black text-base uppercase tracking-wider border-3 border-black shadow-[4px_4px_0px_#000] hover:bg-slate-100 active:translate-x-1 active:translate-y-1 active:shadow-none transition-all"
              >
                REQUEST CUSTOM DEMO <ArrowRight className="w-5 h-5 stroke-[2.5]" />
              </Link>
            </div>
          </div>

        </div>
      </main>

      {/* Footer */}
      <footer className="bg-[#FAF8F0] text-black pt-16 pb-10 border-t-4 border-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
            <div className="font-display font-black text-xs uppercase tracking-wider text-black">
              © 2026 SHOMPORKO CRM. ALL RIGHTS RESERVED.
            </div>
            <div className="flex items-center gap-3">
              <span className="text-xs font-black uppercase text-slate-700">Helpline:</span>
              <a href="tel:01315861003" className="px-3 py-1 bg-white border-2 border-black font-black text-xs uppercase shadow-[2px_2px_0px_#000] hover:bg-amber-300 transition-colors">
                01315861003
              </a>
            </div>
            <div className="px-4 py-2 bg-indigo-600 text-white font-display font-black text-xs uppercase tracking-wider border-2 border-black shadow-[3px_3px_0px_#000]">
              BUILT FOR MODERN BUSINESSES
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
