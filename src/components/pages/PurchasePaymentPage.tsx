"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useAuth } from "@/context/AuthContext";
import { DeleteConfirmModal } from "@/components/ui/DeleteConfirmModal";
import { VendorPayment, PurchaseVendor } from "@/types/purchase";
import { 
  getVendorPayments, 
  addVendorPayment, 
  updateVendorPayment, 
  deleteVendorPayment, 
  deleteVendorPaymentsBulk,
  getPurchaseVendors,
  formatDateDDMMYYYY
} from "@/lib/purchaseStorage";
import { VendorPaymentFormData } from "../purchase/payment/types";
import { PurchasePaymentForm } from "../purchase/payment/PurchasePaymentForm";
import { PurchasePaymentTable } from "../purchase/payment/PurchasePaymentTable";
import { PurchasePaymentReceiptModal } from "../purchase/payment/PurchasePaymentReceiptModal";

interface Props {
  showToast: (msg: string, type?: "success" | "error" | "info") => void;
}

export const PurchasePaymentPage: React.FC<Props> = ({ showToast }) => {
  const { user, userProfile } = useAuth();

  // View Mode: 'LIST' or 'FORM'
  const [viewMode, setViewMode] = useState<"LIST" | "FORM">("LIST");
  const [editingId, setEditingId] = useState<string | null>(null);

  // Data states
  const [payments, setPayments] = useState<VendorPayment[]>([]);
  const [vendors, setVendors] = useState<PurchaseVendor[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSaving, setIsSaving] = useState<boolean>(false);

  // Table filters & controls
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [methodFilter, setMethodFilter] = useState<string>("All");
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
  const [printPayment, setPrintPayment] = useState<VendorPayment | null>(null);

  // Form State
  const [formData, setFormData] = useState<VendorPaymentFormData>({
    paymentNo: "",
    paymentDate: new Date().toISOString().split("T")[0],
    vendor: "",
    vendorId: "",
    paymentType: "Cash at Hand",
    amount: 0,
    voucherRef: "",
    bankName: "",
    chequeNo: "",
    remarks: "",
    staff: "Admin",
  });

  // Load Data
  const loadAllData = async () => {
    if (!user) return;
    setIsLoading(true);
    try {
      const [paymentsData, vendorsData] = await Promise.all([
        getVendorPayments(user.uid, userProfile?.companyId),
        getPurchaseVendors(user.uid, userProfile?.companyId),
      ]);
      setPayments(paymentsData);
      setVendors(vendorsData);
    } catch (err) {
      console.error("Error loading vendor payment data:", err);
      showToast("Failed to load vendor payment records", "error");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      loadAllData();
    }
  }, [user, userProfile?.companyId]);

  // Generate Next Payment Number like STP2610000001
  const generateNextPaymentNo = (): string => {
    const now = new Date();
    const yy = String(now.getFullYear()).slice(-2);
    const mm = String(now.getMonth() + 1).padStart(2, "0");
    const count = payments.length + 1;
    const serial = String(count).padStart(6, "0");
    return `STP${yy}${mm}${serial}`;
  };

  // Open Add Form
  const handleOpenAddForm = () => {
    setEditingId(null);
    setFormData({
      paymentNo: generateNextPaymentNo(),
      paymentDate: new Date().toISOString().split("T")[0],
      vendor: vendors.length > 0 ? vendors[0].name : "A.K TRADING CORPORATION",
      vendorId: vendors.length > 0 ? vendors[0].id : "",
      paymentType: "Cash at Hand",
      amount: 0,
      voucherRef: "",
      bankName: "",
      chequeNo: "",
      remarks: "",
      staff: userProfile?.displayName || user?.displayName || "Admin",
    });
    setViewMode("FORM");
  };

  // Open Edit Form
  const handleOpenEditForm = (pay: VendorPayment) => {
    setEditingId(pay.id);
    let pDate = pay.paymentDate || "";
    if (/^\d{2}-\d{2}-\d{4}$/.test(pDate)) {
      const parts = pDate.split("-");
      pDate = `${parts[2]}-${parts[1]}-${parts[0]}`;
    }

    setFormData({
      paymentNo: pay.paymentNo || "",
      paymentDate: pDate || new Date().toISOString().split("T")[0],
      vendor: pay.vendor || "",
      vendorId: pay.vendorId || "",
      paymentType: (pay.paymentType as any) || "Cash at Hand",
      amount: pay.amount || 0,
      voucherRef: pay.voucherRef || "",
      bankName: pay.bankName || "",
      chequeNo: pay.chequeNo || "",
      remarks: pay.remarks || "",
      staff: pay.staff || "Admin",
    });
    setViewMode("FORM");
  };

  // Save Payment
  const handleSavePayment = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!formData.paymentNo.trim()) {
      showToast("Payment number is required", "error");
      return;
    }
    if (!formData.vendor.trim()) {
      showToast("Vendor is required", "error");
      return;
    }
    if (Number(formData.amount) <= 0) {
      showToast("Payment amount must be greater than 0", "error");
      return;
    }

    setIsSaving(true);
    try {
      const recordPayload = {
        userId: user?.uid || "",
        companyId: userProfile?.companyId || user?.uid || "",
        company: userProfile?.companyId || "Shomporko Retail",
        paymentNo: formData.paymentNo.trim(),
        paymentDate: formData.paymentDate,
        date: formatDateDDMMYYYY(formData.paymentDate),
        vendor: formData.vendor.trim(),
        vendorId: formData.vendorId,
        paymentType: formData.paymentType,
        amount: Number(formData.amount) || 0,
        voucherRef: formData.voucherRef.trim(),
        bankName: formData.bankName.trim(),
        chequeNo: formData.chequeNo.trim(),
        remarks: formData.remarks.trim(),
        staff: formData.staff.trim() || "Admin",
        status: "COMPLETED" as const,
      };

      if (editingId) {
        await updateVendorPayment(editingId, recordPayload);
        showToast("Vendor payment updated successfully", "success");
      } else {
        await addVendorPayment(recordPayload);
        showToast("Vendor payment recorded successfully", "success");
      }

      await loadAllData();
      setViewMode("LIST");
      setEditingId(null);
    } catch (err) {
      console.error("Save payment error:", err);
      showToast("Failed to save vendor payment", "error");
    } finally {
      setIsSaving(false);
    }
  };

  // Delete Handlers
  const handleConfirmDelete = async () => {
    try {
      if (deleteModalState.mode === "single" && deleteModalState.targetId) {
        await deleteVendorPayment(deleteModalState.targetId);
        showToast("Payment record deleted", "success");
      } else if (deleteModalState.mode === "bulk" && selectedIds.length > 0) {
        await deleteVendorPaymentsBulk(selectedIds);
        showToast(`Deleted ${selectedIds.length} payment records`, "success");
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
  const filteredPayments = useMemo(() => {
    return payments.filter((p) => {
      if (methodFilter !== "All" && p.paymentType !== methodFilter) {
        return false;
      }
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase();
      return (
        p.paymentNo?.toLowerCase().includes(q) ||
        p.vendor?.toLowerCase().includes(q) ||
        p.paymentType?.toLowerCase().includes(q) ||
        p.voucherRef?.toLowerCase().includes(q) ||
        p.staff?.toLowerCase().includes(q) ||
        p.remarks?.toLowerCase().includes(q) ||
        p.date?.toLowerCase().includes(q) ||
        p.amount?.toString().includes(q)
      );
    });
  }, [payments, methodFilter, searchQuery]);

  const totalPages = Math.ceil(filteredPayments.length / pageSize) || 1;
  const paginatedPayments = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredPayments.slice(start, start + pageSize);
  }, [filteredPayments, currentPage, pageSize]);

  return (
    <div className="space-y-6">
      {viewMode === "FORM" ? (
        <PurchasePaymentForm
          editingId={editingId}
          formData={formData}
          setFormData={setFormData}
          vendors={vendors}
          isSaving={isSaving}
          onSave={handleSavePayment}
          onCancel={() => setViewMode("LIST")}
        />
      ) : (
        <PurchasePaymentTable
          payments={paginatedPayments}
          isLoading={isLoading}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          methodFilter={methodFilter}
          setMethodFilter={setMethodFilter}
          pageSize={pageSize}
          setPageSize={setPageSize}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          totalPages={totalPages}
          totalFilteredCount={filteredPayments.length}
          selectedIds={selectedIds}
          onSelectAll={(checked) => {
            if (checked) {
              setSelectedIds(paginatedPayments.map((p) => p.id));
            } else {
              setSelectedIds([]);
            }
          }}
          onSelectRow={(id, checked) => {
            if (checked) {
              setSelectedIds((prev) => [...prev, id]);
            } else {
              setSelectedIds((prev) => prev.filter((i) => i !== id));
            }
          }}
          onOpenAdd={handleOpenAddForm}
          onOpenEdit={handleOpenEditForm}
          onPrint={(p) => setPrintPayment(p)}
          onDeleteSingle={(p) =>
            setDeleteModalState({
              isOpen: true,
              mode: "single",
              targetId: p.id,
              targetName: `${p.paymentNo} (${p.vendor} - ৳${p.amount})`,
            })
          }
          onDeleteBulk={() =>
            setDeleteModalState({
              isOpen: true,
              mode: "bulk",
            })
          }
        />
      )}

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={deleteModalState.isOpen}
        title={deleteModalState.mode === "bulk" ? "Delete Selected Payments" : "Delete Vendor Payment"}
        itemName={
          deleteModalState.mode === "bulk"
            ? `${selectedIds.length} selected payment records`
            : deleteModalState.targetName || "this payment record"
        }
        onCancel={() => setDeleteModalState({ isOpen: false, mode: "single" })}
        onConfirm={handleConfirmDelete}
      />

      {/* Payment Receipt / Voucher Print Modal */}
      <PurchasePaymentReceiptModal
        payment={printPayment}
        onClose={() => setPrintPayment(null)}
        companyName={userProfile?.displayName || "SHOMPORKO CRM & POS"}
      />
    </div>
  );
};
