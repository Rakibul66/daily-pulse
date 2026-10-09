"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useAuth } from "@/context/AuthContext";
import { DailySale, DailySaleItem } from "@/types/sales";
import { Product } from "@/types/inventory";
import { Customer } from "@/types/customer";
import { 
  getSalesInvoices, 
  addSalesInvoice, 
  updateSalesInvoice, 
  deleteSalesInvoice 
} from "@/lib/salesStorage";
import { getProducts } from "@/lib/inventoryStorage";
import { getCustomers } from "@/lib/customerStorage";
import { DeleteConfirmModal } from "../ui/DeleteConfirmModal";
import { 
  SalesInvoiceFormData, 
  DEFAULT_STORES 
} from "../sales/invoice/types";
import { SalesInvoiceForm } from "../sales/invoice/SalesInvoiceForm";
import { SalesInvoiceTable } from "../sales/invoice/SalesInvoiceTable";

interface Props {
  showToast: (msg: string, type?: "success" | "error" | "info") => void;
}

export const SalesInvoicePage: React.FC<Props> = ({ showToast }) => {
  const { user, userProfile } = useAuth();

  // View state: 'LIST' or 'FORM' (in-page, avoids modal clipping)
  const [viewMode, setViewMode] = useState<"LIST" | "FORM">("LIST");
  const [editingInvoiceId, setEditingInvoiceId] = useState<string | null>(null);

  // Data sources
  const [invoices, setInvoices] = useState<DailySale[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSaving, setIsSaving] = useState<boolean>(false);

  // Table filters & controls
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [pageSize, setPageSize] = useState<number>(10);
  const [currentPage, setCurrentPage] = useState<number>(1);

  // Modals
  const [deleteModalState, setDeleteModalState] = useState<{
    isOpen: boolean;
    targetId?: string;
    targetName?: string;
  }>({
    isOpen: false
  });

  // ==========================================
  // FORM STATE
  // ==========================================
  const todayStr = useMemo(() => new Date().toISOString().split("T")[0], []);

  const [formData, setFormData] = useState<SalesInvoiceFormData>({
    invoiceNo: "",
    date: todayStr,
    customerId: "",
    customerName: "",
    customerPhone: "",
    customerAddress: "",
    storeName: DEFAULT_STORES[0],
    type: "Credit",
    salesBy: "Admin",
    items: [],
    discountType: "fixed",
    discountValue: 0,
    remarks: ""
  });

  // Product Line Item Adder
  const [selectedProductId, setSelectedProductId] = useState<string>("");
  const [selectedQty, setSelectedQty] = useState<number>(1);
  const [selectedRate, setSelectedRate] = useState<number>(0);

  // Load All Data
  const loadData = async () => {
    if (!user) return;
    setIsLoading(true);
    try {
      const [invData, custData, prodData] = await Promise.all([
        getSalesInvoices(user.uid),
        getCustomers(user.uid, userProfile?.companyId),
        getProducts(user.uid)
      ]);
      setInvoices(invData);
      setCustomers(custData);
      setProducts(prodData);
    } catch (err) {
      console.error("Error loading sales invoice data:", err);
      showToast("Failed to load invoice records", "error");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      loadData();
    }
  }, [user, userProfile?.companyId]);

  // Generate Next Invoice No
  const generateNextInvoiceNo = (): string => {
    const now = new Date();
    const yy = String(now.getFullYear()).slice(-2);
    const mm = String(now.getMonth() + 1).padStart(2, "0");
    const count = invoices.length + 1;
    const serial = String(count).padStart(6, "0");
    return `STS${yy}${mm}${serial}`;
  };

  // Open New Sale Form
  const handleOpenNewSale = () => {
    setEditingInvoiceId(null);
    setFormData({
      invoiceNo: generateNextInvoiceNo(),
      date: new Date().toISOString().split("T")[0],
      customerId: "",
      customerName: "",
      customerPhone: "",
      customerAddress: "",
      storeName: DEFAULT_STORES[0],
      type: "Credit",
      salesBy: userProfile?.displayName || "Admin",
      items: [],
      discountType: "fixed",
      discountValue: 0,
      remarks: ""
    });
    setSelectedProductId("");
    setSelectedQty(1);
    setSelectedRate(0);
    setViewMode("FORM");
  };

  // Open Edit Form
  const handleOpenEdit = (inv: DailySale) => {
    setEditingInvoiceId(inv.id);
    setFormData({
      invoiceNo: inv.invoiceNo,
      date: inv.date,
      customerId: inv.clientId || "",
      customerName: inv.clientName || "",
      customerPhone: inv.clientPhone || "",
      customerAddress: inv.clientAddress || "",
      storeName: inv.storeName || DEFAULT_STORES[0],
      type: inv.type || "Credit",
      salesBy: inv.salesBy || "Admin",
      items: inv.items || [],
      discountType: "fixed",
      discountValue: inv.discountAmount || 0,
      remarks: ""
    });
    setSelectedProductId("");
    setSelectedQty(1);
    setSelectedRate(0);
    setViewMode("FORM");
  };

  // Handle Customer Selection
  const handleCustomerChange = (cId: string) => {
    const found = customers.find((c) => c.id === cId);
    if (found) {
      setFormData((prev) => ({
        ...prev,
        customerId: found.id,
        customerName: found.businessName || found.ownerName,
        customerPhone: found.phone || "",
        customerAddress: found.address || ""
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        customerId: "",
        customerName: cId, // Allow free-text customer name
        customerPhone: "",
        customerAddress: ""
      }));
    }
  };

  // Handle Product Selector Change
  const handleProductSelect = (pId: string) => {
    setSelectedProductId(pId);
    const prod = products.find((p) => p.id === pId);
    if (prod) {
      setSelectedRate(prod.price || 0);
      setSelectedQty(1);
    } else {
      setSelectedRate(0);
      setSelectedQty(1);
    }
  };

  // Add Item to List
  const handleAddItem = () => {
    if (!selectedProductId) {
      showToast("Please select a product first", "error");
      return;
    }
    const prod = products.find((p) => p.id === selectedProductId);
    if (!prod) return;

    if (selectedQty <= 0) {
      showToast("Quantity must be greater than 0", "error");
      return;
    }

    const newItem: DailySaleItem = {
      id: Math.random().toString(36).substring(2, 9),
      productName: prod.name,
      itemCode: prod.sku || "",
      quantity: Number(selectedQty),
      unit: "Pcs",
      rate: Number(selectedRate),
      amount: Number(selectedRate) * Number(selectedQty)
    };

    setFormData((prev) => ({
      ...prev,
      items: [...prev.items, newItem]
    }));

    // Reset adder fields
    setSelectedProductId("");
    setSelectedQty(1);
    setSelectedRate(0);
  };

  // Remove Item
  const handleRemoveItem = (itemId: string) => {
    setFormData((prev) => ({
      ...prev,
      items: prev.items.filter((i) => i.id !== itemId)
    }));
  };

  // Calculations
  const subtotal = useMemo(() => {
    return formData.items.reduce((sum, item) => sum + (item.amount || 0), 0);
  }, [formData.items]);

  const discountAmount = useMemo(() => {
    if (formData.discountType === "percentage") {
      return (subtotal * Number(formData.discountValue || 0)) / 100;
    }
    return Number(formData.discountValue || 0);
  }, [subtotal, formData.discountType, formData.discountValue]);

  const netPayable = useMemo(() => {
    return Math.max(0, subtotal - discountAmount);
  }, [subtotal, discountAmount]);

  // Save Invoice
  const handleSaveInvoice = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    if (!formData.customerName.trim()) {
      showToast("Please specify a customer name", "error");
      return;
    }

    if (formData.items.length === 0) {
      showToast("Please add at least one product item to the invoice", "error");
      return;
    }

    setIsSaving(true);
    try {
      const payload: Omit<DailySale, "id" | "userId" | "createdAt" | "updatedAt"> = {
        companyName: userProfile?.displayName || "Shomporko ERP",
        invoiceNo: formData.invoiceNo || generateNextInvoiceNo(),
        date: formData.date,
        clientId: formData.customerId,
        clientName: formData.customerName,
        clientCode: formData.customerId ? formData.customerId.slice(-6).toUpperCase() : "WALK-IN",
        clientPhone: formData.customerPhone,
        clientAddress: formData.customerAddress,
        storeName: formData.storeName,
        type: formData.type,
        salesBy: formData.salesBy,
        items: formData.items,
        totalAmount: subtotal,
        discountAmount: discountAmount,
        netInvoiceAmount: netPayable,
        openingBalance: 0,
        netPayable: netPayable
      };

      if (editingInvoiceId) {
        await updateSalesInvoice(editingInvoiceId, payload);
        showToast("Invoice updated successfully", "success");
      } else {
        await addSalesInvoice({
          ...payload,
          userId: user.uid
        });
        showToast("Invoice created successfully", "success");
      }

      await loadData();
      setViewMode("LIST");
    } catch (err) {
      console.error("Error saving sales invoice:", err);
      showToast("Failed to save invoice", "error");
    } finally {
      setIsSaving(false);
    }
  };

  // Confirm Delete
  const handleConfirmDelete = async () => {
    if (!deleteModalState.targetId) return;
    try {
      await deleteSalesInvoice(deleteModalState.targetId);
      showToast("Invoice deleted successfully", "success");
      setDeleteModalState({ isOpen: false });
      await loadData();
    } catch (err) {
      console.error("Error deleting invoice:", err);
      showToast("Failed to delete invoice", "error");
    }
  };

  // Filtered Invoices
  const filteredInvoices = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return invoices;
    return invoices.filter(
      (inv) =>
        inv.invoiceNo.toLowerCase().includes(q) ||
        inv.clientName.toLowerCase().includes(q) ||
        (inv.storeName && inv.storeName.toLowerCase().includes(q)) ||
        (inv.clientPhone && inv.clientPhone.includes(q))
    );
  }, [invoices, searchQuery]);

  // Pagination
  const totalPages = Math.ceil(filteredInvoices.length / pageSize) || 1;
  const paginatedInvoices = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredInvoices.slice(start, start + pageSize);
  }, [filteredInvoices, currentPage, pageSize]);

  return (
    <div className="space-y-6">
      {viewMode === "FORM" ? (
        <SalesInvoiceForm
          editingInvoiceId={editingInvoiceId}
          formData={formData}
          setFormData={setFormData}
          customers={customers}
          products={products}
          selectedProductId={selectedProductId}
          selectedQty={selectedQty}
          selectedRate={selectedRate}
          setSelectedQty={setSelectedQty}
          setSelectedRate={setSelectedRate}
          subtotal={subtotal}
          discountAmount={discountAmount}
          netPayable={netPayable}
          isSaving={isSaving}
          onCustomerChange={handleCustomerChange}
          onProductSelect={handleProductSelect}
          onAddItem={handleAddItem}
          onRemoveItem={handleRemoveItem}
          onSaveInvoice={handleSaveInvoice}
          onCancel={() => setViewMode("LIST")}
        />
      ) : (
        <SalesInvoiceTable
          invoices={paginatedInvoices}
          isLoading={isLoading}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          pageSize={pageSize}
          setPageSize={setPageSize}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          totalPages={totalPages}
          totalFilteredCount={filteredInvoices.length}
          onOpenNewSale={handleOpenNewSale}
          onOpenEdit={handleOpenEdit}
          onDeleteInvoice={(id, invoiceNo) =>
            setDeleteModalState({
              isOpen: true,
              targetId: id,
              targetName: invoiceNo
            })
          }
        />
      )}

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={deleteModalState.isOpen}
        title="Delete Sales Invoice"
        itemName={deleteModalState.targetName ? `Invoice ${deleteModalState.targetName}` : "this invoice"}
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteModalState({ isOpen: false })}
      />
    </div>
  );
};
