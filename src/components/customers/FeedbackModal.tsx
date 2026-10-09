import React, { useState } from 'react';
import { CustomerFeedback } from '@/types/customer';
import { X, MessageSquareQuote, Check, Loader2 } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSave: (feedback: Omit<CustomerFeedback, 'id' | 'createdAt'>) => Promise<void>;
  userId: string;
}

export const FeedbackModal: React.FC<Props> = ({ isOpen, onClose, onSave, userId }) => {
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [overall, setOverall] = useState(5);
  const [food, setFood] = useState(5);
  const [service, setService] = useState(5);
  const [ambience, setAmbience] = useState(5);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName.trim() || !comment.trim()) return;

    setIsSubmitting(true);
    try {
      await onSave({
        userId,
        customerName: customerName.trim(),
        customerPhone: customerPhone.trim(),
        ratings: {
          overall,
          food,
          service,
          ambience,
        },
        comment: comment.trim(),
      });
      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const ratingOptions = [5, 4, 3, 2, 1];

  const inputClasses = "w-full text-xs sm:text-sm font-bold text-black bg-white px-3.5 py-2.5 border-2 border-black shadow-[2px_2px_0px_#000] focus:outline-none focus:bg-[#fffdf0] focus:border-indigo-600 rounded-none transition-all placeholder:text-slate-400";
  const labelClasses = "text-xs font-black uppercase tracking-wider text-black block mb-1.5";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 md:p-8 pt-8 sm:pt-14 pb-8 sm:pb-14 bg-black/70 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-2xl max-h-[85vh] bg-white border-4 border-black shadow-[8px_8px_0px_#000] sm:shadow-[12px_12px_0px_#000] my-auto flex flex-col overflow-hidden text-black animate-in fade-in zoom-in-95 duration-200">
        
        {/* Top Accent Strip */}
        <div className="h-2.5 bg-gradient-to-r from-amber-400 via-indigo-600 to-emerald-500 border-b-2 border-black shrink-0" />

        {/* Modal Header */}
        <div className="px-5 sm:px-6 py-4 border-b-3 border-black bg-white flex items-center justify-between gap-4 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 bg-amber-300 border-2 sm:border-3 border-black shadow-[2px_2px_0px_#000] flex items-center justify-center text-black shrink-0">
              <MessageSquareQuote className="w-6 h-6 stroke-[2.5]" />
            </div>
            <div>
              <h2 className="font-display font-black text-lg sm:text-xl uppercase tracking-tight text-black leading-tight">
                Log Guest Feedback
              </h2>
              <p className="text-[11px] font-bold text-slate-600 uppercase tracking-wide">
                Save customer dining reviews and star ratings
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            type="button"
            className="p-1.5 bg-white hover:bg-red-600 hover:text-white border-2 border-black shadow-[2px_2px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 transition-all cursor-pointer"
            aria-label="Close Modal"
          >
            <X className="w-5 h-5 stroke-[2.5]" />
          </button>
        </div>

        {/* Form Body */}
        <div className="p-5 sm:p-6 overflow-y-auto flex-1 custom-scrollbar">
          <form id="feedback-form" onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className={labelClasses}>
                  Customer Name <span className="text-red-600">*</span>
                </label>
                <input
                  type="text"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className={inputClasses}
                  placeholder="e.g. Tanvir Ahmed"
                  required
                />
              </div>
              <div>
                <label className={labelClasses}>Customer Phone</label>
                <input
                  type="tel"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  className={inputClasses}
                  placeholder="017XXXXXXXX"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div>
                <label className={labelClasses}>Overall</label>
                <select value={overall} onChange={(e) => setOverall(Number(e.target.value))} className={inputClasses}>
                  {ratingOptions.map(num => <option key={num} value={num}>{num} ★</option>)}
                </select>
              </div>
              <div>
                <label className={labelClasses}>Food</label>
                <select value={food} onChange={(e) => setFood(Number(e.target.value))} className={inputClasses}>
                  {ratingOptions.map(num => <option key={num} value={num}>{num} ★</option>)}
                </select>
              </div>
              <div>
                <label className={labelClasses}>Service</label>
                <select value={service} onChange={(e) => setService(Number(e.target.value))} className={inputClasses}>
                  {ratingOptions.map(num => <option key={num} value={num}>{num} ★</option>)}
                </select>
              </div>
              <div>
                <label className={labelClasses}>Ambience</label>
                <select value={ambience} onChange={(e) => setAmbience(Number(e.target.value))} className={inputClasses}>
                  {ratingOptions.map(num => <option key={num} value={num}>{num} ★</option>)}
                </select>
              </div>
            </div>

            <div>
              <label className={labelClasses}>
                Review Comment <span className="text-red-600">*</span>
              </label>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                rows={4}
                className={`${inputClasses} resize-none`}
                placeholder="What did the customer say about their dining experience?"
                required
              />
            </div>
          </form>
        </div>

        {/* Modal Footer */}
        <div className="px-5 sm:px-6 py-4 border-t-3 border-black bg-white flex items-center justify-end gap-3 shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 bg-white hover:bg-slate-100 border-2 border-black font-black text-xs uppercase tracking-wider text-black shadow-[2px_2px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 transition-all cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="submit"
            form="feedback-form"
            disabled={isSubmitting}
            className="px-6 py-2.5 bg-emerald-400 hover:bg-emerald-300 border-2 sm:border-3 border-black font-black text-xs sm:text-sm uppercase tracking-wider text-black shadow-[3px_3px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 transition-all flex items-center gap-2 disabled:opacity-50 cursor-pointer"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-black" />
                <span>Saving...</span>
              </>
            ) : (
              <>
                <Check className="w-4 h-4 stroke-[3]" />
                <span>Save Review</span>
              </>
            )}
          </button>
        </div>

      </div>
    </div>
  );
};
