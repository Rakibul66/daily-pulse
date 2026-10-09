"use client";

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { LostItem } from '@/types/lostAndFound';
import { getLostItems, addLostItem, handoverLostItem, deleteLostItem } from '@/lib/lostAndFoundStorage';
import { LogItemModal } from '../lost-and-found/LogItemModal';
import { HandoverModal } from '../lost-and-found/HandoverModal';
import { HandoverSlipModal } from '../lost-and-found/HandoverSlipModal';
import { 
  Archive, 
  Search, 
  Package, 
  Plus, 
  MapPin, 
  Lock, 
  Calendar, 
  Trash2, 
  Printer, 
  CheckCircle, 
  AlertTriangle, 
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Clock
} from 'lucide-react';

interface Props {
  showToast: (msg: string, type: 'success' | 'error') => void;
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
  // 30+ days calculation
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
    <div className="w-full pb-20 space-y-6">
      
      {/* Top Header Card */}
      <div className="bg-white border-2 sm:border-4 border-black p-5 sm:p-6 shadow-[6px_6px_0px_#000] flex flex-col md:flex-row md:items-center justify-between gap-4 text-black">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-amber-300 border-2 border-black shadow-[2px_2px_0px_#000]">
            <Archive className="w-6 h-6 text-black stroke-[2.5]" />
          </div>
          <div>
            <h2 className="font-display font-black text-lg sm:text-xl uppercase tracking-wider text-black">
              LOST & FOUND MANAGEMENT
            </h2>
            <p className="text-xs font-bold text-slate-600 uppercase tracking-wider">
              {inStoreCount} In Vault • {returnedCount} Returned to Guests • {held30DaysCount} Held Over 30 Days
            </p>
          </div>
        </div>

        <button 
          onClick={() => setIsLogModalOpen(true)}
          className="h-10 px-5 bg-cyan-400 hover:bg-cyan-300 text-black border-2 border-black font-display font-black uppercase text-xs shadow-[3px_3px_0px_#000] hover:shadow-[1px_1px_0px_#000] hover:translate-x-[2px] hover:translate-y-[2px] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all flex items-center gap-1.5 cursor-pointer"
        >
          <Plus className="w-4 h-4 stroke-[3]" /> LOG ITEM
        </button>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* In Store */}
        <div className="bg-white border-2 sm:border-4 border-black p-4 shadow-[4px_4px_0px_#000] flex items-center gap-4">
          <div className="p-3 bg-amber-300 border-2 border-black shadow-[2px_2px_0px_#000] text-black">
            <Package className="w-5 h-5 stroke-[2.5]" />
          </div>
          <div>
            <p className="text-[11px] font-black uppercase tracking-wider text-slate-600">IN STORE VAULT</p>
            <p className="text-2xl font-display font-black text-black">{inStoreCount}</p>
            <p className="text-[10px] font-bold text-slate-500 uppercase">Ready for claim</p>
          </div>
        </div>

        {/* Claims Waiting */}
        <div className="bg-white border-2 sm:border-4 border-black p-4 shadow-[4px_4px_0px_#000] flex items-center gap-4">
          <div className="p-3 bg-cyan-300 border-2 border-black shadow-[2px_2px_0px_#000] text-black">
            <ShieldCheck className="w-5 h-5 stroke-[2.5]" />
          </div>
          <div>
            <p className="text-[11px] font-black uppercase tracking-wider text-slate-600">CLAIMS WAITING</p>
            <p className="text-2xl font-display font-black text-black">0</p>
            <p className="text-[10px] font-bold text-slate-500 uppercase">All claims settled</p>
          </div>
        </div>

        {/* Returned */}
        <div className="bg-white border-2 sm:border-4 border-black p-4 shadow-[4px_4px_0px_#000] flex items-center gap-4">
          <div className="p-3 bg-emerald-300 border-2 border-black shadow-[2px_2px_0px_#000] text-black">
            <CheckCircle className="w-5 h-5 stroke-[2.5]" />
          </div>
          <div>
            <p className="text-[11px] font-black uppercase tracking-wider text-slate-600">RETURNED TO GUESTS</p>
            <p className="text-2xl font-display font-black text-black">{returnedCount}</p>
            <p className="text-[10px] font-bold text-slate-500 uppercase">Handover proof verified</p>
          </div>
        </div>

