"use client";

import React, { useState, useEffect } from "react";
import { 
  Trash2, 
  Printer, 
  Barcode as BarcodeIcon, 
  Plus, 
  Settings2, 
  Eye, 
  Sparkles,
  PackageCheck
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { getProducts } from "@/lib/inventoryStorage";
import { Product } from "@/types/inventory";

interface BarcodePrintItem {
  id: string;
  productName: string;
  productCode: string;
  price: number;
  quantity: number;
}

const DEFAULT_PRODUCTS: Product[] = [
  { id: "1", userId: "", name: "Formal Cotton Shirt (Blue - L)", sku: "890123456789", category: "Fashion", price: 1450, cost: 950, stock: 45, minStock: 5, createdAt: "", updatedAt: "" },
  { id: "2", userId: "", name: "Slim Fit Denim Jeans (32)", sku: "890123456790", category: "Fashion", price: 2200, cost: 1500, stock: 32, minStock: 5, createdAt: "", updatedAt: "" },
  { id: "3", userId: "", name: "Polo T-Shirt Casual (Black)", sku: "890123456791", category: "Fashion", price: 850, cost: 500, stock: 60, minStock: 10, createdAt: "", updatedAt: "" },
  { id: "4", userId: "", name: "Wireless Optical Mouse", sku: "890123456793", category: "Electronics", price: 650, cost: 420, stock: 18, minStock: 3, createdAt: "", updatedAt: "" }
];

export const PurchaseGenerateBarcodePage: React.FC<{ showToast: (msg: string, type?: "success" | "error") => void }> = ({ showToast }) => {
  const { user } = useAuth();
  const [productsList, setProductsList] = useState<Product[]>(DEFAULT_PRODUCTS);
  
  // Generation List
  const [items, setItems] = useState<BarcodePrintItem[]>([
    { id: "item-1", productName: "Formal Cotton Shirt (Blue - L)", productCode: "890123456789", price: 1450, quantity: 6 }
  ]);

  // Form Inputs
  const [selectedProductId, setSelectedProductId] = useState<string>("");
  const [customName, setCustomName] = useState<string>("");
  const [customCode, setCustomCode] = useState<string>("");
  const [customPrice, setCustomPrice] = useState<string>("");
  const [stickerCount, setStickerCount] = useState<string>("6");

  // Sticker Printer Format Configuration
  const [labelFormat, setLabelFormat] = useState<"thermal_50x30" | "thermal_40x25" | "a4_sheet">("thermal_50x30");
  const [storeName, setStoreName] = useState<string>("SHOMPORKO CRM");
  const [showPrice, setShowPrice] = useState<boolean>(true);
  const [showStoreName, setShowStoreName] = useState<boolean>(true);

  // Load Inventory from DB
  useEffect(() => {
    if (user?.uid) {
      getProducts(user.uid)
        .then((prods) => {
          if (prods && prods.length > 0) {
            setProductsList(prods);
          }
        })
        .catch(() => {});
    }
  }, [user]);

  const handleProductSelect = (prodId: string) => {
    setSelectedProductId(prodId);
    const found = productsList.find((p) => p.id === prodId);
    if (found) {
      setCustomName(found.name);
      setCustomCode(found.sku);
      setCustomPrice(found.price.toString());
    }
  };

  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customName || !customCode) {
      showToast("Please provide product name and barcode number", "error");
      return;
    }

    const count = parseInt(stickerCount, 10);
    if (isNaN(count) || count <= 0) {
      showToast("Please enter a valid sticker quantity", "error");
      return;
    }

    const newItem: BarcodePrintItem = {
      id: Date.now().toString(),
      productName: customName,
      productCode: customCode,
      price: parseFloat(customPrice) || 0,
      quantity: count
    };

    setItems([...items, newItem]);
    showToast("Added to barcode print queue", "success");
    setSelectedProductId("");
    setCustomName("");
    setCustomCode("");
    setCustomPrice("");
  };

  const removeItem = (id: string) => {
    setItems(items.filter((item) => item.id !== id));
  };

  const clearAll = () => {
    setItems([]);
  };

  // Generate expanded flat list of stickers for rendering and printing
  const expandedStickers = items.flatMap((item) =>
    Array.from({ length: item.quantity }, (_, idx) => ({
      ...item,
      uniqueKey: `${item.id}-${idx}`
    }))
  );

  const handlePrint = () => {
    if (expandedStickers.length === 0) {
      showToast("No stickers in queue to print", "error");
      return;
    }
    window.print();
  };

  return (
    <div className="w-full mx-auto pb-24 px-2 sm:px-4">
      
      {/* Outer Brutalist Frame */}
      <div className="bg-white border-4 border-black shadow-[8px_8px_0px_#000] w-full flex flex-col">
        
        {/* Header Bar */}
        <div className="px-6 py-4 flex flex-wrap items-center justify-between border-b-4 border-black bg-indigo-50 gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-indigo-600 text-white flex items-center justify-center border-2 border-black font-black">
              <BarcodeIcon className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl font-display font-black text-black uppercase tracking-tight">
                BARCODE LABEL & STICKER GENERATOR
              </h1>
              <p className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Compatible with Thermal Label Printers (Xprinter, Zebra, TSC) & A4 Sheets
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button 
              type="button" 
              onClick={handlePrint}
              disabled={expandedStickers.length === 0}
              className="px-5 py-2.5 bg-black hover:bg-slate-800 disabled:opacity-50 text-white font-black text-xs uppercase tracking-wider border-2 border-black shadow-[3px_3px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none flex items-center gap-2"
            >
              <Printer className="w-4 h-4 text-amber-300" />
              PRINT LABELS NOW ({expandedStickers.length})
            </button>
          </div>
        </div>

        {/* Configuration Section */}
        <div className="p-6 border-b-4 border-black bg-slate-50">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            
            {/* Left 7 Columns: Product Selection & Add to Print Queue */}
            <div className="md:col-span-7 bg-white border-3 border-black p-5 shadow-[4px_4px_0px_#000]">
              <h2 className="text-xs font-black uppercase tracking-wider mb-4 flex items-center gap-2">
                <Plus className="w-4 h-4 text-indigo-600" /> ADD PRODUCTS TO LABEL PRINT QUEUE
              </h2>

              <form onSubmit={handleAddItem} className="space-y-4">
                
                {/* Select from Inventory */}
                <div>
                  <label className="text-xs font-bold text-black block mb-1 uppercase">
                    CHOOSE FROM INVENTORY OR TYPE CUSTOM:
                  </label>
                  <select
                    value={selectedProductId}
                    onChange={(e) => handleProductSelect(e.target.value)}
                    className="w-full text-sm font-bold text-black bg-white px-3 py-2 border-2 border-black shadow-[2px_2px_0px_#000] outline-none"
                  >
                    <option value="">-- Select Product from Inventory --</option>
                    {productsList.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name} - Barcode: {p.sku} (৳{p.price})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-black block mb-1 uppercase">
                      PRODUCT TITLE <span className="text-rose-600">*</span>
                    </label>
                    <input
                      type="text"
                      value={customName}
                      onChange={(e) => setCustomName(e.target.value)}
                      placeholder="e.g. Denim Jeans"
                      className="w-full text-sm font-bold text-black bg-white px-3 py-2 border-2 border-black outline-none"
                      required
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-black block mb-1 uppercase">
                      BARCODE / SKU CODE <span className="text-rose-600">*</span>
                    </label>
                    <input
                      type="text"
                      value={customCode}
                      onChange={(e) => setCustomCode(e.target.value)}
                      placeholder="e.g. 890123456789"
                      className="w-full text-sm font-bold font-mono text-black bg-white px-3 py-2 border-2 border-black outline-none uppercase"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-black block mb-1 uppercase">
                      PRICE (৳ BDT):
                    </label>
                    <input
                      type="number"
                      value={customPrice}
                      onChange={(e) => setCustomPrice(e.target.value)}
                      placeholder="1200"
                      className="w-full text-sm font-bold text-black bg-white px-3 py-2 border-2 border-black outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-black block mb-1 uppercase">
                      STICKER QUANTITY TO PRINT:
                    </label>
                    <input
                      type="number"
                      min="1"
                      value={stickerCount}
                      onChange={(e) => setStickerCount(e.target.value)}
                      className="w-full text-sm font-bold text-black bg-white px-3 py-2 border-2 border-black outline-none"
                    />
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs uppercase tracking-wider border-2 border-black shadow-[3px_3px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 transition-all"
                  >
                    + ADD TO PRINT QUEUE
                  </button>
                </div>

              </form>
            </div>

            {/* Right 5 Columns: Label Hardware Options */}
            <div className="md:col-span-5 bg-amber-100 border-3 border-black p-5 shadow-[4px_4px_0px_#000] flex flex-col justify-between">
              <div>
                <h2 className="text-xs font-black uppercase tracking-wider mb-4 flex items-center gap-2">
                  <Settings2 className="w-4 h-4 text-black" /> LABEL PRINTER HARDWARE SETTINGS
                </h2>

                <div className="space-y-4">
                  <div>
                    <label className="text-xs font-black text-black block mb-1 uppercase">
                      STICKER ROLL / PAPER FORMAT:
                    </label>
                    <select
                      value={labelFormat}
                      onChange={(e) => setLabelFormat(e.target.value as any)}
                      className="w-full text-xs font-black text-black bg-white px-3 py-2 border-2 border-black shadow-[2px_2px_0px_#000] outline-none"
                    >
                      <option value="thermal_50x30">50mm x 30mm Thermal Roll (Single Column)</option>
                      <option value="thermal_40x25">40mm x 25mm Thermal Roll (2-Up Roll)</option>
                      <option value="a4_sheet">A4 Sticker Sheet (3 Columns x 8 Rows = 24/Page)</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-black text-black block mb-1 uppercase">
                      HEADER STORE NAME:
                    </label>
                    <input
                      type="text"
                      value={storeName}
                      onChange={(e) => setStoreName(e.target.value)}
                      className="w-full text-xs font-bold text-black bg-white px-3 py-2 border-2 border-black outline-none"
                    />
                  </div>

                  <div className="space-y-2 pt-2 border-t-2 border-black/20">
                    <label className="flex items-center gap-2 text-xs font-bold text-black cursor-pointer">
                      <input
                        type="checkbox"
                        checked={showStoreName}
                        onChange={(e) => setShowStoreName(e.target.checked)}
                        className="w-4 h-4 accent-black"
                      />
                      PRINT STORE NAME ON TOP
                    </label>
                    <label className="flex items-center gap-2 text-xs font-bold text-black cursor-pointer">
                      <input
                        type="checkbox"
                        checked={showPrice}
                        onChange={(e) => setShowPrice(e.target.checked)}
                        className="w-4 h-4 accent-black"
                      />
                      PRINT MRP PRICE (৳)
                    </label>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t-2 border-black/30">
                <p className="text-[11px] font-bold text-slate-800">
                  <span className="font-black">Hardware Tip:</span> Works directly with Xprinter XP-365B, XP-420B, Zebra ZD220, Rongta RP400, or any ESC/POS label roll printer.
                </p>
              </div>

            </div>

          </div>
        </div>

        {/* Print Queue Summary Table */}
        <div className="p-6 border-b-4 border-black">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xs font-black uppercase tracking-wider flex items-center gap-2">
              <PackageCheck className="w-4 h-4 text-indigo-600" />
              PRINT QUEUE SUMMARY ({items.length} PRODUCTS, {expandedStickers.length} TOTAL STICKERS)
            </h3>
            {items.length > 0 && (
              <button
                type="button"
                onClick={clearAll}
                className="text-xs font-bold text-rose-700 hover:underline uppercase"
              >
                CLEAR ALL
              </button>
            )}
          </div>

          <div className="border-3 border-black shadow-[3px_3px_0px_#000] overflow-x-auto bg-white">
            <table className="w-full text-left text-sm text-black">
              <thead className="bg-black text-white text-xs font-black uppercase">
                <tr>
                  <th className="px-4 py-2 w-12 text-center">SL#</th>
                  <th className="px-4 py-2">PRODUCT NAME</th>
                  <th className="px-4 py-2">BARCODE / SKU</th>
                  <th className="px-4 py-2 text-right">PRICE (৳)</th>
                  <th className="px-4 py-2 text-center">STICKER QTY</th>
                  <th className="px-4 py-2 text-center w-16">REMOVE</th>
                </tr>
              </thead>
              <tbody className="divide-y-2 divide-slate-200">
                {items.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-4 py-6 text-center text-xs font-bold text-slate-500">
                      No products added to queue yet. Use the form above to add stickers.
                    </td>
                  </tr>
                ) : (
                  items.map((item, idx) => (
                    <tr key={item.id} className="hover:bg-slate-50 font-bold">
                      <td className="px-4 py-2.5 text-center">{idx + 1}</td>
                      <td className="px-4 py-2.5">{item.productName}</td>
                      <td className="px-4 py-2.5 font-mono text-indigo-700">{item.productCode}</td>
                      <td className="px-4 py-2.5 text-right">৳ {item.price.toLocaleString()}</td>
                      <td className="px-4 py-2.5 text-center">
                        <span className="px-2 py-0.5 bg-amber-100 border border-black font-black">
                          {item.quantity} stickers
                        </span>
                      </td>
                      <td className="px-4 py-2.5 text-center">
                        <button
                          type="button"
                          onClick={() => removeItem(item.id)}
                          className="p-1 hover:text-rose-600 hover:bg-rose-50"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Live Sticker Preview Container (Also targets @media print) */}
        <div className="p-6 bg-slate-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xs font-black uppercase tracking-wider flex items-center gap-2">
              <Eye className="w-4 h-4 text-indigo-600" />
              LIVE PRINT PREVIEW (FORMAT: {labelFormat.toUpperCase()})
            </h3>
            <span className="text-[11px] font-bold text-slate-600">
              Only this preview area prints when you hit &quot;Print Labels&quot;
            </span>
          </div>

          {/* Printable Sticker Sheet */}
          <div id="barcode-sticker-sheet" className="bg-white border-2 border-dashed border-slate-400 p-6 shadow-sm">
            {expandedStickers.length === 0 ? (
              <div className="py-12 text-center text-slate-400 font-bold uppercase text-xs">
                Sticker preview will appear here once items are added
              </div>
            ) : (
              <div className={
                labelFormat === "a4_sheet" 
                  ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4" 
                  : labelFormat === "thermal_40x25"
                  ? "grid grid-cols-2 gap-3 max-w-md mx-auto"
                  : "grid grid-cols-1 gap-3 max-w-xs mx-auto"
              }>
                {expandedStickers.map((st) => (
                  <div
                    key={st.uniqueKey}
                    className="border-2 border-black p-3 bg-white text-center flex flex-col items-center justify-between shadow-sm rounded-sm"
                    style={{ minHeight: "120px" }}
                  >
                    {showStoreName && (
                      <p className="text-[10px] font-black uppercase tracking-widest text-black border-b border-black/40 pb-0.5 w-full truncate">
                        {storeName}
                      </p>
                    )}
                    
                    <p className="text-[11px] font-black text-black line-clamp-1 mt-1">
                      {st.productName}
                    </p>

                    {/* SVG Vector Code-128 Barcode Simulation */}
                    <div className="my-1.5 flex flex-col items-center w-full">
                      <div className="h-9 w-full flex items-center justify-center gap-[2px] overflow-hidden px-2">
                        {st.productCode.split('').map((char, cIdx) => {
                          const codeVal = char.charCodeAt(0);
                          const isThick = codeVal % 3 === 0;
                          const isMed = codeVal % 2 === 0;
                          return (
                            <div
                              key={cIdx}
                              className={`bg-black h-full ${isThick ? 'w-[3px]' : isMed ? 'w-[2px]' : 'w-[1px]'}`}
                            />
                          );
                        })}
                        {/* Repeat bars for realistic density */}
                        {st.productCode.split('').reverse().map((char, cIdx) => (
                          <div
                            key={`r-${cIdx}`}
                            className={`bg-black h-full ${char.charCodeAt(0) % 2 === 0 ? 'w-[2px]' : 'w-[1px]'}`}
                          />
                        ))}
                      </div>
                      <span className="text-[10px] font-mono font-black tracking-widest text-black mt-0.5">
                        {st.productCode}
                      </span>
                    </div>

                    {showPrice && (
                      <p className="text-xs font-black text-black border-t border-black/40 pt-0.5 w-full">
                        MRP: ৳ {st.price.toLocaleString()}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>

      </div>

    </div>
  );
};
