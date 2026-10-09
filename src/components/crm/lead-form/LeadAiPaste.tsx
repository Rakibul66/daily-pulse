import React, { useState } from "react";
import { Sparkles, Loader2 } from "lucide-react";
import { checkRateLimit, RATE_LIMIT_PRESETS } from "@/lib/rateLimit";
import { BUSINESS_CATEGORIES, inputClasses, LeadFormData } from "./types";

interface LeadAiPasteProps {
  apiKey: string;
  onApplyParsedData: (updater: (prev: LeadFormData) => LeadFormData) => void;
}

export const LeadAiPaste: React.FC<LeadAiPasteProps> = ({ apiKey, onApplyParsedData }) => {
  const [aiInput, setAiInput] = useState('');
  const [isAiLoading, setIsAiLoading] = useState(false);

  const handleAiParse = async () => {
    if (!aiInput.trim()) return alert("Please paste some text first.");
    if (!apiKey) return alert("Gemini API Key is missing in Settings.");
    
    // Rate limit check for AI requests
    const rl = checkRateLimit(
      'ai_lead_parse',
      RATE_LIMIT_PRESETS.AI_PROSPECT.max,
      RATE_LIMIT_PRESETS.AI_PROSPECT.windowMs,
      RATE_LIMIT_PRESETS.AI_PROSPECT.penaltyMs
    );
    if (!rl.allowed) {
      alert(rl.message || "AI rate limit reached. Please wait a moment.");
      return;
    }

    setIsAiLoading(true);
    try {
      const prompt = `
      Extract lead information from the following text and output ONLY valid JSON matching this exact structure (leave empty strings if not found):
      {
        "businessName": "string",
        "whatsapp": "string",
        "ownerName": "string",
        "phone": "string",
        "locationArea": "string",
        "businessType": "string (try to match: Restaurant, E-commerce, Retail, Service, Agency, Education, Other)",
        "businessSubType": "string",
        "currentPos": "string",
        "painPoint": "string",
        "notes": "string",
        "leadSource": "string (Facebook, WhatsApp, Google, Referral, Cold Call, Other)",
        "dealValue": number
      }
      Text:
      "${aiInput}"
      `;

      const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: { response_mime_type: "application/json" }
        })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error?.message || "API Error");
      
      const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
      if (text) {
        const parsed = JSON.parse(text);
        onApplyParsedData(prev => ({
          ...prev,
          businessName: parsed.businessName || prev.businessName,
          whatsapp: parsed.whatsapp || parsed.phone || prev.whatsapp,
          phone: parsed.phone || parsed.whatsapp || prev.phone,
          ownerName: parsed.ownerName || prev.ownerName,
          locationArea: parsed.locationArea || prev.locationArea,
          businessType: BUSINESS_CATEGORIES[parsed.businessType] ? parsed.businessType : prev.businessType,
          businessSubType: parsed.businessSubType || prev.businessSubType,
          currentPos: parsed.currentPos || prev.currentPos,
          painPoint: parsed.painPoint || prev.painPoint,
          notes: parsed.notes || prev.notes,
          leadSource: parsed.leadSource || prev.leadSource,
          dealValue: typeof parsed.dealValue === 'number' ? parsed.dealValue : prev.dealValue,
        }));
        setAiInput('');
      }
    } catch (err) {
      console.error(err);
      alert("Failed to parse using AI: " + (err as Error).message);
    } finally {
      setIsAiLoading(false);
    }
  };

  return (
    <div className="bg-emerald-50 border-3 border-black p-4 mb-4 shadow-[4px_4px_0px_#000]">
      <div className="flex items-center gap-2 mb-1.5">
        <Sparkles className="w-4 h-4 text-emerald-700 stroke-[2.5]" />
        <h3 className="text-xs font-black uppercase tracking-wider text-black">AI Smart Paste</h3>
      </div>
      <p className="text-[11px] font-bold text-slate-700 mb-3">
        Paste unstructured text (WhatsApp, email, message) to auto-fill.
      </p>
      <div className="flex flex-col sm:flex-row gap-2.5 items-stretch sm:items-start">
        <textarea
          value={aiInput}
          onChange={e => setAiInput(e.target.value)}
          rows={2}
          className={`${inputClasses} resize-none flex-1`}
          placeholder="Paste lead message or number here..."
        />
        <button
          type="button"
          onClick={handleAiParse}
          disabled={isAiLoading || !aiInput.trim()}
          className="px-4 py-2 bg-black hover:bg-slate-800 text-white font-black text-xs uppercase tracking-wider border-2 border-black shadow-[2px_2px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 transition-all flex items-center justify-center gap-2 h-auto sm:h-[46px] disabled:opacity-50 shrink-0 cursor-pointer"
        >
          {isAiLoading ? (
            <Loader2 className="w-4 h-4 animate-spin text-white" />
          ) : (
            <>
              <Sparkles className="w-3.5 h-3.5" />
              <span>Extract</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};
