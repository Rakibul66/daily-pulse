"use client";

import React, { useState, useEffect, useCallback } from "react";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { AdminPageId } from "@/components/layout/Sidebar";

import { CRMDashboardPage } from "@/components/pages/CRMDashboardPage";
import { CRMLeadsPage } from "@/components/pages/CRMLeadsPage";
import { CRMRecentLeadsPage } from "@/components/pages/CRMRecentLeadsPage";
import { CRMAILeadPage } from "@/components/pages/CRMAILeadPage";
import { CustomersPage } from "@/components/pages/CustomersPage";
import { PromotionsPage } from "@/components/pages/PromotionsPage";
import { CustomerFeedbackPage } from "@/components/pages/CustomerFeedbackPage";
import { LostAndFoundPage } from "@/components/pages/LostAndFoundPage";
import { AssetsManagementPage } from "@/components/pages/AssetsManagementPage";
import { InventoryPage } from "@/components/pages/InventoryPage";
import { SalesPage } from "@/components/pages/SalesPage";
import { PurchasesPage } from "@/components/pages/PurchasesPage";
import { PurchaseVendorSetupPage } from "@/components/pages/PurchaseVendorSetupPage";
import { PurchaseProductPage } from "@/components/pages/PurchaseProductPage";
import { PurchaseReturnPage } from "@/components/pages/PurchaseReturnPage";
import { PurchasePaymentPage } from "@/components/pages/PurchasePaymentPage";
import { PurchaseGenerateBarcodePage } from "@/components/pages/PurchaseGenerateBarcodePage";

import { AccountsPage } from "@/components/pages/AccountsPage";
import { SalesClientSetupPage } from "@/components/pages/SalesClientSetupPage";
import { SalesInvoicePage } from "@/components/pages/SalesInvoicePage";
import { SalesCollectionPage } from "@/components/pages/SalesCollectionPage";
import { SalesReturnPage } from "@/components/pages/SalesReturnPage";
import { SalesReturnApprovalPage } from "@/components/pages/SalesReturnApprovalPage";
import { POSSalesPage } from "@/components/pages/POSSalesPage";
import { MainDashboardPage } from "@/components/pages/MainDashboardPage";
import { SystemCompanyPage } from "@/components/pages/SystemCompanyPage";
import { SystemBranchPage } from "@/components/pages/SystemBranchPage";
import { SubscriptionPage } from "@/components/pages/SubscriptionPage";
import { SettingsPage } from "@/components/pages/SettingsPage";
import { PartnershipPage } from "@/components/pages/PartnershipPage";
import { HRMAttendancePage } from "@/components/pages/HRMAttendancePage";
import { HRMEmployeesPage } from "@/components/pages/HRMEmployeesPage";
import { HRMPayrollPage } from "@/components/pages/HRMPayrollPage";
import { HRMLoansPage } from "@/components/pages/HRMLoansPage";
import { HRMCateringPage } from "@/components/pages/HRMCateringPage";
import { HRMOvertimePage } from "@/components/pages/HRMOvertimePage";
import { HRMSettingsPage } from "@/components/pages/hrm/HRMSettingsPage";
import { DailyWorkReportsPage } from "@/components/pages/hrm/DailyWorkReportsPage";
import { LandingPage } from "@/components/landing/LandingPage";
import { AuthModal } from "@/components/auth/AuthModal";
import { CopyTextModal } from "@/components/export/CopyTextModal";
import { PrintReportView } from "@/components/export/PrintReportView";
import { Toast } from "@/components/ui/Toast";
import { DailyRecord, MorningGoal, EODReport } from "@/types/report";
import { getRecordForDate } from "@/lib/storage";
import { createDefaultMorningGoal, createDefaultEODReport } from "@/lib/defaultData";
import { getTodayDateString } from "@/lib/formatters";
import { useAuth } from "@/context/AuthContext";
import { Loader2 } from "lucide-react";

export const dynamic = 'force-dynamic';

