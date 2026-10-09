import React from "react";
import { LogOut } from "lucide-react";

interface SidebarUserProfileProps {
  user: {
    displayName?: string | null;
    email?: string | null;
  } | null;
  role?: string;
  onSignOut: () => void;
}

export const SidebarUserProfile: React.FC<SidebarUserProfileProps> = ({
  user,
  role,
  onSignOut,
}) => {
  return (
    <div className="p-3 border-t-4 border-black bg-white">
      <div className="bg-white border-3 border-black shadow-[4px_4px_0px_#000] p-3 flex flex-col gap-2.5">
        {/* User Identity Info */}
        <div className="flex items-center gap-3 min-w-0">
          {/* Neo-Brutalist Avatar with status badge */}
          <div className="relative shrink-0">
            <div className="w-10 h-10 bg-amber-300 border-2 border-black font-display font-black text-sm text-black flex items-center justify-center shadow-[2px_2px_0px_#000]">
              {user?.displayName
                ? user.displayName.charAt(0).toUpperCase()
                : user?.email
                ? user.email.charAt(0).toUpperCase()
                : "U"}
            </div>
            <span
              className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-500 border-2 border-black rounded-full"
              title="Online"
            />
          </div>

          {/* Name, Role & Email */}
          <div className="min-w-0 flex-1">
            <div className="flex items-center justify-between gap-1">
              <p className="font-display text-xs font-black text-black truncate uppercase tracking-tight leading-tight">
                {user?.displayName || user?.email?.split("@")[0] || "User"}
              </p>
              <span className="shrink-0 px-1.5 py-0.5 bg-black text-amber-300 font-display text-[9px] font-black uppercase tracking-wider border border-black shadow-[1px_1px_0px_#000]">
                {role === "EMPLOYEE" ? "STAFF" : "ADMIN"}
              </span>
            </div>
            <p className="text-[11px] font-bold text-slate-500 truncate leading-tight mt-0.5">
              {user?.email || "Signed In"}
            </p>
          </div>
        </div>

        {/* Sign Out Action Button */}
        <button
          onClick={onSignOut}
          className="w-full py-1.5 px-3 bg-rose-50 hover:bg-rose-500 text-rose-700 hover:text-white font-display font-black text-xs uppercase tracking-wider border-2 border-black shadow-[2px_2px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all flex items-center justify-center gap-2 cursor-pointer"
          title="Sign Out of Shomporko CRM"
        >
          <LogOut className="w-3.5 h-3.5 stroke-[2.5]" />
          <span>SIGN OUT</span>
        </button>
      </div>
    </div>
  );
};
