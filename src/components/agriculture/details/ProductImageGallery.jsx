import React, { useState, useRef } from 'react';
import { Maximize2, X, ChevronLeft, ChevronRight, ShieldCheck } from 'lucide-react';

export default function ProductImageGallery({ product }) {
  const images = (product.images && product.images.length > 0) 
    ? product.images 
    : [product.image, product.fallbackImage].filter(Boolean);

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 50, y: 50 });
  const [failedImages, setFailedImages] = useState({});

  const containerRef = useRef(null);

  const activeSrc = failedImages[activeImageIndex] 
    ? (product.fallbackImage || '/images/prod-tractor.png') 
    : images[activeImageIndex];

  const handleImageError = (index) => {
    setFailedImages((prev) => ({ ...prev, [index]: true }));
  };

  const handleMouseMove = (e) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setMousePos({ x: Math.max(0, Math.min(100, x)), y: Math.max(0, Math.min(100, y)) });
  };

  const handlePrev = (e) => {
    e.stopPropagation();
    setActiveImageIndex((prev) => (prev > 0 ? prev - 1 : images.length - 1));
  };

  const handleNext = (e) => {
    e.stopPropagation();
    setActiveImageIndex((prev) => (prev < images.length - 1 ? prev + 1 : 0));
  };

  return (
    <div className="w-full flex flex-col gap-3 sm:gap-3.5 select-none">
      {/* Main Image Display Box */}
      <div 
        ref={containerRef}
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
        onMouseMove={handleMouseMove}
        className="relative w-full h-[260px] min-[360px]:h-[300px] sm:h-[400px] md:h-[430px] lg:h-[440px] bg-white rounded-[20px] border border-neutral-200/90 shadow-2xs p-3 sm:p-6 flex items-center justify-center overflow-hidden group cursor-crosshair"
      >
        {/* Discount Badge */}
        {product.discount && (
          <div className="absolute top-3 left-3 sm:top-4 sm:left-4 z-10">
            <span className="bg-[#1B4332] text-white text-[10px] sm:text-[11px] font-extrabold px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-[6px] sm:rounded-[8px] shadow-xs tracking-wide">
              {product.discount}
            </span>
          </div>
        )}

        {/* Stock Status Pill */}
        <div className="absolute top-3 right-3 sm:top-4 sm:right-4 z-10">
          <span className={`text-[10px] sm:text-[11px] font-bold px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full inline-flex items-center gap-1 sm:gap-1.5 shadow-2xs ${
            product.stockStatus === 'In Stock'
              ? 'bg-emerald-50 text-emerald-800 border border-emerald-300'
              : 'bg-amber-50 text-amber-800 border border-amber-300'
          }`}>
            <span className={`w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full ${
              product.stockStatus === 'In Stock' ? 'bg-emerald-600 animate-pulse' : 'bg-amber-600'
            }`} />
            {product.stockStatus || 'In Stock'}
          </span>
        </div>

        {/* Click to Enlarge / Full View Button */}
        <button
          type="button"
          onClick={() => setIsLightboxOpen(true)}
          aria-label="Enlarge image in fullscreen"
          className="absolute bottom-3 right-3 sm:bottom-4 sm:right-4 z-10 bg-white/90 hover:bg-white text-neutral-700 hover:text-[#1B4332] p-1.5 sm:p-2 rounded-full shadow-md border border-neutral-200 transition-all cursor-pointer active:scale-95 flex items-center gap-1 text-xs font-semibold"
          title="Click to expand"
        >
          <Maximize2 className="w-3.5 h-3.5" />
          <span className="hidden sm:inline text-[11px]">Enlarge</span>
        </button>

        {/* Main Product Image with Interactive Zoom */}
        <div className="w-full h-full flex items-center justify-center overflow-hidden p-2">
          <img
            src={activeSrc}
            alt={`${product.name} - view ${activeImageIndex + 1}`}
            onError={() => handleImageError(activeImageIndex)}
            className="max-h-full max-w-full w-auto h-auto object-contain transition-transform duration-150 ease-out drop-shadow-sm"
            style={
              isHovering
                ? {
                    transform: 'scale(1.85)',
                    transformOrigin: `${mousePos.x}% ${mousePos.y}%`,
                  }
                : {
                    transform: 'scale(1)',
                    transformOrigin: 'center center',
                  }
            }
          />
        </div>

        {/* Visual Zoom Hint (Desktop only) */}
        <div className="hidden sm:block absolute bottom-4 left-4 z-10 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity bg-neutral-900/60 backdrop-blur-xs text-white text-[10.5px] px-2 py-0.5 rounded-md font-medium">
          Roll over image to zoom
        </div>
      </div>

      {/* Thumbnail Strip */}
      {images.length > 1 && (
        <div className="flex items-center gap-2 sm:gap-2.5 overflow-x-auto pb-1 pt-0.5 no-scrollbar -mx-1 px-1">
          {images.map((img, idx) => {
            const isSelected = idx === activeImageIndex;
            const thumbSrc = failedImages[idx] ? (product.fallbackImage || '/images/prod-tractor.png') : img;
            return (
              <button
                key={idx}
                type="button"
                onClick={() => setActiveImageIndex(idx)}
                aria-label={`View photo ${idx + 1}`}
                className={`relative w-14 h-14 sm:w-18 sm:h-18 md:w-20 md:h-20 rounded-[12px] bg-white border p-1 sm:p-1.5 flex items-center justify-center shrink-0 cursor-pointer transition-all duration-200 ${
                  isSelected 
                    ? 'border-2 border-[#1B4332] shadow-sm ring-2 ring-[#1B4332]/15 scale-[1.03]' 
                    : 'border-neutral-200 hover:border-neutral-300 opacity-80 hover:opacity-100'
                }`}
              >
                <img
                  src={thumbSrc}
                  alt={`Thumbnail ${idx + 1}`}
                  onError={() => handleImageError(idx)}
                  className="max-h-full max-w-full object-contain"
                />
              </button>
            );
          })}
        </div>
      )}

      {/* Quality & Authenticity Guarantee Banner */}
      <div className="bg-[#EBF4EE] rounded-[14px] p-2.5 sm:p-3 border border-[#40916C]/25 flex items-center gap-2 sm:gap-2.5 text-[#1B4332]">
        <ShieldCheck className="w-4 h-4 sm:w-5 sm:h-5 text-[#40916C] shrink-0" />
        <p className="text-[11px] sm:text-xs font-semibold leading-snug">
          100% Genuine Agricultural Product with Manufacturer Warranty and Doorstep Farm Inspection.
        </p>
      </div>

      {/* Lightbox Modal */}
      {isLightboxOpen && (
        <div 
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-neutral-950/85 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200"
          onClick={() => setIsLightboxOpen(false)}
        >
          <div 
            className="relative max-w-4xl w-full bg-white rounded-[20px] sm:rounded-[24px] p-4 sm:p-6 shadow-2xl flex flex-col items-center max-h-[92vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="w-full flex items-center justify-between pb-3 border-b border-neutral-100">
              <div className="text-xs sm:text-sm font-bold text-neutral-800 truncate pr-4">
                {product.name} (Photo {activeImageIndex + 1} of {images.length})
              </div>
              <button
                type="button"
                onClick={() => setIsLightboxOpen(false)}
                aria-label="Close fullscreen"
                className="w-8 h-8 rounded-full bg-neutral-100 hover:bg-neutral-200 text-neutral-600 flex items-center justify-center transition-colors cursor-pointer shrink-0"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Lightbox Main Image */}
            <div className="relative w-full h-[280px] min-[400px]:h-[360px] sm:h-[460px] flex items-center justify-center my-4 overflow-hidden bg-neutral-50 rounded-[16px] p-4">
              <img
                src={activeSrc}
                alt={product.name}
                className="max-h-full max-w-full object-contain"
              />

              {/* Prev / Next controls inside Lightbox */}
              {images.length > 1 && (
                <>
                  <button
                    type="button"
                    onClick={handlePrev}
                    aria-label="Previous image"
                    className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white/90 hover:bg-white shadow-md flex items-center justify-center text-neutral-800 transition-all cursor-pointer"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    type="button"
                    onClick={handleNext}
                    aria-label="Next image"
                    className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white/90 hover:bg-white shadow-md flex items-center justify-center text-neutral-800 transition-all cursor-pointer"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </>
              )}
            </div>

            {/* Lightbox Thumbnails */}
            {images.length > 1 && (
              <div className="flex items-center gap-2 overflow-x-auto max-w-full pb-2 no-scrollbar">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setActiveImageIndex(idx)}
                    className={`w-12 h-12 rounded-[8px] border overflow-hidden p-0.5 shrink-0 ${
                      idx === activeImageIndex ? 'border-2 border-[#1B4332]' : 'border-neutral-200 opacity-60'
                    }`}
                  >
                    <img src={img} alt={`Thumb ${idx + 1}`} className="w-full h-full object-contain" />
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
