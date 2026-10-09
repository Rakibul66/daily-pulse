import React from "react";
import { inputClasses, labelClasses, LeadFormData } from "./types";

interface LeadAdvancedFieldsProps {
  formData: LeadFormData;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
}

const SectionTitle = ({ children }: { children: React.ReactNode }) => (
  <div className="flex items-center gap-2 mt-6 mb-3 pb-2 border-b-2 border-black">
    <span className="w-2.5 h-2.5 bg-emerald-500 border border-black inline-block"></span>
    <h3 className="text-xs font-black uppercase tracking-wider text-black">
      {children}
    </h3>
  </div>
);

export const LeadAdvancedFields: React.FC<LeadAdvancedFieldsProps> = ({
  formData,
  onChange,
}) => {
  return (
    <div className="space-y-4 animate-in fade-in duration-200 pt-2">
      {/* Basic & Contact Info */}
      <SectionTitle>Additional Contact & Details</SectionTitle>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        <div>
          <label className={labelClasses}>Date Added</label>
          <input
            type="date"
            name="dateAdded"
            value={formData.dateAdded.split('T')[0]}
            onChange={onChange}
            className={inputClasses}
          />
        </div>
        <div>
          <label className={labelClasses}>Owner / Manager</label>
          <input
            type="text"
            name="ownerName"
            value={formData.ownerName}
            onChange={onChange}
            className={inputClasses}
            placeholder="e.g. John Doe"
          />
        </div>
        <div>
          <label className={labelClasses}>Alternative Phone</label>
          <input
            type="text"
            name="phone"
            value={formData.phone}
            onChange={onChange}
            className={inputClasses}
            placeholder="Backup telephone"
          />
        </div>
        <div>
          <label className={labelClasses}>Location / Area</label>
          <input
            type="text"
            name="locationArea"
            value={formData.locationArea}
            onChange={onChange}
            className={inputClasses}
            placeholder="Gulshan, Dhaka"
          />
        </div>
        <div>
          <label className={labelClasses}>Messenger Profile</label>
          <input
            type="text"
            name="messenger"
            value={formData.messenger}
            onChange={onChange}
            className={inputClasses}
            placeholder="m.me/... or profile link"
          />
        </div>
        <div>
          <label className={labelClasses}>Branch Count</label>
          <select
            name="branchCount"
            value={formData.branchCount}
            onChange={onChange}
            className={inputClasses}
          >
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="Multiple">Multiple</option>
          </select>
        </div>
        <div>
          <label className={labelClasses}>Website URL</label>
          <input
            type="url"
            name="websiteUrl"
            value={formData.websiteUrl}
            onChange={onChange}
            className={inputClasses}
            placeholder="https://"
          />
        </div>
        <div>
          <label className={labelClasses}>Facebook Page URL</label>
          <input
            type="url"
            name="facebookUrl"
            value={formData.facebookUrl}
            onChange={onChange}
            className={inputClasses}
            placeholder="https://facebook.com/..."
          />
        </div>
        <div>
          <label className={labelClasses}>Instagram URL</label>
          <input
            type="url"
            name="instagramUrl"
            value={formData.instagramUrl}
            onChange={onChange}
            className={inputClasses}
            placeholder="https://instagram.com/..."
          />
        </div>
        <div>
          <label className={labelClasses}>Current POS</label>
          <input
            type="text"
            name="currentPos"
            value={formData.currentPos}
            onChange={onChange}
            className={inputClasses}
            placeholder="e.g. Existing Software"
          />
        </div>
        <div className="sm:col-span-2">
          <label className={labelClasses}>Pain Point</label>
          <input
            type="text"
            name="painPoint"
            value={formData.painPoint}
            onChange={onChange}
            className={inputClasses}
            placeholder="Why are they looking for a new POS/CRM solution?"
          />
        </div>
      </div>

      {/* Sales Pipeline & Follow-up */}
      <SectionTitle>Sales Pipeline & Follow-up</SectionTitle>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        <div>
          <label className={labelClasses}>Lead Priority</label>
          <select
            name="leadPriority"
            value={formData.leadPriority}
            onChange={onChange}
            className={inputClasses}
          >
            <option value="HOT">🔴 HOT</option>
            <option value="WARM">🟡 WARM</option>
            <option value="COLD">🔵 COLD</option>
            <option value="LOST">⚫ LOST</option>
          </select>
        </div>
        <div>
          <label className={labelClasses}>First Contact Date</label>
          <input
            type="date"
            name="firstContactDate"
            value={formData.firstContactDate}
            onChange={onChange}
            className={inputClasses}
          />
        </div>
        <div>
          <label className={labelClasses}>Follow-up Date</label>
          <input
            type="date"
            name="followUpDate"
            value={formData.followUpDate}
            onChange={onChange}
            className={inputClasses}
          />
        </div>
        <div className="flex items-center gap-3 pt-2">
          <input
            type="checkbox"
            id="responseReceived"
            name="responseReceived"
            checked={formData.responseReceived}
            onChange={onChange}
            className="w-5 h-5 border-2 border-black rounded-none text-emerald-600 focus:ring-0 cursor-pointer shadow-[2px_2px_0px_#000]"
          />
          <label
            htmlFor="responseReceived"
            className="text-xs font-black uppercase tracking-wider text-black cursor-pointer select-none"
          >
            Response Received?
          </label>
        </div>
      </div>

      {/* Deal Closure */}
      <SectionTitle>Deal Closure</SectionTitle>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        <div>
          <label className={labelClasses}>Demo Date</label>
          <input
            type="date"
            name="demoDate"
            value={formData.demoDate}
            onChange={onChange}
            className={inputClasses}
          />
        </div>
        <div>
          <label className={labelClasses}>Demo Status</label>
          <select
            name="demoStatus"
            value={formData.demoStatus}
            onChange={onChange}
            className={inputClasses}
          >
            <option value="">None</option>
            <option value="Pending">Pending</option>
            <option value="Done">Done</option>
          </select>
        </div>
        <div className="flex items-center gap-3 pt-2">
          <input
            type="checkbox"
            id="proposalSent"
            name="proposalSent"
            checked={formData.proposalSent}
            onChange={onChange}
            className="w-5 h-5 border-2 border-black rounded-none text-emerald-600 focus:ring-0 cursor-pointer shadow-[2px_2px_0px_#000]"
          />
          <label
            htmlFor="proposalSent"
            className="text-xs font-black uppercase tracking-wider text-black cursor-pointer select-none"
          >
            Proposal Sent?
          </label>
        </div>
        <div>
          <label className={labelClasses}>Expected Closing Date</label>
          <input
            type="date"
            name="expectedClosingDate"
            value={formData.expectedClosingDate}
            onChange={onChange}
            className={inputClasses}
          />
        </div>
        <div>
          <label className={labelClasses}>Deal Value (৳)</label>
          <input
            type="number"
            name="dealValue"
            value={formData.dealValue}
            onChange={onChange}
            className={inputClasses}
            placeholder="0.00"
          />
        </div>
        <div>
          <label className={labelClasses}>Sales Status</label>
          <select
            name="salesStatus"
            value={formData.salesStatus}
            onChange={onChange}
            className={inputClasses}
          >
            <option value="Pending">Pending</option>
            <option value="Won">Won</option>
            <option value="Lost">Lost</option>
          </select>
        </div>
      </div>

      {/* Notes */}
      <SectionTitle>Lead Notes</SectionTitle>
      <div className="grid grid-cols-1 gap-4">
        <div>
          <label className={labelClasses}>
            <span>Notes</span>
            <span className="text-[10px] text-slate-500 font-bold lowercase ml-2">
              (write next action, objections, lost reason, or general observations)
            </span>
          </label>
          <textarea
            name="notes"
            value={formData.notes}
            onChange={onChange}
            rows={4}
            className={`${inputClasses} resize-none`}
            placeholder="e.g. Next Action: Call Tuesday at 3 PM. Objection: Budget review next month. Looking for cloud kitchen inventory..."
          />
          <p className="text-[10px] font-bold text-slate-500 uppercase mt-1.5 flex items-center gap-1">
            <span>💡</span>
            <span>Hint: Include next actions, client objections, lost reasons, or background details here.</span>
          </p>
        </div>
      </div>
    </div>
  );
};
