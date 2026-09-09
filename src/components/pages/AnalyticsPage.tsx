"use client";

import React from "react";
import { RangeReportView } from "@/components/analytics/RangeReportView";
import { AdminPageId } from "../layout/Sidebar";

interface AnalyticsPageProps {
  onSelectDate: (dateStr: string, tab: "goal" | "eod") => void;
  onOpenCopyModal: (title: string, text: string) => void;
  showToast: (msg: string, type?: "success" | "error" | "info") => void;
}

export const AnalyticsPage: React.FC<AnalyticsPageProps> = ({
  onSelectDate,
  onOpenCopyModal,
  showToast,
}) => {
  return (
    <div className="space-y-6">
      <RangeReportView
        onSelectDate={onSelectDate}
        onOpenCopyModal={onOpenCopyModal}
        showToast={showToast}
      />
    </div>
  );
};
