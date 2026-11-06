
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
      <div className="bg-white rounded-[20px] p-8 sm:p-12 text-center border border-neutral-200">
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[#1B4332]/10 flex items-center justify-center">
          <Search size={30} className="text-[#1B4332]" />
        </div>

        <h3 className="text-lg sm:text-xl font-bold text-[#081C15]">
          No products found
        </h3>

        <p className="text-sm text-neutral-500 mt-2">
          Try another search or reset your filters.
        </p>
      </div>
    );
  }

  return (
    <section aria-label="Grocery products">
      <div className="flex items-center gap-2 mb-4">
        <ShoppingBag size={18} className="text-[#1B4332]" />
        <h2 className="text-base sm:text-lg font-bold text-[#081C15]">
          Fresh Groceries
        </h2>
        <span className="text-xs font-semibold text-neutral-500">
          ({products.length} products)
        </span>
      </div>

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
