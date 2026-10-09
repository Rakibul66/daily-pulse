"use client";

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Product, ProductCategory, MeasurementUnit, ProductBrand, ProductTag } from '@/types/product';
import { 
  Package, 
  Barcode, 
  ArrowLeft, 
  Save, 
  Loader2, 
  Sparkles,
  Camera,
  Tag as TagIcon,
  Zap
} from 'lucide-react';
import { SearchableSelect } from '../ui/SearchableSelect';
import { DEFAULT_PRODUCT_CATEGORIES, DEFAULT_PRODUCT_BRANDS, DEFAULT_PRODUCT_TAGS } from '@/lib/productStorage';
import { CameraBarcodeScanner } from '../ui/CameraBarcodeScanner';
import { ProductImageStudio } from './modal/ProductImageStudio';
import { ProductPricingSection } from './modal/ProductPricingSection';
import { ProductSeoSection } from './modal/ProductSeoSection';

interface ProductCreateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (product: Omit<Product, 'id' | 'userId' | 'createdAt' | 'updatedAt'> & { userId?: string; companyId?: string }) => Promise<void>;
  initialData?: Product | null;
  categories: ProductCategory[];
  units: MeasurementUnit[];
  brands?: ProductBrand[];
  tags?: ProductTag[];
}

export const ProductCreateModal: React.FC<ProductCreateModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialData,
  categories,
  units,
  brands = [],
  tags = [],
}) => {
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    parentCategory: '',
    childCategory: '',
    brand: '',
    tags: [] as string[],
    uom: 'Pcs',
    reorderLevel: 5,
    purchasePrice: 0,
    clientPrice: 0,
    retailPrice: 0,
    discountPercentage: 0,
    discountAmount: 0,
    image: '',
    otherImages: [] as string[],
    shortDescription: '',
    longDescription: '',
    seoTitle: '',
    seoKeywords: '',
    seoDescription: '',
    status: 'ACTIVE' as 'ACTIVE' | 'INACTIVE',
    stock: 0,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [isScannedFlash, setIsScannedFlash] = useState(false);

  // Play high-pitch retail confirmation beep when barcode scanned
  const playScannerBeep = () => {
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(1400, audioCtx.currentTime);
      gain.gain.setValueAtTime(0.25, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.08);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.08);
    } catch {
      // AudioContext unavailable or restricted
    }
  };

  const triggerScannedFeedback = (codeValue: string) => {
    setFormData(prev => ({ ...prev, code: codeValue }));
    playScannerBeep();
    setIsScannedFlash(true);
    setTimeout(() => setIsScannedFlash(false), 2400);
  };

  // Hardware Barcode Scanner Modal-Wide Interceptor (USB / Bluetooth Guns)
  useEffect(() => {
    if (!isOpen) return;

    let buffer = '';
    let lastKeyTime = Date.now();

    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      if (isCameraOpen) return;

      const currentTime = Date.now();
      const timeDiff = currentTime - lastKeyTime;
      lastKeyTime = currentTime;

      // Hardware barcode scanners send characters with < 45ms interval between keys
      if (e.key === 'Enter') {
        if (buffer.length >= 3 && timeDiff < 60) {
          e.preventDefault();
          e.stopPropagation();
          const scannedCode = buffer.trim();
          buffer = '';
          triggerScannedFeedback(scannedCode);
          return;
        }
        buffer = '';
        return;
      }

      if (timeDiff > 60) {
        buffer = '';
      }

      if (e.key.length === 1 && !e.ctrlKey && !e.metaKey && !e.altKey) {
        buffer += e.key;
      }
    };

    window.addEventListener('keydown', handleGlobalKeyDown, true);
    return () => {
      window.removeEventListener('keydown', handleGlobalKeyDown, true);
    };
  }, [isOpen, isCameraOpen]);

  const handleBarcodeKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (formData.code.trim()) {
        triggerScannedFeedback(formData.code.trim());
      }
    }
  };

  const wasOpenRef = useRef(false);

  useEffect(() => {
    if (isOpen && !wasOpenRef.current) {
      if (initialData) {
        setFormData({
          name: initialData.name || '',
          code: initialData.code || initialData.sku || '',
          parentCategory: initialData.parentCategory || initialData.category || categories[0]?.name || DEFAULT_PRODUCT_CATEGORIES[0]?.name || 'Baby Products',
          childCategory: initialData.childCategory || '',
          brand: initialData.brand || '',
          tags: Array.isArray(initialData.tags) ? initialData.tags : [],
          uom: initialData.uom || 'Pcs',
          reorderLevel: Number(initialData.reorderLevel ?? initialData.minStock ?? 5),
          purchasePrice: Number(initialData.purchasePrice ?? initialData.cost ?? 0),
          clientPrice: Number(initialData.clientPrice ?? initialData.retailPrice ?? initialData.price ?? 0),
          retailPrice: Number(initialData.retailPrice ?? initialData.price ?? 0),
          discountPercentage: Number(initialData.discountPercentage ?? 0),
          discountAmount: Number(initialData.discountAmount ?? 0),
          image: initialData.image || '',
          otherImages: Array.isArray(initialData.otherImages) ? initialData.otherImages : [],
          shortDescription: initialData.shortDescription || '',
          longDescription: initialData.longDescription || '',
          seoTitle: initialData.seoTitle || '',
          seoKeywords: initialData.seoKeywords || '',
          seoDescription: initialData.seoDescription || '',
          status: initialData.status === 'INACTIVE' ? 'INACTIVE' : 'ACTIVE',
          stock: Number(initialData.stock ?? 0),
        });
      } else {
        const randomBarcode = String(Math.floor(100000 + Math.random() * 900000));
        setFormData({
          name: '',
          code: randomBarcode,
          parentCategory: categories[0]?.name || DEFAULT_PRODUCT_CATEGORIES[0]?.name || 'Baby Products',
          childCategory: '',
          brand: '',
          tags: [],
          uom: units[0]?.code || 'Pcs',
          reorderLevel: 5,
          purchasePrice: 0,
          clientPrice: 0,
          retailPrice: 0,
          discountPercentage: 0,
          discountAmount: 0,
          image: '',
          otherImages: [],
          shortDescription: '',
          longDescription: '',
          seoTitle: '',
          seoKeywords: '',
          seoDescription: '',
          status: 'ACTIVE',
          stock: 0,
        });
      }
    }
    wasOpenRef.current = isOpen;
  }, [isOpen, initialData, categories, units]);

  if (!isOpen) return null;

  const generateBarcode = () => {
    const code = String(Math.floor(100000000000 + Math.random() * 900000000000));
    setFormData(prev => ({ ...prev, code }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedName = formData.name.trim();
    if (!trimmedName) {
      alert("Please enter a product name.");
      return;
    }
    const trimmedCode = formData.code.trim() || String(Math.floor(100000 + Math.random() * 900000));
    const parentCategory = (formData.parentCategory || '').trim() || categories[0]?.name || DEFAULT_PRODUCT_CATEGORIES[0]?.name || 'Baby Products';

    setIsSubmitting(true);
    try {
      const retailPrice = !isNaN(Number(formData.retailPrice)) && Number(formData.retailPrice) >= 0 ? Number(formData.retailPrice) : 0;
      const purchasePrice = !isNaN(Number(formData.purchasePrice)) && Number(formData.purchasePrice) >= 0 ? Number(formData.purchasePrice) : 0;
      const clientPrice = !isNaN(Number(formData.clientPrice)) && Number(formData.clientPrice) >= 0 ? Number(formData.clientPrice) : retailPrice;
      const reorderLevel = !isNaN(Number(formData.reorderLevel)) && Number(formData.reorderLevel) >= 0 ? Number(formData.reorderLevel) : 5;
      const stock = !isNaN(Number(formData.stock)) && Number(formData.stock) >= 0 ? Number(formData.stock) : 0;
      const discountPercentage = !isNaN(Number(formData.discountPercentage)) ? Number(formData.discountPercentage) : 0;
      const discountAmount = !isNaN(Number(formData.discountAmount)) ? Number(formData.discountAmount) : 0;

      await onSave({
        ...formData,
        name: trimmedName,
        code: trimmedCode,
        sku: trimmedCode,
        barcode: trimmedCode,
        parentCategory,
        category: parentCategory,
        retailPrice,
        price: retailPrice,
        purchasePrice,
        cost: purchasePrice,
        clientPrice,
        reorderLevel,
        minStock: reorderLevel,
        stock,
        discountPercentage,
        discountAmount,
      });
      onClose();
    } catch (err) {
      console.error('Modal submission error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputClasses = "w-full text-xs font-bold text-black bg-white px-3 py-2 border-2 border-black focus:outline-none focus:bg-amber-50 placeholder-slate-400";
  const labelClasses = "text-[11px] font-black uppercase text-black block mb-1 tracking-wider";

  const parentCategoryOptions = useMemo(() => {
    const names = new Set<string>();
    categories.forEach(c => names.add(c.name));
    DEFAULT_PRODUCT_CATEGORIES.forEach(c => names.add(c.name));
    return Array.from(names).sort().map(name => ({ value: name, label: name }));
  }, [categories]);

  const brandOptions = useMemo(() => {
    const names = new Set<string>();
    const options: { value: string; label: string }[] = [];
    (brands || []).forEach(b => {
      if (b.name && !names.has(b.name.toLowerCase())) {
        names.add(b.name.toLowerCase());
        options.push({ value: b.name, label: b.code ? `${b.name} (${b.code})` : b.name });
      }
    });
    DEFAULT_PRODUCT_BRANDS.forEach(b => {
      if (!names.has(b.name.toLowerCase())) {
        names.add(b.name.toLowerCase());
        options.push({ value: b.name, label: `${b.name} (${b.code})` });
      }
    });
    return options;
  }, [brands]);

  const availableTags = useMemo(() => {
    const names = new Set<string>();
    const list: { name: string; color: string }[] = [];
    (tags || []).forEach(t => {
      if (t.name && !names.has(t.name.toLowerCase())) {
        names.add(t.name.toLowerCase());
        list.push({ name: t.name, color: t.color || '#f59e0b' });
      }
    });
    DEFAULT_PRODUCT_TAGS.forEach(t => {
      if (!names.has(t.name.toLowerCase())) {
        names.add(t.name.toLowerCase());
        list.push({ name: t.name, color: t.color });
      }
    });
    return list;
  }, [tags]);

  const toggleTag = (tagName: string) => {
    setFormData(prev => {
      const exists = prev.tags.includes(tagName);
      return {
        ...prev,
        tags: exists ? prev.tags.filter(t => t !== tagName) : [...prev.tags, tagName],
      };
    });
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 pt-6 sm:pt-10 overflow-y-auto">
      <div className="bg-white border-2 sm:border-4 border-black shadow-[8px_8px_0px_#000] w-full max-w-4xl max-h-[92vh] flex flex-col my-auto overflow-hidden animate-in zoom-in-95 duration-200">
        
        {/* Accent Strip */}
        <div className="h-2.5 bg-amber-400 border-b-2 border-black w-full shrink-0" />

        {/* Modal Header Bar */}
        <div className="px-5 py-3.5 border-b-2 border-black bg-white flex flex-wrap items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 bg-amber-300 border-2 border-black shadow-[2px_2px_0px_#000]">
              <Package className="w-5 h-5 text-black stroke-[2.5]" />
            </div>
            <div>
              <h2 className="text-base font-black uppercase tracking-wider text-black">
                {initialData ? 'Edit Product' : 'Add New Product'}
              </h2>
              <p className="text-[10px] font-bold text-slate-600 uppercase">
                Configure catalog specifications, pricing &amp; SEO
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="flex items-center gap-1.5 px-4 py-2 bg-white hover:bg-slate-200 text-black border-2 border-black text-xs font-black uppercase shadow-[2px_2px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5 stroke-[2.5]" />
              <span>Go Back</span>
            </button>
            <button
              type="submit"
              form="product-create-form"
              disabled={isSubmitting}
              className="flex items-center gap-1.5 px-5 py-2 bg-emerald-400 hover:bg-emerald-300 text-black border-2 border-black text-xs font-black uppercase shadow-[2px_2px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 transition-all cursor-pointer disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 stroke-[2.5]" />
                  <span>Save Product</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Scrollable Form Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-6 flex-1 custom-scrollbar">
          <form id="product-create-form" onSubmit={handleSubmit} className="space-y-6">

            {/* Basic Information Section */}
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Product Name */}
                <div>
                  <label className={labelClasses}>Product Name *</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={e => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    className={inputClasses}
                    placeholder="Product Name."
                    required
                  />
                </div>

                {/* Barcode / SKU Code */}
                <div>
                  <div className="flex flex-wrap items-center justify-between mb-1 gap-1">
                    <label className={labelClasses}>Barcode / SKU Code *</label>
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] font-black uppercase text-indigo-700 bg-indigo-50 border border-black px-1.5 py-0.5 flex items-center gap-1 shadow-[1px_1px_0px_#000]">
                        <Zap className="w-2.5 h-2.5 text-indigo-600 fill-indigo-600" /> Machine Ready
                      </span>
                      <button
                        type="button"
                        onClick={() => setIsCameraOpen(true)}
                        className="text-[10px] font-black uppercase bg-amber-300 hover:bg-amber-400 text-black border border-black px-1.5 py-0.5 flex items-center gap-1 shadow-[1px_1px_0px_#000] cursor-pointer"
                        title="Scan with Mac / Laptop Camera"
                      >
                        <Camera className="w-3 h-3" /> Camera
                      </button>
                      <button
                        type="button"
                        onClick={generateBarcode}
                        className="text-[10px] font-black uppercase text-indigo-700 hover:underline flex items-center gap-1 cursor-pointer"
                        title="Generate random barcode"
                      >
                        <Sparkles className="w-3 h-3" /> Auto
                      </button>
                    </div>
                  </div>
                  <div className="relative">
                    <input
                      type="text"
                      value={formData.code}
                      onChange={e => setFormData(prev => ({ ...prev, code: e.target.value }))}
                      onKeyDown={handleBarcodeKeyDown}
                      className={`${inputClasses} font-mono tracking-widest uppercase pr-10 transition-colors ${
                        isScannedFlash ? 'bg-emerald-100 ring-2 ring-emerald-600 font-black' : ''
                      }`}
                      placeholder="e.g. 894112345678"
                      required
                    />
                    <div className="absolute right-2.5 top-1/2 -translate-y-1/2 flex items-center gap-1 text-slate-400">
                      <Barcode className="w-4 h-4" />
                    </div>
                  </div>
                  {isScannedFlash && (
                    <p className="text-[10px] font-black uppercase text-emerald-800 mt-1 flex items-center gap-1">
                      <span>✓ Scanned Successfully!</span>
                    </p>
                  )}
                </div>
              </div>

              {/* Category, Brand & UOM row */}
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                {/* Parent Category */}
                <div>
                  <label className={labelClasses}>Parent Category *</label>
                  <SearchableSelect
                    options={parentCategoryOptions}
                    value={formData.parentCategory}
                    onChange={(val) => setFormData(prev => ({ ...prev, parentCategory: val }))}
                    placeholder="Select category..."
                    required
                  />
                </div>

                {/* Child Category */}
                <div>
                  <label className={labelClasses}>Child Category</label>
                  <input
                    type="text"
                    value={formData.childCategory}
                    onChange={e => setFormData(prev => ({ ...prev, childCategory: e.target.value }))}
                    className={inputClasses}
                    placeholder="Child Category"
                  />
                </div>

                {/* Brand */}
                <div>
                  <label className={labelClasses}>Brand</label>
                  <SearchableSelect
                    options={brandOptions}
                    value={formData.brand}
                    onChange={(val) => setFormData(prev => ({ ...prev, brand: val }))}
                    placeholder="Select brand..."
                  />
                </div>

                {/* UOM */}
                <div>
                  <label className={labelClasses}>Unit of Measure (UOM) *</label>
                  <select
                    value={formData.uom}
                    onChange={e => setFormData(prev => ({ ...prev, uom: e.target.value }))}
                    className={inputClasses}
                    required
                  >
                    {units.map(u => (
                      <option key={u.id} value={u.code}>
                        {u.name} ({u.code})
                      </option>
                    ))}
                    {units.length === 0 && (
                      <>
                        <option value="Pcs">Pieces (Pcs)</option>
                        <option value="Kg">Kilogram (Kg)</option>
                        <option value="Box">Box (Box)</option>
                      </>
                    )}
                  </select>
                </div>
              </div>

              {/* Tags Selector */}
              <div>
                <label className={labelClasses}>Tags</label>
                <div className="flex flex-wrap gap-1.5 p-2 bg-slate-50 border-2 border-black min-h-[42px] items-center">
                  {availableTags.map(tag => {
                    const isSelected = formData.tags.includes(tag.name);
                    return (
                      <button
                        key={tag.name}
                        type="button"
                        onClick={() => toggleTag(tag.name)}
                        style={{ backgroundColor: isSelected ? tag.color : '#ffffff' }}
                        className={`px-2.5 py-1 text-xs font-black uppercase text-black border-2 border-black transition-all cursor-pointer flex items-center gap-1.5 ${
                          isSelected
                            ? 'shadow-[2px_2px_0px_#000] scale-102 ring-1 ring-black'
                            : 'hover:bg-slate-100 hover:shadow-[1px_1px_0px_#000]'
                        }`}
                      >
                        <TagIcon className="w-3 h-3 stroke-[2.5]" />
                        <span>{tag.name}</span>
                        {isSelected && <span className="text-[11px] font-black">✓</span>}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Product Media & Image Studio */}
              <ProductImageStudio
                image={formData.image}
                otherImages={formData.otherImages}
                reorderLevel={formData.reorderLevel}
                onImageChange={(image) => setFormData(prev => ({ ...prev, image }))}
                onOtherImagesChange={(otherImages) => setFormData(prev => ({ ...prev, otherImages }))}
                onReorderLevelChange={(reorderLevel) => setFormData(prev => ({ ...prev, reorderLevel }))}
              />
            </div>

            {/* Pricing & Discounts */}
            <ProductPricingSection
              purchasePrice={formData.purchasePrice}
              clientPrice={formData.clientPrice}
              retailPrice={formData.retailPrice}
              discountPercentage={formData.discountPercentage}
              discountAmount={formData.discountAmount}
              onChange={(fields) => setFormData(prev => ({ ...prev, ...fields }))}
            />

            {/* SEO & Status */}
            <ProductSeoSection
              longDescription={formData.longDescription}
              seoTitle={formData.seoTitle}
              seoKeywords={formData.seoKeywords}
              seoDescription={formData.seoDescription}
              status={formData.status}
              onChange={(fields) => setFormData(prev => ({ ...prev, ...fields }))}
            />
          </form>
        </div>

        {/* Modal Bottom Bar */}
        <div className="px-5 py-3.5 border-t-2 border-black bg-slate-50 flex items-center justify-end gap-3 shrink-0">
          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="px-4 py-2 text-xs font-black uppercase text-black bg-white hover:bg-slate-200 border-2 border-black transition-all cursor-pointer shadow-[2px_2px_0px_#000] active:translate-x-0.5 active:translate-y-0.5"
          >
            Cancel
          </button>
          <button
            type="submit"
            form="product-create-form"
            disabled={isSubmitting}
            className="flex items-center gap-1.5 px-6 py-2 text-xs font-black uppercase text-black bg-emerald-400 hover:bg-emerald-300 border-2 border-black transition-all cursor-pointer shadow-[2px_2px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 disabled:opacity-50"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Saving...</span>
              </>
            ) : (
              <span>{initialData ? 'Update Product' : 'Save Product'}</span>
            )}
          </button>
        </div>
      </div>

      {/* Optional Camera Barcode Scanner */}
      <CameraBarcodeScanner
        isOpen={isCameraOpen}
        onClose={() => setIsCameraOpen(false)}
        onDetected={triggerScannedFeedback}
      />
    </div>
  );
};
