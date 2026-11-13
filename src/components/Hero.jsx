import React from 'react';
import Navbar from './Navbar';
import SearchBar from './SearchBar';
import CategoryCards from './CategoryCards';

export default function Hero() {
  return (
    <section className="relative bg-[#0A3325] pt-0 pb-10 sm:pb-14 lg:pb-28 overflow-visible">
      {/* Integrated Transparent Navbar */}
      <Navbar />

      {/* Hero Headline & Search Container */}
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 md:px-10 lg:px-16 pt-3 sm:pt-5 md:pt-8 flex flex-col items-center text-center">
        {/* Main 3-Line Headline with Fluid Responsive Typography */}
        <h1 
          className="text-white font-extrabold tracking-[-0.03em] leading-[1.1] sm:leading-[1.05] md:leading-[1.02] text-[26px] min-[360px]:text-[30px] min-[400px]:text-[34px] sm:text-[46px] md:text-[54px] lg:text-[60px] select-none max-w-full"
          style={{ fontFamily: "'Plus Jakarta Sans', system-ui, -apple-system, sans-serif" }}
        >
          {/* Line 1 */}
          <div className="flex items-center justify-center flex-wrap gap-x-2 sm:gap-x-3">
            <span>Order</span>
            <span className="relative inline-flex items-center text-[#8BCB45] whitespace-nowrap">
              <span>agri</span>
              {/* Sprouting leaf motif above 'i' */}
              <svg 
                className="absolute -top-3 -right-2 md:-top-4 md:-right-2.5 w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-5 md:h-5 text-[#8BCB45]" 
                viewBox="0 0 24 24"
                fill="none"
              >
                {/* Main angled leaf */}
                <path 
                  d="M11 15C13 10 18 6 22 5C22 9 19 14 14 16C12.5 16.5 11.5 16 11 15Z" 
                  fill="#8BCB45" 
                />
                {/* Secondary side leaf */}
                <path 
                  d="M11 15C9.5 12.5 7 11 4 11C5 13.5 7 15.5 9.5 16C10.2 16.2 10.8 15.8 11 15Z" 
                  fill="#8BCB45" 
                />
                {/* Stem */}
                <path 
                  d="M11 15C10.5 17 9.5 19 8 20.5" 
                  stroke="#8BCB45" 
                  strokeWidth="1.5" 
                  strokeLinecap="round" 
                />
              </svg>
            </span>
            <span className="whitespace-nowrap">products &amp;</span>
          </div>

          {/* Line 2 */}
          <div className="flex items-center justify-center flex-wrap gap-x-2 sm:gap-x-3 mt-0.5 sm:mt-1">
            <span className="inline-flex items-center whitespace-nowrap">
              <span>Electr</span>
              {/* Sleek Smartphone silhouette replacing 'o' */}
              <span className="inline-flex items-center justify-center mx-[1.5px] relative top-[1px]">
                <svg 
                  className="w-[0.52em] h-[0.74em] text-white" 
                  viewBox="0 0 20 28" 
                  fill="none"
                >
                  <rect x="1.5" y="1.5" width="17" height="25" rx="3.5" stroke="currentColor" strokeWidth="2.4" />
                  <line x1="7" y1="4.5" x2="13" y2="4.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                  <circle cx="10" cy="22.5" r="1.3" fill="currentColor" />
                </svg>
              </span>
              <span>nic</span>
            </span>
            <span className="whitespace-nowrap">product &amp;</span>
          </div>

          {/* Line 3 */}
          <div className="flex items-center justify-center flex-wrap gap-x-2 sm:gap-x-3 mt-0.5 sm:mt-1 text-[#FF383F]">
            <span className="inline-flex items-center whitespace-nowrap">
              <span>Aut</span>
              {/* Alloy Wheel Rim motif replacing 'o' */}
              <span className="inline-flex items-center justify-center mx-[1.5px] relative top-[0px]">
                <svg 
                  className="w-[0.70em] h-[0.70em] text-[#FF383F]" 
                  viewBox="0 0 24 24" 
                  fill="none"
                >
                  <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2.4" />
                  <circle cx="12" cy="12" r="3.2" stroke="currentColor" strokeWidth="1.6" />
                  <circle cx="12" cy="12" r="1.2" fill="currentColor" />
                  {/* Wheel Spokes */}
                  <line x1="12" y1="2" x2="12" y2="8.8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                  <line x1="12" y1="15.2" x2="12" y2="22" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                  <line x1="2" y1="12" x2="8.8" y2="12" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                  <line x1="15.2" y1="12" x2="22" y2="12" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                  <line x1="4.93" y1="4.93" x2="9.75" y2="9.75" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                  <line x1="14.25" y1="14.25" x2="19.07" y2="19.07" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                  <line x1="4.93" y1="19.07" x2="9.75" y2="14.25" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                  <line x1="14.25" y1="9.75" x2="19.07" y2="4.93" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                </svg>
              </span>
              <span>mobile</span>
            </span>
            <span className="whitespace-nowrap">parts.</span>
          </div>
        </h1>

        {/* Supporting Line */}
        <p className="text-white/95 text-sm sm:text-base md:text-lg lg:text-[18px] font-normal mt-3 sm:mt-3.5 tracking-[-0.01em] flex items-center justify-center gap-1.5 flex-wrap px-2">
          <span>Discover best products on</span>
          <span 
            className="text-[#8BCB45] text-xl sm:text-2xl md:text-3xl font-bold tracking-wide italic inline-block relative"
            style={{ 
              fontFamily: "'Caveat', cursive",
              transform: 'rotate(-2deg)'
            }}
          >
            GROVE!
            {/* Hand-drawn underline brush flourish */}
            <svg 
              className="absolute -bottom-1 left-0 w-full h-[6px] text-[#8BCB45]" 
              viewBox="0 0 80 8" 
              fill="none"
            >
              <path d="M2 5C25 1.5 55 2.5 78 6.5" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
            </svg>
          </span>
        </p>

        {/* Search Bar Controls */}
        <SearchBar />
      </div>

      {/* Category Cards: In normal document flow on mobile/tablet, overlapping on desktop */}
      <div className="mt-8 sm:mt-10 lg:mt-0 lg:absolute lg:left-0 lg:right-0 lg:bottom-0 lg:translate-y-[48%] z-20 pointer-events-auto lg:pointer-events-none">
        <CategoryCards />
      </div>
    </section>
  );
}
