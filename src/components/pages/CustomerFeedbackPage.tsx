import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { CustomerFeedback } from '@/types/customer';
import { getCustomerFeedback, addCustomerFeedback, deleteCustomerFeedback } from '@/lib/customerStorage';
import { FeedbackModal } from '../customers/FeedbackModal';
import { Plus, MessageSquareQuote, Star, Trash2, Loader2, Quote } from 'lucide-react';

interface Props {
  showToast: (msg: string, type: 'success'|'error') => void;
}

export const CustomerFeedbackPage: React.FC<Props> = ({ showToast }) => {
  const { user } = useAuth();
  const [feedbacks, setFeedbacks] = useState<CustomerFeedback[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (user) loadData();
  }, [user]);

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
    if (!window.confirm("Delete this review permanently?")) return;
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
    if (feedbacks.length === 0) return 0;
    const sum = feedbacks.reduce((acc, curr) => acc + curr.ratings[key], 0);
    return (sum / feedbacks.length).toFixed(1);
  };

  const avgOverall = calculateAvg('overall');
  const avgFood = calculateAvg('food');
  const avgService = calculateAvg('service');
  const avgAmbience = calculateAvg('ambience');

  return (
    <div className="w-full mx-auto space-y-6 pb-20">
      
      <div className="bg-slate-900 p-4 sm:p-5 rounded-md border border-slate-800 shadow-md flex flex-wrap items-center justify-between gap-4 text-white">
        <div>
          <div className="flex flex-wrap items-center gap-2.5">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
            <h2 className="text-lg font-bold text-white">Guest Feedback</h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">Log and monitor customer dining experiences.</p>
        </div>

        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-amber-600 text-white rounded-md hover:bg-amber-500 transition-colors text-xs font-bold shadow-md shadow-amber-950"
        >
          <Plus className="w-4 h-4" /> Log Feedback
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Overall', val: avgOverall },
          { label: 'Food', val: avgFood },
          { label: 'Service', val: avgService },
          { label: 'Ambience', val: avgAmbience },
        ].map(metric => (
          <div key={metric.label} className="bg-slate-900 border border-slate-800 rounded-md p-4 flex flex-col items-center justify-center shadow-md">
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">{metric.label}</p>
            <div className="flex items-center gap-1.5">
              <span className="text-2xl font-black text-white">{metric.val}</span>
              <Star className="w-5 h-5 text-amber-500 fill-amber-500" />
            </div>
          </div>
        ))}
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-md shadow-md overflow-hidden">
        {isLoading ? (
          <div className="py-20 flex flex-col items-center gap-3">
            <Loader2 className="w-8 h-8 text-primary-500 animate-spin" />
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Loading feedback...</p>
          </div>
        ) : feedbacks.length === 0 ? (
          <div className="p-16 text-center flex flex-col items-center">
            <div className="w-16 h-16 bg-slate-800/50 rounded-full flex items-center justify-center mb-4 border border-slate-700">
              <MessageSquareQuote className="w-8 h-8 text-slate-500 dark:text-slate-400" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">No Reviews Yet</h3>
            <p className="text-slate-400 text-sm">Log your first customer feedback to see metrics.</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-800/50">
            {feedbacks.map((fb) => (
              <div key={fb.id} className="p-6 hover:bg-slate-800/30 transition-colors group">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h4 className="text-base font-bold text-white">{fb.customerName}</h4>
                    <p className="text-xs text-slate-400">{fb.customerPhone || 'No Phone Number'} • {new Date(fb.createdAt).toLocaleDateString()}</p>
                  </div>
                  <button onClick={() => handleDelete(fb.id)} className="p-1.5 text-slate-500 dark:text-slate-400 hover:text-rose-400 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="flex flex-wrap gap-4 mb-4">
                  {[
                    { label: 'Overall', val: fb.ratings.overall },
                    { label: 'Food', val: fb.ratings.food },
                    { label: 'Service', val: fb.ratings.service },
                    { label: 'Ambience', val: fb.ratings.ambience },
                  ].map(r => (
                    <div key={r.label} className="flex items-center gap-1.5 bg-slate-950 px-2.5 py-1 rounded-md border border-slate-800">
                      <span className="text-[10px] font-bold text-slate-400 uppercase">{r.label}</span>
                      <div className="flex items-center gap-0.5 ml-1">
                        <span className="text-xs font-bold text-white">{r.val}</span>
                        <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
                      </div>
                    </div>
                  ))}
                </div>

                <div className="bg-slate-950/50 border border-slate-800 p-4 rounded-md relative">
                  <Quote className="absolute top-3 right-3 w-5 h-5 text-slate-700 dark:text-slate-300/50" />
                  <p className="text-sm text-slate-300 relative z-10">{fb.comment}</p>
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
