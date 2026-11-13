import React from 'react';
import AutomotiveProductCard from './AutomotiveProductCard';
import { SearchX, RotateCcw } from 'lucide-react';

export default function AutomotiveProductGrid({
  products = [],
  wishlist = [],
  onToggleWishlist,
  onViewDetails,
  onAddToCart,
  onResetFilters,
  isLoading = false,
}) {
  if (isLoading) {
    return (
      <div className="w-full">
        <div className="grid grid-cols-1 min-[480px]:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-5">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-white rounded-[20px] p-4 border border-neutral-200/70 shadow-2xs animate-pulse flex flex-col justify-between h-[360px]">
              <div>
                <div className="w-full aspect-[4/3] bg-neutral-200/70 rounded-[14px] mb-4" />
                <div className="h-3.5 bg-neutral-200/80 rounded-full w-1/3 mb-2.5" />
                <div className="h-5 bg-neutral-200/90 rounded-md w-4/5 mb-2" />
                <div className="h-3.5 bg-neutral-200/70 rounded-md w-1/2" />
              </div>
              <div className="flex items-center justify-between pt-3 border-t border-neutral-100 mt-4">
                <div className="h-6 bg-neutral-200 rounded-md w-24" />
                <div className="h-9 bg-neutral-200 rounded-[12px] w-28" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="w-full bg-white rounded-[20px] py-16 px-6 text-center border border-neutral-200/80 shadow-2xs">
        <div className="w-14 h-14 rounded-full bg-[#E9F3ED] text-[#1B4332] flex items-center justify-center mx-auto mb-4">
          <SearchX className="w-7 h-7 stroke-[2]" />
        </div>
        <h4 
          className="text-lg sm:text-xl font-extrabold text-neutral-900 tracking-tight"
          style={{ fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif" }}
        >
          No Automotive Parts Found
        </h4>
        <p className="text-xs sm:text-[13.5px] text-neutral-500 font-medium mt-1.5 max-w-md mx-auto leading-relaxed">
          We couldn&apos;t find any replacement parts matching your specific filter criteria. Try selecting another subcategory or resetting your price ranges.
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
            <AutomotiveProductCard
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

