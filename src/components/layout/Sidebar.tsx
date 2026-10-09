"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import {
  Search,
  Settings,
  Briefcase,
  TrendingUp,
  Layers,
  Package,
  X,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { 
  getStoredFeatureConfig, 
  fetchFeatureConfigFromDB, 
  FeatureConfig 
} from "@/lib/featureConfigStorage";
import {
  AdminPageId,
  CRM_NAV_ITEMS,
  PRODUCT_NAV_ITEMS,
  SALES_NAV_ITEMS,
  HRM_NAV_ITEMS,
  UTILITIES_NAV_ITEMS,
  PARTNERSHIP_NAV_ITEMS,
} from "./sidebar/types";
import { SidebarUserProfile } from "./sidebar/SidebarUserProfile";
import { SidebarCollapsibleSection } from "./sidebar/SidebarCollapsibleSection";
import { SidebarPurchaseSection } from "./sidebar/SidebarPurchaseSection";

export type { AdminPageId };

interface SidebarProps {
  activePage: AdminPageId;
  setActivePage: (page: AdminPageId) => void;
  isOpenMobile: boolean;
  onCloseMobile: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activePage,
  setActivePage,
  isOpenMobile,
  onCloseMobile,
}) => {
  const { user, userProfile, signOutUser } = useAuth();
  const [featureConfig, setFeatureConfig] = useState<FeatureConfig>(getStoredFeatureConfig());
  
  const [isCrmOpen, setIsCrmOpen] = useState(false);
  const [isHrmOpen, setIsHrmOpen] = useState(false);
  const [isSalesOpen, setIsSalesOpen] = useState(false);
  const [isProductOpen, setIsProductOpen] = useState(false);
  const [isPurchaseOpen, setIsPurchaseOpen] = useState(false);
  const [isPurchaseTxOpen, setIsPurchaseTxOpen] = useState(false);
  const [isPurchaseReportsOpen, setIsPurchaseReportsOpen] = useState(false);
  const [isPartnershipsOpen, setIsPartnershipsOpen] = useState(false);
  const [isUtilitiesOpen, setIsUtilitiesOpen] = useState(false);

  useEffect(() => {
    const handleConfigChange = () => {
      setFeatureConfig(getStoredFeatureConfig());
    };
    window.addEventListener('dp_feature_config_updated', handleConfigChange);

    const targetId = userProfile?.companyId || user?.uid;
    if (targetId) {
      fetchFeatureConfigFromDB(targetId).then((cfg) => {
        setFeatureConfig(cfg);
      });
    }

    return () => window.removeEventListener('dp_feature_config_updated', handleConfigChange);
  }, [userProfile?.companyId, user?.uid]);

  useEffect(() => {
    if (["crm-dashboard", "crm-leads", "customers-list"].includes(activePage)) {
      setIsCrmOpen(true);
    }
  }, [activePage]);

  useEffect(() => {
    if (["product-category", "product-brand", "product-tag", "product-setup", "product-list", "product-uom", "delivery-man"].includes(activePage)) {
      setIsProductOpen(true);
    }
  }, [activePage]);

  useEffect(() => {
    if ([
      "purchase-vendor-setup",
      "purchase-product",
      "purchase-return",
      "purchase-payment",
      "purchase-generate-barcode",
      "purchase-vendor-statement",
    ].includes(activePage)) {
      setIsPurchaseOpen(true);
      if (activePage === "purchase-vendor-statement") {
        setIsPurchaseReportsOpen(true);
      } else {
        setIsPurchaseTxOpen(true);
      }
    }
  }, [activePage]);

  useEffect(() => {
    if (["lost-and-found", "hrm-catering", "customers-promotions", "customers-feedback", "utilities-subscriptions"].includes(activePage)) {
      setIsUtilitiesOpen(true);
    }
  }, [activePage]);

  useEffect(() => {
    if ([
      "sales-clients",
      "sales-invoices",
      "sales-collections",
      "sales-returns",
      "sales-return-approvals",
      "sales-pos",
      "sales-retail-returns",
    ].includes(activePage)) {
      setIsSalesOpen(true);
    }
  }, [activePage]);

  const handleSelect = (pageId: AdminPageId) => {
    setActivePage(pageId);
    onCloseMobile();
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpenMobile && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-40 lg:hidden"
        />
      )}

      {/* Sidebar Shell */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-64 bg-white border-r-4 border-black shadow-[4px_0px_0px_#000] flex flex-col transition-transform duration-300 ease-in-out lg:translate-x-0 text-black ${
          isOpenMobile ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Brand Header */}
        <div className="h-16 px-5 border-b-4 border-black flex items-center justify-between bg-white">
          <div className="flex items-center gap-2.5">
            <Image
              src="/somporko.webp"
              alt="Shomporko Logo"
              width={34}
              height={34}
              className="object-contain"
            />
            <div>
              <h1 className="font-display font-black text-sm tracking-tight text-black leading-none uppercase">
                SHOMPORKO
              </h1>
              <span className="text-[9px] font-black text-indigo-600 tracking-widest uppercase">
                CRM & POS
              </span>
            </div>
          </div>

          <button
            onClick={onCloseMobile}
            className="p-1 bg-white hover:bg-red-600 hover:text-white border-2 border-black shadow-[2px_2px_0px_#000] text-black lg:hidden cursor-pointer"
          >
            <X className="w-4 h-4 stroke-[2.5]" />
          </button>
        </div>

        {/* Navigation Menu */}
        <div className="flex-1 px-3 py-4 space-y-1.5 overflow-y-auto custom-scrollbar">
          <div className="px-3 pb-2 font-display text-[11px] font-black uppercase tracking-wider text-black">
            WORKSPACE MENUS
          </div>

          {/* Dashboard */}
          <div className="pt-1">
            <button
              onClick={() => handleSelect('dashboard')}
              className={`w-full flex items-center justify-between px-3 py-2.5 text-xs font-display font-black uppercase tracking-wider transition-all border-2 cursor-pointer ${
                activePage === 'dashboard'
                  ? "bg-indigo-600 text-white border-black shadow-[3px_3px_0px_#000]"
                  : "text-black bg-white border-transparent hover:border-black hover:bg-amber-300 hover:shadow-[2px_2px_0px_#000]"
              }`}
            >
              <div className="flex items-center gap-3">
                <svg className="w-4 h-4 stroke-[2.5]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="3" width="7" height="7"></rect>
                  <rect x="14" y="3" width="7" height="7"></rect>
                  <rect x="14" y="14" width="7" height="7"></rect>
                  <rect x="3" y="14" width="7" height="7"></rect>
                </svg>
                <span>DASHBOARD</span>
              </div>
            </button>
          </div>

          {/* CRM (Modular - Default: false) */}
          {featureConfig.crm && (
            <SidebarCollapsibleSection
              label="CRM"
              icon={<Search className="w-4 h-4 stroke-[2.5]" />}
              isOpen={isCrmOpen}
              onToggle={() => setIsCrmOpen(!isCrmOpen)}
              items={CRM_NAV_ITEMS}
              activePage={activePage}
              onSelect={handleSelect}
            />
          )}

          {/* Product Management (Modular - Default: false) */}
          {featureConfig.product && (
            <SidebarCollapsibleSection
              label="PRODUCT MANAGEMENT"
              icon={<Package className="w-4 h-4 stroke-[2.5]" />}
              isOpen={isProductOpen}
              onToggle={() => setIsProductOpen(!isProductOpen)}
              items={PRODUCT_NAV_ITEMS}
              activePage={activePage}
              onSelect={handleSelect}
              isAmberActive={true}
            />
          )}

          {/* Purchase Management (Modular - Default: false) */}
          {featureConfig.purchase && (
            <SidebarPurchaseSection
              isOpen={isPurchaseOpen}
              onToggle={() => setIsPurchaseOpen(!isPurchaseOpen)}
              isTxOpen={isPurchaseTxOpen}
              onToggleTx={() => setIsPurchaseTxOpen(!isPurchaseTxOpen)}
              isReportsOpen={isPurchaseReportsOpen}
              onToggleReports={() => setIsPurchaseReportsOpen(!isPurchaseReportsOpen)}
              activePage={activePage}
              onSelect={handleSelect}
            />
          )}

          {/* Sales Management (Modular - Default: false) */}
          {featureConfig.salesManagement && (
            <SidebarCollapsibleSection
              label="SALES MANAGEMENT"
              icon={<TrendingUp className="w-4 h-4 stroke-[2.5]" />}
              isOpen={isSalesOpen}
              onToggle={() => setIsSalesOpen(!isSalesOpen)}
              items={SALES_NAV_ITEMS}
              activePage={activePage}
              onSelect={handleSelect}
            />
          )}

          {/* HRM & Payroll (Always kept) */}
          <SidebarCollapsibleSection
            label="HRM & PAYROLL"
            icon={<Briefcase className="w-4 h-4 stroke-[2.5]" />}
            isOpen={isHrmOpen}
            onToggle={() => setIsHrmOpen(!isHrmOpen)}
            items={HRM_NAV_ITEMS}
            activePage={activePage}
            onSelect={handleSelect}
          />

          {/* Utilities (Always kept) */}
          <SidebarCollapsibleSection
            label="UTILITIES"
            icon={<Layers className="w-4 h-4 stroke-[2.5]" />}
            isOpen={isUtilitiesOpen}
            onToggle={() => setIsUtilitiesOpen(!isUtilitiesOpen)}
            items={UTILITIES_NAV_ITEMS}
            activePage={activePage}
            onSelect={handleSelect}
          />

          {/* Partnership (Modular - Default: false) */}
          {featureConfig.partnerships && (
            <SidebarCollapsibleSection
              label="PARTNERSHIP"
              icon={<Briefcase className="w-4 h-4 stroke-[2.5]" />}
              isOpen={isPartnershipsOpen}
              onToggle={() => setIsPartnershipsOpen(!isPartnershipsOpen)}
              items={PARTNERSHIP_NAV_ITEMS}
              activePage={activePage}
              onSelect={handleSelect}
            />
          )}

          {/* Global Settings (Always Visible) */}
          <div className="pt-3 mt-3 border-t-2 border-black">
            <button
              onClick={() => handleSelect("settings")}
              className={`w-full flex items-center gap-3 px-3 py-2.5 text-xs font-display font-black uppercase tracking-wider transition-all border-2 cursor-pointer ${
                activePage === "settings"
                  ? "bg-indigo-600 text-white border-black shadow-[3px_3px_0px_#000]"
                  : "text-black bg-white border-transparent hover:border-black hover:bg-amber-300 hover:shadow-[2px_2px_0px_#000]"
              }`}
            >
              <Settings className="w-4 h-4 stroke-[2.5]" />
              <span>SETTINGS</span>
            </button>
          </div>
        </div>

        {/* User Profile Card & Sign Out */}
        <SidebarUserProfile
          user={user}
          role={userProfile?.role}
          onSignOut={signOutUser}
        />
      </aside>
    </>
  );
};
