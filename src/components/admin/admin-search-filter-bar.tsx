'use client';

import { useState, useEffect, useRef } from 'react';
import { Search, X } from 'lucide-react';

export interface FilterOption {
  value: string;
  label: string;
}

export interface FilterGroup {
  key: string;
  label: string;
  options: FilterOption[];
}

interface Props {
  placeholder?: string;
  filters?: FilterGroup[];
  activeFilters: Record<string, string>;
  onSearchChange: (query: string) => void;
  onFilterChange: (key: string, value: string) => void;
  onClear: () => void;
}

export function AdminSearchFilterBar({
  placeholder = 'Search…',
  filters = [],
  activeFilters,
  onSearchChange,
  onFilterChange,
  onClear,
}: Props) {
  const [input, setInput] = useState('');
  const cbRef = useRef(onSearchChange);
  useEffect(() => { cbRef.current = onSearchChange; }, [onSearchChange]);

  useEffect(() => {
    const timer = setTimeout(() => cbRef.current(input), 200);
    return () => clearTimeout(timer);
  }, [input]);

  const hasActiveFilter = Object.values(activeFilters).some((v) => v !== '' && v !== 'all');
  const showClear = hasActiveFilter || input.trim().length > 0;

  function handleClear() {
    setInput('');
    onClear();
  }

  return (
    <div className="space-y-2">
      {/* Search input */}
      <div className="relative">
        <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#4B5563] pointer-events-none" />
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={placeholder}
          className="w-full pl-8 pr-4 py-2 bg-[#111827] border border-[#374151] rounded-lg text-[#F4F4F2] font-mono text-xs placeholder:text-[#4B5563] focus:outline-none focus:border-[#00E87A] focus:ring-1 focus:ring-[#00E87A]/20 transition-colors"
        />
      </div>

      {/* Filter pill rows + clear */}
      {(filters.length > 0 || showClear) && (
        <div className="flex flex-wrap items-start gap-x-4 gap-y-1.5">
          {filters.map((group) => (
            <div key={group.key} className="flex items-center gap-1 flex-wrap">
              <span className="text-[#4B5563] text-[10px] font-mono uppercase tracking-wider shrink-0">
                {group.label}:
              </span>
              {[{ value: '', label: 'All' }, ...group.options].map((opt) => {
                const current = activeFilters[group.key] ?? '';
                const isActive = current === opt.value;
                return (
                  <button
                    key={opt.value}
                    onClick={() => onFilterChange(group.key, opt.value)}
                    className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold border transition-colors ${
                      isActive
                        ? 'bg-[#00E87A]/10 text-[#00E87A] border-[#00E87A]/40'
                        : 'bg-transparent text-[#6B7280] border-[#374151] hover:border-[#4B5563] hover:text-[#9CA3AF]'
                    }`}
                  >
                    {opt.label}
                  </button>
                );
              })}
            </div>
          ))}

          {showClear && (
            <button
              onClick={handleClear}
              className="ml-auto flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono text-[#6B7280] border border-[#374151] hover:text-[#F4F4F2] hover:border-[#4B5563] transition-colors"
            >
              <X size={10} />
              Clear
            </button>
          )}
        </div>
      )}
    </div>
  );
}
