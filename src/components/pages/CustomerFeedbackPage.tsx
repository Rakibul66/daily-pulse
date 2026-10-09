import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { CustomerFeedback } from '@/types/customer';
import { getCustomerFeedback, addCustomerFeedback, deleteCustomerFeedback } from '@/lib/customerStorage';
import { FeedbackModal } from '../customers/FeedbackModal';
import { Plus, MessageSquareQuote, Star, Trash2, Loader2, Quote } from 'lucide-react';

interface Props {
  showToast: (msg: string, type: 'success' | 'error') => void;
}

export const CustomerFeedbackPage: React.FC<Props> = ({ showToast }) => {
  const { user, userProfile } = useAuth();
  const [feedbacks, setFeedbacks] = useState<CustomerFeedback[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (user) loadData();
  }, [user, userProfile]);

  const loadData = async () => {
    if (!user) return;
    setIsLoading(true);
    try {
      const data = await getCustomerFeedback(user.uid);
      setFeedbacks(data);
    } catch (err) {
      console.error(err);
      showToast('Failed to load feedback', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async (feedbackData: Omit<CustomerFeedback, 'id' | 'createdAt'>) => {
    try {
      await addCustomerFeedback(feedbackData);
      showToast('Review saved successfully', 'success');
      loadData();
    } catch (err) {
      console.error(err);
      showToast('Error saving review', 'error');
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Delete this review permanently?')) return;
    try {
      await deleteCustomerFeedback(id);
      showToast('Review deleted', 'success');
      loadData();
    } catch (err) {
      console.error(err);
      showToast('Error deleting review', 'error');
    }
  };

  const calculateAvg = (key: keyof CustomerFeedback['ratings']) => {
    if (feedbacks.length === 0) return '0.0';
    const sum = feedbacks.reduce((acc, curr) => acc + curr.ratings[key], 0);
    return (sum / feedbacks.length).toFixed(1);
  };

  const avgOverall = calculateAvg('overall');
  const avgFood = calculateAvg('food');
  const avgService = calculateAvg('service');
  const avgAmbience = calculateAvg('ambience');

  return (
    <div className="w-full mx-auto space-y-6 pb-20">
      
      {/* Top Banner Card */}
      <div className="bg-white p-4 sm:p-5 border-2 sm:border-4 border-black shadow-[6px_6px_0px_#000] flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-2.5">
            <span className="w-3 h-3 bg-amber-400 border border-black inline-block"></span>
            <h2 className="text-lg font-black uppercase text-black tracking-wider">Guest Feedback</h2>
            <span className="px-2 py-0.5 bg-amber-100 border border-black text-black text-xs font-black">
              {feedbacks.length} REVIEWS
            </span>
          </div>
          <p className="text-xs font-bold text-slate-600 uppercase mt-1">
            Log, track, and monitor customer reviews and ratings.
          </p>
        </div>

        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-emerald-400 hover:bg-emerald-300 text-black border-2 border-black text-xs font-black uppercase shadow-[2px_2px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4 stroke-[3]" /> Log Feedback
        </button>
      </div>

      {/* Average Metrics Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Overall Rating', val: avgOverall },
          { label: 'Food Quality', val: avgFood },
          { label: 'Staff Service', val: avgService },
          { label: 'Ambience', val: avgAmbience },
        ].map(metric => (
          <div key={metric.label} className="bg-white border-2 sm:border-4 border-black p-4 flex flex-col items-center justify-center shadow-[4px_4px_0px_#000]">
            <p className="text-[11px] font-black text-black uppercase tracking-wider mb-1.5">{metric.label}</p>
            <div className="flex items-center gap-1.5">
              <span className="text-2xl font-black text-black">{metric.val}</span>
              <Star className="w-5 h-5 text-amber-500 fill-amber-400 stroke-black stroke-[1.5]" />
            </div>
          </div>
        ))}
      </div>

      {/* Reviews List */}
      <div className="bg-white border-2 sm:border-4 border-black shadow-[6px_6px_0px_#000] overflow-hidden">
        {isLoading ? (
          <div className="py-20 flex flex-col items-center justify-center gap-3">
            <Loader2 className="w-8 h-8 text-black animate-spin" />
            <p className="text-xs text-black font-black uppercase tracking-wider">Loading feedback records...</p>
          </div>
        ) : feedbacks.length === 0 ? (
          <div className="p-16 text-center flex flex-col items-center justify-center">
            <div className="w-16 h-16 bg-amber-300 border-2 border-black shadow-[3px_3px_0px_#000] flex items-center justify-center mb-4">
              <MessageSquareQuote className="w-8 h-8 text-black stroke-[2]" />
            </div>
            <h3 className="text-lg font-black uppercase text-black mb-1">No Reviews Logged Yet</h3>
            <p className="text-slate-600 font-bold text-xs max-w-sm uppercase">
              Click &quot;Log Feedback&quot; to save guest reviews and ratings.
            </p>
          </div>
        ) : (
          <div className="divide-y-2 divide-black/10">
            {feedbacks.map((fb) => (
              <div key={fb.id} className="p-5 sm:p-6 hover:bg-amber-50/50 transition-colors">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h4 className="text-base font-black text-black uppercase tracking-tight">{fb.customerName}</h4>
                    <p className="text-xs font-bold text-slate-600 uppercase mt-0.5">
                      {fb.customerPhone || 'No Phone Number'} • {new Date(fb.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <button 
                    onClick={() => handleDelete(fb.id)} 
                    className="p-2 bg-white hover:bg-red-500 hover:text-white text-black border-2 border-black shadow-[2px_2px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 transition-all cursor-pointer"
                    title="Delete Review"
                  >
                    <Trash2 className="w-4 h-4 stroke-[2.5]" />
                  </button>
                </div>

                <div className="flex flex-wrap gap-2.5 mb-3">
                  {[
                    { label: 'Overall', val: fb.ratings.overall },
                    { label: 'Food', val: fb.ratings.food },
                    { label: 'Service', val: fb.ratings.service },
                    { label: 'Ambience', val: fb.ratings.ambience },
                  ].map(r => (
                    <div key={r.label} className="flex items-center gap-1.5 bg-amber-100 border border-black px-2.5 py-1 shadow-[1px_1px_0px_#000]">
                      <span className="text-[10px] font-black text-black uppercase">{r.label}</span>
                      <div className="flex items-center gap-0.5 ml-1">
                        <span className="text-xs font-black text-black">{r.val}</span>
                        <Star className="w-3 h-3 text-amber-500 fill-amber-400 stroke-black stroke-[1.5]" />
                      </div>
                    </div>
                  ))}
                </div>

                <div className="bg-slate-50 border-2 border-black p-3.5 relative shadow-[2px_2px_0px_#000]">
                  <Quote className="absolute top-2.5 right-3 w-5 h-5 text-slate-300" />
                  <p className="text-xs sm:text-sm font-bold text-slate-800 relative z-10 leading-relaxed">&ldquo;{fb.comment}&rdquo;</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {user && (
        <FeedbackModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSave={handleSave}
          userId={user.uid}
        />
      )}
    </div>
  );
};
