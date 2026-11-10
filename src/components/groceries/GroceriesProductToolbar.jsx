
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
    <div className="flex flex-col gap-5 mb-7">

      {/* Section Heading */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
        <div>
          <p className="text-xs font-bold tracking-[0.16em] text-[#40916C] uppercase">
            Handpicked for You
          </p>

          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#081C15] mt-2 tracking-tight">
            Featured Products
          </h2>

          <p className="text-sm text-neutral-500 mt-2">
            Fresh picks and everyday essentials for your home.
          </p>
        </div>

        <span className="text-sm font-semibold text-neutral-500">
          {productCount} products
        </span>
      </div>

      {/* Search, Filter and Sort */}
      <div className="flex flex-col sm:flex-row gap-3 sm:items-center">

        {/* Search */}
        <div className="flex flex-1 items-center gap-2.5 bg-white border border-neutral-200 rounded-full px-4 h-12 focus-within:border-[#40916C] focus-within:ring-2 focus-within:ring-[#40916C]/10 transition-all">
          <Search size={18} className="text-neutral-400 shrink-0" />

          <input
            type="text"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search fresh groceries..."
            className="w-full min-w-0 outline-none text-sm text-neutral-800 placeholder:text-neutral-400 bg-transparent"
          />

          {search && (
            <button
              type="button"
              onClick={() => setSearch('')}
              aria-label="Clear search"
              className="text-neutral-400 hover:text-red-500 transition"
            >
              <X size={17} />
            </button>
          )}
        </div>

        <div className="flex gap-2.5">

          {/* Mobile Filter */}
          {onOpenFilters && (
            <button
              type="button"
              onClick={onOpenFilters}
              className="lg:hidden flex-1 sm:flex-none h-12 px-4 flex items-center justify-center gap-2 bg-white border border-neutral-200 rounded-full text-sm font-semibold text-neutral-700 hover:border-[#40916C] transition"
            >
              <SlidersHorizontal size={16} />
              Filters
            </button>
          )}

          {/* Sort */}
          <div className="relative flex-1 sm:flex-none">
            <ArrowUpDown
              size={15}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-500 pointer-events-none"
            />

            <select
              value={sort}
              onChange={(event) => setSort(event.target.value)}
              aria-label="Sort products"
              className="w-full sm:w-auto h-12 appearance-none bg-white border border-neutral-200 rounded-full pl-9 pr-9 text-sm font-semibold text-neutral-700 outline-none cursor-pointer hover:border-[#40916C] focus:border-[#40916C] transition"
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
