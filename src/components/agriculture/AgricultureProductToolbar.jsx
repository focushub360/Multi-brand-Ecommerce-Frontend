import React from 'react';
import { 
  ArrowUpDown, 
  SlidersHorizontal, 
  X, 
  RotateCcw
} from 'lucide-react';

export default function AgricultureProductToolbar({
  totalProducts,
  filteredCount,
  startItem,
  endItem,
  selectedCategory,
  onSelectCategory,
  priceRange,
  onSelectPriceRange,
  stockFilter,
  onSelectStockFilter,
  searchQuery,
  onSearchChange,
  sortBy,
  onSortChange,
  onResetFilters,
  onOpenMobileFilters,
  isLoading = false,
}) {
  const isFiltered = 
    selectedCategory !== 'All' || 
    priceRange !== 'all' || 
    stockFilter !== 'all' || 
    searchQuery.trim() !== '';

  const activeFilterCount = [
    selectedCategory !== 'All',
    priceRange !== 'all',
    stockFilter !== 'all',
    searchQuery.trim() !== '',
  ].filter(Boolean).length;

  return (
    <div className="w-full pb-4">
      {/* Top row: Results Count, Mobile Filter Trigger, and Sort Dropdown */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-neutral-200/80">
        <div>
          <h3 
            className="text-base sm:text-xl font-extrabold text-[#081C15] tracking-tight"
            style={{ fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif" }}
          >
            Agricultural Products
          </h3>
          <p className="text-xs text-neutral-500 font-medium mt-0.5">
            {isLoading ? (
              <span className="inline-flex items-center gap-1.5 text-[#1B4332] font-semibold">
                <span className="w-1.5 h-1.5 rounded-full bg-[#1B4332] animate-pulse inline-block" />
                Loading verified agricultural products...
              </span>
            ) : filteredCount > 0 ? (
              <>
                Showing <span className="font-bold text-[#081C15]">{startItem}–{endItem}</span> of{' '}
                <span className="font-bold text-[#081C15]">{filteredCount}</span> items
                {filteredCount !== totalProducts && (
                  <span className="text-neutral-400"> (from {totalProducts} total)</span>
                )}
              </>
            ) : (
              <span>0 products found</span>
            )}
          </p>
        </div>

        {/* Right side controls: Mobile Filter button + Sort Dropdown */}
        <div className="flex items-center gap-2 sm:gap-2.5 self-start sm:self-auto flex-wrap">
          {/* Mobile Filter Button */}
          <button
            type="button"
            onClick={onOpenMobileFilters}
            className="lg:hidden inline-flex items-center gap-1.5 bg-white border border-neutral-300 hover:border-[#1B4332] px-3 py-1.5 rounded-[12px] text-xs font-bold text-[#081C15] shadow-2xs cursor-pointer active:scale-95"
          >
            <SlidersHorizontal className="w-3.5 h-3.5 text-[#1B4332]" />
            <span>Filters</span>
            {activeFilterCount > 0 && (
              <span className="w-4 h-4 rounded-full bg-[#1B4332] text-white text-[10px] flex items-center justify-center font-bold">
                {activeFilterCount}
              </span>
            )}
          </button>

          {/* Sort Dropdown */}
          <div className="flex items-center bg-white rounded-[12px] border border-neutral-300 hover:border-neutral-400 px-2.5 sm:px-3 py-1.5 shadow-2xs transition-all">
            <ArrowUpDown className="w-3.5 h-3.5 text-neutral-500 mr-1.5 sm:mr-2 shrink-0" />
            <label htmlFor="agri-sort-select" className="sr-only">
              Sort by
            </label>
            <select
              id="agri-sort-select"
              value={sortBy}
              onChange={(e) => onSortChange(e.target.value)}
              className="bg-transparent text-xs font-bold text-[#081C15] outline-none cursor-pointer pr-1"
            >
              <option value="featured">Featured Picks</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="rating-desc">Highest Rated</option>
              <option value="name-asc">Name: A–Z</option>
            </select>
          </div>
        </div>
      </div>

      {/* Active Filter Tags */}
      {isFiltered && (
        <div className="flex items-center justify-between flex-wrap gap-2 pt-2.5">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-neutral-400 mr-1">
              Active:
            </span>

            {selectedCategory !== 'All' && (
              <span className="inline-flex items-center gap-1 bg-[#1B4332]/10 text-[#1B4332] border border-[#1B4332]/20 px-2.5 py-0.5 rounded-full text-xs font-bold">
                <span>{selectedCategory}</span>
                <button
                  type="button"
                  onClick={() => onSelectCategory('All')}
                  className="hover:text-red-600 p-0.5 cursor-pointer"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}

            {priceRange !== 'all' && (
              <span className="inline-flex items-center gap-1 bg-[#1B4332]/10 text-[#1B4332] border border-[#1B4332]/20 px-2.5 py-0.5 rounded-full text-xs font-bold">
                <span>Price Filter</span>
                <button
                  type="button"
                  onClick={() => onSelectPriceRange('all')}
                  className="hover:text-red-600 p-0.5 cursor-pointer"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}

            {stockFilter !== 'all' && (
              <span className="inline-flex items-center gap-1 bg-[#1B4332]/10 text-[#1B4332] border border-[#1B4332]/20 px-2.5 py-0.5 rounded-full text-xs font-bold">
                <span>{stockFilter === 'in-stock' ? 'In Stock' : 'Limited Stock'}</span>
                <button
                  type="button"
                  onClick={() => onSelectStockFilter('all')}
                  className="hover:text-red-600 p-0.5 cursor-pointer"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}

            {searchQuery.trim() !== '' && (
              <span className="inline-flex items-center gap-1 bg-[#1B4332]/10 text-[#1B4332] border border-[#1B4332]/20 px-2.5 py-0.5 rounded-full text-xs font-bold">
                <span className="truncate max-w-[120px] sm:max-w-none">&ldquo;{searchQuery}&rdquo;</span>
                <button
                  type="button"
                  onClick={() => onSearchChange('')}
                  className="hover:text-red-600 p-0.5 cursor-pointer"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
          </div>

          <button
            type="button"
            onClick={onResetFilters}
            className="inline-flex items-center gap-1 text-xs font-bold text-[#FF383F] hover:text-[#d3272e] transition-colors cursor-pointer py-1 px-2 rounded-md hover:bg-[#FF383F]/10 ml-auto"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Clear Filters</span>
          </button>
        </div>
      )}
    </div>
  );
}
