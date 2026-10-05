"use client";

import React, { useState } from "react";
import { Trash2 } from "lucide-react";

interface BarcodeItem {
  id: string;
  sl: number;
  productName: string;
  productCode: string;
  quantity: number;
}

export const PurchaseGenerateBarcodePage: React.FC<{ showToast: (msg: string, type?: "success" | "error") => void }> = ({ showToast }) => {
  const [items, setItems] = useState<BarcodeItem[]>([]);
  const [selectedProduct, setSelectedProduct] = useState("");
  const [quantity, setQuantity] = useState("");

  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProduct || !quantity) {
      showToast("Please select a product and enter quantity", "error");
      return;
    }
    
    const newItem: BarcodeItem = {
      id: Date.now().toString(),
      sl: items.length + 1,
      productName: selectedProduct,
      productCode: `PRD-${Math.floor(Math.random() * 10000)}`,
      quantity: parseInt(quantity, 10)
    };

    setItems([...items, newItem]);
    setSelectedProduct("");
    setQuantity("");
  };

  const removeItem = (id: string) => {
    const filtered = items.filter(item => item.id !== id);
    // Reassign SL#
    setItems(filtered.map((item, index) => ({ ...item, sl: index + 1 })));
  };

  const handleSave = () => {
    if (items.length === 0) {
      showToast("No items to generate barcode for", "error");
      return;
    }
    showToast("Barcodes generated successfully", "success");
    setItems([]);
  };

  return (
    <div className="w-full mx-auto pb-10">
      <div className="bg-[#1a2332] rounded-md border border-slate-800 shadow-md">
        <div className="flex justify-between items-center p-4 border-b border-slate-800">
          <h2 className="text-white font-semibold uppercase">Generate Barcode</h2>
          <div className="flex gap-2">
            <button className="px-4 py-1.5 bg-[#20b2aa] text-white text-xs font-bold rounded hover:bg-[#1a9a94]">GO BACK</button>
            <button onClick={handleSave} className="px-4 py-1.5 bg-[#20b2aa] text-white text-xs font-bold rounded hover:bg-[#1a9a94]">SAVE</button>
          </div>
        </div>
        
        <div className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div>
              <label className="block text-xs text-white mb-2 font-semibold">Products</label>
              <select 
                value={selectedProduct}
                onChange={(e) => setSelectedProduct(e.target.value)}
                className="w-full bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-slate-600 rounded p-2 text-sm focus:outline-none focus:border-[#20b2aa]"
              >
                <option value="" disabled>Select Product</option>
                <option value="Laptop X1">Laptop X1</option>
                <option value="Wireless Mouse">Wireless Mouse</option>
                <option value="Mechanical Keyboard">Mechanical Keyboard</option>
              </select>
            </div>
            <div>
              <label className="block text-xs text-white mb-2 font-semibold">Quantity</label>
              <input 
                type="number" 
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                className="w-full bg-[#111827] border border-slate-700 rounded p-2 text-sm text-white focus:outline-none focus:border-[#20b2aa]" 
                placeholder="Quantity" 
              />
            </div>
            <div>
              <label className="block text-xs text-white mb-2 font-semibold">Add</label>
              <button 
                onClick={handleAddItem}
                className="w-full py-2 bg-[#20b2aa] text-white text-sm font-semibold rounded hover:bg-[#1a9a94]"
              >
                Add Item
              </button>
            </div>
          </div>

          <div className="overflow-x-auto border border-slate-800 rounded">
            <table className="w-full text-left text-sm text-white">
              <thead className="text-xs bg-[#20b2aa] text-white">
                <tr>
                  <th className="px-4 py-3 font-semibold w-16">SL#</th>
                  <th className="px-4 py-3 font-semibold">Product Name</th>
                  <th className="px-4 py-3 font-semibold">Product Code</th>
                  <th className="px-4 py-3 font-semibold">Quantity</th>
                  <th className="px-4 py-3 font-semibold text-center w-16"><Trash2 className="w-4 h-4 mx-auto opacity-70" /></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/50 bg-[#111827]">
                {items.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-4 py-8 text-center text-slate-500 dark:text-slate-400 text-sm">No products added yet.</td>
                  </tr>
                ) : (
                  items.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-800/30">
                      <td className="px-4 py-3 text-slate-300">{item.sl}</td>
                      <td className="px-4 py-3">{item.productName}</td>
                      <td className="px-4 py-3 text-slate-300">{item.productCode}</td>
                      <td className="px-4 py-3 text-slate-300">{item.quantity}</td>
                      <td className="px-4 py-3 text-center">
                        <button onClick={() => removeItem(item.id)} className="p-1.5 text-rose-400 hover:text-rose-500 hover:bg-slate-800 rounded">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          
          <div className="flex justify-end mt-4">
            <button onClick={handleSave} className="px-6 py-2 bg-[#20b2aa] text-white text-xs font-bold rounded hover:bg-[#1a9a94]">SAVE</button>
          </div>
        </div>
      </div>
    </div>
  );
};
