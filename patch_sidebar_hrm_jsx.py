import re

path = 'src/components/layout/Sidebar.tsx'
with open(path, 'r') as f:
    content = f.read()

hrm_block = """          {/* HRM & Payroll */}
          <div className="pt-2">
            <button
              onClick={() => setIsHrmOpen(!isHrmOpen)}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all group ${
                hrmNavItems.some((item) => item.id === activePage)
                  ? "bg-primary-600 text-white shadow-md shadow-primary-900/40 font-bold"
                  : "text-slate-400 hover:text-white hover:bg-slate-800/80"
              }`}
            >
              <div className="flex items-center gap-3">
                <Briefcase className={`w-4 h-4 transition-colors ${hrmNavItems.some((item) => item.id === activePage) ? "text-white" : "group-hover:text-white text-slate-400"}`} />
                <span>HRM & Payroll</span>
              </div>
              <ChevronRight
                className={`w-3.5 h-3.5 transition-transform duration-200 ${
                  isHrmOpen ? "rotate-90" : ""
                }`}
              />
            </button>
            {isHrmOpen && (
              <div className="pl-9 pr-3 py-1 mt-1 space-y-1 relative before:content-[''] before:absolute before:left-[1.35rem] before:top-2 before:bottom-2 before:w-px before:bg-slate-800">
                {hrmNavItems.map((item) => {
                  const isActive = activePage === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => handleSelect(item.id)}
                      className={`w-full text-left px-3 py-2 rounded-lg text-xs font-semibold transition-all ${
                        isActive
                          ? "bg-primary-500/10 text-primary-400"
                          : "text-slate-500 hover:text-slate-300 hover:bg-slate-800/50"
                      }`}
                    >
                      {item.label}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Utilities */}"""

if "{/* HRM & Payroll */}" not in content:
    content = content.replace("{/* Utilities */}", hrm_block)
    with open(path, 'w') as f:
        f.write(content)
        print("Injected HRM block")
else:
    print("HRM block already exists")
