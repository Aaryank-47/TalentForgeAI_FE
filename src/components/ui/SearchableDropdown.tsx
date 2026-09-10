import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check } from 'lucide-react';

export interface Option {
  value: string;
  label: string;
}

interface SearchableDropdownProps {
  options: Option[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  searchPlaceholder?: string;
  className?: string;
}

export function SearchableDropdown({
  options,
  value,
  onChange,
  placeholder = 'Select...',
  searchPlaceholder = 'Search...',
  className = '',
}: SearchableDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find((opt) => opt.value === value);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredOptions = options.filter((opt) =>
    opt.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      <div
        className="input-field text-xs flex items-center justify-between cursor-pointer bg-white"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className={selectedOption ? 'text-slate-900 truncate' : 'text-slate-400 truncate'}>
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <ChevronDown className="w-4 h-4 text-slate-400 flex-shrink-0 ml-2" />
      </div>

      {isOpen && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-slate-200 rounded-lg shadow-lg overflow-hidden">
          <div className="p-1.5 border-b border-slate-100 bg-slate-50">
            <input
              type="text"
              className="w-full px-2 py-1.5 text-xs border border-slate-200 rounded focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500"
              placeholder={searchPlaceholder}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onClick={(e) => e.stopPropagation()}
              autoFocus
            />
          </div>
          <div className="max-h-48 overflow-y-auto py-1">
            {filteredOptions.length > 0 ? (
              filteredOptions.map((opt) => (
                <div
                  key={opt.value}
                  className={`px-3 py-2 text-xs cursor-pointer hover:bg-primary-50 hover:text-primary-700 flex items-center justify-between transition-colors ${
                    value === opt.value ? 'bg-primary-50 text-primary-700 font-medium' : 'text-slate-700'
                  }`}
                  onClick={() => {
                    onChange(opt.value);
                    setIsOpen(false);
                    setSearchTerm('');
                  }}
                >
                  <span className="truncate">{opt.label}</span>
                  {value === opt.value && <Check className="w-3.5 h-3.5 text-primary-600 flex-shrink-0" />}
                </div>
              ))
            ) : (
              <div className="px-3 py-3 text-xs text-slate-500 text-center">No results found</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
