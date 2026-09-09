"use client";

import React, { useState } from "react";
import { Sidebar, AdminPageId } from "./Sidebar";
import { AdminTopBar } from "./AdminTopBar";

interface AdminLayoutProps {
  activePage: AdminPageId;
  setActivePage: (page: AdminPageId) => void;
  selectedDate: string;
  setSelectedDate: (date: string) => void;
  hasMorningGoal?: boolean;
  hasEODReport?: boolean;
  onOpenPrintModal: () => void;
  onOpenFirebaseModal?: () => void;
  children: React.ReactNode;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({
  activePage,
  setActivePage,
  selectedDate,
  setSelectedDate,
  hasMorningGoal,
  hasEODReport,
  onOpenPrintModal,
  onOpenFirebaseModal,
  children,
}) => {
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-950 flex text-slate-100">
      {/* Sidebar */}
      <Sidebar
        activePage={activePage}
        setActivePage={setActivePage}
        isOpenMobile={isMobileSidebarOpen}
        onCloseMobile={() => setIsMobileSidebarOpen(false)}
        hasMorningGoal={hasMorningGoal}
        hasEODReport={hasEODReport}
      />

      {/* Main Content Viewport */}
      <div className="flex-1 flex flex-col min-w-0 lg:pl-64">
        <AdminTopBar
          activePage={activePage}
          selectedDate={selectedDate}
          setSelectedDate={setSelectedDate}
          onToggleMobileSidebar={() => setIsMobileSidebarOpen((prev) => !prev)}
        />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 w-full">
          {children}
        </main>
      </div>
    </div>
  );
};
