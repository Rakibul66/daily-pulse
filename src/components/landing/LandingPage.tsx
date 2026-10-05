import React from 'react';
import { 
  ArrowRight, FileText, 
  CheckCircle, 
  TrendingUp, 
  ShoppingCart, 
  Briefcase, 
  PieChart, 
  Store, 
  MapPin, 
  Users, 
  Globe, 
  Headset, 
  Code,
  ShieldCheck,
  Smartphone,
  CloudLightning
} from 'lucide-react';

interface Props {
  onGetStarted: () => void;
  onSignIn?: () => void;
}

export const LandingPage: React.FC<Props> = ({ onGetStarted, onSignIn }) => {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 font-sans selection:bg-primary-500/30">
      
      {/* Top Navbar */}
      <nav className="fixed top-0 w-full z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-rose-500 via-fuchsia-600 to-indigo-600 text-white flex items-center justify-center font-black text-xl shadow-lg shadow-fuchsia-500/30">
                A
              </div>
              <span className="text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-rose-500 via-fuchsia-600 to-indigo-600 tracking-tight drop-shadow-sm">
                ApnarSoftware
              </span>
            </div>
            <div className="hidden md:flex gap-8 text-sm font-semibold text-slate-600 dark:text-slate-300">
              <a href="#about" className="hover:text-primary-600 transition-colors">About</a>
              <a href="#features" className="hover:text-primary-600 transition-colors">Features</a>
              <a href="#industries" className="hover:text-primary-600 transition-colors">Industries</a>
            </div>
            <div className="flex gap-4">
              <button 
                onClick={onGetStarted}
                className="px-5 py-2 text-sm font-bold text-white bg-primary-600 hover:bg-primary-700 rounded-xl shadow-md transition-all active:scale-95"
              >
                Login / Demo
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 sm:pt-40 sm:pb-24 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary-100 via-slate-50 to-slate-50 dark:from-primary-950 dark:via-slate-950 dark:to-slate-950 -z-10"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl sm:text-6xl font-black text-slate-900 dark:text-white tracking-tight leading-tight mb-6">
            The Ultimate <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-cyan-500">POS & ERP Software</span>
            <br className="hidden sm:block" /> for Your Business
          </h1>
          <p className="max-w-2xl mx-auto text-base sm:text-lg text-slate-600 dark:text-slate-400 leading-relaxed mb-8">
            Fast, reliable, and user-friendly tools that empower businesses to operate efficiently, manage inventory flawlessly, and maximize profits in real-time.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <button
              onClick={onGetStarted}
              className="px-8 py-3.5 text-base font-bold text-white bg-slate-900 dark:bg-white dark:text-slate-900 hover:bg-slate-800 dark:hover:bg-slate-100 rounded-2xl shadow-xl transition-all active:scale-95 flex items-center justify-center gap-2"
            >
              Get Free Consultancy <ArrowRight className="w-4 h-4" />
            </button>
            <button className="px-8 py-3.5 text-base font-bold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-2xl shadow-sm transition-all flex items-center justify-center">
              Watch Demo
            </button>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-primary-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 text-center">
            <div className="flex flex-col items-center p-4 bg-white/10 rounded-2xl backdrop-blur-sm">
              <Store className="w-8 h-8 mb-3 text-cyan-300" />
              <div className="text-2xl font-black mb-1">1400+</div>
              <div className="text-[10px] font-bold tracking-widest uppercase text-primary-200">Shops</div>
            </div>
            <div className="flex flex-col items-center p-4 bg-white/10 rounded-2xl backdrop-blur-sm">
              <Users className="w-8 h-8 mb-3 text-cyan-300" />
              <div className="text-2xl font-black mb-1">3600+</div>
              <div className="text-[10px] font-bold tracking-widest uppercase text-primary-200">Users</div>
            </div>
            <div className="flex flex-col items-center p-4 bg-white/10 rounded-2xl backdrop-blur-sm">
              <MapPin className="w-8 h-8 mb-3 text-cyan-300" />
              <div className="text-2xl font-black mb-1">64+</div>
              <div className="text-[10px] font-bold tracking-widest uppercase text-primary-200">Districts</div>
            </div>
            <div className="flex flex-col items-center p-4 bg-white/10 rounded-2xl backdrop-blur-sm">
              <Globe className="w-8 h-8 mb-3 text-cyan-300" />
              <div className="text-2xl font-black mb-1">11+</div>
              <div className="text-[10px] font-bold tracking-widest uppercase text-primary-200">Countries</div>
            </div>
            <div className="flex flex-col items-center p-4 bg-white/10 rounded-2xl backdrop-blur-sm">
              <Headset className="w-8 h-8 mb-3 text-cyan-300" />
              <div className="text-2xl font-black mb-1">7+</div>
              <div className="text-[10px] font-bold tracking-widest uppercase text-primary-200">Support Team</div>
            </div>
            <div className="flex flex-col items-center p-4 bg-white/10 rounded-2xl backdrop-blur-sm">
              <Code className="w-8 h-8 mb-3 text-cyan-300" />
              <div className="text-2xl font-black mb-1">5+</div>
              <div className="text-[10px] font-bold tracking-widest uppercase text-primary-200">Tech Team</div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us & About */}
      <section id="about" className="py-20 bg-white dark:bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-sm font-bold uppercase tracking-widest text-primary-600 mb-2">About Us</h2>
              <h3 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white mb-6">
                Cutting-Edge Solutions Recognized by Industry Leaders
              </h3>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed mb-6">
                With years of expertise in software development and business automation, we understand the challenges faced by retailers, restaurants, and service providers. Our POS system is designed to be seamless, secure, and scalable—ensuring businesses of all sizes benefit from real-time analytics.
              </p>
              
              <h4 className="font-bold text-slate-900 dark:text-white mb-4 text-lg">Why Choose Us?</h4>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <div className="mt-0.5"><CheckCircle className="w-5 h-5 text-emerald-500" /></div>
                  <div><strong className="text-slate-900 dark:text-white">Easy to Use:</strong> <span className="text-slate-600 dark:text-slate-400">Intuitive interface with a smooth user experience.</span></div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="mt-0.5"><ShieldCheck className="w-5 h-5 text-emerald-500" /></div>
                  <div><strong className="text-slate-900 dark:text-white">Secure & Reliable:</strong> <span className="text-slate-600 dark:text-slate-400">Advanced security features to protect your business data.</span></div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="mt-0.5"><CloudLightning className="w-5 h-5 text-emerald-500" /></div>
                  <div><strong className="text-slate-900 dark:text-white">Cloud & Offline Support:</strong> <span className="text-slate-600 dark:text-slate-400">Work seamlessly online and offline without interruption.</span></div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="mt-0.5"><Headset className="w-5 h-5 text-emerald-500" /></div>
                  <div><strong className="text-slate-900 dark:text-white">24/7 Support:</strong> <span className="text-slate-600 dark:text-slate-400">We are always here to help when you need us.</span></div>
                </li>
              </ul>
            </div>
            <div className="relative">
              <div className="aspect-square sm:aspect-[4/3] bg-gradient-to-tr from-primary-100 to-slate-100 dark:from-primary-900/30 dark:to-slate-800 rounded-3xl overflow-hidden border border-slate-200 dark:border-slate-700 shadow-2xl flex items-center justify-center p-8">
                 <div className="text-center">
                    <h3 className="text-3xl font-black text-primary-700 dark:text-primary-400 mb-4">Your Ultimate Business Partner</h3>
                    <div className="space-y-3 font-semibold text-slate-700 dark:text-slate-300 text-lg">
                      <p>✓ Fast & Easy Billing</p>
                      <p>✓ Inventory Management</p>
                      <p>✓ Sales Reports & Analysis</p>
                      <p>✓ Business Digitalization</p>
                    </div>
                 </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Key Features */}
      <section id="features" className="py-20 bg-slate-50 dark:bg-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">Key Features</h2>
            <p className="text-slate-600 dark:text-slate-400">Everything you need to run your daily operations flawlessly from a single dashboard.</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-orange-100/50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800/50 p-6 rounded-3xl">
              <div className="w-12 h-12 bg-white dark:bg-slate-800 rounded-2xl flex items-center justify-center mb-6 shadow-sm text-orange-500">
                <ShoppingCart className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-3">Purchase Management</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                Effortlessly manage procurement by tracking supplier transactions, purchase orders, and payment statuses. Automate stock updates upon receiving goods.
              </p>
            </div>
            
            <div className="bg-purple-100/50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800/50 p-6 rounded-3xl">
              <div className="w-12 h-12 bg-white dark:bg-slate-800 rounded-2xl flex items-center justify-center mb-6 shadow-sm text-purple-500">
                <TrendingUp className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-3">Sales Management</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                Speed up transactions with a seamless sales module, including quick billing, invoice generation, discount management, and multi-payment options.
              </p>
            </div>
            
            <div className="bg-pink-100/50 dark:bg-pink-900/20 border border-pink-200 dark:border-pink-800/50 p-6 rounded-3xl">
              <div className="w-12 h-12 bg-white dark:bg-slate-800 rounded-2xl flex items-center justify-center mb-6 shadow-sm text-pink-500">
                <Briefcase className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-3">Account Management</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                Keep financial records organized with automated tracking of expenses, revenues, and ledger management. Gain a clear financial overview.
              </p>
            </div>

            <div className="bg-blue-100/50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800/50 p-6 rounded-3xl">
              <div className="w-12 h-12 bg-white dark:bg-slate-800 rounded-2xl flex items-center justify-center mb-6 shadow-sm text-blue-500">
                <PieChart className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-3">Reports Management</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                Generate real-time reports on sales, purchases, inventory, and financials. Analyze trends, monitor performance, and make data-driven decisions.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Industries We Serve */}
      <section id="industries" className="py-20 bg-white dark:bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">Industries We Serve</h2>
            <p className="text-slate-600 dark:text-slate-400">
              Our ERP and POS software is designed to cater to a wide range of industries, providing seamless sales management, inventory tracking, and business automation.
            </p>
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {[
              "Retail & E-Commerce", "Supermarkets & Grocery", "Fashion & Apparel",
              "Electronics & Mobile", "Pharmacy & Healthcare", "Restaurants & Cafes",
              "Fast Food & Takeaways", "SME & F-Commerce", "Salons & Laundry",
              "Gyms & Fitness Centers", "Hotels & Resorts", "Auto Mobiles & Parts"
            ].map(ind => (
              <div key={ind} className="bg-slate-100 dark:bg-slate-800 rounded-2xl p-6 text-center font-bold text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 hover:border-primary-500 transition-colors shadow-sm cursor-pointer">
                {ind}
              </div>
            ))}
          </div>
        </div>
      </section>

      
      {/* Happy Clients */}
      <section className="py-20 bg-slate-50 dark:bg-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">Happy Clients</h2>
            <p className="text-slate-600 dark:text-slate-400">Join thousands of businesses who trust our POS & ERP software for their daily operations.</p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {[1,2,3,4,5,6,7,8,9,10].map(i => (
              <div key={i} className="aspect-square bg-slate-200 dark:bg-slate-800 rounded-2xl overflow-hidden border border-slate-300 dark:border-slate-700 flex items-center justify-center text-slate-400 dark:text-slate-500">
                <Store className="w-8 h-8 opacity-50" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Still Confused CTA */}
      <section className="py-16 bg-[#1A4F2E] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="max-w-xl">
              <h2 className="text-3xl font-black mb-4">Still Confused About Our Software !!!!</h2>
              <p className="text-emerald-100 mb-8 font-medium">Contact us for Free Consultation.</p>
              <div className="flex gap-4">
                <button 
                  onClick={onGetStarted}
                  className="px-6 py-3 bg-white text-[#1A4F2E] hover:bg-slate-100 rounded-full font-bold transition-colors"
                >
                  Get Free Consultation
                </button>
                <button className="px-6 py-3 bg-white text-[#1A4F2E] hover:bg-slate-100 rounded-full font-bold transition-colors">
                  Call Now
                </button>
              </div>
            </div>
            <div className="hidden md:block w-64 h-64 bg-emerald-800/50 rounded-full border-4 border-dashed border-emerald-500/30">
               {/* Decorative element replacing the image */}
            </div>
          </div>
        </div>
      </section>

      {/* Latest Blogs */}
      <section className="py-20 bg-white dark:bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-12">Latest Blogs</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { title: "Complete Guide to Choosing the Right POS System in 2026", date: "August 29, 2026" },
              { title: "Best Inventory Management Software in Bangladesh", date: "December 24, 2025" },
              { title: "Why Businesses Need POS Software", date: "April 30, 2026" }
            ].map((blog, idx) => (
              <div key={idx} className="bg-slate-50 dark:bg-slate-800 rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700 hover:shadow-lg transition-shadow">
                <div className="h-48 bg-slate-200 dark:bg-slate-700 flex items-center justify-center">
                  <FileText className="w-8 h-8 text-slate-400" />
                </div>
                <div className="p-6">
                  <h3 className="font-bold text-lg text-slate-900 dark:text-white mb-4 line-clamp-2">{blog.title}</h3>
                  <div className="flex justify-between items-center">
                    <button className="text-red-500 font-bold text-sm hover:text-red-600 uppercase">Read More »</button>
                    <span className="text-xs text-slate-500">{blog.date}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>


      {/* Footer */}
      <footer className="bg-black text-white pt-16 pb-8 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-12 mb-12">
            
            {/* Brand Area */}
            <div>
              <div className="flex items-center gap-2 mb-6">
                  <div className="w-10 h-10 rounded bg-gradient-to-br from-rose-500 via-fuchsia-600 to-indigo-600 text-white flex items-center justify-center font-black text-lg shadow-lg">A</div>
                  <span className="font-extrabold text-3xl tracking-tight text-white">Apnar<br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-500 to-fuchsia-500">Software</span></span>
              </div>
              <p className="text-sm text-slate-400 leading-relaxed">
                At <strong className="text-white">ApnarSoftware</strong>, we are redefining the way businesses manage sales, inventory, and customer interactions with our cutting-edge <strong className="text-white">POS software</strong>. Our mission is to provide <strong className="text-white">fast, reliable, and user-friendly solutions</strong> that empower businesses to operate efficiently and maximize profits.
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="text-xl font-bold mb-6">Quick Links</h3>
              <ul className="space-y-3 text-sm font-semibold text-slate-300">
                <li><a href="#" className="hover:text-red-500 transition-colors flex items-center gap-2"><ArrowRight className="w-3 h-3" /> About Us</a></li>
                <li><a href="#" className="hover:text-red-500 transition-colors flex items-center gap-2"><ArrowRight className="w-3 h-3" /> Price Plan</a></li>
                <li><a href="#" className="hover:text-red-500 transition-colors flex items-center gap-2"><ArrowRight className="w-3 h-3" /> Contact Us</a></li>
                <li><a href="#" className="hover:text-red-500 transition-colors flex items-center gap-2"><ArrowRight className="w-3 h-3" /> Video Guideline</a></li>
                <li><a href="#" className="hover:text-red-500 transition-colors flex items-center gap-2"><ArrowRight className="w-3 h-3" /> Client Story</a></li>
                <li><a href="#" className="hover:text-red-500 transition-colors flex items-center gap-2"><ArrowRight className="w-3 h-3" /> Gallery</a></li>
                <li><a href="#" className="hover:text-red-500 transition-colors flex items-center gap-2"><ArrowRight className="w-3 h-3" /> Career</a></li>
                <li><a href="#" className="hover:text-red-500 transition-colors flex items-center gap-2"><ArrowRight className="w-3 h-3" /> Blog</a></li>
              </ul>
            </div>

            {/* Contact Us */}
            <div>
              <h3 className="text-xl font-bold mb-6">Contact Us</h3>
              <ul className="space-y-4 text-sm text-slate-300 font-semibold mb-8">
                <li className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 shrink-0 text-slate-400" />
                  <span>4th Floor, 5A, House: 202/D, Haji SolimUddin Ln, Middle Badda, Dhaka 1212</span>
                </li>
                <li className="flex items-center gap-3">
                  <Headset className="w-5 h-5 shrink-0 text-slate-400" />
                  <span>01998 683666</span>
                </li>
                <li className="flex items-center gap-3">
                  <Headset className="w-5 h-5 shrink-0 text-slate-400" />
                  <span>01602 942375</span>
                </li>
                <li className="flex items-center gap-3">
                  <Globe className="w-5 h-5 shrink-0 text-slate-400" />
                  <span>hello@omnibiz.com</span>
                </li>
              </ul>
              <button className="w-full py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded transition-colors text-center">
                Download Our App Now
              </button>
            </div>
          </div>
          
          <div className="border-t border-slate-800 pt-8 text-center text-xs text-slate-500">
            © {new Date().getFullYear()} ApnarSoftware. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};