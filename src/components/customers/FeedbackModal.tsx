import React, { useState } from 'react';
import { CustomerFeedback } from '@/types/customer';
import { X, Star } from 'lucide-react';

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
    setIsSubmitting(true);
    try {
      await onSave({
        userId,
        customerName,
        customerPhone,
        ratings: { overall, food, service, ambience },
        comment
      });
      // reset form
      setCustomerName('');
      setCustomerPhone('');
      setOverall(5);
      setFood(5);
      setService(5);
      setAmbience(5);
      setComment('');
      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const ratingOptions = [5, 4, 3, 2, 1];

  const inputClasses = "w-full text-sm text-slate-800 bg-white px-3 py-2 rounded-md border border-slate-300 focus:border-slate-500 focus:ring-1 focus:ring-slate-500 placeholder-slate-400";
  const labelClasses = "text-sm font-semibold text-slate-800 block mb-1.5";

  // Using a lighter theme for this specific modal to match the user's screenshot exactly
  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl flex flex-col animate-in zoom-in-95 duration-200">
        <div className="px-6 py-4 flex items-center justify-between border-b border-slate-100">
          <h2 className="text-lg font-bold text-slate-800">Log Guest Feedback</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6">
          <form id="feedback-form" onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className={labelClasses}>Customer Name *</label>
                <input type="text" value={customerName} onChange={(e) => setCustomerName(e.target.value)} className={inputClasses} placeholder="e.g. Tanvir Ahmed" required />
              </div>
              <div>
                <label className={labelClasses}>Customer Phone</label>
                <input type="tel" value={customerPhone} onChange={(e) => setCustomerPhone(e.target.value)} className={inputClasses} placeholder="017XXXXXXXX" />
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
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
              <label className={labelClasses}>Review Comment *</label>
              <textarea value={comment} onChange={(e) => setComment(e.target.value)} rows={4} className={`${inputClasses} resize-none`} placeholder="What did the customer say about their dining experience?" required></textarea>
            </div>
          </form>
        </div>

        <div className="px-6 py-5 border-t border-slate-100 flex justify-end gap-3 rounded-b-xl">
          <button type="button" onClick={onClose} className="px-5 py-2 text-sm font-semibold text-slate-700 bg-white border border-slate-300 rounded-md hover:bg-slate-50 transition-colors">
            Cancel
          </button>
          <button type="submit" form="feedback-form" disabled={isSubmitting} className="px-5 py-2 text-sm font-semibold text-white bg-slate-900 rounded-md hover:bg-slate-800 disabled:opacity-50 transition-colors">
            {isSubmitting ? 'Saving...' : 'Save Review'}
          </button>
        </div>
      </div>
    </div>
  );
};
