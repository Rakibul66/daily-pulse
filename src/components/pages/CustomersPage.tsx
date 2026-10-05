import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Customer } from '@/types/customer';
import { getCustomers, addCustomer, addCustomersBulk, updateCustomer, deleteCustomer } from '@/lib/customerStorage';
import { CustomerFormModal } from '../customers/CustomerFormModal';
import { CustomerLoyaltyModal } from '../customers/CustomerLoyaltyModal';
import { Users, Plus, Upload, Search, Award, Star, Loader2, Edit, Trash2 } from 'lucide-react';

interface Props {
  showToast: (msg: string, type: 'success'|'error') => void;
}

export const CustomersPage: React.FC<Props> = ({ showToast }) => {
  const { user } = useAuth();
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);

  const [isLoyaltyOpen, setIsLoyaltyOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);

  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    if (user) {
      loadData();
    }
  }, [user]);

  const loadData = async () => {
    if (!user) return;
    setIsLoading(true);
    try {
      const data = await getCustomers(user.uid);
      setCustomers(data);
    } catch (err) {
      console.error(err);
      showToast('Failed to load customers', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveCustomer = async (data: any) => {
    if (!user) return;
    try {
      if (editingCustomer) {
        await updateCustomer(editingCustomer.id, data);
        showToast('Customer updated', 'success');
      } else {
        await addCustomer({ ...data, userId: user.uid, totalSpent: 0, loyaltyPoints: 0, loyaltyTier: 'Member' });
        showToast('Customer added', 'success');
      }
      loadData();
    } catch (err) {
      console.error(err);
      throw err;
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this customer?")) return;
    try {
      await deleteCustomer(id);
      showToast('Customer deleted', 'success');
      loadData();
    } catch (err) {
      console.error(err);
      showToast('Failed to delete', 'error');
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    setIsUploading(true);
    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const text = event.target?.result as string;
        const lines = text.split('\n').map(l => l.trim()).filter(l => l);
        if (lines.length <= 1) throw new Error("File empty or missing data rows");

        const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
        
        const newCustomers: any[] = [];
        for (let i = 1; i < lines.length; i++) {
          // Simple split, handles basic CSV without quotes. For real-world use PapaParse.
          const cols = lines[i].split(',').map(c => c.trim());
          if (cols.length > 1) {
            newCustomers.push({
              businessName: cols[0] || 'Unknown',
              phone: cols[1] || '',
              email: cols[2] || '',
              address: cols[3] || '',
              ownerName: cols[4] || '',
              businessType: cols[5] || 'Other',
              customerSince: new Date().toISOString().split('T')[0],
              loyaltyPoints: 0,
              totalSpent: 0,
              loyaltyTier: 'Member'
            });
          }
        }
        
        const count = await addCustomersBulk(user.uid, newCustomers);
        showToast(`Successfully imported ${count} customers`, 'success');
        loadData();
      } catch (err) {
        console.error(err);
        showToast((err as Error).message || "Failed to parse CSV", 'error');
      } finally {
        setIsUploading(false);
        e.target.value = ''; // reset
      }
    };
    reader.readAsText(file);
  };

  const tierColors = {
    Member: 'bg-slate-700 text-slate-200',
    Silver: 'bg-slate-300 text-slate-800 dark:text-slate-200 shadow-sm shadow-slate-200/20',
    Gold: 'bg-amber-400 text-amber-950 shadow-sm shadow-amber-400/20',
    Platinum: 'bg-primary-300 text-primary-950 shadow-sm shadow-primary-300/20',
  };

  const filtered = customers.filter(c => 
    c.businessName.toLowerCase().includes(searchTerm.toLowerCase()) || 
    c.phone.includes(searchTerm)
  );

  return (
    <div className="w-full mx-auto space-y-6 pb-20">
      <div className="bg-slate-900 p-4 sm:p-5 rounded-md border border-slate-800 shadow-md flex flex-wrap items-center justify-between gap-4 text-white">
        <div>
          <div className="flex flex-wrap items-center gap-2.5">
            <span className="w-2.5 h-2.5 rounded-full bg-primary-500"></span>
            <h2 className="text-lg font-bold text-white">Customers & Loyalty</h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">Manage your clients and their membership points.</p>
        </div>

        <div className="flex items-center gap-3">
          <label className="relative cursor-pointer">
            <div className="px-4 py-2 bg-slate-800 text-slate-300 rounded-md hover:bg-slate-700 hover:text-white transition-colors text-xs font-bold border border-slate-700 flex items-center gap-2">
              {isUploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
              {isUploading ? 'Uploading...' : 'Bulk CSV'}
            </div>
            <input type="file" accept=".csv" className="hidden" onChange={handleFileUpload} disabled={isUploading} />
          </label>
          <button 
            onClick={() => { setEditingCustomer(null); setIsFormOpen(true); }}
            className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-500 transition-colors text-xs font-bold shadow-md shadow-primary-950"
          >
            <Plus className="w-4 h-4" /> Add Customer
          </button>
        </div>
      </div>

      <div className="bg-slate-900 rounded-md border border-slate-800 shadow-md overflow-hidden">
        <div className="p-4 border-b border-slate-800 bg-slate-900/50 flex flex-wrap gap-4 items-center justify-between">
          <div className="relative max-w-sm w-full">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 dark:text-slate-400" />
            <input 
              type="text" 
              placeholder="Search customers..." 
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full text-sm font-medium text-white bg-slate-950 pl-9 pr-3 py-2 rounded-md border border-slate-700 focus:border-primary-500 focus:ring-1 focus:ring-primary-500 placeholder-slate-600"
            />
          </div>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">{filtered.length} total</p>
        </div>

        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-950/50 border-b border-slate-800">
                <th className="px-5 py-3 text-xs font-bold uppercase tracking-wider text-slate-400">Business / Client</th>
                <th className="px-5 py-3 text-xs font-bold uppercase tracking-wider text-slate-400">Contact</th>
                <th className="px-5 py-3 text-xs font-bold uppercase tracking-wider text-slate-400 text-center">Membership Tier</th>
                <th className="px-5 py-3 text-xs font-bold uppercase tracking-wider text-slate-400 text-right">Loyalty Points</th>
                <th className="px-5 py-3 text-xs font-bold uppercase tracking-wider text-slate-400 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50">
              {isLoading ? (
                <tr>
                  <td colSpan={5} className="px-5 py-10 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <Loader2 className="w-8 h-8 text-primary-500 animate-spin" />
                      <p className="text-sm text-slate-400">Loading customers...</p>
                    </div>
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-5 py-10 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <Users className="w-10 h-10 text-slate-600 dark:text-slate-400" />
                      <p className="text-sm font-semibold text-slate-400">No customers found.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                filtered.map((customer) => (
                  <tr key={customer.id} className="hover:bg-slate-800/20 transition-colors">
                    <td className="px-5 py-4">
                      <p className="text-sm font-bold text-white mb-0.5">{customer.businessName}</p>
                      <p className="text-[10px] text-primary-400 uppercase tracking-wider font-semibold">{customer.businessType}</p>
                    </td>
                    <td className="px-5 py-4">
                      <p className="text-sm text-slate-300">{customer.phone}</p>
                      {customer.ownerName && <p className="text-[11px] text-slate-500 dark:text-slate-400">{customer.ownerName}</p>}
                    </td>
                    <td className="px-5 py-4 text-center">
                      <span className={`inline-block px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${tierColors[customer.loyaltyTier]}`}>
                        {customer.loyaltyTier}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-right">
                      <button 
                        onClick={() => { setSelectedCustomer(customer); setIsLoyaltyOpen(true); }}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/20 rounded-md transition-colors text-xs font-bold"
                      >
                        <Star className="w-3.5 h-3.5 fill-amber-400" />
                        {customer.loyaltyPoints} pts
                      </button>
                    </td>
                    <td className="px-5 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button 
                          onClick={() => { setEditingCustomer(customer); setIsFormOpen(true); }}
                          className="p-1.5 text-slate-400 hover:text-white bg-slate-900 hover:bg-slate-800 border border-slate-700 rounded transition-colors"
                          title="Edit"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleDelete(customer.id)}
                          className="p-1.5 text-slate-400 hover:text-rose-400 bg-slate-900 hover:bg-slate-800 border border-slate-700 rounded transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <CustomerFormModal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        initialData={editingCustomer}
        onSave={handleSaveCustomer}
      />

      <CustomerLoyaltyModal
        isOpen={isLoyaltyOpen}
        onClose={() => setIsLoyaltyOpen(false)}
        customer={selectedCustomer}
        onUpdate={loadData}
      />
    </div>
  );
};
