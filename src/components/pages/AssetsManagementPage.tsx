"use client";

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { AssetItem } from '@/types/assets';
import { getAssets, addAsset, updateAsset, deleteAsset } from '@/lib/assetsStorage';
import { AssetFormModal } from '../assets/AssetFormModal';
import { 
  MonitorSmartphone, 
  Search, 
  Plus, 
  Trash2, 
  Edit, 
  Calendar, 
  ShieldCheck, 
  AlertTriangle, 
  Tag, 
  Filter, 
  DollarSign, 
  User, 
  CheckCircle2, 
  Clock, 
  Sparkles,
  Building2
} from 'lucide-react';

interface Props {
  showToast: (msg: string, type: 'success' | 'error') => void;
}

const getWarrantyBadge = (dateString: string) => {
  if (!dateString) return null;
  const target = new Date(dateString).getTime();
  const now = new Date().getTime();
  const diff = target - now;
  
  if (diff < 0) {
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-red-100 text-red-800 border-2 border-black shadow-[1.5px_1.5px_0px_#000] text-[10px] font-black uppercase tracking-wider">
        <AlertTriangle className="w-3 h-3 text-red-600 stroke-[2.5]" />
        EXPIRED
      </span>
    );
  }
  
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const months = Math.floor(days / 30);
  const years = Math.floor(days / 365);
  
  let label = '';
  if (years > 0) label = `${years}Y ${months % 12}M LEFT`;
  else if (months > 0) label = `${months}M ${days % 30}D LEFT`;
  else label = `${days}D LEFT`;

  const isUrgent = days < 30;

  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 border-2 border-black shadow-[1.5px_1.5px_0px_#000] text-[10px] font-black uppercase tracking-wider ${
      isUrgent ? 'bg-amber-200 text-black' : 'bg-emerald-100 text-emerald-900'
    }`}>
      <Clock className="w-3 h-3 stroke-[2.5]" />
      {label}
    </span>
  );
};

export const AssetsManagementPage: React.FC<Props> = ({ showToast }) => {
  const { user, userProfile } = useAuth();
  const [items, setItems] = useState<AssetItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [selectedStatus, setSelectedStatus] = useState('ALL');
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<AssetItem | undefined>(undefined);

  const effectiveCompanyId = userProfile?.companyId || user?.uid || '';

  const loadData = async () => {
    if (!effectiveCompanyId) return;
    setIsLoading(true);
    try {
      const data = await getAssets(effectiveCompanyId);
      setItems(data);
    } catch (err) {
      console.error(err);
      showToast('Failed to load assets', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (effectiveCompanyId) {
      loadData();
    }
  }, [effectiveCompanyId]);

  const handleSave = async (data: Omit<AssetItem, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      if (editingItem) {
        await updateAsset(editingItem.id, data);
        showToast('Asset updated successfully', 'success');
      } else {
        await addAsset(data);
        showToast('Asset added to registry', 'success');
      }
      loadData();
    } catch (err) {
      console.error(err);
      showToast('Error saving asset', 'error');
      throw err;
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!window.confirm(`Are you sure you want to delete "${name}" from assets registry?`)) return;
    try {
      await deleteAsset(id);
      showToast('Asset deleted successfully', 'success');
      loadData();
    } catch (err) {
      console.error(err);
      showToast('Error deleting asset', 'error');
    }
  };

  // Stat calculations
  const totalAssets = items.length;
  const activeAssets = items.filter(i => i.status === 'Active').length;
  const repairAssets = items.filter(i => i.status === 'Under Repair').length;
  const nowTime = new Date().getTime();
  const expiringWarrantyCount = items.filter(i => {
    if (!i.warrantyDate) return false;
    const diff = new Date(i.warrantyDate).getTime() - nowTime;
    return diff <= 1000 * 60 * 60 * 24 * 30; // Expired or < 30 days
  }).length;

  // Filter items
  const filteredItems = items.filter(item => {
    const matchesSearch = 
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.serialNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.vendor.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.assignedTo && item.assignedTo.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesCategory = selectedCategory === 'ALL' || item.category === selectedCategory;
    const matchesStatus = selectedStatus === 'ALL' || item.status === selectedStatus;

    return matchesSearch && matchesCategory && matchesStatus;
  });

  const categories = Array.from(new Set(items.map(i => i.category).filter(Boolean)));

  return (
    <div className="w-full mx-auto space-y-6 pb-20 font-sans text-black">
      
      {/* 1. Header Hero Card */}
      <div className="bg-white border-4 border-black shadow-[6px_6px_0px_#000] p-6 sm:p-7 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-amber-300 border-3 border-black shadow-[3px_3px_0px_#000] flex items-center justify-center text-black shrink-0">
            <MonitorSmartphone className="w-8 h-8 stroke-[2.5]" />
          </div>
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-amber-300 border-2 border-black text-[10px] font-black uppercase tracking-wider shadow-[2px_2px_0px_#000] mb-1.5">
              <Sparkles className="w-3.5 h-3.5 fill-black" />
              HARDWARE & IT REGISTRY
            </div>
            <h1 className="font-display font-black text-2xl sm:text-3xl uppercase tracking-tight text-black leading-none">
              ASSETS MANAGEMENT
            </h1>
            <p className="text-xs font-bold text-slate-700 uppercase tracking-wide mt-1">
              Track company computers, office equipment, warranties & employee tag assignments
            </p>
          </div>
        </div>

        <button
          onClick={() => {
            setEditingItem(undefined);
            setIsModalOpen(true);
          }}
          className="px-5 py-3 bg-red-600 hover:bg-red-700 text-white font-display font-black text-xs uppercase tracking-wider border-3 border-black shadow-[4px_4px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all flex items-center gap-2 cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>ADD NEW ASSET</span>
        </button>
      </div>

      {/* 2. Top Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Assets */}
        <div className="bg-[#FFFDF0] border-3 border-black shadow-[4px_4px_0px_#000] p-4 sm:p-5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-display font-black uppercase tracking-wider text-slate-700">
              TOTAL ASSETS
            </span>
            <Tag className="w-4 h-4 text-black stroke-[2.5]" />
          </div>
          <div className="font-display font-black text-3xl sm:text-4xl text-black">
            {totalAssets}
          </div>
          <p className="text-[10px] font-black uppercase tracking-wider text-slate-500 mt-1">
            Registered in system
          </p>
        </div>

        {/* Active In Use */}
        <div className="bg-[#DCFCE7] border-3 border-black shadow-[4px_4px_0px_#000] p-4 sm:p-5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-display font-black uppercase tracking-wider text-emerald-900">
              ACTIVE IN USE
            </span>
            <CheckCircle2 className="w-4 h-4 text-emerald-800 stroke-[2.5]" />
          </div>
          <div className="font-display font-black text-3xl sm:text-4xl text-emerald-950">
            {activeAssets}
          </div>
          <p className="text-[10px] font-black uppercase tracking-wider text-emerald-800 mt-1">
            Operational equipment
          </p>
        </div>

        {/* Under Repair */}
        <div className="bg-[#FEF3C7] border-3 border-black shadow-[4px_4px_0px_#000] p-4 sm:p-5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-display font-black uppercase tracking-wider text-amber-900">
              UNDER REPAIR
            </span>
            <AlertTriangle className="w-4 h-4 text-amber-800 stroke-[2.5]" />
          </div>
          <div className="font-display font-black text-3xl sm:text-4xl text-amber-950">
            {repairAssets}
          </div>
          <p className="text-[10px] font-black uppercase tracking-wider text-amber-800 mt-1">
            Service / maintenance
          </p>
        </div>

        {/* Expiring / Expired Warranty */}
        <div className="bg-[#FFE4E6] border-3 border-black shadow-[4px_4px_0px_#000] p-4 sm:p-5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-display font-black uppercase tracking-wider text-red-900">
              WARRANTY ALERTS
            </span>
            <ShieldCheck className="w-4 h-4 text-red-800 stroke-[2.5]" />
          </div>
          <div className="font-display font-black text-3xl sm:text-4xl text-red-950">
            {expiringWarrantyCount}
          </div>
          <p className="text-[10px] font-black uppercase tracking-wider text-red-800 mt-1">
            Expired or &lt; 30d remaining
          </p>
        </div>
      </div>

      {/* 3. Search & Filters Bar */}
      <div className="bg-white border-3 border-black shadow-[4px_4px_0px_#000] p-4 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-black absolute left-3.5 top-1/2 -translate-y-1/2 stroke-[2.5]" />
          <input
            type="text"
            placeholder="SEARCH BY ASSET NAME, SERIAL TAG, VENDOR OR EMPLOYEE..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 text-xs font-bold text-black bg-white border-2 border-black shadow-[2px_2px_0px_#000] focus:outline-none focus:bg-[#fffdf0] focus:border-indigo-600 rounded-none uppercase placeholder:text-slate-400"
          />
        </div>

        {/* Category Filter */}
        <div className="flex items-center gap-2">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-2.5 text-xs font-black uppercase tracking-wider text-black bg-white border-2 border-black shadow-[2px_2px_0px_#000] focus:outline-none focus:bg-[#fffdf0] rounded-none cursor-pointer"
          >
            <option value="ALL">ALL CATEGORIES</option>
            {categories.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>

          {/* Status Filter */}
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-3 py-2.5 text-xs font-black uppercase tracking-wider text-black bg-white border-2 border-black shadow-[2px_2px_0px_#000] focus:outline-none focus:bg-[#fffdf0] rounded-none cursor-pointer"
          >
            <option value="ALL">ALL STATUSES</option>
            <option value="Active">ACTIVE</option>
            <option value="Under Repair">UNDER REPAIR</option>
            <option value="Retired">RETIRED</option>
          </select>
        </div>
      </div>

      {/* 4. Assets Table */}
      {isLoading ? (
        <div className="p-16 bg-white border-4 border-black shadow-[6px_6px_0px_#000] text-center space-y-3">
          <div className="inline-block w-8 h-8 border-4 border-black border-t-indigo-600 animate-spin rounded-full" />
          <p className="font-display font-black text-xs uppercase tracking-wider text-black">
            LOADING ASSET REGISTRY...
          </p>
        </div>
      ) : filteredItems.length === 0 ? (
        <div className="bg-[#FAF8F0] border-4 border-black border-dashed shadow-[6px_6px_0px_#000] p-12 sm:p-16 text-center">
          <div className="w-16 h-16 bg-white border-3 border-black shadow-[4px_4px_0px_#000] flex items-center justify-center mx-auto mb-4">
            <MonitorSmartphone className="w-8 h-8 text-black stroke-[2]" />
          </div>
          <h3 className="font-display font-black text-xl uppercase tracking-tight text-black mb-1">
            NO ASSETS FOUND
          </h3>
          <p className="text-xs font-bold text-slate-600 uppercase tracking-wide max-w-sm mx-auto mb-6">
            {searchQuery || selectedCategory !== 'ALL' || selectedStatus !== 'ALL'
              ? 'No matching assets found for your filter criteria. Try resetting filters.'
              : 'Start building your inventory of office devices, serial tags, and hardware.'}
          </p>
          <button
            onClick={() => {
              setEditingItem(undefined);
              setIsModalOpen(true);
            }}
            className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-display font-black text-xs uppercase tracking-wider border-3 border-black shadow-[4px_4px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all inline-flex items-center gap-2 cursor-pointer"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            ADD FIRST ASSET
          </button>
        </div>
      ) : (
        <div className="bg-white border-4 border-black shadow-[6px_6px_0px_#000] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-100 border-b-3 border-black font-display font-black text-[11px] uppercase tracking-wider text-black">
                  <th className="py-3.5 px-4 sm:px-6">ASSET & SERIAL TAG</th>
                  <th className="py-3.5 px-4">CATEGORY</th>
                  <th className="py-3.5 px-4">VENDOR & COST</th>
                  <th className="py-3.5 px-4">WARRANTY STATUS</th>
                  <th className="py-3.5 px-4">STATUS</th>
                  <th className="py-3.5 px-4 sm:px-6 text-right">ACTIONS</th>
                </tr>
              </thead>
              <tbody className="divide-y-2 divide-black/10">
                {filteredItems.map((item) => {
                  const statusStyles = {
                    'Active': 'bg-emerald-300 text-black',
                    'Under Repair': 'bg-amber-300 text-black',
                    'Retired': 'bg-slate-200 text-slate-800',
                  }[item.status];

                  return (
                    <tr 
                      key={item.id} 
                      className="hover:bg-[#FFFDF0] transition-colors"
                    >
                      {/* Asset & Serial */}
                      <td className="py-4 px-4 sm:px-6">
                        <div className="font-display font-black text-sm text-black uppercase tracking-tight">
                          {item.name}
                        </div>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="inline-block px-1.5 py-0.5 bg-black text-white text-[10px] font-mono font-black uppercase tracking-wider">
                            {item.serialNumber}
                          </span>
                          {item.assignedTo && (
                            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-indigo-700 uppercase">
                              <User className="w-3 h-3 stroke-[2.5]" />
                              {item.assignedTo}
                            </span>
                          )}
                        </div>
                        {item.notes && (
                          <div className="text-[11px] text-slate-500 font-medium mt-1 truncate max-w-xs">
                            {item.notes}
                          </div>
                        )}
                      </td>

                      {/* Category */}
                      <td className="py-4 px-4">
                        <span className="inline-block px-2.5 py-1 bg-white text-black border-2 border-black shadow-[2px_2px_0px_#000] text-[10px] font-display font-black uppercase tracking-wider">
                          {item.category}
                        </span>
                      </td>

                      {/* Vendor & Cost */}
                      <td className="py-4 px-4">
                        <div className="font-bold text-xs text-black uppercase">
                          {item.vendor}
                        </div>
                        {item.cost ? (
                          <div className="font-mono font-black text-xs text-indigo-600 mt-0.5">
                            ৳ {item.cost.toLocaleString()}
                          </div>
                        ) : (
                          <div className="text-[10px] font-bold text-slate-400 uppercase">
                            —
                          </div>
                        )}
                      </td>

                      {/* Warranty Status */}
                      <td className="py-4 px-4">
                        <div className="flex flex-col gap-1.5">
                          <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-black">
                            <Calendar className="w-3.5 h-3.5 text-slate-500" />
                            <span>{item.warrantyDate}</span>
                          </div>
                          <div>
                            {getWarrantyBadge(item.warrantyDate)}
                          </div>
                        </div>
                      </td>

                      {/* Operating Status */}
                      <td className="py-4 px-4">
                        <span className={`inline-block px-2.5 py-1 border-2 border-black shadow-[2px_2px_0px_#000] text-[10px] font-display font-black uppercase tracking-wider ${statusStyles}`}>
                          {item.status}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="py-4 px-4 sm:px-6 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => {
                              setEditingItem(item);
                              setIsModalOpen(true);
                            }}
                            className="p-2 bg-amber-300 hover:bg-amber-400 text-black border-2 border-black shadow-[2px_2px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all cursor-pointer"
                            title="Edit Asset"
                            aria-label="Edit Asset"
                          >
                            <Edit className="w-4 h-4 stroke-[2.5]" />
                          </button>
                          <button
                            onClick={() => handleDelete(item.id, item.name)}
                            className="p-2 bg-white hover:bg-red-600 hover:text-white text-black border-2 border-black shadow-[2px_2px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all cursor-pointer"
                            title="Delete Asset"
                            aria-label="Delete Asset"
                          >
                            <Trash2 className="w-4 h-4 stroke-[2.5]" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Asset Form Modal */}
      {isModalOpen && (
        <AssetFormModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSave={handleSave}
          companyId={effectiveCompanyId}
          initialData={editingItem}
        />
      )}
    </div>
  );
};
