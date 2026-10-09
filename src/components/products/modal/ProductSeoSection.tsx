"use client";

import React from 'react';

interface ProductSeoSectionProps {
  longDescription: string;
  seoTitle: string;
  seoKeywords: string;
  seoDescription: string;
  status: 'ACTIVE' | 'INACTIVE';
  onChange: (fields: Partial<{
    longDescription: string;
    seoTitle: string;
    seoKeywords: string;
    seoDescription: string;
    status: 'ACTIVE' | 'INACTIVE';
  }>) => void;
}

export const ProductSeoSection: React.FC<ProductSeoSectionProps> = ({
  longDescription,
  seoTitle,
  seoKeywords,
  seoDescription,
  status,
  onChange,
}) => {
  const inputClasses = "w-full text-xs font-bold text-black bg-white px-3 py-2 border-2 border-black focus:outline-none focus:bg-amber-50 placeholder-slate-400";
  const labelClasses = "text-[11px] font-black uppercase text-black block mb-1 tracking-wider";

  return (
    <div className="space-y-4">
      {/* Description */}
      <div>
        <label className={labelClasses}>Product Description / Specifications</label>
        <textarea
          rows={3}
          value={longDescription}
          onChange={e => onChange({ longDescription: e.target.value })}
          className={inputClasses}
          placeholder="Detailed specifications, usage, and catalog info..."
        />
      </div>

      {/* SEO Section */}
      <div className="border-2 border-black p-4 bg-slate-50 space-y-3">
        <h4 className="text-xs font-black uppercase tracking-wider text-black border-b border-black pb-1">
          Search Engine Optimization (SEO)
        </h4>

        <div className="space-y-3">
          <div>
            <label className={labelClasses}>SEO Title</label>
            <input
              type="text"
              value={seoTitle}
              onChange={e => onChange({ seoTitle: e.target.value })}
              className={inputClasses}
              placeholder="SEO Title"
            />
          </div>

          <div>
            <label className={labelClasses}>SEO Keywords</label>
            <input
              type="text"
              value={seoKeywords}
              onChange={e => onChange({ seoKeywords: e.target.value })}
              className={inputClasses}
              placeholder="Keywords separated by comma"
            />
          </div>

          <div>
            <label className={labelClasses}>SEO Description</label>
            <textarea
              rows={2}
              value={seoDescription}
              onChange={e => onChange({ seoDescription: e.target.value })}
              className={inputClasses}
              placeholder="SEO Description"
            />
          </div>
        </div>
      </div>

      {/* Status Selector */}
      <div className="flex items-center justify-between p-3 bg-white border-2 border-black">
        <span className="text-xs font-black uppercase text-black">Product Status</span>
        <select
          value={status}
          onChange={e => onChange({ status: e.target.value as 'ACTIVE' | 'INACTIVE' })}
          className="px-3 py-1.5 text-xs font-black uppercase bg-white border-2 border-black focus:outline-none"
        >
          <option value="ACTIVE">ACTIVE</option>
          <option value="INACTIVE">INACTIVE</option>
        </select>
      </div>
    </div>
  );
};
