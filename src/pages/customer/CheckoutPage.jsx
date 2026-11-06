
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
  ArrowLeft,
  Truck
} from 'lucide-react';

import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import AddressModal from '../../components/customer/AddressModal';

import { getStoredCustomer } from '../../utils/auth';
import { useCart } from '../../hooks/useCart';

import {
  getCustomerAddresses
} from '../../services/addressService';

import {
  createOrder,
  formatCurrency,
  formatOrderDate
} from '../../services/orderService';

export default function CheckoutPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const mode = searchParams.get('mode') || 'cart';

  const customer = getStoredCustomer();
  const { cart, removeFromCart } = useCart();

  const [activeStep, setActiveStep] = useState(1);

  // Address State
  const [addresses, setAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [addressModalOpen, setAddressModalOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);

  // Payment State
  const [paymentMethod, setPaymentMethod] = useState('upi');
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

  // Load Addresses
  const loadAddresses = () => {
    if (!customer?.id) return;

    const list = getCustomerAddresses(customer.id);

    setAddresses(list);

    setSelectedAddressId((previousId) => {
      if (previousId && list.some((a) => a.id === previousId)) {
        return previousId;
      }

      const defaultAddress = list.find((a) => a.isDefault) || list[0];

      return defaultAddress?.id || null;
    });
  };

  useEffect(() => {
    loadAddresses();
  }, [customer?.id]);

  // Checkout Items
  const checkoutItems = useMemo(() => {
    if (mode === 'buynow') {
      try {
        const raw = sessionStorage.getItem('grove_buynow_item');

        if (raw) {
          const parsed = JSON.parse(raw);

          if (parsed?.product) {
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

    try {
      const raw = sessionStorage.getItem('grove_checkout_selected_ids');
      const selectedIds = raw ? JSON.parse(raw) : [];

      if (Array.isArray(selectedIds) && selectedIds.length > 0) {
        const idSet = new Set(selectedIds.map(String));

        return cart.filter((item) =>
          idSet.has(String(item.id))
        );
      }
    } catch {
      // Use complete cart as fallback
    }

    return cart;
  }, [mode, cart]);

  // Empty Checkout Redirect
  useEffect(() => {
    if (checkoutItems.length === 0) {
      const timer = setTimeout(() => {
        navigate(mode === 'buynow' ? '/' : '/cart');
      }, 300);

      return () => clearTimeout(timer);
    }
  }, [checkoutItems, navigate, mode]);

  // Pricing
  const pricing = useMemo(() => {
    let itemsTotal = 0;
    let mrpTotal = 0;

    checkoutItems.forEach((item) => {
      const qty = Math.max(1, parseInt(item.quantity, 10) || 1);

      const price =
        typeof item.price === 'number'
          ? item.price
          : parseFloat(
              String(item.price || '').replace(/[^0-9.]/g, '')
            ) || 0;

      const mrp = item.originalPrice
        ? (
            typeof item.originalPrice === 'number'
              ? item.originalPrice
              : parseFloat(
                  String(item.originalPrice).replace(/[^0-9.]/g, '')
                ) || price
          )
        : item.mrp || price;

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

  // Selected Address
  const selectedAddress = useMemo(() => {
    return addresses.find(
      (a) => a.id === selectedAddressId
    ) || null;
  }, [addresses, selectedAddressId]);

  // Delivery Estimate
  const deliveryEstimateDate = useMemo(() => {
    const date = new Date(
      Date.now() + 3 * 24 * 60 * 60 * 1000
    );

    return formatOrderDate(date.toISOString());
  }, []);

  // Card Number
  const handleCardNumberChange = (e) => {
    const raw = e.target.value
      .replace(/\D/g, '')
      .slice(0, 16);

    const formatted = raw
      .replace(/(.{4})/g, '$1 ')
      .trim();

    setCardData((prev) => ({
      ...prev,
      number: formatted
    }));
  };

  // Expiry Date
  const handleExpiryChange = (e) => {
    let value = e.target.value
      .replace(/\D/g, '')
      .slice(0, 4);

    if (value.length >= 3) {
      value = `${value.slice(0, 2)}/${value.slice(2, 4)}`;
    }

    setCardData((prev) => ({
      ...prev,
      expiry: value
    }));
  };

  // Place Order
  const handlePlaceOrder = () => {
    setPaymentError('');

    if (!customer?.id) {
      setPaymentError('Please login before placing an order.');
      return;
    }

    if (!selectedAddress) {
      setActiveStep(1);
      setPaymentError('Please select or add a delivery address.');
      return;
    }

    if (checkoutItems.length === 0) {
      setPaymentError('Your order contains no items.');
      return;
    }

    // UPI Validation
    if (paymentMethod === 'upi') {
      if (!upiId || !upiId.includes('@')) {
        setActiveStep(3);
        setPaymentError('Please enter a valid UPI ID.');
        return;
      }
    }

    // Card Validation
    if (paymentMethod === 'card') {
      const cleanNumber = cardData.number.replace(/\s+/g, '');

      if (cleanNumber.length < 15) {
        setActiveStep(3);
        setPaymentError('Please enter a valid card number.');
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
        setPaymentError('Please enter valid CVV.');
        return;
      }
    }

    setIsPlacingOrder(true);

    try {
      const paymentPayload = {
        method: paymentMethod,
        upiId: paymentMethod === 'upi' ? upiId : null,
        last4:
          paymentMethod === 'card'
            ? cardData.number.replace(/\s+/g, '').slice(-4)
            : null,
        cardBrand:
          paymentMethod === 'card'
            ? 'Visa / Rupay'
            : null,
        bankName:
          paymentMethod === 'netbanking'
            ? selectedBank
            : null
      };

      // Preserve Grocery and Other Product Details
      const orderItems = checkoutItems.map((item) => ({
        ...item,
        id: item.id,
        name: item.name,
        price: item.price,
        originalPrice: item.originalPrice,
        quantity: item.quantity || 1,
        image: item.image || item.images?.[0] || '',
        category: item.category || 'Product'
      }));

      const result = createOrder(customer.id, {
        items: orderItems,
        shippingAddress: selectedAddress,
        pricing,
        payment: paymentPayload
      });

      if (result.success && result.order) {
        if (mode === 'cart') {
          checkoutItems.forEach((item) => {
            removeFromCart(item.id);
          });

          sessionStorage.removeItem(
            'grove_checkout_selected_ids'
          );
        } else {
          sessionStorage.removeItem('grove_buynow_item');
        }

        navigate(
          `/order-confirmation/${result.order.orderId}`,
          { replace: true }
        );
      } else {
        throw new Error('Unable to create your order.');
      }
    } catch (err) {
      setPaymentError(
        err.message || 'Failed to place order. Please try again.'
      );

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
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>

            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900 tracking-tight">
                Secure Checkout
              </h1>

              <p className="text-xs text-gray-500 mt-0.5">
                {mode === 'buynow' ? 'Buy Now Fast Track' : 'Cart Checkout'}
                {' • '}
                {checkoutItems.length}{' '}
                {checkoutItems.length === 1 ? 'item' : 'items'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-800 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200">
            <ShieldCheck className="w-4 h-4" />
            <span>256-Bit SSL Demo Checkout</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

          {/* Left Column */}
          <div className="lg:col-span-8 space-y-6">

            {/* Error */}
            {paymentError && (
              <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm flex items-center gap-3">
                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                <p className="font-medium">{paymentError}</p>
              </div>
            )}

            {/* STEP 1 ADDRESS */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">

              <div className={`p-5 flex items-center justify-between border-b ${
                activeStep === 1
                  ? 'bg-[#012D1D] text-white border-transparent'
                  : 'bg-gray-50 text-gray-900 border-gray-200'
              }`}>
                <div className="flex items-center gap-3">
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs ${
                    activeStep === 1
                      ? 'bg-white text-[#012D1D]'
                      : 'bg-[#1B4332] text-white'
                  }`}>
                    1
                  </div>

                  <div>
                    <h2 className="text-sm font-bold uppercase tracking-wider">
                      Delivery Address
                    </h2>

                    {activeStep !== 1 && selectedAddress && (
                      <p className="text-xs text-gray-500 mt-0.5">
                        Delivering to {selectedAddress.name}, {selectedAddress.city} – {selectedAddress.pincode}
                      </p>
                    )}
                  </div>
                </div>

                {activeStep !== 1 && (
                  <button
                    type="button"
                    onClick={() => setActiveStep(1)}
                    className="text-xs font-bold text-[#1B4332] hover:underline"
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
                        className="text-xs font-bold text-[#1B4332] flex items-center gap-1"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        Add New Address
                      </button>
                    )}
                  </div>

                  {addresses.length === 0 ? (
                    <div className="p-8 text-center bg-gray-50 rounded-xl border border-dashed border-gray-300">
                      <MapPin className="w-8 h-8 text-gray-400 mx-auto mb-2" />

                      <p className="text-sm text-gray-600 font-medium mb-3">
                        No addresses saved yet
                      </p>

                      <button
                        type="button"
                        onClick={() => {
                          setEditingAddress(null);
                          setAddressModalOpen(true);
                        }}
                        className="px-4 py-2 bg-[#012D1D] text-white text-xs font-bold rounded-lg"
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
                                  className="mt-1 w-4 h-4"
                                />

                                <div>
                                  <div className="flex items-center gap-2">
                                    <span className="font-bold text-sm text-gray-900">
                                      {addr.name}
                                    </span>

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
                                    {addr.house}, {addr.street}
                                    {addr.landmark ? `, ${addr.landmark}` : ''},
                                    {' '}{addr.city}, {addr.state} – {addr.pincode}
                                  </p>

                                  <p className="text-xs text-gray-500 mt-1">
                                    Mobile: +91 {addr.mobile}
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
                        onClick={() => {
                          setPaymentError('');
                          setActiveStep(2);
                        }}
                        className="px-6 py-2.5 rounded-xl bg-[#012D1D] text-white text-xs font-bold flex items-center gap-2"
                      >
                        Deliver to this Address
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* STEP 2 REVIEW ITEMS */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">

              <div className={`p-5 flex items-center justify-between border-b ${
                activeStep === 2
                  ? 'bg-[#012D1D] text-white border-transparent'
                  : 'bg-gray-50 text-gray-900 border-gray-200'
              }`}>
                <div className="flex items-center gap-3">
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs ${
                    activeStep === 2
                      ? 'bg-white text-[#012D1D]'
                      : 'bg-[#1B4332] text-white'
                  }`}>
                    2
                  </div>

                  <div>
                    <h2 className="text-sm font-bold uppercase tracking-wider">
                      Order Summary ({checkoutItems.length} items)
                    </h2>

                    {activeStep !== 2 && (
                      <p className="text-xs text-gray-500 mt-0.5">
                        Estimated Delivery by {deliveryEstimateDate}
                      </p>
                    )}
                  </div>
                </div>

                {activeStep !== 2 && (
                  <button
                    type="button"
                    onClick={() => setActiveStep(2)}
                    className="text-xs font-bold text-[#1B4332] hover:underline"
                  >
                    Review
                  </button>
                )}
              </div>

              {activeStep === 2 && (
                <div className="p-6 space-y-4">

                  <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-xs text-emerald-800 flex items-center gap-2 font-medium">
                    <Truck className="w-4 h-4" />
                    <span>
                      Estimated Delivery: <strong>{deliveryEstimateDate}</strong>
                    </span>
                  </div>

                  <div className="divide-y divide-gray-100">
                    {checkoutItems.map((item) => {
                      const qty = Math.max(
                        1,
                        parseInt(item.quantity, 10) || 1
                      );

                      const price =
                        typeof item.price === 'number'
                          ? item.price
                          : parseFloat(
                              String(item.price || '').replace(/[^0-9.]/g, '')
                            ) || 0;

                      return (
                        <div
                          key={item.id}
                          className="py-4 first:pt-0 last:pb-0 flex items-center gap-4"
                        >
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
                              Quantity: {qty} • Seller: {item.dealerName || 'GROVE Authorized Dealer'}
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
                      className="text-xs font-semibold text-gray-600"
                    >
                      ← Back to Address
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setPaymentError('');
                        setActiveStep(3);
                      }}
                      className="px-6 py-2.5 rounded-xl bg-[#012D1D] text-white text-xs font-bold flex items-center gap-2"
                    >
                      Continue to Payment
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* STEP 3 PAYMENT */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">

              <div className={`p-5 flex items-center justify-between border-b ${
                activeStep === 3
                  ? 'bg-[#012D1D] text-white border-transparent'
                  : 'bg-gray-50 text-gray-900 border-gray-200'
              }`}>
                <div className="flex items-center gap-3">
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs ${
                    activeStep === 3
                      ? 'bg-white text-[#012D1D]'
                      : 'bg-[#1B4332] text-white'
                  }`}>
                    3
                  </div>

                  <div>
                    <h2 className="text-sm font-bold uppercase tracking-wider">
                      Payment Method
                    </h2>

                    <p className="text-xs text-gray-400">
                      Demo payment • No real money charged
                    </p>
                  </div>
                </div>
              </div>

              {activeStep === 3 && (
                <div className="p-6 space-y-6">

                  <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs">
                    <strong>Demo Payment Simulation:</strong>
                    {' '}Select a payment method to test order placement. No real payment will be processed.
                  </div>

                  {/* UPI */}
                  <div className={`p-4 rounded-xl border ${
                    paymentMethod === 'upi'
                      ? 'border-[#1B4332] bg-[#E9F3ED]/20 ring-2 ring-[#1B4332]'
                      : 'border-gray-200'
                  }`}>
                    <label className="flex items-start gap-3 cursor-pointer">
                      <input
                        type="radio"
                        name="paymentOption"
                        checked={paymentMethod === 'upi'}
                        onChange={() => setPaymentMethod('upi')}
                        className="mt-1 w-4 h-4"
                      />

                      <div className="flex-1">
                        <span className="font-bold text-sm text-gray-900">
                          UPI (Google Pay, PhonePe, Paytm, BHIM)
                        </span>

                        <p className="text-xs text-gray-500 mt-1">
                          Demo UPI payment
                        </p>

                        {paymentMethod === 'upi' && (
                          <div className="mt-4 pt-3 border-t border-gray-200 space-y-3">
                            <label className="block text-xs font-semibold text-gray-700">
                              Enter UPI ID / VPA
                            </label>

                            <input
                              type="text"
                              value={upiId}
                              onChange={(e) => setUpiId(e.target.value)}
                              placeholder="demo@okhdfcbank"
                              className="w-full px-3.5 py-2 text-sm rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#1B4332]"
                            />

                            <button
                              type="button"
                              onClick={() => setUpiId('demo@okhdfcbank')}
                              className="px-3 py-2 text-xs font-bold text-[#1B4332] bg-[#E9F3ED] rounded-lg border border-[#c4e3cf]"
                            >
                              Autofill Demo
                            </button>
                          </div>
                        )}
                      </div>
                    </label>
                  </div>

                  {/* Card */}
                  <div className={`p-4 rounded-xl border ${
                    paymentMethod === 'card'
                      ? 'border-[#1B4332] bg-[#E9F3ED]/20 ring-2 ring-[#1B4332]'
                      : 'border-gray-200'
                  }`}>
                    <label className="flex items-start gap-3 cursor-pointer">
                      <input
                        type="radio"
                        name="paymentOption"
                        checked={paymentMethod === 'card'}
                        onChange={() => setPaymentMethod('card')}
                        className="mt-1 w-4 h-4"
                      />

                      <div className="flex-1">
                        <span className="font-bold text-sm text-gray-900">
                          Credit or Debit Card
                        </span>

                        {paymentMethod === 'card' && (
                          <div className="mt-4 pt-3 border-t border-gray-200 space-y-3">

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
                                className="w-full px-3.5 py-2 text-sm rounded-lg border border-gray-300 font-mono"
                              />
                            </div>

                            <div>
                              <label className="block text-xs font-semibold text-gray-700 mb-1">
                                Name on Card
                              </label>

                              <input
                                type="text"
                                value={cardData.name}
                                onChange={(e) =>
                                  setCardData((p) => ({
                                    ...p,
                                    name: e.target.value
                                  }))
                                }
                                placeholder="Name on card"
                                className="w-full px-3 py-2 text-sm rounded-lg border border-gray-300"
                              />
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                              <div>
                                <label className="block text-xs font-semibold text-gray-700 mb-1">
                                  Expiry
                                </label>

                                <input
                                  type="text"
                                  value={cardData.expiry}
                                  onChange={handleExpiryChange}
                                  placeholder="MM/YY"
                                  maxLength={5}
                                  className="w-full px-3 py-2 text-sm rounded-lg border border-gray-300"
                                />
                              </div>

                              <div>
                                <label className="block text-xs font-semibold text-gray-700 mb-1">
                                  CVV
                                </label>

                                <input
                                  type="password"
                                  value={cardData.cvv}
                                  onChange={(e) =>
                                    setCardData((p) => ({
                                      ...p,
                                      cvv: e.target.value
                                        .replace(/\D/g, '')
                                        .slice(0, 3)
                                    }))
                                  }
                                  placeholder="•••"
                                  maxLength={3}
                                  className="w-full px-3 py-2 text-sm rounded-lg border border-gray-300"
                                />
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </label>
                  </div>

                  {/* Net Banking */}
                  <div className={`p-4 rounded-xl border ${
                    paymentMethod === 'netbanking'
                      ? 'border-[#1B4332] bg-[#E9F3ED]/20 ring-2 ring-[#1B4332]'
                      : 'border-gray-200'
                  }`}>
                    <label className="flex items-start gap-3 cursor-pointer">
                      <input
                        type="radio"
                        name="paymentOption"
                        checked={paymentMethod === 'netbanking'}
                        onChange={() => setPaymentMethod('netbanking')}
                        className="mt-1 w-4 h-4"
                      />

                      <div className="flex-1">
                        <span className="font-bold text-sm text-gray-900">
                          Net Banking
                        </span>

                        {paymentMethod === 'netbanking' && (
                          <div className="mt-4 pt-3 border-t border-gray-200">
                            <label className="block text-xs font-semibold text-gray-700 mb-2">
                              Choose Bank
                            </label>

                            <select
                              value={selectedBank}
                              onChange={(e) => setSelectedBank(e.target.value)}
                              className="w-full px-3 py-2 text-sm rounded-lg border border-gray-300"
                            >
                              {[
                                'HDFC Bank',
                                'State Bank of India',
                                'ICICI Bank',
                                'Axis Bank',
                                'Punjab National Bank',
                                'Kotak Mahindra'
                              ].map((bank) => (
                                <option key={bank} value={bank}>
                                  {bank}
                                </option>
                              ))}
                            </select>
                          </div>
                        )}
                      </div>
                    </label>
                  </div>

                  {/* COD */}
                  <div className={`p-4 rounded-xl border ${
                    paymentMethod === 'cod'
                      ? 'border-[#1B4332] bg-[#E9F3ED]/20 ring-2 ring-[#1B4332]'
                      : 'border-gray-200'
                  }`}>
                    <label className="flex items-start gap-3 cursor-pointer">
                      <input
                        type="radio"
                        name="paymentOption"
                        checked={paymentMethod === 'cod'}
                        onChange={() => setPaymentMethod('cod')}
                        className="mt-1 w-4 h-4"
                      />

                      <div>
                        <span className="font-bold text-sm text-gray-900">
                          Cash on Delivery (COD)
                        </span>

                        <p className="text-xs text-gray-500 mt-1">
                          Pay at doorstep
                        </p>
                      </div>
                    </label>
                  </div>

                </div>
              )}
            </div>
          </div>

          {/* RIGHT SUMMARY */}
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
                    {pricing.deliveryFee === 0
                      ? 'FREE'
                      : formatCurrency(pricing.deliveryFee)}
                  </span>
                </div>

                <div className="pt-3 border-t border-gray-200 flex justify-between items-baseline font-bold text-base text-gray-900">
                  <span>Order Total</span>

                  <span className="text-2xl text-[#012D1D]">
                    {formatCurrency(pricing.total)}
                  </span>
                </div>
              </div>

              {/* Address Snapshot */}
              {selectedAddress && (
                <div className="p-3 bg-gray-50 rounded-xl border border-gray-200 text-xs">
                  <div className="font-bold text-gray-900 mb-1">
                    Shipping To:
                  </div>

                  <p className="text-gray-700 font-medium">
                    {selectedAddress.name}
                  </p>

                  <p className="text-gray-500">
                    {selectedAddress.house}, {selectedAddress.city} – {selectedAddress.pincode}
                  </p>
                </div>
              )}

              {/* Place Order */}
              <button
                type="button"
                onClick={handlePlaceOrder}
                disabled={
                  isPlacingOrder ||
                  !selectedAddress ||
                  checkoutItems.length === 0
                }
                className="w-full py-4 rounded-xl bg-[#012D1D] hover:bg-[#1B4332] text-white font-bold text-sm shadow-lg transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isPlacingOrder ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Processing Order...
                  </>
                ) : (
                  <>
                    Place Your Order
                    <ChevronRight className="w-4 h-4" />
                  </>
                )}
              </button>

              <div className="text-center space-y-1">
                <p className="text-[11px] text-gray-500 flex items-center justify-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  Demo Purchase • No Financial Obligation
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

      {/* Address Modal */}
      <AddressModal
        isOpen={addressModalOpen}
        onClose={() => setAddressModalOpen(false)}
        initialData={editingAddress}
        customerId={customer?.id}
        onSaved={(savedAddr) => {
          loadAddresses();

          if (savedAddr?.id) {
            setSelectedAddressId(savedAddr.id);
          }
        }}
      />
    </div>
  );
}
