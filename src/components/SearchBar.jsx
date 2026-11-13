import React from 'react';
import { LayoutGrid, ChevronDown, Search } from 'lucide-react';

export default function SearchBar() {
  return (
    <div className="w-full max-w-[740px] mx-auto px-1 sm:px-4 mt-4 sm:mt-6 mb-5 sm:mb-7 md:mb-8 flex flex-col sm:flex-row items-center justify-center gap-2.5 md:gap-3">
      {/* Category Dropdown Control */}
      <div className="w-full sm:w-[280px] md:w-[325px] h-[44px] sm:h-[46px] md:h-[48px] bg-white rounded-[15px] px-3.5 sm:px-4 flex items-center justify-between text-neutral-800 shadow-[0_4px_16px_rgba(0,0,0,0.06)] hover:shadow-[0_6px_20px_rgba(0,0,0,0.09)] transition-all cursor-pointer group select-none shrink-0">
        <div className="flex items-center gap-2.5 sm:gap-3 overflow-hidden min-w-0">
          <LayoutGrid className="w-[17px] h-[17px] sm:w-[18px] sm:h-[18px] text-neutral-800 shrink-0 group-hover:scale-105 transition-transform" />
          <span className="text-[13px] sm:text-[13.5px] font-medium text-neutral-800 truncate">
            Explore a category
          </span>
        </div>
        <ChevronDown className="w-4 h-4 text-neutral-700 shrink-0 ml-1.5 group-hover:translate-y-0.5 transition-transform" />
      </div>

      {/* Main Search Input */}
      <div className="w-full sm:flex-1 md:w-[385px] h-[44px] sm:h-[46px] md:h-[48px] bg-white rounded-[15px] px-3.5 sm:px-4 flex items-center text-neutral-800 shadow-[0_4px_16px_rgba(0,0,0,0.06)] focus-within:shadow-[0_6px_20px_rgba(0,0,0,0.1)] transition-all min-w-0">
        <Search className="w-[17px] h-[17px] sm:w-[18px] sm:h-[18px] text-neutral-800 shrink-0 mr-2.5 sm:mr-3" />
        <input
          type="text"
          placeholder="Search products, brands or spare parts"
          className="w-full min-w-0 bg-transparent text-[13px] sm:text-[13.5px] font-medium text-neutral-800 placeholder:text-neutral-500 outline-none"
        />
      </div>
    </div>
  );
}
