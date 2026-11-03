import React from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Store,
  Package,
  Boxes,
  ShoppingCart,
  Users,
  MapPin,
  Layers,
  BarChart3,
  CreditCard,
  Headphones,
  FileText,
  Settings,
  ShieldCheck,
  LogOut,
  X,
  ExternalLink,
  ChevronRight
} from 'lucide-react';
import { getStoredAdmin, logoutAdmin } from '../../utils/adminAuth';

export const ADMIN_NAV_SECTIONS = [
  {
    title: 'Core Platform',
    items: [
      {
        name: 'Dashboard',
        path: '/admin/dashboard',
        icon: LayoutDashboard,
        badge: null
      },
      {
        name: 'Dealer Management',
        path: '/admin/dealers',
        icon: Store,
        badge: '24'
      },
      {
        name: 'User Management',
        path: '/admin/users',
        icon: Users,
        badge: null
      }
    ]
  },
  {
    title: 'Catalog & Inventory',
    items: [
      {
        name: 'Product Management',
        path: '/admin/products',
        icon: Package,
        badge: null
      },
      {
        name: 'Inventory Management',
        path: '/admin/inventory',
        icon: Boxes,
        badge: null
      },
      {
        name: 'Category Management',
        path: '/admin/categories',
        icon: Layers,
        badge: null
      },
      {
        name: 'Dealer Locations',
        path: '/admin/locations',
        icon: MapPin,
        badge: null
      }
    ]
  },
  {
    title: 'Operations & Finance',
    items: [
      {
        name: 'Order Management',
        path: '/admin/orders',
        icon: ShoppingCart,
        badge: null
      },
      {
        name: 'Sales & Analytics',
        path: '/admin/analytics',
        icon: BarChart3,
        badge: null
      },
      {
        name: 'Payments & Settlements',
        path: '/admin/payments',
        icon: CreditCard,
        badge: null
      },
      {
        name: 'Support & Complaints',
        path: '/admin/support',
        icon: Headphones,
        badge: '9',
        badgeColor: 'bg-amber-100 text-amber-900 border border-amber-300'
      }
    ]
  },
  {
    title: 'Administration',
    items: [
      {
        name: 'Reports & Audit Logs',
        path: '/admin/reports',
        icon: FileText,
        badge: null
      },
      {
        name: 'Platform Settings',
        path: '/admin/settings',
        icon: Settings,
        badge: null
      }
    ]
  }
];

