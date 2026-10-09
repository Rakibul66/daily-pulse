import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Customer } from '@/types/customer';
import { 
  getCustomers, 
  addCustomer, 
  addCustomersBulk, 
  updateCustomer, 
  deleteCustomer,
  exportCustomersToCSV 
} from '@/lib/customerStorage';
import { CustomerFormModal } from '../customers/CustomerFormModal';
import { CustomerLoyaltyModal } from '../customers/CustomerLoyaltyModal';
import { DeleteConfirmModal } from '../ui/DeleteConfirmModal';
import { 
  Users, 
  Plus, 
  Upload, 
  Download, 
  Search, 
  Star, 
  Loader2, 
  Edit2, 
  Trash2, 
  Phone, 
  MapPin, 
  ArrowRightLeft,
  Building,
  UserCheck
} from 'lucide-react';

interface Props {
  showToast: (msg: string, type: 'success' | 'error') => void;
}

export const CustomersPage: React.FC<Props> = ({ showToast }) => {
  const { user, userProfile } = useAuth();
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [sourceFilter, setSourceFilter] = useState<'ALL' | 'CONVERTED' | 'DIRECT'>('ALL');

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
  const [deletingCustomer, setDeletingCustomer] = useState<Customer | null>(null);

  const [isLoyaltyOpen, setIsLoyaltyOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);

  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    if (user) {
      loadData();
    }
  }, [user, userProfile?.companyId]);

  const loadData = async () => {
    if (!user) return;
    setIsLoading(true);
    try {
      const data = await getCustomers(user.uid, userProfile?.companyId);
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
        showToast('Customer updated successfully', 'success');
      } else {
        await addCustomer({ 
          ...data, 
          userId: user.uid, 
          companyId: userProfile?.companyId || user.uid,
          totalSpent: 0, 
          loyaltyPoints: 0, 
          loyaltyTier: 'Member' 
        });
        showToast('Customer added successfully', 'success');
      }
      loadData();
    } catch (err) {
      console.error(err);
      showToast('Failed to save customer', 'error');
      throw err;
    }
  };

  const handleConfirmDelete = async () => {
    if (!deletingCustomer) return;
    try {
      await deleteCustomer(deletingCustomer.id);
      showToast('Customer deleted successfully', 'success');
      setDeletingCustomer(null);
      loadData();
    } catch (err) {
      console.error(err);
      showToast('Failed to delete customer', 'error');
    }
  };

  const handleExport = () => {
    if (customers.length === 0) {
      showToast('No customers available to export', 'error');
      return;
    }
    exportCustomersToCSV(customers);
    showToast(`Exported ${customers.length} customers to CSV`, 'success');
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

        const newCustomers: any[] = [];
        for (let i = 1; i < lines.length; i++) {
          const cols = lines[i].split(',').map(c => c.trim().replace(/^["']|["']$/g, ''));
          if (cols.length > 1) {
            newCustomers.push({
              businessName: cols[0] || 'Unknown Client',
              phone: cols[1] || '',
              email: cols[2] || '',
              address: cols[3] || '',
              ownerName: cols[4] || '',
              businessType: cols[5] || 'Other',
              source: 'Bulk CSV Import',
              customerSince: new Date().toISOString().split('T')[0],
              loyaltyPoints: 0,
              totalSpent: 0,
              loyaltyTier: 'Member'
            });
          }
        }
        
        const count = await addCustomersBulk(user.uid, newCustomers, userProfile?.companyId);
        showToast(`Successfully imported ${count} customers`, 'success');
        loadData();
      } catch (err) {
        console.error(err);
        showToast((err as Error).message || "Failed to parse CSV", 'error');
      } finally {
        setIsUploading(false);
        e.target.value = '';
      }
    };
    reader.readAsText(file);
  };

  const tierColors = {
    Member: 'bg-slate-100 text-black border-black',
    Silver: 'bg-slate-200 text-black border-black',
    Gold: 'bg-amber-300 text-black border-black',
    Platinum: 'bg-violet-300 text-black border-black',
  };

  const convertedCount = customers.filter(c => c.source === 'Converted Lead').length;
  const directCount = customers.filter(c => c.source !== 'Converted Lead').length;

  const filtered = customers.filter(c => {
    const matchesSearch = 
      c.businessName.toLowerCase().includes(searchTerm.toLowerCase()) || 
      c.phone.includes(searchTerm) ||
      (c.ownerName && c.ownerName.toLowerCase().includes(searchTerm.toLowerCase()));

    if (!matchesSearch) return false;

    if (sourceFilter === 'CONVERTED') return c.source === 'Converted Lead';
    if (sourceFilter === 'DIRECT') return c.source !== 'Converted Lead';
    return true;
  });

  return (
    <div className="w-full mx-auto space-y-6 pb-20">
      
      {/* Top Banner Card */}
      <div className="bg-white p-4 sm:p-5 border-2 sm:border-4 border-black shadow-[6px_6px_0px_#000] flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-2.5">
            <span className="w-3 h-3 bg-amber-400 border border-black inline-block"></span>
            <h2 className="text-lg font-black uppercase text-black tracking-wider">Customers Directory</h2>
            <span className="px-2 py-0.5 bg-amber-100 border border-black text-black text-xs font-black">
              {customers.length} CUSTOMERS
            </span>
          </div>
          <p className="text-xs font-bold text-slate-600 uppercase mt-1">
            Consolidated directory of converted leads and manually registered clients.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          {/* Export CSV */}
          <button
            type="button"
            onClick={handleExport}
            className="flex items-center gap-1.5 px-3 py-2 bg-white hover:bg-slate-100 text-black border-2 border-black text-xs font-black uppercase shadow-[2px_2px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 transition-all cursor-pointer"
            title="Export all customers to CSV"
          >
            <Download className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>Export CSV</span>
          </button>

          {/* Bulk CSV Upload */}
          <label className="relative cursor-pointer">
            <div className="flex items-center gap-1.5 px-3 py-2 bg-white hover:bg-slate-100 text-black border-2 border-black text-xs font-black uppercase shadow-[2px_2px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 transition-all">
              {isUploading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Upload className="w-3.5 h-3.5 stroke-[2.5]" />}
              <span>{isUploading ? 'Importing...' : 'Bulk CSV'}</span>
            </div>
            <input 
              type="file" 
              accept=".csv" 
              className="hidden" 
              onChange={handleFileUpload} 
              disabled={isUploading} 
            />
          </label>

          {/* New Customer */}
          <button 
            type="button"
            onClick={() => { setEditingCustomer(null); setIsFormOpen(true); }}
            className="flex items-center gap-2 px-4 py-2 bg-emerald-400 hover:bg-emerald-300 text-black border-2 border-black text-xs font-black uppercase shadow-[2px_2px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>New Customer</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 border-2 sm:border-4 border-black shadow-[6px_6px_0px_#000] flex flex-wrap items-center justify-between gap-3">
        {/* Search */}
        <div className="relative flex-1 min-w-[240px] max-w-md">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
          <input 
            type="text" 
            placeholder="Search by name, phone, or owner..." 
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full text-xs font-bold text-black bg-white pl-9 pr-3 py-2 border-2 border-black focus:outline-none focus:bg-amber-50 placeholder-slate-400"
          />
        </div>

        {/* Source Filter Pills */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => setSourceFilter('ALL')}
            className={`px-3 py-1.5 text-xs font-black uppercase border-2 border-black transition-all cursor-pointer ${
              sourceFilter === 'ALL'
                ? 'bg-black text-white shadow-[2px_2px_0px_#000]'
                : 'bg-white text-black hover:bg-slate-100'
            }`}
          >
            All ({customers.length})
          </button>
          <button
            type="button"
            onClick={() => setSourceFilter('CONVERTED')}
            className={`px-3 py-1.5 text-xs font-black uppercase border-2 border-black transition-all cursor-pointer ${
              sourceFilter === 'CONVERTED'
                ? 'bg-amber-300 text-black shadow-[2px_2px_0px_#000]'
                : 'bg-white text-black hover:bg-slate-100'
            }`}
          >
            Converted Leads ({convertedCount})
          </button>
          <button
            type="button"
            onClick={() => setSourceFilter('DIRECT')}
            className={`px-3 py-1.5 text-xs font-black uppercase border-2 border-black transition-all cursor-pointer ${
              sourceFilter === 'DIRECT'
                ? 'bg-cyan-300 text-black shadow-[2px_2px_0px_#000]'
                : 'bg-white text-black hover:bg-slate-100'
            }`}
          >
            Direct / Manual ({directCount})
          </button>
        </div>
      </div>

      {/* Main Customers Table Container */}
      {isLoading ? (
        <div className="py-20 flex flex-col items-center justify-center gap-3 bg-white border-2 sm:border-4 border-black shadow-[6px_6px_0px_#000]">
          <Loader2 className="w-8 h-8 text-black animate-spin" />
          <p className="text-xs text-black font-black uppercase tracking-wider">Loading customers directory...</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-white border-2 sm:border-4 border-black p-12 flex flex-col items-center justify-center text-center shadow-[6px_6px_0px_#000]">
          <div className="w-16 h-16 bg-amber-300 border-2 border-black shadow-[3px_3px_0px_#000] flex items-center justify-center mb-4">
            <Users className="w-8 h-8 text-black stroke-[2]" />
          </div>
          <h3 className="text-base font-black uppercase tracking-wider text-black mb-1">No Customers Found</h3>
          <p className="text-xs font-bold text-slate-600 max-w-md uppercase mb-5">
            {searchTerm || sourceFilter !== 'ALL'
              ? 'No customers match your active search or filter criteria.'
              : 'You have not added any customers yet. Convert leads from the All Leads page or click New Customer to register directly.'}
          </p>
          <button 
            onClick={() => { setEditingCustomer(null); setIsFormOpen(true); }}
            className="flex items-center gap-2 px-4 py-2.5 bg-emerald-400 hover:bg-emerald-300 text-black border-2 border-black text-xs font-black uppercase shadow-[2px_2px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4 stroke-[3]" /> Add First Customer
          </button>
        </div>
      ) : (
        <div className="bg-white border-2 sm:border-4 border-black shadow-[6px_6px_0px_#000] overflow-hidden">
          <div className="overflow-x-auto custom-scrollbar">
            <table className="w-full text-left border-collapse min-w-[750px]">
              <thead>
                <tr className="bg-black text-white border-b-2 border-black">
                  <th className="px-4 py-3 text-[11px] font-black uppercase tracking-wider">Business / Client</th>
                  <th className="px-4 py-3 text-[11px] font-black uppercase tracking-wider">Source Origin</th>
                  <th className="px-4 py-3 text-[11px] font-black uppercase tracking-wider">Contact Details</th>
                  <th className="px-4 py-3 text-[11px] font-black uppercase tracking-wider text-center">Membership Tier</th>
                  <th className="px-4 py-3 text-[11px] font-black uppercase tracking-wider text-right">Loyalty Points</th>
                  <th className="px-4 py-3 text-[11px] font-black uppercase tracking-wider text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y-2 divide-black/10">
                {filtered.map((customer) => {
                  const isConverted = customer.source === 'Converted Lead';

                  return (
                    <tr key={customer.id} className="hover:bg-amber-50/60 transition-colors">
                      {/* Business / Client */}
                      <td className="px-4 py-3.5">
                        <div className="flex items-start gap-2">
                          <div>
                            <p className="text-xs font-black text-black">{customer.businessName}</p>
                            <div className="flex items-center gap-1.5 mt-0.5">
                              <span className="px-1.5 py-0.5 text-[9px] font-black uppercase bg-slate-100 border border-black text-black">
                                {customer.businessType || 'Other'}
                              </span>
                              {customer.customerSince && (
                                <span className="text-[10px] font-bold text-slate-500">
                                  Since {customer.customerSince}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Source Origin */}
                      <td className="px-4 py-3.5">
                        {isConverted ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-amber-300 text-black border border-black text-[10px] font-black uppercase tracking-wider shadow-[1px_1px_0px_#000]">
                            <ArrowRightLeft className="w-3 h-3 stroke-[2.5]" /> Converted Lead
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-cyan-100 text-black border border-black text-[10px] font-black uppercase tracking-wider">
                            <UserCheck className="w-3 h-3 stroke-[2.5]" /> {customer.source || 'Direct Client'}
                          </span>
                        )}
                      </td>

                      {/* Contact Details */}
                      <td className="px-4 py-3.5">
                        <div className="space-y-0.5">
                          <p className="text-xs font-black text-black flex items-center gap-1">
                            <Phone className="w-3 h-3 text-slate-500" />
                            <a href={`tel:${customer.phone}`} className="hover:underline">
                              {customer.phone}
                            </a>
                          </p>
                          {customer.ownerName && (
                            <p className="text-[11px] font-bold text-slate-600">
                              {customer.ownerName}
                            </p>
                          )}
                          {customer.address && (
                            <p className="text-[10px] font-bold text-slate-500 flex items-center gap-1">
                              <MapPin className="w-2.5 h-2.5" />
                              {customer.address}
                            </p>
                          )}
                        </div>
                      </td>

                      {/* Membership Tier */}
                      <td className="px-4 py-3.5 text-center">
                        <span className={`inline-block px-2.5 py-0.5 text-[10px] font-black uppercase border-2 ${tierColors[customer.loyaltyTier] || 'bg-slate-100 text-black border-black'}`}>
                          {customer.loyaltyTier}
                        </span>
                      </td>

                      {/* Loyalty Points */}
                      <td className="px-4 py-3.5 text-right">
                        <button 
                          onClick={() => { setSelectedCustomer(customer); setIsLoyaltyOpen(true); }}
                          className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-amber-300 hover:bg-amber-400 text-black border-2 border-black text-[11px] font-black uppercase shadow-[2px_2px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 transition-all cursor-pointer"
                          title="Manage loyalty points & history"
                        >
                          <Star className="w-3.5 h-3.5 fill-black text-black" />
                          <span>{customer.loyaltyPoints} PTS</span>
                        </button>
                      </td>

                      {/* Actions */}
                      <td className="px-4 py-3.5 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button 
                            type="button"
                            onClick={() => { setEditingCustomer(customer); setIsFormOpen(true); }}
                            className="p-1.5 bg-white hover:bg-amber-300 text-black border-2 border-black transition-all cursor-pointer shadow-[2px_2px_0px_#000] active:translate-x-0.5 active:translate-y-0.5"
                            title="Edit Customer"
                          >
                            <Edit2 className="w-3.5 h-3.5 stroke-[2.5]" />
                          </button>
                          <button 
                            type="button"
                            onClick={() => setDeletingCustomer(customer)}
                            className="p-1.5 bg-white hover:bg-red-500 hover:text-white text-black border-2 border-black transition-all cursor-pointer shadow-[2px_2px_0px_#000] active:translate-x-0.5 active:translate-y-0.5"
                            title="Delete Customer"
                          >
                            <Trash2 className="w-3.5 h-3.5 stroke-[2.5]" />
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

      {/* Customer Form Modal */}
      <CustomerFormModal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        initialData={editingCustomer}
        onSave={handleSaveCustomer}
      />

      {/* Customer Loyalty Modal */}
      <CustomerLoyaltyModal
        isOpen={isLoyaltyOpen}
        onClose={() => setIsLoyaltyOpen(false)}
        customer={selectedCustomer}
        onUpdate={loadData}
      />

      {/* Delete Confirmation Dialog */}
      <DeleteConfirmModal
        isOpen={!!deletingCustomer}
        title="Delete Customer"
        itemName={deletingCustomer?.businessName || 'this customer'}
        onCancel={() => setDeletingCustomer(null)}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
};
