import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import ProductCard from './ProductCard';

export default function CategoryCollectionSection({
  id,
  tag,
  title,
  subtitle,
  viewAllText,
  viewAllHref,
  accentColor,
  tagColor,
  tagBg,
  products,
  bgClass = "bg-[#F7F3EA]",
}) {
  const isInternal = viewAllHref && viewAllHref.startsWith('/');

  return (
    <section id={id} className={`w-full ${bgClass} py-6 sm:py-7 md:py-8 border-b border-neutral-200/50`}>
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 md:px-10 lg:px-16">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 pb-3.5 md:pb-4 border-b border-neutral-200/60">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span 
                className="text-[9.5px] sm:text-[10px] md:text-[10.5px] font-extrabold tracking-[0.14em] uppercase px-2.5 py-0.5 rounded-full"
                style={{ backgroundColor: tagBg, color: tagColor }}
              >
                {tag}
              </span>
            </div>

            <h2 
              className="text-[22px] sm:text-[26px] md:text-[30px] lg:text-[34px] font-extrabold text-neutral-900 tracking-[-0.025em] leading-tight"
              style={{ fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif" }}
            >
              {title}
            </h2>

            <p className="text-xs sm:text-[13px] md:text-[14px] text-neutral-500 font-medium mt-0.5">
              {subtitle}
            </p>
          </div>

          <div className="self-start sm:self-auto">
            {isInternal ? (
              <Link
                to={viewAllHref}
                className="inline-flex items-center gap-1.5 text-xs sm:text-[13px] md:text-[13.5px] font-bold transition-all hover:gap-2 select-none group cursor-pointer"
                style={{ color: accentColor }}
              >
                <span>{viewAllText}</span>
                <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 stroke-[2.2] group-hover:translate-x-0.5 transition-transform" />
              </Link>
            ) : (
              <a
                href={viewAllHref}
                className="inline-flex items-center gap-1.5 text-xs sm:text-[13px] md:text-[13.5px] font-bold transition-all hover:gap-2 select-none group"
                style={{ color: accentColor }}
              >
                <span>{viewAllText}</span>
                <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 stroke-[2.2] group-hover:translate-x-0.5 transition-transform" />
              </a>
            )}
          </div>
        </div>

        {/* 5 Product Cards: 2-Col on Mobile/Tablet, 5-Col on Desktop */}
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2.5 sm:gap-3.5 lg:gap-4 mt-3.5 md:mt-4.5">
          {products.map((product) => (
            <div key={product.id} className="h-full flex flex-col min-w-0">
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
