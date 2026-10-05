import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Product, Sale, OrderItem } from '@/types/inventory';
import { getProducts, getSales, processSale } from '@/lib/inventoryStorage';
import { ShoppingCart, Plus, Minus, Search, Loader2, CheckCircle } from 'lucide-react';

interface Props {
  showToast: (msg: string, type: 'success'|'error') => void;
}

export const SalesPage: React.FC<Props> = ({ showToast }) => {
  const { user } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [sales, setSales] = useState<Sale[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Cart State
  const [cart, setCart] = useState<OrderItem[]>([]);
  const [paymentMethod, setPaymentMethod] = useState<'Cash'|'Card'|'Mobile Banking'>('Cash');
  const [discount, setDiscount] = useState(0);

  useEffect(() => {
    if (user) loadData();
  }, [user]);

  const loadData = async () => {
    if (!user) return;
    try {
      const [pData, sData] = await Promise.all([getProducts(user.uid), getSales(user.uid)]);
      setProducts(pData);
      setSales(sData);
    } catch (err) {
      console.error(err);
      showToast('Failed to load data', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const addToCart = (product: Product) => {
    if (product.stock <= 0) {
      showToast('Out of stock', 'error');
      return;
    }
    setCart(prev => {
      const existing = prev.find(i => i.productId === product.id);
      if (existing) {
        if (existing.quantity >= product.stock) {
          showToast('Cannot exceed available stock', 'error');
          return prev;
        }
        return prev.map(i => i.productId === product.id ? { ...i, quantity: i.quantity + 1, total: (i.quantity + 1) * i.price } : i);
      }
      return [...prev, { productId: product.id, name: product.name, quantity: 1, price: product.price, total: product.price }];
    });
  };

  const removeFromCart = (productId: string) => {
    setCart(prev => prev.filter(i => i.productId !== productId));
  };

  const adjustQty = (productId: string, delta: number) => {
    setCart(prev => prev.map(i => {
      if (i.productId === productId) {
        const product = products.find(p => p.id === productId);
        const newQty = i.quantity + delta;
        if (newQty < 1) return i;
        if (product && newQty > product.stock) {
          showToast('Cannot exceed available stock', 'error');
          return i;
        }
        return { ...i, quantity: newQty, total: newQty * i.price };
      }
      return i;
    }));
  };

  const subtotal = cart.reduce((acc, item) => acc + item.total, 0);
  const total = Math.max(0, subtotal - discount);

  const handleCheckout = async () => {
    if (!user || cart.length === 0) return;
    setIsProcessing(true);
    try {
      await processSale({
        userId: user.uid,
        items: cart,
        subtotal,
        discount,
        total,
        paymentMethod,
        date: new Date().toISOString().split('T')[0]
      });
      showToast('Sale completed successfully!', 'success');
      setCart([]); setDiscount(0);
      loadData();
    } catch (err: any) {
      console.error(err);
      showToast(err.message || 'Error processing sale', 'error');
    } finally {
      setIsProcessing(false);
    }
  };

  const filteredProducts = products.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()) || p.sku.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <div className="w-full mx-auto pb-20 grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-100px)]">
      
      {/* Products Left Panel */}
      <div className="lg:col-span-2 flex flex-col bg-slate-900 border border-slate-800 rounded-md shadow-md overflow-hidden h-full">
        <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/50">
          <h2 className="text-lg font-bold text-white flex items-center gap-2"><ShoppingCart className="w-5 h-5 text-primary-400" /> Point of Sale</h2>
          <div className="relative w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 dark:text-slate-400" />
            <input type="text" placeholder="Search product or SKU..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full bg-slate-950 border border-slate-700 text-white text-sm rounded-md pl-9 pr-3 py-1.5 focus:border-primary-500 focus:ring-1 focus:ring-primary-500" />
          </div>
        </div>

        <div className="p-4 overflow-y-auto custom-scrollbar grid grid-cols-2 sm:grid-cols-3 gap-4 content-start">
          {isLoading ? (
            <div className="col-span-full py-10 text-center"><Loader2 className="w-8 h-8 text-primary-500 animate-spin mx-auto" /></div>
          ) : filteredProducts.map(p => (
            <button 
              key={p.id} 
              onClick={() => addToCart(p)}
              disabled={p.stock <= 0}
              className={`p-4 rounded-xl border text-left flex flex-col transition-all ${p.stock <= 0 ? 'bg-slate-900/50 border-slate-800 opacity-50 cursor-not-allowed' : 'bg-slate-950 border-slate-800 hover:border-primary-500/50 hover:bg-slate-900'}`}
            >
              <span className="text-xs font-mono text-slate-500 dark:text-slate-400 mb-1">{p.sku}</span>
              <span className="font-bold text-white mb-2 leading-tight">{p.name}</span>
              <div className="mt-auto flex items-end justify-between w-full">
                <span className="text-primary-400 font-black">৳ {p.price}</span>
                <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400">Stock: {p.stock}</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Cart Right Panel */}
      <div className="flex flex-col bg-slate-900 border border-slate-800 rounded-md shadow-md overflow-hidden h-full">
        <div className="p-4 border-b border-slate-800 bg-slate-900/50">
          <h2 className="text-base font-bold text-white">Current Order</h2>
        </div>

        <div className="flex-1 overflow-y-auto p-2 custom-scrollbar">
          {cart.length === 0 ? (
            <div className="text-center p-10 text-slate-500 dark:text-slate-400 text-sm">Cart is empty</div>
          ) : (
            <div className="space-y-2">
              {cart.map(item => (
                <div key={item.productId} className="bg-slate-950 p-3 rounded-lg border border-slate-800">
                  <div className="flex justify-between items-start mb-2">
                    <span className="font-bold text-sm text-white">{item.name}</span>
                    <button onClick={() => removeFromCart(item.productId)} className="text-rose-400 text-xs font-bold hover:underline">Remove</button>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <button onClick={() => adjustQty(item.productId, -1)} className="w-6 h-6 rounded-md bg-slate-800 text-slate-300 flex items-center justify-center hover:bg-slate-700"><Minus className="w-3 h-3" /></button>
                      <span className="text-sm font-bold text-white w-4 text-center">{item.quantity}</span>
                      <button onClick={() => adjustQty(item.productId, 1)} className="w-6 h-6 rounded-md bg-slate-800 text-slate-300 flex items-center justify-center hover:bg-slate-700"><Plus className="w-3 h-3" /></button>
                    </div>
                    <span className="font-bold text-emerald-400">৳ {item.total}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="p-4 bg-slate-950 border-t border-slate-800 space-y-4">
          <div className="flex items-center justify-between text-sm">
            <span className="text-slate-400 font-semibold">Subtotal</span>
            <span className="text-white font-bold">৳ {subtotal}</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-slate-400 font-semibold">Discount</span>
            <input type="number" value={discount} onChange={e => setDiscount(Number(e.target.value))} className="w-20 bg-slate-900 border border-slate-700 rounded text-right px-2 py-1 text-white text-sm" />
          </div>
          <div className="border-t border-dashed border-slate-700 pt-3 flex items-center justify-between">
            <span className="text-slate-300 font-bold">Total</span>
            <span className="text-xl font-black text-emerald-400">৳ {total}</span>
          </div>

          <div className="pt-2">
            <p className="text-xs text-slate-400 font-semibold mb-2">Payment Method</p>
            <div className="grid grid-cols-3 gap-2">
              {['Cash', 'Card', 'Mobile Banking'].map(method => (
                <button 
                  key={method} 
                  onClick={() => setPaymentMethod(method as any)}
                  className={`py-2 text-[10px] font-bold rounded-md uppercase tracking-wide transition-colors ${paymentMethod === method ? 'bg-primary-600 text-white' : 'bg-slate-800 text-slate-400 hover:bg-slate-700'}`}
                >
                  {method === 'Mobile Banking' ? 'Mobile' : method}
                </button>
              ))}
            </div>
          </div>

          <button 
            onClick={handleCheckout} 
            disabled={cart.length === 0 || isProcessing}
            className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-lg transition-colors disabled:opacity-50 flex justify-center items-center gap-2"
          >
            {isProcessing ? <Loader2 className="w-5 h-5 animate-spin" /> : <><CheckCircle className="w-5 h-5" /> Checkout</>}
          </button>
        </div>
      </div>
    </div>
  );
};
