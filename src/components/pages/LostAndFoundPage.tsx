import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { LostItem } from '@/types/lostAndFound';
import { getLostItems, addLostItem, handoverLostItem, deleteLostItem } from '@/lib/lostAndFoundStorage';
import { LogItemModal } from '../lost-and-found/LogItemModal';
import { HandoverModal } from '../lost-and-found/HandoverModal';
import { HandoverSlipModal } from '../lost-and-found/HandoverSlipModal';
import { Archive, Search, Package, Plus, MapPin, Lock, Calendar, Trash2, Printer, CheckCircle, AlertTriangle, ArrowRight } from 'lucide-react';

interface Props {
  showToast: (msg: string, type: 'success'|'error') => void;
}

export const LostAndFoundPage: React.FC<Props> = ({ showToast }) => {
  const { user } = useAuth();
  const [items, setItems] = useState<LostItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const [activeTab, setActiveTab] = useState<'Register' | 'Claims'>('Register');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'In store' | 'Returned' | 'All'>('All');

  // Modals
  const [isLogModalOpen, setIsLogModalOpen] = useState(false);
  
  const [isHandoverOpen, setIsHandoverOpen] = useState(false);
  const [handoverItem, setHandoverItem] = useState<LostItem | null>(null);

  const [isSlipOpen, setIsSlipOpen] = useState(false);
  const [slipItem, setSlipItem] = useState<LostItem | null>(null);

  useEffect(() => {
    if (user) loadData();
  }, [user]);

  const loadData = async () => {
    if (!user) return;
    setIsLoading(true);
    try {
      const data = await getLostItems(user.uid);
      setItems(data);
    } catch (err) {
      console.error(err);
      showToast('Failed to load lost and found items', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveItem = async (data: Omit<LostItem, 'id' | 'refNumber' | 'createdAt' | 'updatedAt' | 'status'>) => {
    try {
      await addLostItem(data);
      showToast('Item logged successfully', 'success');
      loadData();
    } catch (err) {
      console.error(err);
      showToast('Error logging item', 'error');
    }
  };

  const handleConfirmHandover = async (id: string, name: string, phone: string) => {
    try {
      await handoverLostItem(id, name, phone);
      showToast('Item handed over successfully', 'success');
      loadData();
    } catch (err) {
      console.error(err);
      showToast('Error during handover', 'error');
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this record permanently?")) return;
    try {
      await deleteLostItem(id);
      showToast('Record deleted', 'success');
      loadData();
    } catch (err) {
      console.error(err);
      showToast('Error deleting record', 'error');
    }
  };

  const inStoreCount = items.filter(i => i.status === 'In store').length;
  const returnedCount = items.filter(i => i.status === 'Returned').length;
  // Simplistic 30+ days calculation
  const held30DaysCount = items.filter(i => {
    if (i.status !== 'In store') return false;
    const diffTime = Math.abs(new Date().getTime() - new Date(i.dateFound).getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) >= 30;
  }).length;

  // Filtering
  const filteredItems = items.filter(item => {
    if (activeTab === 'Register') {
      if (statusFilter !== 'All' && item.status !== statusFilter) return false;
    } else {
      // Claims tab only shows Returned
      if (item.status !== 'Returned') return false;
    }

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return item.itemName.toLowerCase().includes(q) || 
             item.refNumber.toLowerCase().includes(q) || 
             item.color.toLowerCase().includes(q);
    }
    return true;
  });

  return (
    <div className="w-full mx-auto space-y-6 pb-20">
      
      {/* Header Actions */}
      <div className="bg-slate-900 p-4 sm:p-5 rounded-md border border-slate-800 shadow-md flex flex-wrap items-center justify-between gap-4 text-white">
        <div>
          <div className="flex flex-wrap items-center gap-2.5">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
            <h2 className="text-lg font-bold text-white">Lost & Found</h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">{inStoreCount} in store - {returnedCount} returned</p>
        </div>

        <button 
          onClick={() => setIsLogModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-500 transition-colors text-xs font-bold shadow-md shadow-primary-950"
        >
          <Plus className="w-4 h-4" /> Log item
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-slate-800 pb-px">
        <button 
          onClick={() => setActiveTab('Register')}
          className={`px-4 py-2 text-sm font-bold rounded-t-lg transition-colors ${activeTab === 'Register' ? 'bg-slate-800 text-white border-b-2 border-primary-500' : 'text-slate-400 hover:text-slate-200'}`}
        >
          Register ({items.length})
        </button>
        <button 
          onClick={() => setActiveTab('Claims')}
          className={`px-4 py-2 text-sm font-bold rounded-t-lg transition-colors ${activeTab === 'Claims' ? 'bg-slate-800 text-white border-b-2 border-primary-500' : 'text-slate-400 hover:text-slate-200'}`}
        >
          Claims ({returnedCount})
        </button>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-slate-900 border border-slate-800 p-4 rounded-md shadow-sm flex items-center gap-4">
          <div className="p-2.5 bg-slate-800 rounded-lg text-slate-300"><Package className="w-5 h-5" /></div>
          <div>
            <p className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">In Store</p>
            <p className="text-xl font-black text-white">{inStoreCount}</p>
          </div>
        </div>
        <div className="bg-slate-900 border border-slate-800 p-4 rounded-md shadow-sm flex items-center gap-4">
          <div className="p-2.5 bg-amber-500/10 rounded-lg text-amber-500"><Archive className="w-5 h-5" /></div>
          <div>
            <p className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Claims Waiting</p>
            <p className="text-xl font-black text-white">0</p>
            <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">Nothing to review</p>
          </div>
        </div>
        <div className="bg-slate-900 border border-slate-800 p-4 rounded-md shadow-sm flex items-center gap-4">
          <div className="p-2.5 bg-emerald-500/10 rounded-lg text-emerald-400"><CheckCircle className="w-5 h-5" /></div>
          <div>
            <p className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Returned</p>
            <p className="text-xl font-black text-white">{returnedCount}</p>
          </div>
        </div>
        <div className="bg-slate-900 border border-slate-800 p-4 rounded-md shadow-sm flex items-center gap-4">
          <div className="p-2.5 bg-rose-500/10 rounded-lg text-rose-400"><AlertTriangle className="w-5 h-5" /></div>
          <div>
            <p className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Held 30+ Days</p>
            <p className="text-xl font-black text-white">{held30DaysCount}</p>
            <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">Due for disposal review</p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 dark:text-slate-400" />
          <input 
            type="text" 
            placeholder="Search title, colour, reference code..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-900 border border-slate-800 text-white text-sm rounded-md pl-9 pr-3 py-2 focus:border-primary-500 focus:ring-1 focus:ring-primary-500"
          />
        </div>
        
        {activeTab === 'Register' && (
          <div className="flex bg-slate-900 border border-slate-800 rounded-md overflow-hidden">
            <button onClick={() => setStatusFilter('In store')} className={`px-4 py-2 text-xs font-bold transition-colors ${statusFilter === 'In store' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:bg-slate-800/50'}`}>In store</button>
            <button onClick={() => setStatusFilter('Returned')} className={`px-4 py-2 text-xs font-bold border-l border-slate-800 transition-colors ${statusFilter === 'Returned' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:bg-slate-800/50'}`}>Returned</button>
            <button onClick={() => setStatusFilter('All')} className={`px-4 py-2 text-xs font-bold border-l border-slate-800 transition-colors ${statusFilter === 'All' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:bg-slate-800/50'}`}>All</button>
          </div>
        )}
      </div>

      {/* List */}
      <div className="bg-slate-900 border border-slate-800 rounded-md shadow-md overflow-hidden">
        <div className="px-5 py-3 border-b border-slate-800 bg-slate-900/50">
          <p className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
            {activeTab === 'Register' ? 'REGISTER' : 'OWNERSHIP CLAIMS'} {filteredItems.length} listings
          </p>
        </div>

        <div className="divide-y divide-slate-800/50">
          {filteredItems.map(item => (
            <div key={item.id} className="p-5 flex flex-col md:flex-row gap-4 items-start md:items-center hover:bg-slate-800/30 transition-colors group">
              
              <div className="w-12 h-12 bg-slate-800 rounded-lg flex items-center justify-center shrink-0">
                <Package className="w-6 h-6 text-slate-400" />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2 mb-1">
                  <span className="text-xs font-mono text-slate-500 dark:text-slate-400">{item.refNumber}</span>
                  <span className="text-sm font-bold text-white truncate">{item.itemName}</span>
                  <span className="text-[10px] font-bold bg-slate-800 text-slate-300 px-2 py-0.5 rounded uppercase tracking-wider">{item.category}</span>
                  {item.status === 'In store' ? (
                    <span className="text-[10px] font-bold bg-amber-500/10 text-amber-500 border border-amber-500/20 px-2 py-0.5 rounded flex items-center gap-1"><span className="w-1.5 h-1.5 bg-amber-500 rounded-full"></span> In store</span>
                  ) : item.status === 'Returned' ? (
                    <span className="text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded flex items-center gap-1"><CheckCircle className="w-3 h-3" /> Approved & Handed Over</span>
                  ) : null}
                </div>

                {activeTab === 'Register' ? (
                  <p className="text-sm text-slate-400 mb-2 truncate">{item.publicDescription || 'No public description provided.'}</p>
                ) : (
                  <p className="text-sm text-slate-300 mb-2">Claimed by: <span className="font-bold text-white">{item.claimantName} ({item.claimantPhone})</span></p>
                )}

                <div className="flex flex-wrap items-center gap-4 text-xs font-medium text-slate-500 dark:text-slate-400">
                  <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" /> {item.locationFound || 'Unknown'}</span>
                  <span className="flex items-center gap-1"><Lock className="w-3.5 h-3.5" /> {item.storageNote || 'No storage note'}</span>
                  {activeTab === 'Register' ? (
                    <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" /> {new Date(item.dateFound).toLocaleDateString()}</span>
                  ) : (
                    <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" /> Released: {new Date(item.handoverDate || item.dateFound).toLocaleDateString()}</span>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0 md:opacity-0 group-hover:opacity-100 transition-opacity">
                {item.status === 'In store' && (
                  <>
                    <button onClick={() => { setHandoverItem(item); setIsHandoverOpen(true); }} className="flex items-center gap-1.5 px-3 py-1.5 bg-white dark:bg-slate-900 text-slate-900 dark:text-white hover:bg-slate-200 dark:bg-slate-700 text-xs font-bold rounded-md transition-colors">
                      Handover <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                    <button onClick={() => handleDelete(item.id)} className="p-1.5 text-slate-500 dark:text-slate-400 hover:text-rose-400 hover:bg-rose-950 rounded-md transition-colors border border-transparent hover:border-rose-900/50">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </>
                )}
                {item.status === 'Returned' && (
                  <button onClick={() => { setSlipItem(item); setIsSlipOpen(true); }} className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 text-slate-300 border border-slate-700 hover:text-white hover:bg-slate-700 text-xs font-bold rounded-md transition-colors">
                    <Printer className="w-3.5 h-3.5" /> View Proof
                  </button>
                )}
              </div>
            </div>
          ))}
          
          {filteredItems.length === 0 && !isLoading && (
            <div className="p-12 text-center flex flex-col items-center">
              <Archive className="w-8 h-8 text-slate-600 dark:text-slate-400 mb-3" />
              <p className="text-sm font-medium text-slate-400">No items found matching your criteria.</p>
            </div>
          )}
        </div>
      </div>

      {user && (
        <LogItemModal
          isOpen={isLogModalOpen}
          onClose={() => setIsLogModalOpen(false)}
          onSave={handleSaveItem}
          userId={user.uid}
        />
      )}

      <HandoverModal
        isOpen={isHandoverOpen}
        onClose={() => setIsHandoverOpen(false)}
        item={handoverItem}
        onConfirm={handleConfirmHandover}
      />

      <HandoverSlipModal
        isOpen={isSlipOpen}
        onClose={() => setIsSlipOpen(false)}
        item={slipItem}
      />

    </div>
  );
};
