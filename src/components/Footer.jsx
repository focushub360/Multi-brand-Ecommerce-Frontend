import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowUp } from 'lucide-react';

const CURRENT_YEAR = new Date().getFullYear();

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="w-full bg-[#111413] text-neutral-300 pt-12 sm:pt-16 pb-10 sm:pb-12 border-t border-white/5">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 md:px-10 lg:px-16">
        {/* Main Footer Links Columns */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8 pb-10 sm:pb-14 border-b border-white/10">
          {/* Brand Column (Spans 2 cols on mobile/tablet, 1 col on desktop) */}
          <div className="col-span-2 md:col-span-3 lg:col-span-1">
            <Link 
              to="/" 
              className="text-white font-extrabold text-[24px] sm:text-[28px] tracking-[-0.03em] font-sans inline-block mb-2 sm:mb-3 select-none"
            >
              GROVE
            </Link>
            <p className="text-neutral-400 text-xs sm:text-[13px] leading-relaxed max-w-xs font-normal">
              One marketplace for agriculture, electronics and automotive essentials.
            </p>

            {/* Social Icons */}
            <div className="flex items-center gap-3 mt-4 sm:mt-6">
              {/* Facebook */}
              <a
                href="#facebook"
                aria-label="GROVE on Facebook"
                className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 hover:text-white flex items-center justify-center text-neutral-400 transition-colors"
              >
                <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                  <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95C18.05 21.45 22 17.19 22 12z" />
                </svg>
              </a>
              {/* Twitter / X */}
              <a
                href="#twitter"
                aria-label="GROVE on X"
                className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 hover:text-white flex items-center justify-center text-neutral-400 transition-colors"
              >
                <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>
              {/* Instagram */}
              <a
                href="#instagram"
                aria-label="GROVE on Instagram"
                className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 hover:text-white flex items-center justify-center text-neutral-400 transition-colors"
              >
                <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                </svg>
              </a>
              {/* LinkedIn */}
              <a
                href="#linkedin"
                aria-label="GROVE on LinkedIn"
                className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 hover:text-white flex items-center justify-center text-neutral-400 transition-colors"
              >
                <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Shop */}
          <div className="col-span-1">
            <h4 className="text-white text-[11px] sm:text-xs font-extrabold tracking-[0.14em] uppercase mb-3 sm:mb-4">
              Shop
            </h4>
            <ul className="space-y-2 sm:space-y-2.5 text-xs font-medium text-neutral-400">
              <li>
                <Link to="/agriculture" className="hover:text-white transition-colors">
                  Agriculture
                </Link>
              </li>
              <li>
                <Link to="/electronics" className="hover:text-white transition-colors">
                  Electronics
                </Link>
              </li>
              <li>
                <Link to="/automotive" className="hover:text-white transition-colors">
                  Automotive
                </Link>
              </li>
              <li>
                <Link to="/groceries" className="hover:text-white transition-colors">
                  Groceries
                </Link>
              </li>
              <li>
                <a href="#best-sellers" className="hover:text-white transition-colors">
                  Best Sellers
                </a>
              </li>
            </ul>
          </div>

          {/* Customer Support */}
          <div className="col-span-1">
            <h4 className="text-white text-[11px] sm:text-xs font-extrabold tracking-[0.14em] uppercase mb-3 sm:mb-4">
              Support
            </h4>
            <ul className="space-y-2 sm:space-y-2.5 text-xs font-medium text-neutral-400">
              <li>
                <a href="#contact" className="hover:text-white transition-colors">
                  Contact Us
                </a>
              </li>
              <li>
                <a href="#help" className="hover:text-white transition-colors">
                  Help Center
                </a>
              </li>
              <li>
                <a href="#tracking" className="hover:text-white transition-colors">
                  Order Tracking
                </a>
              </li>
              <li>
                <a href="#returns" className="hover:text-white transition-colors">
                  Returns &amp; Refunds
                </a>
              </li>
            </ul>
          </div>

          {/* Business */}
          <div className="col-span-1">
            <h4 className="text-white text-[11px] sm:text-xs font-extrabold tracking-[0.14em] uppercase mb-3 sm:mb-4">
              Business
            </h4>
            <ul className="space-y-2 sm:space-y-2.5 text-xs font-medium text-neutral-400">
              <li>
                <Link to="/become-a-dealer" className="hover:text-white transition-colors">
                  Become a Dealer
                </Link>
              </li>
              <li>
                <a href="#dealer-login" className="hover:text-white transition-colors">
                  Dealer Login
                </a>
              </li>
              <li>
                <a href="#b2b-procurement" className="hover:text-white transition-colors">
                  B2B Procurement
                </a>
              </li>
              <li>
                <a href="#fleet" className="hover:text-white transition-colors">
                  Fleet Accounts
                </a>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div className="col-span-1">
            <h4 className="text-white text-[11px] sm:text-xs font-extrabold tracking-[0.14em] uppercase mb-3 sm:mb-4">
              Company
            </h4>
            <ul className="space-y-2 sm:space-y-2.5 text-xs font-medium text-neutral-400">
              <li>
                <a href="#about" className="hover:text-white transition-colors">
                  About GROVE
                </a>
              </li>
              <li>
                <a href="#privacy" className="hover:text-white transition-colors">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#terms" className="hover:text-white transition-colors">
                  Terms of Service
                </a>
              </li>
              <li>
                <a href="#careers" className="hover:text-white transition-colors">
                  Careers
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar: Copyright & Back to Top */}
        <div className="pt-6 sm:pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-neutral-500 font-medium text-center sm:text-left">
          <p>© {CURRENT_YEAR} GROVE Marketplace Inc. All rights reserved.</p>

          <div className="flex items-center gap-4 sm:gap-6 flex-wrap justify-center">
            <span className="inline-flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#8BCB45]" />
              <span className="text-neutral-400 text-[11px] sm:text-xs">Systems Operational</span>
            </span>

            <button
              onClick={scrollToTop}
              className="inline-flex items-center gap-1.5 text-neutral-400 hover:text-white transition-colors cursor-pointer text-[11px] sm:text-xs"
            >
              <span>Back to top</span>
              <ArrowUp className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
