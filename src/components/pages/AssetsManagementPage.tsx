import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { AssetItem } from '@/types/assets';
import { getAssets, addAsset, updateAsset, deleteAsset } from '@/lib/assetsStorage';
import { AssetFormModal } from '../assets/AssetFormModal';
import { MonitorSmartphone, Search, Plus, Trash2, Edit, Calendar } from 'lucide-react';

interface Props {
  showToast: (msg: string, type: 'success' | 'error') => void;
}


const getWarrantyCountdown = (dateString: string) => {
  if (!dateString) return null;
  const target = new Date(dateString).getTime();
  const now = new Date().getTime();
  const diff = target - now;
  
  if (diff < 0) {
    return <span className="text-rose-500 font-semibold text-[10px] ml-1 px-1.5 py-0.5 bg-rose-500/10 rounded">Expired</span>;
  }
  
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const months = Math.floor(days / 30);
  const years = Math.floor(days / 365);
  
  let label = '';
  if (years > 0) label = `${years}y ${months % 12}m left`;
  else if (months > 0) label = `${months}m ${days % 30}d left`;
  else label = `${days}d left`;

  const colorClass = days < 30 ? "text-amber-500 bg-amber-500/10" : "text-emerald-500 bg-emerald-500/10";
  return <span className={`font-semibold text-[10px] ml-1 px-1.5 py-0.5 rounded ${colorClass}`}>{label}</span>;
};

export const AssetsManagementPage: React.FC<Props> = ({ showToast }) => {

  const { user, userProfile } = useAuth();
  const [items, setItems] = useState<AssetItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<AssetItem | undefined>(undefined);

  const loadData = async () => {
    if (!user || !userProfile?.companyId) return;
    setIsLoading(true);
    try {
      const data = await getAssets(userProfile?.companyId);
      setItems(data);
    } catch (err) {
      console.error(err);
      showToast('Failed to load assets', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (user && userProfile?.companyId) loadData();
  }, [user, userProfile?.companyId]);

  const handleSave = async (data: Omit<AssetItem, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      if (editingItem) {
        await updateAsset(editingItem.id, data);
        showToast('Asset updated successfully', 'success');
      } else {
        await addAsset(data);
        showToast('Asset added successfully', 'success');
      }
      loadData();
    } catch (err) {
      console.error(err);
      showToast('Error saving asset', 'error');
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this asset?")) return;
    try {
      await deleteAsset(id);
      showToast('Asset deleted', 'success');
      loadData();
    } catch (err) {
      console.error(err);
      showToast('Error deleting asset', 'error');
    }
  };

  const filteredItems = items.filter(item => 
    item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.serialNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.vendor.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
            <MonitorSmartphone className="w-6 h-6 text-primary-600" />
            Assets Management
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Track and manage office equipment and properties.</p>
        </div>
        <button
          onClick={() => { setEditingItem(undefined); setIsModalOpen(true); }}
          className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-xl text-sm font-bold shadow-xs hover:bg-primary-700 transition-all active:scale-95"
        >
          <Plus className="w-4 h-4" />
          Add Asset
        </button>
      </div>

      {/* Toolbar */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl shadow-xs border border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by name, serial, or vendor..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-sm border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
          />
        </div>
      </div>

      {/* List */}
      {isLoading ? (
        <div className="text-center py-12 text-sm text-slate-500 dark:text-slate-400">Loading assets...</div>
      ) : filteredItems.length === 0 ? (
        <div className="text-center py-12 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 border-dashed">
          <MonitorSmartphone className="w-8 h-8 text-slate-300 mx-auto mb-3" />
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">No assets found</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Add your first asset to start tracking.</p>
        </div>
      ) : (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 dark:bg-slate-950 border-b border-slate-200 dark:border-slate-700 text-xs uppercase text-slate-500 dark:text-slate-400 font-semibold">
                <tr>
                  <th className="px-6 py-4">Asset Info</th>
                  <th className="px-6 py-4">Vendor</th>
                  <th className="px-6 py-4">Warranty</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/50">
                {filteredItems.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50 dark:bg-slate-950/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-semibold text-slate-900 dark:text-white">{item.name}</div>
                      <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{item.serialNumber} • {item.category}</div>
                      {item.assignedTo && (
                        <div className="text-xs text-primary-600 mt-0.5">Assigned to: {item.assignedTo}</div>
                      )}
                    </td>
                    <td className="px-6 py-4 text-slate-600 dark:text-slate-400">
                      {item.vendor}
                    </td>
                    <td className="px-6 py-4 text-slate-600 dark:text-slate-400 flex items-center gap-1.5">
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-1.5">
                          <Calendar className="w-4 h-4 text-slate-400" />
                          <span>{item.warrantyDate}</span>
                        </div>
                        <div>
                          {getWarrantyCountdown(item.warrantyDate)}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider ${
                        item.status === 'Active' ? 'bg-emerald-100 text-emerald-700' :
                        item.status === 'Under Repair' ? 'bg-amber-100 text-amber-700' :
                        'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                      }`}>
                        {item.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => { setEditingItem(item); setIsModalOpen(true); }}
                          className="p-1.5 text-slate-400 hover:text-primary-600 bg-white dark:bg-slate-900 hover:bg-primary-50 border border-slate-200 dark:border-slate-700 rounded-lg transition-colors"
                          title="Edit"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(item.id)}
                          className="p-1.5 text-slate-400 hover:text-rose-600 bg-white dark:bg-slate-900 hover:bg-rose-50 border border-slate-200 dark:border-slate-700 rounded-lg transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {isModalOpen && user && (
        <AssetFormModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSave={handleSave}
          companyId={userProfile?.companyId || ''}
          initialData={editingItem}
        />
      )}
    </div>
  );
};
