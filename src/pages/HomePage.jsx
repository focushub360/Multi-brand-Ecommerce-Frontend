import React, { useEffect, useState } from 'react';
import Hero from '../components/Hero';
import BestSellers from '../components/BestSellers';
import CategoryCollectionSection from '../components/CategoryCollectionSection';
import PromoBanner from '../components/PromoBanner';
import TrustSection from '../components/TrustSection';
import BecomeDealerSection from '../components/BecomeDealerSection';
import NewsletterSection from '../components/NewsletterSection';
import Footer from '../components/Footer';
import { productsApi } from '../services/apiClient.js';

export default function HomePage() {
  const [agricultureEssentials, setAgricultureEssentials] = useState([]);
  const [electronicsEssentials, setElectronicsEssentials] = useState([]);
  const [automotiveEssentials, setAutomotiveEssentials] = useState([]);

  useEffect(() => {
    document.title = 'GROVE - Online Multi-Category Marketplace';

    productsApi.getAll({ limit: 60 })
      .then((res) => {
        const prods = res?.products || res?.data?.products || res?.data || (Array.isArray(res) ? res : []);
        if (prods.length > 0) {
          const normalize = (p) => ({
            id: p.sku?.toLowerCase() || p.slug || p.id || p._id,
            name: p.name,
            category: p.categoryName || p.category,
            price: `₹${Number(p.price).toLocaleString('en-IN')}`,
            originalPrice: `₹${Number(p.mrp || p.price).toLocaleString('en-IN')}`,
            discount: `-${p.discount || 10}%`,
            rating: p.rating || 4.5,
            reviews: p.reviewCount || 35,
            image: p.image || '/images/prod-tractor.png',
            dealerId: p.dealerCode || 'DEALER_001'
          });

          const agri = prods
            .filter((p) => (p.categoryName || p.category || '').toLowerCase().includes('agri'))
            .slice(0, 5)
            .map(normalize);

          const elec = prods
            .filter((p) => (p.categoryName || p.category || '').toLowerCase().includes('elec'))
            .slice(0, 5)
            .map(normalize);

          const auto = prods
            .filter((p) => (p.categoryName || p.category || '').toLowerCase().includes('auto'))
            .slice(0, 5)
            .map(normalize);

          setAgricultureEssentials(agri);
          setElectronicsEssentials(elec);
          setAutomotiveEssentials(auto);
        }
      })
      .catch((err) => {
        console.warn('Failed to fetch homepage live products:', err.message);
      });
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

