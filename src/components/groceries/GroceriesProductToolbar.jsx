
import React from 'react';
import { Search, X, SlidersHorizontal, ArrowUpDown } from 'lucide-react';

export default function GroceriesProductToolbar({
  search,
  setSearch,
  sort,
  setSort,
  productCount,
  onOpenFilters,
}) {
  return (
    <div className="flex flex-col gap-4 mb-6">

      {/* Heading */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-2">
        <div>
          <p className="text-xs text-[#2D6A4F] font-extrabold tracking-[0.12em]">
            OUR COLLECTION
          </p>

          <h2 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-[#081C15] mt-1.5 tracking-tight">
            Fresh Products
          </h2>

          <p className="text-xs sm:text-sm text-neutral-500 mt-1">
            Discover fresh and quality groceries for your everyday needs.
          </p>
        </div>

        <span className="text-xs sm:text-sm font-semibold text-neutral-500">
          {productCount} products available
        </span>
      </div>

      {/* Search, Filter and Sort */}
      <div className="flex flex-col sm:flex-row gap-2.5 sm:items-center">

        {/* Search */}
        <div className="flex flex-1 items-center gap-2 bg-white border border-neutral-200 rounded-xl px-3.5 h-11 focus-within:border-[#52B788] focus-within:ring-2 focus-within:ring-[#52B788]/10 transition-all">
          <Search size={17} className="text-neutral-400 shrink-0" />

          <input
            type="text"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search groceries..."
            className="w-full min-w-0 outline-none text-sm text-neutral-800 placeholder:text-neutral-400 bg-transparent"
          />

          {search && (
            <button
              type="button"
              onClick={() => setSearch('')}
              aria-label="Clear search"
              className="text-neutral-400 hover:text-red-500"
            >
              <X size={16} />
            </button>
          )}
        </div>

        <div className="flex gap-2.5">

          {/* Mobile Filter Button */}
          {onOpenFilters && (
            <button
              type="button"
              onClick={onOpenFilters}
              className="lg:hidden flex-1 sm:flex-none h-11 px-3.5 flex items-center justify-center gap-2 bg-white border border-neutral-200 rounded-xl text-sm font-semibold text-neutral-700 hover:border-[#52B788] transition"
            >
              <SlidersHorizontal size={16} />
              Filters
            </button>
          )}

          {/* Sort */}
          <div className="relative flex-1 sm:flex-none">
            <ArrowUpDown
              size={15}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500 pointer-events-none"
            />

            <select
              value={sort}
              onChange={(event) => setSort(event.target.value)}
              aria-label="Sort products"
              className="w-full sm:w-auto h-11 appearance-none bg-white border border-neutral-200 rounded-xl pl-9 pr-8 text-xs sm:text-sm font-semibold text-neutral-700 outline-none cursor-pointer hover:border-[#52B788] focus:border-[#52B788] transition"
            >
              <option value="featured">Featured</option>
              <option value="low">Price: Low to High</option>
              <option value="high">Price: High to Low</option>
              <option value="rating">Top Rated</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}
