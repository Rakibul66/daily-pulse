import re

with open("src/components/landing/LandingPage.tsx", "r") as f:
    content = f.read()

# 1. Update Navigation Links in Header
old_nav = """            {/* Navigation Links */}
            <nav className="hidden md:flex items-center gap-8 font-display font-black text-sm tracking-wider uppercase">
              <a href="/about" className="hover:text-indigo-600 hover:underline decoration-4 underline-offset-4 transition-all">ABOUT</a>
              <a href="/contact" className="hover:text-indigo-600 hover:underline decoration-4 underline-offset-4 transition-all">CONTACT</a>
              <a href="/#industries" className="hover:text-indigo-600 hover:underline decoration-4 underline-offset-4 transition-all">INDUSTRIES</a>
              <a href="#shorts" className="px-3 py-1 bg-black text-white border-2 border-black shadow-[2px_2px_0px_#4F46E5] flex items-center gap-1">
                SHORTS
              </a>
              <a href="#blog" className="hover:text-indigo-600 hover:underline decoration-4 underline-offset-4 transition-all">BLOG</a>
              <a href="#why-us" className="hover:text-indigo-600 hover:underline decoration-4 underline-offset-4 transition-all">QUESTIONS</a>
            </nav>"""

new_nav = """            {/* Navigation Links */}
            <nav className="hidden md:flex items-center gap-8 font-display font-black text-sm tracking-wider uppercase">
              <a href="/about" className="hover:text-indigo-600 hover:underline decoration-4 underline-offset-4 transition-all">ABOUT</a>
              <a href="/pricing" className="hover:text-indigo-600 hover:underline decoration-4 underline-offset-4 transition-all">PRICING</a>
              <a href="/contact" className="hover:text-indigo-600 hover:underline decoration-4 underline-offset-4 transition-all">CONTACT</a>
            </nav>"""

content = content.replace(old_nav, new_nav)

# 2. Update Section 3: "Built for Modern Businesses"
old_section3 = """      {/* 3. Built for Modern Learners (Image 1 of Latest Batch) */}
      <section className="py-20 sm:py-28 bg-red-600 border-b-4 border-black text-white relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Main Section Title */}
          <div className="text-center max-w-4xl mx-auto mb-6">
            <h2 className="font-display font-black text-4xl sm:text-6xl lg:text-7xl uppercase tracking-tight text-white drop-shadow-[5px_5px_0px_#000]">
              BUILT FOR MODERN LEARNERS
            </h2>
          </div>

          {/* Subtitle Banner Box */}
          <div className="max-w-2xl mx-auto mb-16">
            <div className="bg-white text-black font-display font-extrabold text-base sm:text-lg border-4 border-black shadow-[6px_6px_0px_#000] px-6 sm:px-8 py-4 text-center transform -rotate-1">
              Everything you need to advance your career. No friction, pure skills.
            </div>
          </div>

          {/* 3 Column Feature Cards */}
          <div className="grid md:grid-cols-3 gap-8 sm:gap-10">
            
            {/* Feature 1: EXPERT INSTRUCTORS */}
            <div className="bg-[#FFFBEB] text-black border-4 border-black shadow-[8px_8px_0px_#000] p-8 relative flex flex-col justify-between">
              <div className="absolute -top-4 -right-4 w-10 h-10 bg-black text-white font-display font-black text-lg border-2 border-white flex items-center justify-center shadow-[3px_3px_0px_#000]">
                1
              </div>
              <div>
                <div className="w-14 h-14 bg-white border-3 border-black shadow-[3px_3px_0px_#000] flex items-center justify-center mb-6">
                  <span className="text-2xl font-black">👨‍🏫</span>
                </div>
                <h3 className="font-display font-black text-2xl text-black uppercase tracking-tight mb-3">
                  EXPERT INSTRUCTORS
                </h3>
                <div className="w-full h-1 bg-black mb-4" />
                <p className="text-slate-800 font-medium text-base leading-relaxed">
                  Learn from industry professionals with real-world experience. Get insights you won't find in textbooks.
                </p>
              </div>
            </div>

            {/* Feature 2: SELF-PACED */}
            <div className="bg-[#E0F2FE] text-black border-4 border-black shadow-[8px_8px_0px_#000] p-8 relative flex flex-col justify-between">
              <div className="absolute -top-4 -right-4 w-10 h-10 bg-black text-white font-display font-black text-lg border-2 border-white flex items-center justify-center shadow-[3px_3px_0px_#000]">
                2
              </div>
              <div>
                <div className="w-14 h-14 bg-white border-3 border-black shadow-[3px_3px_0px_#000] flex items-center justify-center mb-6">
                  <Clock className="w-7 h-7 text-black stroke-[2.5]" />
                </div>
                <h3 className="font-display font-black text-2xl text-black uppercase tracking-tight mb-3">
                  SELF-PACED
                </h3>
                <div className="w-full h-1 bg-black mb-4" />
                <p className="text-slate-800 font-medium text-base leading-relaxed">
                  Learn at your own speed with lifetime access. Pause, rewind, and re-watch as many times as you need.
                </p>
              </div>
            </div>

            {/* Feature 3: HANDS-ON PROJECTS */}
            <div className="bg-[#DCFCE7] text-black border-4 border-black shadow-[8px_8px_0px_#000] p-8 relative flex flex-col justify-between">
              <div className="absolute -top-4 -right-4 w-10 h-10 bg-black text-white font-display font-black text-lg border-2 border-white flex items-center justify-center shadow-[3px_3px_0px_#000]">
                3
              </div>
              <div>
                <div className="w-14 h-14 bg-white border-3 border-black shadow-[3px_3px_0px_#000] flex items-center justify-center mb-6">
                  <Code className="w-7 h-7 text-black stroke-[2.5]" />
                </div>
                <h3 className="font-display font-black text-2xl text-black uppercase tracking-tight mb-3">
                  HANDS-ON PROJECTS
                </h3>
                <div className="w-full h-1 bg-black mb-4" />
                <p className="text-slate-800 font-medium text-base leading-relaxed">
                  Build real projects that showcase your skills. Stop watching and start building a portfolio that stands out.
                </p>
              </div>
            </div>

          </div>
        </div>
      </section>"""

