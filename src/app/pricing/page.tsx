"use client";

import React, { useState } from 'react';
import { PRICING_PLANS, COMPARISON_FEATURES, PRICING_FAQS } from '@/components/pricing/types';
import { PricingNavbar } from '@/components/pricing/PricingNavbar';
import { PricingHero } from '@/components/pricing/PricingHero';
import { PricingTierCards } from '@/components/pricing/PricingTierCards';
import { PricingHardwareSection } from '@/components/pricing/PricingHardwareSection';
import { PricingComparisonTable } from '@/components/pricing/PricingComparisonTable';
import { PricingFaqSection } from '@/components/pricing/PricingFaqSection';
import { PricingFooterCta } from '@/components/pricing/PricingFooterCta';

export default function PricingPage() {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');

  return (
    <div className="min-h-screen bg-white font-sans text-black selection:bg-indigo-600 selection:text-white">
      {/* 1. Header Navbar */}
      <PricingNavbar />

      {/* Main Pricing Content */}
      <main className="py-16 sm:py-24 relative overflow-hidden">
        {/* Background Grid Pattern */}
        <div className="absolute inset-0 opacity-[0.035] bg-[linear-gradient(to_right,#000_1px,transparent_1px),linear-gradient(to_bottom,#000_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          {/* Header Title & Billing Cycle Switcher */}
          <PricingHero
            billingCycle={billingCycle}
            onBillingCycleChange={setBillingCycle}
          />

          {/* Pricing Cards Grid */}
          <PricingTierCards
            plans={PRICING_PLANS}
            billingCycle={billingCycle}
          />

          {/* POS Hardware & Machine Integration Showcase */}
          <PricingHardwareSection />

          {/* Feature Comparison Matrix */}
          <PricingComparisonTable
            comparisonFeatures={COMPARISON_FEATURES}
          />

          {/* Frequently Asked Questions */}
          <PricingFaqSection
            faqs={PRICING_FAQS}
          />

          {/* Bottom WhatsApp Helpline & Global Landing Footer */}
          <PricingFooterCta />
        </div>
      </main>
    </div>
  );
}