        {/* Held 30+ Days */}
        <div className="bg-white border-2 sm:border-4 border-black p-4 shadow-[4px_4px_0px_#000] flex items-center gap-4">
          <div className="p-3 bg-rose-300 border-2 border-black shadow-[2px_2px_0px_#000] text-black">
            <AlertTriangle className="w-5 h-5 stroke-[2.5]" />
          </div>
          <div>
            <p className="text-[11px] font-black uppercase tracking-wider text-slate-600">HELD 30+ DAYS</p>
            <p className="text-2xl font-display font-black text-black">{held30DaysCount}</p>
            <p className="text-[10px] font-bold text-slate-500 uppercase">Due for disposal review</p>
          </div>
        </div>
      </div>

      {/* Tabs Switcher */}
      <div className="flex gap-2">
        <button 
          onClick={() => setActiveTab('Register')}
          className={`px-5 py-2 text-xs font-black uppercase border-2 border-black shadow-[2px_2px_0px_#000] transition-all cursor-pointer ${
            activeTab === 'Register' 
              ? 'bg-amber-300 text-black shadow-[3px_3px_0px_#000]' 
              : 'bg-white hover:bg-slate-100 text-black'
          }`}
        >
          REGISTER DIRECTORY ({items.length})
        </button>
        <button 
          onClick={() => setActiveTab('Claims')}
          className={`px-5 py-2 text-xs font-black uppercase border-2 border-black shadow-[2px_2px_0px_#000] transition-all cursor-pointer ${
            activeTab === 'Claims' 
              ? 'bg-amber-300 text-black shadow-[3px_3px_0px_#000]' 
              : 'bg-white hover:bg-slate-100 text-black'
          }`}
        >
          OWNERSHIP CLAIMS ({returnedCount})
        </button>
      </div>

      {/* Filters Bar */}
      <div className="bg-white border-2 sm:border-4 border-black p-4 shadow-[6px_6px_0px_#000] flex flex-wrap items-center justify-between gap-4">
        <div className="relative flex-1 min-w-[240px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-black stroke-[2.5]" />
          <input 
            type="text" 
            placeholder="Search item title, color, reference code..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white border-2 border-black font-bold text-xs text-black shadow-[2px_2px_0px_#000] pl-9 pr-3 py-2 focus:outline-hidden focus:ring-2 focus:ring-black placeholder:text-slate-500"
          />
        </div>
        
