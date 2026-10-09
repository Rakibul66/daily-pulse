"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useAuth } from "@/context/AuthContext";
import {
  ProductLift,
  PurchaseVendor,
  PurchaseReturn,
  VendorPayment,
  VendorStatementEntry
} from "@/types/purchase";
import {
  getProductLifts,
  getPurchaseVendors,
  getPurchaseReturns,
  getVendorPayments,
  formatDateDDMMYYYY
} from "@/lib/purchaseStorage";
import { VendorStatementFilterCard } from "../purchase/statement/VendorStatementFilterCard";
import { VendorStatementTable } from "../purchase/statement/VendorStatementTable";
import { VendorStatementPrintModal } from "../purchase/statement/VendorStatementPrintModal";

interface Props {
  showToast: (msg: string, type?: "success" | "error" | "info") => void;
}

// Utility to normalize any date string to standard YYYY-MM-DD
const normalizeToYYYYMMDD = (dateStr: string): string => {
  if (!dateStr) return "";
  const trimmed = dateStr.trim();
  if (/^\d{4}-\d{2}-\d{2}$/.test(trimmed)) return trimmed;
  if (/^\d{2}-\d{2}-\d{4}$/.test(trimmed)) {
    const [day, month, year] = trimmed.split("-");
    return `${year}-${month}-${day}`;
  }
  try {
    const d = new Date(trimmed);
    if (!isNaN(d.getTime())) {
      return d.toISOString().split("T")[0];
    }
  } catch {
    // ignore
  }
  return trimmed;
};

