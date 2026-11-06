
import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function GroceriesPagination({
  currentPage,
  totalPages,
  onPageChange,
}) {
  if (totalPages <= 1) return null;

  const getPages = () => {
    const pages = [];

    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else if (currentPage <= 3) {
      pages.push(1, 2, 3, 4, '...', totalPages);
    } else if (currentPage >= totalPages - 2) {
      pages.push(
        1,
        '...',
        totalPages - 3,
        totalPages - 2,
        totalPages - 1,
        totalPages
      );
    } else {
      pages.push(
        1,
        '...',
        currentPage - 1,
        currentPage,
        currentPage + 1,
        '...',
        totalPages
      );
    }

    return pages;
  };

  return (
    <nav
      aria-label="Groceries pagination"
      className="flex flex-wrap justify-center items-center gap-1.5 sm:gap-2 mt-8 sm:mt-10"
    >
      <button
        type="button"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="h-9 sm:h-10 px-2.5 sm:px-4 flex items-center gap-1 rounded-lg border border-neutral-200 bg-white text-xs sm:text-sm font-semibold text-neutral-700 hover:border-[#52B788] hover:text-[#1B4332] disabled:opacity-40 disabled:cursor-not-allowed transition"
      >
        <ChevronLeft size={16} />
        <span>Previous</span>
      </button>

      {getPages().map((page, index) =>
        page === '...' ? (
          <span
            key={`dots-${index}`}
            className="w-7 text-center text-neutral-400"
          >
            ...
          </span>
        ) : (
          <button
            key={page}
            type="button"
            onClick={() => onPageChange(page)}
            aria-label={`Go to page ${page}`}
            aria-current={currentPage === page ? 'page' : undefined}
            className={`w-9 h-9 sm:w-10 sm:h-10 rounded-lg text-xs sm:text-sm font-bold transition-all ${
              currentPage === page
                ? 'bg-[#1B4332] text-white shadow-md'
                : 'bg-white border border-neutral-200 text-neutral-700 hover:border-[#52B788] hover:text-[#1B4332]'
            }`}
          >
            {page}
          </button>
        )
      )}

      <button
        type="button"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="h-9 sm:h-10 px-2.5 sm:px-4 flex items-center gap-1 rounded-lg border border-neutral-200 bg-white text-xs sm:text-sm font-semibold text-neutral-700 hover:border-[#52B788] hover:text-[#1B4332] disabled:opacity-40 disabled:cursor-not-allowed transition"
      >
        <span>Next</span>
        <ChevronRight size={16} />
      </button>
    </nav>
  );
}
