import React from 'react';
import { ArrowRight, Sparkles } from 'lucide-react';

export default function PromoBanner() {
  return (
    <section className="w-full bg-[#141716] py-10 sm:py-14 md:py-20 relative overflow-hidden text-white">
      {/* Subtle background ambient geometric accent */}
      <div className="absolute -right-20 -top-20 w-96 h-96 bg-[#FF383F]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -left-20 -bottom-20 w-96 h-96 bg-[#8BCB45]/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 md:px-10 lg:px-16 relative z-10">
        <div className="bg-[#1C201F] border border-white/10 rounded-[24px] sm:rounded-[28px] p-5 sm:p-8 md:p-12 lg:p-14 flex flex-col lg:flex-row items-center justify-between gap-8 lg:gap-10 shadow-2xl relative overflow-hidden">
          {/* Subtle crimson accent bar on card left */}
          <div className="absolute left-0 top-0 bottom-0 w-1.5 sm:w-2 bg-[#FF383F]" />

          {/* Left Text & CTA Content */}
          <div className="max-w-xl text-center lg:text-left w-full">
            {/* Tag */}
            <div className="inline-flex items-center gap-2 bg-[#FF383F]/15 border border-[#FF383F]/30 px-3 py-1 rounded-full mb-3 sm:mb-4">
              <Sparkles className="w-3.5 h-3.5 text-[#FF383F]" />
              <span className="text-[10px] sm:text-[11px] font-extrabold text-[#FF383F] tracking-[0.14em] uppercase">
                SEASONAL HIGHLIGHTS
              </span>
            </div>

            {/* Headline */}
            <h2 
              className="text-[26px] min-[360px]:text-[30px] sm:text-[38px] lg:text-[48px] font-extrabold text-white tracking-[-0.03em] leading-[1.1] select-none"
              style={{ fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif" }}
            >
              Big Finds. Better Deals.
            </h2>

            {/* Supporting Text */}
            <p className="text-neutral-300 text-xs sm:text-base md:text-lg font-normal mt-2 sm:mt-3.5 leading-relaxed">
              Discover standout offers from across GROVE.
            </p>

            {/* CTA Button */}
            <div className="mt-5 sm:mt-7 flex flex-col sm:flex-row items-stretch sm:items-center justify-center lg:justify-start gap-3 sm:gap-4">
              <a
                href="#offers"
                className="inline-flex items-center justify-center gap-2 bg-[#FF383F] hover:bg-[#E22E35] text-white text-xs sm:text-[13.5px] font-bold px-6 sm:px-7 py-3 sm:py-3.5 rounded-full transition-all duration-200 shadow-[0_4px_16px_rgba(255,56,63,0.3)] hover:shadow-[0_6px_22px_rgba(255,56,63,0.4)] active:scale-[0.98]"
              >
                <span>Explore Offers</span>
                <ArrowRight className="w-4 h-4 stroke-[2.2]" />
              </a>
              <span className="text-[11px] sm:text-xs text-neutral-400 font-medium text-center sm:text-left">
                Up to 35% off selected verified lines
              </span>
            </div>
          </div>

          {/* Right Product Imagery Ensemble */}
          <div className="flex items-center justify-center gap-3 sm:gap-4 flex-wrap max-w-lg w-full">
            {/* Product Pill 1 */}
            <div className="bg-[#242928] border border-white/10 rounded-[18px] sm:rounded-[20px] p-3 sm:p-4 flex items-center gap-3 shadow-lg w-full sm:w-[230px]">
              <div className="w-12 h-12 sm:w-14 sm:h-14 bg-white rounded-[12px] sm:rounded-[14px] p-1 flex items-center justify-center shrink-0">
                <img src="/images/prod-headphones.png" alt="Headphones" className="max-h-full max-w-full object-contain" />
              </div>
              <div className="text-left min-w-0">
                <span className="text-[10px] font-extrabold text-[#FF383F] uppercase tracking-wider block">Hot Deal</span>
                <h4 className="text-xs sm:text-sm font-bold text-white truncate">Noise Pro Headphone</h4>
                <p className="text-xs font-black text-neutral-300">₹2,799</p>
              </div>
            </div>

            {/* Product Pill 2 */}
            <div className="bg-[#242928] border border-white/10 rounded-[18px] sm:rounded-[20px] p-3 sm:p-4 flex items-center gap-3 shadow-lg w-full sm:w-[230px]">
              <div className="w-12 h-12 sm:w-14 sm:h-14 bg-white rounded-[12px] sm:rounded-[14px] p-1 flex items-center justify-center shrink-0">
                <img src="/images/prod-tyre.png" alt="Tyres" className="max-h-full max-w-full object-contain" />
              </div>
              <div className="text-left min-w-0">
                <span className="text-[10px] font-extrabold text-[#8BCB45] uppercase tracking-wider block">Automotive</span>
                <h4 className="text-xs sm:text-sm font-bold text-white truncate">Car Tyre 185/65</h4>
                <p className="text-xs font-black text-neutral-300">₹4,500</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
