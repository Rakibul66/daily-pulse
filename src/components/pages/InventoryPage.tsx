import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Product } from '@/types/inventory';
import { getProducts, addProduct, updateProduct, deleteProduct } from '@/lib/inventoryStorage';
import { ProductFormModal } from '../inventory/ProductFormModal';
import { Plus, Package, AlertTriangle, Loader2, Edit, Trash2, Search } from 'lucide-react';

interface Props {
  showToast: (msg: string, type: 'success'|'error') => void;
}

export const InventoryPage: React.FC<Props> = ({ showToast }) => {
  const { user } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  useEffect(() => {
    if (user) loadData();
  }, [user]);

  const loadData = async () => {
    if (!user) return;
    setIsLoading(true);
    try {
      const data = await getProducts(user.uid);
      setProducts(data);
    } catch (err) {
      console.error(err);
      showToast('Failed to load inventory', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveProduct = async (data: Omit<Product, 'id' | 'userId' | 'createdAt' | 'updatedAt'>) => {
    if (!user) return;
    try {
      if (editingProduct) {
        await updateProduct(editingProduct.id, data);
        showToast('Product updated', 'success');
      } else {
        await addProduct({ ...data, userId: user.uid });
        showToast('Product added', 'success');
      }
      loadData();
    } catch (err) {
      console.error(err);
      showToast('Error saving product', 'error');
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;
    try {
      await deleteProduct(id);
      showToast('Product deleted', 'success');
      loadData();
    } catch (err) {
      console.error(err);
      showToast('Error deleting product', 'error');
    }
  };

  const totalValue = products.reduce((acc, p) => acc + (p.stock * p.cost), 0);
  const lowStockItems = products.filter(p => p.stock <= p.minStock);

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    p.sku.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="w-full mx-auto space-y-6 pb-20">
      
      <div className="bg-slate-900 p-4 sm:p-5 rounded-md border border-slate-800 shadow-md flex flex-wrap items-center justify-between gap-4 text-white">
        <div>
          <div className="flex flex-wrap items-center gap-2.5">
            <span className="w-2.5 h-2.5 rounded-full bg-primary-500"></span>
            <h2 className="text-lg font-bold text-white">Inventory Management</h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">Track stock levels and product catalog.</p>
        </div>
        <button onClick={() => { setEditingProduct(null); setIsFormOpen(true); }} className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-500 transition-colors text-xs font-bold shadow-md shadow-primary-950">
          <Plus className="w-4 h-4" /> Add Product
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-slate-900 rounded-md border border-slate-800 p-5 shadow-md flex flex-col justify-center">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Total Items</p>
          <p className="text-2xl font-black text-white">{products.length}</p>
        </div>
        <div className="bg-slate-900 rounded-md border border-slate-800 p-5 shadow-md flex flex-col justify-center">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Inventory Value (Cost)</p>
          <p className="text-2xl font-black text-emerald-400">৳ {totalValue.toLocaleString()}</p>
        </div>
        <div className="bg-slate-900 rounded-md border border-slate-800 p-5 shadow-md flex flex-col justify-center border-l-4 border-l-rose-500">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-2"><AlertTriangle className="w-4 h-4 text-rose-500" /> Low Stock Alerts</p>
          <p className="text-2xl font-black text-white">{lowStockItems.length}</p>
        </div>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-md shadow-md overflow-hidden">
        <div className="p-4 border-b border-slate-800 bg-slate-900/50 flex flex-wrap justify-between items-center gap-4">
          <h3 className="text-sm font-bold text-white flex items-center gap-2"><Package className="w-4 h-4 text-primary-400" /> Product Catalog</h3>
          <div className="relative w-full max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 dark:text-slate-400" />
            <input type="text" placeholder="Search product or SKU..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full bg-slate-950 border border-slate-700 text-white text-sm rounded-md pl-9 pr-3 py-1.5 focus:border-primary-500 focus:ring-1 focus:ring-primary-500" />
          </div>
        </div>

        {isLoading ? (
          <div className="py-20 flex flex-col items-center gap-3"><Loader2 className="w-8 h-8 text-primary-500 animate-spin" /><p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Loading inventory...</p></div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-300">
              <thead className="text-xs text-slate-400 bg-slate-950/50 uppercase border-b border-slate-800">
                <tr>
                  <th className="px-6 py-4 font-semibold">Product Info</th>
                  <th className="px-6 py-4 font-semibold text-right">Price</th>
                  <th className="px-6 py-4 font-semibold text-right">Stock</th>
                  <th className="px-6 py-4 text-right font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/50">
                {filteredProducts.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-800/30 transition-colors group">
                    <td className="px-6 py-4">
                      <p className="font-bold text-white">{p.name}</p>
                      <p className="text-[10px] text-slate-500 dark:text-slate-400 font-mono mt-0.5">SKU: {p.sku} • {p.category}</p>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <p className="font-bold text-white">৳ {p.price.toLocaleString()}</p>
                      <p className="text-[10px] text-slate-500 dark:text-slate-400">Cost: ৳ {p.cost.toLocaleString()}</p>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <span className={`px-2 py-1 text-[11px] font-bold rounded flex items-center justify-end gap-1.5 w-fit ml-auto ${p.stock <= p.minStock ? 'bg-rose-500/10 text-rose-400' : 'bg-emerald-500/10 text-emerald-400'}`}>
                        {p.stock <= p.minStock && <AlertTriangle className="w-3 h-3" />} {p.stock}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => { setEditingProduct(p); setIsFormOpen(true); }} className="p-1.5 text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 rounded transition-colors"><Edit className="w-4 h-4" /></button>
                        <button onClick={() => handleDelete(p.id)} className="p-1.5 text-slate-400 hover:text-rose-400 bg-slate-800 hover:bg-rose-950 rounded transition-colors"><Trash2 className="w-4 h-4" /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <ProductFormModal isOpen={isFormOpen} onClose={() => setIsFormOpen(false)} initialData={editingProduct} onSave={handleSaveProduct} />
    </div>
  );
};
