import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Search, 
  Bell, 
  Menu, 
  ChevronDown, 
  LogOut, 
  ExternalLink,
  ShieldCheck,
  Settings,
  Headphones,
  FileText,
  Activity,
  Store
} from 'lucide-react';
import { getStoredAdmin, logoutAdmin } from '../../utils/adminAuth';

export default function AdminHeader({ onToggleMobile }) {
  const navigate = useNavigate();
  const admin = getStoredAdmin();
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const notifRef = useRef(null);

  const adminName = admin?.name || 'GROVE Admin';
  const adminEmail = admin?.email || 'admin@grove.com';
  const adminRole = admin?.role || 'Super Admin';
  const adminDept = admin?.department || 'Platform Operations';
  const initials = admin?.avatar || 'GA';

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setProfileDropdownOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(event.target)) {
        setNotificationsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    setProfileDropdownOpen(false);
    logoutAdmin();
    navigate('/admin/login', { replace: true });
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/admin/orders?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const notifications = [
    { id: 1, title: 'Urgent Transit Claim (#TCK-8812)', desc: 'Solapur freight dock pickup delay reported by Kisan Agro Hub.', time: '10m ago', urgent: true },
    { id: 2, title: 'New Dealer KYC Submission', desc: 'Vidarbha Tractor Works submitted GSTIN & warehouse deed.', time: '45m ago', urgent: false },
    { id: 3, title: 'Bulk Order (#GRV-7701) Placed', desc: '₹3,50,000 RTGS escrow payment pending clearance.', time: '2h ago', urgent: false },
  ];

  return (
    <header className="fixed top-0 left-0 md:left-64 right-0 h-16 bg-white/95 backdrop-blur-md border-b border-[#C1C8C2]/60 z-30 px-4 sm:px-6 md:px-8 flex items-center justify-between gap-4">
      {/* Left: Mobile Toggle & Global Search Bar */}
      <div className="flex items-center gap-3 flex-1 max-w-xl">
        {/* Mobile menu trigger */}
        <button
          type="button"
          onClick={onToggleMobile}
          className="p-2 -ml-1 text-neutral-600 hover:text-neutral-900 rounded-xl md:hidden cursor-pointer"
          aria-label="Toggle navigation menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Global Admin Search Form */}
        <form onSubmit={handleSearchSubmit} className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#717973] pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search orders, dealers, SKUs, or buyers..."
            className="w-full h-10 pl-9 pr-10 rounded-xl bg-[#F3FCF3] border border-[#C1C8C2]/50 text-[#151D18] placeholder:text-[#717973] text-xs sm:text-sm font-medium focus:outline-none focus:border-[#2C694E] focus:bg-white transition-all shadow-2xs"
          />
          <span className="hidden min-[450px]:inline-block absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-mono bg-white px-1.5 py-0.5 rounded text-[#717973] border border-[#C1C8C2]/60 shadow-2xs pointer-events-none">
            Ctrl K
          </span>
        </form>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-2 sm:gap-3 shrink-0">
        {/* System Health Badge */}
        <div className="hidden xl:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#F3FCF3] border border-[#C1C8C2]/40 text-[11px] font-mono text-[#0E5138]">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="font-semibold">Core APIs: 99.98%</span>
        </div>

        {/* Quick Link to Customer Marketplace */}
        <Link
          to="/"
          target="_blank"
          rel="noopener noreferrer"
          className="hidden lg:inline-flex items-center gap-1.5 text-xs font-semibold text-[#717973] hover:text-[#012D1D] hover:bg-[#F3FCF3] px-2.5 py-1.5 rounded-xl border border-transparent hover:border-[#C1C8C2]/40 transition-colors"
          title="Open GROVE Marketplace in new tab"
        >
          <ExternalLink className="w-3.5 h-3.5" />
          <span>Marketplace</span>
        </Link>

        {/* Quick Link to Dealer Portal */}
        <Link
          to="/dealer/dashboard"
          target="_blank"
          rel="noopener noreferrer"
          className="hidden sm:inline-flex items-center gap-1.5 text-xs font-semibold text-[#0E5138] bg-[#AEEECB]/40 hover:bg-[#AEEECB]/70 px-2.5 py-1.5 rounded-xl transition-colors"
          title="Open GROVE Dealer Portal in new tab"
        >
          <Store className="w-3.5 h-3.5" />
          <span>Dealer Portal</span>
        </Link>

        {/* Notification Bell */}
        <div className="relative" ref={notifRef}>
          <button
            type="button"
            onClick={() => setNotificationsOpen((prev) => !prev)}
            aria-label="Platform Notifications"
            className="relative p-2 text-[#414844] hover:text-[#151D18] hover:bg-[#F3FCF3] rounded-xl transition-colors border border-[#C1C8C2]/40 cursor-pointer shadow-2xs"
          >
            <Bell className="w-4 h-4 sm:w-5 sm:h-5" />
            <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#BA1A1A] text-white text-[10px] flex items-center justify-center font-bold ring-2 ring-white">
              {notifications.length}
            </span>
          </button>

          {/* Notifications Dropdown */}
          {notificationsOpen && (
            <div className="absolute right-0 mt-2 w-80 sm:w-88 bg-white rounded-2xl shadow-xl border border-[#C1C8C2]/60 p-4 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
              <div className="flex items-center justify-between pb-2.5 border-b border-neutral-100">
                <div className="flex items-center gap-2">
                  <Activity className="w-4 h-4 text-[#012D1D]" />
                  <span className="font-bold text-xs text-[#012D1D]">System Alerts &amp; Events</span>
                </div>
                <span className="text-[10px] font-mono font-bold text-[#0E5138] bg-[#AEEECB] px-2 py-0.5 rounded-full">
                  {notifications.length} Unresolved
                </span>
              </div>
              <div className="divide-y divide-neutral-100 text-xs max-h-80 overflow-y-auto">
                {notifications.map((n) => (
                  <div key={n.id} className="py-2.5 hover:bg-[#F3FCF3]/60 rounded-lg px-1.5 transition-colors">
                    <div className="flex items-start justify-between gap-1">
                      <p className={`font-semibold text-xs leading-snug ${n.urgent ? 'text-red-700' : 'text-[#151D18]'}`}>
                        {n.title}
                      </p>
                      {n.urgent && (
                        <span className="shrink-0 px-1.5 py-0.5 bg-red-100 text-red-700 text-[9px] font-bold rounded">
                          Urgent
                        </span>
                      )}
                    </div>
                    <p className="text-[#717973] text-[11px] mt-1 leading-relaxed">{n.desc}</p>
                    <span className="text-[10px] font-mono text-neutral-400 mt-1 block">{n.time}</span>
                  </div>
                ))}
              </div>
              <div className="pt-2.5 border-t border-neutral-100 text-center">
                <Link
                  to="/admin/support"
                  onClick={() => setNotificationsOpen(false)}
                  className="text-xs font-bold text-[#2C694E] hover:underline"
                >
                  View All Platform Tickets →
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* Admin Profile Dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            type="button"
            onClick={() => setProfileDropdownOpen((prev) => !prev)}
            className="flex items-center gap-2 pl-2 border-l border-[#C1C8C2]/40 cursor-pointer group focus:outline-none"
            aria-expanded={profileDropdownOpen}
          >
            <div className="w-8 h-8 rounded-full bg-[#012D1D] text-white flex items-center justify-center font-bold text-xs shadow-2xs ring-2 ring-[#AEEECB]/60">
              {initials}
            </div>
            <div className="hidden sm:flex flex-col text-left">
              <span className="text-xs font-bold text-[#151D18] leading-tight group-hover:text-[#012D1D] transition-colors">
                {adminName}
              </span>
              <span className="text-[10px] text-[#717973] leading-tight truncate max-w-[130px]">
                {adminRole}
              </span>
            </div>
            <ChevronDown className="w-4 h-4 text-[#717973] group-hover:text-[#151D18] transition-transform duration-200" />
          </button>

          {profileDropdownOpen && (
            <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-[#C1C8C2]/60 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
              <div className="px-4 py-2.5 border-b border-neutral-100">
                <span className="text-xs font-bold text-[#151D18] block">{adminName}</span>
                <span className="text-[11px] text-[#717973] block truncate">{adminEmail}</span>
                <div className="mt-1.5 flex items-center gap-1 text-[10px] font-bold text-[#0E5138] bg-[#AEEECB]/60 px-2 py-0.5 rounded-full w-fit">
                  <ShieldCheck className="w-3 h-3" />
                  <span>{adminDept}</span>
                </div>
              </div>

              <div className="py-1">
                <Link
                  to="/admin/settings"
                  onClick={() => setProfileDropdownOpen(false)}
                  className="flex items-center gap-2 px-4 py-2 text-xs text-neutral-700 hover:bg-[#F3FCF3] hover:text-[#012D1D] transition-colors font-medium"
                >
                  <Settings className="w-3.5 h-3.5 text-[#717973]" />
                  <span>Platform Settings</span>
                </Link>
                <Link
                  to="/admin/reports"
                  onClick={() => setProfileDropdownOpen(false)}
                  className="flex items-center gap-2 px-4 py-2 text-xs text-neutral-700 hover:bg-[#F3FCF3] hover:text-[#012D1D] transition-colors font-medium"
                >
                  <FileText className="w-3.5 h-3.5 text-[#717973]" />
                  <span>Reports &amp; Audit Logs</span>
                </Link>
                <Link
                  to="/admin/support"
                  onClick={() => setProfileDropdownOpen(false)}
                  className="flex items-center gap-2 px-4 py-2 text-xs text-neutral-700 hover:bg-[#F3FCF3] hover:text-[#012D1D] transition-colors font-medium"
                >
                  <Headphones className="w-3.5 h-3.5 text-[#717973]" />
                  <span>Support &amp; Complaints</span>
                </Link>
              </div>

              <div className="pt-1 border-t border-neutral-100">
                <button
                  type="button"
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2 px-4 py-2 text-xs font-semibold text-red-600 hover:bg-red-50 transition-colors text-left cursor-pointer"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Admin Sign Out</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

