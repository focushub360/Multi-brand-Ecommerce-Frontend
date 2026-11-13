import React, { useState } from 'react';
import DealerSidebar from './DealerSidebar';
import DealerHeader from './DealerHeader';

export default function DealerLayout({ children }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#F3FCF3] font-sans text-[#151D18] antialiased flex flex-col">
      {/* Sidebar Navigation (Fixed left, full height) */}
      <DealerSidebar 
        mobileOpen={mobileOpen} 
        onCloseMobile={() => setMobileOpen(false)} 
      />

      {/* Main Content Area offset by sidebar on desktop (md:pl-64) */}
      <div className="md:pl-64 flex flex-col min-h-screen">
        {/* Fixed Top Header (h-16 = 64px) */}
        <DealerHeader onToggleMobile={() => setMobileOpen((prev) => !prev)} />

        {/* Header spacer: Prevents any content from being hidden behind the fixed header */}
        <div className="h-16 w-full shrink-0" aria-hidden="true" />

        {/* Main Page Content - Cleanly starts below the top navbar with generous breathing room */}
        <main className="w-full flex-1 px-4 sm:px-6 lg:px-8 py-6 lg:py-8 bg-[#F3FCF3]">
          {children}
        </main>
      </div>
    </div>
  );
}
