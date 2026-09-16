import React, { useState, useRef, useEffect, useMemo } from 'react';
import { ChevronDown, Search, Check } from 'lucide-react';
import { getCountries, getCountryCallingCode, type CountryCode } from 'libphonenumber-js';

interface CountryCodeSelectProps {
  value: CountryCode;
  onChange: (country: CountryCode) => void;
  disabled?: boolean;
  className?: string;
}

export const CountryCodeSelect: React.FC<CountryCodeSelectProps> = ({
  value,
  onChange,
  disabled = false,
  className = '',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);

  const countries = useMemo(() => getCountries(), []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredCountries = useMemo(() => {
    if (!searchTerm.trim()) return countries;
    const term = searchTerm.toLowerCase();
    return countries.filter(c => {
      const code = getCountryCallingCode(c);
      return c.toLowerCase().includes(term) || code.includes(term);
    });
  }, [countries, searchTerm]);

  const callingCode = getCountryCallingCode(value);

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      <button
        type="button"
        disabled={disabled}
        onClick={() => !disabled && setIsOpen(!isOpen)}
        className={`w-full px-3 py-2.5 border border-slate-200 rounded-xl text-xs font-semibold flex items-center justify-between gap-1 transition-all ${
          disabled
            ? 'bg-slate-50 text-slate-500 cursor-not-allowed border-slate-200'
            : 'bg-slate-50 text-slate-700 hover:bg-slate-100 hover:border-slate-300 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:bg-white'
        }`}
      >
        <span className="truncate">{value} (+{callingCode})</span>
        <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 flex-shrink-0 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* Popup Menu - ALWAYS opens downward! */}
      {isOpen && (
        <div className="absolute top-full left-0 mt-1 w-64 bg-white border border-slate-200 rounded-xl shadow-xl z-50 overflow-hidden">
          <div className="p-2 border-b border-slate-100 bg-slate-50 flex items-center gap-2">
            <Search className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
            <input
              type="text"
              autoFocus
              className="w-full text-xs bg-transparent focus:outline-none text-slate-800 placeholder-slate-400"
              placeholder="Search country or code..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onClick={(e) => e.stopPropagation()}
            />
          </div>
          <div className="max-h-56 overflow-y-auto py-1 divide-y divide-slate-50">
            {filteredCountries.length > 0 ? (
              filteredCountries.map((c) => {
                const isSelected = c === value;
                const code = getCountryCallingCode(c);
                return (
                  <button
                    key={c}
                    type="button"
                    onClick={() => {
                      onChange(c);
                      setIsOpen(false);
                      setSearchTerm('');
                    }}
                    className={`w-full px-3.5 py-2 text-left text-xs flex items-center justify-between transition-colors ${
                      isSelected
                        ? 'bg-primary-50 text-primary-700 font-bold'
                        : 'text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <span>{c}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-slate-400 font-mono text-[11px]">+{code}</span>
                      {isSelected && <Check className="w-3.5 h-3.5 text-primary-600" />}
                    </div>
                  </button>
                );
              })
            ) : (
              <div className="px-3 py-4 text-center text-xs text-slate-400">
                No countries found
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
