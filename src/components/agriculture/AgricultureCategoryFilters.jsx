import React from 'react';
import { Layers } from 'lucide-react';

const CATEGORY_ITEMS = [
  {
    id: 'Hybrid Seeds',
    title: 'Hybrid Seeds',
    image: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&w=500&q=80',
    fallback: '/images/card-agri.png',
  },
  {
    id: 'Fertilizers & Soil Nutrition',
    title: 'Fertilizers & Soil Nutrition',
    image: 'https://images.unsplash.com/photo-1628352081506-83c43123ed6d?auto=format&fit=crop&w=500&q=80',
    fallback: '/images/card-agri-clean.png',
  },
  {
    id: 'Crop Protection',
    title: 'Crop Protection',
    image: 'https://images.unsplash.com/photo-1592982537447-7440770cbfc9?auto=format&fit=crop&w=500&q=80',
    fallback: '/images/prod-sprayer.png',
  },
  {
    id: 'Irrigation & Drip Systems',
    title: 'Irrigation & Drip Systems',
    image: 'https://images.unsplash.com/photo-1563514227147-6d2ff665a6a0?auto=format&fit=crop&w=500&q=80',
    fallback: '/images/prod-drip.png',
  },
  {
    id: 'Solar Pumps',
    title: 'Solar Pumps',
    image: 'https://images.unsplash.com/photo-1508873696983-2df5293cb32b?auto=format&fit=crop&w=500&q=80',
    fallback: '/images/prod-solar.png',
  },
  {
    id: 'Farm Machinery',
    title: 'Farm Machinery',
    image: 'https://images.unsplash.com/photo-1595246140625-573b715d11dc?auto=format&fit=crop&w=500&q=80',
    fallback: '/images/prod-tractor.png',
  },
];

export default function AgricultureCategoryFilters({
  selectedCategory,
  onSelectCategory,
  categoryCounts = {},
}) {
  return (
    <section aria-label="Agriculture Categories" className="w-full bg-[#F8FAF8] pt-6 sm:pt-8 pb-3 sm:pb-4">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 md:px-10 lg:px-16">
        {/* Header row with "All Categories" pill option */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pb-3 mb-2">
          <div>
            <h2 
              className="text-lg sm:text-2xl font-bold text-[#081C15] tracking-tight"
              style={{ fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif" }}
            >
              Shop by Agricultural Category
            </h2>
            <p className="text-xs sm:text-[13px] text-neutral-500 font-medium mt-0.5">
              Select a specialized category or browse all certified supplies below.
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
              <span>All Categories ({categoryCounts['All'] || 0})</span>
            </button>
          </div>
        </div>

        {/* 6 Category Image Cards:
            - Desktop: 6 per row (`lg:grid-cols-6`)
            - Tablet: 3 columns (`sm:grid-cols-3`)
            - Mobile: smooth horizontal scroll (`flex overflow-x-auto no-scrollbar snap-x`)
        */}
        <div className="flex sm:grid sm:grid-cols-3 lg:grid-cols-6 gap-2.5 sm:gap-3.5 lg:gap-4 overflow-x-auto sm:overflow-visible no-scrollbar snap-x pb-2 select-none -mx-4 px-4 sm:mx-0 sm:px-0">
          {CATEGORY_ITEMS.map((cat) => {
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
                className={`min-w-[170px] sm:min-w-0 flex-1 shrink-0 snap-start h-[120px] sm:h-[135px] rounded-[16px] sm:rounded-[18px] overflow-hidden relative cursor-pointer group transition-all duration-300 border focus:outline-none focus:ring-2 focus:ring-[#52B788] ${
                  isSelected
                    ? 'border-[#52B788] shadow-lg shadow-[#1B4332]/15 scale-[1.02] ring-2 ring-[#52B788]/50'
                    : 'border-neutral-200/80 hover:border-[#52B788] hover:shadow-md'
                }`}
              >
                {/* Background Photography with Zoom Effect */}
                <img
                  src={cat.image}
                  alt={cat.title}
                  onError={(e) => {
                    e.currentTarget.src = cat.fallback;
                  }}
                  className="absolute inset-0 w-full h-full object-cover object-center group-hover:scale-110 transition-transform duration-500 ease-out"
                />

                {/* Dark Gradient Overlay for Readability */}
                <div 
                  className={`absolute inset-0 transition-opacity duration-300 ${
                    isSelected
                      ? 'bg-gradient-to-t from-[#081C15]/95 via-[#1B4332]/80 to-[#1B4332]/40'
                      : 'bg-gradient-to-t from-[#081C15]/90 via-[#081C15]/50 to-[#081C15]/20 group-hover:from-[#081C15]/80'
                  }`} 
                />

                {/* Card Content (Title & Count Badge) */}
                <div className="absolute inset-0 p-3 sm:p-3.5 flex flex-col justify-between z-10">
                  {/* Top: Active indicator or count pill */}
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-white/90 bg-white/20 backdrop-blur-xs px-2 py-0.5 rounded-full">
                      {count} {count === 1 ? 'Item' : 'Items'}
                    </span>
                    {isSelected && (
                      <span className="w-2 h-2 rounded-full bg-[#52B788] ring-4 ring-[#52B788]/30 animate-pulse" />
                    )}
                  </div>

                  {/* Bottom: Title */}
                  <div>
                    <h3 className="text-xs sm:text-[13px] font-extrabold text-white leading-tight drop-shadow-xs line-clamp-2">
                      {cat.title}
                    </h3>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
