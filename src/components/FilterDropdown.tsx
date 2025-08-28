"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";

interface FilterOption {
  label: string;
  value: string;
  count?: number;
}

interface FilterGroup {
  key: string;
  label: string;
  options: FilterOption[];
  type?: 'single' | 'multiple';
}

interface FilterDropdownProps {
  filters: FilterGroup[];
  onFilterChange?: (filters: Record<string, string | string[]>) => void;
}

const FilterDropdown = ({ filters, onFilterChange }: FilterDropdownProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeFilters, setActiveFilters] = useState<Record<string, string | string[]>>({});
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const searchParams = useSearchParams();

  // Load filters from URL on mount
  useEffect(() => {
    const filtersFromUrl: Record<string, string | string[]> = {};
    filters.forEach(group => {
      const value = searchParams.get(group.key);
      if (value) {
        if (group.type === 'multiple') {
          filtersFromUrl[group.key] = value.split(',');
        } else {
          filtersFromUrl[group.key] = value;
        }
      }
    });
    setActiveFilters(filtersFromUrl);
  }, [searchParams, filters]);

  // Handle outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  const handleFilterChange = (groupKey: string, value: string, type: 'single' | 'multiple' = 'single') => {
    const newFilters = { ...activeFilters };

    if (type === 'multiple') {
      const currentValues = (newFilters[groupKey] as string[]) || [];
      if (currentValues.includes(value)) {
        newFilters[groupKey] = currentValues.filter(v => v !== value);
        if (newFilters[groupKey].length === 0) {
          delete newFilters[groupKey];
        }
      } else {
        newFilters[groupKey] = [...currentValues, value];
      }
    } else {
      if (newFilters[groupKey] === value) {
        delete newFilters[groupKey];
      } else {
        newFilters[groupKey] = value;
      }
    }

    setActiveFilters(newFilters);
    updateURL(newFilters);
    onFilterChange?.(newFilters);
  };

  const updateURL = (activeFilters: Record<string, string | string[]>) => {
    const params = new URLSearchParams(window.location.search);
    
    // Clear existing filter params
    filters.forEach(group => {
      params.delete(group.key);
    });

    // Add new filter params
    Object.entries(activeFilters).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        if (value.length > 0) {
          params.set(key, value.join(','));
        }
      } else {
        params.set(key, value);
      }
    });

    // Reset to page 1 when filters change
    params.set('page', '1');

    router.push(`${window.location.pathname}?${params.toString()}`);
  };

  const clearAllFilters = () => {
    setActiveFilters({});
    const params = new URLSearchParams(window.location.search);
    filters.forEach(group => {
      params.delete(group.key);
    });
    params.set('page', '1');
    router.push(`${window.location.pathname}?${params.toString()}`);
    onFilterChange?.({});
  };

  const getActiveFilterCount = () => {
    return Object.keys(activeFilters).length;
  };

  const isFilterActive = (groupKey: string, value: string) => {
    const filterValue = activeFilters[groupKey];
    if (Array.isArray(filterValue)) {
      return filterValue.includes(value);
    }
    return filterValue === value;
  };

  return (
    <div ref={dropdownRef} className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`bg-dark-elevated hover:bg-dark-elevated/80 text-dark-text-primary px-3 py-2 rounded-lg text-xs font-medium transition-colors duration-200 flex items-center gap-1 ${
          getActiveFilterCount() > 0 ? 'ring-2 ring-brand-primary/50 bg-brand-primary/10' : ''
        }`}
      >
        <svg
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
          />
        </svg>
        Filter
        {getActiveFilterCount() > 0 && (
          <span className="bg-brand-primary text-white text-xs px-1.5 py-0.5 rounded-full min-w-[18px] h-4 flex items-center justify-center">
            {getActiveFilterCount()}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="filter-dropdown absolute right-0 mt-2 w-80 bg-dark-secondary/95 backdrop-blur-xl rounded-2xl border border-dark-border-primary shadow-2xl z-[99999] overflow-hidden" style={{zIndex: 99999, position: 'absolute'}}>
          <div className="px-4 py-3 border-b border-dark-border-secondary flex items-center justify-between">
            <h3 className="font-semibold text-dark-text-primary">Filter Options</h3>
            {getActiveFilterCount() > 0 && (
              <button
                onClick={clearAllFilters}
                className="text-xs text-brand-primary hover:text-brand-secondary transition-colors duration-200"
              >
                Clear All
              </button>
            )}
          </div>

          <div className="max-h-96 overflow-y-auto">
            {filters.map((group) => (
              <div key={group.key} className="p-4 border-b border-dark-border-secondary/50">
                <h4 className="text-sm font-semibold text-dark-text-primary mb-3 flex items-center gap-2">
                  {group.label}
                  {group.type === 'multiple' && (
                    <span className="text-xs text-dark-text-tertiary bg-dark-elevated px-2 py-0.5 rounded-full">
                      Multiple
                    </span>
                  )}
                </h4>
                <div className="space-y-2">
                  {group.options.map((option) => {
                    const isActive = isFilterActive(group.key, option.value);
                    return (
                      <button
                        key={option.value}
                        onClick={() => handleFilterChange(group.key, option.value, group.type)}
                        className={`w-full flex items-center justify-between p-2 rounded-lg text-sm transition-colors duration-200 ${
                          isActive
                            ? 'bg-brand-primary/10 text-brand-primary border border-brand-primary/20'
                            : 'hover:bg-dark-elevated/50 text-dark-text-secondary hover:text-dark-text-primary'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <div className={`w-4 h-4 rounded border-2 flex items-center justify-center ${
                            isActive 
                              ? 'border-brand-primary bg-brand-primary' 
                              : 'border-dark-border-secondary'
                          }`}>
                            {isActive && (
                              <svg className="w-2.5 h-2.5 text-white" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                              </svg>
                            )}
                          </div>
                          <span>{option.label}</span>
                        </div>
                        {option.count !== undefined && (
                          <span className="text-xs text-dark-text-tertiary bg-dark-elevated px-2 py-1 rounded-full">
                            {option.count}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          <div className="p-4 bg-dark-tertiary/30">
            <div className="flex items-center justify-between text-xs text-dark-text-secondary">
              <span>
                {getActiveFilterCount()} filter{getActiveFilterCount() !== 1 ? 's' : ''} active
              </span>
              <button
                onClick={() => setIsOpen(false)}
                className="text-brand-primary hover:text-brand-secondary transition-colors duration-200"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FilterDropdown;