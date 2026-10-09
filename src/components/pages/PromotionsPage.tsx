import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Promotion } from '@/types/customer';
import { getPromotions, addPromotion, updatePromotion, deletePromotion } from '@/lib/customerStorage';
import { PromotionModal } from '../customers/PromotionModal';
import { Plus, Tag, Clock, Calendar, Edit, Trash2, Loader2, AlertCircle } from 'lucide-react';

interface Props {
  showToast: (msg: string, type: 'success' | 'error') => void;
}

export const PromotionsPage: React.FC<Props> = ({ showToast }) => {
  const { user, userProfile } = useAuth();
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPromo, setEditingPromo] = useState<Promotion | null>(null);

  useEffect(() => {
    if (user) loadData();
  }, [user, userProfile]);

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
        showToast('Promotion updated successfully', 'success');
      } else {
        await addPromotion({ ...data, userId: user.uid });
        showToast('Promotion created successfully', 'success');
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
      {/* Top Banner Card */}
      <div className="bg-white p-4 sm:p-5 border-2 sm:border-4 border-black shadow-[6px_6px_0px_#000] flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-2.5">
            <span className="w-3 h-3 bg-amber-400 border border-black inline-block"></span>
            <h2 className="text-lg font-black uppercase text-black tracking-wider">Offers &amp; Promotions</h2>
            <span className="px-2 py-0.5 bg-amber-100 border border-black text-black text-xs font-black">
              {promotions.length} OFFERS
            </span>
          </div>
          <p className="text-xs font-bold text-slate-600 uppercase mt-1">
            Configure happy hours, time-based discounts, and special promotional offers.
          </p>
        </div>

        <button 
          onClick={() => { setEditingPromo(null); setIsModalOpen(true); }}
          className="flex items-center gap-2 px-4 py-2.5 bg-emerald-400 hover:bg-emerald-300 text-black border-2 border-black text-xs font-black uppercase shadow-[2px_2px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4 stroke-[3]" /> New Offer
        </button>
      </div>

      {isLoading ? (
        <div className="py-20 flex flex-col items-center justify-center gap-3 bg-white border-2 sm:border-4 border-black shadow-[6px_6px_0px_#000]">
          <Loader2 className="w-8 h-8 text-black animate-spin" />
          <p className="text-xs text-black font-black uppercase tracking-wider">Loading promotions...</p>
        </div>
      ) : promotions.length === 0 ? (
        <div className="bg-white border-2 sm:border-4 border-black p-12 flex flex-col items-center justify-center text-center shadow-[6px_6px_0px_#000]">
          <div className="w-16 h-16 bg-amber-300 border-2 border-black shadow-[3px_3px_0px_#000] flex items-center justify-center mb-4">
            <Tag className="w-8 h-8 text-black stroke-[2]" />
          </div>
          <h3 className="text-lg font-black uppercase text-black mb-1">No Active Promotions</h3>
          <p className="text-slate-600 font-bold text-xs max-w-sm uppercase mb-5">
            Create a Happy Hour or seasonal discount offer to attract more customers.
          </p>
          <button 
            onClick={() => { setEditingPromo(null); setIsModalOpen(true); }}
            className="px-5 py-2.5 bg-emerald-400 hover:bg-emerald-300 text-black border-2 border-black text-xs font-black uppercase shadow-[2px_2px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 transition-all cursor-pointer"
          >
            Create Your First Offer
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {promotions.map(promo => (
            <div 
              key={promo.id} 
              className={`bg-white border-2 sm:border-4 border-black shadow-[5px_5px_0px_#000] overflow-hidden flex flex-col transition-all ${
                promo.isActive ? '' : 'opacity-70 bg-slate-50'
              }`}
            >
              <div className="p-5 flex-1 border-b-2 sm:border-b-4 border-black">
                <div className="flex justify-between items-start mb-3">
                  <span className={`px-2.5 py-0.5 border border-black font-black text-[10px] uppercase shadow-[1px_1px_0px_#000] ${
                    promo.isActive ? 'bg-emerald-300 text-black' : 'bg-slate-200 text-slate-700'
                  }`}>
                    {promo.isActive ? '● Active' : '○ Inactive'}
                  </span>
                  <div className="flex items-center gap-1.5">
                    <button 
                      onClick={() => { setEditingPromo(promo); setIsModalOpen(true); }} 
                      className="p-1.5 bg-white hover:bg-amber-300 border border-black shadow-[1px_1px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 text-black cursor-pointer"
                      title="Edit Offer"
                    >
                      <Edit className="w-3.5 h-3.5 stroke-[2.5]" />
                    </button>
                    <button 
                      onClick={() => handleDelete(promo.id)} 
                      className="p-1.5 bg-white hover:bg-red-500 hover:text-white border border-black shadow-[1px_1px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 text-black cursor-pointer"
                      title="Delete Offer"
                    >
                      <Trash2 className="w-3.5 h-3.5 stroke-[2.5]" />
                    </button>
                  </div>
                </div>

                <h3 className="text-base font-black uppercase text-black mb-0.5">{promo.title}</h3>
                <p className="text-[11px] font-bold text-slate-600 uppercase tracking-wide mb-3">{promo.type.replace('_', ' ')}</p>

                <div className="bg-amber-100 border-2 border-black p-3 mb-4 flex items-center justify-center shadow-[2px_2px_0px_#000]">
                  <span className="text-2xl font-black text-black">
                    {formatDiscount(promo.discountValue, promo.discountType)}
                  </span>
                </div>

                <div className="space-y-2 text-xs font-bold text-slate-800">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-black shrink-0" />
                    <span>{promo.startDate} {promo.endDate ? `to ${promo.endDate}` : '(No expiry date)'}</span>
                  </div>
                  {(promo.type === 'HAPPY_HOUR' || promo.type === 'TIME_BASED') && (
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-black shrink-0" />
                      <span>{promo.startTime} – {promo.endTime} ({promo.applicableDays.join(', ')})</span>
                    </div>
                  )}
                  {promo.type !== 'HAPPY_HOUR' && promo.type !== 'TIME_BASED' && (
                    <div className="flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 text-black shrink-0" />
                      <span>Valid: {promo.applicableDays.join(', ')}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Status Toggle Bar */}
              <div className="px-5 py-3 bg-slate-50 flex items-center justify-between">
                <span className="text-xs font-black uppercase text-black">Status</span>
                <button
                  type="button"
                  onClick={() => handleToggleActive(promo)}
                  className={`px-3 py-1 border border-black font-black text-xs uppercase shadow-[2px_2px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 transition-all cursor-pointer ${
                    promo.isActive ? 'bg-emerald-300 text-black' : 'bg-slate-200 text-black'
                  }`}
                >
                  {promo.isActive ? 'Enabled' : 'Disabled'}
                </button>
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
