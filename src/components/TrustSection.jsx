import React from 'react';
import { ShieldCheck, Award, Lock, Truck } from 'lucide-react';

export default function TrustSection() {
  const features = [
    {
      id: 1,
      title: "Verified Dealers",
      description: "Direct OEM partnerships and verified regional merchants ensuring genuine goods.",
      icon: <ShieldCheck className="w-5 h-5 text-[#0A3325]" />,
      iconBg: "#E3ECE2",
    },
    {
      id: 2,
      title: "Quality Products",
      description: "Stringent quality controls on machinery, precision tech, and mechanical components.",
      icon: <Award className="w-5 h-5 text-[#0A3325]" />,
      iconBg: "#E3ECE2",
    },
    {
      id: 3,
      title: "Secure Payments",
      description: "Bank-grade encrypted gateway supporting credit cards, net banking, and UPI escrow.",
      icon: <Lock className="w-5 h-5 text-[#0A3325]" />,
      iconBg: "#E3ECE2",
    },
    {
      id: 4,
      title: "Reliable Order Tracking",
      description: "Full dispatch logistics updates with road freight tracking for bulky and parcel goods.",
      icon: <Truck className="w-5 h-5 text-[#0A3325]" />,
      iconBg: "#E3ECE2",
    },
  ];

  return (
    <section className="w-full bg-[#F7F3EA] py-12 sm:py-16 md:py-20 border-b border-neutral-200/60">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 md:px-10 lg:px-16">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-12">
          <div className="flex items-center justify-center gap-2 mb-1.5">
            <span className="w-4 h-[2px] bg-[#0A3325] inline-block rounded-full" />
            <span className="text-[10px] md:text-[10.5px] font-extrabold text-[#0A3325] tracking-[0.14em] uppercase">
              THE GROVE PROMISE
            </span>
            <span className="w-4 h-[2px] bg-[#0A3325] inline-block rounded-full" />
          </div>

          <h2 
            className="text-[24px] sm:text-[30px] lg:text-[36px] font-extrabold text-neutral-900 tracking-[-0.025em] leading-tight"
            style={{ fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif" }}
          >
            Why Shop on GROVE?
          </h2>
          <p className="text-xs sm:text-[14px] text-neutral-500 font-medium mt-1.5 sm:mt-2">
            Built for farmers, businesses, and everyday builders who value trust and speed.
          </p>
        </div>

        {/* 4 Columns Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 divide-y sm:divide-y-0 lg:divide-x divide-neutral-200/70">
          {features.map((item, idx) => (
            <div 
              key={item.id} 
              className={`pt-5 sm:pt-0 ${idx !== 0 ? 'lg:pl-8' : ''} flex flex-col items-start`}
            >
              <div 
                className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl flex items-center justify-center mb-3 sm:mb-4 transition-transform hover:scale-105 duration-200 shadow-2xs"
                style={{ backgroundColor: item.iconBg }}
              >
                {item.icon}
              </div>
              <h3 className="text-sm sm:text-[16px] font-bold text-neutral-900 tracking-tight mb-1">
                {item.title}
              </h3>
              <p className="text-xs sm:text-[13px] text-neutral-600 leading-relaxed font-normal">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
