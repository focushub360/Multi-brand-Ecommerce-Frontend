import React from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';

export default function AgriculturePagination({
  currentPage,
  totalPages,
  onPageChange,
  totalItems,
}) {
  if (totalPages <= 1) return null;

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <nav 
      aria-label="Agriculture products pagination" 
      className="w-full bg-transparent pt-6 pb-10 flex flex-col sm:flex-row items-center justify-between gap-3.5 border-t border-neutral-200/60 mt-4 text-center sm:text-left"
    >
      <div className="text-xs sm:text-[13px] text-neutral-500 font-medium">
        Page <span className="font-bold text-neutral-800">{currentPage}</span> of{' '}
        <span className="font-bold text-neutral-800">{totalPages}</span> ({totalItems} total products)
      </div>

      <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap justify-center">
        {/* Previous Button */}
        <button
          type="button"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          aria-label="Go to previous page"
          className="inline-flex items-center gap-1 px-2.5 sm:px-3 py-1.5 rounded-[10px] border border-neutral-300 bg-white text-xs sm:text-[13px] font-bold text-neutral-700 hover:bg-neutral-50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-all shadow-2xs"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span className="hidden min-[400px]:inline">Previous</span>
        </button>

        {/* Page Number Buttons */}
        <div className="flex items-center gap-1">
          {pages.map((pageNum) => {
            const isActive = pageNum === currentPage;
            return (
              <button
                key={pageNum}
                type="button"
                onClick={() => onPageChange(pageNum)}
                aria-current={isActive ? 'page' : undefined}
                aria-label={`Page ${pageNum}`}
                className={`w-7 h-7 sm:w-8 sm:h-8 rounded-[10px] text-xs sm:text-[13px] font-bold transition-all cursor-pointer flex items-center justify-center ${
                  isActive
                    ? 'bg-[#1B4332] text-white shadow-xs'
                    : 'bg-white border border-neutral-200 text-neutral-700 hover:bg-[#EDF0D9]/50'
                }`}
              >
                {pageNum}
              </button>
            );
          })}
        </div>

        {/* Next Button */}
        <button
          type="button"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          aria-label="Go to next page"
          className="inline-flex items-center gap-1 px-2.5 sm:px-3 py-1.5 rounded-[10px] border border-neutral-300 bg-white text-xs sm:text-[13px] font-bold text-neutral-700 hover:bg-neutral-50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-all shadow-2xs"
        >
          <span className="hidden min-[400px]:inline">Next</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </nav>
  );
}
