import React, { useState, useEffect, useMemo } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import AdminPageHeader from '../../components/admin/AdminPageHeader';
import {
  getAdminOrders,
  getAdminOrderKPIs,
  updateAdminOrderStatus,
  syncAdminDataFromApi
} from '../../services/adminService';
import {
  Search,
  Eye,
  CheckCircle2,
  X,
  MapPin,
  Store
} from 'lucide-react';

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [dealerFilter, setDealerFilter] = useState('All');

  // Detail Modal & Action
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [newStatus, setNewStatus] = useState('');
  const [trackingNumber, setTrackingNumber] = useState('');
  const [carrier, setCarrier] = useState('Delhivery Cargo');
  const [toastMessage, setToastMessage] = useState(null);

  const loadData = () => {
    setOrders(getAdminOrders());
  };

  useEffect(() => {
    document.title = 'Order Management | GROVE Admin';
    window.scrollTo(0, 0);
    loadData();
    syncAdminDataFromApi().then(() => {
      loadData();
    }).catch(() => {});
  }, []);

  const kpis = useMemo(() => {
    const totalCount = orders.length;
    const totalAmount = orders.reduce((sum, o) => sum + (o.amount || 0), 0);
    const placedCount = orders.filter((o) => o.orderStatus === 'Placed').length;
    const processingCount = orders.filter((o) => o.orderStatus === 'Processing').length;
    const shippedCount = orders.filter((o) => o.orderStatus === 'Shipped').length;
    const deliveredCount = orders.filter((o) => o.orderStatus === 'Delivered').length;

    return {
      totalCount,
      totalAmountFormatted: `₹${totalAmount.toLocaleString('en-IN')}`,
      placedCount,
      processingCount,
      shippedCount,
      deliveredCount
    };
  }, [orders]);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const uniqueDealers = useMemo(() => {
    return Array.from(new Set(orders.map((o) => o.dealerName).filter(Boolean)));
  }, [orders]);

  const filteredOrders = useMemo(() => {
    return orders.filter((o) => {
      const q = searchQuery.toLowerCase().trim();
      const matchSearch =
        !q ||
        o.id.toLowerCase().includes(q) ||
        (o.customer?.name && o.customer.name.toLowerCase().includes(q)) ||
        (o.customer?.city && o.customer.city.toLowerCase().includes(q)) ||
        o.dealerName.toLowerCase().includes(q);

      const matchStatus = statusFilter === 'All' || o.orderStatus === statusFilter;
      const matchDealer = dealerFilter === 'All' || o.dealerName === dealerFilter;

      return matchSearch && matchStatus && matchDealer;
    });
  }, [orders, searchQuery, statusFilter, dealerFilter]);

  const handleOpenDetail = (order) => {
    setSelectedOrder(order);
    setNewStatus(order.orderStatus);
    setTrackingNumber(order.trackingNumber || '');
    setCarrier(order.carrier || 'Delhivery Cargo');
    setIsDetailOpen(true);
  };

  const handleUpdateStatus = (e) => {
    e.preventDefault();
    if (!selectedOrder) return;
    const updated = updateAdminOrderStatus(selectedOrder.id, newStatus, trackingNumber, carrier);
    loadData();
    setSelectedOrder(updated);
    showToast(`Order #${selectedOrder.id} status updated to ${newStatus}.`);
  };

  const getStatusBadge = (st) => {
    switch (st?.toLowerCase()) {
      case 'delivered':
        return 'bg-emerald-50 text-emerald-800 border-emerald-300';
      case 'shipped':
        return 'bg-blue-50 text-blue-800 border-blue-300';
      case 'packed':
        return 'bg-teal-50 text-teal-800 border-teal-300';
      case 'processing':
        return 'bg-amber-50 text-amber-800 border-amber-300';
      case 'placed':
        return 'bg-purple-50 text-purple-800 border-purple-300';
      case 'cancelled':
        return 'bg-rose-50 text-rose-800 border-rose-300';
      default:
        return 'bg-neutral-100 text-neutral-800 border-neutral-200';
    }
  };

  return (
    <AdminLayout>
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 px-4 py-3 rounded-2xl bg-[#012D1D] text-white text-xs font-semibold shadow-xl border border-[#AEEECB]/40 animate-fadeIn">
          <CheckCircle2 className="w-4 h-4 text-[#AEEECB] shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      <AdminPageHeader
        title="Order Management"
        subtitle="Track multi-dealer agricultural machinery, parts, and seed checkouts with real-time status and escrow clearance."
        badge={`${orders.length} Platform Orders`}
        breadcrumbs={[{ label: 'Orders' }]}
      />

      {/* 1. Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3.5">
        <div className="p-4 rounded-2xl bg-white border border-[#C1C8C2]/60 shadow-2xs">
          <span className="text-[10px] font-mono uppercase font-bold text-[#717973]">Total Orders</span>
          <span className="text-2xl font-black text-[#012D1D] block mt-1">{kpis.totalCount}</span>
          <span className="text-[10px] font-mono text-emerald-700 font-bold">{kpis.totalAmountFormatted}</span>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-purple-300 shadow-2xs">
          <span className="text-[10px] font-mono uppercase font-bold text-purple-900">Placed / Unprocessed</span>
          <span className="text-2xl font-black text-purple-950 block mt-1">{kpis.placedCount}</span>
          <span className="text-[10px] font-mono text-[#717973]">Awaiting dealer pack</span>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-amber-300 shadow-2xs">
          <span className="text-[10px] font-mono uppercase font-bold text-amber-900">Processing</span>
          <span className="text-2xl font-black text-amber-950 block mt-1">{kpis.processingCount}</span>
          <span className="text-[10px] font-mono text-[#717973]">Depot assembly</span>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-blue-300 shadow-2xs">
          <span className="text-[10px] font-mono uppercase font-bold text-blue-900">In-Transit (Shipped)</span>
          <span className="text-2xl font-black text-blue-950 block mt-1">{kpis.shippedCount}</span>
          <span className="text-[10px] font-mono text-[#717973]">Carrier dispatched</span>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-emerald-300 shadow-2xs">
          <span className="text-[10px] font-mono uppercase font-bold text-emerald-800">Delivered</span>
          <span className="text-2xl font-black text-[#0E5138] block mt-1">{kpis.deliveredCount}</span>
          <span className="text-[10px] font-mono text-emerald-700 font-bold">Escrow cleared</span>
        </div>
      </div>

      {/* 2. Filters */}
      <div className="bg-white rounded-3xl border border-[#C1C8C2]/60 p-4 shadow-xs space-y-3">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-[#717973] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by order ID, buyer, city, or dealer..."
              className="w-full h-10 pl-10 pr-4 rounded-xl bg-[#F8FAF8] border border-[#C1C8C2]/60 text-xs font-medium text-[#151D18] focus:outline-none focus:border-[#012D1D]"
            />
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="h-10 px-3 rounded-xl bg-[#F8FAF8] border border-[#C1C8C2]/60 text-xs font-semibold text-[#151D18]"
            >
              <option value="All">All Statuses</option>
              <option value="Placed">Placed</option>
              <option value="Processing">Processing</option>
              <option value="Packed">Packed</option>
              <option value="Shipped">Shipped</option>
              <option value="Delivered">Delivered</option>
              <option value="Cancelled">Cancelled</option>
            </select>

            <select
              value={dealerFilter}
              onChange={(e) => setDealerFilter(e.target.value)}
              className="h-10 px-3 rounded-xl bg-[#F8FAF8] border border-[#C1C8C2]/60 text-xs font-semibold text-[#151D18]"
            >
              <option value="All">All Dealers</option>
              {uniqueDealers.map((d) => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>

            {(searchQuery || statusFilter !== 'All' || dealerFilter !== 'All') && (
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('');
                  setStatusFilter('All');
                  setDealerFilter('All');
                }}
                className="px-3 py-2 text-xs font-bold text-red-600 hover:bg-red-50 rounded-xl"
              >
                Reset
              </button>
            )}
          </div>
        </div>
      </div>

      {/* 3. Orders Table */}
      <div className="bg-white rounded-3xl border border-[#C1C8C2]/60 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-[#C1C8C2]/50 bg-[#F8FAF8] text-[#717973] font-mono uppercase text-[10px]">
                <th className="py-3 px-4 font-bold">Order ID</th>
                <th className="py-3 px-4 font-bold">Customer &amp; Location</th>
                <th className="py-3 px-4 font-bold">Fulfilling Dealer</th>
                <th className="py-3 px-4 font-bold">Placed Date</th>
                <th className="py-3 px-4 font-bold text-right">Amount</th>
                <th className="py-3 px-3 font-bold text-center">Payment</th>
                <th className="py-3 px-4 font-bold text-center">Lifecycle Status</th>
                <th className="py-3 px-4 font-bold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#C1C8C2]/30">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan="8" className="py-10 text-center text-[#717973]">
                    No orders found matching filter criteria.
                  </td>
                </tr>
              ) : (
                filteredOrders.map((ord) => (
                  <tr
                    key={ord.id}
                    onClick={() => handleOpenDetail(ord)}
                    className="hover:bg-[#F8FAF8] transition-colors cursor-pointer"
                  >
                    <td className="py-3.5 px-4 font-mono font-black text-[#012D1D]">
                      #{ord.id}
                    </td>

                    <td className="py-3.5 px-4 text-[#151D18]">
                      <div className="flex flex-col">
                        <span className="font-extrabold truncate max-w-[200px]">
                          {ord.customer?.name}
                        </span>
                        <span className="text-[11px] text-[#717973] flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-[#717973]" />
                          {ord.customer?.city}, {ord.customer?.state}
                        </span>
                      </div>
                    </td>

                    <td className="py-3.5 px-4 text-[#3F4943]">
                      <span className="font-semibold flex items-center gap-1">
                        <Store className="w-3 h-3 text-[#717973]" />
                        {ord.dealerName}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-[#717973] font-mono text-[11px]">
                      {ord.date}
                    </td>

                    <td className="py-3.5 px-4 text-right font-mono font-black text-[#012D1D]">
                      {ord.amountFormatted}
                    </td>

                    <td className="py-3.5 px-3 text-center">
                      <span className="px-2 py-0.5 rounded bg-[#F3FCF3] border border-[#C1C8C2]/50 font-mono text-[10px] text-[#0E5138]">
                        {ord.paymentMethod}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-center">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold border ${getStatusBadge(ord.orderStatus)}`}>
                        {ord.orderStatus}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                      <button
                        type="button"
                        onClick={() => handleOpenDetail(ord)}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white border border-[#C1C8C2]/60 text-xs font-bold text-[#012D1D] hover:bg-[#F3FCF3]"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Inspect</span>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order Details & Status Drawer */}
      {isDetailOpen && selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-end">
          <div className="fixed inset-0 bg-[#012D1D]/50 backdrop-blur-xs" onClick={() => setIsDetailOpen(false)} />
          <div className="relative w-full max-w-lg h-full bg-white shadow-2xl p-6 z-10 flex flex-col space-y-4 overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-[#C1C8C2]/40 shrink-0">
              <div>
                <span className="text-[10px] font-mono font-bold text-[#717973] uppercase">Order Dossier</span>
                <h3 className="font-extrabold text-base text-[#012D1D]">#{selectedOrder.id}</h3>
              </div>
              <button type="button" onClick={() => setIsDetailOpen(false)} className="p-1 rounded-xl text-[#717973]">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Buyer & Dealer Strip */}
            <div className="p-3.5 bg-[#F8FAF8] rounded-2xl border border-[#C1C8C2]/40 space-y-2 text-xs">
              <div>
                <span className="text-[10px] uppercase font-mono text-[#717973] block">Buyer Information</span>
                <span className="font-bold text-[#151D18]">{selectedOrder.customer?.name}</span>
                <p className="text-[11px] text-[#3F4943]">{selectedOrder.customer?.address}</p>
                <p className="text-[11px] font-mono text-[#717973]">{selectedOrder.customer?.email} • {selectedOrder.customer?.phone}</p>
              </div>
              <div className="pt-2 border-t border-[#C1C8C2]/30">
                <span className="text-[10px] uppercase font-mono text-[#717973] block">Fulfilling Dealer</span>
                <span className="font-bold text-[#151D18]">{selectedOrder.dealerName}</span>
              </div>
            </div>

            {/* Ordered Items */}
            <div className="space-y-2 text-xs">
              <span className="font-bold uppercase tracking-wider text-[#717973] font-mono text-[10px] block">
                Consignment Items
              </span>
              {selectedOrder.items?.map((item, idx) => (
                <div key={idx} className="p-3 rounded-xl bg-white border border-[#C1C8C2]/40 flex items-center justify-between">
                  <div>
                    <span className="font-bold text-[#151D18] block">{item.name}</span>
                    <span className="font-mono text-[10px] text-[#717973]">SKU: {item.sku} • Qty: {item.quantity}</span>
                  </div>
                  <span className="font-mono font-bold text-[#012D1D]">
                    ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                  </span>
                </div>
              ))}
              <div className="p-3 rounded-xl bg-[#F3FCF3] border border-[#AEEECB]/50 flex items-center justify-between font-bold">
                <span>Grand Total (Escrow):</span>
                <span className="font-mono text-base text-[#0E5138]">{selectedOrder.amountFormatted}</span>
              </div>
            </div>

            {/* Lifecycle Status Modification Form */}
            <form onSubmit={handleUpdateStatus} className="p-4 rounded-2xl bg-white border border-[#012D1D]/30 shadow-xs space-y-3 text-xs">
              <span className="font-bold uppercase tracking-wider text-[#012D1D] font-mono text-[11px] block">
                Admin Lifecycle State Transition
              </span>

              <div>
                <label className="block text-[11px] font-bold text-[#3F4943] mb-1">Order Status</label>
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value)}
                  className="w-full h-9 px-3 rounded-xl bg-[#F8FAF8] border border-[#C1C8C2]/60 text-xs font-semibold"
                >
                  <option value="Placed">Placed</option>
                  <option value="Processing">Processing</option>
                  <option value="Packed">Packed</option>
                  <option value="Shipped">Shipped</option>
                  <option value="Delivered">Delivered (Clear Escrow)</option>
                  <option value="Cancelled">Cancelled (Refund)</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-[#3F4943] mb-1">Carrier</label>
                <input
                  type="text"
                  value={carrier}
                  onChange={(e) => setCarrier(e.target.value)}
                  placeholder="e.g. Delhivery Cargo Express"
                  className="w-full h-9 px-3 rounded-xl bg-[#F8FAF8] border border-[#C1C8C2]/60 text-xs"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-[#3F4943] mb-1">Tracking Consignment Number</label>
                <input
                  type="text"
                  value={trackingNumber}
                  onChange={(e) => setTrackingNumber(e.target.value)}
                  placeholder="e.g. DLH-992011"
                  className="w-full h-9 px-3 rounded-xl bg-[#F8FAF8] border border-[#C1C8C2]/60 text-xs font-mono"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-[#012D1D] hover:bg-[#1B4332] text-white font-bold text-xs"
              >
                Update Order Lifecycle State
              </button>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}

