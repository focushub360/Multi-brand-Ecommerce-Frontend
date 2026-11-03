import React, { useEffect, useMemo } from 'react';
import Hero from '../components/Hero';
import BestSellers from '../components/BestSellers';
import CategoryCollectionSection from '../components/CategoryCollectionSection';
import PromoBanner from '../components/PromoBanner';
import TrustSection from '../components/TrustSection';
import BecomeDealerSection from '../components/BecomeDealerSection';
import NewsletterSection from '../components/NewsletterSection';
import Footer from '../components/Footer';

import agricultureData from '../data/agricultureProducts.json';
import {
  ELECTRONICS_PRODUCTS,
  AUTOMOTIVE_PRODUCTS,
} from '../data/products';

export default function HomePage() {
  useEffect(() => {
    document.title = 'GROVE - Online Multi-Category Marketplace';
  }, []);

  // Use the existing Agriculture JSON as the single source of truth for homepage essentials
  const agricultureEssentials = useMemo(() => {
    const essentialIds = ['ag-02', 'ag-17', 'ag-11', 'ag-03', 'ag-14'];
    const selected = essentialIds
      .map((id) => agricultureData.find((p) => p.id === id))
      .filter(Boolean);
    return selected.length === 5 ? selected : agricultureData.slice(0, 5);
  }, []);

  const electronicsEssentials = useMemo(() => {
    return ELECTRONICS_PRODUCTS.slice(0, 5);
  }, []);

  const automotiveEssentials = useMemo(() => {
    return AUTOMOTIVE_PRODUCTS.slice(0, 5);
  }, []);

  return (
    <main className="min-h-screen bg-[#F7F3EA] text-neutral-900 overflow-x-hidden font-sans">
      {/* 1 & 2: Navbar, Hero, SearchBar, and 3 Overlapping Category Cards */}
      <Hero />

      {/* 3: Best Sellers Section (with 6 Product Cards and Filter Controls) */}
      <BestSellers />

      {/* 4: Agriculture Essentials (5 Product Cards rendered from real agricultureProducts.json) */}
      <CategoryCollectionSection
        id="agriculture"
        tag="AGRICULTURE"
        title="Agriculture Essentials"
        subtitle="Reliable equipment for every farming need."
        viewAllText="View All Agriculture"
        viewAllHref="/agriculture"
        accentColor="#0A3325"
        tagColor="#0A3325"
        tagBg="#E4EBDC"
        products={agricultureEssentials}
      />

      {/* 5: Electronics & Gadgets (5 Product Cards) */}
      <CategoryCollectionSection
        id="electronics"
        tag="ELECTRONICS"
        title="Electronics & Gadgets"
        subtitle="Technology for work and everyday life."
        viewAllText="View All Electronics"
        viewAllHref="/electronics"
        accentColor="#171717"
        tagColor="#171717"
        tagBg="#EDE8DE"
        products={electronicsEssentials}
      />

      {/* 6: Automotive & Spare Parts (5 Product Cards) */}
      <CategoryCollectionSection
        id="automotive"
        tag="AUTOMOTIVE"
        title="Automotive & Spare Parts"
        subtitle="Quality parts for every journey."
        viewAllText="View All Automotive"
        viewAllHref="/automotive"
        accentColor="#FF383F"
        tagColor="#FF383F"
        tagBg="#FDE2E1"
        products={automotiveEssentials}
      />

      {/* 7: Promotional Offer Banner */}
      <PromoBanner />

      {/* 8: Why Shop on GROVE? (Trust Section) */}
      <TrustSection />

      {/* 9: Become a Dealer Section */}
      <BecomeDealerSection />

      {/* 10: Newsletter Subscription Section */}
      <NewsletterSection />

      {/* 11: Complete Footer */}
      <Footer />
    </main>
  );
}

