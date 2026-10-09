import React, { useState, useRef } from 'react';
import { X, UploadCloud, FileSpreadsheet, Download, Check, AlertCircle, Loader2 } from 'lucide-react';
import { Lead } from '@/types/crm';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onImport: (leads: Omit<Lead, 'id' | 'userId' | 'createdAt' | 'updatedAt'>[]) => Promise<void>;
}

export function downloadSampleCSVTemplate() {
  const sampleContent = 
`Business Name,WhatsApp,Business Type,Business Sub-Type,Lead Source,Lead Status,Notes
Sultan's Dine,01712345678,Restaurant,Fine Dining,Facebook,NEW,Interested in POS & kitchen display system
Delta Tech,01812345678,Retail,Electronics/Tech,WhatsApp,QUALIFIED,Call scheduled next Tuesday
Cafe Milano,01912345678,Restaurant,Cafe,Referral,CONTACTED,Demo requested for coffee shop branch
Fashion Hub,01612345678,E-commerce,Fashion/Clothing,Google,PROPOSAL,Proposal sent for 3 branches`;

  const blob = new Blob(["\uFEFF" + sampleContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', 'sample_leads_template.csv');
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

function parseCSVLine(line: string): string[] {
  const result: string[] = [];
  let cur = '';
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const c = line[i];
    if (c === '"') {
      if (inQuotes && line[i + 1] === '"') {
        cur += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (c === ',' && !inQuotes) {
      result.push(cur.trim());
      cur = '';
    } else {
      cur += c;
    }
  }
  result.push(cur.trim());
  return result;
}

export const LeadImportModal: React.FC<Props> = ({ isOpen, onClose, onImport }) => {
  const [file, setFile] = useState<File | null>(null);
  const [parsedLeads, setParsedLeads] = useState<Omit<Lead, 'id' | 'userId' | 'createdAt' | 'updatedAt'>[]>([]);
  const [errorMsg, setErrorMsg] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (!selected) return;
    processFile(selected);
  };

  const processFile = (selectedFile: File) => {
    setErrorMsg('');
    setFile(selectedFile);

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target?.result as string;
        if (!text) {
          setErrorMsg('The selected CSV file is empty.');
          return;
        }

        const lines = text.split(/\r?\n/).filter(line => line.trim().length > 0);
        if (lines.length < 2) {
          setErrorMsg('CSV file must have a header row and at least 1 row of lead data.');
          return;
        }

        const headers = parseCSVLine(lines[0]).map(h => h.toLowerCase().replace(/[^a-z0-9]/g, ''));
        
        // Find column indices
        const nameIdx = headers.findIndex(h => h.includes('business') || h.includes('name') || h.includes('company'));
        const waIdx = headers.findIndex(h => h.includes('whatsapp') || h.includes('phone') || h.includes('mobile') || h.includes('contact'));
        const typeIdx = headers.findIndex(h => h.includes('type') && !h.includes('sub'));
        const subTypeIdx = headers.findIndex(h => h.includes('subtype') || h.includes('sub'));
        const sourceIdx = headers.findIndex(h => h.includes('source'));
        const statusIdx = headers.findIndex(h => h.includes('status'));
        const notesIdx = headers.findIndex(h => h.includes('note') || h.includes('action') || h.includes('comment'));

        if (nameIdx === -1) {
          setErrorMsg('Could not find a "Business Name" column in the header row.');
          return;
        }

        const leadsToImport: Omit<Lead, 'id' | 'userId' | 'createdAt' | 'updatedAt'>[] = [];
        const todayStr = new Date().toISOString().split('T')[0];

        for (let i = 1; i < lines.length; i++) {
          const row = parseCSVLine(lines[i]);
          if (row.length === 0 || (row.length === 1 && !row[0])) continue;

          const businessName = row[nameIdx]?.trim();
          if (!businessName) continue; // skip blank rows

          const whatsapp = (waIdx !== -1 ? row[waIdx] : '') || '';
          const businessType = (typeIdx !== -1 ? row[typeIdx] : '') || 'Restaurant';
          const businessSubType = (subTypeIdx !== -1 ? row[subTypeIdx] : '') || 'Other';
          const leadSource = (sourceIdx !== -1 ? row[sourceIdx] : '') || 'Facebook';
          const rawStatus = (statusIdx !== -1 ? row[statusIdx] : '')?.toUpperCase() || 'NEW';
          const notes = (notesIdx !== -1 ? row[notesIdx] : '') || '';

          leadsToImport.push({
            dateAdded: todayStr,
            businessName,
            whatsapp,
            phone: whatsapp,
            ownerName: '',
            messenger: '',
            locationArea: '',
            branchCount: '1',
            businessType,
            businessSubType,
            currentPos: '',
            websiteUrl: '',
            facebookUrl: '',
            instagramUrl: '',
            painPoint: '',
            leadSource,
            firstContactDate: '',
            responseReceived: false,
            leadStatus: rawStatus as any,
            demoDate: '',
            demoStatus: '',
            proposalSent: false,
            followUpDate: '',
            followUpCount: 0,
            objection: '',
            expectedClosingDate: '',
            dealValue: 0,
            salesStatus: 'Pending',
            lostReason: '',
            nextAction: '',
            notes,
            leadPriority: 'COLD',
          });
        }

        if (leadsToImport.length === 0) {
          setErrorMsg('No valid rows found in the CSV. Please make sure Business Name is filled.');
          return;
        }

        setParsedLeads(leadsToImport);
      } catch (err: any) {
        console.error(err);
        setErrorMsg('Failed to parse CSV file: ' + err.message);
      }
    };

    reader.readAsText(selectedFile);
  };

  const handleStartImport = async () => {
    if (parsedLeads.length === 0) return;
    setIsSubmitting(true);
    try {
      await onImport(parsedLeads);
      onClose();
    } catch (err: any) {
      setErrorMsg(err.message || 'Import failed.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 md:p-8 pt-8 sm:pt-14 pb-8 sm:pb-14 bg-black/70 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-2xl max-h-[85vh] bg-white border-4 border-black shadow-[8px_8px_0px_#000] sm:shadow-[12px_12px_0px_#000] my-auto flex flex-col overflow-hidden text-black animate-in fade-in zoom-in-95 duration-200">
        
        {/* Top Accent Strip */}
        <div className="h-2.5 bg-gradient-to-r from-amber-400 via-indigo-600 to-emerald-500 border-b-2 border-black shrink-0" />

        {/* Modal Header */}
        <div className="px-5 sm:px-6 py-4 border-b-3 border-black bg-white flex items-center justify-between gap-4 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 bg-amber-300 border-2 sm:border-3 border-black shadow-[2px_2px_0px_#000] flex items-center justify-center text-black shrink-0">
              <UploadCloud className="w-6 h-6 stroke-[2.5]" />
            </div>
            <div>
              <h2 className="font-display font-black text-lg sm:text-xl uppercase tracking-tight text-black leading-tight">
                Bulk Import Leads
              </h2>
              <p className="text-[11px] font-bold text-slate-600 uppercase tracking-wide">
                Upload a CSV spreadsheet to add multiple sales leads at once
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            type="button"
            className="p-1.5 bg-white hover:bg-red-600 hover:text-white border-2 border-black shadow-[2px_2px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 transition-all cursor-pointer"
            aria-label="Close Modal"
          >
            <X className="w-5 h-5 stroke-[2.5]" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 overflow-y-auto flex-1 custom-scrollbar space-y-5">
          
          {/* Format instructions card */}
          <div className="bg-amber-50/60 border-2 sm:border-3 border-black p-4 shadow-[3px_3px_0px_#000]">
            <div className="flex flex-wrap items-center justify-between gap-2 mb-2.5">
              <span className="text-xs font-black uppercase tracking-wider text-black flex items-center gap-1.5">
                <span className="w-2 h-2 bg-black inline-block"></span>
                Required CSV Format &amp; Columns
              </span>
              <button
                type="button"
                onClick={downloadSampleCSVTemplate}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-white hover:bg-amber-200 border-2 border-black font-black text-[11px] uppercase tracking-wider text-black shadow-[2px_2px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 transition-all cursor-pointer"
              >
                <Download className="w-3.5 h-3.5 stroke-[2.5]" />
                Download Sample CSV
              </button>
            </div>
            <p className="text-[11px] font-bold text-slate-700 mb-2">
              Your CSV file should include the following header columns (order does not matter):
            </p>
            <div className="flex flex-wrap gap-1.5">
              {['Business Name *', 'WhatsApp', 'Business Type', 'Business Sub-Type', 'Lead Source', 'Lead Status', 'Notes'].map((col) => (
                <span key={col} className="px-2 py-0.5 bg-white border border-black font-black text-[10px] uppercase text-black">
                  {col}
                </span>
              ))}
            </div>
          </div>

          {/* Choose File Upload Box */}
          <div>
            <input
              ref={fileInputRef}
              type="file"
              accept=".csv,text/csv"
              onChange={handleFileChange}
              className="hidden"
            />
            <div
              onClick={() => fileInputRef.current?.click()}
              className="border-3 border-dashed border-black bg-slate-50 hover:bg-amber-50/70 p-6 sm:p-8 flex flex-col items-center justify-center text-center cursor-pointer shadow-[3px_3px_0px_#000] hover:shadow-[4px_4px_0px_#000] transition-all"
            >
              <div className="w-12 h-12 bg-white border-2 border-black shadow-[2px_2px_0px_#000] flex items-center justify-center mb-3">
                <FileSpreadsheet className="w-6 h-6 text-emerald-600 stroke-[2.5]" />
              </div>
              <p className="font-black text-xs sm:text-sm uppercase tracking-wide text-black mb-1">
                {file ? file.name : 'Choose or Drop CSV File Here'}
              </p>
              <p className="text-[11px] font-bold text-slate-500 uppercase">
                {file ? `${(file.size / 1024).toFixed(1)} KB • Click to choose a different file` : 'Supports comma-separated (.csv) files'}
              </p>
            </div>
          </div>

          {/* Error Message */}
          {errorMsg && (
            <div className="p-3 bg-red-100 border-2 border-black flex items-center gap-2 text-red-900 font-bold text-xs uppercase shadow-[2px_2px_0px_#000]">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-700" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Parsed Preview Table */}
          {parsedLeads.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black uppercase text-black">
                  Preview: Ready to import <span className="text-emerald-700 font-black">({parsedLeads.length} leads found)</span>
                </span>
                <span className="text-[10px] font-bold text-slate-500 uppercase">
                  Showing first {Math.min(parsedLeads.length, 3)} rows
                </span>
              </div>
              <div className="border-2 border-black overflow-x-auto shadow-[2px_2px_0px_#000]">
                <table className="w-full text-xs text-left bg-white">
                  <thead className="bg-amber-200 border-b-2 border-black font-black uppercase text-[10px]">
                    <tr>
                      <th className="p-2 border-r border-black">#</th>
                      <th className="p-2 border-r border-black">Business Name</th>
                      <th className="p-2 border-r border-black">WhatsApp</th>
                      <th className="p-2 border-r border-black">Type</th>
                      <th className="p-2 border-r border-black">Source</th>
                      <th className="p-2 border-r border-black">Status</th>
                      <th className="p-2">Notes</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-black/10">
                    {parsedLeads.slice(0, 3).map((lead, idx) => (
                      <tr key={idx} className="hover:bg-slate-50">
                        <td className="p-2 border-r border-black/10 font-bold">{idx + 1}</td>
                        <td className="p-2 border-r border-black/10 font-black text-black">{lead.businessName}</td>
                        <td className="p-2 border-r border-black/10 font-bold">{lead.whatsapp || '—'}</td>
                        <td className="p-2 border-r border-black/10">{lead.businessType}</td>
                        <td className="p-2 border-r border-black/10">{lead.leadSource}</td>
                        <td className="p-2 border-r border-black/10 font-bold">{lead.leadStatus}</td>
                        <td className="p-2 max-w-[150px] truncate text-slate-600">{lead.notes || '—'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

        </div>

        {/* Modal Footer */}
        <div className="px-5 sm:px-6 py-4 border-t-3 border-black bg-white flex items-center justify-end gap-3 shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 bg-white hover:bg-slate-100 border-2 border-black font-black text-xs uppercase tracking-wider text-black shadow-[2px_2px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 transition-all cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleStartImport}
            disabled={parsedLeads.length === 0 || isSubmitting}
            className="px-6 py-2.5 bg-emerald-400 hover:bg-emerald-300 border-2 sm:border-3 border-black font-black text-xs sm:text-sm uppercase tracking-wider text-black shadow-[3px_3px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 transition-all flex items-center gap-2 disabled:opacity-50 cursor-pointer"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-black" />
                <span>Importing...</span>
              </>
            ) : (
              <>
                <Check className="w-4 h-4 stroke-[3]" />
                <span>Import {parsedLeads.length} Leads</span>
              </>
            )}
          </button>
        </div>

      </div>
    </div>
  );
};
