import React from 'react';
import { Layers } from 'lucide-react';
import { AUTOMOTIVE_CATEGORY_ITEMS } from '../../constants/automotiveConstants';

export default function AutomotiveCategoryFilters({
  selectedCategory,
  onSelectCategory,
  categoryCounts = {},
}) {
  return (
    <section aria-label="Automotive Categories" className="w-full bg-[#F8FAF8] pt-6 sm:pt-8 pb-3 sm:pb-4">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 md:px-10 lg:px-16">
        {/* Header row with "All Categories" pill option */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pb-3 mb-2">
          <div>
            <h2 
              className="text-lg sm:text-2xl font-bold text-[#081C15] tracking-tight"
              style={{ fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif" }}
            >
              Shop by Automotive Category
            </h2>
            <p className="text-xs sm:text-[13px] text-neutral-500 font-medium mt-0.5">
              Select a specialized category or browse all certified replacement parts below.
            </p>
          </div>

          {/* Quick "All Equipment" toggle */}
          <div className="self-start sm:self-auto">
            <button
              type="button"
              onClick={() => onSelectCategory('All')}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                selectedCategory === 'All'
                  ? 'bg-[#1B4332] text-white shadow-xs'
                  : 'bg-white text-neutral-700 border border-neutral-300 hover:border-[#52B788]'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>All Automotive ({categoryCounts['All'] || 0})</span>
            </button>
          </div>
        </div>

        {/* 6 Category Image Cards */}
        <div className="flex sm:grid sm:grid-cols-3 lg:grid-cols-6 gap-2.5 sm:gap-3.5 lg:gap-4 overflow-x-auto sm:overflow-visible no-scrollbar snap-x pb-2 select-none -mx-4 px-4 sm:mx-0 sm:px-0">
          {AUTOMOTIVE_CATEGORY_ITEMS.map((cat) => {
            const isSelected = selectedCategory === cat.id;
            const count = categoryCounts[cat.id] || 0;

            return (
              <div
                key={cat.id}
                role="button"
                tabIndex={0}
                aria-pressed={isSelected}
                onClick={() => onSelectCategory(isSelected ? 'All' : cat.id)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    onSelectCategory(isSelected ? 'All' : cat.id);
                  }
                }}
                className={`min-w-[155px] sm:min-w-0 flex-1 snap-start rounded-[18px] p-2.5 sm:p-3 transition-all duration-200 cursor-pointer flex flex-col justify-between relative group ${
                  isSelected
                    ? 'bg-[#1B4332] text-white shadow-md ring-2 ring-[#1B4332] ring-offset-2'
                    : 'bg-white text-neutral-800 border border-neutral-200 hover:border-[#52B788] hover:shadow-xs hover:-translate-y-0.5'
                }`}
              >
                {/* Image Area with subtle zoom */}
                <div className={`w-full h-20 sm:h-24 rounded-[12px] overflow-hidden flex items-center justify-center p-2 mb-2 transition-colors ${
                  isSelected ? 'bg-[#081C15]' : 'bg-neutral-50 group-hover:bg-[#1B4332]/5'
                }`}>
                  <img
                    src={cat.image}
                    alt={cat.title}
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = cat.fallback;
                    }}
                    className="max-h-full max-w-full w-auto h-auto object-contain transition-transform duration-300 group-hover:scale-105"
                    loading="lazy"
                  />
                </div>

                {/* Title & Count Badge */}
                <div className="flex flex-col min-w-0">
                  <span className={`text-xs font-bold leading-tight truncate ${
                    isSelected ? 'text-white' : 'text-neutral-900'
                  }`}>
                    {cat.title}
                  </span>
                  <span className={`text-[10.5px] font-medium mt-0.5 ${
                    isSelected ? 'text-neutral-400' : 'text-neutral-500'
                  }`}>
                    {count} {count === 1 ? 'item' : 'items'}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

