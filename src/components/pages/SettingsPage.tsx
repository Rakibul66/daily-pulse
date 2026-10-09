"use client";

import React, { useState, useEffect } from "react";
import { SlidersHorizontal, Building } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { 
  FeatureConfig, 
  AVAILABLE_FEATURES, 
  getStoredFeatureConfig, 
  fetchFeatureConfigFromDB, 
  saveFeatureConfigToDB,
  DEFAULT_FEATURE_CONFIG
} from "@/lib/featureConfigStorage";
import { 
  getCompanyProfile, 
  updateCompanyProfile, 
  getBranches, 
  addBranch, 
  updateBranch, 
  deleteBranch 
} from "@/lib/companyStorage";
import { CompanyProfile, Branch } from "@/types/company";
import { LocalizationSettingsSection } from "@/components/settings/LocalizationSettingsSection";
import { FeatureConfigSection } from "@/components/settings/FeatureConfigSection";
import { FeatureConfigModal } from "@/components/settings/FeatureConfigModal";
import { CompanyProfileForm } from "@/components/settings/CompanyProfileForm";
import { BranchLocationsTable } from "@/components/settings/BranchLocationsTable";
import { BranchModal } from "@/components/settings/BranchModal";
import { AccountSecuritySection } from "@/components/settings/AccountSecuritySection";

interface Props {
  showToast: (msg: string, type: "success" | "error") => void;
}