        {activeTab === 'Register' && (
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-xs font-black uppercase text-black mr-1">Status:</span>
            {(['All', 'In store', 'Returned'] as const).map((st) => (
              <button 
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-3 py-1.5 text-xs font-black uppercase border-2 border-black shadow-[2px_2px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 cursor-pointer transition-all ${
                  statusFilter === st 
                    ? 'bg-black text-white' 
                    : 'bg-white hover:bg-slate-100 text-black'
                }`}
              >
                {st === 'All' ? 'ALL STATUS' : st.toUpperCase()}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Main Listings Card */}
      <div className="bg-white border-2 sm:border-4 border-black shadow-[6px_6px_0px_#000] overflow-hidden">
        {/* Listings Header */}
        <div className="px-5 py-3.5 border-b-2 sm:border-b-4 border-black bg-slate-900 text-white flex items-center justify-between">
          <p className="font-display font-black text-xs uppercase tracking-wider text-white">
            {activeTab === 'Register' ? 'REGISTER DIRECTORY' : 'OWNERSHIP CLAIMS'}
          </p>
          <span className="px-2.5 py-0.5 bg-amber-300 text-black font-mono font-black text-xs border border-black shadow-[1px_1px_0px_#000]">
            {filteredItems.length} {filteredItems.length === 1 ? 'ITEM' : 'ITEMS'}
          </span>
        </div>

        {/* Listings Body */}
        <div className="divide-y-2 divide-black/20 bg-white">
          {isLoading ? (
            <div className="p-16 text-center flex flex-col items-center justify-center gap-3">
              <Package className="w-8 h-8 text-black animate-bounce" />
              <p className="text-xs font-black uppercase tracking-wider text-black">Loading lost and found records...</p>
            </div>
          ) : filteredItems.length === 0 ? (
            <div className="p-16 text-center flex flex-col items-center justify-center gap-2">
              <Archive className="w-10 h-10 text-slate-400 mb-2" />
              <p className="text-sm font-black uppercase text-black">No items found</p>
              <p className="text-xs text-slate-600 font-bold">Try adjusting your search query or filter</p>
            </div>
          ) : (
            filteredItems.map(item => (
              <div 
                key={item.id} 
                className="p-5 flex flex-col md:flex-row gap-4 items-start md:items-center hover:bg-amber-50/80 transition-colors group"
              >
                {/* Icon box */}
                <div className="w-12 h-12 bg-amber-200 border-2 border-black shadow-[2px_2px_0px_#000] flex items-center justify-center shrink-0 text-black">
                  <Package className="w-6 h-6 stroke-[2.5]" />
                </div>

                {/* Details */}
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-1.5">
                    <span className="font-mono text-xs font-black bg-black text-white px-2 py-0.5 border border-black">
                      {item.refNumber}
                    </span>
                    <span className="text-sm font-display font-black text-black">
                      {item.itemName}
                    </span>
                    <span className="text-[10px] font-black bg-slate-100 border border-black/40 text-black px-2 py-0.5 uppercase tracking-wider">
                      {item.category}
                    </span>
                    
                    {/* Status Badge */}
                    {item.status === 'In store' ? (
                      <span className="inline-flex items-center gap-1 text-[11px] font-black bg-amber-300 text-black border-2 border-black px-2 py-0.5 shadow-[1px_1px_0px_#000] uppercase">
                        <span className="w-2 h-2 bg-amber-600 rounded-full animate-pulse"></span> IN STORE VAULT
                      </span>
                    ) : item.status === 'Returned' ? (
                      <span className="inline-flex items-center gap-1 text-[11px] font-black bg-emerald-300 text-black border-2 border-black px-2 py-0.5 shadow-[1px_1px_0px_#000] uppercase">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-800" /> HANDED OVER
                      </span>
                    ) : null}
                  </div>

                  {activeTab === 'Register' ? (
                    <p className="text-xs font-bold text-slate-700 mb-2 truncate">
                      {item.publicDescription || 'No description provided.'}
                    </p>
                  ) : (
                    <p className="text-xs font-bold text-black mb-2">
                      Claimed by: <span className="font-black bg-emerald-100 border border-black px-2 py-0.5 text-black">{item.claimantName} ({item.claimantPhone})</span>
                    </p>
                  )}

                  <div className="flex flex-wrap items-center gap-4 text-xs font-bold text-slate-700">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-black" /> {item.locationFound || 'Venue Floor'}
                    </span>
                    <span className="flex items-center gap-1">
                      <Lock className="w-3.5 h-3.5 text-black" /> {item.storageNote || 'Vault #1'}
                    </span>
                    {activeTab === 'Register' ? (
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-black" /> Found: {new Date(item.dateFound).toLocaleDateString()}
                      </span>
                    ) : (
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-black" /> Released: {new Date(item.handoverDate || item.dateFound).toLocaleDateString()}
                      </span>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 shrink-0">
                  {item.status === 'In store' && (
                    <>
                      <button 
                        onClick={() => { setHandoverItem(item); setIsHandoverOpen(true); }} 
                        className="flex items-center gap-1.5 px-4 py-2 bg-cyan-400 hover:bg-cyan-300 text-black border-2 border-black font-black uppercase text-xs shadow-[2px_2px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 transition-all cursor-pointer"
                      >
                        Handover <ArrowRight className="w-3.5 h-3.5 stroke-[3]" />
                      </button>
                      <button 
                        onClick={() => handleDelete(item.id)} 
                        className="p-2 bg-rose-500 hover:bg-rose-600 text-white border-2 border-black shadow-[2px_2px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 transition-all cursor-pointer"
                        title="Delete Record"
                      >
                        <Trash2 className="w-4 h-4 stroke-[2.5]" />
                      </button>
                    </>
                  )}
                  {item.status === 'Returned' && (
                    <button 
                      onClick={() => { setSlipItem(item); setIsSlipOpen(true); }} 
                      className="flex items-center gap-1.5 px-4 py-2 bg-amber-300 hover:bg-amber-400 text-black border-2 border-black font-black uppercase text-xs shadow-[2px_2px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 transition-all cursor-pointer"
                    >
                      <Printer className="w-3.5 h-3.5 stroke-[2.5]" /> View Proof
                    </button>
                  )}
                </div>
              </div>
            ))
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
