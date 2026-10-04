import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Promotion } from '@/types/customer';
import { getPromotions, addPromotion, updatePromotion, deletePromotion } from '@/lib/customerStorage';
import { PromotionModal } from '../customers/PromotionModal';
import { Plus, Tag, Clock, Calendar, Edit, Trash2, Loader2, AlertCircle } from 'lucide-react';

interface Props {
  showToast: (msg: string, type: 'success'|'error') => void;
}

export const PromotionsPage: React.FC<Props> = ({ showToast }) => {
  const { user } = useAuth();
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPromo, setEditingPromo] = useState<Promotion | null>(null);

  useEffect(() => {
    if (user) loadData();
  }, [user]);

  const loadData = async () => {
    if (!user) return;
    setIsLoading(true);
    try {
      const data = await getPromotions(user.uid);
      setPromotions(data);
    } catch (err) {
      console.error(err);
      showToast('Failed to load promotions', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async (data: any) => {
    if (!user) return;
    try {
      if (editingPromo) {
        await updatePromotion(editingPromo.id, data);
        showToast('Promotion updated', 'success');
      } else {
        await addPromotion({ ...data, userId: user.uid });
        showToast('Promotion created', 'success');
      }
      loadData();
    } catch (err) {
      console.error(err);
      showToast('Error saving promotion', 'error');
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this promotion?")) return;
    try {
      await deletePromotion(id);
      showToast('Promotion deleted', 'success');
      loadData();
    } catch (err) {
      console.error(err);
      showToast('Error deleting promotion', 'error');
    }
  };

  const handleToggleActive = async (promo: Promotion) => {
    try {
      await updatePromotion(promo.id, { isActive: !promo.isActive });
      loadData();
    } catch (err) {
      console.error(err);
      showToast('Failed to update status', 'error');
    }
  };

  const formatDiscount = (val: number, type: string) => {
    return type === 'PERCENTAGE' ? `${val}% OFF` : `৳${val} OFF`;
  };

  return (
    <div className="w-full mx-auto space-y-6 pb-20">
      <div className="bg-slate-900 p-4 sm:p-5 rounded-md border border-slate-800 shadow-md flex flex-wrap items-center justify-between gap-4 text-white">
        <div>
          <div className="flex flex-wrap items-center gap-2.5">
            <span className="w-2.5 h-2.5 rounded-full bg-indigo-500"></span>
            <h2 className="text-lg font-bold text-white">Offers & Promotions</h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">Create Happy Hours, Time-based discounts, and BOGOs.</p>
        </div>

        <button 
          onClick={() => { setEditingPromo(null); setIsModalOpen(true); }}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-500 transition-colors text-xs font-bold shadow-md shadow-indigo-950"
        >
          <Plus className="w-4 h-4" /> New Offer
        </button>
      </div>

      {isLoading ? (
        <div className="py-20 flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
          <p className="text-xs text-slate-500 font-medium">Loading promotions...</p>
        </div>
      ) : promotions.length === 0 ? (
        <div className="bg-slate-900 rounded-md border border-slate-800 p-12 flex flex-col items-center justify-center text-center shadow-md">
          <div className="w-16 h-16 rounded-full bg-slate-800/50 flex items-center justify-center mb-4 border border-slate-700">
            <Tag className="w-8 h-8 text-slate-500" />
          </div>
          <h3 className="text-lg font-bold text-white mb-2">No Active Promotions</h3>
          <p className="text-slate-400 text-sm max-w-sm mb-6">Create a Happy Hour or discount offer to boost your sales.</p>
          <button 
            onClick={() => { setEditingPromo(null); setIsModalOpen(true); }}
            className="px-5 py-2.5 bg-indigo-600 text-white rounded-md text-sm font-bold shadow-md shadow-indigo-950"
          >
            Create Your First Offer
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {promotions.map(promo => (
            <div key={promo.id} className={`bg-slate-900 border ${promo.isActive ? 'border-indigo-500/50 shadow-md shadow-indigo-900/20' : 'border-slate-800 opacity-75'} rounded-md overflow-hidden flex flex-col transition-all`}>
              
              <div className="p-5 flex-1 border-b border-slate-800/50">
                <div className="flex justify-between items-start mb-4">
                  <div className={`px-2.5 py-1 rounded-md text-[10px] font-bold tracking-wider uppercase ${promo.isActive ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-slate-800 text-slate-400 border border-slate-700'}`}>
                    {promo.isActive ? 'Active' : 'Inactive'}
                  </div>
                  <div className="flex items-center gap-1">
                    <button onClick={() => { setEditingPromo(promo); setIsModalOpen(true); }} className="p-1.5 text-slate-400 hover:text-white bg-slate-950 hover:bg-slate-800 rounded transition-colors"><Edit className="w-3.5 h-3.5" /></button>
                    <button onClick={() => handleDelete(promo.id)} className="p-1.5 text-slate-400 hover:text-rose-400 bg-slate-950 hover:bg-rose-950 rounded transition-colors"><Trash2 className="w-3.5 h-3.5" /></button>
                  </div>
                </div>

                <h3 className="text-lg font-bold text-white mb-1">{promo.title}</h3>
                <p className="text-xs text-indigo-400 font-bold uppercase tracking-wider mb-4">{promo.type.replace('_', ' ')}</p>

                <div className="bg-indigo-950/30 border border-indigo-900/50 rounded-md p-3 mb-4 flex items-center justify-center">
                  <span className="text-xl font-black text-indigo-300">
                    {formatDiscount(promo.discountValue, promo.discountType)}
                  </span>
                </div>

                <div className="space-y-2.5 text-xs">
                  <div className="flex flex-wrap items-center gap-2 text-slate-300">
                    <Calendar className="w-4 h-4 text-slate-500" />
                    <span>{promo.startDate} {promo.endDate ? `to ${promo.endDate}` : '(No end date)'}</span>
                  </div>
                  {(promo.type === 'HAPPY_HOUR' || promo.type === 'TIME_BASED') && (
                    <div className="flex flex-wrap items-center gap-2 text-slate-300">
                      <Clock className="w-4 h-4 text-slate-500" />
                      <span>{promo.startTime} - {promo.endTime} ({promo.applicableDays.join(', ')})</span>
                    </div>
                  )}
                  {promo.type !== 'HAPPY_HOUR' && promo.type !== 'TIME_BASED' && (
                    <div className="flex flex-wrap items-center gap-2 text-slate-300">
                      <AlertCircle className="w-4 h-4 text-slate-500" />
                      <span>Valid: {promo.applicableDays.join(', ')}</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="px-5 py-3 bg-slate-950 flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-400">Toggle Status</span>
                <label className="relative flex items-center cursor-pointer group">
                  <input type="checkbox" checked={promo.isActive} onChange={() => handleToggleActive(promo)} className="peer sr-only" />
                  <div className="w-10 h-6 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-slate-400 after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500 peer-checked:after:bg-white border border-slate-700 peer-checked:border-emerald-600"></div>
                </label>
              </div>
            </div>
          ))}
        </div>
      )}

      <PromotionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        initialData={editingPromo}
        onSave={handleSave}
      />
    </div>
  );
};
