import React, { useEffect } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import GroceriesComingSoon from '../components/groceries/GroceriesComingSoon';

export default function GroceriesPage() {
  useEffect(() => {
    document.title = 'Groceries - Coming Soon | GROVE Marketplace';
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-[#F8FAF5] text-neutral-900 flex flex-col justify-between font-sans selection:bg-[#1B4332] selection:text-white">
      {/* 1. Shared GROVE Navbar with dark text styling */}
      <div className="border-b border-neutral-200/70 bg-white/80 backdrop-blur-xs sticky top-0 z-50">
        <Navbar darkText={true} />
      </div>

      {/* 2. Main Groceries Coming Soon Content */}
      <main className="flex-1 flex flex-col">
        <GroceriesComingSoon />
      </main>

      {/* 3. Shared Footer */}
      <Footer />
    </div>
  );
}

