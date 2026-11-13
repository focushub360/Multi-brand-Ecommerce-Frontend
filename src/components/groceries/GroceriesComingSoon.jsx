import React from 'react';
import { Link } from 'react-router-dom';
import { 
  ShoppingBasket, 
  ArrowLeft, 
  Sprout, 
  Sparkles, 
  Truck, 
  ShieldCheck, 
  Clock, 
  HeartHandshake,
  Apple
} from 'lucide-react';

export default function GroceriesComingSoon() {
  const highlights = [
    {
      icon: Apple,
      title: 'Farm-Fresh Produce',
      desc: 'Hand-picked organic fruits, vegetables, and leafy greens direct from local growers.'
    },
    {
      icon: ShieldCheck,
      title: 'Pantry & Daily Staples',
      desc: 'Quality-tested pulses, unpolished grains, pure cold-pressed oils, and spices.'
    },
    {
      icon: Truck,
      title: 'Fast Doorstep Delivery',
      desc: 'Temperature-controlled logistics with flexible morning and evening delivery slots.'
    }
  ];

  return (
    <div className="w-full flex-1 flex flex-col justify-center py-12 sm:py-16 md:py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto w-full text-center">
        
        {/* Status Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#FEF3E2] border border-[#FDE68A] text-[#B45309] text-xs font-extrabold uppercase tracking-widest mb-6 shadow-xs animate-fadeIn">
          <span className="w-2 h-2 rounded-full bg-[#D97706] animate-pulse" />
          <span>Coming Soon</span>
        </div>

        {/* Hero Icon Presentation */}
        <div className="relative w-28 h-28 sm:w-36 sm:h-36 mx-auto mb-6 flex items-center justify-center">
          <div className="absolute inset-0 rounded-3xl bg-[#FEF3E2] transform rotate-6 border border-[#FCE7C8]" />
          <div className="relative w-full h-full rounded-3xl bg-white border border-[#FDE68A] shadow-lg flex items-center justify-center p-4 overflow-hidden">
            <img 
              src="/images/card-groceries.png" 
              alt="GROVE Groceries & Daily Essentials" 
              className="max-h-full max-w-full object-contain hover:scale-105 transition-transform duration-300"
            />
          </div>
        </div>

        {/* Main Heading & Subtitle */}
        <h1 
          className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#081C15] tracking-tight leading-tight"
          style={{ fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif" }}
        >
          Groceries
        </h1>
        <p className="text-xs sm:text-sm font-bold text-[#B45309] uppercase tracking-[0.2em] mt-2">
          Daily Essentials &amp; Farm Pantry
        </p>

        {/* Short Description */}
        <p className="mt-4 text-base sm:text-lg text-neutral-600 max-w-xl mx-auto leading-relaxed">
          We're preparing everyday essentials for you.
        </p>
        <p className="text-xs sm:text-sm text-neutral-400 max-w-lg mx-auto mt-1">
          From farm-fresh organic harvests to kitchen pantry staples, GROVE Groceries is being crafted with certified quality assurance.
        </p>

        {/* 3 Value Pillars */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mt-10 sm:mt-12 text-left">
          {highlights.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div 
                key={idx}
                className="bg-white rounded-2xl border border-neutral-200/80 p-5 shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between"
              >
                <div>
                  <div className="w-10 h-10 rounded-xl bg-[#FEF3E2] border border-[#FDE68A] flex items-center justify-center text-[#B45309] mb-3">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="font-bold text-neutral-900 text-sm mb-1">
                    {item.title}
                  </h3>
                  <p className="text-xs text-neutral-500 leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Call to Actions */}
        <div className="mt-10 sm:mt-12 pt-8 border-t border-neutral-200/70 flex flex-wrap items-center justify-center gap-3 sm:gap-4">
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#012D1D] hover:bg-[#1B4332] text-white text-xs sm:text-sm font-bold shadow-md hover:shadow-lg transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Homepage</span>
          </Link>

          <Link
            to="/agriculture"
            className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-white hover:bg-neutral-50 text-neutral-800 border border-neutral-300 text-xs sm:text-sm font-bold transition-colors"
          >
            <Sprout className="w-4 h-4 text-[#2C4A28]" />
            <span>Explore Agriculture</span>
          </Link>
        </div>

        <p className="mt-8 text-[11px] text-neutral-400 flex items-center justify-center gap-1.5">
          <Clock className="w-3.5 h-3.5 text-[#B45309]" />
          <span>Fulfillment hubs currently onboarding certified grocery suppliers.</span>
        </p>

      </div>
    </div>
  );
}

