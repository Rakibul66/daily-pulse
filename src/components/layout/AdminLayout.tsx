"use client";

import React, { useState } from "react";
import { Sidebar, AdminPageId } from "./Sidebar";
import { AdminTopBar } from "./AdminTopBar";

interface AdminLayoutProps {
  activePage: AdminPageId;
  setActivePage: (page: AdminPageId) => void;
  children: React.ReactNode;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({
  activePage,
  setActivePage,
  children,
}) => {
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex text-slate-900 dark:text-slate-100">
      {/* Sidebar */}
      <Sidebar
        activePage={activePage}
        setActivePage={setActivePage}
        isOpenMobile={isMobileSidebarOpen}
        onCloseMobile={() => setIsMobileSidebarOpen(false)}
      />

      {/* Main Content Viewport */}
      <div className="flex-1 flex flex-col min-w-0 lg:pl-64">
        <AdminTopBar
          activePage={activePage}
          onToggleMobileSidebar={() => setIsMobileSidebarOpen((prev) => !prev)}
        />

        <main className="flex-1 p-4 sm:p-5 lg:p-6 w-full">
          {children}
        </main>
      </div>
    </div>
  );
};
