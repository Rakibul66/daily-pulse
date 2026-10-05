import React, { useState, useEffect } from 'react';
import { Lead } from '@/types/crm';
import { X, Sparkles, Loader2 } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { getHRMSettings } from '@/lib/hrmStorage';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSave: (lead: Omit<Lead, 'id' | 'userId' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  initialData?: Lead | null;
}

const emptyLead = (): Omit<Lead, 'id' | 'userId' | 'createdAt' | 'updatedAt'> => ({
  dateAdded: new Date().toISOString().split('T')[0],
  businessName: '',
  ownerName: '',
  phone: '',
  messenger: '',
  locationArea: '',
  branchCount: '1',
  businessType: 'Restaurant',
  businessSubType: 'Cafe',
  currentPos: '',
  websiteUrl: '',
  facebookUrl: '',
  instagramUrl: '',
  painPoint: '',
  leadSource: '',
  firstContactDate: '',
  responseReceived: false,
  leadStatus: 'NEW',
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
  notes: '',
  leadPriority: 'COLD',
});

const BUSINESS_CATEGORIES: Record<string, string[]> = {
  'Restaurant': ['Cafe', 'Fine Dining', 'Fast Food', 'Food Cart', 'Bakery', 'Cloud Kitchen', 'Other'],
  'E-commerce': ['Fashion/Clothing', 'Food/Grocery', 'Electronics/Tech', 'Books/Stationery', 'Health/Beauty', 'Other'],
  'Retail': ['Super Shop', 'Pharmacy', 'Hardware', 'Other'],
  'Service': ['Saloon/Spa', 'Repair Shop', 'Consultancy', 'Other'],
  'Agency': ['Marketing', 'IT/Software', 'Travel', 'Other'],
  'Education': ['School', 'Coaching', 'Online Course', 'Other'],
  'Other': ['Other']
};

