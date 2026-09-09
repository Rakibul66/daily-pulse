"use client";

import React, { useState } from "react";
import { Copy, Check, X, FileText, Sparkles } from "lucide-react";

interface CopyTextModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  textToCopy: string;
  onCopySuccess: () => void;
}

export const CopyTextModal: React.FC<CopyTextModalProps> = ({
  isOpen,
  onClose,
  title,
  textToCopy,
  onCopySuccess,
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(textToCopy);
      setCopied(true);
      onCopySuccess();
      setTimeout(() => setCopied(false), 2500);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[85vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/50">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-semibold text-slate-900">{title}</h3>
              <p className="text-xs text-slate-500">
                Ready to paste into WhatsApp, Slack, Telegram, or Notion
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Box */}
        <div className="p-6 overflow-y-auto flex-1 bg-slate-50/30">
          <div className="relative">
            <pre className="font-mono text-xs md:text-sm text-slate-800 bg-white p-5 rounded-xl border border-slate-200 whitespace-pre-wrap leading-relaxed shadow-xs selection:bg-indigo-100">
              {textToCopy}
            </pre>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-slate-100 bg-white">
          <span className="text-xs text-slate-400 flex items-center gap-1">
            <FileText className="w-3.5 h-3.5" /> Markdown formatted
          </span>
          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-colors"
            >
              Close
            </button>
            <button
              onClick={handleCopy}
              className={`flex items-center gap-2 px-5 py-2 rounded-xl font-medium text-sm text-white shadow-sm transition-all active:scale-95 ${
                copied
                  ? "bg-emerald-600 hover:bg-emerald-700"
                  : "bg-indigo-600 hover:bg-indigo-700"
              }`}
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4" /> Copied to Clipboard!
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" /> Copy Formatted Text
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
