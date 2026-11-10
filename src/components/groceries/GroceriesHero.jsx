
import React from 'react';
import { Sparkles, Leaf, ArrowRight, Truck } from 'lucide-react';

export default function GroceriesHero({ onScrollToCatalog }) {
  return (
    <section className="w-full pb-8">
      <div className="relative w-full rounded-2xl bg-[#FAFAF5] border border-[#E2EBDE] shadow-sm overflow-hidden p-6 lg:p-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">

          {/* Left Column */}
          <div className="lg:col-span-6 flex flex-col justify-center gap-4 lg:pr-4">

            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E8F5E9] text-[#274E3D] w-fit">
              <Leaf size={16} className="text-[#0D631B]" />
              <span className="text-xs font-bold uppercase tracking-wider">
                Locally Harvested • Pure Provenance
              </span>
            </div>

            <h1 className="text-3xl lg:text-5xl font-serif text-[#161D16] leading-tight tracking-tight">
              Fresh Choices.
              <br />
              <span className="font-serif italic text-[#0D631B]">
                Better Living.
              </span>
            </h1>

            <p className="text-base lg:text-lg text-[#40493D] max-w-lg leading-relaxed">
              Direct from verified local farms and organic growers to your
              kitchen table within hours.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button
                type="button"
                onClick={onScrollToCatalog}
                className="inline-flex items-center justify-center gap-2 bg-[#2E7D32] hover:bg-[#0D631B] text-white font-semibold px-6 py-3 rounded-full shadow-sm hover:shadow-md transition-all text-sm"
              >
                <span>Shop Now</span>
                <ArrowRight size={18} />
              </button>

              <span className="text-xs text-[#40493D] flex items-center gap-2 font-medium">
                <Truck size={17} className="text-[#2E7D32]" />
                Dispatched daily by 9:00 AM
              </span>
            </div>
          </div>

          {/* Right Column: Editorial Visual */}
          <div className="lg:col-span-6 flex justify-center lg:justify-end">
            <div className="relative w-full aspect-[4/3] max-w-lg rounded-2xl overflow-hidden shadow-md">

              <img
                src="https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=1200&q=80"
                alt="Fresh farm produce crate"
                className="w-full h-full object-cover"
                loading="lazy"
              />

              <div className="absolute bottom-4 left-4 right-4 sm:right-auto bg-white/90 backdrop-blur-md px-4 py-2 rounded-xl shadow-sm flex items-center gap-3">

                <div className="w-8 h-8 rounded-full bg-[#2E7D32] flex items-center justify-center text-white">
                  <Sparkles size={17} />
                </div>

                <div className="flex flex-col">
                  <span className="text-[10px] uppercase tracking-wider text-[#40493D] font-bold">
                    Farm Verified
                  </span>
                  <span className="text-sm font-semibold text-[#161D16]">
                    100% Organically Raised
                  </span>
                </div>

              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
