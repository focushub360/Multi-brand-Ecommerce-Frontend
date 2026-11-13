import React, { useState, useMemo, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { productsApi } from '../services/apiClient.js';
import AutomotiveHero from '../components/automotive/AutomotiveHero';
import AutomotiveCategoryFilters from '../components/automotive/AutomotiveCategoryFilters';
import AutomotiveFilterSidebar from '../components/automotive/AutomotiveFilterSidebar';
import { PRICE_RANGES } from '../constants/automotiveConstants';
import AutomotiveProductToolbar from '../components/automotive/AutomotiveProductToolbar';
import AutomotiveProductGrid from '../components/automotive/AutomotiveProductGrid';
import AutomotivePagination from '../components/automotive/AutomotivePagination';
import Footer from '../components/Footer';
import { useWishlist } from '../hooks/useWishlist';
import { useCart } from '../hooks/useCart';
import { ShoppingBag } from 'lucide-react';

const PAGE_SIZE = 9;

export default function AutomotivePage() {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [priceRange, setPriceRange] = useState('all');
  const [selectedBrand, setSelectedBrand] = useState('All');
  const [stockFilter, setStockFilter] = useState('all');
  const [minRating, setMinRating] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('featured');
  const [currentPage, setCurrentPage] = useState(1);
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);
  const [productsList, setProductsList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const { wishlist, toggleWishlist } = useWishlist();
  const { addToCart, totalCartCount, lastAddedItem } = useCart();

  const catalogRef = useRef(null);

  useEffect(() => {
    document.title = 'Automotive & Spare Parts Marketplace | GROVE AutoHub';
    window.scrollTo(0, 0);

    // Fetch live products from backend MongoDB
    setIsLoading(true);
    productsApi.getAll({ category: 'Automotive & Spare Parts', limit: 100 })
      .then((res) => {
        const serverProds = Array.isArray(res) ? res : (res?.products || res?.data || []);
        if (serverProds.length > 0) {
          const normalized = serverProds.map((p) => ({
            ...p,
            id: p.id || p._id,
            originalPrice: p.originalPrice || p.mrp || p.price,
            category: p.subcategory || p.categoryName || 'Automotive',
            inStock: (p.stock !== undefined ? p.stock > 0 : true) && p.inStock !== false,
            seller: p.seller || { name: p.dealerName || 'Apex Machinery & Equipment' },
            stockStatus: p.stockStatus || (p.stock > 10 ? 'In Stock' : p.stock > 0 ? 'Limited Stock' : 'Out of Stock'),
            images: p.images?.length > 0 ? p.images : [p.image]
          }));
          setProductsList(normalized);
        }
      })
      .catch((err) => {
        console.warn('Failed to load automotive products from backend API, using local seed:', err.message);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  // Compute category counts for badges
  const categoryCounts = useMemo(() => {
    const counts = { All: productsList.length };
    productsList.forEach((p) => {
      const cat = p.subcategory || p.category;
      counts[cat] = (counts[cat] || 0) + 1;
    });
    return counts;
  }, [productsList]);

  // Compute brand counts for badges
  const brandCounts = useMemo(() => {
    const counts = { All: productsList.length };
    productsList.forEach((p) => {
      if (p.brand) {
        counts[p.brand] = (counts[p.brand] || 0) + 1;
      }
    });
    return counts;
  }, [productsList]);

  // Filter and sort products
  const filteredAndSortedProducts = useMemo(() => {
    let result = [...productsList];

    // 1. Subcategory / Category Filter
    if (selectedCategory !== 'All') {
      result = result.filter(
        (p) => ((p.subcategory || p.category || '')).trim().toLowerCase() === selectedCategory.trim().toLowerCase()
      );
    }

    // 2. Brand Filter
    if (selectedBrand && selectedBrand !== 'All') {
      result = result.filter((p) => p.brand === selectedBrand);
    }

    // 3. Price Range Filter
    if (priceRange !== 'all') {
      const activeRange = PRICE_RANGES.find((r) => r.id === priceRange);
      if (activeRange) {
        result = result.filter(
          (p) => p.price >= activeRange.min && p.price < activeRange.max
        );
      }
    }

    // 4. Stock Filter
    if (stockFilter === 'in-stock') {
      result = result.filter((p) => p.stockStatus === 'In Stock');
    } else if (stockFilter === 'limited') {
      result = result.filter((p) => p.stockStatus === 'Limited Stock');
    }

    // 5. Rating Filter
    if (minRating > 0) {
      result = result.filter((p) => p.rating >= minRating);
    }

    // 6. Keyword Search
    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          (p.subcategory && p.subcategory.toLowerCase().includes(q)) ||
          p.category.toLowerCase().includes(q) ||
          (p.description && p.description.toLowerCase().includes(q)) ||
          (p.brand && p.brand.toLowerCase().includes(q))
      );
    }

    // 7. Sorting
    switch (sortBy) {
      case 'price-asc':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'rating-desc':
        result.sort((a, b) => b.rating - a.rating);
        break;
      case 'name-asc':
        result.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'featured':
      default:
        result.sort((a, b) => {
          if (a.featured && !b.featured) return -1;
          if (!a.featured && b.featured) return 1;
          return 0;
        });
        break;
    }

    return result;
  }, [productsList, selectedCategory, selectedBrand, priceRange, stockFilter, minRating, searchQuery, sortBy]);

  // Derive pagination bounds
  const totalPages = Math.ceil(filteredAndSortedProducts.length / PAGE_SIZE) || 1;
  const activePage = Math.min(currentPage, totalPages);

  // Paginated slice
  const startIndex = (activePage - 1) * PAGE_SIZE;
  const paginatedProducts = filteredAndSortedProducts.slice(
    startIndex,
    startIndex + PAGE_SIZE
  );

  const startItem = filteredAndSortedProducts.length === 0 ? 0 : startIndex + 1;
  const endItem = Math.min(startIndex + PAGE_SIZE, filteredAndSortedProducts.length);

  // Filter change handlers
  const handleCategorySelect = (cat) => {
    setSelectedCategory(cat);
    setCurrentPage(1);
  };

  const handlePriceRangeSelect = (rangeId) => {
    setPriceRange(rangeId);
    setCurrentPage(1);
  };

  const handleBrandSelect = (brand) => {
    setSelectedBrand(brand);
    setCurrentPage(1);
  };

  const handleStockFilterSelect = (st) => {
    setStockFilter(st);
    setCurrentPage(1);
  };

  const handleMinRatingSelect = (rating) => {
    setMinRating(rating);
    setCurrentPage(1);
  };

  const handleSearchChange = (query) => {
    setSearchQuery(query);
    setCurrentPage(1);
  };

  const handleSortChange = (newSort) => {
    setSortBy(newSort);
    setCurrentPage(1);
  };

  const handleResetFilters = () => {
    setSelectedCategory('All');
    setPriceRange('all');
    setSelectedBrand('All');
    setStockFilter('all');
    setMinRating(0);
    setSearchQuery('');
    setSortBy('featured');
    setCurrentPage(1);
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
    if (catalogRef.current) {
      catalogRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const scrollToCatalog = () => {
    if (catalogRef.current) {
      catalogRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <main className="min-h-screen bg-[#FAF6F5] text-neutral-900 overflow-x-hidden font-sans flex flex-col justify-between">
      <div>
        {/* 1. Split Hero Section */}
        <AutomotiveHero onScrollToCatalog={scrollToCatalog} />

        {/* 2. Six Compact Category Image Cards */}
        <AutomotiveCategoryFilters
          selectedCategory={selectedCategory}
          onSelectCategory={handleCategorySelect}
          categoryCounts={categoryCounts}
        />

        {/* 3. Product Catalog with Filter Sidebar + Responsive 3-Column Grid */}
        <section 
          id="catalog" 
          ref={catalogRef}
          aria-label="Automotive Product Catalog" 
          className="w-full max-w-[1440px] mx-auto px-4 sm:px-6 md:px-10 lg:px-16 pt-8 pb-12"
        >
          <div className="flex flex-col lg:flex-row gap-6 lg:gap-8 items-start">
            {/* Desktop Sticky Sidebar / Mobile Collapsible Drawer */}
            <AutomotiveFilterSidebar
              selectedCategory={selectedCategory}
              onSelectCategory={handleCategorySelect}
              priceRange={priceRange}
              onSelectPriceRange={handlePriceRangeSelect}
              selectedBrand={selectedBrand}
              onSelectBrand={handleBrandSelect}
              stockFilter={stockFilter}
              onSelectStockFilter={handleStockFilterSelect}
              minRating={minRating}
              onSelectMinRating={handleMinRatingSelect}
              searchQuery={searchQuery}
              onSearchChange={handleSearchChange}
              onResetFilters={handleResetFilters}
              categoryCounts={categoryCounts}
              brandCounts={brandCounts}
              isMobileOpen={isMobileFiltersOpen}
              onCloseMobile={() => setIsMobileFiltersOpen(false)}
            />

            {/* Main Product Catalog Column */}
            <div className="flex-1 w-full min-w-0">
              {/* Toolbar: Heading, Counts, Mobile Toggle & Sort */}
              <AutomotiveProductToolbar
                totalProducts={productsList.length}
                filteredCount={filteredAndSortedProducts.length}
                startItem={startItem}
                endItem={endItem}
                selectedCategory={selectedCategory}
                onSelectCategory={handleCategorySelect}
                priceRange={priceRange}
                onSelectPriceRange={handlePriceRangeSelect}
                selectedBrand={selectedBrand}
                onSelectBrand={handleBrandSelect}
                stockFilter={stockFilter}
                onSelectStockFilter={handleStockFilterSelect}
                searchQuery={searchQuery}
                onSearchChange={handleSearchChange}
                sortBy={sortBy}
                onSortChange={handleSortChange}
                onResetFilters={handleResetFilters}
                onOpenMobileFilters={() => setIsMobileFiltersOpen(true)}
                isLoading={isLoading}
              />

              {/* 3-Column Product Grid (desktop), 2-Col (tablet/mobile) */}
              <AutomotiveProductGrid
                products={paginatedProducts}
                wishlist={wishlist}
                onToggleWishlist={toggleWishlist}
                onViewDetails={(product) => navigate(`/automotive/product/${product.id}`)}
                onAddToCart={addToCart}
                onResetFilters={handleResetFilters}
                isLoading={isLoading}
              />

              {/* Functional Pagination */}
              <AutomotivePagination
                currentPage={activePage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
                totalItems={filteredAndSortedProducts.length}
              />
            </div>
          </div>
        </section>
      </div>

      {/* Floating Cart Indicator */}
      {totalCartCount > 0 && (
        <aside 
          aria-label="Shopping Cart Summary"
          className="fixed bottom-4 sm:bottom-6 right-4 sm:right-6 z-40 bg-[#081C15] text-white rounded-full pl-3.5 sm:pl-4 pr-4 sm:pr-5 py-2 sm:py-2.5 shadow-2xl border border-[#52B788]/40 flex items-center gap-2.5 sm:gap-3 animate-in slide-in-from-bottom-4 duration-300 select-none cursor-pointer"
        >
          <div className="relative">
            <ShoppingBag className="w-4 h-4 sm:w-5 sm:h-5 text-[#52B788]" />
            <span className="absolute -top-2 -right-2 bg-[#D4AF37] text-[#081C15] text-[10px] font-extrabold w-4 h-4 rounded-full flex items-center justify-center">
              {totalCartCount}
            </span>
          </div>
          <span className="text-[11px] sm:text-xs font-bold">
            {totalCartCount} {totalCartCount === 1 ? 'item' : 'items'} in cart
          </span>
        </aside>
      )}

      {/* Toast Notification when item added to cart */}
      {lastAddedItem && (
        <div 
          role="status"
          aria-live="polite"
          className="fixed top-16 sm:top-20 right-4 sm:right-6 z-50 bg-[#081C15] text-white px-3.5 sm:px-4 py-2.5 sm:py-3 rounded-[16px] shadow-2xl border border-[#52B788] flex items-center gap-2.5 sm:gap-3 animate-in fade-in slide-in-from-top-3 duration-200 max-w-[90vw]"
        >
          <div className="w-2 h-2 rounded-full bg-[#52B788] animate-ping shrink-0" />
          <div className="text-xs truncate">
            <p className="font-bold text-white">Added to cart</p>
            <p className="text-neutral-300 truncate max-w-[180px] sm:max-w-[220px]">{lastAddedItem.name}</p>
          </div>
        </div>
      )}

      {/* Reused GROVE Footer */}
      <Footer />
    </main>
  );
}

