"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useAuth } from "@/context/AuthContext";
import { DeleteConfirmModal } from "@/components/ui/DeleteConfirmModal";
import { 
  ProductLift, 
  ProductLiftItem, 
  PurchaseVendor 
} from "@/types/purchase";
import { Product } from "@/types/product";
import { 
  getProductLifts, 
  addProductLift, 
  updateProductLift, 
  deleteProductLift, 
  deleteProductLiftsBulk,
  getPurchaseVendors,
  DEFAULT_STORES,
  formatDateDDMMYYYY
} from "@/lib/purchaseStorage";
import { getProducts } from "@/lib/productStorage";
import { PurchaseProductForm } from "../purchase/PurchaseProductForm";
import { PurchaseProductTable } from "../purchase/PurchaseProductTable";
import { PurchaseVoucherModal } from "../purchase/PurchaseVoucherModal";
import { PurchaseBarcodeModal } from "../purchase/PurchaseBarcodeModal";

interface Props {
  showToast: (msg: string, type?: "success" | "error" | "info") => void;
}

export const PurchaseProductPage: React.FC<Props> = ({ showToast }) => {
  const { user, userProfile } = useAuth();

  // View Mode: 'LIST' or 'FORM'
  const [viewMode, setViewMode] = useState<"LIST" | "FORM">("LIST");
  const [editingId, setEditingId] = useState<string | null>(null);

  // Data states
  const [lifts, setLifts] = useState<ProductLift[]>([]);
  const [vendors, setVendors] = useState<PurchaseVendor[]>([]);
  const [productsCatalog, setProductsCatalog] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSaving, setIsSaving] = useState<boolean>(false);

  // Table filters & controls
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [typeFilter, setTypeFilter] = useState<string>("All");
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
  const [printVoucher, setPrintVoucher] = useState<ProductLift | null>(null);
  const [barcodeModalLift, setBarcodeModalLift] = useState<ProductLift | null>(null);

  // Form State
  const [formData, setFormData] = useState<{
    liftingType: string;
    paymentType: string;
    purchaseNo: string;
    purchaseDate: string;
    vendor: string;
    vendorId: string;
    voucherNo: string;
    store: string;
    items: ProductLiftItem[];
    discountType: "fixed" | "percentage";
    discountValue: number;
  }>({
    liftingType: "By Manual",
    paymentType: "Credit",
    purchaseNo: "",
    purchaseDate: new Date().toISOString().split("T")[0],
    vendor: "",
    vendorId: "",
    voucherNo: "",
    store: DEFAULT_STORES[0] || "Shankhari Bazar",
    items: [],
    discountType: "fixed",
    discountValue: 0,
  });

  // Product Selector in Form
  const [selectedProductCode, setSelectedProductCode] = useState<string>("");
  const [productAddQty, setProductAddQty] = useState<number>(1);

  // Load Data
  const loadAllData = async () => {
    if (!user) return;
    setIsLoading(true);
    try {
      const [liftsData, vendorsData, catalogData] = await Promise.all([
        getProductLifts(user.uid, userProfile?.companyId),
        getPurchaseVendors(user.uid, userProfile?.companyId),
        getProducts(user.uid, userProfile?.companyId),
      ]);
      setLifts(liftsData);
      setVendors(vendorsData);
      setProductsCatalog(catalogData);
    } catch (err) {
      console.error("Error loading purchase data:", err);
      showToast("Failed to load purchase records", "error");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      loadAllData();
    }
  }, [user, userProfile?.companyId]);

  // Generate Next Purchase Number like STL2610000001
  const generateNextPurchaseNo = (): string => {
    const now = new Date();
    const yy = String(now.getFullYear()).slice(-2);
    const mm = String(now.getMonth() + 1).padStart(2, "0");
    const count = lifts.length + 1;
    const serial = String(count).padStart(6, "0");
    return `STL${yy}${mm}${serial}`;
  };

  // Open Add Form
  const handleOpenAddForm = () => {
    setEditingId(null);
    setFormData({
      liftingType: "By Manual",
      paymentType: "Credit",
      purchaseNo: generateNextPurchaseNo(),
      purchaseDate: new Date().toISOString().split("T")[0],
      vendor: vendors.length > 0 ? vendors[0].name : "A.K TRADING CORPORATION",
      vendorId: vendors.length > 0 ? vendors[0].id : "",
      voucherNo: "",
      store: DEFAULT_STORES[0] || "Shankhari Bazar",
      items: [],
      discountType: "fixed",
      discountValue: 0,
    });
    setSelectedProductCode("");
    setProductAddQty(1);
    setViewMode("FORM");
  };

  // Open Edit Form
  const handleOpenEditForm = (lift: ProductLift) => {
    setEditingId(lift.id);
    let pDate = lift.purchaseDate || "";
    if (/^\d{2}-\d{2}-\d{4}$/.test(pDate)) {
      const parts = pDate.split("-");
      pDate = `${parts[2]}-${parts[1]}-${parts[0]}`;
    }

    setFormData({
      liftingType: lift.liftingType || "By Manual",
      paymentType: lift.paymentType || "Credit",
      purchaseNo: lift.purchaseNo || "",
      purchaseDate: pDate || new Date().toISOString().split("T")[0],
      vendor: lift.vendor || "",
      vendorId: lift.vendorId || "",
      voucherNo: lift.voucherNo || "",
      store: lift.store || DEFAULT_STORES[0] || "Shankhari Bazar",
      items: lift.items && lift.items.length > 0 ? [...lift.items] : [
        {
          id: "item-default",
          category: "General",
          productName: "Lifting Item",
          code: lift.purchaseNo,
          rate: lift.costAmount || 0,
          quantity: 1,
          amount: lift.costAmount || 0,
        }
      ],
      discountType: lift.discountType || "fixed",
      discountValue: lift.discountValue || 0,
    });
    setSelectedProductCode("");
    setProductAddQty(1);
    setViewMode("FORM");
  };

  // Add Product to Item Table
  const handleAddProductToItems = () => {
    if (!selectedProductCode) {
      showToast("Please select a product first", "error");
      return;
    }
    let foundProd = productsCatalog.find(
      (p) => (p.code || p.barcode || p.sku || p.id) === selectedProductCode
    );
    if (!foundProd) {
      const fallbackMap: Record<string, { name: string; category: string; rate: number }> = {
        "89012301": { name: "Pure Ghee 1kg Can", category: "Dairy & Bakery", rate: 850 },
        "89012302": { name: "Pasteurized Milk 1L", category: "Dairy & Bakery", rate: 90 },
        "89012303": { name: "Commercial Espresso Machine", category: "Electronic", rate: 25000 },
        "89012304": { name: "Dish Wash Bar Family Pack", category: "Cleaning", rate: 120 },
      };
      const fallback = fallbackMap[selectedProductCode];
      if (fallback) {
        foundProd = {
          id: `demo-${selectedProductCode}`,
          code: selectedProductCode,
          name: fallback.name,
          parentCategory: fallback.category,
          purchasePrice: fallback.rate,
          retailPrice: fallback.rate * 1.2,
        } as any;
      }
    }
    if (!foundProd) {
      showToast("Selected product not found", "error");
      return;
    }

    const qty = Number(productAddQty) > 0 ? Number(productAddQty) : 1;
    const rate = Number(foundProd.purchasePrice) || Number(foundProd.cost) || Number(foundProd.retailPrice) || 0;
    
    const existingIndex = formData.items.findIndex((i) => i.productId === foundProd.id || i.code === foundProd.code);
    if (existingIndex >= 0) {
      const updatedItems = [...formData.items];
      const newQty = updatedItems[existingIndex].quantity + qty;
      updatedItems[existingIndex].quantity = newQty;
      updatedItems[existingIndex].amount = Number((newQty * updatedItems[existingIndex].rate).toFixed(2));
      setFormData(prev => ({ ...prev, items: updatedItems }));
      showToast(`Updated quantity for ${foundProd.name}`, "info");
    } else {
      const newItem: ProductLiftItem = {
        id: `item-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
        productId: foundProd.id,
        category: foundProd.parentCategory || foundProd.category || "General",
        productName: foundProd.name,
        code: foundProd.code || foundProd.barcode || foundProd.sku || "N/A",
        rate,
        quantity: qty,
        amount: Number((qty * rate).toFixed(2)),
      };
      setFormData(prev => ({ ...prev, items: [...prev.items, newItem] }));
      showToast(`Added ${foundProd.name}`, "success");
    }

    setSelectedProductCode("");
    setProductAddQty(1);
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
    setFormData(prev => ({ ...prev, items: updated }));
  };

  // Remove Item Row
  const handleRemoveItem = (id: string) => {
    setFormData(prev => ({
      ...prev,
      items: prev.items.filter((item) => item.id !== id),
    }));
  };

  // Calculations
  const calculatedSubtotal = useMemo(() => {
    return formData.items.reduce((sum, item) => sum + (Number(item.amount) || 0), 0);
  }, [formData.items]);

  const calculatedDiscountAmount = useMemo(() => {
    if (formData.discountType === "percentage") {
      return (calculatedSubtotal * (Number(formData.discountValue) || 0)) / 100;
    }
    return Math.min(calculatedSubtotal, Number(formData.discountValue) || 0);
  }, [calculatedSubtotal, formData.discountType, formData.discountValue]);

  const calculatedNetPayable = useMemo(() => {
    return Math.max(0, calculatedSubtotal - calculatedDiscountAmount);
  }, [calculatedSubtotal, calculatedDiscountAmount]);

  // Save Product Lifting
  const handleSaveLifting = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!formData.purchaseNo.trim()) {
      showToast("Purchase No. is required", "error");
      return;
    }
    if (!formData.vendor.trim()) {
      showToast("Vendor is required", "error");
      return;
    }
    if (formData.items.length === 0) {
      showToast("Please add at least one product item to the lifting", "error");
      return;
    }

    setIsSaving(true);
    try {
      const typeStr = formData.paymentType.toLowerCase().includes("cash") ? "cash" : "credit";
      const recordPayload = {
        userId: user?.uid || "",
        companyId: userProfile?.companyId || user?.uid || "",
        type: typeStr as "credit" | "cash",
        liftingType: formData.liftingType,
        paymentType: formData.paymentType,
        purchaseNo: formData.purchaseNo.trim(),
        purchaseDate: formData.purchaseDate,
        date: formatDateDDMMYYYY(formData.purchaseDate),
        voucherNo: formData.voucherNo.trim(),
        vendor: formData.vendor.trim(),
        vendorId: formData.vendorId,
        store: formData.store,
        purchasedBy: userProfile?.displayName || user?.displayName || "Admin",
        items: formData.items,
        discountType: formData.discountType,
        discountValue: Number(formData.discountValue) || 0,
        subtotal: Number(calculatedSubtotal.toFixed(2)),
        discountAmount: Number(calculatedDiscountAmount.toFixed(2)),
        costAmount: Number(calculatedNetPayable.toFixed(2)),
        status: "RECEIVED" as const,
      };

      if (editingId) {
        await updateProductLift(editingId, recordPayload);
        showToast("Product lifting updated successfully", "success");
      } else {
        await addProductLift(recordPayload);
        showToast("Product lifting created & stock updated", "success");
      }

      await loadAllData();
      setViewMode("LIST");
      setEditingId(null);
    } catch (err) {
      console.error("Save error:", err);
      showToast("Failed to save product lifting", "error");
    } finally {
      setIsSaving(false);
    }
  };

  // Delete Handlers
  const handleConfirmDelete = async () => {
    try {
      if (deleteModalState.mode === "single" && deleteModalState.targetId) {
        await deleteProductLift(deleteModalState.targetId);
        showToast("Product lifting deleted", "success");
      } else if (deleteModalState.mode === "bulk" && selectedIds.length > 0) {
        await deleteProductLiftsBulk(selectedIds);
        showToast(`Deleted ${selectedIds.length} records`, "success");
        setSelectedIds([]);
      }
      setDeleteModalState({ isOpen: false, mode: "single" });
      await loadAllData();
    } catch (err) {
      console.error("Delete error:", err);
      showToast("Failed to delete record", "error");
    }
  };

  // Filtered and Paginated records
  const filteredLifts = useMemo(() => {
    return lifts.filter((l) => {
      if (typeFilter !== "All") {
        if (typeFilter.toLowerCase() === "credit" && l.type !== "credit") return false;
        if (typeFilter.toLowerCase() === "cash" && l.type !== "cash") return false;
      }
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase();
      return (
        l.purchaseNo?.toLowerCase().includes(q) ||
        l.vendor?.toLowerCase().includes(q) ||
        l.store?.toLowerCase().includes(q) ||
        l.voucherNo?.toLowerCase().includes(q) ||
        l.purchasedBy?.toLowerCase().includes(q) ||
        l.date?.toLowerCase().includes(q) ||
        l.costAmount?.toString().includes(q)
      );
    });
  }, [lifts, typeFilter, searchQuery]);

  const totalPages = Math.ceil(filteredLifts.length / pageSize) || 1;
  const paginatedLifts = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredLifts.slice(start, start + pageSize);
  }, [filteredLifts, currentPage, pageSize]);

  // Checkbox handlers
  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedIds(paginatedLifts.map((l) => l.id));
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
        <PurchaseProductForm
          editingId={editingId}
          formData={formData}
          setFormData={setFormData}
          vendors={vendors}
          productsCatalog={productsCatalog}
          selectedProductCode={selectedProductCode}
          setSelectedProductCode={setSelectedProductCode}
          productAddQty={productAddQty}
          setProductAddQty={setProductAddQty}
          onAddProductToItems={handleAddProductToItems}
          onItemFieldChange={handleItemFieldChange}
          onRemoveItem={handleRemoveItem}
          calculatedSubtotal={calculatedSubtotal}
          calculatedDiscountAmount={calculatedDiscountAmount}
          calculatedNetPayable={calculatedNetPayable}
          isSaving={isSaving}
          onSave={handleSaveLifting}
          onCancel={() => setViewMode("LIST")}
        />
      ) : (
        <PurchaseProductTable
          typeFilter={typeFilter}
          setTypeFilter={setTypeFilter}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          pageSize={pageSize}
          setPageSize={setPageSize}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          selectedIds={selectedIds}
          onSelectAll={handleSelectAll}
          onSelectRow={handleSelectRow}
          onOpenAddForm={handleOpenAddForm}
          onOpenEditForm={handleOpenEditForm}
          onOpenDeleteModal={(id, name) => {
            setDeleteModalState({
              isOpen: true,
              mode: "single",
              targetId: id,
              targetName: name,
            });
          }}
          onOpenBulkDeleteModal={() => {
            setDeleteModalState({
              isOpen: true,
              mode: "bulk",
            });
          }}
          onOpenPrintVoucher={(lift) => setPrintVoucher(lift)}
          onOpenBarcodeModal={(lift) => setBarcodeModalLift(lift)}
          filteredLifts={filteredLifts}
          paginatedLifts={paginatedLifts}
          totalPages={totalPages}
          isLoading={isLoading}
        />
      )}

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={deleteModalState.isOpen}
        title={deleteModalState.mode === "bulk" ? "Delete Selected Liftings" : "Delete Product Lifting"}
        itemName={
          deleteModalState.mode === "bulk"
            ? `${selectedIds.length} selected lifting records`
            : deleteModalState.targetName || "this purchase record"
        }
        onCancel={() => setDeleteModalState({ isOpen: false, mode: "single" })}
        onConfirm={handleConfirmDelete}
      />

      {/* Voucher Print Modal */}
      <PurchaseVoucherModal
        printVoucher={printVoucher}
        onClose={() => setPrintVoucher(null)}
      />

      {/* Barcode Labels Modal */}
      <PurchaseBarcodeModal
        barcodeModalLift={barcodeModalLift}
        onClose={() => setBarcodeModalLift(null)}
      />
    </>
  );
};
