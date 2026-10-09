"use client";

import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { useAuth } from '@/context/AuthContext';
import { getProducts } from '@/lib/productStorage';
import { addSalesInvoice } from '@/lib/salesStorage';
import { getCompanyProfile } from '@/lib/companyStorage';
import { getCustomers } from '@/lib/customerStorage';
import { withActionLock } from '@/lib/rateLimit';
import { Product } from '@/types/product';
import { Customer } from '@/types/customer';
import { CompanyProfile } from '@/types/company';
import { CameraBarcodeScanner } from '@/components/ui/CameraBarcodeScanner';
import { POSCartItem, POSCompletedInvoice } from '../pos/types';
import { POSHeader } from '../pos/POSHeader';
import { POSControlBar } from '../pos/POSControlBar';
import { POSCatalogGrid } from '../pos/POSCatalogGrid';
import { POSCartTable } from '../pos/POSCartTable';
import { POSCheckoutSidebar } from '../pos/POSCheckoutSidebar';
import { POSReceiptModal } from '../pos/POSReceiptModal';

interface Props {
  showToast: (msg: string, type?: 'success' | 'error' | 'info') => void;
}

export const POSSalesPage: React.FC<Props> = ({ showToast }) => {
  const { user, userProfile } = useAuth();
  
  // Real products and company profile
  const [productsList, setProductsList] = useState<Product[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [companyProfile, setCompanyProfile] = useState<CompanyProfile | null>(null);
  const [cart, setCart] = useState<POSCartItem[]>([]);
  const [isLoadingProducts, setIsLoadingProducts] = useState<boolean>(true);
  const [isSavingSale, setIsSavingSale] = useState<boolean>(false);

  // POS Controls & Mode
  const [printAfterSave, setPrintAfterSave] = useState(true);
  const [method, setMethod] = useState<'barcode' | 'manual'>('barcode');
  const [discountType, setDiscountType] = useState<'fix' | 'percent'>('fix');
  const [globalDiscount, setGlobalDiscount] = useState<number>(0);
  const [cashPaid, setCashPaid] = useState<string>('0');
  const [clientPhone, setClientPhone] = useState('');
  const [clientName, setClientName] = useState('Walk-in Customer');
  const [selectedCustomerId, setSelectedCustomerId] = useState<string>('');
  const [cashHead, setCashHead] = useState('Cash at Hand - 1010201');

  // Scanner state
  const [scannedCode, setScannedCode] = useState('');
  const [manualSearch, setManualSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [lastScannedItem, setLastScannedItem] = useState<{ name: string; price: number; ms: number } | null>(null);
  const [isBeepEnabled, setIsBeepEnabled] = useState(true);
  const [isCameraScannerOpen, setIsCameraScannerOpen] = useState(false);
  const barcodeInputRef = useRef<HTMLInputElement>(null);
  const manualSearchRef = useRef<HTMLInputElement>(null);

  // Receipt Modal State
  const [isReceiptModalOpen, setIsReceiptModalOpen] = useState(false);
  const [completedInvoice, setCompletedInvoice] = useState<POSCompletedInvoice | null>(null);

  // Audio Beep Generator using Web Audio API (mimics retail laser scanner, 0ms latency)
  const playScannerBeep = useCallback(() => {
    if (!isBeepEnabled) return;
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const audioCtx = new AudioCtx();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(1600, audioCtx.currentTime);
      gain.gain.setValueAtTime(0.3, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.07);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.07);
    } catch {
      // AudioContext policy blocked or audio unavailable
    }
  }, [isBeepEnabled]);

  // Load Inventory, Customers & Company Profile
  useEffect(() => {
    if (!user) return;
    const companyId = userProfile?.companyId || user.uid;
    setIsLoadingProducts(true);

    getCompanyProfile(companyId)
      .then(prof => setCompanyProfile(prof))
      .catch(() => {});

    getCustomers(user.uid, companyId)
      .then(custs => setCustomers(custs))
      .catch(() => {});

    getProducts(user.uid, companyId)
      .then((prods) => {
        setProductsList(prods || []);
      })
      .catch((err) => {
        console.warn('Could not load products:', err);
        setProductsList([]);
      })
      .finally(() => {
        setIsLoadingProducts(false);
      });
  }, [user, userProfile?.companyId]);

  // Build high-speed O(1) in-memory barcode index
  const barcodeIndex = useMemo(() => {
    const map = new Map<string, Product>();
    productsList.forEach(p => {
      const barcode = (p.barcode || '').trim().toLowerCase();
      const code = (p.code || '').trim().toLowerCase();
      const sku = ((p as any).sku || '').trim().toLowerCase();
      const id = (p.id || '').trim().toLowerCase();
      const name = (p.name || '').trim().toLowerCase();

      if (barcode) map.set(barcode, p);
      if (code) map.set(code, p);
      if (sku) map.set(sku, p);
      if (id) map.set(id, p);
      if (name) map.set(name, p);
    });
    return map;
  }, [productsList]);

  // Product categories list
  const categoriesList = useMemo(() => {
    const set = new Set<string>();
    productsList.forEach(p => {
      if (p.parentCategory) set.add(p.parentCategory);
    });
    return ['All', ...Array.from(set)];
  }, [productsList]);

  // Filtered products for Catalog mode
  const manualFilteredProducts = useMemo(() => {
    return productsList.filter(p => {
      if (selectedCategory !== 'All' && p.parentCategory !== selectedCategory) {
        return false;
      }
      if (manualSearch.trim()) {
        const q = manualSearch.toLowerCase();
        const matchesName = p.name.toLowerCase().includes(q);
        const matchesCode = (p.code || p.barcode || '').toLowerCase().includes(q);
        if (!matchesName && !matchesCode) return false;
      }
      return true;
    });
  }, [productsList, selectedCategory, manualSearch]);

  // Auto-focus barcode input for instant scanning
  useEffect(() => {
    if (method === 'barcode') {
      barcodeInputRef.current?.focus();
    } else {
      manualSearchRef.current?.focus();
    }
  }, [method]);

  // High-Speed Barcode Processing (< 1ms)
  const handleBarcodeProcess = useCallback((rawCode: string) => {
    const t0 = performance.now();
    const code = rawCode.trim();
    if (!code) return;

    const found = barcodeIndex.get(code.toLowerCase());

    if (found) {
      const price = Number(found.retailPrice ?? found.price ?? 0);
      const barcodeKey = found.barcode || found.code || (found as any).sku || found.id;

      playScannerBeep();

      setCart((prevCart) => {
        const existingIndex = prevCart.findIndex(
          (item) => item.id === found.id || item.sku === barcodeKey
        );
        if (existingIndex >= 0) {
          const updated = [...prevCart];
          updated[existingIndex].qty += 1;
          return updated;
        } else {
          return [
            ...prevCart,
            {
              id: found.id,
              sku: barcodeKey,
              name: found.name,
              rate: price,
              qty: 1,
              discount: 0,
              stock: found.stock ?? 100,
              uom: found.uom || 'Pcs'
            }
          ];
        }
      });

      const elapsed = Math.round(performance.now() - t0);
      setLastScannedItem({ name: found.name, price, ms: elapsed });
      setScannedCode('');

      requestAnimationFrame(() => {
        barcodeInputRef.current?.focus();
      });
    } else {
      showToast(`Barcode "${code}" not found in inventory`, 'error');
      setScannedCode('');
    }
  }, [barcodeIndex, playScannerBeep, showToast]);

  const handleBarcodeKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleBarcodeProcess(scannedCode);
    }
  };

  const handleAddProductFromCatalog = (product: Product) => {
    const barcodeKey = product.barcode || product.code || (product as any).sku || product.id;
    handleBarcodeProcess(barcodeKey);
  };

  // Cart Adjustments
  const updateQuantity = (id: string, delta: number) => {
    setCart((prev) =>
      prev.map((item) => {
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
  const subtotal = useMemo(() => {
    return cart.reduce((sum, item) => sum + item.rate * item.qty - item.discount, 0);
  }, [cart]);
  
  const discountAmount = useMemo(() => {
    return discountType === 'fix' 
      ? globalDiscount 
      : (subtotal * (globalDiscount / 100));
  }, [discountType, globalDiscount, subtotal]);

  const netPayable = useMemo(() => {
    return Math.max(0, subtotal - discountAmount);
  }, [subtotal, discountAmount]);

  const paidVal = parseFloat(cashPaid) || 0;
  const changeAmount = Math.max(0, paidVal - netPayable);

  // Quick Cash preset buttons
  const setExactCash = () => setCashPaid(netPayable.toString());
  const addPresetCash = (amount: number) => setCashPaid(amount.toString());

  // Keyboard hotkeys for ultra-fast POS operation (F1, F2, F4)
  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      if (isReceiptModalOpen || isCameraScannerOpen) return;

      if (e.key === 'F1') {
        e.preventDefault();
        setMethod('barcode');
        barcodeInputRef.current?.focus();
      } else if (e.key === 'F2') {
        e.preventDefault();
        setExactCash();
      } else if (e.key === 'F4') {
        e.preventDefault();
        handleResetCart();
      }
    };

    window.addEventListener('keydown', handleGlobalKeyDown);
    return () => window.removeEventListener('keydown', handleGlobalKeyDown);
  }, [isReceiptModalOpen, isCameraScannerOpen, cart, netPayable]);

  // Customer Selection Auto-fill
  const handleSelectCustomer = (customerId: string) => {
    setSelectedCustomerId(customerId);
    const found = customers.find(c => c.id === customerId);
    if (found) {
      setClientName(found.businessName || found.ownerName);
      setClientPhone(found.phone || '');
    } else {
      setClientName('Walk-in Customer');
      setClientPhone('');
    }
  };

  // Save Sale & Print Trigger
  const handleSaveSale = async () => {
    if (cart.length === 0) {
      showToast('Cannot complete sale with an empty cart!', 'error');
      return;
    }
    if (isSavingSale) return;

    try {
      await withActionLock('pos_checkout', 2000, async () => {
        setIsSavingSale(true);
        const invoiceData: POSCompletedInvoice = {
          invoiceNo: `INV-${Date.now().toString().slice(-6)}`,
          date: new Date().toLocaleString('en-GB'),
          items: [...cart],
          subtotal,
          discount: discountAmount,
          netPayable,
          cashPaid: paidVal || netPayable,
          changeAmount: paidVal ? changeAmount : 0,
          customerName: clientName || 'Walk-in Customer',
          customerPhone: clientPhone || 'N/A',
          cashHead
        };

        setCompletedInvoice(invoiceData);

        if (user?.uid) {
          const companyTitle = companyProfile?.name || userProfile?.displayName || 'Counter Store';
          await addSalesInvoice({
            userId: user.uid,
            companyName: companyTitle,
            invoiceNo: invoiceData.invoiceNo,
            date: new Date().toISOString(),
            clientId: selectedCustomerId || '',
            clientName: invoiceData.customerName,
            clientCode: '',
            clientPhone: invoiceData.customerPhone,
            clientAddress: '',
            storeName: 'Main Store',
            type: 'cash',
            salesBy: userProfile?.displayName || 'Cashier',
            items: invoiceData.items.map(it => ({
              id: it.id,
              productName: it.name,
              itemCode: it.sku,
              quantity: it.qty,
              unit: it.uom || 'pcs',
              rate: it.rate,
              amount: it.rate * it.qty - it.discount
            })),
            totalAmount: invoiceData.subtotal,
            discountAmount: invoiceData.discount,
            netInvoiceAmount: invoiceData.netPayable,
            openingBalance: 0,
            netPayable: invoiceData.netPayable
          });
        }

        if (printAfterSave) {
          setIsReceiptModalOpen(true);
        } else {
          showToast('Sale completed successfully!', 'success');
          handleResetCart();
        }
      });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to complete sale';
      showToast(msg, 'error');
    } finally {
      setIsSavingSale(false);
    }
  };

  const companyDisplayName = companyProfile?.name || userProfile?.displayName || 'Counter Store';
  const displayAddress = companyProfile?.address || '';
  const displayPhone = companyProfile?.phone || '';

  return (
    <div className="w-full pb-16 px-0">
      <div className="bg-white border-2 sm:border-4 border-black shadow-[4px_4px_0px_#000] sm:shadow-[8px_8px_0px_#000] w-full flex flex-col rounded-sm overflow-hidden">
        
        {/* Header Bar */}
        <POSHeader
          printAfterSave={printAfterSave}
          setPrintAfterSave={setPrintAfterSave}
          isBeepEnabled={isBeepEnabled}
          setIsBeepEnabled={setIsBeepEnabled}
          method={method}
          setMethod={setMethod}
          onResetCart={handleResetCart}
        />

        {/* Control Bar: Scanner, Customer, Account */}
        <POSControlBar
          method={method}
          scannedCode={scannedCode}
          setScannedCode={setScannedCode}
          barcodeInputRef={barcodeInputRef}
          manualSearchRef={manualSearchRef}
          manualSearch={manualSearch}
          setManualSearch={setManualSearch}
          onBarcodeKeyDown={handleBarcodeKeyDown}
          onBarcodeProcess={handleBarcodeProcess}
          onOpenLiveScanner={() => setIsCameraScannerOpen(true)}
          lastScannedItem={lastScannedItem}
          customers={customers}
          selectedCustomerId={selectedCustomerId}
          onSelectCustomer={handleSelectCustomer}
          clientPhone={clientPhone}
          setClientPhone={setClientPhone}
          clientName={clientName}
          setClientName={setClientName}
          cashHead={cashHead}
          setCashHead={setCashHead}
        />

        {/* Catalog Grid (Visible in Catalog mode) */}
        {method === 'manual' && (
          <POSCatalogGrid
            categoriesList={categoriesList}
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
            filteredProducts={manualFilteredProducts}
            onAddProduct={handleAddProductFromCatalog}
          />
        )}

        {/* Cart Items Section */}
        <POSCartTable
          cart={cart}
          onUpdateRate={updateRate}
          onUpdateDiscount={updateDiscount}
          onUpdateQuantity={updateQuantity}
          onRemoveItem={removeItem}
        />

        {/* Financial & Checkout Dashboard */}
        <POSCheckoutSidebar
          discountType={discountType}
          setDiscountType={setDiscountType}
          globalDiscount={globalDiscount}
          setGlobalDiscount={setGlobalDiscount}
          onSetExactCash={setExactCash}
          onAddPresetCash={addPresetCash}
          cashPaid={cashPaid}
          setCashPaid={setCashPaid}
          changeAmount={changeAmount}
          cart={cart}
          subtotal={subtotal}
          discountAmount={discountAmount}
          netPayable={netPayable}
          isSavingSale={isSavingSale}
          onSaveSale={handleSaveSale}
        />

      </div>

      {/* Camera Live Barcode Scanner Modal */}
      <CameraBarcodeScanner
        isOpen={isCameraScannerOpen}
        onClose={() => setIsCameraScannerOpen(false)}
        onDetected={(code) => {
          setIsCameraScannerOpen(false);
          handleBarcodeProcess(code);
        }}
      />

      {/* Thermal Receipt Print Modal (ESC/POS 80mm format) */}
      <POSReceiptModal
        isOpen={isReceiptModalOpen}
        completedInvoice={completedInvoice}
        companyProfile={companyProfile}
        companyDisplayName={companyDisplayName}
        displayAddress={displayAddress}
        displayPhone={displayPhone}
        onClose={() => {
          setIsReceiptModalOpen(false);
          handleResetCart();
        }}
        onDone={() => {
          setIsReceiptModalOpen(false);
          handleResetCart();
          showToast('Transaction completed & logged', 'success');
        }}
      />

    </div>
  );
};
