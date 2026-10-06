"use client";

import React, { useState, useEffect, useCallback } from "react";
import dynamicImport from "next/dynamic";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { AdminPageId } from "@/components/layout/Sidebar";
import { LandingPage } from "@/components/landing/LandingPage";
import { AuthModal } from "@/components/auth/AuthModal";
import { CopyTextModal } from "@/components/export/CopyTextModal";
import { Toast } from "@/components/ui/Toast";
import { DailyRecord, MorningGoal, EODReport } from "@/types/report";
import { getRecordForDate } from "@/lib/storage";
import { createDefaultMorningGoal, createDefaultEODReport } from "@/lib/defaultData";
import { getTodayDateString } from "@/lib/formatters";
import { useAuth } from "@/context/AuthContext";
import { Loader2 } from "lucide-react";

const PageLoader = () => (
  <div className="flex flex-col items-center justify-center py-20 space-y-3">
    <Loader2 className="w-8 h-8 text-primary-600 animate-spin" />
    <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Loading page module...</p>
  </div>
);

// Dynamic component sharding for minimal bundle & fast caching
const CRMDashboardPage = dynamicImport(() => import("@/components/pages/CRMDashboardPage").then(m => m.CRMDashboardPage), { loading: PageLoader });
const CRMLeadsPage = dynamicImport(() => import("@/components/pages/CRMLeadsPage").then(m => m.CRMLeadsPage), { loading: PageLoader });
const CRMRecentLeadsPage = dynamicImport(() => import("@/components/pages/CRMRecentLeadsPage").then(m => m.CRMRecentLeadsPage), { loading: PageLoader });
const CRMAILeadPage = dynamicImport(() => import("@/components/pages/CRMAILeadPage").then(m => m.CRMAILeadPage), { loading: PageLoader });
const CustomersPage = dynamicImport(() => import("@/components/pages/CustomersPage").then(m => m.CustomersPage), { loading: PageLoader });
const PromotionsPage = dynamicImport(() => import("@/components/pages/PromotionsPage").then(m => m.PromotionsPage), { loading: PageLoader });
const CustomerFeedbackPage = dynamicImport(() => import("@/components/pages/CustomerFeedbackPage").then(m => m.CustomerFeedbackPage), { loading: PageLoader });
const LostAndFoundPage = dynamicImport(() => import("@/components/pages/LostAndFoundPage").then(m => m.LostAndFoundPage), { loading: PageLoader });
const AssetsManagementPage = dynamicImport(() => import("@/components/pages/AssetsManagementPage").then(m => m.AssetsManagementPage), { loading: PageLoader });
const InventoryPage = dynamicImport(() => import("@/components/pages/InventoryPage").then(m => m.InventoryPage), { loading: PageLoader });
const SalesPage = dynamicImport(() => import("@/components/pages/SalesPage").then(m => m.SalesPage), { loading: PageLoader });
const PurchasesPage = dynamicImport(() => import("@/components/pages/PurchasesPage").then(m => m.PurchasesPage), { loading: PageLoader });
const PurchaseVendorSetupPage = dynamicImport(() => import("@/components/pages/PurchaseVendorSetupPage").then(m => m.PurchaseVendorSetupPage), { loading: PageLoader });
const PurchaseProductPage = dynamicImport(() => import("@/components/pages/PurchaseProductPage").then(m => m.PurchaseProductPage), { loading: PageLoader });
const PurchaseReturnPage = dynamicImport(() => import("@/components/pages/PurchaseReturnPage").then(m => m.PurchaseReturnPage), { loading: PageLoader });
const PurchasePaymentPage = dynamicImport(() => import("@/components/pages/PurchasePaymentPage").then(m => m.PurchasePaymentPage), { loading: PageLoader });
const PurchaseGenerateBarcodePage = dynamicImport(() => import("@/components/pages/PurchaseGenerateBarcodePage").then(m => m.PurchaseGenerateBarcodePage), { loading: PageLoader });

