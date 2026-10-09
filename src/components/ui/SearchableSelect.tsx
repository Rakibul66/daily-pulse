"use client";

import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, ChevronUp, X, Search } from 'lucide-react';

export interface SearchableSelectOption {
  value: string;
  label: string;
  badge?: string;
}

interface SearchableSelectProps {
  options: (SearchableSelectOption | string)[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  required?: boolean;
  clearable?: boolean;
  className?: string;
  id?: string;
}

export const SearchableSelect: React.FC<SearchableSelectProps> = ({
  options,
  value,
  onChange,
  placeholder = 'Select Option..',
  disabled = false,
  required = false,
  clearable = true,
  className = '',
  id,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Normalize options to { value, label }
  const normalizedOptions: SearchableSelectOption[] = options.map((opt) => {
    if (typeof opt === 'string') {
      return { value: opt, label: opt };
    }
    return opt;
  });

  // Selected Option
  const selectedOption = normalizedOptions.find((opt) => opt.value === value);

  // Filtered options based on search query
  const filteredOptions = normalizedOptions.filter((opt) =>
    opt.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
    opt.value.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setSearchQuery('');
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  // Focus search input on open
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 50);
    } else {
      setSearchQuery('');
    }
  }, [isOpen]);

  const handleSelect = (val: string) => {
    onChange(val);
    setIsOpen(false);
    setSearchQuery('');
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange('');
    setSearchQuery('');
  };

  const toggleDropdown = () => {
    if (disabled) return;
    setIsOpen((prev) => !prev);
  };

  return (
    <div ref={containerRef} className={`relative w-full ${className}`}>
      {/* Hidden input for HTML form validation if required */}
      {required && (
        <input
          type="text"
          value={value}
          onChange={() => {}}
          required
          aria-hidden="true"
          className="absolute inset-0 w-full h-full opacity-0 pointer-events-none -z-10"
        />
      )}

      {/* Trigger Box (Matches screenshot) */}
      <div
        id={id}
        onClick={toggleDropdown}
        role="button"
        tabIndex={disabled ? -1 : 0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            toggleDropdown();
          }
        }}
        className={`w-full min-h-[42px] px-3 py-2 bg-white border-2 border-black flex items-center justify-between gap-2 text-xs font-bold text-black cursor-pointer select-none transition-all shadow-[2px_2px_0px_#000] active:translate-x-[1px] active:translate-y-[1px] ${
          isOpen ? 'ring-2 ring-amber-300' : ''
        } ${disabled ? 'opacity-50 cursor-not-allowed bg-neutral-100' : ''}`}
      >
        <div className="flex items-center gap-2 truncate flex-1">
          {clearable && value && !disabled ? (
            <button
              type="button"
              onClick={handleClear}
              title="Clear selection"
              className="p-0.5 text-neutral-500 hover:text-red-600 hover:bg-neutral-100 border border-transparent hover:border-black transition-colors shrink-0"
            >
              <X className="w-3.5 h-3.5 stroke-[2.5]" />
            </button>
          ) : null}

          <span className={`truncate ${selectedOption ? 'text-black font-black' : 'text-neutral-400 font-medium'}`}>
            {selectedOption ? selectedOption.label : placeholder}
          </span>
        </div>

        <div className="shrink-0 text-black pl-1">
          {isOpen ? (
            <ChevronUp className="w-4 h-4 stroke-[2.5]" />
          ) : (
            <ChevronDown className="w-4 h-4 stroke-[2.5]" />
          )}
        </div>
      </div>

      {/* Dropdown Menu (Matches screenshot 1 & 2) */}
      {isOpen && (
        <div className="absolute left-0 right-0 top-full mt-1 z-50 bg-white border-2 border-black shadow-[4px_4px_0px_#000] overflow-hidden animate-in fade-in-50 zoom-in-95 duration-100">
          
          {/* Top Search Input inside dropdown */}
          <div className="p-2 border-b-2 border-black bg-neutral-50">
            <div className="relative">
              <input
                ref={searchInputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search..."
                className="w-full px-2.5 py-1.5 pr-7 bg-white border-2 border-black text-xs font-bold text-black focus:outline-none focus:ring-2 focus:ring-amber-300"
              />
              <Search className="w-3.5 h-3.5 absolute right-2.5 top-1/2 -translate-y-1/2 text-neutral-400 pointer-events-none" />
            </div>
          </div>

          {/* Options List */}
          <div className="max-h-56 overflow-y-auto custom-scrollbar divide-y divide-neutral-100">
            {/* Optional None / Clear Option */}
            <div
              onClick={() => handleSelect('')}
              className={`px-3 py-2 text-xs font-bold cursor-pointer transition-colors flex items-center justify-between ${
                !value
                  ? 'bg-amber-300 text-black font-black'
                  : 'text-neutral-500 hover:bg-amber-50 hover:text-black'
              }`}
            >
              <span>-- None (Root Category) --</span>
              {!value && <span className="font-black text-xs">✓</span>}
            </div>

            {filteredOptions.length === 0 ? (
              <div className="px-3 py-4 text-center text-xs font-medium text-neutral-500">
                No matching categories found
              </div>
            ) : (
              filteredOptions.map((opt) => {
                const isSelected = opt.value === value;
                return (
                  <div
                    key={opt.value}
                    onClick={() => handleSelect(opt.value)}
                    className={`px-3 py-2 text-xs font-bold cursor-pointer transition-colors flex items-center justify-between ${
                      isSelected
                        ? 'bg-amber-300 text-black font-black'
                        : 'text-black hover:bg-amber-50'
                    }`}
                  >
                    <span className="truncate">{opt.label}</span>
                    {isSelected && (
                      <span className="font-black text-xs shrink-0 ml-2">✓</span>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
};
