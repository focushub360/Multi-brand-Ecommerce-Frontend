import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Search, 
  Bell, 
  Menu, 
  ChevronDown, 
  Store, 
  LogOut, 
  ExternalLink,
  ShieldCheck
} from 'lucide-react';
import { getStoredDealer, clearStoredDealer, getActiveDealerId } from '../../utils/auth';
import { getDealerById, getDealerNotifications } from '../../services/dealerService';

export default function DealerHeader({ onToggleMobile }) {
  const navigate = useNavigate();
  const user = getStoredDealer();
  const activeDealerId = getActiveDealerId();
  const dealerProfile = getDealerById(activeDealerId);

  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  const notifications = getDealerNotifications(activeDealerId);

  const dealerName = user?.name || dealerProfile?.name || 'GROVE Dealer';
  const dealerEmail = user?.email || dealerProfile?.email || '';
  const initials = dealerName
    .split(' ')
    .map((w) => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  const handleLogout = () => {
    setProfileDropdownOpen(false);
    clearStoredDealer();
    navigate('/login', { replace: true });
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/dealer/products?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <header className="fixed top-0 left-0 md:left-64 right-0 h-16 bg-white/95 backdrop-blur-md border-b border-[#C1C8C2]/60 z-30 px-4 sm:px-6 md:px-8 flex items-center justify-between gap-4">
      {/* Left: Mobile Toggle & Global Search Bar */}
      <div className="flex items-center gap-3 flex-1 max-w-xl">
        {/* Mobile menu trigger */}
        <button
          type="button"
          onClick={onToggleMobile}
          className="p-2 -ml-1 text-neutral-600 hover:text-neutral-900 rounded-xl md:hidden"
          aria-label="Toggle navigation menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Global Search */}
        <form onSubmit={handleSearchSubmit} className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#717973] pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search products, orders, inventory..."
            className="w-full h-10 pl-9 pr-10 rounded-xl bg-[#EDF6ED] border border-[#C1C8C2]/40 text-[#151D18] placeholder:text-[#717973] text-xs sm:text-sm font-medium focus:outline-none focus:border-[#2C694E] focus:bg-white transition-all"
          />
          <span className="hidden min-[400px]:inline-block absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-mono bg-white px-1.5 py-0.5 rounded text-[#717973] border border-[#C1C8C2]/60 shadow-2xs pointer-events-none">
            /
          </span>
        </form>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-2 sm:gap-4 shrink-0">
        {/* Quick Link to Customer Marketplace */}
        <Link
          to="/agriculture"
          target="_blank"
          rel="noopener noreferrer"
          className="hidden lg:inline-flex items-center gap-1.5 text-xs font-semibold text-[#2C694E] hover:text-[#012D1D] bg-[#AEEECB]/30 hover:bg-[#AEEECB]/50 px-3 py-1.5 rounded-lg transition-colors"
          title="Open GROVE Customer Marketplace in new tab"
        >
          <Store className="w-3.5 h-3.5" />
          <span>Marketplace</span>
          <ExternalLink className="w-3 h-3 text-[#2C694E]/70" />
        </Link>

        {/* Notification Bell with Dynamic Dealer Notifications */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setNotificationsOpen((prev) => !prev)}
            aria-label="Notifications"
            className="relative p-2 text-[#414844] hover:text-[#151D18] hover:bg-[#EDF6ED] rounded-xl transition-colors border border-[#C1C8C2]/40 cursor-pointer"
          >
            <Bell className="w-4 h-4 sm:w-5 sm:h-5" />
            {notifications.length > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#BA1A1A] text-white text-[10px] flex items-center justify-center font-bold ring-2 ring-white">
                {notifications.length}
              </span>
            )}
          </button>

          {/* Notifications Dropdown */}
          {notificationsOpen && (
            <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-xl border border-[#C1C8C2]/60 p-4 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
              <div className="flex items-center justify-between pb-2 border-b border-neutral-100">
                <span className="font-bold text-xs text-[#081C15]">Notifications</span>
                <span className="text-[10px] font-semibold text-[#2C694E] bg-[#EDF6ED] px-2 py-0.5 rounded-full">
                  {notifications.length} New
                </span>
              </div>
              <div className="divide-y divide-neutral-100 text-xs max-h-80 overflow-y-auto">
                {notifications.length === 0 ? (
                  <p className="py-4 text-center text-[#717973]">No notifications right now.</p>
                ) : (
                  notifications.map((n) => (
                    <div key={n.id} className="py-2.5">
                      <p className={`font-semibold ${n.type === 'warning' ? 'text-amber-700' : 'text-neutral-800'}`}>
                        {n.title}
                      </p>
                      <p className="text-neutral-500 text-[11px] mt-0.5">{n.desc}</p>
                      <span className="text-[10px] text-neutral-400 mt-1 block">{n.time}</span>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* Profile Dropdown */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setProfileDropdownOpen((prev) => !prev)}
            className="flex items-center gap-2 pl-2 border-l border-[#C1C8C2]/40 cursor-pointer group focus:outline-none"
            aria-expanded={profileDropdownOpen}
          >
            <div className="w-8 h-8 rounded-full bg-[#012D1D] flex items-center justify-center font-bold text-white text-[12px] shadow-2xs">
              {initials || 'DP'}
            </div>
            <div className="hidden sm:flex flex-col text-left">
              <span className="text-xs font-bold text-[#151D18] leading-tight group-hover:text-[#012D1D] transition-colors">
                {dealerName}
              </span>
              <span className="text-[11px] text-[#717973] leading-tight truncate max-w-[140px]">
                {dealerEmail}
              </span>
            </div>
            <ChevronDown className="w-4 h-4 text-[#717973] group-hover:text-[#151D18] transition-transform duration-200" />
          </button>

          {profileDropdownOpen && (
            <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-[#C1C8C2]/60 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
              <div className="px-4 py-2 border-b border-neutral-100">
                <span className="text-xs font-bold text-[#151D18] block">{dealerName}</span>
                <span className="text-[11px] text-[#717973] block truncate">{dealerEmail}</span>
                <div className="mt-1.5 flex items-center gap-1 text-[10px] font-bold text-[#2C694E] bg-[#EDF6ED] px-2 py-0.5 rounded-full w-fit">
                  <ShieldCheck className="w-3 h-3" />
                  <span>{dealerProfile?.tier || 'Verified Dealer'}</span>
                </div>
              </div>

              <div className="py-1">
                <Link
                  to="/dealer/store-settings"
                  onClick={() => setProfileDropdownOpen(false)}
                  className="flex items-center gap-2 px-4 py-2 text-xs text-neutral-700 hover:bg-[#EDF6ED] hover:text-[#012D1D] transition-colors"
                >
                  <Store className="w-3.5 h-3.5 text-[#717973]" />
                  <span>Store Profile &amp; Settings</span>
                </Link>
                <Link
                  to="/dealer/help-support"
                  onClick={() => setProfileDropdownOpen(false)}
                  className="flex items-center gap-2 px-4 py-2 text-xs text-neutral-700 hover:bg-[#EDF6ED] hover:text-[#012D1D] transition-colors"
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-[#717973]" />
                  <span>Dealer SLA &amp; Support</span>
                </Link>
              </div>

              <div className="pt-1 border-t border-neutral-100">
                <button
                  type="button"
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2 px-4 py-2 text-xs font-semibold text-red-600 hover:bg-red-50 transition-colors text-left cursor-pointer"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
