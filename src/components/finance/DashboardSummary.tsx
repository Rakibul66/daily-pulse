"use client";

import React from 'react';
import { Briefcase, TrendingUp, Users, ArrowUpRight, PieChart, ShieldCheck } from 'lucide-react';

interface Props {
  totalCapital: number;
  totalDividends: number;
  activePartnersCount: number;
}

export const DashboardSummary: React.FC<Props> = ({ totalCapital, totalDividends, activePartnersCount }) => {
  const total = totalCapital + totalDividends;
  const capitalPct = total > 0 ? (totalCapital / total) * 100 : 0;
  const dividendPct = total > 0 ? (totalDividends / total) * 100 : 0;

  return (
    <div className="space-y-6">
      {/* 3 High-Impact KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Total Capital Pool */}
        <div className="bg-white border-3 border-black p-6 shadow-[6px_6px_0px_#000] hover:-translate-y-1 transition-all flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-black text-black uppercase tracking-wider">
              TOTAL CAPITAL POOL
            </span>
            <div className="w-10 h-10 bg-emerald-200 border-2 border-black flex items-center justify-center text-black shadow-[2px_2px_0px_#000]">
              <Briefcase className="w-5 h-5 stroke-[2.5]" />
            </div>
          </div>
          <div>
            <p className="text-3xl font-black font-display text-emerald-800">
              ৳ {totalCapital.toLocaleString()}
            </p>
            <p className="text-[11px] font-bold text-slate-600 uppercase mt-1 flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> Active Stakeholder Fund
            </p>
          </div>
        </div>

        {/* Total Dividends Paid */}
        <div className="bg-white border-3 border-black p-6 shadow-[6px_6px_0px_#000] hover:-translate-y-1 transition-all flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-black text-black uppercase tracking-wider">
              DIVIDENDS DISTRIBUTED
            </span>
            <div className="w-10 h-10 bg-indigo-200 border-2 border-black flex items-center justify-center text-black shadow-[2px_2px_0px_#000]">
              <TrendingUp className="w-5 h-5 stroke-[2.5]" />
            </div>
          </div>
          <div>
            <p className="text-3xl font-black font-display text-indigo-700">
              ৳ {totalDividends.toLocaleString()}
            </p>
            <p className="text-[11px] font-bold text-slate-600 uppercase mt-1 flex items-center gap-1">
              <ArrowUpRight className="w-3.5 h-3.5 text-indigo-600" /> Disbursed to Partners
            </p>
          </div>
        </div>

        {/* Active Partners */}
        <div className="bg-white border-3 border-black p-6 shadow-[6px_6px_0px_#000] hover:-translate-y-1 transition-all flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-black text-black uppercase tracking-wider">
              ACTIVE SHAREHOLDERS
            </span>
            <div className="w-10 h-10 bg-amber-300 border-2 border-black flex items-center justify-center text-black shadow-[2px_2px_0px_#000]">
              <Users className="w-5 h-5 stroke-[2.5]" />
            </div>
          </div>
          <div>
            <p className="text-3xl font-black font-display text-black">
              {activePartnersCount} <span className="text-base font-bold text-slate-500">PARTNERS</span>
            </p>
            <p className="text-[11px] font-bold text-slate-600 uppercase mt-1">
              Verified Equity Holders
            </p>
          </div>
        </div>

      </div>

      {/* Visual Cash Flow Distribution Breakdown */}
      <div className="bg-white border-4 border-black p-6 sm:p-8 shadow-[8px_8px_0px_#000]">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-6 pb-4 border-b-2 border-black">
          <div>
            <h3 className="font-display font-black text-xl uppercase tracking-tight text-black flex items-center gap-2">
              <PieChart className="w-5 h-5 text-indigo-600" />
              CAPITAL & DIVIDEND RATIO BREAKDOWN
            </h3>
            <p className="text-xs font-bold text-slate-600 uppercase tracking-wider mt-0.5">
              Lifetime fund allocation: Retained business capital vs. distributed dividends
            </p>
          </div>
          <span className="px-3 py-1 bg-amber-300 border-2 border-black shadow-[2px_2px_0px_#000] text-xs font-black uppercase text-black">
            LIFETIME TOTAL: ৳ {total.toLocaleString()}
          </span>
        </div>
        
        {/* 1. Single Segmented 100% Allocation Bar (Immediate Visual Understanding) */}
        <div className="mb-6">
          <div className="flex flex-wrap justify-between items-center text-xs font-black uppercase gap-2 mb-2">
            <span className="flex items-center gap-1.5 text-emerald-800">
              <span className="w-3.5 h-3.5 bg-emerald-500 border border-black inline-block shadow-[1px_1px_0px_#000]" />
              RETAINED CAPITAL: ৳ {totalCapital.toLocaleString()} ({capitalPct.toFixed(1)}%)
            </span>
            <span className="flex items-center gap-1.5 text-indigo-800">
              DIVIDENDS PAID: ৳ {totalDividends.toLocaleString()} ({dividendPct.toFixed(1)}%)
              <span className="w-3.5 h-3.5 bg-indigo-600 border border-black inline-block shadow-[1px_1px_0px_#000]" />
            </span>
          </div>

          {/* Unified 100% Ratio Bar */}
          <div className="w-full h-8 bg-slate-100 border-3 border-black overflow-hidden shadow-[3px_3px_0px_#000] flex">
            {total > 0 ? (
              <>
                <div 
                  className="h-full bg-emerald-500 flex items-center justify-center text-[11px] font-black text-black border-r-2 border-black transition-all duration-700" 
                  style={{ width: `${Math.max(capitalPct, 5)}%` }}
                  title={`Retained Capital: ৳${totalCapital.toLocaleString()} (${capitalPct.toFixed(1)}%)`}
                >
                  {capitalPct >= 18 && `৳ ${totalCapital.toLocaleString()} (${capitalPct.toFixed(0)}%)`}
                </div>
                <div 
                  className="h-full bg-indigo-600 flex items-center justify-center text-[11px] font-black text-white transition-all duration-700" 
                  style={{ width: `${Math.max(dividendPct, 5)}%` }}
                  title={`Dividends: ৳${totalDividends.toLocaleString()} (${dividendPct.toFixed(1)}%)`}
                >
                  {dividendPct >= 18 && `৳ ${totalDividends.toLocaleString()} (${dividendPct.toFixed(0)}%)`}
                </div>
              </>
            ) : (
              <div className="w-full h-full flex items-center justify-center text-xs font-bold text-slate-500 uppercase tracking-wider bg-slate-100">
                No capital or dividends recorded yet (৳ 0)
              </div>
            )}
          </div>
        </div>

        {/* 2. Clear Side-by-Side Breakdown Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          {/* Capital Card */}
          <div className="bg-emerald-50/70 border-2 border-black p-4 shadow-[2px_2px_0px_#000] flex flex-col justify-between">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-black uppercase text-black flex items-center gap-1.5">
                <span className="w-3 h-3 bg-emerald-500 border border-black inline-block" />
                Retained In Operations
              </span>
              <span className="px-2 py-0.5 bg-emerald-200 border border-black text-[10px] font-black uppercase text-emerald-900">
                {capitalPct.toFixed(1)}% of total funds
              </span>
            </div>
            <div>
              <p className="text-2xl font-black font-display text-emerald-950">
                ৳ {totalCapital.toLocaleString()}
              </p>
              <p className="text-[11px] font-bold text-slate-600 mt-1">
                Active capital pool deployed in inventory, operational reserves, and assets.
              </p>
            </div>
          </div>

          {/* Dividends Card */}
          <div className="bg-indigo-50/70 border-2 border-black p-4 shadow-[2px_2px_0px_#000] flex flex-col justify-between">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-black uppercase text-black flex items-center gap-1.5">
                <span className="w-3 h-3 bg-indigo-600 border border-black inline-block" />
                Disbursed to Shareholders
              </span>
              <span className="px-2 py-0.5 bg-indigo-200 border border-black text-[10px] font-black uppercase text-indigo-900">
                {dividendPct.toFixed(1)}% of total funds
              </span>
            </div>
            <div>
              <p className="text-2xl font-black font-display text-indigo-950">
                ৳ {totalDividends.toLocaleString()}
              </p>
              <p className="text-[11px] font-bold text-slate-600 mt-1">
                Profits distributed to verified investors over the lifetime of the partnership.
              </p>
            </div>
          </div>
        </div>
        
        {/* 3. Mathematical Formula strip */}
        <div className="mt-4 pt-4 border-t-2 border-black/20 flex flex-wrap items-center justify-between text-xs font-bold text-slate-700 gap-2">
          <div className="flex items-center gap-2">
            <span className="font-mono bg-slate-100 px-2 py-1 border border-black text-black text-[11px]">
              Formula: Retained Capital ({capitalPct.toFixed(0)}%) + Dividends ({dividendPct.toFixed(0)}%) = Total Partnership Pool (100%)
            </span>
          </div>
          <span className="text-[10px] font-mono font-black text-black uppercase bg-emerald-100 px-2 py-1 border border-black">
            STATUS: {totalCapital >= totalDividends ? 'CAPITAL-PRESERVED' : 'HIGH DISTRIBUTION'}
          </span>
        </div>
      </div>
    </div>
  );
};
