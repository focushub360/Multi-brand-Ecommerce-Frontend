import React, { useState, useEffect } from 'react';
import ProductCard from './ProductCard';
import { productsApi } from '../services/apiClient.js';

export default function BestSellers() {
  const [activeCategory, setActiveCategory] = useState('All');
  const [productsList, setProductsList] = useState([]);

  useEffect(() => {
    productsApi.getAll({ limit: 16, sort: 'rating' })
      .then((res) => {
        const serverProds = res?.products || res?.data?.products || res?.data || (Array.isArray(res) ? res : []);
        if (serverProds.length > 0) {
          const normalized = serverProds.map((p) => ({
            id: p.id || p._id,
            dealerId: p.dealerCode || 'DEALER_001',
            name: p.name,
            category: p.categoryName?.includes('Agri') ? 'Agriculture' : p.categoryName?.includes('Elec') ? 'Electronics' : p.categoryName?.includes('Auto') ? 'Automotive' : 'Agriculture',
            discount: `-${p.discount || 10}%`,
            rating: p.rating || 4.5,
            reviews: p.reviewCount || 40,
            price: `₹${Number(p.price).toLocaleString('en-IN')}`,
            originalPrice: `₹${Number(p.mrp || p.price).toLocaleString('en-IN')}`,
            image: p.image || '/images/prod-tractor.png'
          }));
          setProductsList(normalized);
        }
      })
      .catch((err) => {
        console.warn('Backend best-sellers fetch warning:', err.message);
      });
  }, []);

  const categories = ['All', 'Agriculture', 'Electronics', 'Automotive'];

  const filteredProducts = activeCategory === 'All'
    ? productsList
    : productsList.filter((p) => p.category.toLowerCase() === activeCategory.toLowerCase());

  return (
    <section id="best-sellers" className="w-full bg-[#F7F3EA] pt-10 sm:pt-14 lg:pt-[134px] pb-7 md:pb-8 border-b border-neutral-200/50">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 md:px-10 lg:px-16">
        {/* Section Header Row */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3.5 pb-3.5 md:pb-4">
          {/* Left Title Area */}
          <div>
            {/* Crimson Label */}
            <div className="flex items-center gap-2">
              <span className="w-4 h-[2px] bg-[#FF383F] inline-block rounded-full" />
              <span className="text-[10px] md:text-[10.5px] font-extrabold text-[#FF383F] tracking-[0.14em] uppercase">
                POPULAR PICKS
              </span>
            </div>

            {/* Main Section Heading */}
            <h2 
              className="text-[28px] sm:text-[36px] md:text-[40px] lg:text-[46px] font-extrabold text-neutral-900 tracking-[-0.03em] leading-none mt-1 select-none"
              style={{ fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif" }}
            >
              Best Sellers
            </h2>

            {/* Subtitle */}
            <p className="text-xs sm:text-[13px] md:text-[13.5px] text-neutral-500 font-medium mt-1">
              Top products from across GROVE.
            </p>
          </div>

          {/* Right Filter Pills & Controls */}
          <div className="flex items-center justify-between sm:justify-end gap-2 md:gap-2.5 w-full sm:w-auto">
            {/* Scrollable category pills on mobile without wrapping lines */}
            <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto no-scrollbar py-0.5 max-w-full">
              {categories.map((cat) => {
                const isActive = activeCategory === cat;
                return (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={`px-3 sm:px-4 md:px-4.5 py-1.5 md:py-2 rounded-full text-[11.5px] sm:text-[12px] md:text-[12.5px] font-semibold transition-all duration-200 cursor-pointer shrink-0 ${
                      isActive
                        ? 'bg-[#0A3325] text-white shadow-xs'
                        : 'bg-[#F7F3EA] border border-neutral-300/80 text-[#0A3325] hover:bg-neutral-200/50 active:scale-95'
                    }`}
                  >
                    {cat}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* 6 Product Cards Responsive Grid: 2 cols on mobile, 3 cols on tablet, 6 cols on desktop */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5 sm:gap-3 md:gap-3.5 mt-3.5 sm:mt-4.5">
          {filteredProducts.map((product) => (
            <div key={product.id} className="h-full flex flex-col min-w-0">
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
