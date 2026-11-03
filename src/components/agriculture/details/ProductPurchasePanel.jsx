import React, { useState, useMemo } from 'react';
import { 
  ShoppingCart, 
  Zap, 
  Heart, 
  Check, 
  MapPin, 
  Navigation,
  Compass,
  ShieldCheck, 
  RotateCcw, 
  Tag, 
  Minus, 
  Plus, 
  AlertCircle
} from 'lucide-react';
import { formatPrice } from '../../../utils/formatters';
import { calculateHaversineDistance, formatDistance } from '../../../utils/distance';
import { useCustomerLocation } from '../../../hooks/useCustomerLocation';

export default function ProductPurchasePanel({
  product,
  isWishlisted,
  onToggleWishlist,
  onAddToCart,
  onBuyNow
}) {
  const [quantity, setQuantity] = useState(1);
  const [isAdded, setIsAdded] = useState(false);

  // Customer location state from persistent hook
  const {
    customerLocation,
    setLocationFromPincode,
    setLocationFromCoordinates
  } = useCustomerLocation();

  const [pincodeInput, setPincodeInput] = useState('');
  const [inputError, setInputError] = useState('');
  const [isChangingLocation, setIsChangingLocation] = useState(false);
  const [isDetectingGPS, setIsDetectingGPS] = useState(false);

  const savings = product.savings || (product.originalPrice ? product.originalPrice - product.price : 0);

  // Seller details from product
  const sellerCoords = product.seller?.coordinates;
  const sellerLocation = product.seller?.location;

  // Calculate genuine Haversine distance using exact seller and customer coordinates
  const calculatedDistance = useMemo(() => {
    if (!customerLocation?.hasCoordinates || !customerLocation?.coordinates) return null;
    if (!sellerCoords?.lat || !sellerCoords?.lng) return null;

    return calculateHaversineDistance(
      sellerCoords.lat,
      sellerCoords.lng,
      customerLocation.coordinates.lat,
      customerLocation.coordinates.lng
    );
  }, [customerLocation, sellerCoords]);

  const handleDecreaseQty = () => {
    if (quantity > 1) setQuantity((prev) => prev - 1);
  };

  const handleIncreaseQty = () => {
    if (quantity < 10) setQuantity((prev) => prev + 1);
  };

  const handleSetLocation = (e) => {
    e.preventDefault();
    if (!pincodeInput.trim()) {
      setInputError('Please enter a 6-digit Indian PIN code.');
      return;
    }

    const result = setLocationFromPincode(pincodeInput);
    if (!result.success) {
      setInputError(result.error);
    } else {
      setInputError('');
      setIsChangingLocation(false);
    }
  };

  const handleUseGPS = () => {
    if (!navigator.geolocation) {
      setInputError('Geolocation is not supported by your browser. Please enter a 6-digit pincode.');
      return;
    }

    setIsDetectingGPS(true);
    setInputError('');

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setIsDetectingGPS(false);
        setLocationFromCoordinates(
          pos.coords.latitude,
          pos.coords.longitude,
          'Your Current GPS Location'
        );
        setIsChangingLocation(false);
      },
      (err) => {
        setIsDetectingGPS(false);
        let msg = 'Could not access device location. Please enter a 6-digit pincode.';
        if (err.code === 1) {
          msg = 'Location permission was denied. Please enter your 6-digit pincode.';
        }
        setInputError(msg);
      },
      { timeout: 8000, maximumAge: 60000 }
    );
  };

  const handleAddToCartClick = () => {
    if (onAddToCart) {
      const added = onAddToCart(product, quantity);
      if (added !== false) {
        setIsAdded(true);
        setTimeout(() => {
          setIsAdded(false);
        }, 1800);
      }
    }
  };

  const handleBuyNowClick = () => {
    if (onBuyNow) {
      onBuyNow(product, quantity);
    } else if (onAddToCart) {
      onAddToCart(product, quantity);
    }
  };

  return (
    <div className="w-full bg-white rounded-[20px] p-4 sm:p-6 border border-neutral-200/90 shadow-[0_4px_24px_rgba(27,67,50,0.06)] flex flex-col gap-3.5 sm:gap-4 text-neutral-900 select-none">
      {/* Price Block */}
      <div className="pb-3 border-b border-neutral-100">
        <div className="flex items-baseline gap-2 sm:gap-2.5 flex-wrap">
          <span className="text-2xl min-[360px]:text-3xl sm:text-[34px] font-black text-[#081C15] tracking-tight">
            {formatPrice(product.price)}
          </span>
          {product.originalPrice && (
            <span className="text-sm sm:text-base text-neutral-400 line-through font-semibold">
              {formatPrice(product.originalPrice)}
            </span>
          )}
          {product.discount && (
            <span className="bg-[#1B4332] text-white text-[11px] sm:text-xs font-black px-2 py-0.5 rounded-[6px] tracking-wide">
              {product.discount}
            </span>
          )}
        </div>

        {savings > 0 && (
          <div className="mt-1 flex items-center gap-1.5 text-xs font-bold text-emerald-700">
            <Tag className="w-3.5 h-3.5" />
            <span>You Save {formatPrice(savings)} (Direct OEM Discount)</span>
          </div>
        )}

        <p className="text-[11px] text-neutral-500 font-medium mt-1">
          Inclusive of all taxes &amp; GST input invoice provided
        </p>
      </div>

      {/* Stock Status */}
      <div className="flex items-center gap-2">
        <span className={`w-2.5 h-2.5 rounded-full ${
          product.stockStatus === 'In Stock' ? 'bg-emerald-600 animate-pulse' : 'bg-amber-600'
        }`} />
        <span className="text-xs font-bold text-neutral-800">
          {product.stockStatus === 'In Stock' ? 'In Stock — Ready for Farm Dispatch' : 'Limited Stock — Order Soon'}
        </span>
      </div>

      {/* Distance from Your Location Section (Replacing Doorstep Farm Delivery) */}
      <div className="bg-[#F8FAF8] rounded-[16px] p-3 sm:p-4 border border-neutral-200/80">
        {/* Section Header */}
        <div className="flex items-center justify-between gap-2 mb-2 flex-wrap">
          <div className="flex items-center gap-1.5 text-xs font-bold text-neutral-900">
            <MapPin className="w-4 h-4 text-[#1B4332] shrink-0" />
            <span>Distance from Your Location</span>
          </div>
          {customerLocation && !isChangingLocation && (
            <button
              type="button"
              onClick={() => {
                setIsChangingLocation(true);
                setPincodeInput(customerLocation.pincode || '');
                setInputError('');
              }}
              className="text-[11px] font-bold text-[#1B4332] hover:text-[#081C15] underline cursor-pointer"
            >
              Change Location
            </button>
          )}
        </div>

        {/* State A: Location Input Form (When no location is set or customer clicked Change Location) */}
        {(!customerLocation || isChangingLocation) && (
          <div className="space-y-2.5">
            <p className="text-xs text-neutral-600 font-medium">
              Set your location to view distance
            </p>

            {sellerLocation && (
              <p className="text-[11px] text-neutral-500">
                Dealer dispatched from: <strong className="text-neutral-800 font-semibold">{sellerLocation}</strong>
              </p>
            )}

            <form onSubmit={handleSetLocation} className="space-y-2">
              <div className="flex flex-wrap sm:flex-nowrap items-center gap-2">
                <div className="relative flex-1 min-w-[120px]">
                  <input
                    type="text"
                    maxLength={6}
                    value={pincodeInput}
                    onChange={(e) => {
                      setPincodeInput(e.target.value.replace(/\D/g, ''));
                      if (inputError) setInputError('');
                    }}
                    placeholder="Enter 6-digit Pincode"
                    className="w-full px-3 py-1.5 bg-white border border-neutral-300 rounded-[10px] text-xs font-medium text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:border-[#1B4332] transition-colors"
                  />
                </div>
                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    type="submit"
                    className="px-3.5 py-1.5 bg-[#1B4332] hover:bg-[#081C15] text-white text-xs font-bold rounded-[10px] transition-colors cursor-pointer shrink-0"
                  >
                    Apply
                  </button>
                  {isChangingLocation && customerLocation && (
                    <button
                      type="button"
                      onClick={() => {
                        setIsChangingLocation(false);
                        setInputError('');
                      }}
                      className="px-2.5 py-1.5 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 text-xs font-semibold rounded-[10px] transition-colors cursor-pointer shrink-0"
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </div>

              {/* Optional GPS Location Action */}
              <div className="flex items-center justify-between pt-0.5">
                <button
                  type="button"
                  onClick={handleUseGPS}
                  disabled={isDetectingGPS}
                  className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#1B4332] hover:underline cursor-pointer disabled:opacity-50"
                >
                  <Compass className="w-3 h-3 text-[#40916C]" />
                  <span>{isDetectingGPS ? 'Detecting GPS...' : 'Use device location'}</span>
                </button>
              </div>

              {inputError && (
                <div className="flex items-start gap-1.5 text-[11px] font-medium text-red-700 bg-red-50 p-2 rounded-[8px] border border-red-200">
                  <AlertCircle className="w-3.5 h-3.5 text-red-600 shrink-0 mt-0.5" />
                  <span>{inputError}</span>
                </div>
              )}
            </form>
          </div>
        )}

        {/* State B: Location is Set - Show Customer Location, Seller Location, & Distance */}
        {customerLocation && !isChangingLocation && (
          <div className="space-y-2">
            {/* Customer Delivery Location */}
            <div className="text-xs text-neutral-700">
              <span className="text-neutral-500">Your Location: </span>
              <strong className="font-bold text-neutral-900">
                {customerLocation.displayLabel || customerLocation.pincode}
              </strong>
            </div>

            {/* Seller / Dealer Location */}
            {sellerLocation ? (
              <div className="text-xs text-neutral-700">
                <span className="text-neutral-500">Dealer Location: </span>
                <strong className="font-semibold text-neutral-900">{sellerLocation}</strong>
                {product.seller?.name && (
                  <span className="text-neutral-500 text-[11px] block sm:inline sm:ml-1">
                    ({product.seller.name})
                  </span>
                )}
              </div>
            ) : (
              <div className="text-xs text-neutral-500">
                Dealer location is not specified.
              </div>
            )}

            {/* Distance Display */}
            {calculatedDistance !== null ? (
              <div className="mt-2.5 p-2.5 rounded-[12px] bg-[#EBF4EE] border border-[#40916C]/30 text-[#1B4332]">
                <div className="flex items-center gap-2">
                  <Navigation className="w-4 h-4 text-[#40916C] shrink-0" />
                  <span className="text-xs sm:text-[13px] font-extrabold tracking-tight">
                    Dealer is {formatDistance(calculatedDistance)} away
                  </span>
                </div>
                <p className="text-[10px] text-[#1B4332]/75 font-medium mt-1 leading-snug">
                  Direct aerial distance calculated using coordinates. Actual road transit route may vary.
                </p>
              </div>
            ) : (
              <div className="mt-2 p-2.5 rounded-[10px] bg-amber-50 border border-amber-200 text-amber-800 text-xs flex items-start gap-1.5">
                <AlertCircle className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                <span className="leading-snug">
                  {!customerLocation.hasCoordinates
                    ? `Distance cannot currently be calculated. Coordinates mapping is unavailable for PIN ${customerLocation.pincode}.`
                    : 'Distance cannot currently be calculated as dealer coordinates are unavailable.'}
                </span>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Available Offers Box */}
      {product.offers && product.offers.length > 0 && (
        <div className="space-y-1.5">
          <span className="text-[11px] font-extrabold uppercase tracking-wider text-neutral-500 block">
            Applicable Offers
          </span>
          {product.offers.slice(0, 3).map((offer, index) => (
            <div key={index} className="flex items-start gap-2 text-xs text-neutral-700 font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-[#40916C] shrink-0 mt-1.5" />
              <span className="leading-snug">{offer}</span>
            </div>
          ))}
        </div>
      )}

      {/* Quantity Selector */}
      <div className="flex items-center justify-between pt-2 border-t border-neutral-100">
        <span className="text-xs font-bold text-neutral-700">Quantity</span>
        <div className="flex items-center border border-neutral-200 rounded-[12px] bg-neutral-50 p-0.5">
          <button
            type="button"
            onClick={handleDecreaseQty}
            disabled={quantity <= 1}
            aria-label="Decrease quantity"
            className="w-8 h-8 rounded-[10px] bg-white text-neutral-700 hover:bg-neutral-100 disabled:opacity-40 flex items-center justify-center transition-colors cursor-pointer disabled:cursor-not-allowed"
          >
            <Minus className="w-3.5 h-3.5" />
          </button>
          <span className="w-10 text-center text-xs font-black text-neutral-900">
            {quantity}
          </span>
          <button
            type="button"
            onClick={handleIncreaseQty}
            disabled={quantity >= 10}
            aria-label="Increase quantity"
            className="w-8 h-8 rounded-[10px] bg-white text-neutral-700 hover:bg-neutral-100 disabled:opacity-40 flex items-center justify-center transition-colors cursor-pointer disabled:cursor-not-allowed"
          >
            <Plus className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Action Buttons: Add to Cart, Buy Now, Wishlist */}
      <div className="flex flex-col gap-2.5 pt-1">
        {/* Primary Add to Cart */}
        <button
          type="button"
          onClick={handleAddToCartClick}
          className={`w-full py-3 px-4 rounded-[14px] font-bold text-xs sm:text-sm transition-all duration-200 flex items-center justify-center gap-2 shadow-md cursor-pointer active:scale-[0.98] ${
            isAdded
              ? 'bg-emerald-600 text-white shadow-emerald-600/20'
              : 'bg-[#1B4332] hover:bg-[#081C15] text-white shadow-[#1B4332]/20 hover:shadow-lg'
          }`}
        >
          {isAdded ? (
            <>
              <Check className="w-4 h-4 stroke-[2.5]" />
              <span>Added to Cart ({quantity})</span>
            </>
          ) : (
            <>
              <ShoppingCart className="w-4 h-4" />
              <span>Add to Cart</span>
            </>
          )}
        </button>

        {/* Secondary Buy Now */}
        <button
          type="button"
          onClick={handleBuyNowClick}
          className="w-full py-3 px-4 rounded-[14px] font-bold text-xs sm:text-sm bg-[#52B788] hover:bg-[#40916C] text-[#081C15] hover:text-white transition-all duration-200 flex items-center justify-center gap-2 shadow-sm cursor-pointer active:scale-[0.98]"
        >
          <Zap className="w-4 h-4 fill-current" />
          <span>Buy Now</span>
        </button>

        {/* Wishlist Button */}
        <button
          type="button"
          onClick={() => onToggleWishlist(product.id)}
          aria-label={isWishlisted ? 'Remove from wishlist' : 'Save to wishlist'}
          className={`w-full py-2.5 px-4 rounded-[14px] font-bold text-xs border transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer ${
            isWishlisted
              ? 'border-[#FF383F] bg-[#FF383F]/10 text-[#FF383F]'
              : 'border-neutral-200 bg-white hover:bg-neutral-50 text-neutral-700'
          }`}
        >
          <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-[#FF383F] text-[#FF383F]' : ''}`} />
          <span>{isWishlisted ? 'Saved to Wishlist' : 'Add to Wishlist'}</span>
        </button>
      </div>

      {/* Seller & Protection Info Summary */}
      <div className="pt-3 border-t border-neutral-100 flex flex-col gap-2 text-xs text-neutral-600">
        <div className="flex items-center justify-between">
          <span className="text-neutral-500">Sold by:</span>
          <span className="font-bold text-neutral-900 text-right truncate max-w-[180px]">
            {product.seller?.name || 'GROVE Authorized Depot'}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-neutral-500">Seller Rating:</span>
          <span className="font-bold text-neutral-900">
            {product.seller?.rating || 4.8} / 5.0 ★
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-neutral-500">Dispatched from:</span>
          <span className="font-semibold text-neutral-800">
            {product.seller?.location || 'GROVE Central Depot'}
          </span>
        </div>
        <div className="flex items-center gap-2 pt-1 text-emerald-800">
          <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
          <span className="font-medium text-[11.5px]">
            {product.warranty || 'OEM Warranty with Doorstep Service'}
          </span>
        </div>
        <div className="flex items-center gap-2 text-neutral-600">
          <RotateCcw className="w-4 h-4 text-[#1B4332] shrink-0" />
          <span className="font-medium text-[11.5px]">
            7-Day Replacement guarantee for damaged or defective items
          </span>
        </div>
      </div>
    </div>
  );
}
