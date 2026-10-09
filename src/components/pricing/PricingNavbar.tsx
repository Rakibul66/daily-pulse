import React from "react";
import Link from "next/link";
import Image from "next/image";

export const PricingNavbar: React.FC = () => {
  return (
    <header className="sticky top-0 z-50 bg-white border-b-4 border-black shadow-[0_4px_0px_#000]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <Link href="/" className="flex items-center gap-3 cursor-pointer">
            <Image src="/somporko.webp" alt="Shomporko CRM Logo" width={40} height={40} className="object-contain" />
            <span className="font-display font-black text-2xl tracking-tighter text-black">
              SHOMPORKO
            </span>
          </Link>
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
  );
};