export const LeadFormModal: React.FC<Props> = ({ isOpen, onClose, onSave, initialData }) => {
  const [formData, setFormData] = useState(emptyLead());
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user } = useAuth();
  const [aiEnabled, setAiEnabled] = useState(false);
  const [apiKey, setApiKey] = useState('');
  const [aiInput, setAiInput] = useState('');
  const [isAiLoading, setIsAiLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      if (user) {
        getHRMSettings(user.uid).then(settings => {
          if (settings) {
            setAiEnabled(settings.aiEnabled || false);
            setApiKey(settings.geminiApiKey || '');
          }
        }).catch(console.error);
      }

      if (initialData) {
        setFormData({
          ...initialData,
          businessName: initialData.businessName || (initialData as any).restaurantName || '',
          businessType: initialData.businessType || (initialData as any).restaurantType || 'Restaurant',
          businessSubType: initialData.businessSubType || 'Other',
        });
      } else {
        setFormData(emptyLead());
      }
    }
  }, [isOpen, initialData, user]);

  if (!isOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData((prev) => ({ ...prev, [name]: checked }));
    } else if (type === 'number') {
      setFormData((prev) => ({ ...prev, [name]: Number(value) }));
    } else {
      setFormData((prev) => {
        const newData = { ...prev, [name]: value };
        if (name === 'businessType') {
          newData.businessSubType = BUSINESS_CATEGORIES[value]?.[0] || 'Other';
        }
        return newData;
      });
    }
  };

  const handleAiParse = async () => {
    if (!aiInput.trim()) return alert("Please paste some text first.");
    if (!apiKey) return alert("Gemini API Key is missing in Settings.");
    
    setIsAiLoading(true);
    try {
      const prompt = `
      Extract lead information from the following text and output ONLY valid JSON matching this exact structure (leave empty strings if not found):
      {
        "businessName": "string",
        "ownerName": "string",
        "phone": "string",
        "locationArea": "string",
        "businessType": "string (try to match: Restaurant, E-commerce, Retail, Service, Agency, Education, Other)",
        "businessSubType": "string",
        "currentPos": "string",
        "painPoint": "string",
        "notes": "string",
        "leadSource": "string (Facebook, Google, Referral, Cold Call, Other)",
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
        setFormData(prev => ({
          ...prev,
          businessName: parsed.businessName || prev.businessName,
          ownerName: parsed.ownerName || prev.ownerName,
          phone: parsed.phone || prev.phone,
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await onSave(formData);
      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const SectionTitle = ({ children }: { children: React.ReactNode }) => (
    <div className="flex items-center gap-2 mt-6 mb-3 pb-2 border-b border-slate-800">
      <span className="w-2 h-2 rounded-full bg-primary-500"></span>
      <h3 className="text-xs font-bold uppercase tracking-wider text-primary-400">
        {children}
      </h3>
    </div>
  );

  const inputClasses = "w-full text-sm font-bold text-white bg-slate-950 px-3 py-2 rounded-md border border-slate-700 focus:border-primary-500 focus:ring-1 focus:ring-primary-500 placeholder-slate-600";
  const labelClasses = "text-xs font-semibold text-slate-300 block mb-1.5";

  const currentSubTypes = BUSINESS_CATEGORIES[formData.businessType] || BUSINESS_CATEGORIES['Other'];

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-md shadow-md w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col animate-in zoom-in-95 duration-200">
        <div className="px-6 py-5 border-b border-slate-800 flex items-center justify-between bg-slate-900/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-primary-950/80 text-primary-400 border border-primary-800/80 flex items-center justify-center">
              <span className="font-bold text-lg">LE</span>
            </div>
            <div>
              <h2 className="text-lg font-bold text-white leading-tight">
                {initialData ? 'Edit Lead Profile' : 'Add New Lead'}
              </h2>
              <p className="text-xs text-slate-400 font-medium">Complete the form below</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-white rounded-md hover:bg-slate-800 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto flex-1 custom-scrollbar">
          <form id="lead-form" onSubmit={handleSubmit} className="space-y-2">
            
            {aiEnabled && !initialData && (
              <div className="bg-emerald-950/20 border border-emerald-900/50 rounded-xl p-4 mb-6">
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles className="w-4 h-4 text-emerald-400" />
                  <h3 className="text-sm font-bold text-emerald-400">AI Smart Paste</h3>
                </div>
                <p className="text-xs text-slate-400 mb-3">Paste any unstructured text (from WhatsApp, email, etc.) and AI will fill the form for you.</p>
                <div className="flex gap-3 items-start">
                  <textarea value={aiInput} onChange={e => setAiInput(e.target.value)} rows={2} className={`${inputClasses} resize-none flex-1`} placeholder="Paste lead info here..." />
                  <button type="button" onClick={handleAiParse} disabled={isAiLoading || !aiInput.trim()} className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-md transition-colors flex items-center h-[52px] shadow-md disabled:opacity-50 shrink-0">
                    {isAiLoading ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      "Extract"
                    )}
                  </button>
                </div>
              </div>
            )}

            <SectionTitle>Basic Info</SectionTitle>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <div>
                <label className={labelClasses}>Date Added</label>
                <input type="date" name="dateAdded" value={formData.dateAdded.split('T')[0]} onChange={handleChange} className={inputClasses} required />
              </div>
              <div>
                <label className={labelClasses}>Business Name</label>
                <input type="text" name="businessName" value={formData.businessName} onChange={handleChange} className={inputClasses} placeholder="e.g. Cafe Delight" required />
              </div>
              <div>
                <label className={labelClasses}>Owner/Manager</label>
                <input type="text" name="ownerName" value={formData.ownerName} onChange={handleChange} className={inputClasses} placeholder="John Doe" />
              </div>
            </div>

            <SectionTitle>Contact Details</SectionTitle>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <div>
                <label className={labelClasses}>Phone</label>
                <input type="text" name="phone" value={formData.phone} onChange={handleChange} className={inputClasses} placeholder="017..." />
              </div>
              <div>
                <label className={labelClasses}>Messenger</label>
                <input type="text" name="messenger" value={formData.messenger} onChange={handleChange} className={inputClasses} placeholder="FB profile link" />
              </div>
              <div>
                <label className={labelClasses}>Location / Area</label>
                <input type="text" name="locationArea" value={formData.locationArea} onChange={handleChange} className={inputClasses} placeholder="Gulshan, Dhaka" />
              </div>
              <div>
                <label className={labelClasses}>Website URL</label>
                <input type="url" name="websiteUrl" value={formData.websiteUrl} onChange={handleChange} className={inputClasses} placeholder="https://" />
              </div>
              <div>
                <label className={labelClasses}>Facebook URL</label>
                <input type="url" name="facebookUrl" value={formData.facebookUrl} onChange={handleChange} className={inputClasses} placeholder="https://" />
              </div>
              <div>
                <label className={labelClasses}>Instagram URL</label>
                <input type="url" name="instagramUrl" value={formData.instagramUrl} onChange={handleChange} className={inputClasses} placeholder="https://" />
              </div>
            </div>

            <SectionTitle>Business Profile</SectionTitle>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <div>
                <label className={labelClasses}>Business Type</label>
                <select name="businessType" value={formData.businessType} onChange={handleChange} className={inputClasses}>
                  {Object.keys(BUSINESS_CATEGORIES).map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className={labelClasses}>Business Sub-Type</label>
                <select name="businessSubType" value={formData.businessSubType} onChange={handleChange} className={inputClasses}>
                  {currentSubTypes.map(subType => (
                    <option key={subType} value={subType}>{subType}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className={labelClasses}>Branch Count</label>
                <select name="branchCount" value={formData.branchCount} onChange={handleChange} className={inputClasses}>
                  <option>1</option>
                  <option>2</option>
                  <option>Multiple</option>
                </select>
              </div>
              <div>
                <label className={labelClasses}>Current POS</label>
                <input type="text" name="currentPos" value={formData.currentPos} onChange={handleChange} className={inputClasses} placeholder="e.g. Existing Software" />
              </div>
              <div className="md:col-span-2">
                <label className={labelClasses}>Pain Point</label>
                <input type="text" name="painPoint" value={formData.painPoint} onChange={handleChange} className={inputClasses} placeholder="Why are they looking for a new solution?" />
              </div>
            </div>

            <SectionTitle>Sales Pipeline</SectionTitle>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <div>
                <label className={labelClasses}>Lead Source</label>
                <select name="leadSource" value={formData.leadSource} onChange={handleChange} className={inputClasses}>
                  <option value="">Select source...</option>
                  <option value="Facebook">Facebook</option>
                  <option value="Google">Google</option>
                  <option value="Referral">Referral</option>
                  <option value="Cold Call">Cold Call</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div>
                <label className={labelClasses}>Lead Status</label>
                <select name="leadStatus" value={formData.leadStatus} onChange={handleChange} className={inputClasses}>
                  <option value="NEW">NEW</option>
                  <option value="CONTACTED">CONTACTED</option>
                  <option value="REPLIED">REPLIED</option>
                  <option value="QUALIFIED">QUALIFIED</option>
                  <option value="DEMO BOOKED">DEMO BOOKED</option>
                  <option value="DEMO DONE">DEMO DONE</option>
                  <option value="PROPOSAL">PROPOSAL</option>
                  <option value="NEGOTIATION">NEGOTIATION</option>
                  <option value="WON">WON</option>
                  <option value="LOST">LOST</option>
                </select>
              </div>
              <div>
                <label className={labelClasses}>Lead Priority</label>
                <select name="leadPriority" value={formData.leadPriority} onChange={handleChange} className={inputClasses}>
                  <option value="HOT">🔴 HOT</option>
                  <option value="WARM">🟡 WARM</option>
                  <option value="COLD">🔵 COLD</option>
                  <option value="LOST">⚫ LOST</option>
                </select>
              </div>
              
              <div>
                <label className={labelClasses}>First Contact Date</label>
                <input type="date" name="firstContactDate" value={formData.firstContactDate} onChange={handleChange} className={inputClasses} />
              </div>
              <div className="flex items-center pt-6">
                <label className="flex items-center cursor-pointer gap-2 group">
                  <div className="relative flex items-center">
                    <input type="checkbox" name="responseReceived" checked={formData.responseReceived} onChange={handleChange} className="peer sr-only" />
                    <div className="w-10 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white dark:bg-slate-900 after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-500"></div>
                  </div>
                  <span className="text-sm font-semibold text-slate-300 group-hover:text-white transition-colors">Response Received?</span>
                </label>
              </div>
              
              <div>
                <label className={labelClasses}>Follow-up Date</label>
                <input type="date" name="followUpDate" value={formData.followUpDate} onChange={handleChange} className={inputClasses} />
              </div>
            </div>

            <SectionTitle>Deal Closure</SectionTitle>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <div>
                <label className={labelClasses}>Demo Date</label>
                <input type="date" name="demoDate" value={formData.demoDate} onChange={handleChange} className={inputClasses} />
              </div>
              <div>
                <label className={labelClasses}>Demo Status</label>
                <select name="demoStatus" value={formData.demoStatus} onChange={handleChange} className={inputClasses}>
                  <option value="">None</option>
                  <option value="Pending">Pending</option>
                  <option value="Done">Done</option>
                </select>
              </div>
              <div className="flex items-center pt-6">
                <label className="flex items-center cursor-pointer gap-2 group">
                  <div className="relative flex items-center">
                    <input type="checkbox" name="proposalSent" checked={formData.proposalSent} onChange={handleChange} className="peer sr-only" />
                    <div className="w-10 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white dark:bg-slate-900 after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-500"></div>
                  </div>
                  <span className="text-sm font-semibold text-slate-300 group-hover:text-white transition-colors">Proposal Sent?</span>
                </label>
              </div>

              <div>
                <label className={labelClasses}>Expected Closing Date</label>
                <input type="date" name="expectedClosingDate" value={formData.expectedClosingDate} onChange={handleChange} className={inputClasses} />
              </div>
              <div>
                <label className={labelClasses}>Deal Value (৳)</label>
                <input type="number" name="dealValue" value={formData.dealValue} onChange={handleChange} className={inputClasses} placeholder="0.00" />
              </div>
              <div>
                <label className={labelClasses}>Sales Status</label>
                <select name="salesStatus" value={formData.salesStatus} onChange={handleChange} className={inputClasses}>
                  <option value="Pending">Pending</option>
                  <option value="Won">Won</option>
                  <option value="Lost">Lost</option>
                </select>
              </div>
            </div>

            <SectionTitle>Additional Info</SectionTitle>
            <div className="grid grid-cols-1 gap-5">
              <div>
                <label className={labelClasses}>Objection / Lost Reason</label>
                <input type="text" name="objection" value={formData.objection} onChange={handleChange} className={inputClasses} placeholder="Price/Time/Existing POS / Lost reason..." />
              </div>
              <div>
                <label className={labelClasses}>Next Action</label>
                <input type="text" name="nextAction" value={formData.nextAction} onChange={handleChange} className={inputClasses} placeholder="What should be done next?" />
              </div>
              <div>
                <label className={labelClasses}>Notes</label>
                <textarea name="notes" value={formData.notes} onChange={handleChange} rows={3} className={`${inputClasses} resize-none`} placeholder="Any extra information..." />
              </div>
            </div>

          </form>
        </div>

        <div className="px-6 py-4 border-t border-slate-800 bg-slate-900/80 flex justify-end gap-3">
          <button type="button" onClick={onClose} className="px-5 py-2.5 text-sm font-bold text-slate-300 bg-slate-800 border border-slate-700 rounded-md hover:bg-slate-700 hover:text-white transition-colors">
            Cancel
          </button>
          <button type="submit" form="lead-form" disabled={isSubmitting} className="px-5 py-2.5 text-sm font-bold text-white bg-primary-600 rounded-md hover:bg-primary-500 disabled:opacity-50 transition-colors flex items-center shadow-md shadow-primary-950">
            {isSubmitting ? 'Saving...' : 'Save Lead'}
          </button>
        </div>
      </div>
    </div>
  );
};
