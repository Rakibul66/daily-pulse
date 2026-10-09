"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useAuth } from "@/context/AuthContext";
import { DeleteConfirmModal } from "@/components/ui/DeleteConfirmModal";
import { 
  PurchaseReturn, 
  PurchaseReturnItem, 
  PurchaseVendor 
} from "@/types/purchase";
import { Product } from "@/types/product";
import { 
  getPurchaseReturns, 
  addPurchaseReturn, 
  updatePurchaseReturn, 
  deletePurchaseReturn, 
  deletePurchaseReturnsBulk,
  getPurchaseVendors,
  DEFAULT_STORES,
  formatDateDDMMYYYY
} from "@/lib/purchaseStorage";
import { getProducts } from "@/lib/productStorage";
import { PurchaseReturnForm } from "../purchase/return/PurchaseReturnForm";
import { PurchaseReturnTable } from "../purchase/return/PurchaseReturnTable";
import { PurchaseReturnVoucherModal } from "../purchase/return/PurchaseReturnVoucherModal";

interface Props {
  showToast: (msg: string, type?: "success" | "error" | "info") => void;
}

export const PurchaseReturnPage: React.FC<Props> = ({ showToast }) => {
  const { user, userProfile } = useAuth();

  // View Mode: 'LIST' or 'FORM'
  const [viewMode, setViewMode] = useState<"LIST" | "FORM">("LIST");
  const [editingId, setEditingId] = useState<string | null>(null);

  // Data states
  const [returns, setReturns] = useState<PurchaseReturn[]>([]);
  const [vendors, setVendors] = useState<PurchaseVendor[]>([]);
  const [productsCatalog, setProductsCatalog] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSaving, setIsSaving] = useState<boolean>(false);

  // Table filters & controls
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [remarkFilter, setRemarkFilter] = useState<string>("All");
  const [pageSize, setPageSize] = useState<number>(10);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // Modals
  const [deleteModalState, setDeleteModalState] = useState<{
    isOpen: boolean;
    mode: "single" | "bulk";
    targetId?: string;
    targetName?: string;
  }>({
    isOpen: false,
    mode: "single",
  });
  const [printReturn, setPrintReturn] = useState<PurchaseReturn | null>(null);

  // Form State
  const [formData, setFormData] = useState<{
    company: string;
    vendor: string;
    vendorId: string;
    store: string;
    returnDate: string;
    staff: string;
    remarks: string;
    amount: number;
    items: PurchaseReturnItem[];
  }>({
    company: "M/S Buyzid Rubber",
    vendor: "Square Food and Beverage",
    vendorId: "",
    store: DEFAULT_STORES[0] || "Shankhari Bazar",
    returnDate: new Date().toISOString().split("T")[0],
    staff: "Arnob Sur",
    remarks: "Date Over",
    amount: 0,
    items: [],
  });

  // Product Selector for form itemization
  const [selectedProductCode, setSelectedProductCode] = useState<string>("");
  const [returnQty, setReturnQty] = useState<number>(1);

  // Load Data
  const loadAllData = async () => {
    if (!user) return;
    setIsLoading(true);
    try {
      const [returnsData, vendorsData, catalogData] = await Promise.all([
        getPurchaseReturns(user.uid, userProfile?.companyId),
        getPurchaseVendors(user.uid, userProfile?.companyId),
        getProducts(user.uid, userProfile?.companyId),
      ]);
      setReturns(returnsData);
      setVendors(vendorsData);
      setProductsCatalog(catalogData);
    } catch (err) {
      console.error("Error loading purchase returns:", err);
      showToast("Failed to load purchase returns data", "error");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      loadAllData();
    }
  }, [user, userProfile?.companyId]);

  // Open Add Form
  const handleOpenAddForm = () => {
    setEditingId(null);
    setFormData({
      company: userProfile?.displayName ? `${userProfile.displayName} Traders` : "M/S Buyzid Rubber",
      vendor: vendors.length > 0 ? vendors[0].name : "Square Food and Beverage",
      vendorId: vendors.length > 0 ? vendors[0].id : "",
      store: DEFAULT_STORES[0] || "Shankhari Bazar",
      returnDate: new Date().toISOString().split("T")[0],
      staff: userProfile?.displayName || user?.displayName || "Admin",
      remarks: "Date Over",
      amount: 0,
      items: [],
    });
    setSelectedProductCode("");
    setReturnQty(1);
    setViewMode("FORM");
  };

  // Open Edit Form
  const handleOpenEditForm = (ret: PurchaseReturn) => {
    setEditingId(ret.id);
    let rDate = ret.returnDate || "";
    if (/^\d{2}-\d{2}-\d{4}$/.test(rDate)) {
      const parts = rDate.split("-");
      rDate = `${parts[2]}-${parts[1]}-${parts[0]}`;
    }

    setFormData({
      company: ret.company || "M/S Buyzid Rubber",
      vendor: ret.vendor || "",
      vendorId: ret.vendorId || "",
      store: ret.store || DEFAULT_STORES[0] || "Shankhari Bazar",
      returnDate: rDate || new Date().toISOString().split("T")[0],
      staff: ret.staff || "Arnob Sur",
      remarks: ret.remarks || "Date Over",
      amount: Number(ret.amount) || 0,
      items: ret.items && ret.items.length > 0 ? [...ret.items] : [],
    });
    setSelectedProductCode("");
    setReturnQty(1);
    setViewMode("FORM");
  };

  // Add Product to Item List
  const handleAddProductToItems = () => {
    if (!selectedProductCode) {
      showToast("Please select a product first", "error");
      return;
    }
    const foundProd = productsCatalog.find(
      (p) => (p.code || p.barcode || p.sku || p.id) === selectedProductCode
    );
    if (!foundProd) {
      showToast("Product not found in catalog", "error");
      return;
    }

    const qty = Number(returnQty) > 0 ? Number(returnQty) : 1;
    const rate = Number(foundProd.purchasePrice) || Number(foundProd.cost) || Number(foundProd.retailPrice) || 0;
    const itemAmount = Number((qty * rate).toFixed(2));

    const existingIndex = formData.items.findIndex(
      (i) => i.productId === foundProd.id || i.code === foundProd.code
    );

    let updatedItems: PurchaseReturnItem[];
    if (existingIndex >= 0) {
      updatedItems = [...formData.items];
      const newQty = updatedItems[existingIndex].quantity + qty;
      updatedItems[existingIndex].quantity = newQty;
      updatedItems[existingIndex].amount = Number((newQty * updatedItems[existingIndex].rate).toFixed(2));
    } else {
      const newItem: PurchaseReturnItem = {
        id: `ret-item-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
        productId: foundProd.id,
        productName: foundProd.name,
        code: foundProd.code || foundProd.barcode || foundProd.sku || "N/A",
        rate,
        quantity: qty,
        amount: itemAmount,
      };
      updatedItems = [...formData.items, newItem];
    }

    const newTotalAmount = updatedItems.reduce((sum, item) => sum + (item.amount || 0), 0);
    setFormData((prev) => ({
      ...prev,
      items: updatedItems,
      amount: Number(newTotalAmount.toFixed(2)),
    }));

    showToast(`Added ${foundProd.name} to return`, "success");
    setSelectedProductCode("");
    setReturnQty(1);
  };

  // Modify Item Row Rate or Quantity inline
  const handleItemFieldChange = (id: string, field: "rate" | "quantity", val: number) => {
    const updated = formData.items.map((item) => {
      if (item.id === id) {
        const rate = field === "rate" ? Math.max(0, val) : item.rate;
        const quantity = field === "quantity" ? Math.max(0, val) : item.quantity;
        return {
          ...item,
          rate,
          quantity,
          amount: Number((rate * quantity).toFixed(2)),
        };
      }
      return item;
    });

    const newTotalAmount = updated.reduce((sum, item) => sum + (item.amount || 0), 0);
    setFormData((prev) => ({
      ...prev,
      items: updated,
      amount: Number(newTotalAmount.toFixed(2)),
    }));
  };

  // Remove Item Row
  const handleRemoveItem = (id: string) => {
    const remaining = formData.items.filter((item) => item.id !== id);
    const newTotalAmount = remaining.reduce((sum, item) => sum + (item.amount || 0), 0);
    setFormData((prev) => ({
      ...prev,
      items: remaining,
      amount: Number(newTotalAmount.toFixed(2)),
    }));
  };

  // Save Return Record
  const handleSaveReturn = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!formData.company.trim()) {
      showToast("Company name is required", "error");
      return;
    }
    if (!formData.vendor.trim()) {
      showToast("Vendor is required", "error");
      return;
    }
    if (!formData.amount || Number(formData.amount) <= 0) {
      showToast("Please specify a valid return amount", "error");
      return;
    }

    setIsSaving(true);
    try {
      const recordPayload = {
        userId: user?.uid || "",
        companyId: userProfile?.companyId || user?.uid || "",
        company: formData.company.trim(),
        vendor: formData.vendor.trim(),
        vendorId: formData.vendorId,
        store: formData.store,
        returnDate: formData.returnDate,
        date: formatDateDDMMYYYY(formData.returnDate),
        staff: formData.staff.trim(),
        remarks: formData.remarks,
        amount: Number(formData.amount),
        items: formData.items,
        status: "APPROVED" as const,
      };

      if (editingId) {
        await updatePurchaseReturn(editingId, recordPayload);
        showToast("Purchase return updated successfully", "success");
      } else {
        await addPurchaseReturn(recordPayload);
        showToast("Purchase return created & stock deducted", "success");
      }

      await loadAllData();
      setViewMode("LIST");
      setEditingId(null);
    } catch (err) {
      console.error("Save error:", err);
      showToast("Failed to save purchase return", "error");
    } finally {
      setIsSaving(false);
    }
  };

  // Delete Action
  const handleConfirmDelete = async () => {
    try {
      if (deleteModalState.mode === "single" && deleteModalState.targetId) {
        await deletePurchaseReturn(deleteModalState.targetId);
        showToast("Purchase return deleted", "success");
      } else if (deleteModalState.mode === "bulk" && selectedIds.length > 0) {
        await deletePurchaseReturnsBulk(selectedIds);
        showToast(`Deleted ${selectedIds.length} return records`, "success");
        setSelectedIds([]);
      }
      setDeleteModalState({ isOpen: false, mode: "single" });
      await loadAllData();
    } catch (err) {
      console.error("Delete error:", err);
      showToast("Failed to delete record", "error");
    }
  };

  // Filtered & Paginated records
  const filteredReturns = useMemo(() => {
    return returns.filter((r) => {
      if (remarkFilter !== "All" && r.remarks !== remarkFilter) {
        return false;
      }
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase();
      return (
        r.company?.toLowerCase().includes(q) ||
        r.vendor?.toLowerCase().includes(q) ||
        r.store?.toLowerCase().includes(q) ||
        r.staff?.toLowerCase().includes(q) ||
        r.remarks?.toLowerCase().includes(q) ||
        r.date?.toLowerCase().includes(q) ||
        r.amount?.toString().includes(q)
      );
    });
  }, [returns, remarkFilter, searchQuery]);

  const totalPages = Math.ceil(filteredReturns.length / pageSize) || 1;
  const paginatedReturns = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredReturns.slice(start, start + pageSize);
  }, [filteredReturns, currentPage, pageSize]);

  // Checkbox handlers
  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedIds(paginatedReturns.map((r) => r.id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleSelectRow = (id: string, checked: boolean) => {
    if (checked) {
      setSelectedIds((prev) => [...prev, id]);
    } else {
      setSelectedIds((prev) => prev.filter((i) => i !== id));
    }
  };

  return (
    <>
      {viewMode === "FORM" ? (
        <PurchaseReturnForm
          editingId={editingId}
          formData={formData}
          setFormData={setFormData}
          vendors={vendors}
          productsCatalog={productsCatalog}
          selectedProductCode={selectedProductCode}
          setSelectedProductCode={setSelectedProductCode}
          returnQty={returnQty}
          setReturnQty={setReturnQty}
          onAddProductToItems={handleAddProductToItems}
          onItemFieldChange={handleItemFieldChange}
          onRemoveItem={handleRemoveItem}
          isSaving={isSaving}
          onSave={handleSaveReturn}
          onCancel={() => setViewMode("LIST")}
        />
      ) : (
        <PurchaseReturnTable
          remarkFilter={remarkFilter}
          setRemarkFilter={setRemarkFilter}
          onOpenAddForm={handleOpenAddForm}
          pageSize={pageSize}
          setPageSize={setPageSize}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          totalPages={totalPages}
          filteredReturns={filteredReturns}
          paginatedReturns={paginatedReturns}
          selectedIds={selectedIds}
          onSelectAll={handleSelectAll}
          onSelectRow={handleSelectRow}
          onOpenEditForm={handleOpenEditForm}
          onPrintReturn={(r) => setPrintReturn(r)}
          onOpenDeleteModal={(id, name) => {
            setDeleteModalState({
              isOpen: true,
              mode: "single",
              targetId: id,
              targetName: name,
            });
          }}
          onOpenBulkDeleteModal={() => {
            if (selectedIds.length === 0) {
              showToast("Please select at least one record to delete", "info");
              return;
            }
            setDeleteModalState({
              isOpen: true,
              mode: "bulk",
              targetName: `${selectedIds.length} return record(s)`,
            });
          }}
          isLoading={isLoading}
        />
      )}

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={deleteModalState.isOpen}
        title={deleteModalState.mode === "bulk" ? "Delete Selected Returns" : "Delete Purchase Return"}
        itemName={
          deleteModalState.mode === "bulk"
            ? `${selectedIds.length} selected return records`
            : deleteModalState.targetName || "this purchase return"
        }
        onCancel={() => setDeleteModalState({ isOpen: false, mode: "single" })}
        onConfirm={handleConfirmDelete}
      />

      {/* Purchase Return Voucher Modal */}
      <PurchaseReturnVoucherModal
        printReturn={printReturn}
        onClose={() => setPrintReturn(null)}
      />
    </>
  );
};
