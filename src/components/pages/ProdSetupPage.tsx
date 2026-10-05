import React from 'react';
import { Bold, Italic, Underline, Strikethrough, Superscript, Subscript } from 'lucide-react';

interface Props {
  showToast: (msg: string, type: 'success'|'error') => void;
}

export const ProdSetupPage: React.FC<Props> = ({ showToast }) => {
  const inputClasses = "w-full bg-[#111827] text-white text-sm px-3 py-2 border border-slate-600 rounded focus:outline-none focus:border-[#20B2AA]";
  const selectClasses = "w-full bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-sm px-3 py-2 border-none rounded focus:outline-none focus:ring-2 focus:ring-[#20B2AA]";
  const labelClasses = "text-xs font-bold text-white block mb-1";

  return (
    <div className="w-full mx-auto pb-20 p-4 bg-[#111827] min-h-screen text-slate-300">
      
      <div className="bg-[#1F2937] rounded-lg shadow-sm border border-slate-700/50 w-full flex flex-col">
        
        {/* Header */}
        <div className="px-6 py-4 flex items-center justify-between border-b border-slate-700/50 bg-[#1F2937] rounded-t-lg">
          <h2 className="text-[15px] font-bold text-white uppercase tracking-wider">
            UPDATE PRODUCT
          </h2>
          <div className="flex gap-2">
            <button type="button" className="px-4 py-1.5 text-xs font-bold text-white bg-[#20B2AA] rounded hover:bg-[#1A9C96]">
              GO BACK
            </button>
            <button type="button" className="px-4 py-1.5 text-xs font-bold text-white bg-[#20B2AA] rounded hover:bg-[#1A9C96]">
              UPDATE
            </button>
          </div>
        </div>

        <div className="p-6">
          <form className="space-y-6">
            
            {/* Top Grid */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div>
                <label className={labelClasses}>Product Name <span className="text-rose-500">*</span></label>
                <input type="text" className={inputClasses} defaultValue="Hot water bag" />
              </div>
              <div>
                <label className={labelClasses}>Barcode <span className="text-rose-500">*</span></label>
                <input type="text" className={inputClasses} defaultValue="2233" />
              </div>
              <div>
                <label className={labelClasses}>Parent Category <span className="text-rose-500">*</span></label>
                <select className={selectClasses}>
                  <option>Cleaning Supplies</option>
                </select>
              </div>
              <div>
                <label className={labelClasses}>Child Category</label>
                <select className={selectClasses}>
                  <option>Choose..</option>
                </select>
              </div>

              <div>
                <label className={labelClasses}>Product thumbnail <span className="text-rose-500">(600x600)</span></label>
                <div className="flex items-center gap-2">
                  <input type="file" className="hidden" id="thumb" />
                  <label htmlFor="thumb" className="px-3 py-1.5 bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-semibold rounded cursor-pointer">Choose File</label>
                  <span className="text-xs text-slate-400">No file chosen</span>
                </div>
                <div className="mt-2 w-16 h-16 bg-slate-800 rounded border border-slate-600 overflow-hidden">
                  {/* placeholder image */}
                  <img src="https://via.placeholder.com/64" alt="thumb" className="w-full h-full object-cover opacity-50" />
                </div>
              </div>

              <div>
                <label className={labelClasses}>Other Images <span className="text-rose-500">(600x600)</span></label>
                <div className="flex items-center gap-2">
                  <input type="file" className="hidden" id="other" multiple />
                  <label htmlFor="other" className="px-3 py-1.5 bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-semibold rounded cursor-pointer">Choose Files</label>
                  <span className="text-xs text-slate-400">No file chosen</span>
                </div>
                <div className="mt-2 w-16 h-16 bg-slate-800 rounded border border-slate-600 overflow-hidden">
                  <img src="https://via.placeholder.com/64" alt="other" className="w-full h-full object-cover opacity-50" />
                </div>
              </div>

              <div>
                <label className={labelClasses}>Reorder Level</label>
                <input type="text" className={`${inputClasses} opacity-50`} placeholder="Reorder Level" />
              </div>

              <div>
                <label className={labelClasses}>UOM <span className="text-rose-500">*</span></label>
                <select className={selectClasses}>
                  <option>Pcs</option>
                </select>
              </div>
            </div>

            {/* Price Table */}
            <div className="bg-[#20B2AA] rounded-md overflow-hidden shadow-sm mt-6 border border-[#1A9C96]">
              <table className="w-full text-left text-sm text-white">
                <thead>
                  <tr className="border-b border-[#1A9C96]/50">
                    <th className="px-4 py-2 font-semibold">Purchase Price</th>
                    <th className="px-4 py-2 font-semibold">Client Price</th>
                    <th className="px-4 py-2 font-semibold">Retail Price</th>
                    <th className="px-4 py-2 font-semibold">Discount Percentage</th>
                    <th className="px-4 py-2 font-semibold">Discount Amount</th>
                  </tr>
                </thead>
                <tbody className="bg-[#1F2937]">
                  <tr>
                    <td className="px-4 py-4">
                      <input type="text" className={inputClasses} defaultValue="150.00" />
                    </td>
                    <td className="px-4 py-4">
                      <input type="text" className={inputClasses} defaultValue="8680.00" />
                    </td>
                    <td className="px-4 py-4">
                      <input type="text" className={inputClasses} defaultValue="29960.00" />
                    </td>
                    <td className="px-4 py-4">
                      <input type="text" className={inputClasses} defaultValue="0.00" />
                    </td>
                    <td className="px-4 py-4">
                      <input type="text" className={inputClasses} defaultValue="0.00" />
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Editors */}
            <div className="space-y-4 pt-4">
              <div>
                <label className={labelClasses}>Short Description</label>
                <div className="border border-slate-600 rounded bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 overflow-hidden">
                  <div className="flex items-center gap-1 p-2 border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950">
                    <button type="button" className="p-1 hover:bg-slate-200 dark:bg-slate-700 rounded"><Bold className="w-4 h-4" /></button>
                    <button type="button" className="p-1 hover:bg-slate-200 dark:bg-slate-700 rounded"><Italic className="w-4 h-4" /></button>
                    <button type="button" className="p-1 hover:bg-slate-200 dark:bg-slate-700 rounded"><Underline className="w-4 h-4" /></button>
                    <div className="w-px h-4 bg-slate-300 mx-1"></div>
                    <button type="button" className="p-1 hover:bg-slate-200 dark:bg-slate-700 rounded"><Strikethrough className="w-4 h-4" /></button>
                    <button type="button" className="p-1 hover:bg-slate-200 dark:bg-slate-700 rounded"><Superscript className="w-4 h-4" /></button>
                    <button type="button" className="p-1 hover:bg-slate-200 dark:bg-slate-700 rounded"><Subscript className="w-4 h-4" /></button>
                  </div>
                  <textarea className="w-full p-3 h-24 focus:outline-none text-sm resize-none" defaultValue="Summary"></textarea>
                </div>
              </div>

              <div>
                <label className={labelClasses}>Long Description</label>
                <div className="border border-slate-600 rounded bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 overflow-hidden">
                  <div className="flex items-center gap-1 p-2 border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 flex-wrap">
                    <button type="button" className="p-1 hover:bg-slate-200 dark:bg-slate-700 rounded"><Bold className="w-4 h-4" /></button>
                    <button type="button" className="p-1 hover:bg-slate-200 dark:bg-slate-700 rounded"><Italic className="w-4 h-4" /></button>
                    <button type="button" className="p-1 hover:bg-slate-200 dark:bg-slate-700 rounded"><Underline className="w-4 h-4" /></button>
                    <div className="w-px h-4 bg-slate-300 mx-1"></div>
                    <button type="button" className="p-1 hover:bg-slate-200 dark:bg-slate-700 rounded text-xs font-bold px-2">A</button>
                    <div className="w-px h-4 bg-slate-300 mx-1"></div>
                    <select className="text-xs bg-transparent border-none focus:outline-none"><option>13</option></select>
                  </div>
                  <textarea className="w-full p-3 h-48 focus:outline-none text-sm resize-none" placeholder="Write here.."></textarea>
                </div>
              </div>
            </div>

            {/* SEO Section */}
            <div className="space-y-4 pt-4">
              <div>
                <label className={labelClasses}>SEO Title</label>
                <input type="text" className={inputClasses} placeholder="SEO Title" />
              </div>
              <div>
                <label className={labelClasses}>SEO Keyword</label>
                <textarea className={inputClasses} rows={3} placeholder="SEO Keyword"></textarea>
              </div>
              <div>
                <label className={labelClasses}>SEO Description</label>
                <textarea className={inputClasses} rows={3} placeholder="SEO Description"></textarea>
              </div>
            </div>

          </form>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 flex justify-end border-t border-slate-700/50 bg-[#1F2937] rounded-b-lg">
          <button type="button" className="px-6 py-2 text-sm font-bold text-white bg-[#20B2AA] rounded hover:bg-[#1A9C96]">
            UPDATE
          </button>
        </div>
      </div>
    </div>
  );
};
