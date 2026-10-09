"use client";

import React, { useState, useEffect } from "react";
import { 
  Trash2, 
  Printer, 
  Barcode as BarcodeIcon, 
  Plus, 
  ArrowLeft, 
  Save, 
  Eye, 
  X,
  Store,
  Layers,
  Settings2
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { getProducts } from "@/lib/productStorage";
import { Product } from "@/types/product";

interface BarcodeQueueItem {
  id: string;
  productId?: string;
  productName: string;
  productCode: string;
  price: number;
  quantity: number;
}

export const PurchaseGenerateBarcodePage: React.FC<{ showToast: (msg: string, type?: "success" | "error" | "info") => void }> = ({ showToast }) => {
  const { user, userProfile } = useAuth();
  const [productsCatalog, setProductsCatalog] = useState<Product[]>([]);
  const [isLoadingProducts, setIsLoadingProducts] = useState<boolean>(true);

  // Queue List
  const [queue, setQueue] = useState<BarcodeQueueItem[]>([
    {
      id: "q-1",
      productName: "Pure Ghee 1kg Can",
      productCode: "89012301",
      price: 1186.66,
      quantity: 10
    },
    {
      id: "q-2",
      productName: "Pasteurized Milk 1L Pack",
      productCode: "89012302",
      price: 94.00,
      quantity: 5
    }
  ]);

  // Form Inputs
  const [selectedProductCode, setSelectedProductCode] = useState<string>("");
  const [inputQuantity, setInputQuantity] = useState<number>(1);

  // Print Modal State
  const [isPrintModalOpen, setIsPrintModalOpen] = useState<boolean>(false);
  const [labelFormat, setLabelFormat] = useState<"thermal_50x30" | "thermal_40x25" | "a4_sheet">("thermal_50x30");
  const [storeName, setStoreName] = useState<string>("SHOMPORKO CRM");
  const [showPrice, setShowPrice] = useState<boolean>(true);

  // Load Products from Firestore Catalog
  useEffect(() => {
    if (user?.uid) {
      setIsLoadingProducts(true);
      getProducts(user.uid, userProfile?.companyId)
        .then((prods) => {
          if (prods && prods.length > 0) {
            setProductsCatalog(prods);
          }
        })
        .catch((err) => {
          console.error("Failed to load products for barcode generator:", err);
        })
        .finally(() => {
          setIsLoadingProducts(false);
        });
    }
  }, [user, userProfile?.companyId]);

  // Add Item to Queue
  const handleAddItem = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!selectedProductCode) {
      showToast("Please select a product first", "error");
      return;
    }

    const qty = Number(inputQuantity) > 0 ? Number(inputQuantity) : 1;
    const found = productsCatalog.find(
      (p) => (p.code || p.barcode || p.sku || p.id) === selectedProductCode
    );

    if (!found) {
      // Fallback for custom or preset
      const newItem: BarcodeQueueItem = {
        id: `q-${Date.now()}`,
        productName: selectedProductCode,
        productCode: String(Math.floor(10000000 + Math.random() * 90000000)),
        price: 0,
        quantity: qty,
      };
      setQueue([...queue, newItem]);
      showToast("Added item to barcode queue", "success");
      setSelectedProductCode("");
      setInputQuantity(1);
      return;
    }

    // Check if already in queue
    const existingIndex = queue.findIndex(
      (i) => i.productId === found.id || i.productCode === (found.code || found.barcode || found.sku)
    );

    if (existingIndex >= 0) {
      const updated = [...queue];
      updated[existingIndex].quantity += qty;
      setQueue(updated);
      showToast(`Updated quantity for ${found.name}`, "info");
    } else {
      const newItem: BarcodeQueueItem = {
        id: `q-${Date.now()}`,
        productId: found.id,
        productName: found.name,
        productCode: found.code || found.barcode || found.sku || String(Math.floor(10000000 + Math.random() * 90000000)),
        price: Number(found.retailPrice) || Number(found.price) || Number(found.purchasePrice) || 0,
        quantity: qty,
      };
      setQueue([...queue, newItem]);
      showToast(`Added ${found.name} (${qty} labels)`, "success");
    }

    setSelectedProductCode("");
    setInputQuantity(1);
  };

  // Modify Quantity Inline
  const handleUpdateQty = (id: string, qty: number) => {
    const updated = queue.map((item) => {
      if (item.id === id) {
        return { ...item, quantity: Math.max(1, qty) };
      }
      return item;
    });
    setQueue(updated);
  };

  // Remove Item
  const handleRemoveItem = (id: string) => {
    setQueue(queue.filter((item) => item.id !== id));
  };

  // Save / Trigger Barcode Generator
  const handleSaveAndGenerate = () => {
    if (queue.length === 0) {
      showToast("No products in queue to generate barcodes", "error");
      return;
    }
    setIsPrintModalOpen(true);
    showToast(`Generating ${totalStickerCount} barcode labels...`, "success");
  };

  // Expanded Stickers list for printing
  const expandedStickers = queue.flatMap((item) =>
    Array.from({ length: item.quantity }, (_, idx) => ({
      ...item,
      uniqueKey: `${item.id}-${idx}`,
    }))
  );

  const totalStickerCount = queue.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="w-full pb-24">
      <div className="bg-white border-2 sm:border-4 border-black shadow-[6px_6px_0px_#000]">
        
        {/* Header matching screenshot */}
        <div className="flex flex-wrap items-center justify-between gap-3 p-4 sm:p-5 border-b-2 sm:border-b-4 border-black bg-slate-900 text-white">
          <div className="flex items-center gap-2.5">
            <BarcodeIcon className="w-6 h-6 text-amber-400" />
            <h1 className="font-display font-black text-sm sm:text-base uppercase tracking-tight">
              GENERATE BARCODE
            </h1>
          </div>
          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={() => window.history.back()}
              className="px-4 py-2 bg-white hover:bg-slate-100 text-black font-display font-black text-xs uppercase border-2 border-black shadow-[2px_2px_0px_#fff] flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4 stroke-[2.5]" /> GO BACK
            </button>
            <button
              type="button"
              onClick={handleSaveAndGenerate}
              className="px-6 py-2 bg-cyan-400 hover:bg-cyan-300 text-black font-display font-black text-xs uppercase tracking-wider border-2 border-black shadow-[3px_3px_0px_#000] flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <Save className="w-4 h-4 stroke-[2.5]" /> SAVE
            </button>
          </div>
        </div>

        {/* Form Controls Row matching screenshot */}
        <div className="p-4 sm:p-6 bg-white space-y-6">
          <form onSubmit={handleAddItem} className="grid grid-cols-1 sm:grid-cols-12 gap-3 sm:gap-4 items-end">
            {/* Products Dropdown */}
            <div className="sm:col-span-6">
              <label className="block text-xs font-display font-black uppercase text-black mb-1.5">
                Products
              </label>
              <select
                value={selectedProductCode}
                onChange={(e) => setSelectedProductCode(e.target.value)}
                className="w-full bg-white border-2 border-black px-3 py-2.5 text-xs font-bold text-black shadow-[2px_2px_0px_#000] outline-none cursor-pointer focus:bg-amber-50"
              >
                <option value="">Select Product</option>
                {productsCatalog.map((prod) => (
                  <option key={prod.id} value={prod.code || prod.barcode || prod.sku || prod.id}>
                    [{prod.code || prod.barcode || prod.sku || "N/A"}] {prod.name} (৳{prod.retailPrice || prod.price || 0})
                  </option>
                ))}
                {productsCatalog.length === 0 && (
                  <>
                    <option value="89012301">[89012301] Pure Ghee 1kg Can (৳1186.66)</option>
                    <option value="89012302">[89012302] Pasteurized Milk 1L Pack (৳94.00)</option>
                    <option value="89012303">[89012303] Commercial Espresso Machine (৳515840.00)</option>
                    <option value="89012304">[89012304] Dish Wash Bar Family Pack 400g (৳50.00)</option>
                  </>
                )}
              </select>
            </div>

            {/* Quantity */}
            <div className="sm:col-span-3">
              <label className="block text-xs font-display font-black uppercase text-black mb-1.5">
                Quantity
              </label>
              <input
                type="number"
                min="1"
                value={inputQuantity}
                onChange={(e) => setInputQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                placeholder="Quantity"
                className="w-full bg-white border-2 border-black px-3 py-2.5 text-xs font-bold text-black shadow-[2px_2px_0px_#000] outline-none text-center"
              />
            </div>

            {/* Add Item Button */}
            <div className="sm:col-span-3">
              <label className="block text-xs font-display font-black uppercase text-transparent mb-1.5 select-none">
                Add
              </label>
              <button
                type="submit"
                className="w-full py-2.5 bg-cyan-400 hover:bg-cyan-300 text-black font-display font-black text-xs uppercase tracking-wider border-2 border-black shadow-[3px_3px_0px_#000] flex items-center justify-center gap-1.5 transition-all cursor-pointer"
              >
                <Plus className="w-4 h-4 stroke-[3]" /> Add Item
              </button>
            </div>
          </form>

          {/* Table Container with Cyan Header Bar matching screenshot */}
          <div className="border-2 sm:border-4 border-black shadow-[4px_4px_0px_#000] overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead className="bg-cyan-400 text-black font-display font-black uppercase tracking-wider border-b-2 sm:border-b-4 border-black">
                  <tr>
                    <th className="px-3 sm:px-4 py-3.5 border-r-2 border-black w-16 text-center">SL#</th>
                    <th className="px-3 sm:px-4 py-3.5 border-r-2 border-black">Product Name</th>
                    <th className="px-3 sm:px-4 py-3.5 border-r-2 border-black">Product Code</th>
                    <th className="px-3 sm:px-4 py-3.5 border-r-2 border-black w-32 text-center">Quantity</th>
                    <th className="px-3 sm:px-4 py-3.5 text-center w-16">
                      <Trash2 className="w-4 h-4 mx-auto" />
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y-2 divide-black bg-white">
                  {queue.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-4 py-12 text-center text-xs font-black text-slate-500 uppercase bg-amber-50/50">
                        No barcode items in queue. Select a product and click &quot;Add Item&quot; above.
                      </td>
                    </tr>
                  ) : (
                    queue.map((item, idx) => (
                      <tr key={item.id} className="hover:bg-amber-50/80 transition-colors">
                        <td className="px-3 sm:px-4 py-3 font-mono font-bold text-black border-r-2 border-black text-center">
                          {idx + 1}
                        </td>
                        <td className="px-3 sm:px-4 py-3 font-black text-black border-r-2 border-black">
                          {item.productName}
                        </td>
                        <td className="px-3 sm:px-4 py-3 font-mono font-black text-indigo-700 border-r-2 border-black">
                          {item.productCode}
                        </td>
                        <td className="px-3 sm:px-4 py-3 border-r-2 border-black text-center">
                          <input
                            type="number"
                            min="1"
                            value={item.quantity}
                            onChange={(e) => handleUpdateQty(item.id, parseInt(e.target.value) || 1)}
                            className="w-20 bg-white border border-black px-2 py-1 text-xs font-bold text-center shadow-[1px_1px_0px_#000] outline-none"
                          />
                        </td>
                        <td className="px-3 sm:px-4 py-3 text-center">
                          <button
                            type="button"
                            onClick={() => handleRemoveItem(item.id)}
                            className="p-1.5 bg-rose-500 hover:bg-rose-600 text-white border border-black shadow-[1px_1px_0px_#000] transition-transform hover:scale-105 cursor-pointer"
                            title="Remove Item"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Bottom Summary & Save Button matching screenshot */}
          <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t-2 border-black">
            <div className="text-xs font-bold text-slate-700">
              Total Products: <strong className="text-black font-black">{queue.length}</strong> | Total Labels to Print: <strong className="text-indigo-700 font-black">{totalStickerCount}</strong>
            </div>
            <button
              type="button"
              onClick={handleSaveAndGenerate}
              className="px-8 py-3 bg-cyan-400 hover:bg-cyan-300 text-black font-display font-black text-xs uppercase tracking-wider border-2 border-black shadow-[4px_4px_0px_#000] flex items-center gap-2 transition-all cursor-pointer"
            >
              <Save className="w-4 h-4 stroke-[2.5]" /> SAVE
            </button>
          </div>
        </div>
      </div>

      {/* ==========================================
          PRINTABLE BARCODE SHEET MODAL
          ========================================== */}
      {isPrintModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/60 backdrop-blur-xs">
          <div className="bg-white border-4 border-black shadow-[8px_8px_0px_#000] max-w-4xl w-full max-h-[92vh] flex flex-col animate-in fade-in zoom-in-95">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-4 border-b-4 border-black bg-cyan-400 text-black">
              <div className="flex items-center gap-2 font-display font-black text-sm uppercase">
                <Printer className="w-5 h-5 stroke-[2.5]" />
                PRINT BARCODE STICKERS ({expandedStickers.length} LABELS)
              </div>
              <button
                onClick={() => setIsPrintModalOpen(false)}
                className="p-1 bg-white hover:bg-red-500 hover:text-white border-2 border-black shadow-[2px_2px_0px_#000] cursor-pointer"
              >
                <X className="w-4 h-4 stroke-[3]" />
              </button>
            </div>

            {/* Printer Settings Header */}
            <div className="p-4 border-b-2 border-black bg-slate-50 flex flex-wrap items-center justify-between gap-4 text-xs font-bold">
              <div className="flex items-center gap-4">
                <label className="flex items-center gap-1.5">
                  <span className="text-slate-600 uppercase">Format:</span>
                  <select
                    value={labelFormat}
                    onChange={(e) => setLabelFormat(e.target.value as any)}
                    className="bg-white border-2 border-black px-2 py-1 text-xs font-bold outline-none cursor-pointer"
                  >
                    <option value="thermal_50x30">Thermal Sticker (50mm × 30mm)</option>
                    <option value="thermal_40x25">Thermal Sticker (40mm × 25mm)</option>
                    <option value="a4_sheet">A4 Sheet (30 Labels Grid)</option>
                  </select>
                </label>

                <label className="flex items-center gap-1.5">
                  <span className="text-slate-600 uppercase">Store:</span>
                  <input
                    type="text"
                    value={storeName}
                    onChange={(e) => setStoreName(e.target.value)}
                    className="bg-white border-2 border-black px-2 py-1 text-xs font-bold outline-none w-36"
                  />
                </label>

                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={showPrice}
                    onChange={(e) => setShowPrice(e.target.checked)}
                    className="accent-black w-4 h-4"
                  />
                  <span>Show Price</span>
                </label>
              </div>

              <button
                type="button"
                onClick={() => window.print()}
                className="px-5 py-2 bg-black hover:bg-slate-800 text-white font-display font-black text-xs uppercase border-2 border-black shadow-[2px_2px_0px_#000] flex items-center gap-1.5 cursor-pointer"
              >
                <Printer className="w-4 h-4 stroke-[2.5]" /> Print Stickers Now
              </button>
            </div>

            {/* Sticker Preview Grid (Printable Area) */}
            <div className="p-6 overflow-y-auto bg-slate-100 flex-1" id="barcode-print-canvas">
              <div
                className={`grid gap-3 mx-auto ${
                  labelFormat === "a4_sheet"
                    ? "grid-cols-2 sm:grid-cols-3 md:grid-cols-5 max-w-4xl"
                    : labelFormat === "thermal_40x25"
                    ? "grid-cols-2 sm:grid-cols-3 max-w-2xl"
                    : "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 max-w-3xl"
                }`}
              >
                {expandedStickers.map((sticker) => (
                  <div
                    key={sticker.uniqueKey}
                    className="p-3 bg-white border-2 border-black shadow-[2px_2px_0px_#000] flex flex-col items-center justify-between text-center min-h-[110px]"
                  >
                    {/* Store Title */}
                    <div className="text-[9px] font-black uppercase tracking-wider text-slate-800 truncate w-full">
                      {storeName}
                    </div>

                    {/* Product Name */}
                    <div className="text-[11px] font-black text-black truncate w-full px-1">
                      {sticker.productName}
                    </div>

                    {/* Barcode Graphic Stripes */}
                    <div className="py-0.5 select-none font-mono text-xl tracking-[4px] font-bold text-black scale-y-110">
                      ||| | |||| | ||| |
                    </div>

                    {/* Code Number */}
                    <div className="text-[10px] font-mono font-black text-black">
                      {sticker.productCode}
                    </div>

                    {/* Price */}
                    {showPrice && (
                      <div className="text-[10px] font-black text-indigo-700">
                        ৳ {sticker.price > 0 ? sticker.price.toFixed(2) : "0.00"}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t-4 border-black bg-slate-100 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setIsPrintModalOpen(false)}
                className="px-5 py-2 bg-white text-black font-display font-black text-xs uppercase border-2 border-black shadow-[2px_2px_0px_#000] cursor-pointer"
              >
                Close
              </button>
              <button
                type="button"
                onClick={() => window.print()}
                className="px-6 py-2 bg-cyan-400 hover:bg-cyan-300 text-black font-display font-black text-xs uppercase border-2 border-black shadow-[3px_3px_0px_#000] flex items-center gap-1.5 cursor-pointer"
              >
                <Printer className="w-4 h-4 stroke-[2.5]" /> Print
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