new_section3 = """      {/* 3. Built for Modern Businesses */}
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

          </div>
        </div>
      </section>"""

content = content.replace(old_section3, new_section3)

# 3. Replace industries and blog sections with a dedicated Neo-Brutalist Pricing Section on the homepage!
pricing_section_homepage = """      {/* 4. Pricing Plans Overview Section */}
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
      </section>"""

# Replace from section id="industries" all the way through end of section id="blog"
pattern = r'<section id="industries".*?</section>\s*<section id="blog".*?</section>'
content = re.sub(pattern, pricing_section_homepage, content, flags=re.DOTALL)

# 4. Update Footer Links
old_footer_links = """              <ul className="space-y-3 font-display font-black text-xs uppercase tracking-wider">
                <li><a href="/about" className="hover:text-indigo-600 transition-colors">ABOUT</a></li>
                <li><a href="/contact" className="hover:text-indigo-600 transition-colors">CONTACT</a></li>
                <li><a href="/#industries" className="hover:text-indigo-600 transition-colors">INDUSTRIES</a></li>
                <li><a href="#shorts" className="hover:text-indigo-600 transition-colors">SHORTS</a></li>
                <li><a href="#blog" className="hover:text-indigo-600 transition-colors">BLOG</a></li>
                <li><a href="#why-us" className="hover:text-indigo-600 transition-colors">QUESTIONS</a></li>
              </ul>"""

new_footer_links = """              <ul className="space-y-3 font-display font-black text-xs uppercase tracking-wider">
                <li><a href="/about" className="hover:text-indigo-600 transition-colors">ABOUT</a></li>
                <li><a href="/pricing" className="hover:text-indigo-600 transition-colors">PRICING</a></li>
                <li><a href="/contact" className="hover:text-indigo-600 transition-colors">CONTACT</a></li>
              </ul>"""

content = content.replace(old_footer_links, new_footer_links)

# Footer company description and copyright
content = content.replace(
    'Empowering students worldwide with expert-led courses and hands-on projects. Learn at your own pace, build real skills.',
    'Empowering retail, fashion, supermarket, and wholesale businesses across Bangladesh with cutting-edge POS and ERP software automation.'
)

content = content.replace(
    '© 2026 LWHH. ALL RIGHTS RESERVED.',
    '© 2026 SHOMPORKO CRM. ALL RIGHTS RESERVED.'
)

content = content.replace(
    'BUILT FOR LIFELONG LEARNERS',
    'BUILT FOR MODERN BUSINESSES'
)

with open("src/components/landing/LandingPage.tsx", "w") as f:
    f.write(content)

print("Updated LandingPage.tsx successfully")
