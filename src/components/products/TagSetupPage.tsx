"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { useAuth } from '@/context/AuthContext';
import { ProductTag } from '@/types/product';
import { 
  getProductTags, 
  addProductTag, 
  updateProductTag, 
  deleteProductTag, 
  deleteProductTagsBulk 
} from '@/lib/productStorage';
import { TagModal } from './TagModal';
import { DeleteConfirmModal } from '../ui/DeleteConfirmModal';
import { 
  Plus, 
  Search, 
  Tag as TagIcon, 
  Edit2, 
  Trash2, 
  Loader2, 
  CheckCircle2, 
  XCircle,
  ChevronLeft,
  ChevronRight,
  Palette
} from 'lucide-react';

interface Props {
  showToast: (msg: string, type: 'success' | 'error') => void;
}

export const TagSetupPage: React.FC<Props> = ({ showToast }) => {
  const { user, userProfile } = useAuth();
  const [tags, setTags] = useState<ProductTag[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Search & Filter
  const [searchTerm, setSearchTerm] = useState('');
  const [pageSize, setPageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  // Selection
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // Modals
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTag, setEditingTag] = useState<ProductTag | null>(null);
  const [deletingTag, setDeletingTag] = useState<ProductTag | null>(null);
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
      const data = await getProductTags(user.uid, userProfile?.companyId);
      setTags(data);
    } catch (err) {
      console.error(err);
      showToast('Failed to load product tags', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async (data: Omit<ProductTag, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (!user) return;
    try {
      if (editingTag) {
        await updateProductTag(editingTag.id, data);
        showToast('Tag updated successfully', 'success');
      } else {
        await addProductTag({
          ...data,
          userId: user.uid,
          companyId: userProfile?.companyId || user.uid,
        });
        showToast('Tag created successfully', 'success');
      }
      loadData();
    } catch (err) {
      console.error(err);
      showToast('Error saving tag', 'error');
      throw err;
    }
  };

  const handleToggleStatus = async (tag: ProductTag) => {
    const nextStatus = tag.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
    try {
      await updateProductTag(tag.id, { status: nextStatus });
      setTags(prev => prev.map(t => t.id === tag.id ? { ...t, status: nextStatus } : t));
      showToast(`Tag marked as ${nextStatus}`, 'success');
    } catch (err) {
      console.error(err);
      showToast('Failed to update status', 'error');
    }
  };

  const handleConfirmDelete = async () => {
    if (!deletingTag) return;
    try {
      await deleteProductTag(deletingTag.id);
      showToast('Tag deleted successfully', 'success');
      setDeletingTag(null);
      setSelectedIds(prev => prev.filter(id => id !== deletingTag.id));
      loadData();
    } catch (err) {
      console.error(err);
      showToast('Failed to delete tag', 'error');
    }
  };

  const handleConfirmBulkDelete = async () => {
    if (selectedIds.length === 0) return;
    try {
      await deleteProductTagsBulk(selectedIds);
      showToast(`Deleted ${selectedIds.length} tags`, 'success');
      setSelectedIds([]);
      setIsBulkDeleting(false);
      loadData();
    } catch (err) {
      console.error(err);
      showToast('Failed to delete selected tags', 'error');
    }
  };

  // Filtered & Paginated Data
  const filteredTags = useMemo(() => {
    return tags.filter(t => {
      const matchSearch = 
        (t.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (t.description || '').toLowerCase().includes(searchTerm.toLowerCase());
      return matchSearch;
    });
  }, [tags, searchTerm]);

  const totalPages = Math.ceil(filteredTags.length / pageSize) || 1;
  const paginatedTags = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredTags.slice(start, start + pageSize);
  }, [filteredTags, currentPage, pageSize]);

  const allSelectedOnPage = paginatedTags.length > 0 && paginatedTags.every(t => selectedIds.includes(t.id));

  const toggleSelectAll = () => {
    if (allSelectedOnPage) {
      const pageIds = new Set(paginatedTags.map(t => t.id));
      setSelectedIds(prev => prev.filter(id => !pageIds.has(id)));
    } else {
      const pageIds = paginatedTags.map(t => t.id);
      setSelectedIds(prev => Array.from(new Set([...prev, ...pageIds])));
    }
  };

  const toggleSelectOne = (id: string) => {
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  // Summary Metrics
  const activeCount = tags.filter(t => t.status === 'ACTIVE').length;
  const inactiveCount = tags.length - activeCount;

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto space-y-6">
      {/* Metrics Banner */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 bg-white border-2 sm:border-4 border-black shadow-[4px_4px_0px_#000] flex items-center justify-between">
          <div>
            <p className="text-[10px] font-black uppercase tracking-wider text-slate-500">Total Tags</p>
            <p className="text-2xl font-black text-black">{tags.length}</p>
          </div>
          <div className="p-3 bg-amber-300 border-2 border-black shadow-[2px_2px_0px_#000]">
            <TagIcon className="w-5 h-5 text-black stroke-[2.5]" />
          </div>
        </div>

        <div className="p-4 bg-white border-2 sm:border-4 border-black shadow-[4px_4px_0px_#000] flex items-center justify-between">
          <div>
            <p className="text-[10px] font-black uppercase tracking-wider text-slate-500">Active Tags</p>
            <p className="text-2xl font-black text-emerald-600">{activeCount}</p>
          </div>
          <div className="p-3 bg-emerald-300 border-2 border-black shadow-[2px_2px_0px_#000]">
            <CheckCircle2 className="w-5 h-5 text-black stroke-[2.5]" />
          </div>
        </div>

        <div className="p-4 bg-white border-2 sm:border-4 border-black shadow-[4px_4px_0px_#000] flex items-center justify-between">
          <div>
            <p className="text-[10px] font-black uppercase tracking-wider text-slate-500">Inactive Tags</p>
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
              <TagIcon className="w-5 h-5 text-black stroke-[2.5]" />
            </div>
            <div>
              <h1 className="text-base sm:text-lg font-black uppercase tracking-wider text-black">
                Tag Setup
              </h1>
              <p className="text-[10px] font-bold text-slate-800 uppercase">
                Manage promotional tags, filters &amp; catalog badges
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
                setEditingTag(null);
                setIsModalOpen(true);
              }}
              className="flex items-center gap-1.5 px-4 py-2 bg-white hover:bg-slate-100 text-black border-2 border-black text-xs font-black uppercase shadow-[2px_2px_0px_#000] cursor-pointer active:translate-x-0.5 active:translate-y-0.5"
            >
              <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
              <span>Add Tag</span>
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
              placeholder="Search by tag name or description..."
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
                <th className="p-3 border-r-2 border-black">Tag Badge</th>
                <th className="p-3 border-r-2 border-black">Description</th>
                <th className="p-3 w-28 text-center border-r-2 border-black">Status</th>
                <th className="p-3 w-28 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y-2 divide-black text-xs font-bold text-black">
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center">
                    <div className="flex items-center justify-center gap-2 text-slate-600">
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span className="font-black uppercase tracking-wider text-xs">Loading Tags...</span>
                    </div>
                  </td>
                </tr>
              ) : paginatedTags.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-slate-500 font-bold uppercase">
                    No product tags found.
                  </td>
                </tr>
              ) : (
                paginatedTags.map((tag, idx) => {
                  const sl = (currentPage - 1) * pageSize + idx + 1;
                  const isChecked = selectedIds.includes(tag.id);
                  return (
                    <tr
                      key={tag.id}
                      className={`hover:bg-amber-50/60 transition-colors ${isChecked ? 'bg-amber-100/50' : ''}`}
                    >
                      <td className="p-3 text-center border-r-2 border-black">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => toggleSelectOne(tag.id)}
                          className="w-3.5 h-3.5 accent-black cursor-pointer"
                        />
                      </td>
                      <td className="p-3 text-center font-black border-r-2 border-black text-slate-700">
                        {sl}
                      </td>
                      <td className="p-3 border-r-2 border-black">
                        <span
                          style={{ backgroundColor: tag.color || '#f59e0b' }}
                          className="px-2.5 py-1 text-xs font-black uppercase text-black border-2 border-black shadow-[2px_2px_0px_#000] inline-flex items-center gap-1.5"
                        >
                          <TagIcon className="w-3 h-3 stroke-[2.5]" />
                          {tag.name}
                        </span>
                      </td>
                      <td className="p-3 border-r-2 border-black text-slate-700">
                        {tag.description || <span className="text-slate-400 text-[11px]">—</span>}
                      </td>
                      <td className="p-3 text-center border-r-2 border-black">
                        <button
                          type="button"
                          onClick={() => handleToggleStatus(tag)}
                          className={`px-2 py-0.5 text-[10px] font-black uppercase border-2 border-black cursor-pointer transition-transform active:scale-95 ${
                            tag.status === 'ACTIVE'
                              ? 'bg-emerald-300 text-black shadow-[1px_1px_0px_#000]'
                              : 'bg-rose-200 text-rose-800'
                          }`}
                        >
                          {tag.status}
                        </button>
                      </td>
                      <td className="p-3 text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          <button
                            onClick={() => {
                              setEditingTag(tag);
                              setIsModalOpen(true);
                            }}
                            className="p-1.5 bg-amber-300 hover:bg-amber-400 text-black border-2 border-black shadow-[1px_1px_0px_#000] cursor-pointer"
                            title="Edit Tag"
                          >
                            <Edit2 className="w-3.5 h-3.5 stroke-[2.5]" />
                          </button>
                          <button
                            onClick={() => setDeletingTag(tag)}
                            className="p-1.5 bg-rose-400 hover:bg-rose-500 text-black border-2 border-black shadow-[1px_1px_0px_#000] cursor-pointer"
                            title="Delete Tag"
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
            Showing <span className="font-black">{paginatedTags.length > 0 ? (currentPage - 1) * pageSize + 1 : 0}</span> to{' '}
            <span className="font-black">{Math.min(currentPage * pageSize, filteredTags.length)}</span> of{' '}
            <span className="font-black">{filteredTags.length}</span> tags
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

      {/* Tag Create/Edit Modal */}
      <TagModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingTag(null);
        }}
        onSave={handleSave}
        initialData={editingTag}
      />

      {/* Delete Single Confirm Modal */}
      <DeleteConfirmModal
        isOpen={!!deletingTag}
        onCancel={() => setDeletingTag(null)}
        onConfirm={handleConfirmDelete}
        title="Delete Tag"
        itemName={deletingTag?.name || 'this tag'}
      />

      {/* Bulk Delete Confirm Modal */}
      <DeleteConfirmModal
        isOpen={isBulkDeleting}
        onCancel={() => setIsBulkDeleting(false)}
        onConfirm={handleConfirmBulkDelete}
        title="Delete Selected Tags"
        itemName={`${selectedIds.length} selected tags`}
      />
    </div>
  );
};
