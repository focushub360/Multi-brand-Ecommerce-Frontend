import React, {
  useEffect,
  useMemo,
  useState,
  useRef,
} from 'react';

import { useNavigate } from 'react-router-dom';
import { Check, ShoppingBag } from 'lucide-react';

import Footer from '../components/Footer';
import { useCart } from '../hooks/useCart';
import { useWishlist } from '../hooks/useWishlist';

import GroceriesHero from '../components/groceries/GroceriesHero';
import GroceriesCategoryFilters from '../components/groceries/GroceriesCategoryFilters';
import GroceriesFilterSidebar from '../components/groceries/GroceriesFilterSidebar';
import GroceriesProductToolbar from '../components/groceries/GroceriesProductToolbar';
import GroceriesProductGrid from '../components/groceries/GroceriesProductGrid';
import GroceriesPagination from '../components/groceries/GroceriesPagination';

const PRODUCTS = [
  {
    id: 'gr-01',
    name: 'Fresh Red Apples',
    category: 'Fruits & Vegetables',
    price: 180,
    originalPrice: 220,
    unit: '1 kg',
    rating: 4.8,
    image: 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=600',
    featured: true,
  },
  {
    id: 'gr-02',
    name: 'Fresh Bananas',
    category: 'Fruits & Vegetables',
    price: 60,
    originalPrice: 75,
    unit: '1 dozen',
    rating: 4.7,
    image: 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=600',
    featured: true,
  },
  {
    id: 'gr-03',
    name: 'Fresh Tomatoes',
    category: 'Fruits & Vegetables',
    price: 40,
    originalPrice: 50,
    unit: '1 kg',
    rating: 4.6,
    image: 'https://images.unsplash.com/photo-1546094096-0df4bcaaa337?w=600',
  },
  {
    id: 'gr-04',
    name: 'Farm Fresh Milk',
    category: 'Dairy & Eggs',
    price: 32,
    originalPrice: 36,
    unit: '500 ml',
    rating: 4.9,
    image: 'https://images.unsplash.com/photo-1563636619-e9143da7973b?w=600',
    featured: true,
  },
  {
    id: 'gr-05',
    name: 'Fresh Brown Eggs',
    category: 'Dairy & Eggs',
    price: 90,
    originalPrice: 100,
    unit: '6 pieces',
    rating: 4.8,
    image: 'https://images.unsplash.com/photo-1506976785307-8732e854ad03?w=600',
  },
  {
    id: 'gr-06',
    name: 'Organic Rice',
    category: 'Rice & Grains',
    price: 95,
    originalPrice: 110,
    unit: '1 kg',
    rating: 4.7,
    image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=600',
  },
  {
    id: 'gr-07',
    name: 'Whole Wheat Flour',
    category: 'Rice & Grains',
    price: 55,
    originalPrice: 65,
    unit: '1 kg',
    rating: 4.6,
    image: 'https://images.unsplash.com/photo-1627485937980-221c88ac04f9?w=600',
  },
  {
    id: 'gr-08',
    name: 'Mixed Cookies',
    category: 'Snacks & Bakery',
    price: 75,
    originalPrice: 90,
    unit: '250 g',
    rating: 4.5,
    image: 'https://images.unsplash.com/photo-1499636136210-6f4ee915583e?w=600',
  },
  {
    id: 'gr-09',
    name: 'Fresh Orange Juice',
    category: 'Beverages',
    price: 85,
    originalPrice: 100,
    unit: '1 litre',
    rating: 4.6,
    image: 'https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=600',
  },
  {
    id: 'gr-10',
    name: 'Premium Coffee',
    category: 'Beverages',
    price: 140,
    originalPrice: 160,
    unit: '200 g',
    rating: 4.8,
    image: 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=600',
  },
  {
    id: 'gr-11',
    name: 'Sunflower Cooking Oil',
    category: 'Cooking Essentials',
    price: 145,
    originalPrice: 165,
    unit: '1 litre',
    rating: 4.7,
    image: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=600',
  },
  {
    id: 'gr-12',
    name: 'Fresh Carrots',
    category: 'Fruits & Vegetables',
    price: 50,
    originalPrice: 60,
    unit: '500 g',
    rating: 4.5,
    image: 'https://images.unsplash.com/photo-1445282768818-728615cc910a?w=600',
  },
].map((product) => ({
  ...product,
  brand: 'GROVE Fresh',
  inStock: true,
  stockStatus: 'In Stock',
}));

const PAGE_SIZE = 9;

