import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Star, Heart } from 'lucide-react';
import { formatPrice } from '../utils/formatters';
import { useWishlist } from '../hooks/useWishlist';

export default function ProductCard({ product }) {
  const navigate = useNavigate();
  const [imgSrc, setImgSrc] = useState(product?.image);

  const { isWishlisted, toggleWishlist } = useWishlist();

  if (!product) return null;

  // Resolve category navigation URL based on product ID prefix or category
  const productIdStr = String(product.id || '');
  const isAgri = Boolean(productIdStr.startsWith('ag-'));
  const isElectronics = Boolean(
    productIdStr.startsWith('el-') || 
    (product.category && product.category.toLowerCase().includes('electron'))
  );
  const isAutomotive = Boolean(
    productIdStr.startsWith('au-') || 
    (product.category && product.category.toLowerCase().includes('auto'))
  );

  let productUrl = null;
  if (isAgri) {
    productUrl = `/agriculture/product/${productIdStr}`;
  } else if (isElectronics) {
    productUrl = `/electronics/product/${productIdStr}`;
  } else if (isAutomotive) {
    productUrl = `/automotive/product/${productIdStr}`;
  }
  const isFavorite = isWishlisted ? isWishlisted(product.id) : false;

  const handleWishlistToggle = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (toggleWishlist) {
      toggleWishlist(product.id);
    }
  };

  const handleCardClick = (e) => {
    // If clicking on or inside the wishlist button, do not navigate
    if (e.target.closest('button')) return;
    if (productUrl) {
      navigate(productUrl);
    }
  };

  const handleImageError = () => {
    setImgSrc(product.fallbackImage || '/images/prod-tractor.png');
  };

  // Calculate discount percentage if not explicitly provided as a string
  const discountDisplay = product.discount || (
    product.originalPrice && product.price && Number(product.originalPrice) > Number(product.price)
      ? `${Math.round(((Number(product.originalPrice) - Number(product.price)) / Number(product.originalPrice)) * 100)}% OFF`
      : null
  );

  const reviewCount = product.reviewCount ?? product.reviews;

  return (
    <div 
      onClick={handleCardClick}
      className={`bg-white rounded-[16px] p-2.5 sm:p-3.5 relative flex flex-col justify-between h-full shadow-[0_2px_10px_rgba(0,0,0,0.03)] hover:shadow-[0_8px_20px_rgba(0,0,0,0.08)] hover:-translate-y-1 transition-all duration-200 border border-neutral-100 group select-none min-w-0 ${
        productUrl ? 'cursor-pointer' : ''
      }`}
    >
      {/* Top Controls: Discount Badge & Wishlist Heart */}
      <div className="flex items-center justify-between w-full relative z-10 min-h-[20px] sm:min-h-[22px]">
        {discountDisplay ? (
          <span className="bg-[#FF383F] text-white text-[9px] sm:text-[10px] md:text-[10.5px] font-bold px-1.5 py-0.5 rounded-[5px] leading-tight select-none">
            {discountDisplay}
          </span>
        ) : (
          <span />
        )}

        <button
          type="button"
          aria-label={isFavorite ? `Remove ${product.name} from wishlist` : `Add ${product.name} to wishlist`}
          onClick={handleWishlistToggle}
          className="text-neutral-400 hover:text-[#FF383F] transition-colors p-0.5 rounded-full hover:bg-neutral-50 cursor-pointer shrink-0"
        >
          <Heart
            className={`w-3.5 h-3.5 stroke-[1.8] ${
              isFavorite ? 'fill-[#FF383F] text-[#FF383F]' : 'text-neutral-400'
            }`}
          />
        </button>
      </div>

      {/* Dedicated Product Image Area (Consistent Height, object-fit: contain) */}
      <div className="w-full h-[105px] min-[360px]:h-[115px] sm:h-[120px] md:h-[125px] lg:h-[130px] flex items-center justify-center my-1 sm:my-1.5 overflow-hidden">
        {productUrl ? (
          <Link 
            to={productUrl}
            onClick={(e) => e.stopPropagation()}
            className="w-full h-full flex items-center justify-center"
          >
            <img
              src={imgSrc}
              alt={product.name}
              onError={handleImageError}
              className="max-h-full max-w-full w-auto h-auto object-contain p-1 group-hover:scale-105 transition-transform duration-300"
              loading="lazy"
            />
          </Link>
        ) : (
          <img
            src={imgSrc}
            alt={product.name}
            onError={handleImageError}
            className="max-h-full max-w-full w-auto h-auto object-contain p-1 group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
          />
        )}
      </div>

      {/* Product Details */}
      <div className="mt-1 flex flex-col min-w-0">
        {/* Rating and Reviews (rendered only when provided by data) */}
        {product.rating !== undefined && product.rating !== null ? (
          <div className="flex items-center gap-1">
            <Star className="w-3 h-3 fill-amber-400 text-amber-400 stroke-none shrink-0" />
            <span className="text-[10.5px] sm:text-[11px] font-bold text-neutral-800">
              {product.rating}
            </span>
            {reviewCount !== undefined && reviewCount !== null && (
              <span className="text-[9.5px] sm:text-[10px] text-neutral-400 font-medium">
                ({reviewCount})
              </span>
            )}
          </div>
        ) : (
          <div className="min-h-[16px]" />
        )}

        {/* Product Title */}
        {productUrl ? (
          <Link
            to={productUrl}
            onClick={(e) => e.stopPropagation()}
            className="text-[11.5px] min-[360px]:text-[12px] sm:text-[12.5px] md:text-[13px] font-bold text-neutral-900 tracking-tight leading-snug line-clamp-2 mt-1 hover:text-[#1B4332] transition-colors break-words min-h-[30px] min-[360px]:min-h-[34px]"
            title={product.name}
          >
            {product.name}
          </Link>
        ) : (
          <h4 
            className="text-[11.5px] min-[360px]:text-[12px] sm:text-[12.5px] md:text-[13px] font-bold text-neutral-900 tracking-tight leading-snug line-clamp-2 mt-1 break-words min-h-[30px] min-[360px]:min-h-[34px]" 
            title={product.name}
          >
            {product.name}
          </h4>
        )}

        {/* Pricing Row with Flex Wrap and Safe Gap */}
        <div className="flex items-baseline gap-x-1.5 gap-y-0.5 mt-1 flex-wrap min-w-0">
          <span className="text-[12.5px] min-[360px]:text-[13px] sm:text-[13.5px] md:text-[14px] font-extrabold text-neutral-900 whitespace-nowrap">
            {formatPrice(product.price)}
          </span>
          {product.originalPrice && (
            <span className="text-[9.5px] min-[360px]:text-[10px] sm:text-[10.5px] text-neutral-400 line-through font-medium whitespace-nowrap">
              {formatPrice(product.originalPrice)}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
