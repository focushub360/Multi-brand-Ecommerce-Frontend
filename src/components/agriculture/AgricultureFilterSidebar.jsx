import React, { useEffect } from 'react';
import { 
  X, 
  RotateCcw, 
  SlidersHorizontal, 
  Search 
} from 'lucide-react';
import { PRICE_RANGES, CATEGORIES } from '../../constants/agriConstants';

export default function AgricultureFilterSidebar({
  selectedCategory,
  onSelectCategory,
  priceRange,
  onSelectPriceRange,
  stockFilter,
  onSelectStockFilter,
  minRating,
  onSelectMinRating,
  searchQuery,
  onSearchChange,
  onResetFilters,
  categoryCounts = {},
  isMobileOpen = false,
  onCloseMobile,
}) {
  const isAnyFilterActive = 
    selectedCategory !== 'All' || 
    priceRange !== 'all' || 
    stockFilter !== 'all' || 
    minRating > 0 || 
    searchQuery.trim() !== '';

  // Lock body scroll when mobile filter drawer is open
  useEffect(() => {
    if (isMobileOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMobileOpen]);

  const renderFilterSections = () => (
    <div className="space-y-6">
      {/* Header & Reset */}
      <div className="flex items-center justify-between pb-3.5 border-b border-neutral-100">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="w-4 h-4 text-[#1B4332]" />
          <h3 className="text-base font-extrabold text-[#081C15] tracking-tight">
            Filters &amp; Search
          </h3>
        </div>

        {isAnyFilterActive && (
          <button
            type="button"
            onClick={onResetFilters}
            className="inline-flex items-center gap-1 text-xs font-bold text-[#FF383F] hover:text-[#d3272e] transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Reset</span>
          </button>
        )}
      </div>

      {/* 1. Keyword Search */}
      <div>
        <label htmlFor="sidebar-search" className="block text-xs font-extrabold uppercase tracking-wider text-neutral-500 mb-2">
          Search Products
        </label>
        <div className="relative flex items-center bg-neutral-50 rounded-[12px] border border-neutral-200 focus-within:border-[#1B4332] focus-within:bg-white transition-all">
          <Search className="w-3.5 h-3.5 ml-3 text-neutral-400 shrink-0" />
          <input
            id="sidebar-search"
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search keywords..."
            className="w-full bg-transparent py-2 pl-2 pr-7 text-xs font-medium text-neutral-900 outline-none placeholder:text-neutral-400 min-w-0"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => onSearchChange('')}
              className="absolute right-2 text-neutral-400 hover:text-neutral-700 p-0.5"
            >
              <X className="w-3 h-3" />
            </button>
          )}
        </div>
      </div>

      {/* 2. Category Filter */}
      <div>
        <h4 className="text-xs font-extrabold uppercase tracking-wider text-neutral-500 mb-2.5">
          Categories
        </h4>
        <div className="space-y-1">
          {CATEGORIES.map((cat) => {
            const isSelected = selectedCategory === cat;
            const count = categoryCounts[cat] || 0;

            return (
              <button
                key={cat}
                type="button"
                onClick={() => onSelectCategory(cat)}
                className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-[10px] text-xs font-semibold transition-all cursor-pointer text-left ${
                  isSelected
                    ? 'bg-[#1B4332] text-white font-bold'
                    : 'text-neutral-700 hover:bg-neutral-100/80 hover:text-neutral-900'
                }`}
              >
                <span className="truncate pr-2">{cat}</span>
                <span className={`text-[10px] px-1.5 py-0.5 rounded-full shrink-0 ${
                  isSelected 
                    ? 'bg-white/20 text-white' 
                    : 'bg-neutral-100 text-neutral-500'
                }`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. Price Range Filter */}
      <div>
        <h4 className="text-xs font-extrabold uppercase tracking-wider text-neutral-500 mb-2.5">
          Price Range
        </h4>
        <div className="space-y-1">
          {PRICE_RANGES.map((range) => {
            const isSelected = priceRange === range.id;
            return (
              <button
                key={range.id}
                type="button"
                onClick={() => onSelectPriceRange(range.id)}
                className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-[10px] text-xs font-semibold transition-all cursor-pointer text-left ${
                  isSelected
                    ? 'bg-[#1B4332] text-white font-bold'
                    : 'text-neutral-700 hover:bg-neutral-100/80 hover:text-neutral-900'
                }`}
              >
                <span>{range.label}</span>
                {isSelected && (
                  <span className="w-1.5 h-1.5 rounded-full bg-[#52B788] shrink-0" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* 4. Stock Availability Filter */}
      <div>
        <h4 className="text-xs font-extrabold uppercase tracking-wider text-neutral-500 mb-2.5">
          Availability
        </h4>
        <div className="space-y-1">
          {[
            { id: 'all', label: 'All Items' },
            { id: 'in-stock', label: 'In Stock Only' },
            { id: 'limited', label: 'Limited Stock' },
          ].map((st) => {
            const isSelected = stockFilter === st.id;
            return (
              <button
                key={st.id}
                type="button"
                onClick={() => onSelectStockFilter(st.id)}
                className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-[10px] text-xs font-semibold transition-all cursor-pointer text-left ${
                  isSelected
                    ? 'bg-[#1B4332] text-white font-bold'
                    : 'text-neutral-700 hover:bg-neutral-100/80 hover:text-neutral-900'
                }`}
              >
                <span>{st.label}</span>
                {isSelected && (
                  <span className="w-1.5 h-1.5 rounded-full bg-[#52B788] shrink-0" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* 5. Rating Filter */}
      <div>
        <h4 className="text-xs font-extrabold uppercase tracking-wider text-neutral-500 mb-2.5">
          Customer Rating
        </h4>
        <div className="space-y-1">
          {[
            { rating: 0, label: 'Any Rating' },
            { rating: 4.5, label: '4.5 & Above' },
            { rating: 4.0, label: '4.0 & Above' },
          ].map((r) => {
            const isSelected = minRating === r.rating;
            return (
              <button
                key={r.rating}
                type="button"
                onClick={() => onSelectMinRating(r.rating)}
                className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-[10px] text-xs font-semibold transition-all cursor-pointer text-left ${
                  isSelected
                    ? 'bg-[#1B4332] text-white font-bold'
                    : 'text-neutral-700 hover:bg-neutral-100/80 hover:text-neutral-900'
                }`}
              >
                <span>{r.label}</span>
                {isSelected && (
                  <span className="w-1.5 h-1.5 rounded-full bg-[#52B788] shrink-0" />
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sticky Sidebar (>= lg) */}
      <div className="hidden lg:block w-[280px] shrink-0">
        <aside className="sticky top-6 w-full bg-white rounded-[20px] p-5 border border-neutral-200/80 shadow-2xs">
          {renderFilterSections()}
        </aside>
      </div>

      {/* Mobile Drawer (< lg) */}
      {isMobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          {/* Backdrop */}
          <div 
            onClick={onCloseMobile} 
            className="fixed inset-0 bg-neutral-950/60 backdrop-blur-xs transition-opacity" 
          />

          {/* Slide-over Content */}
          <div className="relative ml-auto w-[88vw] max-w-xs bg-white h-full overflow-y-auto p-4 sm:p-5 shadow-2xl flex flex-col justify-between z-10 animate-in slide-in-from-right duration-200">
            <div>
              <div className="flex items-center justify-between pb-3 mb-4 border-b border-neutral-100">
                <span className="font-extrabold text-base text-[#081C15]">Filters</span>
                <button
                  type="button"
                  onClick={onCloseMobile}
                  className="p-1.5 rounded-full text-neutral-500 hover:text-neutral-800 hover:bg-neutral-100"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {renderFilterSections()}
            </div>

            <div className="pt-4 mt-4 border-t border-neutral-100">
              <button
                type="button"
                onClick={onCloseMobile}
                className="w-full py-3 rounded-[12px] bg-[#1B4332] text-white font-bold text-xs shadow-md"
              >
                Apply Filters
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
