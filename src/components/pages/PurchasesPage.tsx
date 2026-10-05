import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { PurchaseOrder } from '@/types/accounts';
import { Product } from '@/types/inventory';
import { getPurchaseOrders, createPurchaseOrder, receivePurchaseOrder } from '@/lib/accountsStorage';
import { getProducts } from '@/lib/inventoryStorage';
import { Truck, Plus, Loader2, CheckCircle, Package } from 'lucide-react';

interface Props {
  showToast: (msg: string, type: 'success'|'error') => void;
}

export const PurchasesPage: React.FC<Props> = ({ showToast }) => {
  const { user } = useAuth();
  const [pos, setPos] = useState<PurchaseOrder[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // New PO State
  const [showForm, setShowForm] = useState(false);
  const [supplierName, setSupplierName] = useState('');
  const [selectedProductId, setSelectedProductId] = useState('');
  const [poItems, setPoItems] = useState<{productId: string, name: string, quantity: number, price: number, total: number}[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (user) loadData();
  }, [user]);

  const loadData = async () => {
    if (!user) return;
    setIsLoading(true);
    try {
      const [poData, pData] = await Promise.all([getPurchaseOrders(user.uid), getProducts(user.uid)]);
      setPos(poData);
      setProducts(pData);
    } catch (err) {
      console.error(err);
      showToast('Failed to load purchase orders', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const addItemToPO = () => {
    const product = products.find(p => p.id === selectedProductId);
    if (!product) return;
    if (poItems.find(i => i.productId === product.id)) {
      showToast('Product already in PO', 'error');
      return;
    }
    setPoItems([...poItems, { productId: product.id, name: product.name, quantity: 1, price: product.cost, total: product.cost }]);
    setSelectedProductId('');
  };

  const updatePOItem = (productId: string, field: 'quantity' | 'price', val: number) => {
    setPoItems(prev => prev.map(i => {
      if (i.productId === productId) {
        const updated = { ...i, [field]: val };
        updated.total = updated.quantity * updated.price;
        return updated;
      }
      return i;
    }));
  };

  const handleSavePO = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || poItems.length === 0) return;
    setIsSubmitting(true);
    try {
      await createPurchaseOrder({
        userId: user.uid,
        supplierName,
        items: poItems,
        totalCost: poItems.reduce((acc, i) => acc + i.total, 0),
        date: new Date().toISOString().split('T')[0]
      });
      showToast('Purchase Order created', 'success');
      setShowForm(false);
      setSupplierName(''); setPoItems([]);
      loadData();
    } catch (err) {
      console.error(err);
      showToast('Error creating PO', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReceivePO = async (poId: string) => {
    if (!user || !window.confirm("Receive stock and log expense?")) return;
    try {
      await receivePurchaseOrder(poId, user.uid);
      showToast('Stock received and expense logged', 'success');
      loadData();
    } catch (err: any) {
      console.error(err);
      showToast(err.message || 'Error receiving PO', 'error');
    }
  };

  return (
    <div className="w-full mx-auto space-y-6 pb-20">
      
      <div className="bg-slate-900 p-4 sm:p-5 rounded-md border border-slate-800 shadow-md flex flex-wrap items-center justify-between gap-4 text-white">
        <div>
          <div className="flex flex-wrap items-center gap-2.5">
            <span className="w-2.5 h-2.5 rounded-full bg-primary-500"></span>
            <h2 className="text-lg font-bold text-white">Purchase Orders</h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">Order stock from suppliers and manage inventory inflow.</p>
        </div>
        <button onClick={() => setShowForm(!showForm)} className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-500 transition-colors text-xs font-bold shadow-md shadow-primary-950">
          <Plus className="w-4 h-4" /> Create PO
        </button>
      </div>

      {showForm && (
        <div className="bg-slate-900 border border-slate-800 rounded-md shadow-md p-5 animate-in slide-in-from-top-2">
          <h3 className="text-sm font-bold text-white mb-4">New Purchase Order</h3>
          <form onSubmit={handleSavePO} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Supplier Name*</label>
              <input type="text" value={supplierName} onChange={e => setSupplierName(e.target.value)} className="w-full text-sm bg-slate-950 px-3 py-2 rounded-md border border-slate-700 text-white focus:border-primary-500" required />
            </div>
            
            <div className="p-4 border border-slate-800 rounded-md bg-slate-950/50">
              <label className="block text-xs font-semibold text-slate-300 mb-2">Add Products</label>
              <div className="flex gap-2 mb-4">
                <select value={selectedProductId} onChange={e => setSelectedProductId(e.target.value)} className="flex-1 text-sm bg-slate-900 px-3 py-2 rounded-md border border-slate-700 text-white">
                  <option value="">Select product...</option>
                  {products.map(p => <option key={p.id} value={p.id}>{p.name} (Cost: ৳{p.cost})</option>)}
                </select>
                <button type="button" onClick={addItemToPO} disabled={!selectedProductId} className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-white text-sm font-bold rounded-md disabled:opacity-50">Add</button>
              </div>

              {poItems.length > 0 && (
                <div className="space-y-2">
                  {poItems.map(item => (
                    <div key={item.productId} className="flex flex-wrap items-center gap-3 bg-slate-900 p-3 rounded border border-slate-800">
                      <span className="flex-1 text-sm font-bold text-white min-w-[120px]">{item.name}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-slate-400">Qty:</span>
                        <input type="number" value={item.quantity} onChange={e => updatePOItem(item.productId, 'quantity', Number(e.target.value))} className="w-16 text-sm bg-slate-950 px-2 py-1 rounded border border-slate-700 text-white" min="1" />
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-slate-400">Unit Cost (৳):</span>
                        <input type="number" value={item.price} onChange={e => updatePOItem(item.productId, 'price', Number(e.target.value))} className="w-20 text-sm bg-slate-950 px-2 py-1 rounded border border-slate-700 text-white" min="0" />
                      </div>
                      <span className="font-bold text-emerald-400 w-24 text-right">৳ {item.total}</span>
                    </div>
                  ))}
                  <div className="text-right pt-2 font-black text-white text-lg">Total PO: ৳ {poItems.reduce((acc, i) => acc + i.total, 0)}</div>
                </div>
              )}
            </div>

            <div className="flex justify-end">
              <button type="submit" disabled={isSubmitting || poItems.length === 0} className="px-5 py-2 bg-primary-600 hover:bg-primary-500 text-white text-sm font-bold rounded-md disabled:opacity-50">
                {isSubmitting ? 'Saving...' : 'Confirm PO'}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-slate-900 border border-slate-800 rounded-md shadow-md overflow-hidden">
        <div className="p-4 border-b border-slate-800 bg-slate-900/50">
          <h3 className="text-sm font-bold text-white">Purchase Orders History</h3>
        </div>

        {isLoading ? (
          <div className="py-20 flex flex-col items-center gap-3"><Loader2 className="w-8 h-8 text-primary-500 animate-spin" /></div>
        ) : (
          <div className="divide-y divide-slate-800/50">
            {pos.map(po => (
              <div key={po.id} className="p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-slate-800/30 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-slate-800 rounded-lg text-slate-400"><Truck className="w-6 h-6" /></div>
                  <div>
                    <h4 className="text-sm font-bold text-white">{po.supplierName}</h4>
                    <p className="text-[10px] text-slate-400 font-mono mt-0.5">{po.items.length} items • Date: {po.date}</p>
                    <div className="mt-1 flex gap-1">
                      {po.status === 'Pending' ? (
                        <span className="text-[10px] bg-amber-500/10 text-amber-500 px-2 py-0.5 rounded font-bold uppercase tracking-wider">Pending</span>
                      ) : (
                        <span className="text-[10px] bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded font-bold uppercase tracking-wider">Received</span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span className="font-bold text-lg text-white">৳ {po.totalCost.toLocaleString()}</span>
                  {po.status === 'Pending' && (
                    <button onClick={() => handleReceivePO(po.id)} className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-md flex items-center gap-1.5 transition-colors">
                      <CheckCircle className="w-3.5 h-3.5" /> Receive
                    </button>
                  )}
                </div>
              </div>
            ))}
            {pos.length === 0 && <div className="p-10 text-center text-slate-500 dark:text-slate-400 text-sm">No purchase orders found.</div>}
          </div>
        )}
      </div>
    </div>
  );
};
