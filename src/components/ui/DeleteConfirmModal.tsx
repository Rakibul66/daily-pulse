"use client";

import React from "react";
import { AlertTriangle, X, Trash2 } from "lucide-react";

interface DeleteConfirmModalProps {
  isOpen: boolean;
  title?: string;
  itemName: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export const DeleteConfirmModal: React.FC<DeleteConfirmModalProps> = ({
  isOpen,
  title = "Delete Item",
  itemName,
  onConfirm,
  onCancel,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 pt-10 sm:pt-14 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white border-2 sm:border-4 border-black shadow-[8px_8px_0px_#000] max-w-md w-full overflow-hidden flex flex-col relative animate-in zoom-in-95 duration-150 text-black">
        {/* Accent Top Strip */}
        <div className="h-2 bg-red-500 border-b-2 border-black w-full" />

        {/* Header */}
        <div className="px-5 py-3.5 border-b-2 border-black bg-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 bg-red-100 border-2 border-black shadow-[2px_2px_0px_#000]">
              <AlertTriangle className="w-4 h-4 text-red-600 stroke-[2.5]" />
            </div>
            <h3 className="text-sm font-black uppercase tracking-wider text-black">{title}</h3>
          </div>
          <button
            onClick={onCancel}
            className="p-1 bg-white hover:bg-slate-200 border-2 border-black transition-colors cursor-pointer"
          >
            <X className="w-4 h-4 stroke-[3]" />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 space-y-4">
          <p className="text-xs font-bold text-slate-700 leading-relaxed uppercase">
            Are you sure you want to delete{" "}
            <strong className="text-black font-black">&ldquo;{itemName}&rdquo;</strong>?
            This action cannot be undone.
          </p>
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t-2 border-black bg-slate-50 flex items-center justify-end gap-3">
          <button
            onClick={onCancel}
            className="px-4 py-2 text-xs font-black uppercase text-black bg-white hover:bg-slate-200 border-2 border-black transition-all cursor-pointer shadow-[2px_2px_0px_#000] active:translate-x-0.5 active:translate-y-0.5"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-5 py-2 text-xs font-black uppercase text-white bg-red-600 hover:bg-red-500 border-2 border-black transition-all cursor-pointer shadow-[2px_2px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 flex items-center gap-1.5"
          >
            <Trash2 className="w-3.5 h-3.5 stroke-[2.5]" /> Delete Permanently
          </button>
        </div>
      </div>
    </div>
  );
};
