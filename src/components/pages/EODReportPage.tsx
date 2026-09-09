"use client";

import React from "react";
import { EODReport, MorningGoal } from "@/types/report";
import { EODReportForm } from "@/components/eod/EODReportForm";

interface EODReportPageProps {
  report: EODReport;
  morningGoal?: MorningGoal;
  onReportUpdated: (updated: EODReport) => void;
  onOpenCopyModal: (title: string, text: string) => void;
  onOpenPrintModal: () => void;
  showToast: (msg: string, type?: "success" | "error" | "info") => void;
}

export const EODReportPage: React.FC<EODReportPageProps> = ({
  report,
  morningGoal,
  onReportUpdated,
  onOpenCopyModal,
  onOpenPrintModal,
  showToast,
}) => {
  return (
    <div className="space-y-6">
      <EODReportForm
        report={report}
        morningGoal={morningGoal}
        onReportUpdated={onReportUpdated}
        onOpenCopyModal={onOpenCopyModal}
        onOpenPrintModal={onOpenPrintModal}
        showToast={showToast}
      />
    </div>
  );
};
