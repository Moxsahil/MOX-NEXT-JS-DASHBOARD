"use client";

import { ITEM_PER_PAGE } from "@/lib/settings";
import { useRouter } from "next/navigation";

const Pagination = ({ page, count }: { page: number; count: number }) => {
  const router = useRouter();
  const totalPages = Math.ceil(count / ITEM_PER_PAGE);
  const hasPrev = ITEM_PER_PAGE * (page - 1) > 0;
  const hasNext = ITEM_PER_PAGE * (page - 1) + ITEM_PER_PAGE < count;

  const changePage = (newPage: number) => {
    const params = new URLSearchParams(window.location.search);
    params.set("page", newPage.toString());
    router.push(`${window.location.pathname}?${params}`);
  };

  const getVisiblePages = () => {
    const delta = 2;
    const range = [];
    const rangeWithDots = [];
    let l;

    for (let i = Math.max(2, page - delta); i <= Math.min(totalPages - 1, page + delta); i++) {
      range.push(i);
    }

    if (page - delta > 2) {
      rangeWithDots.push(1, '...');
    } else {
      rangeWithDots.push(1);
    }

    rangeWithDots.push(...range);

    if (page + delta < totalPages - 1) {
      rangeWithDots.push('...', totalPages);
    } else if (totalPages > 1) {
      rangeWithDots.push(totalPages);
    }

    return rangeWithDots;
  };

  if (totalPages <= 1) return null;

  return (
    <div className="bg-dark-secondary/80 backdrop-blur-lg border border-dark-border-primary rounded-2xl shadow-2xl p-4">
      <div className="flex items-center justify-between">
        {/* Previous Button */}
        <button
          disabled={!hasPrev}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium text-sm transition-all duration-300 ${
            hasPrev
              ? 'bg-brand-primary text-white hover:bg-brand-primary/80 hover:scale-[1.02] shadow-xl'
              : 'bg-dark-elevated text-dark-text-disabled cursor-not-allowed'
          }`}
          onClick={() => changePage(page - 1)}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          <span className="hidden sm:inline">Previous</span>
        </button>

        {/* Page Numbers */}
        <div className="flex items-center gap-1">
          {getVisiblePages().map((pageNum, index) => {
            if (pageNum === '...') {
              return (
                <span key={`dots-${index}`} className="px-3 py-2 text-dark-text-disabled font-medium">
                  …
                </span>
              );
            }
            
            const pageIndex = pageNum as number;
            const isActive = page === pageIndex;
            
            return (
              <button
                key={pageIndex}
                className={`w-10 h-10 rounded-xl font-semibold text-sm transition-all duration-300 hover:scale-110 ${
                  isActive
                    ? 'bg-brand-primary text-white shadow-xl'
                    : 'bg-dark-elevated text-dark-text-primary hover:bg-brand-primary/20 hover:text-brand-primary shadow-xl'
                }`}
                onClick={() => changePage(pageIndex)}
              >
                {pageIndex}
              </button>
            );
          })}
        </div>

        {/* Next Button */}
        <button
          disabled={!hasNext}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium text-sm transition-all duration-300 ${
            hasNext
              ? 'bg-brand-primary text-white hover:bg-brand-primary/80 hover:scale-[1.02] shadow-xl'
              : 'bg-dark-elevated text-dark-text-disabled cursor-not-allowed'
          }`}
          onClick={() => changePage(page + 1)}
        >
          <span className="hidden sm:inline">Next</span>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
      
      {/* Page Info */}
      <div className="mt-3 text-center">
        <p className="text-sm text-dark-text-secondary">
          Showing {Math.min((page - 1) * ITEM_PER_PAGE + 1, count)} to {Math.min(page * ITEM_PER_PAGE, count)} of {count} results
        </p>
      </div>
    </div>
  );
};

export default Pagination;
