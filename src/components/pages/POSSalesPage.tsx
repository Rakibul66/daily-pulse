"use client";

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  Trash2, 
  ScanBarcode, 
  Printer, 
  Plus, 
  Minus, 
  RotateCcw, 
  CheckCircle, 
  Search, 
  CreditCard, 
  Volume2, 
  Sparkles,
  X
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { getProducts } from '@/lib/inventoryStorage';
import { Product } from '@/types/inventory';

interface Props {
  showToast: (msg: string, type: 'success' | 'error') => void;
}

interface CartItem {
  id: string;
  sku: string;
  name: string;
  rate: number;
  qty: number;
  discount: number;
  stock: number;
  uom: string;
}

// Built-in starter inventory for immediate barcode testing
const SAMPLE_PRODUCTS: Product[] = [
  { id: 'p1', userId: '', name: 'Premium Cotton Shirt (Blue - L)', sku: '890123456789', category: 'Fashion', price: 1450, cost: 950, stock: 45, minStock: 5, createdAt: '', updatedAt: '' },
  { id: 'p2', userId: '', name: 'Slim Fit Denim Jeans (32)', sku: '890123456790', category: 'Fashion', price: 2200, cost: 1500, stock: 32, minStock: 5, createdAt: '', updatedAt: '' },
  { id: 'p3', userId: '', name: 'Polo T-Shirt Casual (Black)', sku: '890123456791', category: 'Fashion', price: 850, cost: 500, stock: 60, minStock: 10, createdAt: '', updatedAt: '' },
  { id: 'p4', userId: '', name: 'Genuine Leather Wallet', sku: '890123456792', category: 'Accessories', price: 1100, cost: 700, stock: 24, minStock: 4, createdAt: '', updatedAt: '' },
  { id: 'p5', userId: '', name: 'Wireless Optical Mouse', sku: '890123456793', category: 'Electronics', price: 650, cost: 420, stock: 18, minStock: 3, createdAt: '', updatedAt: '' },
  { id: 'p6', userId: '', name: 'Organic Green Tea 200g', sku: '890123456794', category: 'Grocery', price: 380, cost: 260, stock: 80, minStock: 15, createdAt: '', updatedAt: '' }
];

