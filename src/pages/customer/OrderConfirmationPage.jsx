import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  CheckCircle2, 
  Package, 
  MapPin, 
  CreditCard, 
  Calendar, 
  ArrowRight, 
  ShoppingBag, 
  Truck, 
  ShieldCheck, 
  Clock 
} from 'lucide-react';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import { getStoredCustomer } from '../../utils/auth';
import { getOrderById, formatCurrency, formatOrderDate } from '../../services/orderService';

export default function OrderConfirmationPage() {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const customer = getStoredCustomer();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!customer?.id || !orderId) {
      setLoading(false);
      return;
    }
    const found = getOrderById(customer.id, orderId);
    setOrder(found);
    setLoading(false);
  }, [customer?.id, orderId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F3FCF3]/40 flex flex-col">
        <div className="border-b border-neutral-200/70 bg-white/80 backdrop-blur-xs sticky top-0 z-30">
          <Navbar darkText={true} />
        </div>
        <div className="flex-1 flex items-center justify-center p-8">
          <div className="w-8 h-8 border-4 border-[#1B4332] border-t-transparent rounded-full animate-spin" />
        </div>
        <Footer />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-[#F3FCF3]/40 flex flex-col">
        <div className="border-b border-neutral-200/70 bg-white/80 backdrop-blur-xs sticky top-0 z-30">
          <Navbar darkText={true} />
        </div>
        <main className="flex-1 max-w-2xl mx-auto w-full px-4 py-16 text-center">
          <div className="bg-white rounded-2xl border border-gray-200 p-8 shadow-sm">
            <h2 className="text-xl font-bold text-gray-900 mb-2">Order Not Found</h2>
            <p className="text-sm text-gray-500 mb-6">
              We couldn't locate details for order ID <strong>{orderId}</strong>.
            </p>
            <div className="flex justify-center gap-3">
              <Link
                to="/account/orders"
                className="px-5 py-2.5 rounded-xl bg-[#012D1D] text-white text-xs font-bold hover:bg-[#1B4332]"
              >
                View My Orders
              </Link>
              <Link
                to="/"
                className="px-5 py-2.5 rounded-xl bg-gray-100 text-gray-700 text-xs font-bold hover:bg-gray-200"
              >
                Return to Store
              </Link>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F3FCF3]/40 flex flex-col">
      <div className="border-b border-neutral-200/70 bg-white/80 backdrop-blur-xs sticky top-0 z-30">
        <Navbar darkText={true} />
      </div>

      <main className="flex-1 max-w-4xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Success Card Header */}
        <div className="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden mb-8">
          <div className="bg-gradient-to-r from-[#012D1D] to-[#1B4332] p-8 text-center text-white">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 border-2 border-emerald-400 flex items-center justify-center mx-auto mb-4 animate-bounce">
              <CheckCircle2 className="w-10 h-10 text-emerald-300" />
            </div>
            <span className="text-xs uppercase font-extrabold tracking-widest text-emerald-300 bg-white/10 px-3 py-1 rounded-full">
              Order Confirmed
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold mt-3 tracking-tight">
              Thank You, {customer?.name || 'Valued Customer'}!
            </h1>
            <p className="text-sm text-green-100 mt-2 max-w-md mx-auto">
              Your order has been verified and registered with our dealer network. A confirmation email has been simulated.
            </p>

            <div className="mt-6 inline-flex flex-wrap items-center justify-center gap-2 sm:gap-4 bg-white/10 backdrop-blur-md px-4 py-2.5 rounded-2xl text-xs">
              <span>Order ID: <strong className="text-white font-mono text-sm">{order.orderId}</strong></span>
              <span className="text-emerald-400">•</span>
              <span>Tracking No: <strong className="text-white font-mono">{order.trackingNumber}</strong></span>
            </div>
          </div>

          {/* Delivery & Timeline Estimate Strip */}
          <div className="p-6 bg-emerald-50/50 border-b border-gray-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#E9F3ED] flex items-center justify-center text-[#1B4332]">
                <Truck className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs text-gray-500 uppercase font-semibold">Estimated Delivery</span>
                <p className="text-sm font-bold text-gray-900">
                  Arriving by {formatOrderDate(order.estimatedDelivery)}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#E9F3ED] flex items-center justify-center text-[#1B4332]">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs text-gray-500 uppercase font-semibold">Current Status</span>
                <p className="text-sm font-bold text-[#1B4332] flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-600 animate-ping" />
                  {order.status}
                </p>
              </div>
            </div>
          </div>

          {/* Order Details Body */}
          <div className="p-6 sm:p-8 space-y-6">

            {/* Ordered Items List */}
            <div>
              <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-4">
                Items In This Order ({order.items?.length || 0})
              </h3>
              <div className="divide-y divide-gray-100 border border-gray-200 rounded-2xl overflow-hidden bg-white">
                {order.items?.map((item) => (
                  <div key={item.id} className="p-4 flex items-center justify-between gap-4 hover:bg-gray-50/50">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 rounded-xl bg-gray-50 border border-gray-100 p-2 flex items-center justify-center flex-shrink-0">
                        <img
                          src={item.image}
                          alt={item.name}
                          onError={(e) => { e.target.src = '/images/prod-tractor.png'; }}
                          className="max-h-full max-w-full object-contain"
                        />
                      </div>
                      <div>
                        <span className="text-[10px] font-semibold text-[#1B4332] uppercase">
                          {item.category}
                        </span>
                        <h4 className="text-sm font-bold text-gray-900">
                          {item.name}
                        </h4>
                        <p className="text-xs text-gray-500">
                          Qty: <span className="font-semibold text-gray-800">{item.quantity}</span> • Seller: {item.dealerName}
                        </p>
                      </div>
                    </div>

                    <div className="text-right flex-shrink-0">
                      <div className="text-sm font-bold text-gray-900">
                        {formatCurrency(item.subtotal || item.price * item.quantity)}
                      </div>
                      <div className="text-[11px] text-gray-400">
                        {formatCurrency(item.price)} each
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Shipping & Payment Summary Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              {/* Shipping Address */}
              <div className="p-5 rounded-2xl border border-gray-200 bg-gray-50/50">
                <div className="flex items-center gap-2 mb-2 text-xs font-bold uppercase tracking-wider text-gray-500">
                  <MapPin className="w-4 h-4 text-[#1B4332]" />
                  <span>Delivery Address</span>
                </div>
                <p className="font-bold text-sm text-gray-900">{order.shippingAddress.name}</p>
                <p className="text-xs text-gray-600 mt-1 leading-relaxed">
                  {order.shippingAddress.house}, {order.shippingAddress.street}
                  {order.shippingAddress.landmark ? `, ${order.shippingAddress.landmark}` : ''}
                  <br />
                  {order.shippingAddress.city}, {order.shippingAddress.state} – {order.shippingAddress.pincode}
                </p>
                <p className="text-xs text-gray-500 mt-2">
                  Phone: <span className="font-medium text-gray-800">+91 {order.shippingAddress.mobile}</span>
                </p>
              </div>

              {/* Payment Details */}
              <div className="p-5 rounded-2xl border border-gray-200 bg-gray-50/50 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-2 text-xs font-bold uppercase tracking-wider text-gray-500">
                    <CreditCard className="w-4 h-4 text-[#1B4332]" />
                    <span>Payment Information</span>
                  </div>
                  <p className="font-bold text-sm text-gray-900">{order.payment.methodLabel}</p>
                  <p className="text-xs text-gray-600 mt-1">
                    Status: <span className="font-semibold text-emerald-700">{order.payment.status}</span>
                  </p>
                  {order.payment.upiId && (
                    <p className="text-xs text-gray-500 mt-0.5">UPI ID: {order.payment.upiId}</p>
                  )}
                  {order.payment.last4 && (
                    <p className="text-xs text-gray-500 mt-0.5">Card ending in •••• {order.payment.last4}</p>
                  )}
                  <p className="text-xs font-mono text-gray-400 mt-1 truncate">
                    Ref: {order.payment.transactionId}
                  </p>
                </div>

                <div className="pt-3 mt-3 border-t border-gray-200 flex justify-between items-baseline font-bold">
                  <span className="text-xs uppercase text-gray-500">Total Paid</span>
                  <span className="text-lg text-[#012D1D]">{formatCurrency(order.pricing.total)}</span>
                </div>
              </div>

            </div>

            {/* Quick Actions */}
            <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-gray-100">
              <Link
                to={`/account/orders/${order.orderId}`}
                className="w-full sm:w-auto px-6 py-3 rounded-xl bg-[#012D1D] hover:bg-[#1B4332] text-white text-xs font-bold transition-colors shadow-sm flex items-center justify-center gap-2"
              >
                <span>Track & Manage Order</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <div className="flex items-center gap-3 w-full sm:w-auto">
                <Link
                  to="/account/orders"
                  className="flex-1 sm:flex-initial px-5 py-3 rounded-xl border border-gray-300 text-gray-700 hover:bg-gray-50 text-xs font-bold text-center transition-colors"
                >
                  My Orders History
                </Link>
                <Link
                  to="/"
                  className="flex-1 sm:flex-initial px-5 py-3 rounded-xl bg-[#E9F3ED] hover:bg-[#d8ecdf] text-[#012D1D] text-xs font-bold text-center transition-colors"
                >
                  Continue Shopping
                </Link>
              </div>
            </div>

          </div>
        </div>

      </main>

      <Footer />
    </div>
  );
}

