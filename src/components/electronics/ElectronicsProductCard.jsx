import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Star, 
  Heart, 
  ShoppingCart, 
  Check, 
  Eye 
} from 'lucide-react';
import { formatPrice } from '../../utils/formatters';

export default function ElectronicsProductCard({
  product,
  isWishlisted = false,
  onToggleWishlist,
  onViewDetails,
  onAddToCart,
}) {
  const [imgSrc, setImgSrc] = useState(product.image);
  const [isAdded, setIsAdded] = useState(false);

  const handleImageError = () => {
    setImgSrc(product.fallbackImage || '/images/card-electronics.png');
  };

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (onAddToCart) {
      const added = onAddToCart(product);
      if (added !== false) {
        setIsAdded(true);
        setTimeout(() => {
          setIsAdded(false);
        }, 1500);
      }
    }
  };

  const handleCardClick = () => {
    if (onViewDetails) {
      onViewDetails(product);
    }
  };

  const savings = product.savings || (product.originalPrice ? product.originalPrice - product.price : 0);
  const productUrl = product.productUrl || `/electronics/product/${product.id}`;

  return (
    <article className="bg-white rounded-[20px] p-3.5 sm:p-4 flex flex-col justify-between h-full shadow-[0_2px_12px_rgba(0,0,0,0.04)] hover:shadow-[0_12px_28px_rgba(27,67,50,0.12)] hover:-translate-y-1 transition-all duration-300 border border-neutral-200/80 group select-none relative">
      <div>
        {/* Top Bar: Discount / Stock Status Badge & Wishlist Heart */}
        <div className="flex items-center justify-between w-full relative z-10 min-h-[22px] mb-1.5">
          <div className="flex items-center gap-1.5">
            {product.discount && (
              <span className="bg-[#1B4332] text-white text-[10px] sm:text-[10.5px] font-extrabold px-2 py-0.5 rounded-[6px] tracking-wide">
                {product.discount}
              </span>
            )}
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full inline-flex items-center gap-1 ${
              (product.stockStatus === 'In Stock' || product.stock > 0 || product.inStock)
                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200/60'
                : 'bg-amber-50 text-amber-700 border border-amber-200/60'
            }`}>
              <span className={`w-1.5 h-1.5 rounded-full ${
                (product.stockStatus === 'In Stock' || product.stock > 0 || product.inStock) ? 'bg-emerald-500' : 'bg-amber-500'
              }`} />
              {product.stockStatus || (product.stock > 0 ? 'In Stock' : 'Limited Stock')}
            </span>
          </div>

          {/* Wishlist Heart Icon */}
          <button
            type="button"
            aria-label={isWishlisted ? `Remove ${product.name} from wishlist` : `Add ${product.name} to wishlist`}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              if (onToggleWishlist) onToggleWishlist(product.id);
            }}
            className="text-neutral-400 hover:text-[#FF383F] transition-all p-1.5 rounded-full hover:bg-neutral-50 active:scale-90 cursor-pointer focus:outline-none"
          >
            <Heart
              className={`w-4 h-4 stroke-[1.8] transition-colors ${
                isWishlisted ? 'fill-[#FF383F] text-[#FF383F]' : 'text-neutral-400'
              }`}
            />
          </button>
        </div>

        {/* Dedicated Product Photography Container linking to Product Page */}
        <Link
          to={productUrl}
          onClick={handleCardClick}
          className="w-full h-[150px] sm:h-[165px] flex items-center justify-center my-1 overflow-hidden rounded-[14px] bg-[#F8FAF8] p-3 cursor-pointer relative group-hover:bg-[#1B4332]/5 transition-colors block"
        >
          <img
            src={imgSrc}
            alt={product.name}
            onError={handleImageError}
            loading="lazy"
            className="max-h-full max-w-full w-auto h-auto object-contain group-hover:scale-105 transition-transform duration-300"
          />

          {/* Quick View Pill on Hover */}
          <div className="absolute inset-0 bg-neutral-900/15 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
            <span className="bg-white/95 text-[#081C15] text-[11px] font-bold px-3 py-1 rounded-full shadow-md flex items-center gap-1.5">
              <Eye className="w-3 h-3" /> View Product
            </span>
          </div>
        </Link>

        {/* Product Details */}
        <div className="mt-2 flex flex-col">
          {/* Category Tag & Rating */}
          <div className="flex items-center justify-between gap-1 mb-1">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#1B4332] bg-[#E9F3ED] px-2 py-0.5 rounded-full truncate max-w-[65%]">
              {product.subcategory || product.category}
            </span>

            <div className="flex items-center gap-1 shrink-0">
              <Star className="w-3 h-3 fill-amber-400 text-amber-400 stroke-none" />
              <span className="text-[11px] font-bold text-neutral-800">
                {product.rating}
              </span>
              <span className="text-[10px] text-neutral-400 font-medium">
                ({product.reviewCount || product.reviews || 0})
              </span>
            </div>
          </div>

          {/* Product Title */}
          <Link
            to={productUrl}
            onClick={handleCardClick}
            className="text-[13px] sm:text-[13.5px] font-bold text-neutral-900 tracking-tight leading-snug line-clamp-2 mt-1 min-h-[36px] cursor-pointer hover:text-[#1B4332] transition-colors block"
            title={product.name}
          >
            {product.name}
          </Link>

          {/* Price, Original Price and Savings */}
          <div className="mt-2 pt-1 border-t border-neutral-100">
            <div className="flex items-baseline gap-2 flex-wrap">
              <span className="text-base sm:text-lg font-black text-[#081C15]">
                {formatPrice(product.price)}
              </span>
              {product.originalPrice && (
                <span className="text-xs text-neutral-400 line-through font-medium">
                  {formatPrice(product.originalPrice)}
                </span>
              )}
            </div>

            {savings > 0 && (
              <p className="text-[10.5px] font-bold text-emerald-700 mt-0.5">
                Save {formatPrice(savings)}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Add to Cart & View Details Action Row */}
      <div className="mt-3.5 pt-2 border-t border-neutral-100 flex items-center gap-2">
        <button
          type="button"
          onClick={handleAddToCart}
          className={`flex-1 py-2 px-3 rounded-[12px] text-xs font-bold transition-all duration-200 cursor-pointer flex items-center justify-center gap-1.5 shadow-2xs active:scale-[0.98] ${
            isAdded
              ? 'bg-emerald-600 text-white'
              : 'bg-[#1B4332] hover:bg-[#081C15] text-white hover:shadow-xs'
          }`}
        >
          {isAdded ? (
            <>
              <Check className="w-3.5 h-3.5 stroke-[2.5]" />
              <span>Added to Cart</span>
            </>
          ) : (
            <>
              <ShoppingCart className="w-3.5 h-3.5" />
              <span>Add to Cart</span>
            </>
          )}
        </button>

        <Link
          to={productUrl}
          onClick={handleCardClick}
          aria-label={`View details for ${product.name}`}
          className="w-8 h-8 rounded-[12px] border border-neutral-200 bg-[#F8FAF8] hover:bg-[#1B4332]/10 hover:text-[#1B4332] text-neutral-700 flex items-center justify-center transition-colors cursor-pointer shrink-0"
        >
          <Eye className="w-3.5 h-3.5" />
        </Link>
      </div>
    </article>
  );
}
