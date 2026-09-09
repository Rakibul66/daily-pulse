"use client";

import React from "react";
import { MorningGoal, EODReport } from "@/types/report";
import { MorningGoalForm } from "@/components/goals/MorningGoalForm";

interface MorningGoalPageProps {
  goal: MorningGoal;
  report?: EODReport;
  selectedDate?: string;
  onSelectDate?: (date: string) => void;
  onGoalUpdated: (updated: MorningGoal) => void;
  onReportUpdated?: (updated: EODReport) => void;
  onOpenCopyModal: (title: string, text: string) => void;
  showToast: (msg: string, type?: "success" | "error" | "info") => void;
}

export const MorningGoalPage: React.FC<MorningGoalPageProps> = ({
  goal,
  report,
  selectedDate,
  onSelectDate,
  onGoalUpdated,
  onReportUpdated,
  onOpenCopyModal,
  showToast,
}) => {
  return (
    <div className="space-y-6">
      <MorningGoalForm
        goal={goal}
        report={report}
        selectedDate={selectedDate}
        onSelectDate={onSelectDate}
        onGoalUpdated={onGoalUpdated}
        onReportUpdated={onReportUpdated}
        onOpenCopyModal={onOpenCopyModal}
        showToast={showToast}
      />
    </div>
  );
};
