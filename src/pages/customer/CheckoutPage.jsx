import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { 
  Check, 
  MapPin, 
  Package, 
  CreditCard, 
  ShieldCheck, 
  Plus, 
  Edit3, 
  ChevronRight, 
  AlertCircle, 
  Building2, 
  Smartphone, 
  Banknote,
  ArrowLeft,
  Truck
} from 'lucide-react';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import AddressModal from '../../components/customer/AddressModal';
import { getStoredCustomer } from '../../utils/auth';
import { useCart } from '../../hooks/useCart';
import { 
  getCustomerAddresses, 
  getDefaultAddress, 
  setDefaultAddress as updateDefaultAddress 
} from '../../services/addressService';
import { 
  createOrder, 
  formatCurrency, 
  formatOrderDate 
} from '../../services/orderService';

export default function CheckoutPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const mode = searchParams.get('mode') || 'cart'; // 'cart' or 'buynow'

  const customer = getStoredCustomer();
  const { cart, removeFromCart } = useCart();

  // Active step: 1 (Address), 2 (Review Items), 3 (Payment)
  const [activeStep, setActiveStep] = useState(1);

  // Address state
  const [addresses, setAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [addressModalOpen, setAddressModalOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);

  // Payment state
  const [paymentMethod, setPaymentMethod] = useState('upi'); // 'upi', 'cod', 'card', 'netbanking'
  const [upiId, setUpiId] = useState('');
  const [cardData, setCardData] = useState({
    number: '',
    name: '',
    expiry: '',
    cvv: ''
  });
  const [selectedBank, setSelectedBank] = useState('HDFC Bank');
  const [paymentError, setPaymentError] = useState('');
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);

  // Load customer addresses
  const loadAddresses = () => {
    if (!customer?.id) return;
    const list = getCustomerAddresses(customer.id);
    setAddresses(list);
    if (!selectedAddressId && list.length > 0) {
      const def = list.find((a) => a.isDefault) || list[0];
      setSelectedAddressId(def.id);
    }
  };

  useEffect(() => {
    loadAddresses();
  }, [customer?.id]);

  // Determine items to checkout based on flow mode
  const checkoutItems = useMemo(() => {
    if (mode === 'buynow') {
      try {
        const raw = sessionStorage.getItem('grove_buynow_item');
        if (raw) {
          const parsed = JSON.parse(raw);
          if (parsed && parsed.product) {
            return [{
              ...parsed.product,
              quantity: parsed.quantity || 1
            }];
          }
        }
      } catch {
        return [];
      }
      return [];
    }

    // Default Cart Flow: retrieve selected IDs
    try {
      const raw = sessionStorage.getItem('grove_checkout_selected_ids');
      const selectedIds = raw ? JSON.parse(raw) : [];
      if (Array.isArray(selectedIds) && selectedIds.length > 0) {
        const idSet = new Set(selectedIds.map(String));
        return cart.filter((item) => idSet.has(String(item.id)));
      }
    } catch {}

    // Fallback: all items currently in cart
    return cart;
  }, [mode, cart]);

  // If no items are found for checkout, redirect back gracefully
  useEffect(() => {
    if (checkoutItems.length === 0) {
      // Don't redirect immediately if initial render
      const timer = setTimeout(() => {
        if (checkoutItems.length === 0) {
          navigate(mode === 'buynow' ? '/' : '/cart');
        }
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [checkoutItems, navigate, mode]);

  // Pricing calculations
  const pricing = useMemo(() => {
    let itemsTotal = 0;
    let mrpTotal = 0;

    checkoutItems.forEach((item) => {
      const qty = Math.max(1, parseInt(item.quantity, 10) || 1);
      const price = typeof item.price === 'number'
        ? item.price
        : parseFloat(String(item.price || '').replace(/[^0-9.]/g, '')) || 0;
      const mrp = item.originalPrice
        ? (typeof item.originalPrice === 'number' ? item.originalPrice : parseFloat(String(item.originalPrice).replace(/[^0-9.]/g, '')) || price)
        : (item.mrp || price);

      itemsTotal += price * qty;
      mrpTotal += (mrp > price ? mrp : price) * qty;
    });

    const discount = Math.max(0, mrpTotal - itemsTotal);
    const deliveryFee = itemsTotal > 500 || itemsTotal === 0 ? 0 : 49;
    const total = itemsTotal + deliveryFee;

    return {
      itemsTotal,
      mrpTotal,
      discount,
      deliveryFee,
      tax: 0,
      total
    };
  }, [checkoutItems]);

  const selectedAddress = useMemo(() => {
    return addresses.find((a) => a.id === selectedAddressId) || null;
  }, [addresses, selectedAddressId]);

  // Estimated delivery date (3 business days ahead)
  const deliveryEstimateDate = useMemo(() => {
    const d = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000);
    return formatOrderDate(d.toISOString());
  }, []);

  // Card formatting helpers
  const handleCardNumberChange = (e) => {
    const raw = e.target.value.replace(/\D/g, '').slice(0, 16);
    const formatted = raw.replace(/(.{4})/g, '$1 ').trim();
    setCardData((prev) => ({ ...prev, number: formatted }));
  };

  const handleExpiryChange = (e) => {
    let val = e.target.value.replace(/\D/g, '').slice(0, 4);
    if (val.length >= 3) {
      val = `${val.slice(0, 2)}/${val.slice(2, 4)}`;
    }
    setCardData((prev) => ({ ...prev, expiry: val }));
  };

  // Order Placement
  const handlePlaceOrder = () => {
    setPaymentError('');

    if (!selectedAddress) {
      setActiveStep(1);
      setPaymentError('Please select or add a delivery address.');
      return;
    }

    if (checkoutItems.length === 0) {
      setPaymentError('Your order contains no items.');
      return;
    }

    // Payment validation
    if (paymentMethod === 'upi') {
      if (!upiId || !upiId.includes('@')) {
        setActiveStep(3);
        setPaymentError('Please enter a valid UPI ID (e.g. username@okhdfcbank).');
        return;
      }
    } else if (paymentMethod === 'card') {
      const cleanNumber = cardData.number.replace(/\s+/g, '');
      if (cleanNumber.length < 15) {
        setActiveStep(3);
        setPaymentError('Please enter a valid 16-digit card number.');
        return;
      }
      if (!cardData.name.trim()) {
        setActiveStep(3);
        setPaymentError('Please enter the name on card.');
        return;
      }
      if (!cardData.expiry || cardData.expiry.length < 5) {
        setActiveStep(3);
        setPaymentError('Please enter expiry date (MM/YY).');
        return;
      }
      if (!cardData.cvv || cardData.cvv.length < 3) {
        setActiveStep(3);
        setPaymentError('Please enter valid 3-digit CVV.');
        return;
      }
    }

    setIsPlacingOrder(true);

    try {
      const paymentPayload = {
        method: paymentMethod,
        upiId: paymentMethod === 'upi' ? upiId : null,
        last4: paymentMethod === 'card' ? cardData.number.replace(/\s+/g, '').slice(-4) : null,
        cardBrand: paymentMethod === 'card' ? 'Visa / Rupay' : null,
        bankName: paymentMethod === 'netbanking' ? selectedBank : null
      };

      const result = createOrder(customer.id, {
        items: checkoutItems,
        shippingAddress: selectedAddress,
        pricing,
        payment: paymentPayload
      });

      if (result.success && result.order) {
        // Cleanup based on checkout flow
        if (mode === 'cart') {
          // Remove ordered items from customer's cart
          checkoutItems.forEach((item) => {
            removeFromCart(item.id);
          });
          sessionStorage.removeItem('grove_checkout_selected_ids');
        } else {
          // Clear buy now session item
          sessionStorage.removeItem('grove_buynow_item');
        }

        // Navigate to Order Confirmation
        navigate(`/order-confirmation/${result.order.orderId}`, { replace: true });
      }
    } catch (err) {
      setPaymentError(err.message || 'Failed to place order. Please try again.');
      setIsPlacingOrder(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F3FCF3]/40 flex flex-col">
      <div className="border-b border-neutral-200/70 bg-white/80 backdrop-blur-xs sticky top-0 z-30">
        <Navbar darkText={true} />
      </div>

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
        {/* Checkout Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-6 border-b border-gray-200 gap-4 mb-6">
          <div className="flex items-center gap-3">
            <Link
              to={mode === 'buynow' ? '/' : '/cart'}
              className="text-gray-500 hover:text-gray-900 p-2 rounded-xl bg-white border border-gray-200 hover:bg-gray-50 transition-colors"
              title="Return to shopping"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900 tracking-tight leading-tight">
                Secure Checkout
              </h1>
              <p className="text-xs text-gray-500 mt-0.5">
                {mode === 'buynow' ? 'Buy Now Fast Track' : 'Cart Checkout'} • {checkoutItems.length} {checkoutItems.length === 1 ? 'item' : 'items'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-800 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200 self-start sm:self-auto">
            <ShieldCheck className="w-4 h-4 text-emerald-700" />
            <span>256-Bit SSL Secure Checkout</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Multi-Step Accordion / Cards */}
          <div className="lg:col-span-8 space-y-6">

            {/* Error Notification */}
            {paymentError && (
              <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm flex items-center gap-3 animate-shake">
                <AlertCircle className="w-5 h-5 flex-shrink-0 text-red-600" />
                <p className="font-medium">{paymentError}</p>
              </div>
            )}

            {/* STEP 1: Delivery Address */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden transition-all">
              <div 
                className={`p-5 flex items-center justify-between border-b ${
                  activeStep === 1 ? 'bg-[#012D1D] text-white border-transparent' : 'bg-gray-50 text-gray-900 border-gray-200'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs ${
                    activeStep === 1 ? 'bg-white text-[#012D1D]' : 'bg-[#1B4332] text-white'
                  }`}>
                    1
                  </div>
                  <div>
                    <h2 className="text-sm font-bold uppercase tracking-wider">
                      Delivery Address
                    </h2>
                    {activeStep !== 1 && selectedAddress && (
                      <p className="text-xs text-gray-500 mt-0.5 font-normal">
                        Delivering to {selectedAddress.name}, {selectedAddress.city} – {selectedAddress.pincode}
                      </p>
                    )}
                  </div>
                </div>

                {activeStep !== 1 && (
                  <button
                    type="button"
                    onClick={() => setActiveStep(1)}
                    className="text-xs font-bold text-[#1B4332] hover:underline px-3 py-1.5 rounded-lg hover:bg-white transition-colors"
                  >
                    Change
                  </button>
                )}
              </div>

              {activeStep === 1 && (
                <div className="p-6 space-y-5">
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Select Delivery Address ({addresses.length}/5 Saved)
                    </p>
                    {addresses.length < 5 && (
                      <button
                        type="button"
                        onClick={() => {
                          setEditingAddress(null);
                          setAddressModalOpen(true);
                        }}
                        className="text-xs font-bold text-[#1B4332] hover:text-[#012D1D] flex items-center gap-1 hover:underline"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Add New Address</span>
                      </button>
                    )}
                  </div>

                  {addresses.length === 0 ? (
                    <div className="p-8 text-center bg-gray-50 rounded-xl border border-dashed border-gray-300">
                      <MapPin className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                      <p className="text-sm text-gray-600 font-medium mb-3">No addresses saved yet</p>
                      <button
                        type="button"
                        onClick={() => {
                          setEditingAddress(null);
                          setAddressModalOpen(true);
                        }}
                        className="px-4 py-2 bg-[#012D1D] text-white text-xs font-bold rounded-lg hover:bg-[#1B4332]"
                      >
                        Add Delivery Address
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {addresses.map((addr) => {
                        const isSelected = selectedAddressId === addr.id;
                        return (
                          <div
                            key={addr.id}
                            onClick={() => setSelectedAddressId(addr.id)}
                            className={`p-4 rounded-xl border cursor-pointer transition-all ${
                              isSelected
                                ? 'border-[#1B4332] bg-[#E9F3ED]/30 ring-2 ring-[#1B4332]'
                                : 'border-gray-200 hover:border-gray-300 bg-white'
                            }`}
                          >
                            <div className="flex items-start justify-between gap-3">
                              <div className="flex items-start gap-3">
                                <input
                                  type="radio"
                                  name="checkoutAddress"
                                  checked={isSelected}
                                  onChange={() => setSelectedAddressId(addr.id)}
                                  className="mt-1 w-4 h-4 text-[#1B4332] focus:ring-[#1B4332]"
                                />
                                <div>
                                  <div className="flex items-center gap-2">
                                    <span className="font-bold text-sm text-gray-900">{addr.name}</span>
                                    <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-gray-100 text-gray-700">
                                      {addr.type || 'Home'}
                                    </span>
                                    {addr.isDefault && (
                                      <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                                        Default
                                      </span>
                                    )}
                                  </div>
                                  <p className="text-xs text-gray-600 mt-1 leading-relaxed">
                                    {addr.house}, {addr.street}{addr.landmark ? `, ${addr.landmark}` : ''}, {addr.city}, {addr.state} – <span className="font-semibold text-gray-900">{addr.pincode}</span>
                                  </p>
                                  <p className="text-xs text-gray-500 mt-1">
                                    Mobile: <span className="font-medium text-gray-800">+91 {addr.mobile}</span>
                                  </p>
                                </div>
                              </div>

                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setEditingAddress(addr);
                                  setAddressModalOpen(true);
                                }}
                                className="text-xs text-gray-500 hover:text-gray-900 p-1.5 rounded-lg hover:bg-gray-100"
                                title="Edit address"
                              >
                                <Edit3 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {selectedAddress && (
                    <div className="pt-2 flex justify-end">
                      <button
                        type="button"
                        onClick={() => setActiveStep(2)}
                        className="px-6 py-2.5 rounded-xl bg-[#012D1D] hover:bg-[#1B4332] text-white text-xs font-bold transition-colors shadow-sm flex items-center gap-2"
                      >
                        <span>Deliver to this Address</span>
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* STEP 2: Review Order Items */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden transition-all">
              <div 
                className={`p-5 flex items-center justify-between border-b ${
                  activeStep === 2 ? 'bg-[#012D1D] text-white border-transparent' : 'bg-gray-50 text-gray-900 border-gray-200'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs ${
                    activeStep === 2 ? 'bg-white text-[#012D1D]' : 'bg-[#1B4332] text-white'
                  }`}>
                    2
                  </div>
                  <div>
                    <h2 className="text-sm font-bold uppercase tracking-wider">
                      Order Summary ({checkoutItems.length} {checkoutItems.length === 1 ? 'item' : 'items'})
                    </h2>
                    {activeStep !== 2 && (
                      <p className="text-xs text-gray-500 mt-0.5 font-normal">
                        Estimated Delivery by <span className="font-semibold text-gray-800">{deliveryEstimateDate}</span>
                      </p>
                    )}
                  </div>
                </div>

                {activeStep > 2 && (
                  <button
                    type="button"
                    onClick={() => setActiveStep(2)}
                    className="text-xs font-bold text-[#1B4332] hover:underline px-3 py-1.5 rounded-lg hover:bg-white transition-colors"
                  >
                    Review
                  </button>
                )}
              </div>

              {activeStep === 2 && (
                <div className="p-6 space-y-4">
                  <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-xs text-emerald-800 flex items-center gap-2 font-medium">
                    <Truck className="w-4 h-4 text-emerald-700 flex-shrink-0" />
                    <span>Guaranteed Express Delivery: Arriving by <strong>{deliveryEstimateDate}</strong></span>
                  </div>

                  <div className="divide-y divide-gray-100">
                    {checkoutItems.map((item) => {
                      const qty = Math.max(1, parseInt(item.quantity, 10) || 1);
                      const price = typeof item.price === 'number'
                        ? item.price
                        : parseFloat(String(item.price || '').replace(/[^0-9.]/g, '')) || 0;

                      return (
                        <div key={item.id} className="py-4 first:pt-0 last:pb-0 flex items-center gap-4">
                          <div className="w-16 h-16 rounded-xl bg-gray-50 border border-gray-100 p-2 flex-shrink-0 flex items-center justify-center">
                            <img
                              src={item.image || item.images?.[0] || '/images/prod-tractor.png'}
                              alt={item.name}
                              onError={(e) => {
                                e.target.src = '/images/prod-tractor.png';
                              }}
                              className="max-h-full max-w-full object-contain"
                            />
                          </div>

                          <div className="flex-1 min-w-0">
                            <span className="text-[10px] font-semibold text-[#1B4332] uppercase tracking-wider">
                              {item.category || 'Product'}
                            </span>
                            <h4 className="text-sm font-bold text-gray-900 truncate">
                              {item.name}
                            </h4>
                            <p className="text-xs text-gray-500">
                              Quantity: <span className="font-semibold text-gray-800">{qty}</span> • Seller: {item.dealerName || 'GROVE Authorized Dealer'}
                            </p>
                          </div>

                          <div className="text-right flex-shrink-0">
                            <div className="text-sm font-bold text-gray-900">
                              {formatCurrency(price * qty)}
                            </div>
                            {qty > 1 && (
                              <div className="text-[11px] text-gray-400">
                                {formatCurrency(price)} each
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
                    <button
                      type="button"
                      onClick={() => setActiveStep(1)}
                      className="text-xs font-semibold text-gray-600 hover:text-gray-900"
                    >
                      ← Back to Address
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveStep(3)}
                      className="px-6 py-2.5 rounded-xl bg-[#012D1D] hover:bg-[#1B4332] text-white text-xs font-bold transition-colors shadow-sm flex items-center gap-2"
                    >
                      <span>Continue to Payment</span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* STEP 3: Payment Gateway & Verification */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden transition-all">
              <div 
                className={`p-5 flex items-center justify-between border-b ${
                  activeStep === 3 ? 'bg-[#012D1D] text-white border-transparent' : 'bg-gray-50 text-gray-900 border-gray-200'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs ${
                    activeStep === 3 ? 'bg-white text-[#012D1D]' : 'bg-[#1B4332] text-white'
                  }`}>
                    3
                  </div>
                  <div>
                    <h2 className="text-sm font-bold uppercase tracking-wider">
                      Payment Method
                    </h2>
                    <p className="text-xs text-gray-400">
                      Select your preferred payment gateway method
                    </p>
                  </div>
                </div>
              </div>

              {activeStep === 3 && (
                <div className="p-6 space-y-6">

                  {/* Payment Method Selector */}
                  <div className="space-y-4">

                    {/* 1. UPI */}
                    <div className={`p-4 rounded-xl border transition-all ${
                      paymentMethod === 'upi' ? 'border-[#1B4332] bg-[#E9F3ED]/20 ring-2 ring-[#1B4332]' : 'border-gray-200 bg-white'
                    }`}>
                      <label className="flex items-start gap-3 cursor-pointer">
                        <input
                          type="radio"
                          name="paymentOption"
                          value="upi"
                          checked={paymentMethod === 'upi'}
                          onChange={() => setPaymentMethod('upi')}
                          className="mt-1 w-4 h-4 text-[#1B4332] focus:ring-[#1B4332]"
                        />
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-sm text-gray-900">UPI (Google Pay, PhonePe, Paytm, BHIM)</span>
                            <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded">
                              Instant Verification
                            </span>
                          </div>
                          <p className="text-xs text-gray-500 mt-0.5">Pay directly using your Virtual Payment Address (VPA)</p>

                          {paymentMethod === 'upi' && (
                            <div className="mt-4 pt-3 border-t border-gray-200 space-y-3">
                              <div>
                                <label className="block text-xs font-semibold text-gray-700 mb-1">
                                  Enter UPI ID / VPA
                                </label>
                                <div className="flex gap-2">
                                  <input
                                    type="text"
                                    value={upiId}
                                    onChange={(e) => setUpiId(e.target.value)}
                                    placeholder="user@upi"
                                    className="flex-1 px-3.5 py-2 text-sm rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#1B4332]"
                                  />
                                </div>
                              </div>

                              <div className="flex items-center gap-2 text-[11px] text-gray-500">
                                <span>Supported Handles:</span>
                                {['@okhdfcbank', '@okicici', '@oksbi', '@paytm'].map((handle) => (
                                  <button
                                    key={handle}
                                    type="button"
                                    onClick={() => setUpiId((prev) => (prev ? prev.split('@')[0] + handle : 'customer' + handle))}
                                    className="px-2 py-0.5 rounded bg-gray-100 hover:bg-gray-200 text-gray-700 font-mono text-[10px]"
                                  >
                                    {handle}
                                  </button>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </label>
                    </div>

                    {/* 2. Credit / Debit Card */}
                    <div className={`p-4 rounded-xl border transition-all ${
                      paymentMethod === 'card' ? 'border-[#1B4332] bg-[#E9F3ED]/20 ring-2 ring-[#1B4332]' : 'border-gray-200 bg-white'
                    }`}>
                      <label className="flex items-start gap-3 cursor-pointer">
                        <input
                          type="radio"
                          name="paymentOption"
                          value="card"
                          checked={paymentMethod === 'card'}
                          onChange={() => setPaymentMethod('card')}
                          className="mt-1 w-4 h-4 text-[#1B4332] focus:ring-[#1B4332]"
                        />
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-sm text-gray-900">Credit or Debit Card</span>
                            <div className="flex items-center gap-1.5 text-xs text-gray-400">
                              <span>Visa</span> • <span>Mastercard</span> • <span>RuPay</span>
                            </div>
                          </div>
                          <p className="text-xs text-gray-500 mt-0.5">Simulate payment with test credit or debit card</p>

                          {paymentMethod === 'card' && (
                            <div className="mt-4 pt-3 border-t border-gray-200 space-y-3">
                              <div className="flex justify-end">
                                <button
                                  type="button"
                                  onClick={() => setCardData({
                                    number: '4242 4242 4242 4242',
                                    name: customer?.name || 'Customer Account',
                                    expiry: '12/28',
                                    cvv: '888'
                                  })}
                                  className="text-xs font-bold text-[#1B4332] bg-[#E9F3ED] px-2.5 py-1 rounded-lg border border-[#c4e3cf]"
                                >
                                  Autofill Test Card
                                </button>
                              </div>

                              <div>
                                <label className="block text-xs font-semibold text-gray-700 mb-1">
                                  Card Number
                                </label>
                                <input
                                  type="text"
                                  value={cardData.number}
                                  onChange={handleCardNumberChange}
                                  placeholder="4242 4242 4242 4242"
                                  maxLength={19}
                                  className="w-full px-3.5 py-2 text-sm rounded-lg border border-gray-300 font-mono focus:outline-none focus:ring-2 focus:ring-[#1B4332]"
                                />
                              </div>

                              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                <div className="sm:col-span-1">
                                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                                    Name on Card
                                  </label>
                                  <input
                                    type="text"
                                    value={cardData.name}
                                    onChange={(e) => setCardData((p) => ({ ...p, name: e.target.value }))}
                                    placeholder={customer?.name || 'Cardholder Name'}
                                    className="w-full px-3 py-2 text-sm rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#1B4332]"
                                  />
                                </div>
                                <div>
                                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                                    Expiry Date
                                  </label>
                                  <input
                                    type="text"
                                    value={cardData.expiry}
                                    onChange={handleExpiryChange}
                                    placeholder="MM/YY"
                                    maxLength={5}
                                    className="w-full px-3 py-2 text-sm rounded-lg border border-gray-300 font-mono text-center focus:outline-none focus:ring-2 focus:ring-[#1B4332]"
                                  />
                                </div>
                                <div>
                                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                                    CVV
                                  </label>
                                  <input
                                    type="password"
                                    value={cardData.cvv}
                                    onChange={(e) => setCardData((p) => ({ ...p, cvv: e.target.value.replace(/\D/g, '').slice(0, 3) }))}
                                    placeholder="•••"
                                    maxLength={3}
                                    className="w-full px-3 py-2 text-sm rounded-lg border border-gray-300 font-mono text-center focus:outline-none focus:ring-2 focus:ring-[#1B4332]"
                                  />
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      </label>
                    </div>

                    {/* 3. Net Banking */}
                    <div className={`p-4 rounded-xl border transition-all ${
                      paymentMethod === 'netbanking' ? 'border-[#1B4332] bg-[#E9F3ED]/20 ring-2 ring-[#1B4332]' : 'border-gray-200 bg-white'
                    }`}>
                      <label className="flex items-start gap-3 cursor-pointer">
                        <input
                          type="radio"
                          name="paymentOption"
                          value="netbanking"
                          checked={paymentMethod === 'netbanking'}
                          onChange={() => setPaymentMethod('netbanking')}
                          className="mt-1 w-4 h-4 text-[#1B4332] focus:ring-[#1B4332]"
                        />
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-sm text-gray-900">Net Banking</span>
                            <span className="text-xs text-gray-500">All Major Indian Banks</span>
                          </div>
                          <p className="text-xs text-gray-500 mt-0.5">Transfer through simulated online banking portal</p>

                          {paymentMethod === 'netbanking' && (
                            <div className="mt-4 pt-3 border-t border-gray-200 space-y-3">
                              <label className="block text-xs font-semibold text-gray-700 mb-1">
                                Choose Bank
                              </label>
                              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                                {['HDFC Bank', 'State Bank of India', 'ICICI Bank', 'Axis Bank', 'Punjab National Bank', 'Kotak Mahindra'].map((b) => (
                                  <button
                                    key={b}
                                    type="button"
                                    onClick={() => setSelectedBank(b)}
                                    className={`p-2 rounded-lg text-xs font-medium border text-center transition-all ${
                                      selectedBank === b
                                        ? 'border-[#1B4332] bg-[#E9F3ED] text-[#012D1D] font-bold'
                                        : 'border-gray-200 bg-white text-gray-700 hover:bg-gray-50'
                                    }`}
                                  >
                                    {b}
                                  </button>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </label>
                    </div>

                    {/* 4. Cash on Delivery (COD) */}
                    <div className={`p-4 rounded-xl border transition-all ${
                      paymentMethod === 'cod' ? 'border-[#1B4332] bg-[#E9F3ED]/20 ring-2 ring-[#1B4332]' : 'border-gray-200 bg-white'
                    }`}>
                      <label className="flex items-start gap-3 cursor-pointer">
                        <input
                          type="radio"
                          name="paymentOption"
                          value="cod"
                          checked={paymentMethod === 'cod'}
                          onChange={() => setPaymentMethod('cod')}
                          className="mt-1 w-4 h-4 text-[#1B4332] focus:ring-[#1B4332]"
                        />
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-sm text-gray-900">Cash on Delivery (COD)</span>
                            <span className="text-[10px] font-bold text-gray-700 bg-gray-100 px-2 py-0.5 rounded">
                              Pay at Doorstep
                            </span>
                          </div>
                          <p className="text-xs text-gray-500 mt-0.5">Pay with Cash or QR scan when your shipment arrives</p>
                        </div>
                      </label>
                    </div>

                  </div>
                </div>
              )}
            </div>

          </div>

          {/* Right Column: Sticky Summary & Place Order */}
          <div className="lg:col-span-4 sticky top-6 space-y-4">
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 space-y-4">
              <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider pb-3 border-b border-gray-200">
                Payment Summary
              </h3>

              <div className="space-y-3 text-sm">
                <div className="flex justify-between text-gray-600">
                  <span>Items Total ({checkoutItems.length})</span>
                  <span>{formatCurrency(pricing.itemsTotal)}</span>
                </div>

                {pricing.discount > 0 && (
                  <div className="flex justify-between text-emerald-600 font-medium">
                    <span>Discount</span>
                    <span>− {formatCurrency(pricing.discount)}</span>
                  </div>
                )}

                <div className="flex justify-between text-gray-600">
                  <span>Delivery Charges</span>
                  <span>
                    {pricing.deliveryFee === 0 ? (
                      <span className="text-emerald-600 font-semibold">FREE</span>
                    ) : (
                      formatCurrency(pricing.deliveryFee)
                    )}
                  </span>
                </div>

                <div className="pt-3 border-t border-gray-200 flex justify-between items-baseline font-bold text-base text-gray-900">
                  <span>Order Total</span>
                  <span className="text-2xl text-[#012D1D]">{formatCurrency(pricing.total)}</span>
                </div>
              </div>

              {/* Delivery Address Snapshot */}
              {selectedAddress && (
                <div className="p-3 bg-gray-50 rounded-xl border border-gray-200 text-xs">
                  <div className="flex items-center justify-between font-bold text-gray-900 mb-1">
                    <span>Shipping To:</span>
                    <span className="text-[10px] text-[#1B4332] font-semibold bg-[#E9F3ED] px-1.5 py-0.5 rounded">
                      {selectedAddress.type}
                    </span>
                  </div>
                  <p className="text-gray-700 truncate font-medium">{selectedAddress.name}</p>
                  <p className="text-gray-500 truncate">{selectedAddress.house}, {selectedAddress.city} – {selectedAddress.pincode}</p>
                </div>
              )}

              {/* Place Order CTA Button */}
              <button
                type="button"
                onClick={handlePlaceOrder}
                disabled={isPlacingOrder || !selectedAddress || checkoutItems.length === 0}
                className="w-full py-4 rounded-xl bg-[#012D1D] hover:bg-[#1B4332] text-white font-bold text-sm shadow-lg hover:shadow-xl transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isPlacingOrder ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Processing Order...</span>
                  </>
                ) : (
                  <>
                    <span>Place Your Order</span>
                    <ChevronRight className="w-4 h-4" />
                  </>
                )}
              </button>

              <div className="text-center space-y-1">
                <p className="text-[11px] text-gray-500 flex items-center justify-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  Safe & Encrypted 256-Bit Payment Gateway
                </p>
                <p className="text-[10px] text-gray-400">
                  By placing an order, you agree to GROVE's Terms of Service and Privacy Policy.
                </p>
              </div>
            </div>
          </div>

        </div>
      </main>

      <Footer />

      {/* Reusable Address Modal */}
      <AddressModal
        isOpen={addressModalOpen}
        onClose={() => setAddressModalOpen(false)}
        initialData={editingAddress}
        customerId={customer?.id}
        onSaved={(savedAddr) => {
          loadAddresses();
          if (savedAddr && savedAddr.id) {
            setSelectedAddressId(savedAddr.id);
          }
        }}
      />
    </div>
  );
}

