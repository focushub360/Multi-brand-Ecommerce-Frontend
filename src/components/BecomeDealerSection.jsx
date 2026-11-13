import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle2, Store, TrendingUp, Users } from 'lucide-react';

export default function BecomeDealerSection() {
  const perks = [
    { text: "Zero listing commission for the first 90 days" },
    { text: "Integrated freight delivery and local depot dispatch" },
    { text: "Real-time analytics and verified buyer inquiries" },
  ];

  return (
    <section id="dealer" className="w-full bg-[#0A3325] text-white py-12 sm:py-16 md:py-24 relative overflow-hidden">
      {/* Subtle organic light shape */}
      <div className="absolute right-0 top-0 w-96 h-96 bg-[#8BCB45]/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 md:px-10 lg:px-16 relative z-10">
        <div className="bg-[#08281D] border border-white/10 rounded-[24px] sm:rounded-[28px] p-5 sm:p-8 md:p-14 lg:p-16 flex flex-col lg:flex-row items-center justify-between gap-8 lg:gap-10 shadow-2xl relative">
          {/* Left Text & CTA */}
          <div className="max-w-2xl text-center lg:text-left w-full">
            <div className="inline-flex items-center gap-2 bg-[#8BCB45]/15 border border-[#8BCB45]/30 px-3 py-1 rounded-full mb-3 sm:mb-4">
              <Store className="w-3.5 h-3.5 text-[#8BCB45]" />
              <span className="text-[10px] sm:text-[11px] font-extrabold text-[#8BCB45] tracking-[0.14em] uppercase">
                GROW WITH GROVE
              </span>
            </div>

            <h2 
              className="text-[24px] min-[360px]:text-[28px] sm:text-[38px] lg:text-[46px] font-extrabold text-white tracking-[-0.03em] leading-[1.12]"
              style={{ fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif" }}
            >
              Your Products Deserve a Bigger Marketplace.
            </h2>

            <p className="text-neutral-300 text-xs sm:text-base md:text-lg font-normal mt-2.5 sm:mt-4 leading-relaxed max-w-xl">
              Connect with customers across agriculture, electronics and automotive categories through GROVE.
            </p>

            {/* Perks list */}
            <div className="mt-5 sm:mt-6 flex flex-col sm:flex-row items-start sm:items-center gap-2.5 sm:gap-6 text-xs sm:text-sm text-neutral-300">
              {perks.map((p, i) => (
                <div key={i} className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#8BCB45] shrink-0" />
                  <span className="text-[11.5px] sm:text-xs font-medium text-left">{p.text}</span>
                </div>
              ))}
            </div>

            {/* CTA Button */}
            <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row items-stretch sm:items-center justify-center lg:justify-start gap-3 sm:gap-4">
              <Link
                to="/become-a-dealer"
                className="inline-flex items-center justify-center gap-2 bg-[#F7F4ED] hover:bg-white text-[#0A3325] text-xs sm:text-[13.5px] font-extrabold px-6 sm:px-7 py-3 sm:py-3.5 rounded-full transition-all duration-200 shadow-md hover:shadow-lg active:scale-[0.98]"
              >
                <span>Become a Dealer</span>
                <ArrowRight className="w-4 h-4 stroke-[2.2]" />
              </Link>
              <a
                href="#dealer-login"
                className="text-xs font-semibold text-white/80 hover:text-white underline underline-offset-4 text-center sm:text-left py-1"
              >
                Already a partner? Login
              </a>
            </div>
          </div>

          {/* Right Statistics Box */}
          <div className="grid grid-cols-2 gap-3 sm:gap-4 w-full lg:w-auto">
            <div className="bg-white/5 border border-white/10 rounded-2xl p-4 sm:p-5 text-center min-w-[120px] sm:min-w-[160px]">
              <Users className="w-5 h-5 sm:w-6 sm:h-6 text-[#8BCB45] mx-auto mb-1.5 sm:mb-2" />
              <div className="text-xl sm:text-2xl font-black text-white">45,000+</div>
              <div className="text-[10px] sm:text-xs text-neutral-400 mt-0.5">Active Monthly Buyers</div>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-2xl p-4 sm:p-5 text-center min-w-[120px] sm:min-w-[160px]">
              <TrendingUp className="w-5 h-5 sm:w-6 sm:h-6 text-[#8BCB45] mx-auto mb-1.5 sm:mb-2" />
              <div className="text-xl sm:text-2xl font-black text-white">₹12 Cr+</div>
              <div className="text-[10px] sm:text-xs text-neutral-400 mt-0.5">Quarterly GMV Routed</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
