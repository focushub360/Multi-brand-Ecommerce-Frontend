import React, { useEffect } from 'react';
import { 
  X, 
  RotateCcw, 
  SlidersHorizontal, 
  Search,
  Star
} from 'lucide-react';
import { PRICE_RANGES, CATEGORIES, BRANDS } from '../../constants/automotiveConstants';

export default function AutomotiveFilterSidebar({
  selectedCategory,
  onSelectCategory,
  priceRange,
  onSelectPriceRange,
  selectedBrand,
  onSelectBrand,
  stockFilter,
  onSelectStockFilter,
  minRating,
  onSelectMinRating,
  searchQuery,
  onSearchChange,
  onResetFilters,
  categoryCounts = {},
  brandCounts = {},
  isMobileOpen = false,
  onCloseMobile,
}) {
  const isAnyFilterActive = 
    selectedCategory !== 'All' || 
    priceRange !== 'all' || 
    (selectedBrand && selectedBrand !== 'All') ||
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
            className="inline-flex items-center gap-1 text-xs font-bold text-[#1B4332] hover:text-[#081C15] transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Reset</span>
          </button>
        )}
      </div>

      {/* 1. Keyword Search */}
      <div>
        <label htmlFor="automotive-sidebar-search" className="block text-xs font-extrabold uppercase tracking-wider text-neutral-500 mb-2">
          Search Products
        </label>
        <div className="relative flex items-center bg-neutral-50 rounded-[12px] border border-neutral-200 focus-within:border-[#1B4332] focus-within:bg-white transition-all">
          <Search className="w-3.5 h-3.5 ml-3 text-neutral-400 shrink-0" />
          <input
            id="automotive-sidebar-search"
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search tyres, brake pads..."
            className="w-full bg-transparent py-2 pl-2 pr-7 text-xs font-medium text-neutral-900 outline-none placeholder:text-neutral-400 min-w-0"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => onSearchChange('')}
              className="absolute right-2 text-neutral-400 hover:text-neutral-700 p-0.5 cursor-pointer"
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
                    ? 'bg-[#1B4332] text-white shadow-2xs'
                    : 'text-neutral-700 hover:bg-[#E9F3ED] hover:text-[#1B4332]'
                }`}
              >
                <span className="truncate pr-2">{cat}</span>
                <span className={`text-[10.5px] px-1.5 py-0.5 rounded-full ${
                  isSelected ? 'bg-[#081C15] text-neutral-200' : 'bg-neutral-100 text-neutral-500'
                }`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. Brand Filter */}
      <div>
        <h4 className="text-xs font-extrabold uppercase tracking-wider text-neutral-500 mb-2.5">
          Brand
        </h4>
        <div className="space-y-1">
          {BRANDS.map((b) => {
            const isSelected = (selectedBrand || 'All') === b;
            const count = brandCounts[b] || 0;

            return (
              <button
                key={b}
                type="button"
                onClick={() => onSelectBrand(b)}
                className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-[10px] text-xs font-semibold transition-all cursor-pointer text-left ${
                  isSelected
                    ? 'bg-[#1B4332] text-white shadow-2xs'
                    : 'text-neutral-700 hover:bg-[#E9F3ED] hover:text-[#1B4332]'
                }`}
              >
                <span className="truncate pr-2">{b === 'All' ? 'All Brands' : b}</span>
                {count > 0 && (
                  <span className={`text-[10.5px] px-1.5 py-0.5 rounded-full ${
                    isSelected ? 'bg-[#081C15] text-neutral-200' : 'bg-neutral-100 text-neutral-500'
                  }`}>
                    {count}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* 4. Price Ranges */}
      <div>
        <h4 className="text-xs font-extrabold uppercase tracking-wider text-neutral-500 mb-2.5">
          Price Range
        </h4>
        <div className="space-y-1.5">
          {PRICE_RANGES.map((range) => {
            const isSelected = priceRange === range.id;
            return (
              <label
                key={range.id}
                className="flex items-center gap-2.5 text-xs text-neutral-700 hover:text-neutral-900 cursor-pointer select-none py-0.5"
              >
                <input
                  type="radio"
                  name="automotive-price-range"
                  checked={isSelected}
                  onChange={() => onSelectPriceRange(range.id)}
                  className="w-3.5 h-3.5 text-[#1B4332] border-neutral-300 focus:ring-[#1B4332] cursor-pointer"
                />
                <span className={isSelected ? 'font-bold text-neutral-900' : 'font-medium'}>
                  {range.label}
                </span>
              </label>
            );
          })}
        </div>
      </div>

      {/* 5. Stock Filter */}
      <div>
        <h4 className="text-xs font-extrabold uppercase tracking-wider text-neutral-500 mb-2">
          Availability
        </h4>
        <div className="flex flex-wrap gap-1.5">
          {[
            { id: 'all', label: 'All Items' },
            { id: 'in-stock', label: 'In Stock' },
            { id: 'limited', label: 'Limited Stock' },
          ].map((st) => {
            const isSelected = stockFilter === st.id;
            return (
              <button
                key={st.id}
                type="button"
                onClick={() => onSelectStockFilter(st.id)}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-[#1B4332] text-white shadow-2xs'
                    : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
                }`}
              >
                {st.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* 6. Minimum Rating */}
      <div>
        <h4 className="text-xs font-extrabold uppercase tracking-wider text-neutral-500 mb-2">
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
              <label
                key={r.rating}
                className="flex items-center gap-2 text-xs text-neutral-700 hover:text-neutral-900 cursor-pointer select-none py-0.5"
              >
                <input
                  type="radio"
                  name="automotive-rating"
                  checked={isSelected}
                  onChange={() => onSelectMinRating(r.rating)}
                  className="w-3.5 h-3.5 text-[#1B4332] border-neutral-300 focus:ring-[#1B4332] cursor-pointer"
                />
                <span className={`inline-flex items-center gap-1 ${isSelected ? 'font-bold text-neutral-900' : 'font-medium'}`}>
                  {r.rating > 0 && <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />}
                  <span>{r.label}</span>
                </span>
              </label>
            );
          })}
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sticky Sidebar */}
      <aside 
        aria-label="Automotive Filter Sidebar" 
        className="hidden lg:block w-[280px] shrink-0 bg-white rounded-[20px] p-5 border border-neutral-200/80 shadow-[0_2px_12px_rgba(0,0,0,0.03)] sticky top-24 self-start"
      >
        {renderFilterSections()}
      </aside>

      {/* Mobile Drawer Backdrop & Drawer */}
      {isMobileOpen && (
        <div 
          className="lg:hidden fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex justify-end animate-in fade-in duration-200"
          onClick={onCloseMobile}
        >
          <div 
            className="w-[85vw] max-w-[360px] h-full bg-white p-5 overflow-y-auto shadow-2xl flex flex-col justify-between animate-in slide-in-from-right duration-250"
            onClick={(e) => e.stopPropagation()}
          >
            <div>
              <div className="flex items-center justify-between pb-3 mb-4 border-b border-neutral-200">
                <span className="text-sm font-extrabold text-neutral-900">Filters</span>
                <button
                  type="button"
                  onClick={onCloseMobile}
                  className="p-1 rounded-full text-neutral-500 hover:text-neutral-900 hover:bg-neutral-100"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {renderFilterSections()}
            </div>

            <div className="pt-6 mt-6 border-t border-neutral-200">
              <button
                type="button"
                onClick={onCloseMobile}
                className="w-full py-2.5 rounded-full bg-[#1B4332] hover:bg-[#081C15] text-white font-bold text-xs shadow-md cursor-pointer transition-colors"
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

