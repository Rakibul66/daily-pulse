"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import Image from "next/image";
import { 
  Phone, 
  MessageCircle, 
  Mail, 
  MapPin, 
  Clock, 
  ArrowRight, 
  CheckCircle2, 
  Sparkles, 
  Send, 
  User, 
  Store, 
  Briefcase, 
  FileText,
  Loader2,
  AlertCircle
} from 'lucide-react';
import { saveLeadRequest } from '@/lib/leadRequestsStorage';
import { checkRateLimit, RATE_LIMIT_PRESETS } from '@/lib/rateLimit';

const Logo = () => (
  <Link href="/" className="flex items-center gap-3 cursor-pointer">
    <Image src="/somporko.webp" alt="Shomporko CRM Logo" width={40} height={40} className="object-contain" />
    <span className="font-display font-black text-2xl tracking-tighter text-black">
      SHOMPORKO
    </span>
  </Link>
);

export default function ContactPage() {
  // Form State
  const [fullName, setFullName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [businessType, setBusinessType] = useState('Fashion');
  const [businessName, setBusinessName] = useState('');
  const [message, setMessage] = useState('');
  const [hpCompany, setHpCompany] = useState(''); // Honeypot anti-bot

  // Status State
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Bot detection via honeypot
    if (hpCompany) {
      setSubmitted(true);
      return;
    }

    // Rate limit check
    const rateCheck = checkRateLimit(
      'public_contact_form',
      RATE_LIMIT_PRESETS.CONTACT_FORM.max,
      RATE_LIMIT_PRESETS.CONTACT_FORM.windowMs,
      RATE_LIMIT_PRESETS.CONTACT_FORM.penaltyMs
    );
    if (!rateCheck.allowed) {
      setError(rateCheck.message || 'Too many submissions. Please wait a few minutes.');
      return;
    }

    const cleanPhone = phoneNumber.replace(/[^0-9+]/g, '');
    if (cleanPhone.length < 11) {
      setError('Please enter a valid 11-digit phone number (e.g. 01315861003).');
      return;
    }

    setLoading(true);
    try {
      await saveLeadRequest({
        fullName: fullName.trim(),
        phoneNumber: cleanPhone,
        businessType: businessType.trim(),
        businessName: businessName.trim(),
        message: message.trim(),
      });
      setSubmitted(true);
    } catch (err: unknown) {
      console.error(err);
      setError('Could not submit inquiry. Please try again or message us directly on WhatsApp.');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setFullName('');
    setPhoneNumber('');
    setBusinessType('Fashion');
    setBusinessName('');
    setMessage('');
    setSubmitted(false);
    setError(null);
  };

  const whatsappInquiryUrl = `https://wa.me/8801315861003?text=${encodeURIComponent(
    `Hello Shomporko CRM,\n\nName: ${fullName || 'Not specified'}\nPhone: ${phoneNumber || 'Not specified'}\nBusiness Type: ${businessType}\nBusiness Name: ${businessName || 'Not specified'}\nMessage: ${message || 'I am interested in starting with Shomporko POS & ERP.'}`
  )}`;

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
              <Link href="/pricing" className="hover:text-indigo-600 hover:underline decoration-4 underline-offset-4 transition-all">
                PRICING
              </Link>
              <Link href="/contact" className="hover:text-indigo-600 underline decoration-4 underline-offset-4 decoration-indigo-600 text-indigo-600 transition-all">
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

      {/* Main Content */}
      <main className="py-16 sm:py-24 relative overflow-hidden">
        {/* Background Grid Pattern */}
        <div className="absolute inset-0 opacity-[0.035] bg-[linear-gradient(to_right,#000_1px,transparent_1px),linear-gradient(to_bottom,#000_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none" />

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          
          {/* Header Title */}
          <div className="mb-14 text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-300 border-2 border-black shadow-[2px_2px_0px_#000] font-black text-xs uppercase tracking-wider mb-4">
              <Sparkles className="w-4 h-4 fill-black" /> WE ARE ALWAYS HERE TO HELP
            </div>
            <h1 className="font-display font-black text-4xl sm:text-6xl uppercase tracking-tight text-black mb-4">
              GET IN TOUCH WITH <br /><span className="text-indigo-600">SHOMPORKO CRM</span>
            </h1>
            <div className="w-24 h-2 bg-indigo-600 mx-auto mb-6" />
            <p className="text-base sm:text-lg font-bold text-slate-700 leading-relaxed">
              Fill out the inquiry form below to get started, or contact our team directly via WhatsApp or Phone call anytime.
            </p>
          </div>

          {/* Contact Layout: Form on Left + WhatsApp & Info on Right */}
          <div className="grid lg:grid-cols-12 gap-8 items-start mb-16">
            
            {/* Left Column: Interactive Contact & Registration Inquiry Form */}
            <div className="lg:col-span-7 bg-white border-4 border-black shadow-[10px_10px_0px_#000] p-6 sm:p-10 relative">
              <div className="border-b-4 border-black pb-5 mb-8">
                <span className="px-3 py-1 bg-indigo-600 text-white font-black text-[11px] uppercase tracking-wider border-2 border-black shadow-[2px_2px_0px_#000] inline-block mb-2">
                  START YOUR BUSINESS ONBOARDING
                </span>
                <h2 className="font-display font-black text-2xl sm:text-3xl uppercase tracking-tight text-black">
                  Request Information / Demo
                </h2>
                <p className="text-xs font-bold text-slate-600 uppercase tracking-wide mt-1">
                  Your request is saved directly to our Firestore database for instant review.
                </p>
              </div>

              {submitted ? (
                <div className="bg-[#FFFDF0] border-3 border-black shadow-[6px_6px_0px_#000] p-8 text-center animate-in fade-in zoom-in-95 duration-200">
                  <div className="w-16 h-16 bg-emerald-400 border-3 border-black shadow-[3px_3px_0px_#000] rounded-full flex items-center justify-center text-black mx-auto mb-4">
                    <CheckCircle2 className="w-9 h-9 stroke-[3]" />
                  </div>
                  <h3 className="font-display font-black text-2xl uppercase tracking-tight text-black mb-2">
                    Request Received Successfully!
                  </h3>
                  <p className="text-sm font-bold text-slate-700 leading-relaxed mb-6 max-w-md mx-auto">
                    Thank you <span className="text-black font-black underline">{fullName}</span>. Our representative will contact you at <span className="text-black font-black underline">{phoneNumber}</span> shortly with your demo and details.
                  </p>
                  
                  <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <a
                      href={whatsappInquiryUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-6 py-3.5 bg-emerald-500 hover:bg-emerald-600 text-white font-display font-black text-xs uppercase tracking-wider border-2 border-black shadow-[3px_3px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all flex items-center justify-center gap-2"
                    >
                      <MessageCircle className="w-4 h-4 stroke-[2.5]" /> SEND ALSO ON WHATSAPP
                    </a>
                    <button
                      type="button"
                      onClick={handleReset}
                      className="px-6 py-3.5 bg-white hover:bg-amber-200 text-black font-display font-black text-xs uppercase tracking-wider border-2 border-black shadow-[3px_3px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all cursor-pointer"
                    >
                      SUBMIT ANOTHER REQUEST
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  {/* Anti-bot Honeypot field (hidden from real users) */}
                  <input
                    type="text"
                    name="hp_company"
                    value={hpCompany}
                    onChange={(e) => setHpCompany(e.target.value)}
                    tabIndex={-1}
                    autoComplete="off"
                    className="hidden"
                    aria-hidden="true"
                  />

                  {error && (
                    <div className="p-3 bg-red-100 border-2 border-black shadow-[3px_3px_0px_#000] text-red-950 text-xs font-bold flex items-center gap-2.5">
                      <AlertCircle className="w-4 h-4 shrink-0 text-red-700 stroke-[2.5]" />
                      <span>{error}</span>
                    </div>
                  )}

                  {/* 1. Full Name */}
                  <div>
                    <label className="block text-xs font-black uppercase tracking-wider text-black mb-1.5 flex items-center gap-1.5">
                      <User className="w-3.5 h-3.5 text-indigo-600" /> Full Name <span className="text-red-600">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="ex. mehedi hasan shakil"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full px-4 py-3 text-xs font-bold text-black bg-white border-2 border-black shadow-[2px_2px_0px_#000] focus:bg-amber-50/50 focus:outline-none focus:border-indigo-600 transition-colors"
                    />
                  </div>

                  {/* 2. Phone Number */}
                  <div>
                    <label className="block text-xs font-black uppercase tracking-wider text-black mb-1.5 flex items-center gap-1.5">
                      <Phone className="w-3.5 h-3.5 text-indigo-600" /> Phone Number <span className="text-red-600">*</span>
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="ex. enter your 11 digit phone number"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      className="w-full px-4 py-3 text-xs font-bold text-black bg-white border-2 border-black shadow-[2px_2px_0px_#000] focus:bg-amber-50/50 focus:outline-none focus:border-indigo-600 transition-colors"
                    />
                  </div>

                  {/* 3. Business Type & 4. Business Name Grid */}
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-black uppercase tracking-wider text-black mb-1.5 flex items-center gap-1.5">
                        <Briefcase className="w-3.5 h-3.5 text-indigo-600" /> Business Type <span className="text-red-600">*</span>
                      </label>
                      <select
                        value={businessType}
                        onChange={(e) => setBusinessType(e.target.value)}
                        className="w-full px-4 py-3 text-xs font-bold text-black bg-white border-2 border-black shadow-[2px_2px_0px_#000] focus:bg-amber-50/50 focus:outline-none focus:border-indigo-600 transition-colors cursor-pointer"
                      >
                        <option value="Fashion">Fashion & Apparel</option>
                        <option value="Retail & Supermarket">Retail & Supermarket</option>
                        <option value="Electronics & Mobile">Electronics & Mobile</option>
                        <option value="Pharmacy & Healthcare">Pharmacy & Healthcare</option>
                        <option value="Restaurants & Cafes">Restaurants & Cafes</option>
                        <option value="Fast Food & Takeaways">Fast Food & Takeaways</option>
                        <option value="SME & F-Commerce">SME & F-Commerce</option>
                        <option value="Auto Mobiles & Parts">Auto Mobiles & Parts</option>
                        <option value="Other Business">Other Business</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-black uppercase tracking-wider text-black mb-1.5 flex items-center gap-1.5">
                        <Store className="w-3.5 h-3.5 text-indigo-600" /> Business Name <span className="text-red-600">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="Enter your business name"
                        value={businessName}
                        onChange={(e) => setBusinessName(e.target.value)}
                        className="w-full px-4 py-3 text-xs font-bold text-black bg-white border-2 border-black shadow-[2px_2px_0px_#000] focus:bg-amber-50/50 focus:outline-none focus:border-indigo-600 transition-colors"
                      />
                    </div>
                  </div>

                  {/* 5. Message */}
                  <div>
                    <label className="block text-xs font-black uppercase tracking-wider text-black mb-1.5 flex items-center gap-1.5">
                      <FileText className="w-3.5 h-3.5 text-indigo-600" /> Message
                    </label>
                    <textarea
                      rows={4}
                      placeholder="Tell us about your requirements, shop count, or any specific features you need..."
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      className="w-full px-4 py-3 text-xs font-bold text-black bg-white border-2 border-black shadow-[2px_2px_0px_#000] focus:bg-amber-50/50 focus:outline-none focus:border-indigo-600 transition-colors"
                    />
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-4 px-6 bg-indigo-600 hover:bg-indigo-700 text-white font-display font-black text-sm uppercase tracking-wider border-3 border-black shadow-[5px_5px_0px_#000] active:translate-x-1 active:translate-y-1 active:shadow-[1px_1px_0px_#000] flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50"
                  >
                    {loading ? (
                      <Loader2 className="w-5 h-5 animate-spin stroke-[3]" />
                    ) : (
                      <>
                        <Send className="w-4 h-4 stroke-[2.5]" /> SUBMIT INQUIRY TO FIRESTORE
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>

            {/* Right Column: Direct WhatsApp Callout & Support Info */}
            <div className="lg:col-span-5 space-y-6">
              
              {/* WhatsApp Card */}
              <div className="bg-[#FFFDF0] border-4 border-black shadow-[8px_8px_0px_#000] p-6 sm:p-8 relative overflow-hidden">
                <div className="absolute top-0 right-0 bg-emerald-500 text-white font-black text-[9px] uppercase tracking-widest px-3 py-1 border-b-2 border-l-2 border-black">
                  INSTANT CHAT
                </div>

                <div className="flex items-center gap-3.5 mb-5">
                  <div className="w-14 h-14 bg-emerald-400 border-3 border-black shadow-[3px_3px_0px_#000] flex items-center justify-center text-black">
                    <MessageCircle className="w-8 h-8 stroke-[2.5]" />
                  </div>
                  <div>
                    <span className="text-[11px] font-black uppercase tracking-wider text-slate-600">WhatsApp & Helpline</span>
                    <h3 className="font-display font-black text-2xl sm:text-3xl text-black tracking-tight">
                      01315861003
                    </h3>
                  </div>
                </div>

                <p className="text-slate-700 text-xs sm:text-sm font-semibold leading-relaxed mb-6">
                  Prefer a direct conversation? You can chat with our team on WhatsApp immediately or call us for pricing and setup.
                </p>

                <div className="flex flex-col gap-3">
                  <a
                    href="https://wa.me/8801315861003?text=Hello%20Shomporko%20CRM,%20I%20would%20like%20to%20learn%20more%20about%20your%20POS%20&%20ERP%20software."
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-3 px-4 bg-emerald-500 hover:bg-emerald-600 text-white font-display font-black text-xs uppercase tracking-wider border-2 border-black shadow-[3px_3px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all flex items-center justify-center gap-2 text-center"
                  >
                    <MessageCircle className="w-4 h-4 stroke-[2.5]" /> CHAT ON WHATSAPP
                  </a>

                  <a
                    href="tel:01315861003"
                    className="w-full py-3 px-4 bg-white hover:bg-amber-200 text-black font-display font-black text-xs uppercase tracking-wider border-2 border-black shadow-[3px_3px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all flex items-center justify-center gap-2 text-center"
                  >
                    <Phone className="w-4 h-4 stroke-[2.5]" /> CALL DIRECTLY: 01315861003
                  </a>
                </div>
              </div>

              {/* Operating Hours */}
              <div className="bg-white border-3 border-black shadow-[6px_6px_0px_#000] p-6">
                <div className="w-10 h-10 bg-amber-300 border-2 border-black shadow-[2px_2px_0px_#000] flex items-center justify-center mb-3">
                  <Clock className="w-5 h-5 text-black stroke-[2.5]" />
                </div>
                <h3 className="font-display font-black text-base uppercase tracking-tight text-black mb-1">
                  Operating Hours
                </h3>
                <p className="text-xs font-bold text-slate-700 uppercase tracking-wide mb-1.5">
                  Saturday - Friday: 24/7 Online Support
                </p>
                <p className="text-xs font-medium text-slate-600 leading-relaxed">
                  Our emergency technical assistance and WhatsApp support channels are active around the clock for all registered businesses.
                </p>
              </div>

              {/* Location & Coverage */}
              <div className="bg-white border-3 border-black shadow-[6px_6px_0px_#000] p-6">
                <div className="w-10 h-10 bg-indigo-200 border-2 border-black shadow-[2px_2px_0px_#000] flex items-center justify-center mb-3">
                  <MapPin className="w-5 h-5 text-black stroke-[2.5]" />
                </div>
                <h3 className="font-display font-black text-base uppercase tracking-tight text-black mb-1">
                  Countrywide Service
                </h3>
                <p className="text-xs font-bold text-slate-700 uppercase tracking-wide mb-1.5">
                  All 64 Districts in Bangladesh
                </p>
                <p className="text-xs font-medium text-slate-600 leading-relaxed">
                  Remote setup, live on-call training, and seamless cloud synchronization wherever your business operates.
                </p>
              </div>

            </div>

          </div>

          {/* Bottom Banner */}
          <div className="bg-gradient-to-r from-slate-900 to-indigo-900 text-white border-4 border-black p-8 sm:p-12 shadow-[10px_10px_0px_#000] text-center">
            <h3 className="font-display font-black text-3xl sm:text-4xl uppercase mb-3 text-white">
              Ready for a Tailored POS & ERP Solution?
            </h3>
            <p className="text-indigo-100 text-base sm:text-lg mb-8 max-w-2xl mx-auto font-medium">
              Start streamlining your inventory, sales billing, accounts, and employee payroll today. Message us on WhatsApp or get started online!
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <a
                href="https://wa.me/8801315861003"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-8 py-4 bg-emerald-500 hover:bg-emerald-600 text-white font-display font-black text-base uppercase tracking-wider border-3 border-black shadow-[4px_4px_0px_#000] active:translate-x-1 active:translate-y-1 active:shadow-none transition-all"
              >
                <MessageCircle className="w-5 h-5 stroke-[2.5]" /> WHATSAPP US NOW
              </a>
              <Link
                href="/?auth=register"
                className="inline-flex items-center gap-2 px-8 py-4 bg-white text-black font-display font-black text-base uppercase tracking-wider border-3 border-black shadow-[4px_4px_0px_#000] hover:bg-slate-100 active:translate-x-1 active:translate-y-1 active:shadow-none transition-all"
              >
                CREATE ACCOUNT <ArrowRight className="w-5 h-5 stroke-[2.5]" />
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
