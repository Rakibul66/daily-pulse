import React from "react";
import { ChevronRight } from "lucide-react";
import { AdminPageId, NavItem } from "./types";

interface SidebarCollapsibleSectionProps {
  label: string;
  icon: React.ReactNode;
  isOpen: boolean;
  onToggle: () => void;
  items: NavItem[];
  activePage: AdminPageId;
  onSelect: (pageId: AdminPageId) => void;
  isAmberActive?: boolean;
}

export const SidebarCollapsibleSection: React.FC<SidebarCollapsibleSectionProps> = ({
  label,
  icon,
  isOpen,
  onToggle,
  items,
  activePage,
  onSelect,
  isAmberActive = false,
}) => {
  const isAnyChildActive = items.some((item) => item.id === activePage);

  return (
    <div className="pt-1">
      <button
        type="button"
        onClick={onToggle}
        className={`w-full flex items-center justify-between px-3 py-2.5 text-xs font-display font-black uppercase tracking-wider transition-all border-2 cursor-pointer ${
          isAnyChildActive
            ? isAmberActive
              ? "bg-amber-300 text-black border-black shadow-[3px_3px_0px_#000]"
              : "bg-indigo-600 text-white border-black shadow-[3px_3px_0px_#000]"
            : "text-black bg-white border-transparent hover:border-black hover:bg-amber-300 hover:shadow-[2px_2px_0px_#000]"
        }`}
      >
        <div className="flex items-center gap-3">
          {icon}
          <span>{label}</span>
        </div>
        <ChevronRight
          className={`w-4 h-4 stroke-[2.5] transition-transform duration-200 ${
            isOpen ? "rotate-90" : ""
          }`}
        />
      </button>

      {isOpen && (
        <div className="pl-6 pr-1 py-1 mt-1 space-y-1 relative before:content-[''] before:absolute before:left-3 before:top-2 before:bottom-2 before:w-0.5 before:bg-black">
          {items.map((item) => {
            const isActive = activePage === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onSelect(item.id)}
                className={`w-full text-left px-3 py-2 text-[11px] font-display font-black uppercase tracking-wider transition-all border-2 cursor-pointer ${
                  isActive
                    ? "bg-amber-300 text-black border-black shadow-[2px_2px_0px_#000]"
                    : "text-black bg-white border-transparent hover:border-black hover:bg-amber-100 hover:shadow-[1px_1px_0px_#000]"
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};
