with open("src/components/layout/Sidebar.tsx", "r") as f:
    content = f.read()

# Add Image import if not present
if "import Image from 'next/image';" not in content and 'import Image from "next/image";' not in content:
    content = content.replace('import React from "react";', 'import React from "react";\nimport Image from "next/image";', 1)

# Sidebar Shell
content = content.replace(
    'bg-slate-900 border-r border-slate-800 flex flex-col transition-transform duration-300 ease-in-out lg:translate-x-0 text-white',
    'bg-white border-r-4 border-black shadow-[4px_0px_0px_#000] flex flex-col transition-transform duration-300 ease-in-out lg:translate-x-0 text-black'
)

# Header
old_header = """        {/* Brand Header */}
        <div className="h-16 px-6 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-2xl bg-primary-600 flex items-center justify-center text-white shadow-md shadow-primary-950">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-base font-bold text-white leading-none">
                Apnar
              </h1>
              <span className="text-[10px] font-semibold text-primary-400 tracking-wider uppercase">
                Software v1
              </span>
            </div>
          </div>

          <button
            onClick={onCloseMobile}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white lg:hidden"
          >
            <X className="w-5 h-5" />
          </button>
        </div>"""

new_header = """        {/* Brand Header */}
        <div className="h-16 px-5 border-b-4 border-black flex items-center justify-between bg-white">
          <div className="flex items-center gap-2.5">
            <Image
              src="/somporko.webp"
              alt="Shomporko Logo"
              width={34}
              height={34}
              className="object-contain"
            />
            <div>
              <h1 className="font-display font-black text-sm tracking-tight text-black leading-none uppercase">
                SHOMPORKO
              </h1>
              <span className="text-[9px] font-black text-indigo-600 tracking-widest uppercase">
                CRM & POS
              </span>
            </div>
          </div>

          <button
            onClick={onCloseMobile}
            className="p-1 bg-white hover:bg-red-600 hover:text-white border-2 border-black shadow-[2px_2px_0px_#000] text-black lg:hidden cursor-pointer"
          >
            <X className="w-4 h-4 stroke-[2.5]" />
          </button>
        </div>"""

content = content.replace(old_header, new_header)

# Workspace Menus heading
content = content.replace(
    'text-[10px] font-bold uppercase tracking-wider text-slate-400',
    'text-[10px] font-black uppercase tracking-widest text-black'
)

# Dashboard button
old_dashboard = """            <button
              onClick={() => handleSelect('dashboard')}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all group ${
                activePage === 'dashboard'
                  ? "bg-[#20B2AA] text-white shadow-md"
                  : "text-slate-400 hover:text-white hover:bg-slate-800/80"
              }`}
            >"""

new_dashboard = """            <button
              onClick={() => handleSelect('dashboard')}
              className={`w-full flex items-center justify-between px-3 py-2 text-xs font-black uppercase tracking-wider transition-all border-2 ${
                activePage === 'dashboard'
                  ? "bg-indigo-600 text-white border-black shadow-[3px_3px_0px_#000]"
                  : "text-black border-transparent hover:border-black hover:bg-amber-300 hover:shadow-[2px_2px_0px_#000]"
              }`}
            >"""

content = content.replace(old_dashboard, new_dashboard)

# Replace common navigation styling
content = content.replace(
    'bg-primary-600 text-white shadow-md shadow-primary-900/40 font-bold',
    'bg-indigo-600 text-white border-2 border-black shadow-[3px_3px_0px_#000] font-black uppercase tracking-wider'
)

content = content.replace(
    'text-slate-400 hover:text-white hover:bg-slate-800/80 transition-all group',
    'text-black hover:bg-slate-100 hover:text-black border-2 border-transparent hover:border-black transition-all group font-bold'
)

content = content.replace(
    'text-slate-400 hover:text-white hover:bg-slate-800/80',
    'text-black hover:bg-slate-100 hover:text-black border-2 border-transparent hover:border-black'
)

content = content.replace(
    'before:bg-slate-800',
    'before:bg-black'
)

content = content.replace(
    'bg-primary-500/10 text-primary-400',
    'bg-amber-300 text-black border-2 border-black shadow-[2px_2px_0px_#000] font-black'
)

content = content.replace(
    'text-slate-500 hover:text-slate-300 hover:bg-slate-800/50',
    'text-slate-800 hover:text-black hover:bg-amber-100 font-bold'
)

content = content.replace(
    'text-slate-400 hover:text-white',
    'text-slate-800 hover:text-black'
)

content = content.replace(
    'border-slate-800/50',
    'border-black'
)

content = content.replace(
    'border-slate-800',
    'border-black'
)

# User bottom footer
old_user_footer = """        {/* User Card & Sign Out */}
        <div className="p-3 border-t border-slate-800 bg-slate-950/40">
          <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-950 border border-slate-800 shadow-2xs">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-xl bg-primary-950 text-primary-300 font-bold text-xs flex items-center justify-center border border-primary-800 shrink-0">
                {user?.displayName
                  ? user.displayName.charAt(0).toUpperCase()
                  : user?.email
                  ? user.email.charAt(0).toUpperCase()
                  : "U"}
              </div>
              <div className="min-w-0">
                <p className="text-xs font-semibold text-white truncate leading-tight">
                  {user?.displayName || user?.email?.split("@")[0] || "User"}
                </p>
                <p className="text-[10px] text-slate-400 truncate leading-tight">
                  {user?.email || "Signed In"}
                </p>
              </div>
            </div>

            <button
              onClick={signOutUser}
              className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-slate-800 rounded-lg transition-colors shrink-0 ml-1"
              title="Sign Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>"""

new_user_footer = """        {/* User Card & Sign Out */}
        <div className="p-3 border-t-4 border-black bg-white">
          <div className="flex items-center justify-between p-2.5 bg-white border-2 border-black shadow-[3px_3px_0px_#000]">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 bg-amber-300 text-black font-black text-xs flex items-center justify-center border-2 border-black shrink-0">
                {user?.displayName
                  ? user.displayName.charAt(0).toUpperCase()
                  : user?.email
                  ? user.email.charAt(0).toUpperCase()
                  : "U"}
              </div>
              <div className="min-w-0">
                <p className="text-xs font-black text-black uppercase truncate leading-tight">
                  {user?.displayName || user?.email?.split("@")[0] || "User"}
                </p>
                <p className="text-[10px] font-bold text-slate-600 truncate leading-tight">
                  {user?.email || "Signed In"}
                </p>
              </div>
            </div>

            <button
              onClick={signOutUser}
              className="p-1.5 bg-white hover:bg-red-600 hover:text-white border-2 border-black shadow-[1px_1px_0px_#000] text-black active:translate-x-0.5 active:translate-y-0.5 transition-all shrink-0 ml-1 cursor-pointer"
              title="Sign Out"
            >
              <LogOut className="w-4 h-4 stroke-[2.5]" />
            </button>
          </div>
        </div>"""

content = content.replace(old_user_footer, new_user_footer)

with open("src/components/layout/Sidebar.tsx", "w") as f:
    f.write(content)

print("Updated Sidebar.tsx successfully")
