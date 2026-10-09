"use client";

import React from "react";
import { 
  Truck, 
  Plus, 
  Search, 
  Phone, 
  Mail, 
  MapPin, 
  Edit2, 
  Trash2, 
  Loader2, 
  ChevronLeft, 
  ChevronRight 
} from "lucide-react";
import { DeliveryMan } from "@/types/product";

interface DeliveryManTableProps {
  deliveryMen: DeliveryMan[];
  paginatedItems: DeliveryMan[];
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
  totalFilteredCount: number;
  selectedIds: string[];
  allSelectedOnPage: boolean;
  onToggleSelectAll: () => void;
  onToggleSelectOne: (id: string) => void;
  onToggleStatus: (item: DeliveryMan) => void;
  onAddNew: () => void;
  onEdit: (item: DeliveryMan) => void;
  onDeleteSingle: (item: DeliveryMan) => void;
  onDeleteBulk: () => void;
}

export const DeliveryManTable: React.FC<DeliveryManTableProps> = ({
  paginatedItems,
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
  totalFilteredCount,
  selectedIds,
  allSelectedOnPage,
  onToggleSelectAll,
  onToggleSelectOne,
  onToggleStatus,
  onAddNew,
  onEdit,
  onDeleteSingle,
  onDeleteBulk
}) => {
  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto space-y-6">
      <div className="bg-white border-2 sm:border-4 border-black shadow-[6px_6px_0px_#000]">
        {/* Table Header Bar */}
        <div className="p-4 sm:p-5 border-b-2 sm:border-b-4 border-black flex flex-wrap items-center justify-between gap-4 bg-amber-300">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 bg-white border-2 border-black shadow-[2px_2px_0px_#000]">
              <Truck className="w-5 h-5 text-black stroke-[2.5]" />
            </div>
            <div>
              <h1 className="text-base sm:text-lg font-black uppercase tracking-wider text-black">
                DELIVERY MAN SETUP
              </h1>
              <p className="text-[10px] font-bold text-slate-800 uppercase">
                Manage logistics staff, couriers &amp; parcel dispatchers
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5">
              <select
                value={statusFilter}
                onChange={e => {
                  setStatusFilter(e.target.value as any);
                  setCurrentPage(1);
                }}
                className="px-3 py-2 bg-white border-2 border-black text-xs font-black uppercase text-black cursor-pointer shadow-[2px_2px_0px_#000]"
              >
                <option value="ALL">All Status</option>
                <option value="ACTIVE">Active</option>
                <option value="INACTIVE">Inactive</option>
              </select>
            </div>

            <button
              onClick={onAddNew}
              className="flex items-center gap-1.5 px-4 py-2 bg-emerald-400 hover:bg-emerald-300 text-black border-2 border-black text-xs font-black uppercase shadow-[2px_2px_0px_#000] cursor-pointer active:translate-x-0.5 active:translate-y-0.5"
            >
              <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
              <span>ADD NEW</span>
            </button>
          </div>
        </div>

        {/* Action / Filter Bar */}
        <div className="p-4 border-b-2 border-black bg-slate-50 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs font-black uppercase text-black">
            <span>Show</span>
            <select
              value={pageSize}
              onChange={e => {
                setPageSize(Number(e.target.value));
                setCurrentPage(1);
              }}
              className="px-2 py-1 bg-white border-2 border-black text-xs font-black cursor-pointer"
            >
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
            </select>
            <span>entries</span>
          </div>

          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              type="text"
              value={searchTerm}
              onChange={e => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              placeholder="Search by name, store or phone..."
              className="w-full pl-9 pr-3 py-1.5 bg-white border-2 border-black text-xs font-bold text-black focus:outline-none focus:bg-amber-50 focus:shadow-[2px_2px_0px_#000]"
            />
          </div>
        </div>

        {/* Table View */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-100 border-b-2 border-black text-[10px] font-black uppercase text-black">
                <th className="p-3 w-10 text-center border-r-2 border-black">
                  <input
                    type="checkbox"
                    checked={allSelectedOnPage}
                    onChange={onToggleSelectAll}
                    className="w-3.5 h-3.5 accent-black cursor-pointer"
                  />
                </th>
                <th className="p-3 border-r-2 border-black">Name</th>
                <th className="p-3 border-r-2 border-black">Store</th>
                <th className="p-3 border-r-2 border-black">Contact</th>
                <th className="p-3 border-r-2 border-black">Email</th>
                <th className="p-3 border-r-2 border-black">Address</th>
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
                      <span className="font-black uppercase tracking-wider text-xs">Loading Delivery Personnel...</span>
                    </div>
                  </td>
                </tr>
              ) : paginatedItems.length === 0 ? (
                <tr>
                  <td colSpan={8} className="p-8 text-center text-slate-500 font-bold uppercase">
                    No delivery personnel found.
                  </td>
                </tr>
              ) : (
                paginatedItems.map((item) => {
                  const isChecked = selectedIds.includes(item.id);
                  return (
                    <tr
                      key={item.id}
                      className={`hover:bg-amber-50/60 transition-colors ${isChecked ? 'bg-amber-100/50' : ''}`}
                    >
                      <td className="p-3 text-center border-r-2 border-black">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => onToggleSelectOne(item.id)}
                          className="w-3.5 h-3.5 accent-black cursor-pointer"
                        />
                      </td>

                      <td className="p-3 border-r-2 border-black">
                        <div className="flex items-center gap-2">
                          <span className="font-black text-black">{item.name}</span>
                          <span className="px-1.5 py-0.2 bg-slate-200 border border-black text-[9px] font-mono font-black">
                            #{item.code}
                          </span>
                        </div>
                      </td>

                      <td className="p-3 border-r-2 border-black">
                        <span className="px-2 py-0.5 bg-amber-100 border border-black text-[11px] font-black uppercase">
                          {item.store}
                        </span>
                      </td>

                      <td className="p-3 border-r-2 border-black font-mono">
                        {item.phone ? (
                          <div className="flex items-center gap-1 text-slate-800">
                            <Phone className="w-3 h-3 text-slate-500" />
                            <span>{item.phone}</span>
                          </div>
                        ) : (
                          <span className="text-slate-400">—</span>
                        )}
                      </td>

                      <td className="p-3 border-r-2 border-black">
                        {item.email ? (
                          <div className="flex items-center gap-1 text-slate-700">
                            <Mail className="w-3 h-3 text-slate-500" />
                            <span className="truncate max-w-[150px]">{item.email}</span>
                          </div>
                        ) : (
                          <span className="text-slate-400">—</span>
                        )}
                      </td>

                      <td className="p-3 border-r-2 border-black">
                        {item.address ? (
                          <div className="flex items-center gap-1 text-slate-700">
                            <MapPin className="w-3 h-3 text-slate-500 shrink-0" />
                            <span className="truncate max-w-[160px]">{item.address}</span>
                          </div>
                        ) : (
                          <span className="text-slate-400">—</span>
                        )}
                      </td>

                      <td className="p-3 text-center border-r-2 border-black">
                        <button
                          type="button"
                          onClick={() => onToggleStatus(item)}
                          className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-black transition-colors duration-200 ease-in-out focus:outline-none ${
                            item.status === 'ACTIVE' ? 'bg-cyan-400' : 'bg-slate-300'
                          }`}
                          title={`Click to ${item.status === 'ACTIVE' ? 'Deactivate' : 'Activate'}`}
                        >
                          <span
                            className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white border border-black shadow transition duration-200 ease-in-out mt-0.5 ${
                              item.status === 'ACTIVE' ? 'translate-x-5' : 'translate-x-1'
                            }`}
                          />
                        </button>
                      </td>

                      <td className="p-3 text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          <button
                            onClick={() => onEdit(item)}
                            className="p-1.5 bg-amber-400 hover:bg-amber-300 text-black border-2 border-black shadow-[1px_1px_0px_#000] cursor-pointer"
                            title="Edit Delivery Man"
                          >
                            <Edit2 className="w-3.5 h-3.5 stroke-[2.5]" />
                          </button>
                          <button
                            onClick={() => onDeleteSingle(item)}
                            className="p-1.5 bg-rose-500 hover:bg-rose-400 text-white border-2 border-black shadow-[1px_1px_0px_#000] cursor-pointer"
                            title="Delete Delivery Man"
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

        {/* Bulk Action Bar at bottom */}
        {selectedIds.length > 0 && (
          <div className="p-3 bg-amber-100 border-t-2 border-black flex items-center justify-between">
            <span className="text-xs font-black uppercase text-black">
              {selectedIds.length} personnel selected
            </span>
            <button
              onClick={onDeleteBulk}
              className="px-4 py-1.5 bg-rose-500 hover:bg-rose-600 text-white border-2 border-black text-xs font-black uppercase shadow-[2px_2px_0px_#000] cursor-pointer"
            >
              Delete ({selectedIds.length})
            </button>
          </div>
        )}

        {/* Pagination Footer */}
        <div className="p-4 border-t-2 border-black bg-slate-50 flex flex-wrap items-center justify-between gap-3">
          <p className="text-[11px] font-bold text-slate-700">
            Showing <span className="font-black">{paginatedItems.length > 0 ? (currentPage - 1) * pageSize + 1 : 0}</span> to{' '}
            <span className="font-black">{Math.min(currentPage * pageSize, totalFilteredCount)}</span> of{' '}
            <span className="font-black">{totalFilteredCount}</span> entries
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
    </div>
  );
};
