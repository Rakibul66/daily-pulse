import re

with open('src/components/landing/LandingPage.tsx', 'r') as f:
    content = f.read()

# Define the new industries section
new_section = """<section id="industries" className="py-20 sm:py-32 bg-slate-50 border-b-4 border-black relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.03] bg-[linear-gradient(to_right,#000_1px,transparent_1px),linear-gradient(to_bottom,#000_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          
          <div className="text-center mb-16 max-w-3xl mx-auto">
            <div className="relative inline-block">
              <h2 className="font-display font-black text-4xl sm:text-6xl uppercase tracking-tight text-black">
                INDUSTRIES <span className="text-indigo-600">WE SERVE</span>
              </h2>
              <div className="w-full h-2 bg-indigo-600 mt-2" />
            </div>
            <p className="font-medium text-lg text-slate-700 mt-8 leading-relaxed">
              Our ERP and POS software is designed to cater to a wide range of industries, providing seamless sales management, inventory tracking, and business automation.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            
            {[
              { name: 'Retail & E-Commerce', color: 'group-hover:bg-amber-300', icon: '🛍️' },
              { name: 'Supermarkets & Grocery', color: 'group-hover:bg-emerald-300', icon: '🛒' },
              { name: 'Fashion & Apparel', color: 'group-hover:bg-rose-300', icon: '👗' },
              { name: 'Electronics & Mobile', color: 'group-hover:bg-cyan-300', icon: '📱' },
              { name: 'Pharmacy & Healthcare', color: 'group-hover:bg-blue-300', icon: '💊' },
              { name: 'Restaurants & Cafes', color: 'group-hover:bg-orange-300', icon: '🍽️' },
              { name: 'Fast Food & Takeaways', color: 'group-hover:bg-yellow-300', icon: '🍔' },
              { name: 'SME & F-Commerce', color: 'group-hover:bg-fuchsia-300', icon: '💼' },
              { name: 'Salons & Laundry', color: 'group-hover:bg-purple-300', icon: '✂️' },
              { name: 'Gyms & Fitness Centers', color: 'group-hover:bg-lime-300', icon: '🏋️' },
              { name: 'Hotels & Resorts', color: 'group-hover:bg-sky-300', icon: '🏨' },
              { name: 'Auto Mobiles & Parts', color: 'group-hover:bg-red-300', icon: '🚗' },
            ].map((industry, idx) => (
              <div 
                key={idx}
                className="bg-white border-3 border-black shadow-[4px_4px_0px_#000] p-6 flex flex-col items-center justify-center text-center hover:-translate-y-2 hover:shadow-[8px_8px_0px_#000] hover:bg-slate-900 hover:text-white transition-all duration-300 group cursor-default"
              >
                <div className={`w-14 h-14 border-2 border-black bg-white text-black shadow-[2px_2px_0px_#000] flex items-center justify-center mb-4 text-2xl transition-all duration-300 ${industry.color} group-hover:scale-110 group-hover:-rotate-6`}>
                  {industry.icon}
                </div>
                <h3 className="font-display font-black text-sm sm:text-base uppercase tracking-tight">
                  {industry.name}
                </h3>
              </div>
            ))}

          </div>
        </div>
      </section>"""

# Replace the topics section with the new industries section
content = re.sub(
    r'<section id="topics".*?EXPLORE BY CATEGORY.*?</section>',
    new_section,
    content,
    flags=re.DOTALL
)

with open('src/components/landing/LandingPage.tsx', 'w') as f:
    f.write(content)
