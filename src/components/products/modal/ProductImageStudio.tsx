"use client";

import React, { useRef, useState } from 'react';
import { 
  Image as ImageIcon, 
  UploadCloud, 
  Trash2, 
  Link as LinkIcon, 
  Plus, 
  X, 
  AlertCircle, 
  ImagePlus, 
  Loader2 
} from 'lucide-react';
import { resizeImageFile } from '@/lib/imageUtils';

interface ProductImageStudioProps {
  image: string;
  otherImages: string[];
  reorderLevel: number;
  onImageChange: (image: string) => void;
  onOtherImagesChange: (otherImages: string[]) => void;
  onReorderLevelChange: (reorderLevel: number) => void;
}

export const ProductImageStudio: React.FC<ProductImageStudioProps> = ({
  image,
  otherImages,
  reorderLevel,
  onImageChange,
  onOtherImagesChange,
  onReorderLevelChange,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [imageInputMode, setImageInputMode] = useState<'upload' | 'url'>('upload');
  const [imageUrlInput, setImageUrlInput] = useState('');
  const [isProcessingImage, setIsProcessingImage] = useState(false);
  const [imageError, setImageError] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const galleryInputRef = useRef<HTMLInputElement | null>(null);

  const inputClasses = "w-full text-xs font-bold text-black bg-white px-3 py-2 border-2 border-black focus:outline-none focus:bg-amber-50 placeholder-slate-400";
  const labelClasses = "text-[11px] font-black uppercase text-black block mb-1 tracking-wider";

  // Core Image Processor (Downscales, compresses, and validates)
  const processImageFile = async (file: File): Promise<string | null> => {
    setImageError(null);
    if (!file.type.startsWith('image/')) {
      setImageError('Selected file is not an image. Please choose PNG, JPG, or WEBP.');
      return null;
    }

    if (file.size > 10 * 1024 * 1024) {
      setImageError('Image file is larger than 10MB. Please choose a smaller photo.');
      return null;
    }

    setIsProcessingImage(true);
    try {
      const resizedUrl = await resizeImageFile(file, { maxWidth: 600, maxHeight: 600, quality: 0.85 });
      return resizedUrl;
    } catch (err: any) {
      console.error('Image resize error:', err);
      setImageError('Failed to process image file. Please try another image.');
      return null;
    } finally {
      setIsProcessingImage(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const resized = await processImageFile(file);
      if (resized) {
        onImageChange(resized);
      }
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      const resized = await processImageFile(files[0]);
      if (resized) {
        onImageChange(resized);
      }
    }
  };

  const handlePasteImage = async (e: React.ClipboardEvent) => {
    const items = e.clipboardData?.items;
    if (!items) return;

    for (let i = 0; i < items.length; i++) {
      if (items[i].type.indexOf('image') !== -1) {
        const file = items[i].getAsFile();
        if (file) {
          e.preventDefault();
          const resized = await processImageFile(file);
          if (resized) {
            onImageChange(resized);
          }
          break;
        }
      }
    }
  };

  const handleApplyImageUrl = () => {
    const url = imageUrlInput.trim();
    if (!url) return;
    if (!url.startsWith('http://') && !url.startsWith('https://') && !url.startsWith('data:image')) {
      setImageError('Please enter a valid HTTP or HTTPS image URL.');
      return;
    }
    onImageChange(url);
    setImageUrlInput('');
    setImageError(null);
  };

  const handleGalleryUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const resized = await processImageFile(file);
      if (resized) {
        onOtherImagesChange([...(otherImages || []).slice(0, 3), resized]);
      }
    }
    if (galleryInputRef.current) {
      galleryInputRef.current.value = '';
    }
  };

  const handleRemoveGalleryImage = (index: number) => {
    onOtherImagesChange((otherImages || []).filter((_, i) => i !== index));
  };

  return (
    <div className="border-2 sm:border-3 border-black p-4 bg-slate-50 shadow-[3px_3px_0px_#000] space-y-3">
      <div className="flex items-center justify-between pb-2 border-b-2 border-black">
        <div className="flex items-center gap-2">
          <ImageIcon className="w-4 h-4 text-black stroke-[2.5]" />
          <h3 className="text-xs font-black uppercase tracking-wider text-black">
            Product Media &amp; Photos
          </h3>
        </div>

        {/* Mode Toggle: File Upload vs Web Image URL */}
        <div className="flex items-center gap-1 bg-white border border-black p-0.5 text-[10px] font-black uppercase">
          <button
            type="button"
            onClick={() => setImageInputMode('upload')}
            className={`px-2 py-0.5 transition-all cursor-pointer ${
              imageInputMode === 'upload' ? 'bg-amber-300 text-black border border-black shadow-[1px_1px_0px_#000]' : 'text-slate-600 hover:text-black'
            }`}
          >
            <UploadCloud className="w-3 h-3 inline mr-1" /> Drop / File
          </button>
          <button
            type="button"
            onClick={() => setImageInputMode('url')}
            className={`px-2 py-0.5 transition-all cursor-pointer ${
              imageInputMode === 'url' ? 'bg-amber-300 text-black border border-black shadow-[1px_1px_0px_#000]' : 'text-slate-600 hover:text-black'
            }`}
          >
            <LinkIcon className="w-3 h-3 inline mr-1" /> Image URL
          </button>
        </div>
      </div>

      {imageError && (
        <div className="p-2.5 bg-rose-100 border-2 border-black shadow-[2px_2px_0px_#000] text-rose-950 text-xs font-bold flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-rose-700 shrink-0" />
          <span>{imageError}</span>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-start">
        {/* Primary Thumbnail Drop Zone / Preview */}
        <div className="md:col-span-2 space-y-2">
          <label className={labelClasses}>Primary Product Photo (Main Thumbnail)</label>
          
          {image ? (
            /* Active Image Preview Card */
            <div className="flex flex-col sm:flex-row items-center gap-4 p-3 bg-white border-2 border-black shadow-[2px_2px_0px_#000]">
              <div className="relative w-32 h-32 bg-slate-100 border-2 border-black overflow-hidden shrink-0 group">
                <img
                  src={image}
                  alt="Product Preview"
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-1 right-1 bg-black/80 text-white text-[9px] font-mono px-1 py-0.5 font-bold">
                  600x600
                </div>
              </div>

              <div className="flex-1 space-y-2 text-left w-full">
                <div className="space-y-0.5">
                  <span className="inline-block px-1.5 py-0.5 bg-emerald-100 border border-black text-emerald-900 text-[10px] font-black uppercase">
                    ✓ Optimized for POS &amp; Catalog
                  </span>
                  <p className="text-xs font-bold text-black truncate">
                    Photo Ready
                  </p>
                  <p className="text-[10px] text-slate-500 font-bold">
                    Compressed client-side to preserve instant database response
                  </p>
                </div>

                <div className="flex items-center gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="px-2.5 py-1 text-xs font-black uppercase text-black bg-white hover:bg-slate-100 border-2 border-black shadow-[1px_1px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 cursor-pointer flex items-center gap-1"
                  >
                    <UploadCloud className="w-3.5 h-3.5" /> Replace
                  </button>
                  <button
                    type="button"
                    onClick={() => onImageChange('')}
                    className="px-2.5 py-1 text-xs font-black uppercase text-rose-700 hover:text-rose-900 bg-white hover:bg-rose-50 border-2 border-black shadow-[1px_1px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 cursor-pointer flex items-center gap-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" /> Remove
                  </button>
                </div>
              </div>
            </div>
          ) : imageInputMode === 'upload' ? (
            /* Drag & Drop Interactive Zone */
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onPaste={handlePasteImage}
              onClick={() => fileInputRef.current?.click()}
              tabIndex={0}
              className={`relative border-2 border-dashed border-black p-6 text-center cursor-pointer transition-all flex flex-col items-center justify-center gap-2 group outline-none ${
                isDragging
                  ? 'bg-amber-200 border-indigo-600 scale-[1.01]'
                  : 'bg-white hover:bg-amber-50/70'
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />

              {isProcessingImage ? (
                <div className="flex flex-col items-center gap-2 py-4">
                  <Loader2 className="w-8 h-8 text-black animate-spin" />
                  <span className="text-xs font-black uppercase">Optimizing photo...</span>
                </div>
              ) : (
                <>
                  <div className="p-3 bg-amber-300 border-2 border-black shadow-[2px_2px_0px_#000] group-hover:scale-105 transition-transform">
                    <UploadCloud className="w-6 h-6 text-black stroke-[2.5]" />
                  </div>
                  <div className="space-y-0.5">
                    <p className="text-xs font-black uppercase text-black">
                      Drag &amp; drop product photo here, or click to browse
                    </p>
                    <p className="text-[10px] font-bold text-slate-500">
                      Supports PNG, JPG, WEBP • Paste screenshot with <kbd className="px-1 bg-slate-200 border border-slate-400 font-mono text-[9px]">⌘V</kbd>
                    </p>
                  </div>
                </>
              )}
            </div>
          ) : (
            /* Image URL Mode */
            <div className="p-4 bg-white border-2 border-black space-y-2">
              <label className="text-[11px] font-black uppercase text-black block">
                Paste Image Direct URL
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="url"
                  value={imageUrlInput}
                  onChange={(e) => setImageUrlInput(e.target.value)}
                  placeholder="https://example.com/images/product.jpg"
                  className={inputClasses}
                />
                <button
                  type="button"
                  onClick={handleApplyImageUrl}
                  disabled={!imageUrlInput.trim()}
                  className="px-3 py-2 bg-emerald-400 hover:bg-emerald-300 disabled:opacity-50 text-black border-2 border-black text-xs font-black uppercase shrink-0 cursor-pointer shadow-[2px_2px_0px_#000]"
                >
                  Apply
                </button>
              </div>
              <p className="text-[10px] font-bold text-slate-500">
                Link to existing product photography from your cloud or supplier CDN.
              </p>
            </div>
          )}
        </div>

        {/* Reorder Level & Additional Gallery Angles */}
        <div className="space-y-3">
          <div>
            <label className={labelClasses}>Reorder Level (Alert Threshold)</label>
            <input
              type="number"
              min="0"
              value={reorderLevel}
              onChange={e => onReorderLevelChange(Number(e.target.value))}
              className={inputClasses}
              placeholder="e.g. 5"
            />
            <span className="text-[10px] font-bold text-slate-500 mt-0.5 block">
              Low stock alert triggers when quantity drops below this amount.
            </span>
          </div>

          {/* Additional Photo Angles (Optional Gallery) */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-[11px] font-black uppercase text-black block">
                Additional Angles (Up to 3)
              </label>
              {(otherImages || []).length < 3 && (
                <button
                  type="button"
                  onClick={() => galleryInputRef.current?.click()}
                  className="text-[10px] font-black uppercase text-indigo-700 hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <Plus className="w-3 h-3" /> Add Angle
                </button>
              )}
            </div>

            <input
              ref={galleryInputRef}
              type="file"
              accept="image/*"
              onChange={handleGalleryUpload}
              className="hidden"
            />

            <div className="flex items-center gap-2">
              {(otherImages || []).map((imgUrl, idx) => (
                <div key={idx} className="relative w-14 h-14 bg-white border-2 border-black overflow-hidden group">
                  <img src={imgUrl} alt={`Angle ${idx + 1}`} className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => handleRemoveGalleryImage(idx)}
                    className="absolute top-0.5 right-0.5 bg-rose-600 text-white p-0.5 border border-black hover:bg-rose-700 cursor-pointer"
                    title="Delete photo"
                  >
                    <X className="w-2.5 h-2.5" />
                  </button>
                </div>
              ))}

              {(otherImages || []).length < 3 && (
                <button
                  type="button"
                  onClick={() => galleryInputRef.current?.click()}
                  className="w-14 h-14 border-2 border-dashed border-black bg-white hover:bg-amber-50 flex flex-col items-center justify-center gap-0.5 text-slate-500 hover:text-black cursor-pointer transition-colors"
                  title="Add extra photo"
                >
                  <ImagePlus className="w-4 h-4" />
                  <span className="text-[8px] font-black uppercase">+Angle</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
