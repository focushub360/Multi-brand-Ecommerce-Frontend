import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { productsApi } from '../services/apiClient.js';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ProductImageGallery from '../components/agriculture/details/ProductImageGallery';
import ProductInfoColumn from '../components/agriculture/details/ProductInfoColumn';
import ProductPurchasePanel from '../components/agriculture/details/ProductPurchasePanel';
import ProductSpecsAndReviewsTabs from '../components/agriculture/details/ProductSpecsAndReviewsTabs';
import AgricultureProductCard from '../components/agriculture/AgricultureProductCard';
import { useWishlist } from '../hooks/useWishlist';
import { useCart } from '../hooks/useCart';
import { isCustomerAuthenticated, setPendingAction } from '../utils/auth';
import { 
  ArrowLeft, 
  AlertCircle, 
  ShoppingBag, 
  Sparkles, 
  History, 
  CheckCircle2, 
  X 
} from 'lucide-react';

const RECENTLY_VIEWED_KEY = 'grove_recently_viewed_all';

export default function ProductDetailPage() {
  const { productId } = useParams();
  const navigate = useNavigate();

  const { wishlist, toggleWishlist, isWishlisted } = useWishlist();
  const { addToCart, totalCartCount, lastAddedItem } = useCart();

  const [buyNowNotification, setBuyNowNotification] = useState(null);
  const [liveProduct, setLiveProduct] = useState(null);
  const [catalogPool, setCatalogPool] = useState([]);
  const reviewsRef = useRef(null);

  // Fetch live product from MongoDB by ID or Slug
  useEffect(() => {
    if (!productId) return;
    productsApi.getByIdOrSlug(productId)
      .then((serverProd) => {
        if (serverProd) {
          const normalized = {
            ...serverProd,
            id: serverProd.id || serverProd._id,
            originalPrice: serverProd.originalPrice || serverProd.mrp || serverProd.price,
            category: serverProd.subcategory || serverProd.categoryName || 'General',
            inStock: (serverProd.stock !== undefined ? serverProd.stock > 0 : true) && serverProd.inStock !== false,
            seller: serverProd.seller || { name: serverProd.dealerName || serverProd.dealer?.businessName || 'GROVE Authorized Dealer' },
            images: serverProd.images?.length > 0 ? serverProd.images : [serverProd.image]
          };
          setLiveProduct(normalized);
        }
      })
      .catch((err) => {
        console.warn('Backend product detail fetch warning:', err.message);
      });

    productsApi.getAll({ limit: 40 })
      .then((res) => {
        const prods = res?.products || (Array.isArray(res) ? res : []);
        setCatalogPool(prods.map((p) => ({
          ...p,
          id: p.id || p._id,
          originalPrice: p.originalPrice || p.mrp || p.price,
          category: p.subcategory || p.categoryName || 'General',
          inStock: (p.stock !== undefined ? p.stock > 0 : true) && p.inStock !== false,
          seller: p.seller || { name: p.dealerName || 'GROVE Authorized Dealer' },
          images: p.images?.length > 0 ? p.images : [p.image]
        })));
      })
      .catch(() => {});
  }, [productId]);

  const product = liveProduct;

  // Determine category context
  const categoryContext = useMemo(() => {
    if (!product) {
      return {
        name: 'Marketplace',
        url: '/',
        hubName: 'Marketplace'
      };
    }

    const cat = String(product.category || '').toLowerCase();
    const pid = String(product.id || '').toLowerCase();

    if (cat.includes('electr') || pid.startsWith('el-')) {
      return {
        name: 'Electronics & Gadgets',
        url: '/electronics',
        hubName: 'Electronics Hub'
      };
    }
    if (cat.includes('auto') || pid.startsWith('au-')) {
      return {
        name: 'Automotive & Spare Parts',
        url: '/automotive',
        hubName: 'Automotive Hub'
      };
    }
    return {
      name: 'Agriculture & Farming',
      url: '/agriculture',
      hubName: 'Agriculture Catalogue'
    };
  }, [product]);

  // 2. Track Recently Viewed in localStorage
  useEffect(() => {
    if (!product) return;

    try {
      const stored = localStorage.getItem(RECENTLY_VIEWED_KEY);
      let list = stored ? JSON.parse(stored) : [];
      list = [product.id, ...list.filter((id) => id !== product.id)].slice(0, 10);
      localStorage.setItem(RECENTLY_VIEWED_KEY, JSON.stringify(list));
    } catch {
      // Ignore localStorage errors
    }
  }, [product]);

  // 3. Scroll to top on navigation & update page title
  useEffect(() => {
    window.scrollTo(0, 0);
    if (product) {
      document.title = `${product.name} | GROVE ${categoryContext.name}`;
    } else {
      document.title = 'Product Not Found | GROVE Marketplace';
    }
  }, [product, categoryContext]);

  // 4. Related Products (Same category, excluding current product)
  const relatedProducts = useMemo(() => {
    if (!product) return [];
    const cat = String(product.category || '').toLowerCase();
    const pid = String(product.id || '').toLowerCase();

    const matches = catalogPool.filter(
      (p) => String(p.id).toLowerCase() !== pid &&
        ((p.category && String(p.category).toLowerCase().includes(cat)) ||
         (cat.includes('electr') && (p.category || '').toLowerCase().includes('electr')) ||
         (cat.includes('auto') && (p.category || '').toLowerCase().includes('auto')) ||
         (cat.includes('agri') && (p.category || '').toLowerCase().includes('agri')))
    );

    return (matches.length > 0 ? matches : catalogPool.filter((p) => String(p.id).toLowerCase() !== pid)).slice(0, 4);
  }, [product, catalogPool]);

  // 5. Recently Viewed Products (excluding current product)
  const recentlyViewedProducts = useMemo(() => {
    if (!product) return [];
    try {
      const stored = localStorage.getItem(RECENTLY_VIEWED_KEY);
      const list = stored ? JSON.parse(stored) : [];
      return list
        .filter((id) => String(id).toLowerCase() !== String(product.id).toLowerCase())
        .map((id) => catalogPool.find((p) => String(p.id).toLowerCase() === String(id).toLowerCase()))
        .filter(Boolean)
        .slice(0, 4);
    } catch {
      return [];
    }
  }, [product, catalogPool]);

  // Handler for Back navigation with fallback to category catalogue
  const handleBack = () => {
    if (window.history.state && typeof window.history.state.idx === 'number' && window.history.state.idx > 0) {
      navigate(-1);
    } else if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate(categoryContext.url);
    }
  };

  // Handler for jumping to reviews tab
  const handleJumpToReviews = () => {
    if (reviewsRef.current) {
      reviewsRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // Handler for Buy Now (fast-track checkout without adding to cart)
  const handleBuyNow = (prod, quantity) => {
    const qty = Math.max(1, parseInt(quantity, 10) || 1);
    if (!isCustomerAuthenticated()) {
      setPendingAction({
        type: 'buy_now',
        product: prod,
        productId: prod.id,
        quantity: qty,
        returnUrl: '/checkout?mode=buynow'
      });
      navigate('/login', {
        state: {
          message: 'Please log in to continue.',
          from: '/checkout?mode=buynow'
        }
      });
      return;
    }

    sessionStorage.setItem('grove_buynow_item', JSON.stringify({
      product: prod,
      quantity: qty
    }));
    navigate('/checkout?mode=buynow');
  };

  // If product not found
  if (!product) {
    return (
      <main className="min-h-screen bg-[#F8FAF5] text-neutral-900 flex flex-col justify-between">
        <div>
          <div className="border-b border-neutral-200 bg-white/70 backdrop-blur-xs">
            <Navbar darkText={true} />
          </div>

          <div className="max-w-2xl mx-auto px-6 py-20 text-center">
            <div className="w-16 h-16 rounded-full bg-amber-50 border border-amber-200 text-amber-700 flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="w-8 h-8" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#081C15]">
              Product Not Found
            </h1>
            <p className="text-neutral-600 text-sm sm:text-base mt-2 max-w-md mx-auto">
              We couldn&apos;t find any item with ID &ldquo;{productId}&rdquo;. It may have been discontinued or moved to a different catalog.
            </p>
            <div className="mt-6 flex items-center justify-center gap-3">
              <Link
                to={categoryContext.url}
                className="inline-flex items-center gap-2 bg-[#1B4332] hover:bg-[#081C15] text-white font-bold text-xs sm:text-sm px-6 py-3 rounded-[12px] shadow-sm transition-all"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Return to {categoryContext.name}</span>
              </Link>
            </div>
          </div>
        </div>

        <Footer />
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#F8FAF5] text-neutral-900 flex flex-col justify-between font-sans">
      <div>
        {/* Shared GROVE Navbar with dark text styling */}
        <div className="border-b border-neutral-200/70 bg-white/80 backdrop-blur-xs sticky top-0 z-50">
          <Navbar darkText={true} />
        </div>

        {/* Sub-navbar Navigation Row: Left-Aligned Back Button */}
        <div className="border-b border-neutral-200/60 bg-white/50">
          <div className="max-w-[1440px] mx-auto px-4 sm:px-6 md:px-10 lg:px-16 py-2 sm:py-2.5 flex items-center justify-between">
            <button
              type="button"
              onClick={handleBack}
              className="inline-flex items-center gap-1.5 text-xs sm:text-[13px] font-bold text-[#1B4332] hover:text-[#081C15] bg-[#E9F3ED] hover:bg-[#d8ece0] px-3 py-1.5 rounded-[8px] transition-colors cursor-pointer select-none"
              aria-label="Back"
            >
              <ArrowLeft className="w-3.5 h-3.5 stroke-[2.2]" />
              <span>Back</span>
            </button>

            <div className="text-xs text-neutral-500 hidden sm:flex items-center gap-2">
              <Link to={categoryContext.url} className="hover:text-[#1B4332] font-semibold transition-colors">
                {categoryContext.name}
              </Link>
              <span>/</span>
              <span className="text-neutral-900 font-bold truncate max-w-[260px]">{product.name}</span>
            </div>
          </div>
        </div>

        {/* Main Product Container */}
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 md:px-10 lg:px-16 py-6 sm:py-8 lg:py-10">
          {/* 3-Column Layout on Desktop: Gallery (5 cols) | Info (4 cols) | Purchase Card (3 cols) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
            {/* Left Column: Image Gallery */}
            <div className="lg:col-span-5 w-full">
              <ProductImageGallery product={product} />
            </div>

            {/* Middle Column: Product Information */}
            <div className="lg:col-span-4 w-full">
              <ProductInfoColumn 
                product={product} 
                onJumpToReviews={handleJumpToReviews} 
              />
            </div>

            {/* Right Column: Sticky Purchase Panel */}
            <div className="lg:col-span-3 w-full lg:sticky lg:top-20 lg:self-start">
              <ProductPurchasePanel
                product={product}
                isWishlisted={isWishlisted(product.id)}
                onToggleWishlist={toggleWishlist}
                onAddToCart={addToCart}
                onBuyNow={handleBuyNow}
              />
            </div>
          </div>

          {/* Deep Details & Reviews Tabs */}
          <ProductSpecsAndReviewsTabs 
            product={product} 
            reviewsRef={reviewsRef} 
          />

          {/* Related Category Products */}
          {relatedProducts.length > 0 && (
            <section className="mt-14 pt-8 border-t border-neutral-200/80">
              <div className="flex items-center justify-between mb-5 flex-wrap gap-2">
                <div>
                  <div className="flex items-center gap-1.5 text-xs font-bold text-[#1B4332] uppercase tracking-wider mb-1">
                    <Sparkles className="w-3.5 h-3.5 text-[#40916C]" />
                    <span>Frequently Bought Together</span>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-extrabold text-[#081C15] tracking-tight">
                    Related in {categoryContext.name}
                  </h3>
                </div>

                <Link
                  to={categoryContext.url}
                  className="text-xs font-bold text-[#1B4332] hover:underline"
                >
                  View full category &rarr;
                </Link>
              </div>

              <div className="grid grid-cols-1 min-[480px]:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5">
                {relatedProducts.map((p) => (
                  <AgricultureProductCard
                    key={p.id}
                    product={p}
                    isWishlisted={wishlist.includes(p.id)}
                    onToggleWishlist={toggleWishlist}
                    onViewDetails={() => navigate(
                      p.id.startsWith('el-') 
                        ? `/electronics/product/${p.id}` 
                        : p.id.startsWith('au-') 
                          ? `/automotive/product/${p.id}` 
                          : `/agriculture/product/${p.id}`
                    )}
                    onAddToCart={addToCart}
                  />
                ))}
              </div>
            </section>
          )}

          {/* Recently Viewed Products */}
          {recentlyViewedProducts.length > 0 && (
            <section className="mt-14 pt-8 border-t border-neutral-200/80">
              <div className="flex items-center gap-1.5 text-xs font-bold text-neutral-500 uppercase tracking-wider mb-1">
                <History className="w-3.5 h-3.5 text-neutral-600" />
                <span>Your Browsing History</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-extrabold text-[#081C15] tracking-tight mb-5">
                Recently Viewed Items
              </h3>

              <div className="grid grid-cols-1 min-[480px]:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5">
                {recentlyViewedProducts.map((p) => (
                  <AgricultureProductCard
                    key={p.id}
                    product={p}
                    isWishlisted={wishlist.includes(p.id)}
                    onToggleWishlist={toggleWishlist}
                    onViewDetails={() => navigate(
                      p.id.startsWith('el-') 
                        ? `/electronics/product/${p.id}` 
                        : p.id.startsWith('au-') 
                          ? `/automotive/product/${p.id}` 
                          : `/agriculture/product/${p.id}`
                    )}
                    onAddToCart={addToCart}
                  />
                ))}
              </div>
            </section>
          )}
        </div>
      </div>

      {/* Floating Cart Indicator */}
      {totalCartCount > 0 && (
        <aside 
          aria-label="Shopping Cart Summary"
          className="fixed bottom-4 sm:bottom-6 right-4 sm:right-6 z-40 bg-[#081C15] text-white rounded-full pl-3.5 sm:pl-4 pr-4 sm:pr-5 py-2 sm:py-2.5 shadow-2xl border border-[#52B788]/40 flex items-center gap-2.5 sm:gap-3 animate-in slide-in-from-bottom-4 duration-300 select-none"
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
      {lastAddedItem && !buyNowNotification && (
        <div 
          role="status"
          aria-live="polite"
          className="fixed top-16 sm:top-20 right-4 sm:right-6 z-50 bg-[#081C15] text-white px-3.5 sm:px-4 py-2.5 sm:py-3 rounded-[16px] shadow-2xl border border-[#52B788] flex items-center gap-2.5 sm:gap-3 animate-in fade-in slide-in-from-top-3 duration-200 max-w-[90vw]"
        >
          <div className="w-2 h-2 rounded-full bg-[#52B788] animate-ping shrink-0" />
          <div className="text-xs truncate">
            <p className="font-bold text-white">Added to Cart</p>
            <p className="text-neutral-300 truncate max-w-[180px] sm:max-w-[220px]">{lastAddedItem.name}</p>
          </div>
        </div>
      )}

      {/* Buy Now Notification Drawer */}
      {buyNowNotification && (
        <div 
          role="dialog"
          aria-modal="true"
          className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-[92%] max-w-md bg-[#081C15] text-white p-4 rounded-[20px] shadow-2xl border border-[#52B788] flex items-center justify-between gap-4 animate-in slide-in-from-bottom-6 duration-200"
        >
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-9 h-9 rounded-full bg-[#52B788]/20 flex items-center justify-center text-[#52B788] shrink-0">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div className="text-xs truncate">
              <p className="font-bold text-white">Ready for Dispatch!</p>
              <p className="text-neutral-300 truncate">
                {buyNowNotification.quantity}x {buyNowNotification.product.name}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => setBuyNowNotification(null)}
              className="text-neutral-400 hover:text-white p-1 rounded-full cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Reused GROVE Footer */}
      <Footer />
    </main>
  );
}

