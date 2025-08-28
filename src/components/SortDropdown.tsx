"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";

interface SortOption {
  label: string;
  value: string;
  direction?: 'asc' | 'desc';
}

interface SortDropdownProps {
  options: SortOption[];
  onSortChange?: (sortBy: string, direction: 'asc' | 'desc') => void;
}

const SortDropdown = ({ options, onSortChange }: SortDropdownProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeSort, setActiveSort] = useState<{field: string, direction: 'asc' | 'desc'}>({
    field: '', 
    direction: 'asc'
  });
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const searchParams = useSearchParams();

  // Load sort from URL on mount
  useEffect(() => {
    const sortBy = searchParams.get('sortBy') || '';
    const sortOrder = searchParams.get('sortOrder') as 'asc' | 'desc' || 'asc';
    setActiveSort({ field: sortBy, direction: sortOrder });
  }, [searchParams]);

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

  const handleSortChange = (field: string, direction: 'asc' | 'desc') => {
    const newSort = { field, direction };
    setActiveSort(newSort);
    updateURL(field, direction);
    onSortChange?.(field, direction);
    setIsOpen(false);
  };

  const toggleDirection = (field: string) => {
    const newDirection = activeSort.field === field && activeSort.direction === 'asc' ? 'desc' : 'asc';
    handleSortChange(field, newDirection);
  };

  const updateURL = (sortBy: string, direction: 'asc' | 'desc') => {
    const params = new URLSearchParams(window.location.search);
    
    if (sortBy) {
      params.set('sortBy', sortBy);
      params.set('sortOrder', direction);
    } else {
      params.delete('sortBy');
      params.delete('sortOrder');
    }

    // Reset to page 1 when sort changes
    params.set('page', '1');

    router.push(`${window.location.pathname}?${params.toString()}`);
  };

  const clearSort = () => {
    setActiveSort({ field: '', direction: 'asc' });
    const params = new URLSearchParams(window.location.search);
    params.delete('sortBy');
    params.delete('sortOrder');
    params.set('page', '1');
    router.push(`${window.location.pathname}?${params.toString()}`);
    onSortChange?.('', 'asc');
  };

  const getActiveSortLabel = () => {
    if (!activeSort.field) return 'Default';
    const option = options.find(opt => opt.value === activeSort.field);
    return option ? `${option.label} ${activeSort.direction === 'asc' ? '↑' : '↓'}` : 'Default';
  };

  return (
    <div ref={dropdownRef} className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`bg-dark-elevated hover:bg-dark-elevated/80 text-dark-text-primary px-3 py-2 rounded-lg text-xs font-medium transition-colors duration-200 flex items-center gap-1 ${
          activeSort.field ? 'ring-2 ring-brand-primary/50 bg-brand-primary/10' : ''
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
            d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4"
          />
        </svg>
        Sort: {getActiveSortLabel()}
      </button>

      {isOpen && (
        <div className="sort-dropdown absolute right-0 mt-2 w-64 bg-dark-secondary/95 backdrop-blur-xl rounded-2xl border border-dark-border-primary shadow-2xl z-[99999] overflow-hidden" style={{zIndex: 99999, position: 'absolute'}}>
          <div className="px-4 py-3 border-b border-dark-border-secondary flex items-center justify-between">
            <h3 className="font-semibold text-dark-text-primary">Sort Options</h3>
            {activeSort.field && (
              <button
                onClick={clearSort}
                className="text-xs text-brand-primary hover:text-brand-secondary transition-colors duration-200"
              >
                Clear Sort
              </button>
            )}
          </div>

          <div className="p-2">
            {options.map((option) => {
              const isActive = activeSort.field === option.value;
              return (
                <div key={option.value} className="flex items-center">
                  <button
                    onClick={() => handleSortChange(option.value, option.direction || 'asc')}
                    className={`flex-1 flex items-center justify-between p-3 rounded-lg text-sm transition-colors duration-200 ${
                      isActive
                        ? 'bg-brand-primary/10 text-brand-primary'
                        : 'hover:bg-dark-elevated/50 text-dark-text-secondary hover:text-dark-text-primary'
                    }`}
                  >
                    <span>{option.label}</span>
                    <div className="flex items-center gap-1">
                      {isActive && (
                        <span className="text-xs bg-brand-primary/20 px-2 py-1 rounded-full">
                          Active
                        </span>
                      )}
                    </div>
                  </button>
                  
                  {isActive && (
                    <button
                      onClick={() => toggleDirection(option.value)}
                      className="ml-2 p-2 rounded-lg hover:bg-dark-elevated/50 text-brand-primary transition-colors duration-200"
                      title={`Sort ${activeSort.direction === 'asc' ? 'Descending' : 'Ascending'}`}
                    >
                      <svg
                        className={`w-4 h-4 transition-transform duration-200 ${
                          activeSort.direction === 'desc' ? 'rotate-180' : ''
                        }`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M7 11l5-5m0 0l5 5m-5-5v12"
                        />
                      </svg>
                    </button>
                  )}
                </div>
              );
            })}
          </div>

          <div className="px-4 py-3 bg-dark-tertiary/30 border-t border-dark-border-secondary">
            <div className="flex items-center justify-between text-xs text-dark-text-secondary">
              <span>
                Sorted by: {getActiveSortLabel()}
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

export default SortDropdown;