"use client";

import React, { useState, useEffect } from "react";
import { 
  Edit, 
  Trash2, 
  Plus, 
  ArrowLeft, 
  Save, 
  Users, 
  Building2, 
  Phone, 
  Mail, 
  MapPin, 
  Hash, 
  CreditCard,
  Search
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { DeleteConfirmModal } from "@/components/ui/DeleteConfirmModal";
import { PurchaseVendor } from "@/types/purchase";
import { 
  getPurchaseVendors, 
  addPurchaseVendor, 
  updatePurchaseVendor, 
  deletePurchaseVendor 
} from "@/lib/purchaseStorage";

interface Props {
  showToast: (msg: string, type?: "success" | "error" | "info") => void;
}

export const PurchaseVendorSetupPage: React.FC<Props> = ({ showToast }) => {
  const { user, userProfile } = useAuth();
  const currentTenantId = userProfile?.companyId || user?.uid || "";

  const [vendors, setVendors] = useState<PurchaseVendor[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [showAddForm, setShowAddForm] = useState<boolean>(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");

  const [deleteModalState, setDeleteModalState] = useState<{
    isOpen: boolean;
    targetId?: string;
    targetName?: string;
  }>({
    isOpen: false,
  });

  const [formData, setFormData] = useState<{
    code: string;
    name: string;
    contactPerson: string;
    email: string;
    phone: string;
    address: string;
    account: string;
    status: "ACTIVE" | "INACTIVE";
  }>({
    code: "",
    name: "",
    contactPerson: "",
    email: "",
    phone: "",
    address: "",
    account: "",
    status: "ACTIVE",
  });

  const loadVendors = async () => {
    if (!user) return;
    setIsLoading(true);
    try {
      const data = await getPurchaseVendors(user.uid, userProfile?.companyId);
      setVendors(data);
    } catch (err) {
      console.error("Failed to load vendors:", err);
      showToast("Failed to load vendors", "error");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      loadVendors();
    }
  }, [user, userProfile?.companyId]);

  const generateNextVendorCode = (): string => {
    const nextNum = 300000000030 + vendors.length + 1;
    return String(nextNum);
  };

  const handleOpenAdd = () => {
    setEditingId(null);
    setFormData({
      code: generateNextVendorCode(),
      name: "",
      contactPerson: "",
      email: "",
      phone: "",
      address: "",
      account: "",
      status: "ACTIVE",
    });
    setShowAddForm(true);
  };

  const handleOpenEdit = (v: PurchaseVendor) => {
    setEditingId(v.id);
    setFormData({
      code: v.code || "",
      name: v.name || "",
      contactPerson: v.contactPerson || "",
      email: v.email || "",
      phone: v.phone || "",
      address: v.address || "",
      account: v.account || v.name || "",
      status: (v.status as any) === false ? "INACTIVE" : "ACTIVE",
    });
    setShowAddForm(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.code.trim() || !formData.name.trim()) {
      showToast("Vendor code and name are required", "error");
      return;
    }

    setIsSaving(true);
    try {
      if (editingId) {
        await updatePurchaseVendor(editingId, {
          code: formData.code.trim(),
          name: formData.name.trim(),
          contactPerson: formData.contactPerson.trim(),
          email: formData.email.trim(),
          phone: formData.phone.trim(),
          address: formData.address.trim(),
          account: formData.account.trim() || formData.name.trim(),
          status: formData.status,
        });
        showToast("Vendor updated successfully", "success");
      } else {
        await addPurchaseVendor({
          userId: user?.uid || "",
          companyId: userProfile?.companyId || user?.uid || "",
          code: formData.code.trim(),
          name: formData.name.trim(),
          contactPerson: formData.contactPerson.trim(),
          email: formData.email.trim(),
          phone: formData.phone.trim(),
          address: formData.address.trim(),
          account: formData.account.trim() || formData.name.trim(),
          status: formData.status,
        });
        showToast("Vendor added successfully", "success");
      }
      setShowAddForm(false);
      setEditingId(null);
      await loadVendors();
    } catch (err) {
      console.error("Save vendor error:", err);
      showToast("Failed to save vendor", "error");
    } finally {
      setIsSaving(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!deleteModalState.targetId) return;
    try {
      await deletePurchaseVendor(deleteModalState.targetId);
      showToast("Vendor deleted", "success");
      setDeleteModalState({ isOpen: false });
      await loadVendors();
    } catch (err) {
      console.error("Delete vendor error:", err);
      showToast("Failed to delete vendor", "error");
    }
  };

  const filteredVendors = vendors.filter((v) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      v.name?.toLowerCase().includes(q) ||
      v.code?.toLowerCase().includes(q) ||
      v.address?.toLowerCase().includes(q) ||
      v.phone?.toLowerCase().includes(q) ||
      v.email?.toLowerCase().includes(q)
    );
  });

  if (showAddForm) {
    return (
      <div className="w-full pb-20">
        <div className="bg-white border-2 sm:border-4 border-black shadow-[6px_6px_0px_#000]">
          {/* Header */}
          <div className="flex justify-between items-center p-4 border-b-2 sm:border-b-4 border-black bg-slate-900 text-white">
            <h2 className="font-display font-black text-sm sm:text-base uppercase tracking-tight flex items-center gap-2">
              <Users className="w-5 h-5 text-amber-400" />
              {editingId ? "EDIT VENDOR PROFILE" : "ADD NEW VENDOR"}
            </h2>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="px-4 py-2 bg-white hover:bg-slate-100 text-black text-xs font-display font-black uppercase border-2 border-black shadow-[2px_2px_0px_#fff] flex items-center gap-1 cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4 stroke-[2.5]" /> GO BACK
              </button>
            </div>
          </div>

          {/* Form */}
          <div className="p-4 sm:p-6 bg-white">
            <form onSubmit={handleSave} className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
              <div>
                <label className="block text-xs font-display font-black uppercase text-black mb-1.5">
                  Vendor Code <span className="text-red-600">*</span>
                </label>
                <input
                  type="text"
                  value={formData.code}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                  className="w-full bg-white border-2 border-black px-3 py-2.5 text-xs font-mono font-bold text-black shadow-[2px_2px_0px_#000] outline-none"
                  placeholder="300000000030"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-display font-black uppercase text-black mb-1.5">
                  Vendor Name <span className="text-red-600">*</span>
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-white border-2 border-black px-3 py-2.5 text-xs font-bold text-black shadow-[2px_2px_0px_#000] outline-none"
                  placeholder="A.K TRADING CORPORATION"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-display font-black uppercase text-black mb-1.5">
                  Contact Person
                </label>
                <input
                  type="text"
                  value={formData.contactPerson}
                  onChange={(e) => setFormData({ ...formData, contactPerson: e.target.value })}
                  className="w-full bg-white border-2 border-black px-3 py-2.5 text-xs font-bold text-black shadow-[2px_2px_0px_#000] outline-none"
                  placeholder="Manager / Sales Executive"
                />
              </div>

              <div>
                <label className="block text-xs font-display font-black uppercase text-black mb-1.5">
                  Contact Email
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full bg-white border-2 border-black px-3 py-2.5 text-xs font-bold text-black shadow-[2px_2px_0px_#000] outline-none"
                  placeholder="vendor@company.com"
                />
              </div>

              <div>
                <label className="block text-xs font-display font-black uppercase text-black mb-1.5">
                  Contact Number
                </label>
                <input
                  type="text"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full bg-white border-2 border-black px-3 py-2.5 text-xs font-bold text-black shadow-[2px_2px_0px_#000] outline-none"
                  placeholder="017XXXXXXXX"
                />
              </div>

              <div>
                <label className="block text-xs font-display font-black uppercase text-black mb-1.5">
                  Account Name
                </label>
                <input
                  type="text"
                  value={formData.account}
                  onChange={(e) => setFormData({ ...formData, account: e.target.value })}
                  className="w-full bg-white border-2 border-black px-3 py-2.5 text-xs font-bold text-black shadow-[2px_2px_0px_#000] outline-none"
                  placeholder="A.K Trading Corp Ltd."
                />
              </div>

              <div className="sm:col-span-2 md:col-span-3">
                <label className="block text-xs font-display font-black uppercase text-black mb-1.5">
                  Address
                </label>
                <input
                  type="text"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="w-full bg-white border-2 border-black px-3 py-2.5 text-xs font-bold text-black shadow-[2px_2px_0px_#000] outline-none"
                  placeholder="Street address, Industrial Area, City"
                />
              </div>

              <div className="sm:col-span-2 md:col-span-3 flex justify-end gap-3 pt-4 border-t-2 border-black">
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="px-5 py-2.5 bg-white text-black font-display font-black text-xs uppercase border-2 border-black shadow-[2px_2px_0px_#000] cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-7 py-2.5 bg-cyan-400 hover:bg-cyan-300 text-black font-display font-black text-xs uppercase tracking-wider border-2 border-black shadow-[3px_3px_0px_#000] flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                >
                  <Save className="w-4 h-4 stroke-[2.5]" /> {isSaving ? "SAVING..." : "SAVE VENDOR"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full pb-20">
      <div className="bg-white border-2 sm:border-4 border-black shadow-[6px_6px_0px_#000]">
        {/* Header Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 p-4 sm:p-5 border-b-2 sm:border-b-4 border-black bg-white">
          <div className="flex items-center gap-2.5">
            <Users className="w-6 h-6 text-black" />
            <h2 className="text-black font-display font-black text-base sm:text-lg uppercase tracking-tight">
              VENDOR SETUP &amp; SUPPLIERS
            </h2>
          </div>
          <button
            onClick={handleOpenAdd}
            className="px-4 sm:px-5 py-2 bg-cyan-400 hover:bg-cyan-300 text-black font-display font-black text-xs uppercase tracking-wider border-2 border-black shadow-[3px_3px_0px_#000] flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4 stroke-[3]" /> ADD NEW VENDOR
          </button>
        </div>

        {/* Search */}
        <div className="p-4 sm:p-6 space-y-4">
          <div className="flex justify-end">
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search vendor..."
                className="bg-white border-2 border-black px-3 py-1.5 text-xs font-bold text-black shadow-[2px_2px_0px_#000] outline-none w-48 sm:w-64"
              />
            </div>
          </div>

          {/* Vendors Table */}
          <div className="border-2 sm:border-4 border-black shadow-[4px_4px_0px_#000] overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead className="bg-slate-900 text-white font-display font-black uppercase tracking-wider border-b-2 sm:border-b-4 border-black">
                  <tr>
                    <th className="px-3 sm:px-4 py-3.5 border-r-2 border-black/40">Code</th>
                    <th className="px-3 sm:px-4 py-3.5 border-r-2 border-black/40">Vendor Name</th>
                    <th className="px-3 sm:px-4 py-3.5 border-r-2 border-black/40">Contact Person</th>
                    <th className="px-3 sm:px-4 py-3.5 border-r-2 border-black/40">Phone</th>
                    <th className="px-3 sm:px-4 py-3.5 border-r-2 border-black/40">Address</th>
                    <th className="px-3 sm:px-4 py-3.5 border-r-2 border-black/40">Status</th>
                    <th className="px-3 sm:px-4 py-3.5 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y-2 divide-black bg-white">
                  {isLoading ? (
                    <tr>
                      <td colSpan={7} className="px-4 py-10 text-center text-xs font-black text-slate-500 uppercase">
                        Loading vendors...
                      </td>
                    </tr>
                  ) : filteredVendors.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="px-4 py-10 text-center text-xs font-black text-slate-500 uppercase bg-amber-50/50">
                        No vendor records found
                      </td>
                    </tr>
                  ) : (
                    filteredVendors.map((v) => (
                      <tr key={v.id} className="hover:bg-amber-50/80 transition-colors">
                        <td className="px-3 sm:px-4 py-3 font-mono font-bold text-black border-r-2 border-black whitespace-nowrap">
                          {v.code}
                        </td>
                        <td className="px-3 sm:px-4 py-3 font-black text-black border-r-2 border-black">
                          {v.name}
                        </td>
                        <td className="px-3 sm:px-4 py-3 font-bold text-slate-700 border-r-2 border-black">
                          {v.contactPerson || "-"}
                        </td>
                        <td className="px-3 sm:px-4 py-3 font-mono font-bold text-slate-800 border-r-2 border-black whitespace-nowrap">
                          {v.phone || "-"}
                        </td>
                        <td className="px-3 sm:px-4 py-3 font-bold text-slate-700 border-r-2 border-black">
                          {v.address || "-"}
                        </td>
                        <td className="px-3 sm:px-4 py-3 border-r-2 border-black">
                          <span className="px-2 py-0.5 bg-emerald-300 text-black text-[10px] font-black uppercase border border-black shadow-[1px_1px_0px_#000]">
                            ACTIVE
                          </span>
                        </td>
                        <td className="px-3 sm:px-4 py-2.5 text-center whitespace-nowrap">
                          <div className="flex items-center justify-center gap-1.5">
                            <button
                              onClick={() => handleOpenEdit(v)}
                              className="p-1.5 bg-amber-400 hover:bg-amber-300 text-black border border-black shadow-[1px_1px_0px_#000] transition-transform hover:scale-105 cursor-pointer"
                              title="Edit Vendor"
                            >
                              <Edit className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => {
                                setDeleteModalState({
                                  isOpen: true,
                                  targetId: v.id,
                                  targetName: v.name,
                                });
                              }}
                              className="p-1.5 bg-rose-500 hover:bg-rose-600 text-white border border-black shadow-[1px_1px_0px_#000] transition-transform hover:scale-105 cursor-pointer"
                              title="Delete Vendor"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      <DeleteConfirmModal
        isOpen={deleteModalState.isOpen}
        title="Delete Vendor"
        itemName={deleteModalState.targetName || "this vendor"}
        onCancel={() => setDeleteModalState({ isOpen: false })}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
};
