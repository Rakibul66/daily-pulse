"use client";

import React from 'react';
import { Barcode as BarcodeIcon, X, Printer } from 'lucide-react';
import { ProductLift } from '@/types/purchase';

interface PurchaseBarcodeModalProps {
  barcodeModalLift: ProductLift | null;
  onClose: () => void;
}

export const PurchaseBarcodeModal: React.FC<PurchaseBarcodeModalProps> = ({
  barcodeModalLift,
  onClose,
}) => {
  if (!barcodeModalLift) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/60 backdrop-blur-xs">
      <div className="bg-white border-4 border-black shadow-[8px_8px_0px_#000] max-w-xl w-full max-h-[90vh] flex flex-col animate-in fade-in zoom-in-95">
        <div className="flex items-center justify-between p-4 border-b-4 border-black bg-sky-300">
          <h3 className="font-display font-black text-sm uppercase tracking-wide flex items-center gap-2 text-black">
            <BarcodeIcon className="w-4 h-4 stroke-[2.5]" /> BARCODE LABELS: {barcodeModalLift.purchaseNo}
          </h3>
          <button
            onClick={onClose}
            className="p-1 bg-white hover:bg-red-500 hover:text-white border-2 border-black shadow-[2px_2px_0px_#000] transition-colors cursor-pointer"
          >
            <X className="w-4 h-4 stroke-[3]" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto space-y-4">
          <p className="text-xs font-bold text-slate-600">
            Print ready barcode tags for items received in this purchase order ({barcodeModalLift.store}):
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {(barcodeModalLift.items && barcodeModalLift.items.length > 0
              ? barcodeModalLift.items
              : [
                  {
                    id: "b-1",
                    productName: barcodeModalLift.vendor,
                    code: barcodeModalLift.purchaseNo,
                    rate: barcodeModalLift.costAmount,
                    quantity: 1,
                    amount: barcodeModalLift.costAmount,
                    category: "Lifting",
                  },
                ]
            ).map((item) => (
              <div
                key={item.id}
                className="p-3 border-2 border-black bg-white shadow-[2px_2px_0px_#000] flex flex-col items-center text-center space-y-1.5"
              >
                <div className="text-[10px] font-black uppercase text-slate-700 tracking-wider">
                  {barcodeModalLift.store || "SHOMPORKO"}
                </div>
                <div className="text-xs font-black text-black truncate w-full">
                  {item.productName}
                </div>
                {/* Visual Barcode Graphic representation */}
                <div className="w-full flex items-center justify-center py-1">
                  <div className="font-mono text-2xl tracking-[6px] text-black select-none font-bold">
                    ||| | |||| | ||| |
                  </div>
                </div>
                <div className="font-mono text-xs font-black text-slate-900">
                  {item.code}
                </div>
                <div className="text-xs font-black text-indigo-700">
                  ৳ {item.rate.toFixed(2)}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="p-4 border-t-4 border-black bg-slate-100 flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-white text-black font-display font-black text-xs uppercase border-2 border-black shadow-[2px_2px_0px_#000] cursor-pointer"
          >
            Close
          </button>
          <button
            type="button"
            onClick={() => window.print()}
            className="px-5 py-2 bg-sky-400 hover:bg-sky-300 text-black font-display font-black text-xs uppercase border-2 border-black shadow-[3px_3px_0px_#000] flex items-center gap-1.5 cursor-pointer"
          >
            <Printer className="w-4 h-4 stroke-[2.5]" /> Print Labels
          </button>
        </div>
      </div>
    </div>
  );
};
