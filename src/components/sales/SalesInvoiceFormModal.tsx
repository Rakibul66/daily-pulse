import React, { useState, useEffect } from 'react';
import { DailySale, DailySaleItem, SalesClient } from '@/types/sales';
import { Product } from '@/types/inventory';
import { X, Trash2 } from 'lucide-react';
import { withActionLock } from '@/lib/rateLimit';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  clients: SalesClient[];
  products: Product[];
  onSave: (sale: Omit<DailySale, 'id' | 'userId' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  initialData?: DailySale | null;
}

export const SalesInvoiceFormModal: React.FC<Props> = ({ isOpen, onClose, clients, products, onSave, initialData }) => {
  const [clientId, setClientId] = useState('');
  const [storeName, setStoreName] = useState('Shankhari Bazar');
  const [type, setType] = useState('Credit');
  const [salesBy, setSalesBy] = useState('Admin'); // Secondary text field
  const [salesMethod, setSalesMethod] = useState('By Manual'); // "Sales By" dropdown
  const [staff, setStaff] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [items, setItems] = useState<DailySaleItem[]>([]);
  
  const [discountType, setDiscountType] = useState<'fix' | 'percent'>('fix');
  const [discountValue, setDiscountValue] = useState(0);

  const [isSubmitting, setIsSubmitting] = useState(false);

  // Product Selection State
  const [selectedProductId, setSelectedProductId] = useState('');
  const [selectedQty, setSelectedQty] = useState(1);
  const [currentStock, setCurrentStock] = useState(0);
  const [creditLimit, setCreditLimit] = useState(0); // Dummy for now

  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        setClientId(initialData.clientId);
        setStoreName(initialData.storeName);
        setType(initialData.type);
        setSalesBy(initialData.salesBy);
        setDate(initialData.date);
        setItems(initialData.items || []);
        setDiscountType('fix');
        setDiscountValue(initialData.discountAmount);
      } else {
        setClientId('');
        setStoreName('Shankhari Bazar');
        setType('Credit');
        setSalesBy('Admin');
        setDate(new Date().toISOString().split('T')[0]);
        setItems([]);
        setDiscountType('fix');
        setDiscountValue(0);
      }
      setSelectedProductId('');
      setSelectedQty(1);
      setCurrentStock(0);
    }
  }, [isOpen, initialData]);

  useEffect(() => {
    const prod = products.find(p => p.id === selectedProductId);
    if (prod) {
      setCurrentStock(prod.stock);
    } else {
      setCurrentStock(0);
    }
  }, [selectedProductId, products]);

  const handleAddProduct = () => {
    const prod = products.find(p => p.id === selectedProductId);
    if (!prod) return;
    
    setItems([
      ...items,
      {
        id: Math.random().toString(36).substr(2, 9),
        productName: prod.name,
        itemCode: prod.sku,
        quantity: selectedQty,
        unit: 'KG', // fallback, could be from product
        rate: prod.price,
        amount: prod.price * selectedQty,
      }
    ]);

    setSelectedProductId('');
    setSelectedQty(1);
  };

  const handleRemoveItem = (id: string) => {
    setItems(items.filter(i => i.id !== id));
  };

  const totalAmount = items.reduce((sum, item) => sum + item.amount, 0);
  
  const discountAmount = discountType === 'fix' 
    ? Number(discountValue) 
    : (totalAmount * Number(discountValue)) / 100;
    
  const netPayable = totalAmount - discountAmount;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0) return alert('Please add at least one product');
    if (isSubmitting) return;
    
    const client = clients.find(c => c.id === clientId);
    if (!client) {
      return;
    }

    const invoiceNo = initialData?.invoiceNo || `STS${new Date().getFullYear()}${String(new Date().getMonth()+1).padStart(2,'0')}00${Math.floor(Math.random()*1000)}`;

    setIsSubmitting(true);
    try {
      await withActionLock('invoice_save', 2000, async () => {
        await onSave({
          companyName: 'M/S Buyzid Rubber',
          invoiceNo,
          date,
          clientId: client.id,
          clientName: client.clientName,
          clientCode: client.code,
          clientPhone: client.phone,
          clientAddress: client.address,
          storeName,
          type,
          salesBy,
          items,
          totalAmount,
          discountAmount,
          netInvoiceAmount: netPayable,
          openingBalance: 0,
          netPayable,
        });
        onClose();
      });
    } catch (err: unknown) {
      console.error(err);
      const msg = err instanceof Error ? err.message : 'Failed to save sales invoice';
      alert(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  const inputClasses = "w-full text-sm font-medium text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-900 px-3 py-2 border border-slate-300 dark:border-slate-600 rounded focus:border-[#20B2AA] focus:ring-1 focus:ring-[#20B2AA] outline-none";
  const labelClasses = "text-xs font-bold text-slate-800 dark:text-slate-200 block mb-1";

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white dark:bg-slate-900 rounded border border-slate-200 dark:border-slate-700 shadow-2xl w-full max-w-6xl flex flex-col my-8">
        
        {/* Header matching image */}
        <div className="px-6 py-4 flex items-center justify-between border-b border-slate-100 dark:border-slate-800/50 bg-[#F4F9F9]">
          <h2 className="text-lg font-normal text-slate-600 dark:text-slate-400 uppercase tracking-widest">
            {initialData ? 'EDIT SALES' : 'ADD NEW SALES'}
          </h2>
          <div className="flex gap-2">
            <button type="button" onClick={onClose} className="px-4 py-1.5 text-xs font-bold text-white bg-[#20B2AA] rounded hover:bg-[#1A9C96]">
              GO BACK
            </button>
            <button type="submit" form="add-sales-form" disabled={isSubmitting} className="px-4 py-1.5 text-xs font-bold text-white bg-[#20B2AA] rounded hover:bg-[#1A9C96] disabled:opacity-50">
              SAVE
            </button>
          </div>
        </div>

        <div className="p-6">
          <form id="add-sales-form" onSubmit={handleSubmit} className="space-y-6">
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              
              {/* Row 1 */}
              <div>
                <label className={labelClasses}>Sales By <span className="text-rose-500">*</span></label>
                <select value={salesMethod} onChange={(e) => setSalesMethod(e.target.value)} className={inputClasses} required>
                  <option value="By Manual">By Manual</option>
                  <option value="By System">By System</option>
                </select>
              </div>

              <div>
                <label className={labelClasses}>Sales Type <span className="text-rose-500">*</span></label>
                <select value={type} onChange={(e) => setType(e.target.value)} className={inputClasses} required>
                  <option value="Credit">Credit</option>
                  <option value="Cash">Cash</option>
                </select>
              </div>

              <div>
                <label className={labelClasses}>Invoice No. <span className="text-rose-500">*</span></label>
                <input type="text" value={initialData?.invoiceNo || `STS2610000001`} readOnly className={`${inputClasses} bg-slate-50 dark:bg-slate-950 text-slate-500 dark:text-slate-400`} required />
              </div>

              <div>
                <label className={labelClasses}>Invoice Date <span className="text-rose-500">*</span></label>
                <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className={inputClasses} required />
              </div>

              {/* Row 2 */}
              <div>
                <label className={labelClasses}>Client Name <span className="text-rose-500">*</span></label>
                <select value={clientId} onChange={(e) => setClientId(e.target.value)} className={inputClasses} required>
                  <option value="">Select Client</option>
                  {clients.map(c => (
                    <option key={c.id} value={c.id}>{c.clientName}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className={labelClasses}>Store <span className="text-rose-500">*</span></label>
                <select value={storeName} onChange={(e) => setStoreName(e.target.value)} className={inputClasses} required>
                  <option value="Shankhari Bazar">Shankhari Bazar</option>
                  <option value="Main Branch">Main Branch</option>
                </select>
              </div>

              <div>
                <label className={labelClasses}>Staff <span className="text-rose-500">*</span></label>
                <select value={staff} onChange={(e) => setStaff(e.target.value)} className={inputClasses}>
                  <option value="">Select Staff</option>
                  <option value="Arnob">Arnob Sur</option>
                </select>
              </div>

              <div>
                <label className={labelClasses}>Sales By <span className="text-rose-500">*</span></label>
                <input type="text" value={salesBy} onChange={(e) => setSalesBy(e.target.value)} className={inputClasses} required />
              </div>
            </div>

            {/* Product Addition Row */}
            <div className="flex items-end gap-4 border-t border-slate-100 dark:border-slate-800/50 pt-6">
              <div className="flex-1">
                <label className={labelClasses}>Products</label>
                <select value={selectedProductId} onChange={(e) => setSelectedProductId(e.target.value)} className={inputClasses}>
                  <option value="">Select Product</option>
                  {products.map(p => (
                    <option key={p.id} value={p.id}>{p.name} - {p.sku}</option>
                  ))}
                </select>
              </div>
              <div className="w-24">
                <label className={labelClasses}>Quantity</label>
                <input type="number" min="1" value={selectedQty} onChange={(e) => setSelectedQty(Number(e.target.value))} className={inputClasses} />
              </div>
              <div className="w-24">
                <label className={labelClasses}>Stock</label>
                <input type="number" value={currentStock} readOnly className={`${inputClasses} bg-slate-50 dark:bg-slate-950`} />
              </div>
              <div className="w-32">
                <label className={labelClasses}>Credit Limit</label>
                <input type="number" value={creditLimit} readOnly className={`${inputClasses} bg-slate-50 dark:bg-slate-950`} />
              </div>
              <button 
                type="button" 
                onClick={handleAddProduct} 
                disabled={!selectedProductId}
                className="px-6 py-2 text-sm font-bold text-white bg-[#20B2AA] rounded hover:bg-[#1A9C96] disabled:opacity-50 h-[38px]"
              >
                Add Product
              </button>
            </div>

            {/* Table & Summary section (Teal background) */}
            <div className="bg-[#20B2AA] rounded-md overflow-hidden mt-6 shadow-sm border border-[#1A9C96]">
              <table className="w-full text-left text-sm text-white">
                <thead>
                  <tr className="border-b border-[#1A9C96]/50">
                    <th className="px-4 py-2 font-semibold">SL#</th>
                    <th className="px-4 py-2 font-semibold">Code</th>
                    <th className="px-4 py-2 font-semibold">Product name</th>
                    <th className="px-4 py-2 font-semibold">Rate</th>
                    <th className="px-4 py-2 font-semibold">Qty</th>
                    <th className="px-4 py-2 font-semibold">Amount</th>
                    <th className="px-4 py-2 font-semibold text-center w-12"><Trash2 className="w-4 h-4 text-white/50 inline" /></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#1A9C96]/50">
                  {items.map((item, idx) => (
                    <tr key={item.id} className="hover:bg-white dark:bg-slate-900/10">
                      <td className="px-4 py-2">{idx + 1}</td>
                      <td className="px-4 py-2">{item.itemCode}</td>
                      <td className="px-4 py-2">{item.productName}</td>
                      <td className="px-4 py-2">{item.rate.toFixed(2)}</td>
                      <td className="px-4 py-2">{item.quantity}</td>
                      <td className="px-4 py-2">{item.amount.toFixed(2)}</td>
                      <td className="px-4 py-2 text-center">
                        <button type="button" onClick={() => handleRemoveItem(item.id)} className="text-white hover:text-rose-200">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                  {items.length === 0 && (
                    <tr>
                      <td colSpan={7} className="px-4 py-8 text-center text-white/70 italic">
                        No products added yet.
                      </td>
                    </tr>
                  )}
                  {/* Summary Block row */}
                  <tr className="bg-[#1ca199]">
                    <td colSpan={3} className="px-4 py-4 align-top">
                      <div className="flex items-center gap-4 text-sm font-semibold">
                        <label className="flex items-center gap-1.5 cursor-pointer">
                          <input 
                            type="radio" 
                            name="discountType" 
                            checked={discountType === 'fix'} 
                            onChange={() => setDiscountType('fix')}
                            className="accent-blue-600 w-4 h-4"
                          />
                          Fix Discount
                        </label>
                        <label className="flex items-center gap-1.5 cursor-pointer">
                          <input 
                            type="radio" 
                            name="discountType" 
                            checked={discountType === 'percent'} 
                            onChange={() => setDiscountType('percent')}
                            className="accent-blue-600 w-4 h-4"
                          />
                          Discount (%)
                        </label>
                      </div>
                    </td>
                    <td colSpan={4} className="px-4 py-4">
                      <div className="flex flex-col gap-2 ml-auto w-64 text-sm font-bold">
                        <div className="flex items-center justify-between">
                          <span>Total</span>
                          <div className="flex items-center gap-2">
                            <input type="text" readOnly value={totalAmount.toFixed(2)} className="w-32 px-2 py-1 text-slate-800 dark:text-slate-200 bg-white dark:bg-slate-900 rounded border-none outline-none text-right" />
                            <span>TK.</span>
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <span>Discount</span>
                          <div className="flex items-center gap-2">
                            <input type="number" min="0" step="any" value={discountValue} onChange={(e) => setDiscountValue(Number(e.target.value))} className="w-32 px-2 py-1 text-slate-800 dark:text-slate-200 bg-white dark:bg-slate-900 rounded border-none outline-none text-right" />
                            <span>TK.</span>
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <span>Net Payable</span>
                          <div className="flex items-center gap-2">
                            <input type="text" readOnly value={netPayable.toFixed(2)} className="w-32 px-2 py-1 text-slate-800 dark:text-slate-200 bg-white dark:bg-slate-900 rounded border-none outline-none text-right" />
                            <span>TK.</span>
                          </div>
                        </div>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

          </form>
        </div>

        {/* Bottom Footer matching image */}
        <div className="px-6 py-4 flex justify-end bg-white dark:bg-slate-900 rounded-b-xl border-t border-slate-100 dark:border-slate-800/50">
          <button type="submit" form="add-sales-form" disabled={isSubmitting} className="px-6 py-2 text-sm font-bold text-white bg-[#20B2AA] rounded hover:bg-[#1A9C96] disabled:opacity-50 shadow-md">
            SAVE
          </button>
        </div>
      </div>
    </div>
  );
};
