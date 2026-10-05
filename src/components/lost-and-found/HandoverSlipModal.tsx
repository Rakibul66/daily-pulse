import React from 'react';
import { LostItem } from '@/types/lostAndFound';
import { X, Printer } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  item: LostItem | null;
}

export const HandoverSlipModal: React.FC<Props> = ({ isOpen, onClose, item }) => {
  if (!isOpen || !item) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 print:bg-white dark:bg-slate-900 print:p-0">
      <div className="bg-white dark:bg-slate-900 rounded-xl shadow-xl w-full max-w-lg flex flex-col animate-in zoom-in-95 duration-200 print:shadow-none print:w-full print:max-w-none">
        
        {/* Header - hide on print */}
        <div className="px-6 py-4 flex items-center justify-between border-b border-slate-100 dark:border-slate-800/50 print:hidden">
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">Verified Handover Slip</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-mono mt-0.5">REF #{item.refNumber}</p>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 dark:text-slate-400 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Printable Area */}
        <div className="p-8 space-y-6">
          <div className="hidden print:block mb-8 text-center border-b pb-4">
            <h1 className="text-2xl font-bold text-black">Verified Handover Slip</h1>
            <p className="text-sm text-gray-500 font-mono mt-1">REF #{item.refNumber}</p>
          </div>

          <div className="border border-slate-200 dark:border-slate-700 rounded-lg p-6 space-y-4">
            <div className="flex justify-between items-start">
              <span className="text-sm font-medium text-slate-500 dark:text-slate-400">Property Description:</span>
              <span className="text-base font-bold text-slate-900 dark:text-white text-right">{item.itemName}</span>
            </div>
            <div className="flex justify-between items-start">
              <span className="text-sm font-medium text-slate-500 dark:text-slate-400">Category:</span>
              <span className="text-sm font-medium text-slate-900 dark:text-white text-right uppercase tracking-wider">{item.category}</span>
            </div>
            <div className="flex justify-between items-start">
              <span className="text-sm font-medium text-slate-500 dark:text-slate-400">Found Date:</span>
              <span className="text-sm font-medium text-slate-900 dark:text-white text-right">{new Date(item.dateFound).toLocaleDateString()}</span>
            </div>
            <div className="flex justify-between items-start">
              <span className="text-sm font-medium text-slate-500 dark:text-slate-400">Claimant Verified:</span>
              <span className="text-base font-bold text-emerald-700 text-right">{item.claimantName} ({item.claimantPhone})</span>
            </div>
            <div className="flex justify-between items-start">
              <span className="text-sm font-medium text-slate-500 dark:text-slate-400">Released From:</span>
              <span className="text-sm font-medium text-slate-900 dark:text-white text-right font-mono">{item.storageNote || 'Main Storage'}</span>
            </div>
          </div>

          <div className="pt-12 flex justify-between items-end border-t border-dashed border-slate-200 dark:border-slate-700 mt-8">
            <div className="w-40 border-t border-slate-300 dark:border-slate-600 text-center pt-2">
              <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Guest Signature</span>
            </div>
            <div className="w-40 border-t border-slate-300 dark:border-slate-600 text-center pt-2">
              <span className="text-xs font-medium text-slate-500 dark:text-slate-400"><span className="bg-blue-100 text-blue-800 px-1 rounded">Duty</span> Manager</span>
            </div>
          </div>
        </div>

        {/* Footer - hide on print */}
        <div className="px-6 py-4 border-t border-slate-100 dark:border-slate-800/50 flex justify-end gap-3 rounded-b-xl print:hidden">
          <button type="button" onClick={onClose} className="px-5 py-2.5 text-sm font-semibold text-slate-600 dark:text-slate-400 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-md hover:bg-slate-50 dark:bg-slate-950 transition-colors">
            Close
          </button>
          <button type="button" onClick={handlePrint} className="px-5 py-2.5 text-sm font-bold text-white bg-slate-900 rounded-md hover:bg-slate-800 transition-colors shadow-md flex items-center gap-2">
            <Printer className="w-4 h-4" /> Print Slip
          </button>
        </div>
      </div>
    </div>
  );
};
