"use client";

import React from 'react';
import { 
  ScanBarcode, 
  Zap, 
  Printer, 
  Volume2, 
  VolumeX, 
  RotateCcw 
} from 'lucide-react';

interface POSHeaderProps {
  printAfterSave: boolean;
  setPrintAfterSave: (val: boolean) => void;
  isBeepEnabled: boolean;
  setIsBeepEnabled: (val: boolean) => void;
  method: 'barcode' | 'manual';
  setMethod: (method: 'barcode' | 'manual') => void;
  onResetCart: () => void;
}

export const POSHeader: React.FC<POSHeaderProps> = ({
  printAfterSave,
  setPrintAfterSave,
  isBeepEnabled,
  setIsBeepEnabled,
  method,
  setMethod,
  onResetCart,
}) => {
  return (
    <div className="p-3 sm:p-4 flex flex-wrap items-center justify-between border-b-2 sm:border-b-4 border-black bg-amber-300 gap-3">
      <div className="flex items-center gap-2.5 sm:gap-3">
        <div className="w-9 h-9 sm:w-10 sm:h-10 bg-black text-amber-300 flex items-center justify-center border-2 border-black font-black shrink-0">
          <ScanBarcode className="w-5 h-5 sm:w-6 sm:h-6" />
        </div>
        <div>
          <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
            <h1 className="text-base sm:text-xl font-display font-black text-black uppercase tracking-tight">
              POS TERMINAL
            </h1>
            <span className="px-2 py-0.5 bg-black text-emerald-300 text-[10px] font-black uppercase rounded flex items-center gap-1">
              <Zap className="w-3 h-3 text-emerald-400 fill-emerald-400" />
              <span>Fast O(1)</span>
            </span>
          </div>
          <p className="text-[11px] sm:text-xs font-bold text-black uppercase tracking-wider hidden sm:block">
            Hardware Laser, Camera Vision &amp; 80mm Receipt
          </p>
        </div>
      </div>

      {/* Action Toggles & Controls */}
      <div className="flex flex-wrap items-center gap-2">
        <label className="flex items-center gap-1.5 text-xs font-black text-black cursor-pointer bg-white px-2.5 sm:px-3 py-1.5 border-2 border-black shadow-[2px_2px_0px_#000]">
          <input 
            type="checkbox" 
            checked={printAfterSave} 
            onChange={(e) => setPrintAfterSave(e.target.checked)} 
            className="w-3.5 h-3.5 sm:w-4 sm:h-4 accent-black cursor-pointer" 
          />
          <Printer className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">PRINT RECEIPT</span>
          <span className="sm:hidden">PRINT</span>
        </label>

        <button
          type="button"
          onClick={() => setIsBeepEnabled(!isBeepEnabled)}
          className="flex items-center gap-1 text-xs font-black text-black bg-white hover:bg-slate-100 px-2.5 sm:px-3 py-1.5 border-2 border-black shadow-[2px_2px_0px_#000] cursor-pointer"
          title="Toggle Audio Beep"
        >
          {isBeepEnabled ? (
            <>
              <Volume2 className="w-3.5 h-3.5 text-emerald-600" />
              <span className="hidden sm:inline">BEEP ON</span>
            </>
          ) : (
            <>
              <VolumeX className="w-3.5 h-3.5 text-rose-600" />
              <span className="hidden sm:inline">BEEP OFF</span>
            </>
          )}
        </button>

        {/* Mode Switcher */}
        <div className="flex items-center border-2 border-black bg-white shadow-[2px_2px_0px_#000]">
          <button 
            type="button" 
            onClick={() => setMethod('barcode')}
            className={`px-2 sm:px-3 py-1.5 text-xs font-black uppercase transition-all cursor-pointer ${method === 'barcode' ? 'bg-black text-white' : 'text-black hover:bg-slate-100'}`}
          >
            BARCODE
          </button>
          <button 
            type="button" 
            onClick={() => setMethod('manual')}
            className={`px-2 sm:px-3 py-1.5 text-xs font-black uppercase transition-all cursor-pointer ${method === 'manual' ? 'bg-black text-white' : 'text-black hover:bg-slate-100'}`}
          >
            CATALOG
          </button>
        </div>

        <button 
          type="button" 
          onClick={onResetCart}
          className="px-2.5 sm:px-3 py-1.5 text-xs font-black text-black bg-white hover:bg-rose-100 border-2 border-black shadow-[2px_2px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 flex items-center gap-1 cursor-pointer"
          title="Clear Cart (F4)"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">NEW CART (F4)</span>
          <span className="sm:hidden">CLEAR</span>
        </button>
      </div>
    </div>
  );
};
