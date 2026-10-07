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
    <div className="min-h-screen bg-white flex text-black font-sans neo-admin-wrapper selection:bg-indigo-600 selection:text-white">
      {/* Sidebar */}
      <Sidebar
        activePage={activePage}
        setActivePage={setActivePage}
        isOpenMobile={isMobileSidebarOpen}
        onCloseMobile={() => setIsMobileSidebarOpen(false)}
      />

      {/* Main Content Viewport */}
      <div className="flex-1 flex flex-col min-w-0 lg:pl-64 bg-white relative">
        {/* Subtle background grid pattern */}
        <div className="absolute inset-0 opacity-[0.035] bg-[linear-gradient(to_right,#000_1px,transparent_1px),linear-gradient(to_bottom,#000_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none" />

        <AdminTopBar
          activePage={activePage}
          onToggleMobileSidebar={() => setIsMobileSidebarOpen((prev) => !prev)}
        />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 w-full relative z-10">
          {children}
        </main>
      </div>
    </div>
  );
};
