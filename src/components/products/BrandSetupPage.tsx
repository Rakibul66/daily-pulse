"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { useAuth } from '@/context/AuthContext';
import { ProductBrand } from '@/types/product';
import { 
  getProductBrands, 
  addProductBrand, 
  updateProductBrand, 
  deleteProductBrand, 
  deleteProductBrandsBulk 
} from '@/lib/productStorage';
import { BrandModal } from './BrandModal';
import { DeleteConfirmModal } from '../ui/DeleteConfirmModal';
import { 
  Plus, 
  Search, 
  Award, 
  Edit2, 
  Trash2, 
  Loader2, 
  CheckCircle2, 
  XCircle,
  ChevronLeft,
  ChevronRight,
  Globe,
  ExternalLink,
  PackageCheck
} from 'lucide-react';

interface Props {
  showToast: (msg: string, type: 'success' | 'error') => void;
}

export const BrandSetupPage: React.FC<Props> = ({ showToast }) => {
  const { user, userProfile } = useAuth();
  const [brands, setBrands] = useState<ProductBrand[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Search & Filter
  const [searchTerm, setSearchTerm] = useState('');
  const [pageSize, setPageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  // Selection
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // Modals
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBrand, setEditingBrand] = useState<ProductBrand | null>(null);
  const [deletingBrand, setDeletingBrand] = useState<ProductBrand | null>(null);
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
      const data = await getProductBrands(user.uid, userProfile?.companyId);
      setBrands(data);
    } catch (err) {
      console.error(err);
      showToast('Failed to load brands', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async (data: Omit<ProductBrand, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (!user) return;
    try {
      if (editingBrand) {
        await updateProductBrand(editingBrand.id, data);
        showToast('Brand updated successfully', 'success');
      } else {
        await addProductBrand({
          ...data,
          userId: user.uid,
          companyId: userProfile?.companyId || user.uid,
        });
        showToast('Brand created successfully', 'success');
      }
      loadData();
    } catch (err) {
      console.error(err);
      showToast('Error saving brand', 'error');
      throw err;
    }
  };

  const handleToggleStatus = async (brand: ProductBrand) => {
    const nextStatus = brand.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
    try {
      await updateProductBrand(brand.id, { status: nextStatus });
      setBrands(prev => prev.map(b => b.id === brand.id ? { ...b, status: nextStatus } : b));
      showToast(`Brand marked as ${nextStatus}`, 'success');
    } catch (err) {
      console.error(err);
      showToast('Failed to update status', 'error');
    }
  };

  const handleConfirmDelete = async () => {
    if (!deletingBrand) return;
    try {
      await deleteProductBrand(deletingBrand.id);
      showToast('Brand deleted successfully', 'success');
      setDeletingBrand(null);
      setSelectedIds(prev => prev.filter(id => id !== deletingBrand.id));
      loadData();
    } catch (err) {
      console.error(err);
      showToast('Failed to delete brand', 'error');
    }
  };

  const handleConfirmBulkDelete = async () => {
    if (selectedIds.length === 0) return;
    try {
      await deleteProductBrandsBulk(selectedIds);
      showToast(`Deleted ${selectedIds.length} brands`, 'success');
      setSelectedIds([]);
      setIsBulkDeleting(false);
      loadData();
    } catch (err) {
      console.error(err);
      showToast('Failed to delete selected brands', 'error');
    }
  };

  // Filtered & Paginated Data
  const filteredBrands = useMemo(() => {
    return brands.filter(b => {
      const matchSearch = 
        (b.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (b.code || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (b.description || '').toLowerCase().includes(searchTerm.toLowerCase());
      return matchSearch;
    });
  }, [brands, searchTerm]);

  const totalPages = Math.ceil(filteredBrands.length / pageSize) || 1;
  const paginatedBrands = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredBrands.slice(start, start + pageSize);
  }, [filteredBrands, currentPage, pageSize]);

  const allSelectedOnPage = paginatedBrands.length > 0 && paginatedBrands.every(b => selectedIds.includes(b.id));

  const toggleSelectAll = () => {
    if (allSelectedOnPage) {
      const pageIds = new Set(paginatedBrands.map(b => b.id));
      setSelectedIds(prev => prev.filter(id => !pageIds.has(id)));
    } else {
      const pageIds = paginatedBrands.map(b => b.id);
      setSelectedIds(prev => Array.from(new Set([...prev, ...pageIds])));
    }
  };

  const toggleSelectOne = (id: string) => {
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  // Summary Metrics
  const activeCount = brands.filter(b => b.status === 'ACTIVE').length;
  const inactiveCount = brands.length - activeCount;

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto space-y-6">
      {/* Metrics Banner */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 bg-white border-2 sm:border-4 border-black shadow-[4px_4px_0px_#000] flex items-center justify-between">
          <div>
            <p className="text-[10px] font-black uppercase tracking-wider text-slate-500">Total Brands</p>
            <p className="text-2xl font-black text-black">{brands.length}</p>
          </div>
          <div className="p-3 bg-amber-300 border-2 border-black shadow-[2px_2px_0px_#000]">
            <Award className="w-5 h-5 text-black stroke-[2.5]" />
          </div>
        </div>

        <div className="p-4 bg-white border-2 sm:border-4 border-black shadow-[4px_4px_0px_#000] flex items-center justify-between">
          <div>
            <p className="text-[10px] font-black uppercase tracking-wider text-slate-500">Active Brands</p>
            <p className="text-2xl font-black text-emerald-600">{activeCount}</p>
          </div>
          <div className="p-3 bg-emerald-300 border-2 border-black shadow-[2px_2px_0px_#000]">
            <CheckCircle2 className="w-5 h-5 text-black stroke-[2.5]" />
          </div>
        </div>

        <div className="p-4 bg-white border-2 sm:border-4 border-black shadow-[4px_4px_0px_#000] flex items-center justify-between">
          <div>
            <p className="text-[10px] font-black uppercase tracking-wider text-slate-500">Inactive Brands</p>
            <p className="text-2xl font-black text-slate-600">{inactiveCount}</p>
          </div>
          <div className="p-3 bg-slate-200 border-2 border-black shadow-[2px_2px_0px_#000]">
            <XCircle className="w-5 h-5 text-black stroke-[2.5]" />
          </div>
        </div>
      </div>

      {/* Main Container */}
      <div className="bg-white border-2 sm:border-4 border-black shadow-[6px_6px_0px_#000]">
        {/* Table Header Bar */}
        <div className="p-4 sm:p-5 border-b-2 sm:border-b-4 border-black flex flex-wrap items-center justify-between gap-4 bg-amber-300">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 bg-white border-2 border-black shadow-[2px_2px_0px_#000]">
              <Award className="w-5 h-5 text-black stroke-[2.5]" />
            </div>
            <div>
              <h1 className="text-base sm:text-lg font-black uppercase tracking-wider text-black">
                Brand Setup
              </h1>
              <p className="text-[10px] font-bold text-slate-800 uppercase">
                Manage manufacturers, partner brands &amp; product labels
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            {selectedIds.length > 0 && (
              <button
                onClick={() => setIsBulkDeleting(true)}
                className="flex items-center gap-1.5 px-3.5 py-2 bg-rose-500 hover:bg-rose-400 text-white border-2 border-black text-xs font-black uppercase shadow-[2px_2px_0px_#000] cursor-pointer active:translate-x-0.5 active:translate-y-0.5"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete ({selectedIds.length})</span>
              </button>
            )}
            <button
              onClick={() => {
                setEditingBrand(null);
                setIsModalOpen(true);
              }}
              className="flex items-center gap-1.5 px-4 py-2 bg-white hover:bg-slate-100 text-black border-2 border-black text-xs font-black uppercase shadow-[2px_2px_0px_#000] cursor-pointer active:translate-x-0.5 active:translate-y-0.5"
            >
              <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
              <span>Add Brand</span>
            </button>
          </div>
        </div>

        {/* Action / Filter Bar */}
        <div className="p-4 border-b-2 border-black bg-slate-50 flex flex-wrap items-center justify-between gap-3">
          <div className="relative flex-1 min-w-[240px] max-w-md">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              type="text"
              value={searchTerm}
              onChange={e => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              placeholder="Search by brand name or code..."
              className="w-full pl-9 pr-3 py-1.5 bg-white border-2 border-black text-xs font-bold text-black focus:outline-none focus:bg-amber-50 focus:shadow-[2px_2px_0px_#000]"
            />
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-black uppercase text-black">Show:</span>
              <select
                value={pageSize}
                onChange={e => {
                  setPageSize(Number(e.target.value));
                  setCurrentPage(1);
                }}
                className="px-2 py-1 bg-white border-2 border-black text-xs font-bold text-black focus:outline-none cursor-pointer"
              >
                <option value={10}>10</option>
                <option value={25}>25</option>
                <option value={50}>50</option>
              </select>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-100 border-b-2 border-black text-[10px] font-black uppercase text-black">
                <th className="p-3 w-10 text-center border-r-2 border-black">
                  <input
                    type="checkbox"
                    checked={allSelectedOnPage}
                    onChange={toggleSelectAll}
                    className="w-3.5 h-3.5 accent-black cursor-pointer"
                  />
                </th>
                <th className="p-3 w-14 text-center border-r-2 border-black">SL</th>
                <th className="p-3 w-20 text-center border-r-2 border-black">Logo</th>
                <th className="p-3 border-r-2 border-black">Brand Name</th>
                <th className="p-3 w-28 text-center border-r-2 border-black">Code</th>
                <th className="p-3 border-r-2 border-black hidden sm:table-cell">Website / Info</th>
                <th className="p-3 w-28 text-center border-r-2 border-black">Status</th>
                <th className="p-3 w-28 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y-2 divide-black text-xs font-bold text-black">
              {isLoading ? (
                <tr>
                  <td colSpan={8} className="p-8 text-center">
                    <div className="flex items-center justify-center gap-2 text-slate-600">
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span className="font-black uppercase tracking-wider text-xs">Loading Brands...</span>
                    </div>
                  </td>
                </tr>
              ) : paginatedBrands.length === 0 ? (
                <tr>
                  <td colSpan={8} className="p-8 text-center text-slate-500 font-bold uppercase">
                    No brands found.
                  </td>
                </tr>
              ) : (
                paginatedBrands.map((brand, idx) => {
                  const sl = (currentPage - 1) * pageSize + idx + 1;
                  const isChecked = selectedIds.includes(brand.id);
                  return (
                    <tr
                      key={brand.id}
                      className={`hover:bg-amber-50/60 transition-colors ${isChecked ? 'bg-amber-100/50' : ''}`}
                    >
                      <td className="p-3 text-center border-r-2 border-black">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => toggleSelectOne(brand.id)}
                          className="w-3.5 h-3.5 accent-black cursor-pointer"
                        />
                      </td>
                      <td className="p-3 text-center font-black border-r-2 border-black text-slate-700">
                        {sl}
                      </td>
                      <td className="p-2 text-center border-r-2 border-black">
                        <div className="w-10 h-10 mx-auto border-2 border-black bg-white flex items-center justify-center overflow-hidden">
                          {brand.image ? (
                            <img src={brand.image} alt={brand.name} className="w-full h-full object-contain" />
                          ) : (
                            <Award className="w-5 h-5 text-slate-400 stroke-1.5" />
                          )}
                        </div>
                      </td>
                      <td className="p-3 border-r-2 border-black">
                        <span className="font-black text-black block">{brand.name}</span>
                        {brand.description && (
                          <span className="text-[10px] text-slate-500 line-clamp-1">{brand.description}</span>
                        )}
                      </td>
                      <td className="p-3 text-center border-r-2 border-black">
                        {brand.code ? (
                          <span className="px-2 py-0.5 bg-slate-200 border border-black text-[10px] font-black uppercase">
                            {brand.code}
                          </span>
                        ) : (
                          <span className="text-slate-400 text-[10px]">—</span>
                        )}
                      </td>
                      <td className="p-3 border-r-2 border-black hidden sm:table-cell">
                        {brand.website ? (
                          <a
                            href={brand.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-indigo-600 hover:underline text-[11px]"
                          >
                            <Globe className="w-3 h-3" />
                            <span className="truncate max-w-[160px]">{brand.website.replace(/^https?:\/\//, '')}</span>
                            <ExternalLink className="w-2.5 h-2.5" />
                          </a>
                        ) : (
                          <span className="text-slate-400 text-[11px]">—</span>
                        )}
                      </td>
                      <td className="p-3 text-center border-r-2 border-black">
                        <button
                          type="button"
                          onClick={() => handleToggleStatus(brand)}
                          className={`px-2 py-0.5 text-[10px] font-black uppercase border-2 border-black cursor-pointer transition-transform active:scale-95 ${
                            brand.status === 'ACTIVE'
                              ? 'bg-emerald-300 text-black shadow-[1px_1px_0px_#000]'
                              : 'bg-rose-200 text-rose-800'
                          }`}
                        >
                          {brand.status}
                        </button>
                      </td>
                      <td className="p-3 text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          <button
                            onClick={() => {
                              setEditingBrand(brand);
                              setIsModalOpen(true);
                            }}
                            className="p-1.5 bg-amber-300 hover:bg-amber-400 text-black border-2 border-black shadow-[1px_1px_0px_#000] cursor-pointer"
                            title="Edit Brand"
                          >
                            <Edit2 className="w-3.5 h-3.5 stroke-[2.5]" />
                          </button>
                          <button
                            onClick={() => setDeletingBrand(brand)}
                            className="p-1.5 bg-rose-400 hover:bg-rose-500 text-black border-2 border-black shadow-[1px_1px_0px_#000] cursor-pointer"
                            title="Delete Brand"
                          >
                            <Trash2 className="w-3.5 h-3.5 stroke-[2.5]" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        <div className="p-4 border-t-2 border-black bg-slate-50 flex flex-wrap items-center justify-between gap-3">
          <p className="text-[11px] font-bold text-slate-700">
            Showing <span className="font-black">{paginatedBrands.length > 0 ? (currentPage - 1) * pageSize + 1 : 0}</span> to{' '}
            <span className="font-black">{Math.min(currentPage * pageSize, filteredBrands.length)}</span> of{' '}
            <span className="font-black">{filteredBrands.length}</span> brands
          </p>

          <div className="flex items-center gap-1">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="p-1.5 bg-white border-2 border-black text-black disabled:opacity-40 cursor-pointer shadow-[1px_1px_0px_#000] active:translate-x-0.5 active:translate-y-0.5"
            >
              <ChevronLeft className="w-3.5 h-3.5 stroke-[2.5]" />
            </button>
            <span className="px-3 py-1 bg-white border-2 border-black text-xs font-black text-black">
              {currentPage} / {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="p-1.5 bg-white border-2 border-black text-black disabled:opacity-40 cursor-pointer shadow-[1px_1px_0px_#000] active:translate-x-0.5 active:translate-y-0.5"
            >
              <ChevronRight className="w-3.5 h-3.5 stroke-[2.5]" />
            </button>
          </div>
        </div>
      </div>

      {/* Brand Create/Edit Modal */}
      <BrandModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingBrand(null);
        }}
        onSave={handleSave}
        initialData={editingBrand}
      />

      {/* Delete Single Confirm Modal */}
      <DeleteConfirmModal
        isOpen={!!deletingBrand}
        onCancel={() => setDeletingBrand(null)}
        onConfirm={handleConfirmDelete}
        title="Delete Brand"
        itemName={deletingBrand?.name || 'this brand'}
      />

      {/* Bulk Delete Confirm Modal */}
      <DeleteConfirmModal
        isOpen={isBulkDeleting}
        onCancel={() => setIsBulkDeleting(false)}
        onConfirm={handleConfirmBulkDelete}
        title="Delete Selected Brands"
        itemName={`${selectedIds.length} selected brands`}
      />
    </div>
  );
};
