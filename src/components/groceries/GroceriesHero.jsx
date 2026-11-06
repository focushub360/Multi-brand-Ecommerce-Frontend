
import React, { useState } from 'react';
import {
  ArrowDown,
  ShieldCheck,
  Truck,
  Sparkles,
  Leaf,
  ShoppingBasket
} from 'lucide-react';
import Navbar from '../Navbar';

export default function GroceriesHero({ onScrollToCatalog }) {
  const [imgSrc, setImgSrc] = useState(
    'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=1200&q=80'
  );

  return (
    <header className="relative bg-[#FAF9F5] text-neutral-900 border-b border-neutral-200/70 overflow-hidden">

      {/* Navbar - Same Electronics Design */}
      <div className="border-b border-neutral-200/60 bg-white/75 backdrop-blur-xs">
        <Navbar darkText={true} />
      </div>

      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 md:px-10 lg:px-16 pt-6 sm:pt-8 md:pt-10 pb-10 sm:pb-16 lg:pb-20">

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">

          {/* LEFT CONTENT */}
          <div className="lg:col-span-7 flex flex-col items-start w-full">

            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-neutral-100 border border-neutral-300 shadow-2xs mb-3 sm:mb-4 max-w-full">
              <Sparkles className="w-3.5 h-3.5 text-neutral-800" />
              <span className="text-[10px] sm:text-xs font-bold tracking-wide uppercase text-neutral-800">
                Fresh Quality Groceries • Everyday Essentials
              </span>
            </div>

            <h1
              className="text-[26px] min-[360px]:text-[30px] sm:text-[40px] md:text-[46px] lg:text-[50px] font-normal leading-[1.12] text-neutral-900 tracking-tight"
              style={{ fontFamily: "'Newsreader', Georgia, serif" }}
            >
              Freshness for Every Home with{' '}
              <span className="italic font-normal text-neutral-600">
                Farm Fresh Foods & Daily Essentials
              </span>
            </h1>

            <p className="mt-3.5 sm:mt-5 text-sm sm:text-base md:text-[17px] text-neutral-600 leading-relaxed font-normal max-w-2xl">
              Shop fresh fruits, vegetables, rice, grains, dairy products and everyday grocery essentials with quality assurance and convenient delivery.
            </p>

            {/* BUTTONS */}
            <div className="mt-6 sm:mt-8 flex flex-wrap items-center gap-3 sm:gap-4 w-full sm:w-auto">

              <button
                type="button"
                onClick={onScrollToCatalog}
                className="w-full min-[480px]:w-auto inline-flex items-center justify-center gap-2 bg-[#171717] hover:bg-black text-white text-xs sm:text-sm font-bold px-6 py-3.5 rounded-full shadow-md hover:shadow-lg transition-all duration-200 active:scale-95 cursor-pointer"
              >
                Explore Grocery Catalog
                <ArrowDown className="w-4 h-4" />
              </button>

              <a
                href="#groceries-products"
                onClick={(e) => {
                  e.preventDefault();
                  onScrollToCatalog?.();
                }}
                className="w-full min-[480px]:w-auto inline-flex items-center justify-center gap-2 bg-white hover:bg-neutral-50 text-neutral-800 border border-neutral-300 text-xs sm:text-sm font-bold px-5 py-3.5 rounded-full transition-all duration-200"
              >
                <Leaf className="w-4 h-4 text-green-600" />
                Fresh Grocery Deals
              </a>

            </div>

            {/* TRUST SECTION */}
            <div className="mt-8 sm:mt-10 pt-6 sm:pt-8 border-t border-neutral-200/80 w-full grid grid-cols-1 min-[480px]:grid-cols-3 gap-3.5 sm:gap-4">

              <div className="flex items-start gap-2.5">
                <div className="w-7 h-7 rounded-full bg-neutral-100 flex items-center justify-center shrink-0">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="text-xs sm:text-[13px] font-bold">Quality Assured</h2>
                  <p className="text-[11px] text-neutral-500 mt-0.5">
                    Carefully selected fresh products
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <div className="w-7 h-7 rounded-full bg-neutral-100 flex items-center justify-center shrink-0">
                  <Truck className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="text-xs sm:text-[13px] font-bold">Fast Delivery</h2>
                  <p className="text-[11px] text-neutral-500 mt-0.5">
                    Convenient doorstep delivery
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <div className="w-7 h-7 rounded-full bg-neutral-100 flex items-center justify-center shrink-0">
                  <ShoppingBasket className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="text-xs sm:text-[13px] font-bold">Daily Essentials</h2>
                  <p className="text-[11px] text-neutral-500 mt-0.5">
                    Everything in one place
                  </p>
                </div>
              </div>

            </div>
          </div>

          {/* RIGHT VISUAL CARD */}
          <div className="lg:col-span-5 relative w-full flex justify-center lg:justify-end">

            <div className="relative w-full max-w-[460px] lg:max-w-none rounded-[28px] overflow-hidden bg-neutral-900 shadow-2xl border border-neutral-800 p-6 sm:p-8 flex flex-col justify-between min-h-[360px] sm:min-h-[420px]">

              <div className="absolute -top-24 -right-24 w-64 h-64 bg-green-500/10 rounded-full blur-3xl" />
              <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-lime-500/10 rounded-full blur-3xl" />

              <div className="relative z-10">
                <span className="inline-block text-[10px] font-extrabold uppercase tracking-widest text-green-400 bg-green-950/60 border border-green-800/40 px-3 py-1 rounded-full mb-3">
                  FRESH & QUALITY FOODS
                </span>

                <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                  Farm Fresh Foods & Grocery Essentials
                </h3>

                <p className="text-xs sm:text-sm text-neutral-400 mt-1">
                  Fresh choices for healthy everyday living.
                </p>
              </div>

              <div className="relative z-10 py-6 flex items-center justify-center">
                <img
                  src={imgSrc}
                  alt="Fresh grocery products"
                  onError={() =>
                    setImgSrc('https://images.unsplash.com/photo-1610832958506-aa56368176cf?w=1000')
                  }
                  className="max-h-[220px] sm:max-h-[250px] w-auto object-contain drop-shadow-[0_20px_25px_rgba(0,0,0,0.6)] hover:scale-105 transition-transform duration-500"
                />
              </div>

              <div className="relative z-10 pt-4 border-t border-neutral-800/80 flex items-center justify-between text-xs text-neutral-300">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="font-semibold">Fresh Products Available</span>
                </div>
                <span className="font-bold text-white">Quality Assured</span>
              </div>

            </div>
          </div>

        </div>
      </div>
    </header>
  );
}
