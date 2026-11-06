
import React, { useEffect } from 'react';
import {
  X,
  RotateCcw,
  SlidersHorizontal,
  Search,
  Star,
} from 'lucide-react';

const CATEGORIES = [
  'All Products',
  'Fruits & Vegetables',
  'Dairy & Eggs',
  'Rice & Grains',
  'Snacks & Bakery',
  'Beverages',
  'Cooking Essentials',
];

const BRANDS = ['All', 'GROVE Fresh'];

export default function GroceriesFilterSidebar({
  category,
  setCategory,
  maxPrice,
  setMaxPrice,
  selectedBrand = 'All',
  setSelectedBrand = () => {},
  stockFilter = 'all',
  setStockFilter = () => {},
  minRating = 0,
  setMinRating = () => {},
  search = '',
  setSearch = () => {},
  resetFilters,
  categoryCounts = {},
  brandCounts = {},
  isMobileOpen = false,
  onCloseMobile = () => {},
}) {
  const isAnyFilterActive =
    category !== 'All Products' ||
    maxPrice < 500 ||
    selectedBrand !== 'All' ||
    stockFilter !== 'all' ||
    minRating > 0 ||
    search.trim() !== '';

  useEffect(() => {
    document.body.style.overflow = isMobileOpen ? 'hidden' : '';

    return () => {
      document.body.style.overflow = '';
    };
  }, [isMobileOpen]);

  const renderFilterSections = () => (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex items-center justify-between pb-3.5 border-b border-neutral-100">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="w-4 h-4 text-neutral-800" />
          <h3 className="text-base font-extrabold text-neutral-900 tracking-tight">
            Filters &amp; Search
          </h3>
        </div>

        {isAnyFilterActive && (
          <button
            type="button"
            onClick={resetFilters}
            className="inline-flex items-center gap-1 text-xs font-bold text-[#FF383F] hover:text-[#d3272e] cursor-pointer"
          >
            <RotateCcw className="w-3 h-3" />
            Reset
          </button>
        )}
      </div>

      {/* Search */}
      <div>
        <label className="block text-xs font-extrabold uppercase tracking-wider text-neutral-500 mb-2">
          Search Products
        </label>

        <div className="relative flex items-center bg-neutral-50 rounded-[12px] border border-neutral-200 focus-within:border-neutral-900 focus-within:bg-white">
          <Search className="w-3.5 h-3.5 ml-3 text-neutral-400" />

          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search groceries..."
            className="w-full bg-transparent py-2 pl-2 pr-7 text-xs font-medium outline-none"
          />

          {search && (
            <button
              type="button"
              onClick={() => setSearch('')}
              className="absolute right-2 text-neutral-400 hover:text-neutral-700"
            >
              <X className="w-3 h-3" />
            </button>
          )}
        </div>
      </div>

      {/* Categories */}
      <div>
        <h4 className="text-xs font-extrabold uppercase tracking-wider text-neutral-500 mb-2.5">
          Categories
        </h4>

        <div className="space-y-1">
          {CATEGORIES.map((cat) => {
            const active = category === cat;
            const count = categoryCounts[cat] || 0;

            return (
              <button
                key={cat}
                type="button"
                onClick={() => setCategory(cat)}
                className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-[10px] text-xs font-semibold text-left ${
                  active
                    ? 'bg-neutral-900 text-white'
                    : 'text-neutral-700 hover:bg-neutral-100'
                }`}
              >
                <span className="truncate pr-2">{cat}</span>
                <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                  active
                    ? 'bg-neutral-800 text-neutral-200'
                    : 'bg-neutral-100 text-neutral-500'
                }`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Brand */}
      <div>
        <h4 className="text-xs font-extrabold uppercase tracking-wider text-neutral-500 mb-2.5">
          Brand
        </h4>

        <div className="space-y-1">
          {BRANDS.map((brand) => {
            const active = selectedBrand === brand;
            const count = brandCounts[brand] || 0;

            return (
              <button
                key={brand}
                type="button"
                onClick={() => setSelectedBrand(brand)}
                className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-[10px] text-xs font-semibold ${
                  active
                    ? 'bg-neutral-900 text-white'
                    : 'text-neutral-700 hover:bg-neutral-100'
                }`}
              >
                <span>{brand === 'All' ? 'All Brands' : brand}</span>
                {count > 0 && <span>{count}</span>}
              </button>
            );
          })}
        </div>
      </div>

      {/* Price */}
      <div>
        <div className="flex items-center justify-between mb-2.5">
          <h4 className="text-xs font-extrabold uppercase tracking-wider text-neutral-500">
            Price Range
          </h4>
          <span className="text-xs font-bold text-neutral-900">
            ₹{maxPrice}
          </span>
        </div>

        <input
          type="range"
          min="50"
          max="500"
          step="10"
          value={maxPrice}
          onChange={(e) => setMaxPrice(Number(e.target.value))}
          className="w-full accent-neutral-900 cursor-pointer"
        />

        <div className="flex justify-between mt-2 text-[11px] text-neutral-500">
          <span>₹50</span>
          <span>₹500</span>
        </div>
      </div>

      {/* Availability */}
      <div>
        <h4 className="text-xs font-extrabold uppercase tracking-wider text-neutral-500 mb-2">
          Availability
        </h4>

        <div className="flex flex-wrap gap-1.5">
          {[
            { id: 'all', label: 'All Items' },
            { id: 'in-stock', label: 'In Stock' },
            { id: 'limited', label: 'Limited Stock' },
          ].map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setStockFilter(item.id)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold ${
                stockFilter === item.id
                  ? 'bg-neutral-900 text-white'
                  : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* Rating */}
      <div>
        <h4 className="text-xs font-extrabold uppercase tracking-wider text-neutral-500 mb-2">
          Customer Rating
        </h4>

        <div className="space-y-1">
          {[
            { rating: 0, label: 'Any Rating' },
            { rating: 4.5, label: '4.5 & Above' },
            { rating: 4.0, label: '4.0 & Above' },
          ].map((item) => (
            <label
              key={item.rating}
              className="flex items-center gap-2 text-xs text-neutral-700 cursor-pointer py-0.5"
            >
              <input
                type="radio"
                name="grocery-rating"
                checked={minRating === item.rating}
                onChange={() => setMinRating(item.rating)}
                className="w-3.5 h-3.5 accent-neutral-900"
              />

              <span className="inline-flex items-center gap-1">
                {item.rating > 0 && (
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                )}
                {item.label}
              </span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside
        aria-label="Groceries Filter Sidebar"
        className="hidden lg:block w-[280px] shrink-0 bg-white rounded-[20px] p-5 border border-neutral-200/80 shadow-[0_2px_12px_rgba(0,0,0,0.03)] sticky top-24 self-start"
      >
        {renderFilterSections()}
      </aside>

      {/* Mobile Drawer */}
      {isMobileOpen && (
        <div
          className="lg:hidden fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex justify-end"
          onClick={onCloseMobile}
        >
          <div
            className="w-[85vw] max-w-[360px] h-full bg-white p-5 overflow-y-auto shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 mb-4 border-b">
              <span className="text-sm font-extrabold text-neutral-900">
                Filters
              </span>

              <button type="button" onClick={onCloseMobile}>
                <X className="w-5 h-5" />
              </button>
            </div>

            {renderFilterSections()}

            <button
              type="button"
              onClick={onCloseMobile}
              className="w-full mt-6 py-2.5 rounded-full bg-neutral-900 text-white font-bold text-xs"
            >
              Apply Filters
            </button>
          </div>
        </div>
      )}
    </>
  );
}
