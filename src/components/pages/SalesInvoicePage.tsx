import { Product } from "@/types/inventory";
import { getProducts } from "@/lib/inventoryStorage";
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { DailySale, SalesClient } from '@/types/sales';
import { getSalesInvoices, addSalesInvoice, updateSalesInvoice, deleteSalesInvoice, getSalesClients } from '@/lib/salesStorage';
import { SalesInvoiceFormModal } from '../sales/SalesInvoiceFormModal';
import { PrintChalanModal } from '../sales/PrintChalanModal';
import { PrintInvoiceModal } from '../sales/PrintInvoiceModal';
import { Plus, Search, Loader2, Edit, Trash2, ChevronLeft, ChevronRight, Printer, FileText } from 'lucide-react';

interface Props {
  showToast: (msg: string, type: 'success'|'error') => void;
}

export const SalesInvoicePage: React.FC<Props> = ({ showToast }) => {
  const { user } = useAuth();
  const [invoices, setInvoices] = useState<DailySale[]>([]);
  const [clients, setClients] = useState<SalesClient[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingInvoice, setEditingInvoice] = useState<DailySale | null>(null);

  const [printingChalan, setPrintingChalan] = useState<DailySale | null>(null);
  const [printingInvoice, setPrintingInvoice] = useState<DailySale | null>(null);

  useEffect(() => {
    if (user) loadData();
  }, [user]);

  const loadData = async () => {
    if (!user) return;
    setIsLoading(true);
    try {
      const [invData, cliData, prodData] = await Promise.all([
        getSalesInvoices(user.uid),
        getSalesClients(user.uid),
        getProducts(user.uid),
        getProducts(user.uid)
      ]);
      setInvoices(invData);
      setClients(cliData);
      setProducts(prodData);
    } catch (err) {
      console.error(err);
      showToast('Failed to load data', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveInvoice = async (data: Omit<DailySale, 'id' | 'userId' | 'createdAt' | 'updatedAt'>) => {
    if (!user) return;
    try {
      if (editingInvoice) {
        await updateSalesInvoice(editingInvoice.id, data);
        showToast('Invoice updated', 'success');
      } else {
        await addSalesInvoice({ ...data, userId: user.uid });
        showToast('Invoice created', 'success');
      }
      loadData();
    } catch (err) {
      console.error(err);
      showToast('Error saving invoice', 'error');
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Delete this invoice?")) return;
    try {
      await deleteSalesInvoice(id);
      showToast('Invoice deleted', 'success');
      loadData();
    } catch (err) {
      console.error(err);
      showToast('Error deleting invoice', 'error');
    }
  };

  const filteredInvoices = invoices.filter(i => 
    i.invoiceNo.toLowerCase().includes(searchQuery.toLowerCase()) || 
    i.clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    i.companyName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="w-full mx-auto pb-20">
      
      {/* Header */}
      <div className="bg-slate-900 p-4 border-b border-slate-800 shadow-sm flex flex-wrap items-center justify-between gap-4 rounded-t-lg">
        <h2 className="text-lg font-bold text-white uppercase tracking-wider">DAILY SALES</h2>
        
        <div className="flex items-center gap-2">
          <input type="text" placeholder="Invoice No." className="border border-slate-700 rounded px-3 py-1.5 text-sm bg-slate-950 text-white focus:outline-none focus:border-[#20B2AA] w-32" />
          <button className="p-1.5 bg-[#FFC107] text-white hover:bg-[#E0A800] rounded transition-colors"><Edit className="w-4 h-4" /></button>
          <input type="date" className="border border-slate-700 rounded px-3 py-1.5 text-sm bg-slate-950 text-white focus:outline-none focus:border-[#20B2AA]" />
          <select className="border border-slate-700 rounded px-3 py-1.5 text-sm bg-slate-950 text-white focus:outline-none">
            <option>All</option>
          </select>
          <button 
            onClick={() => { setEditingInvoice(null); setIsFormOpen(true); }} 
            className="px-4 py-1.5 bg-[#20B2AA] text-white rounded text-sm font-bold shadow hover:bg-[#1A9C96] transition-colors uppercase tracking-wider ml-2"
          >
            ADD NEW
          </button>
        </div>
      </div>

      {/* Main Container */}
      <div className="bg-slate-900 border border-t-0 border-slate-800 rounded-b-lg shadow-sm overflow-hidden">
        
        <div className="p-4 flex flex-wrap justify-between items-center gap-4 border-b border-slate-800">
          <div className="flex items-center gap-2 text-sm text-slate-400">
            <span>Show</span>
            <select 
              value={entriesPerPage}
              onChange={(e) => setEntriesPerPage(Number(e.target.value))}
              className="border border-slate-700 rounded px-2 py-1 bg-slate-950 text-white focus:outline-none"
            >
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
            </select>
            <span>entries</span>
          </div>
          
          <div className="flex items-center gap-2">
            <span className="text-sm text-slate-400">Search:</span>
            <input 
              type="text" 
              value={searchQuery} 
              onChange={(e) => setSearchQuery(e.target.value)} 
              className="w-48 bg-slate-950 border border-slate-700 text-white text-sm rounded px-3 py-1 focus:outline-none focus:border-[#20B2AA]" 
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
              <thead className="text-xs text-slate-200 bg-slate-800/80 font-bold border-b border-slate-700">
                <tr>
                  <th className="px-4 py-3 w-10 text-center">
                    <input type="checkbox" className="rounded border-slate-300 dark:border-slate-600" />
                  </th>
                  <th className="px-4 py-3">Company</th>
                  <th className="px-4 py-3">Invoice</th>
                  <th className="px-4 py-3">Date</th>
                  <th className="px-4 py-3">Client</th>
                  <th className="px-4 py-3">Client Code</th>
                  <th className="px-4 py-3">Store</th>
                  <th className="px-4 py-3">Amount</th>
                  <th className="px-4 py-3">Type</th>
                  <th className="px-4 py-3">Sales By</th>
                  <th className="px-4 py-3 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/50">
                {filteredInvoices.map((i) => (
                  <tr key={i.id} className="hover:bg-slate-800/30 transition-colors">
                    <td className="px-4 py-3 text-center">
                      <input type="checkbox" className="rounded border-slate-300 dark:border-slate-600" />
                    </td>
                    <td className="px-4 py-3 text-slate-400">{i.companyName}</td>
                    <td className="px-4 py-3">{i.invoiceNo}</td>
                    <td className="px-4 py-3">{new Date(i.date).toLocaleDateString('en-GB', {day: '2-digit', month: '2-digit', year: 'numeric'}).replace(/\//g, '-')}</td>
                    <td className="px-4 py-3 font-medium">{i.clientName}</td>
                    <td className="px-4 py-3">{i.clientCode}</td>
                    <td className="px-4 py-3">{i.storeName}</td>
                    <td className="px-4 py-3">{i.totalAmount.toFixed(2)}</td>
                    <td className="px-4 py-3">{i.type}</td>
                    <td className="px-4 py-3">{i.salesBy}</td>
                    <td className="px-4 py-3 text-center flex items-center justify-center gap-1.5">
                      <button onClick={() => { setEditingInvoice(i); setIsFormOpen(true); }} className="p-1.5 bg-[#FFC107] text-white hover:bg-[#E0A800] rounded">
                        <Edit className="w-3.5 h-3.5" />
                      </button>
                      <button onClick={() => setPrintingChalan(i)} className="p-1.5 bg-[#00BFFF] text-white hover:bg-[#009ACD] rounded">
                        <Printer className="w-3.5 h-3.5" />
                      </button>
                      <button onClick={() => setPrintingInvoice(i)} className="p-1.5 bg-[#AB82FF] text-white hover:bg-[#8968CD] rounded">
                        <FileText className="w-3.5 h-3.5" />
                      </button>
                      <button onClick={() => handleDelete(i.id)} className="p-1.5 bg-[#DC3545] text-white hover:bg-[#C82333] rounded">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
                
                {filteredInvoices.length > 0 && (
                  <tr className="bg-slate-900/30">
                    <td className="px-4 py-3 text-center border-t border-slate-800">
                      <input type="checkbox" className="rounded border-slate-300 dark:border-slate-600" />
                    </td>
                    <td colSpan={9} className="border-t border-slate-800"></td>
                    <td className="px-4 py-3 text-center border-t border-slate-800 flex justify-center">
                      <button className="px-3 py-1 bg-[#DC3545] text-white text-xs font-bold rounded shadow-sm hover:bg-[#C82333]">
                        Delete
                      </button>
                    </td>
                  </tr>
                )}
                
                {filteredInvoices.length === 0 && (
                  <tr>
                    <td colSpan={11} className="px-4 py-8 text-center text-slate-500 dark:text-slate-400">
                      No invoices found matching your criteria.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        <div className="p-4 flex items-center justify-between text-sm text-slate-500 dark:text-slate-400">
          <span>Showing 1 to {filteredInvoices.length} of {filteredInvoices.length} entries</span>
          <div className="flex items-center gap-1">
            <button className="p-1.5 border border-slate-700 rounded bg-slate-800 hover:bg-slate-700 disabled:opacity-50" disabled><ChevronLeft className="w-4 h-4" /></button>
            <button className="px-3 py-1.5 bg-[#20B2AA] text-white rounded font-bold">1</button>
            <button className="p-1.5 border border-slate-700 rounded bg-slate-800 hover:bg-slate-700 disabled:opacity-50" disabled><ChevronRight className="w-4 h-4" /></button>
          </div>
        </div>

      </div>

      <SalesInvoiceFormModal 
        isOpen={isFormOpen} 
        onClose={() => setIsFormOpen(false)} 
        onSave={handleSaveInvoice}
        initialData={editingInvoice}
        clients={clients}
        products={products}
      />

      <PrintChalanModal 
        isOpen={!!printingChalan}
        onClose={() => setPrintingChalan(null)}
        invoice={printingChalan}
      />

      <PrintInvoiceModal
        isOpen={!!printingInvoice}
        onClose={() => setPrintingInvoice(null)}
        invoice={printingInvoice}
      />
    </div>
  );
};
