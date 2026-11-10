import React from 'react';
import { ArrowRight } from 'lucide-react';
import { GROCERIES_CATEGORY_ITEMS } from '../../constants/groceriesConstants';

export default function GroceriesCategoryFilters({
  category,
  setCategory,
  categoryCounts = {},
}) {
  const selectedCategory = category || 'All Products';

  return (
    <section
      aria-label="Explore Grocery Categories"
      className="bg-white py-12 sm:py-16"
    >
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12">

        {/* Section Heading */}
        <div className="flex items-end justify-between gap-4 mb-7 sm:mb-9">
          <div>
            <p className="text-xs font-bold uppercase tracking-[2px] text-[#57934D] mb-2">
              Explore Our Collection
            </p>

            <h2 className="text-2xl sm:text-3xl font-bold text-[#173D2B]">
              Shop by Category
            </h2>

            <p className="text-sm text-[#778477] mt-2">
              Everything fresh, all in one place.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setCategory('All Products')}
            className="hidden sm:flex items-center gap-2 text-sm font-bold text-[#267A3D] hover:text-[#173D2B]"
          >
            View All
            <ArrowRight size={17} />
          </button>
        </div>

        {/* All Categories */}
        <div className="mb-6">
          <button
            type="button"
            onClick={() => setCategory('All Products')}
            className={`px-5 py-2.5 rounded-full text-xs sm:text-sm font-bold transition-all ${
              selectedCategory === 'All Products'
                ? 'bg-[#267A3D] text-white'
                : 'bg-[#F1F7EE] text-[#315C37] hover:bg-[#E4F0DF]'
            }`}
          >
            All Groceries ({categoryCounts['All Products'] || 0})
          </button>
        </div>

        {/* Single Row Horizontal Categories */}
        <div
          className="flex flex-nowrap gap-3 sm:gap-5 overflow-x-auto overflow-y-hidden pb-4 scroll-smooth"
          style={{
            scrollbarWidth: 'thin',
            scrollbarColor: '#A8CDA0 transparent',
          }}
        >
          {GROCERIES_CATEGORY_ITEMS.map((cat) => {
            const isSelected = selectedCategory === cat.id;
            const count = categoryCounts[cat.id] || 0;

            return (
              <button
                key={cat.id}
                type="button"
                onClick={() =>
                  setCategory(isSelected ? 'All Products' : cat.id)
                }
                aria-pressed={isSelected}
                className={`group text-left rounded-2xl overflow-hidden border transition-all duration-300 hover:-translate-y-1 hover:shadow-lg shrink-0 w-[178px] sm:w-[178px] ${
                  isSelected
                    ? 'border-[#267A3D] ring-2 ring-[#267A3D]/20 shadow-md'
                    : 'border-[#E6EEE3] hover:border-[#A8CDA0]'
                }`}
              >
                {/* Category Image */}
                <div className="relative h-28 sm:h-36 bg-[#F1F7EE] overflow-hidden">
                  <img
                    src={cat.image}
                    alt={cat.title}
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src = cat.fallback;
                    }}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    loading="lazy"
                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-[#173D2B]/35 to-transparent" />

                  {isSelected && (
                    <span className="absolute top-2 right-2 bg-[#267A3D] text-white text-[10px] font-bold px-2.5 py-1 rounded-full">
                      Selected
                    </span>
                  )}
                </div>

                {/* Category Information */}
                <div className="bg-[#F8FBF6] p-3 sm:p-4">
                  <h3 className="text-xs sm:text-sm font-bold text-[#173D2B] leading-snug whitespace-nowrap overflow-hidden text-ellipsis">
                    {cat.title}
                  </h3>

                  <p className="text-[10px] sm:text-xs text-[#829080] mt-1">
                    {count} {count === 1 ? 'product' : 'products'}
                  </p>

                  <div className="flex items-center gap-1 text-[#438B42] text-[10px] font-bold mt-3">
                    Explore
                    <ArrowRight
                      size={12}
                      className="transition-transform group-hover:translate-x-1"
                    />
                  </div>
                </div>
              </button>
            );
          })}
        </div>

      </div>
    </section>
  );
}