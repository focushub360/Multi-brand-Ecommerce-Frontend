import React, { useState } from 'react';
import { 
  ArrowDown, 
  ShieldCheck, 
  Truck,
  Sparkles,
  Zap,
  Laptop
} from 'lucide-react';
import Navbar from '../Navbar';

export default function ElectronicsHero({ onScrollToCatalog }) {
  const [imgSrc, setImgSrc] = useState('/images/card-electronics.png');

  const handleImageFallback = () => {
    setImgSrc('https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=1200&q=80');
  };

  return (
    <header className="relative bg-[#FAF9F5] text-neutral-900 border-b border-neutral-200/70 overflow-hidden">
      {/* Reused GROVE Navbar with darkText variant for clean light background */}
      <div className="border-b border-neutral-200/60 bg-white/75 backdrop-blur-xs">
        <Navbar darkText={true} />
      </div>

      {/* Main Hero Container */}
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 md:px-10 lg:px-16 pt-6 sm:pt-8 md:pt-10 pb-10 sm:pb-16 lg:pb-20">
        {/* Two-Column Balanced Hero: Content Left, Authentic Photography Right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left Column: Heading, Value Proposition, CTAs, and Trust Highlights */}
          <div className="lg:col-span-7 flex flex-col items-start w-full">
            {/* Category Tag / Assurance Pill */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-neutral-100 border border-neutral-300 shadow-2xs mb-3 sm:mb-4 max-w-full">
              <Sparkles className="w-3.5 h-3.5 text-neutral-800 shrink-0" />
              <span className="text-[10px] sm:text-xs font-bold tracking-wide uppercase text-neutral-800 truncate">
                Certified Consumer &amp; Industrial Tech • Direct OEM Pricing
              </span>
            </div>

            {/* Editorial Heading using Newsreader Serif */}
            <h1 
              className="text-[26px] min-[360px]:text-[30px] sm:text-[40px] md:text-[46px] lg:text-[50px] font-normal leading-[1.12] text-neutral-900 tracking-tight"
              style={{ fontFamily: "'Newsreader', Georgia, serif" }}
            >
              Powering Modern Productivity with{' '}
              <span className="italic font-normal text-neutral-600">
                High-Performance Gadgets &amp; Smart Tech
              </span>
            </h1>

            {/* Sub-headline / Value Proposition */}
            <p className="mt-3.5 sm:mt-5 text-sm sm:text-base md:text-[17px] text-neutral-600 leading-relaxed font-normal max-w-2xl">
              Source genuine laptops, noise-cancelling audio, telemetry wearables, and automated IoT smart sensors with verified brand warranties and insured fast delivery.
            </p>

            {/* Primary & Secondary Action Buttons */}
            <div className="mt-6 sm:mt-8 flex flex-wrap items-center gap-3 sm:gap-4 w-full sm:w-auto">
              <button
                type="button"
                onClick={onScrollToCatalog}
                className="w-full min-[480px]:w-auto inline-flex items-center justify-center gap-2 bg-[#171717] hover:bg-black text-white text-xs sm:text-sm font-bold px-6 py-3.5 rounded-full shadow-md hover:shadow-lg transition-all duration-200 active:scale-95 cursor-pointer group"
              >
                <span>Explore Electronics Catalog</span>
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
                <Zap className="w-4 h-4 text-amber-500 fill-amber-500" />
                <span>Featured Tech Deals</span>
              </a>
            </div>

            {/* Trust Highlights Grid */}
            <div className="mt-8 sm:mt-10 pt-6 sm:pt-8 border-t border-neutral-200/80 w-full grid grid-cols-1 min-[480px]:grid-cols-3 gap-3.5 sm:gap-4 text-left">
              <div className="flex items-start gap-2.5">
                <div className="w-7 h-7 rounded-full bg-neutral-100 flex items-center justify-center text-neutral-800 shrink-0 mt-0.5">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="text-xs sm:text-[13px] font-bold text-neutral-900 leading-tight">
                    100% Genuine OEM
                  </h2>
                  <p className="text-[11px] text-neutral-500 leading-tight mt-0.5">
                    Authentic warranty &amp; GST invoice
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <div className="w-7 h-7 rounded-full bg-neutral-100 flex items-center justify-center text-neutral-800 shrink-0 mt-0.5">
                  <Truck className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="text-xs sm:text-[13px] font-bold text-neutral-900 leading-tight">
                    Insured Fast Freight
                  </h2>
                  <p className="text-[11px] text-neutral-500 leading-tight mt-0.5">
                    Padded packaging &amp; live dispatch
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <div className="w-7 h-7 rounded-full bg-neutral-100 flex items-center justify-center text-neutral-800 shrink-0 mt-0.5">
                  <Laptop className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="text-xs sm:text-[13px] font-bold text-neutral-900 leading-tight">
                    Field Tested Tech
                  </h2>
                  <p className="text-[11px] text-neutral-500 leading-tight mt-0.5">
                    Rigorous multi-point testing
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Hero Visual Card */}
          <div className="lg:col-span-5 relative w-full flex justify-center lg:justify-end">
            <div className="relative w-full max-w-[460px] lg:max-w-none rounded-[28px] overflow-hidden bg-neutral-900 shadow-2xl border border-neutral-800 p-6 sm:p-8 flex flex-col justify-between min-h-[360px] sm:min-h-[420px]">
              {/* Top ambient glow */}
              <div className="absolute -top-24 -right-24 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
              <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

              <div className="relative z-10">
                <span className="inline-block text-[10px] font-extrabold uppercase tracking-widest text-cyan-400 bg-cyan-950/60 border border-cyan-800/40 px-3 py-1 rounded-full mb-3">
                  PREMIUM TECHNOLOGY
                </span>
                <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                  Next-Gen Devices &amp; Smart Equipment
                </h3>
                <p className="text-xs sm:text-sm text-neutral-400 mt-1">
                  Engineered for commercial resilience and seamless work efficiency.
                </p>
              </div>

              {/* Product preview showcase */}
              <div className="relative z-10 py-6 flex items-center justify-center">
                <img
                  src={imgSrc}
                  alt="Electronics showcase"
                  onError={handleImageFallback}
                  className="max-h-[220px] sm:max-h-[250px] w-auto object-contain drop-shadow-[0_20px_25px_rgba(0,0,0,0.6)] hover:scale-105 transition-transform duration-500"
                />
              </div>

              {/* Bottom verified stats */}
              <div className="relative z-10 pt-4 border-t border-neutral-800/80 flex items-center justify-between text-xs text-neutral-300">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="font-semibold">Verified Stock Available</span>
                </div>
                <span className="font-bold text-white">Direct Warranty</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