export default function GroceriesPage() {
  const navigate = useNavigate();
  const catalogRef = useRef(null);

  // Filter states
  const [category, setCategory] = useState('All Products');
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('featured');
  const [maxPrice, setMaxPrice] = useState(500);
  const [selectedBrand, setSelectedBrand] = useState('All');
  const [stockFilter, setStockFilter] = useState('all');
  const [minRating, setMinRating] = useState(0);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  // Other states
  const [quantities, setQuantities] = useState({});
  const [message, setMessage] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  const { addToCart, totalCartCount } = useCart();
  const { isWishlisted, toggleWishlist } = useWishlist();

  useEffect(() => {
    document.title = 'Groceries | GROVE Marketplace';
    window.scrollTo(0, 0);
  }, []);

  const scrollToCatalog = () => {
    catalogRef.current?.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    });
  };

  // Category counts
  const categoryCounts = useMemo(() => {
    const counts = {
      'All Products': PRODUCTS.length,
    };

    PRODUCTS.forEach((product) => {
      counts[product.category] =
        (counts[product.category] || 0) + 1;
    });

    return counts;
  }, []);

  // Brand counts
  const brandCounts = useMemo(
    () => ({
      All: PRODUCTS.length,
      'GROVE Fresh': PRODUCTS.length,
    }),
    []
  );

  // Product filtering and sorting
  const filteredProducts = useMemo(() => {
    let result = PRODUCTS.filter((product) => {
      const query = search.toLowerCase().trim();

      const matchesCategory =
        category === 'All Products' ||
        product.category === category;

      const matchesSearch =
        product.name.toLowerCase().includes(query) ||
        product.category.toLowerCase().includes(query) ||
        product.brand.toLowerCase().includes(query);

      const matchesPrice = product.price <= maxPrice;

      const matchesBrand =
        selectedBrand === 'All' ||
        product.brand === selectedBrand;

      const matchesStock =
        stockFilter === 'all' ||
        (stockFilter === 'in-stock' && product.inStock) ||
        (stockFilter === 'limited' &&
          product.stockStatus === 'Limited Stock');

      const matchesRating =
        product.rating >= minRating;

      return (
        matchesCategory &&
        matchesSearch &&
        matchesPrice &&
        matchesBrand &&
        matchesStock &&
        matchesRating
      );
    });

    switch (sort) {
      case 'low':
        result.sort((a, b) => a.price - b.price);
        break;

      case 'high':
        result.sort((a, b) => b.price - a.price);
        break;

      case 'rating':
        result.sort((a, b) => b.rating - a.rating);
        break;

      case 'featured':
      default:
        result.sort(
          (a, b) =>
            Number(Boolean(b.featured)) -
            Number(Boolean(a.featured))
        );
        break;
    }

    return result;
  }, [
    category,
    search,
    sort,
    maxPrice,
    selectedBrand,
    stockFilter,
    minRating,
  ]);

  // Pagination
  const totalPages =
    Math.ceil(filteredProducts.length / PAGE_SIZE) || 1;

  const activePage = Math.min(currentPage, totalPages);
  const startIndex = (activePage - 1) * PAGE_SIZE;

  const currentProducts = filteredProducts.slice(
    startIndex,
    startIndex + PAGE_SIZE
  );

  // Quantity controls
  const changeQuantity = (id, amount) => {
    setQuantities((previous) => ({
      ...previous,
      [id]: Math.max(1, (previous[id] || 1) + amount),
    }));
  };

  // Add to cart
  const handleAddToCart = (product, quantity) => {
    addToCart({
      ...product,
      quantity,
      description: product.name,
    });

    setMessage(`${product.name} added to cart`);

    window.setTimeout(() => {
      setMessage('');
    }, 2500);
  };

  // Reset all filters
  const resetFilters = () => {
    setCategory('All Products');
    setSearch('');
    setSort('featured');
    setMaxPrice(500);
    setSelectedBrand('All');
    setStockFilter('all');
    setMinRating(0);
    setCurrentPage(1);
  };

  // Filter handlers
  const handleCategoryChange = (value) => {
    setCategory(value);
    setCurrentPage(1);
  };

  const handleSearchChange = (value) => {
    setSearch(value);
    setCurrentPage(1);
  };

  const handlePriceChange = (value) => {
    setMaxPrice(value);
    setCurrentPage(1);
  };

  const handleBrandChange = (value) => {
    setSelectedBrand(value);
    setCurrentPage(1);
  };

  const handleStockChange = (value) => {
    setStockFilter(value);
    setCurrentPage(1);
  };

  const handleRatingChange = (value) => {
    setMinRating(value);
    setCurrentPage(1);
  };

  const handleSortChange = (value) => {
    setSort(value);
    setCurrentPage(1);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    scrollToCatalog();
  };

  const startItem =
    filteredProducts.length === 0 ? 0 : startIndex + 1;

  const endItem = Math.min(
    startIndex + PAGE_SIZE,
    filteredProducts.length
  );

  return (
    <main className="min-h-screen bg-[#FAF9F5] text-neutral-900 overflow-x-hidden font-sans flex flex-col justify-between">
      <div>
        {/* Grocery Hero */}
        <GroceriesHero onScrollToCatalog={scrollToCatalog} />

        {/* Grocery Category Cards */}
        <GroceriesCategoryFilters
          category={category}
          setCategory={handleCategoryChange}
          categoryCounts={categoryCounts}
        />

        {/* Product Catalog */}
        <section
          id="groceries-products"
          ref={catalogRef}
          aria-label="Grocery Product Catalog"
          className="w-full max-w-[1440px] mx-auto px-4 sm:px-6 md:px-10 lg:px-16 pt-8 pb-12 scroll-mt-6"
        >
          <div className="flex flex-col lg:flex-row gap-6 lg:gap-8 items-start">
            {/* Filter Sidebar */}
            <GroceriesFilterSidebar
              category={category}
              setCategory={handleCategoryChange}
              maxPrice={maxPrice}
              setMaxPrice={handlePriceChange}
              selectedBrand={selectedBrand}
              setSelectedBrand={handleBrandChange}
              stockFilter={stockFilter}
              setStockFilter={handleStockChange}
              minRating={minRating}
              setMinRating={handleRatingChange}
              search={search}
              setSearch={handleSearchChange}
              resetFilters={resetFilters}
              categoryCounts={categoryCounts}
              brandCounts={brandCounts}
              isMobileOpen={isMobileFilterOpen}
              onCloseMobile={() => setIsMobileFilterOpen(false)}
            />

            {/* Main Catalog */}
            <div className="flex-1 w-full min-w-0">
              <GroceriesProductToolbar
                search={search}
                setSearch={handleSearchChange}
                sort={sort}
                setSort={handleSortChange}
                productCount={filteredProducts.length}
                onOpenFilters={() => setIsMobileFilterOpen(true)}
              />

              <GroceriesProductGrid
                products={currentProducts}
                quantities={quantities}
                isWishlisted={isWishlisted}
                onViewProduct={(product) =>
                  navigate(`/groceries/product/${product.id}`)
                }
                onToggleWishlist={toggleWishlist}
                onChangeQuantity={changeQuantity}
                onAddToCart={handleAddToCart}
              />

              <GroceriesPagination
                currentPage={activePage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />

              <div className="mt-4 text-xs text-neutral-500">
                Showing {startItem}–{endItem} of{' '}
                {filteredProducts.length} products
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* Floating Cart */}
      {totalCartCount > 0 && (
        <aside
          aria-label="Shopping Cart Summary"
          onClick={() => navigate('/cart')}
          className="fixed bottom-4 sm:bottom-6 right-4 sm:right-6 z-40 bg-[#081C15] text-white rounded-full pl-3.5 sm:pl-4 pr-4 sm:pr-5 py-2 sm:py-2.5 shadow-2xl border border-[#52B788]/40 flex items-center gap-2.5 sm:gap-3 cursor-pointer"
        >
          <div className="relative">
            <ShoppingBag className="w-4 h-4 sm:w-5 sm:h-5 text-[#52B788]" />
            <span className="absolute -top-2 -right-2 bg-[#D4AF37] text-[#081C15] text-[10px] font-extrabold w-4 h-4 rounded-full flex items-center justify-center">
              {totalCartCount}
            </span>
          </div>

          <span className="text-[11px] sm:text-xs font-bold">
            {totalCartCount}{' '}
            {totalCartCount === 1 ? 'item' : 'items'} in cart
          </span>
        </aside>
      )}

      {/* Add to Cart Notification */}
      {message && (
        <div
          role="status"
          aria-live="polite"
          className="fixed top-16 sm:top-20 right-4 sm:right-6 z-50 bg-[#081C15] text-white px-3.5 sm:px-4 py-2.5 sm:py-3 rounded-[16px] shadow-2xl border border-[#52B788] flex items-center gap-2.5 sm:gap-3 max-w-[90vw]"
        >
          <Check size={18} className="text-green-400 shrink-0" />

          <div className="text-xs truncate">
            <p className="font-bold">Added to cart</p>
            <p className="text-neutral-300 truncate">
              {message}
            </p>
          </div>
        </div>
      )}

      <Footer />
    </main>
  );
}