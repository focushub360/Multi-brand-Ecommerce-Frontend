import React from 'react';
import ElectronicsProductCard from './ElectronicsProductCard';
import { SearchX, RotateCcw } from 'lucide-react';

export default function ElectronicsProductGrid({
  products = [],
  wishlist = [],
  onToggleWishlist,
  onViewDetails,
  onAddToCart,
  onResetFilters,
}) {
  if (products.length === 0) {
    return (
      <div className="w-full bg-white rounded-[20px] py-16 px-6 text-center border border-neutral-200/80 shadow-2xs">
        <div className="w-14 h-14 rounded-full bg-neutral-100 text-neutral-800 flex items-center justify-center mx-auto mb-4">
          <SearchX className="w-7 h-7 stroke-[2]" />
        </div>
        <h4 
          className="text-lg sm:text-xl font-extrabold text-neutral-900 tracking-tight"
          style={{ fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif" }}
        >
          No Electronics Products Found
        </h4>
        <p className="text-xs sm:text-[13.5px] text-neutral-500 font-medium mt-1.5 max-w-md mx-auto leading-relaxed">
          We couldn&apos;t find any tech items matching your specific filters. Try expanding your price range or clearing selected brands.
        </p>
        <button
          type="button"
          onClick={onResetFilters}
          className="mt-5 inline-flex items-center gap-2 bg-[#1B4332] hover:bg-[#081C15] text-white text-xs sm:text-[13px] font-bold px-5 py-2.5 rounded-[12px] transition-all shadow-xs cursor-pointer active:scale-95"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset All Filters</span>
        </button>
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* 3-Column Product Grid on Desktop, 2-Col on Tablet & Mobile */}
      <div className="grid grid-cols-1 min-[480px]:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-5">
        {products.map((product) => (
          <div key={product.id} className="h-full flex flex-col">
            <ElectronicsProductCard
              product={product}
              isWishlisted={wishlist.includes(product.id)}
              onToggleWishlist={onToggleWishlist}
              onViewDetails={onViewDetails}
              onAddToCart={onAddToCart}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

