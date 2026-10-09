"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Product, ProductCategory, MeasurementUnit, ProductBrand, ProductTag } from '@/types/product';
import { 
  getProducts, 
  addProduct, 
  updateProduct, 
  deleteProduct, 
  deleteProductsBulk,
  getProductCategories,
  getMeasurementUnits,
  getProductBrands,
  getProductTags
} from '@/lib/productStorage';
import { ProductCreateModal } from './ProductCreateModal';
import { DeleteConfirmModal } from '../ui/DeleteConfirmModal';
import { 
  Plus, 
  Search, 
  Package, 
  Edit2, 
  Trash2, 
  Loader2, 
  ImageIcon, 
  Eye, 
  Barcode, 
  CheckCircle2, 
  XCircle,
  ChevronLeft,
  ChevronRight,
  X
} from 'lucide-react';

interface Props {
  showToast: (msg: string, type: 'success' | 'error') => void;
}

export const ProductSetupPage: React.FC<Props> = ({ showToast }) => {
  const { user, userProfile } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<ProductCategory[]>([]);
  const [units, setUnits] = useState<MeasurementUnit[]>([]);
  const [brands, setBrands] = useState<ProductBrand[]>([]);
  const [tags, setTags] = useState<ProductTag[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Search, Filter, Pagination
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'ACTIVE' | 'INACTIVE'>('ALL');
  const [categoryFilter, setCategoryFilter] = useState<string>('ALL');
  const [pageSize, setPageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  // Bulk Selection
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // Modals
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [deletingProduct, setDeletingProduct] = useState<Product | null>(null);
  const [viewingProduct, setViewingProduct] = useState<Product | null>(null);
  const [isBulkDeleting, setIsBulkDeleting] = useState(false);

  useEffect(() => {
    if (user) {
      loadData();
    }
  }, [user, userProfile?.companyId]);

  const loadData = async () => {
    if (!user) return;
    setIsLoading(true);
    try {
      const [prodsData, catsData, unitsData, brandsData, tagsData] = await Promise.all([
        getProducts(user.uid, userProfile?.companyId),
        getProductCategories(user.uid, userProfile?.companyId),
        getMeasurementUnits(user.uid, userProfile?.companyId),
        getProductBrands(user.uid, userProfile?.companyId),
        getProductTags(user.uid, userProfile?.companyId),
      ]);
      setProducts(prodsData);
      setCategories(catsData);
      setUnits(unitsData);
      setBrands(brandsData);
      setTags(tagsData);
    } catch (err) {
      console.error(err);
      showToast('Failed to load products data', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveProduct = async (productData: Omit<Product, 'id' | 'userId' | 'createdAt' | 'updatedAt'> & { userId?: string; companyId?: string }) => {
    if (!user) {
      showToast('You must be logged in to save products', 'error');
      return;
    }
    try {
      if (editingProduct) {
        // Strip immutable tenancy and creation timestamps from update payload
        const { id, userId, companyId, createdAt, ...updateData } = productData as any;
        await updateProduct(editingProduct.id, updateData);
        showToast('Product updated successfully', 'success');
      } else {
        await addProduct({
          ...productData,
          userId: user.uid,
          companyId: userProfile?.companyId || user.uid,
        });
        showToast('Product added successfully', 'success');
      }
      await loadData();
    } catch (err: any) {
      console.error('Save product error:', err);
      showToast(err.message || 'Failed to save product', 'error');
      throw err;
    }
  };

  const handleToggleStatus = async (prod: Product) => {
    const nextStatus = prod.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
    try {
      await updateProduct(prod.id, { status: nextStatus });
      setProducts(prev => prev.map(p => p.id === prod.id ? { ...p, status: nextStatus } : p));
      showToast(`Product set to ${nextStatus}`, 'success');
    } catch (err) {
      console.error(err);
      showToast('Failed to update status', 'error');
    }
  };

  const handleConfirmDelete = async () => {
    if (!deletingProduct) return;
    try {
      await deleteProduct(deletingProduct.id);
      showToast('Product deleted successfully', 'success');
      setDeletingProduct(null);
      setSelectedIds(prev => prev.filter(id => id !== deletingProduct.id));
      loadData();
    } catch (err) {
      console.error(err);
      showToast('Failed to delete product', 'error');
    }
  };

  const handleConfirmBulkDelete = async () => {
    if (selectedIds.length === 0) return;
    try {
      await deleteProductsBulk(selectedIds);
      showToast(`Deleted ${selectedIds.length} products`, 'success');
      setIsBulkDeleting(false);
      setSelectedIds([]);
      loadData();
    } catch (err) {
      console.error(err);
      showToast('Bulk delete failed', 'error');
    }
  };

  // Filtered List
  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      const matchesSearch = 
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (p.code && p.code.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (p.parentCategory && p.parentCategory.toLowerCase().includes(searchTerm.toLowerCase()));

      if (!matchesSearch) return false;
      if (statusFilter === 'ACTIVE') return p.status === 'ACTIVE';
      if (statusFilter === 'INACTIVE') return p.status === 'INACTIVE';
      if (categoryFilter !== 'ALL') return p.parentCategory === categoryFilter;
      return true;
    });
  }, [products, searchTerm, statusFilter, categoryFilter]);

  const totalEntries = filteredProducts.length;
  const totalPages = Math.ceil(totalEntries / pageSize) || 1;
  const paginatedProducts = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredProducts.slice(start, start + pageSize);
  }, [filteredProducts, currentPage, pageSize]);

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedIds(paginatedProducts.map(p => p.id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleSelectOne = (id: string) => {
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const isAllSelected = paginatedProducts.length > 0 && paginatedProducts.every(p => selectedIds.includes(p.id));

  return (
    <div className="w-full mx-auto space-y-6 pb-20">
      
      {/* Top Banner Card (Matches Screenshot 2) */}
      <div className="bg-white p-4 sm:p-5 border-2 sm:border-4 border-black shadow-[6px_6px_0px_#000] flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-2.5">
            <span className="w-3 h-3 bg-amber-400 border border-black inline-block"></span>
            <h2 className="text-lg font-black uppercase text-black tracking-wider">Product Setup</h2>
            <span className="px-2 py-0.5 bg-amber-100 border border-black text-black text-xs font-black">
              {products.length} PRODUCTS
            </span>
          </div>
          <p className="text-xs font-bold text-slate-600 uppercase mt-1">
            Master catalog specifications, retail pricing &amp; wholesale client rates.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <select 
            value={statusFilter}
            onChange={e => { setStatusFilter(e.target.value as any); setCurrentPage(1); }}
            className="px-3 py-2 bg-white text-black border-2 border-black text-xs font-black uppercase shadow-[2px_2px_0px_#000] focus:outline-none"
          >
            <option value="ALL">All Status</option>
            <option value="ACTIVE">Active Only</option>
            <option value="INACTIVE">Inactive Only</option>
          </select>

          <button 
            type="button"
            onClick={() => { setEditingProduct(null); setIsCreateModalOpen(true); }}
            className="flex items-center gap-2 px-4 py-2 bg-emerald-400 hover:bg-emerald-300 text-black border-2 border-black text-xs font-black uppercase shadow-[2px_2px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>Add New</span>
          </button>
        </div>
      </div>

      {/* Control Bar: Page Size, Category Filter, Search, Bulk Action */}
      <div className="bg-white p-4 border-2 sm:border-4 border-black shadow-[6px_6px_0px_#000] flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 text-xs font-black uppercase text-black">
            <span>Show</span>
            <select
              value={pageSize}
              onChange={e => { setPageSize(Number(e.target.value)); setCurrentPage(1); }}
              className="px-2 py-1 bg-white border-2 border-black text-xs font-black"
            >
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
            </select>
            <span>entries</span>
          </div>

          {categories.length > 0 && (
            <select
              value={categoryFilter}
              onChange={e => { setCategoryFilter(e.target.value); setCurrentPage(1); }}
              className="px-3 py-1 bg-white border-2 border-black text-xs font-black uppercase focus:outline-none"
            >
              <option value="ALL">All Categories</option>
              {categories.map(c => (
                <option key={c.id} value={c.name}>{c.name}</option>
              ))}
            </select>
          )}

          {selectedIds.length > 0 && (
            <button
              type="button"
              onClick={() => setIsBulkDeleting(true)}
              className="flex items-center gap-1.5 px-3 py-1 bg-red-600 hover:bg-red-500 text-white border-2 border-black text-xs font-black uppercase shadow-[2px_2px_0px_#000] transition-all cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5 stroke-[2.5]" />
              <span>Delete ({selectedIds.length})</span>
            </button>
          )}
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
          <input 
            type="text" 
            placeholder="Search by name, code, category..." 
            value={searchTerm}
            onChange={e => { setSearchTerm(e.target.value); setCurrentPage(1); }}
            className="w-full text-xs font-bold text-black bg-white pl-9 pr-3 py-2 border-2 border-black focus:outline-none focus:bg-amber-50 placeholder-slate-400"
          />
        </div>
      </div>

      {/* Products Table (Matches Screenshot 2 Columns) */}
      {isLoading ? (
        <div className="py-20 flex flex-col items-center justify-center gap-3 bg-white border-2 sm:border-4 border-black shadow-[6px_6px_0px_#000]">
          <Loader2 className="w-8 h-8 text-black animate-spin" />
          <p className="text-xs text-black font-black uppercase tracking-wider">Loading product catalog...</p>
        </div>
      ) : paginatedProducts.length === 0 ? (
        <div className="bg-white border-2 sm:border-4 border-black p-12 flex flex-col items-center justify-center text-center shadow-[6px_6px_0px_#000]">
          <div className="w-16 h-16 bg-amber-300 border-2 border-black shadow-[3px_3px_0px_#000] flex items-center justify-center mb-4">
            <Package className="w-8 h-8 text-black stroke-[2]" />
          </div>
          <h3 className="text-base font-black uppercase tracking-wider text-black mb-1">No Products Found</h3>
          <p className="text-xs font-bold text-slate-600 max-w-md uppercase mb-5">
            {searchTerm || categoryFilter !== 'ALL' 
              ? 'No products matched your search or category filter.' 
              : 'Add your first product with barcode, pricing, and category setup.'}
          </p>
          <button 
            onClick={() => { setEditingProduct(null); setIsCreateModalOpen(true); }}
            className="flex items-center gap-2 px-4 py-2.5 bg-emerald-400 hover:bg-emerald-300 text-black border-2 border-black text-xs font-black uppercase shadow-[2px_2px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4 stroke-[3]" /> Add First Product
          </button>
        </div>
      ) : (
        <div className="bg-white border-2 sm:border-4 border-black shadow-[6px_6px_0px_#000] overflow-hidden">
          <div className="overflow-x-auto custom-scrollbar">
            <table className="w-full text-left border-collapse min-w-[900px]">
              <thead>
                <tr className="bg-black text-white border-b-2 border-black">
                  <th className="px-3 py-3 w-10 text-center">
                    <input 
                      type="checkbox" 
                      checked={isAllSelected}
                      onChange={handleSelectAll}
                      className="cursor-pointer accent-amber-400 w-4 h-4"
                    />
                  </th>
                  <th className="px-3 py-3 text-[11px] font-black uppercase tracking-wider">Image</th>
                  <th className="px-4 py-3 text-[11px] font-black uppercase tracking-wider">Product Name</th>
                  <th className="px-4 py-3 text-[11px] font-black uppercase tracking-wider">Code</th>
                  <th className="px-3 py-3 text-[11px] font-black uppercase tracking-wider">UOM</th>
                  <th className="px-4 py-3 text-[11px] font-black uppercase tracking-wider text-right">Client Price</th>
                  <th className="px-4 py-3 text-[11px] font-black uppercase tracking-wider text-right">Retail Price</th>
                  <th className="px-4 py-3 text-[11px] font-black uppercase tracking-wider">Category</th>
                  <th className="px-3 py-3 text-[11px] font-black uppercase tracking-wider text-center">Status</th>
                  <th className="px-4 py-3 text-[11px] font-black uppercase tracking-wider text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y-2 divide-black/10">
                {paginatedProducts.map((prod) => {
                  const isChecked = selectedIds.includes(prod.id);

                  return (
                    <tr key={prod.id} className="hover:bg-amber-50/60 transition-colors">
                      <td className="px-3 py-3 text-center">
                        <input 
                          type="checkbox" 
                          checked={isChecked}
                          onChange={() => handleSelectOne(prod.id)}
                          className="cursor-pointer accent-amber-400 w-4 h-4"
                        />
                      </td>

                      <td className="px-3 py-3">
                        <div className="w-10 h-10 border-2 border-black bg-slate-100 flex items-center justify-center overflow-hidden">
                          {prod.image ? (
                            <img src={prod.image} alt={prod.name} className="w-full h-full object-cover" />
                          ) : (
                            <span className="text-[9px] font-bold text-slate-500 uppercase">No Image</span>
                          )}
                        </div>
                      </td>

                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2 flex-wrap">
                          <p className="text-xs font-black text-black">{prod.name}</p>
                          {prod.brand && (
                            <span className="px-1.5 py-0.5 bg-purple-100 border border-black text-[9px] font-black uppercase text-purple-900">
                              {prod.brand}
                            </span>
                          )}
                        </div>
                        {prod.tags && prod.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-1">
                            {prod.tags.map(t => (
                              <span key={t} className="px-1.5 py-0.2 bg-amber-200 border border-black text-[9px] font-black uppercase text-black">
                                #{t}
                              </span>
                            ))}
                          </div>
                        )}
                        {prod.longDescription && (
                          <p className="text-[10px] text-slate-600 line-clamp-1 mt-0.5">{prod.longDescription}</p>
                        )}
                      </td>

                      <td className="px-4 py-3">
                        <span className="px-2 py-0.5 bg-slate-100 border border-black text-black text-xs font-mono font-bold">
                          {prod.code}
                        </span>
                      </td>

                      <td className="px-3 py-3">
                        <span className="px-2 py-0.5 bg-amber-100 border border-black text-black text-[11px] font-black uppercase">
                          {prod.uom}
                        </span>
                      </td>

                      <td className="px-4 py-3 text-right">
                        <p className="text-xs font-black text-slate-700">
                          ৳{(prod.clientPrice || 0).toFixed(2)}
                        </p>
                      </td>

                      <td className="px-4 py-3 text-right">
                        <p className="text-xs font-black text-black">
                          ৳{(prod.retailPrice || 0).toFixed(2)}
                        </p>
                      </td>

                      <td className="px-4 py-3">
                        <span className="px-2 py-0.5 bg-cyan-100 border border-black text-black text-[10px] font-black uppercase">
                          {prod.parentCategory}
                        </span>
                      </td>

                      {/* Status Toggle Switch */}
                      <td className="px-3 py-3 text-center">
                        <button
                          type="button"
                          onClick={() => handleToggleStatus(prod)}
                          className={`inline-flex items-center gap-1 px-2 py-1 text-[10px] font-black uppercase border-2 border-black shadow-[2px_2px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 transition-all cursor-pointer ${
                            prod.status === 'ACTIVE' ? 'bg-emerald-300 text-black' : 'bg-slate-200 text-slate-600'
                          }`}
                        >
                          {prod.status === 'ACTIVE' ? (
                            <>
                              <CheckCircle2 className="w-3 h-3 text-black stroke-[3]" />
                              <span>Active</span>
                            </>
                          ) : (
                            <>
                              <XCircle className="w-3 h-3 text-slate-600 stroke-[3]" />
                              <span>Inactive</span>
                            </>
                          )}
                        </button>
                      </td>

                      {/* Actions (Screenshot 2: Edit, Eye/View, Delete) */}
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            type="button"
                            onClick={() => { setEditingProduct(prod); setIsCreateModalOpen(true); }}
                            className="p-1.5 bg-amber-300 hover:bg-amber-400 text-black border-2 border-black transition-all cursor-pointer shadow-[2px_2px_0px_#000] active:translate-x-0.5 active:translate-y-0.5"
                            title="Edit Product"
                          >
                            <Edit2 className="w-3.5 h-3.5 stroke-[2.5]" />
                          </button>
                          <button
                            type="button"
                            onClick={() => setViewingProduct(prod)}
                            className="p-1.5 bg-cyan-300 hover:bg-cyan-400 text-black border-2 border-black transition-all cursor-pointer shadow-[2px_2px_0px_#000] active:translate-x-0.5 active:translate-y-0.5"
                            title="View Barcode & Details"
                          >
                            <Eye className="w-3.5 h-3.5 stroke-[2.5]" />
                          </button>
                          <button
                            type="button"
                            onClick={() => setDeletingProduct(prod)}
                            className="p-1.5 bg-red-500 hover:bg-red-600 text-white border-2 border-black transition-all cursor-pointer shadow-[2px_2px_0px_#000] active:translate-x-0.5 active:translate-y-0.5"
                            title="Delete Product"
                          >
                            <Trash2 className="w-3.5 h-3.5 stroke-[2.5]" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Pagination Footer */}
          <div className="p-4 border-t-2 border-black bg-white flex flex-wrap items-center justify-between gap-3">
            <p className="text-xs font-bold text-slate-600 uppercase">
              Showing {(currentPage - 1) * pageSize + 1} to {Math.min(currentPage * pageSize, totalEntries)} of {totalEntries} entries
            </p>

            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="p-1.5 bg-white hover:bg-slate-100 disabled:opacity-40 border-2 border-black cursor-pointer shadow-[1px_1px_0px_#000]"
              >
                <ChevronLeft className="w-4 h-4 stroke-[2.5]" />
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1).slice(0, 5).map(pageNum => (
                <button
                  key={pageNum}
                  type="button"
                  onClick={() => setCurrentPage(pageNum)}
                  className={`px-3 py-1 text-xs font-black border-2 border-black cursor-pointer ${
                    currentPage === pageNum 
                      ? 'bg-amber-400 text-black shadow-[2px_2px_0px_#000]' 
                      : 'bg-white text-black hover:bg-slate-100'
                  }`}
                >
                  {pageNum}
                </button>
              ))}

              <button
                type="button"
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="p-1.5 bg-white hover:bg-slate-100 disabled:opacity-40 border-2 border-black cursor-pointer shadow-[1px_1px_0px_#000]"
              >
                <ChevronRight className="w-4 h-4 stroke-[2.5]" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add / Edit Product Modal */}
      <ProductCreateModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSave={handleSaveProduct}
        initialData={editingProduct}
        categories={categories}
        units={units}
        brands={brands}
        tags={tags}
      />

      {/* View Product Details / Barcode Quick Modal */}
      {viewingProduct && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border-2 sm:border-4 border-black shadow-[8px_8px_0px_#000] max-w-md w-full p-5 space-y-4 animate-in zoom-in-95">
            <div className="flex items-center justify-between pb-2 border-b-2 border-black">
              <div className="flex items-center gap-2">
                <Package className="w-4 h-4 text-black stroke-[2.5]" />
                <h3 className="text-sm font-black uppercase text-black">Product Details</h3>
              </div>
              <button 
                type="button"
                onClick={() => setViewingProduct(null)}
                className="p-1 bg-white hover:bg-slate-200 border-2 border-black"
              >
                <X className="w-4 h-4 stroke-[3]" />
              </button>
            </div>

            <div className="p-4 bg-amber-50 border-2 border-black shadow-[2px_2px_0px_#000] text-center space-y-2">
              <Barcode className="w-24 h-10 mx-auto text-black" />
              <p className="text-sm font-mono font-black text-black tracking-widest">{viewingProduct.code}</p>
              <p className="text-sm font-black text-black">{viewingProduct.name}</p>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs font-bold text-black">
              <div className="p-2 bg-slate-50 border border-black">
                <span className="text-[10px] text-slate-500 uppercase block">Category</span>
                <span>{viewingProduct.parentCategory}</span>
              </div>
              <div className="p-2 bg-slate-50 border border-black">
                <span className="text-[10px] text-slate-500 uppercase block">UOM</span>
                <span>{viewingProduct.uom}</span>
              </div>
              <div className="p-2 bg-slate-50 border border-black">
                <span className="text-[10px] text-slate-500 uppercase block">Client Price</span>
                <span>৳{(viewingProduct.clientPrice || 0).toFixed(2)}</span>
              </div>
              <div className="p-2 bg-slate-50 border border-black">
                <span className="text-[10px] text-slate-500 uppercase block">Retail Price</span>
                <span>৳{(viewingProduct.retailPrice || 0).toFixed(2)}</span>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="button"
                onClick={() => setViewingProduct(null)}
                className="px-4 py-2 bg-black text-white text-xs font-black uppercase border-2 border-black"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Single Delete Confirm */}
      <DeleteConfirmModal
        isOpen={!!deletingProduct}
        title="Delete Product"
        itemName={deletingProduct?.name || 'this product'}
        onCancel={() => setDeletingProduct(null)}
        onConfirm={handleConfirmDelete}
      />

      {/* Bulk Delete Confirm */}
      <DeleteConfirmModal
        isOpen={isBulkDeleting}
        title="Delete Selected Products"
        itemName={`${selectedIds.length} selected products`}
        onCancel={() => setIsBulkDeleting(false)}
        onConfirm={handleConfirmBulkDelete}
      />
    </div>
  );
};
