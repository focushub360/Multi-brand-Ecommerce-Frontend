import React, { useState } from 'react';
import { 
  ArrowDown, 
  PhoneCall, 
  CheckCircle2, 
  ShieldCheck, 
  Truck,
  Sparkles
} from 'lucide-react';
import Navbar from '../Navbar';

export default function AgricultureHero({ onScrollToCatalog }) {
  const [imgSrc, setImgSrc] = useState('/images/hero-farmer.jpg');

  const handleImageFallback = () => {
    // Fallback to high-res Pexels CDN image if local path fails
    setImgSrc('https://images.pexels.com/photos/20841297/pexels-photo-20841297.jpeg?auto=compress&cs=tinysrgb&w=1600');
  };

  return (
    <header className="relative bg-[#F8FAF5] text-neutral-900 border-b border-neutral-200/70 z-30">
      {/* Reused GROVE Navbar with darkText variant for clean light background */}
      <div className="relative z-50 border-b border-neutral-200/60 bg-white/95 shadow-2xs">
        <Navbar darkText={true} />
      </div>

      {/* Main Hero Container */}
      <div className="relative z-10 max-w-[1440px] mx-auto px-4 sm:px-6 md:px-10 lg:px-16 pt-6 sm:pt-8 md:pt-10 pb-10 sm:pb-16 lg:pb-20">
        {/* Two-Column Balanced Hero: Content Left, Authentic Photography Right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left Column: Heading, Value Proposition, CTAs, and Trust Highlights */}
          <div className="lg:col-span-7 flex flex-col items-start w-full">
            {/* Category Tag / Assurance Pill */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#EBF4EE] border border-[#40916C]/20 shadow-2xs mb-3 sm:mb-4 max-w-full">
              <Sparkles className="w-3.5 h-3.5 text-[#40916C] shrink-0" />
              <span className="text-[10px] sm:text-xs font-bold tracking-wide uppercase text-[#1B4332] truncate">
                Certified Indian Agriculture Hub • Direct OEM Pricing
              </span>
            </div>

            {/* Editorial Heading using Newsreader Serif */}
            <h1 
              className="text-[26px] min-[360px]:text-[30px] sm:text-[40px] md:text-[46px] lg:text-[50px] font-normal leading-[1.12] text-[#1B4332] tracking-tight"
              style={{ fontFamily: "'Newsreader', Georgia, serif" }}
            >
              Empowering Modern Farmers with{' '}
              <span className="italic font-normal text-[#40916C]">
                Premium Machinery &amp; Proven Inputs
              </span>
            </h1>

            {/* Body Text in Plus Jakarta Sans */}
            <p className="mt-3 sm:mt-4 text-xs sm:text-base text-neutral-600 font-normal leading-relaxed max-w-xl">
              Equip your fields with verified heavy machinery, certified hybrid seeds, solar irrigation, and organic bio-nutrients. Backed by manufacturer warranty, transparent pricing, and dependable farm doorstep delivery across India.
            </p>

            {/* Call To Action Buttons */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4 mt-5 sm:mt-8 w-full sm:w-auto">
              <button
                type="button"
                onClick={onScrollToCatalog}
                className="inline-flex items-center justify-center gap-2 bg-[#1B4332] hover:bg-[#081C15] text-white font-bold text-xs sm:text-sm px-6 py-3.5 rounded-[14px] transition-all duration-200 shadow-md shadow-[#1B4332]/15 cursor-pointer active:scale-95 group"
              >
                <span>Shop Agricultural Catalog</span>
                <ArrowDown className="w-4 h-4 stroke-[2.4] group-hover:translate-y-0.5 transition-transform" />
              </button>

              <a
                href="#dealer"
                className="inline-flex items-center justify-center gap-2 bg-white hover:bg-neutral-50 text-[#1B4332] border border-[#1B4332]/25 font-bold text-xs sm:text-sm px-5 py-3.5 rounded-[14px] transition-all duration-200 cursor-pointer shadow-2xs"
              >
                <PhoneCall className="w-4 h-4 text-[#40916C]" />
                <span>Consult Agri-Expert</span>
              </a>
            </div>

            {/* Trust Highlights */}
            <div className="grid grid-cols-1 min-[380px]:grid-cols-3 sm:grid-cols-3 gap-2.5 sm:gap-6 mt-6 sm:mt-10 pt-5 sm:pt-6 border-t border-neutral-200/80 w-full max-w-lg">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#40916C] shrink-0" />
                <span className="text-[11px] sm:text-xs font-semibold text-neutral-700">
                  Govt Subsidy Support
                </span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#40916C] shrink-0" />
                <span className="text-[11px] sm:text-xs font-semibold text-neutral-700">
                  100% Genuine OEM
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Truck className="w-4 h-4 text-[#40916C] shrink-0" />
                <span className="text-[11px] sm:text-xs font-semibold text-neutral-700">
                  Doorstep Farm Freight
                </span>
              </div>
            </div>
          </div>

          {/* Right Column: Genuine DSLR Agricultural Photograph */}
          <div className="lg:col-span-5 relative z-0 mt-2 lg:mt-0 w-full">
            {/* Clean, Framed Photograph with Natural Drop Shadow */}
            <div className="relative z-0 rounded-[20px] sm:rounded-[28px] overflow-hidden border border-neutral-200/90 shadow-[0_12px_36px_rgba(27,67,50,0.08)] bg-neutral-100 aspect-[4/3] sm:aspect-[16/11] lg:aspect-[4/3] xl:aspect-[16/12]">
              <img
                src={imgSrc}
                alt="Indian farmer inspecting healthy crops in lush green field in morning light"
                onError={handleImageFallback}
                className="w-full h-full object-cover object-[center_30%]"
                loading="eager"
              />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