export const PurchaseVendorStatementPage: React.FC<Props> = ({ showToast }) => {
  const { user, userProfile } = useAuth();

  // Data Sources
  const [vendors, setVendors] = useState<PurchaseVendor[]>([]);
  const [productLifts, setProductLifts] = useState<ProductLift[]>([]);
  const [vendorPayments, setVendorPayments] = useState<VendorPayment[]>([]);
  const [purchaseReturns, setPurchaseReturns] = useState<PurchaseReturn[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Filters State
  const [selectedVendorName, setSelectedVendorName] = useState<string>("");
  const todayStr = useMemo(() => new Date().toISOString().split("T")[0], []);
  const firstDayOfMonthStr = useMemo(() => {
    const now = new Date();
    const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
    return firstDay.toISOString().split("T")[0];
  }, []);

  const [fromDate, setFromDate] = useState<string>(firstDayOfMonthStr);
  const [toDate, setToDate] = useState<string>(todayStr);

  // Submitted Search Criteria
  const [searchedVendor, setSearchedVendor] = useState<string>("");
  const [searchedFromDate, setSearchedFromDate] = useState<string>(firstDayOfMonthStr);
  const [searchedToDate, setSearchedToDate] = useState<string>(todayStr);
  const [hasSearched, setHasSearched] = useState<boolean>(false);

  // Table Controls
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [pageSize, setPageSize] = useState<number>(10);
  const [currentPage, setCurrentPage] = useState<number>(1);

  // Print Modal
  const [isPrintModalOpen, setIsPrintModalOpen] = useState<boolean>(false);

  // Load All Sources
  const loadSources = async () => {
    if (!user) return;
    setIsLoading(true);
    try {
      const [vList, pList, payList, rList] = await Promise.all([
        getPurchaseVendors(user.uid, userProfile?.companyId),
        getProductLifts(user.uid, userProfile?.companyId),
        getVendorPayments(user.uid, userProfile?.companyId),
        getPurchaseReturns(user.uid, userProfile?.companyId)
      ]);
      setVendors(vList);
      setProductLifts(pList);
      setVendorPayments(payList);
      setPurchaseReturns(rList);

      if (!selectedVendorName && vList.length > 0) {
        setSelectedVendorName(vList[0].name);
      }
    } catch (err) {
      console.error("Error loading vendor statement datasets:", err);
      showToast("Failed to load records for statement", "error");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      loadSources();
    }
  }, [user, userProfile?.companyId]);

  // Handle Search Trigger
  const handleSearch = () => {
    if (!selectedVendorName) {
      showToast("Please select a vendor first", "error");
      return;
    }
    if (fromDate && toDate && fromDate > toDate) {
      showToast("From Date cannot be greater than To Date", "error");
      return;
    }
    setSearchedVendor(selectedVendorName);
    setSearchedFromDate(fromDate);
    setSearchedToDate(toDate);
    setHasSearched(true);
    setCurrentPage(1);
    showToast(`Loaded statement for ${selectedVendorName}`, "success");
  };

  // Selected Vendor Object
  const currentVendor = useMemo(() => {
    return vendors.find((v) => v.name.toLowerCase() === searchedVendor.toLowerCase());
  }, [vendors, searchedVendor]);

  // Statement Calculation Engine
  const { previousBalance, statementEntries, totals } = useMemo(() => {
    if (!hasSearched || !searchedVendor) {
      return {
        previousBalance: 0,
        statementEntries: [],
        totals: { totalPurchase: 0, totalPayment: 0, totalReturns: 0, closingBalance: 0 }
      };
    }

    const normFrom = normalizeToYYYYMMDD(searchedFromDate);
    const normTo = normalizeToYYYYMMDD(searchedToDate);
    const vendorNameLower = searchedVendor.toLowerCase().trim();

    type RawTx = {
      id: string;
      rawDate: string;
      dateFormatted: string;
      particular: string;
      type: "PURCHASE" | "PAYMENT" | "RETURN";
      refNo: string;
      purchase: number;
      payment: number;
      returns: number;
      timestamp: number;
    };

    const allVendorTx: RawTx[] = [];

    // Product Lifts
    productLifts.forEach((lift) => {
      if ((lift.vendor || "").toLowerCase().trim() === vendorNameLower) {
        const rawD = normalizeToYYYYMMDD(lift.purchaseDate || lift.date || "");
        allVendorTx.push({
          id: `lift-${lift.id}`,
          rawDate: rawD,
          dateFormatted: formatDateDDMMYYYY(rawD),
          particular: `Purchase Lifting: ${lift.purchaseNo} (${lift.items?.length || 0} items)`,
          type: "PURCHASE",
          refNo: lift.purchaseNo,
          purchase: Number(lift.costAmount || 0),
          payment: 0,
          returns: 0,
          timestamp: new Date(rawD || lift.createdAt || 0).getTime()
        });
      }
    });

    // Vendor Payments
    vendorPayments.forEach((pay) => {
      if ((pay.vendor || "").toLowerCase().trim() === vendorNameLower) {
        const rawD = normalizeToYYYYMMDD(pay.paymentDate || pay.date || "");
        allVendorTx.push({
          id: `pay-${pay.id}`,
          rawDate: rawD,
          dateFormatted: formatDateDDMMYYYY(rawD),
          particular: `Payment Disbursement: ${pay.paymentNo} (${pay.paymentType})`,
          type: "PAYMENT",
          refNo: pay.paymentNo,
          purchase: 0,
          payment: Number(pay.amount || 0),
          returns: 0,
          timestamp: new Date(rawD || pay.createdAt || 0).getTime()
        });
      }
    });

    // Purchase Returns
    purchaseReturns.forEach((ret) => {
      if ((ret.vendor || "").toLowerCase().trim() === vendorNameLower) {
        const rawD = normalizeToYYYYMMDD(ret.returnDate || ret.date || "");
        allVendorTx.push({
          id: `ret-${ret.id}`,
          rawDate: rawD,
          dateFormatted: formatDateDDMMYYYY(rawD),
          particular: `Purchase Return Memo: ${ret.store || "Direct"}`,
          type: "RETURN",
          refNo: ret.id.substring(0, 8),
          purchase: 0,
          payment: 0,
          returns: Number(ret.amount || 0),
          timestamp: new Date(rawD || ret.createdAt || 0).getTime()
        });
      }
    });

    // Sort chronologically
    allVendorTx.sort((a, b) => {
      if (a.rawDate !== b.rawDate) {
        return a.rawDate.localeCompare(b.rawDate);
      }
      return a.timestamp - b.timestamp;
    });

    // Compute Previous Balance
    let prevBal = 0;
    const inWindowTx: RawTx[] = [];

    allVendorTx.forEach((tx) => {
      if (normFrom && tx.rawDate < normFrom) {
        prevBal += tx.purchase - tx.payment - tx.returns;
      } else if ((!normFrom || tx.rawDate >= normFrom) && (!normTo || tx.rawDate <= normTo)) {
        inWindowTx.push(tx);
      }
    });

    // Compute Running Balances
    let running = prevBal;
    let totalPurch = 0;
    let totalPay = 0;
    let totalRet = 0;

    const entries: VendorStatementEntry[] = inWindowTx.map((tx) => {
      running += tx.purchase - tx.payment - tx.returns;
      totalPurch += tx.purchase;
      totalPay += tx.payment;
      totalRet += tx.returns;

      return {
        id: tx.id,
        date: tx.dateFormatted,
        rawDate: tx.rawDate,
        particular: tx.particular,
        type: tx.type,
        refNo: tx.refNo,
        purchase: tx.purchase,
        payment: tx.payment,
        returns: tx.returns,
        balance: running
      };
    });

    return {
      previousBalance: prevBal,
      statementEntries: entries,
      totals: {
        totalPurchase: totalPurch,
        totalPayment: totalPay,
        totalReturns: totalRet,
        closingBalance: running
      }
    };
  }, [hasSearched, searchedVendor, searchedFromDate, searchedToDate, productLifts, vendorPayments, purchaseReturns]);

  // Filter entries based on search query
  const filteredEntries = useMemo(() => {
    if (!searchQuery.trim()) return statementEntries;
    const q = searchQuery.toLowerCase().trim();
    return statementEntries.filter(
      (e) =>
        e.date.toLowerCase().includes(q) ||
        e.particular.toLowerCase().includes(q) ||
        e.refNo.toLowerCase().includes(q) ||
        e.purchase.toString().includes(q) ||
        e.payment.toString().includes(q) ||
        e.returns.toString().includes(q)
    );
  }, [statementEntries, searchQuery]);

  // Pagination
  const totalPages = Math.ceil(filteredEntries.length / pageSize) || 1;
  const paginatedEntries = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredEntries.slice(start, start + pageSize);
  }, [filteredEntries, currentPage, pageSize]);

  // Export CSV
  const handleExportCSV = () => {
    if (statementEntries.length === 0) {
      showToast("No data to export", "info");
      return;
    }

    const headers = ["Sl#", "Date", "Particular", "Ref No", "Purchase", "Payment", "Returns", "Balance"];
    const rows = statementEntries.map((e, idx) => [
      idx + 1,
      `"${e.date}"`,
      `"${e.particular.replace(/"/g, '""')}"`,
      `"${e.refNo}"`,
      e.purchase.toFixed(2),
      e.payment.toFixed(2),
      e.returns.toFixed(2),
      e.balance.toFixed(2)
    ]);

    rows.push([
      "",
      "",
      `"Total (Prev Balance: ${previousBalance.toFixed(2)})"`,
      "",
      totals.totalPurchase.toFixed(2),
      totals.totalPayment.toFixed(2),
      totals.totalReturns.toFixed(2),
      totals.closingBalance.toFixed(2)
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [
        `"Vendor Statement: ${searchedVendor}"`,
        `"Period: ${formatDateDDMMYYYY(searchedFromDate)} to ${formatDateDDMMYYYY(searchedToDate)}"`,
        headers.join(","),
        ...rows.map((r) => r.join(","))
      ].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute(
      "download",
      `Vendor_Statement_${searchedVendor.replace(/\s+/g, "_")}_${searchedFromDate}_to_${searchedToDate}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast("Exported statement to CSV", "success");
  };

  return (
    <div className="space-y-6">
      {/* Filter Card */}
      <VendorStatementFilterCard
        vendors={vendors}
        selectedVendorName={selectedVendorName}
        setSelectedVendorName={setSelectedVendorName}
        fromDate={fromDate}
        setFromDate={setFromDate}
        toDate={toDate}
        setToDate={setToDate}
        onSearch={handleSearch}
        isLoading={isLoading}
        hasSearched={hasSearched}
        currentVendor={currentVendor}
        searchedVendor={searchedVendor}
        searchedFromDate={searchedFromDate}
        searchedToDate={searchedToDate}
      />

      {/* Statement Table */}
      <VendorStatementTable
        entries={statementEntries}
        paginatedEntries={paginatedEntries}
        hasSearched={hasSearched}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        pageSize={pageSize}
        setPageSize={setPageSize}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        totalPages={totalPages}
        totalFilteredCount={filteredEntries.length}
        previousBalance={previousBalance}
        totals={totals}
        onExportCSV={handleExportCSV}
        onPrint={() => setIsPrintModalOpen(true)}
      />

      {/* Print Modal */}
      <VendorStatementPrintModal
        isOpen={isPrintModalOpen}
        onClose={() => setIsPrintModalOpen(false)}
        companyName={userProfile?.displayName || "SHOMPORKO CRM & POS ERP"}
        searchedVendor={searchedVendor}
        currentVendor={currentVendor}
        searchedFromDate={searchedFromDate}
        searchedToDate={searchedToDate}
        todayStr={todayStr}
        previousBalance={previousBalance}
        totals={totals}
        statementEntries={statementEntries}
      />
    </div>
  );
};