export const POSSalesPage: React.FC<Props> = ({ showToast }) => {
  const { user } = useAuth();
  
  // Products list from DB or fallback
  const [productsList, setProductsList] = useState<Product[]>(SAMPLE_PRODUCTS);
  const [cart, setCart] = useState<CartItem[]>([
    { id: 'p1', sku: '890123456789', name: 'Premium Cotton Shirt (Blue - L)', rate: 1450, qty: 1, discount: 0, stock: 45, uom: 'Pcs' }
  ]);

  // Form State
  const [printAfterSave, setPrintAfterSave] = useState(true);
  const [method, setMethod] = useState<'barcode' | 'manual'>('barcode');
  const [discountType, setDiscountType] = useState<'fix' | 'percent'>('fix');
  const [globalDiscount, setGlobalDiscount] = useState<number>(0);
  const [cashPaid, setCashPaid] = useState<string>('1450');
  const [clientPhone, setClientPhone] = useState('');
  const [clientName, setClientName] = useState('Walk-in Customer');
  const [cashHead, setCashHead] = useState('Cash at Hand - 1010201');

  // Scanner state
  const [scannedCode, setScannedCode] = useState('');
  const [lastScannedItem, setLastScannedItem] = useState<string | null>(null);
  const [isBeepEnabled, setIsBeepEnabled] = useState(true);
  const barcodeInputRef = useRef<HTMLInputElement>(null);

  // Receipt Modal State
  const [isReceiptModalOpen, setIsReceiptModalOpen] = useState(false);
  const [completedInvoice, setCompletedInvoice] = useState<{
    invoiceNo: string;
    date: string;
    items: CartItem[];
    subtotal: number;
    discount: number;
    netPayable: number;
    cashPaid: number;
    changeAmount: number;
    customerName: string;
    customerPhone: string;
    cashHead: string;
  } | null>(null);

  // Audio Beep Generator using Web Audio API (mimics retail laser scanner)
  const playScannerBeep = useCallback(() => {
    if (!isBeepEnabled) return;
    try {
      const audioCtx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(1400, audioCtx.currentTime); // High pitch retail beep
      gain.gain.setValueAtTime(0.25, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.08);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.08);
    } catch {
      // AudioContext not allowed or unavailable
    }
  }, [isBeepEnabled]);

  // Load Inventory from Database
  useEffect(() => {
    if (user?.uid) {
      getProducts(user.uid)
        .then((prods) => {
          if (prods && prods.length > 0) {
            setProductsList(prods);
          }
        })
        .catch(() => {
          // Use sample fallback
        });
    }
  }, [user]);

  // Auto-focus barcode input for instant scanning
  useEffect(() => {
    if (method === 'barcode') {
      barcodeInputRef.current?.focus();
    }
  }, [method, cart]);

  // Handle Scanning Barcode Logic
  const handleBarcodeProcess = (rawCode: string) => {
    const code = rawCode.trim();
    if (!code) return;

    // Search product by SKU or ID or exact Name
    const found = productsList.find(
      (p) => p.sku.toLowerCase() === code.toLowerCase() || p.id === code || p.name.toLowerCase() === code.toLowerCase()
    );

    if (found) {
      playScannerBeep();
      setLastScannedItem(`${found.name} (৳${found.price})`);

      setCart((prevCart) => {
        const existingIndex = prevCart.findIndex((item) => item.sku === found.sku || item.id === found.id);
        if (existingIndex >= 0) {
          const updated = [...prevCart];
          updated[existingIndex].qty += 1;
          return updated;
        } else {
          return [
            ...prevCart,
            {
              id: found.id,
              sku: found.sku,
              name: found.name,
              rate: found.price,
              qty: 1,
              discount: 0,
              stock: found.stock,
              uom: 'Pcs'
            }
          ];
        }
      });

      showToast(`Scanned: ${found.name}`, 'success');
      setScannedCode('');
    } else {
      showToast(`Barcode "${code}" not found in inventory`, 'error');
      setScannedCode('');
    }
  };

  // Keyboard hardware scanner listener (fast scanner keystrokes)
  const handleBarcodeKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleBarcodeProcess(scannedCode);
    }
  };

  // Cart Adjustments
  const updateQuantity = (id: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((item) => {
          if (item.id === id) {
            const newQty = Math.max(1, item.qty + delta);
            return { ...item, qty: newQty };
          }
          return item;
        })
    );
  };

  const updateRate = (id: string, newRate: number) => {
    setCart((prev) =>
      prev.map((item) => (item.id === id ? { ...item, rate: Math.max(0, newRate) } : item))
    );
  };

  const updateDiscount = (id: string, newDisc: number) => {
    setCart((prev) =>
      prev.map((item) => (item.id === id ? { ...item, discount: Math.max(0, newDisc) } : item))
    );
  };

  const removeItem = (id: string) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
  };

  const handleResetCart = () => {
    setCart([]);
    setGlobalDiscount(0);
    setCashPaid('0');
    setScannedCode('');
    setLastScannedItem(null);
    showToast('Cart cleared', 'success');
    if (barcodeInputRef.current) barcodeInputRef.current.focus();
  };

  // Calculations
  const subtotal = cart.reduce((sum, item) => sum + item.rate * item.qty - item.discount, 0);
  
  const discountAmount = discountType === 'fix' 
    ? globalDiscount 
    : (subtotal * (globalDiscount / 100));

  const netPayable = Math.max(0, subtotal - discountAmount);
  const paidVal = parseFloat(cashPaid) || 0;
  const changeAmount = Math.max(0, paidVal - netPayable);

  // Quick Cash preset buttons
  const setExactCash = () => setCashPaid(netPayable.toString());
  const addPresetCash = (amount: number) => setCashPaid(amount.toString());

  // Save Sale & Print Trigger
  const handleSaveSale = () => {
    if (cart.length === 0) {
      showToast('Cannot complete sale with an empty cart!', 'error');
      return;
    }

    const invoiceData = {
      invoiceNo: `INV-${Date.now().toString().slice(-6)}`,
      date: new Date().toLocaleString('en-GB'),
      items: [...cart],
      subtotal,
      discount: discountAmount,
      netPayable,
      cashPaid: paidVal,
      changeAmount,
      customerName: clientName || 'Walk-in Customer',
      customerPhone: clientPhone || 'N/A',
      cashHead
    };

    setCompletedInvoice(invoiceData);

    if (printAfterSave) {
      setIsReceiptModalOpen(true);
    } else {
      showToast('Sale saved successfully!', 'success');
      handleResetCart();
    }
  };

  return (
    <div className="w-full mx-auto pb-24 px-2 sm:px-4">
      
      {/* Outer Brutalist Frame */}
      <div className="bg-white border-4 border-black shadow-[8px_8px_0px_#000] w-full flex flex-col">
        
        {/* Header Bar */}
        <div className="px-6 py-4 flex flex-wrap items-center justify-between border-b-4 border-black bg-amber-300 gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-black text-amber-300 flex items-center justify-center border-2 border-black font-black">
              <ScanBarcode className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl font-display font-black text-black uppercase tracking-tight">
                POS SALES TERMINAL
              </h1>
              <p className="text-xs font-bold text-black uppercase tracking-wider">
                High-Speed Hardware Scanner & Thermal Receipt Ready
              </p>
            </div>
          </div>

          {/* Action Toggles */}
          <div className="flex flex-wrap items-center gap-4">
            <label className="flex items-center gap-1.5 text-xs font-black text-black cursor-pointer bg-white px-3 py-1.5 border-2 border-black shadow-[2px_2px_0px_#000]">
              <input 
                type="checkbox" 
                checked={printAfterSave} 
                onChange={(e) => setPrintAfterSave(e.target.checked)} 
                className="w-4 h-4 accent-black" 
              />
              <Printer className="w-4 h-4" />
              PRINT RECEIPT
            </label>

            <label className="flex items-center gap-1.5 text-xs font-black text-black cursor-pointer bg-white px-3 py-1.5 border-2 border-black shadow-[2px_2px_0px_#000]">
              <input 
                type="checkbox" 
                checked={isBeepEnabled} 
                onChange={(e) => setIsBeepEnabled(e.target.checked)} 
                className="w-4 h-4 accent-black" 
              />
              <Volume2 className="w-4 h-4" />
              BEEP AUDIO
            </label>

            <div className="flex items-center border-2 border-black bg-white shadow-[2px_2px_0px_#000]">
              <button 
                type="button" 
                onClick={() => setMethod('barcode')}
                className={`px-3 py-1.5 text-xs font-black uppercase transition-all ${method === 'barcode' ? 'bg-black text-white' : 'text-black hover:bg-slate-100'}`}
              >
                BY BARCODE
              </button>
              <button 
                type="button" 
                onClick={() => setMethod('manual')}
                className={`px-3 py-1.5 text-xs font-black uppercase transition-all ${method === 'manual' ? 'bg-black text-white' : 'text-black hover:bg-slate-100'}`}
              >
                BY MANUAL
              </button>
            </div>

            <button 
              type="button" 
              onClick={handleResetCart}
              className="px-3 py-1.5 text-xs font-black text-black bg-white hover:bg-rose-100 border-2 border-black shadow-[2px_2px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none flex items-center gap-1"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              NEW CART
            </button>
          </div>
        </div>

        {/* Top Control Bar: Barcode Scanning Input & Customer Info */}
        <div className="p-6 border-b-4 border-black bg-slate-50">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            
            {/* 1. Barcode Input with instant listener */}
            <div>
              <label className="text-xs font-black text-black block mb-1 uppercase tracking-wider flex items-center gap-1">
                <ScanBarcode className="w-4 h-4 text-indigo-600" />
                SCAN BARCODE (USB / WIRELESS)
              </label>
              <div className="relative">
                <input 
                  ref={barcodeInputRef}
                  type="text" 
                  value={scannedCode}
                  onChange={(e) => setScannedCode(e.target.value)}
                  onKeyDown={handleBarcodeKeyDown}
                  placeholder="Scan or type code + Enter..."
                  className="w-full text-sm font-black text-black bg-white px-3 py-2.5 border-3 border-black shadow-[3px_3px_0px_#000] focus:bg-amber-50 outline-none uppercase tracking-wider"
                />
                <button
                  type="button"
                  onClick={() => handleBarcodeProcess(scannedCode)}
                  className="absolute right-1 top-1 bottom-1 px-3 bg-black text-white font-black text-xs uppercase hover:bg-slate-800"
                >
                  SCAN
                </button>
              </div>
              {lastScannedItem && (
                <p className="text-[11px] font-bold text-emerald-700 mt-1 flex items-center gap-1 animate-pulse">
                  <CheckCircle className="w-3.5 h-3.5" /> Added: {lastScannedItem}
                </p>
              )}
            </div>

            {/* 2. Customer Phone */}
            <div>
              <label className="text-xs font-black text-black block mb-1 uppercase tracking-wider">
                CLIENT PHONE
              </label>
              <input 
                type="text" 
                value={clientPhone}
                onChange={(e) => setClientPhone(e.target.value)}
                placeholder="017XXXXXXXX"
                className="w-full text-sm font-bold text-black bg-white px-3 py-2.5 border-3 border-black shadow-[3px_3px_0px_#000] outline-none"
              />
            </div>

            {/* 3. Customer Name */}
            <div>
              <label className="text-xs font-black text-black block mb-1 uppercase tracking-wider">
                CLIENT NAME
              </label>
              <input 
                type="text" 
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
                placeholder="Walk-in Customer"
                className="w-full text-sm font-bold text-black bg-white px-3 py-2.5 border-3 border-black shadow-[3px_3px_0px_#000] outline-none"
              />
            </div>

            {/* 4. Cash Account */}
            <div>
              <label className="text-xs font-black text-black block mb-1 uppercase tracking-wider">
                PAYMENT ACCOUNT / CASH HEAD <span className="text-rose-600">*</span>
              </label>
              <select 
                value={cashHead}
                onChange={(e) => setCashHead(e.target.value)}
                className="w-full text-sm font-bold text-black bg-white px-3 py-2.5 border-3 border-black shadow-[3px_3px_0px_#000] outline-none"
              >
                <option value="Cash at Hand - 1010201">Cash at Hand (Counter #1)</option>
                <option value="bKash Merchant - 1020301">bKash Merchant Pay</option>
                <option value="Nagad Business - 1020302">Nagad Business Pay</option>
                <option value="Bank POS Card Terminal">Bank POS Card Terminal</option>
              </select>
            </div>
          </div>

          {/* Quick Barcode Demo Pickers */}
          <div className="mt-4 pt-3 border-t-2 border-slate-200 flex flex-wrap items-center gap-2">
            <span className="text-[11px] font-black text-slate-600 uppercase flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" /> QUICK SCAN DEMO PRODUCTS:
            </span>
            {productsList.slice(0, 5).map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => handleBarcodeProcess(p.sku)}
                className="text-xs font-black bg-white hover:bg-indigo-50 px-2.5 py-1 border-2 border-black shadow-[2px_2px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 transition-all text-slate-800"
              >
                + {p.name.split(' ')[0]} ({p.sku})
              </button>
            ))}
          </div>
        </div>

        {/* Cart Items Table */}
        <div className="p-6">
          <div className="border-4 border-black shadow-[4px_4px_0px_#000] overflow-x-auto bg-white">
            <table className="w-full text-left text-sm text-black">
              <thead className="bg-black text-white text-xs font-black uppercase tracking-wider">
                <tr className="border-b-4 border-black">
                  <th className="px-4 py-3 w-12">SL#</th>
                  <th className="px-4 py-3">ITEM DESCRIPTION & BARCODE</th>
                  <th className="px-4 py-3 text-right w-28">RATE (৳)</th>
                  <th className="px-4 py-3 text-center w-28">DISCOUNT</th>
                  <th className="px-4 py-3 text-center w-36">QUANTITY</th>
                  <th className="px-4 py-3 text-center w-20">UOM</th>
                  <th className="px-4 py-3 text-center w-24">STOCK</th>
                  <th className="px-4 py-3 text-right w-32">AMOUNT (৳)</th>
                  <th className="px-4 py-3 text-center w-12">DEL</th>
                </tr>
              </thead>
              <tbody className="divide-y-2 divide-black">
                {cart.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="px-4 py-12 text-center">
                      <div className="flex flex-col items-center justify-center gap-2">
                        <ScanBarcode className="w-10 h-10 text-slate-400 stroke-[1.5]" />
                        <p className="font-black text-sm uppercase text-slate-600">Cart is empty</p>
                        <p className="text-xs font-bold text-slate-400">Scan product barcode or click quick buttons above</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  cart.map((item, idx) => {
                    const rowTotal = item.rate * item.qty - item.discount;
                    return (
                      <tr key={item.id} className="hover:bg-amber-50/50 font-bold transition-colors">
                        <td className="px-4 py-3 text-center font-black">{idx + 1}</td>
                        <td className="px-4 py-3">
                          <p className="font-black text-black">{item.name}</p>
                          <span className="text-[11px] font-mono text-indigo-700 bg-indigo-50 px-1.5 py-0.5 border border-indigo-200">
                            BARCODE: {item.sku}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-right">
                          <input 
                            type="number"
                            min="0"
                            value={item.rate}
                            onChange={(e) => updateRate(item.id, parseFloat(e.target.value) || 0)}
                            className="w-20 px-2 py-1 text-right font-black border-2 border-black bg-white"
                          />
                        </td>
                        <td className="px-4 py-3 text-center">
                          <input 
                            type="number"
                            min="0"
                            value={item.discount}
                            onChange={(e) => updateDiscount(item.id, parseFloat(e.target.value) || 0)}
                            className="w-16 px-2 py-1 text-center font-black border-2 border-black bg-white"
                          />
                        </td>
                        <td className="px-4 py-3 text-center">
                          <div className="flex items-center justify-center gap-1">
                            <button 
                              type="button" 
                              onClick={() => updateQuantity(item.id, -1)}
                              className="w-7 h-7 bg-white hover:bg-slate-200 border-2 border-black font-black flex items-center justify-center"
                            >
                              <Minus className="w-3.5 h-3.5" />
                            </button>
                            <input 
                              type="number"
                              min="1"
                              value={item.qty}
                              onChange={(e) => {
                                const val = parseInt(e.target.value, 10);
                                if (val > 0) {
                                  setCart(cart.map((c) => (c.id === item.id ? { ...c, qty: val } : c)));
                                }
                              }}
                              className="w-12 px-1 py-1 text-center font-black border-2 border-black bg-white"
                            />
                            <button 
                              type="button" 
                              onClick={() => updateQuantity(item.id, 1)}
                              className="w-7 h-7 bg-white hover:bg-slate-200 border-2 border-black font-black flex items-center justify-center"
                            >
                              <Plus className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-center">{item.uom}</td>
                        <td className="px-4 py-3 text-center">
                          <span className="px-2 py-0.5 bg-slate-100 border border-black text-xs font-black">
                            {item.stock}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-right font-black text-base text-indigo-700">
                          ৳ {rowTotal.toLocaleString()}
                        </td>
                        <td className="px-4 py-3 text-center">
                          <button 
                            type="button" 
                            onClick={() => removeItem(item.id)}
                            className="p-1.5 text-black hover:bg-rose-100 border border-black hover:text-rose-600 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* Checkout & Bill Summary Block */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-6">
            
            {/* Left Controls: Discount mode & Quick cash tender */}
            <div className="lg:col-span-6 bg-slate-50 border-4 border-black p-5 shadow-[4px_4px_0px_#000] flex flex-col justify-between">
              <div>
                <h3 className="text-xs font-black uppercase tracking-wider mb-3 flex items-center gap-2">
                  <CreditCard className="w-4 h-4 text-indigo-600" /> DISCOUNT & TENDER OPTIONS
                </h3>

                <div className="flex items-center gap-6 mb-4">
                  <label className="flex items-center gap-2 text-xs font-black uppercase cursor-pointer">
                    <input 
                      type="radio" 
                      name="discType" 
                      checked={discountType === 'fix'} 
                      onChange={() => setDiscountType('fix')}
                      className="w-4 h-4 accent-black"
                    />
                    FLAT DISCOUNT (৳)
                  </label>
                  <label className="flex items-center gap-2 text-xs font-black uppercase cursor-pointer">
                    <input 
                      type="radio" 
                      name="discType" 
                      checked={discountType === 'percent'} 
                      onChange={() => setDiscountType('percent')}
                      className="w-4 h-4 accent-black"
                    />
                    PERCENTAGE (%)
                  </label>
                </div>

                <div className="mb-4">
                  <label className="text-xs font-bold block mb-1 uppercase">
                    APPLY DISCOUNT {discountType === 'fix' ? '(৳)' : '(%)'}:
                  </label>
                  <input 
                    type="number"
                    min="0"
                    value={globalDiscount || ''}
                    onChange={(e) => setGlobalDiscount(parseFloat(e.target.value) || 0)}
                    placeholder="0"
                    className="w-48 px-3 py-2 text-base font-black border-3 border-black bg-white shadow-[2px_2px_0px_#000] outline-none"
                  />
                </div>
              </div>

              {/* Quick Cash Tender Presets */}
              <div className="pt-4 border-t-2 border-slate-300">
                <p className="text-[11px] font-black uppercase text-slate-700 mb-2">
                  QUICK CASH TENDER PRESETS:
                </p>
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={setExactCash}
                    className="px-3 py-1.5 text-xs font-black bg-white hover:bg-slate-200 border-2 border-black shadow-[2px_2px_0px_#000]"
                  >
                    EXACT (৳{netPayable})
                  </button>
                  {[500, 1000, 1500, 2000, 5000].map((amt) => (
                    <button
                      key={amt}
                      type="button"
                      onClick={() => addPresetCash(amt)}
                      className="px-3 py-1.5 text-xs font-black bg-amber-200 hover:bg-amber-300 border-2 border-black shadow-[2px_2px_0px_#000]"
                    >
                      ৳{amt}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Totals Panel */}
            <div className="lg:col-span-6 bg-amber-300 border-4 border-black p-6 shadow-[6px_6px_0px_#000] flex flex-col justify-between">
              <div className="space-y-3">
                
                <div className="flex items-center justify-between pb-2 border-b-2 border-black/40">
                  <span className="text-xs font-black uppercase tracking-wider">SUBTOTAL</span>
                  <span className="text-lg font-black font-display">৳ {subtotal.toLocaleString()}</span>
                </div>

                <div className="flex items-center justify-between pb-2 border-b-2 border-black/40 text-rose-900">
                  <span className="text-xs font-black uppercase tracking-wider">DISCOUNT</span>
                  <span className="text-base font-black font-display">- ৳ {discountAmount.toLocaleString()}</span>
                </div>

                <div className="flex items-center justify-between py-2 border-y-3 border-black bg-black text-amber-300 px-4">
                  <span className="text-sm font-black uppercase tracking-widest">NET PAYABLE</span>
                  <span className="text-2xl font-black font-display">৳ {netPayable.toLocaleString()}</span>
                </div>

                <div className="flex items-center justify-between pt-2">
                  <span className="text-xs font-black uppercase tracking-wider">CASH PAID (৳)</span>
                  <input 
                    type="number"
                    value={cashPaid}
                    onChange={(e) => setCashPaid(e.target.value)}
                    className="w-36 px-3 py-1.5 text-right text-lg font-black bg-white border-3 border-black shadow-[2px_2px_0px_#000] outline-none"
                  />
                </div>

                <div className="flex items-center justify-between pt-1">
                  <span className="text-xs font-black uppercase tracking-wider">CHANGE DUE</span>
                  <span className="text-xl font-black font-display text-emerald-900">
                    ৳ {changeAmount.toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Complete & Save Button */}
              <div className="pt-6 mt-4 border-t-2 border-black/30 flex gap-3">
                <button 
                  type="button"
                  onClick={handleSaveSale}
                  className="w-full py-4 bg-black hover:bg-slate-900 text-white font-display font-black text-base uppercase tracking-wider border-3 border-black shadow-[4px_4px_0px_#000] active:translate-x-1 active:translate-y-1 active:shadow-none transition-all flex items-center justify-center gap-2"
                >
                  <CheckCircle className="w-5 h-5" />
                  COMPLETE & SAVE SALE
                </button>
              </div>

            </div>

          </div>
        </div>

      </div>

      {/* Thermal Receipt Print Modal (ESC/POS 80mm format) */}
      {isReceiptModalOpen && completedInvoice && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white border-4 border-black shadow-[12px_12px_0px_#000] max-w-md w-full p-6 relative">
            
            {/* Modal Controls */}
            <div className="flex items-center justify-between pb-4 mb-4 border-b-2 border-black">
              <h3 className="font-display font-black text-sm uppercase flex items-center gap-2">
                <Printer className="w-5 h-5 text-indigo-600" />
                THERMAL RECEIPT PREVIEW (80mm)
              </h3>
              <button 
                onClick={() => {
                  setIsReceiptModalOpen(false);
                  handleResetCart();
                }}
                className="p-1 hover:bg-slate-100 border-2 border-black"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Printable Thermal Receipt Paper Container */}
            <div id="thermal-receipt" className="bg-white border-2 border-dashed border-slate-400 p-4 font-mono text-xs text-black leading-tight">
              
              {/* Receipt Header */}
              <div className="text-center pb-3 border-b border-dashed border-black">
                <h2 className="text-base font-black uppercase tracking-wider">SHOMPORKO CRM POS</h2>
                <p className="text-[11px] font-bold">RETAIL & ERP AUTOMATION</p>
                <p className="text-[10px] text-slate-600">Hotline: 01315861003 | Dhaka, BD</p>
                <p className="text-[10px] mt-1 font-bold">INVOICE: #{completedInvoice.invoiceNo}</p>
                <p className="text-[10px] text-slate-500">{completedInvoice.date}</p>
              </div>

              {/* Customer / Cashier info */}
              <div className="py-2 border-b border-dashed border-black text-[11px]">
                <p><span className="font-bold">Customer:</span> {completedInvoice.customerName}</p>
                <p><span className="font-bold">Phone:</span> {completedInvoice.customerPhone}</p>
                <p><span className="font-bold">Account:</span> {completedInvoice.cashHead}</p>
              </div>

              {/* Itemized Table */}
              <div className="py-2 border-b border-dashed border-black">
                <div className="flex justify-between font-black pb-1 text-[10px] uppercase">
                  <span className="w-6">QTY</span>
                  <span className="flex-1 text-left px-1">ITEM</span>
                  <span className="w-12 text-right">RATE</span>
                  <span className="w-14 text-right">TOTAL</span>
                </div>
                <div className="space-y-1">
                  {completedInvoice.items.map((it) => (
                    <div key={it.id} className="flex justify-between text-[11px]">
                      <span className="w-6">{it.qty}x</span>
                      <span className="flex-1 text-left px-1 truncate">{it.name}</span>
                      <span className="w-12 text-right">{it.rate}</span>
                      <span className="w-14 text-right font-bold">৳{(it.rate * it.qty - it.discount).toLocaleString()}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Totals */}
              <div className="py-2 space-y-1 text-right text-[11px] border-b border-dashed border-black">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span>৳{completedInvoice.subtotal.toLocaleString()}</span>
                </div>
                {completedInvoice.discount > 0 && (
                  <div className="flex justify-between font-bold">
                    <span>Discount:</span>
                    <span>- ৳{completedInvoice.discount.toLocaleString()}</span>
                  </div>
                )}
                <div className="flex justify-between text-xs font-black pt-1 border-t border-black">
                  <span>NET PAYABLE:</span>
                  <span>৳{completedInvoice.netPayable.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Paid:</span>
                  <span>৳{completedInvoice.cashPaid.toLocaleString()}</span>
                </div>
                <div className="flex justify-between font-bold">
                  <span>Change:</span>
                  <span>৳{completedInvoice.changeAmount.toLocaleString()}</span>
                </div>
              </div>

              {/* Barcode & Footer Notice */}
              <div className="text-center pt-3">
                <p className="font-mono text-sm tracking-widest font-black">|||||||||||||||||||||||||||||</p>
                <p className="text-[10px] font-bold mt-1">THANK YOU FOR YOUR PURCHASE!</p>
                <p className="text-[9px] text-slate-500">Software by Shomporko CRM</p>
              </div>

            </div>

            {/* Print & Action Buttons */}
            <div className="flex gap-3 mt-5">
              <button
                type="button"
                onClick={() => {
                  window.print();
                }}
                className="flex-1 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs uppercase border-2 border-black shadow-[3px_3px_0px_#000] flex items-center justify-center gap-1.5"
              >
                <Printer className="w-4 h-4" />
                PRINT NOW
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsReceiptModalOpen(false);
                  handleResetCart();
                  showToast('Transaction completed & logged', 'success');
                }}
                className="px-4 py-3 bg-black hover:bg-slate-800 text-white font-black text-xs uppercase border-2 border-black shadow-[3px_3px_0px_#000]"
              >
                DONE
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