const AccountsPage = dynamicImport(() => import("@/components/pages/AccountsPage").then(m => m.AccountsPage), { loading: PageLoader });
const SalesClientSetupPage = dynamicImport(() => import("@/components/pages/SalesClientSetupPage").then(m => m.SalesClientSetupPage), { loading: PageLoader });
const SalesInvoicePage = dynamicImport(() => import("@/components/pages/SalesInvoicePage").then(m => m.SalesInvoicePage), { loading: PageLoader });
const SalesCollectionPage = dynamicImport(() => import("@/components/pages/SalesCollectionPage").then(m => m.SalesCollectionPage), { loading: PageLoader });
const SalesReturnPage = dynamicImport(() => import("@/components/pages/SalesReturnPage").then(m => m.SalesReturnPage), { loading: PageLoader });
const SalesReturnApprovalPage = dynamicImport(() => import("@/components/pages/SalesReturnApprovalPage").then(m => m.SalesReturnApprovalPage), { loading: PageLoader });
const POSSalesPage = dynamicImport(() => import("@/components/pages/POSSalesPage").then(m => m.POSSalesPage), { loading: PageLoader });
const MainDashboardPage = dynamicImport(() => import("@/components/pages/MainDashboardPage").then(m => m.MainDashboardPage), { loading: PageLoader });
const SystemCompanyPage = dynamicImport(() => import("@/components/pages/SystemCompanyPage").then(m => m.SystemCompanyPage), { loading: PageLoader });
const SystemBranchPage = dynamicImport(() => import("@/components/pages/SystemBranchPage").then(m => m.SystemBranchPage), { loading: PageLoader });
const SubscriptionPage = dynamicImport(() => import("@/components/pages/SubscriptionPage").then(m => m.SubscriptionPage), { loading: PageLoader });
const SettingsPage = dynamicImport(() => import("@/components/pages/SettingsPage").then(m => m.SettingsPage), { loading: PageLoader });
const PartnershipPage = dynamicImport(() => import("@/components/pages/PartnershipPage").then(m => m.PartnershipPage), { loading: PageLoader });
const HRMAttendancePage = dynamicImport(() => import("@/components/pages/HRMAttendancePage").then(m => m.HRMAttendancePage), { loading: PageLoader });
const HRMEmployeesPage = dynamicImport(() => import("@/components/pages/HRMEmployeesPage").then(m => m.HRMEmployeesPage), { loading: PageLoader });
const HRMPayrollPage = dynamicImport(() => import("@/components/pages/HRMPayrollPage").then(m => m.HRMPayrollPage), { loading: PageLoader });
const HRMLoansPage = dynamicImport(() => import("@/components/pages/HRMLoansPage").then(m => m.HRMLoansPage), { loading: PageLoader });
const HRMCateringPage = dynamicImport(() => import("@/components/pages/HRMCateringPage").then(m => m.HRMCateringPage), { loading: PageLoader });
const HRMOvertimePage = dynamicImport(() => import("@/components/pages/HRMOvertimePage").then(m => m.HRMOvertimePage), { loading: PageLoader });
const HRMSettingsPage = dynamicImport(() => import("@/components/pages/hrm/HRMSettingsPage").then(m => m.HRMSettingsPage), { loading: PageLoader });
const DailyWorkReportsPage = dynamicImport(() => import("@/components/pages/hrm/DailyWorkReportsPage").then(m => m.DailyWorkReportsPage), { loading: PageLoader });
const PrintReportView = dynamicImport(() => import("@/components/export/PrintReportView").then(m => m.PrintReportView), { loading: PageLoader });

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

  const showToast = useCallback((message: string, type: "success" | "error" | "info" = "success") => {
    setToast({ message, type });
  }, []);

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
  }, [showToast]);

  useEffect(() => {
    if (user) {
      loadRecord(selectedDate, user.uid);
    }
  }, [selectedDate, user, loadRecord]);

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