export const SettingsPage: React.FC<Props> = ({ showToast }) => {
  const { user, userProfile } = useAuth();
  const effectiveCompanyId = userProfile?.companyId || user?.uid || "";

  // 1. Regional / Localization state
  const [currency, setCurrency] = useState("BDT");
  const [timezone, setTimezone] = useState("Asia/Dhaka");
  const [language, setLanguage] = useState("en");

  // 2. Feature Config state & modal
  const [featureConfig, setFeatureConfig] = useState<FeatureConfig>(getStoredFeatureConfig());
  const [isConfigModalOpen, setIsConfigModalOpen] = useState(false);

  // 3. Company & Branch state
  const [companyTab, setCompanyTab] = useState<'company' | 'branch'>('company');
  const [isLoadingCompany, setIsLoadingCompany] = useState(true);
  const [isSavingCompany, setIsSavingCompany] = useState(false);
  const [companyForm, setCompanyForm] = useState<Partial<CompanyProfile>>({
    name: '',
    email: '',
    phone: '',
    website: '',
    address: '',
    tradeLicense: '',
    vat: '',
    tin: '',
  });

  // Branch state
  const [branches, setBranches] = useState<Branch[]>([]);
  const [isBranchModalOpen, setIsBranchModalOpen] = useState(false);
  const [editingBranchId, setEditingBranchId] = useState<string | null>(null);
  const [branchForm, setBranchForm] = useState<Partial<Branch>>({
    name: '',
    contactPerson: '',
    email: '',
    phone: '',
    address: '',
    status: 'Active',
  });
  const [isSavingBranch, setIsSavingBranch] = useState(false);

  // Load saved preferences & database records on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedCurrency = localStorage.getItem("dp_currency");
      const savedTimezone = localStorage.getItem("dp_timezone");
      const savedLang = localStorage.getItem("dp_language");

      if (savedCurrency) setCurrency(savedCurrency);
      if (savedTimezone) setTimezone(savedTimezone);
      if (savedLang) setLanguage(savedLang);
    }

    if (effectiveCompanyId) {
      loadAllSettingsData(effectiveCompanyId);
    }
  }, [effectiveCompanyId]);

  const loadAllSettingsData = async (cid: string) => {
    setIsLoadingCompany(true);
    try {
      // 1. Load feature config from database
      const dbConfig = await fetchFeatureConfigFromDB(cid);
      setFeatureConfig(dbConfig);

      // 2. Load company profile
      const comp = await getCompanyProfile(cid);
      if (comp) {
        setCompanyForm(comp);
      } else {
        setCompanyForm(prev => ({
          ...prev,
          name: userProfile?.displayName || user?.displayName || 'My Business',
          email: user?.email || '',
        }));
      }

      // 3. Load branches
      const branchList = await getBranches(cid);
      setBranches(branchList);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoadingCompany(false);
    }
  };

  // Auto-save Currency
  const handleCurrencyChange = (newVal: string) => {
    setCurrency(newVal);
    if (typeof window !== "undefined") {
      localStorage.setItem("dp_currency", newVal);
    }
    showToast(`Currency saved to ${newVal}`, "success");
  };

  // Auto-save Timezone
  const handleTimezoneChange = (newVal: string) => {
    setTimezone(newVal);
    if (typeof window !== "undefined") {
      localStorage.setItem("dp_timezone", newVal);
    }
    showToast(`Timezone saved to ${newVal}`, "success");
  };

  // Auto-save Language
  const handleLanguageChange = (newVal: string) => {
    setLanguage(newVal);
    if (typeof window !== "undefined") {
      localStorage.setItem("dp_language", newVal);
    }
    const langLabel = newVal === "bn" ? "বাংলা (Bengali)" : "English (US)";
    showToast(`Language saved to ${langLabel}`, "success");
  };

  // Toggle individual feature
  const handleToggleFeature = async (key: keyof FeatureConfig) => {
    const updated = {
      ...featureConfig,
      [key]: !featureConfig[key],
    };
    setFeatureConfig(updated);

    try {
      await saveFeatureConfigToDB(effectiveCompanyId, user?.uid || effectiveCompanyId, updated);
      showToast(`${AVAILABLE_FEATURES.find(f => f.key === key)?.title} ${updated[key] ? 'Enabled' : 'Disabled'}`, 'success');
    } catch (e) {
      console.error(e);
      showToast('Failed to update feature settings', 'error');
    }
  };

  // Reset features to default
  const handleResetFeatures = async () => {
    setFeatureConfig(DEFAULT_FEATURE_CONFIG);
    try {
      await saveFeatureConfigToDB(effectiveCompanyId, user?.uid || effectiveCompanyId, DEFAULT_FEATURE_CONFIG);
      showToast('Reset features to defaults (All 5 modular features disabled)', 'success');
    } catch (e) {
      console.error(e);
      showToast('Failed to reset features', 'error');
    }
  };

  // Save Company Profile
  const handleSaveCompany = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!effectiveCompanyId) return;
    setIsSavingCompany(true);
    try {
      await updateCompanyProfile(effectiveCompanyId, companyForm);
      showToast('Company profile saved successfully', 'success');
    } catch (err) {
      console.error(err);
      showToast('Failed to save company profile', 'error');
    } finally {
      setIsSavingCompany(false);
    }
  };

  // Open Branch Modal
  const handleOpenAddBranch = () => {
    setEditingBranchId(null);
    setBranchForm({
      name: '',
      contactPerson: '',
      email: '',
      phone: '',
      address: '',
      status: 'Active',
    });
    setIsBranchModalOpen(true);
  };

  const handleOpenEditBranch = (b: Branch) => {
    setEditingBranchId(b.id);
    setBranchForm(b);
    setIsBranchModalOpen(true);
  };

  // Save Branch
  const handleSaveBranch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!effectiveCompanyId || !branchForm.name?.trim()) {
      showToast('Branch name is required', 'error');
      return;
    }

    setIsSavingBranch(true);
    try {
      if (editingBranchId) {
        await updateBranch(editingBranchId, branchForm);
        showToast('Branch location updated successfully', 'success');
      } else {
        await addBranch(effectiveCompanyId, branchForm as any);
        showToast('New branch location added', 'success');
      }
      setIsBranchModalOpen(false);
      const updated = await getBranches(effectiveCompanyId);
      setBranches(updated);
    } catch (err) {
      console.error(err);
      showToast('Failed to save branch', 'error');
    } finally {
      setIsSavingBranch(false);
    }
  };

  // Delete Branch
  const handleDeleteBranch = async (id: string) => {
    if (!confirm('Are you sure you want to delete this branch location?')) return;
    try {
      await deleteBranch(id);
      showToast('Branch location deleted successfully', 'success');
      const updated = await getBranches(effectiveCompanyId);
      setBranches(updated);
    } catch (err) {
      console.error(err);
      showToast('Failed to delete branch', 'error');
    }
  };

  // Count active modules
  const activeFeatureCount = Object.values(featureConfig).filter(Boolean).length;

  return (
    <div className="w-full pb-24 px-0 space-y-8">
      {/* Outer Neo-Brutalist Frame */}
      <div className="bg-white border-4 border-black shadow-[8px_8px_0px_#000] w-full flex flex-col">
        
        {/* Header Bar */}
        <div className="px-6 py-4 flex flex-wrap items-center justify-between border-b-4 border-black bg-amber-300 gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-black text-amber-300 flex items-center justify-center border-2 border-black font-black">
              <SlidersHorizontal className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl font-display font-black text-black uppercase tracking-tight">
                WORKSPACE SETTINGS & CONFIGURATION
              </h1>
              <p className="text-xs font-bold text-black uppercase tracking-wider">
                System Customizations, Feature Toggles & Multi-Branch Setup
              </p>
            </div>
          </div>
        </div>

        {/* 1. SECTION: ACCOUNT SECURITY, PASSWORD & EMAIL VERIFICATION */}
        <div className="p-6 sm:p-8 bg-white border-b-4 border-black">
          <AccountSecuritySection showToast={showToast} />
        </div>

        {/* 2. SECTION: LOCALIZATION & REGIONAL PREFERENCES */}
        <LocalizationSettingsSection
          language={language}
          currency={currency}
          timezone={timezone}
          onLanguageChange={handleLanguageChange}
          onCurrencyChange={handleCurrencyChange}
          onTimezoneChange={handleTimezoneChange}
        />

        {/* 2. SECTION: CONFIG FEATURES (FEATURE MODULES CONFIGURATION) */}
        <FeatureConfigSection
          activeFeatureCount={activeFeatureCount}
          onOpenModal={() => setIsConfigModalOpen(true)}
        />

        {/* 3. SECTION: COMPANY & BRANCH SETUP */}
        <div className="p-6 sm:p-8 bg-white">
          <div className="max-w-4xl space-y-6">
            
            {/* Header with Sub-tabs */}
            <div className="border-b-2 border-black pb-4 flex flex-wrap items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2.5">
                  <Building className="w-5 h-5 text-indigo-600 stroke-[2.5]" />
                  <h2 className="font-display font-black text-base uppercase text-black tracking-wider">
                    COMPANY & BRANCH LOCATIONS SETUP
                  </h2>
                </div>
                <p className="text-[11px] font-bold text-slate-600 uppercase mt-0.5">
                  Manage legal company registration, billing VAT/TIN, and physical branches
                </p>
              </div>

              {/* Sub-tab Switcher */}
              <div className="flex items-center border-2 border-black shadow-[2px_2px_0px_#000] bg-white">
                <button
                  type="button"
                  onClick={() => setCompanyTab('company')}
                  className={`px-4 py-1.5 text-xs font-black uppercase tracking-wider transition-colors cursor-pointer ${
                    companyTab === 'company' 
                      ? 'bg-amber-300 text-black border-r-2 border-black' 
                      : 'bg-white text-slate-700 hover:bg-slate-100 border-r-2 border-black'
                  }`}
                >
                  🏢 COMPANY PROFILE
                </button>
                <button
                  type="button"
                  onClick={() => setCompanyTab('branch')}
                  className={`px-4 py-1.5 text-xs font-black uppercase tracking-wider transition-colors cursor-pointer ${
                    companyTab === 'branch' 
                      ? 'bg-amber-300 text-black' 
                      : 'bg-white text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  📍 BRANCH LOCATIONS ({branches.length})
                </button>
              </div>
            </div>

            {/* SUB-TAB 1: COMPANY PROFILE FORM */}
            {companyTab === 'company' && (
              <CompanyProfileForm
                companyForm={companyForm}
                onChange={setCompanyForm}
                onSubmit={handleSaveCompany}
                isSaving={isSavingCompany}
              />
            )}

            {/* SUB-TAB 2: BRANCH LOCATIONS */}
            {companyTab === 'branch' && (
              <BranchLocationsTable
                branches={branches}
                onOpenAddBranch={handleOpenAddBranch}
                onOpenEditBranch={handleOpenEditBranch}
                onDeleteBranch={handleDeleteBranch}
              />
            )}

          </div>
        </div>

      </div>

      {/* 4. CONFIG FEATURE MODAL */}
      <FeatureConfigModal
        isOpen={isConfigModalOpen}
        onClose={() => setIsConfigModalOpen(false)}
        featureConfig={featureConfig}
        onToggleFeature={handleToggleFeature}
        onResetFeatures={handleResetFeatures}
      />

      {/* 5. ADD / EDIT BRANCH MODAL */}
      <BranchModal
        isOpen={isBranchModalOpen}
        onClose={() => setIsBranchModalOpen(false)}
        editingBranchId={editingBranchId}
        branchForm={branchForm}
        onChange={setBranchForm}
        onSubmit={handleSaveBranch}
        isSaving={isSavingBranch}
      />

    </div>
  );
};
