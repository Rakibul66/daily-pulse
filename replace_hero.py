import re

with open('src/components/landing/LandingPage.tsx', 'r') as f:
    content = f.read()

# Replace Left Column background and text colors
new_content = content.replace(
    'lg:col-span-7 bg-white p-6',
    'lg:col-span-7 bg-gradient-to-tr from-slate-900 to-indigo-900 text-white p-6'
)

new_content = new_content.replace(
    '<Sparkles className="w-4 h-4 fill-black" /> PRACTICAL SKILLS FOR MODERN DEVELOPERS',
    '<Sparkles className="w-4 h-4 fill-black" /> BOLT SOFT'
)

new_content = new_content.replace(
    '''<h1 className="font-display font-black text-6xl sm:text-7xl lg:text-8xl tracking-tight leading-[0.9] text-black mb-6 uppercase">
                MATTER<span className="text-red-600 inline-block animate-bounce">.</span>
              </h1>''',
    '''<h1 className="font-display font-black text-5xl sm:text-6xl lg:text-7xl tracking-tight leading-[0.9] text-white mb-6 uppercase">
                THE ULTIMATE POS & ERP SOFTWARE <br/><span className="text-indigo-400">FOR YOUR BUSINESS.</span>
              </h1>'''
)

new_content = new_content.replace(
    '''<p className="font-medium text-lg sm:text-xl text-slate-800 leading-relaxed mb-8 max-w-xl">
                Stop watching boring tutorials. Start learning valuable skills with guidance from industry veterans.
              </p>''',
    '''<p className="font-medium text-lg sm:text-xl text-indigo-100 leading-relaxed mb-8 max-w-xl">
                Fast, reliable, and user-friendly tools that empower businesses to operate efficiently, manage inventory flawlessly, and maximize profits in real-time.
              </p>'''
)

new_content = new_content.replace(
    'text-black uppercase tracking-wider">\n                    Join 10,000+ learners growing their skills',
    'text-white uppercase tracking-wider">\n                    Join 10,000+ businesses growing their profits'
)

new_content = new_content.replace(
    '<span className="text-black font-black ml-1">5</span>',
    '<span className="text-white font-black ml-1">5</span>'
)

new_content = new_content.replace(
    '<span className="text-slate-600 font-medium">(countless reviews)</span>',
    '<span className="text-indigo-200 font-medium">(countless reviews)</span>'
)

new_content = new_content.replace(
    '''<button 
                  onClick={() => {
                    const el = document.getElementById('free-courses');
                    el?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="px-6 py-4 bg-white hover:bg-slate-100 text-black font-display font-black text-base uppercase tracking-wider border-3 border-black shadow-[6px_6px_0px_#000] active:translate-x-1 active:translate-y-1 active:shadow-[2px_2px_0px_#000] transition-all text-center"
                >
                  BROWSE COURSES
                </button>''',
    '''<button 
                  onClick={() => {
                    const el = document.getElementById('features');
                    el?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="px-6 py-4 bg-white hover:bg-slate-100 text-black font-display font-black text-base uppercase tracking-wider border-3 border-black shadow-[6px_6px_0px_#000] active:translate-x-1 active:translate-y-1 active:shadow-[2px_2px_0px_#000] transition-all text-center"
                >
                  LEARN MORE
                </button>'''
)

new_content = new_content.replace(
    '''<button 
                  onClick={onGetStarted}
                  className="px-8 py-4 bg-red-600 hover:bg-red-700 text-white font-display font-black text-base uppercase tracking-wider border-3 border-black shadow-[6px_6px_0px_#000] active:translate-x-1 active:translate-y-1 active:shadow-[2px_2px_0px_#000] transition-all flex items-center justify-center gap-3 group"
                >
                  START LEARNING <ArrowRight className="w-5 h-5 stroke-[3] group-hover:translate-x-1 transition-transform" />
                </button>''',
    '''<button 
                  onClick={onGetStarted}
                  className="px-8 py-4 bg-indigo-500 hover:bg-indigo-600 text-white font-display font-black text-base uppercase tracking-wider border-3 border-black shadow-[6px_6px_0px_#000] active:translate-x-1 active:translate-y-1 active:shadow-[2px_2px_0px_#000] transition-all flex items-center justify-center gap-3 group"
                >
                  GET STARTED <ArrowRight className="w-5 h-5 stroke-[3] group-hover:translate-x-1 transition-transform" />
                </button>'''
)

new_content = new_content.replace(
    '''<h2 className="font-display font-black text-3xl sm:text-4xl text-black uppercase tracking-tight leading-tight mt-2 mb-4">
                PREMIUM <br />
                <span className="text-red-600">& FREE</span> COURSES
              </h2>''',
    '''<h2 className="font-display font-black text-3xl sm:text-4xl text-black uppercase tracking-tight leading-tight mt-2 mb-4">
                ULTIMATE <br />
                <span className="text-indigo-600">POS & ERP</span>
              </h2>'''
)

new_content = new_content.replace(
    '''<div className="absolute -top-5 -left-5 w-12 h-12 bg-red-600 border-3 border-black rounded-full flex items-center justify-center shadow-[3px_3px_0px_#000]">''',
    '''<div className="absolute -top-5 -left-5 w-12 h-12 bg-indigo-600 border-3 border-black rounded-full flex items-center justify-center shadow-[3px_3px_0px_#000]">'''
)

new_content = new_content.replace(
    '''<div className="text-[11px] font-black tracking-widest text-red-600 uppercase mt-1">HANDS-ON</div>''',
    '''<div className="text-[11px] font-black tracking-widest text-indigo-600 uppercase mt-1">RELIABLE</div>'''
)

new_content = new_content.replace(
    '''<div className="text-[11px] font-black tracking-widest text-red-600 uppercase mt-1">ACCESS</div>''',
    '''<div className="text-[11px] font-black tracking-widest text-indigo-600 uppercase mt-1">SUPPORT</div>'''
)

new_content = new_content.replace(
    '''<button 
                onClick={onGetStarted}
                className="w-full mt-6 py-3 bg-black hover:bg-slate-900 text-white font-display font-black text-xs uppercase tracking-widest border-2 border-black shadow-[3px_3px_0px_#EF4444] transition-all flex items-center justify-center gap-2"
              >
                EXPLORE CATALOG <ArrowRight className="w-4 h-4" />
              </button>''',
    '''<button 
                onClick={onGetStarted}
                className="w-full mt-6 py-3 bg-black hover:bg-slate-900 text-white font-display font-black text-xs uppercase tracking-widest border-2 border-black shadow-[3px_3px_0px_#4F46E5] transition-all flex items-center justify-center gap-2"
              >
                VIEW FEATURES <ArrowRight className="w-4 h-4" />
              </button>'''
)

new_content = new_content.replace(
    '''<div className="lg:col-span-5 bg-red-600 p-8 sm:p-12 lg:p-14 flex items-center justify-center relative overflow-hidden">''',
    '''<div className="lg:col-span-5 bg-indigo-500 p-8 sm:p-12 lg:p-14 flex items-center justify-center relative overflow-hidden">'''
)


with open('src/components/landing/LandingPage.tsx', 'w') as f:
    f.write(new_content)
