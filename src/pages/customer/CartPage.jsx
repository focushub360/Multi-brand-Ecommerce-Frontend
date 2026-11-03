import React, { useState, useMemo, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  ShoppingCart, 
  Trash2, 
  Heart, 
  Plus, 
  Minus, 
  ShieldCheck, 
  Truck, 
  ArrowRight, 
  CheckCircle2, 
  AlertCircle,
  Tag
} from 'lucide-react';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import { useCart } from '../../hooks/useCart';
import { useWishlist } from '../../hooks/useWishlist';
import { formatCurrency } from '../../services/orderService';

export default function CartPage() {
  const navigate = useNavigate();
  const { cart, removeFromCart, updateQuantity, clearCart } = useCart();
  const { toggleWishlist, isWishlisted } = useWishlist();

  // Selected item IDs for checkout. Default to all items in cart.
  const [selectedIds, setSelectedIds] = useState(() => cart.map((i) => String(i.id)));
  const [feedbackMsg, setFeedbackMsg] = useState('');

  // Keep selectedIds in sync if cart items are deleted
  useEffect(() => {
    const validIds = new Set(cart.map((i) => String(i.id)));
    setSelectedIds((prev) => {
      const filtered = prev.filter((id) => validIds.has(id));
      // If newly added item, include it
      const added = cart.map((i) => String(i.id)).filter((id) => !prev.includes(id) && validIds.has(id));
      return [...filtered, ...added];
    });
  }, [cart]);

  const showToast = (msg) => {
    setFeedbackMsg(msg);
    setTimeout(() => setFeedbackMsg(''), 3000);
  };

  const isAllSelected = cart.length > 0 && selectedIds.length === cart.length;

  const handleToggleSelectAll = () => {
    if (isAllSelected) {
      setSelectedIds([]);
    } else {
      setSelectedIds(cart.map((i) => String(i.id)));
    }
  };

  const handleToggleSelectItem = (id) => {
    const idStr = String(id);
    setSelectedIds((prev) =>
      prev.includes(idStr) ? prev.filter((x) => x !== idStr) : [...prev, idStr]
    );
  };

  const handleMoveToWishlist = (item) => {
    if (!isWishlisted(item.id)) {
      toggleWishlist(item.id);
    }
    removeFromCart(item.id);
    showToast(`"${item.name}" moved to your Wishlist.`);
  };

  // Calculations for selected items
  const selectedItems = useMemo(() => {
    const idSet = new Set(selectedIds);
    return cart.filter((item) => idSet.has(String(item.id)));
  }, [cart, selectedIds]);

  const summary = useMemo(() => {
    let itemsTotal = 0;
    let mrpTotal = 0;
    let totalItemsCount = 0;

    selectedItems.forEach((item) => {
      const qty = Math.max(1, parseInt(item.quantity, 10) || 1);
      const price = typeof item.price === 'number'
        ? item.price
        : parseFloat(String(item.price || '').replace(/[^0-9.]/g, '')) || 0;
      const mrp = item.originalPrice
        ? (typeof item.originalPrice === 'number' ? item.originalPrice : parseFloat(String(item.originalPrice).replace(/[^0-9.]/g, '')) || price)
        : (item.mrp || price);

      itemsTotal += price * qty;
      mrpTotal += (mrp > price ? mrp : price) * qty;
      totalItemsCount += qty;
    });

    const discount = Math.max(0, mrpTotal - itemsTotal);
    // Free delivery if order total > 500, else ₹49 demo shipping fee
    const deliveryFee = itemsTotal > 500 || itemsTotal === 0 ? 0 : 49;
    const finalPayable = itemsTotal + deliveryFee;

    return {
      itemsTotal,
      mrpTotal,
      discount,
      deliveryFee,
      finalPayable,
      totalItemsCount
    };
  }, [selectedItems]);

  const handleProceedToCheckout = () => {
    if (selectedItems.length === 0) return;
    // Save selected IDs into sessionStorage so checkout knows which items to buy
    sessionStorage.setItem('grove_checkout_selected_ids', JSON.stringify(selectedIds));
    // Clear any previous buynow single item state
    sessionStorage.removeItem('grove_buynow_item');
    navigate('/checkout?mode=cart');
  };

  return (
    <div className="min-h-screen bg-[#F3FCF3]/40 flex flex-col">
      <div className="border-b border-neutral-200/70 bg-white/80 backdrop-blur-xs sticky top-0 z-30">
        <Navbar darkText={true} />
      </div>

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
        {/* Feedback Alert */}
        {feedbackMsg && (
          <div className="mb-6 p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 flex items-center justify-between shadow-sm animate-fadeIn">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
              <p className="text-sm font-medium">{feedbackMsg}</p>
            </div>
            <Link to="/wishlist" className="text-sm font-bold text-[#1B4332] underline hover:text-[#012D1D]">
              View Wishlist →
            </Link>
          </div>
        )}

        {/* Page Title */}
        <div className="pb-6 border-b border-gray-200 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight flex items-center gap-3">
              <span>Shopping Cart</span>
              <span className="text-sm font-semibold px-2.5 py-0.5 rounded-full bg-[#E9F3ED] text-[#1B4332] border border-[#c4e3cf]">
                {cart.length} {cart.length === 1 ? 'item' : 'items'}
              </span>
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Select items to proceed to checkout or save for later
            </p>
          </div>

          {cart.length > 0 && (
            <button
              onClick={() => {
                if (window.confirm('Are you sure you want to empty your entire cart?')) {
                  clearCart();
                }
              }}
              className="text-xs font-semibold text-red-600 hover:text-red-700 hover:bg-red-50 px-3 py-2 rounded-lg border border-red-200 transition-colors flex items-center gap-1.5 self-start sm:self-auto"
            >
              <Trash2 className="w-3.5 h-3.5" />
              Empty Cart
            </button>
          )}
        </div>

        {/* Empty State */}
        {cart.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center my-8 shadow-sm max-w-2xl mx-auto">
            <div className="w-20 h-20 rounded-full bg-[#E9F3ED] flex items-center justify-center mx-auto mb-4 text-[#1B4332]">
              <ShoppingCart className="w-10 h-10 text-[#1B4332]" />
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">Your GROVE Cart is empty</h2>
            <p className="text-sm text-gray-500 mb-8 max-w-md mx-auto">
              Your shopping cart is currently empty. Explore our catalogs for tractors, drone tech, solar pumps, and spares.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3">
              <Link
                to="/agriculture"
                className="px-5 py-2.5 rounded-xl bg-[#012D1D] text-white font-medium text-sm hover:bg-[#1B4332] transition-colors shadow-sm"
              >
                Shop Agriculture
              </Link>
              <Link
                to="/electronics"
                className="px-5 py-2.5 rounded-xl bg-white border border-gray-300 text-gray-700 font-medium text-sm hover:bg-gray-50 transition-colors"
              >
                Shop Electronics
              </Link>
              <Link
                to="/automotive"
                className="px-5 py-2.5 rounded-xl bg-white border border-gray-300 text-gray-700 font-medium text-sm hover:bg-gray-50 transition-colors"
              >
                Shop Spare Parts
              </Link>
            </div>
          </div>
        ) : (
          /* Cart Content Layout */
          <div className="mt-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left Column: Items */}
            <div className="lg:col-span-8 space-y-4">
              {/* Select All Bar */}
              <div className="bg-white rounded-xl border border-gray-200 p-4 flex items-center justify-between shadow-sm">
                <label className="flex items-center gap-3 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={isAllSelected}
                    onChange={handleToggleSelectAll}
                    className="w-4 h-4 text-[#1B4332] border-gray-300 rounded focus:ring-[#1B4332]"
                  />
                  <span className="text-sm font-semibold text-gray-800">
                    {isAllSelected ? 'Deselect all items' : 'Select all items'} ({selectedIds.length}/{cart.length} selected)
                  </span>
                </label>

                <span className="text-xs text-gray-500 font-medium">Price</span>
              </div>

              {/* Items List */}
              <div className="space-y-4">
                {cart.map((item) => {
                  const idStr = String(item.id);
                  const isSelected = selectedIds.includes(idStr);
                  const numericPrice = typeof item.price === 'number'
                    ? item.price
                    : parseFloat(String(item.price || '').replace(/[^0-9.]/g, '')) || 0;
                  const numericOriginal = item.originalPrice
                    ? (typeof item.originalPrice === 'number' ? item.originalPrice : parseFloat(String(item.originalPrice).replace(/[^0-9.]/g, '')) || numericPrice)
                    : numericPrice;
                  const hasDiscount = numericOriginal > numericPrice;

                  const cat = (item.category || '').toLowerCase();
                  const detailPath = cat.includes('elect') || idStr.startsWith('el-')
                    ? `/electronics/product/${item.id}`
                    : cat.includes('auto') || idStr.startsWith('au-')
                    ? `/automotive/product/${item.id}`
                    : `/agriculture/product/${item.id}`;

                  return (
                    <div
                      key={item.id}
                      className={`bg-white rounded-2xl border transition-all p-4 sm:p-5 shadow-sm ${
                        isSelected ? 'border-gray-200' : 'border-gray-200/60 opacity-70 bg-gray-50/50'
                      }`}
                    >
                      <div className="flex items-start gap-4">
                        {/* Checkbox */}
                        <div className="pt-2">
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => handleToggleSelectItem(item.id)}
                            className="w-4 h-4 text-[#1B4332] border-gray-300 rounded focus:ring-[#1B4332] cursor-pointer"
                          />
                        </div>

                        {/* Product Thumbnail */}
                        <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-xl bg-gray-50 border border-gray-100 flex-shrink-0 flex items-center justify-center p-2 overflow-hidden">
                          <img
                            src={item.image || item.images?.[0] || '/images/prod-tractor.png'}
                            alt={item.name}
                            onError={(e) => {
                              e.target.src = '/images/prod-tractor.png';
                            }}
                            className="max-h-full max-w-full object-contain"
                          />
                        </div>

                        {/* Product Details */}
                        <div className="flex-1 min-w-0 flex flex-col justify-between">
                          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
                            <div>
                              <span className="text-[11px] font-semibold text-[#1B4332] uppercase tracking-wider">
                                {item.category || 'Product'}
                              </span>
                              <Link
                                to={detailPath}
                                className="block font-bold text-gray-900 text-sm sm:text-base hover:text-[#1B4332] transition-colors line-clamp-2 mt-0.5"
                              >
                                {item.name}
                              </Link>
                              <p className="text-xs text-gray-500 mt-1">
                                Sold by: <span className="font-medium text-gray-700">{item.dealerName || 'GROVE Authorized Partner'}</span>
                              </p>
                              <div className="flex items-center gap-2 mt-1">
                                <span className="text-[11px] font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                                  In Stock
                                </span>
                                <span className="text-[11px] text-gray-500">Eligible for Free Delivery</span>
                              </div>
                            </div>

                            {/* Price */}
                            <div className="text-left sm:text-right flex-shrink-0">
                              <div className="text-base sm:text-lg font-bold text-gray-900">
                                {formatCurrency(numericPrice * (item.quantity || 1))}
                              </div>
                              {hasDiscount && (
                                <div className="text-xs text-gray-400 line-through">
                                  {formatCurrency(numericOriginal * (item.quantity || 1))}
                                </div>
                              )}
                              {item.quantity > 1 && (
                                <div className="text-[11px] text-gray-500">
                                  {formatCurrency(numericPrice)} each
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Bottom Row: Quantity Controls & Secondary Actions */}
                          <div className="mt-4 pt-3 border-t border-gray-100 flex flex-wrap items-center justify-between gap-3">
                            {/* Quantity Controls */}
                            <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden bg-white shadow-sm">
                              <button
                                type="button"
                                onClick={() => updateQuantity(item.id, -1)}
                                disabled={(item.quantity || 1) <= 1}
                                className="px-2.5 py-1 text-gray-600 hover:bg-gray-100 disabled:opacity-40 transition-colors"
                                title="Decrease quantity"
                              >
                                <Minus className="w-3.5 h-3.5" />
                              </button>
                              <span className="px-3 py-1 text-xs font-bold text-gray-800 min-w-[28px] text-center">
                                {item.quantity || 1}
                              </span>
                              <button
                                type="button"
                                onClick={() => updateQuantity(item.id, 1)}
                                className="px-2.5 py-1 text-gray-600 hover:bg-gray-100 transition-colors"
                                title="Increase quantity"
                              >
                                <Plus className="w-3.5 h-3.5" />
                              </button>
                            </div>

                            {/* Actions */}
                            <div className="flex items-center gap-4 text-xs font-semibold">
                              <button
                                type="button"
                                onClick={() => handleMoveToWishlist(item)}
                                className="text-gray-600 hover:text-[#1B4332] flex items-center gap-1.5 transition-colors"
                              >
                                <Heart className="w-3.5 h-3.5" />
                                <span>Save for later</span>
                              </button>

                              <button
                                type="button"
                                onClick={() => removeFromCart(item.id)}
                                className="text-red-600 hover:text-red-700 flex items-center gap-1.5 transition-colors"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                                <span>Remove</span>
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Guarantees Banner */}
              <div className="bg-white rounded-xl border border-gray-200 p-4 grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs text-gray-600">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-[#E9F3ED] flex items-center justify-center text-[#1B4332] flex-shrink-0">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-semibold text-gray-900 block">100% Genuine</span>
                    <span>Direct from certified dealers</span>
                  </div>
                </div>

                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-[#E9F3ED] flex items-center justify-center text-[#1B4332] flex-shrink-0">
                    <Truck className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-semibold text-gray-900 block">Safe Transport</span>
                    <span>Machinery & cargo insured</span>
                  </div>
                </div>

                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-[#E9F3ED] flex items-center justify-center text-[#1B4332] flex-shrink-0">
                    <Tag className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-semibold text-gray-900 block">Best Price Assured</span>
                    <span>Direct transparent billing</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Price Details Sidebar */}
            <div className="lg:col-span-4 sticky top-6">
              <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 space-y-4">
                <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider pb-3 border-b border-gray-200">
                  Price Details ({summary.totalItemsCount} {summary.totalItemsCount === 1 ? 'item' : 'items'})
                </h3>

                <div className="space-y-3 text-sm">
                  <div className="flex justify-between text-gray-600">
                    <span>Total MRP</span>
                    <span>{formatCurrency(summary.mrpTotal)}</span>
                  </div>

                  {summary.discount > 0 && (
                    <div className="flex justify-between text-emerald-600 font-medium">
                      <span>Discount on MRP</span>
                      <span>− {formatCurrency(summary.discount)}</span>
                    </div>
                  )}

                  <div className="flex justify-between text-gray-600">
                    <span>Delivery Charges</span>
                    <span>
                      {summary.deliveryFee === 0 ? (
                        <span className="text-emerald-600 font-semibold">FREE</span>
                      ) : (
                        formatCurrency(summary.deliveryFee)
                      )}
                    </span>
                  </div>

                  <div className="pt-3 border-t border-gray-200 flex justify-between items-baseline font-bold text-base text-gray-900">
                    <span>Total Payable</span>
                    <span className="text-xl text-[#012D1D]">{formatCurrency(summary.finalPayable)}</span>
                  </div>
                </div>

                {summary.discount > 0 && (
                  <div className="p-2.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold text-center">
                    You will save {formatCurrency(summary.discount)} on this purchase!
                  </div>
                )}

                {selectedItems.length === 0 ? (
                  <div className="p-3 bg-amber-50 border border-amber-200 text-amber-800 text-xs rounded-xl flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 flex-shrink-0" />
                    <span>Please select at least one item from the cart to proceed.</span>
                  </div>
                ) : null}

                <button
                  type="button"
                  onClick={handleProceedToCheckout}
                  disabled={selectedItems.length === 0}
                  className="w-full py-3.5 rounded-xl bg-[#012D1D] hover:bg-[#1B4332] text-white font-bold text-sm shadow-md transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  <span>Proceed to Checkout</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <p className="text-[11px] text-gray-400 text-center">
                  Safe & Secure Checkout • Demo Payment Simulation
                </p>
              </div>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
