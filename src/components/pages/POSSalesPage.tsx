import React, { useState } from 'react';
import { Trash2 } from 'lucide-react';

interface Props {
  showToast: (msg: string, type: 'success'|'error') => void;
}

export const POSSalesPage: React.FC<Props> = ({ showToast }) => {
  const [print, setPrint] = useState(true);
  const [method, setMethod] = useState<'barcode' | 'manual'>('barcode');
  const [discountType, setDiscountType] = useState<'fix' | 'percent'>('fix');

  // We are creating just the form layout from the image. 
  // Normally this would have full state like SalesInvoiceFormModal, but keeping it simple for the layout match.

  const inputClasses = "w-full text-sm font-medium text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-900 px-3 py-2 border border-slate-300 dark:border-slate-600 rounded focus:border-[#20B2AA] outline-none";
  const labelClasses = "text-xs font-bold text-slate-800 dark:text-slate-200 block mb-1";

  return (
    <div className="w-full mx-auto pb-20 p-4">
      
      <div className="bg-white dark:bg-slate-900 rounded border border-slate-200 dark:border-slate-700 shadow-sm w-full flex flex-col">
        
        {/* Header */}
        <div className="px-6 py-4 flex items-center justify-between border-b border-slate-100 dark:border-slate-800/50 bg-[#F4F9F9] rounded-t">
          <h2 className="text-lg font-normal text-slate-600 dark:text-slate-400 uppercase tracking-widest">
            ADD NEW SALES
          </h2>
          <div className="flex items-center gap-4">
            <label className="flex items-center gap-1 text-sm font-semibold text-slate-700 dark:text-slate-300 cursor-pointer">
              <input type="checkbox" checked={print} onChange={(e) => setPrint(e.target.checked)} className="accent-blue-600 w-4 h-4" />
              Print
            </label>
            <label className="flex items-center gap-1 text-sm font-semibold text-slate-700 dark:text-slate-300 cursor-pointer">
              <input type="radio" name="salesMethod" checked={method === 'barcode'} onChange={() => setMethod('barcode')} className="accent-blue-600 w-4 h-4" />
              By Barcode
            </label>
            <label className="flex items-center gap-1 text-sm font-semibold text-slate-700 dark:text-slate-300 cursor-pointer">
              <input type="radio" name="salesMethod" checked={method === 'manual'} onChange={() => setMethod('manual')} className="accent-blue-600 w-4 h-4" />
              By Manual
            </label>
            
            <button type="button" className="px-4 py-1.5 text-xs font-bold text-white bg-[#20B2AA] rounded hover:bg-[#1A9C96] ml-2">
              NEW CART
            </button>
            <button type="button" className="px-4 py-1.5 text-xs font-bold text-white bg-[#20B2AA] rounded hover:bg-[#1A9C96]">
              GO BACK
            </button>
            <button type="button" className="px-4 py-1.5 text-xs font-bold text-white bg-[#20B2AA] rounded hover:bg-[#1A9C96]">
              SAVE
            </button>
          </div>
        </div>

        <div className="p-6">
          <form className="space-y-6">
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div>
                <label className={labelClasses}>Scan Barcode</label>
                <input type="text" className={`${inputClasses} border-[#20B2AA] ring-1 ring-[#20B2AA]/30`} placeholder="Barcode" />
              </div>

              <div>
                <label className={labelClasses}>Client Phone</label>
                <input type="text" className={inputClasses} placeholder="017XXXXXXXXX" />
              </div>

              <div>
                <label className={labelClasses}>Client Name</label>
                <input type="text" className={inputClasses} placeholder="Client Name" />
              </div>

              <div>
                <label className={labelClasses}>Cash Head <span className="text-rose-500">*</span></label>
                <select className={inputClasses} required>
                  <option>Cash at Hand - 1010201</option>
                </select>
              </div>
            </div>

            {/* Table & Summary section (Teal background) */}
            <div className="bg-[#20B2AA] rounded-md overflow-hidden mt-6 shadow-sm border border-[#1A9C96]">
              <table className="w-full text-left text-sm text-white">
                <thead>
                  <tr className="border-b border-[#1A9C96]/50">
                    <th className="px-4 py-2 font-semibold w-12">SL#</th>
                    <th className="px-4 py-2 font-semibold">name</th>
                    <th className="px-4 py-2 font-semibold">Rate</th>
                    <th className="px-4 py-2 font-semibold">Discount</th>
                    <th className="px-4 py-2 font-semibold">Qty</th>
                    <th className="px-4 py-2 font-semibold">UOM</th>
                    <th className="px-4 py-2 font-semibold">Available Stock</th>
                    <th className="px-4 py-2 font-semibold">Amount</th>
                    <th className="px-4 py-2 font-semibold text-center w-12"><Trash2 className="w-4 h-4 text-white/50 inline" /></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#1A9C96]/50">
                  
                  {/* Empty state or items would go here. Matching image which is empty but has the summary layout */}
                  <tr className="h-24">
                    <td colSpan={9} className="px-4 py-8"></td>
                  </tr>

                  {/* Summary Block row */}
                  <tr className="bg-[#20B2AA]">
                    <td colSpan={4} className="px-4 py-4 align-top">
                      <div className="flex items-center gap-4 text-sm font-semibold mt-4">
                        <label className="flex items-center gap-1.5 cursor-pointer">
                          <input 
                            type="radio" 
                            name="discountTypePOS" 
                            checked={discountType === 'fix'} 
                            onChange={() => setDiscountType('fix')}
                            className="accent-blue-600 w-4 h-4"
                          />
                          Fix Discount
                        </label>
                        <label className="flex items-center gap-1.5 cursor-pointer">
                          <input 
                            type="radio" 
                            name="discountTypePOS" 
                            checked={discountType === 'percent'} 
                            onChange={() => setDiscountType('percent')}
                            className="accent-blue-600 w-4 h-4"
                          />
                          Discount (%)
                        </label>
                      </div>
                    </td>
                    <td colSpan={5} className="px-4 py-4 bg-[#1ca199]">
                      <div className="flex flex-col gap-2 ml-auto w-64 text-sm font-bold">
                        <div className="flex items-center justify-between">
                          <span>Total</span>
                          <div className="flex items-center gap-2">
                            <input type="text" readOnly value="0" className="w-32 px-2 py-1 text-slate-800 dark:text-slate-200 bg-white dark:bg-slate-900 rounded border-none outline-none text-right" />
                            <span>TK.</span>
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <span>Discount</span>
                          <div className="flex items-center gap-2">
                            <input type="number" min="0" step="any" value="0" readOnly className="w-32 px-2 py-1 text-slate-800 dark:text-slate-200 bg-white dark:bg-slate-900 rounded border-none outline-none text-right" />
                            <span>TK.</span>
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <span>Net Payable</span>
                          <div className="flex items-center gap-2">
                            <input type="text" readOnly value="0" className="w-32 px-2 py-1 text-slate-800 dark:text-slate-200 bg-white dark:bg-slate-900 rounded border-none outline-none text-right" />
                            <span>TK.</span>
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <span>Cash Paid</span>
                          <div className="flex items-center gap-2">
                            <input type="text" value="0" readOnly className="w-32 px-2 py-1 text-slate-800 dark:text-slate-200 bg-white dark:bg-slate-900 rounded border-none outline-none text-right" />
                            <span>TK.</span>
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <span>Change Amount</span>
                          <div className="flex items-center gap-2">
                            <input type="text" readOnly value="0" className="w-32 px-2 py-1 text-slate-800 dark:text-slate-200 bg-white dark:bg-slate-900 rounded border-none outline-none text-right" />
                            <span>TK.</span>
                          </div>
                        </div>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

          </form>
        </div>

        {/* Bottom Footer */}
        <div className="px-6 py-4 flex justify-end bg-white dark:bg-slate-900 rounded-b-xl border-t border-slate-100 dark:border-slate-800/50">
          <button type="button" className="px-6 py-2 text-sm font-bold text-white bg-[#20B2AA] rounded hover:bg-[#1A9C96] shadow-md">
            SAVE
          </button>
        </div>
      </div>
    </div>
  );
};
