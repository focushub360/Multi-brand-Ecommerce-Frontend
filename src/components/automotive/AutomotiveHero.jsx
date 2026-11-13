import React, { useState } from 'react';
import { 
  ArrowDown, 
  ShieldCheck, 
  Truck,
  Sparkles,
  Cog,
  Wrench
} from 'lucide-react';
import Navbar from '../Navbar';

export default function AutomotiveHero({ onScrollToCatalog }) {
  const [imgSrc, setImgSrc] = useState('/images/card-automotive.png');

  const handleImageFallback = () => {
    setImgSrc('https://images.unsplash.com/photo-1486006920555-c77dce18193b?auto=format&fit=crop&w=1200&q=80');
  };

  return (
    <header className="relative bg-[#FAF6F5] text-neutral-900 border-b border-neutral-200/70 z-30">
      {/* Reused GROVE Navbar with darkText variant */}
      <div className="relative z-50 border-b border-neutral-200/60 bg-white/95 shadow-2xs">
        <Navbar darkText={true} />
      </div>

      {/* Main Hero Container */}
      <div className="relative z-10 max-w-[1440px] mx-auto px-4 sm:px-6 md:px-10 lg:px-16 pt-6 sm:pt-8 md:pt-10 pb-10 sm:pb-16 lg:pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left Column: Heading, Value Proposition, CTAs, and Trust Highlights */}
          <div className="lg:col-span-7 flex flex-col items-start w-full">
            {/* Category Tag / Assurance Pill */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FCE8E7] border border-[#FF383F]/30 shadow-2xs mb-3 sm:mb-4 max-w-full">
              <Sparkles className="w-3.5 h-3.5 text-[#FF383F] shrink-0" />
              <span className="text-[10px] sm:text-xs font-bold tracking-wide uppercase text-[#A82420] truncate">
                Certified Automotive Hub • Genuine OEM Fitment Guaranteed
              </span>
            </div>

            {/* Editorial Heading using Newsreader Serif */}
            <h1 
              className="text-[26px] min-[360px]:text-[30px] sm:text-[40px] md:text-[46px] lg:text-[50px] font-normal leading-[1.12] text-neutral-900 tracking-tight"
              style={{ fontFamily: "'Newsreader', Georgia, serif" }}
            >
              Engineered for the Long Haul with{' '}
              <span className="italic font-normal text-[#FF383F]">
                Tested Spares &amp; Performance Parts
              </span>
            </h1>

            {/* Sub-headline / Value Proposition */}
            <p className="mt-3.5 sm:mt-5 text-sm sm:text-base md:text-[17px] text-neutral-600 leading-relaxed font-normal max-w-2xl">
              Source verified all-weather radial tyres, ceramic brake pads, heavy-duty suspension coilovers, and high-output alternators direct from authorized automotive dealers.
            </p>

            {/* Primary & Secondary Action Buttons */}
            <div className="mt-6 sm:mt-8 flex flex-wrap items-center gap-3 sm:gap-4 w-full sm:w-auto">
              <button
                type="button"
                onClick={onScrollToCatalog}
                className="w-full min-[480px]:w-auto inline-flex items-center justify-center gap-2 bg-[#FF383F] hover:bg-[#d92c33] text-white text-xs sm:text-sm font-bold px-6 py-3.5 rounded-full shadow-md hover:shadow-lg transition-all duration-200 active:scale-95 cursor-pointer group"
              >
                <span>Explore Auto Spares Catalog</span>
                <ArrowDown className="w-4 h-4 stroke-[2.2] group-hover:translate-y-0.5 transition-transform" />
              </button>

              <a
                href="#catalog"
                onClick={(e) => {
                  e.preventDefault();
                  onScrollToCatalog();
                }}
                className="w-full min-[480px]:w-auto inline-flex items-center justify-center gap-2 bg-white hover:bg-neutral-50 text-neutral-800 border border-neutral-300 text-xs sm:text-sm font-bold px-5 py-3.5 rounded-full transition-all duration-200 active:scale-95 cursor-pointer shadow-2xs"
              >
                <Cog className="w-4 h-4 text-[#FF383F]" />
                <span>OEM Certified Spares</span>
              </a>
            </div>

            {/* Trust Highlights Grid */}
            <div className="mt-8 sm:mt-10 pt-6 sm:pt-8 border-t border-neutral-200/80 w-full grid grid-cols-1 min-[480px]:grid-cols-3 gap-3.5 sm:gap-4 text-left">
              <div className="flex items-start gap-2.5">
                <div className="w-7 h-7 rounded-full bg-[#FCE8E7] flex items-center justify-center text-[#FF383F] shrink-0 mt-0.5">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="text-xs sm:text-[13px] font-bold text-neutral-900 leading-tight">
                    Direct OEM Fitment
                  </h2>
                  <p className="text-[11px] text-neutral-500 leading-tight mt-0.5">
                    100% genuine vehicle specs
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <div className="w-7 h-7 rounded-full bg-[#FCE8E7] flex items-center justify-center text-[#FF383F] shrink-0 mt-0.5">
                  <Truck className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="text-xs sm:text-[13px] font-bold text-neutral-900 leading-tight">
                    Heavy-Cargo Freight
                  </h2>
                  <p className="text-[11px] text-neutral-500 leading-tight mt-0.5">
                    Safe road logistics &amp; tracking
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <div className="w-7 h-7 rounded-full bg-[#FCE8E7] flex items-center justify-center text-[#FF383F] shrink-0 mt-0.5">
                  <Wrench className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="text-xs sm:text-[13px] font-bold text-neutral-900 leading-tight">
                    Heavy-Duty Tested
                  </h2>
                  <p className="text-[11px] text-neutral-500 leading-tight mt-0.5">
                    Endurance on Indian roads
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Hero Visual Card */}
          <div className="lg:col-span-5 relative w-full flex justify-center lg:justify-end">
            <div className="relative w-full max-w-[460px] lg:max-w-none rounded-[28px] overflow-hidden bg-[#1C1615] shadow-2xl border border-neutral-800 p-6 sm:p-8 flex flex-col justify-between min-h-[360px] sm:min-h-[420px]">
              {/* Top ambient glow */}
              <div className="absolute -top-24 -right-24 w-64 h-64 bg-red-600/15 rounded-full blur-3xl pointer-events-none" />
              <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-amber-600/10 rounded-full blur-3xl pointer-events-none" />

              <div className="relative z-10">
                <span className="inline-block text-[10px] font-extrabold uppercase tracking-widest text-[#FF383F] bg-red-950/60 border border-red-800/40 px-3 py-1 rounded-full mb-3">
                  OEM AUTOMOTIVE
                </span>
                <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                  High-Endurance Spares &amp; Components
                </h3>
                <p className="text-xs sm:text-sm text-neutral-400 mt-1">
                  Engineered to withstand heavy duty hauling, rural heat, and severe vibration.
                </p>
              </div>

              {/* Product preview showcase */}
              <div className="relative z-10 py-6 flex items-center justify-center">
                <img
                  src={imgSrc}
                  alt="Automotive parts showcase"
                  onError={handleImageFallback}
                  className="max-h-[220px] sm:max-h-[250px] w-auto object-contain drop-shadow-[0_20px_25px_rgba(0,0,0,0.6)] hover:scale-105 transition-transform duration-500"
                />
              </div>

              {/* Bottom verified stats */}
              <div className="relative z-10 pt-4 border-t border-neutral-800/80 flex items-center justify-between text-xs text-neutral-300">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-[#FF383F] animate-pulse" />
                  <span className="font-semibold">Ready for Dispatch</span>
                </div>
                <span className="font-bold text-white">Tested &amp; Guaranteed</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

