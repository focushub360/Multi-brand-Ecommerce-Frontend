import React, { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Heart, ShoppingBag, Trash2, ArrowRight, CheckCircle2, ShieldCheck, Truck } from 'lucide-react';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import { useWishlist } from '../../hooks/useWishlist';
import { useCart } from '../../hooks/useCart';
import { formatCurrency } from '../../services/orderService';
import { productsApi } from '../../services/apiClient.js';

export default function WishlistPage() {
  const navigate = useNavigate();
  const { wishlist, removeFromWishlist, clearWishlist } = useWishlist();
  const { addToCart } = useCart();
  const [feedbackMsg, setFeedbackMsg] = useState('');
  const [asyncProducts, setAsyncProducts] = useState({});

  // Resolve products from backend API for items in wishlist
  React.useEffect(() => {
    wishlist.forEach((id) => {
      if (!asyncProducts[id]) {
        productsApi.getByIdOrSlug(id)
          .then((p) => {
            if (p) {
              setAsyncProducts((prev) => ({
                ...prev,
                [id]: {
                  id: p.id || p._id,
                  name: p.name,
                  price: p.price,
                  originalPrice: p.originalPrice || p.mrp || p.price,
                  image: p.image,
                  category: p.subcategory || p.categoryName || 'General',
                  dealerName: p.dealerName || 'GROVE Authorized Dealer',
                  inStock: (p.stock !== undefined ? p.stock > 0 : true)
                }
              }));
            }
          })
          .catch(() => {});
      }
    });
  }, [wishlist, asyncProducts]);

  // Resolve full product objects for all items in wishlist
  const resolvedProducts = useMemo(() => {
    return wishlist
      .map((id) => asyncProducts[id])
      .filter(Boolean);
  }, [wishlist, asyncProducts]);

  const showToast = (msg) => {
    setFeedbackMsg(msg);
    setTimeout(() => setFeedbackMsg(''), 3000);
  };

  const handleMoveToCart = (product) => {
    addToCart(product, 1);
    removeFromWishlist(product.id);
    showToast(`"${product.name}" moved to cart successfully.`);
  };

  const handleBuyNow = (product) => {
    sessionStorage.setItem(
      'grove_buynow_item',
      JSON.stringify({
        product,
        quantity: 1
      })
    );
    navigate('/checkout?mode=buynow');
  };

  return (
    <div className="min-h-screen bg-[#F3FCF3]/40 flex flex-col">
      <div className="border-b border-neutral-200/70 bg-white/80 backdrop-blur-xs sticky top-0 z-30">
        <Navbar darkText={true} />
      </div>

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
        {/* Toast Alert */}
        {feedbackMsg && (
          <div className="mb-6 p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 flex items-center justify-between shadow-sm animate-fadeIn">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
              <p className="text-sm font-medium">{feedbackMsg}</p>
            </div>
            <Link to="/cart" className="text-sm font-bold text-[#1B4332] underline hover:text-[#012D1D]">
              View Cart →
            </Link>
          </div>
        )}

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-6 border-b border-gray-200 gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight flex items-center gap-2.5">
              <span>My Wishlist</span>
              <span className="text-sm font-semibold px-2.5 py-0.5 rounded-full bg-[#E9F3ED] text-[#1B4332] border border-[#c4e3cf]">
                {resolvedProducts.length} {resolvedProducts.length === 1 ? 'item' : 'items'}
              </span>
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Items saved to purchase later or monitor price updates
            </p>
          </div>

          {resolvedProducts.length > 0 && (
            <button
              onClick={() => {
                if (window.confirm('Are you sure you want to clear your entire wishlist?')) {
                  clearWishlist();
                }
              }}
              className="text-xs font-semibold text-red-600 hover:text-red-700 hover:bg-red-50 px-3 py-2 rounded-lg border border-red-200 transition-colors flex items-center gap-1.5 self-start sm:self-auto"
            >
              <Trash2 className="w-3.5 h-3.5" />
              Clear Wishlist
            </button>
          )}
        </div>

        {/* Empty State */}
        {resolvedProducts.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center my-8 shadow-sm max-w-2xl mx-auto">
            <div className="w-20 h-20 rounded-full bg-[#E9F3ED] flex items-center justify-center mx-auto mb-4 text-[#1B4332]">
              <Heart className="w-10 h-10 text-[#1B4332]" />
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">Your wishlist is empty</h2>
            <p className="text-sm text-gray-500 mb-8 max-w-md mx-auto">
              Explore our marketplace to find farm equipment, precision electronics, and genuine automotive spares.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3">
              <Link
                to="/agriculture"
                className="px-5 py-2.5 rounded-xl bg-[#012D1D] text-white font-medium text-sm hover:bg-[#1B4332] transition-colors shadow-sm"
              >
                Explore Agriculture
              </Link>
              <Link
                to="/electronics"
                className="px-5 py-2.5 rounded-xl bg-white border border-gray-300 text-gray-700 font-medium text-sm hover:bg-gray-50 transition-colors"
              >
                Browse Electronics
              </Link>
              <Link
                to="/automotive"
                className="px-5 py-2.5 rounded-xl bg-white border border-gray-300 text-gray-700 font-medium text-sm hover:bg-gray-50 transition-colors"
              >
                Spare Parts Catalog
              </Link>
            </div>
          </div>
        ) : (
          /* Products Grid */
          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {resolvedProducts.map((product) => {
              const numericPrice = typeof product.price === 'number' 
                ? product.price 
                : parseFloat(String(product.price || '').replace(/[^0-9.]/g, '')) || 0;
              const numericOriginal = product.originalPrice 
                ? (typeof product.originalPrice === 'number' ? product.originalPrice : parseFloat(String(product.originalPrice).replace(/[^0-9.]/g, '')) || numericPrice)
                : numericPrice;
              const hasDiscount = numericOriginal > numericPrice;
              const discountPct = hasDiscount 
                ? Math.round(((numericOriginal - numericPrice) / numericOriginal) * 100) 
                : null;

              const cat = (product.category || '').toLowerCase();
              const idStr = String(product.id || '').toLowerCase();
              const detailPath = cat.includes('elect') || idStr.startsWith('el-')
                ? `/electronics/product/${product.id}`
                : cat.includes('auto') || idStr.startsWith('au-')
                ? `/automotive/product/${product.id}`
                : `/agriculture/product/${product.id}`;

              return (
                <div
                  key={product.id}
                  className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow flex flex-col group"
                >
                  {/* Image & Badges */}
                  <div className="relative aspect-[4/3] bg-gray-50 overflow-hidden flex items-center justify-center p-4">
                    <img
                      src={product.image || product.images?.[0] || '/images/prod-tractor.png'}
                      alt={product.name}
                      onError={(e) => {
                        e.target.src = '/images/prod-tractor.png';
                      }}
                      className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-300"
                    />

                    {discountPct && (
                      <span className="absolute top-3 left-3 bg-red-600 text-white text-xs font-bold px-2 py-0.5 rounded-md shadow-sm">
                        {discountPct}% OFF
                      </span>
                    )}

                    <button
                      type="button"
                      onClick={() => removeFromWishlist(product.id)}
                      className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 backdrop-blur-sm border border-gray-200 flex items-center justify-center text-gray-500 hover:text-red-600 hover:bg-white shadow-sm transition-colors"
                      title="Remove from Wishlist"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Content */}
                  <div className="p-4 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
                        <span className="font-medium text-[#1B4332] uppercase tracking-wider text-[10px]">
                          {product.category || 'Marketplace'}
                        </span>
                        <span className="text-gray-400">
                          {product.dealerName || 'Authorized Dealer'}
                        </span>
                      </div>

                      <Link
                        to={detailPath}
                        className="font-bold text-gray-900 text-sm line-clamp-2 hover:text-[#1B4332] transition-colors mb-2"
                      >
                        {product.name}
                      </Link>

                      {/* Pricing */}
                      <div className="flex items-baseline gap-2 mb-3">
                        <span className="text-lg font-bold text-gray-900">
                          {formatCurrency(numericPrice)}
                        </span>
                        {hasDiscount && (
                          <span className="text-xs text-gray-400 line-through">
                            {formatCurrency(numericOriginal)}
                          </span>
                        )}
                      </div>

                      {/* Assurances */}
                      <div className="flex items-center gap-3 text-[11px] text-gray-500 pb-3 border-b border-gray-100">
                        <span className="flex items-center gap-1 text-emerald-700">
                          <Truck className="w-3.5 h-3.5" /> Free Delivery
                        </span>
                        <span className="flex items-center gap-1 text-gray-600">
                          <ShieldCheck className="w-3.5 h-3.5" /> Verified
                        </span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="pt-3 space-y-2">
                      <button
                        type="button"
                        onClick={() => handleMoveToCart(product)}
                        className="w-full py-2.5 rounded-xl bg-[#012D1D] hover:bg-[#1B4332] text-white text-xs font-bold transition-colors flex items-center justify-center gap-2 shadow-sm"
                      >
                        <ShoppingBag className="w-3.5 h-3.5" />
                        Move to Cart
                      </button>

                      <button
                        type="button"
                        onClick={() => handleBuyNow(product)}
                        className="w-full py-2 rounded-xl bg-[#E9F3ED] hover:bg-[#d8ecdf] text-[#012D1D] text-xs font-bold border border-[#c4e3cf] transition-colors flex items-center justify-center gap-1.5"
                      >
                        <span>Buy Now</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
