import React, { useState, useEffect } from 'react';
import { ArrowRight } from 'lucide-react';
import { AUTH_CATEGORIES } from '../../constants/authConstants';

export default function CategoryShowcase({ isMobile = false }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [imgErrors, setImgErrors] = useState({});

  useEffect(() => {
    if (isPaused) return;

    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % AUTH_CATEGORIES.length);
    }, 4500);

    return () => clearInterval(timer);
  }, [isPaused]);

  const activeCategory = AUTH_CATEGORIES[activeIndex];
  const IconComponent = activeCategory.icon;

  const handleImageError = (index) => {
    setImgErrors((prev) => ({ ...prev, [index]: true }));
  };

  if (isMobile) {
    // Compact mobile banner rendered above the form (< md / lg)
    return (
      <div 
        className="w-full relative h-[140px] sm:h-[155px] rounded-[20px] overflow-hidden shadow-sm mb-6 select-none bg-[#012D1D]"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        {AUTH_CATEGORIES.map((cat, idx) => {
          const isCurrent = idx === activeIndex;
          const imgSrc = imgErrors[idx] ? cat.fallbackImage : cat.image;

          return (
            <div
              key={cat.id}
              className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
                isCurrent ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
              }`}
            >
              <img
                src={imgSrc}
                alt={cat.title}
                onError={() => handleImageError(idx)}
                className="w-full h-full object-cover object-center brightness-[0.82] transition-transform duration-1000 ease-out scale-100"
              />
              {/* Vignette Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#012D1D] via-[#012D1D]/70 to-[#012D1D]/30" />

              {/* Text Content */}
              <div className="absolute inset-0 p-4 flex flex-col justify-between text-white">
                <div className="flex items-center justify-between">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-white/20 backdrop-blur-xs text-white">
                    <span 
                      className="w-1.5 h-1.5 rounded-full" 
                      style={{ backgroundColor: cat.accent }}
                    />
                    {cat.pill}
                  </span>
                  <span className="text-[10px] font-medium text-white/70">
                    GROVE Marketplace
                  </span>
                </div>

                <div>
                  <h3 className="text-sm font-extrabold text-white tracking-tight drop-shadow-xs">
                    {cat.title}
                  </h3>
                  <p className="text-[11px] text-white/85 line-clamp-1 font-normal mt-0.5">
                    {cat.tagline}
                  </p>
                </div>
              </div>
            </div>
          );
        })}

        {/* Small Navigation Indicator Dots */}
        <div className="absolute bottom-2 right-3.5 z-20 flex items-center gap-1.5">
          {AUTH_CATEGORIES.map((cat, idx) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setActiveIndex(idx)}
              aria-label={`Show ${cat.title}`}
              className={`h-1 rounded-full transition-all duration-300 ${
                idx === activeIndex ? 'w-4 bg-white' : 'w-1.5 bg-white/40'
              }`}
            />
          ))}
        </div>
      </div>
    );
  }

  // Desktop / Tablet 50% Split Card Right Side
  return (
    <div 
      className="relative w-full h-full min-h-[580px] rounded-[24px] sm:rounded-[28px] overflow-hidden select-none bg-[#012D1D] flex flex-col justify-between p-7 sm:p-9 lg:p-10 shadow-inner group"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Background Images with Crossfade */}
      {AUTH_CATEGORIES.map((cat, idx) => {
        const isCurrent = idx === activeIndex;
        const imgSrc = imgErrors[idx] ? cat.fallbackImage : cat.image;

        return (
          <div
            key={cat.id}
            className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
              isCurrent ? 'opacity-100 z-0' : 'opacity-0 -z-10 pointer-events-none'
            }`}
          >
            <img
              src={imgSrc}
              alt={cat.title}
              onError={() => handleImageError(idx)}
              className="w-full h-full object-cover object-center brightness-[0.75] group-hover:scale-105 transition-transform duration-1000 ease-out"
            />
            {/* Multi-stage Cinematic Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#012D1D] via-[#012D1D]/60 to-[#012D1D]/35" />
            <div className="absolute inset-0 bg-radial-at-c from-transparent via-[#012D1D]/30 to-[#012D1D]/70" />
          </div>
        );
      })}

      {/* Top Controls: Marketplace Pill & Category Counter */}
      <div className="relative z-10 flex items-center justify-between">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md border border-white/20 text-white text-xs font-semibold shadow-xs">
          <IconComponent className="w-3.5 h-3.5" style={{ color: activeCategory.accent }} />
          <span>{activeCategory.pill} Showcase</span>
        </div>

        <div className="text-[11px] font-bold text-white/80 bg-black/25 backdrop-blur-xs px-2.5 py-1 rounded-full border border-white/10 tracking-widest">
          {activeIndex + 1} / {AUTH_CATEGORIES.length}
        </div>
      </div>

      {/* Center Floating Accent Badge */}
      <div className="relative z-10 my-auto py-6">
        <div className="inline-block p-3 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 shadow-xl mb-4 transition-transform duration-500 hover:rotate-3">
          <IconComponent className="w-7 h-7 text-white" />
        </div>
        <div className="text-[11px] font-extrabold uppercase tracking-[0.16em] text-white/70 mb-1">
          {activeCategory.keywords}
        </div>
        <h2 
          className="text-2xl sm:text-3xl lg:text-[32px] font-extrabold text-white tracking-tight leading-[1.18]"
          style={{ fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif" }}
        >
          {activeCategory.title}
        </h2>
        <p className="mt-2 text-sm text-neutral-200 font-normal leading-relaxed max-w-sm">
          {activeCategory.tagline}
        </p>
      </div>

      {/* Bottom Controls: Navigation Indicators and Next Preview */}
      <div className="relative z-10 pt-4 border-t border-white/15 flex items-center justify-between">
        {/* Indicators */}
        <div className="flex items-center gap-2">
          {AUTH_CATEGORIES.map((cat, idx) => {
            const isSelected = idx === activeIndex;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setActiveIndex(idx)}
                aria-label={`Switch to ${cat.title}`}
                className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                  isSelected 
                    ? 'w-8 bg-white shadow-xs' 
                    : 'w-2 bg-white/40 hover:bg-white/70'
                }`}
              />
            );
          })}
        </div>

        {/* Next Category preview button */}
        <button
          type="button"
          onClick={() => setActiveIndex((prev) => (prev + 1) % AUTH_CATEGORIES.length)}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-white/90 hover:text-white transition-all hover:translate-x-0.5 cursor-pointer"
        >
          <span>Next</span>
          <ArrowRight className="w-3.5 h-3.5 stroke-[2.2]" />
        </button>
      </div>
    </div>
  );
}
