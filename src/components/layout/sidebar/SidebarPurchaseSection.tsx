import React from "react";
import { Truck, ChevronRight } from "lucide-react";
import { AdminPageId, PURCHASE_TX_ITEMS, PURCHASE_REPORT_ITEMS } from "./types";

interface SidebarPurchaseSectionProps {
  isOpen: boolean;
  onToggle: () => void;
  isTxOpen: boolean;
  onToggleTx: () => void;
  isReportsOpen: boolean;
  onToggleReports: () => void;
  activePage: AdminPageId;
  onSelect: (pageId: AdminPageId) => void;
}

export const SidebarPurchaseSection: React.FC<SidebarPurchaseSectionProps> = ({
  isOpen,
  onToggle,
  isTxOpen,
  onToggleTx,
  isReportsOpen,
  onToggleReports,
  activePage,
  onSelect,
}) => {
  const isPurchaseActive = [
    'purchase-vendor-setup',
    'purchase-product',
    'purchase-return',
    'purchase-payment',
    'purchase-generate-barcode',
    'purchase-vendor-statement',
  ].includes(activePage);

  return (
    <div className="pt-1">
      <button
        type="button"
        onClick={onToggle}
        className={`w-full flex items-center justify-between px-3 py-2.5 text-xs font-display font-black uppercase tracking-wider transition-all border-2 cursor-pointer ${
          isPurchaseActive
            ? "bg-indigo-600 text-white border-black shadow-[3px_3px_0px_#000]"
            : "text-black bg-white border-transparent hover:border-black hover:bg-amber-300 hover:shadow-[2px_2px_0px_#000]"
        }`}
      >
        <div className="flex items-center gap-3">
          <Truck className="w-4 h-4 stroke-[2.5]" />
          <span>PURCHASE MANAGEMENT</span>
        </div>
        <ChevronRight
          className={`w-4 h-4 stroke-[2.5] transition-transform duration-200 ${
            isOpen ? "rotate-90" : ""
          }`}
        />
      </button>

      {isOpen && (
        <div className="pl-6 pr-1 py-1 mt-1 space-y-1 relative before:content-[''] before:absolute before:left-3 before:top-2 before:bottom-2 before:w-0.5 before:bg-black">
          {/* TRANSACTIONS SECTION */}
          <button
            type="button"
            onClick={onToggleTx}
            className="w-full text-left px-3 py-2 text-[11px] font-display font-black uppercase tracking-wider text-black bg-white border-2 border-transparent hover:border-black hover:bg-amber-100 flex items-center justify-between transition-all cursor-pointer"
          >
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 border border-black bg-black" />
              TRANSACTIONS
            </div>
            <ChevronRight className={`w-3.5 h-3.5 stroke-[2.5] transition-transform ${isTxOpen ? "rotate-90" : ""}`} />
          </button>

          {isTxOpen && (
            <div className="pl-4 space-y-1 relative before:content-[''] before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-black/40">
              {PURCHASE_TX_ITEMS.map((item) => {
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

          {/* REPORTS SECTION */}
          <button
            type="button"
            onClick={onToggleReports}
            className="w-full text-left px-3 py-2 text-[11px] font-display font-black uppercase tracking-wider text-black bg-white border-2 border-transparent hover:border-black hover:bg-amber-100 flex items-center justify-between transition-all cursor-pointer"
          >
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 border border-black bg-black" />
              REPORTS
            </div>
            <ChevronRight className={`w-3.5 h-3.5 stroke-[2.5] transition-transform ${isReportsOpen ? "rotate-90" : ""}`} />
          </button>

          {isReportsOpen && (
            <div className="pl-4 space-y-1 relative before:content-[''] before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-black/40">
              {PURCHASE_REPORT_ITEMS.map((item) => {
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
      )}
    </div>
  );
};
