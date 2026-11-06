
import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Package,
  MapPin,
  CreditCard,
  CheckCircle2,
  XCircle,
  RotateCcw,
  FileText,
  HelpCircle,
  AlertCircle
} from 'lucide-react';

import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import { getStoredCustomer } from '../../utils/auth';
import { useCart } from '../../hooks/useCart';

import {
  getOrderById,
  cancelOrder,
  formatCurrency,
  formatOrderDate
} from '../../services/orderService';

export default function OrderDetailsPage() {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const customer = getStoredCustomer();
  const { addToCart } = useCart();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [cancelModalOpen, setCancelModalOpen] = useState(false);
  const [cancelReason, setCancelReason] = useState(
    'Change in farming requirement'
  );
  const [feedback, setFeedback] = useState('');

  const loadOrder = () => {
    if (!customer?.id || !orderId) {
      setLoading(false);
      return;
    }

    const found = getOrderById(customer.id, orderId);
    setOrder(found);
    setLoading(false);
  };

  useEffect(() => {
    loadOrder();
  }, [customer?.id, orderId]);

  const handleBuyAgain = (item) => {
    addToCart(item, item.quantity || 1);
    setFeedback(`"${item.name}" added to your cart.`);
    setTimeout(() => setFeedback(''), 3000);
  };

  const handleReorderAll = () => {
    if (!order?.items) return;

    order.items.forEach((item) => {
      addToCart(item, item.quantity || 1);
    });

    navigate('/cart');
  };

  const handleConfirmCancel = () => {
    if (!order || !customer?.id) return;

    try {
      const res = cancelOrder(
        customer.id,
        order.orderId,
        cancelReason
      );

      if (res.success) {
        setCancelModalOpen(false);
        loadOrder();
        setFeedback('Your order has been cancelled successfully.');
        setTimeout(() => setFeedback(''), 4000);
      }
    } catch (err) {
      alert(err.message || 'Failed to cancel order.');
    }
  };

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
            <h2 className="text-xl font-bold text-gray-900 mb-2">
              Order Not Found
            </h2>

            <p className="text-sm text-gray-500 mb-6">
              The requested order <strong>{orderId}</strong> was not found in your account records.
            </p>

            <Link
              to="/account/orders"
              className="px-5 py-2.5 rounded-xl bg-[#012D1D] text-white text-xs font-bold hover:bg-[#1B4332]"
            >
              Back to My Orders
            </Link>
          </div>
        </main>

        <Footer />
      </div>
    );
  }

  const canCancel =
    order.status !== 'Delivered' &&
    order.status !== 'Cancelled';

  const standardSteps = [
    'Order Placed',
    'Confirmed',
    'Packed',
    'Shipped',
    'Out for Delivery',
    'Delivered'
  ];

  const currentStepIndex =
    order.status === 'Cancelled'
      ? -1
      : standardSteps.findIndex(
          (step) =>
            step.toLowerCase() === order.status.toLowerCase()
        );

  return (
    <div className="min-h-screen bg-[#F3FCF3]/40 flex flex-col">
      <div className="border-b border-neutral-200/70 bg-white/80 backdrop-blur-xs sticky top-0 z-30">
        <Navbar darkText={true} />
      </div>

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">

        {feedback && (
          <div className="mb-6 p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm font-medium flex items-center justify-between shadow-sm animate-fadeIn">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
              <span>{feedback}</span>
            </div>

            <Link
              to="/cart"
              className="text-xs font-bold text-[#1B4332] underline"
            >
              Go to Cart →
            </Link>
          </div>
        )}

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-6 border-b border-gray-200 gap-4">
          <div className="flex items-center gap-3">
            <Link
              to="/account/orders"
              className="p-2 rounded-xl bg-white border border-gray-200 text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-colors"
              title="Back to Orders"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>

            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold text-gray-900">
                  Order #{order.orderId}
                </h1>

                <span
                  className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${
                    order.status === 'Delivered'
                      ? 'bg-emerald-100 text-emerald-800'
                      : order.status === 'Cancelled'
                      ? 'bg-rose-100 text-rose-800'
                      : order.status === 'Shipped'
                      ? 'bg-blue-100 text-blue-800'
                      : 'bg-amber-100 text-amber-800'
                  }`}
                >
                  {order.status}
                </span>
              </div>

              <p className="text-xs text-gray-500 mt-0.5">
                Placed on {formatOrderDate(order.createdAt, true)}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 self-start sm:self-auto">
            <button
              type="button"
              onClick={() => window.print()}
              className="px-4 py-2 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 text-xs font-semibold rounded-xl transition-colors flex items-center gap-1.5 shadow-sm"
            >
              <FileText className="w-4 h-4 text-gray-500" />
              <span>Print Invoice</span>
            </button>

            {canCancel && (
              <button
                type="button"
                onClick={() => setCancelModalOpen(true)}
                className="px-4 py-2 border border-red-200 text-red-600 hover:bg-red-50 text-xs font-semibold rounded-xl transition-colors"
              >
                Cancel Order
              </button>
            )}
          </div>
        </div>

        <div className="my-8 bg-white rounded-2xl border border-gray-200 shadow-sm p-6 sm:p-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-gray-100 gap-3">
            <div>
              <h2 className="text-sm font-bold uppercase tracking-wider text-gray-500">
                Delivery Tracker
              </h2>

              <p className="text-base font-extrabold text-gray-900 mt-1">
                {order.status === 'Delivered' ? (
                  <span className="text-emerald-700">
                    Delivered on{' '}
                    {formatOrderDate(
                      order.deliveredAt || order.estimatedDelivery
                    )}
                  </span>
                ) : order.status === 'Cancelled' ? (
                  <span className="text-rose-600">
                    Order Cancelled
                  </span>
                ) : (
                  <span>
                    Expected Delivery:{' '}
                    {formatOrderDate(order.estimatedDelivery)}
                  </span>
                )}
              </p>
            </div>

            {order.trackingNumber && order.status !== 'Cancelled' && (
              <div className="text-left sm:text-right">
                <span className="text-xs text-gray-400 block font-medium">
                  Logistics Partner / AWB
                </span>

                <span className="font-mono text-xs font-bold text-[#1B4332] bg-[#E9F3ED] px-2 py-0.5 rounded">
                  {order.trackingNumber}
                </span>
              </div>
            )}
          </div>

          {order.status !== 'Cancelled' ? (
            <div className="pt-6">
              <div className="grid grid-cols-2 sm:grid-cols-6 gap-3 relative">
                {standardSteps.map((stepName, idx) => {
                  const isDone = idx <= currentStepIndex;
                  const isCurrent = idx === currentStepIndex;

                  return (
                    <div
                      key={stepName}
                      className="flex flex-col items-center text-center"
                    >
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs mb-2 transition-all ${
                          isDone
                            ? 'bg-[#1B4332] text-white ring-4 ring-[#E9F3ED]'
                            : 'bg-gray-100 text-gray-400 border border-gray-200'
                        }`}
                      >
                        {isDone ? (
                          <CheckCircle2 className="w-4 h-4" />
                        ) : (
                          idx + 1
                        )}
                      </div>

                      <span
                        className={`text-xs font-bold ${
                          isCurrent
                            ? 'text-[#012D1D]'
                            : isDone
                            ? 'text-gray-800'
                            : 'text-gray-400'
                        }`}
                      >
                        {stepName}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="pt-6 p-4 rounded-xl bg-red-50 border border-red-200 text-red-800 text-xs flex items-center gap-3">
              <XCircle className="w-5 h-5 flex-shrink-0 text-red-600" />

              <div>
                <p className="font-bold">
                  Order was cancelled on{' '}
                  {formatOrderDate(order.cancelledAt, true)}
                </p>

                <p className="text-red-700 mt-0.5">
                  Reason: {order.cancelReason || 'Cancelled by customer.'}
                </p>
              </div>
            </div>
          )}

          {order.timeline && order.timeline.length > 0 && (
            <div className="mt-8 pt-6 border-t border-gray-100">
              <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-4">
                Shipment Activity History
              </h3>

              <div className="space-y-4">
                {order.timeline.map((event, i) => (
                  <div
                    key={i}
                    className="flex items-start gap-3 text-xs"
                  >
                    <div className="w-2 h-2 rounded-full bg-[#1B4332] mt-1.5 flex-shrink-0" />

                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-gray-900">
                          {event.title || event.status}
                        </span>

                        <span className="text-[11px] text-gray-400">
                          • {formatOrderDate(event.timestamp, true)}
                        </span>
                      </div>

                      {event.note && (
                        <p className="text-gray-500 mt-0.5 leading-relaxed">
                          {event.note}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-8 space-y-6">
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
              <div className="flex items-center justify-between pb-4 border-b border-gray-100">
                <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500">
                  Ordered Items ({order.items?.length || 0})
                </h3>

                <button
                  type="button"
                  onClick={handleReorderAll}
                  className="text-xs font-bold text-[#1B4332] hover:text-[#012D1D] flex items-center gap-1.5 hover:underline"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reorder All Items</span>
                </button>
              </div>

              <div className="divide-y divide-gray-100">
                {order.items?.map((item) => {
                  const cat = (item.category || '').toLowerCase();
                  const idStr = String(item.id || '').toLowerCase();

                  const detailPath =
                    cat.includes('grocer') || idStr.startsWith('gr-')
                      ? `/groceries/product/${item.id}`
                      : cat.includes('elect') || idStr.startsWith('el-')
                      ? `/electronics/product/${item.id}`
                      : cat.includes('auto') || idStr.startsWith('au-')
                      ? `/automotive/product/${item.id}`
                      : `/agriculture/product/${item.id}`;

                  return (
                    <div
                      key={item.id}
                      className="py-5 first:pt-4 last:pb-0 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                    >
                      <div className="flex items-start gap-4">
                        <div className="w-20 h-20 rounded-xl bg-gray-50 border border-gray-100 p-2 flex items-center justify-center flex-shrink-0">
                          <img
                            src={item.image}
                            alt={item.name}
                            onError={(e) => {
                              e.target.src = '/images/prod-tractor.png';
                            }}
                            className="max-h-full max-w-full object-contain"
                          />
                        </div>

                        <div>
                          <span className="text-[10px] font-bold text-[#1B4332] uppercase tracking-wider">
                            {item.category}
                          </span>

                          <Link
                            to={detailPath}
                            className="block font-bold text-sm text-gray-900 hover:text-[#1B4332] transition-colors mt-0.5 line-clamp-2"
                          >
                            {item.name}
                          </Link>

                          <p className="text-xs text-gray-500 mt-1">
                            Sold by:{' '}
                            <span className="font-medium text-gray-700">
                              {item.dealerName}
                            </span>
                          </p>

                          <p className="text-xs text-gray-600 mt-1 font-semibold">
                            Qty: {item.quantity} × {formatCurrency(item.price)}
                          </p>
                        </div>
                      </div>

                      <div className="flex sm:flex-col items-center sm:items-end justify-between gap-2 border-t sm:border-t-0 pt-3 sm:pt-0">
                        <div className="text-sm font-bold text-gray-900">
                          {formatCurrency(
                            item.subtotal || item.price * item.quantity
                          )}
                        </div>

                        <button
                          type="button"
                          onClick={() => handleBuyAgain(item)}
                          className="px-3 py-1.5 rounded-lg bg-[#E9F3ED] hover:bg-[#d8ecdf] text-[#012D1D] text-xs font-bold transition-colors flex items-center gap-1 border border-[#c4e3cf]"
                        >
                          <RotateCcw className="w-3 h-3" />
                          <span>Buy Again</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
              <div className="flex items-center gap-2 mb-3 text-xs font-bold uppercase tracking-wider text-gray-500">
                <MapPin className="w-4 h-4 text-[#1B4332]" />
                <span>Shipping Address</span>
              </div>

              <div className="text-xs space-y-1 text-gray-600">
                <p className="font-bold text-sm text-gray-900">
                  {order.shippingAddress?.name}
                </p>

                <p>
                  {order.shippingAddress?.house},{' '}
                  {order.shippingAddress?.street}
                </p>

                {order.shippingAddress?.landmark && (
                  <p>Landmark: {order.shippingAddress.landmark}</p>
                )}

                <p>
                  {order.shippingAddress?.city},{' '}
                  {order.shippingAddress?.state} –{' '}
                  <span className="font-semibold text-gray-900">
                    {order.shippingAddress?.pincode}
                  </span>
                </p>

                <p className="pt-2 text-gray-500">
                  Contact:{' '}
                  <span className="font-semibold text-gray-800">
                    +91 {order.shippingAddress?.mobile}
                  </span>
                </p>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 space-y-4">
              <div className="flex items-center gap-2 pb-3 border-b border-gray-100 text-xs font-bold uppercase tracking-wider text-gray-500">
                <CreditCard className="w-4 h-4 text-[#1B4332]" />
                <span>Payment & Cost Breakdown</span>
              </div>

              <div className="text-xs space-y-2 text-gray-600 pb-3 border-b border-gray-100">
                <div className="flex justify-between">
                  <span>Method</span>

                  <span className="font-semibold text-gray-800">
                    {order.payment?.methodLabel}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span>Payment Status</span>

                  <span
                    className={`font-semibold ${
                      order.payment?.status?.includes('Completed')
                        ? 'text-emerald-700'
                        : 'text-amber-700'
                    }`}
                  >
                    {order.payment?.status}
                  </span>
                </div>

                {order.payment?.transactionId && (
                  <div className="flex justify-between font-mono text-[11px]">
                    <span>Reference ID</span>

                    <span className="text-gray-500">
                      {order.payment.transactionId}
                    </span>
                  </div>
                )}
              </div>

              <div className="space-y-2 text-xs">
                <div className="flex justify-between text-gray-600">
                  <span>Items Subtotal</span>
                  <span>
                    {formatCurrency(order.pricing?.itemsTotal)}
                  </span>
                </div>

                {order.pricing?.discount > 0 && (
                  <div className="flex justify-between text-emerald-600 font-medium">
                    <span>Discount</span>
                    <span>
                      − {formatCurrency(order.pricing.discount)}
                    </span>
                  </div>
                )}

                <div className="flex justify-between text-gray-600">
                  <span>Delivery Charges</span>

                  <span>
                    {order.pricing?.deliveryFee === 0 ? (
                      <span className="text-emerald-600 font-bold">
                        FREE
                      </span>
                    ) : (
                      formatCurrency(order.pricing?.deliveryFee)
                    )}
                  </span>
                </div>

                <div className="pt-3 border-t border-gray-200 flex justify-between items-baseline font-bold text-sm text-gray-900">
                  <span>Total Amount</span>

                  <span className="text-lg text-[#012D1D]">
                    {formatCurrency(order.pricing?.total)}
                  </span>
                </div>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-gray-50 border border-gray-200 text-xs text-gray-600 flex items-start gap-3">
              <HelpCircle className="w-4 h-4 text-[#1B4332] flex-shrink-0 mt-0.5" />

              <div>
                <span className="font-bold text-gray-800 block">
                  Need assistance with this order?
                </span>

                <span className="text-gray-500">
                  Contact GROVE support at support@grove.in or visit our Help Center.
                </span>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />

      {cancelModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center gap-3 text-red-600">
              <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center">
                <AlertCircle className="w-6 h-6" />
              </div>

              <div>
                <h3 className="text-base font-bold text-gray-900">
                  Cancel Order #{order.orderId}?
                </h3>

                <p className="text-xs text-gray-500">
                  Are you sure you want to stop this order dispatch?
                </p>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">
                Reason for cancellation
              </label>

              <select
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                className="w-full p-2.5 text-xs rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#1B4332]"
              >
                <option value="Change in farming requirement">
                  Change in farming requirement
                </option>

                <option value="Found a better price elsewhere">
                  Found a better price elsewhere
                </option>

                <option value="Ordered by mistake / duplicate order">
                  Ordered by mistake / duplicate order
                </option>

                <option value="Incorrect shipping address selected">
                  Incorrect shipping address selected
                </option>

                <option value="Delivery time is too long">
                  Delivery time is too long
                </option>

                <option value="Other">Other</option>
              </select>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setCancelModalOpen(false)}
                className="px-4 py-2 text-xs font-semibold text-gray-600 hover:bg-gray-100 rounded-lg"
              >
                Keep Order
              </button>

              <button
                type="button"
                onClick={handleConfirmCancel}
                className="px-4 py-2 text-xs font-bold text-white bg-red-600 hover:bg-red-700 rounded-lg shadow-sm"
              >
                Confirm Cancellation
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
