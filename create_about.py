import os

os.makedirs('src/app/about', exist_ok=True)

about_content = """import React from 'react';
import Link from 'next/link';
import { ArrowRight, Check } from 'lucide-react';

const LWHHLogo = () => (
  <Link href="/" className="flex items-center gap-3 cursor-pointer">
    <div className="w-10 h-10 border-2 border-black grid grid-cols-2 grid-rows-2 font-black text-xs text-white shadow-[2px_2px_0px_#000]">
      <div className="bg-black flex items-center justify-center border-r border-b border-white/20">L</div>
      <div className="bg-black flex items-center justify-center border-b border-white/20">W</div>
      <div className="bg-indigo-600 flex items-center justify-center border-r border-white/20">H</div>
      <div className="bg-indigo-600 flex items-center justify-center">H</div>
    </div>
    <span className="font-display font-black text-2xl tracking-tighter text-black">
      BOLTSOFT
    </span>
  </Link>
);

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white font-sans text-black selection:bg-indigo-600 selection:text-white">
      {/* 1. Header Navbar */}
      <header className="sticky top-0 z-50 bg-white border-b-4 border-black shadow-[0_4px_0px_#000]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <LWHHLogo />
            <nav className="hidden md:flex items-center gap-8 font-display font-black text-xs tracking-wider uppercase">
              <Link href="/about" className="hover:text-indigo-600 hover:underline decoration-4 underline-offset-4 transition-all">ABOUT</Link>
              <Link href="/#shorts" className="px-3 py-1 bg-black text-white border-2 border-black shadow-[2px_2px_0px_#4F46E5] flex items-center gap-1">
                SHORTS
              </Link>
              <Link href="/#blog" className="hover:text-indigo-600 hover:underline decoration-4 underline-offset-4 transition-all">BLOG</Link>
              <Link href="/#topics" className="hover:text-indigo-600 hover:underline decoration-4 underline-offset-4 transition-all">CATEGORIES</Link>
              <Link href="/#why-us" className="hover:text-indigo-600 hover:underline decoration-4 underline-offset-4 transition-all">CONTACT</Link>
              <Link href="/#why-us" className="hover:text-indigo-600 hover:underline decoration-4 underline-offset-4 transition-all">QUESTIONS</Link>
            </nav>
            <div className="flex items-center gap-3">
              <Link href="/login" className="hidden sm:block px-4 py-2 text-xs font-black uppercase tracking-wider bg-white hover:bg-slate-100 text-black border-2 border-black shadow-[2px_2px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all">
                LOG IN / SIGN UP
              </Link>
              <Link href="/get-started" className="px-5 py-2.5 text-xs font-black uppercase tracking-wider bg-indigo-600 hover:bg-indigo-700 text-white border-3 border-black shadow-[4px_4px_0px_#000] active:translate-x-1 active:translate-y-1 active:shadow-none transition-all flex items-center gap-1.5">
                GET STARTED
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* About Content */}
      <main className="py-20 lg:py-32 relative overflow-hidden">
        {/* Background Grid Pattern */}
        <div className="absolute inset-0 opacity-5 bg-[linear-gradient(to_right,#000_1px,transparent_1px),linear-gradient(to_bottom,#000_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />
        
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          
          <div className="mb-12">
            <h1 className="font-display font-black text-5xl sm:text-7xl uppercase tracking-tight text-black mb-6">
              About <span className="text-indigo-600">Shomporko CRM</span>
            </h1>
            <div className="w-24 h-2 bg-black mb-8" />
            <p className="text-xl sm:text-2xl font-bold text-slate-800 leading-relaxed">
              Your Ultimate POS & ERP Software Company.
            </p>
          </div>

          <div className="bg-[#FFFDF0] border-4 border-black shadow-[8px_8px_0px_#000] p-8 sm:p-12 mb-16">
            <p className="text-lg text-slate-800 leading-relaxed mb-6 font-medium">
              At <strong className="text-black font-black">Shomporko CRM</strong>, we are redefining the way businesses manage sales, inventory, and customer interactions with our cutting-edge POS and ERP software. Our mission is to provide fast, reliable, and user-friendly solutions that empower businesses to operate efficiently and maximize profits.
            </p>
            <p className="text-lg text-slate-800 leading-relaxed font-medium">
              With years of expertise in software development and business automation, we understand the challenges that retailers, restaurants, and service providers face. That's why we designed our POS system to be seamless, secure, and scalable, ensuring businesses of all sizes can benefit from real-time analytics, multi-platform support, and effortless transaction management.
            </p>
          </div>

          <h2 className="font-display font-black text-4xl uppercase tracking-tight text-black mb-8">
            Why Choose Us?
          </h2>

          <div className="grid sm:grid-cols-2 gap-6 mb-16">
            {[
              { title: 'Easy to Use', desc: 'Intuitive interface with a smooth user experience.' },
              { title: 'Secure & Reliable', desc: 'Advanced security features to protect your business data.' },
              { title: 'Cloud & Offline Support', desc: 'Work seamlessly online and offline without missing a beat.' },
              { title: 'Customizable Features', desc: 'Tailored to fit the unique needs of your specific business.' },
              { title: 'Advanced Admin Panel', desc: 'Powerful dashboard with comprehensive reporting and analytics.' },
              { title: '24/7 Support', desc: 'We are always here to help when you need us.' }
            ].map((feature, idx) => (
              <div key={idx} className="bg-white border-3 border-black p-6 shadow-[6px_6px_0px_#000] hover:-translate-y-1 transition-transform group">
                <div className="w-10 h-10 bg-indigo-100 border-2 border-black rounded-full flex items-center justify-center mb-4 group-hover:bg-indigo-600 group-hover:text-white transition-colors shadow-[2px_2px_0px_#000]">
                  <Check className="w-5 h-5 stroke-[3]" />
                </div>
                <h3 className="font-display font-black text-xl uppercase mb-2">{feature.title}</h3>
                <p className="text-slate-600 font-medium">{feature.desc}</p>
              </div>
            ))}
          </div>

          <div className="bg-indigo-600 text-white border-4 border-black p-8 sm:p-12 shadow-[8px_8px_0px_#000] text-center transform rotate-1">
            <h3 className="font-display font-black text-3xl sm:text-4xl uppercase mb-4">
              Ready to take your business to the next level?
            </h3>
            <p className="text-indigo-100 text-lg mb-8 max-w-2xl mx-auto font-medium">
              Join thousands of businesses that trust Shomporko CRM for their POS and business automation needs. Let's grow effortlessly, efficiently, and with complete confidence.
            </p>
            <Link href="/get-started" className="inline-flex items-center gap-2 px-8 py-4 bg-white text-black font-display font-black text-lg uppercase tracking-wider border-3 border-black shadow-[4px_4px_0px_#000] hover:bg-slate-100 active:translate-x-1 active:translate-y-1 active:shadow-none transition-all">
              GET STARTED TODAY <ArrowRight className="w-5 h-5" />
            </Link>
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
            <div className="px-4 py-2 bg-indigo-600 text-white font-display font-black text-xs uppercase tracking-wider border-2 border-black shadow-[3px_3px_0px_#000]">
              BUILT FOR MODERN BUSINESSES
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
"""

with open('src/app/about/page.tsx', 'w') as f:
    f.write(about_content)

print("Created about page.")
