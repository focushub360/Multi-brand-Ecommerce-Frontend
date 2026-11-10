
import React, { useEffect, useMemo, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Check, ShoppingBag } from 'lucide-react';

import Footer from '../components/Footer';
import { useCart } from '../hooks/useCart';
import { useWishlist } from '../hooks/useWishlist';

import GroceriesHero from '../components/groceries/GroceriesHero';
import GroceriesCategoryFilters from '../components/groceries/GroceriesCategoryFilters';
import GroceriesProductToolbar from '../components/groceries/GroceriesProductToolbar';
import GroceriesProductGrid from '../components/groceries/GroceriesProductGrid';
import GroceriesPagination from '../components/groceries/GroceriesPagination';

// ==========================================
// GROCERY PRODUCTS - 60 PRODUCTS
// ==========================================

const PRODUCTS = [

  // FRUITS - 6 PRODUCTS

  { id: 'gr-01', name: 'Fresh Red Apples', category: 'Fruits & Vegetables', price: 180, originalPrice: 220, unit: '1 kg', rating: 4.8, image: 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=600', featured: true },

  { id: 'gr-02', name: 'Fresh Bananas', category: 'Fruits & Vegetables', price: 60, originalPrice: 75, unit: '1 dozen', rating: 4.7, image: 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=600', featured: true },

  { id: 'gr-03', name: 'Fresh Tomatoes', category: 'Fruits & Vegetables', price: 40, originalPrice: 50, unit: '1 kg', rating: 4.6, image: 'https://images.unsplash.com/photo-1546094096-0df4bcaaa337?w=600' },

  { id: 'gr-04', name: 'Fresh Mangoes', category: 'Fruits & Vegetables', price: 120, originalPrice: 150, unit: '1 kg', rating: 4.8, image: 'https://images.unsplash.com/photo-1553279768-865429fa0078?w=600' },

  { id: 'gr-05', name: 'Fresh Oranges', category: 'Fruits & Vegetables', price: 90, originalPrice: 110, unit: '1 kg', rating: 4.5, image: 'https://images.unsplash.com/photo-1547514701-42782101795e?w=600' },

  { id: 'gr-06', name: 'Green Grapes', category: 'Fruits & Vegetables', price: 110, originalPrice: 135, unit: '500 g', rating: 4.6, image: 'https://images.unsplash.com/photo-1537640538966-79f369143f8f?w=600' },


  // VEGETABLES - 4 PRODUCTS

  { id: 'gr-07', name: 'Fresh Potatoes', category: 'Fruits & Vegetables', price: 35, originalPrice: 45, unit: '1 kg', rating: 4.5, image: 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=600' },

  { id: 'gr-08', name: 'Fresh Onions', category: 'Fruits & Vegetables', price: 45, originalPrice: 55, unit: '1 kg', rating: 4.7, image: 'https://images.unsplash.com/photo-1508747703725-719777637510?w=600' },

  { id: 'gr-09', name: 'Fresh Carrots', category: 'Fruits & Vegetables', price: 50, originalPrice: 60, unit: '500 g', rating: 4.5, image: 'https://images.unsplash.com/photo-1445282768818-728615cc910a?w=600' },

  { id: 'gr-10', name: 'Fresh Spinach', category: 'Fruits & Vegetables', price: 30, originalPrice: 40, unit: '1 bunch', rating: 4.6, image: 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=600' },


  // DAIRY & EGGS - 10 PRODUCTS

  { id: 'gr-11', name: 'Farm Fresh Milk', category: 'Dairy & Eggs', price: 32, originalPrice: 36, unit: '500 ml', rating: 4.9, image: 'https://images.unsplash.com/photo-1563636619-e9143da7973b?w=600', featured: true },

  { id: 'gr-12', name: 'Fresh Brown Eggs', category: 'Dairy & Eggs', price: 90, originalPrice: 100, unit: '6 pieces', rating: 4.8, image: 'https://images.unsplash.com/photo-1506976785307-8732e854ad03?w=600' },

  { id: 'gr-13', name: 'Fresh Curd', category: 'Dairy & Eggs', price: 35, originalPrice: 42, unit: '500 g', rating: 4.7, image: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=600' },

  { id: 'gr-14', name: 'Fresh Paneer', category: 'Dairy & Eggs', price: 95, originalPrice: 115, unit: '200 g', rating: 4.8, image: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=600' },

  { id: 'gr-15', name: 'Creamy Butter', category: 'Dairy & Eggs', price: 55, originalPrice: 65, unit: '100 g', rating: 4.6, image: 'https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?w=600' },

  { id: 'gr-16', name: 'Cheddar Cheese', category: 'Dairy & Eggs', price: 120, originalPrice: 145, unit: '200 g', rating: 4.7, image: 'https://images.unsplash.com/photo-1486297678162-eb2a19b0a32d?w=600' },

  { id: 'gr-17', name: 'Fresh Ghee', category: 'Dairy & Eggs', price: 180, originalPrice: 210, unit: '500 ml', rating: 4.8, image: 'https://images.unsplash.com/photo-1630415946421-7b7b1d9c0f9b?w=600' },

  { id: 'gr-18', name: 'Full Cream Milk', category: 'Dairy & Eggs', price: 38, originalPrice: 45, unit: '500 ml', rating: 4.7, image: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=600' },

  { id: 'gr-19', name: 'Fresh White Eggs', category: 'Dairy & Eggs', price: 75, originalPrice: 90, unit: '6 pieces', rating: 4.6, image: 'https://images.unsplash.com/photo-1518569656558-1f25e69d93d7?w=600' },

  { id: 'gr-20', name: 'Greek Yogurt', category: 'Dairy & Eggs', price: 80, originalPrice: 100, unit: '400 g', rating: 4.8, image: 'https://images.unsplash.com/photo-1571212515416-fef01fc43637?w=600' },


  // RICE & GRAINS - 7 PRODUCTS

  { id: 'gr-21', name: 'Premium Ponni Rice', category: 'Rice & Grains', price: 75, originalPrice: 90, unit: '1 kg', rating: 4.8, image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=600', featured: true },

  { id: 'gr-22', name: 'Basmati Rice', category: 'Rice & Grains', price: 120, originalPrice: 145, unit: '1 kg', rating: 4.9, image: 'https://images.unsplash.com/photo-1516684732162-798a0062be99?w=600' },

  { id: 'gr-23', name: 'Whole Wheat Flour', category: 'Rice & Grains', price: 55, originalPrice: 65, unit: '1 kg', rating: 4.6, image: 'https://images.unsplash.com/photo-1627485937980-221c88ac04f9?w=600' },

  { id: 'gr-24', name: 'Organic Ragi', category: 'Rice & Grains', price: 65, originalPrice: 80, unit: '1 kg', rating: 4.7, image: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=600' },

  { id: 'gr-25', name: 'Organic Millets', category: 'Rice & Grains', price: 85, originalPrice: 100, unit: '1 kg', rating: 4.6, image: 'https://images.unsplash.com/photo-1515543904379-3d757afe72e4?w=600' },

  { id: 'gr-26', name: 'Toor Dal', category: 'Rice & Grains', price: 110, originalPrice: 130, unit: '1 kg', rating: 4.8, image: 'https://images.unsplash.com/photo-1515543904379-3d757afe72e4?w=600' },

  { id: 'gr-27', name: 'Moong Dal', category: 'Rice & Grains', price: 100, originalPrice: 120, unit: '1 kg', rating: 4.7, image: 'https://images.unsplash.com/photo-1515543904379-3d757afe72e4?w=600' },

  { id: 'gr-28', name: 'Chana Dal', category: 'Rice & Grains', price: 80, originalPrice: 95, unit: '1 kg', rating: 4.5, image: 'https://images.unsplash.com/photo-1515543904379-3d757afe72e4?w=600' },

  { id: 'gr-29', name: 'Organic Brown Rice', category: 'Rice & Grains', price: 95, originalPrice: 115, unit: '1 kg', rating: 4.7, image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=600' },

  { id: 'gr-30', name: 'Raw Wheat Grains', category: 'Rice & Grains', price: 60, originalPrice: 75, unit: '1 kg', rating: 4.5, image: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=600' },


  // SNACKS & BAKERY - 10 PRODUCTS

  { id: 'gr-31', name: 'Mixed Cookies', category: 'Snacks & Bakery', price: 75, originalPrice: 90, unit: '250 g', rating: 4.5, image: 'https://images.unsplash.com/photo-1499636136210-6f4ee915583e?w=600', featured: true },

  { id: 'gr-32', name: 'Fresh White Bread', category: 'Snacks & Bakery', price: 40, originalPrice: 50, unit: '400 g', rating: 4.7, image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=600' },

  { id: 'gr-33', name: 'Chocolate Biscuits', category: 'Snacks & Bakery', price: 35, originalPrice: 45, unit: '200 g', rating: 4.6, image: 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=600' },

  { id: 'gr-34', name: 'Chocolate Cake', category: 'Snacks & Bakery', price: 250, originalPrice: 300, unit: '500 g', rating: 4.9, image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=600' },

  { id: 'gr-35', name: 'Potato Chips', category: 'Snacks & Bakery', price: 30, originalPrice: 40, unit: '150 g', rating: 4.5, image: 'https://images.unsplash.com/photo-1566478989037-eec170784d0b?w=600' },

  { id: 'gr-36', name: 'Chocolate Brownies', category: 'Snacks & Bakery', price: 90, originalPrice: 110, unit: '4 pieces', rating: 4.8, image: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=600' },

  { id: 'gr-37', name: 'Butter Croissant', category: 'Snacks & Bakery', price: 55, originalPrice: 70, unit: '2 pieces', rating: 4.7, image: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=600' },

  { id: 'gr-38', name: 'Rusk Toast', category: 'Snacks & Bakery', price: 45, originalPrice: 55, unit: '200 g', rating: 4.5, image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=600' },

  { id: 'gr-39', name: 'Butter Cookies', category: 'Snacks & Bakery', price: 65, originalPrice: 80, unit: '250 g', rating: 4.6, image: 'https://images.unsplash.com/photo-1499636136210-6f4ee915583e?w=600' },

  { id: 'gr-40', name: 'Fresh Muffins', category: 'Snacks & Bakery', price: 80, originalPrice: 100, unit: '4 pieces', rating: 4.7, image: 'https://images.unsplash.com/photo-1607958996333-41aef7caefaa?w=600' },


  // BEVERAGES - 10 PRODUCTS

  { id: 'gr-41', name: 'Fresh Orange Juice', category: 'Beverages', price: 85, originalPrice: 100, unit: '1 litre', rating: 4.6, image: 'https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=600', featured: true },

  { id: 'gr-42', name: 'Premium Coffee', category: 'Beverages', price: 140, originalPrice: 160, unit: '200 g', rating: 4.8, image: 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=600' },

  { id: 'gr-43', name: 'Apple Juice', category: 'Beverages', price: 90, originalPrice: 110, unit: '1 litre', rating: 4.7, image: 'https://images.unsplash.com/photo-1575596510825-f748919a2bf7?w=600' },

  { id: 'gr-44', name: 'Green Tea', category: 'Beverages', price: 120, originalPrice: 145, unit: '100 g', rating: 4.8, image: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=600' },

  { id: 'gr-45', name: 'Premium Black Tea', category: 'Beverages', price: 110, originalPrice: 130, unit: '250 g', rating: 4.7, image: 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=600' },

  { id: 'gr-46', name: 'Badam Milk', category: 'Beverages', price: 45, originalPrice: 55, unit: '200 ml', rating: 4.6, image: 'https://images.unsplash.com/photo-1563636619-e9143da7973b?w=600' },

  { id: 'gr-47', name: 'Fresh Lemon Juice', category: 'Beverages', price: 60, originalPrice: 75, unit: '500 ml', rating: 4.5, image: 'https://images.unsplash.com/photo-1513558161293-cdaf765edfd4?w=600' },

  { id: 'gr-48', name: 'Pomegranate Juice', category: 'Beverages', price: 100, originalPrice: 120, unit: '500 ml', rating: 4.8, image: 'https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=600' },

  { id: 'gr-49', name: 'Cold Coffee', category: 'Beverages', price: 75, originalPrice: 90, unit: '300 ml', rating: 4.7, image: 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=600' },

  { id: 'gr-50', name: 'Coconut Water', category: 'Beverages', price: 40, originalPrice: 50, unit: '500 ml', rating: 4.8, image: 'https://images.unsplash.com/photo-1553909489-cd47e0ef937f?w=600' },


  // COOKING ESSENTIALS - 10 PRODUCTS

  { id: 'gr-51', name: 'Sunflower Cooking Oil', category: 'Cooking Essentials', price: 145, originalPrice: 165, unit: '1 litre', rating: 4.7, image: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=600', featured: true },

  { id: 'gr-52', name: 'Pure Coconut Oil', category: 'Cooking Essentials', price: 180, originalPrice: 210, unit: '1 litre', rating: 4.8, image: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=600' },

  { id: 'gr-53', name: 'Refined Salt', category: 'Cooking Essentials', price: 25, originalPrice: 30, unit: '1 kg', rating: 4.6, image: 'https://images.unsplash.com/photo-1518110925495-5fe2fda0442c?w=600' },

  { id: 'gr-54', name: 'White Sugar', category: 'Cooking Essentials', price: 45, originalPrice: 55, unit: '1 kg', rating: 4.7, image: 'https://images.unsplash.com/photo-1581441363689-1f3c3c414635?w=600' },

  { id: 'gr-55', name: 'Turmeric Powder', category: 'Cooking Essentials', price: 55, originalPrice: 70, unit: '200 g', rating: 4.8, image: 'https://images.unsplash.com/photo-1615485500704-8e990f9900f2?w=600' },

  { id: 'gr-56', name: 'Red Chilli Powder', category: 'Cooking Essentials', price: 65, originalPrice: 80, unit: '200 g', rating: 4.7, image: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=600' },

  { id: 'gr-57', name: 'Black Pepper', category: 'Cooking Essentials', price: 90, originalPrice: 110, unit: '100 g', rating: 4.8, image: 'https://images.unsplash.com/photo-1599909533730-f9d2a5c8e7c4?w=600' },

  { id: 'gr-58', name: 'Cumin Seeds', category: 'Cooking Essentials', price: 50, originalPrice: 60, unit: '100 g', rating: 4.6, image: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=600' },

  { id: 'gr-59', name: 'Mustard Seeds', category: 'Cooking Essentials', price: 35, originalPrice: 45, unit: '100 g', rating: 4.5, image: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=600' },

  { id: 'gr-60', name: 'Garam Masala', category: 'Cooking Essentials', price: 75, originalPrice: 90, unit: '100 g', rating: 4.8, image: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=600' },

].map((product) => {

  const productNumber = Number(product.id.replace('gr-', ''));

  let categoryId = '';

  if (productNumber >= 1 && productNumber <= 6) {
    categoryId = 'fruits';
  } else if (productNumber >= 7 && productNumber <= 10) {
    categoryId = 'vegetables';
  } else if (productNumber >= 11 && productNumber <= 20) {
    categoryId = 'dairy';
  } else if (
    (productNumber >= 21 && productNumber <= 25) ||
    (productNumber >= 29 && productNumber <= 30)
  ) {
    categoryId = 'rice-grains';
  } else if (productNumber >= 26 && productNumber <= 28) {
    categoryId = 'pulses';
  } else if (productNumber >= 31 && productNumber <= 40) {
    categoryId = [32, 34, 37, 38, 40].includes(productNumber)
      ? 'bakery'
      : 'snacks';
  } else if (productNumber >= 41 && productNumber <= 50) {
    categoryId = 'snacks';
  } else if (productNumber >= 51 && productNumber <= 60) {
    categoryId = 'oil-masala';
  }

  return {
    ...product,
    categoryId,
    brand: 'GROVE Fresh',
    inStock: true,
    stockStatus: 'In Stock',
  };
});


// ==========================================
// PAGINATION
// ==========================================

const PAGE_SIZE = 9;


// ==========================================
// GROCERIES PAGE
// ==========================================

export default function GroceriesPage() {

  const navigate = useNavigate();
  const catalogRef = useRef(null);

  const [category, setCategory] = useState('All Products');
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('featured');
  const [quantities, setQuantities] = useState({});
  const [message, setMessage] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  const { addToCart, totalCartCount } = useCart();
  const { isWishlisted, toggleWishlist } = useWishlist();


  // PAGE SETUP

  useEffect(() => {
    document.title = 'Groceries | GROVE Marketplace';
    window.scrollTo(0, 0);
  }, []);


  // SCROLL TO PRODUCTS

  const scrollToCatalog = () => {
    catalogRef.current?.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    });
  };


  // CATEGORY COUNTS

  const categoryCounts = useMemo(() => {

    const counts = {
      'All Products': PRODUCTS.length,
      fruits: 0,
      vegetables: 0,
      dairy: 0,
      'rice-grains': 0,
      pulses: 0,
      'oil-masala': 0,
      snacks: 0,
      bakery: 0,
      household: 0,
      organic: 0,
    };

    PRODUCTS.forEach((product) => {
      if (product.categoryId) {
        counts[product.categoryId]++;
      }
    });

    return counts;

  }, []);


  // FILTER PRODUCTS

  const filteredProducts = useMemo(() => {

    const query = search.toLowerCase().trim();

    let result = PRODUCTS.filter((product) => {

      const matchesCategory =
        category === 'All Products' ||
        product.categoryId === category;

      const matchesSearch =
        product.name.toLowerCase().includes(query) ||
        product.category.toLowerCase().includes(query) ||
        product.brand.toLowerCase().includes(query);

      return matchesCategory && matchesSearch;
    });


    // SORT PRODUCTS

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

      default:
        result.sort(
          (a, b) =>
            Number(Boolean(b.featured)) -
            Number(Boolean(a.featured))
        );
    }

    return result;

  }, [category, search, sort]);


  // PAGINATION

  const totalPages =
    Math.ceil(filteredProducts.length / PAGE_SIZE) || 1;

  const activePage = Math.min(currentPage, totalPages);

  const startIndex = (activePage - 1) * PAGE_SIZE;

  const currentProducts = filteredProducts.slice(
    startIndex,
    startIndex + PAGE_SIZE
  );


  // QUANTITY

  const changeQuantity = (id, amount) => {

    setQuantities((previous) => ({
      ...previous,
      [id]: Math.max(1, (previous[id] || 1) + amount),
    }));

  };


  // ADD TO CART

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


  // CATEGORY CHANGE

  const handleCategoryChange = (value) => {

    setCategory(value);
    setCurrentPage(1);

  };


  // SEARCH CHANGE

  const handleSearchChange = (value) => {

    setSearch(value);
    setCurrentPage(1);

  };


  // SORT CHANGE

  const handleSortChange = (value) => {

    setSort(value);
    setCurrentPage(1);

  };


  // PAGE CHANGE

  const handlePageChange = (page) => {

    setCurrentPage(page);
    scrollToCatalog();

  };


  // PRODUCT RANGE

  const startItem =
    filteredProducts.length === 0 ? 0 : startIndex + 1;

  const endItem = Math.min(
    startIndex + PAGE_SIZE,
    filteredProducts.length
  );


  // ==========================================
  // UI
  // ==========================================

  return (

    <main className="min-h-screen bg-[#FAF9F5] text-neutral-900 font-sans flex flex-col">

      {/* HERO */}

      <GroceriesHero
        onScrollToCatalog={scrollToCatalog}
      />


      {/* CATEGORY SECTION */}

      <GroceriesCategoryFilters
        category={category}
        setCategory={handleCategoryChange}
        categoryCounts={categoryCounts}
      />


      {/* PRODUCT CATALOG */}

      <section
        id="groceries-products"
        ref={catalogRef}
        aria-label="Grocery Product Catalog"
        className="w-full max-w-[1440px] mx-auto px-4 sm:px-6 md:px-10 lg:px-16 pt-10 pb-14 scroll-mt-6"
      >

        <GroceriesProductToolbar
          search={search}
          setSearch={handleSearchChange}
          sort={sort}
          setSort={handleSortChange}
          productCount={filteredProducts.length}
        />


        {/* PRODUCT GRID */}

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


        {/* PAGINATION */}

        <GroceriesPagination
          currentPage={activePage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />


        {/* PRODUCT COUNT */}

        <div className="mt-5 text-center text-xs text-neutral-500">
          Showing {startItem}–{endItem} of {filteredProducts.length} products
        </div>

      </section>


      {/* FLOATING CART */}

      {totalCartCount > 0 && (

        <button
          type="button"
          aria-label="Open shopping cart"
          onClick={() => navigate('/cart')}
          className="fixed bottom-4 sm:bottom-6 right-4 sm:right-6 z-40 bg-[#081C15] text-white rounded-full pl-4 pr-5 py-3 shadow-2xl border border-[#52B788]/40 flex items-center gap-3"
        >

          <div className="relative">

            <ShoppingBag className="w-5 h-5 text-[#52B788]" />

            <span className="absolute -top-2 -right-2 bg-[#D4AF37] text-[#081C15] text-[10px] font-extrabold w-4 h-4 rounded-full flex items-center justify-center">
              {totalCartCount}
            </span>

          </div>

          <span className="text-xs font-bold">
            {totalCartCount} {totalCartCount === 1 ? 'item' : 'items'} in cart
          </span>

        </button>

      )}


      {/* SUCCESS MESSAGE */}

      {message && (

        <div
          role="status"
          aria-live="polite"
          className="fixed top-16 sm:top-20 right-4 sm:right-6 z-50 bg-[#081C15] text-white px-4 py-3 rounded-2xl shadow-2xl border border-[#52B788] flex items-center gap-3 max-w-[90vw]"
        >

          <Check size={18} className="text-green-400 shrink-0" />

          <div className="text-xs truncate">

            <p className="font-bold">
              Added to cart
            </p>

            <p className="text-neutral-300 truncate">
              {message}
            </p>

          </div>

        </div>

      )}


      {/* FOOTER */}

      <Footer />

    </main>

  );

}
