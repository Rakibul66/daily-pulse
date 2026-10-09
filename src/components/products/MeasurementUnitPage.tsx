"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { useAuth } from '@/context/AuthContext';
import { MeasurementUnit } from '@/types/product';
import { 
  getMeasurementUnits, 
  addMeasurementUnit, 
  updateMeasurementUnit, 
  deleteMeasurementUnit, 
  deleteMeasurementUnitsBulk 
} from '@/lib/productStorage';
import { UnitModal } from './UnitModal';
import { DeleteConfirmModal } from '../ui/DeleteConfirmModal';
import { 
  Plus, 
  Search, 
  Scale, 
  Edit2, 
  Trash2, 
  Loader2, 
  CheckCircle2, 
  XCircle,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

interface Props {
  showToast: (msg: string, type: 'success' | 'error') => void;
}

export const MeasurementUnitPage: React.FC<Props> = ({ showToast }) => {
  const { user, userProfile } = useAuth();
  const [units, setUnits] = useState<MeasurementUnit[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Search & Filter
  const [searchTerm, setSearchTerm] = useState('');
  const [pageSize, setPageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  // Selection
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // Modals
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUnit, setEditingUnit] = useState<MeasurementUnit | null>(null);
  const [deletingUnit, setDeletingUnit] = useState<MeasurementUnit | null>(null);
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
      const data = await getMeasurementUnits(user.uid, userProfile?.companyId);
      setUnits(data);
    } catch (err) {
      console.error(err);
      showToast('Failed to load measurement units', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async (data: Omit<MeasurementUnit, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (!user) return;
    try {
      if (editingUnit) {
        await updateMeasurementUnit(editingUnit.id, data);
        showToast('Unit updated successfully', 'success');
      } else {
        await addMeasurementUnit({
          ...data,
          userId: user.uid,
          companyId: userProfile?.companyId || user.uid,
        });
        showToast('Unit created successfully', 'success');
      }
      loadData();
    } catch (err) {
      console.error(err);
      showToast('Error saving unit', 'error');
      throw err;
    }
  };

  const handleToggleStatus = async (unit: MeasurementUnit) => {
    const nextStatus = unit.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
    try {
      await updateMeasurementUnit(unit.id, { status: nextStatus });
      setUnits(prev => prev.map(u => u.id === unit.id ? { ...u, status: nextStatus } : u));
      showToast(`Unit marked as ${nextStatus}`, 'success');
    } catch (err) {
      console.error(err);
      showToast('Failed to update status', 'error');
    }
  };

  const handleConfirmDelete = async () => {
    if (!deletingUnit) return;
    try {
      await deleteMeasurementUnit(deletingUnit.id);
      showToast('Unit deleted successfully', 'success');
      setDeletingUnit(null);
      setSelectedIds(prev => prev.filter(id => id !== deletingUnit.id));
      loadData();
    } catch (err) {
      console.error(err);
      showToast('Failed to delete unit', 'error');
    }
  };

  const handleConfirmBulkDelete = async () => {
    if (selectedIds.length === 0) return;
    try {
      await deleteMeasurementUnitsBulk(selectedIds);
      showToast(`Deleted ${selectedIds.length} units`, 'success');
      setIsBulkDeleting(false);
      setSelectedIds([]);
      loadData();
    } catch (err) {
      console.error(err);
      showToast('Bulk delete failed', 'error');
    }
  };

  const filteredUnits = useMemo(() => {
    return units.filter(u => 
      u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.code.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [units, searchTerm]);

  const totalEntries = filteredUnits.length;
  const totalPages = Math.ceil(totalEntries / pageSize) || 1;
  const paginatedUnits = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredUnits.slice(start, start + pageSize);
  }, [filteredUnits, currentPage, pageSize]);

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedIds(paginatedUnits.map(u => u.id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleSelectOne = (id: string) => {
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const isAllSelected = paginatedUnits.length > 0 && paginatedUnits.every(u => selectedIds.includes(u.id));

  return (
    <div className="w-full mx-auto space-y-6 pb-20">
      {/* Top Banner Card */}
      <div className="bg-white p-4 sm:p-5 border-2 sm:border-4 border-black shadow-[6px_6px_0px_#000] flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-2.5">
            <span className="w-3 h-3 bg-amber-400 border border-black inline-block"></span>
            <h2 className="text-lg font-black uppercase text-black tracking-wider">Measurement Unit (UOM)</h2>
            <span className="px-2 py-0.5 bg-amber-100 border border-black text-black text-xs font-black">
              {units.length} UNITS
            </span>
          </div>
          <p className="text-xs font-bold text-slate-600 uppercase mt-1">
            Configure units of measure (Pcs, KG, Liter, Box, Pack) for accurate inventory billing.
          </p>
        </div>

        <button 
          type="button"
          onClick={() => { setEditingUnit(null); setIsModalOpen(true); }}
          className="flex items-center gap-2 px-4 py-2 bg-emerald-400 hover:bg-emerald-300 text-black border-2 border-black text-xs font-black uppercase shadow-[2px_2px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>Add New</span>
        </button>
      </div>

      {/* Control Bar */}
      <div className="bg-white p-4 border-2 sm:border-4 border-black shadow-[6px_6px_0px_#000] flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
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
            placeholder="Search units..." 
            value={searchTerm}
            onChange={e => { setSearchTerm(e.target.value); setCurrentPage(1); }}
            className="w-full text-xs font-bold text-black bg-white pl-9 pr-3 py-2 border-2 border-black focus:outline-none focus:bg-amber-50 placeholder-slate-400"
          />
        </div>
      </div>

      {/* Table */}
      {isLoading ? (
        <div className="py-20 flex flex-col items-center justify-center gap-3 bg-white border-2 sm:border-4 border-black shadow-[6px_6px_0px_#000]">
          <Loader2 className="w-8 h-8 text-black animate-spin" />
          <p className="text-xs text-black font-black uppercase tracking-wider">Loading measurement units...</p>
        </div>
      ) : paginatedUnits.length === 0 ? (
        <div className="bg-white border-2 sm:border-4 border-black p-12 flex flex-col items-center justify-center text-center shadow-[6px_6px_0px_#000]">
          <div className="w-16 h-16 bg-amber-300 border-2 border-black shadow-[3px_3px_0px_#000] flex items-center justify-center mb-4">
            <Scale className="w-8 h-8 text-black stroke-[2]" />
          </div>
          <h3 className="text-base font-black uppercase tracking-wider text-black mb-1">No Units Found</h3>
          <p className="text-xs font-bold text-slate-600 max-w-md uppercase mb-5">
            {searchTerm ? 'No units matched your search.' : 'Create standard units of measurement for your catalog.'}
          </p>
          <button 
            onClick={() => { setEditingUnit(null); setIsModalOpen(true); }}
            className="flex items-center gap-2 px-4 py-2.5 bg-emerald-400 hover:bg-emerald-300 text-black border-2 border-black text-xs font-black uppercase shadow-[2px_2px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4 stroke-[3]" /> Add First Unit
          </button>
        </div>
      ) : (
        <div className="bg-white border-2 sm:border-4 border-black shadow-[6px_6px_0px_#000] overflow-hidden">
          <div className="overflow-x-auto custom-scrollbar">
            <table className="w-full text-left border-collapse min-w-[550px]">
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
                  <th className="px-4 py-3 text-[11px] font-black uppercase tracking-wider">Unit Name</th>
                  <th className="px-4 py-3 text-[11px] font-black uppercase tracking-wider">Short Code</th>
                  <th className="px-4 py-3 text-[11px] font-black uppercase tracking-wider text-center">Status</th>
                  <th className="px-4 py-3 text-[11px] font-black uppercase tracking-wider text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y-2 divide-black/10">
                {paginatedUnits.map((u) => {
                  const isChecked = selectedIds.includes(u.id);

                  return (
                    <tr key={u.id} className="hover:bg-amber-50/60 transition-colors">
                      <td className="px-3 py-3 text-center">
                        <input 
                          type="checkbox" 
                          checked={isChecked}
                          onChange={() => handleSelectOne(u.id)}
                          className="cursor-pointer accent-amber-400 w-4 h-4"
                        />
                      </td>

                      <td className="px-4 py-3">
                        <p className="text-xs font-black text-black">{u.name}</p>
                      </td>

                      <td className="px-4 py-3">
                        <span className="px-2 py-0.5 bg-amber-100 border border-black text-black text-xs font-black uppercase">
                          {u.code}
                        </span>
                      </td>

                      {/* Status Toggle */}
                      <td className="px-4 py-3 text-center">
                        <button
                          type="button"
                          onClick={() => handleToggleStatus(u)}
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-[10px] font-black uppercase border-2 border-black shadow-[2px_2px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 transition-all cursor-pointer ${
                            u.status === 'ACTIVE' ? 'bg-emerald-300 text-black' : 'bg-slate-200 text-slate-600'
                          }`}
                        >
                          {u.status === 'ACTIVE' ? (
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

                      {/* Actions */}
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            type="button"
                            onClick={() => { setEditingUnit(u); setIsModalOpen(true); }}
                            className="p-1.5 bg-amber-300 hover:bg-amber-400 text-black border-2 border-black transition-all cursor-pointer shadow-[2px_2px_0px_#000] active:translate-x-0.5 active:translate-y-0.5"
                            title="Edit Unit"
                          >
                            <Edit2 className="w-3.5 h-3.5 stroke-[2.5]" />
                          </button>
                          <button
                            type="button"
                            onClick={() => setDeletingUnit(u)}
                            className="p-1.5 bg-red-500 hover:bg-red-600 text-white border-2 border-black transition-all cursor-pointer shadow-[2px_2px_0px_#000] active:translate-x-0.5 active:translate-y-0.5"
                            title="Delete Unit"
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

          {/* Pagination */}
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

      {/* Add / Edit Unit Modal */}
      <UnitModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSave}
        initialData={editingUnit}
      />

      {/* Single Delete Confirm */}
      <DeleteConfirmModal
        isOpen={!!deletingUnit}
        title="Delete Measurement Unit"
        itemName={deletingUnit?.name || 'this unit'}
        onCancel={() => setDeletingUnit(null)}
        onConfirm={handleConfirmDelete}
      />

      {/* Bulk Delete Confirm */}
      <DeleteConfirmModal
        isOpen={isBulkDeleting}
        title="Delete Selected Units"
        itemName={`${selectedIds.length} selected units`}
        onCancel={() => setIsBulkDeleting(false)}
        onConfirm={handleConfirmBulkDelete}
      />
    </div>
  );
};
