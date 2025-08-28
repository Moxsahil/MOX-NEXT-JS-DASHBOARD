"use client";

import TableSearch from "./TableSearch";
import FilterDropdown from "./FilterDropdown";
import SortDropdown from "./SortDropdown";

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

interface SortOption {
  label: string;
  value: string;
  direction?: 'asc' | 'desc';
}

interface TableControlsProps {
  searchPlaceholder?: string;
  filters?: FilterGroup[];
  sortOptions?: SortOption[];
  totalCount: number;
  showExtraSelects?: Array<{
    placeholder: string;
    options: Array<{ label: string; value: string; count?: number }>;
    onChange?: (value: string) => void;
  }>;
  onFilterChange?: (filters: Record<string, string | string[]>) => void;
  onSortChange?: (sortBy: string, direction: 'asc' | 'desc') => void;
}

const TableControls = ({
  searchPlaceholder = "Search records...",
  filters = [],
  sortOptions = [],
  totalCount,
  showExtraSelects = [],
  onFilterChange,
  onSortChange,
}: TableControlsProps) => {
  return (
    <div className="bg-dark-secondary/80 backdrop-blur-xl rounded-2xl p-6 shadow-2xl border border-dark-border-primary mb-8 relative z-10">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-4 flex-wrap">
          {/* Search */}
          <div className="relative">
            <TableSearch placeholder={searchPlaceholder} />
          </div>
          
          {/* Extra Select Controls */}
          {showExtraSelects.map((select, index) => (
            <select 
              key={index}
              className="input-modern"
              onChange={(e) => select.onChange?.(e.target.value)}
            >
              <option className="bg-dark-secondary text-dark-text-primary">
                {select.placeholder}
              </option>
              {select.options.map((option) => (
                <option 
                  key={option.value} 
                  value={option.value}
                  className="bg-dark-secondary text-dark-text-primary"
                >
                  {option.label} {option.count ? `(${option.count})` : ''}
                </option>
              ))}
            </select>
          ))}
        </div>
        
        <div className="flex items-center gap-2 flex-wrap">
          {/* Sort Dropdown */}
          {sortOptions.length > 0 && (
            <SortDropdown 
              options={sortOptions}
              onSortChange={onSortChange}
            />
          )}
          
          {/* Filter Dropdown */}
          {filters.length > 0 && (
            <FilterDropdown 
              filters={filters}
              onFilterChange={onFilterChange}
            />
          )}
          
          {/* Total Count */}
          <div className="bg-dark-elevated/50 px-3 py-2 rounded-lg text-xs font-medium text-dark-text-secondary">
            {totalCount} Total
          </div>
        </div>
      </div>
    </div>
  );
};

export default TableControls;