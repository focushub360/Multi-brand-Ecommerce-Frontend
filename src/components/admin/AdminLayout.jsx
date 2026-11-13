import React, { useState } from 'react';
import AdminSidebar from './AdminSidebar';
import AdminHeader from './AdminHeader';

export default function AdminLayout({ children }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#F3FCF3] text-[#151D18] flex flex-col font-sans selection:bg-[#012D1D] selection:text-white antialiased">
      {/* Fixed Sidebar */}
      <AdminSidebar
        mobileOpen={mobileOpen}
        onCloseMobile={() => setMobileOpen(false)}
      />

      {/* Fixed Header */}
      <AdminHeader
        onToggleMobile={() => setMobileOpen((prev) => !prev)}
      />

      {/* Main Content Area */}
      <main className="flex-1 md:pl-64 pt-16 flex flex-col transition-all duration-200">
        <div className="flex-1 p-4 sm:p-6 lg:p-8 max-w-[1600px] w-full mx-auto space-y-6">
          {children}
        </div>

        {/* Global Admin Footer */}
        <footer className="md:pl-0 border-t border-[#C1C8C2]/40 bg-white/70 py-4 px-6 text-center text-xs text-[#717973] font-mono shrink-0">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-2 max-w-[1600px] mx-auto">
            <span>GROVE Admin Enterprise Suite • System Version 2.4.0</span>
            <div className="flex items-center gap-4">
              <span className="inline-flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                All Services Operational
              </span>
              <span>•</span>
              <span>Encrypted Admin Session</span>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
}

