"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Product, ProductCategory } from '@/types/product';
import { 
  getProducts, 
  getProductCategories,
  exportProductsToCSV 
} from '@/lib/productStorage';
import { 
  Search, 
  RefreshCw, 
  FileSpreadsheet, 
  Printer, 
  Package, 
  Loader2, 
  ChevronLeft, 
  ChevronRight,
  ImageIcon,
  X
} from 'lucide-react';

interface Props {
  showToast: (msg: string, type: 'success' | 'error') => void;
}

export const ProductListPage: React.FC<Props> = ({ showToast }) => {
  const { user, userProfile } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<ProductCategory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [previewImage, setPreviewImage] = useState<{ url: string; name: string } | null>(null);

  // Filters
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [appliedCategory, setAppliedCategory] = useState<string>('ALL');
  const [searchTerm, setSearchTerm] = useState('');
  
  // Pagination
  const [pageSize, setPageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  const loadData = async () => {
    if (!user) return;
    setIsLoading(true);
    try {
      const companyId = userProfile?.companyId || user.uid;
      const [prodsData, catsData] = await Promise.all([
        getProducts(user.uid, companyId),
        getProductCategories(user.uid, companyId),
      ]);
      setProducts(prodsData);
      setCategories(catsData);
    } catch (err: any) {
      console.error('Failed to load product report data:', err);
      showToast(err.message || 'Failed to load product data', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [user, userProfile?.companyId]);

  const handleSearchClick = () => {
    setAppliedCategory(selectedCategory);
    setCurrentPage(1);
  };

  const handleReload = () => {
    setSelectedCategory('ALL');
    setAppliedCategory('ALL');
    setSearchTerm('');
    setCurrentPage(1);
    loadData();
    showToast('Product report refreshed', 'success');
  };

  const handleExportCSV = () => {
    if (filteredProducts.length === 0) {
      showToast('No products available to export', 'error');
      return;
    }
    try {
      exportProductsToCSV(filteredProducts);
      showToast(`Exported ${filteredProducts.length} products to CSV`, 'success');
    } catch (err: any) {
      showToast('Export failed: ' + (err.message || 'Unknown error'), 'error');
    }
  };

  const handlePrint = () => {
    window.print();
  };

  // Filtered Products
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      // Category filter
      if (appliedCategory !== 'ALL') {
        const pCat = (p.parentCategory || p.category || '').toLowerCase();
        if (pCat !== appliedCategory.toLowerCase()) return false;
      }

      // Search term filter
      if (searchTerm.trim()) {
        const q = searchTerm.toLowerCase();
        const matchesName = p.name.toLowerCase().includes(q);
        const matchesCode = (p.code || p.sku || '').toLowerCase().includes(q);
        const matchesBarcode = (p.barcode || '').toLowerCase().includes(q);
        const matchesCat = (p.parentCategory || p.category || '').toLowerCase().includes(q);
        if (!matchesName && !matchesCode && !matchesBarcode && !matchesCat) return false;
      }

      return true;
    });
  }, [products, appliedCategory, searchTerm]);

  // Pagination calculation
  const totalItems = filteredProducts.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const paginatedProducts = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredProducts.slice(start, start + pageSize);
  }, [filteredProducts, currentPage, pageSize]);

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12 print:p-0 print:m-0">
      {/* Print-specific style */}
      <style jsx global>{`
        @media print {
          body {
            background: white !important;
            color: black !important;
          }
          header, nav, aside, .no-print, button, input, select {
            display: none !important;
          }
          .print-full-width {
            width: 100% !important;
            max-width: 100% !important;
            box-shadow: none !important;
            border: 1px solid #000 !important;
          }
        }
      `}</style>

      {/* Top Banner / Actions Card */}
      <div className="bg-white border-2 sm:border-4 border-black shadow-[6px_6px_0px_#000] p-4 sm:p-6 no-print">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-300 border-2 border-black font-display font-black text-xs uppercase tracking-wider mb-2">
              <Package className="w-4 h-4" />
              INVENTORY REPORT
            </div>
            <h1 className="text-2xl sm:text-3xl font-display font-black text-black uppercase tracking-tight">
              PRODUCT LIST REPORT
            </h1>
            <p className="text-xs sm:text-sm font-medium text-neutral-600 mt-1">
              Filter by category, inspect pricing, export to Excel/CSV, or print official catalog records.
            </p>
          </div>

          {/* Action Buttons: Reload, Excel, Print */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-3 w-full md:w-auto">
            <button
              onClick={handleReload}
              disabled={isLoading}
              title="Reload report data"
              className="flex-1 md:flex-initial inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-white hover:bg-neutral-100 text-black border-2 border-black font-display font-black text-xs sm:text-sm uppercase tracking-wider shadow-[3px_3px_0px_#000] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[2px_2px_0px_#000] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all cursor-pointer disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
              RELOAD
            </button>

            <button
              onClick={handleExportCSV}
              disabled={isLoading || filteredProducts.length === 0}
              title="Export report to CSV / Excel"
              className="flex-1 md:flex-initial inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-emerald-400 hover:bg-emerald-300 text-black border-2 border-black font-display font-black text-xs sm:text-sm uppercase tracking-wider shadow-[3px_3px_0px_#000] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[2px_2px_0px_#000] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all cursor-pointer disabled:opacity-50"
            >
              <FileSpreadsheet className="w-4 h-4" />
              EXCEL
            </button>

            <button
              onClick={handlePrint}
              disabled={isLoading || filteredProducts.length === 0}
              title="Print product list"
              className="flex-1 md:flex-initial inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white border-2 border-black font-display font-black text-xs sm:text-sm uppercase tracking-wider shadow-[3px_3px_0px_#000] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[2px_2px_0px_#000] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all cursor-pointer disabled:opacity-50"
            >
              <Printer className="w-4 h-4" />
              PRINT
            </button>
          </div>
        </div>

        {/* Category Filter Form */}
        <div className="mt-6 pt-5 border-t-2 border-black grid grid-cols-1 md:grid-cols-12 gap-3 items-end">
          <div className="md:col-span-5">
            <label className="block text-xs font-display font-black uppercase tracking-wider text-black mb-1.5">
              Product Category
            </label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-3 py-2.5 bg-white border-2 border-black font-bold text-xs sm:text-sm text-black focus:outline-none focus:ring-2 focus:ring-amber-300"
            >
              <option value="ALL">-- Select Category (All) --</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.name}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          <div className="md:col-span-5">
            <label className="block text-xs font-display font-black uppercase tracking-wider text-black mb-1.5">
              Search by Keyword
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
                placeholder="Product name, code, barcode..."
                className="w-full pl-9 pr-3 py-2.5 bg-white border-2 border-black font-bold text-xs sm:text-sm text-black focus:outline-none focus:ring-2 focus:ring-amber-300"
              />
            </div>
          </div>

          <div className="md:col-span-2">
            <button
              onClick={handleSearchClick}
              className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-amber-300 hover:bg-amber-400 text-black border-2 border-black font-display font-black text-xs sm:text-sm uppercase tracking-wider shadow-[3px_3px_0px_#000] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[2px_2px_0px_#000] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all cursor-pointer"
            >
              <Search className="w-4 h-4" />
              SEARCH
            </button>
          </div>
        </div>
      </div>

      {/* Quick Metrics Summary Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 no-print">
        <div className="p-3 bg-white border-2 border-black shadow-[3px_3px_0px_#000] flex items-center justify-between">
          <span className="text-xs font-black uppercase tracking-wider text-neutral-600">Total Products</span>
          <span className="font-mono font-black text-lg text-black">{filteredProducts.length}</span>
        </div>
        <div className="p-3 bg-white border-2 border-black shadow-[3px_3px_0px_#000] flex items-center justify-between">
          <span className="text-xs font-black uppercase tracking-wider text-neutral-600">Active Categories</span>
          <span className="font-mono font-black text-lg text-black">
            {new Set(filteredProducts.map(p => p.parentCategory || p.category || 'General')).size}
          </span>
        </div>
        <div className="p-3 bg-white border-2 border-black shadow-[3px_3px_0px_#000] flex items-center justify-between">
          <span className="text-xs font-black uppercase tracking-wider text-neutral-600">Avg. Retail Price</span>
          <span className="font-mono font-black text-lg text-black">
            ৳{filteredProducts.length > 0 
              ? (filteredProducts.reduce((sum, p) => sum + (p.retailPrice ?? p.price ?? 0), 0) / filteredProducts.length).toFixed(2)
              : '0.00'}
          </span>
        </div>
      </div>

      {/* Printable Heading (Only visible in Print mode) */}
      <div className="hidden print:block mb-4 border-b-2 border-black pb-3">
        <h1 className="text-2xl font-black uppercase tracking-wider">PRODUCT LIST REPORT</h1>
        <div className="text-xs text-neutral-700 flex justify-between mt-1">
          <span>Category Filter: {appliedCategory === 'ALL' ? 'All Categories' : appliedCategory}</span>
          <span>Printed on: {new Date().toLocaleDateString()}</span>
          <span>Total Records: {filteredProducts.length}</span>
        </div>
      </div>

      {/* Table Card */}
      <div className="bg-white border-2 sm:border-4 border-black shadow-[6px_6px_0px_#000] overflow-hidden print-full-width">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-neutral-100 border-b-2 sm:border-b-4 border-black text-xs font-display font-black uppercase tracking-wider text-black">
                <th className="py-3.5 px-4 w-16 text-center border-r-2 border-black">SL#</th>
                <th className="py-3.5 px-4 w-32 border-r-2 border-black">Product Code</th>
                <th className="py-3.5 px-4 min-w-[200px] border-r-2 border-black">Product Name</th>
                <th className="py-3.5 px-4 w-44 border-r-2 border-black">Product Category</th>
                <th className="py-3.5 px-4 w-28 text-center border-r-2 border-black">UOM</th>
                <th className="py-3.5 px-4 w-36 text-right">Product Price</th>
              </tr>
            </thead>
            <tbody className="divide-y-2 divide-black text-xs sm:text-sm">
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center bg-white">
                    <Loader2 className="w-8 h-8 animate-spin mx-auto text-black mb-2" />
                    <p className="font-display font-black uppercase tracking-wider text-neutral-600">
                      Loading Product Catalog...
                    </p>
                  </td>
                </tr>
              ) : paginatedProducts.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center bg-white">
                    <Package className="w-12 h-12 stroke-[1.5] text-neutral-400 mx-auto mb-2" />
                    <p className="font-display font-black text-base uppercase text-black">
                      No Products Found
                    </p>
                    <p className="text-xs text-neutral-600 mt-1">
                      Try selecting a different category or adjusting search keywords.
                    </p>
                  </td>
                </tr>
              ) : (
                paginatedProducts.map((product, idx) => {
                  const sl = (currentPage - 1) * pageSize + idx + 1;
                  const price = product.retailPrice ?? product.price ?? 0;
                  const code = product.code || product.sku || '-';
                  const cat = product.parentCategory || product.category || 'Unassigned';
                  const uom = product.uom || 'Pcs';

                  return (
                    <tr
                      key={product.id}
                      className="hover:bg-amber-50/50 transition-colors bg-white font-medium"
                    >
                      {/* SL# */}
                      <td className="py-3 px-4 text-center font-mono font-bold border-r-2 border-black">
                        {sl}
                      </td>

                      {/* Product Code */}
                      <td className="py-3 px-4 font-mono font-black border-r-2 border-black">
                        <span className="inline-block px-2 py-0.5 bg-neutral-100 border border-black text-black">
                          {code}
                        </span>
                      </td>

                      {/* Product Name */}
                      <td className="py-3 px-4 border-r-2 border-black">
                        <div className="flex items-center gap-3">
                          <button
                            type="button"
                            onClick={() => product.image && setPreviewImage({ url: product.image, name: product.name })}
                            disabled={!product.image}
                            title={product.image ? 'Click to enlarge' : 'No image'}
                            className={`w-9 h-9 border-2 border-black bg-neutral-100 shrink-0 flex items-center justify-center overflow-hidden ${product.image ? 'cursor-pointer hover:border-amber-500 hover:shadow-[2px_2px_0px_#000] transition-all' : ''}`}
                          >
                            {product.image ? (
                              <img
                                src={product.image}
                                alt={product.name}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <ImageIcon className="w-4 h-4 text-neutral-400" />
                            )}
                          </button>
                          <div>
                            <div className="flex items-center gap-1.5 flex-wrap">
                              <span className="font-black text-black block leading-tight">
                                {product.name}
                              </span>
                              {product.brand && (
                                <span className="px-1.5 py-0.2 bg-purple-100 border border-black text-[9px] font-black uppercase text-purple-900">
                                  {product.brand}
                                </span>
                              )}
                            </div>
                            {product.tags && product.tags.length > 0 && (
                              <div className="flex flex-wrap gap-1 mt-1">
                                {product.tags.map(t => (
                                  <span key={t} className="px-1.5 py-0.2 bg-amber-200 border border-black text-[9px] font-black uppercase text-black">
                                    #{t}
                                  </span>
                                ))}
                              </div>
                            )}
                            {product.barcode && (
                              <span className="text-[11px] font-mono text-neutral-500 block mt-0.5">
                                Barcode: {product.barcode}
                              </span>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* Product Category */}
                      <td className="py-3 px-4 border-r-2 border-black">
                        <span className="inline-block px-2.5 py-1 bg-amber-100 border border-black font-display font-black text-xs text-black uppercase">
                          {cat}
                        </span>
                      </td>

                      {/* UOM */}
                      <td className="py-3 px-4 text-center font-display font-bold border-r-2 border-black">
                        <span className="inline-block px-2 py-0.5 bg-neutral-100 border border-black text-xs">
                          {uom}
                        </span>
                      </td>

                      {/* Product Price */}
                      <td className="py-3 px-4 text-right font-mono font-black text-sm text-black">
                        ৳{price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Footer / Pagination */}
        <div className="p-4 border-t-2 sm:border-t-4 border-black bg-neutral-50 flex flex-col sm:flex-row items-center justify-between gap-4 no-print">
          <div className="flex items-center gap-2 text-xs font-bold text-black">
            <span>SHOWING</span>
            <select
              value={pageSize}
              onChange={(e) => {
                setPageSize(Number(e.target.value));
                setCurrentPage(1);
              }}
              className="px-2 py-1 bg-white border-2 border-black font-bold focus:outline-none cursor-pointer"
            >
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
            </select>
            <span>OF {totalItems} ENTRIES</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-neutral-600 mr-2">
              PAGE {currentPage} OF {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage <= 1}
              className="p-1.5 bg-white border-2 border-black hover:bg-neutral-100 disabled:opacity-40 disabled:hover:bg-white shadow-[2px_2px_0px_#000] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none transition-all cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4 stroke-[2.5]" />
            </button>
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage >= totalPages}
              className="p-1.5 bg-white border-2 border-black hover:bg-neutral-100 disabled:opacity-40 disabled:hover:bg-white shadow-[2px_2px_0px_#000] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none transition-all cursor-pointer"
            >
              <ChevronRight className="w-4 h-4 stroke-[2.5]" />
            </button>
          </div>
        </div>
      </div>

      {/* Image Lightbox Preview Modal */}
      {previewImage && (
        <div 
          onClick={() => setPreviewImage(null)}
          className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150 cursor-pointer"
        >
          <div 
            onClick={e => e.stopPropagation()}
            className="bg-white border-2 sm:border-4 border-black shadow-[8px_8px_0px_#000] max-w-lg w-full overflow-hidden flex flex-col cursor-default"
          >
            <div className="p-3 bg-amber-300 border-b-2 border-black flex items-center justify-between">
              <span className="font-display font-black text-xs uppercase tracking-wider text-black truncate pr-2">
                {previewImage.name}
              </span>
              <button
                type="button"
                onClick={() => setPreviewImage(null)}
                className="p-1 bg-white hover:bg-red-500 hover:text-white border-2 border-black transition-colors cursor-pointer"
              >
                <X className="w-4 h-4 stroke-[3]" />
              </button>
            </div>
            <div className="p-4 bg-neutral-100 flex items-center justify-center min-h-[300px] max-h-[70vh] overflow-hidden">
              <img
                src={previewImage.url}
                alt={previewImage.name}
                className="max-h-[65vh] max-w-full object-contain border-2 border-black bg-white shadow-[4px_4px_0px_#000]"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