export default function Home() {
  const { user, userProfile, loading: authLoading } = useAuth();

  // Admin Navigation State
  const [activeAdminPage, setActiveAdminPage] = useState<AdminPageId>("dashboard");
  const [selectedDate, setSelectedDate] = useState<string>(getTodayDateString);

  // Record State
  const [currentRecord, setCurrentRecord] = useState<DailyRecord | null>(null);
  const [isLoadingRecord, setIsLoadingRecord] = useState(false);


  // Onboarding Routing
  useEffect(() => {
    if (userProfile?.companyId) {
      const step = localStorage.getItem("dp_onboarding_step");
      if (step === "company") {
        setActiveAdminPage("system-company");
        showToast("Welcome! Please set up your Company Profile first.", "info");
      } else if (step === "branch") {
        setActiveAdminPage("system-branch");
        showToast("Great! Now let's add your first Branch.", "info");
      }
    }
  }, [userProfile?.companyId]);

  // Auth Modal State
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<"login" | "register" | "forgot">("login");

  // Export & Action Modals State
  const [copyModalState, setCopyModalState] = useState<{
    isOpen: boolean;
    title: string;
    text: string;
  }>({
    isOpen: false,
    title: "",
    text: "",
  });
  const [isPrintModalOpen, setIsPrintModalOpen] = useState(false);
  const [toast, setToast] = useState<{
    message: string;
    type?: "success" | "error" | "info";
  } | null>(null);

  const showToast = (message: string, type: "success" | "error" | "info" = "success") => {
    setToast({ message, type });
  };

  const openAuth = (mode: "login" | "register" | "forgot") => {
    setAuthModalMode(mode);
    setIsAuthModalOpen(true);
  };

  const loadRecord = useCallback(async (date: string, userId?: string | null) => {
    setIsLoadingRecord(true);
    try {
      const rec = await getRecordForDate(date, userId);
      if (!rec.morningGoal) {
        rec.morningGoal = createDefaultMorningGoal(date);
      }
      if (!rec.eodReport) {
        rec.eodReport = createDefaultEODReport(date, rec.morningGoal);
      }
      setCurrentRecord(rec);
    } catch (e) {
      console.error(e);
      showToast("Error loading daily record", "error");
    } finally {
      setIsLoadingRecord(false);
    }
  }, []);

  useEffect(() => {
    if (user) {
      loadRecord(selectedDate, user.uid);
    }
  }, [selectedDate, user, loadRecord]);

  const handleGoalUpdated = (updatedGoal: MorningGoal) => {
    if (!currentRecord) return;
    setCurrentRecord({
      ...currentRecord,
      morningGoal: updatedGoal,
      hasMorningGoal: true,
      updatedAt: new Date().toISOString(),
    });
  };

  const handleReportUpdated = (updatedReport: EODReport) => {
    if (!currentRecord) return;
    setCurrentRecord({
      ...currentRecord,
      eodReport: updatedReport,
      hasEODReport: true,
      updatedAt: new Date().toISOString(),
    });
  };

  const handleRecordUpdated = (updatedRecord: DailyRecord) => {
    setCurrentRecord(updatedRecord);
  };

  const handleOpenCopyModal = (title: string, text: string) => {
    setCopyModalState({
      isOpen: true,
      title,
      text,
    });
  };

  // 1. Auth loading spinner
  if (authLoading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 text-primary-600 animate-spin" />
          <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">
            Initializing ApnarSoftware Admin...
          </p>
        </div>
      </div>
    );
  }

  // 2. Unauthenticated: Show Landing Page
  if (!user) {
    return (
      <>
        <LandingPage
          onGetStarted={() => openAuth("register")}
          onSignIn={() => openAuth("login")}
        />
        <AuthModal
          isOpen={isAuthModalOpen}
          initialMode={authModalMode}
          onClose={() => setIsAuthModalOpen(false)}
          onSuccess={() => showToast("Welcome to ApnarSoftware!", "success")}
        />
        {toast && (
          <Toast
            message={toast.message}
            type={toast.type}
            onClose={() => setToast(null)}
          />
        )}
      </>
    );
  }

  // 3. Authenticated: Full Admin Panel with Sidebar Layout
  return (
    <AdminLayout
      activePage={activeAdminPage}
      setActivePage={setActiveAdminPage}
    >
      {isLoadingRecord && !currentRecord ? (
        <div className="flex flex-col items-center justify-center py-20 space-y-3">
          <Loader2 className="w-8 h-8 text-primary-600 animate-spin" />
          <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Loading workspace data...</p>
        </div>
      ) : (
        <>
          {activeAdminPage === "dashboard" && (
            <MainDashboardPage showToast={showToast} />
          )}


          {/* CRM Pages */}
          {activeAdminPage === "crm-dashboard" && (
            <CRMDashboardPage showToast={showToast} />
          )}
          {activeAdminPage === "crm-leads" && (
            <CRMLeadsPage showToast={showToast} />
          )}
          {activeAdminPage === "crm-recent-leads" && (
            <CRMRecentLeadsPage showToast={showToast} />
          )}
          {activeAdminPage === "crm-ai-lead" && (
            <CRMAILeadPage showToast={showToast} />
          )}

          {/* Customers Page */}
          {activeAdminPage === "customers-list" && (
            <CustomersPage showToast={showToast} />
          )}
          {activeAdminPage === "customers-promotions" && (
            <PromotionsPage showToast={showToast} />
          )}
          {activeAdminPage === "customers-feedback" && (
            <CustomerFeedbackPage showToast={showToast} />
          )}
          {activeAdminPage === "lost-and-found" && (
            <LostAndFoundPage showToast={showToast} />
          )}
          {activeAdminPage === "utilities-subscriptions" && (
            <SubscriptionPage showToast={showToast} />
          )}
          {activeAdminPage === "assets-management" && (
            <AssetsManagementPage showToast={showToast} />
          )}
          {activeAdminPage === "inventory" && (
            <InventoryPage showToast={showToast} />
          )}
          {activeAdminPage === "sales" && (
            <SalesPage showToast={showToast} />
          )}
          {activeAdminPage === "purchases" && (
            <PurchasesPage showToast={showToast} />
          )}
          {activeAdminPage === "purchase-vendor-setup" && (
            <PurchaseVendorSetupPage showToast={showToast} />
          )}
          {activeAdminPage === "purchase-product" && (
            <PurchaseProductPage showToast={showToast} />
          )}
          {activeAdminPage === "purchase-return" && (
            <PurchaseReturnPage showToast={showToast} />
          )}
          {activeAdminPage === "purchase-payment" && (
            <PurchasePaymentPage showToast={showToast} />
          )}
          {activeAdminPage === "purchase-generate-barcode" && (
            <PurchaseGenerateBarcodePage showToast={showToast} />
          )}

          {activeAdminPage === "accounts" && (
            <AccountsPage showToast={showToast} />
          )}
          {activeAdminPage === "finance-partnership" && (
            <PartnershipPage showToast={showToast} view="summary" />
          )}
          {activeAdminPage === "partnership-investors" && (
            <PartnershipPage showToast={showToast} view="investors" />
          )}
          {activeAdminPage === "partnership-withdrawals" && (
            <PartnershipPage showToast={showToast} view="withdrawals" />
          )}
          {activeAdminPage === "partnership-dividends" && (
            <PartnershipPage showToast={showToast} view="dividends" />
          )}

          {/* HRM Pages */}
          {activeAdminPage === "hrm-attendance" && (
            <HRMAttendancePage showToast={showToast} />
          )}
          {activeAdminPage === "hrm-employees" && (
            <HRMEmployeesPage showToast={showToast} />
          )}
          {activeAdminPage === "hrm-payroll" && (
            <HRMPayrollPage showToast={showToast} />
          )}
          {activeAdminPage === "hrm-loans" && (
            <HRMLoansPage showToast={showToast} />
          )}
          {activeAdminPage === "hrm-catering" && (
            <HRMCateringPage showToast={showToast} />
          )}
          {activeAdminPage === "hrm-overtime" && (
            <HRMOvertimePage showToast={showToast} />
          )}
          {activeAdminPage === "hrm-daily-reports" && (
            <DailyWorkReportsPage showToast={showToast} />
          )}
          {activeAdminPage === "hrm-settings" && (
            <HRMSettingsPage showToast={showToast} />
          )}
          {activeAdminPage === "sales-clients" && (
            <SalesClientSetupPage showToast={showToast} />
          )}
          {activeAdminPage === "sales-invoices" && (
            <SalesInvoicePage showToast={showToast} />
          )}
          {activeAdminPage === "sales-collections" && (
            <SalesCollectionPage showToast={showToast} />
          )}
          {activeAdminPage === "sales-returns" && (
            <SalesReturnPage showToast={showToast} />
          )}
          {activeAdminPage === "sales-return-approvals" && (
            <SalesReturnApprovalPage showToast={showToast} />
          )}
          {activeAdminPage === "sales-pos" && (
            <POSSalesPage showToast={showToast} />
          )}

          {activeAdminPage === "settings" && (
            <SettingsPage showToast={showToast} />
          )}
          {activeAdminPage === "system-company" && (
            <SystemCompanyPage showToast={showToast} />
          )}
          {activeAdminPage === "system-branch" && (
            <SystemBranchPage showToast={showToast} />
          )}
        </>
      )}

      {/* Copy Formatted Text Modal */}
      <CopyTextModal
        isOpen={copyModalState.isOpen}
        title={copyModalState.title}
        textToCopy={copyModalState.text}
        onClose={() => setCopyModalState((prev) => ({ ...prev, isOpen: false }))}
        onCopySuccess={() => showToast("Copied to clipboard!", "success")}
      />

      {/* Print / Save as PDF Modal */}
      {isPrintModalOpen && currentRecord && (
        <PrintReportView
          record={currentRecord}
          onClose={() => setIsPrintModalOpen(false)}
        />
      )}

      {/* Toast Feedback */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </AdminLayout>
  );
}
