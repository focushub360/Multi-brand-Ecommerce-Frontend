
import React, { useState, useEffect, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Package,
  Search,
  ChevronRight,
  RotateCcw,
  Clock,
  Truck,
  CheckCircle2,
  XCircle,
  AlertCircle
} from 'lucide-react';

import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import { getStoredCustomer } from '../../utils/auth';
import { useCart } from '../../hooks/useCart';
import {
  getCustomerOrders,
  cancelOrder,
  formatCurrency,
  formatOrderDate
} from '../../services/orderService';

export default function OrdersPage() {
  const navigate = useNavigate();
  const customer = getStoredCustomer();
  const { addToCart } = useCart();

  const [orders, setOrders] = useState([]);
  const [activeTab, setActiveTab] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [cancelModalOrder, setCancelModalOrder] = useState(null);
  const [cancelReason, setCancelReason] = useState(
    'Found a better price elsewhere'
  );

  const loadOrders = () => {
    if (!customer?.id) return;

    const list = getCustomerOrders(customer.id);
    setOrders(list);
  };

  useEffect(() => {
    loadOrders();

    const handleUpdate = () => loadOrders();

    window.addEventListener('grove_orders_updated', handleUpdate);

    return () => {
      window.removeEventListener('grove_orders_updated', handleUpdate);
    };
  }, [customer?.id]);

  const tabs = [
    'All',
    'Processing',
    'Shipped',
    'Delivered',
    'Cancelled'
  ];

  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      if (activeTab !== 'All') {
        if (order.status.toLowerCase() !== activeTab.toLowerCase()) {
          return false;
        }
      }

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();

        const matchesId = (order.orderId || '')
          .toLowerCase()
          .includes(q);

        const matchesItem = (order.items || []).some((item) =>
          (item.name || '').toLowerCase().includes(q)
        );

        return matchesId || matchesItem;
      }

      return true;
    });
  }, [orders, activeTab, searchQuery]);

  const handleBuyAgain = (order) => {
    if (!order.items || order.items.length === 0) return;

    order.items.forEach((item) => {
      addToCart(item, item.quantity || 1);
    });

    navigate('/cart');
  };

  const handleConfirmCancel = () => {
    if (!cancelModalOrder || !customer?.id) return;

    try {
      cancelOrder(
        customer.id,
        cancelModalOrder.orderId,
        cancelReason
      );

      setCancelModalOrder(null);
      loadOrders();
    } catch (err) {
      alert(err.message || 'Failed to cancel order.');
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Delivered':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">
            <CheckCircle2 className="w-3.5 h-3.5" />
            Delivered
          </span>
        );

      case 'Shipped':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-800">
            <Truck className="w-3.5 h-3.5" />
            In Transit / Shipped
          </span>
        );

      case 'Processing':
      case 'Confirmed':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800">
            <Clock className="w-3.5 h-3.5" />
            Order Processing
          </span>
        );

      case 'Cancelled':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-rose-100 text-rose-800">
            <XCircle className="w-3.5 h-3.5" />
            Cancelled
          </span>
        );

      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-gray-100 text-gray-800">
            {status}
          </span>
        );
    }
  };

  return (
    <div className="min-h-screen bg-[#F3FCF3]/40 flex flex-col">
      <div className="border-b border-neutral-200/70 bg-white/80 backdrop-blur-xs sticky top-0 z-30">
        <Navbar darkText={true} />
      </div>

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">

        {/* Header and Search */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between pb-6 border-b border-gray-200 gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight flex items-center gap-2.5">
              <span>My Orders</span>

              <span className="text-sm font-semibold px-2.5 py-0.5 rounded-full bg-[#E9F3ED] text-[#1B4332] border border-[#c4e3cf]">
                {orders.length} Total
              </span>
            </h1>

            <p className="text-sm text-gray-500 mt-1">
              Track deliveries, review past orders, and buy products again
            </p>
          </div>

          <div className="relative w-full md:w-80">
            <Search className="absolute left-3.5 top-3 w-4 h-4 text-gray-400" />

            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by order ID or item..."
              className="w-full pl-10 pr-4 py-2.5 text-xs bg-white rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#1B4332]"
            />
          </div>
        </div>

        {/* Status Filter Tabs */}
        <div className="my-6 flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                activeTab === tab
                  ? 'bg-[#012D1D] text-white shadow-sm'
                  : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              {tab === 'All' ? 'All Orders' : tab}
            </button>
          ))}
        </div>

        {/* Orders List */}
        {filteredOrders.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center my-8 shadow-sm max-w-xl mx-auto">
            <Package className="w-12 h-12 text-gray-300 mx-auto mb-3" />

            <h3 className="text-base font-bold text-gray-900 mb-1">
              {searchQuery
                ? 'No matching orders found'
                : 'No orders in this status'}
            </h3>

            <p className="text-xs text-gray-500 mb-6">
              {searchQuery
                ? 'Try adjusting your search keyword.'
                : 'Browse groceries, agricultural supplies, electronics, and automotive parts.'}
            </p>

            <Link
              to="/groceries"
              className="inline-flex px-5 py-2.5 bg-[#012D1D] text-white text-xs font-bold rounded-xl hover:bg-[#1B4332] shadow-sm"
            >
              Explore Products
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {filteredOrders.map((order) => {
              const canCancel =
                order.status === 'Processing' ||
                order.status === 'Confirmed';

              return (
                <div
                  key={order.orderId}
                  className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden hover:shadow-md transition-shadow"
                >
                  {/* Card Header */}
                  <div className="bg-gray-50/80 px-6 py-4 border-b border-gray-200 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
                    <div>
                      <span className="text-gray-400 uppercase tracking-wider block text-[10px] font-semibold">
                        Order Placed
                      </span>

                      <span className="font-bold text-gray-800">
                        {formatOrderDate(order.createdAt)}
                      </span>
                    </div>

                    <div>
                      <span className="text-gray-400 uppercase tracking-wider block text-[10px] font-semibold">
                        Total Amount
                      </span>

                      <span className="font-bold text-gray-900">
                        {formatCurrency(order.pricing?.total)}
                      </span>
                    </div>

                    <div className="hidden sm:block">
                      <span className="text-gray-400 uppercase tracking-wider block text-[10px] font-semibold">
                        Ship To
                      </span>

                      <span className="font-bold text-gray-800 truncate block">
                        {order.shippingAddress?.name || 'Customer'}
                      </span>
                    </div>

                    <div className="text-right flex flex-col items-end">
                      <span className="text-gray-400 uppercase tracking-wider block text-[10px] font-semibold">
                        Order #
                      </span>

                      <span className="font-mono font-bold text-[#1B4332]">
                        {order.orderId}
                      </span>
                    </div>
                  </div>

                  {/* Card Body */}
                  <div className="p-6">

                    {/* Status and Delivery */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-gray-100 gap-3">
                      <div className="flex items-center gap-3">
                        {getStatusBadge(order.status)}

                        <span className="text-xs text-gray-600 font-medium">
                          {order.status === 'Delivered'
                            ? `Delivered on ${formatOrderDate(
                                order.deliveredAt || order.estimatedDelivery
                              )}`
                            : order.status === 'Cancelled'
                            ? `Cancelled on ${formatOrderDate(
                                order.cancelledAt || order.createdAt
                              )}`
                            : `Expected by ${formatOrderDate(
                                order.estimatedDelivery
                              )}`}
                        </span>
                      </div>

                      {order.trackingNumber &&
                        order.status !== 'Cancelled' && (
                          <div className="text-xs text-gray-500">
                            Tracking No:{' '}
                            <span className="font-mono font-semibold text-gray-700">
                              {order.trackingNumber}
                            </span>
                          </div>
                        )}
                    </div>

                    {/* Order Items */}
                    <div className="py-4 space-y-4">
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
                            className="flex items-center gap-4"
                          >
                            <div className="w-16 h-16 rounded-xl bg-gray-50 border border-gray-100 p-2 flex items-center justify-center flex-shrink-0">
                              <img
                                src={item.image}
                                alt={item.name}
                                onError={(e) => {
                                  e.target.src = '/images/prod-tractor.png';
                                }}
                                className="max-h-full max-w-full object-contain"
                              />
                            </div>

                            <div className="flex-1 min-w-0">
                              <span className="text-[10px] font-semibold text-[#1B4332] uppercase">
                                {item.category}
                              </span>

                              <Link
                                to={detailPath}
                                className="block font-bold text-sm text-gray-900 hover:text-[#1B4332] transition-colors truncate"
                              >
                                {item.name}
                              </Link>

                              <p className="text-xs text-gray-500">
                                Quantity:{' '}
                                <span className="font-semibold text-gray-800">
                                  {item.quantity}
                                </span>
                                {' '}• Seller: {item.dealerName}
                              </p>
                            </div>

                            <div className="text-right flex-shrink-0">
                              <span className="font-bold text-sm text-gray-900">
                                {formatCurrency(
                                  item.subtotal || item.price * item.quantity
                                )}
                              </span>
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {/* Actions */}
                    <div className="pt-4 border-t border-gray-100 flex flex-wrap items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <button
                          type="button"
                          onClick={() => handleBuyAgain(order)}
                          className="px-4 py-2 rounded-xl bg-[#E9F3ED] hover:bg-[#d8ecdf] text-[#012D1D] text-xs font-bold transition-colors flex items-center gap-1.5 border border-[#c4e3cf]"
                        >
                          <RotateCcw className="w-3.5 h-3.5" />
                          <span>Buy Again</span>
                        </button>

                        {canCancel && (
                          <button
                            type="button"
                            onClick={() => setCancelModalOrder(order)}
                            className="px-4 py-2 rounded-xl border border-red-200 text-red-600 hover:bg-red-50 text-xs font-semibold transition-colors"
                          >
                            Cancel Order
                          </button>
                        )}
                      </div>

                      <Link
                        to={`/account/orders/${order.orderId}`}
                        className="px-5 py-2 rounded-xl bg-[#012D1D] hover:bg-[#1B4332] text-white text-xs font-bold transition-colors shadow-sm flex items-center gap-1.5"
                      >
                        <span>View Order Details</span>
                        <ChevronRight className="w-4 h-4" />
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      <Footer />

      {/* Cancel Order Modal */}
      {cancelModalOrder && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center gap-3 text-red-600">
              <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center">
                <AlertCircle className="w-6 h-6" />
              </div>

              <div>
                <h3 className="text-base font-bold text-gray-900">
                  Cancel Order #{cancelModalOrder.orderId}?
                </h3>

                <p className="text-xs text-gray-500">
                  This action will stop fulfillment and reverse payment status.
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
                <option value="Found a better price elsewhere">
                  Found a better price elsewhere
                </option>

                <option value="Ordered by mistake / duplicate order">
                  Ordered by mistake / duplicate order
                </option>

                <option value="Need to change delivery address or phone">
                  Need to change delivery address or phone
                </option>

                <option value="Delivery time is too long">
                  Delivery time is too long
                </option>

                <option value="Other / Changed my mind">
                  Other / Changed my mind
                </option>
              </select>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setCancelModalOrder(null)}
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
