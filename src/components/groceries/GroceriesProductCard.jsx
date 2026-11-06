
import React from 'react';
import {
  Heart,
  Star,
  Plus,
  Minus,
  ShoppingCart,
  Eye,
} from 'lucide-react';

export default function GroceriesProductCard({
  product,
  quantity,
  wished,
  onViewProduct,
  onToggleWishlist,
  onChangeQuantity,
  onAddToCart,
}) {
  return (
    <article className="group relative flex flex-col bg-white rounded-[18px] sm:rounded-[20px] border border-neutral-200 overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:border-[#95D5B2]">

      {/* Product Image */}
      <div className="relative bg-[#F8FAF8] overflow-hidden">

        <button
          type="button"
          onClick={onViewProduct}
          aria-label={`View ${product.name} details`}
          className="relative h-36 sm:h-48 w-full flex items-center justify-center p-3 sm:p-5 cursor-pointer"
        >
          <img
            src={product.image}
            alt={product.name}
            onError={(e) => {
              e.currentTarget.onerror = null;
              e.currentTarget.src = '/images/card-groceries.png';
            }}
            className="max-w-full max-h-full w-auto h-auto object-contain transition-transform duration-500 group-hover:scale-110"
            loading="lazy"
          />

          {/* View Product Hover Button */}
          <span className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <span className="flex items-center gap-2 bg-white text-[#1B4332] px-4 py-2.5 rounded-full text-xs sm:text-sm font-bold shadow-lg hover:bg-[#1B4332] hover:text-white transition-colors">
              <Eye size={16} />
              View Product
            </span>
          </span>
        </button>

        <span className="absolute top-2.5 left-2.5 bg-[#1B4332] text-white rounded-full px-2.5 py-1 text-[10px] sm:text-xs font-bold pointer-events-none">
          Fresh
        </span>

        <button
          type="button"
          onClick={onToggleWishlist}
          aria-label={wished ? 'Remove from wishlist' : 'Add to wishlist'}
          className={`absolute top-2.5 right-2.5 z-10 w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center rounded-full shadow-sm transition-all ${
            wished
              ? 'bg-red-50 text-red-600'
              : 'bg-white text-neutral-500 hover:bg-red-50 hover:text-red-500'
          }`}
        >
          <Heart
            size={17}
            fill={wished ? 'currentColor' : 'none'}
          />
        </button>
      </div>

      {/* Product Details */}
      <div className="flex flex-col flex-1 p-3 sm:p-4">

        <p className="text-[10px] sm:text-xs text-[#2D6A4F] font-bold uppercase tracking-wide">
          {product.category}
        </p>

        <button
          type="button"
          onClick={onViewProduct}
          className="text-left font-bold text-[#081C15] mt-1.5 text-sm sm:text-base leading-snug min-h-[40px] hover:text-[#2D6A4F] transition-colors line-clamp-2"
        >
          {product.name}
        </button>

        {/* Rating */}
        <div className="flex items-center gap-1 mt-2">
          <Star
            size={13}
            fill="currentColor"
            className="text-amber-500"
          />
          <span className="text-xs font-bold text-neutral-700">
            {product.rating}
          </span>
          <span className="text-[10px] text-neutral-400">
            Customer rating
          </span>
        </div>

        {/* Price */}
        <div className="mt-3">
          <div className="flex items-baseline gap-2 flex-wrap">
            <span className="font-extrabold text-lg sm:text-xl text-[#081C15]">
              ₹{product.price}
            </span>

            {product.originalPrice > product.price && (
              <span className="text-xs text-neutral-400 line-through">
                ₹{product.originalPrice}
              </span>
            )}
          </div>

          <p className="text-[11px] text-neutral-500 mt-0.5">
            {product.unit}
          </p>
        </div>

        {/* Quantity and Add to Cart */}
        <div className="flex items-center gap-2 mt-auto pt-4">

          <div className="flex items-center border border-neutral-200 rounded-lg h-9 sm:h-10">

            <button
              type="button"
              onClick={() => onChangeQuantity(-1)}
              disabled={quantity <= 1}
              className="px-2 h-full text-neutral-600 hover:text-[#1B4332] disabled:opacity-30 disabled:cursor-not-allowed"
              aria-label="Decrease quantity"
            >
              <Minus size={13} />
            </button>

            <span className="text-xs sm:text-sm font-bold min-w-5 text-center">
              {quantity}
            </span>

            <button
              type="button"
              onClick={() => onChangeQuantity(1)}
              className="px-2 h-full text-neutral-600 hover:text-[#1B4332]"
              aria-label="Increase quantity"
            >
              <Plus size={13} />
            </button>
          </div>

          <button
            type="button"
            onClick={onAddToCart}
            className="flex-1 h-9 sm:h-10 flex items-center justify-center gap-1.5 bg-[#1B4332] text-white rounded-lg text-xs sm:text-sm font-bold hover:bg-[#2D6A4F] active:scale-95 transition-all"
          >
            <ShoppingCart size={14} />
            <span>Add</span>
          </button>

        </div>
      </div>
    </article>
  );
}
