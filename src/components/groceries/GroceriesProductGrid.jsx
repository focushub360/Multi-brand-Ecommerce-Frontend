
import React from 'react';
import { Search, ShoppingBag } from 'lucide-react';
import GroceriesProductCard from './GroceriesProductCard';

export default function GroceriesProductGrid({
  products = [],
  quantities = {},
  isWishlisted,
  onViewProduct,
  onToggleWishlist,
  onChangeQuantity,
  onAddToCart,
}) {
  if (products.length === 0) {
    return (
      <div className="bg-[#F7FAF5] rounded-3xl p-8 sm:p-12 text-center border border-[#E5EDE2]">
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[#D8F3DC] flex items-center justify-center">
          <Search size={28} className="text-[#1B4332]" />
        </div>

        <h3 className="text-lg sm:text-xl font-bold text-[#081C15]">
          No products found
        </h3>

        <p className="text-sm text-neutral-500 mt-2">
          Try another search or change your filters to discover more products.
        </p>
      </div>
    );
  }

  return (
    <section aria-label="Featured grocery products">

      {/* Product Section Heading */}
      <div className="flex items-center justify-between gap-3 mb-5">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-full bg-[#D8F3DC] flex items-center justify-center">
            <ShoppingBag size={17} className="text-[#1B4332]" />
          </div>

          <div>
            <h2 className="text-base sm:text-lg font-bold text-[#081C15]">
              Fresh Groceries
            </h2>
            <p className="text-xs text-neutral-500 mt-0.5">
              Quality essentials for everyday living
            </p>
          </div>
        </div>

        <span className="text-xs sm:text-sm font-semibold text-[#40916C]">
          {products.length} items
        </span>
      </div>

      {/* Product Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 lg:gap-5">
        {products.map((product) => (
          <GroceriesProductCard
            key={product.id}
            product={product}
            quantity={quantities[product.id] || 1}
            wished={isWishlisted(product.id)}
            onViewProduct={() => onViewProduct(product)}
            onToggleWishlist={() => onToggleWishlist(product.id)}
            onChangeQuantity={(amount) =>
              onChangeQuantity(product.id, amount)
            }
            onAddToCart={() =>
              onAddToCart(product, quantities[product.id] || 1)
            }
          />
        ))}
      </div>
    </section>
  );
}