export default function AdminSidebar({ mobileOpen = false, onCloseMobile = () => {} }) {
  const location = useLocation();
  const navigate = useNavigate();
  const admin = getStoredAdmin();

  const handleLogout = () => {
    logoutAdmin();
    onCloseMobile();
    navigate('/admin/login', { replace: true });
  };

  const sidebarContent = (
    <div className="flex flex-col h-full bg-white text-[#151D18] select-none">
      {/* Brand Header */}
      <div className="h-16 px-5 border-b border-[#C1C8C2]/60 flex items-center justify-between shrink-0 bg-white">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-[#012D1D] flex items-center justify-center text-white shadow-xs">
            <ShieldCheck className="w-5 h-5 text-[#AEEECB]" />
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-base tracking-tight text-[#012D1D] font-heading">
                GROVE
              </span>
              <span className="px-1.5 py-0.2 rounded bg-[#012D1D] text-[#AEEECB] text-[9px] font-mono font-bold uppercase tracking-wider">
                Admin
              </span>
            </div>
            <span className="text-[10px] text-[#717973] font-medium tracking-tight">
              Enterprise Operations
            </span>
          </div>
        </div>

        {/* Mobile close button */}
        <button
          type="button"
          onClick={onCloseMobile}
          className="p-1.5 rounded-lg text-neutral-500 hover:text-neutral-900 hover:bg-[#F3FCF3] md:hidden cursor-pointer"
          aria-label="Close navigation"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Navigation Groups (Scrollable) */}
      <nav className="flex-1 overflow-y-auto px-3.5 py-4 space-y-6 scrollbar-thin scrollbar-thumb-neutral-200">
        {ADMIN_NAV_SECTIONS.map((section, idx) => (
          <div key={idx} className="space-y-1">
            <h2 className="px-3 text-[10px] font-bold text-[#717973] uppercase tracking-wider font-mono">
              {section.title}
            </h2>
            <div className="space-y-0.5 pt-1">
              {section.items.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;

                return (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    onClick={onCloseMobile}
                    className={`group flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all duration-150 ${
                      isActive
                        ? 'bg-[#012D1D] text-white shadow-xs'
                        : 'text-[#3F4943] hover:text-[#012D1D] hover:bg-[#F3FCF3]'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 truncate">
                      <Icon
                        className={`w-4 h-4 shrink-0 transition-colors ${
                          isActive
                            ? 'text-[#AEEECB]'
                            : 'text-[#717973] group-hover:text-[#012D1D]'
                        }`}
                      />
                      <span className="truncate">{item.name}</span>
                    </div>

                    {item.badge && (
                      <span
                        className={`ml-2 px-1.5 py-0.5 rounded-full text-[10px] font-mono font-bold leading-none shrink-0 ${
                          item.badgeColor || (isActive ? 'bg-[#AEEECB] text-[#012D1D]' : 'bg-[#E3EBE4] text-[#012D1D]')
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}
                  </NavLink>
                );
              })}
            </div>
          </div>
        ))}

        {/* Portal Switcher Shortcuts */}
        <div className="pt-2 border-t border-[#C1C8C2]/40 space-y-1">
          <span className="px-3 text-[10px] font-bold text-[#717973] uppercase tracking-wider font-mono">
            Platform Links
          </span>
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between px-3 py-1.5 rounded-xl text-xs font-medium text-[#717973] hover:text-[#012D1D] hover:bg-[#F3FCF3] transition-colors"
          >
            <span className="truncate">Customer Marketplace</span>
            <ExternalLink className="w-3.5 h-3.5 opacity-60" />
          </a>
          <a
            href="/dealer/dashboard"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between px-3 py-1.5 rounded-xl text-xs font-medium text-[#717973] hover:text-[#012D1D] hover:bg-[#F3FCF3] transition-colors"
          >
            <span className="truncate">Dealer Portal</span>
            <ExternalLink className="w-3.5 h-3.5 opacity-60" />
          </a>
        </div>
      </nav>

      {/* Admin Profile Footer */}
      <div className="p-3 border-t border-[#C1C8C2]/60 bg-[#F8FAF8] shrink-0">
        <div className="flex items-center justify-between gap-2 p-2 rounded-xl bg-white border border-[#C1C8C2]/50 shadow-2xs">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-lg bg-[#012D1D] text-[#AEEECB] font-mono font-bold text-xs flex items-center justify-center shrink-0">
              {admin?.avatar || 'GA'}
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-xs font-bold text-[#012D1D] truncate leading-tight">
                {admin?.name || 'GROVE Admin'}
              </span>
              <span className="text-[10px] text-[#717973] font-mono truncate">
                {admin?.role || 'Super Admin'}
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={handleLogout}
            title="Sign out of Admin Suite"
            className="p-1.5 rounded-lg text-[#717973] hover:text-red-700 hover:bg-red-50 transition-colors shrink-0 cursor-pointer"
            aria-label="Logout"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Fixed Sidebar */}
      <aside className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0 z-40 border-r border-[#C1C8C2]/60 shadow-2xs">
        {sidebarContent}
      </aside>

      {/* Mobile Drawer (Backdrop + Slide-over) */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-[#012D1D]/50 backdrop-blur-xs transition-opacity"
            onClick={onCloseMobile}
            aria-hidden="true"
          />

          {/* Drawer container */}
          <div className="relative flex-1 flex flex-col max-w-xs w-full bg-white z-10 shadow-2xl">
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
}

