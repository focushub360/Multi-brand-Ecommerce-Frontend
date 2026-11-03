import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  ArrowRight, 
  HelpCircle, 
  Menu, 
  X, 
  Sprout, 
  Smartphone, 
  Cog, 
  Store, 
  User,
  LogOut,
  ChevronDown,
  UserCheck,
  ShoppingBag,
  ShoppingCart,
  Heart,
  Package,
  MapPin,
  ShoppingBasket
} from 'lucide-react';
import { getStoredCustomer, clearStoredCustomer } from '../utils/auth';
import { useWishlist } from '../hooks/useWishlist';
import { useCart } from '../hooks/useCart';

export default function Navbar({ darkText = false }) {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [accountDropdownOpen, setAccountDropdownOpen] = useState(false);
  const [customer, setCustomer] = useState(getStoredCustomer);

  const { wishlistCount } = useWishlist();
  const { totalCartCount } = useCart();

  const dropdownRef = useRef(null);

  // Sync customer state with auth events and storage
  useEffect(() => {
    const handleAuthChange = () => {
      setCustomer(getStoredCustomer());
    };

    window.addEventListener('grove_auth_changed', handleAuthChange);
    window.addEventListener('storage', handleAuthChange);

    return () => {
      window.removeEventListener('grove_auth_changed', handleAuthChange);
      window.removeEventListener('storage', handleAuthChange);
    };
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setAccountDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close mobile menu on Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') setMobileMenuOpen(false);
    };
    if (mobileMenuOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [mobileMenuOpen]);

  const handleCustomerLogout = () => {
    clearStoredCustomer();
    setAccountDropdownOpen(false);
    setMobileMenuOpen(false);
    navigate('/', { replace: true });
  };

  const customerInitials = customer?.name
    ? customer.name
        .split(' ')
        .map((w) => w[0])
        .join('')
        .slice(0, 2)
        .toUpperCase()
    : 'HP';

  return (
    <header className="w-full relative z-30">
      <nav 
        aria-label="Main Navigation" 
        className="w-full bg-transparent pt-4 sm:pt-6 pb-3 sm:pb-4 px-4 sm:px-6 md:px-10 lg:px-16 max-w-[1440px] mx-auto flex items-center justify-between"
      >
        {/* Brand Logo */}
        <div className="flex items-center">
          <Link 
            to="/" 
            className={`font-extrabold text-[24px] sm:text-[28px] md:text-[32px] tracking-[-0.03em] font-sans select-none hover:opacity-95 transition-opacity focus:outline-none ${
              darkText ? 'text-[#1B4332]' : 'text-white'
            }`}
            style={{ letterSpacing: '-0.02em' }}
          >
            GROVE
          </Link>
        </div>

        {/* Desktop Navigation Controls (>= md / 768px) */}
        <div className="hidden md:flex items-center gap-4 lg:gap-6">
          {/* Wishlist Link */}
          <Link
            to="/wishlist"
            className={`relative p-2 rounded-full transition-colors flex items-center justify-center ${
              darkText
                ? 'text-neutral-700 hover:text-[#1B4332] hover:bg-[#EBF4EE]'
                : 'text-white/90 hover:text-white hover:bg-white/10'
            }`}
            title="Wishlist"
            aria-label="Wishlist"
          >
            <Heart className="w-5 h-5" />
            {wishlistCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] bg-emerald-600 text-white text-[10px] font-extrabold rounded-full flex items-center justify-center px-1 border-2 border-white shadow-xs">
                {wishlistCount}
              </span>
            )}
          </Link>

          {/* Cart Link */}
          <Link
            to="/cart"
            className={`relative p-2 rounded-full transition-colors flex items-center justify-center ${
              darkText
                ? 'text-neutral-700 hover:text-[#1B4332] hover:bg-[#EBF4EE]'
                : 'text-white/90 hover:text-white hover:bg-white/10'
            }`}
            title="Shopping Cart"
            aria-label="Shopping Cart"
          >
            <ShoppingCart className="w-5 h-5" />
            {totalCartCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] bg-[#1B4332] text-white text-[10px] font-extrabold rounded-full flex items-center justify-center px-1 border-2 border-white shadow-xs">
                {totalCartCount}
              </span>
            )}
          </Link>

          {customer ? (
            /* Authenticated Customer Dropdown */
            <div className="relative" ref={dropdownRef}>
              <button
                type="button"
                onClick={() => setAccountDropdownOpen((prev) => !prev)}
                className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer border ${
                  darkText
                    ? 'bg-[#EBF4EE] text-[#1B4332] border-[#1B4332]/20 hover:bg-[#dbeee1]'
                    : 'bg-white/15 text-white border-white/20 hover:bg-white/25 backdrop-blur-xs'
                }`}
              >
                <div className="w-6 h-6 rounded-full bg-[#1B4332] text-white flex items-center justify-center text-[10.5px] font-extrabold">
                  {customerInitials}
                </div>
                <span className="truncate max-w-[120px]">{customer.name}</span>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${accountDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {accountDropdownOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-[18px] shadow-2xl border border-neutral-200/90 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150 text-neutral-900">
                  {/* Account Header */}
                  <div className="px-4 py-2.5 border-b border-neutral-100">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-extrabold text-sm text-[#081C15] truncate">{customer.name}</span>
                      <span className="bg-[#E9F3ED] text-[#1B4332] text-[10px] font-extrabold px-1.5 py-0.5 rounded-md">Customer</span>
                    </div>
                    <p className="text-[11px] text-neutral-500 truncate">{customer.email}</p>
                  </div>

                  {/* Customer Orders & Account Links */}
                  <div className="py-1 border-b border-neutral-100">
                    <Link
                      to="/account/orders"
                      onClick={() => setAccountDropdownOpen(false)}
                      className="flex items-center justify-between px-4 py-2 text-xs text-neutral-800 hover:bg-[#F8FAF8] hover:text-[#1B4332] transition-colors font-semibold"
                    >
                      <div className="flex items-center gap-2">
                        <Package className="w-4 h-4 text-[#1B4332]" />
                        <span>My Orders</span>
                      </div>
                      <ChevronDown className="w-3.5 h-3.5 -rotate-90 text-neutral-400" />
                    </Link>

                    <Link
                      to="/account/addresses"
                      onClick={() => setAccountDropdownOpen(false)}
                      className="flex items-center justify-between px-4 py-2 text-xs text-neutral-800 hover:bg-[#F8FAF8] hover:text-[#1B4332] transition-colors font-semibold"
                    >
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-[#1B4332]" />
                        <span>Saved Addresses</span>
                      </div>
                      <ChevronDown className="w-3.5 h-3.5 -rotate-90 text-neutral-400" />
                    </Link>

                    <Link
                      to="/wishlist"
                      onClick={() => setAccountDropdownOpen(false)}
                      className="flex items-center justify-between px-4 py-2 text-xs text-neutral-800 hover:bg-[#F8FAF8] hover:text-[#1B4332] transition-colors font-semibold"
                    >
                      <div className="flex items-center gap-2">
                        <Heart className="w-4 h-4 text-emerald-600" />
                        <span>My Wishlist</span>
                      </div>
                      {wishlistCount > 0 && (
                        <span className="text-[11px] font-bold text-[#1B4332] bg-[#E9F3ED] px-1.5 py-0.2 rounded-full">
                          {wishlistCount}
                        </span>
                      )}
                    </Link>

                    <Link
                      to="/cart"
                      onClick={() => setAccountDropdownOpen(false)}
                      className="flex items-center justify-between px-4 py-2 text-xs text-neutral-800 hover:bg-[#F8FAF8] hover:text-[#1B4332] transition-colors font-semibold"
                    >
                      <div className="flex items-center gap-2">
                        <ShoppingCart className="w-4 h-4 text-[#1B4332]" />
                        <span>Shopping Cart</span>
                      </div>
                      {totalCartCount > 0 && (
                        <span className="text-[11px] font-bold text-white bg-[#1B4332] px-1.5 py-0.2 rounded-full">
                          {totalCartCount}
                        </span>
                      )}
                    </Link>
                  </div>

                  {/* Marketplace Categories */}
                  <div className="py-1">
                    <Link
                      to="/agriculture"
                      onClick={() => setAccountDropdownOpen(false)}
                      className="flex items-center gap-2 px-4 py-2 text-xs text-neutral-700 hover:bg-[#F8FAF8] hover:text-[#1B4332] transition-colors font-medium"
                    >
                      <Sprout className="w-3.5 h-3.5 text-[#52B788]" />
                      <span>Agriculture Marketplace</span>
                    </Link>
                    <Link
                      to="/electronics"
                      onClick={() => setAccountDropdownOpen(false)}
                      className="flex items-center gap-2 px-4 py-2 text-xs text-neutral-700 hover:bg-[#F8FAF8] hover:text-[#1B4332] transition-colors font-medium"
                    >
                      <Smartphone className="w-3.5 h-3.5 text-neutral-500" />
                      <span>Electronics &amp; Gadgets</span>
                    </Link>
                    <Link
                      to="/automotive"
                      onClick={() => setAccountDropdownOpen(false)}
                      className="flex items-center gap-2 px-4 py-2 text-xs text-neutral-700 hover:bg-[#F8FAF8] hover:text-[#1B4332] transition-colors font-medium"
                    >
                      <Cog className="w-3.5 h-3.5 text-neutral-500" />
                      <span>Automotive &amp; Spares</span>
                    </Link>
                    <Link
                      to="/groceries"
                      onClick={() => setAccountDropdownOpen(false)}
                      className="flex items-center gap-2 px-4 py-2 text-xs text-neutral-700 hover:bg-[#F8FAF8] hover:text-[#1B4332] transition-colors font-medium"
                    >
                      <ShoppingBasket className="w-3.5 h-3.5 text-[#B45309]" />
                      <span>Groceries &amp; Essentials</span>
                    </Link>
                  </div>

                  {/* Sign Out Action */}
                  <div className="pt-1 border-t border-neutral-100">
                    <button
                      type="button"
                      onClick={handleCustomerLogout}
                      className="w-full flex items-center gap-2 px-4 py-2 text-xs font-bold text-red-600 hover:bg-red-50 transition-colors text-left cursor-pointer"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <Link
              to="/login"
              className={`text-sm font-semibold tracking-tight transition-colors duration-200 ${
                darkText ? 'text-neutral-700 hover:text-[#1B4332]' : 'text-white/95 hover:text-white'
              }`}
            >
              Sign In
            </Link>
          )}

          <Link
            to="/become-a-dealer"
            className={`inline-flex items-center gap-1.5 text-sm font-semibold px-4 md:px-5 py-2 rounded-full transition-all duration-200 shadow-sm hover:shadow active:scale-[0.98] ${
              darkText 
                ? 'bg-[#1B4332] hover:bg-[#081C15] text-white' 
                : 'bg-[#F7F4ED] hover:bg-white text-[#0A3325]'
            }`}
          >
            <span>Become a Dealer</span>
            <ArrowRight className="w-3.5 h-3.5 stroke-[2.2] ml-0.5" />
          </Link>

          <a
            href="#help"
            className={`inline-flex items-center gap-1.5 text-sm font-semibold tracking-tight transition-colors duration-200 ${
              darkText ? 'text-neutral-700 hover:text-[#1B4332]' : 'text-white/95 hover:text-white'
            }`}
          >
            <HelpCircle className="w-4 h-4 stroke-[2]" />
            <span>Help</span>
          </a>
        </div>

        {/* Mobile Navigation Controls (< md / 768px) */}
        <div className="flex md:hidden items-center gap-1.5 sm:gap-2">
          {/* Wishlist Link Mobile */}
          <Link
            to="/wishlist"
            className={`relative p-1.5 rounded-full transition-colors flex items-center justify-center ${
              darkText
                ? 'text-neutral-700 hover:text-[#1B4332]'
                : 'text-white/90 hover:text-white'
            }`}
            aria-label="Wishlist"
          >
            <Heart className="w-4 h-4" />
            {wishlistCount > 0 && (
              <span className="absolute -top-1 -right-1 min-w-[15px] h-[15px] bg-emerald-600 text-white text-[9px] font-extrabold rounded-full flex items-center justify-center px-0.5 border border-white">
                {wishlistCount}
              </span>
            )}
          </Link>

          {/* Cart Link Mobile */}
          <Link
            to="/cart"
            className={`relative p-1.5 rounded-full transition-colors flex items-center justify-center ${
              darkText
                ? 'text-neutral-700 hover:text-[#1B4332]'
                : 'text-white/90 hover:text-white'
            }`}
            aria-label="Shopping Cart"
          >
            <ShoppingCart className="w-4 h-4" />
            {totalCartCount > 0 && (
              <span className="absolute -top-1 -right-1 min-w-[15px] h-[15px] bg-[#1B4332] text-white text-[9px] font-extrabold rounded-full flex items-center justify-center px-0.5 border border-white">
                {totalCartCount}
              </span>
            )}
          </Link>

          {customer ? (
            <button
              type="button"
              onClick={() => setMobileMenuOpen(true)}
              className={`w-7 h-7 rounded-full bg-[#1B4332] text-white flex items-center justify-center text-xs font-bold shadow-2xs`}
            >
              {customerInitials}
            </button>
          ) : (
            <Link
              to="/login"
              className={`text-xs font-bold px-2 py-1 rounded-full transition-colors ${
                darkText 
                  ? 'text-[#1B4332] hover:bg-[#1B4332]/10' 
                  : 'text-white/95 hover:bg-white/10'
              }`}
            >
              Sign In
            </Link>
          )}

          <Link
            to="/become-a-dealer"
            className={`inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-1.5 rounded-full shadow-2xs ${
              darkText
                ? 'bg-[#1B4332] text-white'
                : 'bg-[#F7F4ED] text-[#0A3325]'
            }`}
          >
            <Store className="w-3 h-3" />
            <span className="hidden min-[360px]:inline">Dealer</span>
          </Link>

          <button
            type="button"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
            aria-expanded={mobileMenuOpen}
            className={`p-1.5 rounded-[10px] transition-colors cursor-pointer ${
              darkText
                ? 'text-[#1B4332] hover:bg-neutral-200/60'
                : 'text-white hover:bg-white/15'
            }`}
          >
            {mobileMenuOpen ? (
              <X className="w-5 h-5 stroke-[2.2]" />
            ) : (
              <Menu className="w-5 h-5 stroke-[2.2]" />
            )}
          </button>
        </div>
      </nav>

      {/* Accessible Mobile Dropdown Menu Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-x-0 top-[56px] sm:top-[68px] z-50 px-4 pt-2 pb-6 animate-in slide-in-from-top-3 duration-200">
          <div 
            className={`rounded-[20px] p-5 shadow-2xl border ${
              darkText
                ? 'bg-white text-neutral-900 border-neutral-200'
                : 'bg-[#082218] text-white border-white/15 shadow-black/40'
            }`}
          >
            {/* Authenticated Customer Info Banner in Mobile Menu */}
            {customer && (
              <div className="mb-4 pb-3 border-b border-neutral-200/40">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="font-extrabold text-xs">{customer.name}</span>
                      <span className="text-[10px] font-bold bg-[#E9F3ED] text-[#1B4332] px-1.5 py-0.2 rounded">Customer</span>
                    </div>
                    <p className="text-[10.5px] opacity-70 mt-0.5">{customer.email}</p>
                  </div>
                  <button
                    type="button"
                    onClick={handleCustomerLogout}
                    className="inline-flex items-center gap-1 text-xs font-bold text-red-500 hover:text-red-700 p-1.5"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Logout</span>
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-1">
                  <Link
                    to="/account/orders"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-2 p-2 rounded-lg bg-black/5 dark:bg-white/10 text-xs font-semibold"
                  >
                    <Package className="w-3.5 h-3.5 text-[#1B4332]" />
                    <span>My Orders</span>
                  </Link>

                  <Link
                    to="/account/addresses"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-2 p-2 rounded-lg bg-black/5 dark:bg-white/10 text-xs font-semibold"
                  >
                    <MapPin className="w-3.5 h-3.5 text-[#1B4332]" />
                    <span>Addresses</span>
                  </Link>

                  <Link
                    to="/wishlist"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center justify-between p-2 rounded-lg bg-black/5 dark:bg-white/10 text-xs font-semibold"
                  >
                    <div className="flex items-center gap-1.5">
                      <Heart className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Wishlist</span>
                    </div>
                    {wishlistCount > 0 && (
                      <span className="text-[10px] font-bold bg-emerald-600 text-white px-1.5 rounded-full">
                        {wishlistCount}
                      </span>
                    )}
                  </Link>

                  <Link
                    to="/cart"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center justify-between p-2 rounded-lg bg-black/5 dark:bg-white/10 text-xs font-semibold"
                  >
                    <div className="flex items-center gap-1.5">
                      <ShoppingCart className="w-3.5 h-3.5 text-[#1B4332]" />
                      <span>Cart</span>
                    </div>
                    {totalCartCount > 0 && (
                      <span className="text-[10px] font-bold bg-[#1B4332] text-white px-1.5 rounded-full">
                        {totalCartCount}
                      </span>
                    )}
                  </Link>
                </div>
              </div>
            )}

            <div className="flex flex-col gap-2.5">
              <Link
                to="/agriculture"
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center justify-between p-3 rounded-[12px] text-xs sm:text-sm font-bold transition-colors ${
                  darkText
                    ? 'hover:bg-neutral-100 text-[#1B4332]'
                    : 'hover:bg-white/10 text-white'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Sprout className="w-4 h-4 text-[#8BCB45]" />
                  <span>Agriculture Marketplace</span>
                </div>
                <ArrowRight className="w-3.5 h-3.5 opacity-60" />
              </Link>

              <Link
                to="/electronics"
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center justify-between p-3 rounded-[12px] text-xs sm:text-sm font-bold transition-colors ${
                  darkText
                    ? 'hover:bg-neutral-100 text-neutral-900'
                    : 'hover:bg-white/10 text-white'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Smartphone className="w-4 h-4 text-neutral-400" />
                  <span>Electronics &amp; Gadgets</span>
                </div>
                <ArrowRight className="w-3.5 h-3.5 opacity-60" />
              </Link>

              <Link
                to="/automotive"
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center justify-between p-3 rounded-[12px] text-xs sm:text-sm font-bold transition-colors ${
                  darkText
                    ? 'hover:bg-neutral-100 text-[#1B4332]'
                    : 'hover:bg-white/10 text-white'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Cog className="w-4 h-4 text-neutral-400" />
                  <span>Automotive &amp; Spares</span>
                </div>
                <ArrowRight className="w-3.5 h-3.5 opacity-60" />
              </Link>

              <Link
                to="/groceries"
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center justify-between p-3 rounded-[12px] text-xs sm:text-sm font-bold transition-colors ${
                  darkText
                    ? 'hover:bg-neutral-100 text-[#B45309]'
                    : 'hover:bg-white/10 text-white'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <ShoppingBasket className="w-4 h-4 text-amber-500" />
                  <span>Groceries &amp; Essentials</span>
                </div>
                <ArrowRight className="w-3.5 h-3.5 opacity-60" />
              </Link>

              <Link
                to="/become-a-dealer"
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center justify-between p-3 rounded-[12px] text-xs sm:text-sm font-bold transition-colors ${
                  darkText
                    ? 'hover:bg-neutral-100 text-[#1B4332]'
                    : 'hover:bg-white/10 text-white'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Store className="w-4 h-4 text-amber-500" />
                  <span>Become an Authorized Dealer</span>
                </div>
                <ArrowRight className="w-3.5 h-3.5 opacity-60" />
              </Link>

              {!customer && (
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center justify-between p-3 rounded-[12px] text-xs sm:text-sm font-bold transition-colors ${
                    darkText
                      ? 'hover:bg-neutral-100 text-neutral-800'
                      : 'hover:bg-white/10 text-white'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <User className="w-4 h-4 text-neutral-400" />
                    <span>Customer Sign In</span>
                  </div>
                  <ArrowRight className="w-3.5 h-3.5 opacity-60" />
                </Link>
              )}

              <a
                href="#help"
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center justify-between p-3 rounded-[12px] text-xs sm:text-sm font-bold transition-colors ${
                  darkText
                    ? 'hover:bg-neutral-100 text-neutral-700'
                    : 'hover:bg-white/10 text-white/90'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <HelpCircle className="w-4 h-4 text-neutral-400" />
                  <span>Help &amp; Customer Support</span>
                </div>
                <ArrowRight className="w-3.5 h-3.5 opacity-60" />
              </a>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
