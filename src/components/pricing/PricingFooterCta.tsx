import React from "react";
import Link from "next/link";
import { MessageCircle, ArrowRight } from "lucide-react";

export const PricingFooterCta: React.FC = () => {
  return (
    <>
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

      {/* Global Landing Footer */}
      <footer className="bg-[#FAF8F0] text-black pt-16 pb-10 border-t-4 border-black mt-20">
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
    </>
  );
};
