"use client";

import React from "react";
import { 
  Plus, 
  Search, 
  Layers, 
  Edit2, 
  Trash2, 
  Loader2, 
  CheckCircle2, 
  XCircle, 
  ChevronLeft, 
  ChevronRight 
} from "lucide-react";
import { ProductCategory } from "@/types/product";

interface CategoryTableProps {
  categories: ProductCategory[];
  paginatedCategories: ProductCategory[];
  isLoading: boolean;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  statusFilter: 'ALL' | 'ACTIVE' | 'INACTIVE';
  setStatusFilter: (filter: 'ALL' | 'ACTIVE' | 'INACTIVE') => void;
  pageSize: number;
  setPageSize: (size: number) => void;
  currentPage: number;
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
  totalPages: number;
  totalEntries: number;
  selectedIds: string[];
  isAllSelected: boolean;
  onSelectAll: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSelectOne: (id: string) => void;
  onToggleStatus: (cat: ProductCategory) => void;
  onAddNew: () => void;
  onEdit: (cat: ProductCategory) => void;
  onDelete: (cat: ProductCategory) => void;
  onBulkDelete: () => void;
}

export const CategoryTable: React.FC<CategoryTableProps> = ({
  categories,
  paginatedCategories,
  isLoading,
  searchTerm,
  setSearchTerm,
  statusFilter,
  setStatusFilter,
  pageSize,
  setPageSize,
  currentPage,
  setCurrentPage,
  totalPages,
  totalEntries,
  selectedIds,
  isAllSelected,
  onSelectAll,
  onSelectOne,
  onToggleStatus,
  onAddNew,
  onEdit,
  onDelete,
  onBulkDelete
}) => {
  return (
    <div className="w-full mx-auto space-y-6 pb-20">
      {/* Top Banner Card */}
      <div className="bg-white p-4 sm:p-5 border-2 sm:border-4 border-black shadow-[6px_6px_0px_#000] flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-2.5">
            <span className="w-3 h-3 bg-amber-400 border border-black inline-block"></span>
            <h2 className="text-lg font-black uppercase text-black tracking-wider">Category Setup</h2>
            <span className="px-2 py-0.5 bg-amber-100 border border-black text-black text-xs font-black">
              {categories.length} CATEGORIES
            </span>
          </div>
          <p className="text-xs font-bold text-slate-600 uppercase mt-1">
            Organize products into hierarchical parent &amp; child categories.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <select 
            value={statusFilter}
            onChange={e => { setStatusFilter(e.target.value as any); setCurrentPage(1); }}
            className="px-3 py-2 bg-white text-black border-2 border-black text-xs font-black uppercase shadow-[2px_2px_0px_#000] focus:outline-none cursor-pointer"
          >
            <option value="ALL">All Status</option>
            <option value="ACTIVE">Active Only</option>
            <option value="INACTIVE">Inactive Only</option>
          </select>

          <button 
            type="button"
            onClick={onAddNew}
            className="flex items-center gap-2 px-4 py-2 bg-emerald-400 hover:bg-emerald-300 text-black border-2 border-black text-xs font-black uppercase shadow-[2px_2px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>Add New</span>
          </button>
        </div>
      </div>

      {/* Control Bar: Page Size, Search, & Bulk Action */}
      <div className="bg-white p-4 border-2 sm:border-4 border-black shadow-[6px_6px_0px_#000] flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 text-xs font-black uppercase text-black">
            <span>Show</span>
            <select
              value={pageSize}
              onChange={e => { setPageSize(Number(e.target.value)); setCurrentPage(1); }}
              className="px-2 py-1 bg-white border-2 border-black text-xs font-black cursor-pointer"
            >
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
            </select>
            <span>entries</span>
          </div>

          {selectedIds.length > 0 && (
            <button
              type="button"
              onClick={onBulkDelete}
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
            placeholder="Search categories..." 
            value={searchTerm}
            onChange={e => { setSearchTerm(e.target.value); setCurrentPage(1); }}
            className="w-full text-xs font-bold text-black bg-white pl-9 pr-3 py-2 border-2 border-black focus:outline-none focus:bg-amber-50 placeholder-slate-400"
          />
        </div>
      </div>

      {/* Categories Table View */}
      {isLoading ? (
        <div className="p-12 text-center bg-white border-2 sm:border-4 border-black shadow-[6px_6px_0px_#000]">
          <Loader2 className="w-8 h-8 animate-spin mx-auto text-black mb-2" />
          <p className="font-black uppercase tracking-wider text-xs text-black">Loading Categories...</p>
        </div>
      ) : paginatedCategories.length === 0 ? (
        <div className="p-12 text-center bg-white border-2 sm:border-4 border-black shadow-[6px_6px_0px_#000] flex flex-col items-center justify-center">
          <Layers className="w-12 h-12 stroke-[1.5] text-slate-400 mb-3" />
          <p className="font-black text-sm uppercase text-black mb-1">No Categories Found</p>
          <p className="text-xs font-bold text-slate-600 max-w-md uppercase mb-5">
            {searchTerm ? 'No categories matched your search criteria.' : 'Get started by creating your first product category.'}
          </p>
          <button 
            onClick={onAddNew}
            className="flex items-center gap-2 px-4 py-2.5 bg-emerald-400 hover:bg-emerald-300 text-black border-2 border-black text-xs font-black uppercase shadow-[2px_2px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4 stroke-[3]" /> Add First Category
          </button>
        </div>
      ) : (
        <div className="bg-white border-2 sm:border-4 border-black shadow-[6px_6px_0px_#000] overflow-hidden">
          <div className="overflow-x-auto custom-scrollbar">
            <table className="w-full text-left border-collapse min-w-[700px]">
              <thead>
                <tr className="bg-black text-white border-b-2 border-black">
                  <th className="px-3 py-3 w-10 text-center">
                    <input 
                      type="checkbox" 
                      checked={isAllSelected}
                      onChange={onSelectAll}
                      className="cursor-pointer accent-amber-400 w-4 h-4"
                    />
                  </th>
                  <th className="px-3 py-3 w-12 text-center text-[11px] font-black uppercase tracking-wider">SL</th>
                  <th className="px-4 py-3 text-[11px] font-black uppercase tracking-wider">Image</th>
                  <th className="px-4 py-3 text-[11px] font-black uppercase tracking-wider">Name</th>
                  <th className="px-4 py-3 text-[11px] font-black uppercase tracking-wider">Parent Category</th>
                  <th className="px-4 py-3 text-[11px] font-black uppercase tracking-wider text-center">Status</th>
                  <th className="px-4 py-3 text-[11px] font-black uppercase tracking-wider text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y-2 divide-black/10">
                {paginatedCategories.map((cat, idx) => {
                  const sl = (currentPage - 1) * pageSize + idx + 1;
                  const isChecked = selectedIds.includes(cat.id);

                  return (
                    <tr 
                      key={cat.id} 
                      className={`hover:bg-amber-50/60 transition-colors ${isChecked ? 'bg-amber-100/40' : 'bg-white'}`}
                    >
                      <td className="px-3 py-3 text-center">
                        <input 
                          type="checkbox" 
                          checked={isChecked}
                          onChange={() => onSelectOne(cat.id)}
                          className="cursor-pointer accent-amber-400 w-4 h-4"
                        />
                      </td>

                      <td className="px-3 py-3 text-center text-xs font-mono font-bold text-slate-700">
                        {sl}
                      </td>

                      <td className="px-4 py-3">
                        <div className="w-10 h-10 border-2 border-black bg-slate-100 flex items-center justify-center overflow-hidden">
                          {cat.image ? (
                            <img src={cat.image} alt={cat.name} className="w-full h-full object-cover" />
                          ) : (
                            <span className="text-[9px] font-bold text-slate-500 uppercase">No Image</span>
                          )}
                        </div>
                      </td>

                      <td className="px-4 py-3">
                        <p className="text-xs font-black text-black uppercase">{cat.name}</p>
                      </td>

                      <td className="px-4 py-3">
                        <span className="px-2 py-0.5 bg-slate-100 border border-black text-[10px] font-black uppercase text-black">
                          {cat.parentCategory || 'None'}
                        </span>
                      </td>

                      <td className="px-4 py-3 text-center">
                        <button
                          type="button"
                          onClick={() => onToggleStatus(cat)}
                          className={`inline-flex items-center gap-1 px-2.5 py-0.5 text-[10px] font-black uppercase border-2 border-black shadow-[1px_1px_0px_#000] cursor-pointer transition-transform active:translate-x-0.5 active:translate-y-0.5 ${
                            cat.status === 'ACTIVE' 
                              ? 'bg-emerald-300 text-black hover:bg-emerald-200' 
                              : 'bg-rose-300 text-black hover:bg-rose-200'
                          }`}
                        >
                          {cat.status === 'ACTIVE' ? (
                            <>
                              <CheckCircle2 className="w-3 h-3 stroke-[2.5]" />
                              <span>Active</span>
                            </>
                          ) : (
                            <>
                              <XCircle className="w-3 h-3 stroke-[2.5]" />
                              <span>Inactive</span>
                            </>
                          )}
                        </button>
                      </td>

                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            type="button"
                            onClick={() => onEdit(cat)}
                            title="Edit Category"
                            className="p-1.5 bg-amber-300 hover:bg-amber-400 text-black border-2 border-black shadow-[1px_1px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 cursor-pointer"
                          >
                            <Edit2 className="w-3.5 h-3.5 stroke-[2.5]" />
                          </button>
                          <button
                            type="button"
                            onClick={() => onDelete(cat)}
                            title="Delete Category"
                            className="p-1.5 bg-red-500 hover:bg-red-600 text-white border-2 border-black shadow-[1px_1px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 cursor-pointer"
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

          {/* Table Pagination Footer */}
          <div className="p-4 border-t-2 border-black bg-neutral-50 flex flex-wrap items-center justify-between gap-3">
            <span className="text-xs font-black uppercase text-black">
              Showing {paginatedCategories.length} of {totalEntries} entries
            </span>

            <div className="flex items-center gap-2">
              <button
                type="button"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                className="p-1.5 border-2 border-black bg-white hover:bg-amber-100 disabled:opacity-40 disabled:hover:bg-white cursor-pointer shadow-[1px_1px_0px_#000]"
              >
                <ChevronLeft className="w-4 h-4 stroke-[2.5]" />
              </button>

              <span className="text-xs font-black uppercase px-2 text-black">
                {currentPage} / {totalPages}
              </span>

              <button
                type="button"
                disabled={currentPage >= totalPages}
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                className="p-1.5 border-2 border-black bg-white hover:bg-amber-100 disabled:opacity-40 disabled:hover:bg-white cursor-pointer shadow-[1px_1px_0px_#000]"
              >
                <ChevronRight className="w-4 h-4 stroke-[2.5]" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
