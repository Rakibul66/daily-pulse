"use client";

import React from "react";
import { Trash2 } from "lucide-react";
import { CateringVendor, CateringPayment } from "@/types/catering";

interface BillingStats {
  totalMeals: number;
  totalCost: number;
  totalPaid: number;
  due: number;
}

interface CateringBillingTabProps {
  vendors: CateringVendor[];
  getBillingStats: (vendorId: string) => BillingStats;
  onOpenPaymentModal: () => void;
  paginatedPayments: CateringPayment[];
  filteredPayments: CateringPayment[];
  paymentPage: number;
  setPaymentPage: React.Dispatch<React.SetStateAction<number>>;
  totalPaymentPages: number;
  itemsPerPage: number;
  onDeletePayment: (id: string) => void;
}

export const CateringBillingTab: React.FC<CateringBillingTabProps> = ({
  vendors,
  getBillingStats,
  onOpenPaymentModal,
  paginatedPayments,
  filteredPayments,
  paymentPage,
  setPaymentPage,
  totalPaymentPages,
  itemsPerPage,
  onDeletePayment
}) => {
  return (
    <div className="space-y-8">
      {/* Vendor Billing Summary Cards */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {vendors.map(v => {
          const stats = getBillingStats(v.id);
          return (
            <div key={v.id} className="p-5 border-3 border-black bg-white shadow-[4px_4px_0px_#000]">
              <div className="flex justify-between items-start mb-4 border-b-2 border-black pb-3">
                <div>
                  <h4 className="font-black text-black text-base uppercase">{v.name}</h4>
                  <span className="text-[10px] font-bold text-slate-500 uppercase">
                    Default: ৳{v.perMealRate} / meal
                  </span>
                </div>
                <span className="text-[10px] font-black uppercase px-2 py-0.5 bg-amber-300 border border-black text-black">
                  {v.billingFrequency}
                </span>
              </div>
              <div className="space-y-2.5 text-xs font-bold">
                <div className="flex justify-between text-slate-700">
                  <span>Period Meals Logged</span> 
                  <span className="font-display font-black text-black">{stats.totalMeals} meals</span>
                </div>
                <div className="flex justify-between text-slate-700">
                  <span>Period Meal Cost</span> 
                  <span className="font-display font-black text-indigo-700 text-sm">৳ {stats.totalCost.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-emerald-800 border-t border-black/10 pt-2">
                  <span>Settled Payments</span> 
                  <span className="font-display font-black text-emerald-800 text-sm">৳ {stats.totalPaid.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center text-black font-black bg-amber-100 p-2.5 border-2 border-black mt-2">
                  <span className="uppercase text-[11px]">Outstanding Due</span> 
                  <span className="font-display text-base text-rose-700">৳ {stats.due.toLocaleString()}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Payment History */}
      <div>
        <div className="flex items-center justify-between pb-3 mb-4 border-b-2 border-black">
          <h3 className="font-display font-black text-base uppercase tracking-tight text-black">
            PAYMENT DISBURSEMENTS
          </h3>
          <button 
            onClick={onOpenPaymentModal}
            className="px-3.5 py-1.5 bg-emerald-500 hover:bg-emerald-600 text-black border-2 border-black shadow-[2px_2px_0px_#000] text-xs font-black uppercase cursor-pointer"
          >
            + RECORD PAYMENT
          </button>
        </div>

        <div className="overflow-x-auto border-3 border-black bg-white shadow-[4px_4px_0px_#000]">
          <table className="w-full text-left text-xs text-black">
            <thead className="bg-amber-300 border-b-2 border-black text-[10px] font-black uppercase tracking-wider">
              <tr>
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3">Vendor</th>
                <th className="px-4 py-3 text-right">Amount Paid</th>
                <th className="px-4 py-3 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y-2 border-black/10 font-bold">
              {paginatedPayments.map(p => (
                <tr key={p.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-4 py-3 font-mono font-bold text-black">{p.date}</td>
                  <td className="px-4 py-3 font-black text-black">{vendors.find(v => v.id === p.vendorId)?.name || 'Unknown'}</td>
                  <td className="px-4 py-3 text-right font-display font-black text-emerald-800 text-sm">
                    ৳ {p.amount.toLocaleString()}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <button 
                      onClick={() => onDeletePayment(p.id)} 
                      className="p-1 text-rose-700 hover:text-black hover:bg-rose-200 border border-transparent hover:border-black transition-all cursor-pointer"
                      title="Delete Payment"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
              {filteredPayments.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-4 py-8 text-center text-slate-500 font-bold uppercase">
                    No payment records found for this period.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {filteredPayments.length > 0 && (
          <div className="flex items-center justify-between mt-4 px-1">
            <span className="text-xs font-bold text-slate-600">
              Showing {Math.min(paymentPage * itemsPerPage, filteredPayments.length)} of {filteredPayments.length} payments
            </span>
            <div className="flex items-center gap-1.5">
              <button 
                disabled={paymentPage === 1} 
                onClick={() => setPaymentPage(p => p - 1)} 
                className="px-2.5 py-1 bg-white border-2 border-black text-black font-black text-xs disabled:opacity-40 shadow-[1px_1px_0px_#000] cursor-pointer"
              >
                PREV
              </button>
              <span className="text-xs font-black text-black px-2">Page {paymentPage} of {totalPaymentPages}</span>
              <button 
                disabled={paymentPage === totalPaymentPages} 
                onClick={() => setPaymentPage(p => p + 1)} 
                className="px-2.5 py-1 bg-white border-2 border-black text-black font-black text-xs disabled:opacity-40 shadow-[1px_1px_0px_#000] cursor-pointer"
              >
                NEXT
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
