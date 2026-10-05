import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { SalesClient } from '@/types/sales';
import { getSalesClients, addSalesClient, updateSalesClient, deleteSalesClient } from '@/lib/salesStorage';
import { ClientFormModal } from '../sales/ClientFormModal';
import { Plus, Search, Loader2, Edit, Trash2, ChevronLeft, ChevronRight } from 'lucide-react';

interface Props {
  showToast: (msg: string, type: 'success'|'error') => void;
}

export const SalesClientSetupPage: React.FC<Props> = ({ showToast }) => {
  const { user } = useAuth();
  const [clients, setClients] = useState<SalesClient[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingClient, setEditingClient] = useState<SalesClient | null>(null);

  useEffect(() => {
    if (user) loadData();
  }, [user]);

  const loadData = async () => {
    if (!user) return;
    setIsLoading(true);
    try {
      const data = await getSalesClients(user.uid);
      setClients(data);
    } catch (err) {
      console.error(err);
      showToast('Failed to load clients', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveClient = async (data: Omit<SalesClient, 'id' | 'userId' | 'createdAt' | 'updatedAt'>) => {
    if (!user) return;
    try {
      if (editingClient) {
        await updateSalesClient(editingClient.id, data);
        showToast('Client updated', 'success');
      } else {
        await addSalesClient({ ...data, userId: user.uid });
        showToast('Client added', 'success');
      }
      loadData();
    } catch (err) {
      console.error(err);
      showToast('Error saving client', 'error');
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Delete this client?")) return;
    try {
      await deleteSalesClient(id);
      showToast('Client deleted', 'success');
      loadData();
    } catch (err) {
      console.error(err);
      showToast('Error deleting client', 'error');
    }
  };

  const handleToggleStatus = async (client: SalesClient) => {
    try {
      await updateSalesClient(client.id, { isActive: !client.isActive });
      setClients(prev => prev.map(c => c.id === client.id ? { ...c, isActive: !c.isActive } : c));
    } catch (err) {
      console.error(err);
      showToast('Error updating status', 'error');
    }
  };

  const filteredClients = clients.filter(c => 
    c.clientName.toLowerCase().includes(searchQuery.toLowerCase()) || 
    c.area.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.territory.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.phone.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="w-full mx-auto pb-20">
      
      {/* Header aligned to image */}
      <div className="bg-slate-900 p-4 border-b border-slate-800 border-slate-800 shadow-sm flex flex-wrap items-center justify-between gap-4 rounded-t-lg">
        <h2 className="text-lg font-bold text-white uppercase tracking-wider">CLIENT SETUP</h2>
        
        <div className="flex items-center gap-2">
          <select className="border border-slate-300 dark:border-slate-700 rounded px-3 py-1.5 text-sm bg-white dark:bg-slate-900 bg-slate-950 text-white focus:outline-none">
            <option>All</option>
            <option>Active</option>
            <option>Inactive</option>
          </select>
          <button 
            onClick={() => { setEditingClient(null); setIsFormOpen(true); }} 
            className="px-4 py-1.5 bg-[#20B2AA] text-white rounded text-sm font-bold shadow hover:bg-[#1A9C96] transition-colors uppercase tracking-wider"
          >
            ADD NEW
          </button>
        </div>
      </div>

      {/* Main Container */}
      <div className="bg-slate-900 border border-t-0 border-slate-800 border-slate-800 rounded-b-lg shadow-sm overflow-hidden">
        
        <div className="p-4 flex flex-wrap justify-between items-center gap-4 border-b border-slate-800 border-slate-800">
          <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
            <span>Show</span>
            <select 
              value={entriesPerPage}
              onChange={(e) => setEntriesPerPage(Number(e.target.value))}
              className="border border-slate-300 dark:border-slate-700 rounded px-2 py-1 bg-white dark:bg-slate-900 bg-slate-950 text-white focus:outline-none"
            >
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
            </select>
            <span>entries</span>
          </div>
          
          <div className="flex items-center gap-2">
            <span className="text-sm text-slate-600 dark:text-slate-400">Search:</span>
            <input 
              type="text" 
              value={searchQuery} 
              onChange={(e) => setSearchQuery(e.target.value)} 
              className="w-48 bg-white dark:bg-slate-900 bg-slate-950 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white text-sm rounded px-3 py-1 focus:outline-none focus:border-[#20B2AA]" 
            />
          </div>
        </div>

        {isLoading ? (
          <div className="py-20 flex justify-center">
            <Loader2 className="w-8 h-8 text-[#20B2AA] animate-spin" />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-300 whitespace-nowrap">
              <thead className="text-xs text-slate-700 dark:text-slate-300 text-slate-200 bg-slate-50 dark:bg-slate-950 bg-slate-800/80 font-bold border-b border-slate-800 dark:border-slate-700">
                <tr>
                  <th className="px-4 py-3 w-10 text-center">
                    <input type="checkbox" className="rounded border-slate-300 dark:border-slate-600" />
                  </th>
                  <th className="px-4 py-3">Area</th>
                  <th className="px-4 py-3">Territory</th>
                  <th className="px-4 py-3">Client Name</th>
                  <th className="px-4 py-3">Code</th>
                  <th className="px-4 py-3">Phone</th>
                  <th className="px-4 py-3">Address</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/50">
                {filteredClients.map((c) => (
                  <tr key={c.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                    <td className="px-4 py-3 text-center">
                      <input type="checkbox" className="rounded border-slate-300 dark:border-slate-600" />
                    </td>
                    <td className="px-4 py-3">{c.area}</td>
                    <td className="px-4 py-3">{c.territory}</td>
                    <td className="px-4 py-3 font-medium">{c.clientName}</td>
                    <td className="px-4 py-3">{c.code}</td>
                    <td className="px-4 py-3">{c.phone}</td>
                    <td className="px-4 py-3 truncate max-w-[150px]">{c.address}</td>
                    <td className="px-4 py-3">
                      <button 
                        onClick={() => handleToggleStatus(c)}
                        className={`relative inline-flex h-5 w-10 items-center rounded-full transition-colors focus:outline-none ${c.isActive ? 'bg-[#20B2AA]' : 'bg-slate-300 dark:bg-slate-600'}`}
                      >
                        <span className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white dark:bg-slate-900 transition-transform ${c.isActive ? 'translate-x-5' : 'translate-x-1'}`} />
                      </button>
                    </td>
                    <td className="px-4 py-3 text-center flex items-center justify-center gap-2">
                      <button 
                        onClick={() => { setEditingClient(c); setIsFormOpen(true); }} 
                        className="p-1.5 bg-[#FFC107] text-white hover:bg-[#E0A800] rounded transition-colors"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => handleDelete(c.id)}
                        className="p-1.5 bg-[#DC3545] text-white hover:bg-[#C82333] rounded transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
                
                {/* Second row representing multi-delete placeholder from image */}
                {filteredClients.length > 0 && (
                  <tr className="bg-slate-50 dark:bg-slate-950/50 dark:bg-slate-900/30">
                    <td className="px-4 py-3 text-center border-t border-slate-100 dark:border-slate-800/50 border-slate-800">
                      <input type="checkbox" className="rounded border-slate-300 dark:border-slate-600" />
                    </td>
                    <td colSpan={7} className="border-t border-slate-100 dark:border-slate-800/50 border-slate-800"></td>
                    <td className="px-4 py-3 text-center border-t border-slate-100 dark:border-slate-800/50 border-slate-800 flex justify-center">
                      <button className="px-3 py-1 bg-[#DC3545] text-white text-xs font-bold rounded shadow-sm hover:bg-[#C82333]">
                        Delete
                      </button>
                    </td>
                  </tr>
                )}
                
                {filteredClients.length === 0 && (
                  <tr>
                    <td colSpan={9} className="px-4 py-8 text-center text-slate-500 dark:text-slate-400">
                      No clients found matching your criteria.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        <div className="p-4 flex items-center justify-between text-sm text-slate-500 dark:text-slate-400">
          <span>Showing 1 to {filteredClients.length} of {filteredClients.length} entries</span>
          <div className="flex items-center gap-1">
            <button className="p-1.5 border border-slate-300 dark:border-slate-700 rounded bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 disabled:opacity-50" disabled><ChevronLeft className="w-4 h-4" /></button>
            <button className="px-3 py-1.5 bg-[#20B2AA] text-white rounded font-bold">1</button>
            <button className="p-1.5 border border-slate-300 dark:border-slate-700 rounded bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 disabled:opacity-50" disabled><ChevronRight className="w-4 h-4" /></button>
          </div>
        </div>

      </div>

      <ClientFormModal 
        isOpen={isFormOpen} 
        onClose={() => setIsFormOpen(false)} 
        onSave={handleSaveClient}
        initialData={editingClient}
      />
    </div>
  );
};
